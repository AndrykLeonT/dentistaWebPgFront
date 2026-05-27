<template>
  <div class="min-h-screen bg-[#f5f9fc]">
    <div class="p-6 max-w-full">
      <div class="flex items-center justify-between h-15 mb-6">
        <div>
          <h1 class="text-[#0c3660] text-3xl font-semibold leading-9">Agenda</h1>
          <p class="text-[#4a6279] text-sm mt-1">Gestion de citas y calendario</p>
        </div>

        <button
          v-if="puedeGestionarCitas"
          class="flex items-center gap-2 bg-[#378add] hover:bg-[#2d6fb5] text-white text-sm font-medium px-4 h-9 rounded-md transition-colors"
          @click="abrirNuevaCita"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Cita
        </button>
      </div>

      <div
        class="bg-white border border-[#b5d4f4] rounded-xl px-6 py-5 mb-6 flex items-center justify-between"
      >
        <div class="flex items-center gap-2 w-52 shrink-0">
          <button
            class="bg-[#f5f9fc] border border-[#b5d4f4] rounded-md w-9.5 h-8 flex items-center justify-center hover:bg-[#e6f1fb] transition-colors"
            @click="cambiarDia(-1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-[#0c3660]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div class="bg-[#e6f1fb] rounded-lg h-9 px-4 flex items-center whitespace-nowrap">
            <span class="text-[#0c3660] text-sm font-medium">{{ fechaFormateada }}</span>
          </div>

          <button
            class="bg-[#f5f9fc] border border-[#b5d4f4] rounded-md w-9.5 h-8 flex items-center justify-center hover:bg-[#e6f1fb] transition-colors"
            @click="cambiarDia(1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-[#0c3660]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button
            class="bg-[#f5f9fc] border border-[#b5d4f4] rounded-md h-8 px-3 text-sm font-medium text-[#0c3660] hover:bg-[#e6f1fb] transition-colors"
            :class="{ 'bg-[#e6f1fb] border-[#378add]': esHoy }"
            @click="irAHoy"
          >
            Hoy
          </button>
        </div>

        <div class="flex items-center justify-end gap-2 w-80 shrink-0">
          <span class="text-[#0c3660] text-sm font-medium">Dentista:</span>
          <div class="relative w-56" @focusout="cerrarFiltroDentistaDiferido">
            <button
              type="button"
              class="bg-white border border-[#b5d4f4] rounded-md h-9 pl-3 pr-8 text-left text-sm text-[#0c3660] font-medium focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer w-full truncate"
              @click="filtroDentistaAbierto = !filtroDentistaAbierto"
            >
              {{ dentistaFiltroLabel }}
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <div
              v-if="filtroDentistaAbierto"
              class="absolute right-0 top-10 z-30 w-64 max-h-64 overflow-y-auto rounded-md border border-[#b5d4f4] bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                class="block w-full px-3 py-2 text-left text-sm text-[#0c3660] hover:bg-[#e6f1fb]"
                :class="{ 'bg-[#e6f1fb]': dentistFiltro === '' }"
                @mousedown.prevent="seleccionarFiltroDentista('')"
              >
                Todos
              </button>
              <button
                v-for="d in dentistas"
                :key="d.id"
                type="button"
                class="block w-full px-3 py-2 text-left text-sm text-[#0c3660] hover:bg-[#e6f1fb]"
                :class="{ 'bg-[#e6f1fb]': dentistFiltro === d.id }"
                @mousedown.prevent="seleccionarFiltroDentista(d.id)"
              >
                {{ d.nombre }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white border border-[#b5d4f4] rounded-xl p-6 min-h-71">
        <div class="flex items-center gap-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-[#378add]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h3 class="text-[#0c3660] text-base font-medium">
            Citas del Dia ({{ citasDelDia.length }})
          </h3>
        </div>

        <p
          v-if="errorAgenda"
          class="mb-4 rounded-md border border-[#f3b2b2] bg-[#fdecea] px-3 py-2 text-sm text-[#9f1f1f]"
        >
          {{ errorAgenda }}
        </p>

        <div v-if="cargando" class="flex flex-col items-center justify-center py-12 gap-3">
          <p class="text-[#4a6279] text-base">Cargando citas...</p>
        </div>

        <div
          v-else-if="citasDelDia.length === 0"
          class="flex flex-col items-center justify-center py-12 gap-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-12 h-12 text-[#b5d4f4]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p class="text-[#4a6279] text-base">No hay citas programadas para este dia</p>
        </div>

        <div v-else class="flex flex-col gap-3">
          <div
            v-for="cita in citasDelDia"
            :key="cita.id"
            class="flex items-center justify-between border border-[#b5d4f4] rounded-xl px-5 py-4 hover:bg-[#f5f9fc] transition-colors cursor-pointer"
            @click="puedeGestionarCitas && abrirEditar(cita)"
          >
            <div class="flex items-center gap-4 w-64 shrink-0">
              <div class="bg-[#e6f1fb] rounded-lg px-3 py-2 text-center min-w-16">
                <span class="text-[#0c3660] text-sm font-semibold block leading-tight">
                  {{ cita.hora }}
                </span>
              </div>
              <div>
                <p class="text-[#0c3660] text-sm font-semibold">{{ cita.paciente }}</p>
                <p class="text-[#4a6279] text-xs mt-0.5">{{ cita.servicio }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 w-52 shrink-0">
              <div
                class="w-7 h-7 rounded-full bg-[#378add] flex items-center justify-center shrink-0"
              >
                <span class="text-white text-xs font-medium">{{ iniciales(cita.dentista) }}</span>
              </div>
              <span class="text-[#4a6279] text-sm">{{ cita.dentista }}</span>
            </div>

            <span
              class="text-xs font-medium px-3 py-1 rounded-full w-28 text-center inline-block"
              :class="estadoClase(cita.estado)"
            >
              {{ cita.estado }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <NuevaCitaModal
      v-model="modalNuevaAbierto"
      :pacientes="pacientes"
      :dentistas="dentistas"
      :servicios="servicios"
      :fecha-inicial="fechaISOActual"
      :saving="guardando"
      :error="errorModal"
      @guardar="crearCita"
    />

    <EditarCitaModal
      v-model="modalEditarAbierto"
      :cita="citaSeleccionada"
      :pacientes="pacientes"
      :dentistas="dentistas"
      :servicios="servicios"
      :saving="guardando"
      :error="errorModal"
      @actualizar="actualizarCita"
      @cancelar="cancelarCita"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import NuevaCitaModal from './Nuevacitamodal.vue'
import EditarCitaModal from './EditarCitaModal.vue'
import * as citasService from '@/services/citas'
import * as personasService from '@/services/personas'
import * as serviciosService from '@/services/servicios'
import * as empleadosService from '@/services/empleados'
import { useAuthStore } from '@/stores/auth'
import type { Cita, Empleado, Persona, Servicio } from '@/types'
import type { CitaPayload } from '@/services/citas'

interface SelectOption {
  id: number
  nombre: string
}

interface AgendaCita {
  id: number
  fechaISO: string
  hora: string
  pacienteId: number
  dentistId: number
  servicioId: number
  motivo?: string
}

interface AgendaItem extends AgendaCita {
  paciente: string
  dentista: string
  servicio: string
  estado: 'Confirmada'
}

interface CitaForm {
  paciente: number | ''
  dentista: number | ''
  servicio: number | ''
  fecha: string
  horaInicio: string
  motivo: string
}

const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const fechaActual = ref(today())
const citasRaw = ref<Cita[]>([])
const serviciosRaw = ref<Servicio[]>([])
const pacientes = ref<SelectOption[]>([])
const dentistas = ref<SelectOption[]>([])
const servicios = ref<SelectOption[]>([])
const modalNuevaAbierto = ref(false)
const modalEditarAbierto = ref(false)
const citaSeleccionada = ref<AgendaItem | null>(null)
const dentistFiltro = ref<number | ''>('')
const filtroDentistaAbierto = ref(false)
const cargando = ref(false)
const guardando = ref(false)
const errorAgenda = ref<string | null>(null)
const errorModal = ref<string | null>(null)
const auth = useAuthStore()

const fechaISOActual = computed(() => formatDate(fechaActual.value))
const puedeGestionarCitas = computed(() => auth.isAdmin || auth.isRecepcionista)
const dentistaFiltroLabel = computed(() => {
  if (dentistFiltro.value === '') return 'Todos'
  return dentistas.value.find((dentista) => dentista.id === dentistFiltro.value)?.nombre ?? 'Todos'
})

const fechaFormateada = computed(() =>
  fechaActual.value.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)

const esHoy = computed(() => fechaActual.value.toDateString() === today().toDateString())

const citasDelDia = computed(() => {
  return citasRaw.value
    .map(normalizarCita)
    .filter((cita): cita is AgendaItem => cita !== null)
    .filter((cita) => dentistFiltro.value === '' || cita.dentistId === Number(dentistFiltro.value))
    .sort((a, b) => a.hora.localeCompare(b.hora))
})

onMounted(async () => {
  await Promise.all([cargarCatalogos(), cargarCitas(fechaISOActual.value)])
})

watch(fechaISOActual, (fecha) => {
  void cargarCitas(fecha)
})

function cambiarDia(delta: number) {
  const nueva = new Date(fechaActual.value)
  nueva.setDate(nueva.getDate() + delta)
  fechaActual.value = nueva
}

function irAHoy() {
  fechaActual.value = today()
}

function abrirNuevaCita() {
  errorModal.value = null
  modalNuevaAbierto.value = true
}

function abrirEditar(cita: AgendaItem) {
  errorModal.value = null
  citaSeleccionada.value = cita
  modalEditarAbierto.value = true
}

function seleccionarFiltroDentista(id: number | '') {
  dentistFiltro.value = id
  filtroDentistaAbierto.value = false
}

function cerrarFiltroDentistaDiferido() {
  window.setTimeout(() => {
    filtroDentistaAbierto.value = false
  }, 120)
}

async function cargarCatalogos() {
  try {
    const [personasRes, serviciosRes, empleadosRes] = await Promise.all([
      personasService.getAll(),
      serviciosService.getAll(),
      empleadosService.getAll(),
    ])

    pacientes.value = personasRes.data.map((persona) => ({
      id: persona.id,
      nombre: nombrePersona(persona),
    }))

    serviciosRaw.value = serviciosRes.data
    servicios.value = serviciosRes.data.map((servicio) => ({
      id: servicio.id,
      nombre: servicio.nombre,
    }))

    dentistas.value = empleadosRes.data.filter(esDentista).map((empleado) => ({
      id: empleado.id,
      nombre: empleado.persona?.nombreCompleto ?? empleado.usuario,
    }))
  } catch {
    errorAgenda.value = 'No se pudieron cargar los catalogos de agenda.'
  }
}

async function cargarCitas(fecha: string) {
  cargando.value = true
  errorAgenda.value = null

  try {
    const res = await citasService.getAll({ fecha })
    citasRaw.value = res.data
  } catch {
    errorAgenda.value = 'No se pudieron cargar las citas del dia.'
  } finally {
    cargando.value = false
  }
}

async function crearCita(form: CitaForm) {
  await guardarConPayload(form, async (payload) => {
    await citasService.create(payload)
    modalNuevaAbierto.value = false
    toast.success('Cita registrada correctamente')
  })
}

async function actualizarCita(form: CitaForm) {
  if (!citaSeleccionada.value) return

  await guardarConPayload(form, async (payload) => {
    await citasService.update(citaSeleccionada.value!.id, payload)
    modalEditarAbierto.value = false
    toast.success('Cita actualizada correctamente')
  }, citaSeleccionada.value.id)
}

async function cancelarCita() {
  if (!citaSeleccionada.value || guardando.value) return

  guardando.value = true
  errorModal.value = null

  try {
    await citasService.cancel(citaSeleccionada.value.id)
    modalEditarAbierto.value = false
    toast.success('Cita cancelada correctamente')
    await cargarCitas(fechaISOActual.value)
  } catch {
    errorModal.value = 'No se pudo cancelar la cita. Verifica que tu usuario tenga permisos.'
  } finally {
    guardando.value = false
  }
}

async function guardarConPayload(
  form: CitaForm,
  accion: (payload: CitaPayload) => Promise<void>,
  citaIdIgnorada?: number,
) {
  errorModal.value = null
  const payload = construirPayload(form)

  if (!payload) return

  guardando.value = true

  try {
    const hayChoque = await existeChoque(payload, citaIdIgnorada)
    if (hayChoque) {
      errorModal.value = 'Ya existe una cita para ese dentista en esa fecha y hora.'
      return
    }

    await accion(payload)
    await cargarCitas(fechaISOActual.value)
  } catch {
    errorModal.value = 'No se pudo guardar la cita. Verifica los datos y permisos de tu usuario.'
  } finally {
    guardando.value = false
  }
}

function construirPayload(form: CitaForm): CitaPayload | null {
  if (!form.paciente || !form.dentista || !form.servicio || !form.fecha || !form.horaInicio) {
    errorModal.value = 'Completa paciente, dentista, servicio, fecha y hora.'
    return null
  }

  const servicio = servicioPorId(Number(form.servicio))

  return {
    idPersona: Number(form.paciente),
    idServicio: Number(form.servicio),
    idEmpleado: Number(form.dentista),
    fechaProgramada: form.fecha,
    hora: form.horaInicio,
    duracion: servicio?.duracion,
    motivo: form.motivo?.trim() || undefined,
  }
}

async function existeChoque(payload: CitaPayload, citaIdIgnorada?: number) {
  const citas =
    payload.fechaProgramada === fechaISOActual.value
      ? citasRaw.value
      : (await citasService.getAll({ fecha: payload.fechaProgramada })).data

  return citas
    .map(normalizarCita)
    .filter((cita): cita is AgendaItem => cita !== null)
    .some(
      (cita) =>
        cita.id !== citaIdIgnorada &&
        cita.dentistId === payload.idEmpleado &&
        cita.fechaISO === payload.fechaProgramada &&
        cita.hora.slice(0, 5) === payload.hora,
    )
}

function normalizarCita(cita: Cita): AgendaItem | null {
  const pacienteId = cita.paciente?.id
  const servicioId = cita.servicio?.id
  const dentistId = cita.dentista?.id

  if (!pacienteId || !servicioId || !dentistId || !cita.fechaProgramada || !cita.hora) {
    return null
  }

  return {
    id: cita.id,
    fechaISO: fechaApi(cita.fechaProgramada),
    hora: cita.hora.slice(0, 5),
    paciente: cita.paciente?.nombreCompleto ?? 'Paciente sin nombre',
    pacienteId,
    dentista: cita.dentista?.nombreCompleto ?? 'Dentista sin nombre',
    dentistId,
    servicio: cita.servicio?.nombre ?? 'Servicio sin nombre',
    servicioId,
    estado: 'Confirmada',
    motivo: cita.motivo ?? '',
  }
}

function nombrePersona(persona: Persona) {
  const posibleNombreCompleto = (persona as Persona & { nombreCompleto?: string }).nombreCompleto
  if (posibleNombreCompleto) return posibleNombreCompleto
  return [persona.nombre, persona.apellidos].filter(Boolean).join(' ')
}

function esDentista(empleado: Empleado) {
  return empleado.tipoEmpleado?.nombre?.toLowerCase() === 'dentista'
}

function servicioPorId(id: number): Servicio | undefined {
  return serviciosRaw.value.find((servicio) => servicio.id === id)
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fechaApi(value: string) {
  return value.includes('T') ? value.slice(0, 10) : value
}

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function estadoClase(estado: string) {
  const map: Record<string, string> = {
    Confirmada: 'bg-[#e6f4ea] text-[#1e7e34]',
    Pendiente: 'bg-[#fff8e1] text-[#b07800]',
    'En curso': 'bg-[#e8f0fe] text-[#1a56db]',
    Completada: 'bg-[#f0f0f0] text-[#555]',
    Cancelada: 'bg-[#fdecea] text-[#c0392b]',
  }
  return map[estado] ?? 'bg-[#f0f0f0] text-[#555]'
}
</script>
