# Validacion de Integraciones Parciales

## Objetivo

Validar con Laravel real los modulos ya cableados a API antes de iniciar integraciones
nuevas: Auth, Servicios, Usuarios/Empleados y Agenda/Citas.

## Backend

| Campo | Valor |
|---|---|
| Proyecto Laravel revisado | `C:\laragon\www\dentistaWebPg` |
| URL configurada por frontend | `http://localhost:8000/api` |
| URL Laragon detectada | `http://dentistawebpg.test/api` |
| Disponible | Si |
| Forma de prueba | Se inicio temporalmente `php artisan serve --host=127.0.0.1 --port=8000` para usar la URL del frontend sin modificar `.env` |
| `GET /api` | `404`: Laravel responde; no existe ruta base |
| `GET /api/login` | `405`: endpoint existe y acepta `POST` |
| Rutas revisadas | `php artisan route:list --path=api`: 51 rutas |
| Servidores temporales | Laravel y Vite fueron detenidos al finalizar la ejecucion |

## Base de datos

| Campo | Resultado |
|---|---|
| Conexion | Backend `.env`: MySQL `dentista_db` |
| Estado inicial util | Habia 35 tipos de empleado genericos; no existian `Administrador`, `Dentista`, `Recepcionista` ni usuarios `test.%` |
| Datos TEST creados | Si; roles, usuarios base, paciente, servicio activo, servicio CRUD desactivado y empleado CRUD desactivado |
| Datos reales modificados | No |
| Datos TEST eliminados | Se eliminaron tokens de sesion de prueba; no se borraron filas |
| Detalle | Ver `docs/modulos/00-datos-prueba.md` |

## Alcance de la evidencia

Se ejecutaron solicitudes HTTP reales contra Laravel y se consulto persistencia en
MySQL. La prueba visual a traves de la SPA no pudo ejecutarse: el navegador automatizado
fallo al inicializar sus recursos internos en dos intentos, antes de cargar
`http://localhost:5173/login`. Por ello, los resultados de endpoints son reales, pero
la navegacion, `localStorage` y presentacion visual deben repetirse.

## Auth

Credenciales base temporales usadas: `test.admin`, `test.dentista` y
`test.recepcionista`; contrasena documentada en `00-datos-prueba.md`.

| Caso | Usuario usado | Resultado | Evidencia | Estado |
|---|---|---|---|---|
| Login invalido | `test.admin` | Rechazado | `POST /login` -> `401` | Pasa |
| Login valido administrador | `test.admin` | Token y rol recibidos | `POST /login` -> `200`, rol `Administrador` | Pasa |
| Login valido dentista | `test.dentista` | Token y rol recibidos | `POST /login` -> `200`, rol `Dentista` | Pasa |
| Login valido recepcionista | `test.recepcionista` | Token y rol recibidos | `POST /login` -> `200`, rol `Recepcionista` | Pasa |
| Sesion autenticada | `test.admin` | Usuario devuelto | `GET /me` -> `200`, `usuario=test.admin` | Pasa |
| Token invalido | Token deliberadamente invalido | Rechazado | `GET /me` -> `401` | Pasa backend; redireccion SPA pendiente de navegador |
| Cambio obligatorio tras reset | `test.api.empleado` | Flag activado | Login despues de reset -> `200`, `requiresPasswordChange=true` | Pasa |
| Cambio obligatorio de contrasena | `test.api.empleado` | Password actualizado | `POST /change-password` -> `200` | Pasa |
| Logout | Tres usuarios base | Tokens de la ejecucion cerrados | `POST /logout` -> `200` para cada rol | Pasa |
| Recarga con sesion / rutas publicas-privadas | N/A | No ejecutado en UI | Navegador automatizado bloqueado | Pendiente |

Nota tecnica: una invocacion inicial de prueba desde PowerShell envio el cuerpo con
codificacion no adecuada para la clave `contraseña` y produjo `422`. Al enviar JSON
UTF-8, el login respondio correctamente. No es un defecto demostrado del frontend:
Axios/browser envia JSON UTF-8.

## Servicios

| Caso | Endpoint | Datos usados | Resultado | Evidencia | Estado |
|---|---|---|---|---|---|
| Listar clases | `GET /clases-servicio` | Admin TEST | Devuelve catalogo | `200`, 60 registros | Pasa |
| Listar servicios | `GET /servicios` | Admin TEST | Devuelve catalogo | `200`, 55 registros iniciales | Pasa |
| Validacion backend | `POST /servicios` | Payload incompleto | Rechaza datos | `422` | Pasa |
| Crear servicio CRUD | `POST /servicios` | `TEST Servicio Validacion F01` | Crea ID `56` | `201` | Pasa |
| Editar servicio CRUD | `PUT /servicios/56` | Nombre editado, costo `550` | Actualiza registro | `200` | Pasa |
| Persistencia de edicion | `GET /servicios/56` | ID `56` | Conserva nombre editado | `200`, `TEST Servicio Validacion F01 Editado` | Pasa |
| Desactivar servicio CRUD | `DELETE /servicios/56` | ID `56` | Desactivacion logica | `204` | Pasa |
| Persistencia de desactivacion | `GET /servicios/56` | ID `56` | `activo=false` | `200` | Pasa |
| Permiso sin administracion | `POST /servicios` | Dentista TEST | Backend bloquea alta | `403` | Pasa |
| Servicio para agenda | `POST /servicios` | `TEST Servicio Agenda F01` | Crea ID `57`, activo | `201` | Pasa; conservado para repetir Agenda |

Metodos frontend cubiertos por endpoints reales:
`serviciosService.getAll`, `getClases`, `create`, `update` y `remove`.

