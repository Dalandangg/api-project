import { defineStore } from 'pinia'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import { ElLoading, ElMessage } from 'element-plus'

function loadUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

function saveUsers(users: any[]) {
  localStorage.setItem('users', JSON.stringify(users))
}

function saveCurrentUser(user: any, userType: string) {
  localStorage.setItem('currentUser', JSON.stringify({ user, userType }))
}

function loadCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null')
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const current = loadCurrentUser()
    return {
      user: current ? current.user : null,
      userType: current ? current.userType : null,
    }
  },
  actions: {
    login({ email, password, type }) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Logging in...',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      try {
        if (!email || !password || !type) {
          ElMessage.error('All fields are required.')
          return
        }
        if (!validateEmail(email)) {
          ElMessage.error('Please enter a valid email address.')
          return
        }
        const users = loadUsers()
        const found = users.find(
          (u: any) => u.email === email && u.password === password && u.type === type,
        )
        if (found) {
          this.user = { email: found.email, type: found.type }
          this.userType = type
          saveCurrentUser(this.user, this.userType)
          useCartStore().loadUserCart()

          // Show success message
          ElMessage.success('Successfully logged in!')
        } else {
          ElMessage.error('Invalid credentials or user not registered.')
        }
      } catch (error) {
        ElMessage.error('Login failed. Please try again.')
      } finally {
        loading.close()
      }
    },
    async register({ email, password, type }) {
      if (!email || !password || !type) {
        alert('All fields are required.')
        return
      }
      if (!validateEmail(email)) {
        alert('Please enter a valid email address.')
        return
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters.')
        return
      }
      let users = loadUsers()
      if (users.find((u: any) => u.email === email && u.type === type)) {
        alert('User already registered.')
        return
      }
      // Simulate API call with axios (but don't rely on its persistence)
      const user = { username: email.split('@')[0], email, password }
      try {
        const response = await axios.post('https://fakestoreapi.com/users', user)
        // Simulate saving to localStorage after "API" response
        if (response.data && response.data.id) {
          users.push({ email, password, type })
          saveUsers(users)
          alert(`User successfully registered as ${type}. Please log in.`)
        } else {
          alert('Registration failed. Please try again.')
        }
      } catch (error) {
        alert('Registration failed. Please try again.')
      }
    },
    logout() {
      this.user = null
      this.userType = null
      localStorage.removeItem('currentUser')
      useCartStore().clearCart() // <-- Clear cart on logout
    },
  },
})

// You can add this to your auth.ts or call it from a dev/admin button in your app

export async function simulateFetchAndSaveFakeApiUsers() {
  try {
    const response = await axios.get('https://fakestoreapi.com/users')
    const fakeUsers = response.data.map((u: any) => ({
      email: u.email,
      password: u.password,
      type: 'customer', // or map to your types if needed
    }))
    // Merge with existing users, avoiding duplicates
    const existing = JSON.parse(localStorage.getItem('users') || '[]')
    const merged = [
      ...existing,
      ...fakeUsers.filter(
        fu => !existing.some(eu => eu.email === fu.email && eu.type === fu.type)
      ),
    ]
    localStorage.setItem('users', JSON.stringify(merged))
    alert('Fake API users imported to local users!')
  } catch (error) {
    alert('Failed to fetch users from fake API.')
  }
}

// Simulate fetching users and carts from the fake API and saving carts per user in localStorage
export async function simulateFetchAndSaveFakeApiCarts() {
  try {
    // Fetch users and carts from the fake API
    const [usersRes, cartsRes, productsRes] = await Promise.all([
      axios.get('https://fakestoreapi.com/users'),
      axios.get('https://fakestoreapi.com/carts'),
      axios.get('https://fakestoreapi.com/products'),
    ])
    const users = usersRes.data
    const carts = cartsRes.data
    const products = productsRes.data

    // Map userId to email for cart key
    const userIdToEmail: Record<number, string> = {}
    users.forEach((u: any) => {
      userIdToEmail[u.id] = u.email
    })

    // For each cart, save its products as the user's cart in localStorage
    carts.forEach((cart: any) => {
      const email = userIdToEmail[cart.userId]
      if (!email) return
      // Convert cart products to your app's cart format (with product details)
      const cartItems = cart.products.map((p: any) => {
        const prod = products.find((pr: any) => pr.id === p.productId)
        return prod
          ? { ...prod, quantity: p.quantity }
          : { id: p.productId, quantity: p.quantity }
      })
      // Only set if the cart is empty for this user
      const cartKey = `cart_${email}`
      if (!localStorage.getItem(cartKey) || localStorage.getItem(cartKey) === '[]') {
        localStorage.setItem(cartKey, JSON.stringify(cartItems))
      }
    })
    // Optionally, alert or log
    // alert('Fake API carts imported to localStorage!')
  } catch (error) {
    // alert('Failed to fetch carts from fake API.')
    console.error('Failed to fetch carts from fake API.', error)
  }
}

// Auto-import fake API users if local users are empty
;(async () => {
  const existing = JSON.parse(localStorage.getItem('users') || '[]')
  if (!existing.length) {
    await simulateFetchAndSaveFakeApiUsers()
  }
  // Also import carts if not already present
  await simulateFetchAndSaveFakeApiCarts()
})()
