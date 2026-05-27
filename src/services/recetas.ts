import api from '@/services/api'
import type { Receta, ApiListResponse, ApiSingleResponse } from '@/types'

export async function getAll() {
  const res = await api.get<ApiListResponse<Receta>>('/recetas')
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Receta>>(`/recetas/${id}`)
  return res.data
}

export async function create(data: { idCita: number; indicaciones: string }) {
  const res = await api.post<ApiSingleResponse<Receta>>('/recetas', data)
  return res.data
}

export async function update(id: number, data: Partial<{ indicaciones: string }>) {
  const res = await api.put<ApiSingleResponse<Receta>>(`/recetas/${id}`, data)
  return res.data
}
