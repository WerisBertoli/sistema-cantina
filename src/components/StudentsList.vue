<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 bg-white dark:bg-gray-800">
      <h2 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Lista de Alunos</h2>
      
      <div class="mb-4 sm:mb-6 flex justify-center">
        <input
          v-model="searchTerm"
          type="text"
          class="input w-full max-w-md text-sm sm:text-base"
          placeholder="Buscar aluno..."
        />
      </div>
    </div>

    <div v-if="filteredStudents.length === 0" class="text-center py-6 px-3 sm:py-8 sm:px-4 bg-white dark:bg-gray-900">
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Nenhum aluno encontrado</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full bg-white dark:bg-gray-800">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-700">
            <th class="px-3 py-2 text-left text-xs sm:px-6 sm:text-sm dark:text-white">Nome</th>
            <th class="px-3 py-2 text-left text-xs sm:px-6 sm:text-sm dark:text-white">Saldo</th>
            <th class="px-3 py-2 text-center text-xs sm:px-6 sm:text-sm dark:text-white">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="student in filteredStudents" 
            :key="student.id"
            class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="selectStudent(student)"
          >
            <td class="px-3 py-2 sm:px-6">
              <div class="font-medium text-sm sm:text-base truncate dark:text-white">{{ student.name }}</div>
            </td>
            <td class="px-3 py-2 sm:px-6">
              <span :class="getBalanceClass(student.balance)" class="text-sm sm:text-base">
                {{ store.formatCurrency(student.balance) }}
              </span>
            </td>
            <td class="px-3 py-2 sm:px-6">
              <div class="flex justify-center">
                <button 
                  @click.stop="store.openModal('consumption', student)"
                  class="cssbuttons-io-button text-xs sm:text-sm"
                >
                  Consumo
                </button>
              </div>
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
  if (balance > 10) return 'text-green-600 dark:text-green-400'
  if (balance > 0) return 'text-yellow-600 dark:text-yellow-400'
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
  @apply bg-gradient-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400;
}

.cssbuttons-io-button:active {
  transform: translate(0em, 0.2em);
}
</style>