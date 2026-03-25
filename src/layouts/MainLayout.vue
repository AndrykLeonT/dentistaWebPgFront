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
          v-for="item in navItems"
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
            <span class="text-white text-base">CM</span>
          </div>
          <div class="overflow-hidden">
            <p class="text-white text-sm font-medium truncate">Carlos Martínez González</p>
            <p class="text-blue-300 text-xs">Administrador</p>
          </div>
        </div>
        <button
          @click="handleLogout"
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
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  Package,
  CreditCard,
  UserCog,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/agenda', label: 'Agenda', icon: CalendarDays },
  { path: '/pacientes', label: 'Pacientes', icon: Users },
  { path: '/servicios', label: 'Servicios', icon: Stethoscope },
  { path: '/inventario', label: 'Inventario', icon: Package },
  { path: '/pagos', label: 'Pagos', icon: CreditCard },
  { path: '/usuarios', label: 'Usuarios', icon: UserCog },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}

function handleLogout() {
  router.push('/login')
}
</script>
