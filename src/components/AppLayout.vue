<template>
  <div 
    class="flex flex-col h-screen"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Header -->
    <header class="modern-header relative px-3 sm:px-4 py-6 sm:py-8">
      <div class="flex items-center justify-between relative z-10">
        <!-- Botão Voltar (quando há estudante selecionado) - Posicionado à esquerda -->
        <button
          v-if="store.currentStudent"
          @click="store.setCurrentStudent(null)"
          class="modern-back-button flex items-center px-3 py-2 rounded-lg transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span class="text-sm sm:text-base">Voltar</span>
        </button>
        
        <!-- Logo da Escola (quando não há estudante selecionado) -->
        <div v-if="!store.currentStudent" class="flex items-center">
          <img 
            src="/logo-erlach.png" 
            alt="Logo Centro Educacional Erlach" 
            class="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            style="background: transparent; mix-blend-mode: multiply;"
          />
        </div>
        
        <!-- Espaçador quando há estudante selecionado -->
        <div v-if="store.currentStudent" class="flex-1"></div>

        <!-- Toggle Dark Mode -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <!-- Ícone Sol (Modo Claro) -->
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          
          <!-- Ícone Lua (Modo Escuro) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        </button>
      </div>
      
      <!-- Cantina Digital - Centralizado -->
      <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <h1 class="text-lg sm:text-xl font-bold tracking-wider text-white">
          Cantina Digital
        </h1>
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

      <!-- Products Management -->
      <ProductManagement v-if="!store.currentStudent && store.activeTab === 'products'" />

      <!-- Todo List -->
      <TodoListView v-if="!store.currentStudent && store.activeTab === 'tarefas'" />
    </main>

    <!-- Bottom Navigation -->
    <BottomNavigation @navigate="store.setActiveTab" :activeTab="store.activeTab" />


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import StudentsList from '@/components/StudentsList.vue'
import StudentDetails from '@/components/StudentDetails.vue'
import EarningsView from '@/components/EarningsView.vue'
import ProductManagement from '../components/ProductManagement.vue'
import TodoListView from '@/components/TodoListView.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const store = useAppStore()

// Swipe navigation variables
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const minSwipeDistance = 50
const maxVerticalDistance = 100

// const currentTitle = computed(() => {
//   if (store.currentStudent) {
//     return store.currentStudent.name
//   }
//   return store.activeTab === 'students' ? 'Cantina Digital' : 'Ganhos'
// })

// Swipe navigation functions
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  // Prevent default scrolling behavior during swipe
  const deltaX = e.touches[0].clientX - touchStartX.value
  const deltaY = Math.abs(e.touches[0].clientY - touchStartY.value)
  
  // If it's a horizontal swipe (more horizontal than vertical movement)
  if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 20) {
    e.preventDefault()
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX
  touchEndY.value = e.changedTouches[0].clientY
  
  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = Math.abs(touchEndY.value - touchStartY.value)
  
  // Check if it's a valid swipe gesture
  if (Math.abs(deltaX) > minSwipeDistance && deltaY < maxVerticalDistance) {
    // Swipe right (go back)
    if (deltaX > 0 && store.currentStudent) {
      store.setCurrentStudent(null)
    }
  }
}

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

<style scoped>
/* Header com cor sólida igual ao th */
.modern-header {
  background: #2563eb;
}

/* Container do nome da escola */
.school-name-container {
  position: relative;
  z-index: 2;
}

/* Título da escola com vermelho Ferrari */
.school-title {
  color: #ff2800 !important;
}

/* Botão de toggle sem efeitos */
.modern-toggle-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

/* Botão de voltar sem efeitos */
.modern-back-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

/* Responsividade */
@media (max-width: 640px) {
  .modern-header {
    padding: 0.75rem 0.75rem 1rem 0.75rem;
  }

  .school-title {
    font-size: 1.125rem;
  }
}

/* Modo escuro - ajustes para manter a consistência */
.dark .modern-header {
  background: #1d4ed8;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark .modern-header::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.dark .modern-toggle-button,
.dark .modern-back-button {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

.dark .modern-toggle-button:hover,
.dark .modern-back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
