# 🏠 Zonaprop Scraper & Analyzer

Web scraper y analizador de propiedades para **Zonaprop**, la plataforma líder de bienes raíces en Argentina. Este proyecto permite extraer datos de propiedades, analizarlos y generar reportes con branding personalizado para clientes.

---

## ⚡ Inicio Rápido

### **Para usuarios de Windows** (Recomendado):

```cmd
REM 1. Verificar que todo está instalado correctamente
python setup_verificador.py

REM 2. Usar menú interactivo (más fácil)
inicio_rapido.bat
```

### **Documentación rápida**:

- 📘 **[INICIO_RAPIDO_WINDOWS.md](INICIO_RAPIDO_WINDOWS.md)** - Guía paso a paso para Windows (solución al error 403)
- ⚡ **[COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)** - Referencia rápida de todos los comandos
- 🌐 **[SERVICIOS_SCRAPING.md](SERVICIOS_SCRAPING.md)** - Comparación de servicios profesionales
- 👥 **[GUIA_CLIENTE.md](GUIA_CLIENTE.md)** - Guía para integrar con clientes

---

## ✨ Características

### **Scraping Profesional**
- 🔍 **Scraping inteligente** con soporte para ScraperAPI, Apify y Bright Data
- 🌐 **Solución al error 403** usando servicios profesionales
- 💻 **Modo offline** con parser de HTML y generador de datos mock
- 🛡️ **Bypass de proxies** y restricciones de red

### **Análisis Avanzado**
- 📊 **Análisis estadístico** detallado de precios, superficies y características
- 💰 **Cálculo de precio por m²** para comparar propiedades
- 📈 **Ranking de mejores propiedades** según diferentes criterios
- 🔍 **Filtros avanzados**: precio, superficie, habitaciones, barrios, keywords

### **Generación de Reportes**
- 🎨 **HTML con branding personalizado** (logo, colores, datos de contacto)
- 🤖 **Asistente IA** para búsqueda y generación automática
- 📱 **Diseño responsive** para móviles y desktop
- 💼 **Listo para enviar a clientes** con tu marca

### **Exportación y Configuración**
- 💾 **Exportación múltiple**: JSON, CSV, Excel, HTML
- 🎨 **Interfaz en consola** con Rich para mejor visualización
- ⚙️ **Configurable** mediante argumentos de línea de comandos
- 🪟 **Menú interactivo para Windows** (inicio_rapido.bat)

## 🚀 Instalación

### Requisitos previos

- Python 3.8 o superior
- pip

### Pasos de instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Gochiri/Claude.git
cd Claude
```

2. **Crear un entorno virtual** (recomendado):
```bash
python -m venv venv

# En Linux/Mac:
source venv/bin/activate

# En Windows:
venv\Scripts\activate
```

3. **Instalar dependencias**:
```bash
pip install -r requirements.txt
```

## 📖 Uso

### Uso básico

```bash
python main.py
```

Esto scrapeará departamentos en venta en Capital Federal (configuración por defecto).

### Ejemplos de uso

#### Buscar departamentos en venta en Capital Federal
```bash
python main.py -l capital-federal -t departamentos -o venta -p 3
```

#### Buscar casas en alquiler en Palermo
```bash
python main.py -l palermo -t casas -o alquiler -p 5
```

#### Buscar terrenos en Belgrano y exportar a Excel
```bash
python main.py -l belgrano -t terrenos -p 2 --excel
```

#### Solo analizar datos existentes (sin scrapear)
```bash
python main.py --analyze-only
```

#### Scrapear sin analizar (solo obtener datos)
```bash
python main.py -p 5 --no-analysis
```

### Parámetros disponibles

| Parámetro | Descripción | Valor por defecto |
|-----------|-------------|-------------------|
| `-l, --location` | Ubicación de búsqueda | capital-federal |
| `-t, --type` | Tipo de propiedad (departamentos, casas, terrenos) | departamentos |
| `-o, --operation` | Tipo de operación (venta, alquiler) | venta |
| `-p, --pages` | Número máximo de páginas a scrapear | 10 |
| `--json` | Nombre del archivo JSON de salida | propiedades.json |
| `--csv` | Exportar resultados a CSV | - |
| `--excel` | Exportar resultados a Excel | - |
| `--analyze-only` | Solo analizar datos existentes | - |
| `--no-analysis` | Solo scrapear sin analizar | - |
| `--top` | Número de mejores propiedades a mostrar | 10 |

## 🤖 Asistente IA con Branding Personalizado

El sistema incluye un asistente IA que permite generar reportes HTML personalizados para clientes:

```cmd
python ai_assistant_interface.py ^
    --min-price 200000 ^
    --max-price 350000 ^
    --min-rooms 2 ^
    --neighborhoods Palermo Belgrano ^
    --business-name "Tu Inmobiliaria" ^
    --business-phone "+54 11 1234-5678" ^
    --business-email "contacto@inmobiliaria.com" ^
    --business-logo "logo.png" ^
    --service scraperapi
