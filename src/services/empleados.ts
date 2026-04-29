import api from '@/services/api'
import type { Empleado, ApiListResponse, ApiSingleResponse } from '@/types'

export async function getAll() {
  const res = await api.get<ApiListResponse<Empleado>>('/empleados')
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Empleado>>(`/empleados/${id}`)
  return res.data
}

export async function create(data: Record<string, unknown>) {
  const res = await api.post<ApiSingleResponse<Empleado>>('/empleados', data)
  return res.data
}

export async function update(id: number, data: Record<string, unknown>) {
  const res = await api.put<ApiSingleResponse<Empleado>>(`/empleados/${id}`, data)
  return res.data
}

/** Desactivación lógica del empleado. */
export async function remove(id: number) {
  const res = await api.delete<ApiSingleResponse<Empleado>>(`/empleados/${id}`)
  return res.data
}

export async function resetPassword(
  id: number,
  data: { nuevaContraseña: string; nuevaContraseña_confirmation: string },
) {
  const res = await api.post<ApiSingleResponse<void>>(`/empleados/${id}/reset-password`, data)
  return res.data
}
