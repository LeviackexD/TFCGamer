const API = '/api'

async function request(endpoint, options = {}) {
  let res

  try {
    res = await fetch(`${API}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
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
    throw err
  }

  return data.data
}

export const authService = {
  async register(input) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async login(input) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async getMe(token) {
    return request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async getStats(token) {
    return request('/auth/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
