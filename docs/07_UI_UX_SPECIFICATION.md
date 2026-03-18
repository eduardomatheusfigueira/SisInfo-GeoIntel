# Especificação de UI/UX por Módulo

## SisInfo / GeoIntel (Adm-de-Cidades) — V2

> [!IMPORTANT]
> **Aviso sobre os Mockups:** Os mockups fornecidos em `docs/mockups/` e referenciados nesta documentação são **apenas de referência visual e estrutural**.
>
> Na hora de desenvolver a aplicação final, é crucial entender as *funções*, a *dinâmica das janelas* e a *consistência de design* entre as telas. Os mockups não devem ser seguidos estritamente (pixel por pixel), mas servirem como **ilustração de possibilidades** e do padrão de qualidade exigido.


---

## 1. Design System Tokens

### 1.1. Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `--color-primary` | `#14213d` | Sidebar, TopBar, fundo do mapa escuro, títulos de peso |
| `--color-accent` | `#fca311` | CTAs, botões de ação, polígonos selecionados, labels de filtro ativas |
| `--color-black` | `#000000` | Textos de alto contraste, sombras profundas |
| `--color-gray-light` | `#e5e5e5` | Divisórias, bordas sutis, painéis secundários |
| `--color-white` | `#ffffff` | Cards, painéis flutuantes, texto sobre primária |
| `--color-surface` | `#f9f9f9` | Fundo geral da app (módulos claros) |
| `--color-surface-low` | `#f4f3f3` | Fundo de dashboard, ranking lists |
| `--color-success` | `#16a34a` | Tendência positiva, badges "EXCELENTE", desvios positivos |
| `--color-warning` | `#d97706` | Badges "ALERTA", "NO PRAZO" |
| `--color-error` | `#dc2626` | Tendência negativa, badges "CRÍTICO", desvios negativos |
| `--color-info` | `#0284c7` | Links, ícones de informação, barras de ranking |

### 1.2. Tipografia (Inter)

| Uso | Peso | Tamanho | Tracking |
|---|---|---|---|
| KPI número grande | Black (900) | 3xl (30px) | -0.02em |
| Título de seção | Bold (700) | 2xl (24px) | -0.02em |
| Label de categoria (uppercase) | Bold (700) | xs (10px) | 0.15em uppercase |
| Corpo de texto | Regular (400) | sm (14px) | normal |
| Caption/meta | Medium (500) | xs (12px) | 0.05em |
| Números de ranking | Bold (700) | xl (20px) | -0.01em |

### 1.3. Espaçamento e Bordas

| Token | Valor | Uso |
|---|---|---|
| `border-radius-card` | `0.75rem` (12px) | Cards, painéis |
| `border-radius-button` | `0.75rem` (12px) | Botões primários |
| `border-radius-pill` | `9999px` | Badges, chips, search bar |
| `shadow-card` | `0 12px 40px rgba(0,10,36,0.06)` | Cards elevados |
| `shadow-glass` | `0 -12px 40px rgba(0,10,36,0.12)` | Bottom Sheet |
| `backdrop-blur` | `blur(12px)` | Glass panels, filter panel |

---

## 2. Módulo: Inteligência Espacial (Core Map)

**Referência visual:** `docs/mockups/image1.png`

![Mockup do Mapa Gerado](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/mockups/generated_map.png)

### 2.1. Layout

