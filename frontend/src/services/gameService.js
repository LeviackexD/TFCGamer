import { mockGames } from '@/data/mockGames'

const API = '/api'

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function apiRequest(endpoint, options = {}) {
  let res

  try {
    res = await fetch(`${API}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
      ...options,
    })
  } catch {
    const err = new Error('No se puede conectar con el servidor. ¿Está el backend corriendo?')
    err.status = 0
    throw err
  }

  let data
  try {
    data = await res.json()
  } catch {
    const err = new Error('Error inesperado del servidor')
    err.status = res.status
    throw err
  }

  if (!data.success) {
    const err = new Error(data.message || 'Error de conexión')
    err.status = res.status
    err.errors = data.errors || null
    if (res.status === 401) err.code = 'TOKEN_EXPIRED'
    throw err
  }

  return data.data
}

// --- Mock fallback (sin token, modo desarrollo) ---
let games = [...mockGames]
let nextId = games.length + 1

function matchesSearch(game, search) {
  if (!search) return true
  const q = search.toLowerCase()
  return game.name.toLowerCase().includes(q)
}

function matchesCategory(game, category) {
  if (!category) return true
  return game.category === category
}

function matchesTag(game, tag) {
  if (!tag) return true
  return game.tags.toLowerCase().includes(tag.toLowerCase())
}

function matchesCompleted(game, completed) {
  if (completed === undefined || completed === null) return true
  return game.completed === (completed === 'true')
}

function filterGames(filters) {
  let result = games.filter(g =>
    matchesSearch(g, filters.search) &&
    matchesCategory(g, filters.category) &&
    matchesTag(g, filters.tag) &&
    matchesCompleted(g, filters.completed)
  )

  const sortBy = filters.sortBy || 'priorityScore'
  const order = filters.order || 'desc'

  result.sort((a, b) => {
    const valA = a[sortBy]
    const valB = b[sortBy]
    if (typeof valA === 'string') {
      return order === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA)
    }
    return order === 'asc' ? valA - valB : valB - valA
  })

  return result
}

function buildQueryString(filters) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.category) params.set('category', filters.category)
  if (filters.tag) params.set('tag', filters.tag)
  if (filters.completed) params.set('completed', filters.completed)
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.order) params.set('order', filters.order)
  return params.toString()
}

export const gameService = {
  async list(filters = {}) {
    if (!getToken()) return filterGames(filters)

    const qs = buildQueryString(filters)
    return apiRequest(`/games${qs ? `?${qs}` : ''}`)
  },

  async getById(id) {
    if (!getToken()) {
      const game = games.find(g => g.id === id)
      if (!game) throw new Error('Juego no encontrado')
      return { ...game }
    }
    return apiRequest(`/games/${id}`)
  },

  async create(data) {
    if (!getToken()) {
      const now = new Date().toISOString()
      const priorityScore = Number((data.metacriticScore / data.hoursToBeat).toFixed(2))
      const game = {
        id: nextId++,
        ...data,
        completed: data.completed ?? false,
        completedAt: data.completed ? now : null,
        notes: data.notes ?? null,
        rating: data.rating ?? null,
        priorityScore,
        createdAt: now,
        updatedAt: now,
      }
      games.unshift(game)
      return { ...game }
    }
    return apiRequest('/games', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id, data) {
    if (!getToken()) {
      const index = games.findIndex(g => g.id === id)
      if (index === -1) throw new Error('Juego no encontrado')

      const existing = games[index]
      const metacriticScore = data.metacriticScore ?? existing.metacriticScore
      const hoursToBeat = data.hoursToBeat ?? existing.hoursToBeat
      const priorityScore = Number((metacriticScore / hoursToBeat).toFixed(2))

      const updated = {
        ...existing,
        ...data,
        priorityScore,
        updatedAt: new Date().toISOString(),
      }
      games[index] = updated
      return { ...updated }
    }
    return apiRequest(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async delete(id) {
    if (!getToken()) {
      const index = games.findIndex(g => g.id === id)
      if (index === -1) throw new Error('Juego no encontrado')
      games.splice(index, 1)
      return { message: 'Juego eliminado correctamente' }
    }
    return apiRequest(`/games/${id}`, { method: 'DELETE' })
  },

  async complete(id, data = {}) {
    if (!getToken()) {
      const index = games.findIndex(g => g.id === id)
      if (index === -1) throw new Error('Juego no encontrado')

      const updated = {
        ...games[index],
        completed: true,
        completedAt: new Date().toISOString(),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.rating !== undefined && { rating: data.rating }),
        updatedAt: new Date().toISOString(),
      }
      games[index] = updated
      return { ...updated }
    }
    return apiRequest(`/games/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async uncomplete(id) {
    if (!getToken()) {
      const index = games.findIndex(g => g.id === id)
      if (index === -1) throw new Error('Juego no encontrado')

      const updated = {
        ...games[index],
        completed: false,
        completedAt: null,
        notes: null,
        rating: null,
        updatedAt: new Date().toISOString(),
      }
      games[index] = updated
      return { ...updated }
    }
    return apiRequest(`/games/${id}/uncomplete`, { method: 'PATCH' })
  },
}
