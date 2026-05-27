import api from '@/services/api'
import type { Cita, ApiListResponse, ApiSingleResponse } from '@/types'

interface CitaFiltros {
  fecha?:       string  // YYYY-MM-DD
  paciente_id?: number
  servicio_id?: number
}

export async function getAll(filters?: CitaFiltros) {
  const res = await api.get<ApiListResponse<Cita>>('/citas', { params: filters })
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Cita>>(`/citas/${id}`)
  return res.data
}

export async function create(data: Record<string, unknown>) {
  const res = await api.post<ApiSingleResponse<Cita>>('/citas', data)
  return res.data
}

export async function update(id: number, data: Record<string, unknown>) {
  const res = await api.put<ApiSingleResponse<Cita>>(`/citas/${id}`, data)
  return res.data
}

/** Cancelación lógica de la cita. */
export async function cancel(id: number) {
  const res = await api.delete<ApiSingleResponse<Cita>>(`/citas/${id}`)
  return res.data
}
