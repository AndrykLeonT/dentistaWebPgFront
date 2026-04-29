<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
    <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
      <ShieldOff class="w-8 h-8 text-red-500" />
    </div>
    <h1 class="text-blue-950 text-2xl font-medium">Acceso denegado</h1>
    <p class="text-slate-600 text-sm text-center max-w-xs">
      No tienes permisos para ver esta página. Contacta al administrador si crees que es un error.
    </p>
    <RouterLink
      to="/dashboard"
      class="mt-2 h-9 px-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition flex items-center"
    >
      Volver al inicio
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ShieldOff } from 'lucide-vue-next'
</script>
