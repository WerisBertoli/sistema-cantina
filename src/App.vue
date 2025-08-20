<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { getAuthLoadingState } from '@/router'
import LoadingScreen from './components/LoadingScreen.vue'
import AppLayout from './components/AppLayout.vue'
import StudentModal from './components/modals/StudentModal.vue'
import EditStudentModal from './components/modals/EditStudentModal.vue'
import CreditModal from './components/modals/CreditModal.vue'
import ConsumptionModal from './components/modals/ConsumptionModal.vue'
import QuickConsumptionModal from './components/modals/QuickConsumptionModal.vue'
import MessageModal from './components/modals/MessageModal.vue'
import WeeklyHistoryModal from './components/modals/WeeklyHistoryModal.vue'

const store = useAppStore()
const isAuthLoading = ref(true)
const isAppInitialized = ref(false)

// Computed para verificar se ainda está carregando (auth ou app)
const isLoading = computed(() => store.isLoading || isAuthLoading.value || !isAppInitialized.value)

// Aguardar autenticação e inicialização da app
const initializeApp = async () => {
  // Aguardar autenticação
  while (getAuthLoadingState()) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  isAuthLoading.value = false
  
  // Inicializar store
  await store.initializeApp()
  isAppInitialized.value = true
}

onMounted(() => {
  initializeApp()
})
</script>

<template>
  <div class="app-container">
    <!-- Tela de carregamento -->
    <LoadingScreen v-if="isLoading" />

    <!-- Router View para navegação entre páginas -->
    <router-view v-else />

    <!-- Modais -->
    <StudentModal
      v-if="store.modal.isOpen && store.modal.type === 'addStudent'"
      @close="store.closeModal"
    />

    <EditStudentModal
      v-if="store.modal.isOpen && store.modal.type === 'editStudent'"
      @close="store.closeModal"
    />

    <CreditModal
      v-if="store.modal.isOpen && store.modal.type === 'addCredit'"
      :student="store.modal.data"
      @close="store.closeModal"
    />

    <ConsumptionModal
      v-if="store.modal.isOpen && store.modal.type === 'consumption'"
      :student="store.modal.data"
      @close="store.closeModal"
    />

    <QuickConsumptionModal
      v-if="store.modal.isOpen && store.modal.type === 'quickConsumption'"
      :student="store.modal.data"
      @close="store.closeModal"
    />

    <MessageModal
      v-if="store.modal.isOpen && store.modal.type === 'message'"
      :message="store.modal.data.message"
      :phone="store.modal.data.phone"
      @close="store.closeModal"
    />

    <WeeklyHistoryModal
      v-if="store.modal.isOpen && store.modal.type === 'weeklyHistory'"
      @close="store.closeModal"
    />
  </div>
</template>
