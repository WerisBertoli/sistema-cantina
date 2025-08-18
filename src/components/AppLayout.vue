<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="modern-header relative px-3 sm:px-4 py-4 sm:py-5">
      <div class="flex items-center justify-between relative z-10">
        <!-- Botão Voltar -->
        <button
          v-if="store.currentStudent"
          @click="store.setCurrentStudent(null)"
          class="modern-back-button flex items-center px-3 py-2 rounded-lg transition-all duration-300"
        >
          <svg
            class="mr-1 sm:mr-2 sm:h-4 sm:w-4"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span class="text-sm sm:text-base">Voltar</span>
        </button>

        <!-- Espaço vazio quando não há botão voltar -->
        <div v-else class="w-16"></div>

        <!-- Nome da Escola -->
        <div class="flex flex-col items-center flex-1 school-name-container">
          <div class="flex items-center space-x-2 mb-1">
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            <div class="text-xs sm:text-sm text-white font-medium leading-tight tracking-wide">
              CENTRO EDUCACIONAL
            </div>
          </div>
          <div
            class="text-lg sm:text-2xl font-bold text-white leading-tight tracking-wider school-title"
          >
            ERLACH
          </div>
          <div class="text-xs sm:text-sm text-white/80 leading-tight font-medium">
            Cantina Digital
          </div>
        </div>

        <!-- Botão de Toggle Dark/Light Mode -->
        <button
          @click="toggleDarkMode"
          class="modern-toggle-button p-2 sm:p-3 rounded-xl transition-all duration-300"
          :title="isDarkMode ? 'Modo Claro' : 'Modo Escuro'"
        >
          <!-- Ícone Sol (Modo Claro) -->
          <svg
            v-if="isDarkMode"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <!-- Ícone Lua (Modo Escuro) -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
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

      <!-- Todo List -->
      <TodoListView v-if="!store.currentStudent && store.activeTab === 'tarefas'" />
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
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import StudentsList from '@/components/StudentsList.vue'
import StudentDetails from '@/components/StudentDetails.vue'
import EarningsView from '@/components/EarningsView.vue'
import TodoListView from '@/components/TodoListView.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

const store = useAppStore()

// const currentTitle = computed(() => {
//   if (store.currentStudent) {
//     return store.currentStudent.name
//   }
//   return store.activeTab === 'students' ? 'Cantina Digital' : 'Ganhos'
// })

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
