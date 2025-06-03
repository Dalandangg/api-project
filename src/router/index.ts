import { createRouter, createWebHistory } from 'vue-router'
import vueTest from '@/views/vueTest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: vueTest,
    },
  ],
})

export default router
