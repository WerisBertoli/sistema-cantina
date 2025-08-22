<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Novo Pedido Pré-pago</h2>
        <button @click="closeModal" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="submitOrder" class="modal-body">
        <!-- Nome do Aluno -->
        <div class="form-group">
          <label class="form-label">Nome do Aluno</label>
          <input 
            type="text"
            v-model="studentName"
            class="form-input"
            placeholder="Digite o nome do aluno"
            required
          />
        </div>

        <!-- Lista de Produtos por Categoria -->
        <div class="form-group">
          <label class="form-label">Produtos</label>
          
          <!-- Lanches -->
          <div v-if="productsByCategory.lanche.length > 0" class="category-section">
            <h3 class="category-title">🥪 Lanches</h3>
            <div class="products-grid">
              <div 
                v-for="product in productsByCategory.lanche" 
                :key="product.id" 
                class="product-card"
                :class="{ 'selected': getProductQuantity(product.id!) > 0 }"
              >
                <div class="product-image">
                  <img 
                    v-if="product.imageUrl" 
                    :src="product.imageUrl" 
                    :alt="product.name"
                    class="product-img"
                  />
                  <div v-else class="product-placeholder">
                    🥪
                  </div>
                </div>
                <div class="product-info">
                  <h4 class="product-name">{{ product.name }}</h4>
                  <p class="product-price">{{ formatCurrency(product.price) }}</p>
                </div>
                <div class="quantity-controls">
                  <button 
                    type="button"
                    @click="decreaseQuantity(product.id!)"
                    class="quantity-btn"
                    :disabled="getProductQuantity(product.id!) === 0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <span class="quantity-display">{{ getProductQuantity(product.id!) }}</span>
                  <button 
                    type="button"
                    @click="increaseQuantity(product.id!)"
                    class="quantity-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bebidas -->
          <div v-if="productsByCategory.bebida.length > 0" class="category-section">
            <h3 class="category-title">🥤 Bebidas</h3>
            <div class="products-grid">
              <div 
                v-for="product in productsByCategory.bebida" 
                :key="product.id" 
                class="product-card"
                :class="{ 'selected': getProductQuantity(product.id!) > 0 }"
              >
                <div class="product-image">
                  <img 
                    v-if="product.imageUrl" 
                    :src="product.imageUrl" 
                    :alt="product.name"
                    class="product-img"
                  />
                  <div v-else class="product-placeholder">
                    🥤
                  </div>
                </div>
                <div class="product-info">
                  <h4 class="product-name">{{ product.name }}</h4>
                  <p class="product-price">{{ formatCurrency(product.price) }}</p>
                </div>
                <div class="quantity-controls">
                  <button 
                    type="button"
                    @click="decreaseQuantity(product.id!)"
                    class="quantity-btn"
                    :disabled="getProductQuantity(product.id!) === 0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <span class="quantity-display">{{ getProductQuantity(product.id!) }}</span>
                  <button 
                    type="button"
                    @click="increaseQuantity(product.id!)"
                    class="quantity-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Doces -->
          <div v-if="productsByCategory.doces.length > 0" class="category-section">
            <h3 class="category-title">🍭 Doces</h3>
            <div class="products-grid">
              <div 
                v-for="product in productsByCategory.doces" 
                :key="product.id" 
                class="product-card"
                :class="{ 'selected': getProductQuantity(product.id!) > 0 }"
              >
                <div class="product-image">
                  <img 
                    v-if="product.imageUrl" 
                    :src="product.imageUrl" 
                    :alt="product.name"
                    class="product-img"
                  />
                  <div v-else class="product-placeholder">
                    🍭
                  </div>
                </div>
                <div class="product-info">
                  <h4 class="product-name">{{ product.name }}</h4>
                  <p class="product-price">{{ formatCurrency(product.price) }}</p>
                </div>
                <div class="quantity-controls">
                  <button 
                    type="button"
                    @click="decreaseQuantity(product.id!)"
                    class="quantity-btn"
                    :disabled="getProductQuantity(product.id!) === 0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                    </svg>
                  </button>
                  <span class="quantity-display">{{ getProductQuantity(product.id!) }}</span>
                  <button 
                    type="button"
                    @click="increaseQuantity(product.id!)"
                    class="quantity-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Total -->
        <div class="total-section">
          <div class="total-display">
            <span class="total-label">Total:</span>
            <span class="total-value">{{ formatCurrency(totalValue) }}</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="modal-actions">
          <button type="button" @click="closeModal" class="cancel-button">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="submit-button"
            :disabled="!canSubmit"
          >
            Criar Pedido
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import type { PrepaidOrder, TransactionItem } from '@/types'
import { Timestamp } from 'firebase/firestore'

