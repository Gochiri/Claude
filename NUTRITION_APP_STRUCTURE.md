# 📁 Estructura del Proyecto - Aplicación de Nutrición

## Arquitectura de Carpetas

```
nutrition-tracker/
│
├── 📂 backend/                          # API Backend (FastAPI)
│   ├── 📂 app/
│   │   ├── 📂 api/                      # Endpoints de la API
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py              # Login, registro, JWT
│   │   │   │   ├── users.py             # Gestión de usuarios
│   │   │   │   ├── meals.py             # CRUD de comidas
│   │   │   │   ├── photos.py            # Análisis de fotos
│   │   │   │   ├── recipes.py           # Parser de recetas
│   │   │   │   ├── plans.py             # Planes semanales
│   │   │   │   ├── nutrition.py         # Cálculos nutricionales
│   │   │   │   └── progress.py          # Tracking de progreso
│   │   │   └── deps.py                  # Dependencies (auth, db)
│   │   │
│   │   ├── 📂 core/                     # Configuración core
│   │   │   ├── __init__.py
│   │   │   ├── config.py                # Settings (env vars)
│   │   │   ├── security.py              # JWT, hashing
│   │   │   └── logging.py               # Configuración de logs
│   │   │
│   │   ├── 📂 db/                       # Base de datos
│   │   │   ├── __init__.py
│   │   │   ├── base.py                  # Base class para modelos
│   │   │   ├── session.py               # Database session
│   │   │   └── init_db.py               # Inicialización
│   │   │
│   │   ├── 📂 models/                   # Modelos SQLAlchemy
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # Modelo User
│   │   │   ├── meal.py                  # Modelo Meal
│   │   │   ├── food_item.py             # Modelo FoodItem
│   │   │   ├── recipe.py                # Modelo Recipe
│   │   │   ├── weekly_plan.py           # Modelo WeeklyPlan
│   │   │   └── weight_log.py            # Modelo WeightLog
│   │   │
│   │   ├── 📂 schemas/                  # Pydantic schemas (validación)
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # UserCreate, UserResponse
│   │   │   ├── meal.py                  # MealCreate, MealResponse
│   │   │   ├── recipe.py                # RecipeCreate, RecipeResponse
│   │   │   ├── plan.py                  # PlanCreate, PlanResponse
│   │   │   └── token.py                 # Token, TokenPayload
│   │   │
│   │   ├── 📂 services/                 # Lógica de negocio
│   │   │   ├── __init__.py
│   │   │   ├── ai_vision.py             # Integración GPT-4 Vision
│   │   │   ├── nutrition_calc.py        # Cálculo TMB, TDEE, macros
│   │   │   ├── usda_api.py              # Integración USDA FoodData
│   │   │   ├── spoonacular_api.py       # Integración Spoonacular
│   │   │   ├── recipe_parser.py         # NLP para recetas
│   │   │   ├── plan_generator.py        # Generador de planes semanales
│   │   │   └── storage.py               # Upload de fotos (Cloudflare R2)
│   │   │
│   │   ├── 📂 utils/                    # Utilidades
│   │   │   ├── __init__.py
│   │   │   ├── validators.py            # Validadores custom
│   │   │   ├── constants.py             # Constantes (macros, etc.)
│   │   │   └── helpers.py               # Funciones auxiliares
│   │   │
│   │   ├── main.py                      # Punto de entrada de FastAPI
│   │   └── __init__.py
│   │
│   ├── 📂 alembic/                      # Migraciones de BD
│   │   ├── versions/
│   │   ├── env.py
│   │   └── alembic.ini
│   │
│   ├── 📂 tests/                        # Tests
│   │   ├── __init__.py
│   │   ├── conftest.py                  # Fixtures pytest
│   │   ├── test_auth.py
│   │   ├── test_meals.py
│   │   ├── test_nutrition_calc.py
│   │   └── test_ai_vision.py
│   │
│   ├── .env.example                     # Template de variables
│   ├── .gitignore
│   ├── requirements.txt                 # Dependencias Python
│   ├── pytest.ini
│   └── README.md
│
├── 📂 frontend/                         # Frontend Web (React)
│   ├── 📂 public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/               # Componentes React
│   │   │   ├── 📂 auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   │
│   │   │   ├── 📂 dashboard/
│   │   │   │   ├── CaloriesProgress.tsx
│   │   │   │   ├── MacrosChart.tsx
│   │   │   │   ├── DailyMeals.tsx
│   │   │   │   └── QuickStats.tsx
│   │   │   │
│   │   │   ├── 📂 meals/
│   │   │   │   ├── MealForm.tsx
│   │   │   │   ├── PhotoUpload.tsx
│   │   │   │   ├── RecipeInput.tsx
│   │   │   │   ├── ManualEntry.tsx
│   │   │   │   └── MealCard.tsx
│   │   │   │
│   │   │   ├── 📂 plans/
│   │   │   │   ├── WeeklyCalendar.tsx
│   │   │   │   ├── RecipeDetail.tsx
│   │   │   │   ├── ShoppingList.tsx
│   │   │   │   └── PlanGenerator.tsx
│   │   │   │
│   │   │   ├── 📂 profile/
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   ├── GoalSettings.tsx
│   │   │   │   └── PreferencesForm.tsx
│   │   │   │
│   │   │   ├── 📂 progress/
│   │   │   │   ├── WeightChart.tsx
│   │   │   │   ├── CaloriesChart.tsx
│   │   │   │   ├── StreakCounter.tsx
│   │   │   │   └── AchievementsList.tsx
│   │   │   │
│   │   │   └── 📂 common/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Loading.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   │
│   │   ├── 📂 hooks/                    # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useMeals.ts
│   │   │   ├── usePlans.ts
│   │   │   └── useNutrition.ts
│   │   │
│   │   ├── 📂 services/                 # Servicios API
│   │   │   ├── api.ts                   # Axios config
│   │   │   ├── authService.ts
│   │   │   ├── mealService.ts
│   │   │   ├── planService.ts
│   │   │   └── userService.ts
│   │   │
│   │   ├── 📂 store/                    # Estado global (Zustand)
│   │   │   ├── authStore.ts
│   │   │   ├── mealStore.ts
│   │   │   └── userStore.ts
│   │   │
│   │   ├── 📂 types/                    # TypeScript types
│   │   │   ├── user.ts
│   │   │   ├── meal.ts
│   │   │   ├── recipe.ts
│   │   │   └── plan.ts
│   │   │
│   │   ├── 📂 utils/                    # Utilidades
│   │   │   ├── formatters.ts            # Format dates, numbers
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── 📂 pages/                    # Páginas principales
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Onboarding.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AddMeal.tsx
│   │   │   ├── WeeklyPlan.tsx
│   │   │   ├── Progress.tsx
│   │   │   └── Settings.tsx
│   │   │
│   │   ├── App.tsx                      # Componente principal
│   │   ├── index.tsx                    # Entry point
│   │   └── index.css                    # Estilos globales
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── README.md
│
├── 📂 mobile/                           # App Móvil (React Native)
│   ├── 📂 src/
│   │   ├── 📂 screens/                  # Pantallas
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── CameraScreen.tsx
│   │   │   ├── AddMealScreen.tsx
│   │   │   └── ProgressScreen.tsx
│   │   │
│   │   ├── 📂 components/
│   │   ├── 📂 navigation/
│   │   │   └── AppNavigator.tsx
│   │   ├── 📂 services/
│   │   └── 📂 utils/
│   │
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── 📂 shared/                           # Código compartido
│   ├── 📂 types/                        # Types compartidos
│   └── 📂 constants/                    # Constantes compartidas
│
├── 📂 docs/                             # Documentación
│   ├── API.md                           # Documentación de API
│   ├── DEPLOYMENT.md                    # Guía de deployment
│   ├── CONTRIBUTING.md                  # Guía de contribución
│   └── USER_GUIDE.md                    # Guía de usuario
│
├── 📂 scripts/                          # Scripts de utilidad
│   ├── seed_database.py                 # Poblar BD con datos iniciales
│   ├── import_usda_data.py              # Importar datos USDA
│   └── backup_db.sh                     # Backup de BD
│
├── .gitignore
├── docker-compose.yml                   # Docker para desarrollo
├── Dockerfile                           # Dockerfile para backend
├── LICENSE
└── README.md                            # README principal
```

