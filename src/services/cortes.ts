import api from '@/services/api'
import type { Corte, ApiListResponse, ApiSingleResponse } from '@/types'

export async function getAll() {
  const res = await api.get<ApiListResponse<Corte>>('/cortes')
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Corte>>(`/cortes/${id}`)
  return res.data
}

/**
 * Devuelve el corte actualmente abierto.
 * Lanza un error 404 si no hay ningún corte abierto.
 */
export async function getActivo() {
  const res = await api.get<ApiSingleResponse<Corte>>('/cortes/activo')
  return res.data
}

/** Abrir un nuevo corte de caja. */
export async function create(data: { fDeCaja: string }) {
  const res = await api.post<ApiSingleResponse<Corte>>('/cortes', data)
  return res.data
}

/** Cerrar un corte de caja existente. */
export async function close(id: number, data: { fechaFin: string }) {
  const res = await api.put<ApiSingleResponse<Corte>>(`/cortes/${id}`, data)
  return res.data
}
