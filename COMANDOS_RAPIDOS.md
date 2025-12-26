# ⚡ Comandos Rápidos - Referencia

## 🚀 Inicio Rápido (Windows)

### **Método 1: Script Interactivo (MÁS FÁCIL)**

```cmd
inicio_rapido.bat
```

Este script te guía paso a paso por todas las operaciones.

---

## 🔧 Configuración Inicial

### **1. Verificar que todo está instalado correctamente**

```cmd
python setup_verificador.py
```

Este script verifica:
- ✅ Versión de Python
- ✅ Dependencias instaladas
- ✅ Archivos del proyecto
- ✅ Configuración de .env
- ✅ Servicios de scraping configurados
- ✅ Prueba de conexión a servicios

### **2. Instalar dependencias**

```cmd
pip install -r requirements.txt
```

### **3. Crear archivo de configuración**

```cmd
REM Copiar plantilla
copy .env.example .env

REM Editar y agregar tus API keys
notepad .env
```

---

## 📊 Uso Básico

### **Scrapear propiedades**

```cmd
python scraper_pro.py -l palermo -t departamentos -o venta -p 3 --service scraperapi
```

**Parámetros:**
- `-l`: Ubicación (palermo, belgrano, capital-federal, etc.)
- `-t`: Tipo (departamentos, casas, ph, locales, oficinas)
- `-o`: Operación (venta, alquiler, alquiler-temporal)
- `-p`: Número de páginas (1-10)
- `--service`: Servicio (scraperapi, apify, brightdata, direct)

### **Generar reporte con Asistente IA**

```cmd
python ai_assistant_interface.py ^
    --min-price 200000 ^
    --max-price 350000 ^
    --min-rooms 2 ^
    --max-rooms 3 ^
    --neighborhoods Palermo Belgrano ^
    --business-name "Tu Inmobiliaria" ^
    --business-phone "+54 11 1234-5678" ^
    --service scraperapi
```

**Parámetros principales:**
- `--min-price`, `--max-price`: Rango de precios (USD)
- `--min-rooms`, `--max-rooms`: Rango de habitaciones
- `--min-surface`, `--max-surface`: Rango de superficie (m²)
- `--neighborhoods`: Barrios (separados por espacios)
- `--keywords`: Palabras clave (ej: "balcón", "amenities")
- `--business-name`: Nombre de tu negocio
- `--business-phone`: Teléfono de contacto
- `--business-email`: Email de contacto
- `--business-logo`: Ruta a tu logo (PNG/JPG)
- `--service`: Servicio de scraping

---

## 🎯 Ejemplos Prácticos

### **Ejemplo 1: Búsqueda rápida en Palermo**

```cmd
python scraper_pro.py -l palermo -t departamentos -o venta -p 2 --service scraperapi
```

### **Ejemplo 2: Buscar propiedades económicas con balcón**

```cmd
python ai_assistant_interface.py ^
    --min-price 100000 ^
    --max-price 200000 ^
    --keywords balcón luminoso ^
    --neighborhoods Palermo Belgrano Recoleta ^
    --business-name "Inmobiliaria Premium" ^
    --business-phone "+54 11 4567-8900" ^
    --service scraperapi
```

### **Ejemplo 3: Propiedades grandes para familias**

```cmd
python ai_assistant_interface.py ^
    --min-rooms 3 ^
    --max-rooms 5 ^
    --min-surface 80 ^
    --max-surface 150 ^
    --neighborhoods "Núñez" "Belgrano" "Colegiales" ^
    --business-name "Tu Inmobiliaria" ^
    --service scraperapi
```

### **Ejemplo 4: Análisis de mercado (todas las propiedades)**

```cmd
python scraper_pro.py -l capital-federal -t departamentos -o venta -p 10 --service scraperapi

python analyzer.py
```

---

## 🔄 Workflow Completo Recomendado

### **1. Primera vez: Configuración**

```cmd
REM 1. Verificar instalación
python setup_verificador.py

REM 2. Si falta algo, instalar
pip install -r requirements.txt

REM 3. Configurar .env
copy .env.example .env
notepad .env

REM 4. Verificar de nuevo
python setup_verificador.py
```

### **2. Uso diario: Actualizar datos**

```cmd
REM Una o dos veces al día
python scraper_pro.py -l capital-federal -t departamentos -o venta -p 5 --service scraperapi
```

### **3. Cuando llega un cliente: Generar reporte**

```cmd
python ai_assistant_interface.py ^
    --min-price 250000 ^
    --max-price 400000 ^
    --min-rooms 2 ^
    --neighborhoods "Palermo" "Recoleta" ^
    --business-name "Inmobiliaria Premium" ^
    --business-phone "+54 11 4567-8900" ^
    --business-email "contacto@inmobiliaria.com" ^
    --business-logo "logo.png" ^
    --title "Propiedades seleccionadas para Juan Pérez" ^
    --service scraperapi

REM Abrir el HTML generado
start resultados\propiedades_presentacion.html
```

---

## 🛠️ Comandos de Utilidad

