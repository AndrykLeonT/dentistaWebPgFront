import api from '@/services/api'
import type { 
  ProductoInventario, 
  MovimientoInventario, 
  ConsumoServicio,
  StoreConsumoServicioPayload,
  ApiListResponse, 
  ApiSingleResponse 
} from '@/types'

// ─── PRODUCTOS ───────────────────────────────────────────────────────────────

export async function getProductos() {
  const res = await api.get<ApiListResponse<ProductoInventario>>('/inventario/productos')
  return res.data
}

export async function getProductoById(id: number) {
  const res = await api.get<ApiSingleResponse<ProductoInventario>>(`/inventario/productos/${id}`)
  return res.data
}

export async function createProducto(data: {
  nombre: string
  unidadMedida: string
  stockInicial: number
  descripcion?: string
}) {
  const res = await api.post<ApiSingleResponse<ProductoInventario>>('/inventario/productos', data)
  return res.data
}

export async function updateProducto(id: number, data: {
  nombre?: string
  unidadMedida?: string
  descripcion?: string
}) {
  const res = await api.put<ApiSingleResponse<ProductoInventario>>(`/inventario/productos/${id}`, data)
  return res.data
}

export async function removeProducto(id: number) {
  const res = await api.delete<void>(`/inventario/productos/${id}`)
  return res.data
}

// ─── MOVIMIENTOS ─────────────────────────────────────────────────────────────

export async function getMovimientos() {
  const res = await api.get<ApiListResponse<MovimientoInventario>>('/inventario/movimientos')
  return res.data
}

export async function createMovimiento(data: {
  idProductoInventario: number
  tipoMovimiento: 'entrada' | 'salida' | 'ajuste'
  cantidad: number
  motivo?: string
}) {
  const res = await api.post<ApiSingleResponse<MovimientoInventario>>('/inventario/movimientos', data)
  return res.data
}

export async function getConsumosServicio() {
  const res = await api.get<ApiListResponse<ConsumoServicio>>('/inventario/consumos-servicio')
  return res.data
}

export async function createConsumoServicio(data: StoreConsumoServicioPayload) {
  const res = await api.post<ApiSingleResponse<ConsumoServicio>>('/inventario/consumos-servicio', data)
  return res.data
}

export async function updateConsumoServicio(id: number, data: Partial<StoreConsumoServicioPayload>) {
  const res = await api.put<ApiSingleResponse<ConsumoServicio>>(`/inventario/consumos-servicio/${id}`, data)
  return res.data
}

export async function removeConsumoServicio(id: number) {
  const res = await api.delete<void>(`/inventario/consumos-servicio/${id}`)
  return res.data
}

export async function consumirInventarioCita(idCita: number) {
  const res = await api.post<{ message: string; movimientos: MovimientoInventario[] }>(
    `/citas/${idCita}/consumir-inventario`,
    { confirmar: true },
  )
  return res.data
}
