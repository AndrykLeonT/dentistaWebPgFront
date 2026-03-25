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
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Apellidos *</label>
              <input
                v-model="form.apellidos"
                type="text"
                placeholder="Apellidos"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Fecha de Nacimiento *</label>
              <input
                v-model="form.fechaNacimiento"
                type="date"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Género *</label>
              <select
                v-model="form.genero"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition cursor-pointer"
              >
                <option value="">Selecciona</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Información de Contacto -->
        <section class="flex flex-col gap-4">
          <h3 class="text-blue-950 text-lg font-medium">Información de Contacto</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Teléfono Principal *</label>
              <input
                v-model="form.telefonoPrincipal"
                type="text"
                placeholder="+52 55 1234 5678"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Teléfono Secundario</label>
              <input
                v-model="form.telefonoSecundario"
                type="text"
                placeholder="+52 55 8765 4321"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2 col-span-2">
              <label class="text-blue-950 text-sm font-medium">Correo Electrónico</label>
              <input
                v-model="form.correo"
                type="email"
                placeholder="correo@ejemplo.com"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>
        </section>

        <!-- Dirección -->
        <section class="flex flex-col gap-4">
          <h3 class="text-blue-950 text-lg font-medium">Dirección</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Calle</label>
              <input
                v-model="form.calle"
                type="text"
                placeholder="Calle"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Número</label>
              <input
                v-model="form.numero"
                type="text"
                placeholder="Número"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Colonia</label>
              <input
                v-model="form.colonia"
                type="text"
                placeholder="Colonia"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Ciudad</label>
              <input
                v-model="form.ciudad"
                type="text"
                placeholder="Ciudad"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Código Postal</label>
              <input
                v-model="form.codigoPostal"
                type="text"
                placeholder="00000"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>
        </section>

        <!-- Información Médica -->
        <section class="flex flex-col gap-4">
          <h3 class="text-blue-950 text-lg font-medium">Información Médica</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Tipo de Sangre</label>
              <select
                v-model="form.tipoSangre"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition cursor-pointer"
              >
                <option value="">Selecciona</option>
                <option v-for="tipo in tiposSangre" :key="tipo" :value="tipo">{{ tipo }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Alergias Conocidas</label>
              <input
                v-model="form.alergias"
                type="text"
                placeholder="Ej: Penicilina, Látex"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2 col-span-2">
              <label class="text-blue-950 text-sm font-medium"
                >Enfermedades o Condiciones Médicas</label
              >
              <textarea
                v-model="form.condicionesMedicas"
                rows="3"
                placeholder="Describe condiciones médicas relevantes..."
                class="px-3 py-2 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition resize-none"
              />
            </div>
            <div class="flex flex-col gap-2 col-span-2">
              <label class="text-blue-950 text-sm font-medium">Medicamentos Actuales</label>
              <textarea
                v-model="form.medicamentos"
                rows="3"
                placeholder="Lista de medicamentos que toma actualmente..."
                class="px-3 py-2 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition resize-none"
              />
            </div>
          </div>
        </section>

        <!-- Contacto de Emergencia -->
        <section class="flex flex-col gap-4">
          <h3 class="text-blue-950 text-lg font-medium">Contacto de Emergencia</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Nombre</label>
              <input
                v-model="form.contactoEmergenciaNombre"
                type="text"
                placeholder="Nombre del contacto"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Teléfono</label>
              <input
                v-model="form.contactoEmergenciaTel"
                type="text"
                placeholder="+52 55 1234 5678"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Footer con botones -->
      <div class="px-6 py-4 border-t border-blue-200 flex justify-end gap-2 shrink-0 bg-slate-50">
        <button
          @click="cerrar"
          class="h-9 px-4 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 text-blue-950 text-sm font-medium transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          @click="guardar"
          class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer"
        >
          Guardar Paciente
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { X } from 'lucide-vue-next'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'guardado'])

const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const form = reactive({
  nombre: '',
  apellidos: '',
  fechaNacimiento: '',
  genero: '',
  telefonoPrincipal: '',
  telefonoSecundario: '',
  correo: '',
  calle: '',
  numero: '',
  colonia: '',
  ciudad: '',
  codigoPostal: '',
  tipoSangre: '',
  alergias: '',
  condicionesMedicas: '',
  medicamentos: '',
  contactoEmergenciaNombre: '',
  contactoEmergenciaTel: '',
})

function cerrar() {
  emit('update:modelValue', false)
}

function guardar() {
  // Sin validación por ahora — listo para conectar con API
  emit('guardado', { ...form })
  cerrar()
}
</script>
