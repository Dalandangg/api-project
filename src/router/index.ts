import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LandingPage from '@/components/CustomerComponents/LandingPage.vue'
import ProductsPage from '@/components/CustomerComponents/ProductsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'Home', component: HomeView, meta: { layout: 'full' } },
    { path: '/landing', name: 'Landing', component: LandingPage },
    { path: '/products', name: 'Products', component: ProductsPage },
    {
      path: '/store',
      component: () => import('@/views/ViewsStore/StoreHome.vue'),
      meta: { required: true, role: 'store' },
      children: [
        {
          path: 'users',
          component: () => import('@/components/ComponentsStore/UserManagement.vue'),
        },
        {
          path: 'products',
          component: () => import('@/components/ComponentsStore/ProductManagement.vue'),
        },
      ],
    },
  ],
})

export default router
