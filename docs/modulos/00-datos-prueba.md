# Datos de Prueba

## Objetivo

Crear registros minimos, identificables y controlados para validar Auth, permisos,
Servicios, Usuarios/Empleados y Agenda/Citas contra el backend Laravel real.

## Ambiente

| Campo | Valor |
|---|---|
| Fecha | 2026-05-27 |
| Frontend | Rama `main`, HEAD `6e5f7bf` mas cambios de preparacion sin commit |
| Backend | `C:\laragon\www\dentistaWebPg` |
| API usada en pruebas | `http://localhost:8000/api` mediante servidor Laravel temporal |
| Base de datos | MySQL `dentista_db` |

## Estado previo relevante

Antes de crear datos se consulto la base:

- `tipo_empleados` tenia 35 registros genericos, sin roles
  `Administrador`, `Dentista` o `Recepcionista`.
- No existian empleados cuyo `usuario` iniciara con `test.`.
- No existian personas ni servicios cuyo nombre iniciara con `TEST`.
- Existian clases de servicio utilizables; se reutilizo la clase ID `1`
  (`Limpieza`) y no se creo una clase nueva.

## Datos creados

| Tabla | Identificador | Nombre/correo/descripcion | Modulo que lo usa | Motivo | Debe conservarse |
|---|---:|---|---|---|---|
| `tipo_empleados` | `36` | `Administrador`; descripcion `TEST Rol DentalSys para validacion frontend` | Auth, Usuarios, Servicios | No existia rol autorizado para probar middleware | Si, hasta finalizar validaciones |
| `tipo_empleados` | `37` | `Dentista`; descripcion `TEST Rol DentalSys para validacion frontend` | Auth, Agenda, permisos | Probar catalogo dentista y restricciones | Si, hasta finalizar validaciones |
| `tipo_empleados` | `38` | `Recepcionista`; descripcion `TEST Rol DentalSys para validacion frontend` | Auth, Agenda, Servicios | Probar operaciones permitidas | Si, hasta finalizar validaciones |
| `personas` | `116` | `TEST Admin DentalSys`; `test.admin@dentalsys.local` | Auth/Usuarios | Persona del admin TEST | Si |
| `empleados` | `31` | Usuario `test.admin`, rol ID `36`, activo | Auth/Usuarios/Servicios | Usuario autorizado de administracion | Si |
| `personas` | `117` | `TEST Dentista DentalSys`; `test.dentista@dentalsys.local` | Auth/Agenda | Persona del dentista TEST | Si |
| `empleados` | `32` | Usuario `test.dentista`, rol ID `37`, activo | Auth/Agenda/permisos | Dentista para citas y restricciones | Si |
| `personas` | `118` | `TEST Recepcionista DentalSys`; `test.recepcionista@dentalsys.local` | Auth/Agenda/Servicios | Persona de recepcionista TEST | Si |
| `empleados` | `33` | Usuario `test.recepcionista`, rol ID `38`, activo | Auth/Agenda/Servicios | Operador permitido para agenda | Si |
| `personas` | `119` | `TEST Paciente Agenda DentalSys`; `test.paciente.agenda@dentalsys.local` | Agenda | Catalogo paciente controlado | Si |
| `servicios` | `56` | `TEST Servicio Validacion F01 Editado`, inactivo | Servicios | Validar crear, editar y desactivar | No es necesario; conservar como evidencia hasta limpieza acordada |
| `servicios` | `57` | `TEST Servicio Agenda F01`, activo | Agenda | Servicio para repetir prueba de citas al corregir backend | Si |
| `personas` | `120` | `TEST API Empleado Temporal`; `test.api.empleado@dentalsys.local` | Usuarios | Resultado de alta API de empleado | No es necesario; ligado a empleado inactivo |
| `empleados` | `34` | Usuario `test.api.empleado`, rol ID `37`, inactivo | Usuarios/Auth | Validar crear, editar, reset, cambio obligatorio y desactivar | No es necesario; conservar como evidencia hasta limpieza acordada |

