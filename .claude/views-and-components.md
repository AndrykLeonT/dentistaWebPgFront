# Vistas y Componentes — Inventario y Flujos

## Estado actual del frontend

> Última revisión: 2026-04-28  
> El frontend tiene el **sistema de rutas, layouts y mocks** en su lugar.
> La capa de datos usa `src/lib/mock-data.ts` — **no hay integración real con la API aún**.
> La integración real es el siguiente paso de desarrollo.

---

## Vistas existentes (con mock data)

### `AuthLayout`

| Vista | Ruta | Estado |
|---|---|---|
| `LoginView.vue` | `/login` | ✅ Existe con mock |
| `ChangePasswordView.vue` | `/change-password` | ⬜ Por crear |

### `MainLayout`

| Vista | Ruta | Estado |
|---|---|---|
| `DashboardView.vue` | `/dashboard` | ✅ Existe con mock |
| `PacientesView.vue` | `/pacientes` | ✅ Existe con mock |
| `CitasView.vue` | `/agenda` (o `/citas`) | ✅ Existe con mock |
| `ServiciosView.vue` | `/servicios` | ✅ Existe con mock |
| `PagosView.vue` | `/pagos` | ✅ Existe con mock |
| `EmpleadosView.vue` | `/usuarios` (o `/empleados`) | ✅ Existe con mock |
| `RecetasView.vue` | `/recetas` | ⬜ Por crear |
| `CortesView.vue` | `/cortes` (o `/inventario`) | ⬜ Pendiente confirmar |
| `ForbiddenView.vue` | `/forbidden` | ⬜ Por crear |

> **Nota:** Los nombres de ruta en el router (`/agenda`, `/usuarios`) pueden diferir de los nombres semánticos del backend. Al integrar, asegurarse de que las rutas del router apuntan a las vistas correctas independientemente del path.

---

## Componentes UI disponibles (`src/components/ui/`)

Estos son los primitivos shadcn disponibles. Usar siempre estos en lugar de elementos HTML crudos cuando existe uno adecuado.

| Componente | Cuándo usarlo |
|---|---|
| `Button` | Todo botón — usar `variant` y `size`, no clases Tailwind directas |
| `Badge` | Etiquetas de estado, roles, tipos |
| `Card` | Contenedores de sección con borde y sombra |
| `Dialog` | Modales de confirmación y formularios en overlay |
| `Input` | Campos de texto |
| `Label` | Labels de formulario |
| `Select` | Dropdowns (ej. seleccionar servicio, tipo de empleado) |
| `Table` | Listados de datos tabulares |
| `Textarea` | Campos de texto largo (ej. indicaciones de receta, motivo de cita) |
| `Checkbox` | Booleanos (ej. pagado, estado) |

Cada componente exporta desde su carpeta con `index.ts`.

---

## Flujos de usuario por módulo

### Autenticación
```
/login
  → Submit credenciales
    → requiresPasswordChange=true  → /change-password (obligatorio)
    → requiresPasswordChange=false → /dashboard
  → Token inválido/expirado → interceptor Axios → /login
```

### Pacientes
```
/pacientes
  → Listado con búsqueda por nombre
  → Botón "Nuevo" (admin/recepcionista) → formulario inline o modal
  → Click en fila → detalle del paciente
    → Botón "Editar" (admin/recepcionista)
    → Botón "Desactivar" (admin/recepcionista) → confirmación → estado=0
```

### Citas / Agenda
```
/citas
  → Listado/calendario con filtros: fecha, paciente, servicio
  → Botón "Nueva cita" (admin/recepcionista)
    → Seleccionar paciente (buscador)
    → Seleccionar servicio (dropdown)
    → Ingresar fecha + hora
    → Error de colisión → mostrar mensaje bajo campo hora
  → Click en cita → detalle
    → Si tiene receta → mostrar indicaciones
    → Si no tiene receta y es admin/dentista → botón "Agregar receta"
```

### Recetas
```
/recetas (solo admin y dentista)
  → Listado de recetas con paciente y fecha de cita
  → Botón "Nueva receta"
    → Buscar cita por ID o paciente
    → Ingresar indicaciones (Textarea)
    → Error si la cita ya tiene receta
  → Click en receta → ver indicaciones + cita asociada
  → Botón "Editar" → modificar indicaciones
```

### Servicios
```
/servicios
  → Listado con columna de categoría (ClaseServicio)
  → Botón "Nuevo servicio" (admin/recepcionista)
    → Seleccionar categoría (dropdown de /api/clases-servicio)
    → Nombre, costo, duración
  → Gestionar categorías (solo admin) → CRUD de /api/clases-servicio
```

### Empleados
```
/empleados (solo admin puede modificar, todos pueden ver)
  → Listado con rol y estado
  → Botón "Nuevo empleado" (solo admin)
    → Datos personales (nombre, apellidos, celular, email)
    → Datos de acceso (usuario, contraseña temporal, RFC, tipo)
  → Botón "Reset contraseña" (solo admin)
    → Modal con nueva contraseña + confirmación
    → Backend activa cambioContraseña=true → empleado cambiará en próximo login
```

### Pagos
```
/pagos (admin y recepcionista)
  → Verificar si hay corte abierto (GET /api/cortes/activo)
    → Si 404: mostrar banner "No hay corte abierto. Ve a Cortes de caja para abrir uno."
    → Si 200: habilitar formulario de pago
  → Listado de pagos del corte actual
  → Botón "Registrar pago"
    → Buscar paciente
    → Ingresar total, efectivo, tarjeta (tarjeta = total - efectivo)
    → idEmpleado e idCorte los asigna el backend automáticamente
```

### Cortes de caja
```
/cortes (admin y recepcionista)
  → Verificar corte activo (GET /api/cortes/activo)
  → Si no hay corte abierto:
    → Botón "Abrir corte" → ingresar fondo de caja → POST /api/cortes
  → Si hay corte abierto:
    → Mostrar totales acumulados (efectivo, tarjeta, totalRecaudado)
    → Lista de pagos del turno
    → Botón "Cerrar corte" → confirmación → PUT /api/cortes/{id}
  → Historial de cortes cerrados (GET /api/cortes)
```

---

## Patrón de formularios

Los formularios de creación/edición siguen este patrón consistente:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useApiError } from '@/composables/useApiError'
import { personasService } from '@/services/personas'

const { fieldErrors, globalError, handleError, clearErrors } = useApiError()
const form = ref({ nombre: '', apellidoP: '', apellidoM: '', celular: '', correoElectronico: '' })
const loading = ref(false)

async function guardar() {
  clearErrors()
  loading.value = true
  try {
    await personasService.create(form.value)
    // redirigir o emitir evento de éxito
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
}
</script>
```

---

## Patrón de listados con paginación

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { personasService } from '@/services/personas'

const items = ref([])
const meta = ref({ current_page: 1, total: 0 })
const search = ref('')

async function cargar(page = 1) {
  const { data } = await personasService.getAll(search.value)
  items.value = data.data
  meta.value = data.meta
}

onMounted(() => cargar())
</script>
```

Todos los listados del backend pagman con 15 ítems por defecto. El `meta` incluye `current_page` y `total`.
