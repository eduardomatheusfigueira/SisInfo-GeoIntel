# Especificação de Componentes React/TypeScript

## SisInfo / GeoIntel (Adm-de-Cidades) — V2

**Versão:** 2.0  
**Data:** Janeiro 2027

> [!IMPORTANT]
> **Aviso sobre os Mockups:** Os mockups fornecidos em `docs/mockups/` e referenciados nesta documentação são **apenas de referência visual e estrutural**.
>
> Na hora de desenvolver a aplicação final, é crucial entender as *funções*, a *dinâmica das janelas* e a *consistência de design* entre as telas. Os mockups não devem ser seguidos estritamente, mas servirem como **ilustração de possibilidades** e do padrão formatação exigido.

---

## 1. Árvore de Componentes

```
App
├── AppLayout
│   ├── Sidebar
│   │   ├── SidebarLogo ("Adm-de-Cidades" + subtítulo dinâmico)
│   │   ├── SidebarNav
│   │   │   ├── NavItem (com ícone + label + highlight ativo)
│   │   │   └── NavSectionLabel (ex: "CONFIGURAÇÕES", "PAINEL ADMINISTRATIVO")
│   │   ├── NewReportButton ("+ Novo Relatório")
│   │   └── SidebarFooter (avatar user + email + logout)
│   ├── TopBar
│   │   ├── Breadcrumb (ex: Home > O que é o Adm-de-Cidades)
│   │   ├── SearchBar ("Buscar coordenadas, endereços ou setores...")
│   │   ├── NotificationBell
│   │   ├── DownloadButton
│   │   └── UserAvatar (com role badge: "Gestor Municipal / Acesso Restrito")
│   └── MainContent (React Router Outlet)
│
├── MapPage
│   ├── MapView (MapLibre GL JS)
│   ├── FilterPanel (glassmorphism, seção "FILTROS ESPACIAIS")
│   │   ├── LocalitySelector (Estado, Município, Setores Censitários)
│   │   ├── IndicatorCheckboxList (checkboxes, não grid)
│   │   ├── TimelineSlider (range input com anos)
│   │   └── LayerToggles
│   ├── MapControls (stack vertical direita)
│   │   ├── ZoomButtons (+/-)
│   │   ├── MyLocationButton (📍)
│   │   ├── LayerLinkButton (🔗)
│   │   ├── FocusButton (⊙)
│   │   └── MeasureToolButton (📐)
│   ├── ProcessingStatusBar ("PROCESSANDO ÁREAS / N setores")
│   └── BottomSheet
│       ├── CityHeader (ícone + nome + badge "CAPITAL" + IBGE code + UF)
│       ├── KPICardGrid
│       │   └── KPICard (valor + variação % + status label)
│       ├── PIBSparklineChart ("Evolução PIB - Série Histórica")
│       ├── BenchmarkingTable ("Métrica vs Média": Métrica, Local, Desvio)
│       └── ActionButtons ("↗ Exportar", "📄 Relatório Completo")
│
├── DashboardPage
│   ├── DashboardHeader ("Dashboard de Performance" + timestamp)
│   ├── ComparisonMatrixButton ("📍 Gerenciar Matriz de Comparação")
│   ├── KPIRibbon
│   │   └── KPITopCard (×4: Média Perf., Munic. Ativos, Microrregião, Status)
│   ├── TemporalEvolutionChart (barras agrupadas, Recharts Bar)
│   ├── RankingList ("Ranking Geral" + "Ver Todos" link)
│   │   └── RankingItem (posição + nome + UF + sub-info IDHM + score + barra)
│   ├── PillarComparisonChart ("Comparativo por Pilar" com dropdown)
│   ├── RadarPerformance (Recharts Radar: Saúde/Educação/Infra/Finanças)
│   └── SidebarDashboard
│       ├── NavItem: Visão Geral
│       ├── NavItem: Comparativo Transversal
│       ├── NavItem: Mapa de Desempenho
│       ├── NavItem: Séries Temporais
│       ├── NavItem: Parâmetros
│       └── NavItem: Fontes de Dados
│
├── ReportPage
│   ├── A4Page
│   │   ├── ReportHeader ("RELATÓRIO DE DIAGNÓSTICO MUNICIPAL")
│   │   ├── ReportSubtitle ("Síntese Socioeconômica e Fiscal • Ref: Ano")
│   │   ├── KPIGrid (IDH, Gini, PIB per cap, Tx. Analfabetismo)
│   │   ├── ExecutiveSummary (borda lateral primária)
│   │   ├── CompetenceRadar ("Métricas de Competência")
│   │   ├── GrowthTrendBars ("Tendência de Crescimento")
│   │   ├── RevenueTable ("Composição Receitas Orçamentárias FINBRA")
│   │   │   └── StatusBadge ("EXCELENTE"/"NO PRAZO"/"ALERTA")
│   │   ├── SignatureBlock (cargo + "Assinatura Digital")
│   │   └── ReportFooter (© + links legais)
│   └── FloatingActions (non-print)
│       ├── ExportPDFButton
│       ├── ShareButton
│       └── PrintButton
│
├── CatalogPage
│   ├── CatalogTopNav ("Bases │ Indicadores │ Linhagem │ Documentação")
│   ├── CatalogSidebar (Catálogo, Favoritos, Consultas Recentes, Suporte)
│   ├── FeaturedDatasetCard (com badge "SELECIONADO" + "Fonte Certificada")
│   │   └── DerivedIndicatorCards (valor + barra de progresso)
│   ├── DatasetActionStack ("Conectar API", "Dicionário", "Baixar RAW")
│   ├── DatasetGrid
│   │   └── DatasetCard (ícone + ★ + título + fonte + atualização + metodologia)
│   ├── Pagination (numérica: ◁ 1 2 3 ... 12 ▷)
│   └── CatalogFooter (Termos, Privacidade, Doc Técnica, Feedback)
│
├── AdminPage (🔒 ADMIN)
│   ├── AdminSidebar (Dashboard Geral, GIS Público, Dados Descritivos, Geometrias)
│   ├── CityEditor
│   │   ├── CitySelector (dropdown nome+UF + IBGE badge)
│   │   ├── TabNav (General│Geometry│Indicators)
│   │   ├── GeneralInfoForm
│   │   ├── GeometryEditor
│   │   │   ├── VertexList (ID, Lat/Long, Ação)
│   │   │   ├── AddVertexButton ("+ Adicionar Coordenada")
│   │   │   ├── MapDrawTool (Turf.js, polígono editável borda accent)
│   │   │   ├── GISToolsPanel
│   │   │   │   ├── OverlapCorrector ("Corrigir Sobreposições")
│   │   │   │   └── SimplifyTolerance ("Simplificar Tolerância Turf.js")
│   │   │   ├── GISIngestSection ("Substituir Polígono" — GeoJSON/KML)
│   │   │   ├── DownloadGeoJSONButton ("Baixar Cópia JSON")
│   │   │   └── PolygonStatusBar ("POLÍGONO VÁLIDO" + Área + Vértices)
│   │   └── IndicatorTable
│   │       └── SparklinePreview
│   ├── PublishGeometryButton (CTA primário)
│   └── BulkImportModal
│       ├── StepUpload (drag & drop)
│       ├── StepColumnMapping (coluna CSV + amostra + dropdown campo sistema)
│       │   └── IgnoreOption ("--Ignorar (Derivado do IBGE)--")
│       ├── FormatWarningAlert (aviso de separadores/formatos)
│       └── StepValidation
│
└── WikiPage
    ├── WikiHeader ("Adm-de-Cidades Wiki / DOCUMENTAÇÃO V2.1.0")
    ├── SuggestEditButton ("✏ Sugerir Edição" — CTA primário)
    ├── SectionBadge ("VISÃO GERAL", "METODOLOGIA", etc.)
    ├── DocSidebar (tree nav agrupada: Introdução, Metodologia, Admin)
    ├── ProseContent (com imagens legendadas: "Figura 1: ...")
    ├── TableOfContents ("NESTA PÁGINA" — scroll-spy lateral)
    ├── SupportCard ("❓ Ainda com dúvidas?" + "Falar com Suporte")
    └── FooterNav (← Anterior │ Próximo →)
```

