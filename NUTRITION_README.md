# 🥗 Nutrition Tracker - Aplicación de Seguimiento Nutricional

> Aplicación completa para seguimiento de alimentación, análisis nutricional con IA y generación de planes personalizados.

---

## 📋 Resumen Ejecutivo

**Nutrition Tracker** es una aplicación web y móvil que permite a los usuarios:

- 📸 **Registrar comidas** mediante fotos, descripciones o entrada manual
- 🤖 **Análisis automático con IA** usando GPT-4 Vision para reconocer alimentos
- 📊 **Cálculo preciso** de calorías y macronutrientes
- 🎯 **Planes personalizados** según objetivos (pérdida de peso, detox, ganancia muscular)
- 📈 **Seguimiento de progreso** con gráficos y métricas
- 📅 **Planes semanales** con recetas y listas de compras automáticas

---

## 🎯 Objetivos Soportados

| Objetivo | Descripción | Estrategia Nutricional |
|----------|-------------|------------------------|
| **Pérdida de peso** | Déficit calórico controlado | -500 cal/día, 30% proteína |
| **Detox** | Alimentación limpia y antiinflamatoria | Mantenimiento, alimentos integrales |
| **Quema de grasa basal** | Optimización metabólica | -300 cal/día, balance de macros |
| **Mantenimiento** | Equilibrio nutricional | TDEE exacto, 25/45/30 macros |
| **Ganancia muscular** | Superávit con alta proteína | +300 cal/día, 35% proteína |

---

## ✨ Características Principales

### 1. Perfil Personalizado
- Cálculo automático de necesidades calóricas (TMB + TDEE)
- Ajuste por edad, sexo, peso, altura y nivel de actividad
- Distribución óptima de macronutrientes según objetivo

### 2. Registro Inteligente de Comidas
- **Por foto**: Sube una imagen y la IA identifica automáticamente los alimentos
- **Por descripción**: Escribe "ensalada césar con pollo" y obtén el análisis nutricional
- **Manual**: Busca alimentos en base de datos USDA (390,000+ alimentos)

### 3. Dashboard Interactivo
- Progreso diario de calorías y macros en tiempo real
- Gráficos visuales de proteínas, carbohidratos y grasas
- Historial de comidas del día
- Indicadores de cumplimiento de objetivos

### 4. Generador de Planes Semanales
- Sugerencias automáticas de comidas según tu objetivo
- Recetas con instrucciones paso a paso
- Lista de compras consolidada
- Consideración de preferencias (vegano, sin gluten, etc.)

### 5. Seguimiento de Progreso
- Gráficos de evolución de peso
- Tendencias de consumo calórico
- Racha de días consecutivos
- Logros y badges gamificados

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Backend:  FastAPI + Python 3.10+
Frontend: React + TypeScript + Tailwind CSS
Mobile:   React Native (futuro)
Database: PostgreSQL + Redis
IA:       OpenAI GPT-4 Vision
APIs:     USDA FoodData Central (gratis)
          Spoonacular (recetas)
Hosting:  Railway / Render (backend)
          Vercel (frontend)
```

### Componentes Principales

```
nutrition-tracker/
├── backend/                # API REST con FastAPI
│   ├── app/
│   │   ├── api/v1/        # Endpoints
│   │   ├── models/        # Modelos SQLAlchemy
│   │   ├── services/      # Lógica de negocio
│   │   │   ├── nutrition_calc.py   # Cálculos TMB/TDEE
│   │   │   ├── ai_vision.py        # Análisis de fotos
│   │   │   ├── usda_api.py         # Integración USDA
│   │   │   └── plan_generator.py   # Planes semanales
│   │   └── schemas/       # Validación Pydantic
│   └── alembic/           # Migraciones de BD
│
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Pantallas principales
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios API
│   │   └── store/         # Estado global (Zustand)
│   └── public/
│
└── docs/                  # Documentación del proyecto
```

---

## 📊 Modelo de Datos

### Entidades Principales

1. **users** - Perfiles de usuario con objetivos y preferencias
2. **meals** - Comidas registradas con análisis nutricional
3. **food_items** - Items individuales dentro de cada comida
4. **recipes** - Recetas con ingredientes e instrucciones
5. **weekly_plans** - Planes semanales generados
6. **weight_logs** - Registro histórico de peso

### Relaciones

```
User (1) ──< (N) Meals ──< (N) FoodItems
User (1) ──< (N) WeeklyPlans
User (1) ──< (N) WeightLogs
WeeklyPlan (N) ──< (N) Recipes
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Cuenta OpenAI (para análisis de fotos)

