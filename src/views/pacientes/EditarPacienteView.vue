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
          class="h-9 px-4 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 text-blue-950 text-sm font-medium transition cursor-pointer flex items-center gap-2"
        >
          <X class="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="button"
          class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center gap-2"
        >
          <Save class="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>
    </div>

    <!-- Main Info Box -->
    <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div class="w-20 h-20 bg-blue-500 rounded-full flex justify-center items-center shrink-0">
          <span class="text-white text-2xl font-normal">{{ paciente.iniciales }}</span>
        </div>

        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Nombre</span>
            <span class="text-blue-950 text-base font-medium leading-6">
              {{ paciente.nombreCompleto }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Expediente</span>
            <span class="text-blue-950 text-base font-medium leading-6">{{
              paciente.expediente
            }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Estado</span>
            <span
              :class="[
                'px-2 py-0.5 rounded-md text-white text-xs font-medium inline-block mt-1 max-w-fit',
                form.estado === 'Activo' ? 'bg-emerald-600' : 'bg-slate-400',
              ]"
            >
              {{ form.estado }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Última visita</span>
            <span class="text-blue-950 text-base leading-6">{{ paciente.ultimaVisita }}</span>
          </div>
        </div>
      </div>

      <!-- Alert Box (solo UI) -->
      <div
        v-if="form.alergias"
        class="bg-red-50 rounded-lg outline outline-[1px] outline-rose-600 px-4 py-3 flex items-center gap-2"
      >
        <AlertCircle class="w-4 h-4 text-rose-600" />
        <span class="text-rose-600 text-sm font-medium leading-5"
          >Alergias: {{ form.alergias }}</span
        >
      </div>
    </div>

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <!-- Left: Sections -->
      <div class="flex flex-col gap-6">
        <!-- Datos Personales -->
        <div
          class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6"
        >
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
                <option value="Prefiero no decir">Prefiero no decir</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Estado</label>
              <select
                v-model="form.estado"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition cursor-pointer"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">No. Expediente</label>
              <input
                v-model="form.expediente"
                type="text"
                placeholder="EXP-000"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>
        </div>

        <!-- Contacto -->
        <div
          class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6"
        >
          <div class="flex items-center gap-2">
            <Phone class="w-5 h-5 text-blue-500" />
            <h2 class="text-blue-950 text-base font-medium">Contacto</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div class="flex flex-col gap-2 sm:col-span-2">
              <label class="text-blue-950 text-sm font-medium">Correo Electrónico</label>
              <input
                v-model="form.correo"
                type="email"
                placeholder="correo@ejemplo.com"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>
        </div>

        <!-- Dirección -->
        <div
          class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6"
        >
          <div class="flex items-center gap-2">
            <MapPin class="w-5 h-5 text-blue-500" />
            <h2 class="text-blue-950 text-base font-medium">Dirección</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Calle</label>
              <input
                v-model="form.direccionCalle"
                type="text"
                placeholder="Calle"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Número</label>
              <input
                v-model="form.direccionNumero"
                type="text"
                placeholder="Número"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Colonia</label>
              <input
                v-model="form.direccionColonia"
                type="text"
                placeholder="Colonia"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Ciudad</label>
              <input
                v-model="form.direccionCiudad"
                type="text"
                placeholder="Ciudad"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-blue-950 text-sm font-medium">Código Postal</label>
              <input
                v-model="form.direccionCodigoPostal"
                type="text"
                placeholder="00000"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>
        </div>

        <!-- Información Médica -->
        <div
          class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6"
        >
          <div class="flex items-center gap-2">
            <Heart class="w-5 h-5 text-blue-500" />
            <h2 class="text-blue-950 text-base font-medium">Información Médica</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label class="text-blue-950 text-sm font-medium">Alergias</label>
              <input
                v-model="form.alergias"
                type="text"
                placeholder="Ej: Penicilina, Látex"
                class="h-9 px-3 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
              />
            </div>
            <div class="flex flex-col gap-2 sm:col-span-2">
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
            <div class="flex flex-col gap-2 sm:col-span-2">
              <label class="text-blue-950 text-sm font-medium">Medicamentos Actuales</label>
              <textarea
                v-model="form.medicamentos"
                rows="3"
                placeholder="Lista de medicamentos que toma actualmente..."
                class="px-3 py-2 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition resize-none"
              />
            </div>
          </div>
        </div>

        <!-- Contacto de Emergencia -->
        <div
          class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6"
        >
          <div class="flex items-center gap-2">
            <PhoneCall class="w-5 h-5 text-blue-500" />
            <h2 class="text-blue-950 text-base font-medium">Contacto de Emergencia</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </div>

      <!-- Right: Sticky summary -->
      <aside class="lg:sticky lg:top-6 h-fit">
        <div
          class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-4"
        >
          <h3 class="text-blue-950 text-base font-medium">Resumen</h3>

          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between gap-4">
              <span class="text-slate-600 text-sm">Nombre</span>
              <span class="text-blue-950 text-sm font-medium text-right">
                {{ form.nombre || '—' }} {{ form.apellidos || '' }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-slate-600 text-sm">Expediente</span>
              <span class="text-blue-950 text-sm font-medium">{{ form.expediente || '—' }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-slate-600 text-sm">Teléfono</span>
              <span class="text-blue-950 text-sm font-medium">{{
                form.telefonoPrincipal || '—'
              }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-slate-600 text-sm">Estado</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-md text-white text-xs font-medium',
                  form.estado === 'Activo' ? 'bg-emerald-600' : 'bg-slate-400',
                ]"
              >
                {{ form.estado }}
              </span>
            </div>
          </div>

          <div class="pt-2 border-t border-blue-200 flex flex-col gap-2">
            <button
              type="button"
              class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Save class="w-4 h-4" />
              Guardar Cambios
            </button>
            <button
              type="button"
              class="h-9 px-4 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 text-blue-950 text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowLeft,
  Heart,
  MapPin,
  Phone,
  PhoneCall,
  Save,
  User,
  X,
} from 'lucide-vue-next'

const router = useRouter()

const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Datos mock solo para layout (UI). Listo para conectar con API/route params después.
const paciente = reactive({
  iniciales: 'MG',
  nombreCompleto: 'María García Pérez',
  expediente: 'EXP-001',
  ultimaVisita: '14/3/2026',
})

const form = reactive({
  nombre: 'María',
  apellidos: 'García Pérez',
  fechaNacimiento: '1985-06-14',
  genero: 'Femenino',
  estado: 'Activo',
  expediente: 'EXP-001',
  telefonoPrincipal: '+52 55 1111 2222',
  telefonoSecundario: '',
  correo: 'maria.garcia@email.com',
  direccionCalle: 'Av. Insurgentes Sur',
  direccionNumero: '1234',
  direccionColonia: 'Del Valle',
  direccionCiudad: 'Ciudad de México',
  direccionCodigoPostal: '03100',
  tipoSangre: 'O+',
  alergias: 'Penicilina',
  condicionesMedicas: 'Hipertensión controlada',
  medicamentos: 'Losartán 50mg',
  contactoEmergenciaNombre: 'Juan García',
  contactoEmergenciaTel: '+52 55 1111 3333',
})
</script>
