# 🏠 Zonaprop Scraper & Analyzer

Web scraper y analizador de propiedades para **Zonaprop**, la plataforma líder de bienes raíces en Argentina. Este proyecto permite extraer datos de propiedades, analizarlos y generar reportes útiles para tomar decisiones informadas.

## ✨ Características

- 🔍 **Scraping inteligente** de listados de propiedades
- 📊 **Análisis estadístico** detallado de precios, superficies y características
- 💰 **Cálculo de precio por m²** para comparar propiedades
- 📈 **Ranking de mejores propiedades** según diferentes criterios
- 💾 **Exportación múltiple**: JSON, CSV, Excel
- 🎨 **Interfaz en consola** con Rich para mejor visualización
- ⚙️ **Configurable** mediante argumentos de línea de comandos

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

## 🌐 Restricciones de Red / Modo Offline

Si tienes problemas de conexión, proxies que bloquean, o quieres trabajar offline, hay **3 soluciones**:

### ✅ Opción 1: Generador de Datos Mock (Testing)

Perfecto para desarrollo, testing o demos:

```bash
# Generar 50 propiedades de ejemplo
python mock_data_generator.py -n 50

# Analizar los datos generados
python main.py --analyze-only --json propiedades_mock.json --excel
```

**Ventajas**: Datos instantáneos, reproducibles, ideales para testing.

### ✅ Opción 2: Parser de HTML Local (Datos reales offline)

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

### ✅ Opción 3: Scraper Normal (Requiere conexión)

El scraper tradicional para ambientes sin restricciones:

```bash
python main.py -l capital-federal -t departamentos -o venta -p 3
```

**Nota**: Puede fallar en entornos con proxies restrictivos o sin acceso a internet.

## 📁 Estructura del proyecto

```
Claude/
├── main.py                   # Script principal
├── scraper.py                # Módulo de scraping (online)
├── html_parser.py            # Parser de HTML local (offline)
├── mock_data_generator.py    # Generador de datos mock (testing)
├── analyzer.py               # Módulo de análisis
├── demo.py                   # Script de demostración
├── config.py                 # Configuración
├── requirements.txt          # Dependencias
├── README.md                 # Este archivo
├── html_files/               # Archivos HTML descargados (crear manualmente)
└── resultados/               # Carpeta de resultados (auto-generada)
    ├── propiedades.json
    ├── propiedades_mock.json
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

### Error de proxy o conexión bloqueada

```
ProxyError: Unable to connect to proxy
HTTPSConnectionPool: Max retries exceeded
```

**Soluciones**:
1. Usa el **generador de datos mock**: `python mock_data_generator.py -n 50`
2. Usa el **parser de HTML local**: descarga páginas manualmente y ejecuta `python html_parser.py`
3. Si tienes acceso a VPN, conéctate y usa el scraper normal

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
