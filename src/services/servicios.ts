import api from '@/services/api'
import type { Servicio, ClaseServicio, ApiListResponse, ApiSingleResponse } from '@/types'

// ── Servicios ─────────────────────────────────────────────────────────────────

export async function getAll() {
  const res = await api.get<ApiListResponse<Servicio>>('/servicios')
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Servicio>>(`/servicios/${id}`)
  return res.data
}

export async function create(data: Partial<Servicio>) {
  const res = await api.post<ApiSingleResponse<Servicio>>('/servicios', data)
  return res.data
}

export async function update(id: number, data: Partial<Servicio>) {
  const res = await api.put<ApiSingleResponse<Servicio>>(`/servicios/${id}`, data)
  return res.data
}

export async function remove(id: number) {
  const res = await api.delete<ApiSingleResponse<Servicio>>(`/servicios/${id}`)
  return res.data
}

// ── Clases de servicio ────────────────────────────────────────────────────────

export async function getClases() {
  const res = await api.get<ApiListResponse<ClaseServicio>>('/clases-servicio')
  return res.data
}

export async function createClase(data: { nombre: string }) {
  const res = await api.post<ApiSingleResponse<ClaseServicio>>('/clases-servicio', data)
  return res.data
}
