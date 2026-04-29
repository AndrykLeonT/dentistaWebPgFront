<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- SIDEBAR -->
    <aside class="w-64 min-h-screen bg-blue-950 flex flex-col fixed top-0 left-0 z-10">
      <!-- Logo -->
      <div class="h-20 pl-6 border-b border-sky-700 flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-6 8c0-3.3 2.7-6 6-6s6 2.7 6 6H6zm6-14a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
        </div>
        <div>
          <p class="text-white text-xl leading-7">DentalSys</p>
          <p class="text-blue-300 text-xs">Sistema de Gestión</p>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 px-3 pt-4 flex flex-col gap-1">
        <RouterLink
          v-for="item in navVisibles"
          :key="item.path"
          :to="item.path"
          class="h-11 pl-3 rounded-lg flex items-center gap-3 transition-colors"
          :class="isActive(item.path) ? 'bg-sky-700 text-white' : 'text-blue-200 hover:bg-blue-900'"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span class="text-base">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- User info + logout -->
      <div class="px-4 pt-4 pb-5 border-t border-sky-700 flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
            <span class="text-white text-base">{{ iniciales }}</span>
          </div>
          <div class="overflow-hidden">
            <p class="text-white text-sm font-medium truncate">
              {{ auth.empleado?.persona.nombreCompleto ?? 'Usuario' }}
            </p>
            <p class="text-blue-300 text-xs">{{ auth.empleado?.tipoEmpleado.nombre ?? '' }}</p>
          </div>
        </div>
        <button
          @click="auth.logout()"
          class="w-full h-8 bg-slate-50/10 hover:bg-slate-50/20 rounded-md border border-white/20 text-white text-sm font-medium transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="ml-64 flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Package,
  CreditCard,
  UserCog,
  Pill,
  Wallet,
} from 'lucide-vue-next'

const auth  = useAuthStore()
const route = useRoute()

const navItems = [
  { path: '/dashboard',  label: 'Dashboard',       icon: LayoutDashboard, visible: () => true },
  { path: '/pacientes',  label: 'Pacientes',        icon: Users,           visible: () => true },
  { path: '/citas',      label: 'Citas',            icon: CalendarDays,    visible: () => true },
  { path: '/recetas',    label: 'Recetas',          icon: Pill,            visible: () => auth.isAdmin || auth.isDentista },
  { path: '/servicios',  label: 'Servicios',        icon: Stethoscope,     visible: () => true },
  { path: '/empleados',  label: 'Empleados',        icon: UserCog,         visible: () => true },
  { path: '/pagos',      label: 'Pagos',            icon: CreditCard,      visible: () => auth.isAdmin || auth.isRecepcionista },
  { path: '/cortes',     label: 'Cortes de Caja',   icon: Wallet,          visible: () => auth.isAdmin || auth.isRecepcionista },
  { path: '/inventario', label: 'Inventario',       icon: Package,         visible: () => auth.isAdmin },
]

const navVisibles = computed(() => navItems.filter((item) => item.visible()))

const iniciales = computed(() => {
  const nombre = auth.empleado?.persona.nombreCompleto ?? ''
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>
