# Integración con la API — Vue 3

## URLs reales del backend

> ⚠️ Las rutas reales del backend difieren del contrato documentado en algunos puntos.
> Este archivo refleja lo que **realmente existe** en el servidor.

| Contrato documentado | Ruta real |
|---|---|
| `/api/auth/login` | `/api/login` |
| `/api/auth/logout` | `/api/logout` |
| `/api/auth/me` | `/api/me` |
| `/api/auth/password` | `/api/change-password` |

El resto de rutas (`/api/personas`, `/api/citas`, `/api/empleados`, etc.) coinciden con el contrato.

---

## Cliente HTTP (`src/services/api.ts`)

```ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Inyecta el token en cada request
api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

// Manejo global de errores
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      useAuthStore().logout()
      router.push('/login')
    }
    if (status === 403) {
      router.push('/forbidden')
    }
    return Promise.reject(error)
  },
)

export default api
```

---

## Store de autenticación (`src/stores/auth.ts`)

Guarda el token y el objeto `empleado` en `localStorage`.

Getters de rol disponibles:
- `auth.rol` → `'administrador'` | `'dentista'` | `'recepcionista'` (lowercase)
- `auth.isAdmin` → boolean
- `auth.isDentista` → boolean
- `auth.isRecepcionista` → boolean

**Estructura de `empleado` retornada por el login:**
```json
{
  "id": 1,
  "usuario": "jdoe",
  "rfc": "DOEJ800101ABC",
  "tipoEmpleado": { "id": 2, "nombre": "Recepcionista" },
  "persona": {
    "id": 5,
    "nombreCompleto": "Juan Doe Martínez",
    "celular": "6121234567",
    "correoElectronico": "jdoe@clinica.com"
  }
}
```

`auth.rol` se deriva de `empleado.tipoEmpleado.nombre.toLowerCase()`.  
Los valores posibles de `tipoEmpleado.nombre` son: `"Administrador"`, `"Dentista"`, `"Recepcionista"`.

---

## Flujo de autenticación

1. `POST /api/login` con `{ usuario, contraseña }`.
2. Guardar `token` y `empleado` en store + localStorage.
3. Si `requiresPasswordChange === true` → redirigir a `/change-password` (obligatorio).
4. Si no → redirigir a `/dashboard`.
5. En logout: `POST /api/logout`, limpiar store y localStorage, redirigir a `/login`.

**Cambio de contraseña:**
```ts
POST /api/change-password
Body: { contraseñaActual, nuevaContraseña, nuevaContraseña_confirmation }
```

---

## Guards de ruta (`src/router/index.ts`)

```ts
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.requiresAdmin && !auth.isAdmin) return '/forbidden'
  if (to.meta.requiresAdminOrDentista && !(auth.isAdmin || auth.isDentista)) return '/forbidden'
})
```

Meta disponibles:
- `requiresAuth: true` — ruta protegida (cualquier rol)
- `requiresAdmin: true` — solo administrador
- `requiresAdminOrDentista: true` — admin o dentista

---

## Servicios por módulo

Cada módulo tiene su archivo en `src/services/`. Todos importan la instancia `api` y exponen funciones nombradas.

### `auth.ts`
```ts
login(usuario, contraseña)             // POST /api/login
logout()                               // POST /api/logout
changePassword(actual, nueva, confirm) // POST /api/change-password
fetchMe()                              // GET  /api/me
```

### `personas.ts`
```ts
getAll(search?: string)   // GET /api/personas?search=
getById(id)               // GET /api/personas/{id}
create(data)              // POST /api/personas
update(id, data)          // PUT  /api/personas/{id}
remove(id)                // DELETE /api/personas/{id} → estado=0
```

