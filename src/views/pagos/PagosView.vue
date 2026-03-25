<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Download, Eye, FileText, DollarSign, Printer, Mail, CheckCircle2 } from 'lucide-vue-next';

interface Pago {
  id: number;
  folio: string;
  fecha: string;
  paciente: string;
  servicio: string;
  dentista: string;
  total: number;
  metodo: 'Efectivo' | 'Tarjeta de crédito' | 'Transferencia';
  factura: boolean;
}

const pagosList = ref<Pago[]>([
  {
    id: 1,
    folio: 'PAG-001',
    fecha: '15/3/2026',
    paciente: 'María García Pérez',
    servicio: 'Limpieza Dental',
    dentista: 'Dr. Ana Rodríguez López',
    total: 800,
    metodo: 'Efectivo',
    factura: false,
  },
  {
    id: 2,
    folio: 'PAG-002',
    fecha: '13/3/2026',
    paciente: 'Roberto Mendoza Silva',
    servicio: 'Resina Dental',
    dentista: 'Dr. Miguel Hernández Ramírez',
    total: 1080,
    metodo: 'Tarjeta de crédito',
    factura: true,
  },
  {
    id: 3,
    folio: 'PAG-003',
    fecha: '12/3/2026',
    paciente: 'Sofía Torres Ramírez',
    servicio: 'Blanqueamiento Dental',
    dentista: 'Dr. Ana Rodríguez López',
    total: 3000,
    metodo: 'Transferencia',
    factura: true,
  }
]);

const searchTerm = ref('');
const isRegistrarOpen = ref(false);
const isComprobanteOpen = ref(false);
const selectedPago = ref<Pago | null>(null);

const handleOpenComprobante = (pago: Pago) => {
  selectedPago.value = pago;
  isComprobanteOpen.value = true;
};

const filteredPagos = computed(() => {
  if (!searchTerm.value) return pagosList.value;
  const search = searchTerm.value.toLowerCase();
  return pagosList.value.filter(pago => 
    pago.paciente.toLowerCase().includes(search) || 
    pago.folio.toLowerCase().includes(search)
  );
});

const getMetodoClass = (metodo: string) => {
  if (metodo === 'Efectivo') return 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#DCFCE7]';
  if (metodo === 'Tarjeta de crédito') return 'bg-blue-50 text-blue-600 hover:bg-blue-50';
  if (metodo === 'Transferencia') return 'bg-purple-50 text-purple-600 hover:bg-purple-50';
  return 'bg-slate-100 text-slate-600 hover:bg-slate-100';
};
</script>

