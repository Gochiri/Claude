# 🚀 Inicio Rápido - Windows

## Solución al Error 403 (Forbidden) - Proxy Bloqueado

Has visto este error porque Zonaprop bloquea el acceso directo. **La solución es usar un servicio profesional de scraping.**

---

## 🎯 Opción Recomendada: ScraperAPI

**Precio:** Gratis para empezar (5,000 requests/mes)
**Ventaja:** Resuelve automáticamente el problema del proxy

---

## 📋 Paso a Paso (10 minutos)

### **1. Registrarse en ScraperAPI**

```
1. Ve a: https://www.scraperapi.com/signup
2. Completa el formulario:
   - Email
   - Password
   - Nombre
3. Haz clic en "Start Free Trial"
4. Verifica tu email
5. Inicia sesión
```

### **2. Obtener tu API Key**

```
1. Ve al Dashboard: https://www.scraperapi.com/dashboard
2. Busca la sección "API Key"
3. Copia el valor (algo como: "a1b2c3d4e5f6...")
4. Guárdalo, lo necesitarás en el siguiente paso
```

### **3. Configurar el Proyecto**

Abre Command Prompt (Windows + R → cmd → Enter):

```cmd
cd C:\Users\germa\Downloads\Claude-claude-brainstorm-ideas-hQzr3

REM Instalar dependencia necesaria
pip install python-dotenv

REM Crear archivo de configuración
echo SCRAPERAPI_KEY=PEGA_TU_KEY_AQUI > .env
```

**IMPORTANTE:** Reemplaza `PEGA_TU_KEY_AQUI` con tu API key real.

Por ejemplo:
```cmd
echo SCRAPERAPI_KEY=a1b2c3d4e5f6g7h8i9j0 > .env
```

### **4. Probar el Scraper**

```cmd
python scraper_pro.py -l palermo -t departamentos -o venta -p 2 --service scraperapi
```

**Resultado esperado:**
```
Scrapeando página 1...
ScraperAPI: Obteniendo https://www.zonaprop.com.ar/...
✓ Respuesta obtenida: 200
✓ Encontradas X propiedades en página 1
...
✓ Scraping completado: X propiedades encontradas
✓ Datos guardados en resultados/propiedades.json
```

### **5. Usar el Asistente IA**

```cmd
python ai_assistant_interface.py ^
    --min-price 200000 ^
    --max-price 350000 ^
    --min-rooms 2 ^
    --max-rooms 3 ^
    --neighborhoods Palermo ^
    --business-name "Tu Inmobiliaria" ^
    --business-phone "+54 11 1234-5678" ^
    --service scraperapi

start resultados\propiedades_presentacion.html
```

---

## 🎉 ¡Listo!

Ahora el scraper funcionará sin problemas de proxy.

---

## 🆓 Alternativa Gratuita: Apify

Si prefieres otra opción gratuita:

### **1. Registrarse en Apify**

```
1. Ve a: https://console.apify.com/sign-up
2. Regístrate con email o Google
3. Verifica tu email
```

### **2. Obtener Token**

```
1. Ve a: https://console.apify.com/account/integrations
2. Copia el "Personal API token"
```

### **3. Configurar**

```cmd
echo APIFY_TOKEN=tu_token_aqui > .env
```

### **4. Usar**

```cmd
python scraper_pro.py -l palermo -t departamentos -o venta -p 2 --service apify
```

---

## 💰 Costos

### ScraperAPI:
- **Gratis:** 5,000 requests/mes
- **Básico:** $49/mes - 100,000 requests
- **Pro:** $149/mes - 1,000,000 requests

### Apify:
- **Gratis:** $5 crédito/mes
- **Personal:** $49/mes
- **Team:** $499/mes

### Para tu caso de uso:
- **10-20 búsquedas diarias = ~600/mes**
- ✅ **Cubre perfectamente el tier gratis**

---

## 🐛 Problemas Comunes

### "ModuleNotFoundError: No module named 'dotenv'"
```cmd
pip install python-dotenv
```

### "API key inválida"
```
1. Verifica que copiaste la key completa (sin espacios)
2. Revisa el archivo .env:
   notepad .env
3. Debe verse así:
   SCRAPERAPI_KEY=tu_key_sin_espacios
```

### "No se encuentra el archivo .env"
```cmd
REM Verifica que estás en el directorio correcto:
cd C:\Users\germa\Downloads\Claude-claude-brainstorm-ideas-hQzr3

REM Verifica que el archivo existe:
dir .env

REM Si no existe, créalo de nuevo:
echo SCRAPERAPI_KEY=tu_key > .env
```

### Scraper muy lento
```
Es normal, ScraperAPI/Apify tardan 2-5 segundos por request
Están rotando proxies y evitando bloqueos
```

---

## 📊 Monitorear tu Uso

### ScraperAPI:
```
Dashboard: https://www.scraperapi.com/dashboard
- Ver requests usados
- Requests restantes
- Historial
```

### Apify:
```
Console: https://console.apify.com
- Ver runs ejecutados
- Créditos usados
- Storage
```

---

## 🎯 Workflow Completo Recomendado

```cmd
REM 1. Actualizar datos (1-2 veces al día)
python scraper_pro.py -l capital-federal -t departamentos -o venta -p 5 --service scraperapi

REM 2. Cuando un cliente pida propiedades, filtrar y generar HTML
python ai_assistant_interface.py ^
    --min-price 200000 ^
    --max-price 350000 ^
    --neighborhoods Palermo Belgrano ^
    --business-name "Inmobiliaria Premium" ^
    --business-phone "+54 11 4567-8900" ^
    --title "Propiedades para Juan Pérez"

REM 3. Enviar el HTML al cliente
start resultados\propiedades_presentacion.html
```

---

## 📞 Soporte

- **ScraperAPI:** support@scraperapi.com
- **Apify:** support@apify.com
- **Documentación:** Ver `SERVICIOS_SCRAPING.md`

---

**¿Listo para empezar?**

1. Registrarte en ScraperAPI → https://www.scraperapi.com/signup
2. Copiar tu API key
3. Ejecutar: `echo SCRAPERAPI_KEY=tu_key > .env`
4. Probar: `python scraper_pro.py --service scraperapi`

🚀 **¡En 10 minutos estarás scrapeando sin problemas!**
