<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="$emit('update:modelValue', false)"
    >
      <div
        class="relative bg-[#f5f9fc] border border-[#b5d4f4] rounded-lg shadow-xl w-lg overflow-hidden"
        @click.stop
      >
        <div class="px-6 pt-6 pb-2">
          <h2 class="text-[#0c3660] text-lg font-semibold leading-tight">Editar Cita</h2>
          <p class="text-[#4a6279] text-sm mt-2">Modifica los datos de la cita</p>
        </div>

        <button
          class="absolute top-4 right-4 text-[#0c3660] opacity-70 hover:opacity-100 transition-opacity"
          @click="$emit('update:modelValue', false)"
          aria-label="Cerrar"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div class="px-6 pt-4 flex flex-col gap-4">
          <p
            v-if="error"
            class="rounded-md border border-[#f3b2b2] bg-[#fdecea] px-3 py-2 text-sm text-[#9f1f1f]"
          >
            {{ error }}
          </p>

          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Paciente *</label>
            <div class="relative">
              <select
                v-model="form.paciente"
                class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#0c3660] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              >
                <option value="" disabled>Selecciona un paciente</option>
                <option v-for="p in pacientes" :key="p.id" :value="p.id">{{ p.nombre }}</option>
              </select>
              <ChevronIcon
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Dentista *</label>
            <div class="relative">
              <select
                v-model="form.dentista"
                class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#0c3660] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              >
                <option value="" disabled>Selecciona un dentista</option>
                <option v-for="d in dentistas" :key="d.id" :value="d.id">{{ d.nombre }}</option>
              </select>
              <ChevronIcon
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Servicio *</label>
            <div class="relative">
              <select
                v-model="form.servicio"
                class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#0c3660] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              >
                <option value="" disabled>Selecciona un servicio</option>
                <option v-for="s in servicios" :key="s.id" :value="s.id">{{ s.nombre }}</option>
              </select>
              <ChevronIcon
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-[#0c3660] text-sm font-medium">Fecha *</label>
              <input
                v-model="form.fecha"
                type="date"
                class="bg-white border border-transparent rounded-md h-9 px-3 text-sm text-[#0c3660] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[#0c3660] text-sm font-medium">Hora de inicio *</label>
              <div class="relative">
                <select
                  v-model="form.horaInicio"
                  class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#0c3660] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
                >
                  <option value="" disabled>Selecciona una hora</option>
                  <option v-if="form.horaInicio && !horarios.includes(form.horaInicio)" :value="form.horaInicio">
                    {{ form.horaInicio }}
                  </option>
                  <option v-for="hora in horarios" :key="hora" :value="hora">{{ hora }}</option>
                </select>
                <ChevronIcon
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Estado</label>
            <div
              class="bg-white border border-transparent rounded-md h-9 px-3 text-sm text-[#0c3660] font-medium w-full flex items-center"
            >
              Confirmada
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Motivo de consulta</label>
            <textarea
              v-model="form.motivo"
              rows="3"
              placeholder="Describe el motivo de la consulta..."
              class="bg-white border border-transparent rounded-md px-3 py-2 text-sm text-[#4a6279] w-full resize-none focus:outline-none focus:ring-2 focus:ring-[#378add] placeholder:text-[#4a6279]"
            />
          </div>
        </div>

        <div class="px-6 py-4 flex justify-between gap-2 mt-2">
          <button
            class="h-9 px-4 bg-[#fdecea] border border-[#f3b2b2] text-[#9f1f1f] text-sm font-medium rounded-md hover:bg-[#fbd9d9] transition-colors disabled:opacity-60"
            :disabled="saving || !cita"
            @click="handleCancelar"
          >
            Cancelar Cita
          </button>
          <div class="flex justify-end gap-2">
            <button
              class="h-9 px-4 bg-[#f5f9fc] border border-[#b5d4f4] text-[#0c3660] text-sm font-medium rounded-md hover:bg-[#e6f1fb] transition-colors"
              :disabled="saving"
              @click="$emit('update:modelValue', false)"
            >
              Cerrar
            </button>
            <button
              class="h-9 px-4 bg-[#378add] text-white text-sm font-medium rounded-md hover:bg-[#2d6fb5] transition-colors disabled:opacity-60"
              :disabled="saving || !cita"
              @click="handleActualizar"
            >
              {{ saving ? 'Actualizando...' : 'Actualizar Cita' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

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

interface CitaForm {
  paciente: number | ''
  dentista: number | ''
  servicio: number | ''
  fecha: string
  horaInicio: string
  motivo: string
}

const ChevronIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  `,
}

const horarios = crearHorarios()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  actualizar: [value: CitaForm]
  cancelar: []
}>()

const form = reactive<CitaForm>({
  paciente: '',
  dentista: '',
  servicio: '',
  fecha: '',
  horaInicio: '',
  motivo: '',
})

const props = defineProps<{
  modelValue: boolean
  cita: AgendaCita | null
  pacientes?: SelectOption[]
  dentistas?: SelectOption[]
  servicios?: SelectOption[]
  saving?: boolean
  error?: string | null
}>()

watch(
  () => props.cita,
  (cita) => {
    if (!cita) return
    form.paciente = cita.pacienteId
    form.dentista = cita.dentistId
    form.servicio = cita.servicioId
    form.fecha = cita.fechaISO
    form.horaInicio = cita.hora.slice(0, 5)
    form.motivo = cita.motivo ?? ''
  },
  { immediate: true },
)

function handleActualizar() {
  emit('actualizar', { ...form })
}

function handleCancelar() {
  emit('cancelar')
}

function crearHorarios() {
  const opciones: string[] = []

  for (let hora = 8; hora <= 20; hora += 1) {
    opciones.push(`${String(hora).padStart(2, '0')}:00`)
    if (hora < 20) opciones.push(`${String(hora).padStart(2, '0')}:30`)
  }

  return opciones
}
</script>
