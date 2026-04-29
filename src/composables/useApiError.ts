import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue-sonner'

export function useApiError() {
  /** Mensaje general del formulario (banner de error). */
  const globalError = ref<string | null>(null)
  /** Errores de validación campo a campo — HTTP 422. */
  const fieldErrors = ref<Record<string, string[]>>({})

  function clearErrors(): void {
    globalError.value  = null
    fieldErrors.value  = {}
  }

  /**
   * Parsea un error de Axios, actualiza los refs y muestra toast cuando
   * corresponde. Devuelve el mensaje final para uso inline si se necesita.
   *
   * - 401 → no toast (el interceptor ya redirige a /login).
   * - 422 → puebla fieldErrors para mostrar bajo cada input; no toast.
   * - 403 / 404 / 500 / sin red → toast con mensaje específico o genérico.
   */
  function handleError(error: unknown): string {
    clearErrors()

    if (!axios.isAxiosError(error)) {
      const msg = 'Ocurrió un error inesperado'
      globalError.value = msg
      toast.error(msg)
      return msg
    }

    const status = error.response?.status
    const body   = error.response?.data as Record<string, unknown> | undefined

    // 401: el interceptor ya limpió el token y redirige; no duplicar feedback
    if (status === 401) return ''

    // 422: mostrar errores inline bajo cada campo, sin toast
    if (status === 422 && body?.errors) {
      fieldErrors.value = body.errors as Record<string, string[]>
      const msg = (body.message as string | undefined) ?? 'Verifica los campos del formulario'
      globalError.value = msg
      return msg
    }

    const msg = (body?.message as string | undefined) ?? fallbackMessage(status)
    globalError.value = msg
    toast.error(msg)
    return msg
  }

  return { globalError, fieldErrors, handleError, clearErrors }
}

function fallbackMessage(status: number | undefined): string {
  switch (status) {
    case 403:      return 'No tienes permisos para realizar esta acción'
    case 404:      return 'El recurso solicitado no existe'
    case 500:      return 'Error interno del servidor, intenta más tarde'
    case undefined: return 'Sin conexión con el servidor'
    default:       return 'Ocurrió un error inesperado'
  }
}
