Actúa como agente de desarrollo dentro de Antigravity IDE usando Gemini 3.1 Pro High.

FASE: 01 - Autenticación y seguridad

OBJETIVO DE ESTA FASE:
Validar, ajustar y documentar el flujo de autenticación y seguridad del frontend DentalSys usando el contrato real del backend Laravel Sanctum.

Esta fase debe dejar correctamente preparado:
1. Login.
2. Persistencia de sesión.
3. Consulta del usuario autenticado con `/me`.
4. Logout.
5. Cambio de contraseña.
6. Manejo de errores 401, 403 y 422.
7. Guards de rutas privadas.
8. Validación básica de roles sin modificar módulos de compañeros.
9. Documentación completa de lo realizado.

IMPORTANTE:
En esta fase NO debes implementar pacientes, pagos, cortes, comprobantes ni inventario.
Tampoco debes modificar módulos de compañeros:
- NO modificar `src/views/usuarios/`.
- NO modificar `src/views/agenda/`.
- NO modificar `src/views/servicios/`.
- NO modificar lógica interna de empleados, citas o servicios.
- Solo puedes leer esos módulos si necesitas confirmar rutas o roles, pero no cambiar su comportamiento.

CONTEXTO DE LA FASE ANTERIOR:
La Fase 00 dejó documentado:
- Rama: `main`.
- Commit inicial observado: `6e5f7bf`.
- URL API detectada: `http://localhost:8000/api`.
- `npm run type-check`: exitoso.
- `npx eslint . --no-cache`: exitoso.
- `npm run build`: exitoso.
- `npm run build-only`: exitoso.
- Backend no disponible durante esa revisión porque `curl` a `localhost:8000/api` y `dentistawebpg.test/api` falló por timeout.
- Los reportes se guardan en `docs/modulos/`.

Antes de modificar, revisa:
- `docs/modulos/00-plan-restante.md`
- `docs/INDICE.md`, si existe
- `docs/modulos/00-general.md`, si existe
- `docs/modulos/01-validacion-integraciones.md`, si existe
- `docs/modulos/00-datos-prueba.md`, si existe

CONTRATO BACKEND PARA AUTH:
El backend usa Laravel Sanctum con tokens Bearer.

Base URL probable:
- `http://localhost:8000/api`
- o `http://dentistawebpg.test/api`

El frontend debe usar `VITE_API_URL` desde `.env`.

Headers requeridos en rutas privadas:
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json

Endpoints de autenticación:
1. POST `/api/login`
   - Público.
   - Body:
     {
       "correoElectronico": "admin@...",
       "password": "..."
     }
   - Respuesta 200:
     {
       "token": "...",
       "empleado": { ... }
     }
   - Errores esperados:
     - 401: credenciales incorrectas o cuenta inactiva.
     - 422: falta correo, password u otro error de validación.

2. GET `/api/me`
   - Privado.
   - Requiere Bearer token.
   - Respuesta 200:
     Datos del empleado autenticado o wrapper equivalente según backend.

3. POST `/api/logout`
   - Privado.
   - Requiere Bearer token.
   - Respuesta esperada:
     200 o 204.
   - Debe invalidar/revocar el token actual.

4. POST `/api/change-password`
   - Privado.
   - Body:
     {
       "current_password": "...",
       "new_password": "...",
       "new_password_confirmation": "..."
     }
   - Respuesta 200: éxito.
   - Errores esperados:
     - 401 si no hay sesión.
     - 422 si la contraseña actual es incorrecta, falta confirmación o no cumple reglas.

Manejo de errores esperado:
- 401:
  - Limpiar sesión local.
  - Eliminar token del storage.
  - Redirigir a `/login`.
  - No mostrar un modal intrusivo si es expiración de sesión.
- 403:
  - La sesión es válida, pero el rol no tiene permiso.
  - Mostrar feedback claro, preferentemente toast: "No tienes los permisos necesarios."
  - En navegación directa puede redirigir a `/forbidden`.
- 404:
  - Mostrar recurso no encontrado o toast si es acción aislada.
