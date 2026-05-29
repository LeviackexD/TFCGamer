# 🎮 TFC Gamer

**Gestiona y prioriza tu backlog de videojuegos** — una aplicación full-stack con autenticación JWT, CRUD completo de juegos, y algoritmo de prioridad inteligente.

## Stack

### Backend — `backend/`

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 24 | Runtime |
| Express | 4.21 | Framework web |
| Prisma | 6.1 | ORM |
| MySQL | 8 | Base de datos (Aiven) |
| Zod | 3.25 | Validación de esquemas |
| JWT | 9.0 | Autenticación |
| bcrypt | 6.0 | Hash de contraseñas |
| helmet | 8.1 | Seguridad HTTP |
| express-rate-limit | 8.5 | Rate limiting |

### Frontend — `frontend/`

| Tecnología | Versión | Uso |
|---|---|---|
| Vue | 3.5 | Framework UI |
| Vue Router | 4.6 | Enrutamiento |
| Vite | 8.0 | Bundler / dev server |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| @headlessui/vue | 1.7 | Modales accesibles |
| @vueuse/core | 14.3 | Utilidades reactivas |
| Zod | 3.25 | Validación (compartida) |

## Arquitectura

```
TFCGamer/
├── backend/                    # API REST
│   └── src/
│       ├── config/             # Env, Prisma client
│       ├── lib/                # Errores personalizados
│       ├── middlewares/        # Auth, error handler, rate-limit, 404
│       ├── modules/
│       │   ├── auth/           # Register, login, perfil
│       │   └── games/          # CRUD con prioridad
│       ├── routes/             # Router principal
│       ├── utils/              # JWT, prioridad, serializers
│       ├── app.js              # Config Express
│       └── server.js           # Entry point
└── frontend/                   # SPA Vue 3
    └── src/
        ├── components/
        │   ├── games/          # GameCard, GameFilters, GameForm, etc.
        │   ├── layout/         # AppLayout con scanlines retro
        │   └── ui/             # BaseButton, BaseInput, BaseModal, etc.
        ├── composables/        # useAuth, useGames
        ├── services/           # gameService, authService
        ├── views/              # 8 vistas (Home, Login, CRUD, etc.)
        └── router/             # 7 rutas con lazy loading
```

## Instalación

```bash
# Backend
cd backend
cp .env.example .env      # Configurar variables
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

## API Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | Rate-limited | Registrar usuario |
| POST | `/api/auth/login` | Rate-limited | Iniciar sesión |
| GET | `/api/auth/me` | JWT | Perfil del usuario |
| GET | `/api/auth/stats` | JWT | Estadísticas del usuario |
| GET | `/api/games` | JWT | Listar juegos (filtros + ordenación) |
| GET | `/api/games/:id` | JWT | Detalle del juego |
| POST | `/api/games` | JWT | Crear juego |
| PUT | `/api/games/:id` | JWT | Actualizar juego |
| DELETE | `/api/games/:id` | JWT | Eliminar juego |
| PATCH | `/api/games/:id/complete` | JWT | Marcar como completado |

## Frontend Routes

| Ruta | Vista | Auth |
|---|---|---|
| `/` | Home | — |
| `/login` | Login | — |
| `/registro` | Register | — |
| `/perfil` | Profile | Sí |
| `/juegos` | Listado + filtros | — |
| `/juegos/nuevo` | Crear juego | — |
| `/juegos/:id` | Detalle | — |
| `/juegos/edicion/:id` | Editar | — |

## Algoritmo de prioridad

```
priorityScore = metacriticScore / hoursToBeat
```

> A mayor puntuación y menos horas, mayor prioridad en tu backlog.

## Licencia

**Uso educativo** — Proyecto final de DAW + IA.
