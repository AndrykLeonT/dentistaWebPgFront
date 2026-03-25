<template>
  <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto">
    <!-- Back Button -->
    <div 
      @click="router.push('/pacientes')"
      class="flex items-center gap-2 text-blue-950 text-sm font-medium cursor-pointer hover:bg-slate-200 transition max-w-fit px-3 py-1.5 rounded-md -ml-3"
    >
      <ArrowLeft class="w-4 h-4" />
      Volver a Pacientes
    </div>

    <!-- Header -->
    <div class="flex justify-between items-start">
      <div class="flex flex-col gap-1">
        <h1 class="text-blue-950 text-3xl font-normal leading-9">Historial del Paciente</h1>
        <p class="text-slate-600 text-sm leading-5">Expediente completo y gestión de información</p>
      </div>
      <button class="h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer flex items-center justify-center">
        Editar Datos
      </button>
    </div>

    <!-- Main Info Box -->
    <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
      <div class="flex items-start gap-6">
        <div class="w-20 h-20 bg-blue-500 rounded-full flex justify-center items-center shrink-0">
          <span class="text-white text-2xl font-normal">MG</span>
        </div>
        <div class="flex-1 grid grid-cols-4 gap-4 mt-2">
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Nombre Completo</span>
            <span class="text-blue-950 text-base font-medium leading-6">María García Pérez</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Expediente</span>
            <span class="text-blue-950 text-base font-medium leading-6">EXP-001</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Edad</span>
            <span class="text-blue-950 text-base font-medium leading-6">40 años</span>
          </div>
          <div class="flex flex-col">
            <span class="text-slate-600 text-sm mb-1 leading-5">Tipo de Sangre</span>
            <span class="text-blue-950 text-base font-medium leading-6">O+</span>
          </div>
        </div>
      </div>
      
      <!-- Alert Box -->
      <div class="bg-red-50 rounded-lg outline outline-[1px] outline-rose-600 px-4 py-3 flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-rose-600" />
        <span class="text-rose-600 text-sm font-medium leading-5">Alergias: Penicilina</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="p-1 bg-sky-100 rounded-xl flex gap-1 max-w-fit">
      <button class="px-3 py-1.5 bg-white rounded-lg text-blue-950 text-sm font-medium shadow-sm outline outline-[1px] outline-black/5 cursor-pointer">
        Información Personal
      </button>
      <button class="px-3 py-1.5 text-blue-950 text-sm font-medium hover:bg-white/50 rounded-lg transition cursor-pointer">
        Citas (2)
      </button>
      <button class="px-3 py-1.5 text-blue-950 text-sm font-medium hover:bg-white/50 rounded-lg transition cursor-pointer">
        Pagos (1)
      </button>
    </div>

    <!-- Cards Layout -->
    <div class="grid grid-cols-2 gap-6 w-full pb-8">
      
      <!-- Datos Personales -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <User class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Datos Personales</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Fecha de Nacimiento</div>
            <div class="text-blue-950 text-base">14/6/1985</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Género</div>
            <div class="text-blue-950 text-base">Femenino</div>
          </div>
          <div class="pt-1">
            <div class="text-slate-600 text-sm mb-1">Estado</div>
            <span class="px-2 py-0.5 bg-emerald-600 rounded-md text-white text-xs font-medium inline-block mt-1">
              Activo
            </span>
          </div>
        </div>
      </div>

      <!-- Contacto -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <Phone class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Contacto</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Teléfono Principal</div>
            <div class="text-blue-950 text-base">+52 55 1111 2222</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Correo Electrónico</div>
            <div class="text-blue-950 text-base">maria.garcia@email.com</div>
          </div>
        </div>
      </div>

      <!-- Dirección -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <MapPin class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Dirección</h2>
        </div>
        <div class="flex flex-col gap-1 text-blue-950 text-base">
          <p>Av. Insurgentes Sur 1234</p>
          <p>Del Valle</p>
          <p>Ciudad de México, C.P. 03100</p>
        </div>
      </div>

      <!-- Información Médica -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <Heart class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Información Médica</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Tipo de Sangre</div>
            <div class="text-blue-950 text-base">O+</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Alergias</div>
            <div class="text-blue-950 text-base">Penicilina</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Enfermedades</div>
            <div class="text-blue-950 text-base">Hipertensión controlada</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Medicamentos</div>
            <div class="text-blue-950 text-base">Losartán 50mg</div>
          </div>
        </div>
      </div>

      <!-- Contacto de Emergencia -->
      <div class="bg-white rounded-xl outline outline-[1px] outline-blue-200 p-6 flex flex-col gap-6">
        <div class="flex items-center gap-2">
          <PhoneCall class="w-5 h-5 text-blue-500" />
          <h2 class="text-blue-950 text-base font-medium">Contacto de Emergencia</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <div class="text-slate-600 text-sm mb-1">Nombre</div>
            <div class="text-blue-950 text-base">Juan García</div>
          </div>
          <div>
            <div class="text-slate-600 text-sm mb-1">Teléfono</div>
            <div class="text-blue-950 text-base">+52 55 1111 3333</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, User, Phone, MapPin, Heart, PhoneCall, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
</script>