## Usuarios / Empleados

| Caso | Endpoint | Datos usados | Resultado | Evidencia | Estado |
|---|---|---|---|---|---|
| Cargar tipos | `GET /tipos-empleado` | Admin TEST | Devuelve catalogo incluyendo roles TEST | `200`, 38 registros | Pasa |
| Listar empleados | `GET /empleados` | Admin TEST | Devuelve empleados | `200`, 33 registros antes de alta API | Pasa |
| Validacion backend | `POST /empleados` | Payload incompleto | Rechaza datos | `422` | Pasa |
| Crear empleado | `POST /empleados` | `test.api.empleado` | Crea ID `34` | `201` | Pasa |
| Editar empleado | `PUT /empleados/34` | Telefono y RFC TEST | Actualiza telefono | `200`, `5550000099` | Pasa |
| Reset de contrasena | `POST /empleados/34/reset-password` | Password temporal TEST | Fuerza cambio | `200` | Pasa |
| Validar cambio requerido | `POST /login` | `test.api.empleado` | Retorna flag requerido | `200`, `true` | Pasa |
| Cambiar contrasena | `POST /change-password` | Usuario temporal | Actualiza password | `200` | Pasa |
| Permiso recepcionista | `POST /empleados` | Recepcionista TEST | Backend bloquea alta | `403` | Pasa |
| Desactivar empleado creado | `DELETE /empleados/34` | ID `34` | Estado inactivo, tokens eliminados | `204` | Pasa |

Metodos frontend cubiertos por endpoints reales:
`empleadosService.getAll`, `getTiposEmpleado`, `create`, `update`, `remove` y
`resetPassword`.

## Agenda / Citas

| Caso | Endpoint | Datos usados | Resultado | Evidencia | Estado |
|---|---|---|---|---|---|
| Cargar pacientes para catalogo | `GET /personas` | Recepcionista TEST | Incluye paciente ID `119` | `200`, `incluye_TEST=true` | Pasa |
| Cargar dentistas para catalogo | `GET /empleados` | Recepcionista TEST | Incluye dentista ID `32` | `200`, `incluye_dentista_TEST=true` | Pasa |
| Cargar servicios para catalogo | `GET /servicios` | Recepcionista TEST | Incluye servicio ID `57` | `200`, `incluye_servicio_TEST=true` | Pasa |
| Crear cita | `POST /citas` | Paciente `119`, servicio `57`, dentista `32` | Error servidor | `500` | Falla backend |
| Traslape / `422` | `POST /citas` | Mismo horario TEST | No alcanza validacion esperada | `500` | Bloqueado por mismo defecto backend |
| Editar cita | `PUT /citas/{id}` | Sin ID creado | No ejecutable | Creacion previa fallo | Bloqueado |
| Cancelar cita | `DELETE /citas/{id}` | Sin ID creado | No ejecutable | Creacion previa fallo | Bloqueado |
| Persistencia | `GET /citas?fecha=2026-06-29` | Fecha controlada | No existe cita TEST | `200`, sin registros TEST creados | Bloqueado |
| Permiso dentista | `POST /citas` | Dentista TEST | Middleware bloquea accion | `403` | Pasa |

### Causa tecnica del fallo de Agenda

Archivo backend involucrado:
`C:\laragon\www\dentistaWebPg\app\Services\DisponibilidadCitaService.php`.

Error registrado:

```text
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'idEmpleado' in 'where clause'
```

El esquema real de `citas` no tiene la columna `idEmpleado`. El frontend y el
servicio de disponibilidad esperan asignar un dentista con ese campo. No se hizo
ningun cambio de schema ni backend por estar fuera del alcance autorizado de esta fase.

## Manejo 401 / 403 observado

| Situacion | Codigo real obtenido | Manejo frontend existente |
|---|---:|---|
| Token no valido en `/me` | `401` | Interceptor global borra sesion y redirige a `/login`. |
| Dentista intentando crear servicio | `403` | `ServiciosView.vue` usa `useApiError()` y muestra mensaje/toast. |
| Recepcionista intentando crear empleado | `403` | `UsuariosView.vue` usa `useApiError()` y muestra mensaje/toast. |
| Dentista intentando crear cita | `403` | `AgendaView.vue` presenta error inline generico de datos/permisos. |
| Ruta no autorizada por rol | No ejecutada en navegador | Guard del router envia a `/forbidden`. |

## Resumen final por modulo

| Modulo | Estado | Conclusion |
|---|---|---|
| Auth | Integrado validado a nivel API; UI pendiente | Endpoints, tokens, roles, `401`, logout, reset y cambio obligatorio responden; falta verificar redireccion/localStorage en navegador. |
| Servicios | Integrado validado a nivel API; UI pendiente | CRUD, persistencia, `422` y `403` pasan contra Laravel. |
| Usuarios / Empleados | Integrado validado a nivel API; UI pendiente | CRUD, reset, cambio obligatorio y `403` pasan contra Laravel. |
| Agenda / Citas | Requiere ajuste backend | Catalogos y permiso `403` pasan; creacion falla `500` por columna faltante. |

## Recomendaciones para la siguiente fase

1. Corregir primero el contrato backend de Agenda/Citas para dentista asignado y
   repetir esta bateria con los registros TEST conservados.
2. Repetir navegacion real de la SPA cuando el control automatizado del navegador este
   disponible; validar token en `localStorage`, rutas y feedback visual.
3. Una vez Agenda quede validada, el siguiente modulo operativo recomendado es
   Pacientes, porque ya provee catalogo a Agenda pero su propia UI sigue mock.

