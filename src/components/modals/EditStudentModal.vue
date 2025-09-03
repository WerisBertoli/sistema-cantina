<template>
  <div class="modal-overlay" @click="store.closeModal()">
    <div class="modal-content dark:bg-gray-800" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold dark:text-white">Editar Aluno</h2>
        <button
          @click="store.closeModal()"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Nome do Aluno</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Digite o nome completo"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Nome do Responsável</label
            >
            <input
              v-model="form.parentName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Digite o nome do responsável"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >WhatsApp do Responsável</label
            >
            <input
              v-model="form.parentPhone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <!-- Separador visual -->
        <div class="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <!-- Botão de deletar -->
            <button
              type="button"
              @click="showDeleteConfirmation = true"
              :disabled="isSubmitting || isDeleting"
              class="flex items-center justify-center px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
              {{ isDeleting ? 'Deletando...' : 'Deletar Aluno' }}
            </button>

            <!-- Botões de ação principais -->
            <div class="flex space-x-3">
              <button
                type="button"
                @click="store.closeModal()"
                class="px-6 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || isDeleting"
                class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
              >
                {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de confirmação de exclusão -->
  <div
    v-if="showDeleteConfirmation"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
    @click="showDeleteConfirmation = false"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Confirmar Exclusão</h3>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Tem certeza que deseja deletar o aluno <strong>{{ store.currentStudent?.name }}</strong
          >?
        </p>
        <p class="text-sm text-red-600 dark:text-red-400 mt-2">
          Esta ação não pode ser desfeita. Todos os dados do aluno serão permanentemente removidos.
        </p>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="showDeleteConfirmation = false"
          :disabled="isDeleting"
          class="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="handleDelete"
          :disabled="isDeleting"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {{ isDeleting ? 'Deletando...' : 'Deletar Aluno' }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Student } from '@/types'

const store = useAppStore()

const form = ref({
  name: '',
  parentName: '',
  parentPhone: '',
})

const isSubmitting = ref(false)
const isDeleting = ref(false)
const showDeleteConfirmation = ref(false)

// Watch for modal data changes to populate form
watch(
  () => store.modal.data,
  (student: Student) => {
    if (student && store.modal.type === 'editStudent') {
      form.value = {
        name: student.name || '',
        parentName: student.parentName || '',
        parentPhone: student.parentPhone || '',
      }
    }
  },
  { immediate: true },
)

const handleSubmit = async () => {
  if (isSubmitting.value) return

  const student = store.modal.data as Student
  if (!student?.id) return

  isSubmitting.value = true
  try {
    await store.updateStudent(student.id, {
      name: form.value.name,
      parentName: form.value.parentName,
      parentPhone: form.value.parentPhone,
    })

    store.closeModal()
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error)
    alert('Erro ao atualizar aluno. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!store.currentStudent?.id) return

  isDeleting.value = true
  try {
    await store.deleteStudent(store.currentStudent.id)
    showDeleteConfirmation.value = false
  } catch (error) {
    console.error('Erro ao deletar aluno:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>
