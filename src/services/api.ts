import axios from 'axios'
import router from '@/router'

export const TOKEN_KEY = 'auth_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
})

// ── Request: adjuntar token ───────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: manejar errores de autenticación ────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token inválido o expirado: limpiar sesión y redirigir
      localStorage.removeItem(TOKEN_KEY)
      router.push('/login')
    }

    // 403 se propaga al caller para que muestre feedback contextual (toast, etc.)
    return Promise.reject(error)
  },
)

export default api
