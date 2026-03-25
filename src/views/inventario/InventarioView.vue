<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Plus, Edit, Package, AlertTriangle, TrendingUp } from 'lucide-vue-next';
import { mockInsumos } from '@/lib/mock-data';
import { toast } from 'vue-sonner';

interface Insumo {
  id?: number;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  proveedor?: string;
  unidadMedida: string;
  cantidadActual: number;
  nivelMinimo: number;
  precioUnitario?: number;
  fechaCaducidad?: string;
  notas?: string;
  estadoStock: string;
}

interface MovimientoStock {
  tipoMovimiento: string;
  cantidad: number | string;
  fecha: string;
  notas: string;
}

// Estados principales
const searchTerm = ref('');
const filterCategoria = ref<string>('todos');
const filterStock = ref<string>('todos');
const isDialogOpen = ref(false);
const isUpdateStockOpen = ref(false);

const selectedInsumo = ref<Insumo | null>(null);

// Estado de formularios reactivos para v-model
const formInsumo = ref<Partial<Insumo>>({});
const formStock = ref<MovimientoStock>({
  tipoMovimiento: '',
  cantidad: '',
  fecha: new Date().toISOString().substring(0, 10),
  notas: ''
});

// Propiedades Computadas
const filteredInsumos = computed(() => {
  return mockInsumos.filter(insumo => {
    const matchesSearch = 
      insumo.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      insumo.codigo.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesCategoria = filterCategoria.value === 'todos' || insumo.categoria === filterCategoria.value;
    const matchesStock = filterStock.value === 'todos' || insumo.estadoStock === filterStock.value;
    
    return matchesSearch && matchesCategoria && matchesStock;
  });
});

const alertasActivas = computed(() => {
  return mockInsumos.filter(i => i.estadoStock !== 'Normal').length;
});

// Métodos (Manejadores de eventos)
const handleEditInsumo = (insumo: Insumo) => {
  selectedInsumo.value = insumo;
  formInsumo.value = { ...insumo }; // Clonar los datos para el formulario
  isDialogOpen.value = true;
};

const handleNewInsumo = () => {
  selectedInsumo.value = null;
  formInsumo.value = { 
    categoria: 'Consumibles', 
    unidadMedida: 'Pieza' 
  }; // Valores por defecto
};

const handleUpdateStock = (insumo: Insumo) => {
  selectedInsumo.value = insumo;
  formStock.value = {
    tipoMovimiento: '',
    cantidad: '',
    fecha: new Date().toISOString().substring(0, 10),
    notas: ''
  };
  isUpdateStockOpen.value = true;
};

const handleSaveInsumo = () => {
  toast.success(selectedInsumo.value ? 'Insumo actualizado correctamente' : 'Insumo registrado correctamente');
  isDialogOpen.value = false;
};

const handleSaveStock = () => {
  toast.success('Stock actualizado correctamente');
  isUpdateStockOpen.value = false;
};

// Datos estáticos
const categorias = [
  'Materiales de restauración',
  'Anestesia',
  'Instrumental',
  'Higiene',
  'Consumibles',
  'Otro',
];

const unidades = ['Pieza', 'Caja', 'Frasco', 'Mililitros', 'Gramos', 'Rollo', 'Otro'];

// Función de estilo dinámico para el Badge
const getEstadoClass = (estado: string) => {
  if (estado === 'Normal') return 'bg-success text-success-foreground';
  if (estado === 'Bajo stock') return 'bg-amber-500 text-white';
  if (estado === 'Sin stock') return 'bg-destructive text-destructive-foreground';
  return 'bg-muted text-muted-foreground';
};
</script>

