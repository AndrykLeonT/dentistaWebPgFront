import api from '@/services/api'
import type { Pago, ApiListResponse, ApiSingleResponse } from '@/types'

export async function getAll() {
  const res = await api.get<ApiListResponse<Pago>>('/pagos')
  return res.data
}

export async function getById(id: number) {
  const res = await api.get<ApiSingleResponse<Pago>>(`/pagos/${id}`)
  return res.data
}

/**
 * Registrar un pago.
 * idEmpleado e idCorte los asigna el backend automáticamente.
 */
export async function create(data: {
  idPersona: number
  total:     number
  efectivo:  number
  tarjeta:   number
}) {
  const res = await api.post<ApiSingleResponse<Pago>>('/pagos', data)
  return res.data
}
