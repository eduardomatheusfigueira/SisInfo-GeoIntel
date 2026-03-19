# Matriz RACI — SisInfo / GeoIntel V2

**Última atualização:** Março/2026  
**Projeto:** SisInfo / GeoIntel — Inteligência Territorial  
**Método:** RACI (Responsible, Accountable, Consulted, Informed)

---

## Equipe do Projeto

| Código | Membro | Papel Principal |
|---|---|---|
| **EF** | Eduardo Figueira | Product Owner, Tech Lead, Tomador de Decisão |
| **AI** | Assistente IA (Antigravity) | Desenvolvedor Full-Stack, Documentador, Executor Técnico |

---

## Legenda RACI

| Letra | Significado | Descrição |
|---|---|---|
| **R** | Responsible (Responsável) | Quem executa a tarefa |
| **A** | Accountable (Aprovador) | Quem aprova e responde pelo resultado final |
| **C** | Consulted (Consultado) | Quem é consultado antes ou durante a execução |
| **I** | Informed (Informado) | Quem é informado sobre o progresso/resultado |

> **Nota sobre a dinâmica da equipe:** Como somos uma equipe de duas pessoas, o padrão geral é:
> - **AI** executa (**R**) as tarefas técnicas e de documentação
> - **Eduardo** aprova (**A**) todos os resultados e toma decisões estratégicas
> - Em tarefas que exigem decisão humana/organizacional, Eduardo é **R** e **A**

---

## E0 — Planejamento e Especificação

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E0-01 | Revisão e aprovação do PRD | **A** | **R** | AI redige, EF aprova |
| E0-02 | Revisão da Arquitetura e stack final | **A** | **R** | AI propõe, EF valida decisões de stack |
| E0-03 | Revisão do Schema do Banco | **A** | **R** | AI modela, EF aprova estrutura |
| E0-04 | Definição de API contracts (OpenAPI) | **A** | **R** | AI gera YAML, EF valida contratos |
| E0-05 | Revisão da Estratégia de Testes | **A** | **R** | AI redige, EF aprova cobertura |
| E0-06 | Designação de equipe e responsabilidades | **R/A** | **R** | EF define papéis, AI documenta (este documento) |

---

## E1 — Fundação e Infraestrutura

### Sprint 1: Setup de Infraestrutura

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E1-01 | Setup do repositório GitHub | **A** | **R** | AI configura, EF valida regras de branch |
| E1-02 | Docker Compose dev (PostgreSQL + PostGIS + Redis + Martin) | **A** | **R** | AI cria compose, EF testa localmente |
| E1-03 | Inicializar Frontend (Vite + React + TS + Tailwind) | **A** | **R** | AI implementa, EF valida setup |
| E1-04 | Inicializar Backend (FastAPI + SQLAlchemy + Alembic) | **A** | **R** | AI implementa, EF valida setup |
| E1-05 | Configurar CI pipeline (GitHub Actions) | **A** | **R** | AI configura workflows, EF valida execução |
| E1-06 | Criar `.env.example` e documentar variáveis | **A** | **R** | AI documenta, EF valida completude |

### Sprint 2: Segurança e Schema

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E1-07 | Login com email/senha | **A** | **R** | AI implementa auth, EF testa fluxo |
| E1-08 | Renovação de token sem relogar | **A** | **R** | AI implementa refresh, EF valida |
| E1-09 | Implementar RBAC (VIEWER, ANALYST, ADMIN) | **A** | **R** | AI implementa middleware, EF valida roles |
| E1-10 | Rate limiting (SlowAPI + Redis) | **I** | **R** | AI implementa, EF informado |
| E1-11 | Migrações Alembic com schema completo | **A** | **R** | AI gera migrações, EF valida schema |

### Sprint 3: Seed Data e ETL Preliminar

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E1-12 | Carga 5.570 municípios + geometrias IBGE | **A** | **R** | AI implementa carga, EF valida dados |
| E1-13 | Scripts ETL IBGE/SIDRA e IPEADATA | **A** | **R** | AI desenvolve scripts, EF valida indicadores |
| E1-14 | Script `init_db.py` (seed admin + indicadores) | **I** | **R** | AI implementa, EF informado |

---

## E2 — Core Map — Inteligência Espacial

### Sprint 4: Mapa Base

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E2-01 | Integrar MapLibre GL JS | **I** | **R** | AI implementa componente React |
| E2-02 | Mudar estilo de mapa (escuro, claro, satélite) | **A** | **R** | AI implementa, EF valida UX |
| E2-03 | Consumo de Vector Tiles (MVT) do Martin | **I** | **R** | AI configura integração |
| E2-04 | Controles de mapa (Zoom, Pan, Geolocation) | **I** | **R** | AI implementa, padrão MapLibre |
| E2-05 | Barra de pesquisa para encontrar localidade | **A** | **R** | AI implementa autocomplete, EF valida UX |

