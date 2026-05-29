# Data Model — Gamer Backlog API

## Entity: Game

Represents a video game in the user's backlog.

### Prisma schema
```prisma
model Game {
  id               Int       @id @default(autoincrement())
  name             String
  category         String
  tags             String    @db.Text
  metacriticScore  Int
  hoursToBeat      Float
  completed        Boolean   @default(false)
  completedAt      DateTime?
  notes            String?   @db.Text
  rating           Int?
  priorityScore    Float     @default(0)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

### Fields

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int (PK, autoincrement) | Identificador único |
| name | String | Nombre del juego |
| category | String | Categoría (ej: RPG, Shooter, Aventura) |
| tags | String (Text) | Etiquetas separadas por comas (ej: "accion,zombies,estrategia") |
| metacriticScore | Int (0-100) | Puntuación de Metacritic |
| hoursToBeat | Float | Horas estimadas para completar |
| completed | Boolean | Indica si está completado |
| completedAt | DateTime? | Fecha de finalización |
| notes | String? (Text) | Notas opcionales |
| rating | Int? (1-5) | Valoración personal |
| priorityScore | Float | Prioridad calculada (metacriticScore / hoursToBeat) |
| createdAt | DateTime | Fecha de creación (automática) |
| updatedAt | DateTime | Fecha de última modificación (automática) |

### Algoritmo de prioridad

```
priorityScore = metacriticScore / hoursToBeat

Ejemplos:
  Juego A: 90 / 10 = 9.00
  Juego B: 85 / 5  = 17.00  ← mayor prioridad
```

### Indexes

- `@id` (autoincrement): Primary key
- No additional indexes in Sprint 1. En Sprint 2 se añadirá `userId` y sus índices.

### SQL equivalente (MySQL)
```sql
CREATE TABLE Game (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(191) NOT NULL,
  category         VARCHAR(191) NOT NULL,
  tags             TEXT NOT NULL,
  metacriticScore  INT NOT NULL,
  hoursToBeat      DOUBLE NOT NULL,
  completed        BOOLEAN NOT NULL DEFAULT false,
  completedAt      DATETIME(3) NULL,
  notes            TEXT NULL,
  rating           INT NULL,
  priorityScore    DOUBLE NOT NULL DEFAULT 0,
  createdAt        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt        DATETIME(3) NOT NULL
);
```
