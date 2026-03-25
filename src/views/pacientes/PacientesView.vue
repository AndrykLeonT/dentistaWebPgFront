<template>
  <div class="flex flex-col gap-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-blue-950 text-3xl font-normal">Pacientes</h1>
        <p class="text-slate-600 text-sm mt-1">Gestión de expedientes y datos de pacientes</p>
      </div>
      <button
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
      <div
        v-for="paciente in pacientesFiltrados"
        :key="paciente.id"
        class="grid grid-cols-[100px_1fr_160px_1fr_110px_90px_90px] border-b border-blue-200 last:border-b-0 px-2 hover:bg-slate-50 transition"
      >
        <!-- Expediente -->
        <div class="px-2 py-3 flex items-center">
          <span class="text-blue-950 text-sm font-medium">{{ paciente.expediente }}</span>
        </div>

        <!-- Nombre con avatar -->
        <div class="px-2 py-3 flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
            <span class="text-white text-xs">{{ paciente.iniciales }}</span>
          </div>
          <span class="text-blue-950 text-sm">{{ paciente.nombre }}</span>
        </div>

        <!-- Teléfono -->
        <div class="px-2 py-3 flex items-center gap-1.5">
          <Phone class="w-4 h-4 text-slate-600 shrink-0" />
          <span class="text-blue-950 text-sm">{{ paciente.telefono }}</span>
        </div>

        <!-- Correo -->
        <div class="px-2 py-3 flex items-center gap-1.5">
          <template v-if="paciente.correo">
            <Mail class="w-4 h-4 text-slate-600 shrink-0" />
            <span class="text-blue-950 text-sm truncate">{{ paciente.correo }}</span>
          </template>
          <span v-else class="text-slate-600 text-sm">—</span>
        </div>

        <!-- Última visita -->
        <div class="px-2 py-3 flex items-center">
          <span class="text-blue-950 text-sm">{{ paciente.ultimaVisita }}</span>
        </div>

        <!-- Estado -->
        <div class="px-2 py-3 flex items-center">
          <span
            :class="[
              'px-2 py-0.5 rounded-md text-white text-xs font-medium',
              paciente.estado === 'Activo' ? 'bg-emerald-600' : 'bg-slate-400',
            ]"
          >
            {{ paciente.estado }}
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Phone, Mail, Eye, Pencil } from 'lucide-vue-next'
import RegistrarPacienteDrawer from '../../components/pacientes/RegistrarPacienteDrawer.vue'

const mostrarDrawer = ref(false)
const router = useRouter()
const busqueda = ref('')
const filtroEstado = ref('')

interface Paciente {
  id: number
  expediente: string
  iniciales: string
  nombre: string
  telefono: string
  correo: string
  ultimaVisita: string
  estado: string
}

const pacientes: Paciente[] = [
  {
    id: 1,
    expediente: 'EXP-001',
    iniciales: 'MG',
    nombre: 'María García Pérez',
    telefono: '+52 55 1111 2222',
    correo: 'maria.garcia@email.com',
    ultimaVisita: '14/3/2026',
    estado: 'Activo',
  },
  {
    id: 2,
    expediente: 'EXP-002',
    iniciales: 'RM',
    nombre: 'Roberto Mendoza Silva',
    telefono: '+52 55 2222 3333',
    correo: 'roberto.mendoza@email.com',
    ultimaVisita: '9/3/2026',
    estado: 'Activo',
  },
  {
    id: 3,
    expediente: 'EXP-003',
    iniciales: 'ST',
    nombre: 'Sofía Torres Ramírez',
    telefono: '+52 55 3333 4444',
    correo: 'sofia.torres@email.com',
    ultimaVisita: '11/3/2026',
    estado: 'Activo',
  },
  {
    id: 4,
    expediente: 'EXP-004',
    iniciales: 'JF',
    nombre: 'Jorge Flores Castillo',
    telefono: '+52 55 4444 5555',
    correo: '',
    ultimaVisita: '7/3/2026',
    estado: 'Activo',
  },
  {
    id: 5,
    expediente: 'EXP-005',
    iniciales: 'PR',
    nombre: 'Patricia Ruiz Moreno',
    telefono: '+52 55 5555 6666',
    correo: 'patricia.ruiz@email.com',
    ultimaVisita: '4/3/2026',
    estado: 'Activo',
  },
]

const pacientesFiltrados = computed(() => {
  return pacientes.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      p.expediente.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      p.telefono.includes(busqueda.value)

    const coincideEstado = filtroEstado.value === '' || p.estado === filtroEstado.value

    return coincideBusqueda && coincideEstado
  })
})

function registrarPaciente() {
  mostrarDrawer.value = true
}

function verPaciente(paciente: Paciente) {
  router.push(`/pacientes/${paciente.id}/historial`)
}

function editarPaciente(paciente: Paciente) {
  router.push(`/pacientes/${paciente.id}/editar`)
}

function onPacienteGuardado(datos: any) {
  console.log('Paciente guardado:', datos)
  // Aquí se conectará con la API en el futuro
}
</script>