### `citas.ts`
```ts
getAll(filters?: { fecha?, paciente_id?, servicio_id? })  // GET /api/citas
getById(id)                                               // GET /api/citas/{id}
create(data)                                              // POST /api/citas
update(id, data)                                          // PUT  /api/citas/{id}
cancel(id)                                                // DELETE /api/citas/{id}
```
Filtros opcionales de `getAll`: `?fecha=YYYY-MM-DD`, `?paciente_id=N`, `?servicio_id=N`.

### `recetas.ts`
```ts
getAll()          // GET /api/recetas
getById(id)       // GET /api/recetas/{id}
create(data)      // POST /api/recetas  — data: { idCita, indicaciones }
update(id, data)  // PUT  /api/recetas/{id}
```

### `servicios.ts`
```ts
getAll()                 // GET /api/servicios
getById(id)              // GET /api/servicios/{id}
create(data)             // POST /api/servicios
update(id, data)         // PUT  /api/servicios/{id}
remove(id)               // DELETE /api/servicios/{id}
getClases()              // GET /api/clases-servicio
createClase(data)        // POST /api/clases-servicio
```

### `empleados.ts`
```ts
getAll()              // GET /api/empleados
getById(id)           // GET /api/empleados/{id}
create(data)          // POST /api/empleados
update(id, data)      // PUT  /api/empleados/{id}
remove(id)            // DELETE /api/empleados/{id}
resetPassword(id, data) // POST /api/empleados/{id}/reset-password
```

### `pagos.ts`
```ts
getAll()        // GET /api/pagos
getById(id)     // GET /api/pagos/{id}
create(data)    // POST /api/pagos — data: { idPersona, total, efectivo, tarjeta }
```
> `idEmpleado` e `idCorte` los asigna el backend automáticamente.

### `cortes.ts`
```ts
getAll()        // GET /api/cortes
getById(id)     // GET /api/cortes/{id}
getActivo()     // GET /api/cortes/activo — 404 si no hay corte abierto
create(data)    // POST /api/cortes — data: { fDeCaja }
close(id, data) // PUT  /api/cortes/{id} — data: { fechaFin: "YYYY-MM-DD HH:mm:ss" }
```

---

## Estructura de respuestas

Todas las respuestas siguen el mismo envoltorio:

```json
// Listado
{ "data": [...], "meta": { "current_page": 1, "total": 50 } }

// Recurso individual
{ "data": { ... }, "message": "Operación exitosa" }

// Error de validación (422)
{ "message": "...", "errors": { "campo": ["mensaje"] } }

// Error general (400, 401, 403, 404, 500)
{ "message": "Descripción del error" }
```

Acceder siempre como `response.data.data` para el payload real.

---

## Composable de errores (`src/composables/useApiError.ts`)

```ts
const { fieldErrors, globalError, handleError, clearErrors } = useApiError()
```

- `fieldErrors` — objeto `{ campo: string[] }` para mostrar bajo cada input.
- `globalError` — string para el mensaje general del formulario.
- `handleError(error)` — parsea el error de Axios y rellena los dos anteriores.
- `clearErrors()` — limpia antes de un submit.

Usar en cada formulario que haga POST/PUT:
```vue
<p v-if="globalError" class="text-red-600">{{ globalError }}</p>
<input v-model="form.nombre" />
<p v-if="fieldErrors.nombre" class="text-red-500 text-sm">{{ fieldErrors.nombre[0] }}</p>
```

---

## Errores conocidos y comportamientos especiales

| Situación | Respuesta backend | Manejo sugerido en UI |
|---|---|---|
| Colisión de horario en cita | 422 `errors.hora` | Mostrar bajo el campo hora |
| Receta duplicada por cita | 422 `errors.idCita` | Toast o alerta general |
| Corte ya abierto al crear otro | 422 `message` | Toast de error |
| Sin corte abierto al registrar pago | 422 `message` | Deshabilitar botón + aviso |
| Credenciales incorrectas en login | 401 `message` | Mostrar bajo el formulario |
| `requiresPasswordChange` en login | 200 con flag | Redirigir a `/change-password` |
