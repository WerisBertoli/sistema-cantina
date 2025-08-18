<template>
  <div class="menu">
    <a
      href="#"
      @click.prevent="$emit('navigate', 'students')"
      class="link"
      :class="{ active: activeTab === 'students' }"
    >
      <span class="link-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h.008v.008H15.75V12Zm0 3h.008v.008H15.75V15Zm0 3h.008v.008H15.75V18ZM6.75 6h10.5a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 17.25v-9A2.25 2.25 0 0 1 6.75 6Z" />
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
