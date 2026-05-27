import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

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

    const authPublicEndpoints = ['/login', '/recover-password-keyword']

    // Saltar endpoints publicos de auth: cada vista muestra su error de credenciales o palabra clave.
    if (
      status === 401 &&
      !authPublicEndpoints.some((endpoint) => error.config?.url?.endsWith(endpoint))
    ) {
      useAuthStore().clearSession()
      router.push('/login')
    }

    if (status === 403) {
      toast.error('No tienes los permisos necesarios.')
      if (error.config?.method === 'get') {
        router.push('/forbidden')
      }
    }

    return Promise.reject(error)
  },
)

export default api
