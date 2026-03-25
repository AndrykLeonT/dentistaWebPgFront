<template>
  <div class="p-8 min-h-screen bg-slate-50">

    <!-- Header -->
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

    <!-- Filtros -->
    <div class="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 mb-5">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar servicio..."
        class="flex-1 pl-3 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400"
      />

      <select v-model="categoriaFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
        <option value="">Todas las categorías</option>
        <option value="Preventivo">Preventivo</option>
        <option value="Restaurativo">Restaurativo</option>
        <option value="Estético">Estético</option>
        <option value="Cirugía">Cirugía</option>
        <option value="Ortodoncia">Ortodoncia</option>
      </select>

      <select v-model="estadoFiltro" class="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400">
        <option value="">Todos los estados</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100">
        <span class="text-sm font-semibold text-slate-700">
          Catálogo de Servicios ({{ serviciosFiltrados.length }})
        </span>
      </div>

      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs text-slate-500 uppercase">Nombre</th>
            <th class="px-4 py-3 text-left text-xs text-slate-500 uppercase">Categoría</th>
            <th class="px-4 py-3 text-left text-xs text-slate-500 uppercase">Duración</th>
            <th class="px-4 py-3 text-left text-xs text-slate-500 uppercase">Precio</th>
            <th class="px-4 py-3 text-left text-xs text-slate-500 uppercase">Sesiones</th>
            <th class="px-4 py-3 text-left text-xs text-slate-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-right text-xs text-slate-500 uppercase">Acciones</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr v-for="s in serviciosFiltrados" :key="s.nombre" class="hover:bg-slate-50">
            <td class="px-6 py-4 text-sm font-semibold text-slate-800">{{ s.nombre }}</td>

            <td class="px-4 py-4">
              <span class="px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-600">
                {{ s.categoria }}
              </span>
            </td>

            <td class="px-4 py-4 text-sm text-slate-600">
              ⏱ {{ s.duracion }} min
            </td>

            <td class="px-4 py-4 text-sm text-slate-600">
              $ {{ s.precio }}
            </td>

            <td class="px-4 py-4 text-sm text-slate-600">
              {{ s.sesiones > 1 ? s.sesiones + ' sesiones' : 'Única' }}
            </td>

            <td class="px-4 py-4">
              <span class="px-3 py-1 text-xs font-semibold text-white bg-emerald-500 rounded-md">
                {{ s.estado }}
              </span>
            </td>

            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button @click="abrirModalEditar(s)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md">
                  ✏️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL NUEVO -->
    <div v-if="modalNuevo" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="modalNuevo=false"></div>

      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-7">
        <h2 class="text-lg font-bold mb-4">Registrar Nuevo Servicio</h2>

        <div class="flex flex-col gap-3">
          <input v-model="nuevo.nombre" placeholder="Nombre"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"/>

          <select v-model="nuevo.categoria"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option>Preventivo</option>
            <option>Restaurativo</option>
            <option>Estético</option>
            <option>Cirugía</option>
            <option>Ortodoncia</option>
          </select>

          <textarea v-model="nuevo.descripcion" placeholder="Descripción"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"></textarea>

          <div class="grid grid-cols-2 gap-3">
            <input v-model.number="nuevo.duracion" type="number" placeholder="Duración"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"/>

            <input v-model.number="nuevo.precio" type="number" placeholder="Precio"
              class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"/>
          </div>

          <label class="text-sm">
            <input type="checkbox" v-model="nuevo.multiple" />
            ¿Requiere múltiples sesiones?
          </label>

          <input v-if="nuevo.multiple" v-model.number="nuevo.sesiones" type="number"
            placeholder="Número de sesiones"
            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"/>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="modalNuevo=false"
            class="px-5 py-2 text-sm border rounded-lg">
            Cancelar
          </button>

          <button @click="guardar"
            class="px-5 py-2 text-sm text-white bg-blue-600 rounded-lg">
            Guardar Servicio
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL EDITAR -->
    <div v-if="modalEditar && editando" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="modalEditar=false"></div>

      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-7">
        <h2 class="text-lg font-bold mb-4">Editar Servicio</h2>

        <input v-model="editando.nombre"
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-3"/>

        <input v-model.number="editando.precio"
          class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"/>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="modalEditar=false"
            class="px-5 py-2 text-sm border rounded-lg">
            Cancelar
          </button>

          <button @click="actualizar"
            class="px-5 py-2 text-sm text-white bg-blue-600 rounded-lg">
            Actualizar Servicio
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const categoriaFiltro = ref('')
const estadoFiltro = ref('')

const servicios = ref([
  { nombre:'Limpieza Dental', categoria:'Preventivo', duracion:60, precio:800, sesiones:1, estado:'Activo' },
  { nombre:'Ortodoncia (Brackets)', categoria:'Ortodoncia', duracion:60, precio:25000, sesiones:24, estado:'Activo' }
])

const serviciosFiltrados = computed(() =>
  servicios.value.filter(s =>
    s.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (!categoriaFiltro.value || s.categoria === categoriaFiltro.value) &&
    (!estadoFiltro.value || s.estado === estadoFiltro.value)
  )
)

const modalNuevo = ref(false)
const modalEditar = ref(false)
const editando = ref<any>(null)

const nuevo = ref({
  nombre:'', categoria:'Preventivo', descripcion:'',
  duracion:0, precio:0, multiple:false, sesiones:1
})

function abrirModalNuevo(){
  modalNuevo.value = true
}

function abrirModalEditar(s:any){
  editando.value = { ...s }
  modalEditar.value = true
}

function guardar(){
  servicios.value.push({
    nombre:nuevo.value.nombre,
    categoria:nuevo.value.categoria,
    duracion:nuevo.value.duracion,
    precio:nuevo.value.precio,
    sesiones:nuevo.value.multiple ? nuevo.value.sesiones : 1,
    estado:'Activo'
  })
  modalNuevo.value = false
}

function actualizar(){
  const i = servicios.value.findIndex(s => s.nombre === editando.value.nombre)
  if(i !== -1){
    servicios.value[i] = editando.value
  }
  modalEditar.value = false
}
</script>