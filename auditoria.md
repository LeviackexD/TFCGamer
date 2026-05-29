# Auditoría de código — Gamer Backlog

> Fecha: 28 mayo 2026
> Sprint 2 — Backend + Frontend

---

## 1. Seguridad

### Backend

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Helmet (HTTP headers seguros) | ✅ | `app.js:12` |
| CORS | ⚠️ Abierto | `app.use(cors())` sin opciones. En producción restringir: `{ origin: 'https://dominio.com' }` |
| Rate limiting (/login, /register) | ✅ | 10 solicitudes/minuto (`rate-limit.middleware.js`) |
| JWT | ✅ | Algoritmo HS256 por defecto, expiración configurable via env |
| bcrypt (contraseñas) | ✅ | 12 salt rounds (`auth.useCases.js:16`) |
| Errores sin leak de info | ✅ | "Credenciales incorrectas" sin revelar si email existe |
| Zod validation (entrada) | ✅ | Todos los endpoints validan con Zod |
| Owner filter (userId) | ✅ | Cada query filtra por `userId` del token |
| NoSQL / SQL injection | ✅ | Prisma ORM parametriza automáticamente |
| Prisma singleton | ✅ | `config/prisma.js` — instancia única |
| Rate limit en auth | ✅ | Solo en register/login |
| **⚠️ ID param sin validar** | ⚠️ Bajo | `parseId()` en controller hace `Number(req.params.id)` — si no es número, `NaN` pasa a Prisma que devuelve 404. No es crítico pero mejorable con `z.coerce.number()` |
| `.env` en .gitignore | ✅ | Asumido (revisar) |
| Morgan en producción | ⚠️ Info | `morgan('dev')` loguea en prod también. Usar `'combined'` o condicional |

### Frontend

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Token en localStorage | ⚠️ Medio | Almacenado en localStorage (vulnerable a XSS). Alternativa: httpOnly cookies con backend |
| Auto-logout 401 | ✅ | `gameService.js` interceptor + `useGames` redirige |
| No .env expuestos | ✅ | Sin variables de entorno en frontend |
| Fetch con credenciales | ✅ | No se incluyen credenciales automáticamente |

---

## 2. Estructura del proyecto

### Backend — MUY BUENA

```
src/
  config/         → env.js (dotenv), prisma.js (cliente singleton)
  docs/           → api-spec.md, architecture.md, data-model.md
  lib/            → AppError, NotFoundError, ConflictError, UnauthorizedError
  middlewares/    → auth, error, not-found, rate-limit
  modules/
    auth/         → routes, controller, useCases, service, schemas
    games/        → routes, controller, useCases, service, schemas
  routes/         → index.js (router principal)
  utils/          → jwt, priority, game (serialize)
  app.js          → configuración Express
  server.js       → punto de entrada
```

✅ Separación clara **controller → useCase → service**
✅ Módulos autocontenidos
✅ ES modules (`import`/`export`)
✅ Prisma centralizado

### Frontend — MUY BUENA

```
src/
  assets/         → main.css (global styles)
  components/
    games/        → GameCard, GameActions, GameForm, GameFilters, GameSort, EmptyState
    layout/       → AppLayout
    ui/           → BaseButton, BaseInput, BaseSelect, BaseModal
  composables/    → useAuth, useGames
  data/           → mockGames.js
  lib/            → schemas.js (Zod compartido)
  router/         → index.js + navigation guard
  services/       → authService, gameService (dual mock/API)
  views/          → HomePage, LoginPage, RegisterPage, ProfilePage,
                    GamesListPage, GameCreatePage, GameEditPage, GameDetailPage
```

---

## 3. Código y buenas prácticas

### Backend

| Aspecto | Estado | Observación |
|---------|--------|-------------|
| ES modules | ✅ | `import`/`export` en todo |
| Naming consistente | ✅ | camelCase funciones, PascalCase clases |
| Error handling | ✅ | try/catch en controllers + middleware global |
| Zod schemas separados | ✅ | Validación desacoplada en archivos `schemas.js` |
| Utilidades puras | ✅ | `priority.js` función pura, sin side effects |
| **⚠️ Not found en inglés** | ⚠️ Bajo | `not-found.middleware.js` dice "Route not found" — el resto de errores están en español |
| **⚠️ Sin tests** | ⚠️ Medio | No hay tests automatizados (unitarios ni integración) |
| **⚠️ Sin logging estructurado** | ⚠️ Bajo | Solo morgan para HTTP. Usar winston/pino si crece |
| **⚠️ Sin Docker** | ⚠️ Bajo | No hay Dockerfile ni docker-compose |

### Frontend

| Aspecto | Estado | Observación |
|---------|--------|-------------|
| Composition API | ✅ | Uso correcto de `ref`, `reactive`, `computed`, `onMounted` |
| Componentes sin lógica | ✅ | Vistas usan composables |
| Error handling en vistas | ✅ | try/catch en todas las operaciones asíncronas |
| Estado global mínimo | ✅ | `useAuth` y `useGames` con refs module-level (singleton) |
| Modo dual mock/API | ✅ | `gameService.js` transparente para componentes |
| **⚠️ Sin lazy loading de rutas** | ⚠️ Bajo | `import('@/views/...')` ya es lazy por defecto con Vite 👍 |
| **⚠️ Sin tests** | ⚠️ Medio | No hay tests (unitarios ni componentes) |

