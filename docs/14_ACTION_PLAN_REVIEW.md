# Revisão Crítica do Plano de Ação — SisInfo / GeoIntel V2

Análise detalhada do [13_ACTION_PLAN.md](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/13_ACTION_PLAN.md), cruzada com toda a documentação técnica do projeto.

---

## ✅ Pontos Fortes do Plano Atual

1. **Estrutura de fases coerente** — A progressão Planejamento → Fundação → Core → Dashboard → Relatórios → Catalog → ETL → Desktop → QA segue uma lógica de dependências bem definida
2. **Milestones claros** — Os 6 marcos (M0–M5) são mensuráveis e verificáveis
3. **Gestão ágil** — A proposta de Sprints de 2 semanas, dailies e reviews é adequada
4. **Equipe recomendada** — A composição é razoável para o escopo

---

## 🔴 Críticas e Problemas Identificados

### 1. Cronograma Irrealista para a Complexidade

> [!CAUTION]
> O maior risco do plano é a **subestimação severa** do esforço necessário em quase todas as fases.

| Fase | Estimado | Realista | Razão |
|---|---|---|---|
| **Fase 1: Fundação** | 4 semanas | **6–8 semanas** | Configurar CI/CD + Docker + JWT + RBAC + Martin + Alembic migrations é ambicioso para 4 semanas. O doc `09_SECURITY_AUTH.md` descreve JWT + refresh tokens + RBAC com 3 roles + rate limiting + auditoria — isso sozinho já consome 2 semanas |
| **Fase 2: Core Map** | 4 semanas | **5–6 semanas** | O PRD especifica 8 user stories (US-MAP-01 a US-MAP-08) incluindo slider temporal, busca de localidade, filtros espaciais dinâmicos, bottom sheet com sparklines e benchmarking — cada item é complexo |
| **Fase 3: Dashboard** | 3 semanas | **4–5 semanas** | 7 user stories incluindo Dock de Comparação com glassmorphism, geração de análise cruzada e radar chart multidimensional. O dock sozinho tem 5 critérios de aceite detalhados |
| **Fase 5: Catalog & Admin** | 3 semanas | **4–5 semanas** | São **dois módulos distintos** com user stories separadas: 7 stories para o Catalog + 6 stories para o Admin. O Bulk Import tem um stepper de 3 etapas |
| **Fase 6: ETL** | 3 semanas | **4–6 semanas** | O doc `05_ETL_PIPELINE.md` descreve **5 fontes externas** com parsers completamente diferentes, 7 DAGs do Airflow, 5 scripts de extração, 6 scripts de transformação, scripts de carga e validação |
| **Fase 7: Tauri + Wiki** | 2 semanas | **3–4 semanas** | Tauri tem pré-requisitos de compilação complexos (Rust, WebView2), e a Wiki tem 6 user stories no PRD |

**Estimativa realista total: 35–45 semanas (~8–11 meses)**, não 25 semanas.

---

### 2. O ETL Deveria Começar Muito Antes

> [!IMPORTANT]
> O ETL está planejado para as **Semanas 19–21**, mas o Core Map (Semana 7) e o Dashboard (Semana 11) **precisam de dados reais** para serem desenvolvidos e testados corretamente.

Desenvolver mapas coropléticos e dashboards com dados fictícios → depois integrar dados reais = **retrabalho garantido**. Outliers, formatos inesperados, e distribuições reais de dados afetam diretamente a calibração de escalas de cor, legendas e formatadores.

**Recomendação:** Iniciar os scripts de ETL para pelo menos 2 fontes (IBGE/SIDRA e IPEADATA) em paralelo com a Fase 1 (Fundação). A orquestração com Airflow pode ficar para depois, mas os dados precisam estar no banco antes do Core Map.

---

### 3. Ausência de Buffer para Riscos

O plano tem **zero margem** para:
- APIs públicas fora do ar (DATASUS é notoriamente instável)
- Bugs de integração entre serviços (Martin ↔ PostGIS ↔ FastAPI)
- Problemas de performance com 5.570 municípios
- Feedback do Product Owner exigindo ajustes

**Recomendação:** Adicionar 2–3 semanas de buffer distribuídas ao longo do projeto (ex: 1 semana após M2, 1 semana após M3, 1 semana antes do Go-Live).

---

### 4. Fase de Testes Insuficiente

> [!WARNING]
> O doc `12_TESTING_STRATEGY.md` descreve uma pirâmide robusta com ~200+ testes unitários, ~50 de integração e 5–10 E2E. Mas o plano aloca **apenas 1 semana** (Semana 24) para testes E2E + testes de carga + bug bash.

Isso é incompatível com a estratégia documentada. Testes devem ser contínuos:
- **Unitários:** escritos junto com cada feature (não ao final)
- **Integração:** executados a cada sprint
- **E2E (Playwright):** escritos após cada módulo estar funcional

O plano deveria especificar metas de cobertura por fase, não concentrar testes no final.

---

### 5. O Plano Não Menciona Seed Data / Dados Iniciais

Não há tarefa explícita para:
- Carga inicial dos 5.570 municípios + geometrias do IBGE
- Cadastro dos indicadores base no banco
- Criação de usuários iniciais (Admin)
- Script `init_db.py` mencionado no `11_PROJECT_SETUP.md`

Isso deveria ser uma **entrega explícita da Fase 1**.

