import { defineStore } from 'pinia'
import axios from 'axios'

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
      if (!email || !password || !type) {
        alert('All fields are required.')
        return
      }
      if (!validateEmail(email)) {
        alert('Please enter a valid email address.')
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
      } else {
        alert('Invalid credentials or user not registered.')
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
    },
  },
})
