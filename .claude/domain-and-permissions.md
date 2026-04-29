# Roles, Permisos y Visibilidad en UI

## Los tres roles

El rol se determina a partir de `empleado.tipoEmpleado.nombre` que devuelve el login.

| Rol | Valor en `tipoEmpleado.nombre` | `auth.rol` (computed) |
|---|---|---|
| Administrador | `"Administrador"` | `"administrador"` |
| Dentista | `"Dentista"` | `"dentista"` |
| Recepcionista | `"Recepcionista"` | `"recepcionista"` |

Usar los getters del store para lógica de UI:
```ts
const auth = useAuthStore()
auth.isAdmin          // true si administrador
auth.isDentista       // true si dentista
auth.isRecepcionista  // true si recepcionista
```

---

## Permisos por pantalla / módulo

### Pacientes (`/pacientes`)

| Acción en UI | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Ver listado y detalle | ✅ | ✅ | ✅ |
| Botón "Nuevo paciente" | ✅ | ❌ | ✅ |
| Botón "Editar" | ✅ | ❌ | ✅ |
| Botón "Desactivar" | ✅ | ❌ | ✅ |

### Citas (`/citas`)

| Acción en UI | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Ver listado y detalle | ✅ | ✅ | ✅ |
| Botón "Nueva cita" | ✅ | ❌ | ✅ |
| Botón "Editar" | ✅ | ❌ | ✅ |
| Botón "Cancelar" | ✅ | ❌ | ✅ |

### Recetas (`/recetas`)

| Acción en UI | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Acceder a la sección | ✅ | ✅ | ❌ |
| Botón "Nueva receta" | ✅ | ✅ | ❌ |
| Botón "Editar" | ✅ | ✅ | ❌ |
| Botón "Desactivar" | ✅ | ❌ | ❌ |

### Servicios (`/servicios`)

| Acción en UI | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Ver listado | ✅ | ✅ | ✅ |
| Botón "Nuevo servicio" | ✅ | ❌ | ✅ |
| Botón "Editar" | ✅ | ❌ | ✅ |
| Botón "Desactivar" | ✅ | ❌ | ✅ |
| Gestionar categorías | ✅ | ❌ | ❌ |

### Empleados (`/empleados`)

| Acción en UI | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Ver listado | ✅ | ✅ | ✅ |
| Botón "Nuevo empleado" | ✅ | ❌ | ❌ |
| Botón "Editar" | ✅ | ❌ | ❌ |
| Botón "Reset contraseña" | ✅ | ❌ | ❌ |
| Botón "Desactivar" | ✅ | ❌ | ❌ |

### Pagos (`/pagos`)

| Acción en UI | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Acceder a la sección | ✅ | ❌ | ✅ |
| Botón "Registrar pago" | ✅ | ❌ | ✅ |
| Botón "Editar pago" | ✅ | ❌ | ❌ |

### Cortes de caja (`/cortes`)

| Acción en UI | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Acceder a la sección | ✅ | ❌ | ✅ |
| Botón "Abrir corte" | ✅ | ❌ | ✅ |
| Botón "Cerrar corte" | ✅ | ❌ | ✅ |

---

## Sidebar — ítems visibles por rol

| Ítem | Admin | Dentista | Recepcionista |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Pacientes | ✅ | ✅ | ✅ |
| Agenda / Citas | ✅ | ✅ | ✅ |
| Recetas | ✅ | ✅ | ❌ |
| Servicios | ✅ | ✅ | ✅ |
| Empleados | ✅ | ✅ | ✅ |
| Pagos | ✅ | ❌ | ✅ |
| Cortes de caja | ✅ | ❌ | ✅ |

---

## Cómo implementar visibilidad condicional en Vue

### Ocultar botones según rol

```vue
<Button v-if="auth.isAdmin || auth.isRecepcionista" @click="nuevoPaciente">
  Nuevo paciente
</Button>
```

### Ocultar secciones del sidebar

```vue
<NavItem v-if="auth.isAdmin || auth.isRecepcionista" to="/pagos" label="Pagos" />
```

### Deshabilitar campo (no solo ocultar)

```vue
<Button :disabled="!auth.isAdmin" @click="editarServicio">Editar</Button>
```

---

## Guards de ruta — configuración en `router/index.ts`

```ts
const routes = [
  // Auth — sin guard
  { path: '/login', component: () => import('@/views/auth/LoginView.vue') },
  { path: '/change-password', component: () => import('@/views/auth/ChangePasswordView.vue') },

  // Todos los roles autenticados
  { path: '/dashboard',  meta: { requiresAuth: true }, ... },
  { path: '/pacientes',  meta: { requiresAuth: true }, ... },
  { path: '/citas',      meta: { requiresAuth: true }, ... },
  { path: '/servicios',  meta: { requiresAuth: true }, ... },
  { path: '/empleados',  meta: { requiresAuth: true }, ... },

  // Solo admin + dentista
  { path: '/recetas', meta: { requiresAuth: true, requiresAdminOrDentista: true }, ... },

  // Solo admin + recepcionista
  { path: '/pagos',   meta: { requiresAuth: true, requiresAdminOrRecepcionista: true }, ... },
  { path: '/cortes',  meta: { requiresAuth: true, requiresAdminOrRecepcionista: true }, ... },

  // Página de acceso denegado
  { path: '/forbidden', component: () => import('@/views/ForbiddenView.vue') },
]

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.requiresAdmin && !auth.isAdmin) return '/forbidden'
  if (to.meta.requiresAdminOrDentista && !(auth.isAdmin || auth.isDentista)) return '/forbidden'
  if (to.meta.requiresAdminOrRecepcionista && !(auth.isAdmin || auth.isRecepcionista)) return '/forbidden'
})
```

---

## Lógica de negocio importante para la UI

### Corte de caja — bloquear registro de pagos
Antes de mostrar el formulario de pago, consultar `GET /api/cortes/activo`:
- Si responde `200` → hay corte abierto, el formulario está habilitado.
- Si responde `404` → no hay corte, mostrar aviso y deshabilitar el botón "Registrar pago".

### `requiresPasswordChange` tras login
Si el login devuelve `requiresPasswordChange: true`, redirigir **obligatoriamente** a `/change-password`.
El empleado no puede navegar a ninguna otra ruta hasta completar el cambio.

### Eliminación en el sistema
No existe "eliminar" en el sentido tradicional. Todos los recursos usan eliminación lógica (`estado=0`).
Los botones deben decir **"Desactivar"** o **"Cancelar"** según el contexto, nunca "Eliminar".

Excepción: el admin puede hacer delete físico vía API, pero **esta acción no está planificada en la UI actual**. Si se implementa, mostrar una confirmación explícita con texto "Esta acción es irreversible".
