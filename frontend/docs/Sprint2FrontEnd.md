# Sprint 2 — Autenticación y API real (Frontend)

> Frontend Vue 3 con autenticación JWT, conexión a API real y Zod validation
>
> Stack: Vue 3 · Vite · Tailwind CSS · Vue Router · Zod · @headlessui/vue · @vueuse/core

---

## Índice

1. [Resumen del Sprint 2](#1-resumen-del-sprint-2)
2. [Nuevas dependencias](#2-nuevas-dependencias)
3. [Estructura actualizada](#3-estructura-actualizada)
4. [Autenticación](#4-autenticación)
5. [Protección de rutas](#5-protección-de-rutas)
6. [Validación con Zod](#6-validación-con-zod)
7. [Conexión a API real](#7-conexión-a-api-real)
8. [Nuevas vistas](#8-nuevas-vistas)
9. [Actualización de vistas existentes](#9-actualización-de-vistas-existentes)
10. [Capturas de pantalla recomendadas](#10-capturas-de-pantalla-recomendadas)
11. [Funcionalidades implementadas](#11-funcionalidades-implementadas)

---

## 1. Resumen del Sprint 2

En este sprint conectamos el frontend con la API real del backend y añadimos autenticación completa:

- **Registro de usuarios** con validación Zod (mismos schemas que el backend)
- **Login** con token JWT almacenado en localStorage
- **Protección de rutas** mediante navigation guards de Vue Router
- **Conexión a API real** para todas las operaciones CRUD de juegos
- **Fallback a datos mock** cuando no hay token (modo desarrollo)
- **Perfil de usuario** con cierre de sesión
- **Manejo de errores** de la API (400 Zod, 401, 409, 404)

---

## 2. Nuevas dependencias

```bash
npm install zod
```

| Paquete | Versión | Uso |
|---------|---------|-----|
| zod | 3.x | Validación de formularios (mismos schemas que el backend) |

---

## 3. Estructura actualizada

```
frontend/
├── docs/
│   ├── Sprint1FrontEnd.md     ← Sprint 1
│   └── Sprint2FrontEnd.md     ← ← Este documento
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── components/
│   │   ├── games/
│   │   ├── layout/
│   │   │   └── AppLayout.vue  ← Header con auth (login/logout/perfil)
│   │   └── ui/
│   ├── composables/
│   │   ├── useGames.js        ← Sin cambios (sigue misma interfaz)
│   │   └── useAuth.js         ← NUEVO: estado auth + login/register/logout
│   ├── data/
│   │   └── mockGames.js       ← Se conserva como fallback
│   ├── lib/
│   │   └── schemas.js         ← NUEVO: Schemas Zod (register, login, createGame, etc.)
│   ├── router/
│   │   └── index.js           ← +3 rutas nuevas + navigation guard
│   ├── services/
│   │   ├── authService.js     ← NUEVO: fetch a /api/auth/*
│   │   └── gameService.js     ← Migrado a fetch real + fallback mock
│   ├── views/
│   │   ├── LoginPage.vue      ← NUEVO: /login
│   │   ├── RegisterPage.vue   ← NUEVO: /registro
│   │   ├── ProfilePage.vue    ← NUEVO: /perfil
│   │   └── ... (resto sin cambios)
│   ├── App.vue                ← checkAuth() en onMounted
│   └── main.js                ← Sin cambios
```

---

## 4. Autenticación

### 4.1 Auth Service — `src/services/authService.js`

Cliente HTTP para los endpoints de autenticación:

```javascript
export const authService = {
  async register(input) { /* POST /api/auth/register */ },
  async login(input)    { /* POST /api/auth/login */ },
  async getMe(token)    { /* GET  /api/auth/me (Bearer token) */ },
}
```

### 4.2 Auth Composable — `src/composables/useAuth.js`

Estado reactivo compartido en toda la app:

| Prop/Método | Descripción |
|-------------|-------------|
| `user` | Ref con `{ id, email, alias }` del usuario autenticado |
| `token` | Ref con el token JWT |
| `isAuthenticated` | Computed: `!!token.value` |
| `login(input)` | Login, guarda token en localStorage |
| `register(input)` | Registro, guarda token en localStorage |
| `logout()` | Limpia token y usuario, redirige a `/login` |
| `checkAuth()` | Verifica token vigente con `GET /me`, hace logout si expiró |

### 4.3 Flujo de autenticación

1. App.vue monta → llama `checkAuth()` → si hay token en localStorage, verifica con backend
2. Si token válido → usuario autenticado en toda la app
3. Si token expirado → logout automático → redirige a `/login`
4. Formularios de login/register llaman al service → guardan token → redirigen a `/juegos`

---

## 5. Protección de rutas

### 5.1 Navigation guard en `src/router/index.js`

```javascript
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
```

### 5.2 Rutas

| Ruta | Auth | Acceso |
|------|------|--------|
| `/` | No | Público |
| `/login` | No | Solo no autenticados (redirige a /juegos si ya logueado) |
| `/registro` | No | Solo no autenticados |
| `/juegos/*` | Sí | Requiere token |
| `/perfil` | Sí | Requiere token |

### 5.3 Header dinámico en AppLayout

Si autenticado → muestra JUEGOS, + NUEVO, alias, SALIR
Si no → muestra ENTRAR, REGISTRO

---

## 6. Validación con Zod

### 6.1 Schemas — `src/lib/schemas.js`

Mismos schemas que el backend para consistencia total:

```javascript
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  alias: z.string().min(2, 'El alias debe tener al menos 2 caracteres').max(30),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const createGameSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  tags: z.string().min(1, 'Añade al menos una etiqueta'),
  metacriticScore: z.coerce.number().int().min(0).max(100),
  hoursToBeat: z.coerce.number().positive('Debe ser un número positivo'),
})

export const updateGameSchema = createGameSchema.partial()
export const completeGameSchema = z.object({
  notes: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
})
```

### 6.2 Uso en formularios

```javascript
function validate() {
  const result = registerSchema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach(e => {
      errors[e.path[0]] = e.message
    })
    return false
  }
  return true
}
```

### 6.3 Manejo de errores de la API

Cuando el backend devuelve errores Zod (400), se mapean a los campos del formulario:

```javascript
if (err.errors) {
  err.errors.forEach(e => {
    if (e.field in errors) errors[e.field] = e.message
  })
}
```

---

## 7. Conexión a API real

### 7.1 gameService.js — Dual mode

El servicio de juegos funciona en dos modos:

| Modo | Condición | Comportamiento |
|------|-----------|----------------|
| **API real** | `localStorage` tiene token | Hace fetch a `/api/games/*` con `Authorization: Bearer <token>` |
| **Mock** | No hay token | Usa datos mock (modo desarrollo) |

Esto permite:
- Desarrollo sin backend corriendo
- Transición gradual: mientras no hay auth, todo funciona con datos mock
- Al hacer login, automáticamente empieza a usar la API real

### 7.2 Formato de respuestas

El backend devuelve:
```json
// Éxito
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [{ "field": "name", "message": "..." }] }
```

### 7.3 Manejo de errores

| Código | Causa | Acción |
|--------|-------|--------|
| 400 | Validación Zod | Mostrar errores por campo |
| 401 | No autorizado | Logout automático |
| 404 | No encontrado | Mostrar mensaje de error |
| 409 | Email duplicado | Mostrar error en formulario |
| 500 | Error interno | Mostrar mensaje genérico |

---

## 8. Nuevas vistas

### 8.1 LoginPage (`/login`)

- Formulario: email, contraseña
- Validación Zod en cliente antes de enviar
- Captura errores de API (401 → "Email o contraseña incorrectos")
- Enlace a registro

### 8.2 RegisterPage (`/registro`)

- Formulario: email, alias, contraseña
- Validación Zod en cliente (email, min 8 chars, alias 2-30 chars)
- Captura errores de API (409 → "Ese email ya está registrado")
- Enlace a login

### 8.3 ProfilePage (`/perfil`)

- Muestra alias y email del usuario autenticado
- Botón "Cerrar sesión" que limpia token y redirige a `/login`

---

## 9. Actualización de vistas existentes

### AppLayout.vue

El header ahora muestra contenido dinámico según autenticación:

| Estado | Elementos visibles |
|--------|--------------------|
| Autenticado | JUEGOS, + NUEVO, alias, SALIR |
| No autenticado | ENTRAR, REGISTRO |

### App.vue

Llama a `checkAuth()` en `onMounted` para verificar si hay sesión activa al cargar la app.

### router/index.js

3 nuevas rutas (`/login`, `/registro`, `/perfil`) + navigation guard que protege `/juegos/*` y `/perfil`.

### gameService.js

Migrado de mock puro a dual mode: si hay token usa fetch real, si no usa datos mock.

---

## 10. Capturas de pantalla recomendadas

| # | Vista | Descripción | Ruta |
|---|-------|-------------|------|
| 1 | **Register** | Formulario de registro con campos email, alias, contraseña | `/registro` |
| 2 | **Register error** | Error de validación Zod (email inválido, password corta) | `/registro` |
| 3 | **Login** | Formulario de inicio de sesión | `/login` |
| 4 | **Login error** | Error 401 credenciales incorrectas | `/login` |
| 5 | **Header autenticado** | Header con alias y botón SALIR | `/juegos` |
| 6 | **Profile** | Perfil con alias, email y botón cerrar sesión | `/perfil` |
| 7 | **Lista con API** | Listado de juegos conectado a API real | `/juegos` |
| 8 | **Error 404** | Juego no encontrado desde la API | `/juegos/999` |

---

## 11. Funcionalidades implementadas

- [x] **Registro** con validación Zod y captura de errores (409 email duplicado)
- [x] **Login** con almacenamiento de token JWT en localStorage
- [x] **Cierre de sesión** limpio (borra token, redirige)
- [x] **Protección de rutas** con navigation guard
- [x] **Auto-logout** si token expirado o inválido
- [x] **Header dinámico** según estado de autenticación
- [x] **Perfil de usuario** con alias, email y cerrar sesión
- [x] **Conexión a API real** con fallback a datos mock
- [x] **Validación Zod** en frontend (mismos schemas que backend)
- [x] **Manejo de errores de API** mapeados a formularios
- [x] **Redirecciones automáticas** (login → juegos, logout → login)

---

> **Fin del Sprint 2 Frontend** — Autenticación JWT y conexión a API real completadas.
