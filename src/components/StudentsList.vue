<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 bg-white dark:bg-gray-800">
      <h2 class="modern-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-600 dark:text-blue-400 text-center">
        <span class="flex items-center justify-center space-x-2">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
           </svg>
          <span>Lista de Alunos</span>
        </span>
      </h2>
      
      <div class="mb-4 sm:mb-6 flex justify-center">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchTerm"
            type="text"
            class="modern-search-input w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base"
            placeholder="Buscar aluno..."
          />
        </div>
      </div>
    </div>

    <div v-if="filteredStudents.length === 0" class="text-center py-6 px-3 sm:py-8 sm:px-4 bg-white dark:bg-gray-900">
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Nenhum aluno encontrado</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead>
          <tr class="bg-blue-600 dark:bg-blue-700">
            <th class="px-2 py-3 text-left text-xs font-semibold text-white sm:px-4 sm:text-sm tracking-wide w-1/2">
              <div class="flex items-center space-x-1 sm:space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Nome</span>
              </div>
            </th>
            <th class="px-2 py-3 text-left text-xs font-semibold text-white sm:px-4 sm:text-sm tracking-wide w-1/4">
              <div class="flex items-center space-x-1 sm:space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                 </svg>
                <span class="hidden sm:inline">Saldo</span>
              </div>
            </th>
            <th class="px-2 py-3 text-right text-xs font-semibold text-white sm:px-4 sm:text-sm tracking-wide w-1/4">
               <div class="flex items-center justify-end space-x-1 sm:space-x-2">
                 <svg class="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                 </svg>
                 <span class="hidden sm:inline">Ações</span>
                 <span class="sm:hidden">•••</span>
               </div>
             </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(student, index) in filteredStudents" 
            :key="student.id"
            :class="[
               'border-t border-gray-200 dark:border-gray-600 cursor-pointer transition-colors duration-200',
               index % 2 === 0 
                 ? 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' 
                 : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
             ]"
            @click="selectStudent(student)"
          >
            <td class="px-2 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
              <div class="flex items-center">

                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate flex items-center">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    {{ student.name }}
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate mt-1 hidden sm:block" v-if="student.parentName">
                    {{ student.parentName }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-2 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
              <div class="flex items-center space-x-1 sm:space-x-2">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-2 h-2 sm:w-3 sm:h-3 rounded-full',
                    student.balance >= 15 ? 'bg-green-400' : student.balance >= 12 ? 'bg-yellow-400' : 'bg-red-400'
                  ]"></div>
                </div>
                <span :class="getBalanceClass(student.balance)" class="font-semibold text-xs sm:text-sm">
                  {{ store.formatCurrency(student.balance) }}
                </span>
              </div>
            </td>
            <td class="px-2 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
              <button 
                @click.stop="store.openModal('consumption', student)"
                class="compact-action-button"
              >
                <span class="hidden sm:inline">Consumo</span>
                <span class="sm:hidden">Ver</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Student } from '@/types'

const store = useAppStore()
const searchTerm = ref('')

const filteredStudents = computed(() => {
  if (!searchTerm.value) {
    return store.students
  }
  return store.students.filter(student => {
    const name = (student.name || '').toLowerCase()
    const parentName = (student.parentName || '').toLowerCase()
    const searchValue = searchTerm.value.toLowerCase()
    
    return name.includes(searchValue) || parentName.includes(searchValue)
  })
})

function selectStudent(student: Student) {
  store.setCurrentStudent(student)
}

function getBalanceClass(balance: number) {
  if (balance >= 15) return 'text-green-600 dark:text-green-400'
  if (balance >= 12) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}
</script>

<style scoped>
/* From Uiverse.io by anniekoop */
.input {
  width: 100%;
  padding: 0.5rem 0.875rem;
  font-size: 1rem;
  @apply border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
  border-radius: 0.5rem;
  @apply shadow-sm dark:shadow-md;
  outline: none;
  transition: ease 0.25s;
  text-align: center;
}

.input:focus {
  @apply ring-2 ring-blue-500 border-blue-500;
}

/* From Uiverse.io by adamgiebl */
.cssbuttons-io-button {
  font-size: 12px;
  padding: 0.4em 0.8em;
  border: transparent;
  @apply shadow-[2px_2px_4px_rgba(0,0,0,0.4)] dark:shadow-[2px_2px_4px_rgba(255,255,255,0.1)];
  @apply bg-blue-500 dark:bg-blue-600;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: .3s;
  min-width: 60px;
}

@media (min-width: 640px) {
  .cssbuttons-io-button {
    font-size: 14px;
    padding: 0.3em 1.2em;
    min-width: 80px;
  }
}

.cssbuttons-io-button:hover {
  @apply bg-blue-600 dark:bg-blue-700;
}

.cssbuttons-io-button:active {
  transform: translate(0em, 0.2em);
}

/* Botão compacto para ações */
.compact-action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background: #2563eb;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
  min-width: 80px;
}

.compact-action-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05);
}

.compact-action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
}

@media (min-width: 640px) {
  .compact-action-button {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    min-width: 90px;
  }
}

/* Animações para as linhas da tabela */
tbody tr {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efeito hover aprimorado para as linhas */
tbody tr:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animação para os avatares */
.avatar-gradient {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Estilos para o título moderno */
.modern-title {
  position: relative;
  animation: titleGlow 3s ease-in-out infinite alternate;
}

.modern-title::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-title:hover::before {
  opacity: 1;
}

@keyframes titleGlow {
  0% {
    filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.4));
  }
}

/* Estilos para o campo de busca moderno */
.modern-search-input {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #000000;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  background-clip: padding-box;
  position: relative;
}

.modern-search-input::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  padding: 2px;
  background: #3b82f6;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

.modern-search-input:focus {
  outline: none;
  border-color: #000000;
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1), 0 8px 25px -5px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
}

.modern-search-input:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px -3px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.modern-search-input::placeholder {
  color: #9ca3af;
  font-weight: 500;
}

/* Modo escuro para o campo de busca */
.dark .modern-search-input {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  color: #f9fafb;
}

.dark .modern-search-input:focus {
  background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
  border-color: #000000;
  border-width: 3px;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2), 0 8px 25px -5px rgba(0, 0, 0, 0.4);
}

.dark .modern-search-input:hover {
  box-shadow: 0 6px 20px -3px rgba(147, 51, 234, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

.dark .modern-search-input::placeholder {
  color: #d1d5db;
}
</style>
