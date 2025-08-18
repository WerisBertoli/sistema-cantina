<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-4">
    <div class="max-w-md mx-auto">
      <!-- Order Buttons -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">📞 Fazer Pedidos</h2>

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
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">📝 Lista de Compras</h1>
          <div class="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
            <span class="text-blue-800 dark:text-blue-200 text-sm font-medium"
              >{{ pendingItems.length }} pendentes</span
            >
          </div>
        </div>

        <!-- Add new item form -->
        <div class="flex gap-2">
          <input
            v-model="newItem"
            @keyup.enter="addItem"
            type="text"
            placeholder="Ex: Molho de tomate, Pão, Salsicha..."
            class="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button
            @click="addItem"
            :disabled="!newItem.trim()"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ➕
          </button>
        </div>
      </div>

      <!-- Pending Items -->
      <div v-if="pendingItems.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          🛒 Preciso Comprar
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
              class="text-red-500 hover:text-red-700 transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Completed Items -->
      <div v-if="completedItems.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          ✅ Já Comprei
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
              class="text-red-500 hover:text-red-700 transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>

        <!-- Clear completed button -->
        <button
          @click="clearCompleted"
          class="mt-4 w-full py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
        >
          🧹 Limpar itens concluídos
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div class="text-6xl mb-4">🛒</div>
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
import { ref, computed, onMounted } from 'vue'
import SalgadosOrderModal from './modals/SalgadosOrderModal.vue'
import TropinhoOrderModal from './modals/TropinhoOrderModal.vue'

interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

const items = ref<TodoItem[]>([])
const newItem = ref('')

// Modal states
const showSalgadosModal = ref(false)
const showTropinhoModal = ref(false)

// Computed properties
const pendingItems = computed(() =>
  items.value
    .filter((item) => !item.completed)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
)

const completedItems = computed(() =>
  items.value
    .filter((item) => item.completed)
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)),
)

// Functions
const addItem = () => {
  if (!newItem.value.trim()) return

  const item: TodoItem = {
    id: Date.now().toString(),
    text: newItem.value.trim(),
    completed: false,
    createdAt: new Date(),
  }

  items.value.push(item)
  newItem.value = ''
  saveToLocalStorage()
}

const toggleItem = (id: string) => {
  const item = items.value.find((item) => item.id === id)
  if (item) {
    item.completed = !item.completed
    if (item.completed) {
      item.completedAt = new Date()
    } else {
      delete item.completedAt
    }
    saveToLocalStorage()
  }
}

const deleteItem = (id: string) => {
  items.value = items.value.filter((item) => item.id !== id)
  saveToLocalStorage()
}

const clearCompleted = () => {
  items.value = items.value.filter((item) => !item.completed)
  saveToLocalStorage()
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Agora'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h atrás`
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
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

// Local Storage
const saveToLocalStorage = () => {
  localStorage.setItem('todoItems', JSON.stringify(items.value))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('todoItems')
  if (saved) {
    const parsed = JSON.parse(saved)
    items.value = parsed.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
    }))
  }
}

// Lifecycle
onMounted(() => {
  loadFromLocalStorage()
})
</script>
