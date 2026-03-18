# Setup do Projeto — GitHub, Executável e Instalação

## SisInfo / GeoIntel — V2

---

## 1. Repositório GitHub

### 1.1. Configuração Inicial

```bash
# Criar repositório
gh repo create sisinfo-geointel --private --description "SisInfo GeoIntel - Plataforma de Inteligência Territorial"

# Clonar e configurar
git clone https://github.com/<org>/sisinfo-geointel.git
cd sisinfo-geointel
git checkout -b develop
```

### 1.2. Estrutura de Branches

```
main          ← Produção (releases taggeadas)
  └── develop     ← Branch de integração
       ├── feature/map-module
       ├── feature/dashboard
       ├── feature/reports
       ├── feature/catalog
       ├── feature/admin-editor
       ├── feature/etl-pipeline
       └── fix/...
```

### 1.3. Regras de Branch Protection (main)

| Regra | Configuração |
|---|---|
| Require PR reviews | Mínimo 1 reviewer |
| Require status checks | CI pipeline (lint + test + build) |
| Require up-to-date branch | Sim |
| Include administrators | Sim |
| Allow force push | Não |

### 1.4. `.gitignore`

```gitignore
# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/
venv/

# Build outputs
frontend/dist/
backend/dist/
src-tauri/target/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Data (não versionar dados brutos)
etl/data/raw/
etl/data/processed/
*.csv
*.geojson
!etl/config/**

# Docker volumes
pgdata/
redisdata/

# Logs
*.log
logs/

# Backups
backups/
```

### 1.5. `.env.example`

```env
# Database
DB_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql+asyncpg://geointel:${DB_PASSWORD}@localhost:5432/geointel_db

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET=your_jwt_secret_with_at_least_32_characters

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Martin
MARTIN_DATABASE_URL=postgresql://geointel:${DB_PASSWORD}@localhost:5432/geointel_db

# Frontend
VITE_API_URL=http://localhost:8000/api/v1
VITE_TILES_URL=http://localhost:3000

# Airflow (optional)
AIRFLOW_UID=50000
AIRFLOW__CORE__EXECUTOR=LocalExecutor
```

---

## 2. Setup do Frontend

### 2.1. Inicialização do Projeto

```bash
# Criar projeto Vite + React + TypeScript
cd frontend/
npm create vite@latest . -- --template react-ts

# Dependências principais
npm install react-router-dom@6 zustand @tanstack/react-query axios
npm install maplibre-gl recharts d3 @turf/turf
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D @types/d3

# Inicializar Tailwind
npx tailwindcss init -p
```

### 2.2. `package.json` Scripts

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src/ --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

---

## 3. Setup do Backend

### 3.1. Ambiente Python

```bash
cd backend/
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # Linux/macOS

pip install fastapi uvicorn[standard] sqlalchemy[asyncio] asyncpg
pip install geoalchemy2 alembic pydantic[email] python-jose[cryptography]
pip install passlib[bcrypt] redis pandas geopandas
pip install -r requirements.txt
```

### 3.2. `requirements.txt`

```
fastapi==0.110.0
uvicorn[standard]==0.29.0
sqlalchemy[asyncio]==2.0.28
asyncpg==0.29.0
geoalchemy2==0.14.3
alembic==1.13.1
pydantic[email]==2.6.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
redis==5.0.2
pandas==2.2.1
geopandas==0.14.3
python-multipart==0.0.9
slowapi==0.1.9
httpx==0.27.0
```

### 3.3. Inicialização Alembic

```bash
cd backend/
alembic init alembic
# Editar alembic.ini com a DATABASE_URL
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

### 3.4. `Dockerfile`

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 4. Setup do Banco de Dados

```bash
# Via Docker (recomendado)
docker run -d \
  --name geointel-postgres \
  -e POSTGRES_DB=geointel_db \
  -e POSTGRES_USER=geointel \
  -e POSTGRES_PASSWORD=dev_password \
  -p 5432:5432 \
  postgis/postgis:16-3.4

