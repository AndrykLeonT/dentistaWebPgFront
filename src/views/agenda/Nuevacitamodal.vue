<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="$emit('update:modelValue', false)"
    >
      <!-- Modal panel -->
      <div
        class="relative bg-[#f5f9fc] border border-[#b5d4f4] rounded-lg shadow-xl w-[512px] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 pt-6 pb-2">
          <h2 class="text-[#0c3660] text-lg font-semibold leading-tight">
            Registrar Nueva Cita
          </h2>
          <p class="text-[#4a6279] text-sm mt-2">
            Completa el formulario para agendar una nueva cita
          </p>
        </div>

        <!-- Close button -->
        <button
          class="absolute top-4 right-4 text-[#0c3660] opacity-70 hover:opacity-100 transition-opacity"
          @click="$emit('update:modelValue', false)"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Form body -->
        <div class="px-6 pt-4 flex flex-col gap-4">

          <!-- Paciente -->
          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Paciente *</label>
            <div class="relative">
              <select
                v-model="form.paciente"
                class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#4a6279] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              >
                <option value="" disabled>Selecciona un paciente</option>
                <option v-for="p in pacientes" :key="p.id" :value="p.id">{{ p.nombre }}</option>
              </select>
              <ChevronIcon class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]" />
            </div>
          </div>

          <!-- Dentista -->
          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Dentista *</label>
            <div class="relative">
              <select
                v-model="form.dentista"
                class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#4a6279] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              >
                <option value="" disabled>Selecciona un dentista</option>
                <option v-for="d in dentistas" :key="d.id" :value="d.id">{{ d.nombre }}</option>
              </select>
              <ChevronIcon class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]" />
            </div>
          </div>

          <!-- Servicio -->
          <div class="flex flex-col gap-2">
            <label class="text-[#0c3660] text-sm font-medium">Servicio *</label>
            <div class="relative">
              <select
                v-model="form.servicio"
                class="appearance-none bg-white border border-transparent rounded-md h-9 pl-3 pr-8 text-sm text-[#4a6279] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              >
                <option value="" disabled>Selecciona un servicio</option>
                <option v-for="s in servicios" :key="s.id" :value="s.id">{{ s.nombre }}</option>
              </select>
              <ChevronIcon class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6279]" />
            </div>
          </div>

          <!-- Fecha + Hora -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Fecha -->
            <div class="flex flex-col gap-2">
              <label class="text-[#0c3660] text-sm font-medium">Fecha *</label>
              <input
                v-model="form.fecha"
                type="date"
                class="bg-white border border-transparent rounded-md h-9 px-3 text-sm text-[#0c3660] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              />
            </div>

            <!-- Hora de inicio -->
            <div class="flex flex-col gap-2">
              <label class="text-[#0c3660] text-sm font-medium">Hora de inicio *</label>
              <input
                v-model="form.horaInicio"
                type="time"
                class="bg-white border border-transparent rounded-md h-9 px-3 text-sm text-[#0c3660] font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#378add] cursor-pointer"
              />
            </div>
          </div>

          <!-- Motivo de consulta -->
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

        <!-- Footer actions -->
        <div class="px-6 py-4 flex justify-end gap-2 mt-2">
          <button
            class="h-9 px-4 bg-[#f5f9fc] border border-[#b5d4f4] text-[#0c3660] text-sm font-medium rounded-md hover:bg-[#e6f1fb] transition-colors"
            @click="$emit('update:modelValue', false)"
          >
            Cancelar
          </button>
          <button
            class="h-9 px-4 bg-[#378add] text-white text-sm font-medium rounded-md hover:bg-[#2d6fb5] transition-colors"
            @click="handleGuardar"
          >
            Guardar Cita
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive } from 'vue'

// Inline chevron icon to avoid external dependency
const ChevronIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  `,
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  pacientes: {
    type: Array,
    default: () => [],
  },
  dentistas: {
    type: Array,
    default: () => [],
  },
  servicios: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const form = reactive({
  paciente: '',
  dentista: '',
  servicio: '',
  fecha: '',
  horaInicio: '',
  motivo: '',
})

function handleGuardar() {
  // TODO: implement save logic
  console.log('Guardar cita:', { ...form })
}
</script>