# 🚀 Quick Start - Modo Offline

Si estás en un entorno con **restricciones de red** (proxies, firewalls, sin internet), aquí está la forma más rápida de empezar.

## ⚡ Opción más rápida: Datos Mock

```bash
# 1. Generar datos de ejemplo (instantáneo)
python mock_data_generator.py -n 30 --seed 42

# 2. Analizar y visualizar
python main.py --analyze-only --json propiedades_mock.json --top 10 --excel

# 3. Ver la demo completa
python demo.py
```

✅ **Listo!** Tendrás:
- Archivo JSON con 30 propiedades
- Estadísticas completas en consola
- Archivo Excel con análisis detallado
- Archivo CSV para importar a otras herramientas

## 📄 Opción con datos reales: HTML Local

Para trabajar con **datos reales de Zonaprop** sin conexión:

### Paso 1: Descargar páginas desde tu navegador

1. Abre tu navegador y ve a [Zonaprop](https://www.zonaprop.com.ar)
2. Haz tu búsqueda (ej: "departamentos venta capital federal")
3. En cada página de resultados:
   - **Chrome/Edge**: `Ctrl+S` → "Página web, completa"
   - **Firefox**: `Ctrl+S` → "Página web, completa"
   - **Safari**: `Cmd+S` → "Página web"
4. Guarda con nombres descriptivos: `zonaprop_page1.html`, `zonaprop_page2.html`, etc.

### Paso 2: Crear directorio y copiar archivos

```bash
# Crear carpeta
mkdir html_files

# Copiar tus archivos HTML descargados a html_files/
# (arrastra y suelta, o usa cp/mv)
```

### Paso 3: Parsear y analizar

```bash
# Parsear los archivos HTML
python html_parser.py -d html_files

# Analizar los datos extraídos
python main.py --analyze-only --excel --csv
```

✅ **Resultado**: Datos 100% reales de Zonaprop, analizados localmente!

## 📊 Ver resultados

Todos los resultados se guardan en `resultados/`:

```bash
# Ver archivos generados
ls -lh resultados/

# Abrir el CSV
# Windows: start resultados/analisis_propiedades.csv
# Mac: open resultados/analisis_propiedades.csv
# Linux: xdg-open resultados/analisis_propiedades.csv

# Abrir el Excel
# Windows: start resultados/analisis_propiedades.xlsx
# Mac: open resultados/analisis_propiedades.xlsx
# Linux: libreoffice resultados/analisis_propiedades.xlsx
```

## 🎯 Ejemplos de uso

### Generar datos realistas para análisis

```bash
# 100 propiedades con seed para reproducibilidad
python mock_data_generator.py -n 100 --seed 12345

# Analizar mostrando top 20
python main.py --analyze-only --json propiedades_mock.json --top 20
```

### Workflow completo offline

```bash
# 1. Generar datos
python mock_data_generator.py -n 50

# 2. Análisis completo con exportación
python main.py --analyze-only --json propiedades_mock.json --excel --csv --top 15

# 3. Ver la demo interactiva
python demo.py
```

## ❓ Preguntas frecuentes

**P: ¿Los datos mock son realistas?**
R: Sí, el generador crea precios, superficies y características basadas en el mercado real argentino.

**P: ¿Puedo combinar múltiples archivos HTML?**
R: Sí! Coloca todos los HTML en `html_files/` y el parser los procesará todos juntos.

**P: ¿Qué selectores CSS usa el parser?**
R: Los mismos que el scraper online. Si Zonaprop cambia su estructura, puede requerir ajustes.

**P: ¿Puedo generar datos para diferentes barrios?**
R: El generador mock incluye 20 barrios de CABA automáticamente. Para datos reales específicos, descarga páginas de esos barrios.

## 🔄 Volver al README principal

Para más opciones y documentación completa, consulta [README.md](README.md)
