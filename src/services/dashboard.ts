import api from '@/services/api'
import type { DashboardResumen } from '@/types'

export async function getResumen() {
  const res = await api.get<DashboardResumen>('/dashboard/resumen')
  return res.data
}
