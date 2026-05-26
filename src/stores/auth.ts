import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import api, { TOKEN_KEY } from '@/services/api'
import type { Empleado, ApiSingleResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // ── Estado ──────────────────────────────────────────────────────────────────

  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const empleado = ref<Empleado | null>(null)

  // ── Getters ─────────────────────────────────────────────────────────────────

  const isAuthenticated = computed(() => token.value !== null)
  const isAdmin = computed(() => empleado.value?.tipo === 'Administrador')
  const isDentista = computed(() => empleado.value?.tipo === 'Dentista')
  const isRecepcionista = computed(() => empleado.value?.tipo === 'Recepcionista')

  // ── Acciones ─────────────────────────────────────────────────────────────────

  async function fetchMe(): Promise<void> {
    const { data } = await api.get<ApiSingleResponse<Empleado>>('/me')
    empleado.value = data.data
  }

  async function login(correo: string, password: string): Promise<void> {
    const { data } = await api.post<{ data: { token: string } }>('/auth/login', {
      correo,
      password,
    })
    token.value = data.data.token
    localStorage.setItem(TOKEN_KEY, data.data.token)
    await fetchMe()
    router.push('/dashboard')
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // un error de red en logout no debe bloquear al usuario
    } finally {
      token.value = null
      empleado.value = null
      localStorage.removeItem(TOKEN_KEY)
      router.push('/login')
    }
  }

  return {
    token,
    empleado,
    isAuthenticated,
    isAdmin,
    isDentista,
    isRecepcionista,
    login,
    logout,
    fetchMe,
  }
})
