# Estratégia de Testes

## SisInfo / GeoIntel — V2

---

## 1. Pirâmide de Testes

```
           /\
          /  \        E2E Tests (Playwright/Cypress)
         /    \       5-10 cenários críticos
        /------\
       /        \     Integration Tests
      /          \    API endpoints + DB
     /            \   ~50 testes
    /--------------\
   /                \  Unit Tests
  /                  \ Funções de cálculo, utilidades, componentes
 /                    \ ~200+ testes
/______________________\
```

| Camada | Framework | Quantidade Estimada | Responsabilidade |
|---|---|---|---|
| Unitários | Vitest (frontend), pytest (backend) | ~200+ | Lógica pura, utilitários, cálculos |
| Integração | pytest + httpx (backend) | ~50 | Endpoints API + banco de dados |
| E2E | Playwright | 5-10 | Fluxos críticos completos |

---

## 2. Testes Unitários — Frontend (Vitest)

### 2.1. Funções de Cálculo Estatístico

```typescript
// utils/__tests__/colorScale.test.ts
import { describe, it, expect } from 'vitest';
import { createColorScale, getIndicatorColor } from '../colorScale';

describe('createColorScale', () => {
  it('deve retornar cor válida para valor mínimo', () => {
    const scale = createColorScale([0, 100], 'viridis');
    const color = scale(0);
    expect(color).toMatch(/^rgb\(|^#/);
  });

  it('deve retornar cor válida para valor máximo', () => {
    const scale = createColorScale([0, 100], 'viridis');
    const color = scale(100);
    expect(color).toMatch(/^rgb\(|^#/);
  });

  it('deve retornar cores diferentes para valores diferentes', () => {
    const scale = createColorScale([0, 1], 'viridis');
    expect(scale(0)).not.toBe(scale(1));
  });
});

describe('getIndicatorColor', () => {
  it('deve mapear índice 0 para primeira cor da paleta', () => {
    const color = getIndicatorColor(0);
    expect(color).toBeDefined();
  });

  it('deve mapear índice 1 para última cor da paleta', () => {
    const color = getIndicatorColor(1);
    expect(color).toBeDefined();
  });

  it('deve aceitar paletas diferentes', () => {
    const v = getIndicatorColor(0.5, 'viridis');
    const c = getIndicatorColor(0.5, 'cividis');
    expect(v).not.toBe(c);
  });
});
```

### 2.2. Formatadores

```typescript
// utils/__tests__/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPopulation, formatPercentage } from '../formatters';

describe('formatCurrency', () => {
  it('deve formatar bilhões', () => {
    expect(formatCurrency(716_000_000_000)).toBe('R$ 716.0B');
  });

  it('deve formatar milhões', () => {
    expect(formatCurrency(42_300_000)).toBe('R$ 42.3M');
  });

  it('deve formatar milhares', () => {
    expect(formatCurrency(52_300)).toBe('R$ 52.3K');
  });

  it('deve formatar valores pequenos', () => {
    expect(formatCurrency(42.5)).toBe('R$ 42.50');
  });
});

describe('formatPopulation', () => {
  it('deve formatar milhões', () => {
    expect(formatPopulation(12_300_000)).toBe('12.3M');
  });

  it('deve formatar milhares', () => {
    expect(formatPopulation(5_570)).toBe('5.6K');
  });
});

describe('formatPercentage', () => {
  it('deve formatar com 1 decimal padrão', () => {
    expect(formatPercentage(12.456)).toBe('12.5%');
  });

  it('deve aceitar decimais customizados', () => {
    expect(formatPercentage(12.456, 2)).toBe('12.46%');
  });
});
```

### 2.3. Stores (Zustand)

```typescript
// store/__tests__/comparisonStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useComparisonStore } from '../comparisonStore';

describe('ComparisonStore', () => {
  beforeEach(() => {
    useComparisonStore.getState().clearAll();
  });

  it('deve adicionar cidade ao dock', () => {
    const store = useComparisonStore.getState();
    store.addCity({ codigo_ibge: '3550308', nome: 'São Paulo' });
    expect(store.cities).toHaveLength(1);
  });

  it('não deve adicionar mais que 5 cidades', () => {
    const store = useComparisonStore.getState();
    for (let i = 0; i < 6; i++) {
      store.addCity({ codigo_ibge: `350000${i}`, nome: `City ${i}` });
    }
    expect(store.cities).toHaveLength(5);
  });

  it('não deve adicionar cidade duplicada', () => {
    const store = useComparisonStore.getState();
    store.addCity({ codigo_ibge: '3550308', nome: 'São Paulo' });
    store.addCity({ codigo_ibge: '3550308', nome: 'São Paulo' });
    expect(store.cities).toHaveLength(1);
  });

  it('deve remover cidade do dock', () => {
    const store = useComparisonStore.getState();
    store.addCity({ codigo_ibge: '3550308', nome: 'São Paulo' });
    store.removeCity('3550308');
    expect(store.cities).toHaveLength(0);
  });
});
```

