# 🌐 Integración con Servicios de Scraping Profesionales

Esta guía explica cómo configurar y usar ScraperAPI, Bright Data o Apify para solucionar las restricciones de proxy.

---

## 📋 Servicios Disponibles

### **1. ScraperAPI** (⭐ RECOMENDADO para empezar)

**Precio:** Desde $49/mes (100,000 requests)
**Tier Gratis:** 5,000 requests/mes
**Ventajas:** Más fácil de usar, buen precio
**Registro:** https://www.scraperapi.com/signup

### **2. Bright Data** (Para empresas)

**Precio:** Desde $500/mes (pay-as-you-go disponible)
**Ventajas:** Más robusto, mejor para escala
**Registro:** https://brightdata.com/cp/start

### **3. Apify** (⭐ Mejor tier gratis)

**Precio:** Desde $49/mes
**Tier Gratis:** Muy generoso, perfecto para pruebas
**Ventajas:** Muy fácil de usar, tier gratis generoso
**Registro:** https://console.apify.com/sign-up

---

## 🚀 Configuración Rápida

### **Paso 1: Elegir un servicio**

**Para empezar rápido:** ScraperAPI o Apify (tienen tier gratis)

### **Paso 2: Registrarse y obtener credenciales**

#### ScraperAPI:
```
1. Ve a https://www.scraperapi.com/signup
2. Regístrate (email + password)
3. Verifica tu email
4. Ve a Dashboard → API Key
5. Copia tu API key
```

#### Apify:
```
1. Ve a https://console.apify.com/sign-up
2. Regístrate (email + password o Google)
3. Ve a Settings → Integrations → API token
4. Copia tu token
```

#### Bright Data:
```
1. Ve a https://brightdata.com/cp/start
2. Regístrate y completa el proceso
3. Crea una zona proxy
4. Copia username y password
```

### **Paso 3: Configurar variables de entorno**

**En Windows:**

1. Crea un archivo `.env` en la carpeta del proyecto:
```cmd
cd C:\Users\TuUsuario\Downloads\Claude-claude-brainstorm-ideas-hQzr3
notepad .env
```

2. Agrega tus credenciales (elige UNO):

**Para ScraperAPI:**
```
SCRAPERAPI_KEY=tu_api_key_aqui
```

**Para Apify:**
```
APIFY_TOKEN=tu_token_aqui
```

**Para Bright Data:**
```
BRIGHTDATA_USERNAME=tu_usuario_aqui
BRIGHTDATA_PASSWORD=tu_password_aqui
```

3. Guarda el archivo (Ctrl+S)

---

## 💻 Uso

### **Opción 1: Scraper Pro (Directo)**

```cmd
# Con ScraperAPI
python scraper_pro.py -l palermo -t departamentos -o venta -p 3 --service scraperapi

# Con Apify
python scraper_pro.py -l palermo -t departamentos -o venta -p 3 --service apify

# Con Bright Data
python scraper_pro.py -l palermo -t departamentos -o venta -p 3 --service brightdata
```

### **Opción 2: Main con servicio**

Actualiza `main.py` para usar el servicio:

```cmd
python main.py -l palermo -t departamentos -o venta -p 3 --service scraperapi
```

### **Opción 3: Desde código Python**

```python
from scraper_pro import ZonapropScraperPro

# Usar ScraperAPI
scraper = ZonapropScraperPro(
    location="palermo",
    property_type="departamentos",
    operation="venta",
    service="scraperapi"  # o "apify" o "brightdata"
)

properties = scraper.scrape(max_pages=3)
scraper.save_to_json()
```

---

## 🔧 Integración con Asistente IA

El asistente IA puede usar automáticamente el servicio configurado:

```cmd
# El servicio se detecta automáticamente desde .env
python ai_assistant_interface.py ^
    --min-price 200000 ^
    --max-price 350000 ^
    --neighborhoods Palermo ^
    --service scraperapi
```

---

## 💰 Comparación de Precios

| Servicio | Tier Gratis | Plan Básico | Requests/mes | Mejor para |
|----------|-------------|-------------|--------------|------------|
| **ScraperAPI** | 5K requests/mes | $49/mes | 100K | Empezar rápido |
| **Apify** | $5 gratis/mes | $49/mes | Varía | Testing y prototipos |
| **Bright Data** | Trial 7 días | $500/mes | Varía | Empresas y escala |

---

## ⚡ Ejemplo Completo (Windows)

```cmd
REM 1. Crear archivo .env
echo SCRAPERAPI_KEY=tu_api_key_aqui > .env

REM 2. Instalar dependencia adicional
pip install python-dotenv

REM 3. Probar el scraper
python scraper_pro.py -l palermo -t departamentos -o venta -p 2 --service scraperapi

REM 4. Usar con el asistente IA
python ai_assistant_interface.py ^
    --min-price 200000 ^
    --max-price 350000 ^
    --min-rooms 2 ^
    --neighborhoods Palermo ^
    --business-name "Tu Inmobiliaria" ^
    --service scraperapi

REM 5. Abrir el HTML
start resultados\propiedades_presentacion.html
```

---

## 🎯 Recomendación por Caso de Uso

### **Para probar (Gratis):**
✅ **Apify** - Tier gratis generoso

### **Para producción pequeña/mediana:**
✅ **ScraperAPI** - Mejor relación precio/facilidad

### **Para empresas o alto volumen:**
✅ **Bright Data** - Más robusto y escalable

---

## 🐛 Solución de Problemas

### "ModuleNotFoundError: No module named 'dotenv'"
```cmd
pip install python-dotenv
```

### "API key inválida"
```
1. Verifica que copiaste la key completa
2. Revisa que no tenga espacios al inicio/final
3. Verifica que el archivo se llame exactamente ".env"
```

### "No se carga el archivo .env"
```cmd
# En Windows, asegúrate de que el archivo no se llame ".env.txt"
# Usa este comando para verificar:
dir .env

# Debe aparecer como ".env" sin extensión
```

### "Requests muy lentos"
```
- ScraperAPI y Apify pueden tardar 2-5 segundos por request
- Es normal, están rotando proxies y evitando bloqueos
- Para más velocidad, aumenta el plan o usa Bright Data
```

---

## 📊 Monitoreo de Uso

### ScraperAPI:
```
Dashboard: https://www.scraperapi.com/dashboard
Ver requests usados, límites, etc.
```

### Apify:
```
Console: https://console.apify.com
Ver runs, costos, storage usado
```

### Bright Data:
```
Dashboard: https://brightdata.com/cp
Ver tráfico, zonas, costos
```

---

## 🔐 Seguridad

**IMPORTANTE:**
- ✅ Nunca subas el archivo `.env` a Git
- ✅ El `.gitignore` ya incluye `.env`
- ✅ Usa `.env.example` como template sin credenciales reales
- ✅ Rota tus keys si se exponen

---

## 📞 Soporte de los Servicios

- **ScraperAPI:** support@scraperapi.com
- **Apify:** support@apify.com
- **Bright Data:** support@brightdata.com

---

**Última actualización:** Diciembre 2025
**Versión:** 3.0.0 (Con integración de servicios profesionales)
