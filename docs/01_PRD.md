# PRD — Documento de Requisitos de Produto

## SisInfo / GeoIntel (Adm-de-Cidades) — Plataforma de Inteligência Territorial e Analítica

**Versão:** 2.0 (V2 — Enterprise-Ready)  
**Data:** Janeiro 2027  
**Autor:** Equipe de Produto GeoIntel  
**Status:** Rascunho para Revisão

> **Nomenclatura:** O nome institucional do produto é **SisInfo/GeoIntel**. O nome operacional exibido na interface (header, sidebar, login) é **“Adm-de-Cidades”**. Ambos referem-se ao mesmo sistema. Mockups de referência em `docs/mockups/`.

---

## 1. Resumo Executivo

O **SisInfo (GeoIntel)** é uma plataforma Web **GovTech** de alto nível focada em análise de dados, inteligência territorial e indicadores socioeconômicos para o Brasil. A plataforma consolida, processa e visualiza dados de fontes oficiais (IBGE, DATASUS, FINBRA, IPEADATA, SNIS, SICONFI) em recortes espaciais de municípios, estados e regiões.

### Problema

O protótipo V1 era client-side, baseado em CSV/GeoJSON estáticos carregados em memória no browser. Isso causa:
- **Travamento do browser** ao renderizar 5.570 municípios via GeoJSON (~50MB)
- **Impossibilidade de atualização automática** dos dados
- **Ausência de controle de acesso** e segurança
- **Limitação de escala** para séries históricas (2010–2024) × N indicadores

**Legado V1 (para migração):**
- Gerenciamento de estado via Context API (pesado)
- Parse de CSV em runtime via PapaParse
- Renderização de mapa via Mapbox GL JS (proprietário) + GeoJSON estático
- Sem backend/API; dados carregados diretamente no browser

### Solução V2

Reconstrução completa com:
- **Backend robusto** (FastAPI/Python) com API REST protegida por JWT
- **Banco geoespacial** (PostgreSQL + PostGIS) substituindo arquivos estáticos
- **Vector Tiles (MVT)** via Martin para renderização de mapas a 60fps
- **Pipeline ETL automatizado** (Airflow/Prefect) para ingestão periódica
- **Aplicação instalável** com executável desktop (Electron/Tauri)

---

## 2. Público-Alvo e Personas

| Persona | Descrição | Necessidade Principal |
|---|---|---|
| **Analista de Dados Públicos** | Funcionário de secretaria municipal/estadual que analisa indicadores | Dashboard comparativo, exportação de relatórios |
| **Gestor Executivo** | Secretário, prefeito ou assessor que toma decisões | Dossiê executivo imprimível, KPIs visuais |
| **Engenheiro de Dados (Admin)** | Responsável por atualizar e curar as bases de dados | City Editor, Bulk Import, validação de ETL |
| **Pesquisador Acadêmico** | Usuário externo com acesso de leitura ao catálogo de dados | Data Catalog, download RAW, documentação metodológica |
| **Cidadão / Jornalista** | Usuário com acesso restrito a dados públicos | Mapa interativo, wiki, relatórios públicos |

---

## 3. Objetivos e KPIs do Produto

| Objetivo | KPI | Meta V2 |
|---|---|---|
| Performance de mapa | Tempo de renderização inicial (5.570 municípios) | < 2 segundos |
| Latência de API | P95 de resposta para consultas de indicadores | < 300ms |
| Cobertura de dados | Municípios com dados atualizados no último ano | > 95% |
| Adoção | Usuários ativos mensais (após 6 meses de lançamento) | > 500 |
| Relatórios gerados | Dossiês executivos gerados por mês | > 200 |
| Disponibilidade | Uptime do sistema | 99.5% |
| ETL | Taxa de sucesso do pipeline de ingestão | > 98% |

---

## 4. Escopo Funcional — Módulos

### 4.1. Módulo de Inteligência Espacial (Core Map)

**Prioridade:** P0 (Must-Have)

**Descrição:** Tela principal com mapa imersivo (100% viewport) usando MapLibre GL JS + Vector Tiles servidos por Martin.

