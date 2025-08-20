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
      redirect: '/login'
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

// Guard de navegação para autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const user = auth.currentUser
  
  if (requiresAuth && !user) {
    // Rota protegida e usuário não autenticado
    next('/login')
  } else if (requiresGuest && user) {
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
