# Sprint 1 — Gamer Backlog Frontend

> Frontend Vue 3 con estética retro-pixel para gestionar tu backlog de videojuegos
>
> Stack: Vue 3 · Vite · Tailwind CSS · Vue Router · @headlessui/vue · @vueuse/core

---

## Índice

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Capturas de pantalla recomendadas](#4-capturas-de-pantalla-recomendadas)
5. [Configuración inicial](#5-configuración-inicial)
6. [Estética retro-pixel](#6-estética-retro-pixel)
7. [Componentes](#7-componentes)
8. [Vistas y rutas](#8-vistas-y-rutas)
9. [Mock data y servicios](#9-mock-data-y-servicios)
10. [Funcionalidades implementadas](#10-funcionalidades-implementadas)
11. [Guía paso a paso](#11-guía-paso-a-paso)
12. [Mejoras futuras](#12-mejoras-futuras)

---

## 1. Resumen del proyecto

Frontend para Gamer Backlog, una aplicación que permite a gamers gestionar su backlog de videojuegos. Los usuarios pueden registrar juegos con datos como categoría, etiquetas, puntuación Metacritic y horas estimadas. La app aplica un algoritmo de priorización (puntuación / horas) para sugerir qué jugar primero.

**Sprint 1** es una interfaz para un único gamer, sin autenticación, con datos mock que posteriormente se conectarán a la API REST del backend.

---

## 2. Stack tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Vue 3 | 3.5+ | Framework frontend (Composition API + `<script setup>`) |
| Vite | 8 | Build tool y dev server |
| Tailwind CSS | 3 | Estilos utilitarios |
| Vue Router | 4 | Enrutamiento SPA |
| @headlessui/vue | 1 | Componentes accesibles (modales) |
| @vueuse/core | 12 | Utilidades (debounce) |

---

## 3. Estructura del proyecto

```
frontend/
├── docs/
│   ├── Sprint1.md          ← Requisitos del Sprint 1 (del PDF)
│   ├── Sprint2.md          ← Requisitos del Sprint 2 (del PDF)
│   └── Sprint1FrontEnd.md  ← ← Este documento
├── src/
│   ├── assets/
│   │   └── main.css        ← Tailwind directives + variables retro-pixel
│   ├── components/
│   │   ├── games/
│   │   │   ├── EmptyState.vue     ← Estado vacío con ilustración
│   │   │   ├── GameActions.vue    ← Botones editar/borrar/completar
│   │   │   ├── GameCard.vue       ← Tarjeta individual
│   │   │   ├── GameFilters.vue    ← Búsqueda + filtros categoría/estado
│   │   │   ├── GameForm.vue       ← Formulario reutilizable crear/editar
│   │   │   ├── GameSort.vue       ← Selector de ordenación
│   │   │   └── PriorityBadge.vue  ← Badge de prioridad con colores
│   │   ├── layout/
│   │   │   └── AppLayout.vue      ← Layout general (header + footer + scanlines)
│   │   └── ui/
│   │       ├── BaseButton.vue     ← Botón retro (variantes: primary/danger/ghost/success)
│   │       ├── BaseInput.vue      ← Input pixel-style
│   │       ├── BaseModal.vue      ← Modal accesible (Headless UI)
│   │       └── BaseSelect.vue     ← Select pixel-style
│   ├── composables/
│   │   └── useGames.js            ← Estado reactivo + operaciones CRUD
│   ├── data/
│   │   └── mockGames.js           ← 8 juegos de ejemplo con datos realistas
│   ├── router/
│   │   └── index.js               ← 5 rutas con lazy loading
│   ├── services/
│   │   └── gameService.js         ← Mock CRUD (misma interfaz que el futuro fetch)
│   ├── views/
│   │   ├── GameCreatePage.vue     ← /juegos/nuevo
│   │   ├── GameDetailPage.vue     ← /juegos/:id (detalle completo)
│   │   ├── GameEditPage.vue       ← /juegos/edicion/:id
│   │   ├── GamesListPage.vue      ← /juegos (listado + filtros + modales)
│   │   └── HomePage.vue           ← / (presentación)
│   ├── App.vue                    ← Layout + router-view
│   └── main.js                    ← Entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js             ← Colores retro, fuentes pixel, animaciones
└── vite.config.js                 ← Alias @, proxy /api → backend
```

---

## 4. Capturas de pantalla recomendadas

> Las siguientes capturas ilustran el estado actual del frontend tras el Sprint 1.
> Se recomienda capturarlas con la ventana del navegador a 1280×800px para consistencia.

| # | Vista | Descripción | Ruta |
|---|-------|-------------|------|
| 1 | **HomePage** | Pantalla de inicio con personaje pixel art animado, eslogan, 3 pasos y CTA | `/` |
| 2 | **GamesList (con juegos)** | Listado con 8 juegos mock, filtros desplegados, ordenación activa | `/juegos` |
| 3 | **GamesList (vacío)** | Estado vacío con botón de añadir | `/juegos` (sin juegos) |
| 4 | **GameCreate** | Formulario de creación con todos los campos | `/juegos/nuevo` |
| 5 | **GameEdit** | Formulario precargado con datos de un juego existente | `/juegos/edicion/1` |
| 6 | **GameDetail** | Vista detalle con stats, valoración, acciones completar/editar/borrar | `/juegos/1` |
| 7 | **Modal completar** | Modal de completado con selector de estrellas y notas | `/juegos` → click ✓ |
| 8 | **Modal eliminar** | Modal de confirmación de eliminación | `/juegos` → click 🗑 |

### Efectos visuales a capturar

- **CRT power-on:** Capturar los primeros 1.2s al cargar cualquier página
- **Glitch text:** Hover sobre el logo `&lt;GB/&gt;` en el header
- **Pixel character float:** Animación de flotación del personaje en HomePage
- **Scanlines:** Hacer zoom a cualquier superficie oscura para ver las líneas CRT
- **Button press:** Click en botón NES para ver el efecto de profundidad 3D
- **Route transition:** Navegar entre vistas para capturar el slide + blur

---

## 5. Configuración inicial

### 5.1 Instalación

```bash
cd frontend
npm install
npm run dev
```

El servidor de desarrollo arranca en `http://localhost:5173`.

### 5.2 Proxy al backend

`vite.config.js` redirige las llamadas a `/api/*` al backend en `http://localhost:4000`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true
    }
  }
}
```

Cuando se conecte la API real, las peticiones a `/api/games` funcionarán sin cambios en el frontend.

---

## 6. Estética retro-pixel

### Paleta de colores

| Elemento | Código | Uso |
|----------|--------|-----|
| **Fondo** | `#0f0e17` | Background general |
| **Superficies** | `#1a1932` | Tarjetas, paneles |
| **Bordes** | `#2d2b55` | Contornos pixel |
| **Cian (acento)** | `#48dbfb` | Botones principales, enlaces, glows |
| **Rojo (acento)** | `#ff6b6b` | Botones de peligro, errores |
| **Amarillo (acento)** | `#feca57` | Estrellas, prioridad media |
| **Verde (acento)** | `#5fcf80` | Completado, prioridad alta |
| **Texto claro** | `#fffffe` | Títulos, cabeceras |
| **Texto oscuro** | `#a7a9be` | Cuerpo, descripciones |

### Tipografía

| Fuente | Uso | Peso |
|--------|-----|------|
| `Press Start 2P` | Títulos, etiquetas, botones | píxel perfecto |
| `VT323` | Cuerpo, párrafos, detalles | legible, monoespaciada |

### Efectos CSS

- **CRT overlay:** Scanlines horizontales + viñeta radial + parpadeo (flicker) con `@keyframes`
- **CRT power-on:** Animación de encendido al cargar la página (barrido vertical + brillo)
- **Pixel borders:** `box-shadow` sin blur para efecto pixel perfecto
- **Glitch text:** Efecto de desplazamiento RGB al hover en textos decorativos
- **Neon glow:** `text-shadow` con múltiples capas para efecto neón (cyan, rojo, amarillo, verde)
- **Route transitions:** Animación `slideIn` con blur al cambiar de vista
- **Pixel loader:** 5 cuadrados animados para estados de carga
- **Custom scrollbar:** Scrollbar estilizada con colores retro

### Componentes destacados

| Componente | Estilo |
|------------|--------|
| **Navbar** | Logo `&lt;GB/&gt;` con glitch text, enlace NUEVO rojo |
| **BaseButton** | Estilo cartucho NES: gradiente, `border-b-4` para efecto 3D, active: translate +2px |
| **Input/Select** | `input-retro`: fondo oscuro, borde pixel, focus con glow cyan |
| **GameCard** | Pixel-border con glow animado, stats en grid, tags con `#` |
| **Modal** | Headless UI Dialog con backdrop blur + animación fade/scale |
| **Footer** | Eslogan con estrellas decorativas amarillas |

---

## 7. Componentes

### UI Components (`src/components/ui/`)

- **BaseButton** — Variantes: `primary` (cian), `danger` (rojo), `ghost` (borde), `success` (verde). Tamaños: `sm`, `md`, `lg`.
- **BaseInput** — Input con label, placeholder, estado de error y estilos retro.
- **BaseSelect** — Select con label y placeholder. Soporta options como strings o como `{value, label}`.
- **BaseModal** — Modal con animación fade/scale, backdrop blur. Usa `@headlessui/vue` para accesibilidad.

### Game Components (`src/components/games/`)

- **GameCard** — Tarjeta con nombre, categoría, tags, prioridad, acciones. Opacidad reducida si completado.
- **GameFilters** — Input de búsqueda con debounce (300ms), selects de categoría y estado. Botón limpiar.
- **GameSort** — Botones de ordenación por prioridad, puntuación, horas, nombre. Botón asc/desc.
- **GameForm** — Formulario compartido entre crear y editar. Validación completa en frontend.
- **PriorityBadge** — Badge con color según nivel: verde (>10), amarillo (>5), gris.
- **GameActions** — Iconos: ver detalle, editar, completar, eliminar.
- **EmptyState** — Mensaje ilustrativo cuando no hay juegos.

### Layout Components (`src/components/layout/`)

- **AppLayout** — Header con logo + navegación, scanlines overlay, footer con eslogan.

---

## 8. Vistas y rutas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | HomePage | Presentación con logo, eslogan, 3 pasos, botones CTA |
| `/juegos` | GamesListPage | Listado completo con filtros, ordenación, modales de borrar/completar |
| `/juegos/nuevo` | GameCreatePage | Formulario vacío para crear juego |
| `/juegos/edicion/:id` | GameEditPage | Formulario precargado para editar |
| `/juegos/:id` | GameDetailPage | Vista detalle con toda la info + acciones |

Todas las rutas usan **lazy loading** (`() => import(...)`) para code splitting.

---

## 9. Mock data y servicios

### Mock data (`src/data/mockGames.js`)

8 juegos de ejemplo con datos realistas: Journey, Zelda BOTW, Portal 2, The Witcher 3, Celeste, Hollow Knight, Edith Finch, Doom (2016).

Cada juego sigue el mismo formato que devuelve la API del backend:

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
  "priorityScore": 30.67,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Servicio mock (`src/services/gameService.js`)

Implementa las mismas operaciones que la API real:

| Método | Descripción |
|--------|-------------|
| `list(filters)` | Filtra y ordena según search, category, tag, completed, sortBy, order |
| `getById(id)` | Busca por ID, lanza error si no existe |
| `create(data)` | Crea juego, calcula priorityScore, añade al inicio del array |
| `update(id, data)` | Actualiza campos, recalcula prioridad |
| `delete(id)` | Elimina juego |
| `complete(id, data)` | Marca completado con fecha auto, notas y rating |

**Nota:** El filtro `completed` recibe el valor como string (`"true"`/`"false"`) desde el select, y `matchesCompleted` lo convierte a booleano para comparar con `game.completed`.

### Composable (`src/composables/useGames.js`)

Provee estado reactivo compartido y operaciones que:
1. Llaman al servicio correspondiente
2. Refrescan la lista automáticamente tras cada operación
3. Mantienen filtros reactivos sincronizados

Cuando se conecte la API real, solo cambia `gameService.js` — ningún componente se modifica.

---

## 10. Funcionalidades implementadas

- [x] **Listar juegos** con ordenación (prioridad, puntuación, horas, nombre)
- [x] **Filtrar** por nombre (búsqueda con debounce), categoría, estado completado
- [x] **Crear juego** con formulario completo + validación frontend
- [x] **Editar juego** con formulario precargado
- [x] **Eliminar juego** con modal de confirmación
- [x] **Marcar completado** con modal: fecha auto, valoración (1-5 estrellas), notas opcionales
- [x] **Detalle de juego** con toda la información
- [x] **Algoritmo de priorización** visual: badge con colores según nivel
- [x] **Componentes reutilizables**: formulario, botones, inputs, modales
- [x] **Estética retro-pixel** cohesiva con scanlines, tipografía pixel, neones

---

## 11. Guía paso a paso

### Paso 1: Crear proyecto Vite + Vue 3

```bash
npm create vite@latest . -- --template vue
```

### Paso 2: Instalar dependencias

```bash
npm install
npm install vue-router@4 @headlessui/vue @vueuse/core
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### Paso 3: Configurar Tailwind

`tailwind.config.js` con colores personalizados (`retro-*`), fuentes (`Press Start 2P`, `VT323`), animaciones (`pulse-glow`, `fade-in`, `slide-up`).

### Paso 4: Configurar Vite

`vite.config.js` con alias `@` y proxy a backend.

### Paso 5: Crear estructura

```
src/assets/       ← main.css
src/components/   ← UI, layout, game components
src/composables/  ← useGames.js
src/data/         ← mockGames.js
src/router/       ← index.js
src/services/     ← gameService.js
src/views/        ← 5 vistas
src/App.vue       ← Layout wrapper
src/main.js       ← Entry point
```

### Paso 6: Implementar en orden

1. Estructura base (App.vue, main.js, router)
2. Mock data y servicio
3. Composable useGames
4. UI components (BaseButton, BaseInput, BaseSelect, BaseModal)
5. Layout (AppLayout)
6. Game components (PriorityBadge, GameCard, GameActions, GameFilters, GameSort, GameForm, EmptyState)
7. Vistas (HomePage, GamesListPage, GameCreatePage, GameEditPage, GameDetailPage)

### Paso 7: Verificar

```bash
npm run dev     # Entorno de desarrollo
npm run build   # Producción
```

---

## 12. Mejoras futuras

| Mejora | Prioridad | Descripción |
|--------|-----------|-------------|
| **Conexión API real** | Alta | Reemplazar `gameService.js` mock por fetch a backend real |
| **Autenticación JWT** | Alta | Login/registro con token, rutas protegidas |
| **Paginación** | Media | Carga de juegos por lotes cuando el backlog crezca |
| **Sound effects** | Baja | Efectos de sonido 8-bit al navegar (hover, click, completar) |
| **Modo oscuro/claro** | Baja | Variante clara de la estética retro |
| **Export backlog** | Baja | Exportar lista de juegos a CSV/JSON |

---

> **Fin del Sprint 1 Frontend** — Interfaz retro-pixel funcional con datos mock.
>
> Siguiente: Sprint 2 — Autenticación con JWT y conexión con API real.