- 422:
  - Parsear `error.response.data.errors`.
  - Mostrar errores debajo del input correspondiente.
- 500+:
  - Mostrar error general.
  - No dejar la UI como si la operación hubiera sido exitosa.

REGLAS DE CALIDAD:
- No usar `any`.
- No usar `@ts-ignore`.
- No usar `eslint-disable`.
- No agregar mocks nuevos.
- No dejar `console.log`.
- No dejar TODOs nuevos sin documentar.
- No cambiar diseño visual salvo que sea necesario para mostrar errores, loading o estados seguros.
- No hacer llamadas HTTP directas desde vistas si ya existe o corresponde crear servicio.
- Usar Axios centralizado.
- Mantener separación entre:
  - views
  - services
  - stores
  - types
  - router
  - layouts
  - components
- Mantener Vue 3 Composition API.
- Usar TypeScript estricto.

ARCHIVOS PROBABLES A REVISAR:
- `.env`
- `src/services/api.ts`
- `src/services/auth.ts`
- `src/stores/auth.ts`
- `src/router/index.ts`
- `src/layouts/MainLayout.vue`
- `src/views/auth/LoginView.vue`
- `src/views/auth/ChangePasswordView.vue`
- `src/views/auth/ForgotPasswordView.vue`
- `src/views/auth/SendMailView.vue`
- `src/composables/useApiError.ts`, si existe
- `src/types/index.ts`

ARCHIVOS QUE PUEDES MODIFICAR EN ESTA FASE:
- `src/services/api.ts`
- `src/services/auth.ts`
- `src/stores/auth.ts`
- `src/router/index.ts`, solo para guards relacionados con auth/roles.
- `src/layouts/MainLayout.vue`, solo para logout/sidebar relacionado con sesión.
- `src/views/auth/LoginView.vue`
- `src/views/auth/ChangePasswordView.vue`
- `src/views/auth/ForgotPasswordView.vue`, solo para dejar claro si recuperación está fuera de alcance o conectarla si existe endpoint real.
- `src/views/auth/SendMailView.vue`, solo si hay que evitar que prometa envío real inexistente.
- `src/composables/useApiError.ts`, si se necesita centralizar manejo de 422/403.
- `src/types/index.ts`, solo si hay que alinear tipos de auth.

NO MODIFICAR:
- `src/views/usuarios/`
- `src/views/agenda/`
- `src/views/servicios/`
- `src/services/empleados.ts`
- `src/services/citas.ts`
- `src/services/servicios.ts`

FASE 01.1 - REVISIÓN INICIAL

Antes de modificar, ejecuta:

git status --short --branch
git log --oneline -5
npm run type-check
npx eslint . --no-cache
npm run build

Revisa si hay cambios locales existentes y documenta si podrían afectar esta fase.

Revisa:
- `.env`
- `src/services/api.ts`
- `src/services/auth.ts`
- `src/stores/auth.ts`
- `src/router/index.ts`
- `src/views/auth/LoginView.vue`
- `src/views/auth/ChangePasswordView.vue`

Objetivo:
Entender el estado actual antes de tocar auth.

FASE 01.2 - VALIDACIÓN DE BACKEND

Detecta `VITE_API_URL` desde `.env`.

Prueba conectividad:

curl -i http://localhost:8000/api
curl -i http://dentistawebpg.test/api

Si `VITE_API_URL` apunta a otra URL, prueba esa también.

Interpretación:
- Si `/api` da 404 pero Laravel responde, no lo tomes como backend caído.
- Si hay conexión rechazada o timeout, documenta backend no disponible.
- Si responde Laravel, continúa.

También intenta probar una ruta pública sin credenciales:

curl -i -X POST http://localhost:8000/api/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{\"correoElectronico\":\"invalid@test.local\",\"password\":\"invalid\"}"

Resultado esperado para backend disponible:
- 401 o 422.
- Si hay timeout o conexión rechazada, backend no disponible.

No uses credenciales reales no autorizadas.
Si no hay credenciales de prueba, documenta bloqueo.

FASE 01.3 - CLIENTE HTTP E INTERCEPTORES

