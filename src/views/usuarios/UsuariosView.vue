<template>
  <div class="p-8 min-h-screen bg-slate-50">

    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Configuración de Usuarios</h1>
        <p class="text-sm text-slate-500 mt-1">Gestión del personal interno del consultorio</p>
      </div>
      <button
        @click="abrirModalNuevo"
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
      >
        <span class="text-lg leading-none">+</span>
        Nuevo Usuario
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 mb-5">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre o correo..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400"
        />
      </div>
      <select v-model="rolFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white">
        <option value="">Todos los roles</option>
        <option value="Administrador">Administrador</option>
        <option value="Dentista">Dentista</option>
        <option value="Recepcionista">Recepcionista</option>
      </select>
      <select v-model="estadoFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white">
        <option value="">Todos los estados</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100">
        <span class="text-sm font-semibold text-slate-700">Lista de Usuarios ({{ usuariosFiltrados.length }})</span>
      </div>
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Nombre Completo</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Correo</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Rol</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Estado</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Fecha de Registro</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Último Acceso</th>
            <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="usuario in usuariosFiltrados" :key="usuario.correo" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  :style="{ backgroundColor: usuario.color }"
                >
                  {{ usuario.iniciales }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">{{ usuario.nombre }}</p>
                  <p class="text-xs text-slate-400">{{ usuario.telefono }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">{{ usuario.correo }}</td>
            <td class="px-4 py-4">
              <span class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white" :class="rolClase(usuario.rol)">
                {{ usuario.rol }}
              </span>
            </td>
            <td class="px-4 py-4">
              <span class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white bg-emerald-500">
                {{ usuario.estado }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">{{ usuario.fechaRegistro }}</td>
            <td class="px-4 py-4 text-sm text-slate-600">{{ usuario.ultimoAcceso }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2">
                <button @click="abrirModalEditar(usuario)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="p-1.5 text-red-400 hover:bg-red-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="17" y1="8" x2="23" y2="14"/>
                    <line x1="23" y1="8" x2="17" y2="14"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ─────────────────────────────────────────
         MODAL: REGISTRAR NUEVO USUARIO
    ───────────────────────────────────────── -->
    <div v-if="modalNuevoAbierto" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="cerrarModalNuevo"></div>

      <!-- Panel -->
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-7">
        <!-- Header modal -->
        <div class="flex items-start justify-between mb-1">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Registrar Nuevo Usuario</h2>
            <p class="text-sm text-slate-500 mt-0.5">Completa el formulario para dar de alta un nuevo usuario</p>
          </div>
          <button @click="cerrarModalNuevo" class="text-slate-400 hover:text-slate-600 ml-4 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="mt-5 flex flex-col gap-4">
          <!-- Nombre + Apellidos -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nombre(s) <span class="text-red-500">*</span></label>
              <input v-model="nuevoUsuario.nombre" type="text" placeholder="Nombre" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Apellidos <span class="text-red-500">*</span></label>
              <input v-model="nuevoUsuario.apellidos" type="text" placeholder="Apellidos" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
          </div>

          <!-- Correo + Teléfono -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico <span class="text-red-500">*</span></label>
              <input v-model="nuevoUsuario.correo" type="email" placeholder="correo@ejemplo.com" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono de Contacto</label>
              <input v-model="nuevoUsuario.telefono" type="text" placeholder="+52 55 1234 5678" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Rol Asignado <span class="text-red-500">*</span></label>
            <select v-model="nuevoUsuario.rol" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 bg-white">
              <option value="Recepcionista">Recepcionista</option>
              <option value="Dentista">Dentista</option>
              <option value="Administrador">Administrador</option>
            </select>
            <p class="text-xs text-slate-400 mt-1">El rol determina los permisos y accesos del usuario en el sistema</p>
          </div>

          <!-- Contraseña temporal -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña Temporal <span class="text-red-500">*</span></label>
            <input v-model="nuevoUsuario.contrasena" type="password" placeholder="••••••••" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            <p class="text-xs text-slate-400 mt-1">El usuario deberá cambiar esta contraseña en su primer inicio de sesión</p>
          </div>

          <!-- Foto de perfil -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Foto de Perfil</label>
            <input type="file" accept=".jpg,.png" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 outline-none focus:border-blue-400" />
            <p class="text-xs text-slate-400 mt-1">Formatos permitidos: JPG, PNG (máximo 2MB)</p>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 mt-6">
          <button @click="cerrarModalNuevo" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
            Cancelar
          </button>
          <button @click="guardarNuevoUsuario" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Guardar Usuario
          </button>
        </div>
      </div>
    </div>

    <!-- ─────────────────────────────────────────
         MODAL: EDITAR USUARIO
    ───────────────────────────────────────── -->
    <div v-if="modalEditarAbierto && usuarioEditando" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="cerrarModalEditar"></div>

      <!-- Panel -->
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-7">
        <!-- Header modal -->
        <div class="flex items-start justify-between mb-1">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Editar Usuario</h2>
            <p class="text-sm text-slate-500 mt-0.5">Modifica los datos del usuario del sistema</p>
          </div>
          <button @click="cerrarModalEditar" class="text-slate-400 hover:text-slate-600 ml-4 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="mt-5 flex flex-col gap-4">
          <!-- Nombre + Apellidos -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nombre(s) <span class="text-red-500">*</span></label>
              <input v-model="usuarioEditando.editNombre" type="text" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Apellidos <span class="text-red-500">*</span></label>
              <input v-model="usuarioEditando.editApellidos" type="text" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
          </div>

          <!-- Correo + Teléfono -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico <span class="text-red-500">*</span></label>
              <input v-model="usuarioEditando.correo" type="email" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono de Contacto</label>
              <input v-model="usuarioEditando.telefono" type="text" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Rol Asignado <span class="text-red-500">*</span></label>
            <select v-model="usuarioEditando.rol" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 bg-white">
              <option value="Recepcionista">Recepcionista</option>
              <option value="Dentista">Dentista</option>
              <option value="Administrador">Administrador</option>
            </select>
            <p class="text-xs text-slate-400 mt-1">El rol determina los permisos y accesos del usuario en el sistema</p>
          </div>

          <!-- Estado del usuario -->
          <div class="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-700">Estado del Usuario</p>
              <p class="text-xs text-slate-500 mt-0.5">El usuario puede acceder al sistema</p>
            </div>
            <button
              @click="usuarioEditando.activo = !usuarioEditando.activo"
              :class="usuarioEditando.activo ? 'bg-blue-500' : 'bg-slate-300'"
              class="relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none shrink-0"
            >
              <span
                :class="usuarioEditando.activo ? 'translate-x-5' : 'translate-x-1'"
                class="inline-block w-4 h-4 mt-1 bg-white rounded-full shadow transition-transform"
              ></span>
            </button>
          </div>

          <!-- Foto de perfil -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Foto de Perfil</label>
            <input type="file" accept=".jpg,.png" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 outline-none focus:border-blue-400" />
            <p class="text-xs text-slate-400 mt-1">Formatos permitidos: JPG, PNG (máximo 2MB)</p>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 mt-6">
          <button @click="cerrarModalEditar" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
            Cancelar
          </button>
          <button @click="actualizarUsuario" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Actualizar Usuario
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// ── Filtros ──────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const rolFiltro = ref('')
const estadoFiltro = ref('')

// ── Datos ────────────────────────────────────────────────────────────────────
interface Usuario {
  nombre: string
  iniciales: string
  color: string
  telefono: string
  correo: string
  rol: string
  estado: string
  fechaRegistro: string
  ultimoAcceso: string
  activo: boolean
  editNombre?: string
  editApellidos?: string
}

const usuarios = ref<Usuario[]>([
  {
    nombre: 'Carlos Martínez González',
    iniciales: 'CM',
    color: '#2563eb',
    telefono: '+52 55 1234 5678',
    correo: 'admin@dentalsys.com',
    rol: 'Administrador',
    estado: 'Activo',
    fechaRegistro: '14/1/2024',
    ultimoAcceso: '18/3/2026',
    activo: true,
  },
  {
    nombre: 'Ana Rodríguez López',
    iniciales: 'AR',
    color: '#0891b2',
    telefono: '+52 55 2345 6789',
    correo: 'ana.rodriguez@dentalsys.com',
    rol: 'Dentista',
    estado: 'Activo',
    fechaRegistro: '31/1/2024',
    ultimoAcceso: '18/3/2026',
    activo: true,
  },
  {
    nombre: 'Miguel Hernández Ramírez',
    iniciales: 'MH',
    color: '#1d4ed8',
    telefono: '+52 55 3456 7890',
    correo: 'miguel.hernandez@dentalsys.com',
    rol: 'Dentista',
    estado: 'Activo',
    fechaRegistro: '14/2/2024',
    ultimoAcceso: '17/3/2026',
    activo: true,
  },
  {
    nombre: 'Laura Sánchez Morales',
    iniciales: 'LS',
    color: '#2563eb',
    telefono: '+52 55 4567 8901',
    correo: 'laura.sanchez@dentalsys.com',
    rol: 'Recepcionista',
    estado: 'Activo',
    fechaRegistro: '29/2/2024',
    ultimoAcceso: '18/3/2026',
    activo: true,
  },
])

const usuariosFiltrados = computed(() =>
  usuarios.value.filter((u) => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q)
    const matchRol = rolFiltro.value === '' || u.rol === rolFiltro.value
    const matchEstado = estadoFiltro.value === '' || u.estado === estadoFiltro.value
    return matchSearch && matchRol && matchEstado
  })
)

const rolClase = (rol: string) => {
  if (rol === 'Administrador') return 'bg-slate-800'
  if (rol === 'Dentista') return 'bg-blue-500'
  if (rol === 'Recepcionista') return 'bg-slate-500'
  return 'bg-slate-400'
}

// ── Modal Nuevo Usuario ───────────────────────────────────────────────────────
const modalNuevoAbierto = ref(false)

const nuevoUsuario = reactive({
  nombre: '',
  apellidos: '',
  correo: '',
  telefono: '',
  rol: 'Recepcionista',
  contrasena: '',
})

function abrirModalNuevo() {
  modalNuevoAbierto.value = true
}

function cerrarModalNuevo() {
  modalNuevoAbierto.value = false
  nuevoUsuario.nombre = ''
  nuevoUsuario.apellidos = ''
  nuevoUsuario.correo = ''
  nuevoUsuario.telefono = ''
  nuevoUsuario.rol = 'Recepcionista'
  nuevoUsuario.contrasena = ''
}

function guardarNuevoUsuario() {
  if (!nuevoUsuario.nombre || !nuevoUsuario.apellidos || !nuevoUsuario.correo) return
  const iniciales = (nuevoUsuario.nombre[0] + nuevoUsuario.apellidos[0]).toUpperCase()
  usuarios.value.push({
    nombre: `${nuevoUsuario.nombre} ${nuevoUsuario.apellidos}`,
    iniciales,
    color: '#2563eb',
    telefono: nuevoUsuario.telefono,
    correo: nuevoUsuario.correo,
    rol: nuevoUsuario.rol,
    estado: 'Activo',
    fechaRegistro: new Date().toLocaleDateString('es-MX'),
    ultimoAcceso: '-',
    activo: true,
  })
  cerrarModalNuevo()
}

// ── Modal Editar Usuario ──────────────────────────────────────────────────────
const modalEditarAbierto = ref(false)
const usuarioEditando = ref<Usuario | null>(null)

function abrirModalEditar(usuario: Usuario) {
  const partes = usuario.nombre.split(' ')
  usuarioEditando.value = {
    ...usuario,
    editNombre: partes[0] ?? '',
    editApellidos: partes.slice(1).join(' ') ?? '',
  }
  modalEditarAbierto.value = true
}

function cerrarModalEditar() {
  modalEditarAbierto.value = false
  usuarioEditando.value = null
}

function actualizarUsuario() {
  if (!usuarioEditando.value) return
  const idx = usuarios.value.findIndex((u) => u.correo === usuarioEditando.value!.correo)
  if (idx !== -1) {
    const u = usuarioEditando.value
    usuarios.value[idx] = {
      ...usuarios.value[idx],
      nombre: `${u.editNombre} ${u.editApellidos}`,
      correo: u.correo,
      telefono: u.telefono,
      rol: u.rol,
      activo: u.activo,
      estado: u.activo ? 'Activo' : 'Inactivo',
    }
  }
  cerrarModalEditar()
}
</script>