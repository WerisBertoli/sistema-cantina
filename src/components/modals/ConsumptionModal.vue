<template>
  <div class="modal-overlay" @click="store.closeModal()">
    <div class="modal-content-large max-h-[90vh] overflow-y-auto" @click.stop>
      <div
        class="flex justify-between items-center mb-4 sm:mb-6 bg-white dark:bg-gray-800 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-600"
      >
        <h2 class="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-white">
          Registrar Consumo
        </h2>
        <button
          @click="store.closeModal()"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div
        class="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 rounded-xl border border-blue-100 dark:border-blue-800"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        >
          <div>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Aluno:</p>
            <p class="font-semibold text-base sm:text-lg text-gray-800 dark:text-white truncate">
              {{ currentStudent?.name }}
            </p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Saldo atual:</p>
            <p
              class="font-bold text-lg sm:text-xl"
              :class="getBalanceClass(currentStudent?.balance || 0)"
            >
              {{ store.formatCurrency(currentStudent?.balance || 0) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Grid de Produtos por Categoria -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Produtos Disponíveis ({{ store.products.length }})
          </h3>
        </div>

        <!-- Lanches -->
        <div v-if="productsByCategory.lanche.length > 0" class="mb-6">
          <div class="flex items-center mb-3">
            <div class="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">
              Lanches ({{ productsByCategory.lanche.length }})
            </h4>
          </div>
          <div class="product-grid">
            <div v-for="product in productsByCategory.lanche" :key="product.id" class="product-card border-l-4 border-orange-500">
              <div class="product-image">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="product-image-real"
                  @error="
                    (e) => {
                      console.log('Erro ao carregar imagem:', product.name, product.imageUrl)
                      const target = e.target as HTMLImageElement
                      if (target) {
                        target.style.display = 'none'
                        const sibling = target.nextElementSibling as HTMLElement
                        if (sibling) sibling.style.display = 'flex'
                      }
                    }
                  "
                  @load="
                    console.log('✅ Imagem carregada com sucesso:', product.name, product.imageUrl)
                  "
                />
                <div
                  class="image-placeholder"
                  :style="{ display: product.imageUrl ? 'none' : 'flex' }"
                >
                  <svg
                    class="w-8 h-8 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    ></path>
                  </svg>
                </div>

                <!-- Quantidade no carrinho -->
                <div v-if="getCartQuantity(product) > 0" class="quantity-badge bg-orange-500">
                  {{ getCartQuantity(product) }}
                </div>
              </div>

              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-price">{{ store.formatCurrency(product.price) }}</p>
              </div>

              <div class="product-actions">
                <button
                  @click="removeFromCart(product)"
                  :disabled="getCartQuantity(product) === 0"
                  class="button-3d remove-btn"
                  :class="{ disabled: getCartQuantity(product) === 0 }"
                >
                  <div class="button-top">
                    <span class="material-icons">−</span>
                  </div>
                </button>

                <span class="quantity-display">{{ getCartQuantity(product) }}</span>

                <button @click="addToCart(product)" class="button-3d add-btn">
                  <div class="button-top">
                    <span class="material-icons">+</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bebidas -->
        <div v-if="productsByCategory.bebida.length > 0" class="mb-6">
          <div class="flex items-center mb-3">
            <div class="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">
              Bebidas ({{ productsByCategory.bebida.length }})
            </h4>
          </div>
          <div class="product-grid">
            <div v-for="product in productsByCategory.bebida" :key="product.id" class="product-card border-l-4 border-blue-500">
              <div class="product-image">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="product-image-real"
                  @error="
                    (e) => {
                      console.log('Erro ao carregar imagem:', product.name, product.imageUrl)
                      const target = e.target as HTMLImageElement
                      if (target) {
                        target.style.display = 'none'
                        const sibling = target.nextElementSibling as HTMLElement
                        if (sibling) sibling.style.display = 'flex'
                      }
                    }
                  "
                  @load="
                    console.log('✅ Imagem carregada com sucesso:', product.name, product.imageUrl)
                  "
                />
                <div
                  class="image-placeholder"
                  :style="{ display: product.imageUrl ? 'none' : 'flex' }"
                >
                  <svg
                    class="w-8 h-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </div>

                <!-- Quantidade no carrinho -->
                <div v-if="getCartQuantity(product) > 0" class="quantity-badge bg-blue-500">
                  {{ getCartQuantity(product) }}
                </div>
              </div>

              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-price">{{ store.formatCurrency(product.price) }}</p>
              </div>

              <div class="product-actions">
                <button
                  @click="removeFromCart(product)"
                  :disabled="getCartQuantity(product) === 0"
                  class="button-3d remove-btn"
                  :class="{ disabled: getCartQuantity(product) === 0 }"
                >
                  <div class="button-top">
                    <span class="material-icons">−</span>
                  </div>
                </button>

                <span class="quantity-display">{{ getCartQuantity(product) }}</span>

                <button @click="addToCart(product)" class="button-3d add-btn">
                  <div class="button-top">
                    <span class="material-icons">+</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Doces -->
        <div v-if="productsByCategory.doce.length > 0" class="mb-6">
          <div class="flex items-center mb-3">
            <div class="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
            <h4 class="text-md font-medium text-gray-700 dark:text-gray-300">
              Doces ({{ productsByCategory.doce.length }})
            </h4>
          </div>
          <div class="product-grid">
            <div v-for="product in productsByCategory.doce" :key="product.id" class="product-card border-l-4 border-pink-500">
              <div class="product-image">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="product-image-real"
                  @error="
                    (e) => {
                      console.log('Erro ao carregar imagem:', product.name, product.imageUrl)
                      const target = e.target as HTMLImageElement
                      if (target) {
                        target.style.display = 'none'
                        const sibling = target.nextElementSibling as HTMLElement
                        if (sibling) sibling.style.display = 'flex'
                      }
                    }
                  "
                  @load="
                    console.log('✅ Imagem carregada com sucesso:', product.name, product.imageUrl)
                  "
                />
                <div
                  class="image-placeholder"
                  :style="{ display: product.imageUrl ? 'none' : 'flex' }"
                >
                  <svg
                    class="w-8 h-8 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>

                <!-- Quantidade no carrinho -->
                <div v-if="getCartQuantity(product) > 0" class="quantity-badge bg-pink-500">
                  {{ getCartQuantity(product) }}
                </div>
              </div>

              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-price">{{ store.formatCurrency(product.price) }}</p>
              </div>

              <div class="product-actions">
                <button
                  @click="removeFromCart(product)"
                  :disabled="getCartQuantity(product) === 0"
                  class="button-3d remove-btn"
                  :class="{ disabled: getCartQuantity(product) === 0 }"
                >
                  <div class="button-top">
                    <span class="material-icons">−</span>
                  </div>
                </button>

                <span class="quantity-display">{{ getCartQuantity(product) }}</span>

                <button @click="addToCart(product)" class="button-3d add-btn">
                  <div class="button-top">
                    <span class="material-icons">+</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- Resumo do Carrinho -->
      <div v-if="store.cartTotal > 0" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h4 class="font-medium mb-2 dark:text-white">Resumo do Pedido</h4>
        <div class="space-y-1 text-sm">
          <div v-for="item in store.cart" :key="item.product.id" class="flex justify-between">
            <span class="dark:text-gray-200">{{ item.quantity }}x {{ item.product.name }}</span>
            <span class="dark:text-gray-200">{{
              store.formatCurrency(item.quantity * item.product.price)
            }}</span>
          </div>
        </div>
        <div
          class="border-t border-blue-200 dark:border-blue-700 mt-2 pt-2 flex justify-between font-medium"
        >
          <span class="dark:text-white">Total:</span>
          <span class="dark:text-white">{{ store.formatCurrency(store.cartTotal) }}</span>
        </div>

        <div
          class="mt-2 p-2 rounded-xl border border-white/10 dark:border-white/20 shadow-[0_8px_32px_rgba(59,130,246,0.25)] dark:shadow-[0_8px_32px_rgba(59,130,246,0.3)]"
          :class="newBalance < 0 ? 'bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700' : 'bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600'"
        >
          <p class="text-sm text-white/90">Novo saldo:</p>
          <p class="font-medium text-white">{{ store.formatCurrency(newBalance) }}</p>
          <p v-if="newBalance < 0 && newBalance >= -12.00" class="text-xs text-white/80 mt-1">
            ⚠️ Saldo negativo - Os pais serão notificados
          </p>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <button
          type="button"
          @click="store.closeModal()"
          class="new-cancel-button w-full sm:w-auto order-2 sm:order-1"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSubmitting || store.cartTotal === 0 || newBalance < -12.00"
          class="new-confirm-button w-full sm:w-auto order-1 sm:order-2"
        >
          {{ isSubmitting ? 'Processando...' : 'Confirmar Consumo' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { BalanceStatus, type Product, type Student } from '@/types'

interface Props {
  student?: Student
}

const props = defineProps<Props>()
const store = useAppStore()
const isSubmitting = ref(false)

// Usar o aluno passado como prop ou fallback para currentStudent
const currentStudent = computed(() => {
  return props.student || store.currentStudent
})

const newBalance = computed(() => {
  return (currentStudent.value?.balance || 0) - store.cartTotal
})

const getBalanceClass = (balance: number) => {
  const status = store.getBalanceStatus(balance)
  return {
    'text-green-600': status === BalanceStatus.NORMAL,
    'text-yellow-600': status === BalanceStatus.LOW,
    'text-red-600': status === BalanceStatus.CRITICAL,
  }
}

// const getNewBalanceClass = () => {
//   const status = store.getBalanceStatus(newBalance.value)
//   return {
//     'bg-green-100 text-green-800': status === BalanceStatus.NORMAL,
//     'bg-yellow-100 text-yellow-800': status === BalanceStatus.LOW,
//     'bg-red-100 text-red-800': status === BalanceStatus.CRITICAL
//   }
// }

const productsByCategory = computed(() => {
  const categories = {
    bebida: [] as Product[],
    lanche: [] as Product[],
    doce: [] as Product[]
  }
  
  store.products.forEach(product => {
    if (product.category && categories[product.category]) {
      categories[product.category].push(product)
    } else {
      categories.doce.push(product)
    }
  })
  
  return categories
})

const getCartQuantity = (product: Product) => {
  const item = store.cart.find((item) => item.product.id === product.id)
  return item ? item.quantity : 0
}

const addToCart = (product: Product) => {
  store.addToCart(product)
}

const removeFromCart = (product: Product) => {
  store.removeFromCart(product.id!)
}

const handleSubmit = async () => {
  if (isSubmitting.value || !currentStudent.value || store.cartTotal === 0) return

  if (newBalance.value < -12.00) {
    alert('Limite de saldo negativo atingido! Máximo permitido: -R$ 12,00')
    return
  }

  isSubmitting.value = true
  try {
    await store.processConsumption(currentStudent.value.id!)
    store.closeModal()
  } catch (error) {
    console.error('Erro ao processar consumo:', error)
    alert('Erro ao processar consumo. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

// Função removida - agora usando inline handler
</script>
