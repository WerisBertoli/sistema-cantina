<template>
  <div class="modal-overlay" @click="store.closeModal()">
    <div class="modal-content" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold dark:text-white">Adicionar Crédito</h2>
        <button @click="store.closeModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400">Aluno:</p>
        <p class="font-medium dark:text-white">{{ currentStudent?.name }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Saldo atual:</p>
        <p class="font-medium" :class="getBalanceClass(currentStudent?.balance || 0)">
          {{ store.formatCurrency(currentStudent?.balance || 0) }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor do Crédito</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">R$</span>
            <input 
              v-model="creditValue"
              type="number" 
              step="0.01"
              min="0.01"
              required
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0,00"
            >
          </div>
        </div>
        
        <div v-if="creditValueNumber > 0" class="mb-4 p-3 bg-green-50 dark:bg-green-800 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-400">Novo saldo:</p>
          <p class="font-medium text-green-600 dark:text-green-400">
            {{ store.formatCurrency((currentStudent?.balance || 0) + creditValueNumber) }}
          </p>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button"
            @click="store.closeModal()"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="isSubmitting || creditValueNumber <= 0"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? 'Processando...' : 'Adicionar Crédito' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { BalanceStatus, type Student } from '@/types'

interface Props {
  student?: { student: Student }
}

const props = defineProps<Props>()
const store = useAppStore()

const creditValue = ref('')
const isSubmitting = ref(false)

// Usar o aluno passado como prop ou fallback para currentStudent
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

const creditValueNumber = computed(() => {
  const value = parseFloat(creditValue.value)
  return isNaN(value) ? 0 : value
})

const getBalanceClass = (balance: number) => {
  const status = store.getBalanceStatus(balance)
  return {
    'text-green-600': status === BalanceStatus.NORMAL,
    'text-yellow-600': status === BalanceStatus.LOW,
    'text-red-600': status === BalanceStatus.CRITICAL
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value || !currentStudent.value || creditValueNumber.value <= 0) return
  
  isSubmitting.value = true
  try {
    await store.addCredit(currentStudent.value.id!, creditValueNumber.value)
    creditValue.value = ''
    store.closeModal()
  } catch (error) {
    console.error('Erro ao adicionar crédito:', error)
    alert('Erro ao adicionar crédito. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>