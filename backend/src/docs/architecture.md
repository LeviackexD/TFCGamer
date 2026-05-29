# Architecture — Gamer Backlog API

## Stack
- **Runtime:** Node.js 24
- **Framework:** Express 4
- **ORM:** Prisma 6
- **Database:** MySQL 8 (Aiven)
- **Validation:** Zod 3
- **Module system:** ES modules (`import`/`export`)

## Folder structure
```
src/
  config/
    env.js                Variables de entorno con dotenv
    prisma.js             Cliente Prisma singleton
  docs/                   Documentación técnica
  lib/
    errors.js             Clases de error (AppError, NotFoundError, etc.)
  middlewares/
    auth.middleware.js         Protege rutas con JWT
    error.middleware.js        Captura errores (ZodError + AppError + genéricos)
    not-found.middleware.js    404 para rutas inexistentes
    rate-limit.middleware.js   Rate limiting para /login y /register
    not-found.middleware.js  404 para rutas inexistentes
  modules/
    auth/                 Módulo de autenticación
      auth.controller.js      Handlers HTTP
      auth.useCases.js        Lógica de negocio
      auth.service.js         Consultas Prisma
      auth.schemas.js         Schemas Zod
      auth.routes.js          Definición de rutas
    games/                Módulo de juegos
      games.controller.js     Handlers HTTP
      games.useCases.js       Lógica de negocio
      games.service.js        Consultas Prisma
      games.schemas.js        Schemas Zod
      games.routes.js         Definición de rutas
  routes/
    index.js              Router principal (/api/*)
  utils/
    game.js               Helpers de serialización
    jwt.js                signToken / verifyToken
    priority.js           Algoritmo de priorización
  app.js                  Configuración Express
  server.js               Punto de entrada
```

## Layered architecture
```
HTTP Request
    ↓
  routes/           → Define endpoints y aplica middlewares
    ↓
  controller/       → Valida input con Zod, llama al use case, responde
    ↓
  useCase/          → Lógica de negocio, orquestación, reglas
    ↓
  service/          → Solo consultas Prisma (find, create, update, delete)
    ↓
  prisma/           → Acceso a base de datos
```

## Request flow
1. Express recibe la request
2. `routes/index.js` enruta al módulo correspondiente
3. Middlewares globales (auth, parseo) se ejecutan
4. Controller valida la entrada con Zod (esquemas en `schemas`)
5. Controller llama al use case para la lógica de negocio
6. Use case orquesta validaciones y llama al service
7. Service interactúa con Prisma para CRUD
8. Controller formatea respuesta consistente (`{ success, data }`)
9. Si hay error, pasa al middleware de errores

## Error handling
- **ZodError:** Capturado por `error.middleware.js`, devuelve `400` con errores por campo
- **AppError:** Capturado por `error.middleware.js`, devuelve el código HTTP correspondiente
- **Not found:** Capturado por `not-found.middleware.js`, devuelve `404`
- **Errores genéricos:** Devuelven `500`

## Design decisions
- **Arquitectura en 3 capas:** controller → useCase → service. Separación clara entre validación HTTP, lógica de negocio y acceso a datos.
- **Autenticación JWT:** Todas las rutas de juegos protegidas. Cada usuario ve solo sus juegos.
- **tags como string:** Almacenados como texto separado por comas. Suficiente para filtros con `contains`.
- **ES modules nativos:** Sin TypeScript ni transpilación.
- **Validación centralizada:** Zod separado en schemas, no mezclado con lógica de negocio.
- **Respuestas consistentes:** Toda respuesta sigue `{ success: true, data }` o `{ success: false, message }`.