---

## 2. Interfaces TypeScript Principais

### 2.1. Entidades de Domínio

```typescript
// types/municipio.ts
export interface Municipio {
  codigo_ibge: string;      // 7 dígitos
  nome: string;
  sigla_estado: string;
  sigla_regiao: string;
  area_km2: number;
  capital: boolean;
  longitude: number;
  latitude: number;
  altitude: number;
}

export interface MunicipioDetalhe extends Municipio {
  estado: { sigla: string; nome: string };
}

// types/indicador.ts
export interface Indicador {
  id: number;
  nome: string;
  unidade: string;         // "%", "R$", "hab/km²"
  categoria: IndicadorCategoria;
  maior_melhor: boolean;
  descricao?: string;
}

export type IndicadorCategoria = 
  | 'Economia' | 'Saúde' | 'Educação' 
  | 'Segurança' | 'Saneamento' | 'Demografia';

export interface ValorIndicador {
  ano: number;
  valor: number;
  indice_posicional: number;  // 0–1
}

export interface SerieIndicador {
  indicador_id: number;
  nome: string;
  unidade: string;
  categoria: IndicadorCategoria;
  serie: ValorIndicador[];
}

// types/dashboard.ts
export interface KPIData {
  titulo: string;
  valor: number;
  variacao_percentual: number;
  tendencia: 'UP' | 'DOWN' | 'STABLE';
  icone: string;             // Material Symbols name
}

export interface ComparacaoRequest {
  municipios: string[];      // Códigos IBGE (max 5)
  indicadores: number[];     // IDs
  ano: number;
}

export interface RadarData {
  dimensoes: string[];
  perfis: Record<string, number[]>; // codigo_ibge → valores
}

// types/benchmarking.ts
export interface BenchmarkRow {
  indicador: string;
  valor_municipio: number;
  media_estadual: number;
  media_nacional: number;
  ranking_estadual: number;
  ranking_nacional: number;
  tendencia: 'UP' | 'DOWN' | 'STABLE';
}

// types/dataset.ts
export interface Dataset {
  id: number;
  identificador: string;
  titulo: string;
  descricao: string;
  fonte: string;
  frequencia: string;
  versao: string;
  status_governanca: 'PUBLIC' | 'RESTRICTED' | 'LGPD_COMPLIANT';
  tamanho_registros?: number;
  ultima_atualizacao: string;
}

export interface DataDictionaryField {
  nome: string;
  tipo: string;
  descricao: string;
}

// types/auth.ts
export interface User {
  id: string;             // UUID
  email: string;
  nome: string;
  roles: UserRole[];
}

export type UserRole = 'VIEWER' | 'ANALYST' | 'ADMIN';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
```

