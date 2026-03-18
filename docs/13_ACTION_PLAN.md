# Plano de Ação e Cronograma de Execução

## SisInfo / GeoIntel — V2

**Status:** Aprovado / Em andamento  
**Duração Estimada:** 36 semanas (~9 meses)  
**Revisão:** Março/2026 (v2 — cronograma ajustado com buffers e ETL antecipado)

---

## 1. Visão Geral do Cronograma

O projeto está estruturado em 8 fases principais + 3 buffers estratégicos, adotando uma abordagem iterativa e incremental (Sprints de 2 semanas). O foco inicial é estabelecer a fundação de infraestrutura e dados (incluindo carga preliminar via ETL), seguido pelo desenvolvimento do *Core Map* e *Dashboard*, e finalizando com processos de qualidade, empacotamento desktop (Tauri) e Go-Live.

**Princípios de Execução:**
- Testes unitários são escritos **junto com cada feature**, não ao final
- API contracts são definidos **antes** do desenvolvimento simultâneo front/back
- Deploy em staging é feito **antes** do Go-Live para validação com usuários reais
- ETL começa na Fase 1 (scripts de extração) para garantir dados reais no banco

---

## 2. Cronograma Detalhado (Work Breakdown Structure - WBS)

### Fase 0: Planejamento (Semanas 1 e 2)
*Objetivo: Finalizar e aprovar toda a documentação técnica.*
* **Semana 1:** 
  * Revisão do PRD, Arquitetura e Modelagem do Banco (Schema).
  * Definição da stack final e designação da equipe.
  * Definição de API contracts (OpenAPI spec) para trabalho paralelo front/back.
* **Semana 2:** 
  * Especificação de APIs, UI/UX (Figma) e estratégias de Testes / DevOps.
  * Consolidação da decisão de desktop: **Tauri** (Electron descartado).
  * *Entregável:* Documentação técnica completa (`docs/`), API contracts publicados.
  * **Critérios de aceite:** Todos os 13 documentos revisados e aprovados pelo Tech Lead e PO. API contracts em formato OpenAPI YAML disponíveis no repo.

### Fase 1: Fundação + Seed Data (Semanas 3 a 8)
*Objetivo: Infraestrutura completa, banco populado com dados reais, API base funcional.*
* **Semanas 3 e 4:** 
  * Setup do repositório (GitHub), CI/CD (GitHub Actions) e ambientes (Dev/Staging).
  * Configuração Docker Compose (PostgreSQL + PostGIS, Redis, Martin).
  * Inicialização dos projetos Frontend (Vite + React + TypeScript) e Backend (FastAPI).
* **Semanas 5 e 6:** 
  * Criação das migrações do banco (Alembic) e schema base completo.
  * Módulo de Segurança completo: Autenticação JWT (access + refresh tokens), login, RBAC (VIEWER, ANALYST, ADMIN), rate limiting (SlowAPI) e serviço de auditoria.
  * Configuração e teste do servidor de Vector Tiles (Martin).
* **Semanas 7 e 8:**
  * **Seed Data:** Carga inicial dos 5.570 municípios + geometrias do IBGE (GeoJSON → PostGIS).
  * **ETL Preliminar:** Scripts de extração e transformação para 2 fontes prioritárias (IBGE/SIDRA e IPEADATA) — sem orquestração Airflow ainda, execução manual.
  * Cadastro de indicadores base e criação de usuários iniciais (Admin).
  * Script `init_db.py` funcional.
  * *Entregável:* API respondendo autenticação, banco com 5.570 municípios com geometrias e dados de ≥3 indicadores, Martin servindo tiles, CI pipeline verde.
  * **Critérios de aceite:** `POST /auth/login` retornando JWT válido; `SELECT COUNT(*) FROM municipios` = 5.570; Martin respondendo em `/catalog`; GitHub Actions CI passando.

### Fase 2: Core Map — Módulo de Inteligência Espacial (Semanas 9 a 14)
*Objetivo: Renderização rápida de mapas com PostGIS e Martin usando dados reais.*
* **Semanas 9 e 10:** 
  * Integração MapLibre GL JS no Frontend.
  * Consumo de Vector Tiles (MVT) do Martin com as malhas municipais do IBGE.
  * Controles básicos de mapa: Zoom, Pan, Basemaps (Satélite, Light, Dark).
  * Barra de pesquisa para encontrar localidade (US-MAP-08).
