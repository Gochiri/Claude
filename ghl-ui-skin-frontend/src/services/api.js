import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// Styles API
export const stylesAPI = {
  get: () => api.get('/styles'),
  update: (data) => api.put('/styles', data),
}

// Subaccounts API
export const subaccountsAPI = {
  list: () => api.get('/subaccounts'),
  create: (data) => api.post('/subaccounts', data),
  getFeatureLocks: (id) => api.get(`/subaccounts/${id}/feature-locks`),
  updateFeatureLocks: (id, data) => api.put(`/subaccounts/${id}/feature-locks`, data),
}

export default api
