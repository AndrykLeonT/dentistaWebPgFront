import api from '@/services/api'
import type {
  Empleado,
  ApiSingleResponse,
  LoginResponse,
  RecoverPasswordKeywordPayload,
  RecoverPasswordKeywordResponse,
} from '@/types'

export async function login(correoElectronico: string, password: string) {
  const res = await api.post<LoginResponse>('/login', { usuario: correoElectronico, 'contraseña': password })
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
  current_password: string,
  new_password: string,
  new_password_confirmation: string,
) {
  const res = await api.post('/change-password', {
    current_password,
    new_password,
    new_password_confirmation,
  })
  return res.data
}

export async function recoverPasswordByKeyword(payload: RecoverPasswordKeywordPayload) {
  const res = await api.post<RecoverPasswordKeywordResponse>('/recover-password-keyword', payload)
  return res.data
}
