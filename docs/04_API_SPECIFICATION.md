# Especificação da API REST

## SisInfo / GeoIntel — V2

**Base URL:** `https://api.geointel.gov.br/api/v1`  
**Formato:** JSON  
**Autenticação:** Bearer Token (JWT)  
**Versionamento:** Prefixo de URL (`/api/v1/`)

---

## 1. Autenticação

### POST `/auth/login`

Autentica usuário e retorna tokens JWT.

**Request Body:**
```json
{
  "email": "analista@gov.br",
  "password": "senha_segura_123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "eyJhbGciOiJIUzI1...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "analista@gov.br",
    "nome": "Maria Silva",
    "roles": ["ANALYST"]
  }
}
```

### POST `/auth/refresh`

Renova o access token usando o refresh token.

**Request Body:**
```json
{ "refresh_token": "eyJhbGciOiJIUzI1..." }
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1...(novo)",
  "expires_in": 3600
}
```

### POST `/auth/register` 🔒 ADMIN

Cria novo usuário.

**Request Body:**
```json
{
  "email": "novo_usuario@gov.br",
  "nome": "João Santos",
  "password": "senha_forte_456",
  "roles": ["VIEWER"]
}
```

---

## 2. Municípios

### GET `/municipios`

Lista municípios com filtros e paginação.

**Query Parameters:**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `estado` | string | Não | Sigla UF (ex: "SP") |
| `regiao` | string | Não | Sigla região (ex: "SE") |
| `capital` | boolean | Não | Filtrar apenas capitais |
| `search` | string | Não | Busca por nome (ILIKE) |
| `page` | int | Não | Página (default: 1) |
| `per_page` | int | Não | Itens/página (default: 50, max: 200) |

**Response 200:**
```json
{
  "data": [
    {
      "codigo_ibge": "4106902",
      "nome": "Curitiba",
      "sigla_estado": "PR",
      "sigla_regiao": "S",
      "area_km2": 434.892,
      "capital": true,
      "longitude": -49.2776,
      "latitude": -25.4296,
      "altitude": 934.0
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 5570,
    "total_pages": 112
  }
}
```

### GET `/municipios/{codigo_ibge}`

Retorna detalhes de um município específico.

**Response 200:**
```json
{
  "codigo_ibge": "3550308",
  "nome": "São Paulo",
  "sigla_estado": "SP",
  "sigla_regiao": "SE",
  "area_km2": 1521.11,
  "capital": true,
  "longitude": -46.6334,
  "latitude": -23.5507,
  "altitude": 760.0,
  "estado": {
    "sigla": "SP",
    "nome": "São Paulo"
  }
}
```

### GET `/municipios/{codigo_ibge}/indicadores`

Retorna todos os indicadores de um município, opcionalmente filtrados por ano.

**Query Parameters:**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `ano` | int | Não | Filtrar por ano específico |
| `ano_inicio` | int | Não | Início do intervalo |
| `ano_fim` | int | Não | Fim do intervalo |
| `categoria` | string | Não | Filtrar por categoria do indicador |
| `indicador_id` | int | Não | ID de indicador específico |

**Response 200:**
```json
{
  "municipio": {
    "codigo_ibge": "3550308",
    "nome": "São Paulo"
  },
  "indicadores": [
    {
      "indicador_id": 1,
      "nome": "PIB per Capita",
      "unidade": "R$",
      "categoria": "Economia",
      "serie": [
        { "ano": 2020, "valor": 58456.23, "indice_posicional": 0.94 },
        { "ano": 2021, "valor": 61230.10, "indice_posicional": 0.95 },
        { "ano": 2022, "valor": 64100.50, "indice_posicional": 0.94 }
      ]
    }
  ]
}
```

### GET `/municipios/{codigo_ibge}/benchmarking`

Compara indicadores do município com médias estaduais e nacionais.

**Response 200:**
```json
{
  "municipio": "São Paulo",
  "estado": "SP",
  "ano": 2022,
  "comparativo": [
    {
      "indicador": "PIB per Capita",
      "valor_municipio": 64100.50,
      "media_estadual": 42300.00,
      "media_nacional": 38500.00,
      "ranking_estadual": 5,
      "ranking_nacional": 12,
      "tendencia": "UP"
    }
  ]
}
```

### PUT `/municipios/{codigo_ibge}` 🔒 ADMIN

Atualiza metadados cadastrais de um município.

**Request Body:**
```json
{
  "nome": "São Paulo",
  "area_km2": 1521.11,
  "altitude": 760.0,
  "capital": true
}
```

---

## 3. Indicadores

### GET `/indicadores`

Lista todos os indicadores disponíveis.

**Query Parameters:**

