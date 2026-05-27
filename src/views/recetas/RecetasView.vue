<template>
  <div class="min-h-full bg-[#F1F5F9] px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
    <div class="w-full space-y-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-[30px] font-semibold tracking-tight text-[#0C3660] leading-none">Recetas</h1>
          <p class="text-sm font-medium mt-2 text-slate-500">
            Gestion de recetas medicas emitidas en consulta
          </p>
        </div>

        <Button
          type="button"
          :disabled="loading"
          class="bg-[#378ADD] hover:bg-[#2c71b8] text-white transition-all duration-200 w-full sm:w-auto shrink-0 rounded-lg shadow-sm font-medium px-5 h-10"
          @click="cargarRecetas"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          Recargar
        </Button>
      </div>

      <div
        v-if="globalError"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ globalError }}
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            v-model="searchTerm"
            placeholder="Buscar por paciente, servicio o indicaciones..."
            class="pl-9 h-10 border-slate-200 bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      <Card class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-200">
          <h2 class="text-[16px] font-medium text-[#0C3660]">
            Historial de Recetas ({{ recetasFiltradas.length }})
          </h2>
        </div>

        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent border-b border-slate-200 bg-slate-50">
                <TableHead class="w-[80px] text-slate-500 font-medium text-[13px] h-10 px-4">ID</TableHead>
                <TableHead class="min-w-[190px] text-slate-500 font-medium text-[13px] h-10 px-4">Paciente</TableHead>
                <TableHead class="min-w-[170px] text-slate-500 font-medium text-[13px] h-10 px-4">Servicio</TableHead>
                <TableHead class="w-[125px] text-slate-500 font-medium text-[13px] h-10 px-4">Fecha</TableHead>
                <TableHead class="min-w-[260px] text-slate-500 font-medium text-[13px] h-10 px-4">Indicaciones</TableHead>
                <TableHead class="w-[110px] text-slate-500 font-medium text-[13px] h-10 px-4 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="loading" class="text-center">
                <TableCell colspan="6" class="py-6 text-slate-500">Cargando recetas...</TableCell>
              </TableRow>
              <TableRow v-else-if="recetasFiltradas.length === 0" class="text-center">
                <TableCell colspan="6" class="py-6 text-slate-500">No hay recetas registradas</TableCell>
              </TableRow>
              <TableRow
                v-for="receta in recetasFiltradas"
                v-else
                :key="receta.id"
                class="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <TableCell class="font-medium text-[#0C3660] py-4 text-[13px] px-4">{{ receta.id }}</TableCell>
                <TableCell class="text-[#374151] py-4 text-[13px] px-4 font-medium">
                  {{ getPaciente(receta) }}
                </TableCell>
                <TableCell class="text-[#374151] py-4 text-[13px] px-4">
                  {{ receta.cita?.servicio?.nombre || 'No informado' }}
                </TableCell>
                <TableCell class="text-[#374151] py-4 text-[13px] px-4">
                  {{ formatDate(receta.cita?.fechaProgramada ?? receta.fechaRegistro ?? receta.createdAt) }}
                </TableCell>
                <TableCell class="text-slate-600 py-4 text-[13px] px-4">
                  <p class="max-w-[360px] truncate">{{ receta.indicaciones }}</p>
                </TableCell>
                <TableCell class="text-right px-4 py-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    title="Descargar PDF"
                    @click="exportarPdf(receta)"
                  >
                    <Download class="w-[18px] h-[18px]" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, RefreshCw, Search } from 'lucide-vue-next'
import { useApiError } from '@/composables/useApiError'
import { downloadRecipePdf } from '@/lib/recipePdf'
import * as recetasService from '@/services/recetas'
import type { Receta } from '@/types'

const { globalError, handleError, clearErrors } = useApiError()

const recetas = ref<Receta[]>([])
const loading = ref(true)
const searchTerm = ref('')

const recetasFiltradas = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()
  if (!query) return recetas.value

  return recetas.value.filter((receta) => {
    return [
      String(receta.id),
      getPaciente(receta),
      receta.cita?.servicio?.nombre ?? '',
      receta.cita?.dentista?.nombreCompleto ?? '',
      receta.indicaciones,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

onMounted(() => {
  cargarRecetas()
})

async function cargarRecetas(): Promise<void> {
  loading.value = true
  clearErrors()

  try {
    const response = await recetasService.getAll()
    recetas.value = response.data
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function exportarPdf(receta: Receta): Promise<void> {
  try {
    const response = await recetasService.getById(receta.id)
    downloadRecipePdf(response.data)
    toast.success('Receta descargada en PDF')
  } catch (error) {
    handleError(error)
  }
}

function getPaciente(receta: Receta): string {
  return receta.cita?.paciente?.nombreCompleto ?? receta.persona?.nombreCompleto ?? 'No informado'
}

function formatDate(date?: string): string {
  if (!date) return 'No informada'
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>