# Verificar PostGIS
docker exec -it geointel-postgres psql -U geointel -d geointel_db -c "SELECT PostGIS_Version();"
```

---

## 5. Setup do Tauri (App Desktop)

### 5.1. Pré-requisitos

| SO | Requisitos |
|---|---|
| Windows | Visual Studio Build Tools 2022, WebView2, Rust |
| Linux | `libgtk-3-dev`, `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, Rust |
| macOS | Xcode Command Line Tools, Rust |

### 5.2. Instalação

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Adicionar Tauri CLI ao projeto frontend
cd frontend/
npm install -D @tauri-apps/cli @tauri-apps/api

# Inicializar Tauri
npx tauri init
```

### 5.3. Configuração (`src-tauri/tauri.conf.json`)

```json
{
  "$schema": "https://raw.githubusercontent.com/niceda/tauri/dev/schema.json",
  "productName": "SisInfo GeoIntel",
  "version": "2.0.0",
  "identifier": "br.gov.geointel.sisinfo",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "title": "SisInfo GeoIntel",
    "windows": [
      {
        "title": "SisInfo GeoIntel - Inteligência Territorial",
        "width": 1440,
        "height": 900,
        "minWidth": 1024,
        "minHeight": 768,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": "default-src 'self'; connect-src 'self' https://api.geointel.gov.br https://*.tiles.geointel.gov.br; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:"
    }
  },
  "bundle": {
    "active": true,
    "targets": ["msi", "nsis", "appimage", "deb", "dmg"],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "resources": [],
    "windows": {
      "wix": {
        "language": "pt-BR"
      },
      "nsis": {
        "languages": ["PortugueseBR"],
        "displayLanguageSelector": false,
        "installerIcon": "icons/icon.ico"
      }
    },
    "linux": {
      "deb": {
        "depends": ["libwebkit2gtk-4.1-0", "libgtk-3-0"]
      }
    }
  }
}
```

### 5.4. Build dos Executáveis

```bash
# Desenvolvimento
npm run tauri dev

# Build de produção (gera instaladores)
npm run tauri build

# Outputs (Windows):
# src-tauri/target/release/bundle/msi/SisInfo GeoIntel_2.0.0_x64.msi
# src-tauri/target/release/bundle/nsis/SisInfo GeoIntel_2.0.0_x64-setup.exe
```

---

## 6. Quickstart Completo (Novo Desenvolvedor)

```bash
# 1. Clonar repositório
git clone https://github.com/<org>/sisinfo-geointel.git
cd sisinfo-geointel

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Subir infraestrutura (PostgreSQL, Redis, Martin)
cd infra/
docker compose up -d postgres redis martin

# 4. Setup do Backend
cd ../backend/
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m app.db.init_db  # seed de dados iniciais
uvicorn app.main:app --reload

# 5. Setup do Frontend (novo terminal)
cd ../frontend/
npm install
npm run dev

# 6. Acessar
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/docs (Swagger)
# Martin Tiles: http://localhost:3000/catalog
```

---

## 7. README.md (Template)

```markdown
# SisInfo GeoIntel 🌍

Plataforma de Inteligência Territorial e Analítica para dados socioeconômicos do Brasil.

## Stack
- **Frontend:** React + TypeScript + MapLibre GL JS + Recharts
- **Backend:** Python FastAPI + PostgreSQL/PostGIS
- **Tiles:** Martin (Vector Tiles MVT)
- **Desktop:** Tauri (executável nativo)

## Quickstart
\`\`\`bash
cp .env.example .env
cd infra && docker compose up -d
cd ../backend && pip install -r requirements.txt && alembic upgrade head
cd ../frontend && npm install && npm run dev
\`\`\`

## Documentação
Veja a pasta `/docs` para documentação técnica completa.

## Licença
Proprietário — Todos os direitos reservados.
```
