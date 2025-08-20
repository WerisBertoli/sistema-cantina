import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Detectar se é dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// Função para logs específicos de mobile
const mobileLog = (message: string, data?: any) => {
  if (isMobile) {
    console.log(`[MOBILE DEBUG] ${message}`, data || '')
    // Também salvar no localStorage para debug posterior
    const logs = JSON.parse(localStorage.getItem('mobile_debug_logs') || '[]')
    logs.push({ timestamp: new Date().toISOString(), message, data })
    localStorage.setItem('mobile_debug_logs', JSON.stringify(logs.slice(-50))) // Manter apenas os últimos 50 logs
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      beforeEnter: (to, from, next) => {
        mobileLog('Rota raiz acessada', { from: from.path, authInitialized, currentUser: !!currentUser })
        
        // Se a autenticação ainda não foi inicializada, aguardar
        if (!authInitialized) {
          mobileLog('Aguardando inicialização da autenticação')
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe()
            mobileLog('Auth state changed na rota raiz', { user: !!user })
            if (user) {
              mobileLog('Redirecionando para /home')
              next('/home')
            } else {
              mobileLog('Redirecionando para /login')
              next('/login')
            }
          })
        } else {
          // Autenticação já inicializada, redirecionar baseado no estado atual
          if (currentUser) {
            mobileLog('Auth já inicializada, redirecionando para /home')
            next('/home')
          } else {
            mobileLog('Auth já inicializada, redirecionando para /login')
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
        next('/login')
      } else if (requiresGuest && currentUser) {
        if (to.name === 'login' && from.name === 'forgot-password') {
          mobileLog('Permitindo navegação login <- forgot-password')
          next()
        } else {
          mobileLog('Redirecionando para home (requiresGuest + user)')
          next('/home')
        }
      } else {
        mobileLog('Permitindo navegação normal')
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
    next('/login')
  } else if (requiresGuest && currentUser) {
    // Permitir acesso ao login se vier da página de esqueci a senha
    if (to.name === 'login' && from.name === 'forgot-password') {
      mobileLog('Permitindo login <- forgot-password')
      next()
    } else {
      // Rota de convidado e usuário já autenticado
      mobileLog('Rota de convidado com usuário, redirecionando para home')
      next('/home')
    }
  } else {
    // Permitir navegação
    mobileLog('Permitindo navegação livre')
    next()
  }
})

export default router
