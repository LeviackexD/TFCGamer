# Gamer Backlog API

API REST para gestionar y priorizar tu backlog de videojuegos. Sprint 1: usuario único sin autenticación.

## Stack
- **Runtime:** Node.js 24
- **Framework:** Express 4
- **ORM:** Prisma 6
- **Database:** MySQL 8 (Aiven)
- **Validation:** Zod 3
- **Module system:** ES modules (`import`/`export`)

## Estructura
```
src/
  config/           Configuración (env, prisma)
  docs/             Documentación técnica
  middlewares/      Error handler, 404
  modules/games/    Módulo de juegos (routes, controller, service, schemas)
  routes/           Router principal
  utils/            Algoritmo de priorización
  app.js            Configuración Express
  server.js         Punto de entrada
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/games | Listar con filtros y ordenación |
| GET | /api/games/:id | Obtener juego por ID |
| POST | /api/games | Crear juego |
| PUT | /api/games/:id | Actualizar juego |
| DELETE | /api/games/:id | Eliminar juego |
| PATCH | /api/games/:id/complete | Marcar como completado |

## Comandos

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo con hot-reload
npm run start        # Producción
npx prisma generate  # Regenerar cliente Prisma
npx prisma migrate dev  # Ejecutar migraciones
```

## Algoritmo de prioridad

```
priorityScore = metacriticScore / hoursToBeat
```

A mayor puntuación y menos horas, mayor prioridad.