---

## 3. Testes Unitários — Backend (pytest)

### 3.1. Serviços de Cálculo

```python
# backend/tests/test_positional_index.py
import pytest
import pandas as pd
from etl.scripts.transform.calculate_positional_index import calculate_positional_index

class TestPositionalIndex:
    
    def test_basic_ranking(self):
        """Maior valor = maior índice (maior_melhor=True)."""
        df = pd.DataFrame({
            'Nome_Indicador': ['PIB'] * 3,
            'Ano_Observacao': [2022] * 3,
            'Valor': [100, 200, 300],
            'Codigo_Municipio': ['A', 'B', 'C'],
        })
        result = calculate_positional_index(df, {'PIB': True})
        
        c_index = result[result['Codigo_Municipio'] == 'C']['Indice_Posicional'].iloc[0]
        a_index = result[result['Codigo_Municipio'] == 'A']['Indice_Posicional'].iloc[0]
        assert c_index > a_index

    def test_inverse_ranking(self):
        """Menor valor = maior índice (maior_melhor=False)."""
        df = pd.DataFrame({
            'Nome_Indicador': ['Mortalidade'] * 3,
            'Ano_Observacao': [2022] * 3,
            'Valor': [100, 200, 300],
            'Codigo_Municipio': ['A', 'B', 'C'],
        })
        result = calculate_positional_index(df, {'Mortalidade': False})
        
        a_index = result[result['Codigo_Municipio'] == 'A']['Indice_Posicional'].iloc[0]
        c_index = result[result['Codigo_Municipio'] == 'C']['Indice_Posicional'].iloc[0]
        assert a_index > c_index
    
    def test_range_0_to_1(self):
        """Índice deve estar entre 0 e 1."""
        df = pd.DataFrame({
            'Nome_Indicador': ['X'] * 10,
            'Ano_Observacao': [2022] * 10,
            'Valor': list(range(10)),
            'Codigo_Municipio': [f'M{i}' for i in range(10)],
        })
        result = calculate_positional_index(df, {'X': True})
        
        assert result['Indice_Posicional'].min() >= 0
        assert result['Indice_Posicional'].max() <= 1

    def test_singleton(self):
        """Município único recebe 0.5."""
        df = pd.DataFrame({
            'Nome_Indicador': ['PIB'],
            'Ano_Observacao': [2022],
            'Valor': [100],
            'Codigo_Municipio': ['A'],
        })
        result = calculate_positional_index(df, {'PIB': True})
        assert result['Indice_Posicional'].iloc[0] == 0.5

    def test_ties(self):
        """Empates devem receber o mesmo índice."""
        df = pd.DataFrame({
            'Nome_Indicador': ['PIB'] * 3,
            'Ano_Observacao': [2022] * 3,
            'Valor': [100, 100, 200],
            'Codigo_Municipio': ['A', 'B', 'C'],
        })
        result = calculate_positional_index(df, {'PIB': True})
        
        a_idx = result[result['Codigo_Municipio'] == 'A']['Indice_Posicional'].iloc[0]
        b_idx = result[result['Codigo_Municipio'] == 'B']['Indice_Posicional'].iloc[0]
        assert a_idx == b_idx
```

### 3.2. Correção de Código IBGE

```python
# backend/tests/test_ibge_code_fix.py
import pytest
from etl.scripts.transform.fix_ibge_code import build_correction_dict, fix_codes
import pandas as pd

class TestIBGECodeFix:

    @pytest.fixture
    def correction_dict(self):
        return {"410690": "4106902", "355030": "3550308"}

    def test_7_digit_unchanged(self, correction_dict):
        df = pd.DataFrame({'code': ['4106902']})
        result = fix_codes(df.copy(), 'code', correction_dict)
        assert result['code'].iloc[0] == '4106902'

    def test_6_digit_corrected(self, correction_dict):
        df = pd.DataFrame({'code': ['410690']})
        result = fix_codes(df.copy(), 'code', correction_dict)
        assert result['code'].iloc[0] == '4106902'

    def test_invalid_code_dropped(self, correction_dict):
        df = pd.DataFrame({'code': ['999999']})
        result = fix_codes(df.copy(), 'code', correction_dict)
        assert len(result) == 0
```

