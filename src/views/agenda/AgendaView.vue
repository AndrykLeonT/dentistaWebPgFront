<template>
  <div class="min-h-screen bg-[#f5f9fc]">
    <div class="p-6 max-w-full">

      <!-- Page header -->
      <div class="flex items-center justify-between h-[60px] mb-6">
        <div>
          <h1 class="text-[#0c3660] text-3xl font-semibold leading-9">Agenda</h1>
          <p class="text-[#4a6279] text-sm mt-1">Gestión de citas y calendario</p>
        </div>

        <!-- Nueva Cita button -->
        <button
          class="flex items-center gap-2 bg-[#378add] hover:bg-[#2d6fb5] text-white text-sm font-medium px-4 h-9 rounded-md transition-colors"
          @click="modalAbierto = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Cita
        </button>
      </div>

      <!-- Date navigation bar -->
      <div class="bg-white border border-[#b5d4f4] rounded-xl px-6 py-5 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Prev -->
          <button
            class="bg-[#f5f9fc] border border-[#b5d4f4] rounded-md w-[38px] h-8 flex items-center justify-center hover:bg-[#e6f1fb] transition-colors"
            @click="cambiarDia(-1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#0c3660]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <!-- Current date display -->
          <div class="bg-[#e6f1fb] rounded-lg h-9 px-4 flex items-center">
            <span class="text-[#0c3660] text-sm font-medium">{{ fechaFormateada }}</span>
          </div>

          <!-- Next -->
          <button
            class="bg-[#f5f9fc] border border-[#b5d4f4] rounded-md w-[38px] h-8 flex items-center justify-center hover:bg-[#e6f1fb] transition-colors"
            @click="cambiarDia(1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#0c3660]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <!-- Hoy -->
          <button
            class="bg-[#f5f9fc] border border-[#b5d4f4] rounded-md h-8 px-3 text-sm font-medium text-[#0c3660] hover:bg-[#e6f1fb] transition-colors"
            :class="{ 'bg-[#e6f1fb] border-[#378add]': esHoy }"
            @click="irAHoy"
          >
            Hoy
          </button>
        </div>

        <!-- Dentista filter -->
        <div class="flex items-center gap-2">
          <span class="text-[#0c3660] text-sm font-medium">Dentista:</span>
          <div class="relative">
            <select
              v-model="dentistFiltro"
              class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#0c3660] font-medium focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
            >
              <option value="">Todos</option>
              <option v-for="d in dentistas" :key="d.id" :value="d.id">{{ d.nombre }}</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Citas del día card -->
      <div class="bg-white border border-[#b5d4f4] rounded-xl p-6 min-h-[284px]">
        <div class="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#378add]" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h3 class="text-[#0c3660] text-base font-medium">
            Citas del Día ({{ citasDelDia.length }})
          </h3>
        </div>

        <!-- Empty state -->
        <div v-if="citasDelDia.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-[#b5d4f4]" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p class="text-[#4a6279] text-base">No hay citas programadas para este día</p>
        </div>

        <!-- Appointments list -->
        <div v-else class="flex flex-col gap-3">
          <div
            v-for="cita in citasDelDia"
            :key="cita.id"
            class="flex items-center justify-between border border-[#b5d4f4] rounded-xl px-5 py-4 hover:bg-[#f5f9fc] transition-colors"
          >
            <!-- Left: time + patient info -->
            <div class="flex items-center gap-4">
              <!-- Time badge -->
              <div class="bg-[#e6f1fb] rounded-lg px-3 py-2 text-center min-w-[64px]">
                <span class="text-[#0c3660] text-sm font-semibold block leading-tight">{{ cita.hora }}</span>
              </div>

              <!-- Patient & service info -->
              <div>
                <p class="text-[#0c3660] text-sm font-semibold">{{ cita.paciente }}</p>
                <p class="text-[#4a6279] text-xs mt-0.5">{{ cita.servicio }}</p>
              </div>
            </div>

            <!-- Center: dentist -->
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-[#378add] flex items-center justify-center">
                <span class="text-white text-xs font-medium">{{ iniciales(cita.dentista) }}</span>
              </div>
              <span class="text-[#4a6279] text-sm">{{ cita.dentista }}</span>
            </div>

            <!-- Right: status badge -->
            <div>
              <span
                class="text-xs font-medium px-3 py-1 rounded-full"
                :class="estadoClase(cita.estado)"
              >
                {{ cita.estado }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <NuevaCitaModal
      v-model="modalAbierto"
      :pacientes="pacientes"
      :dentistas="dentistas"
      :servicios="servicios"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NuevaCitaModal from './NuevaCitaModal.vue'

// ─── Date navigation ────────────────────────────────────────────────────────

const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const fechaActual = ref(today())

const fechaFormateada = computed(() =>
  fechaActual.value.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
)

const esHoy = computed(() => {
  const t = today()
  return fechaActual.value.toDateString() === t.toDateString()
})

function cambiarDia(delta) {
  const nueva = new Date(fechaActual.value)
  nueva.setDate(nueva.getDate() + delta)
  fechaActual.value = nueva
}

function irAHoy() {
  fechaActual.value = today()
}

// ─── Dropdown / modal state ──────────────────────────────────────────────────

const modalAbierto = ref(false)
const dentistFiltro = ref('')

// ─── Catalog data ────────────────────────────────────────────────────────────

const pacientes = ref([
  { id: 1, nombre: 'Juan García López' },
  { id: 2, nombre: 'María Rodríguez Pérez' },
  { id: 3, nombre: 'Luis Hernández Mora' },
  { id: 4, nombre: 'Ana Torres Vega' },
])

const dentistas = ref([
  { id: 1, nombre: 'Dr. Carlos Martínez' },
  { id: 2, nombre: 'Dra. Ana López' },
])

const servicios = ref([
  { id: 1, nombre: 'Limpieza dental' },
  { id: 2, nombre: 'Extracción' },
  { id: 3, nombre: 'Ortodoncia' },
  { id: 4, nombre: 'Blanqueamiento' },
])

// ─── Hardcoded example appointments ─────────────────────────────────────────
// fechaISO is compared against fechaActual; format: "YYYY-MM-DD"

function isoDeHoy(offsetDias = 0) {
  const d = today()
  d.setDate(d.getDate() + offsetDias)
  return d.toISOString().slice(0, 10)
}

const todasLasCitas = ref([
  {
    id: 1,
    fechaISO: isoDeHoy(0),
    hora: '09:00',
    paciente: 'Juan García López',
    dentista: 'Dr. Carlos Martínez',
    dentistId: 1,
    servicio: 'Limpieza dental',
    estado: 'Confirmada',
  },
  {
    id: 2,
    fechaISO: isoDeHoy(0),
    hora: '10:30',
    paciente: 'María Rodríguez Pérez',
    dentista: 'Dra. Ana López',
    dentistId: 2,
    servicio: 'Blanqueamiento',
    estado: 'Pendiente',
  },
  {
    id: 3,
    fechaISO: isoDeHoy(0),
    hora: '12:00',
    paciente: 'Luis Hernández Mora',
    dentista: 'Dr. Carlos Martínez',
    dentistId: 1,
    servicio: 'Extracción',
    estado: 'En curso',
  },
  {
    id: 4,
    fechaISO: isoDeHoy(1),
    hora: '09:30',
    paciente: 'Ana Torres Vega',
    dentista: 'Dra. Ana López',
    dentistId: 2,
    servicio: 'Ortodoncia',
    estado: 'Confirmada',
  },
  {
    id: 5,
    fechaISO: isoDeHoy(1),
    hora: '11:00',
    paciente: 'Juan García López',
    dentista: 'Dr. Carlos Martínez',
    dentistId: 1,
    servicio: 'Limpieza dental',
    estado: 'Pendiente',
  },
  {
    id: 6,
    fechaISO: isoDeHoy(-1),
    hora: '08:00',
    paciente: 'María Rodríguez Pérez',
    dentista: 'Dr. Carlos Martínez',
    dentistId: 1,
    servicio: 'Blanqueamiento',
    estado: 'Completada',
  },
])

// ─── Filtered list for the selected day ─────────────────────────────────────

const citasDelDia = computed(() => {
  const iso = fechaActual.value.toISOString().slice(0, 10)
  return todasLasCitas.value.filter((c) => {
    const coincideFecha = c.fechaISO === iso
    const coincideDentista = dentistFiltro.value === '' || c.dentistId === dentistFiltro.value
    return coincideFecha && coincideDentista
  })
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function iniciales(nombre) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function estadoClase(estado) {
  const map = {
    Confirmada: 'bg-[#e6f4ea] text-[#1e7e34]',
    Pendiente:  'bg-[#fff8e1] text-[#b07800]',
    'En curso': 'bg-[#e8f0fe] text-[#1a56db]',
    Completada: 'bg-[#f0f0f0] text-[#555]',
    Cancelada:  'bg-[#fdecea] text-[#c0392b]',
  }
  return map[estado] ?? 'bg-[#f0f0f0] text-[#555]'
}
</script>