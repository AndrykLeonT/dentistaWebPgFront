# Resumen: Implementación del flujo de Login

## ¿Qué hace el flujo de login?

Cuando un usuario escribe su usuario y contraseña y presiona "Iniciar sesión", el sistema:

1. Envía esos datos al servidor (backend Laravel)
2. El servidor responde con un token de acceso y la información del empleado
3. El frontend guarda esa información y redirige al usuario al dashboard (o a cambiar contraseña si es la primera vez)

---

## Archivos involucrados y qué hace cada uno

### 1. `src/views/auth/LoginView.vue` — La pantalla de login
Es el formulario que ve el usuario. Contiene los campos de usuario y contraseña, el botón de ingreso y el mensaje de error si las credenciales son incorrectas.

**Lo que hace:**
- Cuando el usuario presiona el botón, llama a la función `login` del store de autenticación
- Mientras espera la respuesta, desactiva el botón y muestra "Iniciando sesión…"
- Si el servidor responde con error 401 (credenciales incorrectas), muestra el mensaje de error debajo del formulario
- Si hay otro tipo de error (servidor caído, sin conexión), muestra un mensaje genérico

### 2. `src/stores/auth.ts` — El cerebro de la autenticación
Es el store de Pinia que maneja todo el estado relacionado con la sesión del usuario. Aquí se toman las decisiones: guardar el token, saber si el usuario está autenticado, redirigir, etc.

**Lo que hace la función `login()`:**
- Hace la llamada al endpoint `POST /api/login` con usuario y contraseña
- Guarda el token y los datos del empleado en el estado de la aplicación y en `localStorage` (para que la sesión persista si el usuario recarga la página)
- Si el servidor indica que el usuario debe cambiar su contraseña (`requiresPasswordChange: true`), redirige a `/change-password`
- Si no, redirige al `/dashboard`

**También maneja:**
- `logout()` — cierra sesión llamando al backend y limpia el estado local
- `clearSession()` — limpia la sesión localmente sin llamar al backend (lo usa el interceptor cuando el token expira)
- `fetchMe()` — obtiene los datos actualizados del empleado autenticado

### 3. `src/services/api.ts` — El cliente HTTP
Es la instancia de Axios configurada para todas las llamadas al backend. Actúa como intermediario entre el frontend y la API.

**Lo que hace:**
- Apunta a `http://localhost:8000/api` como URL base (o a `VITE_API_URL` si está definida en el `.env`)
- En cada petición, inyecta automáticamente el token de autenticación en el header `Authorization: Bearer <token>`
- Si el servidor responde con 401 (sesión expirada) en cualquier ruta que NO sea `/login`, limpia la sesión y manda al usuario a la pantalla de login
- Si el servidor responde con 403 (sin permisos), redirige a `/forbidden`

### 4. `src/services/auth.ts` — Funciones de autenticación
Contiene funciones sueltas para llamar a los endpoints relacionados con autenticación (`/login`, `/logout`, `/me`, `/change-password`). En el flujo principal de login el store usa su propia llamada directamente, pero este archivo existe para uso independiente si se necesita.

### 5. `.env` — Variables de entorno del frontend *(archivo creado en esta sesión)*
Archivo de configuración que le dice al frontend dónde está corriendo el backend.

```
VITE_API_URL=http://localhost:8000/api
```

---

## Qué se corrigió en esta sesión

### El problema
El store esperaba que el backend enviara la respuesta **envuelta** en una clave `data`, así:
```json
{
  "data": {
    "token": "1|abc123...",
    "empleado": { ... },
    "requiresPasswordChange": false
  }
}
```

Pero el backend de Laravel devuelve la respuesta **plana**, sin esa envoltura:
```json
{
  "token": "1|abc123...",
  "empleado": { ... },
  "requiresPasswordChange": false
}
```

Esto causaba que `data.data.token` fuera `undefined` y el login fallara.

### La corrección

**`src/stores/auth.ts`** — Se cambió cómo se leen los datos de la respuesta:
```typescript
// Antes (incorrecto)
token.value = data.data.token
empleado.value = data.data.empleado

// Después (correcto)
token.value = data.token
empleado.value = data.empleado
```

**`src/services/auth.ts`** — Se corrigió el tipo genérico de la llamada axios para que coincida con la respuesta real del backend.

**`.env`** — Se creó el archivo con la URL del backend para que Vite la tome al compilar.

---

## Flujo completo resumido

```
Usuario llena el formulario
        ↓
LoginView.vue llama a auth.login()
        ↓
auth store hace POST /api/login  →  Backend Laravel
        ↓
Backend responde con { token, empleado, requiresPasswordChange }
        ↓
Store guarda token y empleado en memoria y localStorage
        ↓
¿requiresPasswordChange?
   Sí → redirige a /change-password
   No → redirige a /dashboard
```