```
┌──────────────────────────────────────────────────────────┐
│ [🌎] Adm-de-Cidades │  🔍 Buscar coordenadas, endereços │ 🔔  [Gestor Municipal ●]
│      SISINFO GIS     │     ou setores...                 │      Acesso Restrito
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────────────┐                     ┌──┐  ┌─────┐│
│ │ FILTROS ESPACIAIS ⚙│                     │++│  │ 🗺️  ││
│ │                    │                     │--│  │     ││
│ │ ◉ LOCALIDADE       │     MAP 100%        │📍│  │TOOLS││
│ │ [▼ Município SP ]  │    (MapLibre GL)    │🔗│  │     ││
│ │ [▼ Todos Setores]  │                     │⊙ │  │     ││
│ │                    │                     │📐│  └─────┘│
│ │ 📊 INDICADORES     │                     └──┘        │
│ │ ☑ População Est.   │                                  │
│ │ ☐ PIB per cap (R$) │                                  │
│ │ ☐ IDHM             │                                  │
│ │                    │                                  │
│ │ ⏱ PERÍODO          │ ┌─ PROCESSANDO ÁREAS ──────────┐│
│ │ ●────────○         │ │ 📊 128 setores...             ││
│ │ 2019  2022  2023   │ └──────────────────────────────┘│
│ └────────────────────┘                                  │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [🏢] São Paulo (Capital) [CAPITAL]   ↗Exportar  📄Relatório Completo │
│ │      ◎ Código IBGE: 3550308 │ UF: SP                               │
│ │ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ ┌─────────────────┐│
│ │ │POPULAÇÃO │ │RENDA MÉD.│ │EVOLUÇÃO PIB (SÉRIE │ │Métrica vs Média ││
│ │ │ 94.2k    │ │R$ 54.3k  │ │HISTÓRICA) [📈]     │ │─────────────────││
│ │ │ ↗+2.4%   │ │— Estável │ │ [gráfico sparkline]│ │Educ.(IDEB) +18% ││
│ │ ├──────────┤ ├──────────┤ │                    │ │Saúde(AB)   +25% ││
│ │ │PIB TOTAL │ │IDH MUNIC.│ │                    │ │Educação    -2%  ││
│ │ │R$ 748,9  │ │ 0.805 ██ │ │                    │ │Saneam(SNIS)+31% ││
│ │ └──────────┘ └──────────┘ └────────────────────┘ └─────────────────┘│
│ └──────────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘
```

### 2.2. Detalhes de UI (conforme mockup)

| Elemento | Especificação |
|---|---|
| **Header** | Logo "Adm-de-Cidades / SISINFO GIS", search bar com placeholder "Buscar coordenadas, endereços ou setores...", ícone de notificação, avatar com role ("Gestor Municipal / Acesso Restrito") |
| **Filter Panel** | Seção **"FILTROS ESPACIAIS"** com ícone ⚙. Sub-seções: **LOCALIDADE** (dropdowns), **INDICADORES** (checkboxes, não grid 2×2), **PERÍODO** (slider com anos) |
| **Indicadores** | Seleção via **checkbox** (múltipla seleção possível). Labels: "População Estimada", "PIB per capita (R$)", "IDHM" |
| **Controles à direita** | Stack vertical: Zoom +/-, Minha Localização, Layers link (🔗), Foco (⊙), Ferramentas de medição (📐) |
| **Status bar** | Barra amarela/accent no canto inferior: "PROCESSANDO ÁREAS / 128 setores" com ícone spinner |
| **Bottom Sheet cabeçalho** | Ícone do município, Nome + badge "CAPITAL" (pill dourada), sub-info "◎ Código IBGE: 3550308 │ UF: SP". Botões: "↗ Exportar" (outline) e "📄 Relatório Completo" (filled primary) |
| **KPI Cards** | 4 cards: POPULAÇÃO (valor + variação %), RENDA MÉDIA (valor + status "Estável"), PIB TOTAL (valor), IDH MUNICIPAL (valor + barra de progresso colorida) |
| **Série histórica** | Mini gráfico de linha (sparkline) da "EVOLUÇÃO DO PIB (SÉRIE HISTÓRICA)" inline no Bottom Sheet |
| **Benchmarking** | Tabela "Métrica vs Média" com colunas: **Métrica, Local, Desvio**. Desvio em % colorido (verde positivo, vermelho negativo). Ex: "Educação (IDEB) │ Alto │ +18%" |

### 2.3. Comportamentos

| Interação | Comportamento | Animação |
|---|---|---|
| Clicar em município | Abre Bottom Sheet | `translateY(100%) → translateY(0)` 300ms ease |
| Deslizar slider de ano | Atualiza cores do mapa (coroplético) | Transição de cor 200ms |
| Toggle checkbox indicador | Recolore mapa + atualiza legenda | Fade 150ms |
| Hover em município | Tooltip com nome + valor atual | Instant |
| Re-clicar no mapa (fora) | Fecha Bottom Sheet | `translateY(0) → translateY(100%)` |
| Toggle camada | Liga/desliga layer do MapLibre | Opacity 0↔1 200ms |
| Processamento de setores | Status bar amarela animada na base | Slide-up 200ms |

### 2.4. Estados do Mapa