Revisa `src/services/api.ts`.

Debe cumplir:
1. Usa `VITE_API_URL`.
2. Agrega `Authorization: Bearer {token}` si existe token.
3. Agrega headers JSON.
4. Maneja `401` limpiando sesión local y redirigiendo a `/login`.
5. Maneja `403` con feedback claro o redirección controlada.
6. No crea dependencias circulares graves entre `api.ts` y `auth.ts`.
7. No rompe los módulos de compañeros que ya consumen API.

Si el manejo de 403 no existe o no da feedback:
- Implementa una solución mínima y global, o confirma que `useApiError` se encarga.
- Si eliges manejo local, documenta por qué.
- Si eliges redirección global a `/forbidden`, cuida no interferir con formularios que necesiten mostrar errores.
- Preferencia:
  - 401 global: limpiar sesión y login.
  - 403 global: toast claro o redirección a `/forbidden` solo si es navegación/ruta.
  - 422 local: formularios.

Documenta cualquier cambio.

FASE 01.4 - STORE DE AUTENTICACIÓN

Revisa `src/stores/auth.ts`.

Debe manejar:
- token.
- empleado.
- estado autenticado.
- rol.
- persistencia en localStorage/sessionStorage según patrón existente.
- login.
- logout.
- clearSession.
- fetchMe o equivalente.
- requiresPasswordChange si existe.

Validar que login use:
{
  correoElectronico,
  password
}

No debe seguir usando `usuario` si el backend espera `correoElectronico`, salvo que la UI tenga un campo visual llamado usuario pero internamente se mapee correctamente.

Acciones posibles:
- Ajustar payload de login si no coincide con backend.
- Alinear lectura de respuesta `{ token, empleado }`.
- Asegurar limpieza completa en logout.
- Asegurar limpieza local aunque `/logout` falle por token inválido.
- Validar compatibilidad de roles `admin`, `administrador`, `recepcionista`, `dentista` si el proyecto ya lo maneja.
- Documentar cualquier decisión.

FASE 01.5 - LOGIN VIEW

Revisa `src/views/auth/LoginView.vue`.

Debe:
- Enviar correo/usuario como `correoElectronico` al backend.
- Enviar `password`.
- Mostrar loading mientras autentica.
- Bloquear doble submit.
- Mostrar error claro en 401.
- Mostrar errores 422 por campo si existen.
- Mostrar error de backend no disponible.
- Redirigir al destino correcto tras login.
- No guardar sesión si falla.
- No usar mocks.
- No usar credenciales hardcodeadas.

Si el formulario visual usa “usuario”, puedes conservar etiqueta si así estaba, pero internamente debe mapear al campo que backend espera.

FASE 01.6 - SESIÓN PERSISTIDA Y `/me`

Objetivo:
Confirmar o implementar recuperación segura de sesión.

Debe:
- Al recargar, usar token guardado.
- Llamar `/me` si el patrón actual lo contempla.
- Si `/me` responde 401, limpiar sesión y login.
- Si `/me` responde empleado, actualizar store.
- Evitar loops de redirección.
- Evitar que un token viejo deje al usuario en estado autenticado falso.

Si `fetchMe()` existe pero no se usa en guards/layout, evalúa si debe invocarse en el flujo actual.
No sobreingenierizar; haz ajuste mínimo y documentado.

FASE 01.7 - LOGOUT

Debe:
- Enviar `POST /logout` con Bearer token.
- Limpiar token local.
- Limpiar empleado local.
- Redirigir a login.
- Si backend responde 401/204/200, manejar correctamente.
- Si backend no responde, limpiar sesión local de todos modos y mostrar feedback si corresponde.

Revisa si el botón del layout/sidebar llama realmente a logout.
Si no funciona, corrígelo sin modificar el resto del layout más de lo necesario.

FASE 01.8 - CHANGE PASSWORD

Revisa `src/views/auth/ChangePasswordView.vue` y `src/services/auth.ts`.

Debe enviar:
{
  current_password,
  new_password,
  new_password_confirmation
}

