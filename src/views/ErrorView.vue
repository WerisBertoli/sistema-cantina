<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">
        ⚠️
      </div>
      
      <h1 class="error-title">Oops! Algo deu errado</h1>
      
      <p class="error-message">
        {{ errorMessage }}
      </p>
      
      <div class="error-details" v-if="showDetails">
        <h3>Detalhes do erro:</h3>
        <pre>{{ errorDetails }}</pre>
      </div>
      
      <div class="debug-info" v-if="showDetails">
        <h3>Informações de Debug:</h3>
        <p><strong>User Agent:</strong> {{ userAgent }}</p>
        <p><strong>URL Atual:</strong> {{ currentUrl }}</p>
        <p><strong>Safari iOS:</strong> {{ isSafariIOS ? 'Sim' : 'Não' }}</p>
        <p><strong>Modo Router:</strong> {{ routerMode }}</p>
        <p><strong>Tentativas Fallback:</strong> {{ fallbackAttempts }}</p>
        <p><strong>LocalStorage:</strong></p>
        <pre>{{ localStorageData }}</pre>
      </div>
      
      <div class="error-actions">
        <button @click="goHome" class="btn-primary">
          🏠 Ir para Home
        </button>
        
        <button @click="goLogin" class="btn-secondary">
          🔑 Fazer Login
        </button>
        
        <button @click="reload" class="btn-secondary">
          🔄 Recarregar
        </button>
        
        <button @click="toggleDetails" class="btn-link">
          {{ showDetails ? 'Ocultar' : 'Mostrar' }} detalhes
        </button>
        
        <button @click="forceHashMode" class="btn-warning" v-if="routerMode !== 'Hash Mode'">
          🔧 Tentar Hash Mode
        </button>
      </div>
      
      <div class="safari-ios-info" v-if="isSafariIOS">
        <h3>🍎 Detectado Safari iOS</h3>
        <p>Se você fechou e reabriu o Safari, isso pode ter causado o problema.</p>
        <button @click="clearSafariState" class="btn-warning">
          🧹 Limpar estado do Safari
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const showDetails = ref(false)
const errorMessage = ref('Página não encontrada ou erro de navegação.')
const errorDetails = ref('')
const isSafariIOS = ref(false)
const userAgent = ref('')
const currentUrl = ref('')
const routerMode = ref('')
const fallbackAttempts = ref(0)
const localStorageData = ref('')

onMounted(() => {
  // Detectar Safari iOS
  isSafariIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  
  // Preencher dados de debug
  userAgent.value = navigator.userAgent
  currentUrl.value = window.location.href
  routerMode.value = window.location.hash.includes('#') ? 'Hash Mode' : 'History Mode'
  fallbackAttempts.value = parseInt(localStorage.getItem('router_fallback_attempts') || '0')
  
  // Coletar informações de debug
  const debugInfo = {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    localStorage: {
      safariPath: localStorage.getItem('safari_ios_last_path'),
      safariUser: localStorage.getItem('safari_ios_user_state'),
      mobileLogs: localStorage.getItem('mobile_debug_logs'),
      fallbackAttempts: localStorage.getItem('router_fallback_attempts'),
      safariErrors: localStorage.getItem('safari_navigation_errors')
    }
  }
  
  localStorageData.value = JSON.stringify(debugInfo.localStorage, null, 2)
  errorDetails.value = JSON.stringify(debugInfo, null, 2)
  
  // Log específico para mobile
  if (isSafariIOS.value) {
    console.log('[MOBILE DEBUG] ErrorView carregada no Safari iOS', debugInfo)
  }
})

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const goHome = () => {
  // Verificar se há usuário autenticado
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/home')
    } else {
      router.push('/login')
    }
  })
}

const goLogin = () => {
  router.push('/login')
}

const reload = () => {
  window.location.reload()
}

const clearSafariState = () => {
  try {
    localStorage.removeItem('safari_ios_last_path')
    localStorage.removeItem('safari_ios_user_state')
    localStorage.removeItem('mobile_debug_logs')
    localStorage.removeItem('router_fallback_attempts')
    localStorage.removeItem('safari_navigation_errors')
    alert('Estado do Safari limpo! Redirecionando...')
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (e) {
    console.error('Erro ao limpar estado:', e)
  }
}

const forceHashMode = () => {
  try {
    // Marcar que deve usar hash mode
    localStorage.setItem('router_fallback_attempts', '3')
    localStorage.setItem('safari_navigation_errors', 'true')
    
    // Recarregar a página para aplicar hash mode
    const currentPath = window.location.pathname
    window.location.href = window.location.origin + '/#' + currentPath
  } catch (e) {
    console.error('Erro ao forçar hash mode:', e)
    // Fallback: apenas recarregar
    window.location.reload()
  }
}
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-title {
  color: #333;
  margin-bottom: 16px;
  font-size: 1.5rem;
}

.error-message {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.error-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.error-details pre {
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-link {
  background: none;
  color: #007bff;
  border: none;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.safari-ios-info {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.safari-ios-info h3 {
  color: #856404;
  margin-bottom: 10px;
}

.safari-ios-info p {
  color: #856404;
  margin-bottom: 15px;
}

@media (max-width: 480px) {
  .error-content {
    padding: 20px;
  }
  
  .error-actions {
    gap: 8px;
  }
}
</style>