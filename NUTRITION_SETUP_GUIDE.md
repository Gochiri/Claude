# 🚀 Guía de Setup - Aplicación de Nutrición

## Inicio Rápido - Checklist

- [ ] Configurar entorno de desarrollo
- [ ] Crear estructura de directorios
- [ ] Configurar base de datos PostgreSQL
- [ ] Instalar dependencias backend
- [ ] Configurar variables de entorno
- [ ] Ejecutar migraciones
- [ ] Instalar dependencias frontend
- [ ] Configurar APIs externas
- [ ] Probar aplicación localmente

**Tiempo estimado:** 1-2 horas

---

## 1️⃣ Prerrequisitos

### Software Requerido

```bash
# Verificar versiones instaladas
python --version   # Python 3.10 o superior
node --version     # Node.js 18 o superior
npm --version      # npm 9 o superior
psql --version     # PostgreSQL 14 o superior
git --version      # Git (cualquier versión reciente)
```

### Instalación de Software Faltante

#### macOS (Homebrew)
```bash
brew install python@3.10
brew install node
brew install postgresql@14
brew install git
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip
sudo apt install nodejs npm
sudo apt install postgresql postgresql-contrib
sudo apt install git
```

#### Windows
```powershell
# Usar Chocolatey
choco install python --version=3.10
choco install nodejs
choco install postgresql14
choco install git

# O descargar instaladores:
# Python: https://www.python.org/downloads/
# Node.js: https://nodejs.org/
# PostgreSQL: https://www.postgresql.org/download/windows/
# Git: https://git-scm.com/download/win
```

---

## 2️⃣ Crear Estructura del Proyecto

### Opción A: Clonar estructura base (recomendado)

```bash
# Crear directorio del proyecto
mkdir nutrition-tracker
cd nutrition-tracker

# Crear estructura de directorios
mkdir -p backend/app/{api/v1,core,db,models,schemas,services,utils}
mkdir -p backend/alembic/versions
mkdir -p backend/tests
mkdir -p frontend/src/{components/{auth,dashboard,meals,plans,profile,progress,common},hooks,services,store,types,utils,pages}
mkdir -p frontend/public
mkdir -p docs
mkdir -p scripts

# Inicializar Git
git init
echo "# Nutrition Tracker App" > README.md
git add README.md
git commit -m "Initial commit"
```

### Opción B: Script automatizado

```bash
# Guardar como setup_structure.sh
cat > setup_structure.sh << 'EOF'
#!/bin/bash
echo "🚀 Creando estructura del proyecto..."

# Backend
mkdir -p backend/app/{api/v1,core,db,models,schemas,services,utils}
mkdir -p backend/alembic/versions
mkdir -p backend/tests

# Frontend
mkdir -p frontend/src/{components/{auth,dashboard,meals,plans,profile,progress,common},hooks,services,store,types,utils,pages}
mkdir -p frontend/public

# Otros
mkdir -p docs scripts

echo "✅ Estructura creada exitosamente!"
tree -L 3 -d
EOF

chmod +x setup_structure.sh
./setup_structure.sh
```

---

## 3️⃣ Configurar Backend (FastAPI)

### Paso 1: Crear entorno virtual

```bash
cd backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate

# En Windows:
venv\Scripts\activate

# Verificar que está activado
which python  # Debe mostrar ruta dentro de venv/
```

### Paso 2: Instalar dependencias

```bash
# Crear requirements.txt
cat > requirements.txt << 'EOF'
# Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Database
sqlalchemy==2.0.25
alembic==1.13.1
psycopg2-binary==2.9.9
asyncpg==0.29.0

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# External APIs
openai==1.12.0
httpx==0.26.0
aiohttp==3.9.1

# Utilities
python-dotenv==1.0.0
pillow==10.2.0
redis==5.0.1

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3
pytest-cov==4.1.0
EOF

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación
pip list
```

### Paso 3: Configurar base de datos PostgreSQL

```bash
# Iniciar servicio PostgreSQL
# macOS/Linux:
sudo service postgresql start

# macOS (Homebrew):
brew services start postgresql@14

# Crear base de datos y usuario
psql postgres << 'EOF'
CREATE DATABASE nutrition_db;
CREATE USER nutrition_user WITH PASSWORD 'nutrition_password_2024';
GRANT ALL PRIVILEGES ON DATABASE nutrition_db TO nutrition_user;
\q
EOF

# Verificar conexión
psql -U nutrition_user -d nutrition_db -c "SELECT version();"
```

### Paso 4: Configurar variables de entorno

