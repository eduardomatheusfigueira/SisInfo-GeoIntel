# Plano de DevOps e CI/CD

## SisInfo / GeoIntel — V2

---

## 1. Ambientes

| Ambiente | Propósito | Infraestrutura | URL |
|---|---|---|---|
| **Local (dev)** | Desenvolvimento individual | Docker Compose | `localhost:5173` |
| **Staging** | Testes de integração e QA | Docker Compose em VPS | `staging.geointel.gov.br` |
| **Produção** | Usuários finais | Docker Compose em VPS (ou cloud) | `app.geointel.gov.br` |

---

## 2. Docker Compose — Desenvolvimento

```yaml
# infra/docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: geointel_db
      POSTGRES_USER: geointel
      POSTGRES_PASSWORD: ${DB_PASSWORD:-dev_password}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/01-init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U geointel"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

  martin:
    image: maplibre/martin:v0.14.2
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: "postgresql://geointel:${DB_PASSWORD:-dev_password}@postgres:5432/geointel_db"
    volumes:
      - ./martin/config.yaml:/config.yaml
    command: ["--config", "/config.yaml"]

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: "postgresql+asyncpg://geointel:${DB_PASSWORD:-dev_password}@postgres:5432/geointel_db"
      REDIS_URL: "redis://redis:6379/0"
      JWT_SECRET: ${JWT_SECRET:-dev_jwt_secret_change_me}
      CORS_ORIGINS: "http://localhost:5173"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ../backend/app:/app/app  # Hot reload em dev
    command: ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: "http://localhost:8000/api/v1"
      VITE_TILES_URL: "http://localhost:3000"
    volumes:
      - ../frontend/src:/app/src
    command: ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

volumes:
  pgdata:
  redisdata:
```

---

## 3. Docker Compose — Produção

```yaml
# infra/docker-compose.prod.yml
version: '3.9'

services:
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - frontend_dist:/usr/share/nginx/html:ro
    depends_on:
      - backend
      - martin
    restart: always

  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: geointel_db
      POSTGRES_USER: geointel
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backups:/backups
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data
    restart: always

  martin:
    image: maplibre/martin:v0.14.2
    environment:
      DATABASE_URL: "postgresql://geointel:${DB_PASSWORD}@postgres:5432/geointel_db"
    restart: always

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: "postgresql+asyncpg://geointel:${DB_PASSWORD}@postgres:5432/geointel_db"
      REDIS_URL: "redis://redis:6379/0"
      JWT_SECRET: ${JWT_SECRET}
    command: ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
    restart: always

volumes:
  pgdata:
  redisdata:
  frontend_dist:
```

---

## 4. Nginx — Configuração de Produção

```nginx
# infra/nginx/nginx.conf
events { worker_connections 1024; }

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    
    upstream api {
        server backend:8000;
    }
    
    upstream tiles {
        server martin:3000;
    }

    server {
        listen 80;
        server_name app.geointel.gov.br;
        
        # Frontend (SPA)
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
            expires 1h;
        }
        
        # API Backend
        location /api/ {
            proxy_pass http://api/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        
        # Vector Tiles (Martin)
        location /tiles/ {
            proxy_pass http://tiles/;
            proxy_set_header Host $host;
            add_header Cache-Control "public, max-age=3600";
            add_header Access-Control-Allow-Origin "*";
        }
    }
}
```

---

## 5. GitHub Actions — CI

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test -- --coverage
      - run: npm run build

  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgis/postgis:16-3.4
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
        options: --health-cmd pg_isready --health-interval 10s
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pip install pytest pytest-asyncio httpx
      - run: pytest tests/ -v --tb=short
        env:
          DATABASE_URL: "postgresql+asyncpg://test:test@localhost:5432/test_db"

  etl-tests:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: etl
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install pandas geopandas pytest
      - run: pytest scripts/tests/ -v
```

---

## 6. GitHub Actions — Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build frontend
        working-directory: frontend
        run: |
          npm ci
          npm run build
      
      - name: Build Docker images
        run: |
          docker compose -f infra/docker-compose.prod.yml build
      
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /opt/geointel
            git pull origin main
            docker compose -f infra/docker-compose.prod.yml up -d --build
            docker compose -f infra/docker-compose.prod.yml exec backend alembic upgrade head
```

---

## 7. Backup e Recuperação

```bash
#!/bin/bash
# infra/scripts/backup.sh — Executar via cron diário
BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="geointel_${TIMESTAMP}.sql.gz"

docker compose exec -T postgres pg_dump -U geointel geointel_db | gzip > "${BACKUP_DIR}/${FILENAME}"

# Manter últimos 30 backups
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +30 -delete
```

---

## 8. Tauri — Build de Executável Desktop

```json
// src-tauri/tauri.conf.json (parcial)
{
  "productName": "SisInfo GeoIntel",
  "version": "2.0.0",
  "identifier": "br.gov.geointel.sisinfo",
  "build": {
    "frontendDist": "../frontend/dist"
  },
  "app": {
    "windows": [
      {
        "title": "SisInfo GeoIntel - Inteligência Territorial",
        "width": 1440,
        "height": 900,
        "minWidth": 1024,
        "minHeight": 768
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": ["msi", "nsis", "appimage", "deb", "dmg"],
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.ico"]
  }
}
```

**Build commands:**
```bash
# Windows
npm run tauri build -- --target x86_64-pc-windows-msvc

# Linux  
npm run tauri build -- --target x86_64-unknown-linux-gnu

# macOS
npm run tauri build -- --target x86_64-apple-darwin
```
