<template>
  <div class="flex flex-col gap-6">
    <!-- Encabezado -->
    <div>
      <h1 class="text-blue-950 text-3xl font-normal">Dashboard</h1>
      <p class="text-slate-600 text-sm mt-1">
        Resumen de actividad del consultorio · {{ fechaHoy }}
      </p>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="card in summaryCards"
        :key="card.title"
        class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 p-6 flex flex-col gap-3"
      >
        <div class="flex justify-between items-center">
          <span class="text-slate-600 text-sm font-medium">{{ card.title }}</span>
          <component :is="card.icon" :class="['w-4 h-4', card.iconColor]" />
        </div>
        <div>
          <p class="text-blue-950 text-2xl font-normal">{{ card.value }}</p>
          <p class="text-slate-600 text-xs mt-1">{{ card.subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Citas del día + Alertas de inventario -->
    <div class="grid grid-cols-1 gap-6">
      <!-- Citas del día -->
      <div class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 p-6">
        <div class="mb-4">
          <div class="flex items-center gap-2">
            <CalendarDays class="w-5 h-5 text-blue-500" />
            <h2 class="text-blue-950 text-base font-medium">Citas del Día</h2>
          </div>
          <p class="text-slate-600 text-sm mt-1">Agenda para hoy, {{ fechaCorta }}</p>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="cita in citas"
            :key="cita.id"
            class="px-4 py-3 bg-white rounded-lg outline outline-[0.80px] outline-blue-200 flex justify-between items-center"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-blue-950 text-base font-medium">{{ cita.hora }}</span>
                <span
                  :class="[
                    'px-2 py-0.5 rounded-md text-white text-xs font-medium',
                    cita.estado === 'Confirmada' ? 'bg-emerald-600' : 'bg-blue-500',
                  ]"
                >
                  {{ cita.estado }}
                </span>
              </div>
              <p class="text-slate-600 text-sm">
                <span class="font-bold">{{ cita.paciente }}</span> · {{ cita.servicio }}
              </p>
              <p class="text-slate-600 text-xs">{{ cita.doctor }}</p>
            </div>
            <CheckCircle
              v-if="cita.estado === 'Confirmada'"
              class="w-5 h-5 text-emerald-600 shrink-0"
            />
          </div>
        </div>
      </div>

      <!-- Alertas de inventario -->
      <div class="bg-white rounded-xl outline outline-[0.80px] outline-blue-200 p-6">
        <div class="mb-4">
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-rose-600" />
            <h2 class="text-blue-950 text-base font-medium">Alertas de Inventario</h2>
          </div>
          <p class="text-slate-600 text-sm mt-1">Insumos que requieren reabastecimiento</p>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="item in alertasInventario"
            :key="item.nombre"
            :class="[
              'rounded-lg outline outline-[0.80px] px-3 py-3 flex justify-between items-center',
              item.sinStock ? 'bg-red-50 outline-rose-600' : 'bg-white outline-blue-200',
            ]"
          >
            <div>
              <p class="text-blue-950 text-base font-medium">{{ item.nombre }}</p>
              <p class="text-slate-600 text-sm">
                Stock actual: <span class="font-bold">{{ item.stock }}</span> · Mínimo:
                {{ item.minimo }}
              </p>
            </div>
            <span
              :class="[
                'px-2 py-0.5 rounded-md text-white text-xs font-medium shrink-0',
                item.sinStock ? 'bg-rose-600' : 'bg-amber-500',
              ]"
            >
              {{ item.sinStock ? 'Sin stock' : 'Bajo stock' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarDays, Users, AlertTriangle, DollarSign, CheckCircle } from 'lucide-vue-next'

const fechaHoy = 'martes, 17 de marzo de 2026'
const fechaCorta = '17/3/2026'

const summaryCards = [
  {
    title: 'Citas Hoy',
    value: '5',
    subtitle: '3 confirmadas, 2 pendientes',
    icon: CalendarDays,
    iconColor: 'text-blue-500',
  },
  {
    title: 'Pacientes Activos',
    value: '5',
    subtitle: 'Total registrados',
    icon: Users,
    iconColor: 'text-blue-500',
  },
  {
    title: 'Alertas de Inventario',
    value: '4',
    subtitle: 'Insumos requieren atención',
    icon: AlertTriangle,
    iconColor: 'text-rose-600',
  },
  {
    title: 'Ingresos Hoy',
    value: '$0',
    subtitle: 'MXN',
    icon: DollarSign,
    iconColor: 'text-emerald-600',
  },
]

const citas = [
  {
    id: 1,
    hora: '09:00 - 10:00',
    estado: 'Confirmada',
    paciente: 'María García Pérez',
    servicio: 'Limpieza Dental',
    doctor: 'Dr. Ana Rodríguez López',
  },
  {
    id: 2,
    hora: '10:30 - 11:15',
    estado: 'Programada',
    paciente: 'Roberto Mendoza Silva',
    servicio: 'Resina Dental',
    doctor: 'Dr. Miguel Hernández Ramírez',
  },
  {
    id: 3,
    hora: '11:30 - 13:00',
    estado: 'Confirmada',
    paciente: 'Sofía Torres Ramírez',
    servicio: 'Blanqueamiento Dental',
    doctor: 'Dr. Ana Rodríguez López',
  },
  {
    id: 4,
    hora: '14:00 - 14:30',
    estado: 'Programada',
    paciente: 'Jorge Flores Castillo',
    servicio: 'Consulta General',
    doctor: 'Dr. Miguel Hernández Ramírez',
  },
  {
    id: 5,
    hora: '15:00 - 17:00',
    estado: 'Confirmada',
    paciente: 'Patricia Ruiz Moreno',
    servicio: 'Endodoncia (Conducto)',
    doctor: 'Dr. Ana Rodríguez López',
  },
]

const alertasInventario = [
  { nombre: 'Anestesia Lidocaína 2%', stock: 3, minimo: 5, sinStock: false },
  { nombre: 'Cemento Dental', stock: 2, minimo: 8, sinStock: false },
  { nombre: 'Mascarillas Desechables', stock: 0, minimo: 10, sinStock: true },
  { nombre: 'Agujas Carpule 27G', stock: 4, minimo: 6, sinStock: false },
]
</script>
