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

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="store.closeModal()"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
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
</script>
