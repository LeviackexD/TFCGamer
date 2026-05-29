# AGENTS.md — Frontend

## Proyecto
Gamer Backlog — app Vue 3 con estética retro-pixel para gestionar y priorizar videojuegos.
Backend en `../backend/` — ver `../backend/AGENTS.md`.

## Objetivo actual
Sprint 1 completado ✅ — Frontend con 5 vistas, datos mock, filtros/ordenación, CRUD completo, modal de completado con valoración.

## Stack
- Vue 3 (Composition API + `<script setup>`)
- Vue Router 4 (lazy loading, 5 rutas)
- Tailwind CSS 3 (colores retro, animaciones pixel)
- @headlessui/vue (modales accesibles)
- @vueuse/core (useDebounce para búsqueda)

## Estructura
```
frontend/
  docs/
    Sprint1.md           Requisitos del Sprint 1
    Sprint2.md           Requisitos del Sprint 2
    Sprint1FrontEnd.md   Documentación del Sprint 1 completado
  src/
    assets/
      main.css           Tailwind directives + variables retro
    components/
      games/
        GameCard.vue      Tarjeta individual
        GameFilters.vue   Búsqueda + filtros categoría/estado
        GameSort.vue      Ordenación
        GameForm.vue      Formulario crear/editar
        PriorityBadge.vue Badge de prioridad
        GameActions.vue   Iconos de acción
        EmptyState.vue    Estado vacío
      layout/
        AppLayout.vue     Header + footer + scanlines
      ui/
        BaseButton.vue    Botón con variantes
        BaseInput.vue     Input retro
        BaseSelect.vue    Select retro
        BaseModal.vue     Modal accesible
    composables/
      useGames.js         Estado reactivo + operaciones CRUD
    data/
      mockGames.js        8 juegos de ejemplo
    router/
      index.js            Rutas: /, /juegos, /juegos/nuevo, /juegos/:id, /juegos/edicion/:id
    services/
      gameService.js      Mock CRUD (misma interfaz que futura API)
    views/
      HomePage.vue        Presentación
      GamesListPage.vue   Listado + filtros + modales
      GameCreatePage.vue  Crear juego
      GameEditPage.vue    Editar juego
      GameDetailPage.vue  Detalle completo
    App.vue
    main.js
```

## Rutas
| Ruta | Vista | Descripción |
|------|-------|-------------|
| / | HomePage | Presentación + CTA |
| /juegos | GamesListPage | Listado con filtros/ordenación |
| /juegos/nuevo | GameCreatePage | Formulario crear |
| /juegos/edicion/:id | GameEditPage | Formulario editar |
| /juegos/:id | GameDetailPage | Detalle del juego |

## Endpoints de la API (backend)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/health | No | Health check |
| POST | /api/auth/register | No (rate-limited) | Registrar usuario |
| POST | /api/auth/login | No (rate-limited) | Login |
| GET | /api/auth/me | Sí | Perfil del usuario autenticado |
| GET | /api/games | Sí | Listar con filtros y ordenación |
| GET | /api/games/:id | Sí | Obtener juego por ID |
| POST | /api/games | Sí | Crear juego |
| PUT | /api/games/:id | Sí | Actualizar juego |
| DELETE | /api/games/:id | Sí | Eliminar juego |
| PATCH | /api/games/:id/complete | Sí | Marcar como completado |

## Formato de datos
```json
{
  "id": 1,
  "name": "Journey",
  "category": "Indie",
  "tags": "aventura,arte,exploracion",
  "metacriticScore": 92,
  "hoursToBeat": 3,
  "completed": true,
  "completedAt": "2026-05-20T14:30:00.000Z",
  "notes": "Increíble experiencia.",
  "rating": 5,
  "priorityScore": 30.67
}
```

## Estrategia mock → API real
`services/gameService.js` tiene la misma interfaz que el fetch real.
Cuando se conecte la API, solo cambia ese archivo. Los componentes no se tocan.

## Comandos útiles
- `npm run dev` — entorno desarrollo (localhost:5173)
- `npm run build` — build producción
- `npm run preview` — previsualizar build
