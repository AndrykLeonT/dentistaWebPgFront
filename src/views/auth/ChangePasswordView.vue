<template>
  <div class="min-h-screen bg-slate-50 flex justify-center items-center px-4">
    <div class="w-96 bg-white rounded-xl outline outline-[0.80px] outline-blue-200 py-6 px-6 flex flex-col gap-5">
      <div class="text-center">
        <h1 class="text-blue-950 text-xl font-medium">Cambiar contraseña</h1>
        <p class="text-slate-600 text-sm mt-1">Elige una contraseña segura para continuar</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- Contraseña actual -->
        <div class="flex flex-col gap-1">
          <label class="text-blue-950 text-sm font-medium">Contraseña actual</label>
          <input
            v-model="form.contraseñaActual"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            :disabled="loading"
            class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition disabled:opacity-50"
            :class="fieldErrors['contraseñaActual'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
          />
          <p v-if="fieldErrors['contraseñaActual']" class="text-red-500 text-xs">
            {{ fieldErrors['contraseñaActual'][0] }}
          </p>
        </div>

        <!-- Nueva contraseña -->
        <div class="flex flex-col gap-1">
          <label class="text-blue-950 text-sm font-medium">Nueva contraseña</label>
          <input
            v-model="form.nuevaContraseña"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            :disabled="loading"
            class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition disabled:opacity-50"
            :class="fieldErrors['nuevaContraseña'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
          />
          <p v-if="fieldErrors['nuevaContraseña']" class="text-red-500 text-xs">
            {{ fieldErrors['nuevaContraseña'][0] }}
          </p>
        </div>

        <!-- Confirmar contraseña -->
        <div class="flex flex-col gap-1">
          <label class="text-blue-950 text-sm font-medium">Confirmar contraseña</label>
          <input
            v-model="form.nuevaContraseña_confirmation"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            :disabled="loading"
            class="h-9 px-3 bg-white rounded-md border text-slate-600 text-sm outline-none transition disabled:opacity-50"
            :class="fieldErrors['nuevaContraseña_confirmation'] ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'"
          />
          <p v-if="fieldErrors['nuevaContraseña_confirmation']" class="text-red-500 text-xs">
            {{ fieldErrors['nuevaContraseña_confirmation'][0] }}
          </p>
        </div>

        <!-- Error general -->
        <p v-if="globalError" class="text-red-500 text-xs text-center">{{ globalError }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-9 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-md text-white text-sm font-medium transition"
        >
          {{ loading ? 'Actualizando…' : 'Actualizar contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useApiError } from '@/composables/useApiError'
import * as authService from '@/services/auth'

const auth   = useAuthStore()
const router = useRouter()
const { globalError, fieldErrors, handleError, clearErrors } = useApiError()

const loading = ref(false)
const form = reactive({
  contraseñaActual: '',
  nuevaContraseña: '',
  nuevaContraseña_confirmation: '',
})

async function handleSubmit() {
  if (loading.value) return
  clearErrors()
  loading.value = true

  try {
    await authService.changePassword(
      form.contraseñaActual,
      form.nuevaContraseña,
      form.nuevaContraseña_confirmation,
    )
    auth.markPasswordChanged()
    toast.success('Contraseña actualizada correctamente')
    router.push('/dashboard')
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}
</script>
