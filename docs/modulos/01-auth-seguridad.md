# Fase 01 - Autenticación y seguridad

## Objetivo
Validar, ajustar y documentar el flujo de autenticación y seguridad del frontend DentalSys asegurando la correcta comunicación con el backend (uso de `correoElectronico`, `password`, inyección de token y manejo de errores 401/403).

## Alcance
Se ajustaron los servicios de conexión, interceptores, store global y vistas relacionadas con Auth.
- No se implementó pacientes.
- No se implementó pagos.
- No se implementó inventario.
- No se modificaron módulos de compañeros (Citas, Usuarios, Servicios).

## Contexto inicial
- **Rama**: main
- **Commit**: 6e5f7bf
- **URL API**: http://localhost:8000/api
- **Backend disponible**: No (Las pruebas con curl fallaron por timeout).
- **Credenciales disponibles**: No aplica (el backend no estaba disponible para validar).

## Archivos revisados
- `src/stores/auth.ts`
- `src/services/auth.ts`
- `src/services/api.ts`
- `src/router/index.ts`
- `src/layouts/MainLayout.vue`
- `src/views/auth/LoginView.vue`
- `src/views/auth/ChangePasswordView.vue`
- `src/views/auth/ForgotPasswordView.vue`
- `docs/GUIA_FRONTEND_API.md`
- `docs/RESUMEN_ENDPOINTS_API.md`

## Archivos modificados
- `src/services/auth.ts`: Para enviar `correoElectronico` y `password` en lugar de `usuario` y `contraseña` según el contrato del backend. Se actualizaron los campos para el cambio de contraseña.
- `src/stores/auth.ts`: Para alinear la acción de `login` con la firma de `api.ts`.
- `src/services/api.ts`: Para agregar el interceptor que maneje errores HTTP 403 (Forbidden) lanzando un toast de error y redirigiendo en caso de ser un request GET.
- `src/views/auth/LoginView.vue`: Se renombraron las referencias `usuario` y `contraseña` a `correoElectronico` y `password` para estandarizar el componente con el store.
- `src/views/auth/ChangePasswordView.vue`: Se renombraron las referencias a `current_password`, `new_password` y `new_password_confirmation` para mapear los errores (422) correctamente a los inputs usando `useApiError`.
- `src/layouts/MainLayout.vue`: Se agregó una llamada silenciosa a `auth.fetchMe()` dentro del ciclo de vida `onMounted` para validar el token contra el servidor real tras un F5 (reload de página).
- `src/views/auth/ForgotPasswordView.vue`: Se cambió el mensaje para aclarar que la recuperación de contraseña está pendiente por parte del backend y se deshabilitó el botón de envío temporalmente.

## Contrato backend usado
| Endpoint | Método | Auth | Payload | Respuesta esperada | Errores esperados |
|---|---|---|---|---|---|
| `/login` | POST | No | `{correoElectronico, password}` | `{token, empleado}` | 401, 422 |
| `/me` | GET | Sí | - | `{empleado}` | 401 |
| `/logout` | POST | Sí | - | - | 204 / 401 |
| `/change-password` | POST | Sí | `{current_password, new_password, new_password_confirmation}` | 200 | 401, 422 |

## Métodos agregados
| Método | Archivo | Responsabilidad | Parámetros | Retorno | Motivo |
|---|---|---|---|---|---|
| `onMounted` | `src/layouts/MainLayout.vue` | Ciclo de vida | Ninguno | Ninguno | Validar token actual contra `/me` de forma silenciosa para detectar expiración temprana. |

