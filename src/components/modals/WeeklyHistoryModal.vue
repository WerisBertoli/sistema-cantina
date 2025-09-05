<template>
  <div class="modal-overlay" @click="store.closeModal()">
    <div class="modal-content-large max-h-[90vh] overflow-y-auto" @click.stop>
      <div
        class="flex justify-between items-center mb-3 sm:mb-4 bg-white dark:bg-gray-800 pb-2 sm:pb-3 border-b dark:border-gray-600"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Histórico Semanal
          </h2>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="store.closeModal()"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Informações do Aluno -->
      <div
        class="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-100 dark:border-blue-800"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        >
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-300 mb-1">Aluno:</p>
            <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">
              {{ store.currentStudent?.name }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">Responsável:</p>
            <p class="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-200 truncate">
              {{ store.currentStudent?.parentName || 'responsável' }}
            </p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-xs text-gray-600 dark:text-gray-300 mb-1">Saldo atual:</p>
            <p
              class="font-bold text-base sm:text-lg"
              :class="getBalanceClass(store.currentStudent?.balance || 0)"
            >
              {{ store.formatCurrency(store.currentStudent?.balance || 0) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Seletor de Semana -->
      <div
        class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</label>
          </div>
          <select
            v-model="selectedWeekOffset"
            @change="updateSelectedWeek"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="week in availableWeeks" :key="week.offset" :value="week.offset">
              {{ week.label }}
            </option>
          </select>
        </div>
        <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {{ selectedWeekDescription }}
        </div>
      </div>

      <!-- Resumo da Semana -->
      <div class="mb-3 sm:mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <div
          class="bg-green-50 dark:bg-green-900 p-3 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div class="flex items-center">
            <div class="p-1.5 bg-green-100 dark:bg-green-800 rounded-lg mr-2">
              <svg
                class="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-300">Total de Recargas</p>
              <p class="font-bold text-base text-green-600">
                {{ store.formatCurrency(totalCredits) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-red-50 dark:bg-red-900 p-3 rounded-lg border border-red-200 dark:border-red-800"
        >
          <div class="flex items-center">
            <div class="p-1.5 bg-red-100 dark:bg-red-800 rounded-lg mr-2">
              <svg
                class="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-300">Total de Consumos</p>
              <p class="font-bold text-base text-red-600">
                {{ store.formatCurrency(Math.abs(totalConsumptions)) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-center">
            <div class="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg mr-2">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-300">Transações</p>
              <p class="font-bold text-base text-blue-600">{{ weeklyTransactions.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Transações -->
      <div class="mb-4">
        <div class="flex items-center mb-3">
          <svg
            class="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">
            Movimentações - {{ selectedWeekDescription }}
          </h3>
        </div>

        <div
          v-if="weeklyTransactions.length === 0"
          class="text-center py-6 text-gray-500 dark:text-gray-400"
        >
          <svg
            class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p class="text-base font-medium dark:text-gray-300">Nenhuma movimentação</p>
          <p class="text-xs dark:text-gray-400">Não há transações nos últimos 7 dias</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="transaction in weeklyTransactions"
            :key="transaction.id"
            class="p-3 rounded-lg border transition-all hover:shadow-md"
            :class="getTransactionClass(transaction.type)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="p-1.5 rounded-lg mr-2"
                  :class="getTransactionIconClass(transaction.type)"
                >
                  <svg
                    class="w-4 h-4"
                    :class="getTransactionIconColor(transaction.type)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="transaction.type === 'credit'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-sm" :class="getTransactionTextColor(transaction.type)">
                    {{ transaction.type === 'credit' ? 'Recarga' : 'Consumo' }}
                  </p>
                  <p class="text-xs text-gray-600">{{ formatTransactionDate(transaction.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-base" :class="getTransactionValueColor(transaction.type)">
                  {{ transaction.type === 'credit' ? '+' : '-'
                  }}{{ store.formatCurrency(Math.abs(transaction.value)) }}
                </p>
                <!-- Botão de editar para recargas -->
                <button
                  v-if="transaction.type === 'credit'"
                  @click="openEditModal(transaction)"
                  class="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Editar recarga
                </button>
              </div>
            </div>

            <!-- Itens do consumo -->
            <div v-if="transaction.type === 'consumption' && transaction.items" class="mt-2 pl-8">
              <div class="flex items-center justify-between mb-1">
                <p class="text-xs text-gray-600">Itens consumidos:</p>
                <button
                  @click="openEditConsumptionModal(transaction)"
                  class="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Editar consumo
                </button>
              </div>
              <div class="space-y-0.5">
                <div
                  v-for="item in transaction.items"
                  :key="item.productId"
                  class="flex justify-between text-xs"
                >
                  <span class="text-gray-700">{{ item.quantity }}x {{ item.productName }}</span>
                  <span class="text-gray-600">{{
                    store.formatCurrency(item.quantity * item.price)
                  }}</span>
                </div>
              </div>

              <!-- Saldo após a transação -->
              <div class="mt-2 pt-2 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Saldo após transação:</span>
                  <span
                    class="text-xs font-medium"
                    :class="getBalanceClass(getBalanceAfterTransaction(transaction))"
                  >
                    {{ store.formatCurrency(getBalanceAfterTransaction(transaction)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
        <button
          @click="generateAndCopyReport"
          class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
          {{ copyButtonText }}
        </button>

        <button
          @click="sendToWhatsApp"
          class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.703"
            />
          </svg>
          Enviar WhatsApp
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Edição de Recarga -->
  <div v-if="isEditModalOpen" class="modal-overlay" @click="closeEditModal">
    <div class="modal-content bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Editar Recarga</h3>
        <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
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

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2"> Valor da Recarga </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
          <input
            v-model.number="editAmount"
            type="number"
            step="0.01"
            min="0.01"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0,00"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="closeEditModal"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
        >
          Cancelar
        </button>
        <button
          @click="saveEdit"
          :disabled="isSubmitting || editAmount <= 0"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Edição de Consumo -->
  <div
    v-if="isEditConsumptionModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    style="z-index: 1200"
    @click.self="closeEditConsumptionModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Editar Consumo</h3>
          <button
            @click="closeEditConsumptionModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div v-if="editingConsumption" class="space-y-4">
          <div class="text-sm text-gray-600 mb-4">
            <p>
              <strong>Data:</strong>
              {{ new Date(editingConsumption.date.toDate()).toLocaleDateString('pt-BR') }}
            </p>
            <p>
              <strong>Horário:</strong>
              {{
                new Date(editingConsumption.date.toDate()).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </p>
          </div>

          <div class="space-y-3">
            <h4 class="font-medium text-gray-900">Itens do Consumo:</h4>

            <!-- Barra de Pesquisa para Adicionar Produtos -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Produto
              </label>
              <div class="flex gap-2">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Digite o nome do produto..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="filterProducts"
                />
              </div>

              <!-- Lista de Produtos Filtrados -->
              <div
                v-if="searchQuery && filteredProducts.length > 0"
                class="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md bg-white"
              >
                <div
                  v-for="product in filteredProducts"
                  :key="product.id"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                  @click="addProductToConsumption(product)"
                >
                  <span class="text-sm">{{ product.name }}</span>
                  <span class="text-sm text-gray-500">{{ formatCurrency(product.price) }}</span>
                </div>
              </div>

              <div
                v-if="searchQuery && filteredProducts.length === 0"
                class="mt-2 text-sm text-gray-500"
              >
                Nenhum produto encontrado
              </div>
            </div>
            <div
              v-for="(item, index) in editedItems"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ item.productName }}</p>
                <p class="text-sm text-gray-600">{{ formatCurrency(item.price) }} cada</p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="updateItemQuantity(index, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                  class="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                <button
                  @click="updateItemQuantity(index, item.quantity + 1)"
                  class="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
                <button
                  @click="removeItemFromConsumption(index)"
                  class="ml-2 w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>{{
                formatCurrency(
                  editedItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
                )
              }}</span>
            </div>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              @click="closeEditConsumptionModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="saveConsumptionEdit"
              :disabled="isSubmittingConsumption || editedItems.length === 0"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmittingConsumption ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { BalanceStatus } from '@/types'
import type { Transaction, TransactionItem, Product } from '@/types'
import type { Timestamp } from 'firebase/firestore'

const store = useAppStore()
const { formatCurrency } = store
const copyButtonText = ref('Copiar Relatório')
const isEditModalOpen = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const editAmount = ref(0)
const isSubmitting = ref(false)

// Variáveis para edição de consumo
const isEditConsumptionModalOpen = ref(false)
const editingConsumption = ref<Transaction | null>(null)
const editedItems = ref<TransactionItem[]>([])
const isSubmittingConsumption = ref(false)

// Variáveis para pesquisa de produtos
const searchQuery = ref('')
const filteredProducts = ref<Product[]>([])

// Funções para pesquisa de produtos
const filterProducts = () => {
  if (!searchQuery.value.trim()) {
    filteredProducts.value = []
    return
  }

  filteredProducts.value = store.products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
}

const addProductToConsumption = (product: Product) => {
  const existingItemIndex = editedItems.value.findIndex((item) => item.productId === product.id)

  if (existingItemIndex >= 0) {
    editedItems.value[existingItemIndex].quantity += 1
  } else {
    editedItems.value.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    })
  }

  searchQuery.value = ''
  filteredProducts.value = []
}

// Variáveis para seleção de semana
const selectedWeekOffset = ref(0)

// Gerar semanas disponíveis (semana atual + últimas 7 semanas)
const availableWeeks = computed(() => {
  const weeks = []
  for (let i = 0; i < 8; i++) {
    const now = new Date()

    // Calcular o início da semana (domingo)
    const startDate = new Date(now)
    const dayOfWeek = now.getDay() // 0 = domingo, 1 = segunda, etc.
    startDate.setDate(now.getDate() - dayOfWeek - i * 7)
    startDate.setHours(0, 0, 0, 0)

    // Calcular o fim da semana (sábado)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    endDate.setHours(23, 59, 59, 999)

    let label
    if (i === 0) {
      label = 'Esta semana'
    } else if (i === 1) {
      label = 'Última semana'
    } else {
      label = `Há ${i} semanas`
    }

    weeks.push({
      offset: i,
      label,
      startDate,
      endDate,
    })
  }
  return weeks
})

// Descrição da semana selecionada
const selectedWeekDescription = computed(() => {
  const week = availableWeeks.value.find((w) => w.offset === selectedWeekOffset.value)
  if (!week) return ''

  const start = week.startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const end = week.endDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  return `${start} a ${end}`
})

// Função para atualizar semana selecionada
const updateSelectedWeek = () => {
  // A reatividade já cuida da atualização das transações
}

// Filtrar transações da semana selecionada
const weeklyTransactions = computed(() => {
  if (!store.currentStudent) return []

  const selectedWeek = availableWeeks.value.find((w) => w.offset === selectedWeekOffset.value)
  if (!selectedWeek) return []

  const startDate = selectedWeek.startDate
  const endDate = new Date(selectedWeek.endDate)
  endDate.setHours(23, 59, 59, 999) // Incluir todo o último dia

  const filtered = store.transactions
    .filter((t) => {
      const transactionDate = t.date.toDate()
      const isStudentMatch = t.studentId === store.currentStudent!.id
      const isDateMatch = transactionDate >= startDate && transactionDate <= endDate

      return isStudentMatch && isDateMatch
    })
    .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime())

  return filtered
})

// Calcular totais
const totalCredits = computed(() => {
  return weeklyTransactions.value
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.value, 0)
})

const totalConsumptions = computed(() => {
  return weeklyTransactions.value
    .filter((t) => t.type === 'consumption')
    .reduce((sum, t) => sum + t.value, 0)
})

// Função para calcular o saldo após uma transação específica
const getBalanceAfterTransaction = (targetTransaction: Transaction): number => {
  if (!store.currentStudent) return 0

  // Obter todas as transações do aluno ordenadas por data (mais antigas primeiro)
  const allTransactions = store.transactions
    .filter((t) => t.studentId === store.currentStudent!.id)
    .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime())

  // Encontrar o índice da transação alvo
  const targetIndex = allTransactions.findIndex((t) => t.id === targetTransaction.id)
  if (targetIndex === -1) return store.currentStudent.balance

  // Calcular o saldo inicial (saldo atual menos todas as transações após a transação alvo)
  let balance = store.currentStudent.balance

  // Subtrair todas as transações que aconteceram após a transação alvo
  for (let i = targetIndex + 1; i < allTransactions.length; i++) {
    const transaction = allTransactions[i]
    balance -= transaction.value
  }

  return balance
}

// Funções de estilo
const getBalanceClass = (balance: number) => {
  const status = store.getBalanceStatus(balance)
  return {
    'text-green-600': status === BalanceStatus.NORMAL,
    'text-yellow-600': status === BalanceStatus.LOW,
    'text-red-600': status === BalanceStatus.CRITICAL,
  }
}

const getTransactionClass = (type: string) => {
  return type === 'credit' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
}

const getTransactionIconClass = (type: string) => {
  return type === 'credit' ? 'bg-green-100' : 'bg-red-100'
}

const getTransactionIconColor = (type: string) => {
  return type === 'credit' ? 'text-green-600' : 'text-red-600'
}

const getTransactionTextColor = (type: string) => {
  return type === 'credit' ? 'text-green-700' : 'text-red-700'
}

const getTransactionValueColor = (type: string) => {
  return type === 'credit' ? 'text-green-600' : 'text-red-600'
}

const formatTransactionDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate()
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Gerar relatório em texto
const generateTextReport = async (): Promise<string> => {
  if (!store.currentStudent) return ''
  return await store.generateWeeklyReport(store.currentStudent)
}

// Copiar relatório
const generateAndCopyReport = async () => {
  try {
    const report = await generateTextReport()
    await navigator.clipboard.writeText(report)
    copyButtonText.value = 'Copiado!'
    setTimeout(() => {
      copyButtonText.value = 'Copiar Relatório'
    }, 2000)
  } catch (error) {
    console.error('Erro ao copiar relatório:', error)
    copyButtonText.value = 'Erro ao copiar'
    setTimeout(() => {
      copyButtonText.value = 'Copiar Relatório'
    }, 2000)
  }
}

// Enviar para WhatsApp
const sendToWhatsApp = async () => {
  if (!store.currentStudent) return

  const report = await generateTextReport()
  const phone = store.currentStudent.parentPhone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(report)
  const whatsappUrl = `https://wa.me/55${phone}?text=${encodedMessage}`

  window.open(whatsappUrl, '_blank')
}

// Funções de edição
const openEditModal = (transaction: Transaction) => {
  editingTransaction.value = transaction
  editAmount.value = transaction.value
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingTransaction.value = null
  editAmount.value = 0
  isSubmitting.value = false
}

// Funções de edição de consumo
const openEditConsumptionModal = (transaction: Transaction) => {
  editingConsumption.value = transaction
  editedItems.value = transaction.items ? [...transaction.items] : []
  isEditConsumptionModalOpen.value = true
}

const closeEditConsumptionModal = () => {
  isEditConsumptionModalOpen.value = false
  editingConsumption.value = null
  editedItems.value = []
  isSubmittingConsumption.value = false
}

const removeItemFromConsumption = (index: number) => {
  editedItems.value.splice(index, 1)
}

const updateItemQuantity = (index: number, newQuantity: number) => {
  if (newQuantity > 0) {
    editedItems.value[index].quantity = newQuantity
  }
}

const saveConsumptionEdit = async () => {
  if (!editingConsumption.value || !store.currentStudent || isSubmittingConsumption.value) return

  if (editedItems.value.length === 0) {
    alert('Deve haver pelo menos um item no consumo!')
    return
  }

  isSubmittingConsumption.value = true
  try {
    await store.editConsumptionTransaction(
      editingConsumption.value.id!,
      editedItems.value,
      store.currentStudent.id!,
    )
    closeEditConsumptionModal()
  } catch (error) {
    console.error('Erro ao editar consumo:', error)
    alert('Erro ao editar consumo. Tente novamente.')
  } finally {
    isSubmittingConsumption.value = false
  }
}

const saveEdit = async () => {
  if (!editingTransaction.value || !store.currentStudent || isSubmitting.value) return

  if (editAmount.value <= 0) {
    alert('O valor deve ser maior que zero!')
    return
  }

  isSubmitting.value = true
  try {
    await store.editCreditTransaction(
      editingTransaction.value.id!,
      editingTransaction.value.value,
      editAmount.value,
      store.currentStudent.id!,
    )
    closeEditModal()
  } catch (error) {
    console.error('Erro ao editar transação:', error)
    alert('Erro ao editar transação. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
