# Fase 05 - Frontend Auth por palabra clave

## Objetivo

Reemplazar en el frontend la idea de recuperacion por correo por una pantalla de recuperacion mediante palabra clave. La vista ya no promete envio de correo, enlaces, codigos ni recuperacion por email.

## Alcance

- Solo se trabajo frontend.
- No se modifico backend.
- No se modifico base de datos.
- No se implementaron correos.
- No se implemento recuperacion por email.
- No se implementaron PDFs.
- No se implemento facturacion.
- No se tocaron pacientes, pagos, inventario, agenda, servicios, usuarios, dashboard, recetas ni cortes.

## Contexto inicial

| Dato | Resultado |
|---|---|
| Fecha | 2026-05-27 13:55:35 -07:00 |
| Rama | `main` |
| Commit inicial | `6e5f7bf` |
| Backend configurado | `http://localhost:8000/api` |
| Backend disponible | Si, Laravel responde; `/api` devuelve `404 Not Found` |
| Login TEST | Pasa con `test.admin@dentalsys.local` / `TestAdmin123!` usando `{ usuario, contraseña }` |
| Endpoint de palabra clave encontrado | No |
| Estado anterior de `ForgotPasswordView.vue` | Vista pendiente con campo de correo y boton deshabilitado |

## Archivos revisados

- `docs/planes/05_FASE_FRONT_AUTH_PALABRA_CLAVE.md`
- `docs/modulos/01-auth-seguridad.md`
- `docs/modulos/00-plan-restante.md`
- `docs/INDICE.md`
- `.env`
- `package.json`
- `src/views/auth/ForgotPasswordView.vue`
- `src/views/auth/LoginView.vue`
- `src/services/auth.ts`
- `src/services/api.ts`
- `src/stores/auth.ts`
- `src/router/index.ts`
- `src/types/index.ts`
- `src/composables/useApiError.ts`

## Archivos modificados

| Archivo | Motivo |
|---|---|
| `src/views/auth/ForgotPasswordView.vue` | Reemplazar UI de correo por formulario de usuario, palabra clave, nueva contrasena y confirmacion; dejarlo bloqueado por falta de endpoint backend. |
| `docs/modulos/05-auth-palabra-clave.md` | Documentar estado real, pruebas, cambios y pendientes. |
| `docs/INDICE.md` | Agregar el reporte de Fase 05 al indice vigente. |

## Contrato frontend/backend observado

| Endpoint | Metodo | Payload | Respuesta esperada | Errores esperados | Estado |
|---|---|---|---|---|---|
| `/api/login` | POST | `{ usuario, contraseña }` | `{ token, empleado, requiresPasswordChange }` | `401`, `422` | Validado con usuario TEST |
| `/api/recover-password-keyword` | POST | `{ usuario, palabraClave, new_password, new_password_confirmation }` | `{ message }` | `401`, `404`, `422`, `500` | Pendiente backend: responde `404` |
| `/api/recuperar-password-palabra-clave` | POST | Igual al anterior | `{ message }` | `401`, `404`, `422`, `500` | Pendiente backend: responde `404` |
| `/api/reset-password-keyword` | POST | Igual al anterior | `{ message }` | `401`, `404`, `422`, `500` | Pendiente backend: responde `404` |
| `/api/forgot-password-keyword` | POST | Igual al anterior | `{ message }` | `401`, `404`, `422`, `500` | Pendiente backend: responde `404` |
| `/api/recuperar-password` | POST | Igual al anterior | `{ message }` | `401`, `404`, `422`, `500` | Pendiente backend: responde `404` |

## Metodos agregados

| Metodo | Archivo | Responsabilidad | Parametros | Retorno | Motivo |
|---|---|---|---|---|---|
| `validateForm` | `src/views/auth/ForgotPasswordView.vue` | Validar campos requeridos y coincidencia de contrasenas. | Ninguno, usa estado reactivo local. | `boolean` | Dejar la pantalla preparada para conectar el endpoint cuando backend lo exponga. |
| `clearMessages` | `src/views/auth/ForgotPasswordView.vue` | Limpiar mensajes y errores de formulario. | Ninguno. | `void` | Mantener errores de formulario controlados sin mocks ni llamadas directas. |
| Servicio auth | `src/services/auth.ts` | N/A | N/A | N/A | No se agrego metodo en `auth.ts` porque no existe endpoint backend validado y no se debe inventar un endpoint definitivo. |

## Metodos modificados

| Metodo | Archivo | Antes | Despues | Motivo |
|---|---|---|---|---|
| `handleSubmit` | `src/views/auth/ForgotPasswordView.vue` | No existia flujo de palabra clave; la vista solo tenia campo de correo y boton deshabilitado. | Valida campos locales y muestra que la funcionalidad esta pendiente de endpoint backend. El boton permanece deshabilitado mientras no exista endpoint. | Evitar prometer recuperacion por correo o simular exito. |

## Metodos eliminados

| Metodo | Archivo | Motivo | Reemplazo |
|---|---|---|---|
| Ninguno | N/A | N/A | N/A |

## Cambios realizados

