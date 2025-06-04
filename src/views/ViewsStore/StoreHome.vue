StoreHome.vue
<template>
  <el-container>
    <!-- Sidebar Navigation -->
    <el-aside width="200px">
      <div class="nav-header">
        <el-icon size="20">
          <UserFilled />
        </el-icon>
        API Store
      </div>
      <el-menu style="height: 100vh" :default-active="activeMenu" @select="handleMenuSelect" router>
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
        <el-menu-item @click="logout">
          <el-icon><SwitchButton /></el-icon>
          <span>Logout</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main Content Area -->
    <el-container>
      <el-header style="font-size: 24px; line-height: 55px; text-align: center">
        {{ pageTitle }}
      </el-header>
      <el-main> <router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/StoreCustomer/auth.ts'
import { Monitor, User, Goods, SwitchButton, UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
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

function logout() {
  auth.logout()
  router.push('/home')
}
</script>

<style scoped>
.el-aside {
  border-right: 1px solid #ebeef5;
}
.el-main {
  background-color: white;
}
.nav-header {
  height: 60px;
  text-align: center;
  font-size: 24px;
  line-height: 55px;
}
</style>
