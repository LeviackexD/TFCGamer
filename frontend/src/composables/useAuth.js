import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { router } from '@/router'

const user = ref(null)
const token = ref(localStorage.getItem('token'))
const loading = ref(false)
const stats = ref(null)
const statsLoading = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  async function login(input) {
    loading.value = true
    try {
      const result = await authService.login(input)
      token.value = result.token
      user.value = result.user
      localStorage.setItem('token', result.token)
      return result
    } finally {
      loading.value = false
    }
  }

  async function register(input) {
    loading.value = true
    try {
      const result = await authService.register(input)
      token.value = result.token
      user.value = result.user
      localStorage.setItem('token', result.token)
      return result
    } finally {
      loading.value = false
    }
  }

  async function checkAuth() {
    if (!token.value) return
    loading.value = true
    try {
      user.value = await authService.getMe(token.value)
    } catch {
      logout()
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    if (!token.value) return
    statsLoading.value = true
    try {
      const data = await authService.getStats(token.value)
      stats.value = data.stats
      user.value = data.user
    } catch {
      stats.value = null
    } finally {
      statsLoading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    stats.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return {
    user,
    token,
    loading,
    stats,
    statsLoading,
    isAuthenticated,
    login,
    register,
    checkAuth,
    loadStats,
    logout,
  }
}