No se crearon citas: los intentos `POST /citas` fallaron con error `500` antes de
insertar registros.

## Credenciales temporales

Estas credenciales pertenecen solo a la base local de prueba. No deben reutilizarse en
produccion ni quedar activas fuera del ambiente de validacion.

| Rol | Usuario | Contrasena temporal vigente | Uso | Advertencia |
|---|---|---|---|---|
| Administrador | `test.admin` | `TestDentalSys2026!` | Probar auth y operaciones administrativas | Solo ambiente local |
| Dentista | `test.dentista` | `TestDentalSys2026!` | Probar lecturas/restricciones y futura agenda | Solo ambiente local |
| Recepcionista | `test.recepcionista` | `TestDentalSys2026!` | Probar servicios y agenda | Solo ambiente local |
| Dentista descartable | `test.api.empleado` | Desactivado; no usar | Fue creado, reseteado y desactivado en prueba de Usuarios | No habilitar salvo nueva prueba documentada |

## Datos modificados

| Tabla | Registro | Cambio | Motivo |
|---|---|---|---|
| `servicios` | ID `56` | Nombre/costo actualizados; luego `estado=false` | Validar edicion y desactivacion logica por API |
| `empleados` | ID `34` | Telefono/RFC editados, password reseteado/cambiado, luego `estado=false` | Validar ciclo de Usuarios/Empleados y Auth |
| `personal_access_tokens` | Tokens de usuarios `test.%` | Eliminados al finalizar las pruebas | No dejar sesiones de prueba activas |

## Datos eliminados

No se eliminaron registros de negocio. Solo se eliminaron tokens de sesion generados
durante la prueba para los usuarios `TEST`.

## Comandos y operaciones usadas

- Consulta previa con `php artisan tinker` para roles, clases y prefijos `TEST`.
- Creacion idempotente mediante `TipoEmpleado::firstOrCreate`,
  `Persona::firstOrCreate` y `Empleado::firstOrCreate`, usando `Hash::make()` para
  contrasenas.
- Solicitudes HTTP reales a:
  - `POST /api/login`, `GET /api/me`, `POST /api/logout`,
    `POST /api/change-password`.
  - `GET/POST/PUT/DELETE /api/servicios` y `GET /api/clases-servicio`.
  - `GET/POST/PUT/DELETE /api/empleados`, `GET /api/tipos-empleado` y
    `POST /api/empleados/{id}/reset-password`.
  - `GET /api/personas`, `GET /api/citas` y `POST /api/citas`.
- Consulta final con `php artisan tinker` para verificar persistencia TEST y eliminar
  tokens de prueba.
- Consulta `SHOW COLUMNS FROM citas` para diagnosticar el bloqueo de Agenda.

### Intentos fallidos sin efecto en datos

Dos primeras invocaciones de creacion con `artisan tinker` fallaron antes de ejecutar
consultas por problemas de quoting PowerShell/PHP:

1. `Ya se ha especificado el parametro command.`
2. `PHP Parse error: Syntax error, unexpected '!', expecting ')'`.

El tercer intento fue exitoso e idempotente.

## Riesgos detectados

1. La base inicial no contiene roles de negocio reales; los roles creados son
   necesarios para validar, pero deben formalizarse mediante seeders/backend.
2. Agenda no puede crear citas porque la tabla `citas` carece de `idEmpleado`, aunque
   backend y frontend lo requieren.
3. Los registros activos `TEST` deben excluirse de cualquier demo con datos reales o
   identificarse claramente como pruebas.

## Recomendacion

Conservar temporalmente los roles IDs `36-38`, empleados IDs `31-33`, paciente ID
`119` y servicio ID `57` para repetir Agenda y realizar la prueba visual pendiente.
Cuando terminen las fases de integracion, limpiar solamente los registros `TEST` con
un procedimiento aprobado y documentado; no mezclar esa limpieza con datos reales.
