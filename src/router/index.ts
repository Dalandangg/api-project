import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/store',
      component: () => import('@/views/ViewsStore/StoreHome.vue'),
      meta: { required: true, role: 'store' },
      children: [
        {
          path: 'dashboard',
          component: () => import('@/components/ComponentsStore/StoreDashboard.vue'),
        },
        {
          path: 'users',
          component: () => import('@/components/ComponentsStore/StoreDashboard.vue'),
        },
        {
          path: 'products',
          component: () => import('@/components/ComponentsStore/StoreDashboard.vue'),
        },
      ],
    },
  ],
})

export default router
