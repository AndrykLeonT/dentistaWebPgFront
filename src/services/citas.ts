import api from '@/services/api'
import type { Cita, ApiListResponse, ApiSingleResponse } from '@/types'

interface CitaFiltros {
  fecha?: string
  paciente_id?: number
  servicio_id?: number
}

export interface CitaPayload {
  idPersona: number
  idServicio: number
  idEmpleado: number
  fechaProgramada: string
  hora: string
  duracion?: string
  motivo?: string
}

export async function getAll(filters?: CitaFiltros) {
  const res = await api.get<ApiListResponse<Cita>>('/citas', { params: filters })
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Cita>>(`/citas/${id}`)
  return res.data
}

export async function create(data: CitaPayload) {
  const res = await api.post<ApiSingleResponse<Cita>>('/citas', data)
  return res.data
}

export async function update(id: number, data: CitaPayload) {
  const res = await api.put<ApiSingleResponse<Cita>>(`/citas/${id}`, data)
  return res.data
}

export async function cancel(id: number) {
  await api.delete(`/citas/${id}`)
}
