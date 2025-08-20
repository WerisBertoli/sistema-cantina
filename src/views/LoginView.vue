<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center p-4 py-4">
    <div class="max-w-md w-full space-y-4 mx-auto flex-shrink-0">
      <!-- Logo e Título -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Cantina Digital<br><span style="color: #FF2800;">Erlach</span>
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Faça login para acessar o sistema
        </p>
      </div>

      <!-- Formulário de Login -->
      <div class="bg-white dark:bg-gray-800 py-4 px-6 shadow-xl rounded-lg">
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Campo Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div class="mt-1 relative">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Digite seu email"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Campo Senha -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Digite sua senha"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
              >
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Lembrar-me -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Lembrar-me
            </label>
          </div>

          <!-- Botão de Login -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="!loading">Entrar</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            </button>
          </div>

          <!-- Link para recuperação de senha -->
          <div class="text-center">
            <router-link
              to="/forgot-password"
              class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors duration-200"
            >
              Esqueceu sua senha?
            </router-link>
          </div>

          <!-- Mensagem de erro -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-400">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()

// Estado do formulário
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

// Estados da interface
const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Carregar email salvo se existir
onMounted(() => {
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    form.value.email = savedEmail
    form.value.rememberMe = true
  }
})

// Função de login
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    // Validação básica
    if (!form.value.email || !form.value.password) {
      throw new Error('Por favor, preencha todos os campos')
    }
    
    // Configurar persistência baseada na opção "Lembrar-me"
    const persistence = form.value.rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistence)
    
    // Fazer login com Firebase
    await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
    
    // Salvar ou remover email baseado na opção "Lembrar-me"
    if (form.value.rememberMe) {
      localStorage.setItem('rememberedEmail', form.value.email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }
    
    // Redirecionar para home
    router.push('/home')
    
  } catch (error: any) {
    console.error('Erro no login:', error)
    
    // Tratar diferentes tipos de erro do Firebase
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'Usuário não encontrado'
        break
      case 'auth/wrong-password':
        errorMessage.value = 'Senha incorreta'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Email inválido'
        break
      case 'auth/user-disabled':
        errorMessage.value = 'Usuário desabilitado'
        break
      case 'auth/too-many-requests':
        errorMessage.value = 'Muitas tentativas. Tente novamente mais tarde'
        break
      default:
        errorMessage.value = error.message || 'Erro ao fazer login'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Animações personalizadas */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Transições suaves */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Responsividade para dispositivos móveis */
@media (max-height: 900px) {
  .min-h-screen {
    min-height: 100vh;
    padding: 0.5rem !important;
  }
  
  .space-y-4 > * + * {
    margin-top: 0.75rem !important;
  }
}

@media (max-height: 700px) {
  .space-y-4 > * + * {
    margin-top: 0.5rem !important;
  }
  
  .bg-white {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}
</style>