### 2.2. Props de Componentes-Chave

```typescript
// components/map/FilterPanel.tsx
interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedEstado: string | null;
  selectedIndicador: number | null;
  selectedAno: number;
  onEstadoChange: (sigla: string | null) => void;
  onIndicadorChange: (id: number) => void;
  onAnoChange: (ano: number) => void;
  layers: LayerConfig[];
  onLayerToggle: (layerId: string) => void;
}

interface LayerConfig {
  id: string;
  label: string;
  enabled: boolean;
  icon?: string;
}

// components/map/BottomSheet.tsx
interface BottomSheetProps {
  isOpen: boolean;
  municipio: MunicipioDetalhe | null;
  indicadores: SerieIndicador[];
  benchmarking: BenchmarkRow[];
  onClose: () => void;
  onViewReport: (codigoIbge: string) => void;
  onAddToComparison: (codigoIbge: string) => void;
}

// components/dashboard/KPITopCard.tsx
interface KPITopCardProps {
  data: KPIData;
  onClick?: () => void;
}

// components/dashboard/ComparisonDock.tsx
interface ComparisonDockProps {
  cities: Array<{ codigo_ibge: string; nome: string; color: string }>;
  onRemoveCity: (codigoIbge: string) => void;
  onAddCity: () => void;
  onGenerateAnalysis: () => void;
  onClearAll: () => void;
  isLoading: boolean;
}

// components/reports/A4Page.tsx
interface A4PageProps {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
}

// components/catalog/DatasetCard.tsx
interface DatasetCardProps {
  dataset: Dataset;
  onClick: (id: number) => void;
  variant?: 'large' | 'compact';
}

// components/admin/BulkImportModal.tsx
interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: ImportResult) => void;
}

interface ColumnMapping {
  csv_column: string;
  system_field: 'codigo_ibge' | 'ano' | 'valor' | null;
}

interface ImportResult {
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  registros_processados: number;
  registros_inseridos: number;
  erros: number;
  detalhes_erros: Array<{ linha: number; erro: string }>;
}
```

---

## 3. Zustand Stores

