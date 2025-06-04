<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/StoreCustomer/auth.ts'
import { useCartStore } from '@/stores/cart'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const products = ref([])
const selectedProduct = ref(null)
const dialogVisible = ref(false)
const cartDrawer = ref(false)

function goToHome() {
  router.push('/landing')
}

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
      logout()
    })
    .catch(() => {
      // User canceled
    })
}

const confirmAddToCart = (product) => {
  ElMessageBox.confirm(
    'Add this item to your cart?',
    'Confirm Add to Cart',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'info',
    }
  )
    .then(() => {
      cart.addToCart(product)
      ElMessage.success('Item added to cart')
      cartDrawer.value = true
    })
    .catch(() => {
      // User canceled
    })
}

const confirmRemoveFromCart = (id) => {
  ElMessageBox.confirm(
    'Remove this item from your cart?',
    'Confirm Remove',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning',
    }
  )
    .then(() => {
      cart.removeFromCart(id)
      ElMessage.success('Item removed from cart')
    })
    .catch(() => {
      // User canceled
    })
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
  <div style="max-width: 1200px; margin: 32px auto 0 auto; padding: 0 16px;">
    <div
      style="position: sticky; top: 0; z-index: 2000; background: #fff; display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; margin-bottom: 0; padding-top: 8px;"
    >
      <el-button type="primary" @click="goToHome">Back to Home</el-button>
      <div>
        <el-button icon="el-icon-shopping-cart-full" @click="cartDrawer = true" style="margin-right: 8px;">
          Cart <span v-if="cart.items.length">({{ cart.items.length }})</span>
        </el-button>
        <el-button type="danger" @click="confirmLogout">Logout</el-button>
      </div>
    </div>
    <h2 style="text-align: center; margin: 24px 0;">
      All Products
    </h2>
    <el-row :gutter="24" justify="center">
      <el-col
        v-for="product in products"
        :key="product.id"
        :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
        style="display: flex; justify-content: center;"
      >
        <el-card
          :body-style="{ padding: '20px', height: '100%', position: 'relative' }"
          style="width: 100%; max-width: 340px; min-width: 260px; height: 420px; margin-bottom: 24px; cursor: pointer;"
          @click="showProductDetails(product.id)"
        >
          <!-- Product Content -->
          <div style="height: calc(100% - 50px); overflow: hidden;">
            <img
              :src="product.image"
              alt="product image"
              style="width: 120px; height: 120px; object-fit: contain; display: block; margin: 0 auto 16px;"
            />
            <h3 style="font-size: 1.1rem; margin-bottom: 8px; text-align: center; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ product.title }}
            </h3>
            <p style="font-size: 0.9rem; color: #888; text-align: center;">{{ product.category }}</p>
            <p style="font-weight: bold; text-align: center;">${{ product.price }}</p>
          </div>

          <!-- Add to Cart Button (Fixed at bottom) -->
          <div style="position: absolute; bottom: 20px; left: 20px; right: 20px;">
            <el-button 
              type="success" 
              size="small" 
              style="width: 100%;" 
              @click.stop="confirmAddToCart(product)"
            >
              Add to Cart
            </el-button>
          </div>
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