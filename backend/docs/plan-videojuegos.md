# Plan de Implementación — Backlog de Videojuegos

> Proyecto final del curso EOI — Desarrollo de Aplicaciones Web con IA  
> Stack: Nuxt 4 · MongoDB · Pinia · TailwindCSS · JWT · Zod  
> Deadline: 02/06/2026 a las 13:30

---

## Resumen del proyecto

Una app en Nuxt 4 que permite a gamers gestionar su backlog de videojuegos. Los usuarios pueden registrar juegos con datos como categoría, etiquetas, puntuación Metacritic y horas estimadas. La app aplica un algoritmo de priorización (puntuación / horas) para sugerir qué jugar primero. Sprint 1 es sin autenticación (usuario único). Sprint 2 añade registro/login y cuentas privadas.

---

## Fase 0 — Setup del proyecto (2–3 horas)

### 1. Crear el proyecto Nuxt 4

```bash
pnpm create nuxt@latest backlog-gamer
cd backlog-gamer
```

Durante el asistente de creación, elegir:
- TypeScript: NO
- Tailwind CSS: sí 
- ESLint: sí

### 2. Instalar dependencias

```bash
# Base de datos y auth
pnpm add mongoose bcrypt jsonwebtoken zod

# Frontend utilities
pnpm add @vueuse/core pinia

# Dev
pnpm add -D @nuxtjs/tailwindcss
```

### 3. Variables de entorno

Crear `.env` en la raíz:

```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/backlog-gamer
JWT_SECRET=una_clave_secreta_muy_larga_y_random
JWT_EXPIRES_IN=7d
```

Crear `.env.example` con los mismos campos pero sin valores reales (este sí se sube a GitHub).

Registrar en `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    public: {}
  },
  modules: ['@nuxtjs/tailwindcss'],
})
```

### 4. Conectar MongoDB — plugin de servidor

Crear `server/plugins/mongoose.ts`:

```typescript
import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  try {
    await mongoose.connect(config.mongodbUri)
    console.log('MongoDB conectado correctamente')
  } catch (error) {
    console.error('Error conectando a MongoDB:', error)
    process.exit(1)
  }
})
```

### 5. Estructura de carpetas completa

```
backlog-gamer/
├── server/
│   ├── plugins/
│   │   └── mongoose.ts
│   ├── middleware/
│   │   └── auth.ts              ← verifica JWT en rutas protegidas
│   ├── models/
│   │   ├── User.ts
│   │   └── Game.ts
│   ├── utils/
│   │   └── jwt.ts               ← helpers sign/verify
│   └── api/
│       ├── auth/
│       │   ├── register.post.ts
│       │   └── login.post.ts
│       └── games/
│           ├── index.get.ts
│           ├── index.post.ts
│           ├── [id].get.ts
│           ├── [id].put.ts
│           ├── [id].delete.ts
│           └── [id]/
│               └── complete.patch.ts
├── pages/
│   ├── index.vue                ← Home
│   ├── login.vue
│   ├── registro.vue
│   └── juegos/
│       ├── index.vue            ← Lista
│       ├── nuevo.vue            ← Crear
│       ├── edicion/
│       │   └── [id].vue         ← Editar
│       └── [id].vue             ← Detalle (opcional)
├── components/
│   ├── GameCard.vue
│   ├── GameForm.vue
│   ├── GameFilters.vue
│   └── AppNavbar.vue
├── stores/
│   ├── auth.ts
│   └── games.ts
├── middleware/
│   └── auth.ts                  ← protección de rutas Vue (cliente)
├── composables/
│   └── useGames.ts
└── schemas/
    ├── game.schema.ts           ← Zod
    └── auth.schema.ts
```

**Verificación:** ejecutar `pnpm dev` y comprobar que arranca sin errores con la BD conectada.

---

## Fase 1 — Modelos de datos (1 hora)

### Modelo Game

`server/models/Game.ts`:

