# Dicionário de Dados e Metadados de Indicadores

## SisInfo / GeoIntel — V2

---

## 1. Catálogo Inicial de Indicadores

A tabela abaixo lista os indicadores planejados para o sistema, organizados por categoria. Cada indicador possui uma direção de ranking (`↑` = maior é melhor, `↓` = menor é melhor).

### 1.1. Economia

| # | Nome do Indicador | Unidade | Direção | Fonte Primária | Periodicidade |
|---|---|---|---|---|---|
| 1 | PIB Total | R$ (milhões) | ↑ | IBGE/SIDRA | Anual |
| 2 | PIB per Capita | R$ | ↑ | IBGE/SIDRA | Anual |
| 3 | Valor Adicionado - Agropecuária | R$ (milhões) | ↑ | IBGE/SIDRA | Anual |
| 4 | Valor Adicionado - Indústria | R$ (milhões) | ↑ | IBGE/SIDRA | Anual |
| 5 | Valor Adicionado - Serviços | R$ (milhões) | ↑ | IBGE/SIDRA | Anual |
| 6 | Receita Orçamentária Total | R$ (milhões) | ↑ | SICONFI/FINBRA | Anual |
| 7 | Despesa Orçamentária Total | R$ (milhões) | — | SICONFI/FINBRA | Anual |
| 8 | Receita Tributária Própria | R$ (milhões) | ↑ | SICONFI/FINBRA | Anual |
| 9 | Transferências da União | R$ (milhões) | — | SICONFI/FINBRA | Anual |
| 10 | Saldo Orçamentário | R$ (milhões) | ↑ | SICONFI/FINBRA | Anual |

### 1.2. Demografia

| # | Nome do Indicador | Unidade | Direção | Fonte Primária | Periodicidade |
|---|---|---|---|---|---|
| 11 | População Total | habitantes | — | IBGE/Censo | Decenal + estimativas anuais |
| 12 | Densidade Demográfica | hab/km² | — | Calculado (Pop/Área) | Anual |
| 13 | Taxa de Urbanização | % | — | IBGE/Censo | Decenal |
| 14 | Crescimento Populacional | % | — | Calculado (Δ Pop) | Anual |
| 15 | Razão de Sexos | masc/100 fem | — | IBGE/Censo | Decenal |

### 1.3. Desenvolvimento Humano

| # | Nome do Indicador | Unidade | Direção | Fonte | Periodicidade |
|---|---|---|---|---|---|
| 16 | IDHM (Geral) | índice (0-1) | ↑ | PNUD/Atlas Brasil | Decenal |
| 17 | IDHM - Educação | índice (0-1) | ↑ | PNUD/Atlas Brasil | Decenal |
| 18 | IDHM - Longevidade | índice (0-1) | ↑ | PNUD/Atlas Brasil | Decenal |
| 19 | IDHM - Renda | índice (0-1) | ↑ | PNUD/Atlas Brasil | Decenal |
| 20 | Índice de Gini | índice (0-1) | ↓ | IBGE/Censo | Decenal |

### 1.4. Saúde

| # | Nome do Indicador | Unidade | Direção | Fonte | Periodicidade |
|---|---|---|---|---|---|
| 21 | Taxa de Mortalidade Infantil | por 1.000 nascidos vivos | ↓ | DATASUS/SIM | Anual |
| 22 | Expectativa de Vida | anos | ↑ | IBGE | Decenal |
| 23 | Cobertura de Atenção Básica | % | ↑ | DATASUS/e-Gestor AB | Mensal |
| 24 | Internações por Doenças Respiratórias | por 10.000 hab | ↓ | DATASUS/SIH | Anual |
| 25 | Leitos Hospitalares por Habitante | por 1.000 hab | ↑ | DATASUS/CNES | Anual |

### 1.5. Educação

| # | Nome do Indicador | Unidade | Direção | Fonte | Periodicidade |
|---|---|---|---|---|---|
| 26 | IDEB - Anos Iniciais | nota (0-10) | ↑ | INEP | Bienal |
| 27 | IDEB - Anos Finais | nota (0-10) | ↑ | INEP | Bienal |
| 28 | Taxa de Abandono Escolar | % | ↓ | INEP/Censo Escolar | Anual |
| 29 | Taxa de Alfabetização | % | ↑ | IBGE/Censo | Decenal |
| 30 | Matrículas - Ensino Fundamental | total | — | INEP/Censo Escolar | Anual |

### 1.6. Saneamento e Infraestrutura

| # | Nome do Indicador | Unidade | Direção | Fonte | Periodicidade |
|---|---|---|---|---|---|
| 31 | Cobertura de Água Tratada | % pop atendida | ↑ | SNIS | Anual |
| 32 | Cobertura de Esgoto | % pop atendida | ↑ | SNIS | Anual |
| 33 | Índice de Perdas de Água | % | ↓ | SNIS | Anual |
| 34 | Coleta de Resíduos Sólidos | % domicílios | ↑ | SNIS | Anual |
| 35 | Consumo Médio de Água | litros/hab/dia | — | SNIS | Anual |

