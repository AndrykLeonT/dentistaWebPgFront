<template>
  <div class="min-h-full bg-[#F1F5F9] px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
    <div class="w-full space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-[30px] font-semibold tracking-tight text-[#0C3660] leading-none">Pagos y Comprobantes Internos</h1>
          <p class="text-sm font-medium mt-2 text-slate-500">
            Gestión de cobros y comprobantes
          </p>
        </div>
        
        <div v-if="puedeGestionarCaja">
          <Dialog v-model:open="isRegistrarOpen">
            <DialogTrigger as-child>
              <Button 
                :disabled="!corteActivo || loading"
                class="bg-[#378ADD] hover:bg-[#2c71b8] text-white transition-all duration-200 w-full sm:w-auto shrink-0 rounded-lg shadow-sm font-medium px-5 h-10 disabled:opacity-50"
              >
                <Plus class="w-4 h-4 mr-2" />
                Registrar Pago
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[462px]">
              <DialogHeader>
                <DialogTitle class="text-[20px] font-bold text-[#0C3660]">Registrar Nuevo Pago</DialogTitle>
                <DialogDescription class="text-sm text-slate-500">
                  Completa el formulario para capturar un cobro
                </DialogDescription>
              </DialogHeader>
              
              <!-- Formulario de Pago -->
              <div class="space-y-4 py-2">
                <div v-if="globalError" class="p-3 bg-red-50 rounded-md border border-red-200">
                  <p class="text-red-600 text-sm">{{ globalError }}</p>
                </div>
                
                <div class="space-y-1.5">
                  <Label class="text-sm font-medium text-slate-700">Paciente *</Label>
                  <Select v-model="form.paciente">
                    <SelectTrigger class="bg-slate-50 border-slate-200 focus:ring-blue-500" :class="fieldErrors['idPersona'] ? 'border-red-400' : ''">
                      <SelectValue placeholder="Selecciona un paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="p in pacientes" :key="p.id" :value="String(p.id)">
                        {{ p.nombreCompleto }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p v-if="fieldErrors['idPersona']" class="text-red-500 text-xs">{{ fieldErrors['idPersona'][0] }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1.5">
                    <Label class="text-sm font-medium text-slate-700">Efectivo *</Label>
                    <Input v-model="form.efectivo" type="number" min="0" placeholder="0" class="bg-slate-50 border-slate-200" :class="fieldErrors['efectivo'] ? 'border-red-400' : ''" />
                    <p v-if="fieldErrors['efectivo']" class="text-red-500 text-xs">{{ fieldErrors['efectivo'][0] }}</p>
                  </div>
                  <div class="space-y-1.5">
                    <Label class="text-sm font-medium text-slate-700">Tarjeta *</Label>
                    <Input v-model="form.tarjeta" type="number" min="0" placeholder="0" class="bg-slate-50 border-slate-200" :class="fieldErrors['tarjeta'] ? 'border-red-400' : ''" />
                    <p v-if="fieldErrors['tarjeta']" class="text-red-500 text-xs">{{ fieldErrors['tarjeta'][0] }}</p>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <Label class="text-sm font-medium text-slate-700">Total a Cobrar *</Label>
                  <Input v-model="form.total" type="number" min="0" placeholder="0" class="bg-slate-50 border-slate-200" :class="fieldErrors['total'] ? 'border-red-400' : ''" />
                  <p v-if="fieldErrors['total']" class="text-red-500 text-xs">{{ fieldErrors['total'][0] }}</p>
                </div>
                
                <!-- Helper message -->
                <div class="text-xs text-slate-500">
                  <span v-if="Number(form.efectivo || 0) + Number(form.tarjeta || 0) !== Number(form.total || 0)" class="text-amber-600">
                    El total debe ser exactamente la suma de efectivo y tarjeta. ({{ Number(form.efectivo || 0) + Number(form.tarjeta || 0) }})
                  </span>
                  <span v-else class="text-emerald-600">
                    Suma correcta.
                  </span>
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-2">
                <Button variant="ghost" class="text-slate-600 hover:bg-slate-100" @click="isRegistrarOpen = false">Cancelar</Button>
                <Button :disabled="saving" class="bg-blue-600 hover:bg-blue-700 text-white font-medium" @click="registrarPago">
                  {{ saving ? 'Registrando...' : 'Registrar Pago' }}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <!-- Alertas de estado de caja o permisos -->
      <div v-if="!puedeGestionarCaja && !loading" class="bg-amber-50 rounded-lg outline outline-[1px] outline-amber-600 px-4 py-3 flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-amber-600" />
        <span class="text-amber-800 text-sm font-medium leading-5">No tienes permisos para operar la caja.</span>
      </div>
      <div v-else-if="!corteActivo && !loading" class="bg-rose-50 rounded-lg outline outline-[1px] outline-rose-600 px-4 py-3 flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-rose-600" />
        <span class="text-rose-800 text-sm font-medium leading-5">Debes abrir un corte antes de registrar pagos. (Ver sección Cortes)</span>
      </div>

      <!-- Resumen Financiero Section (Solo si hay corte activo) -->
      <div v-if="corteActivo">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-5 h-5 flex items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
            <DollarSign class="w-3.5 h-3.5" />
          </div>
          <h2 class="text-sm font-medium text-[#0C3660]">Resumen Financiero del Corte Actual</h2>
        </div>
        <Card class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 w-full">
          <p class="text-[13px] font-medium text-slate-500 mb-1">Total Recaudado en Turno</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-[24px] font-semibold text-[#0C3660]">${{ Number(corteActivo.totalRecaudado || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
            <span class="text-[12px] font-medium text-slate-500 ml-1">MXN · {{ corteActivo.numPagos || 0 }} pagos</span>
          </div>
        </Card>
      </div>

      <!-- Actions Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            v-model="searchTerm"
            placeholder="Buscar por paciente o folio..." 
            class="pl-9 h-10 border-slate-200 bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      <!-- Table Section -->
      <div>
        <Card class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-200">
            <h2 class="text-[16px] font-medium text-[#0C3660]">
              Historial de Pagos ({{ filteredPagos.length }})
            </h2>
          </div>
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow class="hover:bg-transparent border-b border-slate-200 bg-slate-50">
                  <TableHead class="w-[100px] text-slate-500 font-medium text-[13px] h-10 px-4">ID</TableHead>
                  <TableHead class="w-[110px] text-slate-500 font-medium text-[13px] h-10 px-4">Fecha</TableHead>
                  <TableHead class="min-w-[180px] text-slate-500 font-medium text-[13px] h-10 px-4">Paciente</TableHead>
                  <TableHead class="w-[100px] text-slate-500 font-medium text-[13px] h-10 px-4">Total</TableHead>
                  <TableHead class="w-[110px] text-slate-500 font-medium text-[13px] h-10 px-4 text-right rounded-tr-xl">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="loading" class="text-center">
                  <TableCell colspan="5" class="py-6 text-slate-500">Cargando pagos...</TableCell>
                </TableRow>
                <TableRow v-else-if="filteredPagos.length === 0" class="text-center">
                  <TableCell colspan="5" class="py-6 text-slate-500">No hay pagos registrados</TableCell>
                </TableRow>
                <TableRow v-for="pago in filteredPagos" :key="pago.id" class="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                  <TableCell class="font-medium text-[#0C3660] py-4 text-[13px] px-4">{{ pago.id }}</TableCell>
                  <TableCell class="text-[#374151] py-4 text-[13px] px-4 font-medium">{{ formatDate(pago.fechaRegistro) }}</TableCell>
                  <TableCell class="text-[#374151] py-4 text-[13px] px-4 font-medium">{{ pago.paciente?.nombreCompleto || 'Desconocido' }}</TableCell>
                  <TableCell class="font-medium text-[#0C3660] py-4 text-[13px] px-4">${{ Number(pago.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</TableCell>
                  <TableCell class="text-right px-4 py-4">
                    <div class="flex justify-end gap-1">
                      <Button v-if="puedeGestionarCaja" variant="ghost" size="icon" class="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors" title="Emitir Comprobante" @click="handleEmitirComprobante(pago)">
                        <FileText class="w-[18px] h-[18px]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      
      <!-- Generar Comprobante Dialog -->
      <Dialog v-model:open="isComprobanteOpen">
        <DialogContent class="sm:max-w-[420px] p-6">
          <DialogHeader>
            <DialogTitle class="text-[20px] font-bold text-[#0C3660]">Emitir Comprobante Interno</DialogTitle>
            <DialogDescription class="text-sm text-slate-500">
              Se emitirá un recibo interno para este pago.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-1.5">
              <Label class="text-sm font-medium text-slate-700">Observaciones (opcional)</Label>
              <Textarea v-model="comprobanteObs" placeholder="Nota..." class="bg-slate-50 border-slate-200 resize-none h-16" />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-2">
            <Button variant="ghost" class="text-slate-600 hover:bg-slate-100" @click="isComprobanteOpen = false">Cancelar</Button>
            <Button :disabled="savingComprobante" class="bg-blue-600 hover:bg-blue-700 text-white font-medium" @click="generarComprobante">
              {{ savingComprobante ? 'Emitiendo...' : 'Emitir Comprobante' }}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, FileText, DollarSign, AlertCircle } from 'lucide-vue-next'

import { toast } from 'vue-sonner'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useApiError } from '@/composables/useApiError'

import * as pagosService from '@/services/pagos'
import * as cortesService from '@/services/cortes'
import * as personasService from '@/services/personas'
import * as comprobantesService from '@/services/comprobantes'

import type { Pago, Corte, Persona } from '@/types'

const authStore = useAuthStore()
const { fieldErrors, globalError, handleError, clearErrors } = useApiError()

const pagosList = ref<Pago[]>([])
const pacientes = ref<Persona[]>([])
const corteActivo = ref<Corte | null>(null)

const searchTerm = ref('')
const loading = ref(true)
const saving = ref(false)
const savingComprobante = ref(false)

const isRegistrarOpen = ref(false)
const isComprobanteOpen = ref(false)
const selectedPagoId = ref<number | null>(null)
const comprobanteObs = ref('')

const form = reactive({
  paciente: '',
  total: '',
  efectivo: '',
  tarjeta: ''
})

const puedeGestionarCaja = computed(() => authStore.isAdmin || authStore.isRecepcionista)

const filteredPagos = computed(() => {
  if (!searchTerm.value) return pagosList.value
  const search = searchTerm.value.toLowerCase()
  return pagosList.value.filter(pago => 
    pago.paciente?.nombreCompleto.toLowerCase().includes(search) || 
    String(pago.id).includes(search)
  )
})

onMounted(async () => {
  if (!puedeGestionarCaja.value) {
    loading.value = false
    return
  }
  await Promise.all([
    fetchCorte(),
    fetchPagos(),
    fetchPacientes()
  ])
  loading.value = false
})

async function fetchCorte() {
  try {
    const res = await cortesService.getActivo()
    corteActivo.value = res.data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      corteActivo.value = null
    }
  }
}

async function fetchPagos() {
  try {
    const res = await pagosService.getAll()
    pagosList.value = res.data
  } catch {
    // Si no hay endpoints, manejamos error pero sin romper.
  }
}

async function fetchPacientes() {
  try {
    const res = await personasService.getAll()
    pacientes.value = res.data
  } catch {}
}

async function registrarPago() {
  const tot = Number(form.total || 0)
  const efe = Number(form.efectivo || 0)
  const tar = Number(form.tarjeta || 0)

  clearErrors()

  if (!form.paciente) {
    toast.error('Debes seleccionar un paciente')
    return
  }
  
  // Validacion de UI que evita requests 422 innecesarios pero también maneja los del server.
  if (tot !== (efe + tar)) {
    toast.error('El total debe ser igual al efectivo + tarjeta')
    return
  }
  if (tot <= 0) {
    toast.error('El total debe ser mayor a 0')
    return
  }

  saving.value = true
  try {
    await pagosService.create({
      idPersona: Number(form.paciente),
      total: tot,
      efectivo: efe,
      tarjeta: tar
    })
    toast.success('Pago registrado correctamente')
    isRegistrarOpen.value = false
    form.paciente = ''
    form.total = ''
    form.efectivo = ''
    form.tarjeta = ''
    await Promise.all([fetchPagos(), fetchCorte()])
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

function handleEmitirComprobante(pago: Pago) {
  selectedPagoId.value = pago.id
  comprobanteObs.value = ''
  isComprobanteOpen.value = true
}

async function generarComprobante() {
  if (!selectedPagoId.value) return
  savingComprobante.value = true
  try {
    const res = await comprobantesService.create({
      idPago: selectedPagoId.value,
      observaciones: comprobanteObs.value || undefined
    })
    toast.success('Comprobante emitido con folio: ' + res.data.folio)
    isComprobanteOpen.value = false
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
       toast.error('El pago ya cuenta con un comprobante u ocurrió un error de validación.')
    } else {
       toast.error('No se pudo emitir el comprobante.')
    }
  } finally {
    savingComprobante.value = false
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