```typescript
import mongoose, { Schema } from 'mongoose'

const gameSchema = new Schema({
  nombre:         { type: String, required: true, trim: true },
  categoria:      { type: String, required: true },
  etiquetas:      [{ type: String, trim: true }],
  metacritic:     { type: Number, min: 0, max: 100, default: null },
  horas:          { type: Number, min: 0, default: null },
  completado:     { type: Boolean, default: false },
  fechaCompletado:{ type: Date, default: null },
  notas:          { type: String, default: '' },
  valoracion:     { type: Number, min: 1, max: 5, default: null },
  prioridad:      { type: Number, default: 0 },   // metacritic / horas
  userId:         { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true })

// Índice para búsquedas frecuentes
gameSchema.index({ userId: 1, completado: 1 })
gameSchema.index({ nombre: 'text' })

export const Game = mongoose.models.Game || mongoose.model('Game', gameSchema)
```

### Modelo User

`server/models/User.ts`:

```typescript
import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  alias:    { type: String, required: true, trim: true }
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model('User', userSchema)
```

### Esquemas Zod

`schemas/game.schema.ts`:

```typescript
import { z } from 'zod'

export const gameSchema = z.object({
  nombre:    z.string().min(1, 'El nombre es obligatorio').max(200),
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  etiquetas: z.array(z.string()).default([]),
  metacritic:z.number().min(0).max(100).nullable().optional(),
  horas:     z.number().min(0).nullable().optional(),
  notas:     z.string().max(1000).optional(),
  valoracion:z.number().min(1).max(5).nullable().optional(),
})

export const completeGameSchema = z.object({
  notas:     z.string().max(1000).optional(),
  valoracion:z.number().min(1).max(5).nullable().optional(),
})

export type GameInput = z.infer<typeof gameSchema>
```

`schemas/auth.schema.ts`:

```typescript
import { z } from 'zod'

export const registerSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  alias:    z.string().min(2, 'Mínimo 2 caracteres').max(30),
})

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})
```

---

## Fase 2 — API Backend Sprint 1 (3–4 horas)

En Sprint 1 la API no requiere autenticación. Los endpoints gestionan juegos sin asociarlos a usuarios.

### El algoritmo de priorización

Función reutilizable en cualquier endpoint:

```typescript
function calcularPrioridad(metacritic?: number | null, horas?: number | null): number {
  if (!metacritic || !horas || horas === 0) return 0
  return parseFloat((metacritic / horas).toFixed(2))
}
```

### GET /api/games — Listar con filtros y ordenación

`server/api/games/index.get.ts`:

```typescript
import { Game } from '~/server/models/Game'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const filter: Record<string, any> = {}

  if (query.nombre)    filter.nombre = { $regex: query.nombre, $options: 'i' }
  if (query.categoria) filter.categoria = query.categoria
  if (query.etiqueta)  filter.etiquetas = { $in: [query.etiqueta] }
  if (query.completado !== undefined) filter.completado = query.completado === 'true'

  const ordenarPor = query.ordenar as string || 'prioridad'
  const orden = query.asc === 'true' ? 1 : -1

  const sortOptions: Record<string, 1 | -1> = {}
  if (['prioridad', 'metacritic', 'horas', 'nombre', 'createdAt'].includes(ordenarPor)) {
    sortOptions[ordenarPor] = orden
  } else {
    sortOptions['prioridad'] = -1
  }

  const games = await Game.find(filter).sort(sortOptions).lean()
  return games
})
```

### POST /api/games — Crear juego

`server/api/games/index.post.ts`:

```typescript
import { Game } from '~/server/models/Game'
import { gameSchema } from '~/schemas/game.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = gameSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: JSON.stringify(result.error.flatten().fieldErrors) })
  }

  const data = result.data
  const prioridad = data.metacritic && data.horas
    ? parseFloat((data.metacritic / data.horas).toFixed(2))
    : 0

  const game = await Game.create({ ...data, prioridad })
  return game
})
```