### Instalación en 5 pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/nutrition-tracker.git
cd nutrition-tracker

# 2. Configurar backend
cd backend
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt

# 3. Configurar base de datos
createdb nutrition_db
cp .env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar migraciones
alembic upgrade head

# 5. Iniciar aplicación
# Terminal 1 - Backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd ../frontend
npm install
npm start
```

Abre http://localhost:3000 en tu navegador.

---

## 📖 Documentación Completa

Este repositorio incluye documentación detallada:

| Documento | Descripción |
|-----------|-------------|
| **[NUTRITION_APP_PLAN.md](NUTRITION_APP_PLAN.md)** | Plan completo de la aplicación con arquitectura, funcionalidades y roadmap |
| **[NUTRITION_APP_STRUCTURE.md](NUTRITION_APP_STRUCTURE.md)** | Estructura de directorios, esquema de BD y comandos de desarrollo |
| **[NUTRITION_CODE_EXAMPLES.md](NUTRITION_CODE_EXAMPLES.md)** | Ejemplos de código backend (Python/FastAPI) |
| **[NUTRITION_FRONTEND_EXAMPLES.md](NUTRITION_FRONTEND_EXAMPLES.md)** | Ejemplos de código frontend (React/TypeScript) |
| **[NUTRITION_SETUP_GUIDE.md](NUTRITION_SETUP_GUIDE.md)** | Guía paso a paso de instalación y configuración |

---

## 💡 Casos de Uso

### Caso 1: Usuario Principiante

María, 28 años, quiere perder 5kg. Nunca ha contado calorías.

1. Se registra y completa perfil (edad, peso, altura, actividad)
2. La app calcula: necesita 1,600 cal/día con 30% proteína
3. En el almuerzo, saca foto de su ensalada
4. La IA reconoce: lechuga, tomate, pollo, aderezo → 380 calorías
5. El dashboard muestra: 380/1,600 cal consumidas (23%)
6. Al final del día, revisa si cumplió su objetivo

### Caso 2: Usuario Avanzado

Carlos, 35 años, culturista, necesita plan semanal optimizado.

1. Configura objetivo: ganancia muscular (2,400 cal, 35% proteína)
2. Genera plan semanal automático
3. Recibe 21 recetas (7 días × 3 comidas) optimizadas
4. Descarga lista de compras para la semana
5. Cada día, marca las comidas como completadas
6. Revisa gráficos de tendencia de peso y macros

### Caso 3: Usuario con Restricciones

Ana, vegana, intolerante al gluten, quiere plan detox.

1. Configura preferencias: vegano + sin gluten
2. Selecciona objetivo: detox (alimentos antiinflamatorios)
3. El generador filtra recetas automáticamente
4. Recibe plan personalizado con solo opciones válidas
5. Todas las recetas son veganas y sin gluten
6. Puede solicitar variaciones con un click

---

## 🧮 Cálculos Nutricionales

### Tasa Metabólica Basal (TMB)

Fórmula Mifflin-St Jeor:

```
Hombres: TMB = (10 × peso) + (6.25 × altura) - (5 × edad) + 5
Mujeres: TMB = (10 × peso) + (6.25 × altura) - (5 × edad) - 161
```

### Gasto Energético Total (TDEE)

```
TDEE = TMB × Factor de Actividad

Factores:
- Sedentario:          1.2  (poco o ningún ejercicio)
- Ligero:              1.375 (ejercicio 1-3 días/semana)
- Moderado:            1.55  (ejercicio 3-5 días/semana)
- Activo:              1.725 (ejercicio 6-7 días/semana)
- Muy activo:          1.9   (ejercicio intenso + trabajo físico)
```

### Distribución de Macronutrientes

| Objetivo | Proteína | Carbos | Grasas |
|----------|----------|--------|--------|
| Pérdida de peso | 30% | 35% | 35% |
| Detox | 25% | 45% | 30% |
| Mantenimiento | 25% | 45% | 30% |
| Ganancia muscular | 35% | 45% | 20% |

---

## 🤖 Análisis con IA

### Flujo de Procesamiento de Fotos

```
1. Usuario sube foto de comida
   ↓