### Sprint 5: Coropléticos e Interatividade

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E2-06 | Mapa coroplético de qualquer indicador | **A** | **R** | AI implementa escala Viridis, EF valida visual |
| E2-07 | Bottom Sheet com KPIs ao clicar município | **A** | **R** | AI implementa UI, EF valida layout/dados |
| E2-08 | Filtrar por Estado, Município e Zona | **A** | **R** | AI implementa filtros, EF valida lógica |
| E2-09 | API `GET /municipios/{codigo}/` (detalhe + KPIs) | **I** | **R** | AI implementa endpoint |

### Sprint 6: Indicadores e Evolução Temporal

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E2-10 | Alternar entre indicadores via checkboxes | **A** | **R** | AI implementa UI, EF valida UX |
| E2-11 | Slider temporal (2010–2024) | **A** | **R** | AI implementa animação, EF valida |
| E2-12 | Alternar camadas (Limites, Densidade) | **I** | **R** | AI implementa toggles |

---

## E3 — Dashboard Analítico

### Sprint 7: Layout e Gráficos Base

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E3-01 | Layout Bento Grid | **A** | **R** | AI implementa grid, EF valida design |
| E3-02 | 4 KPIs globais no topo | **A** | **R** | AI implementa cards, EF valida métricas |
| E3-03 | Gráfico Performance Over Time | **A** | **R** | AI implementa Recharts, EF valida dados |
| E3-04 | Ranking Top Performing Localities | **I** | **R** | AI implementa lista rankeada |
| E3-05 | API `GET /indicadores/dashboard` | **I** | **R** | AI implementa endpoint |

### Sprint 8: Comparação e Análise Cruzada

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E3-06 | Comparativo setorial (barras horizontais) | **A** | **R** | AI implementa, EF valida visual |
| E3-07 | Radar chart multidimensional | **A** | **R** | AI implementa, EF valida eixos |
| E3-08 | Dock de Comparação (glassmorphism) | **A** | **R** | AI implementa UI, EF valida UX |
| E3-09 | Análise cruzada "Generate Analysis" | **A** | **R** | AI implementa lógica, EF valida resultado |
| E3-10 | Testes ComparisonStore (Zustand) | **I** | **R** | AI escreve e executa testes |

---

## E4 — Gerador de Relatórios (Dossiê Executivo)

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E4-01 | Layout A4 para relatório | **A** | **R** | AI implementa layout, EF valida formato |
| E4-02 | Sumário executivo descritivo | **A** | **R** | AI implementa geração, EF valida texto |
| E4-03 | Grid de KPIs minimalista | **I** | **R** | AI implementa componente |
| E4-04 | Gráficos estáticos (radar + barras) | **I** | **R** | AI implementa modo estático |
| E4-05 | Tabela zebrada com badges de status | **I** | **R** | AI implementa tabela |
| E4-06 | Área de assinaturas e selo digital | **A** | **R** | AI implementa, EF valida formato institucional |
| E4-07 | Impressão sem artefatos de UI | **I** | **R** | AI implementa `@media print` |
| E4-08 | Exportar PDF com um clique | **A** | **R** | AI implementa exportação, EF valida output |

---

## E5 — Data Catalog

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E5-01 | Buscar datasets por nome ou setor | **I** | **R** | AI implementa busca |
| E5-02 | Cards de dataset (fonte, frequência) | **A** | **R** | AI implementa UI, EF valida informações |
| E5-03 | Documentação detalhada do dataset | **A** | **R** | AI implementa modal, EF valida conteúdo |
| E5-04 | Dicionário de dados (campos, tipos) | **A** | **R** | AI implementa tabela, EF valida metadados |
| E5-05 | Baixar RAW em CSV | **I** | **R** | AI implementa download |
| E5-06 | Indicadores derivados da base | **C** | **R** | AI implementa, consulta EF sobre fórmulas |
| E5-07 | Status de governança (LGPD) | **A** | **R** | AI implementa badges, EF classifica dados |

---

## E6 — Área Administrativa

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E6-01 | Editar metadados de município | **I** | **R** | AI implementa CRUD |
| E6-02 | Editor visual de polígonos | **A** | **R** | AI implementa editor, EF valida UX |
| E6-03 | Editar séries temporais inline | **I** | **R** | AI implementa tabela editável |
| E6-04 | Importar CSV em massa (Bulk Import) | **A** | **R** | AI implementa pipeline, EF testa com dados reais |
| E6-05 | Mapear colunas do CSV | **I** | **R** | AI implementa modal Stepper |
| E6-06 | Validação pré-import com alertas | **I** | **R** | AI implementa validação |
| E6-07 | Serviço de auditoria (`audit_service.py`) | **I** | **R** | AI implementa logging |

---

## E7 — ETL Pipeline Completo

### Sprint 13: Fontes Restantes

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E7-01 | Extração DATASUS/TABNET | **A** | **R** | AI implementa parser, EF valida dados de saúde |
| E7-02 | Extração SNIS (saneamento) | **A** | **R** | AI implementa parser, EF valida indicadores |
| E7-03 | Extração SICONFI/FINBRA | **A** | **R** | AI implementa parser, EF valida dados fiscais |

