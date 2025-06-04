// useStoreProducts.ts
import { ref } from 'vue'
import axios from 'axios'

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

const products = ref<Product[]>([])
const loading = ref(false)

export function useStoreProducts() {
  async function fetchProducts() {
    loading.value = true
    try {
      const res = await axios.get('https://fakestoreapi.com/products')
      products.value = res.data
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      loading.value = false
    }
  }

  async function addProduct(product: Omit<Product, 'id'>) {
    const res = await axios.post('https://fakestoreapi.com/products', product)
    products.value.push(res.data)
  }

  async function updateProduct(id: number, updatedData: Partial<Product>) {
    const res = await axios.put(`https://fakestoreapi.com/products/${id}`, updatedData)
    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) products.value[index] = res.data
  }

  async function deleteProduct(id: number) {
    await axios.delete(`https://fakestoreapi.com/products/${id}`)
    products.value = products.value.filter((p) => p.id !== id)
  }

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