<template>
  <div class="min-h-full bg-[#F1F5F9] px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
    <div class="w-full space-y-6">
      
      <!-- Header Section -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-[30px] font-semibold tracking-tight text-[#0C3660] leading-none">Pagos y Facturación</h1>
          <p class="text-sm font-medium mt-2 text-slate-500">
            Gestión de cobros y comprobantes
          </p>
        </div>
        <Dialog v-model:open="isRegistrarOpen">
          <DialogTrigger as-child>
            <Button class="bg-[#378ADD] hover:bg-[#2c71b8] text-white transition-all duration-200 w-full sm:w-auto shrink-0 rounded-lg shadow-sm font-medium px-5 h-10">
              <Plus class="w-4 h-4 mr-2" />
              Registrar Pago
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[462px]">
            <DialogHeader>
              <DialogTitle class="text-[20px] font-bold text-[#0C3660]">Registrar Nuevo Pago</DialogTitle>
              <DialogDescription class="text-sm text-slate-500">
                Completa el formulario para capturar el cobro de un servicio
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-2">
              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Paciente *</Label>
                <Select>
                  <SelectTrigger class="bg-slate-50 border-slate-200 focus:ring-blue-500">
                    <SelectValue placeholder="Selecciona un paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">María García Pérez</SelectItem>
                    <SelectItem value="p2">Roberto Mendoza Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Cita Asociada</Label>
                <Select>
                  <SelectTrigger class="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Selecciona una cita" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c1">Hoy 10:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Servicio Cobrado *</Label>
                <Select>
                  <SelectTrigger class="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">Limpieza Dental</SelectItem>
                    <SelectItem value="s2">Resina Dental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                <div class="space-y-1.5">
                  <Label class="text-sm font-medium text-slate-700">Precio *</Label>
                  <Input type="number" placeholder="1000" class="bg-slate-50 border-slate-200" />
                </div>
                <div class="space-y-1.5">
                  <Label class="text-sm font-medium text-slate-700">Desc.</Label>
                  <Input type="number" placeholder="0" class="bg-slate-50 border-slate-200" />
                </div>
                <div class="space-y-1.5 flex flex-col justify-end pb-2">
                  <Label class="text-[11px] text-slate-500 mb-0.5 whitespace-nowrap">Total a Cobrar</Label>
                  <span class="text-blue-600 font-bold text-lg leading-none">1000</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Método de Pago *</Label>
                <Select>
                  <SelectTrigger class="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de crédito</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Referencia de Pago</Label>
                <Input placeholder="Folio o últimos 4 dígitos" class="bg-slate-50 border-slate-200" />
              </div>
              
              <div class="flex items-center gap-2 pt-1 pb-1">
                <Checkbox id="factura" />
                <label for="factura" class="text-sm text-slate-600 font-medium leading-none cursor-pointer">
                  ¿Requiere factura?
                </label>
              </div>

              <div class="space-y-1.5">
                <Label class="text-sm font-medium text-slate-700">Notas Adicionales</Label>
                <Textarea placeholder="Observaciones..." class="bg-slate-50 border-slate-200 resize-none h-16" />
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-2">
              <Button variant="ghost" class="text-slate-600 hover:bg-slate-100" @click="isRegistrarOpen = false">Cancelar</Button>
              <Button class="bg-blue-600 hover:bg-blue-700 text-white font-medium" @click="isRegistrarOpen = false">Registrar Pago</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Resumen Financiero Section -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <div class="w-5 h-5 flex items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
            <DollarSign class="w-3.5 h-3.5" />
          </div>
          <h2 class="text-sm font-medium text-[#0C3660]">Resumen financiero</h2>
        </div>
        <Card class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 w-full">
          <p class="text-[13px] font-medium text-slate-500 mb-1">Total Recaudado</p>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-[24px] font-semibold text-[#0C3660]">$4,880</span>
            <span class="text-[12px] font-medium text-slate-500 ml-1">MXN · 3 pagos</span>
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
        <div class="flex gap-3 sm:ml-auto">
          <Button variant="outline" class="h-10 border-slate-200 text-[#0C3660] font-medium bg-white hover:bg-slate-50 shadow-sm">
            <Download class="w-4 h-4 mr-2" />
            Exportar a Excel
          </Button>
        </div>
      </div>

      <!-- Table Section -->
      <div>
        <h3 class="text-[16px] font-medium text-[#0C3660] mb-3">
          Historial de Pagos ({{ filteredPagos.length }})
        </h3>
        <Card class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow class="hover:bg-transparent border-b border-slate-200 bg-slate-50">
                  <TableHead class="w-[100px] text-slate-500 font-medium text-[13px] h-10 px-4">Folio</TableHead>
                  <TableHead class="w-[110px] text-slate-500 font-medium text-[13px] h-10 px-4">Fecha</TableHead>
                  <TableHead class="min-w-[180px] text-slate-500 font-medium text-[13px] h-10 px-4">Paciente</TableHead>
                  <TableHead class="min-w-[180px] text-slate-500 font-medium text-[13px] h-10 px-4">Servicio</TableHead>
                  <TableHead class="min-w-[180px] text-slate-500 font-medium text-[13px] h-10 px-4">Dentista</TableHead>
                  <TableHead class="w-[100px] text-slate-500 font-medium text-[13px] h-10 px-4">Total</TableHead>
                  <TableHead class="w-[140px] text-slate-500 font-medium text-[13px] h-10 px-4">Método</TableHead>
                  <TableHead class="w-[90px] text-slate-500 font-medium text-[13px] h-10 px-4 text-center">Factura</TableHead>
                  <TableHead class="w-[110px] text-slate-500 font-medium text-[13px] h-10 px-4 text-right rounded-tr-xl">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="pago in filteredPagos" :key="pago.id" class="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                  <TableCell class="font-medium text-[#0C3660] py-4 text-[13px] px-4">{{ pago.folio }}</TableCell>
                  <TableCell class="text-[#374151] py-4 text-[13px] px-4 font-medium">{{ pago.fecha }}</TableCell>
                  <TableCell class="text-[#374151] py-4 text-[13px] px-4 font-medium">{{ pago.paciente }}</TableCell>
                  <TableCell class="text-[#374151] py-4 text-[13px] px-4 font-medium">{{ pago.servicio }}</TableCell>
                  <TableCell class="text-[#374151] py-4 text-[13px] px-4 font-medium">{{ pago.dentista }}</TableCell>
                  <TableCell class="font-medium text-[#0C3660] py-4 text-[13px] px-4">${{ pago.total.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</TableCell>
                  <TableCell class="px-4 py-4">
                    <Badge class="rounded-[6px] px-2.5 py-1 text-[12px] font-medium border-0 shadow-none w-max" :class="getMetodoClass(pago.metodo)">
                      {{ pago.metodo }}
                    </Badge>
                  </TableCell>
                  <TableCell class="font-medium text-[#374151] py-4 text-[13px] px-4 text-center">
                    {{ pago.factura ? 'Sí' : 'No' }}
                  </TableCell>
                  <TableCell class="text-right px-4 py-4">
                    <div class="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" class="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors" title="Ver detalles" @click="handleOpenComprobante(pago)">
                        <Eye class="w-[18px] h-[18px]" />
                      </Button>
                      <Button variant="ghost" size="icon" class="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors" title="Factura" @click="handleOpenComprobante(pago)">
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

      <!-- Comprobante Modal -->
      <Dialog v-model:open="isComprobanteOpen">
        <DialogContent class="sm:max-w-[420px] p-0 border-slate-200 overflow-hidden bg-white shadow-xl">
          <div class="p-6 md:p-8 relative">
            
            <!-- Header -->
            <div class="text-center mb-6 mt-2">
              <div class="flex items-center justify-center gap-2 mb-1">
                <div class="text-[#0C3660] font-bold text-[22px] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M12 2c-3.1 0-5.7 2.4-6 5.5l-.2 2.5c-.2 2.8-2.6 5-5.3 5v2c2.8 0 5.4-1.2 7.2-3.2.4-.4 1-.6 1.6-.4.5.1 1 .5 1.2 1 .4 1 1.4 1.6 2.5 1.6s2.1-.6 2.5-1.6c.2-.5.7-.9 1.2-1 .6-.2 1.2 0 1.6.4 1.8 2 4.4 3.2 7.2 3.2v-2c-2.7 0-5.1-2.2-5.3-5l-.2-2.5C17.7 4.4 15.1 2 12 2Z"/></svg>
                  DentalSys
                </div>
              </div>
              <p class="text-[13px] text-slate-500">Sistema de Gestión Dental</p>
            </div>

            <!-- Meta Data Grid -->
            <div class="grid grid-cols-2 gap-y-4 mb-6">
              <div>
                <p class="text-xs text-slate-500 mb-0.5">Folio</p>
                <p class="text-sm font-bold text-[#0C3660]">{{ selectedPago?.folio }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-0.5">Fecha</p>
                <p class="text-sm font-medium text-[#0C3660]">{{ selectedPago?.fecha }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs text-slate-500 mb-0.5">Paciente</p>
                <p class="text-sm font-medium text-[#0C3660]">{{ selectedPago?.paciente }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs text-slate-500 mb-0.5">Dentista</p>
                <p class="text-sm font-medium text-[#0C3660]">{{ selectedPago?.dentista }}</p>
              </div>
            </div>

            <!-- Service Details -->
            <div class="border-t border-b border-dashed border-slate-200 py-4 mb-6">
              <h4 class="text-sm font-semibold text-[#0C3660] mb-3">Detalles del Servicio</h4>
              <div class="flex justify-between items-center mb-2">
                <span class="text-[13px] text-slate-600">Servicio:</span>
                <span class="text-[13px] font-medium text-slate-800">{{ selectedPago?.servicio }}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-[13px] text-slate-600">Precio:</span>
                <span class="text-[13px] font-medium text-slate-800">${{ selectedPago?.total.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span class="text-sm font-medium text-[#0C3660]">Total Cobrado:</span>
                <span class="text-xl font-bold text-emerald-600">${{ selectedPago?.total.toLocaleString('es-MX', { minimumFractionDigits: 0 }) }} MXN</span>
              </div>
            </div>

            <!-- Payment Method & Status -->
            <div class="mb-2">
              <p class="text-xs text-slate-500 mb-1">Método de Pago</p>
              <p class="text-[13px] font-medium text-[#0C3660]">{{ selectedPago?.metodo }}</p>
            </div>

            <div class="flex justify-center mt-6 mb-2">
              <div class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100">
                <CheckCircle2 class="w-4 h-4" />
                <span class="text-[13px] font-bold tracking-wide uppercase">Pagado</span>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <div class="flex gap-2">
              <Button variant="outline" class="h-9 border-slate-200 text-slate-600 hover:bg-white bg-transparent outline-none">
                <Printer class="w-4 h-4 sm:mr-2" />
                <span class="hidden sm:inline">Imprimir</span>
              </Button>
              <Button variant="outline" class="h-9 border-slate-200 text-slate-600 hover:bg-white bg-transparent outline-none">
                <Mail class="w-4 h-4 sm:mr-2" />
                <span class="hidden sm:inline">Email</span>
              </Button>
            </div>
            <Button class="bg-blue-600 hover:bg-blue-700 text-white font-medium h-9" @click="isComprobanteOpen = false">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
