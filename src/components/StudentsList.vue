<template>
  <div class="bg-white dark:bg-gray-900" style="overflow-x: hidden !important; max-width: 100vw; width: 100%;">
    <div class="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 bg-white dark:bg-gray-900">
      <h2 class="modern-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-600 dark:text-blue-400 text-center">
        Lista de Alunos
      </h2>
      
      <div class="mb-4 sm:mb-6 flex justify-center">
        <div class="search-container relative w-full max-w-md">
          <input
            v-model="searchTerm"
            type="text"
            class="search-input modern-search-input w-full px-4 py-2 sm:py-3 text-sm sm:text-base"
            placeholder="Buscar aluno..."
          />
          <button
            @click="store.openModal('addStudent')"
            class="add-student-button w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredStudents.length === 0" class="text-center py-6 px-3 sm:py-8 sm:px-4 bg-white dark:bg-gray-900">
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Nenhum aluno encontrado</p>
    </div>

    <!-- Layout para Mobile (Cards) -->
    <div class="block sm:hidden px-3 space-y-4">
      <div 
        v-for="(student, index) in filteredStudents" 
        :key="student.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
        @click="selectStudent(student)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <div class="mb-2">
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white truncate">{{ student.name }}</h3>
            </div>
            <p v-if="student.parentName" class="text-base text-gray-600 dark:text-gray-300 truncate">{{ student.parentName }}</p>
          </div>
          
          <div class="flex flex-col items-end space-y-3 flex-shrink-0">
            <div class="flex items-center space-x-2">
              <div :class="[
                'w-4 h-4 rounded-full flex-shrink-0',
                student.balance >= 15 ? 'bg-green-400' : student.balance >= 12 ? 'bg-yellow-400' : 'bg-red-400'
              ]"></div>
              <span :class="getBalanceClass(student.balance)" class="font-bold text-lg">
                {{ store.formatCurrency(student.balance) }}
              </span>
            </div>
            
            <button 
              @click.stop="store.openModal('consumption', student)"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 min-w-[80px]"
            >
              Consumo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout para Desktop (Tabela) -->
    <div class="hidden sm:block bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-hidden" style="overflow-x: hidden !important; max-width: 100%; width: 100%;">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-600 table-fixed" style="table-layout: fixed; width: 100%; max-width: 100%;">
        <thead>
          <tr class="bg-blue-600 dark:bg-blue-700">
            <th class="px-4 py-3 text-left text-sm font-semibold text-white tracking-wide w-1/2">
              Nome
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-white tracking-wide w-1/4">
              Saldo
            </th>
            <th class="px-4 py-3 text-right text-sm font-semibold text-white tracking-wide w-1/4">
              Ações
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
            <td class="px-4 py-4 w-1/2" style="max-width: 50%; overflow: hidden; word-wrap: break-word;">
              <div class="flex items-center">
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {{ student.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1" v-if="student.parentName">
                    {{ student.parentName }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 w-1/4" style="max-width: 25%; overflow: hidden;">
              <div class="flex items-center space-x-2">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    student.balance >= 15 ? 'bg-green-400' : student.balance >= 12 ? 'bg-yellow-400' : 'bg-red-400'
                  ]"></div>
                </div>
                <span :class="getBalanceClass(student.balance)" class="font-semibold text-sm truncate">
                  {{ store.formatCurrency(student.balance) }}
                </span>
              </div>
            </td>
            <td class="px-4 py-4 w-1/4 text-right text-sm font-medium" style="max-width: 25%; overflow: hidden;">
              <button 
                @click.stop="store.openModal('consumption', student)"
                class="compact-action-button"
              >
                Consumo
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

/* Container de busca com layout flexível */
.search-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-input {
  flex: 1;
}

.add-student-button {
  z-index: 10;
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
