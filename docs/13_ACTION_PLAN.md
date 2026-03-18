# Plano de Ação e Cronograma de Execução

## SisInfo / GeoIntel — V2

**Status:** Aprovado / Em andamento  
**Duração Estimada:** 25 semanas (~6 meses)  

---

## 1. Visão Geral do Cronograma

O projeto está estruturado em 8 fases principais, adotando uma abordagem iterativa e incremental (ex.: Sprints de 2 semanas). O foco inicial é estabelecer a fundação de infraestrutura e dados, seguido pelo desenvolvimento do *Core Map* e *Dashboard*, e finalizando com processos de qualidade e empacotamento desktop (Tauri).

---

## 2. Cronograma Detalhado (Work Breakdown Structure - WBS)

### Fase 0: Planejamento (Semanas 1 e 2)
*Objetivo: Finalizar e aprovar toda a documentação técnica.*
* **Semana 1:** 
  * Revisão do PRD, Arquitetura e Modelagem do Banco (Schema).
  * Definição da stack final e designação da equipe.
* **Semana 2:** 
  * Especificação de APIs, UI/UX (Figma) e estratégias de Testes / DevOps.
  * *Entregável:* Documentação técnica completa (`docs/`).

### Fase 1: Fundação (Semanas 3 a 6)
*Objetivo: Infraestrutura rodando, banco configurado e API base funcional.*
* **Semanas 3 e 4:** 
  * Setup do repositório, CI/CD e ambientes (Dev/Staging/Prod).
  * Configuração Docker (PostgreSQL + PostGIS, Redis).
  * Inicialização dos projetos Frontend (Vite+React) e Backend (FastAPI).
* **Semanas 5 e 6:** 
  * Criação das migrações do banco (Alembic) e schema base.
  * Módulo de Segurança (Autenticação JWT, login, RBAC roles).
  * Configuração inicial do servidor de Vector Tiles (Martin).
  * *Entregável:* API respondendo autenticação e banco aceitando conexões espaciais.

### Fase 2: Core Map - Módulo de Inteligência Espacial (Semanas 7 a 10)
*Objetivo: Renderização rápida de mapas com PostGIS e Martin.*
* **Semanas 7 e 8:** 
  * Integração MapLibre GL JS no Frontend.
  * Consumo de Vector Tiles (MVT) do Martin com as malhas municipais do IBGE.
  * Controles básicos de mapa: Zoom, Pan, Basemaps (Satelite, Light, Dark).
* **Semanas 9 e 10:** 
  * Visualização Coroplética (cores baseadas em indicadores).
  * Interatividade: Clique nos polígonos, Bottom Sheet de detalhes (KPIs).
  * Filtros espaciais dinâmicos (por Estado, Região).
  * *Entregável:* Mapa cobrindo 5.570 municípios a 60fps, sem travamentos.

### Fase 3: Dashboard Analítico (Semanas 11 a 13)
*Objetivo: Criação dos componentes gráficos e comparativos.*
* **Semanas 11 e 12:** 
  * Layout Bento Grid no perfil do município.
  * Implementação de gráficos (Recharts) de barras, linhas (tendência) e radar.
* **Semana 13:** 
  * *Dock de Comparação:* Seleção de até 5 cidades para comparação lado-a-lado.
  * Geração de análises cruzadas.
  * *Entregável:* Dashboard interativo integrado aos dados do município selecionado no mapa.

### Fase 4: Gerador de Relatórios (Semanas 14 e 15)
*Objetivo: Exportação e visualização otimizada para impressão.*
* **Semana 14:** 
  * Criação da view "Estilo A4" (Dossiê Executivo).
  * Otimização de CSS para `@media print` (remoção de sidebars e interatividade).
* **Semana 15:** 
  * Geração de PDF via biblioteca ou print nativo otimizado.
  * Parametrização dos dados consolidados no dossiê.
  * *Entregável:* Exportação de relatórios profissionais em modo página.

### Fase 5: Data Catalog & Área Administrativa (Semanas 16 a 18)
*Objetivo: Gestão de dados, dicionário e inserção de dados curados.*
* **Semanas 16 e 17:** 
  * UI de Catálogo de Dados para busca de metadados e download de base crua (CSV/XLSX).
  * Área Admin (City Editor) para edições pontuais de atributos do município.
* **Semana 18:** 
  * *Bulk Import:* Interface para uploads CSV, "Map Columns" e validação prévia.
  * *Entregável:* Catálogo governacional ativo e rota de importação para o Admin.