### PUT /api/games/[id] — Editar juego

`server/api/games/[id].put.ts`:

```typescript
import { Game } from '~/server/models/Game'
import { gameSchema } from '~/schemas/game.schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const result = gameSchema.partial().safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: JSON.stringify(result.error.flatten().fieldErrors) })
  }

  const data = result.data
  if (data.metacritic !== undefined || data.horas !== undefined) {
    const existing = await Game.findById(id).lean()
    const metacritic = data.metacritic ?? existing?.metacritic
    const horas = data.horas ?? existing?.horas
    ;(data as any).prioridad = metacritic && horas ? parseFloat((metacritic / horas).toFixed(2)) : 0
  }

  const game = await Game.findByIdAndUpdate(id, data, { new: true })
  if (!game) throw createError({ statusCode: 404, message: 'Juego no encontrado' })
  return game
})
```

### DELETE /api/games/[id]

`server/api/games/[id].delete.ts`:

```typescript
import { Game } from '~/server/models/Game'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const game = await Game.findByIdAndDelete(id)
  if (!game) throw createError({ statusCode: 404, message: 'Juego no encontrado' })
  return { message: 'Juego eliminado correctamente' }
})
```

### PATCH /api/games/[id]/complete — Marcar como completado

`server/api/games/[id]/complete.patch.ts`:

```typescript
import { Game } from '~/server/models/Game'
import { completeGameSchema } from '~/schemas/game.schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const result = completeGameSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: JSON.stringify(result.error.flatten().fieldErrors) })
  }

  const game = await Game.findByIdAndUpdate(
    id,
    {
      completado: true,
      fechaCompletado: new Date(),
      ...result.data
    },
    { new: true }
  )

  if (!game) throw createError({ statusCode: 404, message: 'Juego no encontrado' })
  return game
})
```

---

## Fase 3 — Frontend Sprint 1 (4–5 horas)

### Store de juegos con Pinia

`stores/games.ts`:

```typescript
import { defineStore } from 'pinia'
import type { GameInput } from '~/schemas/game.schema'

export const useGamesStore = defineStore('games', () => {
  const games = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchGames(params = {}) {
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams(params as any).toString()
      games.value = await $fetch(`/api/games?${query}`)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function createGame(data: GameInput) {
    const game = await $fetch('/api/games', { method: 'POST', body: data })
    games.value.unshift(game)
    return game
  }

  async function updateGame(id: string, data: Partial<GameInput>) {
    const game = await $fetch(`/api/games/${id}`, { method: 'PUT', body: data })
    const idx = games.value.findIndex(g => g._id === id)
    if (idx !== -1) games.value[idx] = game
    return game
  }

  async function deleteGame(id: string) {
    await $fetch(`/api/games/${id}`, { method: 'DELETE' })
    games.value = games.value.filter(g => g._id !== id)
  }

  async function completeGame(id: string, data = {}) {
    const game = await $fetch(`/api/games/${id}/complete`, { method: 'PATCH', body: data })
    const idx = games.value.findIndex(g => g._id === id)
    if (idx !== -1) games.value[idx] = game
    return game
  }

  return { games, loading, error, fetchGames, createGame, updateGame, deleteGame, completeGame }
})
```

### Páginas a crear

**`pages/index.vue`** — Home:
- Nombre y descripción de la app (el nombre épico que hayas elegido)
- Dos botones: "Ver mis juegos" → `/juegos` y "Añadir juego" → `/juegos/nuevo`
- Explicación del algoritmo de priorización

**`pages/juegos/index.vue`** — Lista de juegos:
- Llama a `fetchGames()` en `onMounted`
- Sección de filtros: input de nombre, select de categoría, select de etiqueta, checkbox completados
- Select de ordenación: prioridad, metacritic, horas, nombre
- Listado de tarjetas `<GameCard>` con acciones editar, borrar, marcar completado
- Si la lista está vacía, mensaje invitando a añadir el primer juego

