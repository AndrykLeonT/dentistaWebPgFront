<template>
  <!-- Overlay -->
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-40 bg-black/50" @click="cerrar" />

    <!-- Drawer -->
    <div
      v-if="modelValue"
      class="fixed top-0 right-0 h-full w-[512px] z-50 bg-slate-50 rounded-l-lg shadow-xl outline outline-[0.80px] outline-blue-200 flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="px-6 pt-6 pb-4 shrink-0">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-blue-950 text-lg font-normal">Registrar Nuevo Paciente</h2>
            <p class="text-slate-600 text-sm mt-1">
              Completa el formulario con los datos del paciente
            </p>
          </div>
          <button
            @click="cerrar"
            class="text-blue-950/70 hover:text-blue-950 transition cursor-pointer mt-1"
            :disabled="loading"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Contenido scrolleable -->
      <div class="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-6">
        <!-- Datos Personales -->
        <section class="flex flex-col gap-4">
          <h3 class="text-blue-950 text-lg font-medium">Datos Personales</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Nombre(s) *</label>
              <input
                v-model="form.nombre"
                type="text"
                placeholder="Nombre"
                :disabled="loading"
                class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                :class="fieldErrors['nombre'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
              />
              <p v-if="fieldErrors['nombre']" class="text-red-500 text-xs">
                {{ fieldErrors['nombre'][0] }}
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Apellido Paterno *</label>
              <input
                v-model="form.apellidoP"
                type="text"
                placeholder="Apellido Paterno"
                :disabled="loading"
                class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                :class="fieldErrors['apellidoP'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
              />
              <p v-if="fieldErrors['apellidoP']" class="text-red-500 text-xs">
                {{ fieldErrors['apellidoP'][0] }}
              </p>
            </div>
            <div class="flex flex-col gap-2 col-span-2">
              <label class="text-blue-950 text-sm font-medium">Apellido Materno</label>
              <input
                v-model="form.apellidoM"
                type="text"
                placeholder="Apellido Materno"
                :disabled="loading"
                class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                :class="fieldErrors['apellidoM'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
              />
              <p v-if="fieldErrors['apellidoM']" class="text-red-500 text-xs">
                {{ fieldErrors['apellidoM'][0] }}
              </p>
            </div>
          </div>
        </section>

        <!-- Información de Contacto -->
        <section class="flex flex-col gap-4">
          <h3 class="text-blue-950 text-lg font-medium">Información de Contacto</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Celular *</label>
              <input
                v-model="form.celular"
                type="text"
                placeholder="6120000000"
                :disabled="loading"
                class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                :class="fieldErrors['celular'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
              />
              <p v-if="fieldErrors['celular']" class="text-red-500 text-xs">
                {{ fieldErrors['celular'][0] }}
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Correo Electrónico</label>
              <input
                v-model="form.correoElectronico"
                type="email"
                placeholder="correo@ejemplo.com"
                :disabled="loading"
                class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                :class="fieldErrors['correoElectronico'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
              />
              <p v-if="fieldErrors['correoElectronico']" class="text-red-500 text-xs">
                {{ fieldErrors['correoElectronico'][0] }}
              </p>
            </div>
          </div>
        </section>

        <!-- Mensaje de error general -->
        <div v-if="globalError" class="p-3 bg-red-50 rounded-md border border-red-200">
          <p class="text-red-600 text-sm">{{ globalError }}</p>
        </div>
      </div>

      <!-- Footer con botones -->
      <div class="px-6 py-4 border-t border-blue-200 flex justify-end gap-2 shrink-0 bg-slate-50">
        <button
          @click="cerrar"
          :disabled="loading"
          class="h-9 px-4 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 text-blue-950 text-sm font-medium transition cursor-pointer disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          @click="guardar"
          :disabled="loading"
          class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <span v-if="loading">Guardando...</span>
          <span v-else>Guardar Paciente</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import * as personasService from '@/services/personas'
import { useApiError } from '@/composables/useApiError'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'guardado'])

const loading = ref(false)

const form = reactive({
  nombre: '',
  apellidoP: '',
  apellidoM: '',
  celular: '',
  correoElectronico: '',
})

const { fieldErrors, globalError, handleError, clearErrors } = useApiError()

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // Resetear form al abrir
    form.nombre = ''
    form.apellidoP = ''
    form.apellidoM = ''
    form.celular = ''
    form.correoElectronico = ''
    clearErrors()
  }
})

function cerrar() {
  if (loading.value) return
  emit('update:modelValue', false)
}

async function guardar() {
  if (loading.value) return
  loading.value = true
  clearErrors()

  try {
    const data = await personasService.create({
      nombre: form.nombre,
      apellidoP: form.apellidoP,
      apellidoM: form.apellidoM,
      celular: form.celular,
      correoElectronico: form.correoElectronico || undefined,
    })
    emit('guardado', data.data)
    cerrar()
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}
</script>