```typescript
// store/mapStore.ts
interface MapState {
  selectedEstado: string | null;
  selectedMunicipio: string | null;
  selectedIndicador: number | null;
  selectedAno: number;
  mapStyle: 'dark' | 'light' | 'satellite';
  layers: Record<string, boolean>;
  isBottomSheetOpen: boolean;
  isFilterPanelOpen: boolean;
  
  // Actions
  setEstado: (sigla: string | null) => void;
  setMunicipio: (codigo: string | null) => void;
  setIndicador: (id: number) => void;
  setAno: (ano: number) => void;
  toggleLayer: (id: string) => void;
  toggleBottomSheet: (open?: boolean) => void;
  toggleFilterPanel: () => void;
}

// store/comparisonStore.ts
interface ComparisonState {
  cities: Array<{ codigo_ibge: string; nome: string }>;
  maxCities: 5;
  
  addCity: (city: { codigo_ibge: string; nome: string }) => void;
  removeCity: (codigoIbge: string) => void;
  clearAll: () => void;
  isCityInDock: (codigoIbge: string) => boolean;
}

// store/authStore.ts
interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}
```

---

## 4. React Query Hooks

```typescript
// hooks/useMunicipios.ts
export function useMunicipios(filters: MunicipioFilters) {
  return useQuery({
    queryKey: ['municipios', filters],
    queryFn: () => api.getMunicipios(filters),
    staleTime: 10 * 60 * 1000,     // 10 min
  });
}

export function useMunicipioDetalhe(codigoIbge: string | null) {
  return useQuery({
    queryKey: ['municipio', codigoIbge],
    queryFn: () => api.getMunicipio(codigoIbge!),
    enabled: !!codigoIbge,
    staleTime: 10 * 60 * 1000,
  });
}

// hooks/useIndicadores.ts
export function useIndicadorMapa(indicadorId: number, ano: number) {
  return useQuery({
    queryKey: ['indicador-mapa', indicadorId, ano],
    queryFn: () => api.getIndicadorMapa(indicadorId, ano),
    staleTime: 5 * 60 * 1000,      // 5 min
  });
}

export function useSeriesTemporal(indicadorId: number, municipios: string[]) {
  return useQuery({
    queryKey: ['serie-temporal', indicadorId, municipios],
    queryFn: () => api.getSerieTemporal(indicadorId, municipios),
    enabled: municipios.length > 0,
  });
}

// hooks/useDashboard.ts
export function useKPIs(estado?: string, ano?: number) {
  return useQuery({
    queryKey: ['dashboard-kpis', estado, ano],
    queryFn: () => api.getDashboardKPIs(estado, ano),
    staleTime: 30 * 60 * 1000,     // 30 min
  });
}

export function useComparacao() {
  return useMutation({
    mutationFn: (req: ComparacaoRequest) => api.postComparacao(req),
  });
}
```

---

## 5. Utilitários de Mapa e Cores

```typescript
// utils/colorScale.ts
import * as d3 from 'd3';

export type ColorPalette = 'viridis' | 'cividis' | 'plasma' | 'inferno';

export function createColorScale(
  domain: [number, number],
  palette: ColorPalette = 'viridis'
): (value: number) => string {
  const interpolators: Record<ColorPalette, (t: number) => string> = {
    viridis: d3.interpolateViridis,
    cividis: d3.interpolateCividis,
    plasma: d3.interpolatePlasma,
    inferno: d3.interpolateInferno,
  };
  
  const scale = d3.scaleSequential(interpolators[palette])
    .domain(domain);
  
  return (value: number) => scale(value);
}

export function getIndicatorColor(
  indice_posicional: number,
  palette: ColorPalette = 'viridis'
): string {
  return createColorScale([0, 1], palette)(indice_posicional);
}

// utils/formatters.ts
export function formatCurrency(value: number): string {
  if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `R$ ${(value / 1e3).toFixed(1)}K`;
  return `R$ ${value.toFixed(2)}`;
}

export function formatPopulation(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatIndex(value: number): string {
  return value.toFixed(3);
}
```

---

## 6. Roteamento

```typescript
// App.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/map" replace /> },
      { path: 'map', element: <MapPage /> },
      { path: 'analytics', element: <DashboardPage /> },
      { path: 'reports', element: <ReportPage /> },
      { path: 'reports/:codigoIbge', element: <ReportPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:datasetId', element: <CatalogDetailPage /> },
      { path: 'wiki', element: <WikiPage /> },
      { path: 'wiki/:slug', element: <WikiPage /> },
      { 
        path: 'admin', 
        element: <AdminGuard />,
        children: [
          { index: true, element: <CityEditorPage /> },
          { path: 'editor/:codigoIbge', element: <CityEditorPage /> },
          { path: 'import', element: <BulkImportPage /> },
          { path: 'users', element: <UserManagementPage /> },
        ]
      },
    ]
  },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
```
