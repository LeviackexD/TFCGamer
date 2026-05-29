# Gamer Backlog API

API REST para gestionar y priorizar tu backlog de videojuegos con autenticación JWT.

## Stack

- **Runtime:** Node.js 24
- **Framework:** Express 4.21
- **ORM:** Prisma 6.1 / MySQL 8 (Aiven)
- **Validación:** Zod 3.25
- **Auth:** JWT + bcrypt
- **Seguridad:** helmet, rate-limiting, CORS

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | Rate-limited | Registrar usuario |
| POST | `/api/auth/login` | Rate-limited | Iniciar sesión |
| GET | `/api/auth/me` | JWT | Perfil del usuario |
| GET | `/api/auth/stats` | JWT | Estadísticas del usuario |
| GET | `/api/games` | JWT | Listar con filtros (search, category, tag, completed) y ordenación (sortBy, order) |
| GET | `/api/games/:id` | JWT | Detalle del juego |
| POST | `/api/games` | JWT | Crear juego (calcula priorityScore) |
| PUT | `/api/games/:id` | JWT | Actualizar juego |
| DELETE | `/api/games/:id` | JWT | Eliminar juego |
| PATCH | `/api/games/:id/complete` | JWT | Marcar completado con notas + rating |

## Priority algorithm

```
priorityScore = metacriticScore / hoursToBeat
```

## Comandos

```bash
npm install
npm run dev          # Desarrollo (hot-reload)
npm run start        # Producción
npx prisma generate  # Regenerar cliente
npx prisma migrate dev  # Migraciones
```
