<template>
  <el-card>
    <h2>Login</h2>
    <el-form @submit.prevent="handleLogin">
      <el-form-item label="Email">
        <el-input v-model="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="password" />
      </el-form-item>
      <el-form-item label="User Type">
        <el-select v-model="type" placeholder="Select">
          <el-option label="Customer" value="customer" />
          <el-option label="Store Owner" value="store-owner" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="handleLogin">Login</el-button>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/StoreCustomer/auth.ts'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const type = ref('customer')

function handleLogin() {
  auth.login({ email: email.value, password: password.value, type: type.value })
}
</script>
