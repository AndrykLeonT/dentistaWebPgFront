import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// ── Request: inyectar token desde el store ────────────────────────────────────

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

// ── Response: manejo global de errores de auth ────────────────────────────────

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status

    // Saltar si es el endpoint de login: dejar que LoginView muestre el error de credenciales
    if (status === 401 && !error.config?.url?.endsWith('/login')) {
      useAuthStore().clearSession()
      router.push('/login')
    }

    if (status === 403) {
      router.push('/forbidden')
    }

    return Promise.reject(error)
  },
)

export default api
