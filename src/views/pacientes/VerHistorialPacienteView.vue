<template>
  <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto">
    <div
      @click="router.push('/pacientes')"
      class="flex items-center gap-2 text-blue-950 text-sm font-medium cursor-pointer hover:bg-slate-200 transition max-w-fit px-3 py-1.5 rounded-md -ml-3"
    >
      <ArrowLeft class="w-4 h-4" />
      Volver a Pacientes
    </div>

    <div class="flex justify-between items-start">
      <div class="flex flex-col gap-1">
        <h1 class="text-blue-950 text-3xl font-normal leading-9">Historial del Paciente</h1>
        <p class="text-slate-600 text-sm leading-5">Expediente completo e historial real desde backend</p>
      </div>
      <button
        v-if="puedeEditar"
        @click="editarPaciente"
        class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center justify-center"
      >
        Editar Datos
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-slate-500">
      Cargando paciente...
    </div>

    <div v-else-if="error && !paciente" class="text-center py-10 text-red-500">
      {{ error }}
    </div>

    <template v-else-if="paciente">
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-start gap-6">
          <div class="w-20 h-20 bg-blue-500 rounded-full flex justify-center items-center shrink-0">
            <span class="text-white text-2xl font-normal">{{ paciente.nombreCompleto.substring(0, 2).toUpperCase() }}</span>
          </div>
          <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <InfoItem label="Nombre Completo" :value="paciente.nombreCompleto" />
            <InfoItem label="Expediente" :value="`EXP-${paciente.id.toString().padStart(3, '0')}`" />
            <InfoItem label="Celular" :value="paciente.celular" />
            <div class="flex flex-col">
              <span class="text-slate-600 text-sm mb-1 leading-5">Estado</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-md text-white text-xs font-medium max-w-fit mt-1',
                  paciente.estado !== false ? 'bg-emerald-600' : 'bg-slate-400',
                ]"
              >
                {{ paciente.estado !== false ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-1 bg-sky-100 rounded-xl flex gap-1 max-w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="tabActiva = tab.value"
          class="px-3 py-1.5 rounded-lg text-blue-950 text-sm font-medium transition cursor-pointer"
          :class="tabActiva === tab.value ? 'bg-white shadow-sm outline outline-[1px] outline-black/5' : 'hover:bg-white/50'"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="tabActiva === 'info'" class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pb-8">
        <section class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
          <div class="flex items-center gap-2">
            <User class="w-5 h-5 text-blue-500" />
            <h2 class="text-blue-950 text-base font-medium">Datos Personales</h2>
          </div>
          <InfoItem label="Nombre" :value="paciente.nombre" />
          <InfoItem label="Apellidos" :value="`${paciente.apellidoP} ${paciente.apellidoM || ''}`" />
          <InfoItem label="Fecha de Registro" :value="formatDate(paciente.fechaRegistro)" />
        </section>

        <section class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
          <div class="flex items-center gap-2">
            <Phone class="w-5 h-5 text-blue-500" />
            <h2 class="text-blue-950 text-base font-medium">Contacto</h2>
          </div>
          <InfoItem label="Celular" :value="paciente.celular" />
          <InfoItem label="Correo Electronico" :value="paciente.correoElectronico || '—'" />
        </section>
      </div>

      <section v-else-if="tabActiva === 'citas'" class="w-full pb-8">
        <HistoryPanel
          title="Historial de Citas"
          subtitle="Todas las citas del paciente"
          :loading="historialLoading"
          :error="historialCitasError"
          empty-text="No hay citas registradas para este paciente."
        >
          <div v-for="cita in historialCitas" :key="cita.id" class="px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-3 border-b border-blue-100 last:border-0">
            <InfoItem label="Fecha" :value="formatDate(cita.fecha)" />
            <InfoItem label="Hora" :value="cita.hora" />
            <InfoItem label="Servicio" :value="cita.servicio" />
            <InfoItem label="Dentista" :value="cita.dentista" />
            <InfoItem label="Estado" :value="cita.estado" />
          </div>
        </HistoryPanel>
      </section>

      <section v-else class="w-full pb-8">
        <HistoryPanel
          title="Historial de Pagos"
          subtitle="Todos los pagos realizados por el paciente"
          :loading="historialLoading"
          :error="historialPagosError"
          empty-text="No hay pagos registrados para este paciente."
        >
          <div v-for="pago in historialPagos" :key="pago.id" class="px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-3 border-b border-blue-100 last:border-0">
            <InfoItem label="Fecha" :value="formatDate(pago.fecha)" />
            <InfoItem label="Total" :value="formatMoney(pago.total)" />
            <InfoItem label="Efectivo" :value="formatMoney(pago.efectivo)" />
            <InfoItem label="Tarjeta" :value="formatMoney(pago.tarjeta)" />
            <InfoItem label="Comprobante" :value="pago.folioComprobante || pago.estado" />
          </div>
        </HistoryPanel>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle, ArrowLeft, Calendar, DollarSign, Phone, User } from 'lucide-vue-next'
import axios from 'axios'
import { toast } from 'vue-sonner'
import * as personasService from '@/services/personas'
import { useAuthStore } from '@/stores/auth'
import type { HistorialCitaPaciente, HistorialPagoPaciente, Persona } from '@/types'

type Tab = 'info' | 'citas' | 'pagos'

const InfoItem = defineComponent({
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  setup(props) {
    return () => h('div', { class: 'flex flex-col gap-1' }, [
      h('span', { class: 'text-slate-600 text-sm leading-5' }, props.label),
      h('span', { class: 'text-blue-950 text-base font-medium leading-6' }, props.value),
    ])
  },
})

const HistoryPanel = defineComponent({
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    loading: { type: Boolean, required: true },
    error: { type: String, required: true },
    emptyText: { type: String, required: true },
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'bg-white rounded-xl outline outline-[1px] outline-blue-200 overflow-hidden' }, [
      h('div', { class: 'px-6 py-4 border-b border-blue-200 flex items-center gap-2' }, [
        props.title.includes('Citas')
          ? h(Calendar, { class: 'w-5 h-5 text-blue-500' })
          : h(DollarSign, { class: 'w-5 h-5 text-blue-500' }),
        h('div', [
          h('h2', { class: 'text-blue-950 text-base font-medium' }, props.title),
          h('p', { class: 'text-slate-600 text-sm' }, props.subtitle),
        ]),
      ]),
      props.loading
        ? h('div', { class: 'p-8 text-center text-slate-500' }, 'Cargando historial...')
        : props.error
          ? h('div', { class: 'p-8 text-center text-amber-700 flex flex-col items-center gap-2' }, [
            h(AlertCircle, { class: 'w-8 h-8 text-amber-500' }),
            h('p', props.error),
          ])
          : slots.default?.()?.length
            ? h('div', slots.default())
            : h('div', { class: 'p-8 text-center text-slate-500' }, props.emptyText),
    ])
  },
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const tabs: Array<{ value: Tab; label: string }> = [
  { value: 'info', label: 'Informacion Personal' },
  { value: 'citas', label: 'Citas' },
  { value: 'pagos', label: 'Pagos' },
]

