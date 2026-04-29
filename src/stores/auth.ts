import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import api from '@/services/api'
import type { Empleado, ApiSingleResponse, LoginResponse } from '@/types'

const TOKEN_KEY         = 'auth_token'
const EMPLEADO_KEY      = 'auth_empleado'
const REQUIRES_PW_KEY   = 'auth_requires_pw_change'

export const useAuthStore = defineStore('auth', () => {
  // ── Estado ──────────────────────────────────────────────────────────────────

  const token    = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const empleado = ref<Empleado | null>(
    JSON.parse(localStorage.getItem(EMPLEADO_KEY) ?? 'null'),
  )
  const requiresPasswordChange = ref<boolean>(
    localStorage.getItem(REQUIRES_PW_KEY) === 'true',
  )

  // ── Getters ─────────────────────────────────────────────────────────────────

  const isAuthenticated = computed(() => token.value !== null)

  /** 'administrador' | 'dentista' | 'recepcionista' | '' */
  const rol = computed(() =>
    empleado.value?.tipoEmpleado.nombre.toLowerCase() ?? '',
  )

  const isAdmin         = computed(() => rol.value === 'administrador')
  const isDentista      = computed(() => rol.value === 'dentista')
  const isRecepcionista = computed(() => rol.value === 'recepcionista')

  // ── Acciones ─────────────────────────────────────────────────────────────────

  /** Limpia el estado local sin llamar al backend. Lo usa el interceptor de 401. */
  function clearSession(): void {
    token.value    = null
    empleado.value = null
    requiresPasswordChange.value = false
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMPLEADO_KEY)
    localStorage.removeItem(REQUIRES_PW_KEY)
  }

  function markPasswordChanged(): void {
    requiresPasswordChange.value = false
    localStorage.removeItem(REQUIRES_PW_KEY)
  }

  async function fetchMe(): Promise<void> {
    const { data } = await api.get<ApiSingleResponse<Empleado>>('/me')
    empleado.value = data.data
    localStorage.setItem(EMPLEADO_KEY, JSON.stringify(data.data))
  }

  async function login(usuario: string, contraseña: string): Promise<void> {
    const { data } = await api.post<LoginResponse>('/login', {
      usuario,
      contraseña,
    })

    token.value    = data.token
    empleado.value = data.empleado
    localStorage.setItem(TOKEN_KEY,    data.token)
    localStorage.setItem(EMPLEADO_KEY, JSON.stringify(data.empleado))

    if (data.requiresPasswordChange) {
      requiresPasswordChange.value = true
      localStorage.setItem(REQUIRES_PW_KEY, 'true')
      router.push('/change-password')
    } else {
      requiresPasswordChange.value = false
      router.push('/dashboard')
    }
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/logout')
    } catch {
      // un error de red en logout no debe bloquear al usuario
    } finally {
      clearSession()
      router.push('/login')
    }
  }

  return {
    token,
    empleado,
    requiresPasswordChange,
    isAuthenticated,
    rol,
    isAdmin,
    isDentista,
    isRecepcionista,
    clearSession,
    markPasswordChanged,
    login,
    logout,
    fetchMe,
  }
})
