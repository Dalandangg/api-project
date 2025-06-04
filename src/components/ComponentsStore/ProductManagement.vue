<template>
  <div>
    <el-button type="primary" @click="showForm = true">Add Product</el-button>

    <el-table :data="products" stripe>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="price" label="Price" />
      <el-table-column label="Image" width="100">
        <template #default="{ row }">
          <img :src="row.image" alt="Product Image" class="img" />
        </template>
      </el-table-column>
      <el-table-column prop="category" label="Category" />
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button size="small" @click="edit(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deleteProduct(row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add/Edit Product Dialog -->
    <el-dialog :title="formMode" v-model="showForm">
      <el-form :model="form">
        <el-form-item label="Title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="Price"><el-input v-model="form.price" type="number" /></el-form-item>
        <el-form-item label="Category"><el-input v-model="form.category" /></el-form-item>
        <el-form-item label="Image URL"><el-input v-model="form.image" /></el-form-item>
        <el-form-item label="Description"
          ><el-input type="textarea" v-model="form.description"
        /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">Cancel</el-button>
        <el-button type="primary" @click="save">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStoreProducts, type Product } from '@/composables/ComposablesStore/useStoreProducts'

const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useStoreProducts()

const showForm = ref(false)
const formMode = ref('Add Product')
const editingId = ref<number | null>(null)

const form = ref<Omit<Product, 'id'>>({
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
})

function resetForm() {
  form.value = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
  }
  editingId.value = null
  formMode.value = 'Add Product'
}

function edit(product: Product) {
  formMode.value = 'Edit Product'
  form.value = { ...product }
  editingId.value = product.id
  showForm.value = true
}

async function save() {
  if (editingId.value) {
    await updateProduct(editingId.value, form.value)
  } else {
    await addProduct(form.value)
  }
  showForm.value = false
  resetForm()
}

onMounted(fetchProducts)
</script>

<style lang="css" scoped>
img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 10px;
}
</style>
