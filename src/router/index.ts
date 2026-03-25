import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── AUTH (sin sidebar) ──────────────────────────
    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: '',
          redirect: '/login',
        },
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
      ],
    },

    // ── MÓDULOS CON SIDEBAR ─────────────────────────
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/DashboardView.vue'),
        },
        {
          path: 'agenda',
          name: 'agenda',
          component: () => import('../views/agenda/AgendaView.vue'),
        },
        {
          path: 'pacientes',
          name: 'pacientes',
          component: () => import('../views/pacientes/PacientesView.vue'),
        },
        {
          path: 'servicios',
          name: 'servicios',
          component: () => import('../views/servicios/ServiciosView.vue'),
        },
        {
          path: 'inventario',
          name: 'inventario',
          component: () => import('../views/inventario/InventarioView.vue'),
        },
        {
          path: 'pagos',
          name: 'pagos',
          component: () => import('../views/pagos/PagosView.vue'),
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: () => import('../views/usuarios/UsuariosView.vue'),
        },
      ],
    },
  ],
})

export default router