Debe:
- Mostrar loading.
- Mostrar errores 422 por campo.
- Mostrar error si contraseña actual es incorrecta.
- Mostrar éxito.
- Redirigir correctamente después de cambiar.
- No permitir enviar si confirmación no coincide.
- No usar nombres de campos distintos si backend no los espera.

Si hay flujo de `requiresPasswordChange`:
- Confirmar guard que obliga a cambiar contraseña.
- Confirmar que no deja navegar a otros módulos hasta cambiar.
- Confirmar que después del cambio actualiza estado.

FASE 01.9 - FORGOT PASSWORD / SEND MAIL

Revisa:
- `src/views/auth/ForgotPasswordView.vue`
- `src/views/auth/SendMailView.vue`

Contrato actual:
No se ha confirmado endpoint real de recuperación de contraseña en los documentos.

Regla:
- Si no existe endpoint backend documentado, NO inventes `/forgot-password`.
- No simules envío como si fuera real.
- Puedes dejar el flujo como “pendiente de backend” o mostrar mensaje claro.
- Si actualmente navega a confirmación sin llamar API, documenta que es mock/pendiente.
- Solo cambia la UI si es necesario para evitar una promesa falsa.

FASE 01.10 - GUARDS Y ROLES

Revisa:
- `src/router/index.ts`
- `src/layouts/MainLayout.vue`
- `src/stores/auth.ts`

Debe:
- Bloquear rutas privadas sin sesión.
- Redirigir usuarios autenticados lejos de login si corresponde.
- Aplicar roles según metadata actual.
- Mantener compatibilidad con:
  - admin
  - administrador
  - recepcionista
  - dentista
- No modificar módulos de compañeros.
- Solo ajustar guards globales si hay bug real.

Pruebas esperadas si hay backend y credenciales:
- Admin puede entrar a módulos permitidos.
- Recepcionista no entra a rutas de dentista/admin si no corresponde.
- Dentista no entra a caja/pagos/inventario si no corresponde.
- Ruta directa restringida redirige o muestra forbidden.

FASE 01.11 - DATOS DE PRUEBA

Si backend está disponible y faltan credenciales:
Puedes crear datos de prueba SOLO si es seguro y no destructivo.

Preferencia:
1. Usar seeders existentes.
2. Usar endpoint de empleados si existe admin.
3. Usar tinker/factory si estás autorizado y es seguro.
4. SQL manual solo como último recurso.

No puedes:
- Borrar datos reales.
- Hacer `migrate:fresh`.
- Hacer `db:wipe`.
- Truncar tablas.
- Cambiar contraseñas reales.
- Alterar estructura DB.

Si creas usuarios de prueba, usa:
- `TEST Admin DentalSys`
- `test.admin@dentalsys.local`
- `TEST Recepcionista DentalSys`
- `test.recepcionista@dentalsys.local`
- `TEST Dentista DentalSys`
- `test.dentista@dentalsys.local`

Documenta credenciales temporales en:
`docs/modulos/00-datos-prueba.md`

Si ya existe ese archivo, actualízalo.

FASE 01.12 - PRUEBAS FUNCIONALES

Si backend está disponible y hay credenciales, prueba:

1. Login válido.
2. Login inválido.
3. Login con cuenta inactiva si existe.
4. Logout.
5. Recarga con sesión iniciada.
6. `/me`.
7. Token inválido.
8. 401.
9. 403.
10. Cambio de contraseña válido.
11. Cambio de contraseña con error 422.
12. Acceso a ruta privada sin sesión.
13. Acceso a login con sesión activa.
14. Ruta restringida por rol.

Si backend no está disponible:
- Documenta como bloqueado por backend.
- No marques auth como integrado validado.
- Aun así puedes dejar el código alineado al contrato.

FASE 01.13 - DOCUMENTACIÓN OBLIGATORIA

Crea o actualiza:

`docs/modulos/01-auth-seguridad.md`

Debe contener:

# Fase 01 - Autenticación y seguridad

## Objetivo
Explicar qué se buscó resolver.