2. Validación (formato, tamaño)
   ↓
3. Envío a GPT-4 Vision API
   ↓
4. IA identifica alimentos y estima porciones
   ↓
5. Respuesta JSON con lista de alimentos
   ↓
6. Cálculo de calorías y macros
   ↓
7. Almacenamiento en base de datos
```

### Ejemplo de Respuesta de IA

```json
{
  "description": "Plato de arroz con pollo y ensalada",
  "foods": [
    {
      "name": "pechuga de pollo a la plancha",
      "quantity": 150,
      "unit": "g",
      "calories": 247,
      "protein_g": 46.5,
      "carbs_g": 0,
      "fat_g": 5.4,
      "confidence": 0.85
    },
    {
      "name": "arroz blanco cocido",
      "quantity": 200,
      "unit": "g",
      "calories": 260,
      "protein_g": 5.3,
      "carbs_g": 57,
      "fat_g": 0.6,
      "confidence": 0.90
    }
  ]
}
```

---

## 💰 Costos Estimados

### Desarrollo
- **Gratis** (proyecto open source)

### Infraestructura (1,000 usuarios activos/mes)
```
Backend (Railway):           $15/mes
PostgreSQL:                   $5/mes
Redis (Upstash):             Gratis
Storage (Cloudflare R2):      $2/mes
──────────────────────────────────
Subtotal:                    $22/mes
```

### APIs Externas
```
USDA FoodData:               Gratis (ilimitado)
OpenAI GPT-4 Vision:         $30/mes (100 fotos/día)
Spoonacular API:             $49/mes (plan básico)
──────────────────────────────────
Subtotal:                    $79/mes
```

**Total: ~$100/mes** para MVP con 1,000 usuarios activos

### Escalamiento

Para 10,000 usuarios activos: ~$300-400/mes

---

## 📈 Roadmap de Desarrollo

### Fase 1: MVP (4 semanas) ✅ EN PLANIFICACIÓN
- [x] Backend básico (FastAPI + PostgreSQL)
- [x] Autenticación de usuarios (JWT)
- [x] Cálculo de necesidades calóricas
- [x] Registro manual de comidas
- [x] Dashboard con calorías y macros
- [x] Integración con USDA API

### Fase 2: IA de Fotos (2 semanas)
- [ ] Integración con GPT-4 Vision
- [ ] Upload de fotos
- [ ] Análisis automático de alimentos
- [ ] Edición de resultados

### Fase 3: Parser de Recetas (2 semanas)
- [ ] NLP para procesar descripciones
- [ ] Extracción de ingredientes
- [ ] Cálculo nutricional de recetas

### Fase 4: Planes Semanales (3 semanas)
- [ ] Motor de recomendaciones
- [ ] Integración con Spoonacular
- [ ] Generador de listas de compras
- [ ] Algoritmo de optimización

### Fase 5: Frontend Web (3 semanas)
- [ ] React + TypeScript
- [ ] Todas las pantallas principales
- [ ] Gráficos de progreso
- [ ] Responsive design

### Fase 6: App Móvil (4 semanas)
- [ ] React Native
- [ ] Cámara integrada
- [ ] Notificaciones push
- [ ] Modo offline

---

## 🤝 Contribuir

Contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📧 Contacto

Para preguntas, sugerencias o reportar bugs:

- **GitHub Issues**: [github.com/tu-usuario/nutrition-tracker/issues](https://github.com/tu-usuario/nutrition-tracker/issues)
- **Email**: tu-email@ejemplo.com

---

## 🙏 Agradecimientos

- **USDA FoodData Central** - Base de datos de alimentos gratuita
- **OpenAI** - GPT-4 Vision API
- **Spoonacular** - API de recetas
- **FastAPI** - Framework web moderno
- **React** - Biblioteca de UI

---

## 📊 Estado del Proyecto

```
┌─────────────────────────────────────────┐
│  Estado: 📝 EN PLANIFICACIÓN            │
│  Fase actual: Fase 1 - MVP              │
│  Progreso: ████░░░░░░░░░░░░░░░ 25%     │
│  Próxima release: v0.1.0 (Beta MVP)     │
└─────────────────────────────────────────┘
```

**Última actualización:** 2026-01-02

---

**¡Gracias por tu interés en Nutrition Tracker! 🥗**

Si este proyecto te resulta útil, considera darle una ⭐ en GitHub.
