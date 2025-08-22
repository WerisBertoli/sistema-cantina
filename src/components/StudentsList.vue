<template>
  <div
    class="bg-white dark:bg-gray-900 pb-6 sm:pb-8"
    style="overflow-x: hidden !important; max-width: 100vw; width: 100%"
  >


    <div
      v-if="filteredStudents.length === 0"
      class="text-center py-6 px-3 sm:py-8 sm:px-4 bg-white dark:bg-gray-900"
    >
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Nenhum aluno encontrado</p>
    </div>

    <!-- Layout para Mobile (Cards) -->
    <div class="block sm:hidden px-3 space-y-3">
      <div
        v-for="(student, index) in filteredStudents"
        :key="student.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
        @click="selectStudent(student)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1 min-w-0">
            <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {{ student.name.charAt(0).toUpperCase() }}
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <h3 class="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {{ student.name }}
              </h3>
              <p
                v-if="student.parentName"
                class="text-xs text-gray-500 dark:text-gray-400 truncate"
              >
                {{ student.parentName }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3 flex-shrink-0">
            <div class="flex items-center space-x-2">
              <div
                :class="[
                  'w-2.5 h-2.5 rounded-full flex-shrink-0',
                  student.balance >= 15
                    ? 'bg-green-500'
                    : student.balance >= 12
                      ? 'bg-yellow-500'
                      : 'bg-red-500',
                ]"
              ></div>
              <span :class="getBalanceClass(student.balance)" class="font-semibold text-sm">
                {{ store.formatCurrency(student.balance) }}
              </span>
            </div>

            <button
              @click.stop="store.openModal('consumption', student)"
              class="px-2 py-1 text-xs font-medium text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex-shrink-0"
            >
              Consumo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout para Desktop (Tabela) -->
    <div class="hidden sm:block relative overflow-x-auto shadow-md sm:rounded-lg">
      <div class="flex items-center justify-end flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            v-model="searchTerm"
            type="text"
            id="table-search-users"
            class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar alunos"
          />
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-4 py-3">Nome</th>
            <th scope="col" class="px-3 py-3">Saldo</th>
            <th scope="col" class="px-2 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, index) in filteredStudents"
            :key="student.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            @click="selectStudent(student)"
          >
            <th scope="row" class="flex items-center px-4 py-4 text-gray-900 whitespace-nowrap dark:text-white">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                {{ student.name.charAt(0).toUpperCase() }}
              </div>
              <div class="ps-2">
                <div class="text-sm font-semibold">{{ student.name }}</div>
                <div class="font-normal text-gray-500 text-xs" v-if="student.parentName">{{ student.parentName }}</div>
              </div>
            </th>
            <td class="px-3 py-4">
              <div class="flex items-center">
                <div
                  :class="[
                    'h-2.5 w-2.5 rounded-full me-2',
                    student.balance >= 15
                      ? 'bg-green-500'
                      : student.balance >= 12
                        ? 'bg-yellow-500'
                        : 'bg-red-500',
                  ]"
                ></div>
                <span :class="getBalanceClass(student.balance)" class="font-semibold">
                  {{ store.formatCurrency(student.balance) }}
                </span>
              </div>
            </td>
            <td class="px-2 py-4">
               <button
                 @click.stop="store.openModal('consumption', student)"
                 class="px-2 py-1 text-xs font-medium text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
               >
                 Consumo
               </button>
             </td>
          </tr>
        </tbody>
      </table>
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
  return store.students.filter((student) => {
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
  transition: 0.3s;
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
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.06);
  min-width: 80px;
}

.compact-action-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow:
    0 6px 10px -2px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.05);
}

.compact-action-button:active {
  transform: translateY(0);
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.06);
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
  0%,
  100% {
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
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

.modern-search-input:focus {
  outline: none;
  border-color: #000000;
  border-width: 3px;
  box-shadow:
    0 0 0 4px rgba(0, 0, 0, 0.1),
    0 8px 25px -5px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
}

.modern-search-input:hover {
  transform: translateY(-1px);
  box-shadow:
    0 6px 20px -3px rgba(59, 130, 246, 0.15),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
  box-shadow:
    0 0 0 4px rgba(0, 0, 0, 0.2),
    0 8px 25px -5px rgba(0, 0, 0, 0.4);
}

.dark .modern-search-input:hover {
  box-shadow:
    0 6px 20px -3px rgba(147, 51, 234, 0.15),
    0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

.dark .modern-search-input::placeholder {
  color: #d1d5db;
}
</style>
