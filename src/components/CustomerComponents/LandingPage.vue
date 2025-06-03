<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/StoreCustomer/auth.ts'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const products = ref([])
const selectedProduct = ref(null)
const dialogVisible = ref(false)

function logout() {
  auth.logout()
  router.push('/home')
}

async function showProductDetails(id: number) {
  try {
    const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
    selectedProduct.value = response.data
    dialogVisible.value = true
  } catch (error) {
    alert('Failed to load product details.')
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products')
    products.value = response.data
  } catch (error) {
    alert('Failed to load products.')
  }
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2>All Products</h2>
      <el-button type="danger" @click="logout">Logout</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="product in products" :key="product.id">
        <el-card
          :body-style="{ padding: '20px' }"
          style="margin-bottom: 20px; cursor: pointer;"
          @click="showProductDetails(product.id)"
        >
          <img :src="product.image" alt="product image" style="width: 100px; height: 100px; object-fit: contain; display: block; margin: 0 auto 10px;" />
          <h3 style="font-size: 1.1rem; margin-bottom: 8px;">{{ product.title }}</h3>
          <p style="font-size: 0.9rem; color: #888;">{{ product.category }}</p>
          <p style="font-weight: bold;">${{ product.price }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" title="Product Details" width="400px" :before-close="() => dialogVisible = false">
      <div v-if="selectedProduct">
        <img :src="selectedProduct.image" alt="product image" style="width: 120px; height: 120px; object-fit: contain; display: block; margin: 0 auto 10px;" />
        <h3>{{ selectedProduct.title }}</h3>
        <p><strong>Category:</strong> {{ selectedProduct.category }}</p>
        <p><strong>Price:</strong> ${{ selectedProduct.price }}</p>
        <p><strong>Description:</strong> {{ selectedProduct.description }}</p>
      </div>
    </el-dialog>
  </div>
</template>