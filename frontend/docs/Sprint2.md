# Sprint 2 — Frontend para múltiples gamers (opcional)

## Objetivo
Añadir autenticación y personalización para que cada usuario gestione su propio backlog.

---

## Pantallas a desarrollar (nuevas + actualizadas)

### Registro (`/registro`)
- Formulario para crear cuenta (email, alias, contraseña)
- Conectar con `POST /api/auth/register`

### Login (`/login`)
- Formulario para iniciar sesión (email, contraseña)
- Mostrar errores si las credenciales son incorrectas
- Guardar token JWT en localStorage
- Conectar con `POST /api/auth/login`

### Home actualizada (`/`)
- Incluir enlace a registro/login
- Ocultar el que corresponda según sesión

### Lista de juegos actualizada (`/juegos`)
- Mostrar solo juegos del usuario autenticado

### Creación de juego actualizada (`/juegos/nuevo`)
- Asociar juegos al usuario autenticado

### Perfil (`/perfil`) — **Opcional**
- Mostrar alias y email del usuario logueado
- Botón para cerrar sesión

---

## Funcionalidades requeridas

### Autenticación
- Flujo completo de registro y login
- Token almacenado en localStorage

### Protección de rutas
- Restringir acceso a lista, creación, edición a usuarios autenticados
- Usar navigation guards de Vue Router

### Manejo de sesiones
- Cerrar sesión de forma limpia (borrar token, redirigir)
- Mostrar información correcta según el usuario logueado
