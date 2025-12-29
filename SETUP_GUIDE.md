# 🚀 GHL UI Skin - Setup Guide

Guía completa para configurar y ejecutar el MVP de UI Skin para GoHighLevel en tu entorno de desarrollo.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.11+** - [Descargar](https://www.python.org/downloads/)
- **Node.js 18+** - [Descargar](https://nodejs.org/)
- **PostgreSQL 14+** - O una cuenta de Supabase (recomendado para MVP)
- **Redis** - O una cuenta de Upstash (recomendado para MVP)
- **Git** - Para control de versiones

---

## 🗄️ Paso 1: Configurar Base de Datos (Supabase)

### Opción A: Supabase (Recomendado para MVP)

1. **Crear cuenta en Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Regístrate (free tier incluye 500MB de base de datos)

2. **Crear un nuevo proyecto**
   - Nombre: `ghl-ui-skin`
   - Región: `South America` (o la más cercana)
   - Contraseña: **Guarda esto de forma segura**

3. **Ejecutar el schema SQL**
   - En el dashboard de Supabase, ve a **SQL Editor**
   - Copia el contenido de `ghl-ui-skin-backend/database/schema.sql`
   - Pega y ejecuta el script
   - Verifica que se crearon las tablas: `agencies`, `agency_styles`, `subaccounts`, `feature_locks`

4. **Obtener la connection string**
   - Ve a **Settings** → **Database**
   - Copia la **Connection String** (URI mode)
   - Formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

### Opción B: PostgreSQL Local

```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres createdb ghl_ui_skin

# Ejecutar schema
psql -U postgres -d ghl_ui_skin -f ghl-ui-skin-backend/database/schema.sql
```

---

## 💾 Paso 2: Configurar Redis (Upstash)

### Opción A: Upstash (Recomendado para MVP)

1. **Crear cuenta en Upstash**
   - Ve a [https://upstash.com](https://upstash.com)
   - Regístrate (free tier incluye 10,000 commands/día)

2. **Crear una base de datos Redis**
   - Nombre: `ghl-ui-skin-cache`
   - Región: `us-east-1` (o la más cercana)
   - Type: `Regional`

3. **Obtener la connection string**
   - En el dashboard, copia la **REST URL**
   - Formato: `redis://default:[PASSWORD]@[ENDPOINT].upstash.io:6379`

### Opción B: Redis Local

```bash
# Instalar Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Verificar que está corriendo
redis-cli ping
# Debe responder: PONG
```

---

## 🔧 Paso 3: Configurar Backend (FastAPI)

```bash
# 1. Navegar al directorio del backend
cd ghl-ui-skin-backend

# 2. Crear entorno virtual
python3 -m venv venv

# 3. Activar entorno virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Crear archivo .env
cp .env.example .env

# 6. Editar .env con tus credenciales
nano .env
```

### Configuración del archivo `.env`:

```env
# Application
APP_NAME="GHL UI Skin API"
DEBUG=True
SECRET_KEY=tu-clave-secreta-super-segura-cambia-esto
ADMIN_API_KEY=admin-api-key-para-actualizaciones

# Database (Supabase)
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# Redis (Upstash)
REDIS_URL=redis://default:TU_PASSWORD@endpoint.upstash.io:6379

# CORS Origins (GHL domains)
CORS_ORIGINS=https://app.gohighlevel.com,https://app.leadconnectorhq.com

# JWT Configuration
JWT_SECRET_KEY=otra-clave-secreta-diferente-para-jwt
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=10080

# CDN Configuration (cambiar cuando tengas dominio)
CDN_BASE_URL=http://localhost:8000/static

# Sentry (opcional, dejar vacío por ahora)
SENTRY_DSN=

# Cache TTL (seconds)
CACHE_CONFIG_TTL=300
```

### Generar claves secretas seguras:

```bash
# Generar SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generar JWT_SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Iniciar el servidor backend:

```bash
# Desarrollo (con hot-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Producción
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Verificar que funciona:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Debe responder:
# {"status":"healthy","redis":true,"timestamp":"2025-12-29"}
```

---

## 🎨 Paso 4: Configurar Frontend (React)

```bash
# 1. Navegar al directorio del frontend
cd ../ghl-ui-skin-frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Editar .env
nano .env
```

### Configuración del archivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_CDN_URL=http://localhost:8000/static
```

### Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

---

## 📜 Paso 5: Configurar Script de Inyección

### Para desarrollo local:

1. Editar `cdn-scripts/inject.js`:

```javascript
// Cambiar la línea 17 a:
const CONFIG = {
    API_URL: 'http://localhost:8000/api/v1/config',
    // ...
};
```

2. Servir el script localmente (usando Python):

```bash
cd cdn-scripts
python3 -m http.server 8080
```

El script estará disponible en: `http://localhost:8080/inject.js`

### Para testing en GHL:

**Importante:** GHL no permite scripts desde `localhost`. Necesitas:

1. **Opción A:** Usar ngrok para exponer tu localhost:
   ```bash
   # Instalar ngrok: https://ngrok.com/download
   ngrok http 8080

   # Usar la URL HTTPS que te da ngrok en GHL
   ```

2. **Opción B:** Subir el script a un CDN real:
   - Cloudflare Pages
   - Vercel
   - Netlify

---

## 🧪 Paso 6: Testing

### Test 1: Registro de Agencia

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agency",
    "email": "test@example.com",
    "password": "test123456",
    "ghl_agency_id": "test-agency-001"
  }'

# Debe responder con un token JWT
```

### Test 2: Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Test 3: Obtener Configuración

```bash
curl "http://localhost:8000/api/v1/config?agency=test-agency-001"

# Debe responder con:
# {
#   "primaryColor": "#4F46E5",
#   "secondaryColor": "#10B981",
#   ...
# }
```

### Test 4: Actualizar Estilos

```bash
# Primero obtén el token del login
TOKEN="tu-token-jwt-aquí"

curl -X PUT http://localhost:8000/api/v1/styles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "primary_color": "#FF0000",
    "secondary_color": "#00FF00"
  }'
```

---

## 🌐 Paso 7: Testing en GHL (Opcional)

### Prerequisitos:

- Cuenta de GHL (puedes usar trial de 14 días)
- Script accesible desde HTTPS (ngrok o CDN)

### Pasos:

1. **Login en GHL**
   - Ve a [https://app.gohighlevel.com](https://app.gohighlevel.com)

2. **Ir a Agency Settings**
   - Settings → Agency Settings → Custom Code

3. **Pegar el script**
   ```html
   <script src="https://TU-DOMINIO/inject.js"></script>
   ```

4. **Guardar y recargar**
   - Guarda los cambios
   - Recarga la página de GHL
   - Abre la consola del navegador (F12)
   - Busca logs de `[GHL UI Skin]`

---

## 🔍 Troubleshooting

### Problema: "Database connection failed"

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Verificar connection string en .env
# Asegúrate de que el password esté correcto
```

### Problema: "Redis connection failed"

**Solución:**
```bash
# Verificar que Redis está corriendo
redis-cli ping

# Si usas Upstash, verifica la URL en .env
```

### Problema: "CORS error" en el frontend

**Solución:**
```python
# En app/main.py, verifica que las URLs estén correctas:
allow_origins=["http://localhost:3000", "http://localhost:5173"]
```

### Problema: "Module not found" en Python

**Solución:**
```bash
# Verifica que el virtual environment esté activado
source venv/bin/activate

# Reinstala dependencias
pip install -r requirements.txt
```

### Problema: Script no se carga en GHL

**Solución:**
1. Verifica que la URL sea HTTPS (GHL bloquea HTTP)
2. Verifica CORS en el servidor
3. Revisa la consola del navegador para errores

---

## 📊 Monitoreo

### Logs del Backend:

```bash
# Ver logs en tiempo real
tail -f backend.log

# O con uvicorn directamente:
uvicorn app.main:app --reload --log-level debug
```

### Logs del Frontend:

- Abre la consola del navegador (F12)
- Pestaña "Console"
- Filtra por "[GHL UI Skin]"

### Redis Monitoring:

```bash
# Ver todas las claves en caché
redis-cli KEYS "*"

# Ver una clave específica
redis-cli GET "config:test-agency-001:default"
```

---

## 🚀 Deployment (Producción)

### Backend: Railway.app

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar proyecto
cd ghl-ui-skin-backend
railway init

# 4. Deploy
railway up

# 5. Configurar variables de entorno en Railway dashboard
railway open
```

### Frontend: Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd ghl-ui-skin-frontend
vercel

# 4. Configurar variables de entorno
vercel env add VITE_API_URL
```

### CDN: Cloudflare Workers

```bash
# 1. Crear cuenta en Cloudflare
# 2. Subir inject.js a Workers
# 3. Configurar ruta: https://cdn.tudominio.com/inject.js
```

---

## ✅ Checklist de Setup

- [ ] PostgreSQL/Supabase configurado
- [ ] Redis/Upstash configurado
- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 3000
- [ ] Archivo .env configurado (backend y frontend)
- [ ] Test de registro exitoso
- [ ] Test de login exitoso
- [ ] Test de configuración exitoso
- [ ] Script inject.js accesible
- [ ] Logs visibles en consola

---

## 📚 Recursos Adicionales

- **Documentación de FastAPI:** [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Documentación de React:** [https://react.dev](https://react.dev)
- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **Upstash Docs:** [https://docs.upstash.com](https://docs.upstash.com)

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa la sección de [Troubleshooting](#troubleshooting)
2. Verifica los logs del backend y frontend
3. Revisa la consola del navegador (F12)
4. Busca errores en GitHub Issues

---

**¡Felicidades! Tu entorno de desarrollo está listo.** 🎉

Próximo paso: Ve a `http://localhost:3000` y crea tu primera agencia.
