import api from '@/services/api'
import type { Empleado, ApiSingleResponse, LoginResponse } from '@/types'

export async function login(usuario: string, contraseña: string) {
  const res = await api.post<{ data: LoginResponse }>('/login', { usuario, contraseña })
  return res.data
}

export async function logout() {
  const res = await api.post('/logout')
  return res.data
}

export async function fetchMe() {
  const res = await api.get<ApiSingleResponse<Empleado>>('/me')
  return res.data
}

export async function changePassword(
  contraseñaActual: string,
  nuevaContraseña: string,
  nuevaContraseña_confirmation: string,
) {
  const res = await api.post('/change-password', {
    contraseñaActual,
    nuevaContraseña,
    nuevaContraseña_confirmation,
  })
  return res.data
}
