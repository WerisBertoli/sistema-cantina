<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-bold text-gray-800">Pedido de Tropinhos</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
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

      <!-- Content -->
      <div class="p-4">
        <!-- WhatsApp Number Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Número do WhatsApp (com DDD):
          </label>
          <input
            v-model="whatsappNumber"
            type="tel"
            placeholder="Ex: 27999887766"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <!-- Products List -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-medium text-gray-800">Caixas Disponíveis:</h3>
            <button
              @click="showAddProduct = true"
              class="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600"
            >
              + Adicionar Caixa
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(product, index) in products"
              :key="index"
              class="p-3 border rounded-lg"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="flex-1">
                  <input
                    v-model="product.name"
                    type="text"
                    placeholder="Ex: Caixa 60und"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <button
                  @click="removeProduct(index)"
                  class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Remover caixa"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <label class="block text-xs text-gray-600 mb-1">Sabor:</label>
                  <input
                    v-model="product.description"
                    type="text"
                    placeholder="Ex: mista, framboesa"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">Qtd:</label>
                  <input
                    v-model.number="product.quantity"
                    type="number"
                    min="0"
                    max="99"
                    class="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Product Form -->
        <div v-if="showAddProduct" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="space-y-2">
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="Nome da caixa (ex: Caixa 60und)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              v-model="newProduct.description"
              type="text"
              placeholder="Sabor (ex: mista, framboesa)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div class="flex gap-2">
              <button
                @click="addNewProduct"
                :disabled="!newProduct.name.trim() || !newProduct.description.trim()"
                class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                Adicionar
              </button>
              <button
                @click="cancelAddProduct"
                class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div v-if="hasSelectedProducts" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Resumo do Pedido:</h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400">
            <li v-for="product in selectedProducts" :key="product.name">
              {{ product.quantity }}x {{ product.name }} ({{ product.description }})
            </li>
          </ul>
        </div>

        <!-- Address Section -->
        <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Endereço de entrega:</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Rua 12, 09 - Cocal, Vila Velha - ES, 29105-820<br />
            Centro Educacional Erlach (escola de esquina)
          </p>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <button
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="generateWhatsAppMessage"
            class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
            :disabled="!hasSelectedProducts || !whatsappNumber.trim()"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"
              />
            </svg>
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Product {
  name: string
  description: string
  quantity: number
}

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// WhatsApp number with localStorage persistence
const whatsappNumber = ref(localStorage.getItem('whatsappNumber') || '')

// Watch for changes and save to localStorage
watch(whatsappNumber, (newValue) => {
  if (newValue.trim()) {
    localStorage.setItem('whatsappNumber', newValue)
  }
})

const products = ref<Product[]>([])

// Add new product functionality
const showAddProduct = ref(false)
const newProduct = ref({
  name: '',
  description: ''
})

const addNewProduct = () => {
  if (newProduct.value.name.trim() && newProduct.value.description.trim()) {
    products.value.push({
      name: newProduct.value.name.trim(),
      description: newProduct.value.description.trim(),
      quantity: 0
    })
    
    // Reset form
    newProduct.value = { name: '', description: '' }
    showAddProduct.value = false
  }
}

const cancelAddProduct = () => {
  newProduct.value = { name: '', description: '' }
  showAddProduct.value = false
}

const removeProduct = (index: number) => {
  products.value.splice(index, 1)
}

const hasSelectedProducts = computed(() => {
  return products.value.some((product) => product.quantity > 0)
})

const selectedProducts = computed(() => {
  return products.value.filter((product) => product.quantity > 0)
})

const increaseQuantity = (productName: string) => {
  const product = products.value.find((p) => p.name === productName)
  if (product) {
    product.quantity++
  }
}

const decreaseQuantity = (productName: string) => {
  const product = products.value.find((p) => p.name === productName)
  if (product && product.quantity > 0) {
    product.quantity--
  }
}

const closeModal = () => {
  // Reset quantities
  products.value.forEach((product) => {
    product.quantity = 0
  })
  
  // Reset add product form
  showAddProduct.value = false
  newProduct.value = { name: '', description: '' }
  
  emit('close')
}

const generateWhatsAppMessage = () => {
  const selected = selectedProducts.value

  if (selected.length === 0 || !whatsappNumber.value.trim()) {
    return
  }

  let message = 'Boa tarde tudo bem?\nEu gostaria de:\n'

  selected.forEach((product) => {
    const quantity = product.quantity.toString().padStart(2, '0')
    message += `- ${quantity} ${product.name.toLowerCase()} ${product.description}\n`
  })

  message +=
    '\npor favor meu endereço é:\n\nRua 12, 09 - Cocal, Vila Velha - ES, 29105-820\nCentro Educacional Erlach (uma escola de esquina)'

  // Encode message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message)
  const phoneNumber = whatsappNumber.value.replace(/\D/g, '') // Remove non-digits
  const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`
  
  window.open(whatsappUrl, '_blank')

  closeModal()
}
</script>
