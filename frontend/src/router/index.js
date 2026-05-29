import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: 'Inicio' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: 'Iniciar sesión' },
  },
  {
    path: '/registro',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { title: 'Crear cuenta' },
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true, title: 'Mi perfil' },
  },
  {
    path: '/juegos',
    name: 'GamesList',
    component: () => import('@/views/GamesListPage.vue'),
    meta: { title: 'Mis juegos' },
  },
  {
    path: '/juegos/nuevo',
    name: 'GameCreate',
    component: () => import('@/views/GameCreatePage.vue'),
    meta: { title: 'Añadir juego' },
  },
  {
    path: '/juegos/:id',
    name: 'GameDetail',
    component: () => import('@/views/GameDetailPage.vue'),
    meta: { title: 'Detalle del juego' },
  },
  {
    path: '/juegos/edicion/:id',
    name: 'GameEdit',
    component: () => import('@/views/GameEditPage.vue'),
    meta: { title: 'Editar juego' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

const defaultTitle = 'Gamer Backlog'

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} · ${defaultTitle}` : defaultTitle

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
