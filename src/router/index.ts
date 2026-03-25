import { createRouter, createWebHistory } from 'vue-router'
import InventarioPage from '../views/InventarioPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inventario',
      component: InventarioPage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
