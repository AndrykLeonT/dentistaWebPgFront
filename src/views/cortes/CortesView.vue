<template>
  <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-blue-950 text-3xl font-normal leading-9">Cortes de Caja</h1>
        <p class="text-slate-600 text-sm leading-5">
          Gestión del turno actual e ingresos
        </p>
      </div>

      <div class="flex items-center gap-2" v-if="puedeGestionarCaja">
        <button
          v-if="!corteActivo && !loading"
          @click="abrirCorte"
          :disabled="procesando"
          class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Play class="w-4 h-4" />
          Abrir Corte
        </button>
        <button
          v-else-if="corteActivo && !loading"
          @click="cerrarCorte"
          :disabled="procesando"
          class="h-9 px-4 bg-rose-500 hover:bg-rose-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Square class="w-4 h-4" />
          Cerrar Corte
        </button>
      </div>
    </div>

    <!-- Alert si no tiene permisos -->
    <div
      v-if="!puedeGestionarCaja && !loading"
      class="bg-amber-50 rounded-lg outline outline-[1px] outline-amber-600 px-4 py-3 flex items-center gap-2"
    >
      <AlertCircle class="w-4 h-4 text-amber-600" />
      <span class="text-amber-800 text-sm font-medium leading-5">
        No tienes permisos para operar la caja.
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-slate-500 flex flex-col items-center gap-2">
      <RefreshCw class="w-6 h-6 animate-spin text-blue-500" />
      <span>Consultando estado de la caja...</span>
    </div>

    <!-- Main Content -->
    <template v-else-if="puedeGestionarCaja">
      <div v-if="!corteActivo" class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-10 flex flex-col items-center justify-center gap-4 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <Lock class="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h2 class="text-blue-950 text-xl font-medium">Caja Cerrada</h2>
          <p class="text-slate-600 text-sm mt-1">No hay ningún corte activo en este momento.</p>
        </div>
        <button
          @click="abrirCorte"
          :disabled="procesando"
          class="mt-4 h-10 px-6 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Play class="w-4 h-4" />
          Abrir Nueva Caja
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
          <div class="flex items-center gap-2">
            <Unlock class="w-6 h-6 text-emerald-500" />
            <h2 class="text-blue-950 text-lg font-medium">Caja Abierta</h2>
          </div>
          <div class="flex flex-col gap-4">
            <div>
              <p class="text-slate-500 text-sm mb-1">Fecha de Apertura</p>
              <p class="text-blue-950 text-base font-medium">{{ formatDate(corteActivo.fechaInicio || corteActivo.fDeCaja) }}</p>
            </div>
            <div>
              <p class="text-slate-500 text-sm mb-1">Número de Pagos</p>
              <p class="text-blue-950 text-base font-medium">{{ corteActivo.numPagos || 0 }}</p>
            </div>
            <div class="pt-4 border-t border-slate-100">
              <p class="text-slate-500 text-sm mb-1">Fondo Inicial de Caja</p>
              <p class="text-blue-950 text-base font-medium">${{ Number(corteActivo.fDeCaja).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
          <h2 class="text-blue-950 text-lg font-medium mb-2">Resumen Actual</h2>
          
          <div class="flex items-center justify-between">
            <span class="text-slate-600">Total en Efectivo</span>
            <span class="text-blue-950 font-medium">${{ Number(corteActivo.tEfectivo || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-slate-600">Total en Tarjeta</span>
            <span class="text-blue-950 font-medium">${{ Number(corteActivo.tTarjeta || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
          </div>
          
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-blue-950 font-bold text-lg">Total Recaudado</span>
            <span class="text-emerald-600 font-bold text-xl">${{ Number(corteActivo.totalRecaudado || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  AlertCircle,
  Play,
  Square,
  Lock,
  Unlock,
  RefreshCw,
} from 'lucide-vue-next'
import * as cortesService from '@/services/cortes'
import type { Corte } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import axios from 'axios'

const authStore = useAuthStore()
const loading = ref(true)
const procesando = ref(false)
const corteActivo = ref<Corte | null>(null)

const puedeGestionarCaja = computed(() => authStore.isAdmin || authStore.isRecepcionista)

onMounted(async () => {
  if (puedeGestionarCaja.value) {
    await fetchCorteActivo()
  } else {
    loading.value = false
  }
})

async function fetchCorteActivo() {
  loading.value = true
  try {
    const res = await cortesService.getActivo()
    corteActivo.value = res.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      corteActivo.value = null
    } else {
      toast.error('Ocurrió un error al consultar la caja.')
    }
  } finally {
    loading.value = false
  }
}

async function abrirCorte() {
  if (procesando.value) return
  procesando.value = true
  try {
    // Abrimos con fondo de caja 0 por defecto (el backend soporta body vacío o número, aquí mandamos {})
    const res = await cortesService.create()
    corteActivo.value = res.data
    toast.success('Caja abierta exitosamente.')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      toast.error('Ya existe un corte activo.')
      await fetchCorteActivo()
    } else {
      toast.error('Ocurrió un error al abrir la caja.')
    }
  } finally {
    procesando.value = false
  }
}

async function cerrarCorte() {
  if (!corteActivo.value || procesando.value) return
  if (!confirm('¿Estás seguro de que deseas cerrar el corte actual? No podrás registrar más pagos en él.')) return

  procesando.value = true
  try {
    await cortesService.close(corteActivo.value.id)
    toast.success('Caja cerrada exitosamente.')
    corteActivo.value = null
  } catch {
    toast.error('Ocurrió un error al cerrar la caja.')
  } finally {
    procesando.value = false
  }
}

function formatDate(dateStr?: string | number) {
  if (!dateStr) return '—'
  return new Date(String(dateStr)).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
