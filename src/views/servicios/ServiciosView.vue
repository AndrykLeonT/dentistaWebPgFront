<template>
  <div class="p-8 min-h-screen bg-slate-50">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Servicios</h1>
        <p class="text-sm text-slate-500 mt-1">Catalogo de tratamientos y servicios ofrecidos</p>
      </div>
      <button
        v-if="puedeAdministrar"
        type="button"
        :disabled="loadingCatalogos"
        @click="abrirModalNuevo"
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
      >
        <span class="text-lg leading-none">+</span>
        Nuevo Servicio
      </button>
    </div>

    <div
      v-if="globalError"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ globalError }}
    </div>

    <div class="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 mb-5">
      <div class="relative flex-1">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar servicio..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400"
        />
      </div>
      <select v-model="categoriaFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white">
        <option value="">Todas las categorias</option>
        <option v-for="clase in clasesServicio" :key="clase.id" :value="clase.nombre">
          {{ clase.nombre }}
        </option>
      </select>
      <select v-model="estadoFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white">
        <option value="">Todos los estados</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
      <button
        type="button"
        :disabled="loading"
        @click="cargarDatos"
        class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Recargar
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <span class="text-sm font-semibold text-slate-700">
          Catalogo de Servicios ({{ serviciosFiltrados.length }})
        </span>
        <span v-if="loading" class="text-xs text-slate-400">Cargando...</span>
      </div>

      <div v-if="loading" class="px-6 py-12 text-center text-sm text-slate-500">
        Cargando servicios...
      </div>

      <div
        v-else-if="serviciosFiltrados.length === 0"
        class="px-6 py-12 text-center text-sm text-slate-500"
      >
        No hay servicios para mostrar.
      </div>

      <table v-else class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Nombre</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Categoria</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Duracion</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Precio</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Estado</th>
            <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="servicio in serviciosFiltrados" :key="servicio.id" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <p class="text-sm font-medium text-slate-800">{{ servicio.nombre }}</p>
              <p v-if="servicio.descripcion" class="text-xs text-slate-400 mt-0.5 truncate max-w-72">
                {{ servicio.descripcion }}
              </p>
            </td>
            <td class="px-4 py-4">
              <span class="inline-block px-2.5 py-0.5 rounded border text-xs font-medium border-blue-400 text-blue-500 bg-white">
                {{ servicio.claseServicio?.nombre ?? '-' }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">
              <div class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {{ minutosDesdeDuracion(servicio.duracion) }} min
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">
              <div class="flex items-center gap-1">
                <span class="text-slate-400 text-xs">$</span>
                {{ precioServicio(servicio).toLocaleString('es-MX') }}
              </div>
            </td>
            <td class="px-4 py-4">
              <span
                class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white"
                :class="servicio.activo === false || servicio.estado === false ? 'bg-slate-400' : 'bg-emerald-500'"
              >
                {{ servicio.activo === false || servicio.estado === false ? 'Inactivo' : 'Activo' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div v-if="puedeAdministrar" class="flex items-center justify-end gap-2">
                <button
                  v-if="servicio.activo !== false && servicio.estado !== false"
                  type="button"
                  title="Desactivar"
                  :disabled="deletingId === servicio.id"
                  @click="desactivarServicio(servicio)"
                  class="p-1.5 text-red-400 hover:bg-red-50 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="17" y1="8" x2="23" y2="14" />
                    <line x1="23" y1="8" x2="17" y2="14" />
                  </svg>
                </button>
                <button
                  type="button"
                  title="Editar"
                  @click="abrirModalEditar(servicio)"
                  class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
              <p v-else class="text-right text-xs text-slate-400">Solo lectura</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalNuevoAbierto" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="cerrarModalNuevo"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-7">
        <div class="flex items-start justify-between mb-1">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Registrar Nuevo Servicio</h2>
            <p class="text-sm text-slate-500 mt-0.5">Completa el formulario para agregar un nuevo servicio</p>
          </div>
          <button type="button" @click="cerrarModalNuevo" class="text-slate-400 hover:text-slate-600 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="mt-5 flex flex-col gap-4" @submit.prevent="guardarServicio">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Servicio <span class="text-red-500">*</span></label>
            <input v-model.trim="nuevoServicio.nombre" type="text" placeholder="Ej: Limpieza Dental" class="input-control" />
            <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('nombre') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Categoria <span class="text-red-500">*</span></label>
            <select v-model.number="nuevoServicio.idClaseServicio" class="input-control bg-white">
              <option :value="0">Selecciona una categoria</option>
              <option v-for="clase in clasesServicio" :key="clase.id" :value="clase.id">
                {{ clase.nombre }}
              </option>
            </select>
            <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('idClaseServicio') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripcion</label>
            <textarea v-model.trim="nuevoServicio.descripcion" rows="3" placeholder="Describe en que consiste el servicio..." class="input-control resize-none"></textarea>
            <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('descripcion') }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Duracion (minutos) <span class="text-red-500">*</span></label>
              <input v-model.number="nuevoServicio.duracionMinutos" type="number" min="1" class="input-control" />
              <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('duracion') }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Precio Base (MXN) <span class="text-red-500">*</span></label>
              <input v-model.number="nuevoServicio.costo" type="number" min="0" step="0.01" class="input-control" />
              <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('costo') }}</p>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-2">
            <button type="button" @click="cerrarModalNuevo" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg"
            >
              {{ saving ? 'Guardando...' : 'Guardar Servicio' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="modalEditarAbierto && servicioEditando" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="cerrarModalEditar"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-7">
        <div class="flex items-start justify-between mb-1">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Editar Servicio</h2>
            <p class="text-sm text-slate-500 mt-0.5">Modifica los datos del servicio</p>
          </div>
          <button type="button" @click="cerrarModalEditar" class="text-slate-400 hover:text-slate-600 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="mt-5 flex flex-col gap-4" @submit.prevent="actualizarServicio">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Servicio <span class="text-red-500">*</span></label>
            <input v-model.trim="servicioEditando.nombre" type="text" class="input-control" />
            <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('nombre') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Categoria <span class="text-red-500">*</span></label>
            <select v-model.number="servicioEditando.idClaseServicio" class="input-control bg-white">
              <option :value="0">Selecciona una categoria</option>
              <option v-for="clase in clasesServicio" :key="clase.id" :value="clase.id">
                {{ clase.nombre }}
              </option>
            </select>
            <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('idClaseServicio') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripcion</label>
            <textarea v-model.trim="servicioEditando.descripcion" rows="3" class="input-control resize-none"></textarea>
            <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('descripcion') }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Duracion (minutos) <span class="text-red-500">*</span></label>
              <input v-model.number="servicioEditando.duracionMinutos" type="number" min="1" class="input-control" />
              <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('duracion') }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Precio Base (MXN) <span class="text-red-500">*</span></label>
              <input v-model.number="servicioEditando.costo" type="number" min="0" step="0.01" class="input-control" />
              <p class="min-h-4 mt-1 text-xs text-red-500">{{ errorCampo('costo') }}</p>
            </div>
          </div>

          <div class="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-700">Estado del Servicio</p>
              <p class="text-xs text-slate-500 mt-0.5">El servicio aparece disponible para agendar</p>
            </div>
            <button
              type="button"
              @click="servicioEditando.activo = !servicioEditando.activo"
              :class="servicioEditando.activo ? 'bg-blue-500' : 'bg-slate-300'"
              class="relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none shrink-0"
            >
              <span
                :class="servicioEditando.activo ? 'translate-x-5' : 'translate-x-1'"
                class="inline-block w-4 h-4 mt-1 bg-white rounded-full shadow transition-transform"
              ></span>
            </button>
          </div>

          <div class="flex justify-end gap-3 mt-2">
            <button type="button" @click="cerrarModalEditar" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg"
            >
              {{ saving ? 'Actualizando...' : 'Actualizar Servicio' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useApiError } from '@/composables/useApiError'
import * as serviciosService from '@/services/servicios'
import type {
  ClaseServicio,
  Servicio,
  StoreServicioPayload,
  UpdateServicioPayload,
} from '@/types'

interface ServicioForm {
  nombre: string
  idClaseServicio: number
  descripcion: string
  duracionMinutos: number
  costo: number
}

interface ServicioEditForm extends ServicioForm {
  id: number
  activo: boolean
}

const auth = useAuthStore()
const { globalError, fieldErrors, handleError, clearErrors } = useApiError()

const servicios = ref<Servicio[]>([])
const clasesServicio = ref<ClaseServicio[]>([])
const loading = ref(false)
const loadingCatalogos = ref(false)
const saving = ref(false)
const deletingId = ref<number | null>(null)

const searchQuery = ref('')
const categoriaFiltro = ref('')
const estadoFiltro = ref('')

const modalNuevoAbierto = ref(false)
const modalEditarAbierto = ref(false)
const servicioEditando = ref<ServicioEditForm | null>(null)
const nuevoServicio = reactive<ServicioForm>(crearServicioVacio())

const puedeAdministrar = computed(() => auth.isAdmin || auth.isRecepcionista)

const serviciosFiltrados = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return servicios.value.filter((servicio) => {
    const categoria = servicio.claseServicio?.nombre ?? ''
    const estado = servicio.activo === false || servicio.estado === false ? 'Inactivo' : 'Activo'
    const coincideBusqueda =
      servicio.nombre.toLowerCase().includes(q) ||
      (servicio.descripcion ?? '').toLowerCase().includes(q)
    const coincideCategoria = categoriaFiltro.value === '' || categoria === categoriaFiltro.value
    const coincideEstado = estadoFiltro.value === '' || estado === estadoFiltro.value

    return coincideBusqueda && coincideCategoria && coincideEstado
  })
})

