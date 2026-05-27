<template>
  <div class="min-h-screen bg-slate-50 flex justify-center items-center px-4">
    <div class="w-96 bg-white rounded-xl outline outline-[0.80px] outline-blue-200 py-6 px-6">
      <div class="mb-6">
        <h1 class="text-blue-950 text-base font-medium leading-4">Recuperar contrasena</h1>
        <p class="text-slate-600 text-base font-normal leading-6 mt-2">
          Flujo actualizado a palabra clave
        </p>
      </div>

      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-blue-950 rounded-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.67"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
          </svg>
        </div>

        <p class="text-center text-slate-600 text-sm leading-5">
          La recuperacion ya no se realiza por correo. Usa tu usuario, palabra clave y una nueva contrasena.
        </p>

        <button
          @click="goToRecovery"
          class="w-full h-9 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer"
        >
          Ir a recuperacion por palabra clave
        </button>

        <button
          @click="goToLogin"
          class="w-full h-9 bg-slate-50 hover:bg-slate-100 rounded-md outline outline-[0.80px] outline-blue-200 text-blue-950 text-sm font-medium transition cursor-pointer"
        >
          Volver al inicio de sesion
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRecovery() {
  router.push('/forgot-password')
}

function goToLogin() {
  router.push('/login')
}
</script>
