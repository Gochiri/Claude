# 🥗 Plan de Aplicación de Seguimiento Nutricional

## 📋 Resumen Ejecutivo

Aplicación de tracking alimentario que permite a los usuarios:
- Registrar comidas mediante **fotos** o **descripciones de recetas**
- Calcular automáticamente **calorías y macronutrientes**
- Recibir **planes semanales personalizados** según objetivos
- Hacer seguimiento de progreso hacia metas de salud

---

## 🎯 Objetivos y Funcionalidades

### Objetivos del Usuario
1. **Pérdida de peso** (déficit calórico controlado)
2. **Detox** (alimentos limpios, antiinflamatorios)
3. **Quema de grasa basal** (optimización metabólica)
4. **Mantenimiento** (equilibrio nutricional)
5. **Ganancia muscular** (superávit + proteína)

### Funcionalidades Principales

#### 1. Perfil de Usuario
- **Datos personales**: edad, sexo, peso, altura
- **Nivel de actividad**:
  - Sedentario (poco o ningún ejercicio)
  - Ligero (ejercicio 1-3 días/semana)
  - Moderado (ejercicio 3-5 días/semana)
  - Activo (ejercicio 6-7 días/semana)
  - Muy activo (ejercicio intenso + trabajo físico)
- **Frecuencia de caminatas** (pasos diarios, minutos)
- **Objetivo actual** (pérdida de peso, detox, etc.)

#### 2. Registro de Comidas
- **Por foto**: Analizar imagen con IA de visión por computadora
- **Por descripción**: Parser de recetas en lenguaje natural
- **Manual**: Búsqueda en base de datos de alimentos
- **Horarios**: Desayuno, almuerzo, merienda, cena, snacks

#### 3. Análisis Nutricional
- **Calorías totales** por comida y día
- **Macronutrientes**: proteínas, carbohidratos, grasas
- **Micronutrientes**: vitaminas, minerales (opcional)
- **Fibra, azúcar, sodio**
- **Índice glucémico** estimado

#### 4. Calculadora Metabólica
- **TMB** (Tasa Metabólica Basal) - Ecuación Mifflin-St Jeor
- **TDEE** (Total Daily Energy Expenditure)
- **Calorías objetivo** según meta
- **Distribución de macros** personalizada

#### 5. Generador de Planes Semanales
- **Sugerencias de comidas** basadas en:
  - Calorías objetivo
  - Preferencias alimentarias
  - Alergias/intolerancias
  - Presupuesto
  - Tiempo de preparación
- **Lista de compras** automática
- **Recetas detalladas** con pasos

#### 6. Dashboard y Reportes
- **Gráficos de progreso** (peso, calorías, macros)
- **Streak tracking** (días consecutivos)
- **Insights y recomendaciones**
- **Comparativa semanal/mensual**

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico Propuesto

#### Backend
```
- Framework: FastAPI (Python 3.10+)
- Base de datos: PostgreSQL + Redis (caché)
- ORM: SQLAlchemy
- Autenticación: JWT (JSON Web Tokens)
- IA/ML: OpenAI GPT-4 Vision API + Hugging Face
- Hosting: Railway / Render / AWS Lambda
```

#### Frontend
```
- Framework: React + TypeScript (Web)
- Mobile: React Native (iOS/Android)
- UI Library: Tailwind CSS + shadcn/ui
- Estado: Zustand / React Query
- Gráficos: Recharts / Chart.js
- Hosting: Vercel / Netlify
```

#### APIs y Servicios Externos
```
- Visión por computadora: OpenAI GPT-4 Vision
- Base de datos de alimentos: USDA FoodData Central API (gratis)
- Alternativa: Nutritionix API, Spoonacular API
- OCR para recetas: Google Cloud Vision / Tesseract
```

---

## 📊 Modelo de Datos

### 1. Tabla: `users`
```sql
- id (UUID, primary key)
- email (string, unique)
- password_hash (string)
- name (string)
- age (integer)
- sex (enum: male, female, other)
- height_cm (decimal)
- current_weight_kg (decimal)
- target_weight_kg (decimal)
- activity_level (enum: sedentary, light, moderate, active, very_active)
- steps_goal (integer, default: 10000)
- goal_type (enum: weight_loss, detox, fat_burn, maintenance, muscle_gain)
- created_at (timestamp)
- updated_at (timestamp)
```