| Estado | Visual |
|---|---|
| Loading inicial | Skeleton do mapa + spinner central |
| Processando | Barra de status "PROCESSANDO ÁREAS / N setores" (accent color) |
| Sem município selecionado | Mapa clean, sem bottom sheet |
| Município selecionado | Bottom Sheet aberto, município highlighted (borda dourada accent) |
| Filtro ativo | Filter Panel aberto, checkboxes marcadas |

---

## 3. Módulo: Dashboard Analítico

**Referência visual:** `docs/mockups/image2.png`

![Mockup do Dashboard Gerado](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/mockups/generated_dashboard.png)

### 3.1. Sidebar de Navegação

```
┌─────────────────────┐
│ [🌎] Adm-de-Cidades │
│     INDICADORES     │
│     MUNICIPAIS      │
│ ─────────────────── │
│ 📊 Visão Geral      │  ← item ativo (highlight accent)
│ 🔀 Comparativo      │
│    Transversal      │
│ 🗺 Mapa de          │
│    Desempenho       │
│ 📈 Séries Temporais │
│                     │
│ CONFIGURAÇÕES       │  ← section label
│ ⚙ Parâmetros        │
│ 📋 Fontes de Dados  │
│                     │
│ ┌─────────────────┐ │
│ │ + Novo Relatório│ │  ← CTA primário (accent, full-width)
│ └─────────────────┘ │
└─────────────────────┘
```

### 3.2. Layout (Bento Grid)

```
┌──────────────────────────────────────────────────────────────────┐
│ Dashboard de Performance │ Última atualização: Hoje, 08:45  🔍  🔔 ⬇ [JS] │
├──────┬───────────────────────────────────────────────────────────┤
│      │                                                           │
│ Side │  Visualização Analítica   [+] [-]  [📍 Gerenciar Matriz  │
│ bar  │  Comparativo de indicadores...            de Comparação]  │
│      │                                                           │
│      │ ┌─ KPI Ribbon ──────────────────────────────────────────┐│
│      │ │ Média Perf. │ Munic. Ativos │ Microrregião │ Status  ││
│      │ │ 7.24 ↗4.5%  │ 1.240 de 5.568│ Sul (Região) │● T.Real ││
│      │ └───────────────────────────────────────────────────────┘│
│      │                                                           │
│      │ ┌──────────────────────────┐ ┌──────────────────────────┐│
│      │ │ Evolução Temporal IDEB   │ │ Ranking Geral   Ver Todos││
│      │ │ ● Curitiba ● Florianóp. │ │ 01 Curitiba PR     9.8 ▬││
│      │ │ ● Média Nacional         │ │ 02 Florianópolis   9.5 ▬││
│      │ │ [Gráfico barras agrup.]  │ │ 03 São Caetano     9.2 ▬││
│      │ │ 2019 2020 2021 2022 2023 │ │ 04 Belo Horizonte  8.9 ▬││
│      │ └──────────────────────────┘ │ 05 Vitória ES      8.7 ▬││
│      │                              └──────────────────────────┘│
│      │ ┌──────────────────────────┐ ┌──────────────────────────┐│
│      │ │ Comparativo por Pilar    │ │ Performance              ││
│      │ │ de Gestão [▼ Saúde]      │ │ Multidimensional     (i) ││
│      │ │ Infra Escolar     72% ▬▬│ │ [Radar chart:            ││
│      │ │ Capacitação Doc.  88% ▬▬│ │  SAÚDE/EDUCAÇÃO/         ││
│      │ └──────────────────────────┘ │  INFRA/FINANÇAS]         ││
│      │                              └──────────────────────────┘│
└──────┴───────────────────────────────────────────────────────────┘
```

### 3.3. Detalhes de UI (conforme mockup)

