import { ref, reactive } from 'vue'
import { router } from '@/router'
import { gameService } from '@/services/gameService'

const games = ref([])
const loading = ref(false)
const error = ref('')
const filters = reactive({
  search: '',
  category: '',
  tag: '',
  completed: null,
  sortBy: 'priorityScore',
  order: 'desc',
})

export function useGames() {
  async function loadGames() {
    loading.value = true
    error.value = ''
    try {
      games.value = await gameService.list({ ...filters })
    } catch (err) {
      if (err.code === 'TOKEN_EXPIRED') {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      error.value = err.message || 'Error al cargar los juegos'
    } finally {
      loading.value = false
    }
  }

  async function getGameById(id) {
    return gameService.getById(id)
  }

  async function createGame(data) {
    const game = await gameService.create(data)
    await loadGames()
    return game
  }

  async function updateGame(id, data) {
    const game = await gameService.update(id, data)
    await loadGames()
    return game
  }

  async function deleteGame(id) {
    await gameService.delete(id)
    await loadGames()
  }

  async function completeGame(id, data = {}) {
    const game = await gameService.complete(id, data)
    await loadGames()
    return game
  }

  async function uncompleteGame(id) {
    const game = await gameService.uncomplete(id)
    await loadGames()
    return game
  }

  async function setFilters(newFilters) {
    Object.assign(filters, newFilters)
    await loadGames()
  }

  return {
    games,
    loading,
    error,
    filters,
    loadGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    completeGame,
    uncompleteGame,
    setFilters,
  }
}
