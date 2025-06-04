UserManagement.vue
<template>
  <div>
    <div class="header">
      <h2>All Users</h2>
    </div>

    <el-table :data="allUsers" stripe style="width: 100%">
      <el-table-column label="Name">
        <template #default="{ row }"> {{ row.name.firstname }} {{ row.name.lastname }} </template>
      </el-table-column>
      <el-table-column label="Username" prop="username" />
      <el-table-column label="Email" prop="email" />
      <el-table-column label="Password" prop="password" />
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            @click="addUserToStore(row)"
            :disabled="storeUsers.some((u) => u.id === row.id)"
          >
            Add to Store
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="header">
      <h2>Store Users</h2>
    </div>

    <el-table :data="storeUsers" stripe style="width: 100%">
      <el-table-column label="Name">
        <template #default="{ row }"> {{ row.name.firstname }} {{ row.name.lastname }} </template>
      </el-table-column>
      <el-table-column label="Username" prop="username" />
      <el-table-column label="Email" prop="email" />
      <el-table-column prop="password" label="Password" />

      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="removeUserFromStore(row.id)">
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useStoreAdmin } from '@/composables/ComposablesStore/useStoreAdmin'

const { allUsers, storeUsers, fetchAllUsers, addUserToStore, removeUserFromStore } = useStoreAdmin()

onMounted(() => {
  fetchAllUsers()
})
</script>

<style lang="css" scoped>
.header {
  color: black;
}
</style>