---

## 4. SEO (Frontend)

| Aspecto | Estado | Acción recomendada |
|---------|--------|--------------------|
| `<html lang="es">` | ✅ | |
| Viewport meta | ✅ | |
| Semantic HTML | ✅ | header, nav, main, footer, h1, h2, h3, section |
| **❌ Meta description** | ❌ | Añadir `<meta name="description">` en `index.html` |
| **❌ Document.title dinámico** | ❌ | Siempre "Gamer Backlog". Usar `document.title` en cada ruta o vue-router meta |
| **❌ Open Graph** | ❌ | No hay OG:title, OG:description, OG:image para compartir en redes |
| **❌ SSR / prerender** | ❌ | SPA pura. Buscadores ven página vacía sin JS (salvo Google). Considerar prerender o SSR en futuro |
| **⚠️ Sin scrollBehavior** | ⚠️ | Añadir `scrollBehavior: () => ({ top: 0 })` al router |
| **⚠️ Alt text** | ⚠️ | Solo íconos SVG, sin imágenes reales — no crítico ahora |
| **⚠️ Aria labels** | ⚠️ | Solo el hamburger menu tiene `aria-label`. GameActions no tiene |

---

## 5. Rendimiento

| Aspecto | Estado | Observación |
|---------|--------|-------------|
| Code splitting (Vite) | ✅ | Rutas lazy-loaded automáticamente |
| CSS purgado (Tailwind) | ✅ | Build produce ~27KB CSS |
| Bundle size | ✅ | ~107KB JS principal + chunks pequeños |
| **⚠️ Sin imagen en juegos** | ⚡ Oportunidad | Añadir portadas mejoraría UX (ver RAWg API abajo) |
| **⚠️ Sin caché de peticiones** | ⚠️ Bajo | Cada navegación a /juegos refetcha. Añadir caché simple con stale-while-revalidate si escala |

---

## 6. Resumen de acciones prioritarias

| Prioridad | Acción | Archivo |
|-----------|--------|---------|
| 🔴 Alta | Restringir CORS en producción | `backend/src/app.js:13` |
| 🟡 Media | Añadir scrollBehavior al router | `frontend/src/router/index.js` |
| 🟡 Media | Añadir document.title dinámico por ruta | `frontend/src/router/index.js` + vistas |
| 🟡 Media | Traducir "Route not found" a español | `backend/src/middlewares/not-found.middleware.js` |
| 🟡 Media | Añadir meta description | `frontend/index.html` |
| 🟡 Media | Validar ID param con Zod | `backend/src/modules/games/games.controller.js` |
| 🟢 Baja | Añadir aria-labels a icon buttons | `frontend/src/components/games/GameActions.vue` |
| 🟢 Baja | Añadir meta tags OG | `frontend/index.html` |
| 🟢 Baja | Mejorar logging (morgan condicional) | `backend/src/app.js` |
| 🟢 Baja | Tests básicos (al menos health check) | Nuevo archivo |

---

## 7. APIs gratuitas para portadas de videojuegos

### ✅ RAWg.io (RECOMENDADA)

| Aspecto | Detalle |
|---------|---------|
| **URL** | https://rawg.io/apidocs |
| **Plan gratuito** | 20,000 calls/mes (~667/día) |
| **API Key** | Gratuita, registro rápido |
| **Datos** | Portadas (1280×720, 640×480, 264×374), nombre, rating, géneros, plataformas, fechas |
| **Formato** | REST + JSON |
| **Usar desde** | Frontend (con proxy para ocultar API Key) o Backend |
| **Ejemplo** | `GET https://api.rawg.io/api/games?key=API_KEY&search=Portal+2` |
| **Cobertura** | ~500,000 juegos — la más completa |

### ✅ IGDB (Internet Game Database) via Twitch

| Aspecto | Detalle |
|---------|---------|
| **URL** | https://www.igdb.com/api |
| **Plan gratuito** | 100 calls/min, 50,000/mes aprox |
| **API Key** | Requiere cuenta Twitch + Client ID + token OAuth |
| **Datos** | Portadas (varios tamaños), capturas, videos, ratings |
| **Formato** | REST + JSON (PostgreSQL-like queries) |
| **Desventaja** | Setup más complejo (OAuth) |

### Recomendación

**RAWg.io** es la mejor opción:
- Setup mínimo (una API key)
- Datos de portada en múltiples tamaños
- Límite generoso (20K/mes)
- Endpoint de búsqueda para autocompletado

### Cómo integrar (idea general)

1. Añadir campo `imageUrl` opcional al modelo Game en Prisma
2. En el formulario de crear/editar juego, al escribir el nombre, buscar en RAWg
3. Mostrar resultados con portada pequeña para que el usuario seleccione
4. Guardar `imageUrl` en BD
5. Mostrar portada en GameCard y GameDetail