### 2. Tabla: `meals`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- date (date)
- meal_type (enum: breakfast, lunch, snack, dinner)
- name (string)
- description (text)
- photo_url (string, nullable)
- total_calories (decimal)
- protein_g (decimal)
- carbs_g (decimal)
- fat_g (decimal)
- fiber_g (decimal)
- created_at (timestamp)
```

### 3. Tabla: `food_items`
```sql
- id (UUID, primary key)
- meal_id (UUID, foreign key)
- food_name (string)
- quantity (decimal)
- unit (string: g, ml, oz, cup, etc.)
- calories (decimal)
- protein_g (decimal)
- carbs_g (decimal)
- fat_g (decimal)
```

### 4. Tabla: `recipes`
```sql
- id (UUID, primary key)
- name (string)
- description (text)
- servings (integer)
- prep_time_minutes (integer)
- cook_time_minutes (integer)
- instructions (json)
- ingredients (json)
- calories_per_serving (decimal)
- protein_g (decimal)
- carbs_g (decimal)
- fat_g (decimal)
- tags (array: low-carb, vegan, gluten-free, etc.)
```

### 5. Tabla: `weekly_plans`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- week_start_date (date)
- goal_calories_per_day (decimal)
- meals_plan (json) # Estructura de 7 días con comidas
- shopping_list (json)
- created_at (timestamp)
```

### 6. Tabla: `weight_logs`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- weight_kg (decimal)
- date (date)
- notes (text, nullable)
```

---

## 🤖 Sistema de Análisis de Fotos

### Flujo de Procesamiento

```
1. Usuario sube foto
   ↓
2. Validación de imagen (formato, tamaño)
   ↓
3. Envío a GPT-4 Vision API
   ↓
4. Prompt: "Identifica todos los alimentos en esta imagen,
            estima las porciones y proporciona información
            nutricional en formato JSON"
   ↓
5. Respuesta JSON estructurada
   {
     "foods": [
       {
         "name": "arroz blanco",
         "quantity": 150,
         "unit": "g",
         "calories": 195,
         "protein_g": 4,
         "carbs_g": 43,
         "fat_g": 0.4
       },
       ...
     ]
   }
   ↓
6. Almacenamiento en BD + cálculo de totales
```

### Alternativa: Modelo Local
- Usar **CLIP** (Contrastive Language-Image Pre-training)
- Fine-tuning en dataset de comidas (Food-101, Nutrition5k)
- Más barato pero menos preciso

---

## 🧮 Calculadora de Necesidades Calóricas

### Fórmulas Implementadas

#### 1. TMB (Tasa Metabólica Basal) - Mifflin-St Jeor
```python
# Hombres
TMB = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) + 5

# Mujeres
TMB = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) - 161
```

#### 2. TDEE (Gasto Energético Total Diario)
```python
multiplicadores = {
    'sedentary': 1.2,      # Poco o ningún ejercicio
    'light': 1.375,         # Ejercicio ligero 1-3 días/semana
    'moderate': 1.55,       # Ejercicio moderado 3-5 días/semana
    'active': 1.725,        # Ejercicio intenso 6-7 días/semana
    'very_active': 1.9      # Ejercicio muy intenso + trabajo físico
}

TDEE = TMB × multiplicadores[activity_level]
```

#### 3. Calorías Objetivo según Meta
```python
objetivos = {
    'weight_loss': TDEE - 500,      # Déficit de 500 cal (0.5 kg/semana)
    'fat_burn': TDEE - 300,         # Déficit moderado
    'detox': TDEE,                  # Mantenimiento con alimentos limpios
    'maintenance': TDEE,
    'muscle_gain': TDEE + 300       # Superávit de 300 cal
}
```

#### 4. Distribución de Macronutrientes
```python
# Pérdida de peso / Quema de grasa
protein_pct = 0.30    # 30% proteína
carbs_pct = 0.35      # 35% carbohidratos
fat_pct = 0.35        # 35% grasas

# Detox
protein_pct = 0.25
carbs_pct = 0.45      # Más carbohidratos de frutas/verduras
fat_pct = 0.30