const store = useAppStore()

const studentName = ref('')

const orderItems = ref<Map<string, TransactionItem>>(new Map())

const isOpen = computed(() => store.modal.type === 'addPrepaidOrder')
const products = computed(() => store.products)

const productsByCategory = computed(() => {
  const categories = {
    lanche: [] as typeof store.products,
    bebida: [] as typeof store.products,
    doces: [] as typeof store.products
  }
  
  products.value.forEach(product => {
    const category = product.category?.toLowerCase() || 'lanche'
    if (category === 'lanche' || category === 'lanches') {
      categories.lanche.push(product)
    } else if (category === 'bebida' || category === 'bebidas') {
      categories.bebida.push(product)
    } else if (category === 'doce' || category === 'doces') {
      categories.doces.push(product)
    } else {
      // Se não tem categoria definida, coloca em lanches por padrão
      categories.lanche.push(product)
    }
  })
  
  return categories
})

const totalValue = computed(() => {
  let total = 0
  orderItems.value.forEach(item => {
    total += item.price * item.quantity
  })
  return total
})

const canSubmit = computed(() => {
  return studentName.value.trim() && orderItems.value.size > 0
})

const getProductQuantity = (productId: string): number => {
  return orderItems.value.get(productId)?.quantity || 0
}

const increaseQuantity = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return

  const currentItem = orderItems.value.get(productId)
  if (currentItem) {
    currentItem.quantity += 1
  } else {
    orderItems.value.set(productId, {
      productId,
      productName: product.name,
      quantity: 1,
      price: product.price
    })
  }
}

const decreaseQuantity = (productId: string) => {
  const currentItem = orderItems.value.get(productId)
  if (!currentItem) return

  if (currentItem.quantity > 1) {
    currentItem.quantity -= 1
  } else {
    orderItems.value.delete(productId)
  }
}

const resetForm = () => {
  studentName.value = ''

  orderItems.value.clear()
}

const closeModal = () => {
  resetForm()
  store.closeModal()
}

const submitOrder = async () => {
  if (!canSubmit.value) return

  // Para alunos não cadastrados, usamos o nome como ID temporário
  const studentId = `manual_${Date.now()}`
  const studentNameValue = studentName.value.trim()

  const order: Omit<PrepaidOrder, 'id'> = {
    studentId,
    studentName: studentNameValue,
    items: Array.from(orderItems.value.values()),
    totalValue: totalValue.value,
    status: 'pending',
    createdAt: Timestamp.now(),
    
  }

  try {
    await store.addPrepaidOrder(order)
    closeModal()
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    // Aqui você pode adicionar uma notificação de erro
  }
}

const formatCurrency = (value: number) => {
  return store.formatCurrency(value)
}

// Reset form when modal opens
watch(isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden;
}

.modal-header {
  @apply flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700;
}

.modal-title {
  @apply text-xl font-semibold text-gray-800 dark:text-white;
}

.close-button {
  @apply p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors;
}

.modal-body {
  @apply p-6 overflow-y-auto max-h-[calc(90vh-140px)];
}

.form-group {
  @apply mb-6;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white;
}



.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none;
}

.category-section {
  @apply mb-6;
}

.category-title {
  @apply text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2;
}

.products-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-3;
}

.product-card {
  @apply border border-gray-200 dark:border-gray-600 rounded-lg p-3 transition-all;
}

.product-card.selected {
  @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.product-image {
  @apply mb-3 flex justify-center;
}

.product-img {
  @apply w-16 h-16 object-cover rounded-lg;
}

.product-placeholder {
  @apply w-16 h-16 flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700 rounded-lg;
}

.product-info {
  @apply mb-3;
}

.product-name {
  @apply font-medium text-gray-800 dark:text-white;
}

.product-price {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.quantity-controls {
  @apply flex items-center justify-center gap-3;
}

.quantity-btn {
  @apply w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.quantity-display {
  @apply min-w-[2rem] text-center font-medium text-gray-800 dark:text-white;
}

.total-section {
  @apply border-t border-gray-200 dark:border-gray-700 pt-4 mb-6;
}

.total-display {
  @apply flex justify-between items-center;
}

.total-label {
  @apply text-lg font-medium text-gray-700 dark:text-gray-300;
}

.total-value {
  @apply text-xl font-bold text-gray-800 dark:text-white;
}

.modal-actions {
  @apply flex gap-3 justify-end;
}

.cancel-button {
  @apply px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors;
}

.submit-button {
  @apply px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors;
}
</style>