---

## 🗄️ Esquema de Base de Datos (PostgreSQL)

```sql
-- TABLA: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    sex VARCHAR(10) CHECK (sex IN ('male', 'female', 'other')),
    height_cm DECIMAL(5,2),
    current_weight_kg DECIMAL(5,2),
    target_weight_kg DECIMAL(5,2),
    activity_level VARCHAR(20) CHECK (activity_level IN (
        'sedentary', 'light', 'moderate', 'active', 'very_active'
    )),
    steps_goal INTEGER DEFAULT 10000,
    goal_type VARCHAR(20) CHECK (goal_type IN (
        'weight_loss', 'detox', 'fat_burn', 'maintenance', 'muscle_gain'
    )),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: meals
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) CHECK (meal_type IN (
        'breakfast', 'lunch', 'snack', 'dinner'
    )),
    name VARCHAR(255),
    description TEXT,
    photo_url VARCHAR(500),
    total_calories DECIMAL(7,2),
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    fiber_g DECIMAL(5,2),
    sugar_g DECIMAL(5,2),
    sodium_mg DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (user_id, date)
);

-- TABLA: food_items
CREATE TABLE food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(8,2),
    unit VARCHAR(20),
    calories DECIMAL(7,2),
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    fiber_g DECIMAL(5,2),
    usda_fdc_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: recipes
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    servings INTEGER,
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    instructions JSONB,
    ingredients JSONB,
    calories_per_serving DECIMAL(7,2),
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    tags TEXT[],
    cuisine_type VARCHAR(50),
    difficulty VARCHAR(20),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: weekly_plans
CREATE TABLE weekly_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    goal_calories_per_day DECIMAL(7,2),
    meals_plan JSONB NOT NULL,
    shopping_list JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_week (user_id, week_start_date)
);

-- TABLA: weight_logs
CREATE TABLE weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weight_kg DECIMAL(5,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (user_id, date)
);

-- TABLA: user_achievements (opcional - gamificación)
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);
```