---

### 6. Inconsistência entre Plano e Arquitetura (Tauri vs Electron)

O PRD (§5) menciona "_Electron/Tauri_", mas todo o resto da documentação (`02_ARCHITECTURE.md`, `08_DEVOPS_CICD.md`, `11_PROJECT_SETUP.md`) especifica **apenas Tauri**. O plano de ação deveria consolidar isso definitivamente.

---

### 7. Ausência de Critérios de Aceite por Fase

Os entregáveis listados são bons mas genéricos. Faltam **critérios mensuráveis** para cada fase:
- Fase 2: "_Mapa cobrindo 5.570 municípios a 60fps_" ← Ótimo, mas como medir? Lighthouse? Chrome DevTools Performance tab? Em qual hardware de referência?
- Fase 6: "_Base de dados populada_" ← Quais indicadores? Quantos anos? Qual cobertura mínima?

---

### 8. Falta Planejamento de Migração e Deploy de Staging

O plano pula de "desenvolvimento" direto para "deploy de produção" (Semana 25). Não há menção a:
- Deploy em **ambiente de staging** para homologação
- Migração de dados do protótipo V1
- Validação com usuários reais antes do Go-Live

---

### 9. Falta Dependência entre Frontend e Backend

O plano trata o frontend e o backend como um bloco monolítico. Na prática, para um squad de 4+ pessoas, são workstreams paralelas que precisam de:
- **API contracts definidos antes** do desenvolvimento simultâneo
- **Mock server** para o frontend não ficar bloqueado pelo backend
- **Feature flags** para deploy incremental

---

## 📊 Proposta de Cronograma Revisado

Considerando as críticas acima, propõe-se o seguinte cronograma de **35 semanas (~8,5 meses)**:

| Fase | Semanas | Duração | Novas Adições |
|---|---|---|---|
| **Fase 0: Planejamento** | 1–2 | 2 sem | Sem alteração |
| **Fase 1: Fundação** | 3–8 | 6 sem | +Seed data/geometrias, +ETL preliminar (2 fontes) |
| **Fase 2: Core Map** | 9–14 | 6 sem | +Testes unitários por Sprint |
| **Buffer 1** | 15 | 1 sem | Correção de bugs, ajustes de Sprint |
| **Fase 3: Dashboard** | 16–19 | 4 sem | +Integração contínua com dados reais |
| **Fase 4: Relatórios** | 20–22 | 3 sem | +1 semana para PDF server-side |
| **Buffer 2** | 23 | 1 sem | Retrospectiva e re-planejamento |
| **Fase 5: Catalog & Admin** | 24–27 | 4 sem | Separar em dois sub-módulos |
| **Fase 6: ETL Pipeline Completo** | 28–30 | 3 sem | Apenas orquestração (Airflow) + fontes restantes |
| **Fase 7: Tauri + Wiki** | 31–33 | 3 sem | +1 semana para compilação cross-platform |
| **Fase 8: QA & Staging** | 34–35 | 2 sem | +Deploy em staging, UAT com usuários |
| **Buffer Final + Go-Live** | 36 | 1 sem | Correções finais + go-live |

**Total: 36 semanas (~9 meses)**

### Milestones Revisados

| Milestone | Fase | Semana | Critérios Mensuráveis |
|---|---|---|---|
| **M0: Spec Lock** | Fim da Fase 0 | Sem. 2 | Docs congelados, stack definida, repo criado |
| **M1: Alpha Build** | Fim da Fase 1 | Sem. 8 | API autenticando, banco com 5.570 municípios + geometrias, Martin servindo tiles, CI/CD verde |
| **M2: Beta Map** | Fim da Fase 2 | Sem. 14 | Mapa cobrindo todos os municípios < 2s FMP, 60fps em Chrome DevTools, 8 user stories US-MAP aceitas |
| **M3: MVP Funcional** | Fim da Fase 3 | Sem. 19 | Dashboard integrado ao mapa, 7 user stories US-DASH aceitas, dock funcional com 5 cidades |
| **M4: Content Ready** | Fim da Fase 6 | Sem. 30 | 5 fontes ETL operacionais, ≥90% dos municípios com dados de ≥3 indicadores |
| **M5: Desktop Ready** | Fim da Fase 7 | Sem. 33 | Executáveis .exe e .deb gerados, Wiki com ≥10 artigos |
| **M6: Go-Live** | Fim da Fase 8 | Sem. 36 | 100% E2E passando, staging validado por ≥3 usuários, produção estável 48h |

---

## 📋 Itens de Ação Recomendados

1. **Atualizar o cronograma** para 35–36 semanas com buffers
2. **Antecipar o ETL** — iniciar scripts de extração na Fase 1
3. **Adicionar critérios de aceite mensuráveis** por milestone
4. **Consolidar Tauri** como única opção desktop (remover menção a Electron do PRD)
5. **Incluir deploy de staging** antes do go-live
6. **Distribuir testes** ao longo de todas as fases (não concentrar no final)
7. **Adicionar tarefa de seed data** na Fase 1
8. **Definir API contracts** antes do desenvolvimento paralelo front/back
9. **Adicionar gestão de riscos** ao plano com ações de mitigação por fase
10. **Considerar tamanho da equipe** — com 4 devs, 36 semanas é muito otimista; com 2 devs + acúmulo de funções, pode chegar a 12–15 meses