onMounted(() => {
  cargarDatos()
})

async function cargarDatos(): Promise<void> {
  loading.value = true
  loadingCatalogos.value = true
  clearErrors()

  try {
    const [serviciosRes, clasesRes] = await Promise.all([
      serviciosService.getAll(),
      serviciosService.getClases(),
    ])

    servicios.value = serviciosRes.data
    clasesServicio.value = clasesRes.data
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
    loadingCatalogos.value = false
  }
}

function abrirModalNuevo(): void {
  if (!puedeAdministrar.value) {
    toast.error('No tienes permisos para administrar servicios')
    return
  }

  clearErrors()
  Object.assign(nuevoServicio, crearServicioVacio())
  modalNuevoAbierto.value = true
}

function cerrarModalNuevo(): void {
  if (saving.value) return
  modalNuevoAbierto.value = false
  Object.assign(nuevoServicio, crearServicioVacio())
  clearErrors()
}

async function guardarServicio(): Promise<void> {
  if (!puedeAdministrar.value || !validarServicio(nuevoServicio)) return

  saving.value = true

  try {
    await serviciosService.create(mapStorePayload(nuevoServicio))
    toast.success('Servicio creado correctamente')
    modalNuevoAbierto.value = false
    Object.assign(nuevoServicio, crearServicioVacio())
    await cargarDatos()
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

function abrirModalEditar(servicio: Servicio): void {
  if (!puedeAdministrar.value) {
    toast.error('No tienes permisos para editar servicios')
    return
  }

  clearErrors()
  servicioEditando.value = {
    id: servicio.id,
    nombre: servicio.nombre,
    idClaseServicio: servicio.claseServicio?.id ?? 0,
    descripcion: servicio.descripcion ?? '',
    duracionMinutos: minutosDesdeDuracion(servicio.duracion),
    costo: precioServicio(servicio),
    activo: servicio.activo !== false && servicio.estado !== false,
  }
  modalEditarAbierto.value = true
}

function cerrarModalEditar(): void {
  if (saving.value) return
  modalEditarAbierto.value = false
  servicioEditando.value = null
  clearErrors()
}

async function actualizarServicio(): Promise<void> {
  if (!puedeAdministrar.value || !servicioEditando.value || !validarServicio(servicioEditando.value)) {
    return
  }

  saving.value = true

  try {
    await serviciosService.update(servicioEditando.value.id, mapUpdatePayload(servicioEditando.value))
    toast.success('Servicio actualizado correctamente')
    modalEditarAbierto.value = false
    servicioEditando.value = null
    await cargarDatos()
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

async function desactivarServicio(servicio: Servicio): Promise<void> {
  if (!puedeAdministrar.value) {
    toast.error('No tienes permisos para desactivar servicios')
    return
  }

  const confirmado = window.confirm(`Desactivar el servicio "${servicio.nombre}"?`)
  if (!confirmado) return

  deletingId.value = servicio.id
  clearErrors()

  try {
    await serviciosService.remove(servicio.id)
    toast.success('Servicio desactivado correctamente')
    await cargarDatos()
  } catch (error) {
    handleError(error)
  } finally {
    deletingId.value = null
  }
}

function validarServicio(form: ServicioForm): boolean {
  clearErrors()

  if (!form.nombre.trim()) fieldErrors.value.nombre = ['El nombre es obligatorio.']
  if (form.idClaseServicio <= 0) fieldErrors.value.idClaseServicio = ['La categoria es obligatoria.']
  if (!Number.isFinite(form.duracionMinutos) || form.duracionMinutos <= 0) {
    fieldErrors.value.duracion = ['La duracion debe ser mayor a cero.']
  }
  if (!Number.isFinite(form.costo) || form.costo < 0) {
    fieldErrors.value.costo = ['El precio no puede ser negativo.']
  }

  return Object.keys(fieldErrors.value).length === 0
}

function mapStorePayload(form: ServicioForm): StoreServicioPayload {
  return {
    idClaseServicio: form.idClaseServicio,
    nombre: form.nombre,
    descripcion: form.descripcion || null,
    costo: form.costo,
    duracion: duracionDesdeMinutos(form.duracionMinutos),
  }
}

function mapUpdatePayload(form: ServicioEditForm): UpdateServicioPayload {
  return {
    ...mapStorePayload(form),
    estado: form.activo,
  }
}

function crearServicioVacio(): ServicioForm {
  return {
    nombre: '',
    idClaseServicio: 0,
    descripcion: '',
    duracionMinutos: 60,
    costo: 0,
  }
}

function errorCampo(campo: string): string {
  return fieldErrors.value[campo]?.[0] ?? ''
}

function precioServicio(servicio: Servicio): number {
  if (typeof servicio.precio === 'number') return servicio.precio
  return Number(servicio.costo ?? 0)
}

function minutosDesdeDuracion(duracion?: string): number {
  if (!duracion) return 0
  const [horas = '0', minutos = '0'] = duracion.split(':')
  return Number(horas) * 60 + Number(minutos)
}

function duracionDesdeMinutos(totalMinutos: number): string {
  const minutosNormalizados = Math.max(1, Math.round(totalMinutos))
  const horas = Math.floor(minutosNormalizados / 60)
  const minutos = minutosNormalizados % 60

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`
}
</script>

<style scoped>
.input-control {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #334155;
  outline: none;
}

.input-control:focus {
  border-color: #60a5fa;
}
</style>