```

**Características del reporte HTML:**
- ✅ Logo de tu empresa embebido
- ✅ Datos de contacto personalizados
- ✅ Colores corporativos configurables
- ✅ Top 5 propiedades según criterios específicos
- ✅ Cálculo automático de precio/m²
- ✅ Diseño responsive (móvil + desktop)
- ✅ Archivo HTML auto-contenido (fácil de enviar por email)

Ver **[GUIA_CLIENTE.md](GUIA_CLIENTE.md)** para más detalles.

---

## 🌐 Solución al Error 403 / Restricciones de Red

Si obtienes **Error 403 Forbidden** o tienes proxies que bloquean, hay **4 soluciones**:

### ✅ Opción 1: Servicios Profesionales (RECOMENDADO)

Usar ScraperAPI, Apify o Bright Data para bypass automático de restricciones:

```cmd
REM 1. Registrarse en un servicio (ej: ScraperAPI - 5K requests gratis/mes)
REM    https://www.scraperapi.com/signup

REM 2. Configurar .env con tu API key
echo SCRAPERAPI_KEY=tu_api_key_aqui > .env

REM 3. Usar el scraper profesional
python scraper_pro.py -l palermo -t departamentos -o venta -p 3 --service scraperapi
```

**Ventajas**: Funciona siempre, bypass automático, tier gratis disponible.

Ver **[INICIO_RAPIDO_WINDOWS.md](INICIO_RAPIDO_WINDOWS.md)** para guía paso a paso.

---

## 🌐 Alternativas Offline

Si prefieres no usar servicios profesionales, hay **3 soluciones offline**:

### ✅ Opción 2: Generador de Datos Mock (Testing)

Perfecto para desarrollo, testing o demos:

```bash
# Generar 50 propiedades de ejemplo
python mock_data_generator.py -n 50

# Analizar los datos generados
python main.py --analyze-only --json propiedades_mock.json --excel
```

**Ventajas**: Datos instantáneos, reproducibles, ideales para testing.

### ✅ Opción 3: Parser de HTML Local (Datos reales offline)

Descarga páginas manualmente y analízalas localmente:

```bash
# 1. Crear directorio para HTMLs
mkdir html_files

# 2. Desde tu navegador:
#    - Abre Zonaprop y haz tu búsqueda
#    - Guarda cada página (Ctrl+S / Cmd+S)
#    - Coloca los archivos en html_files/

# 3. Parsear los archivos HTML
python html_parser.py -d html_files

# 4. Analizar los datos extraídos
python main.py --analyze-only
```

**Ventajas**: Datos 100% reales, funciona sin conexión, sin restricciones de proxy.

### ✅ Opción 4: Scraper Directo (Solo sin restricciones)

El scraper tradicional para ambientes sin restricciones:

```bash
python main.py -l capital-federal -t departamentos -o venta -p 3
```

**Nota**: Puede fallar en entornos con proxies restrictivos o sin acceso a internet.

## 📁 Estructura del proyecto

```
Claude/
├── 🔧 Scripts principales
│   ├── main.py                       # Script principal (básico)
│   ├── scraper_pro.py                # Scraper profesional con servicios
│   ├── ai_assistant_interface.py    # Asistente IA para clientes
│   └── setup_verificador.py         # Verificador de configuración
│
├── 🛠️ Módulos core
│   ├── scraper.py                    # Scraper básico
│   ├── scraping_services.py          # Integración ScraperAPI/Apify/BrightData
│   ├── analyzer.py                   # Análisis estadístico
│   ├── property_filter.py            # Filtros avanzados
│   └── html_generator.py             # Generador de HTML con branding
│
├── 💻 Utilidades
│   ├── html_parser.py                # Parser de HTML offline
│   ├── mock_data_generator.py        # Generador de datos de prueba
│   ├── demo.py                       # Script de demostración
│   └── inicio_rapido.bat             # Menú interactivo Windows
│
├── 📚 Documentación
│   ├── README.md                     # Este archivo
│   ├── INICIO_RAPIDO_WINDOWS.md      # Guía Windows (solución 403)
│   ├── COMANDOS_RAPIDOS.md           # Referencia rápida
│   ├── SERVICIOS_SCRAPING.md         # Comparación de servicios
│   └── GUIA_CLIENTE.md               # Guía para clientes
│
├── ⚙️ Configuración
│   ├── config.py                     # Configuración general
│   ├── .env.example                  # Plantilla de variables de entorno
│   ├── requirements.txt              # Dependencias
│   └── .gitignore                    # Archivos ignorados
│
└── 📂 Carpetas de datos
    ├── html_files/                   # HTMLs descargados manualmente
    └── resultados/                   # Resultados generados
        ├── propiedades.json
        ├── propiedades_presentacion.html
        ├── analisis_propiedades.csv
        └── analisis_propiedades.xlsx
