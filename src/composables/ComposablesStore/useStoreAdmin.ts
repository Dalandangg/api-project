import { ref } from 'vue'
import axios from 'axios'

interface User {
  id: number
  email: string
  username: string
  name: {
    firstname: string
    lastname: string
  }
}

const allUsers = ref<User[]>([])
const storeUsers = ref<User[]>([])
const loading = ref(false)

export function useStoreAdmin() {
  async function fetchAllUsers() {
    loading.value = true
    try {
      const response = await axios.get('https://fakestoreapi.com/users')
      allUsers.value = response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      loading.value = false
    }
  }

  function addUserToStore(user: User) {
    if (!storeUsers.value.some((u) => u.id === user.id)) {
      storeUsers.value.push(user)
    }
  }

  function removeUserFromStore(userId: number) {
    storeUsers.value = storeUsers.value.filter((u) => u.id !== userId)
  }

  return {
    allUsers,
    storeUsers,
    loading,
    fetchAllUsers,
    addUserToStore,
    removeUserFromStore,
  }
}
