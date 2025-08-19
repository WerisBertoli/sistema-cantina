<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Adicionar Novo Produto
        </h2>
        <button 
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveProduct" class="modal-body">
        <!-- Nome do Produto -->
        <div class="form-group">
          <label for="name" class="form-label">Nome do Produto</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="form-input"
            placeholder="Digite o nome do produto"
          />
        </div>

        <!-- Preço -->
        <div class="form-group">
          <label for="price" class="form-label">Preço (R$)</label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
            required
            class="form-input"
            placeholder="0,00"
          />
        </div>

        <!-- Categoria -->
        <div class="form-group">
          <label for="category" class="form-label">Categoria</label>
          <select
            id="category"
            v-model="form.category"
            required
            class="form-input"
          >
            <option value="">Selecione uma categoria</option>
            <option value="lanche">Lanche</option>
            <option value="bebida">Bebida</option>
            <option value="doce">Doce</option>
          </select>
        </div>

        <!-- URL da Imagem -->
        <div class="form-group">
          <label for="imageUrl" class="form-label">URL da Imagem (opcional)</label>
          <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="url"
            class="form-input"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <!-- Preview da Imagem -->
        <div v-if="form.imageUrl" class="form-group">
          <label class="form-label">Preview da Imagem</label>
          <div class="image-preview">
            <img 
              :src="form.imageUrl" 
              :alt="form.name"
              class="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              @error="imageError = true"
              @load="imageError = false"
            />
            <p v-if="imageError" class="text-sm text-red-500 mt-2">
              Erro ao carregar a imagem. Verifique a URL.
            </p>
          </div>
        </div>

        <!-- Botões -->
        <div class="modal-footer">
          <button
            type="button"
            @click="emit('close')"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn-primary"
          >
            <span v-if="loading">Salvando...</span>
            <span v-else>Adicionar Produto</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Product } from '@/types'

const store = useAppStore()

// Emits
const emit = defineEmits<{
  close: []
  save: [product: Product]
}>()

// Reactive data
const loading = ref(false)
const imageError = ref(false)

const form = ref({
  name: '',
  price: 0,
  category: '' as 'lanche' | 'bebida' | 'doce' | '',
  imageUrl: ''
})

// Computed
const isFormValid = computed(() => {
  return form.value.name.trim() && 
         form.value.price > 0 && 
         form.value.category
})

// Methods
const saveProduct = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  
  try {
    await store.addProduct({
      name: form.value.name.trim(),
      price: form.value.price,
      category: form.value.category as 'lanche' | 'bebida' | 'doce',
      imageUrl: form.value.imageUrl.trim() || undefined,
      active: true
    })
    
    emit('close')
  } catch (error) {
    console.error('Erro ao adicionar produto:', error)
    // TODO: Show error message to user
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700;
}

.modal-body {
  @apply p-6 space-y-4;
}

.modal-footer {
  @apply flex gap-3 pt-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100;
}

.image-preview {
  @apply flex items-start gap-3;
}

.btn-primary {
  @apply flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors;
}

.btn-secondary {
  @apply flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors;
}
</style>