<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/StoreCustomer/auth.ts'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'  // Add this import

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const products = ref([])
const cartDrawer = ref(false)

function logout() {
  auth.logout()
  router.push('/home')
}

function goToProducts() {
  router.push('/products')
}

onMounted(async () => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products')
    products.value = response.data
  } catch (error) {
    alert('Failed to load products.')
  }
})

const confirmLogout = () => {
  ElMessageBox.confirm(
    'Are you sure you want to logout?',
    'Confirm Logout',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning',
    }
  )
    .then(() => {
      auth.logout()
      router.push('/home')
      ElMessage.success('Successfully logged out')
    })
    .catch(() => {
      // User canceled
    })
}
</script>

<template>
  <div style="max-width: 1200px; margin: 32px auto 0 auto; padding: 0 16px;">
    <div
      style="position: sticky; top: 0; z-index: 2000; background: #fff; display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; margin-bottom: 0; padding-top: 8px;"
    >
      <el-button type="primary" @click="goToProducts">View Products</el-button>
      <div>
        <el-button icon="el-icon-shopping-cart-full" @click="cartDrawer = true" style="margin-right: 8px;">
          Cart <span v-if="cart.items.length">({{ cart.items.length }})</span>
        </el-button>
        <el-button type="danger" @click="confirmLogout">Logout</el-button>
      </div>
    </div>
    <h2 style="text-align: center; margin-bottom: 24px;">
      Welcome<span v-if="auth.user && auth.user.email">, {{ auth.user.email }}</span>!
    </h2>
    <el-carousel height="80vh" indicator-position="outside" arrow="always">
      <el-carousel-item v-for="product in products" :key="product.id">
        <div style="display: flex; justify-content: center; align-items: center; height: 80vh;">
          <el-card style="width: 60vw; min-width: 350px; max-width: 900px; height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 100%; text-align: center;">
              <img
                :src="product.image"
                alt="product image"
                style="width: 300px; height: 300px; object-fit: contain; margin-bottom: 32px; display: block; margin-left: auto; margin-right: auto;"
              />
              <h2 style="font-size: 2rem;">{{ product.title }}</h2>
              <p style="font-weight: bold; font-size: 1.5rem;">${{ product.price }}</p>
              <p style="margin-top: 16px; color: #888;">{{ product.category }}</p>
              <p style="margin-top: 16px; max-width: 600px; margin-left: auto; margin-right: auto;">{{ product.description }}</p>
            </div>
          </el-card>
        </div>
      </el-carousel-item>
    </el-carousel>
    <!-- Cart Drawer -->
    <el-drawer v-model="cartDrawer" title="Cart" direction="rtl" size="30%">
      <div v-if="cart.items.length">
        <div v-for="item in cart.items" :key="item.id" style="display: flex; align-items: center; margin-bottom: 16px;">
          <img :src="item.image" style="width: 60px; height: 60px; object-fit: contain; margin-right: 12px;" />
          <div style="flex: 1;">
            <div>{{ item.title }}</div>
            <div style="font-weight: bold;">${{ item.price }}</div>
            <div>
              <el-button size="small" @click="cart.decrement(item.id)">-</el-button>
              <span style="margin: 0 8px;">{{ item.quantity }}</span>
              <el-button size="small" @click="cart.increment(item.id)">+</el-button>
              <el-button size="small" type="danger" @click="confirmRemoveFromCart(item.id)">Delete</el-button>
            </div>
          </div>
        </div>
        <div style="text-align: right; font-weight: bold; margin-top: 16px;">
          Total: ${{ cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) }}
        </div>
      </div>
      <div v-else>
        <p>Your cart is empty.</p>
      </div>
    </el-drawer>
  </div>
</template>