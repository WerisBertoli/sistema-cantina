<template>
  <div class="modern-student-profile">
    <!-- Saldo com design moderno -->
    <div class="balance-section">
      <div class="balance-container">
        <div class="student-name">{{ store.currentStudent?.name || 'Aluno' }}</div>
        <div class="balance-label">Saldo Disponível</div>
        <div class="balance-value">
          <span class="currency-symbol">R$</span>
          <span class="balance-amount">{{
            (store.currentStudent?.balance || 0).toFixed(2).replace('.', ',')
          }}</span>
        </div>
        <div class="balance-indicator" :class="getBalanceStatusClass()">
          <span class="indicator-dot"></span>
          <span class="indicator-text">{{ getBalanceStatus() }}</span>
        </div>
      </div>
    </div>

    <!-- Grid de ações -->
    <div class="actions-grid">
      <button
        class="action-card credit-action"
        @click="store.openModal('addCredit', { student: store.currentStudent })"
      >
        <div class="action-icon credit-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <span class="action-label dark:text-white">Adicionar Crédito</span>
      </button>

      <button
        class="action-card consumption-action"
        @click="store.openModal('consumption', store.currentStudent)"
      >
        <div class="action-icon consumption-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <span class="action-label dark:text-white">Registrar Consumo</span>
      </button>

      <button class="action-card history-action" @click="openWeeklyReport">
        <div class="action-icon history-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 3v5h5M3.05 13a9 9 0 1 0 1.5-5.2L3 8" />
          </svg>
        </div>
        <span class="action-label dark:text-white">Ver Histórico</span>
      </button>

      <button class="action-card edit-action" @click="openEditStudent">
        <div class="action-icon edit-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <span class="action-label dark:text-white">Editar Aluno</span>
      </button>

      <button class="action-card alert-action" @click="openLowBalanceAlert">
        <div class="action-icon alert-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <span class="action-label dark:text-white">Configurar Alerta</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const store = useAppStore()

// Métodos de status do saldo
const getBalanceStatusClass = (): string => {
  const balance = store.currentStudent?.balance || 0
  if (balance >= 15) return 'status-good'
  if (balance >= 12) return 'status-warning'
  return 'status-danger'
}

const getBalanceStatus = (): string => {
  const balance = store.currentStudent?.balance || 0
  if (balance >= 15) return 'Adequado'
  if (balance >= 12) return 'Baixo'
  return 'Crítico'
}

const openWeeklyReport = () => {
  store.openModal('weeklyHistory')
}

const openEditStudent = () => {
  store.openModal('editStudent', store.currentStudent)
}

const openLowBalanceAlert = () => {
  store.openModal('message', { type: 'lowBalance' })
}
</script>

<style scoped>
.modern-student-profile {
  min-height: 100vh;
  @apply bg-white dark:bg-gray-900;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;
  @apply shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.1)];
  animation: slideUp 0.6s ease-out;
  gap: 1.5rem;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.balance-section {
  margin: 0;
  padding: 0;
  width: 100%;
}

.balance-container {
  @apply bg-gray-600 dark:bg-gray-700;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  text-align: center;
  @apply shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)];
  backdrop-filter: blur(10px);
  @apply border border-gray-500/50 dark:border-gray-600/50;
  position: relative;
  overflow: hidden;
  width: 100%;
  @apply text-white;
}

.student-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.balance-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.balance-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.currency-symbol {
  font-size: 1.5rem;
  font-weight: 600;
  opacity: 0.8;
}

.balance-amount {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.balance-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  @apply bg-gray-300 dark:bg-gray-500;
  backdrop-filter: blur(10px);
  font-weight: 600;
  font-size: 0.875rem;
  @apply text-gray-800 dark:text-white;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.5;
  }
}

.status-good {
  color: #10b981;
}

.status-warning {
  color: #f59e0b;
}

.status-danger {
  color: #ef4444;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  margin-top: 0;
}

.action-card {
  @apply bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.action-card:hover::before {
  left: 100%;
}

.action-card:hover {
  transform: translateY(-4px);
  @apply shadow-[0_12px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_24px_rgba(255,255,255,0.1)];
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.credit-icon {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.consumption-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.history-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.edit-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.alert-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.action-card:hover .action-icon {
  transform: scale(1.1) rotate(5deg);
}

.action-label {
  font-weight: 600;
  @apply text-gray-700 dark:text-gray-200;
  font-size: 0.875rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .student-card {
    margin: 1rem;
  }

  .balance-amount {
    font-size: 2.5rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
}
</style>
