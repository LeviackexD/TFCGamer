import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/registro',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/juegos',
    name: 'GamesList',
    component: () => import('@/views/GamesListPage.vue'),
  },
  {
    path: '/juegos/nuevo',
    name: 'GameCreate',
    component: () => import('@/views/GameCreatePage.vue'),
  },
  {
    path: '/juegos/:id',
    name: 'GameDetail',
    component: () => import('@/views/GameDetailPage.vue'),
  },
  {
    path: '/juegos/edicion/:id',
    name: 'GameEdit',
    component: () => import('@/views/GameEditPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  if (requiresAuth && !token) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && token) {
    next('/juegos')
  } else {
    next()
  }
})
