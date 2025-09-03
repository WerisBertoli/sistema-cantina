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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 mr-2"
          >
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
            style="background: transparent; mix-blend-mode: multiply"
          />
        </div>

        <!-- Espaçador quando há estudante selecionado -->
        <div v-if="store.currentStudent" class="flex-1"></div>

        <!-- Botões de ação -->
        <div class="flex items-center gap-2">
          <!-- Toggle Dark Mode -->
          <button
            @click="toggleDarkMode"
            class="modern-toggle-button p-2 rounded-lg transition-colors"
            title="Alternar tema"
          >
            <!-- Ícone Sol (Modo Claro) -->
            <svg
              v-if="isDarkMode"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>

            <!-- Ícone Lua (Modo Escuro) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          </button>

          <!-- Botão Logout -->
          <button
            @click="handleLogout"
            class="modern-toggle-button p-2 rounded-lg transition-colors"
            title="Sair"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cantina Digital - Centralizado -->
      <div
        class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      >
        <h1 class="text-lg sm:text-xl font-bold tracking-wider text-white">Cantina Digital</h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto pb-20 sm:pb-24">
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

      <!-- Prepaid Orders -->
      <PrepaidOrdersView v-if="!store.currentStudent && store.activeTab === 'orders'" />
    </main>

    <!-- Bottom Navigation -->
    <BottomNavigation @navigate="store.setActiveTab" :activeTab="store.activeTab" />

    <!-- Confirm Dialog -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useAppStore } from '@/stores/app'
import StudentsList from '@/components/StudentsList.vue'
import StudentDetails from '@/components/StudentDetails.vue'
import EarningsView from '@/components/EarningsView.vue'
import ProductManagement from '../components/ProductManagement.vue'
import TodoListView from '@/components/TodoListView.vue'
import PrepaidOrdersView from '@/components/PrepaidOrdersView.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import ConfirmDialog from 'primevue/confirmdialog'

const store = useAppStore()
const router = useRouter()

// Logout function
const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

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
/* Header com gradiente moderno e animado */
.modern-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #2563eb 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 8px 40px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modern-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.modern-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
  pointer-events: none;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
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

/* Botões modernos com animações */
.modern-toggle-button,
.modern-back-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.modern-toggle-button::before,
.modern-back-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.modern-toggle-button:hover,
.modern-back-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.modern-toggle-button:hover::before,
.modern-back-button:hover::before {
  left: 100%;
}

.modern-toggle-button:active,
.modern-back-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* Animação para ícones dos botões */
.modern-toggle-button svg,
.modern-back-button svg {
  transition: transform 0.3s ease;
}

.modern-toggle-button:hover svg,
.modern-back-button:hover svg {
  transform: scale(1.1);
}

/* Título com animação suave */
.school-title {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  from {
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 10px rgba(255, 255, 255, 0.1);
  }
  to {
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 255, 255, 0.2);
  }
}

/* Logo da escola com animação */
.modern-header img {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.modern-header img:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Responsividade aprimorada */
@media (max-width: 640px) {
  .modern-header {
    padding: 0.75rem 0.75rem 1rem 0.75rem;
    box-shadow:
      0 2px 15px rgba(0, 0, 0, 0.1),
      0 4px 30px rgba(102, 126, 234, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .school-title {
    font-size: 1.125rem;
  }

  .modern-toggle-button,
  .modern-back-button {
    padding: 0.5rem;
  }

  .modern-toggle-button svg,
  .modern-back-button svg {
    width: 1rem;
    height: 1rem;
  }
}

@media (min-width: 641px) {
  .modern-header {
    box-shadow:
      0 6px 25px rgba(0, 0, 0, 0.15),
      0 10px 50px rgba(102, 126, 234, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

/* Modo escuro - ajustes modernos */
.dark .modern-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1d4ed8 100%);
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 8px 40px rgba(30, 58, 138, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-bottom-color: rgba(255, 255, 255, 0.05);
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
  border-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 640px) {
  .dark .modern-header {
    box-shadow:
      0 2px 15px rgba(0, 0, 0, 0.2),
      0 4px 30px rgba(30, 58, 138, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}
</style>
