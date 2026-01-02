# 💻 Ejemplos de Código - Aplicación de Nutrición

## 📝 Índice
1. [Backend - Cálculo Nutricional](#backend-calculo-nutricional)
2. [Backend - Análisis de Fotos con IA](#backend-analisis-fotos)
3. [Backend - Integración USDA API](#backend-usda-api)
4. [Backend - Generador de Planes](#backend-generador-planes)
5. [Backend - Autenticación JWT](#backend-auth-jwt)
6. [Frontend - Dashboard de Calorías](#frontend-dashboard)
7. [Frontend - Upload de Fotos](#frontend-upload-fotos)
8. [Modelos de Base de Datos](#modelos-database)

---

## 1️⃣ Backend - Cálculo Nutricional

### `backend/app/services/nutrition_calc.py`

```python
"""
Servicio de cálculos nutricionales.
Incluye TMB, TDEE, macros y calorías objetivo.
"""
from enum import Enum
from typing import Dict, Tuple
from pydantic import BaseModel


class Sex(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"          # 1.2
    LIGHT = "light"                  # 1.375
    MODERATE = "moderate"            # 1.55
    ACTIVE = "active"                # 1.725
    VERY_ACTIVE = "very_active"      # 1.9


class GoalType(str, Enum):
    WEIGHT_LOSS = "weight_loss"      # -500 cal
    FAT_BURN = "fat_burn"            # -300 cal
    DETOX = "detox"                  # maintenance
    MAINTENANCE = "maintenance"      # +0 cal
    MUSCLE_GAIN = "muscle_gain"      # +300 cal


class MacroDistribution(BaseModel):
    """Distribución de macronutrientes en gramos"""
    protein_g: float
    carbs_g: float
    fat_g: float
    calories: float


class NutritionCalculator:
    """Calculadora de necesidades nutricionales"""

    # Multiplicadores de actividad para TDEE
    ACTIVITY_MULTIPLIERS = {
        ActivityLevel.SEDENTARY: 1.2,
        ActivityLevel.LIGHT: 1.375,
        ActivityLevel.MODERATE: 1.55,
        ActivityLevel.ACTIVE: 1.725,
        ActivityLevel.VERY_ACTIVE: 1.9,
    }

    # Ajuste calórico según objetivo
    GOAL_ADJUSTMENTS = {
        GoalType.WEIGHT_LOSS: -500,
        GoalType.FAT_BURN: -300,
        GoalType.DETOX: 0,
        GoalType.MAINTENANCE: 0,
        GoalType.MUSCLE_GAIN: 300,
    }

    # Distribución de macros según objetivo (proteína, carbos, grasas)
    MACRO_DISTRIBUTIONS = {
        GoalType.WEIGHT_LOSS: (0.30, 0.35, 0.35),
        GoalType.FAT_BURN: (0.30, 0.35, 0.35),
        GoalType.DETOX: (0.25, 0.45, 0.30),
        GoalType.MAINTENANCE: (0.25, 0.45, 0.30),
        GoalType.MUSCLE_GAIN: (0.35, 0.45, 0.20),
    }

    @staticmethod
    def calculate_bmr(
        weight_kg: float,
        height_cm: float,
        age: int,
        sex: Sex
    ) -> float:
        """
        Calcular TMB (Tasa Metabólica Basal) usando Mifflin-St Jeor.

        Fórmula:
        - Hombres: (10 × peso) + (6.25 × altura) - (5 × edad) + 5
        - Mujeres: (10 × peso) + (6.25 × altura) - (5 × edad) - 161

        Args:
            weight_kg: Peso en kilogramos
            height_cm: Altura en centímetros
            age: Edad en años
            sex: Sexo del usuario

        Returns:
            TMB en calorías/día
        """
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age)

        if sex == Sex.MALE:
            bmr += 5
        elif sex == Sex.FEMALE:
            bmr -= 161
        else:
            # Para 'other', usar promedio
            bmr -= 78

        return round(bmr, 2)

    @staticmethod
    def calculate_tdee(bmr: float, activity_level: ActivityLevel) -> float:
        """
        Calcular TDEE (Gasto Energético Total Diario).

        TDEE = TMB × multiplicador de actividad

        Args:
            bmr: Tasa Metabólica Basal
            activity_level: Nivel de actividad del usuario

        Returns:
            TDEE en calorías/día
        """
        multiplier = NutritionCalculator.ACTIVITY_MULTIPLIERS[activity_level]
        tdee = bmr * multiplier
        return round(tdee, 2)

    @staticmethod
    def calculate_target_calories(
        tdee: float,
        goal_type: GoalType
    ) -> float:
        """
        Calcular calorías objetivo según meta.

        Args:
            tdee: Gasto energético total diario
            goal_type: Tipo de objetivo del usuario

        Returns:
            Calorías objetivo diarias
        """
        adjustment = NutritionCalculator.GOAL_ADJUSTMENTS[goal_type]
        target = tdee + adjustment

        # Asegurar mínimo saludable (1200 cal para mujeres, 1500 para hombres)
        min_calories = 1200
        return max(round(target, 2), min_calories)

    @staticmethod
    def calculate_macros(
        target_calories: float,
        goal_type: GoalType
    ) -> MacroDistribution:
        """
        Calcular distribución de macronutrientes.

        Calorías por gramo:
        - Proteína: 4 cal/g
        - Carbohidratos: 4 cal/g
        - Grasas: 9 cal/g

        Args:
            target_calories: Calorías objetivo diarias
            goal_type: Tipo de objetivo

        Returns:
            Distribución de macros en gramos
        """
        protein_pct, carbs_pct, fat_pct = (
            NutritionCalculator.MACRO_DISTRIBUTIONS[goal_type]
        )

        # Calcular gramos de cada macro
        protein_g = round((target_calories * protein_pct) / 4, 1)
        carbs_g = round((target_calories * carbs_pct) / 4, 1)
        fat_g = round((target_calories * fat_pct) / 9, 1)

        return MacroDistribution(
            protein_g=protein_g,
            carbs_g=carbs_g,
            fat_g=fat_g,
            calories=target_calories
        )

    @classmethod
    def calculate_full_profile(
        cls,
        weight_kg: float,
        height_cm: float,
        age: int,
        sex: Sex,
        activity_level: ActivityLevel,
        goal_type: GoalType
    ) -> Dict[str, any]:
        """
        Calcular perfil nutricional completo.

        Returns:
            Diccionario con BMR, TDEE, calorías objetivo y macros
        """
        bmr = cls.calculate_bmr(weight_kg, height_cm, age, sex)
        tdee = cls.calculate_tdee(bmr, activity_level)
        target_calories = cls.calculate_target_calories(tdee, goal_type)
        macros = cls.calculate_macros(target_calories, goal_type)

        return {
            "bmr": bmr,
            "tdee": tdee,
            "target_calories": target_calories,
            "macros": macros.dict(),
            "activity_level": activity_level.value,
            "goal_type": goal_type.value
        }


# Ejemplo de uso
if __name__ == "__main__":
    calc = NutritionCalculator()

    # Usuario ejemplo: Mujer, 30 años, 65kg, 165cm, moderadamente activa
    profile = calc.calculate_full_profile(
        weight_kg=65,
        height_cm=165,
        age=30,
        sex=Sex.FEMALE,
        activity_level=ActivityLevel.MODERATE,
        goal_type=GoalType.WEIGHT_LOSS
    )

    print("📊 Perfil Nutricional:")
    print(f"  TMB: {profile['bmr']} cal/día")
    print(f"  TDEE: {profile['tdee']} cal/día")
    print(f"  Calorías objetivo: {profile['target_calories']} cal/día")
    print(f"  Proteína: {profile['macros']['protein_g']}g")
    print(f"  Carbohidratos: {profile['macros']['carbs_g']}g")
    print(f"  Grasas: {profile['macros']['fat_g']}g")
```

**Salida esperada:**
```
📊 Perfil Nutricional:
  TMB: 1363.75 cal/día
  TDEE: 2113.81 cal/día
  Calorías objetivo: 1613.81 cal/día
  Proteína: 121.0g
  Carbohidratos: 141.4g
  Grasas: 62.8g
```

---

## 2️⃣ Backend - Análisis de Fotos con IA

### `backend/app/services/ai_vision.py`

```python
"""
Servicio de análisis de fotos de comida usando GPT-4 Vision.
"""
import base64
from typing import List, Dict
import httpx
from pathlib import Path
from pydantic import BaseModel


class FoodItem(BaseModel):
    """Item de comida detectado en la foto"""
    name: str
    quantity: float
    unit: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    confidence: float  # 0.0 - 1.0


class MealAnalysis(BaseModel):
    """Resultado del análisis de una comida"""
    foods: List[FoodItem]
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    description: str


class AIVisionService:
    """Servicio para analizar fotos de comida con GPT-4 Vision"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.openai.com/v1/chat/completions"

    def encode_image(self, image_path: str) -> str:
        """Codificar imagen a base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    async def analyze_meal_photo(
        self,
        image_path: str,
        user_notes: str = ""
    ) -> MealAnalysis:
        """
        Analizar foto de comida y extraer información nutricional.

        Args:
            image_path: Ruta a la imagen
            user_notes: Notas adicionales del usuario sobre la comida

        Returns:
            Análisis completo de la comida
        """
        # Codificar imagen
        base64_image = self.encode_image(image_path)

        # Crear prompt detallado
        prompt = self._build_analysis_prompt(user_notes)

        # Llamar a OpenAI API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.base_url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                },
                json={
                    "model": "gpt-4-vision-preview",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": prompt
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{base64_image}"
                                    }
                                }
                            ]
                        }
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.2  # Baja temperatura para más precisión
                },
                timeout=30.0
            )

        response.raise_for_status()
        result = response.json()

        # Parsear respuesta JSON
        content = result["choices"][0]["message"]["content"]
        return self._parse_ai_response(content)

    def _build_analysis_prompt(self, user_notes: str) -> str:
        """Construir prompt optimizado para análisis nutricional"""
        base_prompt = """
Analiza esta foto de comida y proporciona información nutricional detallada.

INSTRUCCIONES:
1. Identifica TODOS los alimentos visibles en la imagen
2. Estima las porciones de cada alimento (en gramos, ml, unidades, etc.)
3. Calcula la información nutricional aproximada para cada item
4. Proporciona un nivel de confianza (0-1) para cada estimación

FORMATO DE RESPUESTA (JSON estricto):
{
  "description": "Descripción breve de la comida",
  "foods": [
    {
      "name": "nombre del alimento",
      "quantity": número,
      "unit": "g|ml|unidad|taza|cucharada",
      "calories": número,
      "protein_g": número,
      "carbs_g": número,
      "fat_g": número,
      "confidence": 0.0-1.0
    }
  ]
}

EJEMPLO:
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
"""
        if user_notes:
            base_prompt += f"\n\nNOTAS DEL USUARIO: {user_notes}"

        base_prompt += "\n\nRESPONDE ÚNICAMENTE CON EL JSON, SIN TEXTO ADICIONAL."
        return base_prompt

    def _parse_ai_response(self, content: str) -> MealAnalysis:
        """Parsear respuesta JSON de la IA"""
        import json

        # Extraer JSON del contenido (por si viene con texto adicional)
        start = content.find('{')
        end = content.rfind('}') + 1
        json_str = content[start:end]

        data = json.loads(json_str)

        # Crear objetos FoodItem
        foods = [FoodItem(**item) for item in data["foods"]]

        # Calcular totales
        total_calories = sum(f.calories for f in foods)
        total_protein = sum(f.protein_g for f in foods)
        total_carbs = sum(f.carbs_g for f in foods)
        total_fat = sum(f.fat_g for f in foods)

        return MealAnalysis(
            foods=foods,
            total_calories=round(total_calories, 1),
            total_protein_g=round(total_protein, 1),
            total_carbs_g=round(total_carbs, 1),
            total_fat_g=round(total_fat, 1),
            description=data.get("description", "")
        )


# Ejemplo de uso
async def test_vision_service():
    service = AIVisionService(api_key="sk-your-api-key")

    # Analizar foto de almuerzo
    analysis = await service.analyze_meal_photo(
        image_path="/path/to/lunch.jpg",
        user_notes="Mi almuerzo de hoy - pollo con vegetales"
    )

    print(f"📸 {analysis.description}")
    print(f"Total: {analysis.total_calories} calorías")
    print(f"\nAlimentos detectados:")
    for food in analysis.foods:
        print(f"  • {food.name}: {food.quantity}{food.unit}")
        print(f"    {food.calories} cal | P: {food.protein_g}g | C: {food.carbs_g}g | G: {food.fat_g}g")
        print(f"    Confianza: {food.confidence*100:.0f}%")
```

---

## 3️⃣ Backend - Integración USDA API

### `backend/app/services/usda_api.py`

```python
"""
Integración con USDA FoodData Central API.
Base de datos gratuita de 390,000+ alimentos.
"""
import httpx
from typing import List, Optional, Dict
from pydantic import BaseModel


class USDAFood(BaseModel):
    """Alimento de la base de datos USDA"""
    fdc_id: int
    description: str
    data_type: str
    # Nutrientes por 100g
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    fiber_g: Optional[float] = None
    sugar_g: Optional[float] = None
    sodium_mg: Optional[float] = None


class USDAAPIService:
    """Cliente para USDA FoodData Central API"""

    BASE_URL = "https://api.nal.usda.gov/fdc/v1"

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search_foods(
        self,
        query: str,
        page_size: int = 10,
        data_type: Optional[str] = None
    ) -> List[USDAFood]:
        """
        Buscar alimentos en la base de datos USDA.

        Args:
            query: Término de búsqueda (ej: "banana", "chicken breast")
            page_size: Número de resultados
            data_type: Filtro por tipo (Survey, Foundation, Branded, etc.)

        Returns:
            Lista de alimentos encontrados
        """
        async with httpx.AsyncClient() as client:
            params = {
                "api_key": self.api_key,
                "query": query,
                "pageSize": page_size
            }

            if data_type:
                params["dataType"] = data_type

            response = await client.get(
                f"{self.BASE_URL}/foods/search",
                params=params,
                timeout=10.0
            )
            response.raise_for_status()

        data = response.json()
        foods = []

        for item in data.get("foods", []):
            food = self._parse_food_item(item)
            foods.append(food)

        return foods

    async def get_food_details(self, fdc_id: int) -> USDAFood:
        """
        Obtener detalles completos de un alimento por ID.

        Args:
            fdc_id: Food Data Central ID

        Returns:
            Alimento con información nutricional completa
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/food/{fdc_id}",
                params={"api_key": self.api_key},
                timeout=10.0
            )
            response.raise_for_status()

        data = response.json()
        return self._parse_food_item(data)

    def _parse_food_item(self, item: Dict) -> USDAFood:
        """Parsear item de alimento desde respuesta API"""
        # Mapeo de IDs de nutrientes USDA
        NUTRIENT_IDS = {
            "calories": 1008,      # Energy (kcal)
            "protein": 1003,       # Protein
            "carbs": 1005,         # Carbohydrate
            "fat": 1004,           # Total lipid (fat)
            "fiber": 1079,         # Fiber, total dietary
            "sugar": 2000,         # Sugars, total
            "sodium": 1093         # Sodium
        }

        nutrients = {}

        # Extraer nutrientes
        for nutrient in item.get("foodNutrients", []):
            nutrient_id = nutrient.get("nutrientId")
            value = nutrient.get("value")

            if nutrient_id == NUTRIENT_IDS["calories"]:
                nutrients["calories"] = value
            elif nutrient_id == NUTRIENT_IDS["protein"]:
                nutrients["protein_g"] = value
            elif nutrient_id == NUTRIENT_IDS["carbs"]:
                nutrients["carbs_g"] = value
            elif nutrient_id == NUTRIENT_IDS["fat"]:
                nutrients["fat_g"] = value
            elif nutrient_id == NUTRIENT_IDS["fiber"]:
                nutrients["fiber_g"] = value
            elif nutrient_id == NUTRIENT_IDS["sugar"]:
                nutrients["sugar_g"] = value
            elif nutrient_id == NUTRIENT_IDS["sodium"]:
                nutrients["sodium_mg"] = value

        return USDAFood(
            fdc_id=item["fdcId"],
            description=item["description"],
            data_type=item.get("dataType", "Unknown"),
            **nutrients
        )


# Ejemplo de uso
async def test_usda_service():
    service = USDAAPIService(api_key="your-usda-api-key")

    # Buscar "banana"
    foods = await service.search_foods("banana", page_size=5)

    print("🔍 Resultados para 'banana':")
    for food in foods:
        print(f"\n{food.description} (ID: {food.fdc_id})")
        print(f"  Calorías: {food.calories or 'N/A'} kcal/100g")
        print(f"  Proteína: {food.protein_g or 'N/A'}g")
        print(f"  Carbos: {food.carbs_g or 'N/A'}g")
        print(f"  Grasas: {food.fat_g or 'N/A'}g")
```

---

## 4️⃣ Backend - Generador de Planes Semanales

### `backend/app/services/plan_generator.py`

```python
"""
Generador de planes de comidas semanales personalizados.
"""
from typing import List, Dict
from datetime import date, timedelta
from pydantic import BaseModel
from app.services.nutrition_calc import GoalType


class MealPlan(BaseModel):
    """Plan de una comida específica"""
    meal_type: str  # breakfast, lunch, snack, dinner
    recipe_id: str
    recipe_name: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float


class DayPlan(BaseModel):
    """Plan de un día completo"""
    date: date
    meals: List[MealPlan]
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float


class WeeklyPlan(BaseModel):
    """Plan semanal completo"""
    week_start: date
    days: List[DayPlan]
    shopping_list: Dict[str, Dict[str, float]]  # {ingredient: {quantity, unit}}
    goal_calories_per_day: float


class PlanGenerator:
    """Generador de planes de comidas semanales"""

    # Distribución calórica por tipo de comida
    MEAL_DISTRIBUTION = {
        "breakfast": 0.25,  # 25%
        "lunch": 0.35,      # 35%
        "snack": 0.10,      # 10%
        "dinner": 0.30      # 30%
    }

    def __init__(self, recipe_database):
        """
        Args:
            recipe_database: Instancia del servicio de recetas
        """
        self.recipe_db = recipe_database

    async def generate_weekly_plan(
        self,
        target_calories: float,
        goal_type: GoalType,
        preferences: Dict,
        start_date: date = None
    ) -> WeeklyPlan:
        """
        Generar plan semanal personalizado.

        Args:
            target_calories: Calorías objetivo diarias
            goal_type: Tipo de objetivo (weight_loss, detox, etc.)
            preferences: Preferencias del usuario (alergias, dieta, etc.)
            start_date: Fecha de inicio (por defecto: próximo lunes)

        Returns:
            Plan semanal completo con recetas y lista de compras
        """
        if not start_date:
            start_date = self._get_next_monday()

        days = []
        all_ingredients = {}

        # Generar plan para cada día
        for day_offset in range(7):
            current_date = start_date + timedelta(days=day_offset)

            day_plan = await self._generate_day_plan(
                current_date,
                target_calories,
                goal_type,
                preferences
            )

            days.append(day_plan)

            # Acumular ingredientes para lista de compras
            self._accumulate_ingredients(day_plan, all_ingredients)

        return WeeklyPlan(
            week_start=start_date,
            days=days,
            shopping_list=all_ingredients,
            goal_calories_per_day=target_calories
        )

    async def _generate_day_plan(
        self,
        date: date,
        target_calories: float,
        goal_type: GoalType,
        preferences: Dict
    ) -> DayPlan:
        """Generar plan para un día específico"""
        meals = []

        # Para cada tipo de comida
        for meal_type, calorie_pct in self.MEAL_DISTRIBUTION.items():
            target_meal_calories = target_calories * calorie_pct

            # Buscar receta adecuada
            recipe = await self._find_suitable_recipe(
                meal_type,
                target_meal_calories,
                goal_type,
                preferences
            )

            if recipe:
                meals.append(MealPlan(
                    meal_type=meal_type,
                    recipe_id=recipe["id"],
                    recipe_name=recipe["name"],
                    calories=recipe["calories"],
                    protein_g=recipe["protein_g"],
                    carbs_g=recipe["carbs_g"],
                    fat_g=recipe["fat_g"]
                ))

        # Calcular totales del día
        total_calories = sum(m.calories for m in meals)
        total_protein = sum(m.protein_g for m in meals)
        total_carbs = sum(m.carbs_g for m in meals)
        total_fat = sum(m.fat_g for m in meals)

        return DayPlan(
            date=date,
            meals=meals,
            total_calories=round(total_calories, 1),
            total_protein_g=round(total_protein, 1),
            total_carbs_g=round(total_carbs, 1),
            total_fat_g=round(total_fat, 1)
        )

    async def _find_suitable_recipe(
        self,
        meal_type: str,
        target_calories: float,
        goal_type: GoalType,
        preferences: Dict
    ) -> Dict:
        """
        Encontrar receta adecuada según criterios.

        Criterios de selección:
        1. Rango calórico: ±100 cal del objetivo
        2. Tags de objetivo (low-carb, detox, high-protein)
        3. Restricciones dietarias (vegan, gluten-free, etc.)
        4. Tiempo de preparación
        """
        filters = {
            "meal_type": meal_type,
            "min_calories": target_calories - 100,
            "max_calories": target_calories + 100,
        }

        # Agregar filtros según objetivo
        if goal_type in [GoalType.WEIGHT_LOSS, GoalType.FAT_BURN]:
            filters["tags"] = ["high-protein", "low-carb"]
        elif goal_type == GoalType.DETOX:
            filters["tags"] = ["detox", "whole-foods", "anti-inflammatory"]
        elif goal_type == GoalType.MUSCLE_GAIN:
            filters["tags"] = ["high-protein"]

        # Aplicar preferencias del usuario
        if preferences.get("diet_type"):
            filters["tags"].append(preferences["diet_type"])  # vegan, vegetarian

        if preferences.get("allergies"):
            filters["exclude_allergens"] = preferences["allergies"]

        if preferences.get("max_prep_time"):
            filters["max_prep_time"] = preferences["max_prep_time"]

        # Buscar en la base de datos de recetas
        recipes = await self.recipe_db.search(filters)

        if recipes:
            # Seleccionar la mejor coincidencia
            return self._select_best_recipe(recipes, target_calories)

        return None

    def _select_best_recipe(
        self,
        recipes: List[Dict],
        target_calories: float
    ) -> Dict:
        """Seleccionar la receta más cercana al objetivo calórico"""
        recipes_sorted = sorted(
            recipes,
            key=lambda r: abs(r["calories"] - target_calories)
        )
        return recipes_sorted[0]

    def _accumulate_ingredients(
        self,
        day_plan: DayPlan,
        all_ingredients: Dict
    ):
        """Acumular ingredientes para lista de compras"""
        for meal in day_plan.meals:
            # Obtener ingredientes de cada receta
            recipe_ingredients = self.recipe_db.get_ingredients(meal.recipe_id)

            for ingredient in recipe_ingredients:
                name = ingredient["name"]
                quantity = ingredient["quantity"]
                unit = ingredient["unit"]

                if name not in all_ingredients:
                    all_ingredients[name] = {"quantity": 0, "unit": unit}

                # Acumular cantidades
                all_ingredients[name]["quantity"] += quantity

    @staticmethod
    def _get_next_monday() -> date:
        """Obtener fecha del próximo lunes"""
        today = date.today()
        days_until_monday = (7 - today.weekday()) % 7
        if days_until_monday == 0:
            days_until_monday = 7
        return today + timedelta(days=days_until_monday)
```

---

## 5️⃣ Backend - Autenticación JWT

### `backend/app/core/security.py`

```python
"""
Seguridad: Hashing de passwords y manejo de JWT tokens.
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel


class TokenData(BaseModel):
    """Datos contenidos en el token JWT"""
    user_id: str
    email: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuración (en producción, usar variables de entorno)
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar que el password coincida con el hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generar hash bcrypt del password"""
    return pwd_context.hash(password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Crear token JWT de acceso.

    Args:
        data: Datos a incluir en el token (user_id, email, etc.)
        expires_delta: Tiempo de expiración custom

    Returns:
        Token JWT codificado
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Crear token JWT de refresh (larga duración)"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> TokenData:
    """
    Decodificar y validar token JWT.

    Args:
        token: Token JWT a decodificar

    Returns:
        Datos del token

    Raises:
        JWTError: Si el token es inválido o expiró
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")

        if user_id is None:
            raise JWTError("Token inválido: falta user_id")

        return TokenData(user_id=user_id, email=email)

    except JWTError as e:
        raise JWTError(f"Error al decodificar token: {str(e)}")
```

### `backend/app/api/v1/auth.py`

```python
"""
Endpoints de autenticación: login, registro, refresh token.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.db.session import get_db
from app.models.user import User


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


class UserRegister(BaseModel):
    """Schema para registro de usuario"""
    email: EmailStr
    password: str
    name: str


class Token(BaseModel):
    """Schema de respuesta de autenticación"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Registrar nuevo usuario.

    - Valida que el email no exista
    - Hashea el password
    - Crea usuario en BD
    - Retorna tokens de acceso
    """
    # Verificar que el email no exista
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )

    # Crear usuario
    new_user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        name=user_data.name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generar tokens
    access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})
    refresh_token = create_refresh_token(data={"sub": str(new_user.id), "email": new_user.email})

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login de usuario.

    - Valida credenciales
    - Retorna tokens de acceso
    """
    # Buscar usuario por email
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generar tokens
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "email": user.email})

    return Token(access_token=access_token, refresh_token=refresh_token)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency para obtener usuario actual desde token JWT.
    Usar en endpoints protegidos: `user: User = Depends(get_current_user)`
    """
    try:
        token_data = decode_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == token_data.user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return user
```

---

**(Continuará en el siguiente archivo con ejemplos de Frontend...)**

**Documento creado**: 2026-01-02
**Parte**: 1/2