* **Semanas 11 e 12:** 
  * Visualização Coroplética com dados reais (cores baseadas em Índice Posicional).
  * Interatividade: Clique nos polígonos, Bottom Sheet com KPIs e sparklines (US-MAP-05).
  * Filtros espaciais dinâmicos por Estado e Região (US-MAP-02).
* **Semanas 13 e 14:**
  * Slider temporal (2010–2024) para evolução histórica (US-MAP-04).
  * Alternância de indicadores via checkboxes (US-MAP-03).
  * Alternância de camadas (Limites, Densidade) (US-MAP-06).
  * Testes unitários (Vitest) para funções de cor/escala D3 e formatadores.
  * *Entregável:* Mapa cobrindo 5.570 municípios a 60fps, todas as 8 user stories US-MAP aceitas.
  * **Critérios de aceite:** First Meaningful Paint < 2s medido via Chrome DevTools Performance; 60fps durante pan/zoom confirmado em laptop i5/16GB; Bottom Sheet abre em < 300ms.

### Buffer 1 (Semana 15)
*Correção de bugs, débito técnico, ajustes baseados na review da Sprint. Retrospectiva da primeira metade do projeto.*

### Fase 3: Dashboard Analítico (Semanas 16 a 19)
*Objetivo: Criação dos componentes gráficos e comparativos com dados reais.*
* **Semanas 16 e 17:** 
  * Layout Bento Grid no perfil do município.
  * 4 KPIs globais no topo (Health, Education, Economic, Sustainability) (US-DASH-01).
  * Implementação de gráficos (Recharts): barras, linhas de tendência (US-DASH-02), ranking (US-DASH-03).
* **Semanas 18 e 19:** 
  * Comparativo setorial — barras horizontais duplas (US-DASH-04).
  * Radar chart multidimensional (US-DASH-05).
  * *Dock de Comparação:* Chips glassmorphism + "Compare with..." + limite de 5 cidades (US-DASH-06).
  * Botão "Generate Analysis" para reprocessar gráficos com N cidades (US-DASH-07).
  * Testes unitários para stores Zustand (ComparisonStore) e gráficos.
  * *Entregável:* Dashboard interativo integrado aos dados do município selecionado no mapa, dock funcional.
  * **Critérios de aceite:** Recharts renderiza em < 500ms; Dock suporta 5 cidades com remoção/adição sem erros; "Generate Analysis" atualiza todos os widgets.

### Fase 4: Gerador de Relatórios (Semanas 20 a 22)
*Objetivo: Exportação e visualização otimizada para impressão.*
* **Semana 20:** 
  * Criação da view "Estilo A4" (Dossiê Executivo) (US-REP-01, US-REP-04).
  * Grid de KPIs minimalista (US-REP-05) e gráficos estáticos (US-REP-06).
* **Semana 21:** 
  * Otimização de CSS para `@media print` (remoção de sidebars e interatividade) (US-REP-03).
  * Tabela zebrada com badges de status (US-REP-07).
  * Área de assinaturas e selo digital (US-REP-08).
* **Semana 22:**
  * Geração de PDF via biblioteca server-side ou print nativo otimizado (US-REP-02).
  * Parametrização dos dados consolidados no dossiê.
  * *Entregável:* Exportação de relatórios profissionais em modo página.
  * **Critérios de aceite:** `@media print` oculta sidebar, header, botões flutuantes; layout fiel a 210mm × 297mm; PDF gerado em < 3s; numeração de página visível.

### Buffer 2 (Semana 23)
*Retrospectiva, re-planejamento, ajuste de prioridades para a segunda metade. Decisão Go/No-Go para fases opcionais (Wiki).*

### Fase 5: Data Catalog & Área Administrativa (Semanas 24 a 27)
*Objetivo: Gestão de dados, dicionário e inserção de dados curados.*

**Sub-módulo 5A: Data Catalog (Semanas 24 e 25)**
  * UI de Catálogo de Dados: busca de datasets, cards com metadados (US-CAT-01 a US-CAT-03).
  * Dicionário de dados (campos, tipos, descrições) (US-CAT-04).
  * Download RAW em CSV (US-CAT-05).
  * Indicadores derivados e status LGPD (US-CAT-06, US-CAT-07).

**Sub-módulo 5B: Área Admin (Semanas 26 e 27)**
  * City Editor para edições de metadados, geometria e séries temporais (US-ADM-01 a US-ADM-03).
  * *Bulk Import:* Interface com Stepper (Upload → Map Columns → Validate) (US-ADM-04 a US-ADM-06).
  * *Entregável:* Catálogo governamental ativo e rota de importação para o Admin.
  * **Critérios de aceite:** Busca de datasets retorna resultados em < 500ms; Bulk Import com CSV de 50.000 linhas completa em < 30s; validação pré-import detecta ≥95% dos erros.

