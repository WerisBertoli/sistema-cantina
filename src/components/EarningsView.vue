<template>
  <div class="p-4 space-y-6">
    <!-- Período Selecionado -->
    <div class="bg-blue-600 dark:bg-blue-700 p-4">
      <h2 class="text-lg font-semibold text-white mb-3">Período</h2>
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="changePeriod(period.value)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all duration-200',
            selectedPeriod === period.value
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
          ]"
        >
          {{ period.label }}
        </button>
      </div>
      
      <!-- Seletor de Mês/Ano (aparece quando 'Mês Específico' está selecionado) -->
      <div v-if="selectedPeriod === 'custom'" class="flex flex-wrap gap-3 items-center">
        <div class="flex flex-col">
          <label class="text-sm text-blue-100 mb-1">Mês</label>
          <select
            v-model="selectedMonth"
            @change="resetPagination"
            class="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>
        
        <div class="flex flex-col">
          <label class="text-sm text-blue-100 mb-1">Ano</label>
          <select
            v-model="selectedYear"
            @change="resetPagination"
            class="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Cards de Ganhos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Ganho do Período -->
      <div
        class="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Ganhos {{ currentPeriodLabel }}
            </p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(currentEarnings) }}</p>
          </div>
          <div
            class="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-7 h-7 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total de Transações -->
      <div
        class="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Transações</p>
            <p class="text-2xl font-bold text-blue-600">{{ totalTransactions }}</p>
          </div>
          <div
            class="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-7 h-7 text-blue-600"
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
        </div>
      </div>
    </div>

    <!-- Histórico de Transações -->
    <div
      class="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700"
    >
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <svg
          class="w-6 h-6 text-green-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          ></path>
        </svg>
        Histórico de Transações
      </h3>
      <div v-if="filteredTransactions.length > 0" class="space-y-4">
        <div
          v-for="transaction in visibleTransactions"
          :key="transaction.id"
          class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ getStudentName(transaction.studentId) }}
                </h3>
                <span
                  :class="[
                    'text-sm font-medium',
                    transaction.type === 'credit'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-green-600 dark:text-green-400',
                  ]"
                >
                  {{ transaction.type === 'credit' ? '+' : ''
                  }}{{ formatCurrency(transaction.value) }}
                </span>
              </div>

              <div
                class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
              >
                <span>{{ formatDate(transaction.date) }}</span>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs',
                    transaction.type === 'credit'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                  ]"
                >
                  {{ transaction.type === 'credit' ? 'Recarga' : 'Consumo' }}
                </span>
              </div>

              <div
                v-if="transaction.items && transaction.items.length > 0"
                class="mt-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <span v-for="(item, index) in transaction.items" :key="item.productName">
                  {{ item.quantity }}x {{ item.productName
                  }}<span v-if="index < transaction.items.length - 1">, </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão Ver Mais -->
        <div v-if="hasMoreTransactions" class="text-center pt-4">
          <button
            @click="loadMoreTransactions"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center mx-auto space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
            <span>Ver mais transações</span>
            <span class="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
              +{{ Math.min(10, filteredTransactions.length - transactionsToShow) }}
            </span>
          </button>
        </div>

        <!-- Contador de transações -->
        <div class="text-center pt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {{ visibleTransactions.length }} de
            {{ filteredTransactions.length }} transações
          </p>
        </div>
      </div>
      <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg
          class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4"
          ></path>
        </svg>
        <p class="text-lg font-medium">Nenhuma transação encontrada</p>
        <p class="text-sm">No período selecionado</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'
import type { TransactionItem } from '../types'

const store = useAppStore()

const selectedPeriod = ref<'daily' | 'weekly' | 'monthly' | 'custom'>('daily')
const transactionsToShow = ref(10) // Número inicial de transações a mostrar
const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())