**User Stories:**

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-MAP-01 | Analista | Visualizar mapa coroplético de qualquer indicador | Identificar padrões espaciais |
| US-MAP-02 | Analista | Filtrar por Estado, Município e Zona | Focar na região de interesse |
| US-MAP-03 | Analista | Alternar entre indicadores (População, PIB, IDHM) via checkboxes | Comparar dimensões rapidamente |
| US-MAP-04 | Analista | Deslizar no slider temporal (2010–2024) | Ver evolução histórica no mapa |
| US-MAP-05 | Analista | Clicar num município e ver Bottom Sheet com KPIs | Obter detalhes sem sair do mapa |
| US-MAP-06 | Analista | Alternar camadas (Limites, Densidade) | Customizar a visualização |
| US-MAP-07 | Analista | Mudar estilo de mapa (escuro, claro, satélite) | Adaptar ao contexto de uso |
| US-MAP-08 | Analista | Usar barra de pesquisa para encontrar localidade | Navegar rapidamente para uma cidade |

**Critérios de Aceite (US-MAP-05):**
- Bottom Sheet abre com animação `translate-y` em < 300ms
- Exibe nome da cidade, tag de tier, KPI cards com sparklines
- Tabela de benchmarking compara com média estadual
- Botões "Relatório Completo" navega ao Módulo 4.3
- Botão "Comparar" adiciona ao Dock do Módulo 4.2

---

### 4.2. Módulo de Visualização Analítica (Dashboard)

**Prioridade:** P0 (Must-Have)

**Descrição:** Dashboard com gráficos estatísticos, cruzamento de dados e análise temporal. Layout Bento Grid com fundo cinza claro.

**User Stories:**

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-DASH-01 | Analista | Ver 4 KPIs globais no topo (Health, Education, Economic, Sustainability) | Ter visão panorâmica rápida |
| US-DASH-02 | Analista | Ver gráfico de Performance Over Time (área/linha) | Analisar tendências temporais |
| US-DASH-03 | Analista | Ver ranking de Top Performing Localities | Identificar líderes e outliers |
| US-DASH-04 | Analista | Ver comparativo setorial (barras horizontais duplas) | Cruzar dimensões (Saúde vs Educação) |
| US-DASH-05 | Analista | Ver radar chart multidimensional | Avaliar perfil completo da cidade |
| US-DASH-06 | Analista | Usar o Dock de Comparação (bottom bar) | Comparar múltiplas cidades simultaneamente |
| US-DASH-07 | Analista | Gerar análise cruzada ao clicar "Generate Analysis" | Reprocessar gráficos com N cidades selecionadas |

**Critérios de Aceite (US-DASH-06):**
- Dock fixo na base com glassmorphism
- Chips com nome das cidades + botão ×
- Botão "+ Compare with..." abre busca
- Limite de 5 cidades simultâneas no Dock
- "Generate Analysis" atualiza todos os gráficos do dashboard

---

### 4.3. Gerador de Perfis e Relatórios (Dossiê Executivo)

**Prioridade:** P0 (Must-Have)

**Descrição:** Página que simula folha A4 para geração de dossiês executivos formais, otimizada para impressão e PDF.

**User Stories:**

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-REP-01 | Gestor | Ver relatório formatado em layout A4 | Ter documento formal para reuniões |
| US-REP-02 | Gestor | Exportar em PDF com um clique | Compartilhar offline |
| US-REP-03 | Gestor | Imprimir relatório sem artefatos de UI | Ter documento limpo e profissional |
| US-REP-04 | Gestor | Ver sumário executivo com resumo descritivo | Contextualizar rapidamente a localidade |
| US-REP-05 | Gestor | Ver grid de KPIs minimalista | Absorver dados-chave de relance |
| US-REP-06 | Gestor | Ver gráficos estáticos (radar + barras) | Visualizar dados sem interatividade |
| US-REP-07 | Gestor | Ver tabela zebrada com badges de status | Identificar áreas nominais, em alerta ou críticas |
| US-REP-08 | Gestor | Ver área de assinaturas e selo digital | Formalizar o documento |

**Critérios de Aceite (US-REP-03):**
- `@media print` oculta sidebar, header, botões flutuantes
- Sombra da "folha" removida na impressão
- Numeração de página visível
- Layout fiel ao A4 (210mm × 297mm)

---

### 4.4. Repositório de Bases e Metadados (Data Catalog)

**Prioridade:** P1 (Should-Have)

**Descrição:** Catálogo de transparência e governança com busca, metadados, dicionários de dados e download.