| Param | Tipo | Descrição |
|---|---|---|
| `categoria` | string | Filtrar por categoria |
| `search` | string | Busca por nome |

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "PIB per Capita",
      "unidade": "R$",
      "categoria": "Economia",
      "maior_melhor": true,
      "descricao": "Produto Interno Bruto dividido pela população"
    }
  ]
}
```

### GET `/indicadores/{id}/mapa`

Retorna dados otimizados para renderização de mapa coroplético.

**Query Parameters:**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `ano` | int | Sim | Ano de referência |
| `estado` | string | Não | Filtrar por UF |

**Response 200:**
```json
{
  "indicador": {
    "id": 1,
    "nome": "PIB per Capita",
    "maior_melhor": true
  },
  "ano": 2022,
  "valores": {
    "3550308": { "valor": 64100.50, "indice": 0.94 },
    "4106902": { "valor": 52300.00, "indice": 0.88 },
    "3304557": { "valor": 48700.00, "indice": 0.82 }
  },
  "estatisticas": {
    "min": 4200.00,
    "max": 312000.00,
    "media": 28500.00,
    "mediana": 18200.00,
    "total_municipios": 5520
  }
}
```

### GET `/indicadores/{id}/ranking`

Retorna ranking de municípios para um indicador/ano.

**Query Parameters:**

| Param | Tipo | Descrição |
|---|---|---|
| `ano` | int | Ano de referência |
| `limite` | int | Top N resultados (default: 20) |
| `estado` | string | Filtrar por UF |
| `ordem` | string | "asc" ou "desc" (default: "desc") |

**Response 200:**
```json
{
  "ranking": [
    { "posicao": 1, "codigo_ibge": "3550308", "nome": "São Paulo", "valor": 64100.50, "indice": 0.94 },
    { "posicao": 2, "codigo_ibge": "3304557", "nome": "Rio de Janeiro", "valor": 48700.00, "indice": 0.82 }
  ]
}
```

### GET `/indicadores/{id}/serie-temporal`

Retorna série temporal de um indicador para N municípios (para gráficos de comparação).

**Query Parameters:**

| Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `municipios` | string | Sim | Códigos IBGE separados por vírgula (max 5) |
| `ano_inicio` | int | Não | Ano inicial (default: 2010) |
| `ano_fim` | int | Não | Ano final (default: ano corrente) |

**Response 200:**
```json
{
  "indicador": { "id": 1, "nome": "PIB per Capita" },
  "series": [
    {
      "codigo_ibge": "3550308",
      "nome": "São Paulo",
      "dados": [
        { "ano": 2020, "valor": 58456.23 },
        { "ano": 2021, "valor": 61230.10 },
        { "ano": 2022, "valor": 64100.50 }
      ]
    }
  ]
}
```

---

## 4. Dashboard & Analytics

### GET `/dashboard/kpis`

Retorna KPIs globais para o ribbon do topo do dashboard.

**Query Parameters:**

| Param | Tipo | Descrição |
|---|---|---|
| `estado` | string | Filtrar por UF (default: nacional) |
| `ano` | int | Ano de referência |

**Response 200:**
```json
{
  "kpis": [
    {
      "titulo": "Global Health Index",
      "valor": 84.2,
      "variacao_percentual": 12.4,
      "tendencia": "UP",
      "icone": "monitoring"
    },
    {
      "titulo": "Education Access",
      "valor": 91.8,
      "variacao_percentual": 2.1,
      "tendencia": "UP",
      "icone": "school"
    }
  ]
}
```

### POST `/dashboard/comparacao`

Gera análise comparativa para múltiplas cidades (Dock de Comparação).

**Request Body:**
```json
{
  "municipios": ["3550308", "3304557", "4106902"],
  "indicadores": [1, 2, 3, 4],
  "ano": 2022
}
```

**Response 200:**
```json
{
  "comparacao": {
    "municipios": [
      { "codigo_ibge": "3550308", "nome": "São Paulo" },
      { "codigo_ibge": "3304557", "nome": "Rio de Janeiro" },
      { "codigo_ibge": "4106902", "nome": "Curitiba" }
    ],
    "indicadores": [
      {
        "id": 1,
        "nome": "PIB per Capita",
        "valores": {
          "3550308": { "valor": 64100.50, "indice": 0.94 },
          "3304557": { "valor": 48700.00, "indice": 0.82 },
          "4106902": { "valor": 52300.00, "indice": 0.88 }
        }
      }
    ],
    "radar_data": {
      "dimensoes": ["Economia", "Saúde", "Educação", "Segurança"],
      "perfis": {
        "3550308": [0.94, 0.78, 0.85, 0.62],
        "3304557": [0.82, 0.72, 0.80, 0.55],
        "4106902": [0.88, 0.85, 0.90, 0.75]
      }
    }
  }
}
```

---

## 5. Relatórios

### POST `/reports/gerar`

Gera dossiê executivo para um município.

**Request Body:**
```json
{
  "codigo_ibge": "3550308",
  "ano": 2022,
  "formato": "json",
  "incluir_graficos": true
}
```

**Response 200:**
```json
{
  "relatorio": {
    "ref_documento": "#GEO-INT-2027-001",
    "data_emissao": "2027-01-15",
    "municipio": { "codigo_ibge": "3550308", "nome": "São Paulo", "estado": "SP" },
    "sumario_executivo": "O presente relatório consolida os dados...",
    "kpis": [...],
    "graficos_data": { "radar": {...}, "barras_historico": {...} },
    "tabela_detalhamento": [...],
    "meta": { "analista": "Sistema Automático", "classificacao": "CONFIDENCIAL" }
  }
}
```

### GET `/reports/exportar/{ref_documento}` 🔒 ANALYST

Exporta relatório em PDF.

**Response:** `application/pdf` (binary stream)

---

## 6. Data Catalog

### GET `/datasets`

Lista datasets disponíveis.

**Query Parameters:**

| Param | Tipo | Descrição |
|---|---|---|
| `search` | string | Busca por título ou fonte |
| `fonte` | string | Filtrar por fonte (IBGE, DATASUS, etc.) |
| `frequencia` | string | Filtrar por frequência |

### GET `/datasets/{id}`

Detalhes de um dataset com dicionário de dados.

### GET `/datasets/{id}/download` 🔒 ANALYST

Download RAW em CSV da base.

---

## 7. Administração 🔒 ADMIN

### PUT `/admin/municipios/{codigo_ibge}/geometria`

Atualiza geometria de um município.

**Request Body:**
```json
{
  "tipo": "geojson",
  "geojson": {
    "type": "Feature",
    "geometry": { "type": "MultiPolygon", "coordinates": [...] },
    "properties": {}
  }
}
```

### POST `/admin/indicadores/{id}/valores`

Insere/atualiza valores de indicador para um município.

**Request Body:**
```json
{
  "codigo_ibge": "3550308",
  "valores": [
    { "ano": 2022, "valor": 64100.50 },
    { "ano": 2023, "valor": 66200.00 }
  ]
}
```

### POST `/admin/import/bulk`

Importação em massa via CSV.

**Request:** `multipart/form-data`

| Campo | Tipo | Descrição |
|---|---|---|
| `file` | File | Arquivo CSV |
| `mapping` | JSON | Mapeamento de colunas |
| `indicador_id` | int | ID do indicador alvo |

**Mapping example:**
```json
{
  "Codigo_Municipio": "codigo_ibge",
  "Ano_Observacao": "ano",
  "Numeric_Val": "valor"
}
```

**Response 200:**
```json
{
  "status": "SUCCESS",
  "registros_processados": 5570,
  "registros_inseridos": 5520,
  "registros_atualizados": 0,
  "erros": 50,
  "detalhes_erros": [
    { "linha": 142, "erro": "Codigo_Municipio inválido: 9999999" }
  ]
}
```

### GET `/admin/users` 🔒 ADMIN

Lista usuários do sistema.

### POST `/admin/users` 🔒 ADMIN

Cria novo usuário.

### PUT `/admin/users/{id}/roles` 🔒 ADMIN

Atualiza roles de um usuário.

---

## 8. Códigos de Erro

| Código HTTP | Código Interno | Descrição |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Parâmetros inválidos |
| 401 | `UNAUTHORIZED` | Token ausente ou expirado |
| 403 | `FORBIDDEN` | Sem permissão (role insuficiente) |
| 404 | `NOT_FOUND` | Recurso não encontrado |
| 409 | `CONFLICT` | Dado duplicado |
| 422 | `UNPROCESSABLE` | Dados semanticamente inválidos |
| 429 | `RATE_LIMITED` | Excedeu 100 req/min |
| 500 | `INTERNAL_ERROR` | Erro interno do servidor |

**Formato de Erro:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Município com código IBGE '9999999' não encontrado",
    "details": null
  }
}
```

---

## 9. Rate Limiting

| Role | Limite | Janela |
|---|---|---|
| VIEWER | 60 req/min | Sliding window |
| ANALYST | 120 req/min | Sliding window |
| ADMIN | 300 req/min | Sliding window |

Header de resposta: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 10. Headers Padrão

**Request:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

**Response:**
```
Content-Type: application/json
X-Request-Id: <uuid>
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1706000000
Cache-Control: public, max-age=300 (para endpoints de leitura)
```
