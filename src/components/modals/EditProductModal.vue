<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Editar Produto</h2>
        <button @click="$emit('close')" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Product Name -->
        <div class="form-group">
          <label for="productName" class="form-label">Nome do Produto</label>
          <input
            id="productName"
            v-model="form.name"
            type="text"
            class="form-input"
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <!-- Product Price -->
        <div class="form-group">
          <label for="productPrice" class="form-label">Preço (R$)</label>
          <input
            id="productPrice"
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            class="form-input"
            placeholder="0,00"
            required
          />
        </div>

        <!-- Product Category -->
        <div class="form-group">
          <label for="productCategory" class="form-label">Categoria</label>
          <select
            id="productCategory"
            v-model="form.category"
            class="form-select"
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="lanche">Lanche</option>
            <option value="bebida">Bebida</option>
            <option value="doce">Doce</option>
          </select>
        </div>

        <!-- Product Image URL -->
        <div class="form-group">
          <label for="productImage" class="form-label">URL da Imagem (opcional)</label>
          <input
            id="productImage"
            v-model="form.imageUrl"
            type="url"
            class="form-input"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <!-- Image Preview -->
        <div v-if="form.imageUrl" class="image-preview">
          <img
            :src="form.imageUrl"
            :alt="form.name"
            class="preview-image"
            @error="handleImageError"
          />
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            type="button"
            @click="$emit('close')"
            class="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="save-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Product } from '@/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [product: Product]
}>()

const store = useAppStore()
const isLoading = ref(false)

// Form data
const form = reactive({
  name: '',
  price: 0,
  category: '',
  imageUrl: ''
})

// Initialize form with product data
onMounted(() => {
  form.name = props.product.name
  form.price = props.product.price
  form.category = props.product.category || ''
  form.imageUrl = props.product.imageUrl || ''
})

// Methods
const handleOverlayClick = () => {
  emit('close')
}

const handleImageError = () => {
  // Handle image load error
  console.warn('Failed to load image:', form.imageUrl)
}

const handleSubmit = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true

    const updatedProduct: Product = {
      ...props.product,
      name: form.name.trim(),
      price: form.price,
      category: form.category as 'lanche' | 'bebida' | 'doce',
      imageUrl: form.imageUrl.trim() || undefined
    }

    await store.updateProduct(props.product.id, {
      name: form.name.trim(),
      price: form.price,
      category: form.category as 'lanche' | 'bebida' | 'doce',
      imageUrl: form.imageUrl.trim() || undefined
    })
    
    // Emit save event
    emit('save', updatedProduct)
    emit('close')
  } catch (error) {
    console.error('Erro ao salvar produto:', error)
    // TODO: Show error message to user
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-100;
}

.close-button {
  @apply p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors;
}

.modal-body {
  @apply p-6 space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input,
.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.image-preview {
  @apply mt-4;
}

.preview-image {
  @apply w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700;
}

.modal-actions {
  @apply flex gap-3 pt-4;
}

.cancel-button {
  @apply flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors;
}

.save-button {
  @apply flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2;
}

.loading-spinner {
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}
</style>