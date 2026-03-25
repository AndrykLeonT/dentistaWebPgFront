<template>
  <div class="p-8 min-h-screen bg-slate-50">

    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Servicios</h1>
        <p class="text-sm text-slate-500 mt-1">Catálogo de tratamientos y servicios ofrecidos</p>
      </div>
      <button
        @click="abrirModalNuevo"
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
      >
        <span class="text-lg leading-none">+</span>
        Nuevo Servicio
      </button>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 mb-5">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar servicio..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400"
        />
      </div>
      <select v-model="categoriaFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="estadoFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 outline-none focus:border-blue-400 bg-white">
        <option value="">Todos los estados</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100">
        <span class="text-sm font-semibold text-slate-700">Catálogo de Servicios ({{ serviciosFiltrados.length }})</span>
      </div>
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Nombre</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Categoría</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Duración</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Precio</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Sesiones</th>
            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Estado</th>
            <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="servicio in serviciosFiltrados" :key="servicio.nombre" class="hover:bg-slate-50">
            <td class="px-6 py-4 text-sm font-medium text-slate-800">{{ servicio.nombre }}</td>
            <td class="px-4 py-4">
              <span class="inline-block px-2.5 py-0.5 rounded border text-xs font-medium" :class="categoriaClase(servicio.categoria)">
                {{ servicio.categoria }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">
              <div class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {{ servicio.duracion }} min
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">
              <div class="flex items-center gap-1">
                <span class="text-slate-400 text-xs">$</span>
                {{ servicio.precio.toLocaleString('es-MX') }}
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-slate-600">{{ sesionesLabel(servicio) }}</td>
            <td class="px-4 py-4">
              <span class="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white bg-emerald-500">
                {{ servicio.estado }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2">
                <button class="p-1.5 text-red-400 hover:bg-red-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="17" y1="8" x2="23" y2="14"/>
                    <line x1="23" y1="8" x2="17" y2="14"/>
                  </svg>
                </button>
                <button @click="abrirModalEditar(servicio)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
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
          <button @click="cerrarModalNuevo" class="text-slate-400 hover:text-slate-600 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="mt-5 flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Servicio <span class="text-red-500">*</span></label>
            <input v-model="nuevoServicio.nombre" type="text" placeholder="Ej: Limpieza Dental"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Categoría <span class="text-red-500">*</span></label>
            <select v-model="nuevoServicio.categoria" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 bg-white">
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea v-model="nuevoServicio.descripcion" rows="3" placeholder="Describe en qué consiste el servicio..."
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 resize-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Duración Estimada (minutos) <span class="text-red-500">*</span></label>
              <input v-model.number="nuevoServicio.duracion" type="number" placeholder="60"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Precio Base (MXN) <span class="text-red-500">*</span></label>
              <input v-model.number="nuevoServicio.precio" type="number" placeholder="1000"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input v-model="nuevoServicio.multipleSesiones" type="checkbox" id="sesiones-nuevo" class="w-4 h-4 accent-blue-600" />
            <label for="sesiones-nuevo" class="text-sm text-slate-700">¿Requiere múltiples sesiones?</label>
          </div>

          <div v-if="nuevoServicio.multipleSesiones">
            <label class="block text-sm font-medium text-slate-700 mb-1">Número de sesiones</label>
            <input v-model.number="nuevoServicio.numSesiones" type="number" placeholder="2"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Notas para el Dentista</label>
            <textarea v-model="nuevoServicio.notas" rows="3" placeholder="Instrucciones internas o consideraciones especiales..."
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 resize-none"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="cerrarModalNuevo" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
          <button @click="guardarServicio" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Guardar Servicio</button>
        </div>
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
          <button @click="cerrarModalEditar" class="text-slate-400 hover:text-slate-600 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="mt-5 flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre del Servicio <span class="text-red-500">*</span></label>
            <input v-model="servicioEditando.nombre" type="text"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Categoría <span class="text-red-500">*</span></label>
            <select v-model="servicioEditando.categoria" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 bg-white">
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea v-model="servicioEditando.descripcion" rows="3"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Duración (minutos) <span class="text-red-500">*</span></label>
              <input v-model.number="servicioEditando.duracion" type="number"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Precio Base (MXN) <span class="text-red-500">*</span></label>
              <input v-model.number="servicioEditando.precio" type="number"
                class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="servicioEditando.multipleSesiones" type="checkbox" id="sesiones-editar" class="w-4 h-4 accent-blue-600" />
            <label for="sesiones-editar" class="text-sm text-slate-700">¿Requiere múltiples sesiones?</label>
          </div>
          <div v-if="servicioEditando.multipleSesiones">
            <label class="block text-sm font-medium text-slate-700 mb-1">Número de sesiones</label>
            <input v-model.number="servicioEditando.numSesiones" type="number"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400" />
          </div>
          <div class="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-700">Estado del Servicio</p>
              <p class="text-xs text-slate-500 mt-0.5">El servicio aparece disponible para agendar</p>
            </div>
            <button
              @click="servicioEditando.activo = !servicioEditando.activo"
              :class="servicioEditando.activo ? 'bg-blue-500' : 'bg-slate-300'"
              class="relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none shrink-0"
            >
              <span :class="servicioEditando.activo ? 'translate-x-5' : 'translate-x-1'"
                class="inline-block w-4 h-4 mt-1 bg-white rounded-full shadow transition-transform"></span>
            </button>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Notas para el Dentista</label>
            <textarea v-model="servicioEditando.notas" rows="3"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 resize-none"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="cerrarModalEditar" class="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
          <button @click="actualizarServicio" class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Actualizar Servicio</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'



// ── Tipos
interface Servicio {
  nombre: string
  categoria: string
  descripcion: string
  duracion: number
  precio: number
  multipleSesiones: boolean
  numSesiones: number
  notas: string
  estado: string
  activo: boolean
}

//Catálogo de categorías 
const categorias = ['Preventivo', 'Restaurativo', 'Estético', 'Cirugía', 'Ortodoncia']

//Filtros
const searchQuery = ref('')
const categoriaFiltro = ref('')
const estadoFiltro = ref('')

//Datos
const servicios = ref<Servicio[]>([
  { nombre: 'Limpieza Dental', categoria: 'Preventivo', descripcion: '', duracion: 60, precio: 800, multipleSesiones: false, numSesiones: 1, notas: '', estado: 'Activo', activo: true },
  { nombre: 'Resina Dental', categoria: 'Restaurativo', descripcion: '', duracion: 45, precio: 1200, multipleSesiones: false, numSesiones: 1, notas: '', estado: 'Activo', activo: true },
  { nombre: 'Blanqueamiento Dental', categoria: 'Estético', descripcion: '', duracion: 90, precio: 3500, multipleSesiones: false, numSesiones: 1, notas: '', estado: 'Activo', activo: true },
  { nombre: 'Extracción Simple', categoria: 'Cirugía', descripcion: '', duracion: 30, precio: 800, multipleSesiones: false, numSesiones: 1, notas: '', estado: 'Activo', activo: true },
  { nombre: 'Ortodoncia (Brackets)', categoria: 'Ortodoncia', descripcion: '', duracion: 60, precio: 25000, multipleSesiones: true, numSesiones: 24, notas: '', estado: 'Activo', activo: true },
  { nombre: 'Corona de Porcelana', categoria: 'Restaurativo', descripcion: '', duracion: 90, precio: 5000, multipleSesiones: true, numSesiones: 2, notas: '', estado: 'Activo', activo: true },
  { nombre: 'Endodoncia (Conducto)', categoria: 'Restaurativo', descripcion: '', duracion: 120, precio: 3500, multipleSesiones: false, numSesiones: 1, notas: '', estado: 'Activo', activo: true },
  { nombre: 'Consulta General', categoria: 'Preventivo', descripcion: '', duracion: 30, precio: 300, multipleSesiones: false, numSesiones: 1, notas: '', estado: 'Activo', activo: true },
])

const serviciosFiltrados = computed(() =>
  servicios.value.filter((s) => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = s.nombre.toLowerCase().includes(q)
    const matchCat = categoriaFiltro.value === '' || s.categoria === categoriaFiltro.value
    const matchEstado = estadoFiltro.value === '' || s.estado === estadoFiltro.value
    return matchSearch && matchCat && matchEstado
  })
)

const sesionesLabel = (s: Servicio) =>
  s.multipleSesiones ? `${s.numSesiones} sesiones` : 'Única'

const categoriaClase = (cat: string) => {
  return 'border-blue-400 text-blue-500 bg-white'
}

//Modal Nuevo
const modalNuevoAbierto = ref(false)

const nuevoServicio = reactive<Omit<Servicio, 'estado' | 'activo'>>({
  nombre: '', categoria: 'Preventivo', descripcion: '',
  duracion: 60, precio: 1000, multipleSesiones: false, numSesiones: 1, notas: '',
})

function abrirModalNuevo() { modalNuevoAbierto.value = true }

function cerrarModalNuevo() {
  modalNuevoAbierto.value = false
  Object.assign(nuevoServicio, { nombre: '', categoria: 'Preventivo', descripcion: '', duracion: 60, precio: 1000, multipleSesiones: false, numSesiones: 1, notas: '' })
}

function guardarServicio() {
  if (!nuevoServicio.nombre) return
  servicios.value.push({ ...nuevoServicio, estado: 'Activo', activo: true })
  cerrarModalNuevo()
}

//Modal Editar
const modalEditarAbierto = ref(false)
const servicioEditando = ref<Servicio | null>(null)

function abrirModalEditar(servicio: Servicio) {
  servicioEditando.value = { ...servicio }
  modalEditarAbierto.value = true
}

function cerrarModalEditar() {
  modalEditarAbierto.value = false
  servicioEditando.value = null
}

function actualizarServicio() {
  if (!servicioEditando.value) return
  const idx = servicios.value.findIndex((s) => s.nombre === servicioEditando.value!.nombre)
  if (idx !== -1) {
    const s = servicioEditando.value
    servicios.value[idx] = { ...s, estado: s.activo ? 'Activo' : 'Inactivo' }
  }
  cerrarModalEditar()
}
</script>