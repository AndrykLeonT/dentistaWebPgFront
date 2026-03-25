<template>
  <div class="min-h-screen bg-slate-50 flex justify-center items-center px-4">
    <div class="w-96 bg-white rounded-xl outline outline-[0.80px] outline-blue-200 py-6 px-6">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-blue-950 rounded-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-white"
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
      </div>

      <!-- Título -->
      <div class="text-center mb-6">
        <h1 class="text-blue-950 text-2xl font-medium">Recuperar contraseña</h1>
        <p class="text-slate-600 text-sm mt-1">
          Ingresa tu correo y te enviaremos las instrucciones
        </p>
      </div>

      <div class="flex flex-col gap-5">
        <!-- Email -->
        <div class="flex flex-col gap-2">
          <label class="text-blue-950 text-sm font-medium">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            class="h-9 px-3 py-1 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
          />
        </div>

        <p v-if="errorMsg" class="text-red-500 text-xs text-center">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-green-600 text-xs text-center">{{ successMsg }}</p>

        <!-- Botón -->
        <button
          @click="handleSubmit"
          class="w-full h-9 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition cursor-pointer"
        >
          Enviar enlace de recuperación
        </button>

        <!-- Volver al login -->
        <div class="text-center">
          <RouterLink to="/" class="text-sky-700 text-sm font-medium hover:underline">
            ← Regresar al inicio de sesión
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const errorMsg = ref('')
const successMsg = ref('')

function handleSubmit() {
  router.push({ path: '/send-mail', query: { email: email.value || 'correo@ejemplo.com' } })
}
</script>
