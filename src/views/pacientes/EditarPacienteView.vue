<template>
  <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
    <!-- Back Button -->
    <div
      @click="router.back()"
      class="flex items-center gap-2 text-blue-950 text-sm font-medium cursor-pointer hover:bg-slate-200 transition max-w-fit px-3 py-1.5 rounded-md -ml-3"
    >
      <ArrowLeft class="w-4 h-4" />
      Volver
    </div>

    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-blue-950 text-3xl font-normal leading-9">Editar Paciente</h1>
        <p class="text-slate-600 text-sm leading-5">
          Actualiza la información del expediente del paciente
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="router.back()"
          :disabled="loading || saving"
          class="h-9 px-4 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 text-blue-950 text-sm font-medium transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <X class="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="button"
          @click="guardarCambios"
          :disabled="loading || saving"
          class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <Save class="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10 text-slate-500">
      Cargando paciente...
    </div>

    <div v-else-if="globalError && !paciente" class="text-center py-10 text-red-500">
      {{ globalError }}
    </div>

    <template v-else-if="paciente">
      <!-- Main Info Box -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div class="w-20 h-20 bg-blue-500 rounded-full flex justify-center items-center shrink-0">
            <span class="text-white text-2xl font-normal">
              {{ paciente.nombreCompleto.substring(0, 2).toUpperCase() }}
            </span>
          </div>

          <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex flex-col">
              <span class="text-slate-600 text-sm mb-1 leading-5">Nombre Completo</span>
              <span class="text-blue-950 text-base font-medium leading-6">
                {{ paciente.nombreCompleto }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-600 text-sm mb-1 leading-5">Expediente</span>
              <span class="text-blue-950 text-base font-medium leading-6">EXP-{{ paciente.id.toString().padStart(3, '0') }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-600 text-sm mb-1 leading-5">Estado</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-md text-white text-xs font-medium inline-block mt-1 max-w-fit',
                  paciente.estado !== false ? 'bg-emerald-600' : 'bg-slate-400',
                ]"
              >
                {{ paciente.estado !== false ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-600 text-sm mb-1 leading-5">Fecha Registro</span>
              <span class="text-blue-950 text-base leading-6">{{ new Date(paciente.fechaRegistro).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
        <!-- Alert Box para mensajes generales del form (solo UI) -->
        <div
          v-if="globalError"
          class="bg-red-50 rounded-lg outline outline-[1px] outline-rose-600 px-4 py-3 flex items-center gap-2"
        >
          <AlertCircle class="w-4 h-4 text-rose-600" />
          <span class="text-rose-600 text-sm font-medium leading-5">{{ globalError }}</span>
        </div>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <!-- Left: Sections -->
        <div class="flex flex-col gap-6">
          <!-- Datos Personales -->
          <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
            <div class="flex items-center gap-2">
              <User class="w-5 h-5 text-blue-500" />
              <h2 class="text-blue-950 text-base font-medium">Datos Personales</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-blue-950 text-sm font-medium">Nombre(s) *</label>
                <input
                  v-model="form.nombre"
                  type="text"
                  placeholder="Nombre"
                  class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                  :class="fieldErrors['nombre'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
                />
                <p v-if="fieldErrors['nombre']" class="text-red-500 text-xs">{{ fieldErrors['nombre'][0] }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-blue-950 text-sm font-medium">Apellido Paterno *</label>
                <input
                  v-model="form.apellidoP"
                  type="text"
                  placeholder="Apellido Paterno"
                  class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                  :class="fieldErrors['apellidoP'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
                />
                <p v-if="fieldErrors['apellidoP']" class="text-red-500 text-xs">{{ fieldErrors['apellidoP'][0] }}</p>
              </div>
              <div class="flex flex-col gap-2 col-span-2">
                <label class="text-blue-950 text-sm font-medium">Apellido Materno</label>
                <input
                  v-model="form.apellidoM"
                  type="text"
                  placeholder="Apellido Materno"
                  class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                  :class="fieldErrors['apellidoM'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
                />
                <p v-if="fieldErrors['apellidoM']" class="text-red-500 text-xs">{{ fieldErrors['apellidoM'][0] }}</p>
              </div>
            </div>
          </div>

          <!-- Contacto -->
          <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
            <div class="flex items-center gap-2">
              <Phone class="w-5 h-5 text-blue-500" />
              <h2 class="text-blue-950 text-base font-medium">Contacto</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-blue-950 text-sm font-medium">Celular *</label>
                <input
                  v-model="form.celular"
                  type="text"
                  placeholder="+52 55 1234 5678"
                  class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                  :class="fieldErrors['celular'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
                />
                <p v-if="fieldErrors['celular']" class="text-red-500 text-xs">{{ fieldErrors['celular'][0] }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-blue-950 text-sm font-medium">Correo Electrónico</label>
                <input
                  v-model="form.correoElectronico"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition"
                  :class="fieldErrors['correoElectronico'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
                />
                <p v-if="fieldErrors['correoElectronico']" class="text-red-500 text-xs">{{ fieldErrors['correoElectronico'][0] }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sticky summary -->
        <aside class="lg:sticky lg:top-6 h-fit">
          <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-4">
            <h3 class="text-blue-950 text-base font-medium">Resumen</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between gap-4">
                <span class="text-slate-600 text-sm">Nombre</span>
                <span class="text-blue-950 text-sm font-medium text-right truncate w-40">
                  {{ form.nombre || '—' }} {{ form.apellidoP || '' }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-slate-600 text-sm">Expediente</span>
                <span class="text-blue-950 text-sm font-medium">EXP-{{ paciente.id.toString().padStart(3, '0') }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-slate-600 text-sm">Celular</span>
                <span class="text-blue-950 text-sm font-medium">{{ form.celular || '—' }}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-slate-600 text-sm">Estado</span>
                <span
                  :class="[
                    'px-2 py-0.5 rounded-md text-white text-xs font-medium',
                    paciente.estado !== false ? 'bg-emerald-600' : 'bg-slate-400',
                  ]"
                >
                  {{ paciente.estado !== false ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>

            <div class="pt-2 border-t border-blue-200 flex flex-col gap-2">
              <button
                type="button"
                @click="guardarCambios"
                :disabled="loading || saving"
                class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save class="w-4 h-4" />
                <span v-if="saving">Guardando...</span>
                <span v-else>Guardar Cambios</span>
              </button>
              <button
                type="button"
                @click="router.back()"
                :disabled="loading || saving"
                class="h-9 px-4 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 text-blue-950 text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X class="w-4 h-4" />
                Cancelar
              </button>
              <button
                type="button"
                @click="darDeBaja"
                :disabled="loading || saving || paciente.estado === false"
                class="h-9 mt-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md outline outline-[0.80px] outline-rose-200 text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Dar de Baja
              </button>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowLeft,
  Phone,
  Save,
  User,
  X,
} from 'lucide-vue-next'
import * as personasService from '@/services/personas'
import type { Persona } from '@/types'
import { useApiError } from '@/composables/useApiError'
import { toast } from 'vue-sonner'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const { fieldErrors, globalError, handleError, clearErrors } = useApiError()

const paciente = ref<Persona | null>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  nombre: '',
  apellidoP: '',
  apellidoM: '',
  celular: '',
  correoElectronico: '',
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) {
    router.replace('/pacientes')
    return
  }

  try {
    const res = await personasService.getById(id)
    paciente.value = res.data
    form.nombre = paciente.value.nombre
    form.apellidoP = paciente.value.apellidoP
    form.apellidoM = paciente.value.apellidoM || ''
    form.celular = paciente.value.celular
    form.correoElectronico = paciente.value.correoElectronico || ''
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      toast.error('Paciente no encontrado o inactivo.')
      router.replace('/pacientes')
    } else {
      handleError(err)
    }
  } finally {
    loading.value = false
  }
})

async function guardarCambios() {
  if (saving.value || !paciente.value) return
  saving.value = true
  clearErrors()

  try {
    await personasService.update(paciente.value.id, {
      nombre: form.nombre,
      apellidoP: form.apellidoP,
      apellidoM: form.apellidoM,
      celular: form.celular,
      correoElectronico: form.correoElectronico || undefined,
    })
    toast.success('Cambios guardados correctamente')
    router.replace('/pacientes')
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

async function darDeBaja() {
  if (!paciente.value) return
  if (!confirm('¿Seguro que deseas dar de baja a este paciente?')) return

  saving.value = true
  try {
    await personasService.remove(paciente.value.id)
    toast.success('Paciente dado de baja correctamente')
    router.replace('/pacientes')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción.')
    } else {
      handleError(error)
    }
  } finally {
    saving.value = false
  }
}
</script>