---

## 🔧 Configuración de Desarrollo

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nutrition_db
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# External APIs
OPENAI_API_KEY=sk-...
USDA_API_KEY=your-usda-key
SPOONACULAR_API_KEY=your-spoonacular-key

# Storage
CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...
CLOUDFLARE_R2_BUCKET=nutrition-photos

# Environment
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENVIRONMENT=development
```

---

## 🚀 Comandos de Desarrollo

### Backend
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Crear base de datos
createdb nutrition_db

# Ejecutar migraciones
alembic upgrade head

# Poblar base de datos con datos de ejemplo
python scripts/seed_database.py

# Ejecutar servidor de desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Ejecutar tests
pytest

# Generar migración
alembic revision --autogenerate -m "descripcion"
```

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Build para producción
npm run build

# Ejecutar tests
npm test
```

### Docker (Desarrollo completo)
```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

---

## 📦 Dependencias Principales

### Backend (requirements.txt)
```txt
# Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Database
sqlalchemy==2.0.25
alembic==1.13.1
psycopg2-binary==2.9.9
asyncpg==0.29.0

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# External APIs
openai==1.12.0
httpx==0.26.0
aiohttp==3.9.1

# Utilities
python-dotenv==1.0.0
pillow==10.2.0
redis==5.0.1

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3
pytest-cov==4.1.0
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "typescript": "^5.3.3",
    "axios": "^1.6.5",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.17.9",
    "recharts": "^2.10.3",
    "date-fns": "^3.2.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "tailwindcss": "^3.4.1",
    "@headlessui/react": "^1.7.18",
    "lucide-react": "^0.309.0"
  }
}
```

---

## 🎯 MVP - Archivos Prioritarios a Implementar

### Semana 1-2: Backend Core
1. `backend/app/main.py` - Entry point FastAPI
2. `backend/app/core/config.py` - Configuración
3. `backend/app/core/security.py` - Auth JWT
4. `backend/app/db/session.py` - Database session
5. `backend/app/models/user.py` - Modelo User
6. `backend/app/schemas/user.py` - Schemas User
7. `backend/app/api/v1/auth.py` - Login/Register endpoints
8. `backend/app/services/nutrition_calc.py` - Cálculo TMB/TDEE

### Semana 3-4: Features Core
9. `backend/app/models/meal.py` - Modelo Meal
10. `backend/app/api/v1/meals.py` - CRUD meals
11. `backend/app/services/usda_api.py` - Integración USDA
12. `backend/app/api/v1/nutrition.py` - Dashboard nutrition

### Semana 5-6: Frontend Básico
13. `frontend/src/services/api.ts` - Axios config
14. `frontend/src/pages/Login.tsx`
15. `frontend/src/pages/Dashboard.tsx`
16. `frontend/src/components/dashboard/CaloriesProgress.tsx`
17. `frontend/src/pages/AddMeal.tsx`

---

**Documento creado**: 2026-01-02
**Versión**: 1.0