const periods = [
  { value: 'daily' as const, label: 'Hoje' },
  { value: 'weekly' as const, label: 'Semana' },
  { value: 'monthly' as const, label: 'Mês Atual' },
  { value: 'custom' as const, label: 'Mês Específico' },
]

// Lista de meses para o seletor
const months = [
  { value: 0, label: 'Janeiro' },
  { value: 1, label: 'Fevereiro' },
  { value: 2, label: 'Março' },
  { value: 3, label: 'Abril' },
  { value: 4, label: 'Maio' },
  { value: 5, label: 'Junho' },
  { value: 6, label: 'Julho' },
  { value: 7, label: 'Agosto' },
  { value: 8, label: 'Setembro' },
  { value: 9, label: 'Outubro' },
  { value: 10, label: 'Novembro' },
  { value: 11, label: 'Dezembro' },
]

// Gerar lista de anos disponíveis (últimos 3 anos + próximo ano)
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push(i)
  }
  return years
})

const currentPeriodLabel = computed(() => {
  if (selectedPeriod.value === 'custom') {
    const monthName = months.find(m => m.value === selectedMonth.value)?.label || 'Janeiro'
    return `${monthName} ${selectedYear.value}`
  }
  const period = periods.find((p) => p.value === selectedPeriod.value)
  return period ? period.label : 'Hoje'
})

const currentEarnings = computed(() => {
  switch (selectedPeriod.value) {
    case 'daily':
      return store.earnings.today
    case 'weekly':
      return store.earnings.thisWeek
    case 'monthly':
      return store.earnings.thisMonth
    case 'custom':
      return calculateCustomMonthEarnings()
    default:
      return store.earnings.today
  }
})

// Função para calcular ganhos de um mês específico
const calculateCustomMonthEarnings = (): number => {
  const startDate = new Date(selectedYear.value, selectedMonth.value, 1)
  const endDate = new Date(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59, 999)
  
  return store.transactions
    .filter((t) => {
      const transactionDate = t.date.toDate()
      return t.type === 'credit' && transactionDate >= startDate && transactionDate <= endDate
    })
    .reduce((sum, t) => sum + t.value, 0)
}

const filteredTransactions = computed(() => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let startDate: Date
  let endDate: Date | null = null
  
  switch (selectedPeriod.value) {
    case 'daily':
      startDate = startOfDay
      break
    case 'weekly':
      startDate = startOfWeek
      break
    case 'monthly':
      startDate = startOfMonth
      break
    case 'custom':
      startDate = new Date(selectedYear.value, selectedMonth.value, 1)
      endDate = new Date(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59, 999)
      break
    default:
      startDate = startOfDay
  }

  return store.transactions
    .filter((t) => {
      const transactionDate = t.date.toDate()
      if (endDate) {
        return transactionDate >= startDate && transactionDate <= endDate
      }
      return transactionDate >= startDate
    })
    .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime())
})

const totalTransactions = computed(() => filteredTransactions.value.length)

const visibleTransactions = computed(() => {
  return filteredTransactions.value.slice(0, transactionsToShow.value)
})

const hasMoreTransactions = computed(() => {
  return filteredTransactions.value.length > transactionsToShow.value
})

const loadMoreTransactions = () => {
  transactionsToShow.value += 10
}

const resetPagination = () => {
  transactionsToShow.value = 10
}

// Reset pagination when period changes
const changePeriod = (period: 'daily' | 'weekly' | 'monthly' | 'custom') => {
  selectedPeriod.value = period
  resetPagination()
}

const averageTicket = computed(() => {
  if (totalTransactions.value === 0) return 0
  return currentEarnings.value / totalTransactions.value
})

const formatCurrency = (value: number): string => {
  return store.formatCurrency(value)
}

const formatDate = (date: Date | { toDate: () => Date }): string => {
  const dateObj = 'toDate' in date ? date.toDate() : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

const getStudentName = (studentId: string): string => {
  const student = store.students.find((s) => s.id === studentId)
  return student ? student.name : 'Aluno não encontrado'
}
</script>