## Métodos modificados
| Método | Archivo | Antes | Después | Motivo |
|---|---|---|---|---|
| `login` | `src/services/auth.ts` | `(usuario, contraseña)` | `(correoElectronico, password)` | Coincidir con el body esperado por la API de Laravel (`correoElectronico`, `password`). |
| `changePassword` | `src/services/auth.ts` | `(contraseñaActual, nuevaContraseña, nuevaContraseña_confirmation)` | `(current_password, new_password, new_password_confirmation)` | Coincidir con la API para poder mapear los errores de validación de Laravel (422) a la UI usando `useApiError`. |
| `login` | `src/stores/auth.ts` | `(usuario, contraseña)` | `(correoElectronico, password)` | Propagar los cambios de payload desde el UI hasta la llamada API. |
| Interceptor HTTP | `src/services/api.ts` | Interceptaba solo el status `401`. | Intercepta `401` y ahora también el `403`. | Añadir feedback visual (`toast`) o redireccionar a `/forbidden` cuando el usuario intenta acciones fuera de su rol. |

## Métodos eliminados
No se eliminaron métodos.

## Cambios realizados
- **Cliente HTTP**: Se extendió la respuesta interceptada en `api.ts` para manejar los códigos de estado `403`. 
- **Store auth**: La función de inicio de sesión de auth.ts ahora empata la propiedad del form "usuario" como `correoElectronico` tal cual como espera la API.
- **Login**: Se adecuaron las variables reactivas en `LoginView.vue`.
- **Logout**: Confirmado que la función limpia el storage, invalida los refs y devuelve al router `/login`. Funciona incluso sin backend.
- **`/me`**: Incorporado globalmente a `MainLayout.vue` para asegurar la vigencia del token de forma reactiva, evitando depender ciegamente del local storage.
- **Change password**: Estructura alineada a los campos requeridos por Sanctum, lo que facilita que los errores se rendericen bajo el input correspondiente.
- **Guards**: El router está correctamente implementado limitando los accesos para las vistas protegidas basadas en roles del usuario.

## Cómo funciona ahora
1. **Login**: Envía `correoElectronico` y `password` a `/api/login`.
2. **Guardado de token**: El store inyecta los datos de `empleado` y `token` devueltos en estado y `localStorage`.
3. **Inyección Bearer**: `api.ts` añade automáticamente la cabecera `Authorization: Bearer <token>` a cada solicitud.
4. **Consulta `/me`**: `MainLayout.vue` envía asíncronamente una petición `/api/me` para corroborar el estado en el backend sin congelar la renderización.
5. **Navegación protegida**: Los Guards definidos bloquean rutas según los roles de cada usuario autenticado.
6. **Logout**: Borra el estado y dispara la petición destructora para revocar credenciales, redirigiendo al login.
7. **Manejo de expiración**: El interceptor de Axios reacciona de inmediato frente a un 401 eliminando datos e impidiendo futuras peticiones rebotadas.

## Manejo de errores
- **401**: El interceptor de Axios limpia el estado de auth de Pinia y el localStorage y navega al Login (si el request original no venía del formulario Login).
- **403**: Muestra un Toast diciendo "No tienes los permisos necesarios" y redirige a la vista `Forbidden` de ser un método `GET`.
- **404 / 500+ / 422**: Configurados globalmente si corresponde o directamente en los componentes con ayuda del `useApiError`.

## Pruebas ejecutadas
| Prueba | Resultado | Evidencia | Estado |
|---|---|---|---|
| Autenticación con Backend Real | N/A | El puerto 8000 en `localhost` lanzó un `Timeout`. | **Bloqueada** (Backend No Disponible) |
| Ejecución de linting / build | Exitoso | Terminal outputs (`npm run type-check`, `npm run build-only`). | **Completado** |

## Datos de prueba
No se crearon usuarios de prueba puesto que el backend de Laravel se encontraba sin conexión.

## Riesgos
- **Backend no disponible**: Al no poder validar la respuesta contra el backend con los datos inyectados, es posible que el cuerpo devuelto tenga ligeras discrepancias (a pesar de seguir el contrato teóricamente).
- **Recuperación de contraseña sin endpoint**: Deshabilitado visualmente para evitar la promesa falsa.

## Estado final
- **Parcial** (Código actualizado pero las pruebas funcionales de la sesión están bloqueadas por caída del backend).

## Pendientes
- Integrar funcionalmente las pruebas de inicio de sesión una vez el entorno backend se restablezca o se pueda usar un servidor local funcional.