**`pages/juegos/nuevo.vue`** — Crear:
- Monta `<GameForm>` en modo creación
- Al guardar llama a `createGame()` y redirige a `/juegos`

**`pages/juegos/edicion/[id].vue`** — Editar:
- En `onMounted` carga el juego con `$fetch('/api/games/' + route.params.id)`
- Monta `<GameForm>` con los datos prellenados
- Al guardar llama a `updateGame()` y redirige a `/juegos`

### Componente GameForm

`components/GameForm.vue` — mismo componente para crear y editar, recibe prop `game` opcional:

```vue
<script setup>
const props = defineProps({ game: { type: Object, default: null } })
const emit = defineEmits(['submit'])

const form = reactive({
  nombre: props.game?.nombre ?? '',
  categoria: props.game?.categoria ?? '',
  etiquetas: props.game?.etiquetas?.join(', ') ?? '',
  metacritic: props.game?.metacritic ?? null,
  horas: props.game?.horas ?? null,
  notas: props.game?.notas ?? '',
  valoracion: props.game?.valoracion ?? null,
})

function handleSubmit() {
  emit('submit', {
    ...form,
    etiquetas: form.etiquetas.split(',').map(e => e.trim()).filter(Boolean)
  })
}
</script>
```

Campos del formulario: nombre, categoría (input o select predefinido), etiquetas (texto separado por comas), puntuación Metacritic (número 0-100), horas estimadas, notas, valoración.

---

## Fase 4 — Auth Backend Sprint 2 (2–3 horas)

### Helper JWT

`server/utils/jwt.ts`:

```typescript
import jwt from 'jsonwebtoken'

export function signToken(payload: object): string {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
}

export function verifyToken(token: string): any {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.jwtSecret)
}
```

### POST /api/auth/register

`server/api/auth/register.post.ts`:

```typescript
import bcrypt from 'bcrypt'
import { User } from '~/server/models/User'
import { registerSchema } from '~/schemas/auth.schema'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = registerSchema.safeParse(body)
  if (!result.success) throw createError({ statusCode: 400, message: JSON.stringify(result.error.flatten().fieldErrors) })

  const { email, password, alias } = result.data
  const exists = await User.findOne({ email })
  if (exists) throw createError({ statusCode: 409, message: 'El email ya está registrado' })

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await User.create({ email, password: hashedPassword, alias })

  const token = signToken({ id: user._id, email: user.email, alias: user.alias })
  return { token, user: { id: user._id, email: user.email, alias: user.alias } }
})
```

### POST /api/auth/login

`server/api/auth/login.post.ts`:

```typescript
import bcrypt from 'bcrypt'
import { User } from '~/server/models/User'
import { loginSchema } from '~/schemas/auth.schema'
import { signToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = loginSchema.safeParse(body)
  if (!result.success) throw createError({ statusCode: 400, message: 'Datos inválidos' })

  const { email, password } = result.data
  const user = await User.findOne({ email })
  if (!user) throw createError({ statusCode: 401, message: 'Credenciales incorrectas' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw createError({ statusCode: 401, message: 'Credenciales incorrectas' })

  const token = signToken({ id: user._id, email: user.email, alias: user.alias })
  return { token, user: { id: user._id, email: user.email, alias: user.alias } }
})
```

### Middleware de servidor para rutas protegidas

`server/middleware/auth.ts`:

```typescript
import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
  const protectedRoutes = ['/api/games']
  const path = getRequestURL(event).pathname

  if (!protectedRoutes.some(r => path.startsWith(r))) return

  const auth = getRequestHeader(event, 'Authorization')
  if (!auth?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Token requerido' })
  }

  try {
    const decoded = verifyToken(auth.split(' ')[1])
    event.context.user = decoded
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido o expirado' })
  }
})
```

Una vez activado este middleware, añadir `userId: event.context.user.id` en los endpoints POST y filtrar por `userId` en GET.

