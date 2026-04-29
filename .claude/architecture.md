# Arquitectura del Frontend — Vue 3

## Nombre del proyecto
**Sistema de Gestión de Consultorio Dental** — frontend Vue 3

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Lenguaje | TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS v4 |
| Router | Vue Router v5 |
| Estado global | Pinia |
| HTTP | Axios |
| Componentes UI | shadcn-style sobre Reka-UI |
| Iconos | lucide-vue-next |

Node requerido: `^20.19.0 || >=22.12.0`

---

## Estructura de carpetas

```
src/
  assets/               ← imágenes, fuentes estáticas
  components/
    ui/                 ← primitivos shadcn (Button, Input, Dialog, Table…)
    shared/             ← componentes reutilizables de dominio (ej. PatientSearch)
  composables/
    useApiError.ts      ← manejo de errores 422/403/404/500
    useConfirm.ts       ← diálogo de confirmación reutilizable
  layouts/
    AuthLayout.vue      ← wrapper minimalista para /login y /forgot-password
    MainLayout.vue      ← sidebar + <RouterView> para rutas protegidas
  lib/
    utils.ts            ← función cn() (clsx + tailwind-merge)
  router/
    index.ts            ← rutas, guards, meta de permisos
  services/
    api.ts              ← instancia Axios con interceptores
    auth.ts             ← login(), logout(), changePassword()
    personas.ts         ← CRUD pacientes
    citas.ts            ← CRUD citas + filtros
    recetas.ts          ← CRUD recetas
    servicios.ts        ← CRUD servicios + clases
    empleados.ts        ← CRUD empleados + resetPassword
    pagos.ts            ← CRUD pagos
    cortes.ts           ← CRUD cortes + activo
  stores/
    auth.ts             ← token, empleado, rol, isAdmin, isDentista…
  views/
    auth/               ← LoginView, ChangePasswordView
    dashboard/          ← DashboardView
    pacientes/          ← PacientesView, PacienteFormView
    citas/              ← CitasView, CitaFormView
    recetas/            ← RecetasView, RecetaFormView
    servicios/          ← ServiciosView, ServicioFormView
    empleados/          ← EmpleadosView, EmpleadoFormView
    pagos/              ← PagosView, PagoFormView
    cortes/             ← CortesView
    ForbiddenView.vue
  App.vue
  main.ts
```

---

## Layouts y grupos de rutas

Hay dos layouts que corresponden a dos grupos de rutas distintos:

| Layout | Rutas |
|---|---|
| `AuthLayout` | `/login`, `/change-password` |
| `MainLayout` | `/dashboard`, `/pacientes`, `/citas`, `/recetas`, `/servicios`, `/empleados`, `/pagos`, `/cortes` |

`MainLayout` incluye el sidebar de navegación lateral y el componente `<RouterView>` donde se montan las vistas.

Todas las importaciones de vistas son **lazy** (`() => import(...)`) para code-splitting automático.

---

## Paleta de color y estilo

| Token | Uso |
|---|---|
| `blue-950` | Headings, sidebar oscuro |
| `blue-500` | Acciones primarias (botones CTA) |
| `slate-*` | Texto secundario, labels |
| `blue-200` | Bordes/outlines en cards |

**Reglas de estilo:**
- Usar siempre `cn()` de `src/lib/utils.ts` para combinar clases condicionales.
- Usar las variantes de `<Button>` (prop `variant` y `size`) en lugar de clases Tailwind directas sobre `<button>`.
- Sin punto y coma, comillas simples, 100 caracteres de ancho (Prettier).

---

## Comunicación con el backend

El frontend se comunica exclusivamente con el backend Laravel vía HTTP + JSON.
El token Sanctum se inyecta automáticamente en cada request por el interceptor de Axios.

```
[Vue 3 SPA — localhost:5173]
        │
        │  HTTP + JSON
        │  Authorization: Bearer {token}
        ▼
[Laravel API — localhost:8000/api]
```

Variable de entorno requerida en `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## Alias de rutas

`@` → `src/` (configurado en `vite.config.ts`).

Usar siempre `@/` en los imports, nunca rutas relativas con `../../`.

---

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo con HMR
npm run build     # type-check + build de producción
npm run type-check # solo vue-tsc
npm run lint      # oxlint + eslint (ambos --fix)
npm run format    # prettier en src/
```