**User Stories:**

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-CAT-01 | Pesquisador | Buscar datasets por nome ou setor | Encontrar a base desejada rapidamente |
| US-CAT-02 | Pesquisador | Ver cards de dataset com fonte, frequência e atualização | Avaliar qualidade e recência do dado |
| US-CAT-03 | Pesquisador | Abrir documentação detalhada do dataset | Entender metodologia de coleta |
| US-CAT-04 | Pesquisador | Ver dicionário de dados (campos, tipos, descrições) | Integrar dados via API ou CSV |
| US-CAT-05 | Pesquisador | Baixar RAW em CSV | Usar dados em ferramentas externas |
| US-CAT-06 | Pesquisador | Ver indicadores derivados da base | Compreender cadeia de transformação |
| US-CAT-07 | Pesquisador | Verificar status de governança (LGPD) | Conformidade regulatória |

---

### 4.5. Administração: City Editor & Bulk Import

**Prioridade:** P1 (Should-Have)

**Descrição:** Ambiente restrito (RBAC: ADMIN) para curadoria manual de dados e importação em massa.

**User Stories:**

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-ADM-01 | Admin | Editar metadados primários de um município | Corrigir dados cadastrais |
| US-ADM-02 | Admin | Editar geometria via editor visual de polígonos | Ajustar fronteiras incorretas |
| US-ADM-03 | Admin | Editar séries temporais de indicadores inline | Corrigir valores pontuais |
| US-ADM-04 | Admin | Importar CSV em massa (Bulk Import) | Carregar novos datasets rapidamente |
| US-ADM-05 | Admin | Mapear colunas do CSV para campos do sistema | Garantir conformidade na ingestão |
| US-ADM-06 | Admin | Ver validação pré-import com alertas | Identificar erros antes de persistir |

**Critérios de Aceite (US-ADM-05):**
- Modal com Stepper (Upload → Map Columns → Validate)
- Lista colunas do CSV detectadas automaticamente
- Select dropdown vincula CSV col → campo sistema
- Alerta para colunas obrigatórias não mapeadas
- Alerta para formatos inválidos (ex: "1.234,56" vs "1234.56")

---

### 4.6. Documentação e Wiki

**Prioridade:** P2 (Nice-to-Have na V2.0, Obrigatório na V2.1)

**Descrição:** Manual do usuário e central de transparência metodológica.

**User Stories:**

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-WIKI-01 | Qualquer | Navegar por árvore de tópicos na sidebar | Encontrar documentação rapidamente |
| US-WIKI-02 | Qualquer | Ler conteúdo com tipografia otimizada | Absorver informação confortavelmente |
| US-WIKI-03 | Qualquer | Ver Table of Contents lateral | Navegar dentro de páginas longas |
| US-WIKI-04 | Qualquer | Ver tutoriais com passos numerados | Aprender a usar funcionalidades |
| US-WIKI-05 | Qualquer | Ver tabelas de fórmulas metodológicas | Auditar cálculos estatísticos |
| US-WIKI-06 | Qualquer | Ver alertas e dicas destacados visualmente | Não perder informações críticas |

---

## 5. Requisitos Não Funcionais

### 5.1. Performance

| Requisito | Especificação | Justificativa |
|---|---|---|
| RNF-PERF-01 | Mapa: First Meaningful Paint < 2s | Vector Tiles MVT eliminam GeoJSON massivo |
| RNF-PERF-02 | Mapa: 60fps durante pan/zoom | Renderização WebGL via MapLibre |
| RNF-PERF-03 | API: P95 latência < 300ms | Cache Redis + queries otimizadas |
| RNF-PERF-04 | Dashboard: Recharts renderiza < 500ms | Dados pré-agregados no backend |
| RNF-PERF-05 | Relatório PDF: Gerado em < 3s | Puppeteer/Playwright headless |

### 5.2. Segurança

| Requisito | Especificação |
|---|---|
| RNF-SEC-01 | Autenticação via JWT (access + refresh tokens) |
| RNF-SEC-02 | OAuth2 com suporte a provedores externos |
| RNF-SEC-03 | RBAC com roles: VIEWER, ANALYST, ADMIN |
| RNF-SEC-04 | Rate limiting: 100 req/min por usuário |
| RNF-SEC-05 | HTTPS obrigatório em produção |
| RNF-SEC-06 | Logs de auditoria para operações de escrita |

### 5.3. Responsividade

| Contexto | Requisito |
|---|---|
| Mapa/Dashboard/Editor | Desktop-first (min 1280px), usável em Tablet (768px) |
| Relatórios/Catálogo/Wiki | Mobile-first, fluido em smartphones (375px+) |

