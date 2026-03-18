# Product Backlog — SisInfo / GeoIntel V2

**Última atualização:** Março/2026  
**Método de priorização:** MoSCoW (Must / Should / Could / Won't)  
**Estimativas:** Story Points (Fibonacci: 1, 2, 3, 5, 8, 13, 21)

> **Legenda de Status:**  
> 🔴 Não iniciado · 🟡 Em andamento · 🟢 Concluído · ⚪ Bloqueado

---

## Resumo por Épico

| # | Épico | Stories | Total SP | Fase |
|---|---|---|---|---|
| E0 | Planejamento e Especificação | 6 | 26 | Fase 0 |
| E1 | Fundação e Infraestrutura | 14 | 78 | Fase 1 |
| E2 | Core Map — Inteligência Espacial | 12 | 68 | Fase 2 |
| E3 | Dashboard Analítico | 10 | 55 | Fase 3 |
| E4 | Gerador de Relatórios | 8 | 34 | Fase 4 |
| E5 | Data Catalog | 7 | 29 | Fase 5A |
| E6 | Área Administrativa | 7 | 37 | Fase 5B |
| E7 | ETL Pipeline Completo | 10 | 55 | Fase 6 |
| E8 | Tauri Desktop | 5 | 21 | Fase 7 |
| E9 | Wiki e Documentação | 6 | 18 | Fase 7 |
| E10 | QA, Staging e Go-Live | 8 | 34 | Fase 8 |
| **Total** | | **93** | **455** | |

---

## E0 — Planejamento e Especificação

**Fase:** 0 (Semanas 1–2) · **Prioridade:** Must-Have

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E0-01 | Task | Revisão e aprovação do PRD | 5 | Must | 🟢 | PRD v2.0 revisado por Tech Lead e PO; sem itens em aberto |
| E0-02 | Task | Revisão da Arquitetura e stack final | 5 | Must | 🟢 | `02_ARCHITECTURE.md` congelado; Tauri confirmado como unica opção desktop |
| E0-03 | Task | Revisão do Schema do Banco | 3 | Must | 🟢 | `03_DATABASE_SCHEMA.md` aprovado; todas as tabelas e índices documentados |
| E0-04 | Task | Definição de API contracts (OpenAPI) | 8 | Must | 🔴 | Arquivo `openapi.yaml` no repo com todos os endpoints de `/api/v1`; validado com Swagger |
| E0-05 | Task | Revisão da Estratégia de Testes | 3 | Must | 🟢 | `12_TESTING_STRATEGY.md` aprovado; pirâmide de testes definida |
| E0-06 | Task | Designação de equipe e responsabilidades | 2 | Must | 🔴 | Matrix RACI publicada; cada membro sabe suas responsabilidades |

---

## E1 — Fundação e Infraestrutura

**Fase:** 1 (Semanas 3–8) · **Prioridade:** Must-Have

### Sprint 1 (Semanas 3–4): Setup de Infraestrutura

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E1-01 | Task | Setup do repositório GitHub (branches, protection rules) | 3 | Must | 🟢 | Repo criado; branch `main` protegida com regras de PR; `develop` ativa |
| E1-02 | Task | Configurar Docker Compose dev (PostgreSQL + PostGIS + Redis + Martin) | 8 | Must | 🔴 | `docker compose up` sobe 4 serviços sem erros; `PostGIS_Version()` retorna 3.4+; Martin responde em `/catalog` |
| E1-03 | Task | Inicializar projeto Frontend (Vite + React + TypeScript + Tailwind) | 5 | Must | 🔴 | `npm run dev` abre em `localhost:5173`; TypeScript strict habilitado; Tailwind configurado |
| E1-04 | Task | Inicializar projeto Backend (FastAPI + SQLAlchemy + Alembic) | 5 | Must | 🔴 | `uvicorn app.main:app` responde em `localhost:8000/docs` (Swagger); Alembic inicializado |
| E1-05 | Task | Configurar CI pipeline (GitHub Actions) | 5 | Must | 🔴 | PR para `main` dispara: lint + type-check + testes (front e back) + build; status check obrigatório |
| E1-06 | Task | Criar `.env.example` e documentar variáveis | 2 | Must | 🔴 | Todas as variáveis documentadas; copiar `.env.example` → `.env` funciona sem ajustes para dev |

### Sprint 2 (Semanas 5–6): Segurança e Schema

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E1-07 | Story | Como admin, quero fazer login com email/senha para acessar o sistema | 8 | Must | 🔴 | `POST /auth/login` retorna `access_token` (1h) e `refresh_token` (7d); senha hasheada com bcrypt; token JWT válido com claims `sub`, `email`, `roles` |
| E1-08 | Story | Como usuário autenticado, quero renovar meu token sem relogar | 3 | Must | 🔴 | `POST /auth/refresh` retorna novo `access_token`; refresh expirado retorna 401 |
| E1-09 | Task | Implementar RBAC (VIEWER, ANALYST, ADMIN) | 5 | Must | 🔴 | Middleware `require_role()` funcional; VIEWER não acessa `/admin/*`; testes de integração para 3 roles |
| E1-10 | Task | Implementar rate limiting (SlowAPI + Redis) | 3 | Should | 🔴 | 120 req/min por IP; exceder retorna 429 |
| E1-11 | Task | Criar migrações Alembic com schema completo | 5 | Must | 🔴 | `alembic upgrade head` cria todas as tabelas de `03_DATABASE_SCHEMA.md`; rollback funcional |

### Sprint 3 (Semanas 7–8): Seed Data e ETL Preliminar

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E1-12 | Task | Carga inicial de 5.570 municípios + geometrias IBGE no PostGIS | 8 | Must | 🔴 | `SELECT COUNT(*) FROM municipios` = 5.570; geometrias válidas (`ST_IsValid`); SRID 4326 |
| E1-13 | Task | Scripts ETL para IBGE/SIDRA e IPEADATA (execução manual) | 8 | Must | 🔴 | Dados de ≥3 indicadores (PIB, População, IDHM) carregados para ≥90% dos municípios; Índice Posicional calculado |
| E1-14 | Task | Script `init_db.py` (seed de usuário admin + indicadores base) | 3 | Must | 🔴 | Usuário admin padrão criado; catalogo de indicadores base populado; script idempotente |

---

## E2 — Core Map — Inteligência Espacial

**Fase:** 2 (Semanas 9–14) · **Prioridade:** Must-Have (P0)

### Sprint 4 (Semanas 9–10): Mapa Base

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E2-01 | Task | Integrar MapLibre GL JS no Frontend | 5 | Must | 🔴 | Mapa renderiza em componente React; WebGL ativo; sem erros de console |
| E2-02 | Story | **US-MAP-07** — Como analista, quero mudar estilo de mapa (escuro, claro, satélite) | 3 | Must | 🔴 | Toggle entre ≥3 basemaps; transição suave sem reload do mapa |
| E2-03 | Task | Configurar consumo de Vector Tiles (MVT) do Martin | 5 | Must | 🔴 | MapLibre consome tiles do Martin; 5.570 polígonos renderizam; FMP < 2s |
| E2-04 | Task | Implementar controles de mapa (Zoom, Pan, Geolocation) | 2 | Must | 🔴 | Zoom in/out suave; pan sem lag; botão de geolocalização funcional |
| E2-05 | Story | **US-MAP-08** — Como analista, quero usar barra de pesquisa para encontrar localidade | 5 | Must | 🔴 | Autocomplete filtra municípios por nome; selecionar navega/zoom para o município; debounce de 300ms |

### Sprint 5 (Semanas 11–12): Coropléticos e Interatividade

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E2-06 | Story | **US-MAP-01** — Como analista, quero visualizar mapa coroplético de qualquer indicador | 8 | Must | 🔴 | Polígonos coloridos pelo Índice Posicional com escala Viridis; legenda visível; recolorir em < 500ms |
| E2-07 | Story | **US-MAP-05** — Como analista, quero clicar num município e ver Bottom Sheet com KPIs | 8 | Must | 🔴 | Bottom Sheet abre com animação `translate-y` < 300ms; exibe nome, tag tier, KPI cards com sparklines; tabela benchmark vs média estadual; botões "Relatório" e "Comparar" |
| E2-08 | Story | **US-MAP-02** — Como analista, quero filtrar por Estado, Município e Zona | 5 | Must | 🔴 | Dropdown de estado filtra polígonos visíveis; filtro de zona funcional; reset limpa filtros |
| E2-09 | Task | Implementar API `GET /api/v1/municipios/{codigo}` (detalhe com KPIs) | 5 | Must | 🔴 | P95 latência < 300ms; retorna indicadores + ranking + sparkline data; cache Redis 15min |

### Sprint 6 (Semanas 13–14): Indicadores e Evolução Temporal

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E2-10 | Story | **US-MAP-03** — Como analista, quero alternar entre indicadores via checkboxes | 3 | Must | 🔴 | Checkboxes para População, PIB, IDHM; alternar recolore mapa em < 500ms; indicador ativo destacado |
| E2-11 | Story | **US-MAP-04** — Como analista, quero deslizar no slider temporal (2010–2024) | 8 | Must | 🔴 | Slider com anos discretos; arrastar atualiza mapa em tempo real; animação play/pause automática |
| E2-12 | Story | **US-MAP-06** — Como analista, quero alternar camadas (Limites, Densidade) | 3 | Must | 🔴 | Toggles para camadas; ativar/desativar sem flicker; camadas sobrepostas corretamente |

**Testes obrigatórios da fase:**
- Unitários: funções `createColorScale`, `getIndicatorColor`, formatadores (Vitest)
- Performance: 60fps confirmado em Chrome DevTools durante pan/zoom em laptop i5/16GB

---

## E3 — Dashboard Analítico

**Fase:** 3 (Semanas 16–19) · **Prioridade:** Must-Have (P0)

### Sprint 7 (Semanas 16–17): Layout e Gráficos Base

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E3-01 | Task | Implementar layout Bento Grid no perfil do município | 5 | Must | 🔴 | Grid responsivo (min 1280px); fundo cinza claro; gap consistente entre cards |
| E3-02 | Story | **US-DASH-01** — Como analista, quero ver 4 KPIs globais no topo | 5 | Must | 🔴 | 4 cards (Health, Education, Economic, Sustainability) com ícone, valor formatado, trend arrow e sparkline |
| E3-03 | Story | **US-DASH-02** — Como analista, quero ver gráfico de Performance Over Time | 5 | Must | 🔴 | Gráfico de área/linha (Recharts) com série temporal; tooltip com valores; eixos formatados |
| E3-04 | Story | **US-DASH-03** — Como analista, quero ver ranking de Top Performing Localities | 3 | Must | 🔴 | Lista rankeada com badges (1º, 2º, 3º); valor do indicador formatado; clicável para navegar |
| E3-05 | Task | Implementar API `GET /api/v1/indicadores/dashboard` | 5 | Must | 🔴 | Retorna KPIs agregados + série temporal + ranking; P95 < 300ms; dados pré-agregados |

### Sprint 8 (Semanas 18–19): Comparação e Análise Cruzada

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E3-06 | Story | **US-DASH-04** — Como analista, quero ver comparativo setorial (barras horizontais duplas) | 5 | Must | 🔴 | Gráfico de barras horizontais com 2 séries; labels legíveis; cores distintas por dimensão |
| E3-07 | Story | **US-DASH-05** — Como analista, quero ver radar chart multidimensional | 5 | Must | 🔴 | Radar com ≥5 eixos; label por eixo; preenchimento semi-transparente; responsivo |
| E3-08 | Story | **US-DASH-06** — Como analista, quero usar o Dock de Comparação | 8 | Must | 🔴 | Dock fixo na base com glassmorphism; chips com nome + botão ×; botão "+ Compare with..." abre busca; limite de 5 cidades; estado persistido no Zustand |
| E3-09 | Story | **US-DASH-07** — Como analista, quero gerar análise cruzada ao clicar "Generate Analysis" | 5 | Must | 🔴 | Botão reprocessa todos os gráficos com N cidades selecionadas; loading state; dados do backend |
| E3-10 | Task | Testes unitários para ComparisonStore (Zustand) | 2 | Must | 🔴 | Testes para: addCity, removeCity, limite de 5, duplicatas, clearAll |

---

## E4 — Gerador de Relatórios (Dossiê Executivo)

**Fase:** 4 (Semanas 20–22) · **Prioridade:** Must-Have (P0)

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E4-01 | Story | **US-REP-01** — Como gestor, quero ver relatório formatado em layout A4 | 5 | Must | 🔴 | Página simula folha A4 (210×297mm); sombra de folha; fundo cinza externo |
| E4-02 | Story | **US-REP-04** — Como gestor, quero ver sumário executivo com resumo descritivo | 3 | Must | 🔴 | Parágrafo contextual gerado dinamicamente com dados do município |
| E4-03 | Story | **US-REP-05** — Como gestor, quero ver grid de KPIs minimalista | 3 | Must | 🔴 | Grid 2×3 com KPIs formatados; sem interatividade; cores sóbrias |
| E4-04 | Story | **US-REP-06** — Como gestor, quero ver gráficos estáticos (radar + barras) | 5 | Must | 🔴 | Recharts em modo estático (sem tooltip/hover); dimensionados para A4 |
| E4-05 | Story | **US-REP-07** — Como gestor, quero ver tabela zebrada com badges de status | 3 | Must | 🔴 | Tabela zebrada; badges coloridos (Verde/Amarelo/Vermelho); legenda |
| E4-06 | Story | **US-REP-08** — Como gestor, quero ver área de assinaturas e selo digital | 2 | Should | 🔴 | Linhas de assinatura com underline; selo com data/hora de geração |
| E4-07 | Story | **US-REP-03** — Como gestor, quero imprimir relatório sem artefatos de UI | 5 | Must | 🔴 | `@media print` oculta sidebar, header, botões; sombra removida; numeração de página; layout 210×297mm |
| E4-08 | Story | **US-REP-02** — Como gestor, quero exportar em PDF com um clique | 8 | Must | 🔴 | Botão "Exportar PDF"; PDF gerado em < 3s; conteúdo fiel ao layout A4; download automático |

---

## E5 — Data Catalog (Repositório de Bases e Metadados)

**Fase:** 5A (Semanas 24–25) · **Prioridade:** Should-Have (P1)

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E5-01 | Story | **US-CAT-01** — Como pesquisador, quero buscar datasets por nome ou setor | 5 | Should | 🔴 | Input de busca com autocomplete; filtro por setor (dropdown); resultados em < 500ms |
| E5-02 | Story | **US-CAT-02** — Como pesquisador, quero ver cards de dataset com fonte, frequência e atualização | 3 | Should | 🔴 | Cards com: ícone de fonte, nome, frequência de atualização, data da última atualização, contagem de registros |
| E5-03 | Story | **US-CAT-03** — Como pesquisador, quero abrir documentação detalhada do dataset | 3 | Should | 🔴 | Modal ou página com: descrição completa, metodologia, cobertura temporal, limitações |
| E5-04 | Story | **US-CAT-04** — Como pesquisador, quero ver dicionário de dados (campos, tipos, descrições) | 5 | Should | 🔴 | Tabela com colunas: nome do campo, tipo, descrição, exemplo; ordenável |
| E5-05 | Story | **US-CAT-05** — Como pesquisador, quero baixar RAW em CSV | 3 | Should | 🔴 | Botão "Download CSV"; download inicia em < 2s; CSV com headers corretos e encoding UTF-8 |
| E5-06 | Story | **US-CAT-06** — Como pesquisador, quero ver indicadores derivados da base | 5 | Should | 🔴 | Lista de indicadores que usam o dataset como fonte; link para fórmula no Wiki |
| E5-07 | Story | **US-CAT-07** — Como pesquisador, quero verificar status de governança (LGPD) | 5 | Should | 🔴 | Badge de status LGPD (Aberto/Restrito/Sensível); tooltip com justificativa |

---

## E6 — Área Administrativa (City Editor & Bulk Import)

**Fase:** 5B (Semanas 26–27) · **Prioridade:** Should-Have (P1)

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E6-01 | Story | **US-ADM-01** — Como admin, quero editar metadados primários de um município | 3 | Should | 🔴 | Formulário inline; salvar via `PUT /admin/municipios/{id}`; log de auditoria |
| E6-02 | Story | **US-ADM-02** — Como admin, quero editar geometria via editor visual de polígonos | 8 | Could | 🔴 | Editor de polígono sobre MapLibre; drag de vértices; salvar atualiza PostGIS; preview antes de confirmar |
| E6-03 | Story | **US-ADM-03** — Como admin, quero editar séries temporais de indicadores inline | 5 | Should | 🔴 | Tabela editável com ano × valor; auto-save com debounce; validação de tipo numérico |
| E6-04 | Story | **US-ADM-04** — Como admin, quero importar CSV em massa (Bulk Import) | 8 | Should | 🔴 | Upload de CSV até 50MB; barra de progresso; processamento em background |
| E6-05 | Story | **US-ADM-05** — Como admin, quero mapear colunas do CSV para campos do sistema | 5 | Should | 🔴 | Modal Stepper (Upload → Map Columns → Validate); detecção automática de colunas; select dropdown para mapeamento; alerta para obrigatórias não mapeadas |
| E6-06 | Story | **US-ADM-06** — Como admin, quero ver validação pré-import com alertas | 5 | Should | 🔴 | Preview de N primeiras linhas; contador de erros por tipo; opção de prosseguir com warnings |
| E6-07 | Task | Implementar serviço de auditoria (`audit_service.py`) | 3 | Must | 🔴 | Todos os CRUDs de admin logam: user_id, ação, entidade, diff (old → new), IP, timestamp |

---

## E7 — ETL Pipeline Completo

**Fase:** 6 (Semanas 28–30) · **Prioridade:** Must-Have (P0)

### Sprint 13 (Semana 28): Fontes Restantes

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E7-01 | Task | Script de extração DATASUS/TABNET | 8 | Must | 🔴 | Processa CSVs manuais do TABNET; melt dos anos; split código município; ≥80% registros válidos |
| E7-02 | Task | Script de extração SNIS (saneamento) | 5 | Must | 🔴 | Lê CSV com encoding latin-1; melt wide→long; indicadores de saneamento carregados |
| E7-03 | Task | Script de extração SICONFI/FINBRA | 5 | Must | 🔴 | Parser com skiprows=3; concatena Conta+Coluna; normaliza valores monetários (vírgula decimal) |

### Sprint 14 (Semana 29): Pipeline de Transformação

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E7-04 | Task | Pipeline de limpeza de encoding (`clean_encoding.py`) | 3 | Must | 🔴 | Substitui marcadores de ausência por fonte; normaliza vírgula decimal; sem NaN residual |
| E7-05 | Task | Melt wide→long + correção IBGE 6→7 dígitos | 5 | Must | 🔴 | Formato longo com colunas padrão; ≥99% códigos corrigidos; log de não-corrigidos |
| E7-06 | Task | Cálculo de Índice Posicional para todos os indicadores | 5 | Must | 🔴 | IP normalizado 0–1; direção correta (maior_melhor vs invertida); singletons = 0.5; empates corretos |
| E7-07 | Task | Script de validação pré-load (`validate_output.py`) | 5 | Must | 🔴 | 6 verificações (código, valor, ano, integridade, duplicatas, outliers); relatório de erros < 2% |

### Sprint 15 (Semana 30): Orquestração e Carga

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E7-08 | Task | Configurar Apache Airflow com 7 DAGs | 8 | Must | 🔴 | DAGs executam no schedule definido; retries configurados; email on failure; UI do Airflow acessível |
| E7-09 | Task | Scripts de carga (Load) com upsert idempotente | 5 | Must | 🔴 | `INSERT...ON CONFLICT` funcional; re-executar DAG não duplica dados; refresh de materialized views |
| E7-10 | Task | Invalidação de cache Redis pós-ETL | 3 | Must | 🔴 | Após cada ETL run: keys de cache dos municípios afetados invalidadas; próxima consulta API retorna dados frescos |

**Critério de aceite da fase:** ≥90% dos 5.570 municípios com dados de ≥5 indicadores; DAGs executam 3 vezes consecutivas sem falhas.

---

## E8 — Tauri Desktop

**Fase:** 7 (Semanas 31–33) · **Prioridade:** Should-Have (P1)

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E8-01 | Task | Setup Rust + Tauri 2.x no projeto frontend | 5 | Should | 🔴 | `npx tauri init` executado; `tauri.conf.json` configurado; `npm run tauri dev` abre janela |
| E8-02 | Task | Configurar CSP e permissões (WebView2) | 3 | Should | 🔴 | CSP permite conexão ao backend remoto; fontes externas (Google Fonts) permitidas; sem erros de segurança |
| E8-03 | Task | Build Windows (.exe / .msi) | 5 | Should | 🔴 | Instalador MSI gerado; instala e executa sem erros em Windows 10/11; ícone e nome corretos |
| E8-04 | Task | Build Linux (.AppImage / .deb) | 5 | Should | 🔴 | Pacote .deb gerado; instala em Ubuntu 22.04; ícone no menu de aplicações |
| E8-05 | Task | Configurar CI para matrix build (Windows + Linux) | 3 | Could | 🔴 | GitHub Actions com matrix: gera executáveis para ambas plataformas em cada release tag |

---

## E9 — Wiki e Documentação do Usuário

**Fase:** 7 (Semanas 32–33) · **Prioridade:** Nice-to-Have (P2)

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E9-01 | Story | **US-WIKI-01** — Como usuário, quero navegar por árvore de tópicos na sidebar | 3 | Could | 🔴 | Sidebar com tree view colapsável; highlight do artigo ativo; responsiva |
| E9-02 | Story | **US-WIKI-02** — Como usuário, quero ler conteúdo com tipografia otimizada | 2 | Could | 🔴 | Fonte Inter/Roboto; max-width 720px; line-height 1.6; heading hierarchy |
| E9-03 | Story | **US-WIKI-03** — Como usuário, quero ver Table of Contents lateral | 3 | Could | 🔴 | TOC gerado automaticamente dos headings; scroll spy; sticky position |
| E9-04 | Story | **US-WIKI-04** — Como usuário, quero ver tutoriais com passos numerados | 3 | Could | 🔴 | Stepper visual com ícones; texto descritivo por passo; imagens inline |
| E9-05 | Story | **US-WIKI-05** — Como usuário, quero ver tabelas de fórmulas metodológicas | 5 | Could | 🔴 | Tabela com: nome da fórmula, expressão, variáveis, fonte; renderização LaTeX opcional |
| E9-06 | Story | **US-WIKI-06** — Como usuário, quero ver alertas e dicas destacados visualmente | 2 | Could | 🔴 | Componentes Info/Warning/Tip com ícone e cor; uso consistente em todos os artigos |

---

## E10 — QA, Staging e Go-Live

**Fase:** 8 (Semanas 34–36) · **Prioridade:** Must-Have

| ID | Tipo | Título | SP | Prioridade | Status | Critérios de Aceite |
|---|---|---|---|---|---|---|
| E10-01 | Task | Deploy completo no ambiente de Staging | 5 | Must | 🔴 | Todos os serviços rodando em `staging.geointel.gov.br`; HTTPS ativo; dados reais carregados |
| E10-02 | Task | Testes E2E — Cenário 1: Login → Mapa → Bottom Sheet | 3 | Must | 🔴 | Script Playwright passa: login, navega ao mapa, clica município, valida dados no Bottom Sheet |
| E10-03 | Task | Testes E2E — Cenário 2: Dashboard → Dock → Generate Analysis | 3 | Must | 🔴 | Script Playwright passa: navega, adiciona 3 cidades, clica gerar, valida gráficos atualizados |
| E10-04 | Task | Testes E2E — Cenário 3: Relatório → Layout A4 → PDF | 3 | Must | 🔴 | Script Playwright passa: navega, valida layout, clica exportar, valida download |
| E10-05 | Task | Testes E2E — Cenário 4: Catalog → Buscar → Detalhes | 3 | Must | 🔴 | Script Playwright passa: navega, busca dataset, abre detalhes, valida dicionário |
| E10-06 | Task | Testes E2E — Cenário 5: Admin → Bulk Import | 3 | Must | 🔴 | Script Playwright passa: login admin, upload CSV, mapeia colunas, valida resultado |
| E10-07 | Task | Testes de carga (50 usuários concorrentes) | 5 | Must | 🔴 | Locust/k6: P95 da API < 500ms com 50 users; sem erros 5xx; mapa carrega < 5s |
| E10-08 | Task | UAT com ≥3 usuários-chave + Go-Live | 8 | Must | 🔴 | ≥3 aprovações documentadas; 0 bugs P0/P1 abertos; produção estável 48h pós-deploy |

---

## Débito Técnico (Tech Debt) — Backlog Contínuo

Itens que podem surgir ao longo do desenvolvimento e devem ser priorizados nas retrospectivas:

| ID | Título | Prioridade | Critério para Endereçar |
|---|---|---|---|
| TD-01 | Cobertura de testes abaixo de 70% (frontend) ou 75% (backend) | Must | Qualquer Sprint Review que identifique queda |
| TD-02 | Queries do PostGIS lentas (> 300ms P95) | Must | Monitoramento de performance contínuo |
| TD-03 | Cache Redis com hit rate < 60% | Should | Revisão mensal de métricas |
| TD-04 | Dependências desatualizadas com vulnerabilidades (Dependabot) | Must | Alertas automáticos do GitHub |
| TD-05 | Acessibilidade WCAG AA não atingida (axe-core audit) | Should | Alerta do lighthouse CI |
| TD-06 | Documentação de código (JSDoc/docstrings) incompleta | Could | Revisão bi-sprint |

---

## Referência Cruzada: Backlog × Documentação

| Épico | Documentos de Referência |
|---|---|
| E0 | [01_PRD.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/01_PRD.md), [02_ARCHITECTURE.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/02_ARCHITECTURE.md) |
| E1 | [11_PROJECT_SETUP.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/11_PROJECT_SETUP.md), [08_DEVOPS_CICD.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/08_DEVOPS_CICD.md), [09_SECURITY_AUTH.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/09_SECURITY_AUTH.md) |
| E2 | [01_PRD.md §4.1](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/01_PRD.md), [06_FRONTEND_COMPONENTS.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/06_FRONTEND_COMPONENTS.md), [07_UI_UX_SPECIFICATION.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/07_UI_UX_SPECIFICATION.md) |
| E3 | [01_PRD.md §4.2](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/01_PRD.md), [06_FRONTEND_COMPONENTS.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/06_FRONTEND_COMPONENTS.md) |
| E4 | [01_PRD.md §4.3](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/01_PRD.md) |
| E5 | [01_PRD.md §4.4](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/01_PRD.md), [10_DATA_DICTIONARY.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/10_DATA_DICTIONARY.md) |
| E6 | [01_PRD.md §4.5](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/01_PRD.md), [09_SECURITY_AUTH.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/09_SECURITY_AUTH.md) |
| E7 | [05_ETL_PIPELINE.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/05_ETL_PIPELINE.md), [03_DATABASE_SCHEMA.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/03_DATABASE_SCHEMA.md) |
| E8 | [11_PROJECT_SETUP.md §5](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/11_PROJECT_SETUP.md), [08_DEVOPS_CICD.md §8](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/08_DEVOPS_CICD.md) |
| E9 | [01_PRD.md §4.6](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/01_PRD.md) |
| E10 | [12_TESTING_STRATEGY.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/12_TESTING_STRATEGY.md), [08_DEVOPS_CICD.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/08_DEVOPS_CICD.md) |