```bash
# Crear archivo .env
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://nutrition_user:nutrition_password_2024@localhost:5432/nutrition_db
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-change-this-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# External APIs
OPENAI_API_KEY=sk-your-openai-api-key-here
USDA_API_KEY=your-usda-api-key-here
SPOONACULAR_API_KEY=your-spoonacular-api-key-here

# Storage (Cloudflare R2)
CLOUDFLARE_R2_ACCESS_KEY=your-r2-access-key
CLOUDFLARE_R2_SECRET_KEY=your-r2-secret-key
CLOUDFLARE_R2_BUCKET=nutrition-photos
CLOUDFLARE_R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com

# Environment
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
EOF

# Generar SECRET_KEY segura
python -c "import secrets; print(f'SECRET_KEY={secrets.token_hex(32)}')"
# Copiar el output y reemplazar en .env
```

### Paso 5: Crear archivo de configuración

```python
# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    REDIS_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # External APIs
    OPENAI_API_KEY: str
    USDA_API_KEY: str
    SPOONACULAR_API_KEY: str = ""

    # Storage
    CLOUDFLARE_R2_ACCESS_KEY: str = ""
    CLOUDFLARE_R2_SECRET_KEY: str = ""
    CLOUDFLARE_R2_BUCKET: str = ""
    CLOUDFLARE_R2_ENDPOINT: str = ""

    # App
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### Paso 6: Crear punto de entrada de FastAPI

```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="Nutrition Tracker API",
    description="API para seguimiento nutricional con análisis de fotos",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Nutrition Tracker API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Aquí irán los routers de la API
# from app.api.v1 import auth, users, meals, etc.
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
```

### Paso 7: Ejecutar servidor de desarrollo

```bash
# Asegurar que estás en /backend con venv activado
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows

# Ejecutar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Verificar en el navegador:
# http://localhost:8000 -> {"message": "Nutrition Tracker API"}
# http://localhost:8000/docs -> Documentación Swagger interactiva
```

---

## 4️⃣ Configurar Frontend (React + TypeScript)

### Paso 1: Crear proyecto React

```bash
# Volver a directorio raíz
cd ..

# Crear app React con TypeScript
npx create-react-app frontend --template typescript

cd frontend
```

### Paso 2: Instalar dependencias adicionales

```bash
# Router
npm install react-router-dom
npm install -D @types/react-router-dom

# Estado y queries
npm install zustand
npm install @tanstack/react-query

# HTTP client
npm install axios

# UI y estilos
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Utilidades
npm install date-fns
npm install clsx

# Formularios
npm install react-hook-form
npm install zod

# Gráficos
npm install recharts

