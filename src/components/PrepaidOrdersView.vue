<template>
  <div class="prepaid-orders-container">
    <div class="header">
      <h2 class="title">Pedidos Pré-pagos</h2>
      <div class="header-actions">
        <button @click="openAddOrderModal" class="add-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Pedido
        </button>
      </div>
    </div>

    <div class="orders-list">
      <div v-if="orders.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <p class="text-gray-500">Nenhum pedido encontrado</p>
      </div>

      <div v-for="order in orders" :key="order.id" class="order-card" :class="{
        'status-pending': order.status === 'pending',
        'status-picked-up': order.status === 'picked_up'
      }" @click="openOrderDetails(order)">
        <div class="card-content">
          <div class="student-info">
            <h3 class="student-name">{{ order.studentName }}</h3>
          </div>
          
          <div class="product-info">
            <span class="product-summary">
              {{ order.items.length === 1 ? 
                `${order.items[0].quantity}x ${order.items[0].productName}` : 
                `${order.items.length} produtos` 
              }}
            </span>
          </div>
          
          <div class="status-and-actions">
            <span class="status-badge" :class="order.status">
              {{ order.status === 'pending' ? 'Pendente' : 'Retirado' }}
            </span>
            <div class="action-buttons">
              <button 
                v-if="order.status === 'pending'"
                @click.stop="markAsPickedUp(order.id!)" 
                class="pickup-button"
                title="Marcar como retirado"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
              <button 
                @click.stop="deleteOrder(order.id!)" 
                class="delete-button"
                title="Deletar pedido"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Pedido -->
    <div v-if="showOrderDetails" class="modal-overlay" @click="closeOrderDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalhes do Pedido</h3>
          <button @click="closeOrderDetails" class="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="selectedOrder" class="modal-body">
          <div class="detail-section">
            <h4>Informações do Aluno</h4>
            <p><strong>Nome:</strong> {{ selectedOrder.studentName }}</p>
            <p><strong>Data do Pedido:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
          </div>
          
          <div class="detail-section">
            <h4>Status</h4>
            <span class="status-badge" :class="selectedOrder.status">
              {{ selectedOrder.status === 'pending' ? 'Pendente' : 'Retirado' }}
            </span>
            <p v-if="selectedOrder.status === 'picked_up' && selectedOrder.pickedUpAt">
              <strong>Retirado em:</strong> {{ formatDate(selectedOrder.pickedUpAt) }}
            </p>
          </div>
          
          <div class="detail-section">
            <h4>Produtos</h4>
            <div class="order-items-detail">
              <div v-for="item in selectedOrder.items" :key="item.productId" class="item-detail">
                <span class="item-quantity">{{ item.quantity }}x</span>
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-price">{{ formatCurrency(item.price * item.quantity) }}</span>
              </div>
            </div>
            <div class="total-detail">
              <strong>Total: {{ formatCurrency(selectedOrder.totalValue) }}</strong>
            </div>
          </div>
          
          <div v-if="selectedOrder.notes" class="detail-section">
            <h4>Observações</h4>
            <p>{{ selectedOrder.notes }}</p>
          </div>
          
          <div class="modal-actions">
            <button 
              v-if="selectedOrder.status === 'pending'" 
              @click="markAsPickedUp(selectedOrder.id!)" 
              class="pickup-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Marcar como Retirado
            </button>
            <button 
              @click="deleteOrder(selectedOrder.id!)" 
              class="delete-button-modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Deletar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { PrepaidOrder } from '@/types'
import type { Timestamp } from 'firebase/firestore'

const store = useAppStore()

const prepaidOrders = computed(() => store.prepaidOrders)

const orders = computed(() => {
  // Ordenar por data de criação (mais recentes primeiro)
  return prepaidOrders.value.sort((a, b) => {
    const aTime = a.createdAt.seconds || 0
    const bTime = b.createdAt.seconds || 0
    return bTime - aTime
  })
})

const openAddOrderModal = () => {
  store.openModal('addPrepaidOrder')
}

const markAsPickedUp = async (orderId: string) => {
  try {
    await store.markOrderAsPickedUp(orderId)
    closeOrderDetails()
  } catch (error) {
    console.error('Erro ao marcar pedido como retirado:', error)
  }
}

const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate()
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (value: number) => {
  return store.formatCurrency(value)
}

const deleteOrder = async (orderId: string) => {
  if (confirm('Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.')) {
    try {
      await store.deletePrepaidOrder(orderId)
      closeOrderDetails()
    } catch (error) {
      console.error('❌ Erro ao deletar pedido:', error)
      alert('Erro ao deletar pedido. Verifique se você está autenticado.')
    }
  }
}

const selectedOrder = ref<PrepaidOrder | null>(null)
const showOrderDetails = ref(false)

const openOrderDetails = (order: PrepaidOrder) => {
  selectedOrder.value = order
  showOrderDetails.value = true
}

const closeOrderDetails = () => {
  selectedOrder.value = null
  showOrderDetails.value = false
}
</script>

<style scoped>
.prepaid-orders-container {
  @apply p-4 max-w-4xl mx-auto;
}

.header {
  @apply flex justify-between items-center mb-6;
}

.title {
  @apply text-2xl font-bold text-gray-800 dark:text-white;
}

.add-button {
  @apply flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors;
}

.filters {
  @apply flex gap-4 mb-6;
}

.filter-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.orders-list {
  @apply space-y-4;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.order-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 cursor-pointer hover:shadow-lg transition-shadow;
}

.order-card.status-pending {
  @apply border-l-orange-500;
}

.order-card.status-picked-up {
  @apply border-l-green-500;
}

.card-content {
  @apply flex items-center justify-between;
}

.student-info {
  @apply flex-1;
}

.student-name {
  @apply text-lg font-semibold text-gray-800 dark:text-white;
}

.product-info {
  @apply flex-1 text-center;
}

.product-summary {
  @apply text-sm text-gray-600 dark:text-gray-300;
}

.status-and-actions {
  @apply flex items-center gap-3;
}

.status-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.status-badge.pending {
  @apply bg-orange-100 text-orange-800;
}

.status-badge.picked_up {
  @apply bg-green-100 text-green-800;
}

.action-buttons {
  @apply flex items-center gap-2;
}

.pickup-button {
  @apply p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors;
}

.delete-button {
  @apply p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors;
}

/* Modal Styles */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700;
}

.modal-header h3 {
  @apply text-xl font-semibold text-gray-800 dark:text-white;
}

.close-button {
  @apply p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors;
}

.modal-body {
  @apply p-6 space-y-6;
}

.detail-section {
  @apply space-y-2;
}

.detail-section h4 {
  @apply text-lg font-medium text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2;
}

.detail-section p {
  @apply text-gray-600 dark:text-gray-300;
}

.order-items-detail {
  @apply space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg;
}

.item-detail {
  @apply flex justify-between items-center text-sm;
}

.item-quantity {
  @apply font-medium text-gray-600 dark:text-gray-300;
}

.item-name {
  @apply flex-1 mx-2 text-gray-800 dark:text-white;
}

.item-price {
  @apply font-medium text-gray-800 dark:text-white;
}

.total-detail {
  @apply text-lg text-gray-800 dark:text-white mt-4 pt-4 border-t border-gray-200 dark:border-gray-600;
}

.modal-actions {
  @apply flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.delete-button-modal {
  @apply flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors;
}
</style>