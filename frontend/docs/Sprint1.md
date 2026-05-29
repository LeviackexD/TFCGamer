# Sprint 1 — Frontend para un único gamer (obligatorio)

## Objetivo
Desarrollar la interfaz para un usuario único, sin necesidad de autenticación.
Construir las funcionalidades principales de gestión de juegos conectadas a la API.

---

## Pantallas a desarrollar

### Home (`/`)
- Breve introducción al propósito de la aplicación
- Botones o enlaces para acceder a la lista de juegos o crear uno nuevo

### Lista de juegos (`/juegos`)
- Mostrar los juegos en un listado
- Ordenación (puntuación, juegos terminados / en proceso)
- Filtros (nombre, categoría, etiqueta(s))
- Acciones disponibles (editar, borrar, marcar como completado)

### Creación de juego (`/juegos/nuevo`)
- Formulario con los campos del juego + botón "Crear"

### Edición de juego (`/juegos/edicion/:id`)
- Formulario precargado con datos del juego + botón "Guardar"

### Detalle de juego (`/juegos/:id`) — **Opcional**
- Mostrar información detallada del juego

---

## Funcionalidades requeridas

### Conexión con la API
- Crear, listar, editar y borrar juegos
- Ordenar y filtrar resultados
- Marcar juegos como completados (fecha automática)

### Interfaz
- Interfaz limpia y funcional
- Componentes reutilizables (formularios, listas, tarjetas)
- Estilo básico con Tailwind CSS

---

## Datos del formulario de juego

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| name | string | sí |
| category | string | sí |
| tags | string (separado por comas) | sí |
| metacriticScore | number (0-100) | sí |
| hoursToBeat | number (>0) | sí |
| completed | boolean | no (default: false) |
| notes | string | no |
| rating | number (1-5) | no |
