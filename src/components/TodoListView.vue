<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <div class="max-w-lg mx-auto">
      <!-- Order Buttons -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">Fazer Pedidos</h2>

        <div class="grid grid-cols-2 gap-3">
          <!-- Salgados Button -->
          <button
            @click="openSalgadosModal"
            class="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
            <span class="font-medium text-sm">Salgados</span>
          </button>

          <!-- Tropinhos Button -->
          <button
            @click="openTropinhoModal"
            class="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.717 2.717 0 003 15.546V9.75c0-4.418 4.03-8 9-8s9 3.582 9 8v5.796z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              ></path>
            </svg>
            <span class="font-medium text-sm">Tropinhos</span>
          </button>
        </div>
      </div>

      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Lista de Compras</h1>
          <div class="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
            <span class="text-blue-800 dark:text-blue-200 text-sm font-medium"
              >{{ pendingItems.length }} pendentes</span
            >
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>

        <!-- Add new item form -->
        <div class="flex gap-2">
          <input
            v-model="newItem"
            @keyup.enter="addItem"
            type="text"
            placeholder="Ex: Molho de tomate, Pão, Salsicha..."
            class="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            :disabled="loading"
          />
          <button
            @click="addItem"
            :disabled="loading || !newItem.trim()"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Pending Items -->
      <div v-if="pendingItems.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          Preciso Comprar
          <span class="ml-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">{{
            pendingItems.length
          }}</span>
        </h2>

        <div class="space-y-3">
          <div
            v-for="item in pendingItems"
            :key="item.id"
            class="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <button
              @click="toggleItem(item.id)"
              class="w-6 h-6 border-2 border-red-300 rounded-full hover:border-red-500 transition-colors flex items-center justify-center"
            >
              <span class="text-red-500 text-xs">○</span>
            </button>
            <span class="flex-1 text-gray-800 dark:text-gray-200 font-medium">{{ item.text }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(item.createdAt) }}</span>
            <button
              @click="deleteItem(item.id)"
              class="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Completed Items -->
      <div v-if="completedItems.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          Já Comprei
          <span class="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">{{
            completedItems.length
          }}</span>
        </h2>

        <div class="space-y-3">
          <div
            v-for="item in completedItems"
            :key="item.id"
            class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <button
              @click="toggleItem(item.id)"
              class="w-6 h-6 border-2 border-green-500 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <span class="text-white text-xs">✓</span>
            </button>
            <span class="flex-1 text-gray-600 dark:text-gray-400 line-through">{{ item.text }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{
              formatDate(item.completedAt || item.createdAt)
            }}</span>
            <button
              @click="deleteItem(item.id)"
              class="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Clear completed button -->
        <button
          @click="clearCompleted"
          class="mt-4 w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          Limpar itens concluídos
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div class="flex justify-center mb-4">
          <svg class="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Lista vazia</h3>
        <p class="text-gray-600 dark:text-gray-400">Adicione itens que você precisa comprar!</p>
      </div>
    </div>

    <!-- Modals -->
    <SalgadosOrderModal :is-open="showSalgadosModal" @close="closeSalgadosModal" />

    <TropinhoOrderModal :is-open="showTropinhoModal" @close="closeTropinhoModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SalgadosOrderModal from './modals/SalgadosOrderModal.vue'
import TropinhoOrderModal from './modals/TropinhoOrderModal.vue'
import {
  addShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
  clearCompletedItems,
  subscribeToShoppingList,
  convertTimestampToDate,
  type ShoppingListItem
} from '../services/shoppingList'

const items = ref<ShoppingListItem[]>([])
const newItem = ref('')
const loading = ref(false)
const error = ref('')

// Modal states
const showSalgadosModal = ref(false)
const showTropinhoModal = ref(false)

// Computed properties
const pendingItems = computed(() =>
  items.value
    .filter((item) => !item.completed)
    .sort((a, b) => convertTimestampToDate(b.createdAt).getTime() - convertTimestampToDate(a.createdAt).getTime()),
)

const completedItems = computed(() =>
  items.value
    .filter((item) => item.completed)
    .sort((a, b) => {
      const bTime = b.completedAt ? convertTimestampToDate(b.completedAt).getTime() : 0
      const aTime = a.completedAt ? convertTimestampToDate(a.completedAt).getTime() : 0
      return bTime - aTime
    }),
)

// Functions
const addItem = async () => {
  if (!newItem.value.trim() || loading.value) return

  try {
    loading.value = true
    error.value = ''
    await addShoppingItem(newItem.value.trim())
    newItem.value = ''
  } catch (err) {
    error.value = 'Erro ao adicionar item'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const toggleItem = async (id: string) => {
  const item = items.value.find((item) => item.id === id)
  if (!item || loading.value) return

  try {
    loading.value = true
    error.value = ''
    await toggleShoppingItem(id, !item.completed)
  } catch (err) {
    error.value = 'Erro ao atualizar item'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id: string) => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''
    await deleteShoppingItem(id)
  } catch (err) {
    error.value = 'Erro ao excluir item'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const clearCompleted = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''
    await clearCompletedItems(items.value)
  } catch (err) {
    error.value = 'Erro ao limpar itens'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: any) => {
  const convertedDate = convertTimestampToDate(date)
  const now = new Date()
  const diffInHours = (now.getTime() - convertedDate.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Agora'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h atrás`
  } else {
    return convertedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }
}

// Modal functions
const openSalgadosModal = () => {
  showSalgadosModal.value = true
}

const closeSalgadosModal = () => {
  showSalgadosModal.value = false
}

const openTropinhoModal = () => {
  showTropinhoModal.value = true
}

const closeTropinhoModal = () => {
  showTropinhoModal.value = false
}

// Firebase listener
let unsubscribe: (() => void) | null = null

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Set up real-time listener
    unsubscribe = subscribeToShoppingList((newItems: ShoppingListItem[]) => {
      items.value = newItems
      loading.value = false
    })
  } catch (err) {
    error.value = 'Erro ao carregar lista'
    console.error(err)
    loading.value = false
  }
})

// Cleanup listener on unmount
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>