# Ganancia muscular
protein_pct = 0.35    # Más proteína
carbs_pct = 0.45
fat_pct = 0.20
```

---

## 🍽️ Motor de Recomendaciones de Comidas

### Algoritmo de Generación de Planes

```python
def generar_plan_semanal(user_profile, preferences):
    """
    1. Calcular calorías objetivo diarias
    2. Distribuir calorías por comida:
       - Desayuno: 25%
       - Almuerzo: 35%
       - Merienda: 10%
       - Cena: 30%

    3. Filtrar recetas según:
       - Calorías por porción
       - Macros compatibles
       - Restricciones (vegano, sin gluten, etc.)
       - Tiempo de preparación

    4. Optimizar variedad:
       - No repetir proteína principal > 2 días seguidos
       - Alternar tipos de cocina
       - Balancear colores (frutas/verduras)

    5. Generar lista de compras consolidada
    """
```

### Criterios de Optimización
- **Balance nutricional**: Cumplir macros objetivo ±5%
- **Variedad**: Máximo 2 repeticiones de ingrediente principal/semana
- **Estacionalidad**: Priorizar alimentos de temporada
- **Costo**: Dentro del presupuesto definido
- **Tiempo**: No exceder tiempo de preparación disponible

---

## 🎨 Diseño de Interfaz de Usuario

### Pantallas Principales

#### 1. **Onboarding**
- Bienvenida
- Registro de datos personales
- Selección de objetivo
- Configuración de preferencias

#### 2. **Dashboard**
```
┌─────────────────────────────────────┐
│  Hoy: 1,450 / 1,800 cal             │
│  ████████░░░░ 80%                   │
│                                      │
│  Macros:                             │
│  Proteína:   68g / 135g  ████░░░     │
│  Carbos:     150g / 202g ███████░    │
│  Grasas:     45g / 60g   ███████░    │
│                                      │
│  [+ Agregar Comida]                  │
└─────────────────────────────────────┘
```

#### 3. **Registro de Comida**
- Tabs: Foto | Descripción | Manual
- Vista previa de análisis nutricional
- Edición de cantidades
- Guardar comida

#### 4. **Plan Semanal**
- Calendario con comidas asignadas
- Vista de receta al hacer click
- Botón "Generar nuevo plan"
- Lista de compras descargable

#### 5. **Progreso**
- Gráficos de peso (línea temporal)
- Calorías diarias (gráfico de barras)
- Macros promedio (gráfico de dona)
- Streak y logros

---

## 🔐 Seguridad y Privacidad

### Medidas Implementadas
- **Encriptación**: Passwords con bcrypt (12 rounds)
- **Autenticación**: JWT con refresh tokens
- **HTTPS**: Obligatorio en producción
- **Rate limiting**: Prevenir abuso de APIs
- **Validación**: Sanitización de inputs
- **GDPR**: Opción de exportar/eliminar datos

---

## 📦 APIs y Bases de Datos de Alimentos

### Opción 1: USDA FoodData Central (GRATIS)
```
- Base de datos oficial del gobierno USA
- 390,000+ alimentos
- Información nutricional completa
- API gratuita sin límite de requests
- URL: https://fdc.nal.usda.gov/api-guide.html
```

### Opción 2: Nutritionix API
```
- Base de datos comercial
- 800,000+ alimentos
- Incluye alimentos de restaurantes
- 500 requests/día gratis
- $79/mes para plan pro
```

### Opción 3: Spoonacular API
```
- Enfocado en recetas
- 5,000+ recetas con análisis nutricional
- Generador de planes de comidas
- 150 requests/día gratis
- $49/mes para plan básico
```

### Recomendación
Usar **USDA FoodData Central** como base principal + **Spoonacular** para recetas y generación de planes.

---

## 🚀 Plan de Implementación por Fases

### Fase 1: MVP (4 semanas)
- ✅ Backend básico (FastAPI + PostgreSQL)
- ✅ Autenticación de usuarios
- ✅ Perfil de usuario con cálculo de calorías
- ✅ Registro manual de comidas
- ✅ Dashboard con calorías y macros del día
- ✅ Integración con USDA API

### Fase 2: IA de Fotos (2 semanas)
- ✅ Integración con GPT-4 Vision
- ✅ Upload de fotos
- ✅ Análisis automático de alimentos
- ✅ Validación y edición de resultados

### Fase 3: Parser de Recetas (2 semanas)
- ✅ NLP para procesar descripciones
- ✅ Extracción de ingredientes y cantidades
- ✅ Cálculo nutricional de recetas

### Fase 4: Planes Semanales (3 semanas)
- ✅ Motor de recomendaciones
- ✅ Integración con Spoonacular
- ✅ Generador de listas de compras
- ✅ Algoritmo de optimización

### Fase 5: Frontend Web (3 semanas)
- ✅ React + TypeScript
- ✅ Todas las pantallas principales
- ✅ Gráficos de progreso
- ✅ Responsive design

### Fase 6: App Móvil (4 semanas)
- ✅ React Native
- ✅ Cámara integrada
- ✅ Notificaciones push
- ✅ Modo offline

---

## 💰 Estimación de Costos Mensuales

### Desarrollo
- Gratis (open source / proyecto personal)

### Infraestructura (1,000 usuarios activos)
```
- Backend (Railway): $5-15/mes
- Base de datos (PostgreSQL): $5/mes (Railway)
- Redis (Upstash): Gratis hasta 10K requests/día
- Storage de fotos (Cloudflare R2): $0.015/GB
- Total: ~$20/mes
```

### APIs Externas
```
- USDA FoodData: Gratis
- GPT-4 Vision (OpenAI):
  - $0.01 por imagen (alta calidad)
  - 100 fotos/día = $30/mes
