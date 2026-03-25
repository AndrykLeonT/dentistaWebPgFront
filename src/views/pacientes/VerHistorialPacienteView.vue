<template>
  <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto">
    <!-- Back Button -->
    <div 
      @click="router.push('/pacientes')"
      class="flex items-center gap-2 text-blue-950 text-sm font-medium cursor-pointer hover:bg-slate-200 transition max-w-fit px-3 py-1.5 rounded-md -ml-3"
    >
      <ArrowLeft class="w-4 h-4" />
      Volver a Pacientes
    </div>

    <!-- Header -->
    <div class="flex justify-between items-start">
      <div class="flex flex-col gap-1">
        <h1 class="text-blue-950 text-3xl font-normal leading-9">Historial del Paciente</h1>
        <p class="text-slate-600 text-sm leading-5">Expediente completo y gestión de información</p>
      </div>
      <button
        @click="editarPaciente"
        class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center justify-center"
      >
        Editar Datos
      </button>
    </div>

    <!-- Main Info Box -->
    <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
      <div class="flex items-start gap-6">
        <div class="w-20 h-20 bg-blue-500 rounded-full flex justify-center items-center shrink-0">
          <span class="text-white text-2xl font-normal">MG</span>
        </div>
        <div class="flex-1 grid grid-cols-4 gap-4 mt-2">
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Nombre Completo</span>
            <span class="text-blue-950 text-base font-medium leading-6">María García Pérez</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Expediente</span>
            <span class="text-blue-950 text-base font-medium leading-6">EXP-001</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Edad</span>
            <span class="text-blue-950 text-base font-medium leading-6">40 años</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Tipo de Sangre</span>
            <span class="text-blue-950 text-base font-medium leading-6">O+</span>
          </div>
        </div>
      </div>
      
      <!-- Alert Box -->
      <div class="bg-red-50 rounded-lg outline outline-[1px] outline-rose-600 px-4 py-3 flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-rose-600" />
        <span class="text-rose-600 text-sm font-medium leading-5">Alergias: Penicilina</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="p-1 bg-sky-100 rounded-xl flex gap-1 max-w-fit">
      <button
        @click="tabActiva = 'info'"
        class="px-3 py-1.5 rounded-lg text-blue-950 text-sm font-medium transition cursor-pointer"
        :class="
          tabActiva === 'info'
            ? 'bg-white shadow-sm outline outline-[1px] outline-black/5'
            : 'hover:bg-white/50'
        "
      >
        Información Personal
      </button>
      <button
        @click="tabActiva = 'citas'"
        class="px-3 py-1.5 rounded-lg text-blue-950 text-sm font-medium transition cursor-pointer"
        :class="
          tabActiva === 'citas'
            ? 'bg-white shadow-sm outline outline-[1px] outline-black/5'
            : 'hover:bg-white/50'
        "
      >
        Citas ({{ citasPaciente.length }})
      </button>
      <button
        @click="tabActiva = 'pagos'"
        class="px-3 py-1.5 rounded-lg text-blue-950 text-sm font-medium transition cursor-pointer"
        :class="
          tabActiva === 'pagos'
            ? 'bg-white shadow-sm outline outline-[1px] outline-black/5'
            : 'hover:bg-white/50'
        "
      >
        Pagos ({{ pagosPaciente.length }})
      </button>
    </div>

    <!-- Información Personal -->
    <div v-if="tabActiva === 'info'" class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pb-8">
      <!-- Datos Personales -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <User class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Datos Personales</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Fecha de Nacimiento</div>
            <div class="text-blue-950 text-base">14/6/1985</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Género</div>
            <div class="text-blue-950 text-base">Femenino</div>
          </div>
          <div class="pt-1">
            <div class="text-slate-600 text-sm mb-1">Estado</div>
            <span class="px-2 py-0.5 bg-emerald-600 rounded-md text-white text-xs font-medium inline-block mt-1">
              Activo
            </span>
          </div>
        </div>
      </div>

      <!-- Contacto -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <Phone class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Contacto</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Teléfono Principal</div>
            <div class="text-blue-950 text-base">+52 55 1111 2222</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Correo Electrónico</div>
            <div class="text-blue-950 text-base">maria.garcia@email.com</div>
          </div>
        </div>
      </div>

      <!-- Dirección -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <MapPin class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Dirección</h2>
        </div>
        <div class="flex flex-col gap-1 text-blue-950 text-base">
          <p>Av. Insurgentes Sur 1234</p>
          <p>Del Valle</p>
          <p>Ciudad de México, C.P. 03100</p>
        </div>
      </div>

      <!-- Información Médica -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <Heart class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Información Médica</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Tipo de Sangre</div>
            <div class="text-blue-950 text-base">O+</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Alergias</div>
            <div class="text-blue-950 text-base">Penicilina</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Enfermedades</div>
            <div class="text-blue-950 text-base">Hipertensión controlada</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Medicamentos</div>
            <div class="text-blue-950 text-base">Losartán 50mg</div>
          </div>
        </div>
      </div>

      <!-- Contacto de Emergencia -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6 md:col-span-2">
        <div class="flex items-center gap-2">
          <PhoneCall class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Contacto de Emergencia</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Nombre</div>
            <div class="text-blue-950 text-base">Juan García</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Teléfono</div>
            <div class="text-blue-950 text-base">+52 55 1111 3333</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Citas -->
    <div v-else-if="tabActiva === 'citas'" class="w-full pb-8">
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-blue-200 flex items-center gap-2">
          <Calendar class="w-5 h-5 text-blue-500" />
          <div>
            <h2 class="text-blue-950 text-base font-medium">Historial de Citas</h2>
            <p class="text-slate-600 text-sm">Todas las citas del paciente</p>
          </div>
        </div>

        <div v-if="citasPaciente.length === 0" class="px-6 py-10 text-center text-slate-600 text-sm">
          No hay citas registradas para este paciente
        </div>

        <div v-else class="p-6 flex flex-col gap-3">
          <div
            v-for="cita in citasPaciente"
            :key="cita.id"
            class="p-4 rounded-lg border"
            style="border-color: #b5d4f4; background-color: #ffffff"
          >
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-blue-950 text-base font-medium">
                  {{ cita.fechaLarga }}
                </p>
                <span
                  class="px-2 py-0.5 rounded-md text-white text-xs font-medium"
                  :style="{
                    backgroundColor: getEstadoBadge(cita.estado).bg,
                    color: getEstadoBadge(cita.estado).color,
                  }"
                >
                  {{ cita.estado }}
                </span>
              </div>
              <p class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Hora:</span>
                {{ cita.horaInicio }} - {{ cita.horaFin }}
              </p>
              <p class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Servicio:</span>
                {{ cita.servicio }}
              </p>
              <p class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Dentista:</span>
                {{ cita.dentista }}
              </p>

              <p v-if="cita.motivo" class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Motivo:</span>
                {{ cita.motivo }}
              </p>

              <div v-if="cita.notasClinicas" class="mt-1 p-2 rounded bg-sky-100">
                <p class="text-blue-950 text-sm">
                  <span class="font-medium">Notas clínicas:</span>
                  {{ cita.notasClinicas }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagos -->
    <div v-else class="w-full pb-8">
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-blue-200 flex items-center gap-2">
          <DollarSign class="w-5 h-5 text-blue-500" />
          <div>
            <h2 class="text-blue-950 text-base font-medium">Historial de Pagos</h2>
            <p class="text-slate-600 text-sm">Todos los pagos realizados por el paciente</p>
          </div>
        </div>

        <div v-if="pagosPaciente.length === 0" class="px-6 py-10 text-center text-slate-600 text-sm">
          No hay pagos registrados para este paciente
        </div>

        <div v-else class="p-6 flex flex-col gap-3">
          <div
            v-for="pago in pagosPaciente"
            :key="pago.id"
            class="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            style="border-color: #b5d4f4; background-color: #ffffff"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <FileText class="w-4 h-4 text-slate-600" />
                <p class="text-blue-950 text-base font-medium">Folio: {{ pago.folio }}</p>
              </div>
              <p class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Fecha:</span>
                {{ pago.fecha }}
              </p>
              <p class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Servicio:</span>
                {{ pago.servicio }}
              </p>
              <p class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Método de Pago:</span>
                {{ pago.metodoPago }}
              </p>
              <p class="text-slate-600 text-sm">
                <span class="text-blue-950 font-medium">Total:</span>
                ${{ pago.total.toLocaleString('es-MX') }} MXN
              </p>
              <p v-if="pago.descuento > 0" class="text-sm text-emerald-700 mt-1">
                <span class="font-medium">Descuento aplicado:</span>
                ${{ pago.descuento.toLocaleString('es-MX') }} MXN
              </p>
            </div>

            <div class="text-right">
              <p class="text-emerald-700 text-lg font-semibold">
                ${{ pago.total.toLocaleString('es-MX') }}
              </p>
              <p class="text-slate-600 text-xs">MXN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Heart,
  MapPin,
  Phone,
  PhoneCall,
  User,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const tabActiva = ref<'info' | 'citas' | 'pagos'>('info')

function editarPaciente() {
  router.push(`/pacientes/${route.params.id}/editar`)
}

type CitaEstado = 'Confirmada' | 'Programada' | 'En Curso' | 'Completada' | 'Cancelada'

function getEstadoBadge(estado: CitaEstado) {
  const styles: Record<CitaEstado, { bg: string; color: string }> = {
    Confirmada: { bg: '#0F8C6E', color: '#ffffff' },
    Programada: { bg: '#378ADD', color: '#ffffff' },
    'En Curso': { bg: '#85B7EB', color: '#0C3660' },
    Completada: { bg: '#B5D4F4', color: '#0C3660' },
    Cancelada: { bg: '#d4183d', color: '#ffffff' },
  }
  return styles[estado] ?? styles.Programada
}

// Mock data solo para UI (para que coincida con el diseño de Figma).
const citas = [
  {
    id: 'cita-1',
    pacienteId: '1',
    fechaLarga: 'viernes, 14 de marzo de 2026',
    horaInicio: '10:00',
    horaFin: '11:00',
    servicio: 'Limpieza Dental',
    dentista: 'Dr. Carlos Martínez',
    estado: 'Completada' as CitaEstado,
    motivo: 'Revisión y limpieza',
    notasClinicas: 'Sin hallazgos relevantes. Se recomienda control en 6 meses.',
  },
  {
    id: 'cita-2',
    pacienteId: '1',
    fechaLarga: 'lunes, 24 de marzo de 2026',
    horaInicio: '16:30',
    horaFin: '17:15',
    servicio: 'Resina',
    dentista: 'Dra. Ana López',
    estado: 'Programada' as CitaEstado,
    motivo: 'Dolor localizado',
    notasClinicas: '',
  },
]

const pagos = [
  {
    id: 'pago-1',
    pacienteId: '1',
    folio: 'PG-00125',
    fecha: '14/3/2026',
    servicio: 'Limpieza Dental',
    metodoPago: 'Tarjeta',
    total: 900,
    descuento: 0,
  },
]

const citasPaciente = computed(() => citas.filter((c) => c.pacienteId === String(route.params.id)))
const pagosPaciente = computed(() => pagos.filter((p) => p.pacienteId === String(route.params.id)))
</script>