# Iconos
npm install lucide-react
```

### Paso 3: Configurar Tailwind CSS

```javascript
// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
    },
  },
  plugins: [],
}
```

```css
/* frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Paso 4: Configurar variables de entorno

```bash
# Crear .env
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
EOF
```

### Paso 5: Crear estructura base

```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Paso 6: Ejecutar frontend

```bash
# En directorio /frontend
npm start

# Se abrirá automáticamente en http://localhost:3000
```

---

## 5️⃣ Configurar Migraciones de Base de Datos

```bash
cd backend

# Inicializar Alembic
alembic init alembic

# Editar alembic.ini - cambiar sqlalchemy.url
# sqlalchemy.url = postgresql://nutrition_user:nutrition_password_2024@localhost:5432/nutrition_db

# O mejor, usar variable de entorno en alembic/env.py:
```

```python
# backend/alembic/env.py
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Importar base de modelos
from app.db.base import Base
from app.models.user import User  # Importar todos los modelos
# from app.models.meal import Meal
# etc...

# this is the Alembic Config object
config = context.config

# Usar DATABASE_URL del .env
config.set_main_option('sqlalchemy.url', os.getenv('DATABASE_URL'))

# Interpret the config file for Python logging
fileConfig(config.config_file_name)

target_metadata = Base.metadata

# ... resto del archivo generado por Alembic
```

```bash
# Crear primera migración
alembic revision --autogenerate -m "Create initial tables"

# Ejecutar migraciones
alembic upgrade head

# Verificar tablas creadas
psql -U nutrition_user -d nutrition_db -c "\dt"
```

---

## 6️⃣ Obtener API Keys

### USDA FoodData Central (GRATIS)

1. Ir a https://fdc.nal.usda.gov/api-guide.html
2. Click en "Get an API Key"
3. Completar formulario (nombre, email, uso: "Nutrition tracking app")
4. Copiar API key y agregar a `.env`:
   ```
   USDA_API_KEY=tu-api-key-aqui
   ```

### OpenAI GPT-4 Vision (PAGO)

1. Ir a https://platform.openai.com/signup
2. Crear cuenta y agregar método de pago
3. Ir a https://platform.openai.com/api-keys
4. Click en "Create new secret key"
5. Copiar y agregar a `.env`:
   ```
   OPENAI_API_KEY=sk-tu-api-key-aqui
   ```
6. **Importante:** Configurar límite de gasto mensual en Settings > Billing

### Spoonacular API (Opcional - 150 requests/día gratis)

1. Ir a https://spoonacular.com/food-api
2. Click en "Get Started" y crear cuenta
3. En Dashboard, copiar API Key
4. Agregar a `.env`:
   ```
   SPOONACULAR_API_KEY=tu-api-key-aqui
   ```

---

## 7️⃣ Probar Configuración Completa

### Script de verificación

```python
# backend/scripts/verify_setup.py
import os
import sys
from dotenv import load_dotenv
import httpx
from sqlalchemy import create_engine, text

load_dotenv()

def check_env_vars():
    """Verificar variables de entorno"""
    required_vars = [
        'DATABASE_URL',
        'SECRET_KEY',
        'OPENAI_API_KEY',
        'USDA_API_KEY'
    ]

    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)

    if missing:
        print(f"❌ Faltan variables: {', '.join(missing)}")
        return False

    print("✅ Variables de entorno configuradas")
    return True

def check_database():
    """Verificar conexión a base de datos"""
    try:
        engine = create_engine(os.getenv('DATABASE_URL'))
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Conexión a PostgreSQL exitosa")
            return True
    except Exception as e:
        print(f"❌ Error de base de datos: {e}")
        return False

async def check_usda_api():
    """Verificar USDA API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.nal.usda.gov/fdc/v1/foods/search",
                params={
                    "api_key": os.getenv('USDA_API_KEY'),
                    "query": "apple",
                    "pageSize": 1
                }
            )
            response.raise_for_status()
            print("✅ USDA API funcionando")
            return True
    except Exception as e:
        print(f"❌ Error USDA API: {e}")
        return False

if __name__ == "__main__":
    print("\n🔍 Verificando configuración...\n")

    checks = [
        check_env_vars(),
        check_database(),
    ]

    # USDA API check (async)
    import asyncio
    checks.append(asyncio.run(check_usda_api()))

    print("\n" + "="*50)
    if all(checks):
        print("🎉 ¡Configuración completa y funcionando!")
        sys.exit(0)
    else:
        print("⚠️  Hay problemas con la configuración")
        sys.exit(1)
```

```bash
# Ejecutar verificación
cd backend
python scripts/verify_setup.py
```

---

## 8️⃣ Comandos Útiles de Desarrollo

### Backend

```bash
# Activar entorno virtual
cd backend
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload

# Ejecutar tests
pytest

# Generar migración
alembic revision --autogenerate -m "descripcion"

# Aplicar migraciones
alembic upgrade head

# Rollback última migración
alembic downgrade -1

# Ver documentación interactiva
# http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

# Ejecutar en desarrollo
npm start

# Build para producción
npm run build

# Ejecutar tests
npm test

# Linter
npm run lint
```

### Docker (Opcional - Setup completo)

```yaml
# docker-compose.yml (en raíz del proyecto)
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: nutrition_user
      POSTGRES_PASSWORD: nutrition_password_2024
      POSTGRES_DB: nutrition_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    env_file:
      - ./backend/.env

  frontend:
    build: ./frontend
    command: npm start
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

---

## 9️⃣ Próximos Pasos

Una vez completada la configuración:

1. ✅ **Implementar modelos de base de datos**
   - Crear modelos en `backend/app/models/`
   - Generar y aplicar migraciones

2. ✅ **Desarrollar endpoints de autenticación**
   - Registro de usuarios
   - Login/Logout
   - Refresh token

3. ✅ **Implementar cálculo nutricional**
   - Servicio de cálculo de TMB/TDEE
   - API endpoint para calcular perfil nutricional

4. ✅ **Integrar análisis de fotos**
   - Servicio de GPT-4 Vision
   - Endpoint de upload y análisis

5. ✅ **Desarrollar frontend básico**
   - Pantalla de login/registro
   - Dashboard principal
   - Formulario de agregar comida

---

## 🐛 Solución de Problemas Comunes

### Error: `ModuleNotFoundError: No module named 'app'`

```bash
# Asegurar que estás en el directorio correcto
cd backend

# Verificar que app/ tenga __init__.py
touch app/__init__.py

# Ejecutar desde el directorio correcto
uvicorn app.main:app --reload
```

### Error: `psycopg2.OperationalError: connection refused`

```bash
# Verificar que PostgreSQL está corriendo
sudo service postgresql status  # Linux
brew services list              # macOS

# Iniciar PostgreSQL
sudo service postgresql start   # Linux
brew services start postgresql  # macOS

# Verificar credenciales en .env
```

### Error: `CORS policy` en frontend

```python
# backend/app/main.py - Verificar configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend: `Module not found: Can't resolve 'XXX'`

```bash
# Reinstalar node_modules
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Recursos Adicionales

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Alembic**: https://alembic.sqlalchemy.org/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts**: https://recharts.org/

---

**¡Configuración completa! 🎉**

Ahora estás listo para empezar a desarrollar la aplicación de nutrición.

**Documento creado**: 2026-01-02
**Versión**: 1.0