| Elemento | Especificação |
|---|---|
| **Header** | "Dashboard de Performance" + timestamp "Última atualização: Hoje, 08:45" |
| **Subtítulo** | "Visualização Analítica — Comparativo de indicadores socioeconômicos e demográficos dos 5.568 municípios brasileiros" |
| **Botão destaque** | "📍 Gerenciar Matriz de Comparação" (CTA primário grande, fundo primary) — substitui o Dock simples |
| **Zoom controls** | Botões [+] e [-] para zoom nos gráficos |
| **KPI Ribbon** | 4 cards: **Média de Performance** (7.24 ↗4.5%), **Municípios Ativos** (1.240 de 5.568), **Microrregião de Destaque** (Sul / Região), **Status de Processamento** (● Tempo Real, borda accent) |
| **Gráfico principal** | "Evolução Temporal do IDEB" — **barras agrupadas** (não área): múltiplas cidades + Média Nacional. Legenda com dots coloridos |
| **Ranking** | "Ranking Geral" com link "Ver Todos". Formato: posição numérica (01, 02...) + nome + UF + sub-info (IDHM) + score + barra proporcional |
| **Comparativo** | "Comparativo por Pilar de Gestão" com dropdown de pilar ativo (ex: Saúde). Items: label + % + barra horizontal |
| **Radar** | "Performance Multidimensional" com ícone (i) de info. Eixos: Saúde, Educação, Infraestrutura, Finanças |

### 3.4. Grid CSS (12 colunas)

| Componente | Span | Altura |
|---|---|---|
| KPI Ribbon | 12 cols (4×3) | auto |
| Evolução Temporal (barras agrupadas) | 8 cols | 420px |
| Ranking Geral | 4 cols | 420px |
| Comparativo por Pilar | 7 cols | auto |
| Radar Chart | 5 cols | auto |

---

## 4. Módulo: Relatório Executivo (Dossiê Municipal)

**Referência visual:** `docs/mockups/image3.png`

![Mockup do Relatório Gerado](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/mockups/generated_report.png)

### 4.1. Layout A4 (conforme mockup)

```
┌─────────────── 210mm ──────────────┐
│ [🌎] Adm-de-Cidades   [⬇][↗] [📄 Exportar PDF] │ ← TopBar non-print
│                                                    │
│ ▎ RELATÓRIO DE DIAGNÓSTICO MUNICIPAL     DATA DE EMISSÃO   │
│ ▎ Síntese Socioeconômica e Fiscal       24 de Outubro, 2023│
│ ▎ Ref: 2022 (IBGE/FINBRA)                                  │
│                                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│ │ IDH MUNIC. │ │ÍNDICE GINI │ │PIB PER CAP │ │TX. ANALFAB.││
│ │ 0.805 /10  │ │ 0.450      │ │ R$ 54.3k   │ │ 2.5%       ││
│ │ ↗ +0.5%    │ │ ↗ +2.1%    │ │ ↗ +1.5%    │ │ ↘ -0.2%    ││
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│                                                              │
│ 📋 SUMÁRIO EXECUTIVO                                         │
│ ▎ O município apresentou crescimento no setor de serviços,  │
│ ▎ refletindo no aumento da arrecadação de ISS. A taxa de    │
│ ▎ analfabetismo manteve-se abaixo da média nacional, porém  │
│ ▎ a cobertura de saneamento básico necessita de atenção...  │
│                                                              │
│ ┌──────────────────────┐ ┌──────────────────────┐           │
│ │⊙ Métricas de         │ │↗ Tendência de        │           │
│ │  Competência         │ │  Crescimento         │           │
│ │ [Radar: EDUCAÇÃO /   │ │ [Barras: JUL/OUT/DEZ]│           │
│ │  INFRA / SAÚDE /     │ │                      │           │
│ │  FINANÇAS]           │ │                      │           │
│ └──────────────────────┘ └──────────────────────┘           │
│                                                              │
│ 🏛 COMPOSIÇÃO DAS RECEITAS ORÇAMENTÁRIAS    VALORES EM R$ (MILHARES) │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ CATEGORIA (FINBRA)  │ REALIZADO (%) │ VALOR    │ STATUS  ││
│ ├─────────────────────┼───────────────┼──────────┼─────────┤│
│ │ Receitas Correntes  │ ██████████    │R$ 1.450M │EXCELENTE││
│ │ Infraestrutura e P&D│ ████████      │R$ 320.000│NO PRAZO ││
│ │ ISS                 │ ██████        │R$ 210.500│EXCELENTE││
│ │ FPM                 │ █████         │R$ 555.000│ ALERTA  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ─────────────────── ─────────────────────                   │
│ Assinatura Digital  Assinatura Digital                      │
│ Secretário da Faz.  Prefeito Municipal                      │
│ ASSINATURA OFICIAL  GABINETE                                │
│                                                              │
│ © SisInfo Municipal. Todos os direitos reservados.          │
│ Termos de Uso │ Privacidade │ Suporte                       │
└──────────────────────────────────────────────────────────────┘
```

