# 💻 Ejemplos de Frontend - Aplicación de Nutrición

## Índice - Parte 2
1. [Dashboard de Calorías (React)](#dashboard-calorias)
2. [Upload de Fotos](#upload-fotos)
3. [Formulario de Comidas](#formulario-comidas)
4. [Gráficos de Progreso](#graficos-progreso)
5. [Plan Semanal](#plan-semanal)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Servicios API](#servicios-api)

---

## 1️⃣ Dashboard de Calorías (React)

### `frontend/src/pages/Dashboard.tsx`

```typescript
/**
 * Dashboard principal con resumen nutricional del día
 */
import React, { useEffect } from 'react';
import { useMeals } from '../hooks/useMeals';
import { useUser } from '../hooks/useUser';
import CaloriesProgress from '../components/dashboard/CaloriesProgress';
import MacrosChart from '../components/dashboard/MacrosChart';
import DailyMeals from '../components/dashboard/DailyMeals';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const { user } = useUser();
  const { meals, isLoading, fetchMealsByDate } = useMeals();
  const today = new Date();

  useEffect(() => {
    fetchMealsByDate(today);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Calcular totales del día
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.total_calories,
      protein: acc.protein + meal.protein_g,
      carbs: acc.carbs + meal.carbs_g,
      fat: acc.fat + meal.fat_g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Obtener objetivo del usuario
  const targetCalories = user?.target_calories || 2000;
  const targetMacros = user?.macros || {
    protein_g: 150,
    carbs_g: 200,
    fat_g: 65,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Hola, {user?.name} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {format(today, "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Progreso de calorías */}
        <CaloriesProgress
          current={totals.calories}
          target={targetCalories}
        />

        {/* Macronutrientes */}
        <MacrosChart
          current={{
            protein: totals.protein,
            carbs: totals.carbs,
            fat: totals.fat,
          }}
          target={targetMacros}
        />

        {/* Comidas del día */}
        <DailyMeals meals={meals} />

        {/* Botón agregar comida */}
        <button
          onClick={() => window.location.href = '/add-meal'}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

### `frontend/src/components/dashboard/CaloriesProgress.tsx`

```typescript
/**
 * Componente de progreso de calorías con barra visual
 */
import React from 'react';

interface Props {
  current: number;
  target: number;
}

export default function CaloriesProgress({ current, target }: Props) {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);

  // Determinar color según progreso
  let colorClass = 'bg-green-500';
  if (percentage > 100) colorClass = 'bg-red-500';
  else if (percentage > 90) colorClass = 'bg-yellow-500';

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {Math.round(current)} <span className="text-base text-gray-500">/ {target} cal</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {remaining > 0 ? `Quedan ${Math.round(remaining)} calorías` : 'Objetivo alcanzado!'}
          </p>
        </div>
        <div className="text-4xl">
          {percentage < 50 ? '😋' : percentage < 90 ? '😊' : percentage <= 100 ? '✅' : '🚫'}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Porcentaje */}
      <div className="text-center mt-2 text-sm font-medium text-gray-700">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
```

### `frontend/src/components/dashboard/MacrosChart.tsx`

```typescript
/**
 * Gráfico de macronutrientes (proteína, carbos, grasas)
 */
import React from 'react';

interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface Props {
  current: Macros;
  target: Macros;
}

export default function MacrosChart({ current, target }: Props) {
  const macros = [
    {
      name: 'Proteína',
      current: current.protein,
      target: target.protein_g,
      color: 'bg-blue-500',
      emoji: '🥩',
    },
    {
      name: 'Carbohidratos',
      current: current.carbs,
      target: target.carbs_g,
      color: 'bg-yellow-500',
      emoji: '🍞',
    },
    {
      name: 'Grasas',
      current: current.fat,
      target: target.fat_g,
      color: 'bg-purple-500',
      emoji: '🥑',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Macronutrientes
      </h3>

      <div className="space-y-4">
        {macros.map((macro) => {
          const percentage = Math.min((macro.current / macro.target) * 100, 100);

          return (
            <div key={macro.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{macro.emoji}</span>
                  <span className="font-medium text-gray-700">{macro.name}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(macro.current)}g / {macro.target}g
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${macro.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 2️⃣ Upload de Fotos

### `frontend/src/components/meals/PhotoUpload.tsx`

```typescript
/**
 * Componente para subir fotos de comidas y analizarlas con IA
 */
import React, { useState, useRef } from 'react';
import { mealService } from '../../services/mealService';

interface Props {
  onAnalysisComplete: (analysis: any) => void;
}

export default function PhotoUpload({ onAnalysisComplete }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es muy grande. Máximo 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Subir foto y obtener análisis
      const analysis = await mealService.analyzePhoto(selectedFile);
      onAnalysisComplete(analysis);
    } catch (err: any) {
      setError(err.message || 'Error al analizar la foto');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Área de upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition"
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Haz click para subir</span> o arrastra una foto
            </p>
            <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Botón analizar */}
      {selectedFile && (
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analizando...
            </span>
          ) : (
            '📸 Analizar comida'
          )}
        </button>
      )}
    </div>
  );
}
```

---

## 3️⃣ Formulario de Comidas

### `frontend/src/pages/AddMeal.tsx`

```typescript
/**
 * Página para agregar comidas (foto, descripción o manual)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoUpload from '../components/meals/PhotoUpload';
import RecipeInput from '../components/meals/RecipeInput';
import ManualEntry from '../components/meals/ManualEntry';
import { mealService } from '../services/mealService';

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export default function AddMeal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'photo' | 'recipe' | 'manual'>('photo');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'photo', label: '📸 Foto', icon: '📷' },
    { id: 'recipe', label: '📝 Descripción', icon: '✍️' },
    { id: 'manual', label: '⌨️ Manual', icon: '📋' },
  ];

  const mealTypes = [
    { id: 'breakfast', label: 'Desayuno', icon: '🌅' },
    { id: 'lunch', label: 'Almuerzo', icon: '☀️' },
    { id: 'snack', label: 'Merienda', icon: '🍎' },
    { id: 'dinner', label: 'Cena', icon: '🌙' },
  ];

  const handleSaveMeal = async () => {
    if (!analysis) return;

    setIsSaving(true);
    try {
      await mealService.createMeal({
        meal_type: mealType,
        date: new Date().toISOString().split('T')[0],
        ...analysis,
      });

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al guardar comida:', error);
      alert('Error al guardar la comida');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Agregar Comida
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Selector de tipo de comida */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Tipo de comida</h3>
          <div className="grid grid-cols-4 gap-3">
            {mealTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setMealType(type.id as MealType)}
                className={`p-3 rounded-lg border-2 transition ${
                  mealType === type.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'photo' && (
              <PhotoUpload onAnalysisComplete={setAnalysis} />
            )}
            {activeTab === 'recipe' && (
              <RecipeInput onAnalysisComplete={setAnalysis} />
            )}
            {activeTab === 'manual' && (
              <ManualEntry onAnalysisComplete={setAnalysis} />
            )}
          </div>
        </div>

        {/* Resumen del análisis */}
        {analysis && (
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Resumen Nutricional
            </h3>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(analysis.total_calories)}
                </div>
                <div className="text-sm text-gray-600">Calorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(analysis.total_protein_g)}g
                </div>
                <div className="text-sm text-gray-600">Proteína</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(analysis.total_carbs_g)}g
                </div>
                <div className="text-sm text-gray-600">Carbos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(analysis.total_fat_g)}g
                </div>
                <div className="text-sm text-gray-600">Grasas</div>
              </div>
            </div>

            {/* Lista de alimentos */}
            {analysis.foods && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Alimentos detectados:</h4>
                <div className="space-y-2">
                  {analysis.foods.map((food: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-gray-700">
                        {food.name} ({food.quantity}{food.unit})
                      </span>
                      <span className="text-gray-600 text-sm">
                        {Math.round(food.calories)} cal
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón guardar */}
            <button
              onClick={handleSaveMeal}
              disabled={isSaving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg mt-6 transition"
            >
              {isSaving ? 'Guardando...' : '✅ Guardar comida'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 4️⃣ Gráficos de Progreso

### `frontend/src/components/progress/WeightChart.tsx`

```typescript
/**
 * Gráfico de evolución del peso
 */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeightLog {
  date: string;
  weight_kg: number;
}

interface Props {
  data: WeightLog[];
  targetWeight: number;
}

export default function WeightChart({ data, targetWeight }: Props) {
  // Formatear datos para el gráfico
  const chartData = data.map((log) => ({
    date: format(parseISO(log.date), 'dd/MM', { locale: es }),
    peso: log.weight_kg,
    objetivo: targetWeight,
  }));

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Evolución del Peso
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="peso"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
            name="Peso actual"
          />
          <Line
            type="monotone"
            dataKey="objetivo"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Objetivo"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
        <div>
          <div className="text-sm text-gray-600">Peso inicial</div>
          <div className="text-xl font-bold text-gray-900">
            {data[0]?.weight_kg.toFixed(1)} kg
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Peso actual</div>
          <div className="text-xl font-bold text-green-600">
            {data[data.length - 1]?.weight_kg.toFixed(1)} kg
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Diferencia</div>
          <div className="text-xl font-bold text-blue-600">
            {(data[0]?.weight_kg - data[data.length - 1]?.weight_kg).toFixed(1)} kg
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 5️⃣ Hooks Personalizados

### `frontend/src/hooks/useMeals.ts`

```typescript
/**
 * Hook para gestionar comidas
 */
import { useState, useCallback } from 'react';
import { mealService } from '../services/mealService';

interface Meal {
  id: string;
  date: string;
  meal_type: string;
  name: string;
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMealsByDate = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const dateStr = date.toISOString().split('T')[0];
      const data = await mealService.getMealsByDate(dateStr);
      setMeals(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar comidas');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMeal = useCallback(async (mealData: Partial<Meal>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newMeal = await mealService.createMeal(mealData);
      setMeals((prev) => [...prev, newMeal]);
      return newMeal;
    } catch (err: any) {
      setError(err.message || 'Error al crear comida');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMeal = useCallback(async (mealId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await mealService.deleteMeal(mealId);
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar comida');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    meals,
    isLoading,
    error,
    fetchMealsByDate,
    createMeal,
    deleteMeal,
  };
}
```

---

## 6️⃣ Servicios API

### `frontend/src/services/api.ts`

```typescript
/**
 * Cliente HTTP configurado con Axios
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de Axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, intentar refresh
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Reintentar request original
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return axios(error.config);
        } catch {
          // Refresh falló, redirigir a login
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        // No hay refresh token, redirigir a login
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### `frontend/src/services/mealService.ts`

```typescript
/**
 * Servicio para operaciones con comidas
 */
import api from './api';

interface MealData {
  meal_type: string;
  date: string;
  name?: string;
  description?: string;
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  foods?: any[];
}

export const mealService = {
  /**
   * Obtener comidas por fecha
   */
  async getMealsByDate(date: string) {
    const response = await api.get(`/meals`, {
      params: { date },
    });
    return response.data;
  },

  /**
   * Crear nueva comida
   */
  async createMeal(data: Partial<MealData>) {
    const response = await api.post('/meals', data);
    return response.data;
  },

  /**
   * Analizar foto de comida
   */
  async analyzePhoto(file: File, notes: string = '') {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('notes', notes);

    const response = await api.post('/photos/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Analizar receta en texto
   */
  async analyzeRecipe(description: string) {
    const response = await api.post('/recipes/parse', {
      description,
    });
    return response.data;
  },

  /**
   * Eliminar comida
   */
  async deleteMeal(mealId: string) {
    await api.delete(`/meals/${mealId}`);
  },
};
```

---

## 7️⃣ Store con Zustand

### `frontend/src/store/userStore.ts`

```typescript
/**
 * Store global para datos de usuario
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  target_calories: number;
  macros: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  goal_type: string;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () => {
        localStorage.clear();
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
```

---

## 🎯 Resumen de Componentes

### Componentes Creados
- ✅ `Dashboard.tsx` - Pantalla principal
- ✅ `CaloriesProgress.tsx` - Barra de progreso de calorías
- ✅ `MacrosChart.tsx` - Gráfico de macronutrientes
- ✅ `PhotoUpload.tsx` - Upload y análisis de fotos
- ✅ `AddMeal.tsx` - Formulario de agregar comidas
- ✅ `WeightChart.tsx` - Gráfico de evolución de peso
- ✅ `useMeals.ts` - Hook de comidas
- ✅ `api.ts` - Cliente HTTP con interceptors
- ✅ `mealService.ts` - Servicio de comidas
- ✅ `userStore.ts` - Store global de usuario

### Próximos Pasos
1. Implementar componente de plan semanal
2. Agregar notificaciones push
3. Crear página de configuración
4. Implementar modo offline
5. Agregar tests unitarios

---

**Documento creado**: 2026-01-02
**Versión**: 1.0
