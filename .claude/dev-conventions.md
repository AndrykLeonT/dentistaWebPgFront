# Convenciones de Desarrollo — Vue 3 Frontend

## ⚠️ Leer antes de crear cualquier componente o composable

---

## 1. Composition API con `<script setup>`

**Siempre** usar `<script setup lang="ts">`. No usar Options API ni `defineComponent`.

```vue
<!-- ✅ CORRECTO -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
</script>

<!-- ❌ INCORRECTO -->
<script>
export default {
  data() { return { count: 0 } }
}
</script>
```

---

## 2. Naming conventions

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes Vue | PascalCase | `PatientCard.vue`, `CitaFormView.vue` |
| Vistas | PascalCase + `View` | `PacientesView.vue`, `LoginView.vue` |
| Composables | camelCase + `use` prefix | `useApiError.ts`, `useConfirm.ts` |
| Servicios | camelCase | `personas.ts`, `citas.ts` |
| Stores Pinia | camelCase + `use` prefix | `useAuthStore` |
| Props | camelCase en TS, kebab-case en template | `nombreCompleto` / `:nombre-completo` |
| Eventos `emit` | camelCase | `emit('updatePaciente', data)` |
| Archivos de rutas | `index.ts` dentro de `router/` | |
| Variables de env | `VITE_` prefix | `VITE_API_URL` |

---

## 3. TypeScript — tipado mínimo requerido

Definir interfaces para los objetos de dominio que vienen de la API.

```ts
// src/types/index.ts (o por módulo)

export interface Persona {
  id: number
  nombre: string
  apellidoP: string
  apellidoM: string
  nombreCompleto: string
  celular: string
  correoElectronico: string
}

export interface Empleado {
  id: number
  usuario: string
  rfc: string
  tipoEmpleado: { id: number; nombre: string }
  persona: Persona
}

export interface Cita {
  id: number
  fechaProgramada: string   // 'YYYY-MM-DD'
  hora: string              // 'HH:MM:SS'
  motivo: string
  persona: Persona
  servicio: Servicio
  receta?: Receta
}

export interface Servicio {
  id: number
  nombre: string
  costo: string   // viene como string decimal desde la API
  duracion: string
  claseServicio: ClaseServicio
}

export interface Receta {
  id: number
  indicaciones: string
  cita: Pick<Cita, 'id' | 'fechaProgramada' | 'hora'> & { paciente: Pick<Persona, 'id' | 'nombreCompleto'> }
}

export interface Pago {
  id: number
  total: string
  efectivo: string
  tarjeta: string
  pendiente: number
  pagado: boolean
  paciente: Pick<Persona, 'id' | 'nombreCompleto'>
}

export interface Corte {
  id: number
  fechaInicio: string
  fechaFin: string | null
  fDeCaja: string
  tEfectivo: string
  tTarjeta: string
  totalRecaudado: number
  correcto: boolean | null
}

export interface ApiListResponse<T> {
  data: T[]
  meta: { current_page: number; total: number }
}

export interface ApiSingleResponse<T> {
  data: T
  message?: string
}
```

---

## 4. Componentes UI — reglas de uso

### Usar siempre los primitivos de `src/components/ui/`

```vue
<!-- ✅ CORRECTO -->
<Button variant="default" size="sm" @click="guardar">Guardar</Button>
<Input v-model="form.nombre" placeholder="Nombre del paciente" />

<!-- ❌ INCORRECTO — nunca HTML crudo cuando existe el componente -->
<button class="bg-blue-500 text-white px-4 py-2" @click="guardar">Guardar</button>
<input v-model="form.nombre" class="border rounded px-3 py-2" />
```

### Variantes de `Button`

Las variantes están definidas en `src/components/ui/button/index.ts` con CVA:
- `variant`: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
- `size`: `default` | `sm` | `lg` | `icon`

---

## 5. Clases CSS — uso de `cn()`

Siempre combinar clases con `cn()` de `src/lib/utils.ts`.

```ts
import { cn } from '@/lib/utils'

// En el template o en el script
const cardClass = cn(
  'rounded-lg border p-4',
  isActive && 'border-blue-500 bg-blue-50',
  isDisabled && 'opacity-50 cursor-not-allowed',
)
```

```vue
<div :class="cn('base-class', { 'text-red-500': hasError })">...</div>
```

---

## 6. Servicios — patrón de llamada

Los servicios retornan el `AxiosResponse` completo. Desestructurar `data` en el punto de uso:

```ts
// En el composable o en la vista
const { data } = await personasService.getAll(search.value)
// data.data → array de Persona
// data.meta → paginación
```

Nunca hacer `axios.get(...)` directamente desde una vista. Siempre pasar por `src/services/`.

---

## 7. Stores Pinia — patrón Setup Store

Usar **Setup Stores** (no Options Stores):

```ts
// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const empleado = ref<Empleado | null>(
    JSON.parse(localStorage.getItem('empleado') ?? 'null'),
  )

  const isAuthenticated = computed(() => !!token.value)
  const rol = computed(() => empleado.value?.tipoEmpleado?.nombre?.toLowerCase() ?? '')
  const isAdmin = computed(() => rol.value === 'administrador')
  const isDentista = computed(() => rol.value === 'dentista')
  const isRecepcionista = computed(() => rol.value === 'recepcionista')

  // ...actions

  return { token, empleado, isAuthenticated, rol, isAdmin, isDentista, isRecepcionista }
})
```

---

## 8. Formato de código (Prettier)

- Sin punto y coma (`;`)
- Comillas simples (`'`)
- 100 caracteres de ancho máximo
- Correr `npm run format` antes de hacer commit

---

## 9. Importaciones — orden y alias

Orden de imports en los SFC:
1. Vue y Vue Router
2. Pinia stores
3. Composables propios
4. Servicios
5. Componentes UI
6. Tipos

```ts
// 1. Vue
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 2. Stores
import { useAuthStore } from '@/stores/auth'
// 3. Composables
import { useApiError } from '@/composables/useApiError'
// 4. Servicios
import { personasService } from '@/services/personas'
// 5. Componentes
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// 6. Tipos
import type { Persona } from '@/types'
```

Siempre usar el alias `@/` — nunca rutas relativas con `../`.

---

## 10. Datos de la API — campos a recordar

Cosas que difieren de lo esperado y generan bugs frecuentes:

| Campo | Tipo real en respuesta | Truco |
|---|---|---|
| `costo` en Servicio | `string` (ej. `"450.00"`) | Parsear con `parseFloat()` para cálculos |
| `fechaProgramada` | `string` `"YYYY-MM-DD"` | No es Date — usar librería si se necesita formatear |
| `hora` | `string` `"HH:MM:SS"` | Tomar solo los primeros 5 chars para mostrar `"HH:MM"` |
| `pagado` | `boolean` | Viene como `true`/`false` (no `1`/`0`) |
| PKs internas | `idPersona`, `idCita`, etc. | En el JSON de la API ya vienen renombradas a `id` |
| `idEmpleado` en pagos | No enviar en el body | El backend lo extrae del token automáticamente |
| `idCorte` en pagos | No enviar en el body | El backend lo toma del corte abierto automáticamente |
