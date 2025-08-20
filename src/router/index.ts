import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      beforeEnter: (to, from, next) => {
        // Se a autenticação ainda não foi inicializada, aguardar
        if (!authInitialized) {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe()
            if (user) {
              next('/home')
            } else {
              next('/login')
            }
          })
        } else {
          // Autenticação já inicializada, redirecionar baseado no estado atual
          if (currentUser) {
            next('/home')
          } else {
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

// Listener para mudanças no estado de autenticação
onAuthStateChanged(auth, (user) => {
  currentUser = user
  authInitialized = true
  isAuthLoading = false
})

// Função para verificar se a autenticação está carregando
export const getAuthLoadingState = () => isAuthLoading

// Guard de navegação para autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Se a autenticação ainda não foi inicializada, aguardar
  if (!authInitialized) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser = user
      authInitialized = true
      unsubscribe() // Remove o listener após a primeira verificação
      
      // Reexecutar a lógica de navegação
      if (requiresAuth && !currentUser) {
        next('/login')
      } else if (requiresGuest && currentUser) {
        if (to.name === 'login' && from.name === 'forgot-password') {
          next()
        } else {
          next('/home')
        }
      } else {
        next()
      }
    })
    return // Sair da função e aguardar o callback
  }
  
  // Lógica normal de navegação quando a autenticação já foi inicializada
  if (requiresAuth && !currentUser) {
    // Rota protegida e usuário não autenticado
    next('/login')
  } else if (requiresGuest && currentUser) {
    // Permitir acesso ao login se vier da página de esqueci a senha
    if (to.name === 'login' && from.name === 'forgot-password') {
      next()
    } else {
      // Rota de convidado e usuário já autenticado
      next('/home')
    }
  } else {
    // Permitir navegação
    next()
  }
})

export default router
