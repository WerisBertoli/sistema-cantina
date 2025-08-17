<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4">
      <div class="flex items-center justify-between relative z-10">
        <!-- Botão Voltar -->
        <button 
          v-if="store.currentStudent"
          @click="store.setCurrentStudent(null)"
          class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <svg class="mr-1 sm:mr-2 sm:h-4 sm:w-4" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span class="text-sm sm:text-base">Voltar</span>
        </button>
        
        <!-- Espaço vazio quando não há botão voltar -->
        <div v-else class="w-16"></div>

        <!-- Nome da Escola -->
        <div class="flex flex-col items-center flex-1">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-white font-medium leading-tight">
            CENTRO EDUCACIONAL
          </div>
          <div class="text-sm sm:text-lg font-bold text-red-500 dark:text-red-400 leading-tight">
            ERLACH
          </div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-white leading-tight">
            Cantina Digital
          </div>
        </div>
        
        <!-- Botão de Toggle Dark/Light Mode -->
        <button 
          @click="toggleDarkMode"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          :title="isDarkMode ? 'Modo Claro' : 'Modo Escuro'"
        >
          <!-- Ícone Sol (Modo Claro) -->
          <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <!-- Ícone Lua (Modo Escuro) -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto pb-16 sm:pb-20">
      <!-- Students List -->
      <StudentsList v-if="!store.currentStudent && store.activeTab === 'students'" />
      
      <!-- Student Details -->
      <StudentDetails v-if="store.currentStudent" />
      
      <!-- Earnings -->
      <EarningsView v-if="!store.currentStudent && store.activeTab === 'earnings'" />
    </main>

    <!-- Bottom Navigation -->
    <BottomNavigation @navigate="store.setActiveTab" :activeTab="store.activeTab" />

    <!-- FAB (Floating Action Button) -->
    <button 
      v-if="!store.currentStudent && store.activeTab === 'students'"
      @click="store.openModal('addStudent')"
      class="fab"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import StudentsList from '@/components/StudentsList.vue'
import StudentDetails from '@/components/StudentDetails.vue'
import EarningsView from '@/components/EarningsView.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const store = useAppStore()

const currentTitle = computed(() => {
  if (store.currentStudent) {
    return store.currentStudent.name
  }
  return store.activeTab === 'students' ? 'Cantina Digital' : 'Ganhos'
})

// Dark mode functionality
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  const htmlElement = document.documentElement
  
  if (isDarkMode.value) {
    htmlElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    htmlElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Initialize theme on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const htmlElement = document.documentElement
  
  // Always start by removing dark class
  htmlElement.classList.remove('dark')
  
  // Force light mode as default if no saved theme
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    htmlElement.classList.add('dark')
  } else {
    // Default to light mode
    isDarkMode.value = false
    htmlElement.classList.remove('dark')
    // Set light theme in localStorage if not set
    if (!savedTheme) {
      localStorage.setItem('theme', 'light')
    }
  }
})
</script>