import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ErrorView from '../views/ErrorView.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Detectar se é dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

// Função para logs específicos de mobile
const mobileLog = (message: string, data?: any) => {
  if (isMobile) {
    console.log(`[MOBILE DEBUG] ${message}`, data || '')
    // Também salvar no localStorage para debug posterior
    try {
      const logs = JSON.parse(localStorage.getItem('mobile_debug_logs') || '[]')
      logs.push({ timestamp: new Date().toISOString(), message, data })
      localStorage.setItem('mobile_debug_logs', JSON.stringify(logs.slice(-50))) // Manter apenas os últimos 50 logs
    } catch (e) {
      console.warn('Erro ao salvar logs no localStorage:', e)
    }
  }
}

// Função específica para recuperação de estado no Safari iOS
const recoverSafariIOSState = () => {
  if (isSafariIOS) {
    try {
      // Verificar se há dados de sessão salvos
      const savedPath = localStorage.getItem('safari_ios_last_path')
      const savedUser = localStorage.getItem('safari_ios_user_state')
      
      mobileLog('Tentando recuperar estado Safari iOS', { savedPath, hasUser: !!savedUser })
      
      if (savedPath && savedUser === 'authenticated') {
        mobileLog('Estado recuperado: usuário autenticado, redirecionando para', savedPath)
        return savedPath
      }
    } catch (e) {
      mobileLog('Erro ao recuperar estado Safari iOS', e)
    }
  }
  return null
}

// Detectar se há problemas de navegação e usar hash mode como fallback
const shouldUseHashMode = () => {
  // Verificar se já houve tentativas de fallback
  const fallbackAttempts = parseInt(localStorage.getItem('router_fallback_attempts') || '0')
  
  // Se já tentou várias vezes com history mode, usar hash mode
  if (fallbackAttempts >= 2) {
    mobileLog('Usando hash mode devido a múltiplas falhas de navegação')
    return true
  }
  
  // Para Safari iOS, usar hash mode se detectar problemas
  if (isSafariIOS) {
    const hasNavigationErrors = localStorage.getItem('safari_navigation_errors')
    if (hasNavigationErrors) {
      mobileLog('Usando hash mode para Safari iOS devido a erros de navegação')
      return true
    }
  }
  
  return false
}

// Incrementar contador de tentativas de fallback
const incrementFallbackAttempts = () => {
  const attempts = parseInt(localStorage.getItem('router_fallback_attempts') || '0')
  localStorage.setItem('router_fallback_attempts', (attempts + 1).toString())
  mobileLog(`Incrementando tentativas de fallback: ${attempts + 1}`)
}

// Limpar contadores quando navegação funciona
const clearFallbackAttempts = () => {
  localStorage.removeItem('router_fallback_attempts')
  localStorage.removeItem('safari_navigation_errors')
  mobileLog('Limpando contadores de fallback - navegação funcionando')
}

// Salvar estado para Safari iOS
const saveSafariIOSState = (path: string, isAuthenticated: boolean) => {
  if (isSafariIOS) {
    try {
      localStorage.setItem('safari_ios_last_path', path)
      localStorage.setItem('safari_ios_user_state', isAuthenticated ? 'authenticated' : 'guest')
      mobileLog('Estado Safari iOS salvo', { path, isAuthenticated })
    } catch (e) {
      mobileLog('Erro ao salvar estado Safari iOS', e)
    }
  }
}

// Criar router com history mode apropriado
const useHashMode = shouldUseHashMode()
mobileLog(`Criando router com modo: ${useHashMode ? 'hash' : 'history'}`)

const router = createRouter({
  history: useHashMode ? createWebHashHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      beforeEnter: (to, from, next) => {
        mobileLog('Rota raiz acessada', { from: from.path, authInitialized, currentUser: !!currentUser })
        
        // Tentar recuperar estado do Safari iOS primeiro
        const recoveredPath = recoverSafariIOSState()
        if (recoveredPath && recoveredPath !== '/') {
          mobileLog('Estado Safari iOS recuperado, redirecionando para', recoveredPath)
          next(recoveredPath)
          return
        }
        
        // Se a autenticação ainda não foi inicializada, aguardar
        if (!authInitialized) {
          mobileLog('Aguardando inicialização da autenticação')
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe()
            mobileLog('Auth state changed na rota raiz', { user: !!user })
            if (user) {
              mobileLog('Redirecionando para /home')
              saveSafariIOSState('/home', true)
              next('/home')
            } else {
              mobileLog('Redirecionando para /login')
              saveSafariIOSState('/login', false)
              next('/login')
            }
          })
        } else {
          // Autenticação já inicializada, redirecionar baseado no estado atual
          if (currentUser) {
            mobileLog('Auth já inicializada, redirecionando para /home')
            saveSafariIOSState('/home', true)
            next('/home')
          } else {
            mobileLog('Auth já inicializada, redirecionando para /login')
            saveSafariIOSState('/login', false)
            next('/login')
          }
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/tarefas',
      name: 'tarefas',
      component: () => import('../components/TodoListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: ErrorView
    }
  ],
})

