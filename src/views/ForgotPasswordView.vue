<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-md w-full space-y-6">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
          <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Cantina Digital <br><span style="color: #FF2800;">Erlach</span>
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Esqueceu sua senha? Não se preocupe!
        </p>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Digite seu email para receber as instruções de recuperação.
        </p>
      </div>
      
      <form class="mt-6 space-y-6" @submit.prevent="handleForgotPassword">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Campo Email -->
          <div>
            <label for="email" class="sr-only">Email</label>
            <div class="relative">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Digite seu email"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensagem de sucesso -->
        <div v-if="showSuccessMessage" class="rounded-md bg-green-50 dark:bg-green-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800 dark:text-green-200">
                Email de recuperação enviado! Verifique sua caixa de entrada e spam.
              </p>
              <p class="text-xs text-green-700 dark:text-green-300 mt-1">
                Você será redirecionado para o login em alguns segundos.
              </p>
            </div>
          </div>
        </div>

        <!-- Mensagem de erro -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Enviando...' : 'Enviar instruções' }}
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors duration-200"
          >
            ← Voltar para o login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()

// Estado do formulário
const form = ref({
  email: ''
})

const isLoading = ref(false)
const showSuccessMessage = ref(false)
const errorMessage = ref('')

// Função para lidar com a recuperação de senha
const handleForgotPassword = async () => {
  if (!form.value.email) {
    errorMessage.value = 'Por favor, digite seu email.'
    return
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = 'Por favor, digite um email válido.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  showSuccessMessage.value = false

  try {
    // Enviar email de recuperação de senha usando Firebase Auth
    await sendPasswordResetEmail(auth, form.value.email)
    
    // Mostrar mensagem de sucesso
    showSuccessMessage.value = true
    form.value.email = ''
    
    // Redirecionar para login após alguns segundos
    setTimeout(() => {
      router.push('/login')
    }, 5000)
    
  } catch (error: any) {
    console.error('Erro ao enviar email de recuperação:', error)
    
    // Tratar diferentes tipos de erro do Firebase
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'Não existe uma conta com este email.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Email inválido.'
        break
      case 'auth/too-many-requests':
        errorMessage.value = 'Muitas tentativas. Tente novamente mais tarde.'
        break
      case 'auth/network-request-failed':
        errorMessage.value = 'Erro de conexão. Verifique sua internet.'
        break
      default:
        errorMessage.value = 'Erro ao enviar email. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Animações personalizadas */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>