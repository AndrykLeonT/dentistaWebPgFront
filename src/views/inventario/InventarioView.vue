<template>
  <div class="min-h-full bg-[#F1F5F9] px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
    <div class="w-full space-y-6">
      
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-[30px] font-semibold tracking-tight text-[#0C3660] leading-none">Inventario</h1>
          <p class="text-base font-medium mt-2 text-[#0C3660]">
            Control de materiales e insumos dentales
          </p>
        </div>
        
        <Dialog v-if="puedeGestionar" v-model:open="isDialogOpen">
          <DialogTrigger as-child>
            <Button @click="handleNewProducto" class="bg-[#378ADD] hover:bg-[#2c71b8] text-white transition-all duration-200 w-full sm:w-auto shrink-0 rounded-lg shadow-sm font-medium px-5 h-10 sm:ml-4">
              <Plus class="w-4 h-4 mr-2" />
              Nuevo Insumo
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{{ formProducto.id ? 'Editar Insumo' : 'Registrar Nuevo Insumo' }}</DialogTitle>
              <DialogDescription>
                {{ formProducto.id ? 'Modifica los datos del insumo' : 'Agrega un nuevo insumo al inventario' }}
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div v-if="globalError" class="p-3 bg-red-50 rounded-md border border-red-200">
                <p class="text-red-600 text-sm">{{ globalError }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2 col-span-2">
                  <Label class="font-medium">Nombre del Insumo *</Label>
                  <Input
                    placeholder="Ej: Resina Composite"
                    v-model="formProducto.nombre"
                    class="bg-input-background"
                    :class="fieldErrors['nombre'] ? 'border-red-400' : ''"
                  />
                  <p v-if="fieldErrors['nombre']" class="text-red-500 text-xs">{{ fieldErrors['nombre'][0] }}</p>
                </div>
                
                <div class="space-y-2">
                  <Label class="font-medium">Unidad de Medida *</Label>
                  <Select v-model="formProducto.unidadMedida">
                    <SelectTrigger class="bg-input-background" :class="fieldErrors['unidadMedida'] ? 'border-red-400' : ''">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="u in unidades" :key="u" :value="u">{{ u }}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p v-if="fieldErrors['unidadMedida']" class="text-red-500 text-xs">{{ fieldErrors['unidadMedida'][0] }}</p>
                </div>

                <div class="space-y-2" v-if="!formProducto.id">
                  <Label class="font-medium">Stock Inicial *</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    v-model="formProducto.stockInicial"
                    class="bg-input-background"
                    :class="fieldErrors['stockInicial'] ? 'border-red-400' : ''"
                  />
                  <p v-if="fieldErrors['stockInicial']" class="text-red-500 text-xs">{{ fieldErrors['stockInicial'][0] }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <Label class="font-medium">Descripción</Label>
                <Textarea
                  placeholder="Describe las características..."
                  v-model="formProducto.descripcion"
                  class="bg-input-background"
                  :class="fieldErrors['descripcion'] ? 'border-red-400' : ''"
                />
                <p v-if="fieldErrors['descripcion']" class="text-red-500 text-xs">{{ fieldErrors['descripcion'][0] }}</p>
              </div>
            </div>
            
            <div class="flex justify-end gap-2">
              <Button variant="outline" @click="isDialogOpen = false">
                Cancelar
              </Button>
              <Button @click="handleSaveProducto" :disabled="saving" class="bg-primary text-primary-foreground hover:opacity-90">
                {{ saving ? 'Guardando...' : (formProducto.id ? 'Actualizar' : 'Guardar') }}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Alerta Permisos -->
      <div v-if="!puedeGestionar && !loading" class="bg-amber-50 rounded-lg outline outline-[1px] outline-amber-600 px-4 py-3 flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-amber-600" />
        <span class="text-amber-800 text-sm font-medium leading-5">No tienes permisos para operar el inventario.</span>
      </div>

      <template v-else>
        <!-- Alertas de Bajo Stock -->
        <div
          v-if="alertasActivas > 0 && !loading"
          class="w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-yellow-200 shadow-sm bg-yellow-100"
        >
          <AlertTriangle class="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 text-yellow-500" />
          <div>
            <p class="font-medium text-[16px] sm:text-[16px] leading-tight text-yellow-800">
              {{ alertasActivas }} insumo(s) con bajo stock o agotados
            </p>
            <p class="text-[14px] mt-1 text-[#4A6279]">
              Revisa el inventario para reabastecer a tiempo.
            </p>
          </div>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div class="relative min-w-0 flex-1 flex items-center h-10 border border-slate-200 bg-white rounded-[6px] px-3">
            <Search class="absolute left-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre..."
              v-model="searchTerm"
              class="pl-9 h-full border-0 shadow-none focus-visible:ring-0 text-[#0C3660] bg-transparent w-full text-sm placeholder:text-slate-400"
            />
          </div>
          <div class="w-full md:w-[220px] h-10 flex items-center border border-slate-200 bg-white rounded-[6px] px-3">
            <Select v-model="filterStock">
              <SelectTrigger class="w-full h-full border-0 shadow-none focus:ring-0 bg-transparent text-[#0C3660] font-medium text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Bajo stock">Bajo stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Tabla de Inventario -->
        <Card class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-200">
            <h2 class="text-[16px] font-medium text-[#0C3660]">
              Inventario de Insumos ({{ filteredProductos.length }})
            </h2>
          </div>
          <div class="px-4 sm:px-6 pb-5 sm:pb-6 pt-4">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow class="hover:bg-transparent border-b border-slate-200 bg-slate-50">
                    <TableHead class="w-[80px] text-slate-500 font-medium text-[14px] h-11 px-4">ID</TableHead>
                    <TableHead class="min-w-[220px] text-slate-500 font-medium text-[14px] h-11 px-4">Nombre</TableHead>
                    <TableHead class="w-[110px] text-slate-500 font-medium text-[14px] h-11 px-4">Cantidad</TableHead>
                    <TableHead class="w-[100px] text-slate-500 font-medium text-[14px] h-11 px-4">Unidad</TableHead>
                    <TableHead class="w-[130px] text-slate-500 font-medium text-[14px] h-11 px-4">Estado</TableHead>
                    <TableHead class="w-[140px] text-slate-500 font-medium text-[14px] text-right h-11 px-4 rounded-tr-lg">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-if="loading" class="text-center">
                    <TableCell colspan="6" class="py-6 text-slate-500">Cargando inventario...</TableCell>
                  </TableRow>
                  <TableRow v-else-if="filteredProductos.length === 0" class="text-center">
                    <TableCell colspan="6" class="py-6 text-slate-500">No hay productos registrados</TableCell>
                  </TableRow>
                  <TableRow v-for="producto in filteredProductos" :key="producto.id" class="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                    <TableCell class="font-medium text-[#0C3660] py-4 px-4 text-sm">{{ producto.id }}</TableCell>
                    <TableCell class="text-[#0C3660] py-4 px-4 text-sm font-medium">{{ producto.nombre }}</TableCell>
                    <TableCell class="px-4">
                      <div class="flex items-center gap-[6px]">
                        <Package class="w-4 h-4 text-[#64748B] mb-[2px]" />
                        <span class="font-normal text-slate-600 text-sm">{{ producto.stockActual }}</span>
                      </div>
                    </TableCell>
                    <TableCell class="px-4 text-sm text-slate-500 font-normal">{{ producto.unidadMedida }}</TableCell>
                    <TableCell class="px-4">
                      <!-- Badge condicional -->
                      <Badge class="rounded-[6px] px-3 py-1 font-medium text-[13px] shadow-none flex items-center gap-1.5 w-max border-0" :class="producto.bajoStock ? getEstadoClass('Bajo stock') : getEstadoClass('Normal')">
                        <AlertCircle v-if="producto.bajoStock" class="w-3.5 h-3.5" />
                        <CheckCircle2 v-else class="w-3.5 h-3.5" />
                        {{ producto.bajoStock ? 'Bajo stock' : 'Normal' }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-right px-4">
                      <div class="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          @click="handleUpdateStock(producto)"
                          title="Actualizar Stock"
                        >
                          <TrendingUp class="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          @click="handleEditProducto(producto)"
                          title="Editar Producto"
                        >
                          <Edit class="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          @click="handleDeleteProducto(producto)"
                          title="Dar de baja"
                        >
                          <XCircle class="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        <Card class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-200">
            <h2 class="text-[16px] font-medium text-[#0C3660]">Consumo por servicio</h2>
            <p class="text-sm text-slate-500 mt-1">
              Reglas preparadas para que backend descuente insumos al atender una cita.
            </p>
          </div>
          <div class="px-4 sm:px-6 pb-5 sm:pb-6 pt-4 space-y-4">
            <div v-if="consumosEndpointPendiente" class="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-xs">
              Endpoint backend pendiente: /api/inventario/consumos-servicio.
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select v-model="formConsumo.idServicio">
                <SelectTrigger class="bg-input-background">
                  <SelectValue placeholder="Servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="servicio in serviciosList" :key="servicio.id" :value="String(servicio.id)">
                    {{ servicio.nombre }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select v-model="formConsumo.idProductoInventario">
                <SelectTrigger class="bg-input-background">
                  <SelectValue placeholder="Insumo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="producto in productosList" :key="producto.id" :value="String(producto.id)">
                    {{ producto.nombre }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input v-model="formConsumo.cantidad" type="number" min="0" placeholder="Cantidad" class="bg-input-background" />
              <Button @click="handleSaveConsumo" :disabled="savingConsumo" class="bg-[#378ADD] text-white">
                {{ savingConsumo ? 'Guardando...' : (formConsumo.id ? 'Actualizar regla' : 'Crear regla') }}
              </Button>
            </div>

            <div v-if="loadingConsumos" class="py-6 text-center text-slate-500">Cargando reglas...</div>
            <div v-else-if="consumosList.length === 0" class="py-6 text-center text-slate-500">
              No hay reglas de consumo registradas.
            </div>
            <div v-else class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow class="hover:bg-transparent border-b border-slate-200 bg-slate-50">
                    <TableHead class="text-slate-500 font-medium text-[14px] h-11 px-4">Servicio</TableHead>
                    <TableHead class="text-slate-500 font-medium text-[14px] h-11 px-4">Insumo</TableHead>
                    <TableHead class="text-slate-500 font-medium text-[14px] h-11 px-4">Cantidad</TableHead>
                    <TableHead class="text-slate-500 font-medium text-[14px] h-11 px-4 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="consumo in consumosList" :key="consumo.id" class="border-b border-slate-200 last:border-0">
                    <TableCell class="px-4 py-3 text-sm text-[#0C3660]">{{ consumo.servicio || getServicioNombre(consumo.idServicio) }}</TableCell>
                    <TableCell class="px-4 py-3 text-sm text-[#0C3660]">{{ consumo.producto || getProductoNombre(consumo.idProductoInventario) }}</TableCell>
                    <TableCell class="px-4 py-3 text-sm text-slate-600">{{ consumo.cantidad }}</TableCell>
                    <TableCell class="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" class="h-8 w-8 text-blue-500" @click="handleEditConsumo(consumo)">
                        <Edit class="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500" @click="handleDeleteConsumo(consumo)">
                        <XCircle class="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </template>

      <!-- Dialog Actualizar Stock (Movimientos) -->
      <Dialog v-model:open="isUpdateStockOpen">
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar Stock</DialogTitle>
            <DialogDescription>
              Registra entradas, salidas o ajustes de inventario
            </DialogDescription>
          </DialogHeader>
          <div v-if="selectedProducto" class="space-y-4 py-4">
            <div v-if="globalError" class="p-3 bg-red-50 rounded-md border border-red-200">
              <p class="text-red-600 text-sm">{{ globalError }}</p>
            </div>

            <div class="p-4 rounded-lg bg-input-background">
              <p class="font-medium text-foreground">{{ selectedProducto.nombre }}</p>
              <p class="text-sm text-muted-foreground mt-1">
                Stock actual: <strong>{{ selectedProducto.stockActual }}</strong> {{ selectedProducto.unidadMedida }}
              </p>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Tipo de Movimiento *</Label>
              <Select v-model="formStock.tipoMovimiento">
                <SelectTrigger class="bg-input-background" :class="fieldErrors['tipoMovimiento'] ? 'border-red-400' : ''">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                  <SelectItem value="ajuste">Ajuste / Merma</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="fieldErrors['tipoMovimiento']" class="text-red-500 text-xs">{{ fieldErrors['tipoMovimiento'][0] }}</p>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Cantidad *</Label>
              <Input
                type="number"
                placeholder="0"
                v-model="formStock.cantidad"
                class="bg-input-background"
                :class="fieldErrors['cantidad'] ? 'border-red-400' : ''"
              />
              <p v-if="fieldErrors['cantidad']" class="text-red-500 text-xs">{{ fieldErrors['cantidad'][0] }}</p>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Motivo (opcional)</Label>
              <Textarea
                placeholder="Ej: Uso en clínica, ajuste de inventario físico..."
                v-model="formStock.motivo"
                class="bg-input-background"
                :class="fieldErrors['motivo'] ? 'border-red-400' : ''"
              />
              <p v-if="fieldErrors['motivo']" class="text-red-500 text-xs">{{ fieldErrors['motivo'][0] }}</p>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="isUpdateStockOpen = false">
              Cancelar
            </Button>
            <Button @click="handleSaveStock" :disabled="saving" class="bg-primary text-primary-foreground hover:opacity-90">
              {{ saving ? 'Guardando...' : 'Confirmar' }}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Edit, Package, AlertTriangle, TrendingUp, CheckCircle2, AlertCircle, XCircle } from 'lucide-vue-next'

import axios from 'axios'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { useApiError } from '@/composables/useApiError'
import * as inventarioService from '@/services/inventario'
import * as serviciosService from '@/services/servicios'
import type { ConsumoServicio, ProductoInventario, Servicio } from '@/types'

const authStore = useAuthStore()
const { fieldErrors, globalError, handleError, clearErrors } = useApiError()

// Auth permissions
const puedeGestionar = computed(() => authStore.isAdmin)

// State
const productosList = ref<ProductoInventario[]>([])
const loading = ref(true)
const saving = ref(false)
const savingConsumo = ref(false)
const loadingConsumos = ref(false)
const consumosEndpointPendiente = ref(false)

const searchTerm = ref('')
const filterStock = ref<string>('todos') // 'todos' | 'Normal' | 'Bajo stock'
const isDialogOpen = ref(false)
const isUpdateStockOpen = ref(false)

const selectedProducto = ref<ProductoInventario | null>(null)
const consumosList = ref<ConsumoServicio[]>([])
const serviciosList = ref<Servicio[]>([])

// Forms
const formProducto = ref({
  id: 0,
  nombre: '',
  unidadMedida: '',
  stockInicial: '',
  descripcion: ''
})

const formStock = ref({
  tipoMovimiento: '',
  cantidad: '',
  motivo: ''
})

const formConsumo = ref({
  id: 0,
  idServicio: '',
  idProductoInventario: '',
  cantidad: '',
})

// Static Data
const unidades = ['Pieza', 'Caja', 'Frasco', 'Mililitros', 'Gramos', 'Rollo', 'Kit', 'Otro']

// Computeds
const filteredProductos = computed(() => {
  return productosList.value.filter(p => {
    const sTerm = searchTerm.value.toLowerCase()
    const matchesSearch = p.nombre.toLowerCase().includes(sTerm)
    
    let matchesStock = true
    if (filterStock.value === 'Normal') matchesStock = !p.bajoStock
    if (filterStock.value === 'Bajo stock') matchesStock = !!p.bajoStock
    
    return matchesSearch && matchesStock
  })
})

const alertasActivas = computed(() => {
  return productosList.value.filter(p => p.bajoStock).length
})

// Lifecycle
onMounted(async () => {
  if (puedeGestionar.value) {
    await fetchProductos()
    await Promise.all([fetchConsumosServicio(), fetchServicios()])
  } else {
    loading.value = false
  }
})

// Methods
async function fetchProductos() {
  loading.value = true
  try {
    const res = await inventarioService.getProductos()
    productosList.value = res.data
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

async function fetchServicios() {
  try {
    const res = await serviciosService.getAll()
    serviciosList.value = res.data
  } catch {
    serviciosList.value = []
  }
}

async function fetchConsumosServicio() {
  loadingConsumos.value = true
  consumosEndpointPendiente.value = false
  try {
    const res = await inventarioService.getConsumosServicio()
    consumosList.value = res.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      consumosEndpointPendiente.value = true
      consumosList.value = []
    } else {
      handleError(error)
    }
  } finally {
    loadingConsumos.value = false
  }
}

const handleNewProducto = () => {
  clearErrors()
  formProducto.value = { 
    id: 0,
    nombre: '',
    unidadMedida: 'Pieza',
    stockInicial: '',
    descripcion: ''
  }
}

const handleEditProducto = (producto: ProductoInventario) => {
  clearErrors()
  formProducto.value = {
    id: producto.id,
    nombre: producto.nombre,
    unidadMedida: producto.unidadMedida,
    stockInicial: '', // No se usa en edit
    descripcion: producto.descripcion || ''
  }
  isDialogOpen.value = true
}

const handleUpdateStock = (producto: ProductoInventario) => {
  clearErrors()
  selectedProducto.value = producto
  formStock.value = {
    tipoMovimiento: '',
    cantidad: '',
    motivo: ''
  }
  isUpdateStockOpen.value = true
}

const handleSaveProducto = async () => {
  clearErrors()
  saving.value = true
  
  try {
    if (formProducto.value.id) {
      // Edit
      await inventarioService.updateProducto(formProducto.value.id, {
        nombre: formProducto.value.nombre,
        unidadMedida: formProducto.value.unidadMedida,
        descripcion: formProducto.value.descripcion || undefined
      })
      toast.success('Insumo actualizado correctamente')
    } else {
      // Create
      await inventarioService.createProducto({
        nombre: formProducto.value.nombre,
        unidadMedida: formProducto.value.unidadMedida,
        stockInicial: Number(formProducto.value.stockInicial || 0),
        descripcion: formProducto.value.descripcion || undefined
      })
      toast.success('Insumo registrado correctamente')
    }
    isDialogOpen.value = false
    await fetchProductos()
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

const handleSaveStock = async () => {
  if (!selectedProducto.value) return
  clearErrors()
  saving.value = true

  try {
    await inventarioService.createMovimiento({
      idProductoInventario: selectedProducto.value.id,
      tipoMovimiento: formStock.value.tipoMovimiento as 'entrada' | 'salida' | 'ajuste',
      cantidad: Number(formStock.value.cantidad || 0),
      motivo: formStock.value.motivo || undefined
    })
    toast.success('Stock actualizado correctamente')
    isUpdateStockOpen.value = false
    await fetchProductos()
  } catch (error) {
    handleError(error)
  } finally {
    saving.value = false
  }
}

const handleEditConsumo = (consumo: ConsumoServicio) => {
  formConsumo.value = {
    id: consumo.id,
    idServicio: String(consumo.idServicio),
    idProductoInventario: String(consumo.idProductoInventario),
    cantidad: String(consumo.cantidad),
  }
}

const handleSaveConsumo = async () => {
  const payload = {
    idServicio: Number(formConsumo.value.idServicio),
    idProductoInventario: Number(formConsumo.value.idProductoInventario),
    cantidad: Number(formConsumo.value.cantidad || 0),
  }

  if (!payload.idServicio || !payload.idProductoInventario || payload.cantidad <= 0) {
    toast.error('Completa servicio, insumo y cantidad mayor a 0.')
    return
  }

  savingConsumo.value = true
  consumosEndpointPendiente.value = false
  try {
    if (formConsumo.value.id) {
      await inventarioService.updateConsumoServicio(formConsumo.value.id, payload)
      toast.success('Regla de consumo actualizada.')
    } else {
      await inventarioService.createConsumoServicio(payload)
      toast.success('Regla de consumo creada.')
    }
    formConsumo.value = { id: 0, idServicio: '', idProductoInventario: '', cantidad: '' }
    await fetchConsumosServicio()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      consumosEndpointPendiente.value = true
      toast.error('Endpoint backend pendiente para consumo por servicio.')
    } else {
      handleError(error)
    }
  } finally {
    savingConsumo.value = false
  }
}

const handleDeleteConsumo = async (consumo: ConsumoServicio) => {
  if (!confirm('¿Deseas eliminar esta regla de consumo?')) return
  try {
    await inventarioService.removeConsumoServicio(consumo.id)
    toast.success('Regla de consumo eliminada.')
    await fetchConsumosServicio()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      consumosEndpointPendiente.value = true
      toast.error('Endpoint backend pendiente para consumo por servicio.')
    } else {
      handleError(error)
    }
  }
}

function getServicioNombre(id: number) {
  return serviciosList.value.find((servicio) => servicio.id === id)?.nombre || `Servicio ${id}`
}

function getProductoNombre(id: number) {
  return productosList.value.find((producto) => producto.id === id)?.nombre || `Producto ${id}`
}

const handleDeleteProducto = async (producto: ProductoInventario) => {
  if (!confirm(`¿Estás seguro de que deseas eliminar el insumo "${producto.nombre}"?`)) return
  
  try {
    await inventarioService.removeProducto(producto.id)
    toast.success('Insumo eliminado del inventario')
    await fetchProductos()
  } catch {
    toast.error('Ocurrió un error al eliminar el insumo')
  }
}

// Visual Helpers
const getEstadoClass = (estado: string) => {
  if (estado === 'Normal') return 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#DCFCE7]'
  if (estado === 'Bajo stock') return 'bg-[#FEF9C3] text-[#A16207] hover:bg-[#FEF9C3]'
  if (estado === 'Sin stock') return 'bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FEE2E2]'
  return 'bg-slate-100 text-slate-500 hover:bg-slate-100'
}
</script>