### Sprint 14: Pipeline de Transformação

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E7-04 | Limpeza de encoding | **I** | **R** | AI implementa normalização |
| E7-05 | Melt wide→long + correção IBGE 6→7 | **I** | **R** | AI implementa transformação |
| E7-06 | Cálculo de Índice Posicional | **A** | **R** | AI implementa, EF valida fórmula e direção |
| E7-07 | Validação pré-load | **I** | **R** | AI implementa checks |

### Sprint 15: Orquestração e Carga

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E7-08 | Configurar Apache Airflow (7 DAGs) | **A** | **R** | AI configura DAGs, EF valida schedule |
| E7-09 | Scripts de carga (upsert idempotente) | **I** | **R** | AI implementa upsert |
| E7-10 | Invalidação de cache Redis pós-ETL | **I** | **R** | AI implementa invalidação |

---

## E8 — Tauri Desktop

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E8-01 | Setup Rust + Tauri 2.x | **A** | **R** | AI configura projeto, EF valida ambiente |
| E8-02 | CSP e permissões (WebView2) | **I** | **R** | AI configura segurança |
| E8-03 | Build Windows (.exe / .msi) | **A** | **R** | AI gera build, EF testa instalação |
| E8-04 | Build Linux (.AppImage / .deb) | **I** | **R** | AI gera pacotes |
| E8-05 | CI para matrix build (Win + Linux) | **I** | **R** | AI configura GitHub Actions |

---

## E9 — Wiki e Documentação

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E9-01 | Árvore de tópicos na sidebar | **I** | **R** | AI implementa tree view |
| E9-02 | Tipografia otimizada | **I** | **R** | AI implementa design system |
| E9-03 | Table of Contents lateral | **I** | **R** | AI implementa TOC auto |
| E9-04 | Tutoriais com passos numerados | **A** | **R** | AI implementa, EF redige/valida conteúdo |
| E9-05 | Tabelas de fórmulas metodológicas | **A** | **R** | AI implementa rendering, EF valida fórmulas |
| E9-06 | Alertas e dicas destacados | **I** | **R** | AI implementa componentes |

---

## E10 — QA, Staging e Go-Live

| ID | Tarefa | EF | AI | Observações |
|---|---|---|---|---|
| E10-01 | Deploy completo em Staging | **A** | **R** | AI configura deploy, EF valida ambiente |
| E10-02 | Teste E2E: Login → Mapa → Bottom Sheet | **I** | **R** | AI escreve e executa Playwright |
| E10-03 | Teste E2E: Dashboard → Dock → Analysis | **I** | **R** | AI escreve e executa Playwright |
| E10-04 | Teste E2E: Relatório → A4 → PDF | **I** | **R** | AI escreve e executa Playwright |
| E10-05 | Teste E2E: Catalog → Buscar → Detalhes | **I** | **R** | AI escreve e executa Playwright |
| E10-06 | Teste E2E: Admin → Bulk Import | **I** | **R** | AI escreve e executa Playwright |
| E10-07 | Testes de carga (50 usuários) | **A** | **R** | AI configura Locust/k6, EF analisa resultado |
| E10-08 | UAT + Go-Live | **R/A** | **C** | EF coordena aprovações, AI suporta |

---

## Resumo de Responsabilidades por Papel

### Eduardo Figueira (EF) — Product Owner / Tech Lead

| Responsabilidade | Frequência |
|---|---|
| Aprovar entregas de cada sprint | A cada sprint |
| Tomar decisões de design/UX | Sob demanda |
| Validar dados e indicadores | A cada carga de dados |
| Classificar dados LGPD | Uma vez (E5) |
| Coordenar UAT e Go-Live | Fase 8 |
| Revisar fórmulas e metodologias | Sob demanda |
| Testar builds desktop localmente | Fase 7 |

### Assistente IA (AI) — Desenvolvedor Full-Stack

| Responsabilidade | Frequência |
|---|---|
| Implementar código (frontend + backend) | Contínuo |
| Escrever e executar testes | Contínuo |
| Gerar documentação técnica | A cada entrega |
| Configurar infraestrutura (Docker, CI/CD) | Fases 1, 8 |
| Desenvolver pipelines ETL | Fases 1, 6 |
| Realizar code reviews e refactoring | Contínuo |
| Manter backlog atualizado | A cada tarefa concluída |

---

## Regras de Operação

1. **Nenhuma tarefa é considerada concluída** sem a aprovação (explícita ou implícita) de Eduardo
2. **AI prioriza** tarefas na ordem definida pelo backlog, a menos que Eduardo redirecione
3. **Comunicação** é feita via chat direto — AI reporta progresso e bloqueios em tempo real
4. **Decisões de arquitetura** que impactem mais de um épico devem ser discutidas antes da implementação
5. **Commits e pushes** para o repositório são feitos por AI, com mensagens descritivas em português
