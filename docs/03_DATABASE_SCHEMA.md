# Modelo de Dados e Schema PostgreSQL/PostGIS

## SisInfo / GeoIntel — V2

**Versão:** 2.0  
**Data:** Janeiro 2027

---

## 1. Diagrama ER (Entity-Relationship)

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    
    ESTADOS ||--o{ MUNICIPIOS : contains
    REGIOES ||--o{ ESTADOS : contains
    
    MUNICIPIOS ||--o{ INDICADOR_VALORES : has
    INDICADORES ||--o{ INDICADOR_VALORES : measures
    
    DATASETS ||--o{ DATASET_INDICADORES : provides
    INDICADORES ||--o{ DATASET_INDICADORES : belongs_to
    
    MUNICIPIOS ||--o{ MUNICIPIO_GEOMETRIAS : has_geometry
    
    USERS ||--o{ AUDIT_LOG : performs
    
    REGIOES {
        varchar sigla PK "N, NE, SE, S, CO"
        varchar nome "Norte, Nordeste, etc."
    }
    
    ESTADOS {
        varchar sigla PK "SP, RJ, MG, etc."
        varchar nome "São Paulo, Rio de Janeiro"
        varchar sigla_regiao FK "Ref: REGIOES"
    }
    
    MUNICIPIOS {
        varchar codigo_ibge PK "7 dígitos - texto"
        varchar nome
        varchar sigla_estado FK
        numeric area_km2
        boolean capital
        numeric longitude
        numeric latitude
        numeric altitude
        timestamp created_at
        timestamp updated_at
    }
    
    MUNICIPIO_GEOMETRIAS {
        int id PK
        varchar codigo_ibge FK
        geometry geom "MultiPolygon SRID 4326"
        varchar fonte "Ex: IBGE 2022"
        timestamp imported_at
    }
    
    INDICADORES {
        int id PK
        varchar nome UK "Nome único descritivo"
        varchar unidade "%, R$, índice, hab"
        varchar categoria "Saúde, Educação, Economia"
        boolean maior_melhor "Direção do ranking"
        varchar descricao
        timestamp created_at
    }
    
    INDICADOR_VALORES {
        bigint id PK
        varchar codigo_ibge FK
        int indicador_id FK
        int ano
        numeric valor
        numeric indice_posicional "0 a 1"
        varchar status_validacao "PENDENTE, VALIDADO, REJEITADO"
        timestamp created_at
        timestamp updated_at
    }
    
    DATASETS {
        int id PK
        varchar identificador UK "IBGE_CENSO_2022"
        varchar titulo "Censo Demográfico 2022"
        text descricao
        varchar fonte "IBGE"
        varchar frequencia "Anual, Decenal"
        varchar metodologia
        varchar versao "v1.4.2"
        varchar status_governanca "LGPD_COMPLIANT"
        varchar nivel_acesso "PUBLIC, RESTRICTED"
        date ultima_atualizacao
        timestamp created_at
    }
    
    DATASET_INDICADORES {
        int dataset_id FK
        int indicador_id FK
    }
    
    USERS {
        uuid id PK
        varchar email UK
        varchar nome
        varchar password_hash
        boolean ativo
        timestamp created_at
        timestamp last_login
    }
    
    ROLES {
        int id PK
        varchar nome UK "VIEWER, ANALYST, ADMIN"
        varchar descricao
    }
    
    USER_ROLES {
        uuid user_id FK
        int role_id FK
    }
    
    AUDIT_LOG {
        bigint id PK
        uuid user_id FK
        varchar acao "CREATE, UPDATE, DELETE, IMPORT"
        varchar entidade "MUNICIPIO, INDICADOR, DATASET"
        varchar entidade_id
        jsonb detalhes
        inet ip_address
        timestamp created_at
    }
```

---

## 2. DDL — Scripts de Criação

### 2.1. Extensões e Schema

```sql
-- Extensão PostGIS (obrigatória)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema dedicado
CREATE SCHEMA IF NOT EXISTS geointel;
SET search_path TO geointel, public;
```

### 2.2. Tabelas de Referência Geográfica

```sql
-- Regiões do Brasil
CREATE TABLE geointel.regioes (
    sigla       VARCHAR(2) PRIMARY KEY,            -- N, NE, SE, S, CO
    nome        VARCHAR(50) NOT NULL               -- Norte, Nordeste, Sudeste, Sul, Centro-Oeste
);

-- Estados (UFs)
CREATE TABLE geointel.estados (
    sigla         VARCHAR(2) PRIMARY KEY,           -- SP, RJ, MG...
    nome          VARCHAR(100) NOT NULL,
    sigla_regiao  VARCHAR(2) NOT NULL REFERENCES geointel.regioes(sigla)
);

-- Municípios (Espinha dorsal de dados)
CREATE TABLE geointel.municipios (
    codigo_ibge   VARCHAR(7) PRIMARY KEY,           -- Texto para preservar zeros
    nome          VARCHAR(200) NOT NULL,
    sigla_estado  VARCHAR(2) NOT NULL REFERENCES geointel.estados(sigla),
    area_km2      NUMERIC(12,3),
    capital       BOOLEAN NOT NULL DEFAULT FALSE,
    longitude     NUMERIC(10,6),
    latitude      NUMERIC(10,6),
    altitude      NUMERIC(8,2),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_municipios_estado ON geointel.municipios(sigla_estado);
CREATE INDEX idx_municipios_capital ON geointel.municipios(capital) WHERE capital = TRUE;
```

### 2.3. Geometrias (PostGIS)

```sql
-- Geometrias municipais (separado para performance)
CREATE TABLE geointel.municipio_geometrias (
    id              SERIAL PRIMARY KEY,
    codigo_ibge     VARCHAR(7) NOT NULL REFERENCES geointel.municipios(codigo_ibge) ON DELETE CASCADE,
    geom            GEOMETRY(MultiPolygon, 4326) NOT NULL,
    geom_simplified GEOMETRY(MultiPolygon, 4326),    -- Versão simplificada para zoom out
    fonte           VARCHAR(100) DEFAULT 'IBGE',
    imported_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT uk_geom_municipio UNIQUE (codigo_ibge)
);

-- Índices espaciais (críticos para performance de Martin/Vector Tiles)
CREATE INDEX idx_geom_municipio ON geointel.municipio_geometrias USING GIST (geom);
CREATE INDEX idx_geom_simplified ON geointel.municipio_geometrias USING GIST (geom_simplified);
```

### 2.4. Indicadores e Valores

```sql
-- Catálogo de indicadores
CREATE TABLE geointel.indicadores (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(200) NOT NULL UNIQUE,    -- "PIB per Capita", "Taxa de Mortalidade"
    unidade         VARCHAR(50),                     -- "%", "R$", "hab/km²"
    categoria       VARCHAR(100),                    -- "Economia", "Saúde", "Educação"
    maior_melhor    BOOLEAN NOT NULL DEFAULT TRUE,   -- TRUE = IDH (maior=melhor), FALSE = Mortalidade
    descricao       TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_indicadores_categoria ON geointel.indicadores(categoria);

-- Valores de indicadores (tabela principal de dados — potencialmente milhões de linhas)
CREATE TABLE geointel.indicador_valores (
    id                  BIGSERIAL PRIMARY KEY,
    codigo_ibge         VARCHAR(7) NOT NULL REFERENCES geointel.municipios(codigo_ibge),
    indicador_id        INTEGER NOT NULL REFERENCES geointel.indicadores(id),
    ano                 SMALLINT NOT NULL,
    valor               NUMERIC(18,6),
    indice_posicional   NUMERIC(6,5),                -- 0.00000 a 1.00000
    status_validacao    VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status_validacao IN ('PENDENTE', 'VALIDADO', 'REJEITADO')),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT uk_indicador_valor UNIQUE (codigo_ibge, indicador_id, ano)
);

-- Índices para consultas frequentes
CREATE INDEX idx_valores_municipio ON geointel.indicador_valores(codigo_ibge);
CREATE INDEX idx_valores_indicador ON geointel.indicador_valores(indicador_id);
CREATE INDEX idx_valores_ano ON geointel.indicador_valores(ano);
CREATE INDEX idx_valores_municipio_ano ON geointel.indicador_valores(codigo_ibge, ano);
CREATE INDEX idx_valores_indicador_ano ON geointel.indicador_valores(indicador_id, ano);

-- Índice parcial para dados validados
CREATE INDEX idx_valores_validados ON geointel.indicador_valores(indicador_id, ano) 
    WHERE status_validacao = 'VALIDADO';
```

### 2.5. Catálogo de Datasets

```sql
CREATE TABLE geointel.datasets (
    id                  SERIAL PRIMARY KEY,
    identificador       VARCHAR(100) NOT NULL UNIQUE,    -- "IBGE_CENSO_2022"
    titulo              VARCHAR(300) NOT NULL,
    descricao           TEXT,
    fonte               VARCHAR(100) NOT NULL,           -- "IBGE", "DATASUS"
    frequencia          VARCHAR(50),                     -- "Anual", "Decenal", "Diária"
    metodologia         TEXT,
    versao              VARCHAR(20) DEFAULT 'v1.0',
    status_governanca   VARCHAR(50) DEFAULT 'PUBLIC',    -- PUBLIC, RESTRICTED, LGPD_COMPLIANT
    nivel_acesso        VARCHAR(50) DEFAULT 'PUBLIC',
    url_fonte           TEXT,
    tamanho_registros   BIGINT,
    ultima_atualizacao  DATE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relação M:N — Dataset ↔ Indicadores derivados
CREATE TABLE geointel.dataset_indicadores (
    dataset_id      INTEGER REFERENCES geointel.datasets(id) ON DELETE CASCADE,
    indicador_id    INTEGER REFERENCES geointel.indicadores(id) ON DELETE CASCADE,
    PRIMARY KEY (dataset_id, indicador_id)
);
```

### 2.6. Autenticação e Autorização

```sql
CREATE TABLE geointel.users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    nome            VARCHAR(200) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE geointel.roles (
    id      SERIAL PRIMARY KEY,
    nome    VARCHAR(50) NOT NULL UNIQUE,     -- VIEWER, ANALYST, ADMIN
    descricao TEXT
);

CREATE TABLE geointel.user_roles (
    user_id     UUID REFERENCES geointel.users(id) ON DELETE CASCADE,
    role_id     INTEGER REFERENCES geointel.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Seed de roles padrão
INSERT INTO geointel.roles (nome, descricao) VALUES
    ('VIEWER', 'Acesso de leitura a mapas, dashboard e relatórios públicos'),
    ('ANALYST', 'VIEWER + geração de relatórios, comparações, exportação'),
    ('ADMIN', 'ANALYST + City Editor, Bulk Import, gerenciamento de usuários');
```

### 2.7. Auditoria

```sql
CREATE TABLE geointel.audit_log (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES geointel.users(id),
    acao        VARCHAR(50) NOT NULL,           -- CREATE, UPDATE, DELETE, IMPORT, LOGIN
    entidade    VARCHAR(100),                   -- MUNICIPIO, INDICADOR, DATASET, USER
    entidade_id VARCHAR(100),                   -- ID do registro afetado
    detalhes    JSONB,                          -- Payload de mudanças (old/new values)
    ip_address  INET,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON geointel.audit_log(user_id);
CREATE INDEX idx_audit_entidade ON geointel.audit_log(entidade, entidade_id);
CREATE INDEX idx_audit_created ON geointel.audit_log(created_at);
```

---

## 3. Configuração do Martin (Vector Tiles)

```yaml
# martin/config.yaml
postgres:
  connection_string: "postgresql://geointel:${DB_PASSWORD}@postgres:5432/geointel_db"
  
  tables:
    municipios_geom:
      schema: geointel
      table: municipio_geometrias
      geometry_column: geom
      srid: 4326
      id_column: codigo_ibge
      properties:
        codigo_ibge: varchar
      bounds: [-73.9872, -33.7512, -34.7929, 5.2718]  # Brasil
      
    municipios_geom_simplified:
      schema: geointel
      table: municipio_geometrias
      geometry_column: geom_simplified
      srid: 4326
      id_column: codigo_ibge
      properties:
        codigo_ibge: varchar
      minzoom: 0
      maxzoom: 7
```

---

## 4. Views Materializadas (Performance)

```sql
-- KPIs agregados por estado (usada no dashboard)
CREATE MATERIALIZED VIEW geointel.mv_kpis_estado AS
SELECT 
    m.sigla_estado,
    i.nome AS indicador_nome,
    iv.ano,
    COUNT(*) AS total_municipios,
    AVG(iv.valor) AS media,
    MIN(iv.valor) AS minimo,
    MAX(iv.valor) AS maximo,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY iv.valor) AS mediana
FROM geointel.indicador_valores iv
JOIN geointel.municipios m ON iv.codigo_ibge = m.codigo_ibge
JOIN geointel.indicadores i ON iv.indicador_id = i.id
WHERE iv.status_validacao = 'VALIDADO'
GROUP BY m.sigla_estado, i.nome, iv.ano;

CREATE UNIQUE INDEX idx_mv_kpis_estado 
    ON geointel.mv_kpis_estado(sigla_estado, indicador_nome, ano);

-- Ranking nacional por indicador/ano (usada no mapa coroplético)
CREATE MATERIALIZED VIEW geointel.mv_ranking_nacional AS
SELECT
    iv.codigo_ibge,
    iv.indicador_id,
    iv.ano,
    iv.valor,
    iv.indice_posicional,
    RANK() OVER (PARTITION BY iv.indicador_id, iv.ano ORDER BY iv.valor DESC) AS rank_desc,
    RANK() OVER (PARTITION BY iv.indicador_id, iv.ano ORDER BY iv.valor ASC) AS rank_asc
FROM geointel.indicador_valores iv
WHERE iv.status_validacao = 'VALIDADO';

CREATE UNIQUE INDEX idx_mv_ranking 
    ON geointel.mv_ranking_nacional(codigo_ibge, indicador_id, ano);

-- Schedule de refresh (via cron ou Airflow)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY geointel.mv_kpis_estado;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY geointel.mv_ranking_nacional;
```

---

## 5. Dados de Seed Iniciais

```sql
-- Regiões do Brasil
INSERT INTO geointel.regioes (sigla, nome) VALUES
    ('N',  'Norte'),
    ('NE', 'Nordeste'),
    ('SE', 'Sudeste'),
    ('S',  'Sul'),
    ('CO', 'Centro-Oeste');

-- Estados do Brasil (27 UFs)
INSERT INTO geointel.estados (sigla, nome, sigla_regiao) VALUES
    ('AC', 'Acre', 'N'),
    ('AL', 'Alagoas', 'NE'),
    ('AM', 'Amazonas', 'N'),
    ('AP', 'Amapá', 'N'),
    ('BA', 'Bahia', 'NE'),
    ('CE', 'Ceará', 'NE'),
    ('DF', 'Distrito Federal', 'CO'),
    ('ES', 'Espírito Santo', 'SE'),
    ('GO', 'Goiás', 'CO'),
    ('MA', 'Maranhão', 'NE'),
    ('MG', 'Minas Gerais', 'SE'),
    ('MS', 'Mato Grosso do Sul', 'CO'),
    ('MT', 'Mato Grosso', 'CO'),
    ('PA', 'Pará', 'N'),
    ('PB', 'Paraíba', 'NE'),
    ('PE', 'Pernambuco', 'NE'),
    ('PI', 'Piauí', 'NE'),
    ('PR', 'Paraná', 'S'),
    ('RJ', 'Rio de Janeiro', 'SE'),
    ('RN', 'Rio Grande do Norte', 'NE'),
    ('RO', 'Rondônia', 'N'),
    ('RR', 'Roraima', 'N'),
    ('RS', 'Rio Grande do Sul', 'S'),
    ('SC', 'Santa Catarina', 'S'),
    ('SE', 'Sergipe', 'NE'),
    ('SP', 'São Paulo', 'SE'),
    ('TO', 'Tocantins', 'N');
```

---

## 6. Estimativa de Volume de Dados

| Tabela | Registros Estimados | Crescimento |
|---|---|---|
| `regioes` | 5 | Estático |
| `estados` | 27 | Estático |
| `municipios` | 5.570 | ~Estático (raramente muda) |
| `municipio_geometrias` | 5.570 | ~Estático |
| `indicadores` | ~200 | Crescimento lento (~10/ano) |
| `indicador_valores` | ~16.7M | 5.570 × 200 × 15 anos = alto |
| `datasets` | ~50 | Crescimento lento |
| `users` | ~500 | Crescimento moderado |
| `audit_log` | ~100K/ano | Crescimento contínuo |
