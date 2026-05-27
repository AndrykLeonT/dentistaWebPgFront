import api from '@/services/api'
import type { Comprobante, ApiListResponse, ApiSingleResponse } from '@/types'

export async function getAll() {
  const res = await api.get<ApiListResponse<Comprobante>>('/comprobantes')
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Comprobante>>(`/comprobantes/${id}`)
  return res.data
}

export async function create(data: { idPago: number; observaciones?: string }) {
  const res = await api.post<ApiSingleResponse<Comprobante>>('/comprobantes', data)
  return res.data
}

export async function remove(id: number) {
  const res = await api.delete<void>(`/comprobantes/${id}`)
  return res.data
}
