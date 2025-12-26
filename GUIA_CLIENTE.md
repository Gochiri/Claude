# 🏢 Guía para Cliente - Sistema de Presentación de Propiedades

## 📋 Resumen del Sistema

Este sistema permite a un **asistente de IA** buscar propiedades en Zonaprop según criterios muy específicos y generar automáticamente una **presentación HTML profesional** con el branding de tu negocio (logo, colores, datos de contacto).

---

## 🎯 ¿Qué hace el sistema?

1. **Filtra propiedades** según criterios específicos:
   - Rango de precios (USD min/max)
   - Superficie (m² min/max)
   - Número de ambientes
   - Barrios específicos
   - Palabras clave (terraza, cochera, etc.)

2. **Selecciona las mejores** (Top 5 por defecto)
   - Ordenadas por precio/m² u otro criterio

3. **Genera HTML personalizado** con:
   - Tu logo
   - Nombre del negocio
   - Teléfono y email
   - Colores corporativos
   - Las propiedades seleccionadas

---

## 🔧 Solución para Restricciones de Proxy

### Arquitectura recomendada:

```
┌──────────────────────────────────┐
│  PC/Laptop Cliente (sin proxy)  │
│                                  │
│  1. Scraper automático           │
│     (1-2 veces al día)           │
│                                  │
│  2. Actualiza propiedades.json   │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Servidor (con proxy)            │
│                                  │
│  1. Asistente IA                 │
│  2. Lee propiedades.json         │
│  3. Filtra según criterios       │
│  4. Genera HTML personalizado    │
└──────────────────────────────────┘
```

### Opciones de actualización:

#### ✅ Opción 1: Script automático en PC del cliente (RECOMENDADO)
```bash
# En PC/laptop SIN proxy, programa una tarea diaria:
# Windows: Programador de Tareas
# Mac/Linux: crontab

# Script que se ejecuta 1-2 veces al día:
python html_parser.py -d html_files_descargados
# o
python scraper.py -l capital-federal -p 5
```

#### ✅ Opción 2: Manual cuando sea necesario
El cliente descarga páginas de Zonaprop manualmente:
1. Abre navegador → Busca en Zonaprop
2. Guarda páginas (Ctrl+S)
3. Sistema parsea automáticamente

---

## 🚀 Uso Básico

### 1. Actualizar Base de Datos de Propiedades

#### Opción A: Desde HTML descargado manualmente
```bash
# El cliente descarga páginas de Zonaprop y las guarda en html_files/
python html_parser.py -d html_files
```

#### Opción B: Scraper directo (requiere sin proxy)
```bash
python main.py -l palermo -t departamentos -o venta -p 5
```

### 2. Usar el Asistente IA

```bash
python ai_assistant_interface.py \
    --min-price 200000 \
    --max-price 350000 \
    --min-rooms 2 \
    --max-rooms 3 \
    --neighborhoods Palermo Belgrano \
    --business-name "Tu Inmobiliaria" \
    --business-phone "+54 11 1234-5678" \
    --business-email "contacto@tuinmo.com"
```

Resultado: HTML profesional con las 5 mejores propiedades

---

## 📊 Ejemplos de Uso Real

### Ejemplo 1: Cliente busca "2-3 ambientes en Palermo, USD 200-300K"

```bash
python ai_assistant_interface.py \
    --min-price 200000 \
    --max-price 300000 \
    --min-rooms 2 \
    --max-rooms 3 \
    --neighborhoods Palermo \
    --business-name "Inmobiliaria Premium" \
    --business-phone "+54 11 4567-8900" \
    --title "Propiedades en Palermo 2-3 Ambientes" \
    --subtitle "USD 200K-300K | Mejor precio/m²"
```

### Ejemplo 2: "Propiedades con terraza en Recoleta o Palermo"

```bash
python ai_assistant_interface.py \
    --keywords terraza balcón \
    --neighborhoods Recoleta Palermo \
    --top 5 \
    --business-name "Tu Inmobiliaria" \
    --business-phone "+54 11 1234-5678"
```

### Ejemplo 3: "Las 3 propiedades más baratas"

```bash
python ai_assistant_interface.py \
    --sort-by price \
    --top 3 \
    --title "Mejores Oportunidades de Inversión" \
    --subtitle "Propiedades más accesibles del mercado"
```

---

## 🎨 Personalización del HTML

### Configuración básica:

```bash
--business-name "Inmobiliaria XYZ"
--business-phone "+54 11 4567-8900"
--business-email "ventas@inmoxyz.com"
--business-address "Av. Santa Fe 1234, CABA"
--business-logo "ruta/a/tu/logo.png"
--primary-color "#ff5722"  # Color principal (hex)
```

### Colores recomendados:

- **Azul profesional**: `#2563eb`
- **Verde corporativo**: `#16a34a`
- **Rojo elegante**: `#dc2626`
- **Morado moderno**: `#9333ea`