### 4.2. Detalhes de UI (conforme mockup)

| Elemento | Especificação |
|---|---|
| **Título** | "RELATÓRIO DE DIAGNÓSTICO MUNICIPAL" — typography Black, com barra lateral primária (#14213d) à esquerda |
| **Subtítulo** | "Síntese Socioeconômica e Fiscal • Ref: 2022 (IBGE/FINBRA)" |
| **KPIs** | 4 cards minimalistas com bordas sutis. Labels uppercase 10px. Métricas concretas: **IDH Municipal (/10), Índice Gini, PIB per Capita, Tx. Analfabetismo**. Cada com variação % e seta colorida |
| **Sumário Executivo** | Borda lateral grossa primária(#14213d). Texto descritivo sobre a situação fiscal e socioeconômica do município |
| **Gráficos** | Lado a lado: "⊙ Métricas de Competência" (Radar chart: Educação, Infraestrutura, Saúde, Finanças) + "↗ Tendência de Crescimento" (Barras agrupadas por meses: JUL, OUT, DEZ) |
| **Tabela** | "COMPOSIÇÃO DAS RECEITAS ORÇAMENTÁRIAS" — Colunas: Categoria FINBRA (com subtítulo), Realizado (%) com barra visual, Valor Arrecadado, Status (badges coloridos: EXCELENTE/NO PRAZO/ALERTA) |
| **Assinaturas** | Dois blocos: linhas de assinatura + "Assinatura Digital" + cargo (ex: "Secretário da Fazenda / ASSINATURA OFICIAL" e "Prefeito Municipal / GABINETE") |
| **Footer** | "© SisInfo Municipal. Todos os direitos reservados." + links: Termos de Uso, Privacidade, Suporte |

### 4.3. CSS de Impressão

```css
@media print {
  .no-print { display: none !important; }
  body { background: white !important; }
  .a4-page { 
    box-shadow: none !important;
    margin: 0 !important;
    width: 100% !important;
    border: none !important;
    page-break-after: always;
  }
}

.a4-page {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 2rem auto;
  background: white;
  box-shadow: 0 12px 40px rgba(0, 10, 36, 0.06);
}
```

---

## 5. Módulo: Data Catalog

**Referência visual:** `docs/mockups/image4.png`

![Mockup do Catálogo Gerado](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/mockups/generated_catalog.png)

### 5.1. Navegação Superior

```
┌─────────────────────────────────────────────────────────────┐
│ [🌎] SisInfo Catálogo │ Bases │ Indicadores │ Linhagem │    │
│                       │       │             │ Documentação│  │
│                       │ 🔍 Buscar bases, colunas ou tags... │ 🔔 ⚙ [JD]│
└─────────────────────────────────────────────────────────────┘
```

### 5.2. Layout de Listagem

```
┌──────┬──────────────────────────────────────────────────────┐
│ NAVE │ Repositório de Dados Oficiais         [⬇ Exportar ] │
│ GAÇ. │ "Acesso a 142 bases de dados curadas..."            │
│ ────│                                                       │
│ 📊 Ca│ ┌── Card Destaque ──────────────────────────────────┐ │
│ ★ Fa│ │ [SELECIONADO] ◉ Fonte Certificada                │ │
│ 🕐 Co│ │ Censo Demográfico Brasileiro 2022                 │ │ [📡 Conectar API]
│ 🎧 Su│ │ "Informações detalhadas sobre a estrutura pop..." │ │ [📋 Dicionário]
│      │ │ FONTE: IBGE │ ATUALIZAÇÃO: 27 Out 2023           │ │ [⬇ Baixar RAW]
│ FILT │ │ PERIODICIDADE: Decenal │ METODOLOGIA: Censo Univ. │ │
│ ─── │ │                                                    │ │
│ Setor│ │ 📊 Indicadores Derivados                          │ │
│ [▼]  │ │ ┌────────────┐ ┌──────────────┐ ┌──────────────┐│ │
│      │ │ │Dens. Demog.│ │Índ. Urbaniz. │ │Razão Depend. ││ │
│ Freq.│ │ │23.8 hab/km²│ │ 84.72%       │ │ 44.1         ││ │
│ ☐ Di│ │ │▬▬▬▬▬▬▬▬▬▬  │ │▬▬▬▬▬▬▬▬▬     │ │▬▬▬▬▬▬        ││ │
│ ☐ Me│ │ └────────────┘ └──────────────┘ └──────────────┘│ │
│ ☐ An│ └──────────────────────────────────────────────────┘ │
│      │                                                       │
│      │ Outras Bases Disponíveis        Ordenado por: Recentes│
│      │ ┌──────────────────┐ ┌──────────────────┐           │
│      │ │📊 IPC (FGV IBRE) │ │📚 Censo Escolar  │           │
│      │ │ Fonte: FGV IBRE  │ │ Fonte: INEP      │           │
│      │ │ Atualiz: 01 Nov  │ │ Atualiz: 20 Set  │           │
│      │ │ Série Histórica  │ │ Coleta Declaratória│          │
│      │ └──────────────────┘ └──────────────────┘           │
│      │ ┌──────────────────┐ ┌──────────────────┐           │
│      │ │🏥 COVID-19 Brasil│ │🌳 PRODES Desmata.│           │
│      │ │ Min. da Saúde    │ │ INPE             │           │
│      │ │ Diária           │ │ 05 Ago 2023      │           │
│      │ │ Notif. Compulsória│ │ Sensoriamento    │           │
│      │ └──────────────────┘ └──────────────────┘           │
│      │                                                       │
│      │ ◁ 1 2 3 ... 12 ▷                                     │
│      │                                                       │
│      │ © SisInfo © 2023  Termos │ Privacidade │ Doc Técnica │ Feedback │
└──────┴──────────────────────────────────────────────────────┘
```

### 5.3. Detalhes de UI (conforme mockup)

| Elemento | Especificação |
|---|---|
| **Top nav** | 4 abas: **Bases, Indicadores, Linhagem, Documentação** (seção ativa sublinhada) |
| **Sidebar** | Seções: **NAVEGAÇÃO** (Catálogo, Favoritos, Consultas Recentes, Suporte Técnico) + **FILTROS AVANÇADOS** (Setor Institucional [dropdown], Frequência: checkboxes Diário/Mensal/Anual) |
| **Card destaque** | Badge "SELECIONADO" (accent) + "◉ Fonte Certificada". 4 linhas de metadados: Fonte, Última Atualização, Periodicidade, Metodologia |
| **Indicadores Derivados** | Cards com valor + barra de progresso (primary color). Ex: "Densidade Demográfica: 23.8 hab/km²" |
| **Actions stack** | 3 botões verticais à direita: "📡 Conectar via API" (CTA primário), "📋 Dicionário de Dados" (outline), "⬇ Baixar RAW (CSV)" (outline) |
| **Cards de dataset** | Grid 2 cols. Cada card: ícone temático + ★ favorito, título, descrição, 3 linhas meta (Fonte, Atualização, Metodologia) |
| **Paginação** | Numérica com setas: ◁ 1 2 3 ... 12 ▷ |
| **Footer** | © SisInfo © 2023 + links (Termos de Uso, Privacidade, Documentação Técnica, Feedback) |

---

## 6. Módulo: Administração (City Editor & Bulk Import)

**Referência visual:** `docs/mockups/image5.png` (geometria) e `image6.png` (import)

### 6.1. Sidebar Admin

```
┌──────────────────────┐
│ [🌎] SisInfo          │
│     ADM-DE-CIDADES   │
│ ────────────────────│
│ 📊 Dashboard Geral   │
│ 🗺  GIS Público       │
│                      │
│ PAINEL ADMINISTRATIVO│
│ 📋 Dados Descritivos │
│ ✔️ Geometrias e       │  ← item ativo
│    Limites           │
│                      │
└──────────────────────┘
```

### 6.2. Geometry Editor (conforme mockup)

```
┌──────────────────────────────────────────────────────────────────────┐
│ [▼ São José dos Campos, SP]  IBGE: 3549904   ✕ Descartar  [📄 Publicar Geometria]│
├──────────────────────┬───────────────────────────────────────────────┤
│ 📋 VÉRTICES DO POLÍGONO │                                            │
│                      │  ┌─────────┐  FERRAMENTAS DE GEOMETRIA       │
│ ID │ LAT/LONG │ AÇÃO │  │ 🔹Select│  ─────────────────              │
│ 001│-23.1791  │      │  │ 🏠Home  │  ⊕ Corrigir Sobreposições      │
│    │-45.8872  │      │  │ 📋Copy  │  ✂ Simplificar Tolerância      │
│ 002│-23.1812  │      │  │         │    (Turf.js)                    │
│    │-45.8900  │      │  └─────────┘                                 │
│ ...│-23.1901  │      │                                               │
│    │-45.8812  │      │        MAP COM POLÍGONO EDITÁVEL             │
│                      │        (borda accent dourada)                 │
│ + Adicionar Coordenada│                                              │
│                      │                                               │
│ 📄 INGESTÃO ARQUIVOS GIS│                                            │
│ ┌──────────────────┐ │  ┌────────────────────────────────────────┐  │
│ │Substituir Polígono│ │  │ ● POLÍGONO VÁLIDO (MULTIPOLYGON)      │  │
│ │Atual              │ │  │ ÁREA: 1.099,41 km² │ VÉRTICES: 68     │  │
│ │Aceita GeoJSON/KML │ │  └────────────────────────────────────────┘  │
│ └──────────────────┘ │                                               │
│ [⬇ Baixar Cópia JSON]│                                               │
└──────────────────────┴───────────────────────────────────────────────┘
```

### 6.3. Bulk Import (conforme mockup)

```
┌────────────────────────────────────────────────────────────┐
│ Importação em Massa (CSV)                            ✕     │
│ Passo 2 de 3 · Mapeie as colunas do arquivo para os       │
│                campos do sistema.                          │
│                                                            │
│  ① Upload de Arquivo ──── ② Mapeamento Dinâmico ──── ③ Validação │
│                              (ativo)                       │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ 📄 ARQUIVO ATUAL                                       │ │
│ │ relatorio_finbra_2022.csv (4.2 MB)     [TROCAR ARQUIVO]│ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ COLUNA DO ARQUIVO │ AMOSTRA DO DADO │ MAPEAR PARA CAMPO    │
│ ─────────────────┼─────────────────┼─────────────────────  │
│ COD_IBGE          │ "3550308"       │ [▼ Código IBGE     ] │
│ Ano_Referencia    │ "2022"          │ [▼ Ano de Referência] │
│ Receitas_Corr_RS  │ "45212399.12"   │ [▼ Indicador: Rec. ] │
│ UF_Sigla          │ "SP"            │ [▼ --Ignorar (Der.)] │
│                                                            │
│ ⚠ Aviso: O campo "Receitas_Correntes_RS" contém           │
│   separadores de milhar em formato diferente. O módulo     │
│   tentará sanitizar os valores durante a ingestão.         │
│                                                            │
│ [Cancelar]                    [← Voltar] [Validar e Ingestar →] │
└────────────────────────────────────────────────────────────┘
```

### 6.4. Detalhes de UI (conforme mockups)

| Elemento | Especificação |
|---|---|
| **Seletor de cidade** | Dropdown com nome + UF, badge mostrando IBGE code |
| **Publicar Geometria** | Botão CTA primário no canto superior direito |
| **Ferramentas GIS** | Panel flutuante: "Corrigir Sobreposições" e "Simplificar Tolerância (Turf.js)" |
| **Ingestão GIS** | Aceita **GeoJSON OU KML** (não apenas GeoJSON) |
| **Status bar** | Barra inferior: "● POLÍGONO VÁLIDO (MULTIPOLYGON)" + Área (km²) + Nº Vértices |
| **Import stepper** | 3 passos: "Upload de Arquivo" → "Mapeamento Dinâmico" → "Validação e Ingestão" |
| **Mapeamento** | Tabela com 3 colunas: **Coluna do Arquivo (CSV)**, **Amostra do Dado** (preview), **Mapear para Campo do SisInfo** (dropdown) |
| **Opção Ignorar** | Dropdown inclui opção "-- Ignorar (Derivado do IBGE) --" para colunas desnecessárias |
| **Warning** | Alerta amarelo para formatos numéricos incompatíveis (separadores de milhar) |

---

## 7. Módulo: Wiki (Documentação)

**Referência visual:** `docs/mockups/image7.png`

![Mockup da Wiki Gerado](file:///c:/Users/eduardo.figueira/Documents/Inteligencia%20territorial/docs/mockups/generated_wiki.png)

### 7.1. Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [🌎] Adm-de-Cidades Wiki    Home > O que é...  🖨 ↗ [✏ Sugerir Edição] │
│     DOCUMENTAÇÃO V2.1.0                                       │
├──────┬─────────────────────────────────────────┬──────────────┤
│ 🔍   │ [VISÃO GERAL] Última atualiz: 15/10/23 │ NESTA PÁGINA │
│      │                                         │ ▎ Visão Geral│
│INTROD│  O que é o Adm-de-Cidades              │   Funcion.   │
│ ℹ O q│  ─────────────────────────              │   Notas Met. │
│      │  O Adm-de-Cidades é a plataforma       │   Dicas Util.│
│METOD │  central integradora de dados           │              │
│ 📋 No│  socioeconômicos e indicadores...       │ ┌──────────┐│
│ 📊 Cá│                                         │ │❓ Ainda   ││
│ 📋 Fo│  [Imagem com legenda:                   │ │com dúvidas│
│      │  "Figura 1: Interface principal do      │ │           ││
│ADMIN │   Adm-de-Cidades Interface Geográfica"] │ │Falar com  ││
│ ⚙ Co │                                         │ │Suporte    ││
│ 👥 Ge│  Visão Geral do Sistema                 │ └──────────┘│
│      │  Desenvolvido para atender às...        │              │
│ ─── │                                         │              │
│ 👤Ad │                                         │              │
│ admin│  ← Anterior         Próximo →           │              │
│ 🚪   │                                         │              │
└──────┴─────────────────────────────────────────┴──────────────┘
```

### 7.2. Detalhes de UI (conforme mockup)

| Elemento | Especificação |
|---|---|
| **Header** | "Adm-de-Cidades Wiki / DOCUMENTAÇÃO V2.1.0" + breadcrumb (Home > Artigo) |
| **Botão destaque** | "✏ Sugerir Edição" — CTA primário no canto superior direito (azul marinho) |
| **Badges de seção** | Labels como "VISÃO GERAL" em pill badges (fundo cinza, texto primary) |
| **Timestamps** | "Última atualização em: 15 de Outubro de 2023" em itálico |
| **Sidebar** | Agrupada em seções: **INTRODUÇÃO** (O que é), **METODOLOGIA** (Notas, Cálculo Indicadores, Fontes), **ADMINISTRAÇÃO** (Configurações, Gestão de Usuários). Item ativo: highlight com barra lateral accent |
| **TOC lateral** | "NESTA PÁGINA" com barra lateral primária no item ativo. Links: Visão Geral, Funcionalidades, Notas Metodológicas, Dicas de Utilização |
| **Card de suporte** | "❓ Ainda com dúvidas? Nossa equipe está disponível 9h–18h" + botão "Falar com Suporte" |
| **Imagens** | Com legendas formais: "Figura 1: Interface principal do Adm-de-Cidades" |
| **Footer** | Admin user visível (avatar + email + botão logout), sempre fixo na base da sidebar |

---

## 8. Responsividade

| Breakpoint | Largura | Comportamento |
|---|---|---|
| `sm` | < 640px | Sidebar collapsa, mapa fullscreen, bottom sheet 100% |
| `md` | 640–1024px | Sidebar mini (ícones), filter panel overlay |
| `lg` | 1024–1280px | Layout completo com sidebar expandida |
| `xl` | > 1280px | Bento grid otimizado, wiki com TOC lateral |

### Responsividade por Módulo

| Módulo | Mobile | Tablet | Desktop |
|---|---|---|---|
| Mapa | Fullscreen, filtros em modal, bottom sheet full | OK com sidebar mini | Layout completo |
| Dashboard | Cards empilhados, dock horizontal scroll | Grid 2 cols | Bento 12 cols |
| Relatório | A4 scroll horizontal (pinch zoom) | A4 centralizado | A4 com floating actions |
| Catalog | Cards 1 col, detail em tela cheia | Grid 2 cols | Bento assimétrico + paginação |
| Wiki | Prose only, sidebar em drawer | Sidebar + prose | Prose + TOC lateral |
| Admin | ⚠️ Não otimizado (aviso de usar desktop) | Funcional básico | Layout completo |
