<template>
  <div class="flex flex-col gap-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-blue-950 text-3xl font-normal">Pacientes</h1>
        <p class="text-slate-600 text-sm mt-1">Gestión de expedientes y datos de pacientes</p>
      </div>
      <button
        v-if="puedeCrear"
        @click="registrarPaciente"
        class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium flex items-center gap-2 transition cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        Registrar Paciente
      </button>
    </div>

    <!-- Buscador y filtro -->
    <div class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 px-6 py-5">
      <div class="flex items-center gap-4">
        <!-- Búsqueda -->
        <div class="flex-1 relative">
          <Search class="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre, expediente o teléfono..."
            class="w-full h-9 pl-10 pr-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
          />
        </div>

        <!-- Filtro estado -->
        <select
          v-model="filtroEstado"
          class="h-9 px-3 bg-white rounded-md border border-slate-200 text-blue-950 text-sm font-medium outline-none focus:border-blue-400 transition cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
    </div>

    <!-- Tabla de pacientes -->
    <div class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 overflow-hidden">
      <!-- Título tabla -->
      <div class="px-6 py-4 border-b border-blue-200">
        <h2 class="text-blue-950 text-base font-medium">
          Lista de Pacientes ({{ pacientesFiltrados.length }})
        </h2>
      </div>

      <!-- Cabecera -->
      <div
        class="grid grid-cols-[100px_1fr_160px_1fr_110px_90px_90px] border-b border-blue-200 px-2"
      >
        <div class="px-2 py-2.5 text-blue-950 text-sm font-medium">Expediente</div>
        <div class="px-2 py-2.5 text-blue-950 text-sm font-medium">Nombre</div>
        <div class="px-2 py-2.5 text-blue-950 text-sm font-medium">Teléfono</div>
        <div class="px-2 py-2.5 text-blue-950 text-sm font-medium">Correo</div>
        <div class="px-2 py-2.5 text-blue-950 text-sm font-medium">Última Visita</div>
        <div class="px-2 py-2.5 text-blue-950 text-sm font-medium">Estado</div>
        <div class="px-2 py-2.5 text-blue-950 text-sm font-medium text-right">Acciones</div>
      </div>

      <!-- Filas -->
      <div v-if="loading" class="px-6 py-8 text-center text-slate-500">
        Cargando pacientes...
      </div>
      <div v-else-if="error" class="px-6 py-8 text-center text-red-500">
        {{ error }}
      </div>
      <div v-else-if="pacientesFiltrados.length === 0" class="px-6 py-8 text-center text-slate-500">
        No se encontraron pacientes.
      </div>
      <div
        v-else
        v-for="paciente in pacientesFiltrados"
        :key="paciente.id"
        class="grid grid-cols-[100px_1fr_160px_1fr_110px_90px_90px] border-b border-blue-200 last:border-b-0 px-2 hover:bg-slate-50 transition"
      >
        <!-- Expediente -->
        <div class="px-2 py-3 flex items-center">
          <span class="text-blue-950 text-sm font-medium">EXP-{{ paciente.id.toString().padStart(3, '0') }}</span>
        </div>

        <!-- Nombre con avatar -->
        <div class="px-2 py-3 flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
            <span class="text-white text-xs">{{ paciente.nombreCompleto.substring(0, 2).toUpperCase() }}</span>
          </div>
          <span class="text-blue-950 text-sm">{{ paciente.nombreCompleto }}</span>
        </div>

        <!-- Teléfono -->
        <div class="px-2 py-3 flex items-center gap-1.5">
          <Phone class="w-4 h-4 text-slate-600 shrink-0" />
          <span class="text-blue-950 text-sm">{{ paciente.celular }}</span>
        </div>

        <!-- Correo -->
        <div class="px-2 py-3 flex items-center gap-1.5">
          <template v-if="paciente.correoElectronico">
            <Mail class="w-4 h-4 text-slate-600 shrink-0" />
            <span class="text-blue-950 text-sm truncate">{{ paciente.correoElectronico }}</span>
          </template>
          <span v-else class="text-slate-600 text-sm">—</span>
        </div>

        <!-- Última visita -->
        <div class="px-2 py-3 flex items-center">
          <span class="text-blue-950 text-sm">{{ new Date(paciente.fechaRegistro).toLocaleDateString() }}</span>
        </div>

        <!-- Estado -->
        <div class="px-2 py-3 flex items-center">
          <span
            :class="[
              'px-2 py-0.5 rounded-md text-white text-xs font-medium',
              paciente.estado !== false ? 'bg-emerald-600' : 'bg-slate-400',
            ]"
          >
            {{ paciente.estado !== false ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <!-- Acciones -->
        <div class="px-2 py-3 flex items-center justify-end gap-1">
          <button
            @click="verPaciente(paciente)"
            class="w-8 h-8 rounded-md flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
            title="Ver detalle"
          >
            <Eye class="w-4 h-4 text-blue-950" />
          </button>
          <button
            v-if="puedeCrear"
            @click="editarPaciente(paciente)"
            class="w-8 h-8 rounded-md flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
            title="Editar"
          >
            <Pencil class="w-4 h-4 text-blue-950" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Drawer registrar paciente -->
  <RegistrarPacienteDrawer v-model="mostrarDrawer" @guardado="onPacienteGuardado" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Phone, Mail, Eye, Pencil } from 'lucide-vue-next'
import RegistrarPacienteDrawer from '../../components/pacientes/RegistrarPacienteDrawer.vue'
import * as personasService from '@/services/personas'
import type { Persona } from '@/types'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const mostrarDrawer = ref(false)
const router = useRouter()
const busqueda = ref('')
const filtroEstado = ref('')

const pacientes = ref<Persona[]>([])
const loading = ref(false)
const error = ref('')

const auth = useAuthStore()
const puedeCrear = computed(() => auth.isAdmin || auth.isRecepcionista)

const pacientesFiltrados = computed(() => {
  return pacientes.value.filter((p) => {
    const coincideBusqueda =
      p.nombreCompleto.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      p.celular.includes(busqueda.value)

    const activoStr = p.estado === false ? 'Inactivo' : 'Activo'
    const coincideEstado = filtroEstado.value === '' || activoStr === filtroEstado.value

    return coincideBusqueda && coincideEstado
  })
})

async function cargarPacientes() {
  loading.value = true
  error.value = ''
  try {
    const data = await personasService.getAll(busqueda.value ? busqueda.value : undefined)
    // The response is { data: Persona[], meta: {...} } or just { data: Persona[] }
    pacientes.value = data.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 403) {
        error.value = 'No tienes permisos para ver pacientes.'
      } else {
        error.value = 'Error al cargar pacientes.'
      }
    } else {
      error.value = 'Error desconocido al cargar pacientes.'
    }
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarPacientes()
})

function registrarPaciente() {
  mostrarDrawer.value = true
}

function verPaciente(paciente: Persona) {
  router.push(`/pacientes/${paciente.id}/historial`)
}

function editarPaciente(paciente: Persona) {
  router.push(`/pacientes/${paciente.id}/editar`)
}

function onPacienteGuardado() {
  toast.success('Paciente guardado correctamente')
  cargarPacientes()
}
</script>