```

## 📊 Análisis de datos

El analizador proporciona:

- **Estadísticas generales**:
  - Total de propiedades
  - Precio promedio, mediana, mínimo y máximo
  - Superficie promedio y mediana
  - Precio por m² promedio y mediana

- **Top propiedades**:
  - Ranking de mejores propiedades por precio/m²
  - Información detallada de ubicación, precio, superficie y ambientes

- **Exportación de datos**:
  - **JSON**: Datos crudos estructurados
  - **CSV**: Tabla plana para análisis en Excel/Sheets
  - **Excel**: Múltiples hojas con datos, estadísticas y rankings

## ⚙️ Configuración avanzada

Puedes modificar `config.py` para ajustar:

- Headers HTTP (User-Agent, etc.)
- Delay entre requests
- Número máximo de páginas por defecto
- Directorio de salida
- Ubicación, tipo de propiedad y operación por defecto

## 🤝 Consideraciones éticas

- **Respeta los términos de servicio** de Zonaprop
- **No sobrecargues el servidor**: usa delays razonables entre requests
- **Usa los datos de manera responsable**: solo para análisis personal
- **No redistribuyas datos comercialmente** sin permiso

## ⚠️ Notas importantes

- La estructura HTML de Zonaprop puede cambiar con el tiempo, lo que podría requerir ajustes en el código
- Algunos selectores CSS pueden necesitar actualizarse si el sitio cambia su diseño
- El scraper incluye delays entre requests para ser respetuoso con el servidor
- Algunos datos pueden no estar disponibles en todos los listados

## 🐛 Solución de problemas

### Verificar configuración del sistema

```cmd
REM Verificar que todo esté correctamente instalado y configurado
python setup_verificador.py
```

Este script verifica automáticamente:
- ✅ Versión de Python
- ✅ Dependencias instaladas
- ✅ Archivos del proyecto
- ✅ Configuración de .env
- ✅ Servicios de scraping disponibles
- ✅ Prueba de conexión

### Error 403 Forbidden / Proxy bloqueado

```
403 Client Error: Forbidden for url: https://www.zonaprop.com.ar/...
```

**Solución recomendada**:
1. Usar **servicios profesionales** (ScraperAPI, Apify, Bright Data)
2. Ver **[INICIO_RAPIDO_WINDOWS.md](INICIO_RAPIDO_WINDOWS.md)** para guía paso a paso
3. Registrarse en ScraperAPI (5K requests gratis): https://www.scraperapi.com/signup
4. Configurar `.env` con tu API key
5. Usar `--service scraperapi` en tus comandos

**Alternativas**:
- Usa el **generador de datos mock**: `python mock_data_generator.py -n 50`
- Usa el **parser de HTML local**: descarga páginas manualmente y ejecuta `python html_parser.py`

### No se encuentran propiedades

- Verifica que la URL de búsqueda sea correcta
- Comprueba que el sitio esté accesible
- Los selectores CSS podrían haber cambiado (actualiza `scraper.py`)
- **Alternativa**: Usa el modo offline con `html_parser.py`

### Error de timeout

- Aumenta el timeout en `scraper.py`
- Verifica tu conexión a internet
- El sitio podría estar temporalmente inaccesible
- **Alternativa**: Genera datos mock con `mock_data_generator.py`

### Datos incompletos

- Algunos listados pueden no tener toda la información
- El scraper intenta manejar datos faltantes con 'N/A'
- Para datos más completos, revisa y ajusta los selectores CSS en `scraper.py`

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue.

---

**Disclaimer**: Este proyecto es solo para fines educativos y de investigación. No está afiliado con Zonaprop ni con ninguna entidad comercial.
