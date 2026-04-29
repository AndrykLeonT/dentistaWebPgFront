import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '../layouts/AuthLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'

// ── Augmentación de tipos de meta ─────────────────────────────────────────────

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
    requiresAdminOrDentista?: boolean
    requiresAdminOrRecepcionista?: boolean
  }
}

// ── Definición de rutas ───────────────────────────────────────────────────────

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Auth (sin sidebar) ────────────────────────────────────────────────────
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '', redirect: '/login' },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('../views/auth/ForgotPasswordView.vue'),
        },
        {
          path: 'send-mail',
          name: 'send-mail',
          component: () => import('../views/auth/SendMailLoginView.vue'),
        },
        {
          path: 'change-password',
          name: 'change-password',
          meta: { requiresAuth: true },
          component: () => import('../views/auth/ChangePasswordView.vue'),
        },
      ],
    },

    // ── Error ─────────────────────────────────────────────────────────────────
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue'),
    },

    // ── Módulos con sidebar ───────────────────────────────────────────────────
    // requiresAuth: true se hereda a todas las rutas hijas
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        // Acceso: todos los roles autenticados
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/DashboardView.vue'),
        },
        {
          path: 'pacientes',
          name: 'pacientes',
          component: () => import('../views/pacientes/PacientesView.vue'),
        },
        {
          path: 'pacientes/:id/historial',
          name: 'ver-historial-paciente',
          component: () => import('../views/pacientes/VerHistorialPacienteView.vue'),
        },
        {
          path: 'pacientes/:id/editar',
          name: 'editar-paciente',
          component: () => import('../views/pacientes/EditarPacienteView.vue'),
        },
        {
          path: 'citas',
          name: 'citas',
          component: () => import('../views/agenda/AgendaView.vue'),
        },
        {
          path: 'servicios',
          name: 'servicios',
          component: () => import('../views/servicios/ServiciosView.vue'),
        },
        {
          path: 'empleados',
          name: 'empleados',
          component: () => import('../views/usuarios/UsuariosView.vue'),
        },

        // Acceso: Admin + Dentista (módulos clínicos)
        {
          path: 'recetas',
          name: 'recetas',
          meta: { requiresAdminOrDentista: true },
          component: () => import('../views/recetas/RecetasView.vue'),
        },

        // Acceso: Admin + Recepcionista (módulos financieros / front-desk)
        {
          path: 'pagos',
          name: 'pagos',
          meta: { requiresAdminOrRecepcionista: true },
          component: () => import('../views/pagos/PagosView.vue'),
        },
        {
          path: 'cortes',
          name: 'cortes',
          meta: { requiresAdminOrRecepcionista: true },
          component: () => import('../views/cortes/CortesView.vue'),
        },

        // Acceso: solo Admin
        {
          path: 'inventario',
          name: 'inventario',
          meta: { requiresAdmin: true },
          component: () => import('../views/inventario/InventarioView.vue'),
        },
      ],
    },

    // ── Catch-all ─────────────────────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

// ── Guard global ──────────────────────────────────────────────────────────────

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Redirigir al dashboard si ya está autenticado y navega al login
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' }

  // Verificar autenticación
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login' }

  // Si el cambio de contraseña es obligatorio, forzar esa pantalla
  if (auth.isAuthenticated && auth.requiresPasswordChange && to.name !== 'change-password') {
    return { name: 'change-password' }
  }

  // Verificar permisos por rol
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'forbidden' }

  if (to.meta.requiresAdminOrDentista && !(auth.isAdmin || auth.isDentista))
    return { name: 'forbidden' }

  if (to.meta.requiresAdminOrRecepcionista && !(auth.isAdmin || auth.isRecepcionista))
    return { name: 'forbidden' }
})

export default router
