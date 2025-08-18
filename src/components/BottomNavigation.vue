<template>
  <div class="menu">
    <a
      href="#"
      @click.prevent="$emit('navigate', 'students')"
      class="link"
      :class="{ active: activeTab === 'students' }"
    >
      <span class="link-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          class="sm:w-6 sm:h-6"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none"></rect>
          <path
            d="M213.3815,109.61945,133.376,36.88436a8,8,0,0,0-10.76339.00036l-79.9945,72.73477A8,8,0,0,0,40,115.53855V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V115.53887A8,8,0,0,0,213.3815,109.61945Z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          ></path>
        </svg>
      </span>
      <span class="link-title">Home</span>
    </a>

    <a
      href="#"
      @click.prevent="$emit('navigate', 'earnings')"
      class="link"
      :class="{ active: activeTab === 'earnings' }"
    >
      <span class="link-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          class="sm:w-6 sm:h-6"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none"></rect>
          <rect
            x="48"
            y="144"
            width="32"
            height="64"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          ></rect>
          <rect
            x="112"
            y="112"
            width="32"
            height="96"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          ></rect>
          <rect
            x="176"
            y="80"
            width="32"
            height="128"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          ></rect>
        </svg>
      </span>
      <span class="link-title">Ganhos</span>
    </a>

    <a
      href="#"
      @click.prevent="$emit('navigate', 'tarefas')"
      class="link"
      :class="{ active: activeTab === 'tarefas' }"
    >
      <span class="link-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          class="sm:w-6 sm:h-6"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <rect width="256" height="256" fill="none"></rect>
          <rect
            x="40"
            y="40"
            width="176"
            height="176"
            rx="8"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          ></rect>
          <polyline
            points="88 128 112 152 168 96"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="16"
          ></polyline>
        </svg>
      </span>
      <span class="link-title">Tarefas</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  activeTab: string
}

defineProps<Props>()
defineEmits<{
  navigate: [tab: string]
}>()

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
</script>

<style scoped>
.menu {
  @apply fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 4px;
  z-index: 1000;
}

@media (min-width: 640px) {
  .menu {
    padding: 12px 8px;
  }
}

.link {
  @apply flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 8px;
  min-width: 50px;
  position: relative;
}

@media (min-width: 640px) {
  .link {
    padding: 8px 12px;
    border-radius: 12px;
    min-width: 60px;
  }
}

.link:hover {
  @apply text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700;
  transform: translateY(-2px);
}

.link.active {
  @apply text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-700;
}

.link.active::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  @apply bg-blue-600 dark:bg-blue-400;
  border-radius: 50%;
}

.link-icon {
  @apply mb-1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.link-icon svg {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.link:hover .link-icon svg {
  transform: scale(1.1);
}

.link-title {
  @apply text-xs font-medium;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-size: 10px;
}

@media (min-width: 640px) {
  .link-title {
    font-size: 12px;
  }
}

.link.active .link-title {
  @apply font-semibold;
}

/* Animação de entrada */
.menu {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 640px) {
  .link {
    padding: 6px 8px;
    min-width: 50px;
  }

  .link-title {
    @apply text-xs;
  }
}
</style>
