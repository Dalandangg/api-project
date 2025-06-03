<template>
  <el-container class="h-screen">
    <!-- Sidebar Navigation -->
    <el-aside width="220px" class="bg-gray-100">
      <div class="text-center my-6 font-bold text-lg">Store Admin</div>
      <el-menu
        :default-active="activeMenu"
        class="h-full border-none"
        @select="handleMenuSelect"
        router
      >
        <el-menu-item index="/store/dashboard">
          <el-icon><Monitor /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/store/users">
          <el-icon><User /></el-icon>
          <span>Manage Users</span>
        </el-menu-item>
        <el-menu-item index="/store/products">
          <el-icon><Goods /></el-icon>
          <span>Manage Products</span>
        </el-menu-item>
        <el-menu-item>
          <el-icon><SwitchButton /></el-icon>
          <span>Logout</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main Content Area -->
    <el-container>
      <el-header class="bg-white border-b px-4 py-2 text-xl font-semibold">
        {{ pageTitle }}
      </el-header>
      <el-main class="p-6 bg-gray-50 overflow-y-auto">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { Monitor, User, Goods, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const activeMenu = ref(route.path)

watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  },
)

function handleMenuSelect(path: string) {
  router.push(path)
}

const pageTitle = computed(() => {
  if (route.path.includes('dashboard')) return 'Dashboard'
  if (route.path.includes('users')) return 'User Management'
  if (route.path.includes('products')) return 'Product Management'
  return 'Store Admin'
})
</script>

<style scoped>
.el-aside {
  border-right: 1px solid #ebeef5;
}
.el-main {
  background-color: white;
}
</style>
