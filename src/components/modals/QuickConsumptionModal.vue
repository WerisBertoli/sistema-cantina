<template>
  <div class="modal-overlay" @click="store.closeModal()">
    <div class="modal-content" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold dark:text-white">Consumo Rápido</h2>
        <button @click="store.closeModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-300">Aluno:</p>
            <p class="font-semibold dark:text-white">{{ currentStudent?.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600 dark:text-gray-300">Saldo:</p>
            <p class="font-bold" :class="getBalanceClass(currentStudent?.balance || 0)">
              {{ store.formatCurrency(currentStudent?.balance || 0) }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Produtos mais vendidos/favoritos para acesso rápido -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-3 dark:text-white">Produtos Populares</h3>
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="product in popularProducts" 
            :key="product.id"
            class="border dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            @click="quickAddProduct(product)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm dark:text-white">{{ product.name }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ store.formatCurrency(product.price) }}</p>
              </div>
              <div class="text-right">
                <div v-if="getCartQuantity(product) > 0" class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {{ getCartQuantity(product) }}
                </div>
                <div v-else class="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                  <span class="text-gray-400 dark:text-gray-500 text-xs">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resumo e ações -->
      <div v-if="store.cartTotal > 0" class="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium dark:text-white">Total:</span>
          <span class="font-bold dark:text-white">{{ store.formatCurrency(store.cartTotal) }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="dark:text-gray-200">Novo saldo:</span>
          <span :class="getNewBalanceClass()">{{ store.formatCurrency(newBalance) }}</span>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button 
          @click="store.closeModal()"
          class="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button 
          @click="openFullModal"
          class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700"
        >
          Ver Todos
        </button>
        <button 
          @click="handleQuickSubmit"
          :disabled="isSubmitting || store.cartTotal === 0 || newBalance < 0"
          class="animated-button"
        >
          <span>{{ isSubmitting ? 'Processando...' : 'Confirmar' }}</span>
          <span></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { BalanceStatus, type Product, type Student } from '@/types'

interface Props {
  student?: { student: Student }
}

const props = defineProps<Props>()
const store = useAppStore()
const isSubmitting = ref(false)

const currentStudent = computed(() => {
  // Se props.student existe, pode ser tanto { student: Student } quanto Student diretamente
  if (props.student) {
    // Se tem a propriedade student, é o formato { student: Student }
    if ('student' in props.student) {
      return props.student.student
    }
    // Senão, é Student diretamente
    return props.student as Student
  }
  // Fallback para currentStudent do store
  return store.currentStudent
})

const newBalance = computed(() => {
  return (currentStudent.value?.balance || 0) - store.cartTotal
})

// Produtos mais populares (primeiros 6 produtos)
const popularProducts = computed(() => {
  return store.products.slice(0, 6)
})

const getBalanceClass = (balance: number) => {
  const status = store.getBalanceStatus(balance)
  return {
    'text-green-600': status === BalanceStatus.NORMAL,
    'text-yellow-600': status === BalanceStatus.LOW,
    'text-red-600': status === BalanceStatus.CRITICAL
  }
}

const getNewBalanceClass = () => {
  const status = store.getBalanceStatus(newBalance.value)
  return {
    'text-green-600 dark:text-green-400': status === BalanceStatus.NORMAL,
    'text-yellow-600 dark:text-yellow-400': status === BalanceStatus.LOW,
    'text-red-600 dark:text-red-400': status === BalanceStatus.CRITICAL
  }
}

const getCartQuantity = (product: Product) => {
  const item = store.cart.find(item => item.product.id === product.id)
  return item ? item.quantity : 0
}

const quickAddProduct = (product: Product) => {
  store.addToCart(product)
}

const openFullModal = () => {
  store.closeModal()
  store.openModal('consumption', currentStudent.value)
}

const handleQuickSubmit = async () => {
  if (isSubmitting.value || !currentStudent.value || store.cartTotal === 0) return
  
  if (newBalance.value < 0) {
    alert('Saldo insuficiente para esta compra!')
    return
  }
  
  isSubmitting.value = true
  try {
    await store.processConsumption(currentStudent.value.id!)
    store.closeModal()
  } catch (error) {
    console.error('Erro ao processar consumo:', error)
    alert('Erro ao processar consumo. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* From Uiverse.io by gharsh11032000 */
.animated-button {
  position: relative;
  display: inline-block;
  padding: 12px 24px;
  border: none;
  font-size: 16px;
  background-color: inherit;
  border-radius: 100px;
  font-weight: 600;
  color: #ffffff40;
  box-shadow: 0 0 0 2px #ffffff20;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.animated-button span:last-child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #2196F3;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
}

.animated-button span:first-child {
  position: relative;
  z-index: 1;
}

.animated-button:hover {
  box-shadow: 0 0 0 5px #2195f360;
  color: #ffffff;
}

.animated-button:active {
  scale: 0.95;
}

.animated-button:hover span:last-child {
  width: 150px;
  height: 150px;
  opacity: 1;
}

.animated-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.animated-button:disabled:hover {
  box-shadow: 0 0 0 2px #ffffff20;
  color: #ffffff40;
}

.animated-button:disabled:hover span:last-child {
  width: 20px;
  height: 20px;
  opacity: 0;
}
</style>