### 1.7. Segurança

| # | Nome do Indicador | Unidade | Direção | Fonte | Periodicidade |
|---|---|---|---|---|---|
| 36 | Taxa de Homicídios | por 100.000 hab | ↓ | DATASUS/SIM | Anual |
| 37 | Óbitos por Causas Externas | por 100.000 hab | ↓ | DATASUS/SIM | Anual |

### 1.8. Agropecuária

| # | Nome do Indicador | Unidade | Direção | Fonte | Periodicidade |
|---|---|---|---|---|---|
| 38 | Produção Agrícola Total | R$ (milhões) | ↑ | IBGE/PAM | Anual |
| 39 | Área Plantada Total | hectares | — | IBGE/PAM | Anual |
| 40 | Efetivo de Rebanho Bovino | cabeças | — | IBGE/PPM | Anual |

---

## 2. Formato de Armazenamento (Formato Longo)

Todos os indicadores são armazenados no formato "longo" (tidy data):

```
Codigo_Municipio;Nome_Indicador;Ano_Observacao;Valor;Indice_Posicional
4106902;PIB per Capita;2022;52300.00;0.88000
4106902;PIB per Capita;2021;48900.00;0.86500
4106902;Taxa de Mortalidade Infantil;2022;8.2;0.91200
3550308;PIB per Capita;2022;64100.50;0.94000
```

### Regras de Formatação

| Campo | Regra |
|---|---|
| `Codigo_Municipio` | Texto, 7 dígitos, preservar zeros à esquerda |
| `Nome_Indicador` | Texto, idêntico ao cadastro na tabela `indicadores` |
| `Ano_Observacao` | Inteiro, 4 dígitos (ex: 2022) |
| `Valor` | Decimal, ponto como separador (ex: 52300.00) |
| `Indice_Posicional` | Decimal 0.00000 a 1.00000, calculado pós-ETL |

---

## 3. Categorias e Ícones (Material Symbols)

| Categoria | Ícone (filled) | Cor |
|---|---|---|
| Economia | `monetization_on` | `#14213d` |
| Demografia | `groups` | `#14213d` |
| Desenvolvimento Humano | `trending_up` | `#14213d` |
| Saúde | `emergency` | `#dc2626` |
| Educação | `school` | `#14213d` |
| Saneamento | `water_drop` | `#0284c7` |
| Segurança | `security` | `#14213d` |
| Agropecuária | `agriculture` | `#16a34a` |

---

## 4. Datasets e suas Relações com Indicadores

| Dataset | Indicadores Derivados (IDs) |
|---|---|
| IBGE/SIDRA - PIB Municipal | 1, 2, 3, 4, 5 |
| IBGE/Censo Demográfico | 11, 12, 13, 14, 15, 20, 29 |
| PNUD/Atlas Brasil | 16, 17, 18, 19 |
| DATASUS/SIM | 21, 36, 37 |
| DATASUS/SIH | 24 |
| DATASUS/CNES | 25 |
| DATASUS/e-Gestor AB | 23 |
| INEP/IDEB | 26, 27 |
| INEP/Censo Escolar | 28, 30 |
| SNIS | 31, 32, 33, 34, 35 |
| SICONFI/FINBRA | 6, 7, 8, 9, 10 |
| IBGE/PAM | 38, 39 |
| IBGE/PPM | 40 |

---

## 5. Metadados de Municípios (municipios.csv)

### 5.1. Estrutura Detalhada

| Coluna | Tipo Python | Tipo SQL | Exemplo | Validação |
|---|---|---|---|---|
| `Codigo_Municipio` | `str` | `VARCHAR(7)` | `"4106902"` | Exatamente 7 dígitos |
| `Nome_Municipio` | `str` | `VARCHAR(200)` | `"Curitiba"` | Não vazio |
| `Sigla_Estado` | `str` | `VARCHAR(2)` | `"PR"` | 2 chars maiúsculos, válida |
| `Sigla_Regiao` | `str` | `VARCHAR(2)` | `"S"` | N, NE, SE, S, CO |
| `Area_Municipio` | `float` | `NUMERIC(12,3)` | `434.892` | > 0, ponto decimal |
| `Capital` | `bool` | `BOOLEAN` | `true` | true/false literal |
| `Longitude_Municipio` | `float` | `NUMERIC(10,6)` | `-49.2776` | -73.99 a -34.79 |
| `Latitude_Municipio` | `float` | `NUMERIC(10,6)` | `-25.4296` | -33.75 a 5.27 |
| `Altitude_Municipio` | `float` | `NUMERIC(8,2)` | `934` | >= 0 |

### 5.2. Derivações Automáticas

| Campo Derivado | Fórmula | Quando Calcular |
|---|---|---|
| `Sigla_Regiao` | Lookup pela `Sigla_Estado` | Na ingestão do CSV |
| `Densidade Demográfica` | `População / Area_Municipio` | Após ingestão de indicadores |
| `Crescimento Populacional` | `(Pop_atual - Pop_anterior) / Pop_anterior × 100` | Após ingestão |
