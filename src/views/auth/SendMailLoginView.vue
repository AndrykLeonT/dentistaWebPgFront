<template>
  <div class="min-h-screen bg-slate-50 flex justify-center items-center px-4">
    <div class="w-96 bg-white rounded-xl outline outline-[0.80px] outline-blue-200 py-6 px-6">
      <!-- Título -->
      <div class="mb-6">
        <h1 class="text-blue-950 text-base font-medium leading-4">Recuperar Contraseña</h1>
        <p class="text-slate-600 text-base font-normal leading-6 mt-2">
          Revisa tu correo electrónico
        </p>
      </div>

      <!-- Contenido -->
      <div class="flex flex-col items-center gap-4">
        <!-- Ícono -->
        <div class="w-16 h-16 bg-emerald-600 rounded-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.67"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <!-- Mensaje -->
        <p class="text-center text-slate-600 text-sm leading-5">
          Hemos enviado un enlace de recuperación a
          <span class="font-bold">{{ email }}</span
          >. Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
        </p>

        <!-- Botón regresar -->
        <button
          @click="goToLogin"
          class="w-full h-9 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 flex justify-center items-center gap-2 transition cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-blue-950"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="text-blue-950 text-sm font-medium">Regresar a iniciar sesión</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Toma el email de los query params, o muestra uno por defecto
const email = (route.query.email as string) || 'tu correo'

function goToLogin() {
  router.push('/login')
}
</script>
