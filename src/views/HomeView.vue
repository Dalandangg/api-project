<template>
  <div style="max-width: 500px; margin: auto; padding: 2rem;">
    <component :is="showLogin ? LoginForm : RegisterForm" />
    <el-divider />
    <el-button @click="toggleForm" type="text">
      {{ showLogin ? 'No account? Register' : 'Already have an account? Login' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/StoreCustomer/auth.ts'
import LoginForm from '@/components/CustomerComponents/LoginForm.vue'
import RegisterForm from '@/components/CustomerComponents/RegisterForm.vue'

const auth = useAuthStore()
const showLogin = ref(true)
const router = useRouter()

// Redirect if already authenticated
watch(
  () => auth.user,
  (user) => {
    if (user) router.push('/landing')
  }
)

// Also check on mount (in case user is already logged in)
onMounted(() => {
  if (auth.user) router.push('/landing')
})

function toggleForm() {
  showLogin.value = !showLogin.value
}
</script>