const tabActiva = ref<Tab>('info')
const paciente = ref<Persona | null>(null)
const loading = ref(true)
const error = ref('')
const historialLoading = ref(false)
const historialCitas = ref<HistorialCitaPaciente[]>([])
const historialPagos = ref<HistorialPagoPaciente[]>([])
const historialCitasError = ref('')
const historialPagosError = ref('')

const puedeEditar = computed(() => authStore.isAdmin || authStore.isRecepcionista)

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) {
    router.replace('/pacientes')
    return
  }

  try {
    const res = await personasService.getById(id)
    paciente.value = res.data
    await fetchHistorial(id)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        toast.error('Paciente no encontrado o inactivo.')
        router.replace('/pacientes')
      } else if (err.response?.status === 403) {
        error.value = 'No tienes permisos para ver este paciente.'
      } else {
        error.value = 'Ocurrio un error al cargar el historial.'
      }
    } else {
      error.value = 'Ocurrio un error inesperado.'
    }
  } finally {
    loading.value = false
  }
})

async function fetchHistorial(id: number) {
  historialLoading.value = true
  historialCitasError.value = ''
  historialPagosError.value = ''

  const [citasResult, pagosResult] = await Promise.allSettled([
    personasService.getHistorialCitas(id),
    personasService.getHistorialPagos(id),
  ])

  if (citasResult.status === 'fulfilled') {
    historialCitas.value = citasResult.value
  } else if (axios.isAxiosError(citasResult.reason) && citasResult.reason.response?.status === 404) {
    historialCitasError.value = 'Historial de citas pendiente de endpoint backend.'
  } else {
    historialCitasError.value = 'No se pudo cargar el historial de citas.'
  }

  if (pagosResult.status === 'fulfilled') {
    historialPagos.value = pagosResult.value
  } else if (axios.isAxiosError(pagosResult.reason) && pagosResult.reason.response?.status === 404) {
    historialPagosError.value = 'Historial de pagos pendiente de endpoint backend.'
  } else {
    historialPagosError.value = 'No se pudo cargar el historial de pagos.'
  }

  historialLoading.value = false
}

function editarPaciente() {
  if (!paciente.value) return
  router.push(`/pacientes/${paciente.value.id}/editar`)
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-MX')
}

function formatMoney(value: number) {
  return `$${Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
}
</script>