### Fase 6: ETL Pipeline Automatizado (Semanas 19 a 21)
*Objetivo: Ingestão de dados oficiais automatizada.*
* **Semanas 19 e 20:** 
  * Scripts em Python/Pandas para extrair dados (IBGE, DATASUS, SNIS, FINBRA, IPEADATA).
  * Pipeline de Transformação (limpeza, tipagem, formatação espacial).
* **Semana 21:** 
  * Orquestração (Airflow, Prefect ou CRON avançado).
  * Scripts de carga (Load) performáticos no PostGIS.
  * *Entregável:* Base de dados populada e mantida atualizada periodicamente de forma desacompanhada.

### Fase 7: Tauri (Desktop), Wiki e Refinamento (Semanas 22 e 23)
*Objetivo: Empacotamento para Windows/Mac/Linux e manuais.*
* **Semana 22:** 
  * Setup e build do projeto no Tauri para geração de instaladores `.exe`, `.msi`, `.deb`.
  * Criação da tela de Help/Wiki para documentação e metodologias das fórmulas.
* **Semana 23:** 
  * Refinamentos de UI/UX, revisão de acessibilidade (cores, contraste) e responsividade.
  * *Entregável:* Instalador desktop funcional e material de ajuda embutido.

### Fase 8: QA & Lançamento (Semanas 24 e 25)
*Objetivo: Homologação, correção de bugs e Go-Live.*
* **Semana 24:** 
  * Testes E2E (Playwright/Cypress), testes de carga de usuários concorrentes (Locust).
  * Bug Bash (Caça aos bugs) focado na segurança (JWT, RBAC) e consistência de dados.
* **Semana 25:** 
  * Deploy final nos servidores de Produção.
  * Treinamento para os usuários-chave / Admins.
  * Go-Live Institucional.
  * *Entregável:* V2 do SisInfo/GeoIntel em Produção Estável.

---

## 3. Marcos Críticos de Entrega (Milestones)

| Milestone | Fase Relativa | Prazo Previsto | Descrição |
| :--- | :--- | :--- | :--- |
| **M0: Spec Lock** | Fim da Fase 0 | Fim do Mês 0,5 | Arquitetura e PRD congelados; design técnico pronto. |
| **M1: Alpha Build** | Fim da Fase 1 | Fim do Mês 1,5 | Backend seguro, Banco conectado, Infra de Dev de pé. |
| **M2: Beta Map** | Fim da Fase 2 | Fim do Mês 2,5 | Mapas MVT rodando; clique em municípios e retorno de dados rápidos. |
| **M3: MVP Funcional**| Fim da Fase 3 | Fim do Mês 3,5 | Dashboards e Mapas plenamente integrados (Uso Mínimo Viável). |
| **M4: Content Ready**| Fim da Fase 6 | Fim do Mês 5,0 | ETL rodando, todos os dados históricos reais injetados. |
| **M5: Go-Live** | Fim da Fase 8 | Fim do Mês 6,0 | Sistema lançado oficialmente em web e desktop. |

---

## 4. Dinâmica de Execução (Gestão Ágil)

Para garantir o cumprimento do cronograma, sugere-se a aplicação das seguintes cerimônias:

1. **Sprints de 2 Semanas:** Planejamento e encerramento a cada 10 dias úteis.
2. **Daily Stand-ups:** Máximo de 15 minutos para acompanhar impedimentos na integração (ex.: Backend bloqueando Frontend).
3. **Review & Retrospectiva (ao fim da Sprint):** Demonstração do software funcionando (ex.: mostrar camada do Martin renderizando novos dados; demonstrar o ETL puxando do DATASUS).
4. **Gerenciamento de Cards:** Uso de Jira, Trello ou GitHub Projects com colunas: *Backlog*, *To Do*, *In Progress*, *Code Review*, *QA*, *Done*.

---

## 5. Matriz de Alocação (Equipe Recomendada)

Para execução das 25 semanas, a seguinte composição de equipe (squad) é aconselhada:

- **1 Tech Lead / Full Cycle Engineer:** Foco em DevOps, Airflow, Martin e arquitetura.
- **1 Desenvolvedor Backend (Python/FastAPI):** Foco em API, Banco e performance do PostGIS.
- **1 Desenvolvedor Frontend / Especialista WebGIS:** Foco em MapLibre, React e Recharts.
- **1 Engenheiro de Dados:** Foco nos pipelines de ETL e limpeza da base histórica.
- *(Opcional)* **1 UI/UX Designer:** Atuando em part-time nas primeiras 10 semanas para design system.
- *(Opcional)* **1 Product Owner (PM):** Gestão das sprints e aprovação das entregas de negócios.

*Nota:* Se algum recurso acumular funções, os prazos podem ser estendidos, devendo ser gerenciado via mitigação de riscos.
