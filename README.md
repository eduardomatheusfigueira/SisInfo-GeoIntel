# 🌎 SisInfo / GeoIntel (Inteligência Territorial)

O **SisInfo (ou GeoIntel)** é uma plataforma Web "GovTech" de alto nível focada em análise de dados, inteligência territorial e indicadores socioeconômicos. 

Este repositório contém o planejamento técnico e a arquitetura completa da visão ideal (V2) da plataforma, que está sendo refatorada do zero para uma aplicação **Enterprise-Ready**, migrando de um protótipo baseado em scripts estáticos para uma arquitetura robusta com Node.js, React e PostGIS.

---

## 📚 Documentação Técnica

Todo o planejamento arquitetural, requisitos de UI/UX e especificações de engenharia de dados foram detalhadamente divididos nos documentos abaixo:

| Documento | Descrição |
|-----------|-----------|
| [📖 01 - Product Requirements Document (PRD)](docs/01_PRD.md) | Visão, personas, epics, histórias de usuário e roadmap. |
| [🏗️ 02 - Arquitetura do Sistema](docs/02_ARCHITECTURE.md) | Stack técnico (React, NestJS/Express, Python, PostGIS), modelo C4 e design da infraestrutura. |
| [🗄️ 03 - Schema de Banco de Dados](docs/03_DATABASE_SCHEMA.md) | Tabelas, relacionamentos e otimizações espaciais no PostgreSQL/PostGIS. |
| [🔌 04 - Especificação da API REST](docs/04_API_SPECIFICATION.md) | Tratativas de endpoints, auth via JWT, paginação e payload structure. |
| [⚙️ 05 - Pipeline de Dados (ETL)](docs/05_ETL_PIPELINE.md) | Processo de ingestão automatizada via Python (Airflow/Prefect) de dados do IBGE, IBAM e outros. |
| [🧩 06 - Componentes Frontend](docs/06_FRONTEND_COMPONENTS.md) | Componentização React, estado com Zustand, hooks do React Query, integração MapLibre. |
| [🎨 07 - UI/UX Especificação](docs/07_UI_UX_SPECIFICATION.md) | Wireframes, regras visuais, paleta de cores, tipografia (Inter) e mockups. |
| [🚀 08 - CI/CD e Infra (DevOps)](docs/08_DEVOPS_CICD.md) | Orquestração via Docker, Actions, ambientes e deploy automatizado. |
| [🔐 09 - Segurança e Auth](docs/09_SECURITY_AUTH.md) | RBAC (Role-Based Access Control), sanitização, CORS, CSP e proteção de dados. |
| [📊 10 - Dicionário de Dados](docs/10_DATA_DICTIONARY.md) | Tabela unificada com indicadores, dicionário de variáveis e metodologias IBGE. |
| [🛠️ 11 - Project Setup](docs/11_PROJECT_SETUP.md) | Guia de instalação para iniciarmos o desenvolvimento local (GitFlow, Node, Docker). |
| [🧪 12 - Estratégia de Testes](docs/12_TESTING_STRATEGY.md) | TDD, Testes de Integração, Cobertura, e CI. |

---

## 📸 Mockups e Protótipos

Na pasta `docs/html_mockups` e `docs/mockups` você encontrará as referências de fidelidade visual da aplicação. Esses HTMLs foram desenvolvidos com intenção ilustrativa para validarmos a estrutura do **Tailwind CSS**, identidade visual (cores/tipografia) e as dinâmicas de janelas (_Glassmorphism, Filter Panels, Data Tables_). 

> [!IMPORTANT]  
> **Aviso sobre os Mockups:** Eles são **apenas de referência visual e estrutural**.  Na hora de desenvolver a aplicação final, é crucial entender a consistência de design e as funções. Eles não precisam ser seguidos estritamente "pixel por pixel".

---

## 🎯 Sobre o Projeto 

**Objetivo:** Consolidar, processar e visualizar dados de diversas fontes oficiais (IBGE, DATASUS, FINBRA, etc.) em diferentes recortes espaciais, auxiliando gestores públicos, prefeitos e analistas a obterem visualizações e relatórios aprofundados sobre realidades estaduais e municipais.

### 💼 Stack Resumida
* **Frontend:** React, TypeScript, Tailwind CSS, MapLibre GL JS, React Query, Zustand.
* **Backend API:** Node.js (NestJS ou Express), Prisma ORM.
* **Database:** PostgreSQL + PostGIS extensão.
* **Pipeline ETL:** Python (Pandas/GeoPandas), Cron / Apache Airflow.

---
📄 **Nota:** _Este repositório foi criado e documentado autonomamente através de especificações detalhadas e metodologias ágeis de engenharia de software governamental._