### Fase 6: ETL Pipeline Completo + Orquestração (Semanas 28 a 30)
*Objetivo: Completar ingestão das fontes restantes e automatizar com Airflow.*
* **Semana 28:** 
  * Scripts de extração e transformação para fontes restantes: DATASUS, SNIS, SICONFI/FINBRA.
  * Nota: DATASUS requer download manual + validação (sem API REST confiável).
* **Semana 29:**
  * Pipeline de Transformação completo: limpeza, tipagem, melt wide→long, fix IBGE 6→7, cálculo de Índice Posicional.
  * Validação automatizada pré-load (checklist de 6 verificações).
* **Semana 30:** 
  * Orquestração via Apache Airflow: 7 DAGs configuradas.
  * Scripts de carga (Load) performáticos com upsert (INSERT...ON CONFLICT).
  * Refresh de materialized views + invalidação de cache Redis.
  * *Entregável:* Base de dados populada com 5 fontes, pipeline automatizado.
  * **Critérios de aceite:** ≥90% dos 5.570 municípios com dados de ≥5 indicadores; DAGs executando sem falhas em 3 execuções consecutivas; taxa de erro do pipeline < 2%.

### Fase 7: Tauri (Desktop), Wiki e Refinamento (Semanas 31 a 33)
*Objetivo: Empacotamento para Windows/Linux e manuais.*
* **Semana 31:** 
  * Setup do Tauri: Rust toolchain, WebView2, configuração `tauri.conf.json`.
  * Build inicial do projeto para Windows (.exe / .msi).
* **Semana 32:** 
  * Build para Linux (.AppImage / .deb).
  * Criação da tela de Help/Wiki: árvore de tópicos, TOC, tipografia (US-WIKI-01 a US-WIKI-03).
* **Semana 33:**
  * Tutoriais com passos numerados e tabelas de fórmulas (US-WIKI-04, US-WIKI-05).
  * Refinamentos de UI/UX, revisão de acessibilidade (cores, contraste WCAG AA) e responsividade.
  * *Entregável:* Instalador desktop funcional (Windows + Linux) e material de ajuda embutido.
  * **Critérios de aceite:** Executáveis gerados e instaláveis sem erros em Windows 10/11 e Ubuntu 22.04; Wiki com ≥10 artigos publicados; contraste WCAG AA verificado via axe-core.

### Fase 8: QA, Staging & Lançamento (Semanas 34 a 35)
*Objetivo: Homologação em staging, correção de bugs e preparação para Go-Live.*
* **Semana 34:** 
  * Deploy completo no ambiente de **Staging** (`staging.geointel.gov.br`).
  * Testes E2E (Playwright): 5 cenários críticos (login→mapa, dashboard→dock, relatório→PDF, catalog→busca, admin→bulk import).
  * Testes de carga: simulação de 50 usuários concorrentes (Locust/k6).
  * Bug Bash focado em segurança (JWT, RBAC, rate limiting) e consistência de dados.
* **Semana 35:** 
  * **UAT (User Acceptance Testing):** Validação com ≥3 usuários-chave reais no staging.
  * Correção de bugs críticos e P0s identificados no UAT.
  * Treinamento para os usuários-chave / Admins.
  * Preparação de deploy de produção (certificados SSL, DNS, backup plan).
  * *Entregável:* Staging validado e aprovado para produção.
  * **Critérios de aceite:** 100% dos testes E2E passando; 0 bugs P0/P1 abertos; staging estável por 48h; ≥3 aprovações de UAT documentadas.

### Buffer Final + Go-Live (Semana 36)
* Correções finais de última hora.
* Deploy final nos servidores de Produção.
* Monitoramento intensivo 48h pós-deploy.
* Go-Live Institucional.
* *Entregável:* V2 do SisInfo/GeoIntel em Produção Estável.

---

## 3. Marcos Críticos de Entrega (Milestones)

