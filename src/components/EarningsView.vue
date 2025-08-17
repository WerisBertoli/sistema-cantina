<template>
  <div class="p-4 space-y-6">
    <!-- Período Selecionado -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Período</h2>
      <div class="flex space-x-2">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedPeriod === period.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Cards de Ganhos -->
    <div class="grid grid-cols-1 gap-4">
      <!-- Ganho do Período -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ currentPeriodLabel }}</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(currentEarnings) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Total de Transações -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Transações</p>
            <p class="text-2xl font-bold text-blue-600">{{ totalTransactions }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Ticket Médio -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</p>
            <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(averageTicket) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Produtos Mais Vendidos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Produtos Mais Vendidos</h3>
      <div v-if="topProducts.length > 0" class="space-y-3">
        <div
          v-for="(item, index) in topProducts"
          :key="item.productId"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {{ index + 1 }}
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">{{ item.productName }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.quantity }} vendidos</p>
            </div>
          </div>
          <p class="font-semibold text-green-600">{{ formatCurrency(item.total) }}</p>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Nenhuma venda registrada no período</p>
      </div>
    </div>

    <!-- Histórico de Transações -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Histórico de Transações</h3>
      <div v-if="filteredTransactions.length > 0" class="space-y-3">
        <div
          v-for="transaction in filteredTransactions.slice(0, 10)"
          :key="transaction.id"
          class="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-700 rounded-r-lg"
        >
          <div>
            <p class="font-medium text-gray-800 dark:text-white">{{ getStudentName(transaction.studentId) }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(transaction.date) }}</p>
            <div v-if="transaction.items && transaction.items.length > 0" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ transaction.items.map((item: TransactionItem) => `${item.quantity}x ${item.productName}`).join(', ') }}
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-green-600">{{ formatCurrency(transaction.value) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ transaction.type }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Nenhuma transação encontrada no período</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'
import type { Transaction, TransactionItem } from '../types'

const store = useAppStore()

const selectedPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')

const periods = [
  { value: 'daily' as const, label: 'Hoje' },
  { value: 'weekly' as const, label: 'Semana' },
  { value: 'monthly' as const, label: 'Mês' }
]

const currentPeriodLabel = computed(() => {
  const period = periods.find(p => p.value === selectedPeriod.value)
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
    default:
      return store.earnings.today
  }
})

const filteredTransactions = computed(() => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let startDate: Date
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
    default:
      startDate = startOfDay
  }

  return store.transactions
    .filter(t => t.type === 'consumption' && t.date.toDate() >= startDate)
    .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime())
})

const totalTransactions = computed(() => filteredTransactions.value.length)

const averageTicket = computed(() => {
  if (totalTransactions.value === 0) return 0
  return currentEarnings.value / totalTransactions.value
})

const topProducts = computed(() => {
  const productStats = new Map<string, { productName: string; quantity: number; total: number }>()

  filteredTransactions.value.forEach(transaction => {
    if (transaction.items) {
      transaction.items.forEach((item: TransactionItem) => {
        const existing = productStats.get(item.productId)
        if (existing) {
          existing.quantity += item.quantity
          existing.total += item.quantity * item.price
        } else {
          productStats.set(item.productId, {
            productName: item.productName,
            quantity: item.quantity,
            total: item.quantity * item.price
          })
        }
      })
    }
  })

  return Array.from(productStats.entries())
    .map(([productId, stats]) => ({ productId, ...stats }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

const formatCurrency = (value: number): string => {
  return store.formatCurrency(value)
}

const formatDate = (date: any): string => {
  const dateObj = date.toDate ? date.toDate() : new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

const getStudentName = (studentId: string): string => {
  const student = store.students.find(s => s.id === studentId)
  return student ? student.name : 'Aluno não encontrado'
}
</script>