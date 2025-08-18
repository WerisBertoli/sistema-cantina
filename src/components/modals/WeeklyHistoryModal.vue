<template>
  <div class="modal-overlay" @click="store.closeModal()">
    <div class="modal-content-large max-h-[90vh] overflow-y-auto" @click.stop>
      <div
        class="flex justify-between items-center mb-3 sm:mb-4 bg-white dark:bg-gray-800 pb-2 sm:pb-3 border-b dark:border-gray-600"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Histórico Semanal
          </h2>
        </div>
        <button
          @click="store.closeModal()"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Informações do Aluno -->
      <div
        class="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-800"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        >
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-300 mb-1">Aluno:</p>
            <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">
              {{ store.currentStudent?.name }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">Responsável:</p>
            <p class="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-200 truncate">
              {{ store.currentStudent?.parentName || 'responsável' }}
            </p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-xs text-gray-600 dark:text-gray-300 mb-1">Saldo atual:</p>
            <p
              class="font-bold text-base sm:text-lg"
              :class="getBalanceClass(store.currentStudent?.balance || 0)"
            >
              {{ store.formatCurrency(store.currentStudent?.balance || 0) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Resumo da Semana -->
      <div class="mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <div
          class="bg-green-50 dark:bg-green-900 p-3 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div class="flex items-center">
            <div class="p-1.5 bg-green-100 dark:bg-green-800 rounded-lg mr-2">
              <svg
                class="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-300">Total de Recargas</p>
              <p class="font-bold text-base text-green-600">
                {{ store.formatCurrency(totalCredits) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-red-50 dark:bg-red-900 p-3 rounded-lg border border-red-200 dark:border-red-800"
        >
          <div class="flex items-center">
            <div class="p-1.5 bg-red-100 dark:bg-red-800 rounded-lg mr-2">
              <svg
                class="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-300">Total de Consumos</p>
              <p class="font-bold text-base text-red-600">
                {{ store.formatCurrency(Math.abs(totalConsumptions)) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-center">
            <div class="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg mr-2">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-300">Transações</p>
              <p class="font-bold text-base text-blue-600">{{ weeklyTransactions.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Transações -->
      <div class="mb-4">
        <div class="flex items-center mb-3">
          <svg
            class="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">
            Movimentações dos últimos 7 dias
          </h3>
        </div>

        <div
          v-if="weeklyTransactions.length === 0"
          class="text-center py-6 text-gray-500 dark:text-gray-400"
        >
          <svg
            class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p class="text-base font-medium dark:text-gray-300">Nenhuma movimentação</p>
          <p class="text-xs dark:text-gray-400">Não há transações nos últimos 7 dias</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="transaction in weeklyTransactions"
            :key="transaction.id"
            class="p-3 rounded-lg border transition-all hover:shadow-md"
            :class="getTransactionClass(transaction.type)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="p-1.5 rounded-lg mr-2"
                  :class="getTransactionIconClass(transaction.type)"
                >
                  <svg
                    class="w-4 h-4"
                    :class="getTransactionIconColor(transaction.type)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="transaction.type === 'credit'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-sm" :class="getTransactionTextColor(transaction.type)">
                    {{ transaction.type === 'credit' ? 'Recarga' : 'Consumo' }}
                  </p>
                  <p class="text-xs text-gray-600">{{ formatTransactionDate(transaction.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-base" :class="getTransactionValueColor(transaction.type)">
                  {{ transaction.type === 'credit' ? '+' : '-'
                  }}{{ store.formatCurrency(Math.abs(transaction.value)) }}
                </p>
                <!-- Botão de editar para recargas -->
                <button
                  v-if="transaction.type === 'credit'"
                  @click="openEditModal(transaction)"
                  class="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Editar
                </button>
              </div>
            </div>

            <!-- Itens do consumo -->
            <div v-if="transaction.type === 'consumption' && transaction.items" class="mt-2 pl-8">
              <p class="text-xs text-gray-600 mb-1">Itens consumidos:</p>
              <div class="space-y-0.5">
                <div
                  v-for="item in transaction.items"
                  :key="item.productId"
                  class="flex justify-between text-xs"
                >
                  <span class="text-gray-700">{{ item.quantity }}x {{ item.productName }}</span>
                  <span class="text-gray-600">{{
                    store.formatCurrency(item.quantity * item.price)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
        <button
          @click="generateAndCopyReport"
          class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
          {{ copyButtonText }}
        </button>

        <button
          @click="sendToWhatsApp"
          class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.703"
            />
          </svg>
          Enviar WhatsApp
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Edição de Recarga -->
  <div v-if="isEditModalOpen" class="modal-overlay" @click="closeEditModal">
    <div class="modal-content bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Editar Recarga</h3>
        <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2"> Valor da Recarga </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
          <input
            v-model.number="editAmount"
            type="number"
            step="0.01"
            min="0.01"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0,00"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="closeEditModal"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          @click="saveEdit"
          :disabled="isSubmitting || editAmount <= 0"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { BalanceStatus } from '@/types'
import type { Transaction } from '@/types'
import type { Timestamp } from 'firebase/firestore'

const store = useAppStore()
const copyButtonText = ref('Copiar Relatório')
const isEditModalOpen = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const editAmount = ref(0)
const isSubmitting = ref(false)

// Filtrar transações da última semana
const weeklyTransactions = computed(() => {
  if (!store.currentStudent) return []

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  return store.transactions
    .filter((t) => t.studentId === store.currentStudent!.id && t.date.toDate() >= oneWeekAgo)
    .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime())
})

// Calcular totais
const totalCredits = computed(() => {
  return weeklyTransactions.value
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.value, 0)
})

const totalConsumptions = computed(() => {
  return weeklyTransactions.value
    .filter((t) => t.type === 'consumption')
    .reduce((sum, t) => sum + t.value, 0)
})

// Funções de estilo
const getBalanceClass = (balance: number) => {
  const status = store.getBalanceStatus(balance)
  return {
    'text-green-600': status === BalanceStatus.NORMAL,
    'text-yellow-600': status === BalanceStatus.LOW,
    'text-red-600': status === BalanceStatus.CRITICAL,
  }
}

const getTransactionClass = (type: string) => {
  return type === 'credit' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
}

const getTransactionIconClass = (type: string) => {
  return type === 'credit' ? 'bg-green-100' : 'bg-red-100'
}

const getTransactionIconColor = (type: string) => {
  return type === 'credit' ? 'text-green-600' : 'text-red-600'
}

const getTransactionTextColor = (type: string) => {
  return type === 'credit' ? 'text-green-700' : 'text-red-700'
}

const getTransactionValueColor = (type: string) => {
  return type === 'credit' ? 'text-green-600' : 'text-red-600'
}

const formatTransactionDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate()
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Gerar relatório em texto
const generateTextReport = async (): Promise<string> => {
  if (!store.currentStudent) return ''
  return await store.generateWeeklyReport(store.currentStudent)
}

// Copiar relatório
const generateAndCopyReport = async () => {
  try {
    const report = await generateTextReport()
    await navigator.clipboard.writeText(report)
    copyButtonText.value = 'Copiado!'
    setTimeout(() => {
      copyButtonText.value = 'Copiar Relatório'
    }, 2000)
  } catch (error) {
    console.error('Erro ao copiar relatório:', error)
    copyButtonText.value = 'Erro ao copiar'
    setTimeout(() => {
      copyButtonText.value = 'Copiar Relatório'
    }, 2000)
  }
}

// Enviar para WhatsApp
const sendToWhatsApp = async () => {
  if (!store.currentStudent) return

  const report = await generateTextReport()
  const phone = store.currentStudent.parentPhone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(report)
  const whatsappUrl = `https://wa.me/55${phone}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}

// Funções de edição
const openEditModal = (transaction: Transaction) => {
  editingTransaction.value = transaction
  editAmount.value = transaction.value
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingTransaction.value = null
  editAmount.value = 0
  isSubmitting.value = false
}

const saveEdit = async () => {
  if (!editingTransaction.value || !store.currentStudent || isSubmitting.value) return

  if (editAmount.value <= 0) {
    alert('O valor deve ser maior que zero!')
    return
  }

  isSubmitting.value = true
  try {
    await store.editCreditTransaction(
      editingTransaction.value.id!,
      editingTransaction.value.value,
      editAmount.value,
      store.currentStudent.id!,
    )
    closeEditModal()
  } catch (error) {
    console.error('Erro ao editar transação:', error)
    alert('Erro ao editar transação. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