### 5.4. Acessibilidade

| Requisito | Especificação |
|---|---|
| RNF-A11Y-01 | Paletas colorblind-safe (Viridis, Cividis) para mapas |
| RNF-A11Y-02 | Contraste mínimo WCAG AA para textos |
| RNF-A11Y-03 | Navegação por teclado em componentes interativos |
| RNF-A11Y-04 | Labels ARIA em elementos de formulário |

### 5.5. Testes

| Requisito | Especificação |
|---|---|
| RNF-TEST-01 | Testes unitários (Vitest) para funções de cálculo estatístico |
| RNF-TEST-02 | Testes unitários para funções de cor/escala D3 |
| RNF-TEST-03 | Testes de integração para endpoints da API |
| RNF-TEST-04 | CI/CD com GitHub Actions executando suite a cada PR |

### 5.6. Infraestrutura e Deploy

| Requisito | Especificação |
|---|---|
| RNF-INFRA-01 | Docker Compose para ambiente de desenvolvimento |
| RNF-INFRA-02 | Deploy via Docker em VPS ou cloud |
| RNF-INFRA-03 | Repositório GitHub público/privado |
| RNF-INFRA-04 | Executável desktop via Tauri (Windows/Linux/macOS) |

---

## 6. Fora de Escopo (V2.0)

- Inteligência artificial / machine learning para predições
- Chat / colaboração em tempo real entre usuários
- App mobile nativo (iOS/Android)
- Integração com SIGs de terceiros (ArcGIS, QGIS plugins)
- Multi-idioma (apenas Português Brasileiro na V2.0)
- Dashboard de monitoramento em tempo real (IoT sensors)

---

## 7. Cronograma de Alto Nível (Estimativa)

| Fase | Duração | Entregas |
|---|---|---|
| **Fase 0 — Planejamento** | 2 semanas | Documentação técnica completa (este documento e correlacionados) |
| **Fase 1 — Fundação** | 4 semanas | Setup, Auth, DB schema, API base, Martin config |
| **Fase 2 — Core Map** | 4 semanas | Módulo de Inteligência Espacial completo |
| **Fase 3 — Dashboard** | 3 semanas | Módulo Analítico + Dock de Comparação |
| **Fase 4 — Relatórios** | 2 semanas | Gerador de Dossiês + Export PDF |
| **Fase 5 — Catalog & Admin** | 3 semanas | Data Catalog + City Editor + Bulk Import |
| **Fase 6 — ETL Pipeline** | 3 semanas | Scripts de ingestão para 5 fontes + Airflow DAGs |
| **Fase 7 — Wiki & Polish** | 2 semanas | Documentação, testes E2E, executável desktop |
| **Fase 8 — QA & Launch** | 2 semanas | Testes, correções, deploy de produção |

**Total estimado:** ~25 semanas (~6 meses)

---

## 8. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| APIs públicas (IBGE, DATASUS) fora do ar | Alto | Médio | Cache agressivo + fallback para última versão |
| Performance de Vector Tiles com 5.570 municípios | Alto | Baixo | Teste de carga antecipado com Martin |
| Mudança de schema nas fontes de dados | Médio | Alto | Camada de abstração no ETL + alertas de mudança |
| Escopo creep nos relatórios | Médio | Alto | Template fixo + customização limitada à V2.1 |
| Disponibilidade de PostGIS em produção | Alto | Baixo | Docker com imagem oficial PostGIS |

---

## 9. Glossário

| Termo | Definição |
|---|---|
| **MVT** | Mapbox Vector Tiles — formato binário compacto para geometrias |
| **PostGIS** | Extensão geoespacial para PostgreSQL |
| **ETL** | Extract, Transform, Load — pipeline de dados |
| **RBAC** | Role-Based Access Control |
| **BFF** | Backend For Frontend — camada de API otimizada para o frontend |
| **IDHM** | Índice de Desenvolvimento Humano Municipal |
| **IBGE** | Instituto Brasileiro de Geografia e Estatística |
| **DATASUS** | Departamento de Informática do SUS |
| **FINBRA** | Finanças do Brasil (portal SICONFI/STN) |
| **SNIS** | Sistema Nacional de Informações sobre Saneamento |
| **Coroplético** | Mapa temático onde áreas são coloridas proporcionalmente a dados |
| **Tauri** | Framework para criar aplicações desktop a partir de web apps |
