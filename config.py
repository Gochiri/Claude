"""
Configuración del scraper de Zonaprop
"""

# URLs base
ZONAPROP_BASE_URL = "https://www.zonaprop.com.ar"

# Headers para simular un navegador real
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
}

# Configuración de búsqueda
DEFAULT_LOCATION = "capital-federal"
DEFAULT_PROPERTY_TYPE = "departamentos"  # casas, departamentos, terrenos, etc.
DEFAULT_OPERATION = "venta"  # venta, alquiler

# Delay entre requests (en segundos) para ser respetuosos con el servidor
REQUEST_DELAY = 2

# Número máximo de páginas a scrapear
MAX_PAGES = 10

# Archivo de salida
OUTPUT_DIR = "resultados"