---

## 🔄 Workflow Completo

### Para el Administrador/IT:

**1. Configuración inicial (una sola vez):**
```bash
git clone https://github.com/Gochiri/Claude.git
cd Claude
pip install -r requirements.txt
```

**2. Actualización de datos (diaria o cuando se necesite):**
```bash
# Opción A: Desde PC sin proxy
python scraper.py -l capital-federal -p 5

# Opción B: Parser HTML manual
# (El cliente descarga páginas y las coloca en html_files/)
python html_parser.py -d html_files
```

**3. Uso del asistente IA:**

El asistente IA puede llamar directamente al script de Python:

```python
from ai_assistant_interface import AIPropertyAssistant

assistant = AIPropertyAssistant("resultados/propiedades.json")

result = assistant.search_and_generate(
    min_price=200000,
    max_price=350000,
    min_rooms=2,
    max_rooms=3,
    neighborhoods=["Palermo", "Belgrano"],
    business_name="Inmobiliaria Premium",
    business_phone="+54 11 4567-8900",
    business_email="ventas@inmo.com",
    title="Propiedades Seleccionadas para Juan Pérez",
    subtitle="2-3 ambientes en zonas premium",
    output_file="resultados/presentacion_juan_perez.html"
)

print(f"HTML generado: {result['html_generated']}")
print(f"Propiedades encontradas: {result['properties_found']}")
```

---

## 🌐 Integración con Servicios Externos (Opcional)

Si necesitas scraping automático sin limitaciones de proxy:

### Opción 1: ScraperAPI
```bash
pip install scraperapi-sdk

# Configurar en scraper.py:
from scraperapi_sdk import ScraperAPIClient
client = ScraperAPIClient('TU_API_KEY')
response = client.get(url)
```

### Opción 2: Bright Data / Apify
Similar a ScraperAPI, servicio profesional de scraping.

**Costo estimado:** $30-100 USD/mes

---

## 📝 Parámetros Completos del Asistente IA

### Criterios de Búsqueda:
| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `--min-price` | Precio mínimo USD | `200000` |
| `--max-price` | Precio máximo USD | `350000` |
| `--min-surface` | Superficie mínima m² | `50` |
| `--max-surface` | Superficie máxima m² | `100` |
| `--min-rooms` | Ambientes mínimos | `2` |
| `--max-rooms` | Ambientes máximos | `3` |
| `--neighborhoods` | Barrios (lista) | `Palermo Recoleta` |
| `--keywords` | Palabras clave | `terraza cochera` |
| `--sort-by` | Ordenar por | `price_per_m2` |
| `--top` | Número de resultados | `5` |

### Datos del Negocio:
| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `--business-name` | Nombre del negocio | `"Inmobiliaria XYZ"` |
| `--business-phone` | Teléfono | `"+54 11 1234-5678"` |
| `--business-email` | Email | `"ventas@xyz.com"` |
| `--business-address` | Dirección | `"Av. Santa Fe 1234"` |
| `--business-logo` | Ruta al logo | `"logo.png"` |
| `--primary-color` | Color principal | `"#2563eb"` |

### Personalización del Reporte:
| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `--title` | Título del reporte | `"Top 5 Propiedades"` |
| `--subtitle` | Subtítulo | `"Mejor precio/m²"` |
| `--output` | Archivo de salida | `"presentacion.html"` |

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias (`pip install -r requirements.txt`)
- [ ] Configurar datos del negocio (nombre, teléfono, email)
- [ ] Preparar logo del negocio (formato PNG/JPG)
- [ ] Configurar actualización de datos (diaria/manual)
- [ ] Probar con criterios de ejemplo
- [ ] Integrar con asistente IA
- [ ] Documentar workflow interno
- [ ] Capacitar al equipo

---

## 🆘 Solución de Problemas

### "No se encontró propiedades.json"
```bash
# Solución: Actualizar base de datos primero
python html_parser.py -d html_files
```

### "Muy pocas propiedades con esos criterios"
```bash
# Solución: Ampliar criterios o actualizar base de datos
# Criterios más amplios:
python ai_assistant_interface.py --max-price 500000 --top 10
```

### "No se puede conectar a Zonaprop (proxy)"
```bash
# Solución: Usar parser HTML local
# 1. Descarga páginas manualmente desde navegador
# 2. Guárdalas en html_files/
# 3. Ejecuta: python html_parser.py -d html_files
```

---

## 📞 Soporte

- **Documentación completa**: Ver `README.md`
- **Modo offline**: Ver `QUICKSTART_OFFLINE.md`
- **Repositorio**: https://github.com/Gochiri/Claude

---

**Última actualización:** Diciembre 2025
**Versión:** 2.0.0 (Con IA Assistant)
