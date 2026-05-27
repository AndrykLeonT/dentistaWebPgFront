<template>
  <div class="min-h-screen bg-slate-50 flex justify-center items-center px-4">
    <div class="w-full max-w-md bg-white rounded-xl outline outline-[0.80px] outline-blue-200 py-6 px-6">
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

      <div class="text-center mb-6">
        <h1 class="text-blue-950 text-2xl font-medium">Recuperar contrasena</h1>
        <p class="text-slate-600 text-sm mt-1">
          Ingresa tu usuario, palabra clave y una nueva contrasena.
        </p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div v-if="endpointPending" class="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-xs">
          Endpoint backend pendiente: <span class="font-semibold">POST /api/recover-password-keyword</span>.
        </div>

        <div class="flex flex-col gap-2">
          <label for="usuario" class="text-blue-950 text-sm font-medium">Usuario o correo</label>
          <input
            id="usuario"
            v-model.trim="form.usuario"
            type="text"
            autocomplete="username"
            placeholder="test.admin@dentalsys.local"
            class="h-9 px-3 py-1 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
            :class="fieldErrors.usuario.length ? 'border-red-400' : ''"
          />
          <p v-if="fieldErrors.usuario.length" class="text-red-500 text-xs">{{ fieldErrors.usuario[0] }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label for="palabraClave" class="text-blue-950 text-sm font-medium">Palabra clave</label>
          <input
            id="palabraClave"
            v-model.trim="form.palabraClave"
            type="text"
            autocomplete="off"
            placeholder="Palabra clave registrada"
            class="h-9 px-3 py-1 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
            :class="fieldErrors.palabraClave.length ? 'border-red-400' : ''"
          />
          <p v-if="fieldErrors.palabraClave.length" class="text-red-500 text-xs">{{ fieldErrors.palabraClave[0] }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label for="new_password" class="text-blue-950 text-sm font-medium">Nueva contrasena</label>
          <input
            id="new_password"
            v-model="form.new_password"
            type="password"
            autocomplete="new-password"
            placeholder="Nueva contrasena"
            class="h-9 px-3 py-1 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
            :class="fieldErrors.new_password.length ? 'border-red-400' : ''"
          />
          <p v-if="fieldErrors.new_password.length" class="text-red-500 text-xs">{{ fieldErrors.new_password[0] }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <label for="new_password_confirmation" class="text-blue-950 text-sm font-medium">
            Confirmar nueva contrasena
          </label>
          <input
            id="new_password_confirmation"
            v-model="form.new_password_confirmation"
            type="password"
            autocomplete="new-password"
            placeholder="Confirma la nueva contrasena"
            class="h-9 px-3 py-1 bg-white rounded-md border border-slate-200 text-slate-600 text-sm outline-none focus:border-blue-400 transition"
            :class="fieldErrors.new_password_confirmation.length ? 'border-red-400' : ''"
          />
          <p v-if="fieldErrors.new_password_confirmation.length" class="text-red-500 text-xs">
            {{ fieldErrors.new_password_confirmation[0] }}
          </p>
        </div>

        <p v-if="generalError" class="text-red-500 text-xs text-center">{{ generalError }}</p>
        <p v-if="successMsg" class="text-green-600 text-xs text-center">{{ successMsg }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full h-9 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Actualizando...' : 'Actualizar contrasena' }}
        </button>

        <div class="text-center">
          <RouterLink to="/" class="text-sky-700 text-sm font-medium hover:underline">
            Volver al inicio de sesion
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { recoverPasswordByKeyword } from '@/services/auth'
import type { RecoverPasswordKeywordPayload } from '@/types'

type RecoveryField = keyof RecoverPasswordKeywordPayload

const isSubmitting = ref(false)
const endpointPending = ref(false)
const generalError = ref('')
const successMsg = ref('')
const fieldErrors = reactive<Record<RecoveryField, string[]>>({
  usuario: [],
  palabraClave: [],
  new_password: [],
  new_password_confirmation: [],
})

const form = reactive<RecoverPasswordKeywordPayload>({
  usuario: '',
  palabraClave: '',
  new_password: '',
  new_password_confirmation: '',
})

function clearMessages(): void {
  generalError.value = ''
  successMsg.value = ''
  endpointPending.value = false
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key as RecoveryField] = []
  })
}

function validateForm(): boolean {
  clearMessages()

  if (!form.usuario) fieldErrors.usuario = ['El usuario o correo es obligatorio.']
  if (!form.palabraClave) fieldErrors.palabraClave = ['La palabra clave es obligatoria.']
  if (!form.new_password) fieldErrors.new_password = ['La nueva contrasena es obligatoria.']
  if (!form.new_password_confirmation) {
    fieldErrors.new_password_confirmation = ['La confirmacion es obligatoria.']
  }
  if (
    form.new_password &&
    form.new_password_confirmation &&
    form.new_password !== form.new_password_confirmation
  ) {
    fieldErrors.new_password_confirmation = ['La confirmacion no coincide con la nueva contrasena.']
  }

  return !Object.values(fieldErrors).some((messages) => messages.length > 0)
}

function applyBackendFieldErrors(errors: Record<string, string[]>): void {
  Object.entries(errors).forEach(([field, messages]) => {
    if (field in fieldErrors) {
      fieldErrors[field as RecoveryField] = messages
    }
  })
}

async function handleSubmit(): Promise<void> {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const res = await recoverPasswordByKeyword({ ...form })
    successMsg.value = res.message || 'Contrasena actualizada correctamente. Ahora puedes iniciar sesion.'
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const body = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined

      if (status === 422 && body?.errors) {
        applyBackendFieldErrors(body.errors)
        generalError.value = body.message || 'Verifica los campos del formulario.'
        return
      }

      if (status === 401) {
        generalError.value = body?.message || 'Usuario o palabra clave incorrectos.'
        return
      }

      if (status === 404) {
        endpointPending.value = true
        generalError.value = 'Endpoint backend pendiente para recuperacion por palabra clave.'
        return
      }

      generalError.value = body?.message || 'No se pudo actualizar la contrasena. Intenta mas tarde.'
      return
    }

    generalError.value = 'Ocurrio un error inesperado.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
