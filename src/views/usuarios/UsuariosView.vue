<template>
  <div class="p-8 min-h-screen bg-slate-50">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Configuracion de Usuarios</h1>
        <p class="text-sm text-slate-500 mt-1">Gestion del personal interno del consultorio</p>
      </div>
      <button
        v-if="puedeAdministrar"
        type="button"
        :disabled="loadingCatalogos"
        @click="abrirModalNuevo"
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
      >
        <span class="text-lg leading-none">+</span>
        Nuevo Usuario
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
          placeholder="Buscar por nombre, usuario o correo..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400"
        />
      </div>
      <select
        v-model="rolFiltro"
        class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white"
      >
        <option value="">Todos los roles</option>
        <option v-for="tipo in tiposEmpleado" :key="tipo.id" :value="tipo.nombre">
          {{ tipo.nombre }}
        </option>
      </select>
      <select
        v-model="estadoFiltro"
        class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white"
      >
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
          Lista de Usuarios ({{ empleadosFiltrados.length }})
        </span>
        <span v-if="loading" class="text-xs text-slate-400">Cargando...</span>
      </div>

      <div v-if="loading" class="px-6 py-12 text-center text-sm text-slate-500">
        Cargando empleados...
      </div>

      <div
        v-else-if="empleadosFiltrados.length === 0"
        class="px-6 py-12 text-center text-sm text-slate-500"
      >
        No hay empleados para mostrar.
      </div>

      <table v-else class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Nombre Completo</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Usuario</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Correo</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Rol</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">RFC</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Estado</th>
            <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="empleado in empleadosFiltrados" :key="empleado.id" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  :style="{ backgroundColor: colorRol(empleado.tipoEmpleado.nombre) }"
                >
                  {{ iniciales(empleado.persona.nombreCompleto) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">{{ empleado.persona.nombreCompleto }}</p>
                  <p class="text-xs text-slate-400">{{ empleado.persona.celular ?? '-' }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">{{ empleado.usuario }}</td>
            <td class="px-4 py-4 text-sm text-slate-600">{{ empleado.persona.correoElectronico ?? '-' }}</td>
            <td class="px-4 py-4">
              <span
                class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white"
                :class="rolClase(empleado.tipoEmpleado.nombre)"
              >
                {{ empleado.tipoEmpleado.nombre }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">{{ empleado.rfc ?? '-' }}</td>
            <td class="px-4 py-4">
              <span
                class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white"
                :class="empleado.estado === false ? 'bg-slate-400' : 'bg-emerald-500'"
              >
                {{ empleado.estado === false ? 'Inactivo' : 'Activo' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div v-if="puedeAdministrar" class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  title="Editar"
                  @click="abrirModalEditar(empleado)"
                  class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  title="Restablecer contrasena"
                  :disabled="resetId === empleado.id"
                  @click="abrirModalReset(empleado)"
                  class="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6l-.04.04a2 2 0 0 1-3.92 0L10 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1l-.04-.04a2 2 0 0 1 0-3.92L4 10a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6l.04-.04a2 2 0 0 1 3.92 0L14 4a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.4.3.6.62.6 1l.04.04a2 2 0 0 1 0 3.92L20 14a1.7 1.7 0 0 0-.6 1Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  title="Desactivar"
                  :disabled="deletingId === empleado.id"
                  @click="desactivarEmpleado(empleado)"
                  class="p-1.5 text-red-400 hover:bg-red-50 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="17" y1="8" x2="23" y2="14" />
                    <line x1="23" y1="8" x2="17" y2="14" />
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
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-7 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between mb-1">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Registrar Nuevo Usuario</h2>
            <p class="text-sm text-slate-500 mt-0.5">Completa el formulario para dar de alta un nuevo usuario</p>
          </div>
          <button type="button" @click="cerrarModalNuevo" class="text-slate-400 hover:text-slate-600 ml-4 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="mt-5 flex flex-col gap-4" @submit.prevent="guardarNuevoUsuario">
          <div class="grid grid-cols-2 gap-4">
            <FormField label="Nombre(s)" error-key="nombre" required>
              <input v-model.trim="nuevoUsuario.nombre" type="text" class="input-control" />
            </FormField>
            <FormField label="Apellido paterno" error-key="apellidoP" required>
              <input v-model.trim="nuevoUsuario.apellidoP" type="text" class="input-control" />
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField label="Apellido materno" error-key="apellidoM">
              <input v-model.trim="nuevoUsuario.apellidoM" type="text" class="input-control" />
            </FormField>
            <FormField label="Telefono" error-key="celular" required>
              <input v-model.trim="nuevoUsuario.celular" type="text" class="input-control" />
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField label="Correo electronico" error-key="correoElectronico">
              <input v-model.trim="nuevoUsuario.correoElectronico" type="email" class="input-control" />
            </FormField>
            <FormField label="RFC" error-key="rfc">
              <input v-model.trim="nuevoUsuario.rfc" type="text" class="input-control" maxlength="13" />
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField label="Usuario" error-key="usuario" required>
              <input v-model.trim="nuevoUsuario.usuario" type="text" class="input-control" />
            </FormField>
            <FormField label="Rol asignado" error-key="idTipoEmpleado" required>
              <select v-model.number="nuevoUsuario.idTipoEmpleado" class="input-control bg-white">
                <option :value="0">Selecciona un rol</option>
                <option v-for="tipo in tiposEmpleado" :key="tipo.id" :value="tipo.id">
                  {{ tipo.nombre }}
                </option>
              </select>
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField label="Contrasena temporal" error-key="contraseña" required>
              <input v-model="nuevoUsuario.contraseña" type="password" class="input-control" />
            </FormField>
            <FormField label="Palabra clave" error-key="palabraClave" required>
              <input v-model.trim="nuevoUsuario.palabraClave" type="text" class="input-control" />
            </FormField>
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
              {{ saving ? 'Guardando...' : 'Guardar Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="modalEditarAbierto && usuarioEditando" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="cerrarModalEditar"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-7">
        <div class="flex items-start justify-between mb-1">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Editar Usuario</h2>
            <p class="text-sm text-slate-500 mt-0.5">{{ usuarioEditando.nombreCompleto }}</p>
          </div>
          <button type="button" @click="cerrarModalEditar" class="text-slate-400 hover:text-slate-600 ml-4 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="mt-5 flex flex-col gap-4" @submit.prevent="actualizarUsuario">
          <div class="grid grid-cols-2 gap-4">
            <FormField label="Nombre(s)" error-key="nombre" required>
              <input v-model.trim="usuarioEditando.nombre" type="text" class="input-control" />
            </FormField>
            <FormField label="Apellido paterno" error-key="apellidoP" required>
              <input v-model.trim="usuarioEditando.apellidoP" type="text" class="input-control" />
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField label="Apellido materno" error-key="apellidoM">
              <input v-model.trim="usuarioEditando.apellidoM" type="text" class="input-control" />
            </FormField>
            <FormField label="Telefono" error-key="celular" required>
              <input v-model.trim="usuarioEditando.celular" type="text" class="input-control" />
            </FormField>
          </div>

          <FormField label="Correo electronico" error-key="correoElectronico">
            <input v-model.trim="usuarioEditando.correoElectronico" type="email" class="input-control" />
          </FormField>

          <FormField label="Usuario" error-key="usuario" required>
            <input v-model.trim="usuarioEditando.usuario" type="text" class="input-control" />
          </FormField>

          <FormField label="Rol asignado" error-key="idTipoEmpleado" required>
            <select v-model.number="usuarioEditando.idTipoEmpleado" class="input-control bg-white">
              <option :value="0">Selecciona un rol</option>
              <option v-for="tipo in tiposEmpleado" :key="tipo.id" :value="tipo.id">
                {{ tipo.nombre }}
              </option>
            </select>
          </FormField>

          <FormField label="RFC" error-key="rfc">
            <input v-model.trim="usuarioEditando.rfc" type="text" class="input-control" maxlength="13" />
          </FormField>

          <div class="flex justify-end gap-3 mt-2">
            <button type="button" @click="cerrarModalEditar" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg"
            >
              {{ saving ? 'Actualizando...' : 'Actualizar Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="modalResetAbierto && usuarioReset" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="cerrarModalReset"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-7">
        <div class="flex items-start justify-between mb-1">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Restablecer Contrasena</h2>
            <p class="text-sm text-slate-500 mt-0.5">{{ usuarioReset.persona.nombreCompleto }}</p>
          </div>
          <button type="button" @click="cerrarModalReset" class="text-slate-400 hover:text-slate-600 ml-4 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="mt-5 flex flex-col gap-4" @submit.prevent="restablecerContrasena">
          <FormField label="Nueva contrasena" error-key="nuevaContraseña" required>
            <input v-model="resetForm.nuevaContraseña" type="password" class="input-control" />
          </FormField>
          <FormField label="Confirmar contrasena" error-key="nuevaContraseña_confirmation" required>
            <input v-model="resetForm.nuevaContraseña_confirmation" type="password" class="input-control" />
          </FormField>

          <div class="flex justify-end gap-3 mt-2">
            <button type="button" @click="cerrarModalReset" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="resetId !== null"
              class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg"
            >
              {{ resetId ? 'Restableciendo...' : 'Restablecer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useApiError } from '@/composables/useApiError'
import * as empleadosService from '@/services/empleados'
import type {
  Empleado,
  ResetPasswordPayload,
  StoreEmpleadoPayload,
  TipoEmpleado,
  UpdateEmpleadoPayload,
} from '@/types'

interface NuevoUsuarioForm {
  nombre: string
  apellidoP: string
  apellidoM: string
  celular: string
  correoElectronico: string
  rfc: string
  usuario: string
  idTipoEmpleado: number
  contraseña: string
  palabraClave: string
}

interface UsuarioEditandoForm {
  id: number
  nombreCompleto: string
  nombre: string
  apellidoP: string
  apellidoM: string
  correoElectronico: string
  celular: string
  usuario: string
  idTipoEmpleado: number
  rfc: string
}

const auth = useAuthStore()
const { globalError, fieldErrors, handleError, clearErrors } = useApiError()

const empleados = ref<Empleado[]>([])
const tiposEmpleado = ref<TipoEmpleado[]>([])
const loading = ref(false)
const loadingCatalogos = ref(false)
const saving = ref(false)
const deletingId = ref<number | null>(null)
const resetId = ref<number | null>(null)

const searchQuery = ref('')
const rolFiltro = ref('')
const estadoFiltro = ref('')

const modalNuevoAbierto = ref(false)
const modalEditarAbierto = ref(false)
const modalResetAbierto = ref(false)
const usuarioEditando = ref<UsuarioEditandoForm | null>(null)
const usuarioReset = ref<Empleado | null>(null)

const nuevoUsuario = reactive<NuevoUsuarioForm>(crearNuevoUsuarioVacio())
const resetForm = reactive<ResetPasswordPayload>({
  nuevaContraseña: '',
  nuevaContraseña_confirmation: '',
})

const puedeAdministrar = computed(() => auth.isAdmin)

const empleadosFiltrados = computed(() => {
  const q = normalizar(searchQuery.value)

  return empleados.value.filter((empleado) => {
    const nombre = normalizar(empleado.persona.nombreCompleto)
    const correo = normalizar(empleado.persona.correoElectronico ?? '')
    const usuario = normalizar(empleado.usuario)
    const rol = empleado.tipoEmpleado.nombre
    const estado = empleado.estado === false ? 'Inactivo' : 'Activo'

    const coincideBusqueda = nombre.includes(q) || correo.includes(q) || usuario.includes(q)
    const coincideRol = rolFiltro.value === '' || rol === rolFiltro.value
    const coincideEstado = estadoFiltro.value === '' || estado === estadoFiltro.value

    return coincideBusqueda && coincideRol && coincideEstado
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
    const [empleadosRes, tiposRes] = await Promise.all([
      empleadosService.getAll(),
      empleadosService.getTiposEmpleado(),
    ])

    empleados.value = empleadosRes.data
    tiposEmpleado.value = tiposRes.data
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
    loadingCatalogos.value = false
  }
}

function abrirModalNuevo(): void {
  if (!puedeAdministrar.value) {
    toast.error('No tienes permisos para administrar empleados')
    return
  }

  clearErrors()
  Object.assign(nuevoUsuario, crearNuevoUsuarioVacio())
  modalNuevoAbierto.value = true
}

function cerrarModalNuevo(): void {
  if (saving.value) return
  modalNuevoAbierto.value = false
  Object.assign(nuevoUsuario, crearNuevoUsuarioVacio())
  clearErrors()
}

async function guardarNuevoUsuario(): Promise<void> {
  if (!puedeAdministrar.value || !validarNuevoUsuario()) return

  saving.value = true

  try {
    await empleadosService.create(mapNuevoUsuarioPayload())
    toast.success('Usuario creado correctamente')
    modalNuevoAbierto.value = false
    Object.assign(nuevoUsuario, crearNuevoUsuarioVacio())
    await cargarDatos()
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

function abrirModalEditar(empleado: Empleado): void {
  if (!puedeAdministrar.value) {
    toast.error('No tienes permisos para editar empleados')
    return
  }

  clearErrors()
  usuarioEditando.value = {
    id: empleado.id,
    nombreCompleto: empleado.persona.nombreCompleto,
    nombre: empleado.persona.nombre ?? primerNombre(empleado.persona.nombreCompleto),
    apellidoP: empleado.persona.apellidoP ?? primerApellido(empleado.persona.nombreCompleto),
    apellidoM: empleado.persona.apellidoM ?? '',
    correoElectronico: empleado.persona.correoElectronico ?? '',
    celular: empleado.persona.celular ?? '',
    usuario: empleado.usuario,
    idTipoEmpleado: empleado.tipoEmpleado.id,
    rfc: empleado.rfc ?? '',
  }
  modalEditarAbierto.value = true
}

function cerrarModalEditar(): void {
  if (saving.value) return
  modalEditarAbierto.value = false
  usuarioEditando.value = null
  clearErrors()
}

async function actualizarUsuario(): Promise<void> {
  if (!puedeAdministrar.value || !usuarioEditando.value || !validarEdicionUsuario()) return

  const form = usuarioEditando.value
  const payload: UpdateEmpleadoPayload = {
    nombre: form.nombre,
    apellidoP: form.apellidoP,
    apellidoM: form.apellidoM || null,
    celular: form.celular,
    correoElectronico: form.correoElectronico || null,
    usuario: form.usuario,
    idTipoEmpleado: form.idTipoEmpleado,
    rfc: form.rfc.trim() || null,
  }

  saving.value = true

  try {
    await empleadosService.update(form.id, payload)
    toast.success('Usuario actualizado correctamente')
    modalEditarAbierto.value = false
    usuarioEditando.value = null
    await cargarDatos()
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

async function desactivarEmpleado(empleado: Empleado): Promise<void> {
  if (!puedeAdministrar.value) {
    toast.error('No tienes permisos para desactivar empleados')
    return
  }

  const confirmado = window.confirm(`Desactivar a ${empleado.persona.nombreCompleto}?`)
  if (!confirmado) return

  deletingId.value = empleado.id
  clearErrors()

  try {
    await empleadosService.remove(empleado.id)
    toast.success('Usuario desactivado correctamente')
    await cargarDatos()
  } catch (error) {
    handleError(error)
  } finally {
    deletingId.value = null
  }
}

function abrirModalReset(empleado: Empleado): void {
  if (!puedeAdministrar.value) {
    toast.error('No tienes permisos para restablecer contrasenas')
    return
  }

  clearErrors()
  usuarioReset.value = empleado
  resetForm.nuevaContraseña = ''
  resetForm.nuevaContraseña_confirmation = ''
  modalResetAbierto.value = true
}

function cerrarModalReset(): void {
  if (resetId.value !== null) return
  modalResetAbierto.value = false
  usuarioReset.value = null
  resetForm.nuevaContraseña = ''
  resetForm.nuevaContraseña_confirmation = ''
  clearErrors()
}

async function restablecerContrasena(): Promise<void> {
  if (!puedeAdministrar.value || !usuarioReset.value || !validarReset()) return

  resetId.value = usuarioReset.value.id

  try {
    await empleadosService.resetPassword(usuarioReset.value.id, { ...resetForm })
    toast.success('Contrasena restablecida correctamente')
    modalResetAbierto.value = false
    usuarioReset.value = null
    resetForm.nuevaContraseña = ''
    resetForm.nuevaContraseña_confirmation = ''
    clearErrors()
  } catch (error) {
    handleError(error)
  } finally {
    resetId.value = null
  }
}

function validarNuevoUsuario(): boolean {
  clearErrors()

  registrarErrorSiVacio('nombre', nuevoUsuario.nombre, 'El nombre es obligatorio.')
  registrarErrorSiVacio('apellidoP', nuevoUsuario.apellidoP, 'El apellido paterno es obligatorio.')
  registrarErrorSiVacio('celular', nuevoUsuario.celular, 'El telefono es obligatorio.')
  registrarErrorSiVacio('usuario', nuevoUsuario.usuario, 'El usuario es obligatorio.')
  registrarErrorSiVacio('contraseña', nuevoUsuario.contraseña, 'La contrasena es obligatoria.')
  registrarErrorSiVacio('palabraClave', nuevoUsuario.palabraClave, 'La palabra clave es obligatoria.')

  if (nuevoUsuario.idTipoEmpleado <= 0) {
    fieldErrors.value.idTipoEmpleado = ['El rol es obligatorio.']
  }

  if (nuevoUsuario.correoElectronico && !esCorreoValido(nuevoUsuario.correoElectronico)) {
    fieldErrors.value.correoElectronico = ['El correo no tiene un formato valido.']
  }

  if (nuevoUsuario.contraseña && nuevoUsuario.contraseña.length < 8) {
    fieldErrors.value.contraseña = ['La contrasena debe tener al menos 8 caracteres.']
  }

  return !hayErroresDeCampo()
}

function validarEdicionUsuario(): boolean {
  clearErrors()

  if (!usuarioEditando.value) return false

  registrarErrorSiVacio('nombre', usuarioEditando.value.nombre, 'El nombre es obligatorio.')
  registrarErrorSiVacio('apellidoP', usuarioEditando.value.apellidoP, 'El apellido paterno es obligatorio.')
  registrarErrorSiVacio('celular', usuarioEditando.value.celular, 'El telefono es obligatorio.')
  registrarErrorSiVacio('usuario', usuarioEditando.value.usuario, 'El usuario es obligatorio.')

  if (usuarioEditando.value.idTipoEmpleado <= 0) {
    fieldErrors.value.idTipoEmpleado = ['El rol es obligatorio.']
  }

  if (
    usuarioEditando.value.correoElectronico &&
    !esCorreoValido(usuarioEditando.value.correoElectronico)
  ) {
    fieldErrors.value.correoElectronico = ['El correo no tiene un formato valido.']
  }

  return !hayErroresDeCampo()
}

function validarReset(): boolean {
  clearErrors()

  registrarErrorSiVacio('nuevaContraseña', resetForm.nuevaContraseña, 'La nueva contrasena es obligatoria.')
  registrarErrorSiVacio(
    'nuevaContraseña_confirmation',
    resetForm.nuevaContraseña_confirmation,
    'La confirmacion es obligatoria.',
  )

  if (resetForm.nuevaContraseña && resetForm.nuevaContraseña.length < 8) {
    fieldErrors.value.nuevaContraseña = ['La nueva contrasena debe tener al menos 8 caracteres.']
  }

  if (
    resetForm.nuevaContraseña &&
    resetForm.nuevaContraseña_confirmation &&
    resetForm.nuevaContraseña !== resetForm.nuevaContraseña_confirmation
  ) {
    fieldErrors.value.nuevaContraseña_confirmation = ['La confirmacion no coincide.']
  }

  return !hayErroresDeCampo()
}

function mapNuevoUsuarioPayload(): StoreEmpleadoPayload {
  return {
    nombre: nuevoUsuario.nombre,
    apellidoP: nuevoUsuario.apellidoP,
    apellidoM: nuevoUsuario.apellidoM || null,
    celular: nuevoUsuario.celular,
    correoElectronico: nuevoUsuario.correoElectronico || null,
    idTipoEmpleado: nuevoUsuario.idTipoEmpleado,
    usuario: nuevoUsuario.usuario,
    rfc: nuevoUsuario.rfc || null,
    contraseña: nuevoUsuario.contraseña,
    palabraClave: nuevoUsuario.palabraClave,
  }
}

function crearNuevoUsuarioVacio(): NuevoUsuarioForm {
  return {
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    celular: '',
    correoElectronico: '',
    rfc: '',
    usuario: '',
    idTipoEmpleado: 0,
    contraseña: '',
    palabraClave: '',
  }
}

function registrarErrorSiVacio(campo: string, valor: string, mensaje: string): void {
  if (valor.trim()) return
  fieldErrors.value[campo] = [mensaje]
}

function hayErroresDeCampo(): boolean {
  return Object.keys(fieldErrors.value).length > 0
}

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
}

function normalizar(valor: string): string {
  return valor.trim().toLowerCase()
}

function iniciales(nombre: string): string {
  const letras = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .filter((letra): letra is string => Boolean(letra))
    .join('')
    .toUpperCase()

  return letras || 'US'
}

function primerNombre(nombreCompleto: string): string {
  return nombreCompleto.split(' ').filter(Boolean)[0] ?? ''
}

function primerApellido(nombreCompleto: string): string {
  const partes = nombreCompleto.split(' ').filter(Boolean)
  return partes.length > 1 ? partes[1] ?? '' : ''
}

function rolClase(rol: string): string {
  if (rol === 'Administrador') return 'bg-slate-800'
  if (rol === 'Dentista') return 'bg-blue-500'
  if (rol === 'Recepcionista') return 'bg-slate-500'
  return 'bg-slate-400'
}

function colorRol(rol: string): string {
  if (rol === 'Administrador') return '#1e293b'
  if (rol === 'Dentista') return '#2563eb'
  if (rol === 'Recepcionista') return '#64748b'
  return '#64748b'
}

const FormField = defineComponent({
  name: 'UsuarioFormField',
  props: {
    label: { type: String, required: true },
    errorKey: { type: String, required: true },
    required: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'min-w-0' }, [
        h('label', { class: 'block text-sm font-medium text-slate-700 mb-1' }, [
          props.label,
          props.required ? h('span', { class: 'text-red-500' }, ' *') : null,
        ]),
        slots.default?.(),
        h(
          'p',
          {
            class: 'min-h-4 mt-1 text-xs text-red-500',
            'data-error-key': props.errorKey,
          },
          fieldErrors.value[props.errorKey]?.[0] ?? '',
        ),
      ])
  },
})
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