---

## 4. Testes de Integração — API (pytest + httpx)

```python
# backend/tests/test_api_municipios.py
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

class TestMunicipiosAPI:

    @pytest.mark.asyncio
    async def test_list_municipios(self, client):
        resp = await client.get("/api/v1/municipios?per_page=10")
        assert resp.status_code == 200
        data = resp.json()
        assert "data" in data
        assert "pagination" in data
        assert len(data["data"]) <= 10

    @pytest.mark.asyncio
    async def test_get_municipio_detail(self, client):
        resp = await client.get("/api/v1/municipios/3550308")
        assert resp.status_code == 200
        data = resp.json()
        assert data["nome"] == "São Paulo"

    @pytest.mark.asyncio
    async def test_get_municipio_not_found(self, client):
        resp = await client.get("/api/v1/municipios/9999999")
        assert resp.status_code == 404

    @pytest.mark.asyncio
    async def test_filter_by_estado(self, client):
        resp = await client.get("/api/v1/municipios?estado=SP")
        assert resp.status_code == 200
        data = resp.json()
        for m in data["data"]:
            assert m["sigla_estado"] == "SP"

    @pytest.mark.asyncio
    async def test_unauthorized_admin(self, client):
        resp = await client.put("/api/v1/admin/municipios/3550308", json={"nome": "Test"})
        assert resp.status_code in [401, 403]
```

---

## 5. Testes E2E (Playwright)

### 5.1. Cenários Críticos

| # | Cenário | Steps |
|---|---|---|
| 1 | Login → Mapa → Clicar município → Ver Bottom Sheet | Login, navegar, clicar no mapa, verificar dados |
| 2 | Dashboard → Adicionar cidades ao Dock → Generate Analysis | Navegar, adicionar 3 cidades, clicar gerar |
| 3 | Relatório → Verificar layout A4 → Exportar PDF | Navegar, verificar conteúdo, testar botão PDF |
| 4 | Catalog → Buscar dataset → Ver detalhes | Navegar, buscar, abrir card, verificar dicionário |
| 5 | Admin → Bulk Import → Upload CSV → Mapear colunas → Validar | Login ADMIN, upload, mapear, verificar resultado |

### 5.2. Exemplo de Teste

```typescript
// tests/e2e/map-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Intelligence Map Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'analista@gov.br');
    await page.fill('[data-testid="password"]', 'test_password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/map');
  });

  test('deve clicar em município e abrir Bottom Sheet', async ({ page }) => {
    // Aguardar mapa carregar
    await page.waitForSelector('[data-testid="map-container"]');
    
    // Clicar no centro do mapa (simula clique em município)
    const map = page.locator('[data-testid="map-container"]');
    await map.click({ position: { x: 400, y: 300 } });
    
    // Verificar Bottom Sheet
    const bottomSheet = page.locator('[data-testid="bottom-sheet"]');
    await expect(bottomSheet).toBeVisible();
    
    // Verificar conteúdo
    await expect(bottomSheet.locator('[data-testid="city-name"]')).toBeVisible();
  });

  test('deve mudar indicador e recolorir mapa', async ({ page }) => {
    await page.click('[data-testid="indicator-idhm"]');
    
    // Verificar que o indicador ativo mudou
    const activeButton = page.locator('[data-testid="indicator-idhm"]');
    await expect(activeButton).toHaveClass(/bg-primary-container/);
  });
});
```

---

## 6. Configuração de CI (vitest + pytest)

### 6.1. Frontend (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      exclude: ['src/test/**', '**/*.d.ts'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
      },
    },
  },
});
```

### 6.2. Backend (`pytest.ini`)

```ini
[pytest]
asyncio_mode = auto
testpaths = tests
python_files = test_*.py
python_functions = test_*
addopts = -v --tb=short
markers =
    integration: marks tests as integration tests
    slow: marks tests as slow
```

---

## 7. Métricas de Qualidade Mínimas

| Métrica | Mínimo Aceitável | Meta |
|---|---|---|
| Cobertura de linhas (frontend) | 70% | 85% |
| Cobertura de funções (frontend) | 70% | 80% |
| Cobertura de linhas (backend) | 75% | 90% |
| Testes passando | 100% | 100% |
| Lint errors | 0 | 0 |
| Type errors (tsc) | 0 | 0 |
| E2E cenários passando | 100% | 100% |
