<template>
  <div class="product-management">
    <!-- Header -->
    <div class="header">
      <h2 class="title">Gerenciamento de Produtos</h2>
    </div>

    <!-- Search and Filters -->
    <div class="filters">
      <div class="search-container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar produtos..."
          class="search-input"
        />
        <button @click="openAddProductModal" class="add-button w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      
      <select v-model="categoryFilter" class="category-filter">
        <option value="">Todas as categorias</option>
        <option value="lanche">Lanches</option>
        <option value="bebida">Bebidas</option>
        <option value="doce">Doces</option>
      </select>
    </div>

    <!-- Products Grid -->
    <div class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        :class="`border-l-4 border-${getCategoryColor(product.category)}-500`"
      >
        <!-- Product Image -->
        <div class="product-image">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="product-image-real"
          />
          <div v-else class="image-placeholder">
            <svg class="w-8 h-8" :class="`text-${getCategoryColor(product.category)}-400`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h4 class="product-name">{{ product.name }}</h4>
          <p class="product-price">{{ formatCurrency(product.price) }}</p>
        </div>

        <!-- Actions -->
        <div class="product-actions">
          <button
            @click="editProduct(product)"
            class="edit-button"
            title="Editar produto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">Nenhum produto encontrado</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Tente ajustar os filtros ou adicionar novos produtos.</p>
    </div>

    <!-- Edit Product Modal -->
    <EditProductModal
      v-if="editingProduct"
      :product="editingProduct"
      @close="editingProduct = null"
      @save="handleProductSave"
    />

    <!-- Add Product Modal -->
    <AddProductModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @save="handleProductAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Product } from '@/types'
import EditProductModal from '@/components/modals/EditProductModal.vue'
import AddProductModal from '@/components/modals/AddProductModal.vue'

const store = useAppStore()

// Reactive data
const searchQuery = ref('')
const categoryFilter = ref('')
const editingProduct = ref<Product | null>(null)
const showAddModal = ref(false)

// Computed properties
const filteredProducts = computed(() => {
  let products = store.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || product.category === categoryFilter.value
    
    return matchesSearch && matchesCategory
  })
  
  return products
})

// Methods
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getCategoryLabel = (category?: string): string => {
  const labels = {
    'lanche': 'Lanche',
    'bebida': 'Bebida',
    'doce': 'Doce'
  }
  return labels[category as keyof typeof labels] || 'Outros'
}

const getCategoryColor = (category?: string): string => {
  const colors = {
    'lanche': 'orange',
    'bebida': 'blue',
    'doce': 'pink'
  }
  return colors[category as keyof typeof colors] || 'gray'
}



const editProduct = (product: Product) => {
  editingProduct.value = product
}

const handleProductSave = async (updatedProduct: Product) => {
  // TODO: Implementar atualização no Firebase
  console.log('Saving product:', updatedProduct)
  editingProduct.value = null
}

const openAddProductModal = () => {
  showAddModal.value = true
}

const handleProductAdd = () => {
  showAddModal.value = false
  // O produto já foi adicionado ao store pelo modal
}
</script>

<style scoped>
.product-management {
  @apply p-4 space-y-6;
}

.header {
  @apply flex items-center justify-between;
}

.title {
  @apply text-2xl font-bold text-gray-900 dark:text-gray-100;
}

.add-button {
  @apply flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}

.filters {
  @apply flex flex-col sm:flex-row gap-4;
}

.search-container {
  @apply relative flex-1 flex items-center gap-3;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10;
}

.search-input {
  @apply flex-1 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.category-filter {
  @apply px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.product-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col;
}

.product-info {
  padding: 8px 4px;
  text-align: center;
  flex-grow: 1;
}

.product-name {
  font-size: 11px;
  font-weight: 600;
  @apply text-gray-900 dark:text-gray-100;
  margin-bottom: 2px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 10px;
  font-weight: 700;
  @apply text-green-600 dark:text-green-400;
  margin-bottom: 4px;
}

.product-actions {
  @apply flex justify-center items-center p-3;
}

.toggle-button {
  @apply p-2 rounded-lg transition-colors;
}

.toggle-button.active {
  @apply bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800;
}

.toggle-button.inactive {
  @apply bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800;
}

.edit-button {
  @apply p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}
</style>