### **Analizar datos scrapeados**

```cmd
python analyzer.py
```

### **Filtrar propiedades manualmente**

```python
from property_filter import PropertyFilter
import json

# Cargar datos
with open('resultados/propiedades.json', 'r', encoding='utf-8') as f:
    propiedades = json.load(f)

# Filtrar
filtro = PropertyFilter(propiedades)
top5 = (filtro
    .by_price_range(200000, 350000)
    .by_rooms(2, 3)
    .by_neighborhood(['Palermo', 'Belgrano'])
    .sort_by('price_per_m2')
    .get_top(5))

# Ver resultados
for p in top5:
    print(p['titulo'], '-', p['precio'])
```

### **Generar HTML manualmente**

```python
from html_generator import PropertyHTMLGenerator

# Configurar generador
generador = PropertyHTMLGenerator(
    business_name="Inmobiliaria Premium",
    business_phone="+54 11 4567-8900",
    business_email="contacto@inmobiliaria.com",
    business_logo_path="logo.png"
)

# Generar HTML
generador.generate_html(
    properties=propiedades,
    title="Propiedades Seleccionadas",
    subtitle="Las mejores opciones según tus criterios",
    output_path="resultados/mi_reporte.html"
)
```

### **Parsear HTML descargado manualmente**

```cmd
REM 1. Guardar páginas de Zonaprop como HTML en carpeta html_files/

REM 2. Parsear
python html_parser.py -d html_files
```

### **Generar datos de prueba**

```cmd
python mock_data_generator.py --count 50 --output test_data.json
```

---

## 🐛 Solución de Problemas

### **Error: "ModuleNotFoundError"**

```cmd
pip install -r requirements.txt
```

### **Error: "API key inválida"**

```cmd
REM 1. Verifica el archivo .env
notepad .env

REM 2. Asegúrate de que la key no tenga espacios
REM Debe verse así:
REM SCRAPERAPI_KEY=a1b2c3d4e5f6g7h8i9j0

REM 3. Prueba la conexión
python setup_verificador.py
```

### **Error: "403 Forbidden"**

```
Solución: Usar un servicio profesional (no usar --service direct)

1. Registrarse en ScraperAPI o Apify
2. Obtener API key
3. Configurar en .env
4. Usar --service scraperapi o --service apify
```

### **El scraper es muy lento**

```
Es normal. Los servicios profesionales tardan 2-5 segundos por request.
Están rotando proxies y evitando bloqueos para que funcione de manera confiable.

Para más velocidad:
- Reduce el número de páginas (-p 2 en vez de -p 10)
- Usa un plan pago con más velocidad
```

---

## 📚 Documentación Completa

- **README.md**: Introducción general al proyecto
- **INICIO_RAPIDO_WINDOWS.md**: Guía paso a paso para Windows
- **SERVICIOS_SCRAPING.md**: Comparación de servicios profesionales
- **GUIA_CLIENTE.md**: Guía de uso para clientes finales

---

## 💡 Tips y Mejores Prácticas

### **Optimizar uso de créditos**

```cmd
REM ❌ MAL - Gasta muchos créditos
python scraper_pro.py -l capital-federal -p 20 --service scraperapi

REM ✅ BIEN - Scrapea una vez al día con páginas razonables
python scraper_pro.py -l capital-federal -p 5 --service scraperapi

REM Luego filtra localmente (sin gastar créditos)
python ai_assistant_interface.py --min-price 200000 --max-price 300000 ...
```

### **Organizar reportes por cliente**

```cmd
REM Crear carpeta por cliente
mkdir reportes\cliente_juan_perez

REM Generar con nombre específico
python ai_assistant_interface.py ^
    --min-price 250000 ^
    --max-price 400000 ^
    --business-name "Inmobiliaria Premium" ^
    --output reportes\cliente_juan_perez\propiedades.html ^
    --service scraperapi
```

### **Automatizar actualizaciones diarias**

Crea un archivo `actualizar_diario.bat`:

```batch
@echo off
echo Actualizando datos de propiedades...
python scraper_pro.py -l capital-federal -t departamentos -o venta -p 5 --service scraperapi
echo Datos actualizados: %date% %time% >> log_actualizaciones.txt
```

Luego configúralo en el Programador de Tareas de Windows para que corra automáticamente.

---

## 📞 Recursos y Soporte

### **Servicios de Scraping**

- **ScraperAPI**: https://www.scraperapi.com/signup
  - Soporte: support@scraperapi.com
  - Docs: https://www.scraperapi.com/documentation

- **Apify**: https://console.apify.com/sign-up
  - Soporte: support@apify.com
  - Docs: https://docs.apify.com

- **Bright Data**: https://brightdata.com/cp/start
  - Soporte: support@brightdata.com
  - Docs: https://docs.brightdata.com

### **Python**

- Instalación: https://www.python.org/downloads/
- Tutorial: https://docs.python.org/es/3/tutorial/

---

**Última actualización:** Diciembre 2025
**Versión:** 3.1.0
