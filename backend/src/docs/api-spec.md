# API Specification — Gamer Backlog API

## Base URL
```
http://localhost:4000/api
```

## Response format

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "name", "message": "El nombre es obligatorio" }
  ]
}
```

---

## Endpoints

### Health check

`GET /api/health`

**Response:**
```json
{
  "success": true,
  "data": { "status": "ok" }
}
```

---

### Create game

`POST /api/games`

**Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| name | string | sí | Nombre del juego |
| category | string | sí | Categoría (ej: Aventura, RPG, Shooter) |
| tags | string | sí | Etiquetas separadas por comas |
| metacriticScore | number (0-100) | sí | Puntuación Metacritic |
| hoursToBeat | number (>0) | sí | Horas estimadas para completarlo |
| completed | boolean | no (default: false) | Completado o no |
| notes | string | no | Notas adicionales |
| rating | number (1-5) | no | Valoración personal |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "The Legend of Zelda",
    "category": "Aventura",
    "tags": "accion,aventura",
    "metacriticScore": 97,
    "hoursToBeat": 55,
    "completed": false,
    "completedAt": null,
    "notes": null,
    "rating": null,
    "priorityScore": 1.76,
    "createdAt": "2026-05-28T16:15:40.582Z",
    "updatedAt": "2026-05-28T16:15:40.582Z"
  }
}
```

---

### List games

`GET /api/games`

**Query params (todos opcionales):**
| Parámetro | Valores | Descripción |
|-----------|---------|-------------|
| search | string | Búsqueda parcial por nombre |
| category | string | Filtro por categoría exacta |
| tag | string | Búsqueda parcial en tags |
| completed | `true` / `false` | Filtrar por estado de completado |
| sortBy | `priorityScore`, `metacriticScore`, `hoursToBeat`, `name` | Campo de ordenación (default: priorityScore) |
| order | `asc`, `desc` | Dirección de ordenación (default: desc) |

**Response (200):**
```json
{
  "success": true,
  "data": [
    { ... juego ... }
  ]
}
```

---

### Get game by ID

`GET /api/games/:id`

**Response (200):** Game object
**Response (404):**
```json
{
  "success": false,
  "message": "Juego no encontrado"
}
```

---

### Update game

`PUT /api/games/:id`

**Body:** Mismos campos que create, todos opcionales (partial). Si se envían `metacriticScore` o `hoursToBeat`, se recalcula `priorityScore`.

**Response (200):** Game object actualizado
**Response (404):**
```json
{
  "success": false,
  "message": "Juego no encontrado"
}
```

---

### Delete game

`DELETE /api/games/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Juego eliminado correctamente"
  }
}
```
**Response (404):**
```json
{
  "success": false,
  "message": "Juego no encontrado"
}
```

---

### Complete game

`PATCH /api/games/:id/complete`

**Body:**
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| notes | string | no | Notas al completar |
| rating | number (1-5) | no | Valoración personal |

Establece `completed: true` y `completedAt` con la fecha actual automáticamente.

**Response (200):** Game object con completed=true y fecha de finalización
**Response (404):**
```json
{
  "success": false,
  "message": "Juego no encontrado"
}
```
