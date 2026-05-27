<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-blue-950 text-3xl font-normal">Dashboard</h1>
      <p class="text-slate-600 text-sm mt-1">
        Resumen de actividad del consultorio · {{ fechaHoy }}
      </p>
    </div>

    <div v-if="loading" class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 p-8 text-center text-slate-500">
      Cargando resumen del consultorio...
    </div>

    <div v-else-if="error" class="bg-amber-50 rounded-xl outline outline-[0.80px] outline-amber-300 p-5 text-amber-800 text-sm">
      {{ error }}
    </div>

    <template v-else-if="resumen">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="card in summaryCards"
          :key="card.title"
          class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 p-6 flex flex-col gap-3"
        >
          <div class="flex justify-between items-center">
            <span class="text-slate-600 text-sm font-medium">{{ card.title }}</span>
            <component :is="card.icon" :class="['w-4 h-4', card.iconColor]" />
          </div>
          <div>
            <p class="text-blue-950 text-2xl font-normal">{{ card.value }}</p>
            <p class="text-slate-600 text-xs mt-1">{{ card.subtitle }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <div class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 p-6">
          <div class="mb-4">
            <div class="flex items-center gap-2">
              <CalendarDays class="w-5 h-5 text-blue-500" />
              <h2 class="text-blue-950 text-base font-medium">Citas proximas</h2>
            </div>
            <p class="text-slate-600 text-sm mt-1">Informacion enviada por backend</p>
          </div>

          <div v-if="resumen.citasProximas.length === 0" class="py-6 text-center text-slate-500">
            No hay citas proximas reportadas.
          </div>
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="cita in resumen.citasProximas"
              :key="cita.id"
              class="px-4 py-3 bg-white rounded-lg outline outline-[0.80px] outline-blue-200 flex justify-between items-center"
            >
              <div class="flex flex-col gap-1">
                <span class="text-blue-950 text-base font-medium">{{ cita.hora || 'Sin hora' }}</span>
                <p class="text-slate-600 text-sm">
                  <span class="font-bold">{{ cita.paciente || 'Paciente no informado' }}</span> · {{ cita.servicio || 'Servicio no informado' }}
                </p>
                <p class="text-slate-600 text-xs">{{ cita.dentista || 'Dentista no informado' }}</p>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-blue-500 text-white text-xs font-medium">
                {{ cita.estado || 'Sin estado' }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 p-6">
          <div class="mb-4">
            <div class="flex items-center gap-2">
              <AlertTriangle class="w-5 h-5 text-rose-600" />
              <h2 class="text-blue-950 text-base font-medium">Alertas de Inventario</h2>
            </div>
            <p class="text-slate-600 text-sm mt-1">Insumos que requieren reabastecimiento</p>
          </div>

          <div v-if="resumen.alertasInventario.length === 0" class="py-6 text-center text-slate-500">
            No hay alertas de inventario reportadas.
          </div>
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="item in resumen.alertasInventario"
              :key="item.id ?? item.nombre"
              class="rounded-lg outline outline-[0.80px] px-3 py-3 flex justify-between items-center bg-white outline-blue-200"
            >
              <div>
                <p class="text-blue-950 text-base font-medium">{{ item.nombre }}</p>
                <p class="text-slate-600 text-sm">
                  Stock actual: <span class="font-bold">{{ item.stockActual ?? item.stock ?? 'N/D' }}</span>
                  <template v-if="item.minimo !== undefined"> · Minimo: {{ item.minimo }}</template>
                </p>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-amber-500 text-white text-xs font-medium shrink-0">
                {{ item.sinStock ? 'Sin stock' : 'Bajo stock' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { CalendarDays, Users, AlertTriangle, DollarSign } from 'lucide-vue-next'
import * as dashboardService from '@/services/dashboard'
import type { DashboardResumen } from '@/types'

const fechaHoy = new Date().toLocaleDateString('es-MX', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const resumen = ref<DashboardResumen | null>(null)
const loading = ref(true)
const error = ref('')

const summaryCards = computed(() => {
  if (!resumen.value) return []

  return [
    {
      title: 'Citas Hoy',
      value: String(resumen.value.citasHoy),
      subtitle: 'Total reportado por backend',
      icon: CalendarDays,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Pacientes Activos',
      value: String(resumen.value.pacientesActivos),
      subtitle: 'Pacientes activos',
      icon: Users,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Alertas de Inventario',
      value: String(resumen.value.productosBajoStock),
      subtitle: 'Productos bajo stock',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
    },
    {
      title: 'Ingresos Hoy',
      value: `$${Number(resumen.value.ingresosHoy || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      subtitle: 'MXN',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
    },
  ]
})

onMounted(async () => {
  try {
    resumen.value = await dashboardService.getResumen()
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      error.value = 'Dashboard pendiente de endpoint backend: GET /api/dashboard/resumen.'
    } else {
      error.value = 'No se pudo cargar el resumen del dashboard.'
    }
  } finally {
    loading.value = false
  }
})
</script>
