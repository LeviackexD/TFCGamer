# Gamer Backlog — Frontend

SPA en Vue 3 con estética retro-pixel para gestionar y priorizar tu backlog de videojuegos.

## Stack

- **Framework:** Vue 3.5 (Composition API + `<script setup>`)
- **Routing:** Vue Router 4.6 (lazy loading, guards de autenticación)
- **Bundler:** Vite 8
- **Estilos:** Tailwind CSS 3.4 (colores retro, animaciones pixel)
- **UI:** @headlessui/vue (modales accesibles)
- **Utilidades:** @vueuse/core (useDebounce)
- **Validación:** Zod 3.25

## Rutas

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | HomePage | Presentación + CTA |
| `/login` | LoginPage | Inicio de sesión |
| `/registro` | RegisterPage | Registro de usuario |
| `/perfil` | ProfilePage | Perfil y estadísticas (auth) |
| `/juegos` | GamesListPage | Listado con filtros y ordenación |
| `/juegos/nuevo` | GameCreatePage | Crear juego |
| `/juegos/:id` | GameDetailPage | Detalle del juego |
| `/juegos/edicion/:id` | GameEditPage | Editar juego |

## Comandos

```bash
npm install
npm run dev       # Desarrollo (localhost:5173)
npm run build     # Build producción
npm run preview   # Previsualizar build
```

## Estrategia mock → API

`src/services/gameService.js` tiene la misma interfaz que el fetch real. Cuando se conecte la API, solo cambia ese archivo.