- Servicio auth: se reviso `src/services/auth.ts`, pero no se modifico porque no hay endpoint real de recuperacion por palabra clave.
- ForgotPasswordView: se cambio la vista a formulario de usuario/palabra clave/nueva contrasena/confirmacion.
- Tipos: se reviso `src/types/index.ts`; no se agregaron tipos porque no hay servicio activo que los consuma.
- Manejo de errores: no se cambio `useApiError.ts`; la vista queda bloqueada antes de hacer llamadas HTTP.
- Estados de UI: se agrego mensaje visible de pendiente backend y boton deshabilitado.

## Como funciona ahora

Como no existe endpoint backend:

1. La vista ya no promete recuperacion por correo.
2. La pantalla muestra los campos del flujo correcto por palabra clave.
3. El boton de actualizar contrasena queda deshabilitado.
4. Se muestra el mensaje: "La recuperacion por palabra clave esta pendiente de endpoint backend."
5. No se simula exito ni se envia ningun request desde la vista.

## Manejo de errores

| Caso | Comportamiento actual |
|---|---|
| Palabra clave incorrecta | Pendiente backend; no se puede validar sin endpoint. |
| Usuario inexistente o inactivo | Pendiente backend; no se puede validar sin endpoint. |
| Confirmacion incorrecta | Preparado en validacion local, aunque el submit permanece bloqueado hasta que exista endpoint. |
| Contrasena invalida | Pendiente backend para reglas definitivas; validacion local solo cubre campos requeridos y coincidencia. |
| Endpoint no existe | Documentado como pendiente backend; los candidatos respondieron `404`. |
| Backend caido | No aplica en esta prueba: Laravel respondio. |

## Pruebas ejecutadas

| Prueba | Payload / comando | Resultado | Estado |
|---|---|---|---|
| Estado git | `git status --short --branch` | Rama `main`; worktree con cambios previos de equipo y cambio de esta fase en auth/docs. | Ejecutado |
| Ultimos commits | `git log --oneline -5` | HEAD `6e5f7bf USUARIOS (#8)`. | Ejecutado |
| Type-check inicial | `npm run type-check` | Falla por politica PowerShell al intentar cargar `npm.ps1`. | Bloqueo de shell, no del proyecto |
| ESLint inicial | `npx eslint . --no-cache` | Falla por politica PowerShell al intentar cargar `npx.ps1`. | Bloqueo de shell, no del proyecto |
| Build inicial | `npm run build` | Falla por politica PowerShell al intentar cargar `npm.ps1`. | Bloqueo de shell, no del proyecto |
| Type-check real | `npm.cmd run type-check` | Sin errores. | Pasa |
| ESLint real | `npx.cmd eslint . --no-cache` | Sin errores. | Pasa |
| Build real | `npm.cmd run build` | Ejecuta `type-check` y `build-only`; build Vite exitoso. | Pasa |
| Build-only real | `npm.cmd run build-only` | Build Vite exitoso. | Pasa |
| Backend base | `curl -i http://localhost:8000/api` | Laravel responde `404 Not Found`. | Servidor disponible, ruta base no existe |
| Backend Laragon host | `curl -i http://dentistawebpg.test/api` | Laravel responde `404 Not Found`. | Servidor disponible, ruta base no existe |
| Login TEST | `POST /api/login` con `{ usuario: "test.admin@dentalsys.local", contraseña: "TestAdmin123!" }` | `200`, retorna token y empleado. | Pasa |
| Endpoint candidato | `POST /api/recover-password-keyword` | `404`. | Pendiente backend |
| Endpoint candidato | `POST /api/recuperar-password-palabra-clave` | `404`. | Pendiente backend |
| Endpoint candidato | `POST /api/reset-password-keyword` | `404`. | Pendiente backend |
| Endpoint candidato | `POST /api/forgot-password-keyword` | `404`. | Pendiente backend |
| Endpoint candidato | `POST /api/recuperar-password` | `404`. | Pendiente backend |

## Riesgos

- No existe endpoint backend confirmado para recuperacion por palabra clave.
- El contrato final del backend puede diferir entre `palabraClave`, `palabra_clave`, `clave`, `password` o `password_confirmation`.
- El flujo publico requiere rate limiting y respuestas prudentes en backend para evitar enumeracion de usuarios.
- La palabra clave debe almacenarse y validarse de forma segura en backend; el frontend no puede garantizarlo.

## Estado final

Parcial. El frontend quedo alineado visual y semanticamente al flujo por palabra clave, pero la funcionalidad real queda bloqueada por backend porque todos los endpoints candidatos respondieron `404`.

## Pendientes

### Pendientes frontend

- Conectar `ForgotPasswordView.vue` a `src/services/auth.ts` cuando exista endpoint real.
- Agregar tipos y metodo `recoverPasswordByKeyword` solo cuando el contrato backend este definido.
- Mapear errores `422` por campo segun los nombres reales que devuelva Laravel.
- Probar con palabra clave incorrecta y correcta cuando backend lo soporte.

### Pendientes backend

- Crear o documentar endpoint de recuperacion por palabra clave.
- Definir payload oficial: `usuario`, `palabraClave`, `new_password`, `new_password_confirmation` u otros nombres.
- Definir respuestas `200`, `401`, `404`, `422` y `500`.
- Validar palabra clave, estado del usuario, politica de contrasena y rate limiting.
- Evitar respuestas que permitan enumerar usuarios.