## Alcance
Qué se tocó y qué no se tocó.

Debe indicar explícitamente:
- No se implementó pacientes.
- No se implementó pagos.
- No se implementó inventario.
- No se modificaron módulos de compañeros.

## Contexto inicial
- Rama.
- Commit.
- URL API.
- Backend disponible: Sí/No.
- Credenciales disponibles: Sí/No.

## Archivos revisados
Lista.

## Archivos modificados
Lista con motivo.

## Contrato backend usado
Tabla:
- Endpoint.
- Método.
- Auth.
- Payload.
- Respuesta esperada.
- Errores esperados.

Incluir:
- `/login`
- `/me`
- `/logout`
- `/change-password`

## Métodos agregados
Tabla:
- Método.
- Archivo.
- Responsabilidad.
- Parámetros.
- Retorno.
- Motivo.

## Métodos modificados
Tabla:
- Método.
- Archivo.
- Antes.
- Después.
- Motivo.

## Métodos eliminados
Tabla:
- Método.
- Archivo.
- Motivo.
- Reemplazo.

## Cambios realizados
Explicar qué se hizo y por qué:
- Cliente HTTP.
- Store auth.
- Login.
- Logout.
- `/me`.
- Change password.
- Guards.
- 401.
- 403.
- 422.

## Cómo funciona ahora
Describir el flujo actual:
1. Login.
2. Guardado de token.
3. Inyección Bearer.
4. Consulta `/me`, si aplica.
5. Navegación protegida.
6. Logout.
7. Manejo de expiración.

## Manejo de errores
- 401.
- 403.
- 404.
- 422.
- 500+.

## Pruebas ejecutadas
Tabla:
- Prueba.
- Resultado.
- Evidencia.
- Estado.

## Datos de prueba
Indicar si se crearon o no.
Si se crearon, referenciar `docs/modulos/00-datos-prueba.md`.

## Riesgos
Ejemplo:
- Backend no disponible.
- Sin credenciales.
- Recuperación de contraseña sin endpoint.
- Uso de localStorage.
- Tokens expirados.

## Estado final
Uno:
- Completa.
- Parcial.
- Bloqueada.

## Pendientes
Solo pendientes reales de auth.

También actualiza `docs/INDICE.md` si existe, agregando o confirmando:
- `docs/modulos/01-auth-seguridad.md`

Si se crearon usuarios de prueba, actualiza:
- `docs/modulos/00-datos-prueba.md`

FASE 01.14 - VALIDACIÓN FINAL

Al final ejecuta:

npm run type-check
npx eslint . --no-cache
npm run build

Si existe:

npm run build-only

Criterios de aceptación:
1. `npm run type-check` pasa.
2. `npx eslint . --no-cache` pasa.
3. `npm run build` pasa.
4. Login está alineado a `correoElectronico` + `password`.
5. Token Bearer se inyecta correctamente.
6. 401 limpia sesión y redirige a login.
7. 403 da feedback o forbidden de forma consistente.
8. Logout limpia sesión.
9. Change password usa payload correcto.
10. No se modificaron módulos de compañeros.
11. Se documentó todo en `docs/modulos/01-auth-seguridad.md`.
12. Si hubo datos de prueba, se documentaron.
13. No se agregaron `any`, `console.log`, `@ts-ignore`, `eslint-disable` ni mocks nuevos.

RESPUESTA FINAL ESPERADA:
Al terminar, responde con:

1. Estado de la fase: Completa / Parcial / Bloqueada.
2. Rama y commit final.
3. Backend disponible: Sí/No.
4. Credenciales usadas o motivo de bloqueo.
5. Archivos modificados.
6. Documentos creados/actualizados.
7. Métodos agregados.
8. Métodos modificados.
9. Métodos eliminados.
10. Resultado de pruebas:
    - type-check
    - eslint
    - build
    - build-only, si aplica
11. Resultado funcional:
    - Login
    - Logout
    - `/me`
    - Change password
    - 401
    - 403
    - Guards
12. Confirmación de que no se tocaron módulos de compañeros.
13. Pendientes para la siguiente fase.