- Spoonacular API: $49/mes (plan básico)
- Total: ~$80/mes
```

**Costo total estimado: ~$100/mes** para MVP con 100 usuarios activos.

---

## 📈 Métricas de Éxito

### KPIs Principales
- **Retención**: % usuarios activos después de 30 días (objetivo: >40%)
- **Engagement**: Promedio de comidas registradas por semana (objetivo: >15)
- **Precisión IA**: Exactitud de análisis de fotos (objetivo: >85%)
- **Satisfacción**: NPS (Net Promoter Score) (objetivo: >50)

### Métricas Técnicas
- **Uptime**: 99.5% disponibilidad
- **Tiempo de respuesta API**: <200ms (p95)
- **Tiempo de análisis de foto**: <5 segundos

---

## 🔮 Roadmap Futuro

### Features Adicionales
- 🤝 **Comunidad**: Compartir recetas, progreso, desafíos
- 🏋️ **Integración con wearables**: Fitbit, Apple Watch, Google Fit
- 💊 **Tracking de suplementos**: Vitaminas, proteína en polvo
- 🧘 **Bienestar integral**: Sueño, estrés, meditación
- 🎯 **Gamificación**: Puntos, logros, desafíos semanales
- 👨‍⚕️ **Panel para nutricionistas**: Seguimiento de clientes
- 🌍 **Multi-idioma**: Español, inglés, portugués
- 🛒 **Integración con supermercados**: Pedidos online desde la app

---

## 📚 Recursos y Referencias

### Documentación Técnica
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- GPT-4 Vision: https://platform.openai.com/docs/guides/vision
- USDA API: https://fdc.nal.usda.gov/api-guide.html

### Investigación Nutricional
- Mifflin-St Jeor Equation: https://pubmed.ncbi.nlm.nih.gov/2305711/
- Macronutrient Distribution: AMDR (Acceptable Macronutrient Distribution Ranges)
- TDEE Calculators: https://tdeecalculator.net/

### Datasets de Entrenamiento
- Food-101: https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/
- Nutrition5k: https://github.com/google-research-datasets/Nutrition5k

---

## ✅ Próximos Pasos

1. **Validar requisitos** con stakeholders/usuarios potenciales
2. **Definir scope del MVP** (empezar con Fase 1)
3. **Configurar entorno de desarrollo**
4. **Crear repositorio Git** con estructura de proyecto
5. **Setup de base de datos** (PostgreSQL local)
6. **Implementar autenticación** y endpoints básicos
7. **Probar integración** con USDA API
8. **Desarrollar frontend** básico para testing

---

**Documento creado**: 2026-01-02
**Versión**: 1.0
**Estado**: Borrador para aprobación