<template>
  <div class="min-h-full bg-background px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
    <div class="w-full space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-[32px] sm:text-[34px] leading-none font-medium tracking-tight text-foreground">Inventario</h1>
        <p class="text-sm sm:text-[15px] mt-2 text-muted-foreground">
          Control de materiales e insumos dentales
        </p>
      </div>
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button @click="handleNewInsumo" class="bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 w-full sm:w-auto shrink-0 rounded-[6px] shadow-sm font-medium px-5 h-9 sm:ml-4">
            <Plus class="w-4 h-4 mr-2" />
            Nuevo Insumo
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{{ selectedInsumo ? 'Editar Insumo' : 'Registrar Nuevo Insumo' }}</DialogTitle>
            <DialogDescription>
              {{ selectedInsumo ? 'Modifica los datos del insumo' : 'Completa el formulario para agregar un nuevo insumo al inventario' }}
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="font-medium">Código o Clave *</Label>
                <Input
                  placeholder="INS-001"
                  v-model="formInsumo.codigo"
                  class="bg-input-background"
                />
              </div>
              <div class="space-y-2">
                <Label class="font-medium">Nombre del Insumo *</Label>
                <Input
                  placeholder="Ej: Resina Composite"
                  v-model="formInsumo.nombre"
                  class="bg-input-background"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Categoría *</Label>
              <Select v-model="formInsumo.categoria">
                <SelectTrigger class="bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Descripción o Especificaciones</Label>
              <Textarea
                placeholder="Describe las características del insumo..."
                v-model="formInsumo.descripcion"
                class="bg-input-background"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="font-medium">Proveedor Habitual</Label>
                <Input
                  placeholder="Nombre del proveedor"
                  v-model="formInsumo.proveedor"
                  class="bg-input-background"
                />
              </div>
              <div class="space-y-2">
                <Label class="font-medium">Unidad de Medida *</Label>
                <Select v-model="formInsumo.unidadMedida">
                  <SelectTrigger class="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="u in unidades" :key="u" :value="u">{{ u }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label class="font-medium">Cantidad Inicial *</Label>
                <Input
                  type="number"
                  placeholder="100"
                  v-model="formInsumo.cantidadActual"
                  class="bg-input-background"
                />
              </div>
              <div class="space-y-2">
                <Label class="font-medium">Nivel Mínimo *</Label>
                <Input
                  type="number"
                  placeholder="20"
                  v-model="formInsumo.nivelMinimo"
                  class="bg-input-background"
                />
              </div>
              <div class="space-y-2">
                <Label class="font-medium">Precio Unitario</Label>
                <Input
                  type="number"
                  placeholder="50"
                  v-model="formInsumo.precioUnitario"
                  class="bg-input-background"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Fecha de Caducidad</Label>
              <Input
                type="date"
                v-model="formInsumo.fechaCaducidad"
                class="bg-input-background"
              />
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Notas Adicionales</Label>
              <Textarea
                placeholder="Observaciones..."
                v-model="formInsumo.notas"
                class="bg-input-background"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="isDialogOpen = false">
              Cancelar
            </Button>
            <Button @click="handleSaveInsumo" class="bg-primary text-primary-foreground hover:opacity-90">
              {{ selectedInsumo ? 'Actualizar' : 'Guardar' }} Insumo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Dialog para Actualizar Stock -->
      <Dialog v-model:open="isUpdateStockOpen">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Stock</DialogTitle>
            <DialogDescription>
              Registra entradas o salidas de inventario
            </DialogDescription>
          </DialogHeader>
          <div v-if="selectedInsumo" class="space-y-4 py-4">
            <div class="p-4 rounded-lg bg-input-background">
              <p class="font-medium text-foreground">{{ selectedInsumo.nombre }}</p>
              <p class="text-sm text-muted-foreground">
                Stock actual: <strong>{{ selectedInsumo.cantidadActual }}</strong> {{ selectedInsumo.unidadMedida }}
              </p>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Tipo de Movimiento *</Label>
              <Select v-model="formStock.tipoMovimiento">
                <SelectTrigger class="bg-input-background">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada de mercancía</SelectItem>
                  <SelectItem value="salida">Salida por uso</SelectItem>
                  <SelectItem value="ajuste">Ajuste de inventario</SelectItem>
                  <SelectItem value="merma">Merma / pérdida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Cantidad *</Label>
              <Input
                type="number"
                placeholder="10"
                v-model="formStock.cantidad"
                class="bg-input-background"
              />
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Fecha del Movimiento</Label>
              <Input
                type="date"
                v-model="formStock.fecha"
                class="bg-input-background"
              />
            </div>

            <div class="space-y-2">
              <Label class="font-medium">Notas del Movimiento</Label>
              <Textarea
                placeholder="Ej: Compra a proveedor X..."
                v-model="formStock.notas"
                class="bg-input-background"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="isUpdateStockOpen = false">
              Cancelar
            </Button>
            <Button @click="handleSaveStock" class="bg-primary text-primary-foreground hover:opacity-90">
              Confirmar Actualización
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Alertas de Stock -->
    <div
      v-if="alertasActivas > 0"
      class="w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-amber-500/80 shadow-sm bg-[#FFFBEB]"
    >
      <AlertTriangle class="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 text-amber-500" />
      <div>
        <p class="font-medium text-[16px] sm:text-[16px] leading-tight text-foreground">
          {{ alertasActivas }} insumo(s) requieren atención
        </p>
        <p class="text-[14px] mt-1 text-muted-foreground">
          Revisa el inventario para reabastecer los insumos con stock bajo o agotado
        </p>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-card border border-[var(--dental-blue-light)] rounded-xl shadow-sm">
      <div class="relative min-w-0 flex-1 flex items-center h-9 bg-transparent rounded-[6px] px-3">
        <Search class="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o código..."
          v-model="searchTerm"
          class="pl-9 h-full border-0 shadow-none focus-visible:ring-0 text-foreground bg-transparent w-full text-sm placeholder:text-muted-foreground"
        />
      </div>
      <div class="w-full md:w-[260px] h-9 flex items-center bg-transparent rounded-[6px] px-3">
        <Select v-model="filterCategoria">
          <SelectTrigger class="w-full h-full border-0 shadow-none focus:ring-0 bg-transparent text-foreground font-medium text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las categorías</SelectItem>
            <SelectItem v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="w-full md:w-[220px] h-9 flex items-center bg-transparent rounded-[6px] px-3">
        <Select v-model="filterStock">
          <SelectTrigger class="w-full h-full border-0 shadow-none focus:ring-0 bg-transparent text-foreground font-medium text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Bajo stock">Bajo stock</SelectItem>
            <SelectItem value="Sin stock">Sin stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Tabla de Inventario -->
    <Card class="bg-card rounded-xl border border-[var(--dental-blue-light)] shadow-sm overflow-hidden">
      <div class="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4">
        <h2 class="text-[14px] font-medium text-foreground">
          Inventario de Insumos ({{ filteredInsumos.length }})
        </h2>
      </div>
      <div class="px-4 sm:px-6 pb-5 sm:pb-6">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent border-b border-[var(--dental-blue-light)]">
                <TableHead class="w-[120px] text-foreground font-medium text-sm h-10 px-4">Código</TableHead>
                <TableHead class="min-w-[220px] text-foreground font-medium text-sm h-10 px-4">Nombre</TableHead>
                <TableHead class="min-w-[200px] text-foreground font-medium text-sm h-10 px-4">Categoría</TableHead>
                <TableHead class="w-[110px] text-foreground font-medium text-sm h-10 px-4">Cantidad</TableHead>
                <TableHead class="w-[100px] text-foreground font-medium text-sm h-10 px-4">Unidad</TableHead>
                <TableHead class="w-[90px] text-foreground font-medium text-sm h-10 px-4">Mínimo</TableHead>
                <TableHead class="w-[130px] text-foreground font-medium text-sm h-10 px-4">Estado</TableHead>
                <TableHead class="w-[120px] text-foreground font-medium text-sm text-right h-10 px-4">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="insumo in filteredInsumos" :key="insumo.id" class="border-b border-[var(--dental-blue-light)] last:border-0 hover:bg-[var(--dental-blue-mist)] transition-colors">
                <TableCell class="font-bold text-foreground py-4 px-4 text-sm">{{ insumo.codigo }}</TableCell>
                <TableCell class="text-foreground py-4 px-4 text-sm font-normal">{{ insumo.nombre }}</TableCell>
                <TableCell class="px-4">
                  <Badge variant="outline" class="bg-card text-primary rounded-[6px] px-3 py-1 text-xs border border-primary font-medium shadow-none">
                    {{ insumo.categoria }}
                  </Badge>
                </TableCell>
                <TableCell class="px-4">
                  <div class="flex items-center gap-[6px]">
                    <Package class="w-4 h-4 text-primary mb-[2px]" />
                    <span class="font-normal text-foreground text-sm">{{ insumo.cantidadActual }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-4 text-sm text-muted-foreground font-normal">{{ insumo.unidadMedida }}</TableCell>
                <TableCell class="px-4 text-sm text-muted-foreground font-normal">{{ insumo.nivelMinimo }}</TableCell>
                <TableCell class="px-4">
                  <!-- Badge condicional -->
                  <Badge class="rounded-[6px] px-3 py-1 font-medium text-xs shadow-sm border-0 tracking-wide" :class="getEstadoClass(insumo.estadoStock)">
                    {{ insumo.estadoStock }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right px-4">
                  <div class="flex justify-end gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-auto w-auto p-2 text-primary hover:text-foreground hover:bg-input-background rounded-md transition-colors"
                      @click="handleUpdateStock(insumo)"
                    >
                      <TrendingUp class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-auto w-auto p-2 text-primary hover:text-foreground hover:bg-input-background rounded-md transition-colors"
                      @click="handleEditInsumo(insumo)"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
    </div>
  </div>
</template>
