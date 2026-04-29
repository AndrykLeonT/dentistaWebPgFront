import api from '@/services/api'
import type { Persona, ApiListResponse, ApiSingleResponse } from '@/types'

export async function getAll(search?: string) {
  const res = await api.get<ApiListResponse<Persona>>('/personas', {
    params: search ? { search } : undefined,
  })
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Persona>>(`/personas/${id}`)
  return res.data
}

export async function create(data: Partial<Persona>) {
  const res = await api.post<ApiSingleResponse<Persona>>('/personas', data)
  return res.data
}

export async function update(id: number, data: Partial<Persona>) {
  const res = await api.put<ApiSingleResponse<Persona>>(`/personas/${id}`, data)
  return res.data
}

/** Eliminación lógica: el backend establece estado = 0. */
export async function remove(id: number) {
  const res = await api.delete<ApiSingleResponse<Persona>>(`/personas/${id}`)
  return res.data
}
