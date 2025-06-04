import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/StoreCustomer/auth.ts'

function getCartKey() {
  const auth = useAuthStore()
  return auth.user ? `cart_${auth.user.email}` : 'cart_guest'
}

function loadCart() {
  return JSON.parse(localStorage.getItem(getCartKey()) || '[]')
}

function saveCart(items: any[]) {
  localStorage.setItem(getCartKey(), JSON.stringify(items))
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadCart(),
  }),
  actions: {
    addToCart(product) {
      const found = this.items.find(item => item.id === product.id)
      if (found) {
        found.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      saveCart(this.items)
    },
    removeFromCart(id) {
      this.items = this.items.filter(item => item.id !== id)
      saveCart(this.items)
    },
    increment(id) {
      const found = this.items.find(item => item.id === id)
      if (found) found.quantity += 1
      saveCart(this.items)
    },
    decrement(id) {
      const found = this.items.find(item => item.id === id)
      if (found && found.quantity > 1) found.quantity -= 1
      saveCart(this.items)
    },
    clearCart() {
      this.items = []
      saveCart(this.items)
    },
    // Call this on login/logout to load the correct cart
    loadUserCart() {
      this.items = loadCart()
    }
  }
})