| Milestone | Fase Relativa | Semana | Critérios Mensuráveis |
| :--- | :--- | :--- | :--- |
| **M0: Spec Lock** | Fim da Fase 0 | Sem. 2 | 13 documentos aprovados; API contracts em OpenAPI YAML no repo |
| **M1: Alpha Build** | Fim da Fase 1 | Sem. 8 | JWT funcional; 5.570 municípios + geometrias no banco; Martin servindo tiles; CI verde; dados de ≥3 indicadores carregados |
| **M2: Beta Map** | Fim da Fase 2 | Sem. 14 | 8 US-MAP aceitas; FMP < 2s; 60fps no pan/zoom |
| **M3: MVP Funcional** | Fim da Fase 3 | Sem. 19 | 7 US-DASH aceitas; dock com 5 cidades; dashboard + mapa integrados |
| **M4: Reports Ready** | Fim da Fase 4 | Sem. 22 | PDF gerado em < 3s; layout A4 fiel; @media print correto |
| **M5: Content Ready** | Fim da Fase 6 | Sem. 30 | 5 fontes ETL operacionais; ≥90% municípios com dados de ≥5 indicadores |
| **M6: Desktop Ready** | Fim da Fase 7 | Sem. 33 | Executáveis .exe e .deb gerados e testados; Wiki com ≥10 artigos |
| **M7: Go-Live** | Fim da Fase 8 | Sem. 36 | 100% E2E passando; staging validado por ≥3 usuários; produção estável 48h |

---

## 4. Dinâmica de Execução (Gestão Ágil)

Para garantir o cumprimento do cronograma, aplica-se:

1. **Sprints de 2 Semanas:** Planejamento e encerramento a cada 10 dias úteis.
2. **Daily Stand-ups:** Máximo de 15 minutos para acompanhar impedimentos na integração (ex.: Backend bloqueando Frontend).
3. **Review & Retrospectiva (ao fim da Sprint):** Demonstração do software funcionando (ex.: mostrar camada do Martin renderizando novos dados; demonstrar o ETL puxando do DATASUS).
4. **Gerenciamento de Cards:** Uso de GitHub Projects com colunas: *Backlog*, *To Do*, *In Progress*, *Code Review*, *QA*, *Done*.
5. **Testes contínuos:** Testes unitários escritos junto com cada feature (meta: 70% cobertura frontend, 75% cobertura backend por Sprint).
6. **API contracts first:** OpenAPI spec publicada antes do desenvolvimento paralelo front/back. Mock server (MSW/Prism) para desbloqueio do frontend.
7. **Definition of Done (DoD):** Feature só é "Done" quando tem testes unitários, code review aprovado, e documentação atualizada.

---

## 5. Matriz de Alocação (Equipe Recomendada)

Para execução das 36 semanas, a seguinte composição de equipe (squad) é aconselhada:

- **1 Tech Lead / Full Cycle Engineer:** Foco em DevOps, Airflow, Martin e arquitetura.
- **1 Desenvolvedor Backend (Python/FastAPI):** Foco em API, Banco e performance do PostGIS.
- **1 Desenvolvedor Frontend / Especialista WebGIS:** Foco em MapLibre, React e Recharts.
- **1 Engenheiro de Dados:** Foco nos pipelines de ETL e limpeza da base histórica.
- *(Opcional)* **1 UI/UX Designer:** Atuando em part-time nas primeiras 14 semanas para design system.
- *(Opcional)* **1 Product Owner (PM):** Gestão das sprints e aprovação das entregas de negócios.

*Nota:* Se algum recurso acumular funções, os prazos devem ser estendidos proporcionalmente. Com equipe de 2 devs acumulando funções, estimar 12–15 meses de execução, gerenciado via mitigação de riscos abaixo.

---

## 6. Gestão de Riscos por Fase

| Fase | Risco Principal | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| Fase 1 | Docker/PostGIS incompatibilidades em ambiente Windows de devs | Médio | Alto | Testar setup em WSL2; documentar workarounds |
| Fase 2 | Performance de 5.570 polígonos no MapLibre | Baixo | Alto | Simplificar geometrias (tolerance 0.005); testar em hardware mínimo |
| Fase 3 | Recharts lento com séries temporais longas | Médio | Médio | Pré-agregar dados no backend; limitar janela temporal |
| Fase 5 | Bulk Import com CSVs mal-formatados de clientes | Alto | Médio | Validação rigorosa + preview antes de persistir |
| Fase 6 | APIs públicas (DATASUS) fora do ar | Alto | Alto | Cache agressivo + fallback para última versão; download manual como plano B |
| Fase 6 | Schema das fontes mudou (colunas inesperadas) | Médio | Alto | Camada de abstração no ETL + alertas de mudança (monitoramento em `sources.yaml`) |
| Fase 7 | Compilação Tauri falha em plataformas específicas | Médio | Médio | CI/CD com matrix build (Windows + Linux); macOS como P2 |
| Fase 8 | Bugs P0 descobertos no UAT exigindo refactor | Médio | Alto | Buffer de 1 semana antes do Go-Live; rollback plan documentado |