---

## Fase 5 — Auth Frontend Sprint 2 (2–3 horas)

### Store de auth con Pinia

`stores/auth.ts`:

```typescript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<{ id: string; email: string; alias: string } | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(data: { token: string; user: any }) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('auth-token', data.token)
    localStorage.setItem('auth-user', JSON.stringify(data.user))
  }

  function loadFromStorage() {
    const t = localStorage.getItem('auth-token')
    const u = localStorage.getItem('auth-user')
    if (t && u) { token.value = t; user.value = JSON.parse(u) }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    navigateTo('/login')
  }

  async function register(data: { email: string; password: string; alias: string }) {
    const res = await $fetch('/api/auth/register', { method: 'POST', body: data })
    setAuth(res as any)
  }

  async function login(data: { email: string; password: string }) {
    const res = await $fetch('/api/auth/login', { method: 'POST', body: data })
    setAuth(res as any)
  }

  return { token, user, isAuthenticated, setAuth, loadFromStorage, logout, register, login }
})
```

### Middleware de ruta cliente

`middleware/auth.ts`:

```typescript
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (process.client) auth.loadFromStorage()
  if (!auth.isAuthenticated) return navigateTo('/login')
})
```

Aplicar en las páginas protegidas:

```vue
<script setup>
definePageMeta({ middleware: 'auth' })
</script>
```

### Páginas de auth

**`pages/login.vue`** — formulario email/password, llama a `auth.login()`, muestra errores, redirige a `/juegos`.

**`pages/registro.vue`** — formulario email/alias/password, llama a `auth.register()`, redirige a `/juegos`.

Actualizar `pages/index.vue` para mostrar enlace login/registro si no autenticado, y enlace al perfil + logout si autenticado.

---

## Fase 6 — Despliegue (1 hora)

### MongoDB Atlas (gratuito)

1. Crear cuenta en mongodb.com/atlas
2. Crear cluster gratuito (M0)
3. Crear usuario de base de datos
4. Whitelist IP: `0.0.0.0/0` para producción
5. Copiar connection string → variable `MONGODB_URI`

### Vercel

```bash
pnpm build
# o directamente conectar el repo de GitHub a Vercel
```

En Vercel Dashboard → Settings → Environment Variables, añadir:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

---

## Checklist de entrega

### Sprint 1 (obligatorio)
- [ ] Proyecto Nuxt arrancando sin errores
- [ ] MongoDB conectado (local y Atlas)
- [ ] GET /api/games con filtros y ordenación funcionales
- [ ] POST /api/games con cálculo de prioridad
- [ ] PUT /api/games/:id
- [ ] DELETE /api/games/:id
- [ ] PATCH /api/games/:id/complete con fecha automática
- [ ] Página Home con nombre de la app y navegación
- [ ] Página Lista con filtros y acciones (editar, borrar, completar)
- [ ] Formulario de creación funcional
- [ ] Formulario de edición funcional
- [ ] Validación con Zod en todos los endpoints

### Sprint 2 (opcional pero recomendado)
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] Middleware de servidor protegiendo /api/games
- [ ] Cada juego asociado a su userId
- [ ] Store de auth con Pinia
- [ ] Middleware de ruta cliente
- [ ] Páginas login y registro
- [ ] Logout funcional
- [ ] Desplegado en Vercel con variables de entorno

---

## Estimación de tiempo total

| Fase | Tiempo estimado |
|------|----------------|
| Setup | 2–3 h |
| Modelos de datos | 1 h |
| API Sprint 1 | 3–4 h |
| Frontend Sprint 1 | 4–5 h |
| Auth Backend Sprint 2 | 2–3 h |
| Auth Frontend Sprint 2 | 2–3 h |
| Despliegue | 1 h |
| **Total** | **15–20 h** |

Sprint 1 completo es alcanzable en un día intenso de trabajo (8–10 h). Sprint 2 añade otras 5–7 h.