// Variável para controlar se a autenticação foi inicializada
let authInitialized = false
let currentUser: any = null
let isAuthLoading = true

// Listener global para mudanças no estado de autenticação
onAuthStateChanged(auth, (user) => {
  mobileLog('onAuthStateChanged global executado', { user: !!user, wasInitialized: authInitialized })
  currentUser = user
  authInitialized = true
  isAuthLoading = false
  mobileLog('Estado de auth atualizado', { authInitialized, isAuthLoading, currentUser: !!currentUser })
})

// Função para verificar se a autenticação está carregando
export const getAuthLoadingState = () => isAuthLoading

// Guard de navegação para autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  mobileLog('beforeEach executado', { 
    to: to.path, 
    from: from.path, 
    requiresAuth, 
    requiresGuest, 
    authInitialized, 
    currentUser: !!currentUser 
  })
  
  // Se a autenticação ainda não foi inicializada, aguardar
  if (!authInitialized) {
    mobileLog('Auth não inicializada, aguardando...')
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser = user
      authInitialized = true
      unsubscribe() // Remove o listener após a primeira verificação
      
      mobileLog('Auth inicializada no beforeEach', { user: !!user })
      
      // Reexecutar a lógica de navegação
      if (requiresAuth && !currentUser) {
        mobileLog('Redirecionando para login (requiresAuth)')
        saveSafariIOSState('/login', false)
        clearFallbackAttempts()
        next('/login')
      } else if (requiresGuest && currentUser) {
        if (to.name === 'login' && from.name === 'forgot-password') {
          mobileLog('Permitindo navegação login <- forgot-password')
          saveSafariIOSState(to.path, !!currentUser)
          clearFallbackAttempts()
          next()
        } else {
          mobileLog('Redirecionando para home (requiresGuest + user)')
          saveSafariIOSState('/home', true)
          clearFallbackAttempts()
          next('/home')
        }
      } else {
        mobileLog('Permitindo navegação normal')
        saveSafariIOSState(to.path, !!currentUser)
        clearFallbackAttempts()
        next()
      }
    })
    return // Sair da função e aguardar o callback
  }
  
  // Lógica normal de navegação quando a autenticação já foi inicializada
  mobileLog('Auth já inicializada, aplicando lógica normal')
  
  if (requiresAuth && !currentUser) {
    // Rota protegida e usuário não autenticado
    mobileLog('Rota protegida sem usuário, redirecionando para login')
    saveSafariIOSState('/login', false)
    clearFallbackAttempts()
    next('/login')
  } else if (requiresGuest && currentUser) {
    // Permitir acesso ao login se vier da página de esqueci a senha
    if (to.name === 'login' && from.name === 'forgot-password') {
      mobileLog('Permitindo login <- forgot-password')
      saveSafariIOSState(to.path, !!currentUser)
      clearFallbackAttempts()
      next()
    } else {
      // Rota de convidado e usuário já autenticado
      mobileLog('Rota de convidado com usuário, redirecionando para home')
      saveSafariIOSState('/home', true)
      clearFallbackAttempts()
      next('/home')
    }
  } else {
    // Permitir navegação
    mobileLog('Permitindo navegação livre')
    saveSafariIOSState(to.path, !!currentUser)
    clearFallbackAttempts()
    next()
  }
})

// Tratamento de erros de navegação
router.onError((error) => {
  mobileLog('Erro de navegação capturado', { error: error.message, stack: error.stack })
  
  // Marcar que houve erro de navegação
  incrementFallbackAttempts()
  
  // Para Safari iOS, marcar erro específico
  if (isSafariIOS) {
    localStorage.setItem('safari_navigation_errors', 'true')
    mobileLog('Marcando erro de navegação Safari iOS')
  }
  
  // Se não estamos usando hash mode ainda, tentar recarregar com hash mode
  const currentMode = router.options.history.base
  const isCurrentlyHashMode = window.location.hash.includes('#')
  
  if (!isCurrentlyHashMode && shouldUseHashMode()) {
    mobileLog('Tentando fallback para hash mode devido a erro')
    // Recarregar a página para aplicar hash mode
    const currentPath = window.location.pathname
    window.location.href = window.location.origin + '/#' + currentPath
    return
  }
  
  // Se for Safari iOS e houver erro, tentar recuperar estado
  if (isSafariIOS) {
    const recoveredPath = recoverSafariIOSState()
    if (recoveredPath && recoveredPath !== '/') {
      mobileLog('Tentando recuperar de erro com estado salvo', recoveredPath)
      router.push(recoveredPath).catch(() => {
        mobileLog('Falha na recuperação, indo para página de erro')
        router.push('/error')
      })
      return
    }
  }
  
  // Redirecionar para página de erro
  router.push('/error').catch(() => {
    // Se até mesmo a página de erro falhar, recarregar a página
    mobileLog('Falha crítica, recarregando página')
    window.location.href = '/'
  })
})

export default router
