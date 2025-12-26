# 🔗 Acceso al Proyecto

## 📍 Repositorio GitHub

**URL del Repositorio:** `https://github.com/Gochiri/Claude`

**Branch del Proyecto:** `claude/brainstorm-ideas-hQzr3`

### 🌐 Links Directos:

- **Código completo:** https://github.com/Gochiri/Claude/tree/claude/brainstorm-ideas-hQzr3
- **README principal:** https://github.com/Gochiri/Claude/blob/claude/brainstorm-ideas-hQzr3/README.md
- **Quick Start Offline:** https://github.com/Gochiri/Claude/blob/claude/brainstorm-ideas-hQzr3/QUICKSTART_OFFLINE.md

---

## 🚀 Cómo empezar

### Clonar el repositorio:

```bash
git clone https://github.com/Gochiri/Claude.git
cd Claude
git checkout claude/brainstorm-ideas-hQzr3
```

### Instalar dependencias:

```bash
pip install -r requirements.txt
```

### Probar las 3 funcionalidades:

#### 1️⃣ Generador Mock (instantáneo):
```bash
python mock_data_generator.py -n 50 --seed 42
python main.py --analyze-only --json propiedades_mock.json --excel
```

#### 2️⃣ Parser HTML (con archivos de ejemplo incluidos):
```bash
python html_parser.py -d html_files
python main.py --analyze-only --json propiedades_html.json --excel
```

#### 3️⃣ Demo completa:
```bash
python demo.py
```

---

## 📊 Pruebas Realizadas

✅ **Test 1:** Generador de datos mock - 20 propiedades generadas
✅ **Test 2:** Parser HTML local - 12 propiedades extraídas de 3 archivos
✅ **Test 3:** Análisis de datos mock - Estadísticas completas
✅ **Test 4:** Análisis de HTML parseado - Rankings y exportaciones

**Todos los tests pasaron exitosamente!**

---

## 📁 Estructura del Proyecto

```
Claude/
├── main.py                   # CLI principal
├── scraper.py                # Scraper online (requiere internet)
├── html_parser.py            # Parser HTML offline ⭐
├── mock_data_generator.py    # Generador mock ⭐
├── analyzer.py               # Motor de análisis
├── demo.py                   # Script de demostración
├── config.py                 # Configuración
├── requirements.txt          # Dependencias
├── README.md                 # Documentación completa
├── QUICKSTART_OFFLINE.md     # Guía rápida modo offline
├── LINK_PROYECTO.md          # Este archivo
├── html_files/               # ⭐ 3 archivos HTML de ejemplo incluidos
│   ├── zonaprop_page1.html   # 5 propiedades Palermo
│   ├── zonaprop_page2.html   # 4 propiedades Recoleta
│   └── zonaprop_belgrano.html # 3 propiedades Belgrano
└── resultados/               # Archivos generados (auto-creados)
    ├── propiedades_mock.json
    ├── propiedades_html.json
    ├── analisis_propiedades.csv
    └── analisis_propiedades.xlsx
```

---

## 🎯 Características Principales

### ✨ 3 Modos de Operación:

1. **Scraper Online** - Conexión directa a Zonaprop (requiere internet sin proxy)
2. **Parser HTML** - Analiza archivos HTML descargados (100% offline)
3. **Generador Mock** - Datos realistas para testing (instantáneo)

### 📊 Análisis Completo:

- Estadísticas descriptivas (promedio, mediana, min, max)
- Cálculo automático de precio por m²
- Rankings personalizables (top N propiedades)
- Distribución por barrio
- Exportación múltiple (JSON, CSV, Excel)

### 🌐 Sin Restricciones de Red:

- ✅ Funciona con proxies corporativos
- ✅ Funciona sin internet
- ✅ Funciona en entornos restringidos
- ✅ Incluye archivos HTML de ejemplo

---

## 📝 Commits Realizados

1. **22aa404** - Implementar web scraper de Zonaprop con análisis de propiedades
2. **c29b7ec** - Agregar script de demostración con análisis avanzado
3. **195952b** - Agregar soluciones para restricciones de red y modo offline
4. **79ce9c1** - Agregar archivos HTML de ejemplo para demostración del parser

---

## 💡 Ejemplos de Uso

### Analizar 100 propiedades mock:
```bash
python mock_data_generator.py -n 100 --seed 2024
python main.py --analyze-only --json propiedades_mock.json --top 20 --excel --csv
```

### Usar archivos HTML de ejemplo:
```bash
# Ya están incluidos en html_files/
python html_parser.py -d html_files
python main.py --analyze-only --json propiedades_html.json
```

### Ver estadísticas detalladas:
```bash
python demo.py
```

---

## 📧 Soporte

- **Issues:** https://github.com/Gochiri/Claude/issues
- **Documentación completa:** Ver README.md en el repositorio
- **Guía offline:** Ver QUICKSTART_OFFLINE.md

---

## ⚡ Quick Start de 30 segundos

```bash
# 1. Clonar y entrar
git clone https://github.com/Gochiri/Claude.git
cd Claude && git checkout claude/brainstorm-ideas-hQzr3

# 2. Instalar
pip install -r requirements.txt

# 3. Probar
python demo.py
```

**¡Listo! Ya tienes el scraper funcionando.**

---

**Fecha de creación:** 26 de Diciembre, 2025
**Última actualización:** 26 de Diciembre, 2025
**Versión:** 1.0.0
**Estado:** ✅ Completo y funcional
