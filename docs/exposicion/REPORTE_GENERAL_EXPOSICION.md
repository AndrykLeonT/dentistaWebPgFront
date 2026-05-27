# Reporte General de DentalSys para Exposicion

## 1. Introduccion

DentalSys es una aplicacion web para la gestion operativa de una clinica dental. Esta disenada para administrar procesos diarios como autenticacion de empleados, registro de pacientes, agenda de citas, catalogo de servicios, pagos, cortes de caja, comprobantes internos, inventario, recetas y dashboard.

El sistema esta orientado a tres perfiles principales: administrador, recepcionista y dentista. Cada perfil tiene permisos diferentes segun su responsabilidad dentro de la clinica.

Nota de referencia: no se encontro un archivo `Proyecto Final.pdf` en los arboles accesibles durante la busqueda local. La seccion de requisitos del profesor se construyo con los requisitos minimos indicados en la solicitud.

Tecnologias principales:

- Frontend: Vue 3, TypeScript, Vite, Pinia, Vue Router, Axios.
- Backend: Laravel con API REST, Sanctum para tokens Bearer, controladores, modelos, requests, resources y servicios de dominio.
- Comunicacion: el frontend consume endpoints `/api/...` mediante servicios ubicados en `src/services`.

## 2. Arquitectura general del sistema

DentalSys esta separado en frontend y backend.

El frontend vive en este repositorio y contiene la SPA Vue. Sus capas principales son:

| Capa | Archivo/carpeta | Funcion |
|---|---|---|
| Entrada Vue | `src/main.ts` | Inicializa Vue, Pinia, Router, estilos y plugins. |
| Rutas | `src/router/index.ts` | Define rutas publicas, privadas y guards por rol. |
| Layout privado | `src/layouts/MainLayout.vue` | Renderiza sidebar, datos de usuario, logout y contenido autenticado. |
| Store de auth | `src/stores/auth.ts` | Guarda token, empleado, rol, flags de cambio de contrasena y acciones login/logout. |
| Cliente API | `src/services/api.ts` | Axios centralizado, base URL, Bearer token, manejo global de `401` y `403`. |
| Servicios API | `src/services/` | Encapsulan llamadas HTTP por modulo. |
| Tipos TS | `src/types/index.ts` | Interfaces de dominio usadas por vistas y servicios. |
| Vistas | `src/views/` | Pantallas de modulos: auth, pacientes, agenda, pagos, inventario, etc. |
| Componentes | `src/components/` | Componentes reutilizables y UI base. |

El backend Laravel se encontro en `C:\laragon\www\dentistaWebPg`. Sus capas principales son:

| Capa | Archivo/carpeta | Funcion |
|---|---|---|
| Rutas API | `routes/api.php` | Define endpoints y grupos por middleware/rol. |
| Controladores | `app/Http/Controllers/` | Reciben requests, coordinan modelos/servicios y devuelven JSON/resources. |
| Modelos | `app/Models/` | Representan tablas y relaciones Eloquent. |
| Requests | `app/Http/Requests/` | Validaciones backend por caso de uso. |
| Resources | `app/Http/Resources/` | Formatean respuestas JSON. |
| Servicios | `app/Services/` | Logica de dominio: caja, comprobantes, inventario, consumo automatico. |
| Migraciones | `database/migrations/` | Definen tablas, llaves y campos. |
| Pruebas | `tests/Feature`, `tests/Unit` | Validan API, permisos y reglas de negocio. |

## 3. Flujo de autenticacion y login

El login se inicia desde `src/views/auth/LoginView.vue`, donde el usuario captura usuario/correo y contrasena. La vista llama al store `src/stores/auth.ts`.

Payload real enviado por el store:

```json
{
  "usuario": "test.admin@dentalsys.local",
  "contraseña": "TestAdmin123!"
}
```

Endpoint backend: `POST /api/login`, definido en `routes/api.php` y atendido por `App\Http\Controllers\AuthController@login`.

Respuesta esperada:

```json
{
  "token": "...",
  "requiresPasswordChange": false,
  "empleado": {
    "id": 1,
    "usuario": "...",
    "tipoEmpleado": { "nombre": "admin" },
    "persona": { "nombreCompleto": "..." }
  }
}
```

Flujo:

1. `LoginView.vue` ejecuta `handleLogin`.
2. `src/stores/auth.ts` envia `POST /login`.
3. Laravel valida usuario activo y hash de `contraseña` en `AuthController@login`.
4. Backend genera token Sanctum con `createToken`.
5. Frontend guarda `auth_token`, `auth_empleado` y `auth_requires_pw_change` en `localStorage`.
6. `src/services/api.ts` inyecta `Authorization: Bearer <token>` en cada request posterior.
7. `MainLayout.vue` ejecuta `auth.fetchMe()` en `onMounted` para refrescar datos del usuario.
8. Logout llama `POST /logout`, limpia sesion local y redirige a `/login`.

Manejo de errores:

- `401`: en endpoints privados, `src/services/api.ts` limpia sesion y redirige a login. En `/login` y `/recover-password-keyword` se deja que la vista muestre el error.
- `403`: `api.ts` muestra toast y, si la peticion es GET, redirige a `/forbidden`.
- En backend, `auth:sanctum` protege rutas privadas y `EnsureEmpleadoIsActive` bloquea empleados inactivos.

Riesgo detectado: `src/services/auth.ts` y `ChangePasswordView.vue` usan nombres `current_password`, `new_password`, `new_password_confirmation`; el backend `AuthController@changePassword` valida `contraseñaActual`, `nuevaContraseña`, `nuevaContraseña_confirmation`. El login funciona porque el store usa el contrato real, pero cambio de contrasena autenticado debe revisarse antes de demostracion.

## 4. Tipos de usuarios y roles

Los roles se modelan en backend mediante `tipo_empleados` y `Empleado::tipoEmpleado()`. En frontend se calculan en `src/stores/auth.ts`:

- `isAdmin`.
- `isDentista`.
- `isRecepcionista`.

| Rol | Acceso principal | Restricciones | Modulos relacionados |
|---|---|---|---|
| Administrador | Acceso completo a configuracion, empleados, servicios, pagos, inventario, recetas y dashboard. | Debe mantenerse al menos un administrador activo segun `EmpleadoController`. | Todos los modulos. |
| Recepcionista | Pacientes, citas, servicios, pagos, cortes, comprobantes e inventario operativo segun backend. | No administra empleados ni recetas. En frontend inventario esta visible solo para admin, aunque backend permite admin/recepcionista en productos/movimientos. | Pacientes, agenda, pagos, cortes, comprobantes. |
| Dentista | Consulta general, agenda y recetas. | No puede operar caja, pagos, cortes ni inventario. | Citas, recetas, pacientes/historial clinico. |

Guards y permisos:

- `src/router/index.ts` usa meta flags: `requiresAuth`, `requiresAdmin`, `requiresAdminOrDentista`, `requiresAdminOrRecepcionista`.
- `src/layouts/MainLayout.vue` filtra el menu lateral segun rol.
- Algunas vistas ocultan botones segun rol, por ejemplo pagos/cortes e inventario.
- Backend refuerza permisos con middleware `rol:admin`, `rol:admin,recepcionista` y `rol:admin,dentista` en `routes/api.php`.

## 5. Modulos del sistema

### 5.1 Autenticacion y seguridad

- Vistas: `LoginView.vue`, `ForgotPasswordView.vue`, `ChangePasswordView.vue`, `SendMailLoginView.vue`.
- Servicios: `src/services/auth.ts`.
- Store: `src/stores/auth.ts`.
- Endpoints: `/api/login`, `/api/logout`, `/api/me`, `/api/change-password`, `/api/recover-password-keyword`.
- Controlador: `AuthController`.
- Modelo: `Empleado`.
- Estado: funcional para login/logout/me; recuperacion por palabra clave existe en backend y esta conectada en frontend; cambio de contrasena autenticado tiene riesgo de contrato por nombres de campos.

La recuperacion ya no es por correo. Se plantea por palabra clave con `RecoverPasswordKeywordRequest`, valida `usuario`, `palabraClave`, `new_password` y confirmacion; si la palabra clave estaba en texto plano legacy, backend la migra a hash.

### 5.2 Usuarios / empleados

- Vista: `src/views/usuarios/UsuariosView.vue`.
- Servicios: `src/services/empleados.ts`.
- Endpoints: `/api/empleados`, `/api/tipos-empleado`, `/api/empleados/{id}/reset-password`.
- Controladores: `EmpleadoController`, `TipoEmpleadoController`.
- Modelos/tablas: `Empleado`, `Persona`, `TipoEmpleado`.
- Validaciones: usuario unico, rol, datos personales, no desactivar al propio usuario, no dejar sin admin activo, password hasheado.
- Roles: administracion real por admin; lectura disponible para autenticados segun rutas.
- Estado: funcional segun pruebas backend (`EmpleadoTest` pasa).

### 5.3 Pacientes / personas

- Vistas: `PacientesView.vue`, `RegistrarPacienteDrawer.vue`, `EditarPacienteView.vue`, `VerHistorialPacienteView.vue`.
- Servicio: `src/services/personas.ts`.
- Endpoints: `/api/personas`, `/api/personas/{id}`, `/api/personas/{id}/historial-citas`, `/api/personas/{id}/historial-pagos`.
- Controladores: `PersonaController`, `HistorialPacienteController`.
- Modelo/tabla: `Persona/personas`.
- Validaciones: datos requeridos, correo unico cuando existe, baja logica con `estado=false`, busqueda por nombre/apellidos.
- Roles: admin/recepcionista crean y editan; backend permite historial de citas para roles autenticados y pagos para admin/recepcionista.
- Estado: funcional; historial ya existe en backend y frontend esta preparado para consumirlo.

### 5.4 Agenda / citas

- Vistas: `AgendaView.vue`, `NuevaCitaModal.vue`, `EditarCitaModal.vue`.
- Servicio: `src/services/citas.ts`.
- Endpoints: `/api/citas`, filtros por `fecha`, `paciente_id`, `servicio_id`.
- Controlador: `CitaController`.
- Modelo/tabla: `Cita/citas`.
- Relaciones: persona/paciente, servicio, empleado/dentista, receta, consumo inventario.
- Validaciones backend: cita requiere dentista, evita colision y traslapes, respeta citas inactivas, filtros.
- Roles: admin/recepcionista crean/editan/cancelan; dentista puede consultar.
- Estado: funcional segun pruebas backend (`CitaTest` pasa).

### 5.5 Servicios

- Vista: `ServiciosView.vue`.
- Servicio: `src/services/servicios.ts`.
- Endpoints: `/api/servicios`, `/api/clases-servicio`.
- Controladores: `ServicioController`, `ClaseServicioController`.
- Modelos/tablas: `Servicio/servicios`, `ClaseServicio/clase_servicios`.
- Validaciones: clase existente, nombre, costo, duracion, baja logica.
- Roles: admin/recepcionista administran; autenticados consultan activos.
- Estado: funcional.

### 5.6 Pagos

- Vista: `PagosView.vue`.
- Servicios: `pagos.ts`, `cortes.ts`, `personas.ts`, `comprobantes.ts`.
- Endpoint principal: `POST /api/pagos`.
- Controlador: `PagoController`.
- Modelo/tabla: `Pago/pagos`.
- Servicio backend: `CajaService`.
- Validaciones: paciente requerido, total > 0, efectivo >= 0, tarjeta >= 0, efectivo + tarjeta = total, no enviar `idEmpleado`, `idCorte` ni `pagado`.
- Reglas: backend asigna empleado autenticado y corte activo; si no hay corte abierto devuelve `422`.
- Roles: admin/recepcionista; dentista bloqueado.
- Estado: funcional segun `PagoTest`.

### 5.7 Cortes de caja

- Vista: `CortesView.vue`.
- Servicio: `src/services/cortes.ts`.
- Endpoints: `/api/cortes`, `/api/cortes/activo`.
- Controlador: `CorteController`.
- Modelo/tabla: `Corte/cortes`.
- Servicio backend: `CajaService`.
- Flujo: abrir corte, registrar pagos asociados, cerrar corte; al cerrar se calculan totales reales.
- Validaciones: no abrir doble corte, no modificar corte cerrado, `GET /cortes/activo` devuelve 404 si no hay caja abierta.
- Roles: admin/recepcionista; dentista bloqueado.
- Estado: funcional segun `CorteTest`.

### 5.8 Comprobantes internos

- Vista: `PagosView.vue`, dialogo "Emitir Comprobante Interno".
- Servicio: `src/services/comprobantes.ts`.
- Endpoints: `/api/comprobantes`.
- Controlador: `ComprobanteController`.
- Modelo/tabla: `Comprobante/comprobantes`.
- Servicio backend: `ComprobanteService`.
- Naturaleza: son recibos internos; no son facturas fiscales, no CFDI, no SAT, no timbrado.
- Validaciones: pago existente, pago activo, pago liquidado, folio unico, un comprobante por pago incluso si se cancela.
- Estado: funcional para API; no genera archivo descargable PDF/DOCX/XLSX.

### 5.9 Inventario

- Vista: `InventarioView.vue`.
- Servicio: `src/services/inventario.ts`.
- Endpoints: `/api/inventario/productos`, `/api/inventario/movimientos`.
- Controladores: `ProductoInventarioController`, `MovimientoInventarioController`.
- Modelos/tablas: `ProductoInventario/productos_inventario`, `MovimientoInventario/movimientos_inventario`.
- Reglas: stock no se edita directo; se modifica mediante movimientos de `entrada`, `salida` y `ajuste`.
- Validaciones: nombre activo duplicado, cantidad no negativa, salida no deja stock negativo, backend asigna empleado/stock anterior/stock nuevo.
- Roles: backend permite admin/recepcionista; frontend actualmente muestra inventario solo a admin por guard.
- Estado: funcional segun `InventarioTest`; hay una discrepancia menor frontend/backend en permisos de recepcionista.

### 5.10 Consumo automatico de inventario por servicio

- Vista: seccion "Consumo por servicio" en `InventarioView.vue`.
- Servicio: `getConsumosServicio`, `createConsumoServicio`, `updateConsumoServicio`, `removeConsumoServicio`, `consumirInventarioCita`.
- Endpoints: `/api/inventario/consumos-servicio`, `/api/citas/{id}/consumir-inventario`.
- Controladores: `ConsumoServicioController`, `ConsumoInventarioCitaController`.
- Modelos/tablas: `ConsumoServicio`, `ConsumoInventarioCita`, pivote `consumo_inventario_cita_movimientos`.
- Concepto: una regla indica que un servicio consume cierta cantidad de un producto de inventario.
- Por que no debe descontarse al crear una cita: la cita puede cancelarse o reprogramarse. Debe descontarse cuando se confirma/finaliza la atencion.
- Doble consumo: backend usa `idCita` unico en `consumos_inventario_cita` y devuelve `409` si ya se consumio.
- Estado: backend funcional segun `ConsumoServicioTest` y `ConsumoInventarioCitaTest`; frontend preparado para reglas, ejecucion automatica desde agenda no esta expuesta visualmente.

### 5.11 Dashboard

- Vista: `DashboardView.vue`.
- Servicio: `src/services/dashboard.ts`.
- Endpoint: `/api/dashboard/resumen`.
- Controlador: `DashboardController`.
- Modelos usados: `Persona`, `Cita`, `Pago`, `ProductoInventario`.
- Indicadores: pacientes activos, citas de hoy, ingresos de hoy, productos bajo stock, citas proximas y alertas de inventario.
- Estado: backend funcional segun `DashboardTest`; frontend consume endpoint y ya no muestra datos hardcodeados.

### 5.12 Recetas

- Vista: `RecetasView.vue`.
- Servicio: `src/services/recetas.ts`.
- Endpoints: `/api/recetas`.
- Controlador: `RecetaController`.
- Modelo/tabla: `Receta/recetas`.
- Reglas: receta asociada a cita; no duplicar receta por cita; recepcionista no accede; dentista y admin consultan/crean/actualizan; solo admin elimina.
- Estado: backend funcional segun `RecetaTest`; vista frontend existe con estado basico.

## 6. APIs y comunicacion frontend/backend

| Modulo | Metodo | Endpoint | Servicio frontend | Controlador backend | Descripcion |
|---|---|---|---|---|---|
| Auth | POST | `/api/login` | `auth store`, `auth.ts` | `AuthController@login` | Inicia sesion y devuelve token. |
| Auth | GET | `/api/me` | `auth.ts`, store | `AuthController@me` | Obtiene empleado autenticado. |
| Auth | POST | `/api/logout` | store/auth | `AuthController@logout` | Revoca token actual. |
| Auth | POST | `/api/change-password` | `auth.ts` | `AuthController@changePassword` | Cambia contrasena autenticada; revisar contrato de campos frontend. |
| Auth | POST | `/api/recover-password-keyword` | `auth.ts` | `AuthController@recoverPasswordKeyword` | Recupera por palabra clave. |
| Pacientes | GET/POST/PUT/DELETE | `/api/personas` | `personas.ts` | `PersonaController` | CRUD con baja logica. |
| Pacientes | GET | `/api/personas/{id}/historial-citas` | `personas.ts` | `HistorialPacienteController@citas` | Historial clinico por paciente. |
| Pacientes | GET | `/api/personas/{id}/historial-pagos` | `personas.ts` | `HistorialPacienteController@pagos` | Historial financiero por paciente. |
| Empleados | GET/POST/PUT/DELETE | `/api/empleados` | `empleados.ts` | `EmpleadoController` | Administracion de usuarios. |
| Empleados | POST | `/api/empleados/{id}/reset-password` | `empleados.ts` | `EmpleadoController@resetPassword` | Restablece password y fuerza cambio. |
| Citas | GET/POST/PUT/DELETE | `/api/citas` | `citas.ts` | `CitaController` | Agenda y cancelacion logica. |
| Servicios | GET/POST/PUT/DELETE | `/api/servicios` | `servicios.ts` | `ServicioController` | Catalogo de servicios. |
| Servicios | GET/POST/... | `/api/clases-servicio` | `servicios.ts` | `ClaseServicioController` | Categorias de servicios. |
| Pagos | GET/POST/PUT/DELETE | `/api/pagos` | `pagos.ts` | `PagoController` | Cobros asociados a corte. |
| Cortes | GET/POST/PUT/DELETE | `/api/cortes` | `cortes.ts` | `CorteController` | Apertura/cierre de caja. |
| Cortes | GET | `/api/cortes/activo` | `cortes.ts` | `CorteController@activo` | Consulta caja abierta. |
| Comprobantes | GET/POST/DELETE | `/api/comprobantes` | `comprobantes.ts` | `ComprobanteController` | Recibos internos. |
| Inventario | GET/POST/PUT/DELETE | `/api/inventario/productos` | `inventario.ts` | `ProductoInventarioController` | Productos e insumos. |
| Inventario | GET/POST | `/api/inventario/movimientos` | `inventario.ts` | `MovimientoInventarioController` | Movimientos de stock. |
| Inventario | GET/POST/PUT/DELETE | `/api/inventario/consumos-servicio` | `inventario.ts` | `ConsumoServicioController` | Reglas de consumo por servicio. |
| Inventario | POST | `/api/citas/{id}/consumir-inventario` | `inventario.ts` | `ConsumoInventarioCitaController` | Aplica consumo automatico. |
| Dashboard | GET | `/api/dashboard/resumen` | `dashboard.ts` | `DashboardController` | Indicadores agregados. |
| Recetas | GET/POST/PUT/DELETE | `/api/recetas` | `recetas.ts` | `RecetaController` | Recetas por cita. |

Estado observado: `php artisan route:list --path=api` mostro 72 rutas API. `php artisan test` paso 155 pruebas.

## 7. Modelos y tablas de la base de datos

| Tabla | Modelo Laravel | Proposito | Campos principales | Relaciones |
|---|---|---|---|---|
| `personas` | `Persona` | Pacientes y datos personales de empleados. | `idPersona`, `nombre`, `apellidoP`, `apellidoM`, `celular`, `correoElectronico`, `fechaRegistro`, `estado`. | Tiene muchas `citas`, `pagos`; tiene un `empleado`. |
| `tipo_empleados` | `TipoEmpleado` | Catalogo de roles/tipos de empleado. | `idTipoEmpleado`, `nombre`, `descripcion`, `estado`. | Tiene muchos `empleados`. |
| `empleados` | `Empleado` | Usuarios autenticables del sistema. | `idEmpleado`, `idPersona`, `idTipoEmpleado`, `usuario`, `rfc`, `contraseña`, `palabraClave`, `cambioContraseña`, `estado`. | Pertenece a `persona` y `tipoEmpleado`; tiene pagos. |
| `clase_servicios` | `ClaseServicio` | Categorias de servicios dentales. | `idClaseServicio`, `nombre`, `estado`. | Tiene muchos `servicios`. |
| `servicios` | `Servicio` | Catalogo de tratamientos/servicios. | `idServicio`, `idClaseServicio`, `nombre`, `descripcion`, `costo`, `duracion`, `estado`. | Pertenece a clase; tiene citas y reglas de consumo. |
| `citas` | `Cita` | Agenda de pacientes con servicio y dentista. | `idCita`, `idPersona`, `idServicio`, `idEmpleado`, `fechaRegistro`, `fechaProgramada`, `hora`, `duracion`, `motivo`, `estado`. | Pertenece a persona, servicio y empleado; tiene receta y consumo inventario. |
| `recetas` | `Receta` | Indicaciones clinicas asociadas a cita. | `idReceta`, `idCita`, `indicaciones`, `estado`. | Pertenece a cita. |
| `cortes` | `Corte` | Turnos/cortes de caja. | `idCorte`, `fechaInicio`, `fechaFin`, `fDeCaja`, `tEfectivo`, `tTarjeta`, `correcto`, `estado`. | Tiene muchos pagos. |
| `pagos` | `Pago` | Cobros realizados a pacientes. | `idPago`, `idPersona`, `idEmpleado`, `idCorte`, `fechaRegistro`, `total`, `pagado`, `efectivo`, `tarjeta`, `estado`. | Pertenece a persona, empleado y corte; tiene un comprobante. |
| `comprobantes` | `Comprobante` | Recibos internos por pago. | `idComprobante`, `idPago`, `folio`, `fechaEmision`, `total`, `efectivo`, `tarjeta`, `estado`, `observaciones`. | Pertenece a pago. |
| `productos_inventario` | `ProductoInventario` | Insumos/materiales. | `idProductoInventario`, `nombre`, `descripcion`, `unidadMedida`, `stockActual`, `stockMinimo`, `costoUnitario`, `estado`. | Tiene movimientos y reglas de consumo. |
| `movimientos_inventario` | `MovimientoInventario` | Entradas, salidas y ajustes de stock. | `idMovimientoInventario`, `idProductoInventario`, `idEmpleado`, `tipoMovimiento`, `cantidad`, `stockAnterior`, `stockNuevo`, `motivo`, `fechaMovimiento`. | Pertenece a producto y empleado. |
| `consumos_servicio` | `ConsumoServicio` | Reglas de insumos consumidos por servicio. | `idConsumoServicio`, `idServicio`, `idProductoInventario`, `cantidad`, `estado`. | Pertenece a servicio y producto. |
| `consumos_inventario_cita` | `ConsumoInventarioCita` | Registro de consumo aplicado a una cita. | `idConsumoInventarioCita`, `idCita`, `idEmpleado`, `fechaConsumo`, `estado`. | Pertenece a cita y empleado; relaciona movimientos. |
| `consumo_inventario_cita_movimientos` | pivote | Une consumo de cita con movimientos generados. | `id`, `idConsumoInventarioCita`, `idMovimientoInventario`. | Pivote many-to-many. |
| `personal_access_tokens` | Sanctum | Tokens Bearer de API. | `tokenable`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`. | Relacionado con usuario autenticable. |
| `users`, `password_reset_tokens`, `failed_jobs` | Modelos base Laravel | Tablas genericas de Laravel. | Campos default Laravel. | No son el dominio principal de DentalSys. |

## 8. Vistas de cada tabla o entidad

| Entidad / tabla | Vista frontend | Ruta frontend | Funcion de la vista |
|---|---|---|---|
| `personas` | `PacientesView.vue`, `RegistrarPacienteDrawer.vue`, `EditarPacienteView.vue`, `VerHistorialPacienteView.vue` | `/pacientes`, `/pacientes/:id/editar`, `/pacientes/:id/historial` | Listar, buscar, registrar, editar, baja logica e historial. |
| `empleados` | `UsuariosView.vue` | `/empleados` | Administrar usuarios/empleados. |
| `tipo_empleados` | `UsuariosView.vue` | `/empleados` | Catalogo cargado para seleccionar rol/tipo. |
| `citas` | `AgendaView.vue`, `NuevaCitaModal.vue`, `EditarCitaModal.vue` | `/citas` | Agenda, crear, editar y cancelar citas. |
| `servicios` | `ServiciosView.vue` | `/servicios` | Catalogo de servicios. |
| `clase_servicios` | `ServiciosView.vue` | `/servicios` | Categoria/clase al crear servicio. |
| `pagos` | `PagosView.vue` | `/pagos` | Registro e historial de pagos. |
| `cortes` | `CortesView.vue` | `/cortes` | Abrir y cerrar caja. |
| `comprobantes` | `PagosView.vue` | `/pagos` | Emitir comprobante interno desde un pago. |
| `productos_inventario` | `InventarioView.vue` | `/inventario` | Administrar insumos. |
| `movimientos_inventario` | `InventarioView.vue` | `/inventario` | Registrar entradas/salidas/ajustes. |
| `consumos_servicio` | `InventarioView.vue` | `/inventario` | Configurar consumo por servicio. |
| `consumos_inventario_cita` | Sin vista directa completa | N/A | Se registra al consumir inventario de cita; frontend tiene servicio preparado. |
| `recetas` | `RecetasView.vue` | `/recetas` | Gestion de recetas, estado basico en frontend. |
| `personal_access_tokens` | Sin vista directa | N/A | Tabla tecnica de auth; se administra por Sanctum. |

## 9. Controladores usados

| Controlador | Archivo | Modulo | Metodos principales | Endpoints relacionados |
|---|---|---|---|---|
| `AuthController` | `app/Http/Controllers/AuthController.php` | Auth | `login`, `logout`, `me`, `changePassword`, `recoverPasswordKeyword` | `/login`, `/logout`, `/me`, `/change-password`, `/recover-password-keyword` |
| `PersonaController` | `PersonaController.php` | Pacientes | `index`, `store`, `show`, `update`, `destroy` | `/personas` |
| `EmpleadoController` | `EmpleadoController.php` | Empleados | CRUD, `resetPassword` | `/empleados`, `/empleados/{id}/reset-password` |
| `CitaController` | `CitaController.php` | Agenda | CRUD, filtros | `/citas` |
| `ServicioController` | `ServicioController.php` | Servicios | CRUD/baja logica | `/servicios` |
| `PagoController` | `PagoController.php` | Pagos | `index`, `store`, `update`, `destroy` | `/pagos` |
| `CorteController` | `CorteController.php` | Cortes | `activo`, `store`, `update` | `/cortes`, `/cortes/activo` |
| `ComprobanteController` | `ComprobanteController.php` | Comprobantes | `index`, `store`, `show`, `destroy` | `/comprobantes` |
| `ProductoInventarioController` | `ProductoInventarioController.php` | Inventario | CRUD productos | `/inventario/productos` |
| `MovimientoInventarioController` | `MovimientoInventarioController.php` | Inventario | `index`, `store` | `/inventario/movimientos` |
| `ConsumoServicioController` | `ConsumoServicioController.php` | Inventario | CRUD reglas | `/inventario/consumos-servicio` |
| `DashboardController` | `DashboardController.php` | Dashboard | `resumen` | `/dashboard/resumen` |
| `HistorialPacienteController` | `HistorialPacienteController.php` | Historial | `citas`, `pagos` | `/personas/{id}/historial-*` |
| `RecetaController` | `RecetaController.php` | Recetas | CRUD por rol | `/recetas` |

Detalle de dos controladores:

- `AuthController`: recibe credenciales, valida campos, busca un `Empleado` activo, compara hash de contrasena, crea token Sanctum y devuelve `EmpleadoResource`. Tambien revoca tokens en logout y recuperacion por palabra clave.
- `PagoController`: recibe un `StorePagoRequest`, valida paciente y montos, delega en `CajaService` para asegurar corte abierto, asignar empleado/corte y crear el pago dentro de transaccion.

## 10. Archivo generado descargable

Se busco evidencia de generacion o descarga de archivos con: `PDF`, `pdf`, `DOCX`, `XLSX`, `Excel`, `download`, `blob`, `responseType`, `file-saver`, `Storage::download`, `streamDownload`.

Resultado: no se encontro implementacion real de archivo descargable PDF/DOCX/XLSX en frontend ni backend accesible.

Estado del requisito: **pendiente critico para el profesor**.

Decision funcional del equipo: no implementar reportes PDF, correos ni facturacion fiscal. Sin embargo, el requisito del profesor pide al menos un archivo descargable PDF/DOCX/XLSX.

Opcion minima recomendada, sin implementarla aqui:

1. Exportar inventario a XLSX.
2. Exportar listado de pacientes a XLSX.
3. Exportar corte de caja a XLSX.
4. Descargar comprobante interno como PDF solo si se decide agregar soporte, aclarando que no es CFDI.

## 11. Eventos y rutinas JavaScript

| Evento | Tipo | Archivo | Rutina JS asociada | Que hace |
|---|---|---|---|---|
| `@submit.prevent` | submit | `src/views/auth/LoginView.vue` | `handleLogin` | Valida y ejecuta login. |
| `@click` | click | `src/layouts/MainLayout.vue` | `auth.logout()` | Cierra sesion y limpia token. |
| `onMounted` | ciclo de vida/load | `src/layouts/MainLayout.vue` | `auth.fetchMe()` | Carga usuario autenticado al montar layout. |
| `@click` | click | `src/views/cortes/CortesView.vue` | `abrirCorte`, `cerrarCorte` | Abre/cierra caja. |
| `@click` | click | `src/views/pagos/PagosView.vue` | `registrarPago`, `generarComprobante` | Registra cobro y emite comprobante interno. |
| `@click` | click | `src/views/inventario/InventarioView.vue` | `handleSaveStock` | Crea movimiento de inventario. |
| `watch` | watcher/reactivo | `src/views/agenda/NuevaCitaModal.vue` | watchers de props/formulario | Sincroniza modal y valores de cita. |
| `@focusout` | focus | `src/views/agenda/AgendaView.vue` | `cerrarFiltroDentistaDiferido` | Cierra filtro de dentista despues de perder foco. |

Cumplimiento: hay mas de 4 eventos, mas de 2 tipos diferentes (`submit`, `click`, `onMounted/load`, `watch`, `focusout`) y mas de 3 ejecutan rutinas JavaScript reales.

## 12. Validaciones del sistema

### Validaciones frontend

- Login: campos requeridos y manejo de error.
- Recuperacion por palabra clave: usuario, palabra clave, nueva contrasena y confirmacion.
- Pago: paciente requerido, total > 0, efectivo + tarjeta = total.
- Pagos: boton registrar deshabilitado si no hay corte activo.
- Inventario: cantidad > 0 para reglas de consumo; submit doble limitado con flags `saving`.
- Vistas usan estados `loading`, `error`, `empty`.

### Validaciones backend

| Modulo | Validacion | Frontend / Backend | Archivo o endpoint |
|---|---|---|---|
| Auth | Token requerido | Backend | `auth:sanctum`, `/api/*` privado |
| Auth | Empleado activo | Backend | `EnsureEmpleadoIsActive.php` |
| Roles | Permisos por rol | Backend | `CheckRol.php`, `routes/api.php` |
| Login | Credenciales correctas | Backend | `AuthController@login` |
| Recuperacion | Palabra clave y confirmacion | Backend | `RecoverPasswordKeywordRequest.php` |
| Pacientes | Correo unico, campos requeridos, baja logica | Backend | `StorePersonaRequest`, `PersonaController` |
| Empleados | Password hash, no ultimo admin, no self-disable | Backend | `EmpleadoController` |
| Citas | Dentista, horarios, colisiones | Backend | `StoreCitaRequest`, `CitaTest` |
| Pagos | Total = efectivo + tarjeta | Frontend/Backend | `PagosView.vue`, `StorePagoRequest.php` |
| Cortes | Corte activo unico, no modificar cerrado | Backend | `CajaService`, `CorteController` |
| Comprobantes | Un comprobante por pago liquidado | Backend | `ComprobanteService` |
| Inventario | No stock negativo | Backend | `InventarioService` |
| Consumo | No doble consumo por cita | Backend | `ConsumoInventarioCitaService` |

## 13. Seguridad

- Autenticacion con tokens Bearer de Sanctum.
- Axios centralizado inyecta `Authorization`.
- Rutas privadas protegidas por Vue Router y por Laravel.
- `401` limpia sesion en frontend para endpoints privados.
- `403` redirige a `/forbidden` en GET y backend devuelve JSON.
- La palabra clave no se expone en responses; backend la guarda hasheada o migra legacy a hash.
- No hay correos automaticos ni recuperacion por correo.
- No hay CFDI/SAT ni timbrado fiscal.
- Comprobantes son internos.

## 14. Estado actual del proyecto

| Modulo | Estado | Observaciones |
|---|---|---|
| Auth/login | Funcional | Login real probado por backend tests y frontend conectado. |
| Cambio de contrasena | En riesgo | Backend funcional, pero frontend usa nombres de campos distintos. |
| Recuperacion palabra clave | Funcional/Preparado | Backend y frontend tienen contrato; requiere prueba manual end-to-end con palabra clave real. |
| Usuarios/empleados | Funcional | Tests backend pasan. |
| Pacientes/personas | Funcional | CRUD e historial disponibles. |
| Agenda/citas | Funcional | Tests de colisiones y filtros pasan. |
| Servicios | Funcional | API y vista existentes. |
| Pagos | Funcional | Validaciones y roles probados en backend. |
| Cortes | Funcional | Corte activo, apertura y cierre probados. |
| Comprobantes internos | Funcional API | No descarga archivo. |
| Inventario | Funcional | Productos, movimientos y stock insuficiente probados. |
| Consumo automatico | Parcial frontend | Backend funcional; frontend configura reglas, pero no hay boton visible en agenda para ejecutar consumo. |
| Dashboard | Funcional API | Frontend consume endpoint real. |
| Recetas | Parcial frontend | Backend completo; vista existe pero debe revisarse para demo. |
| Archivo descargable | Pendiente critico | No hay PDF/DOCX/XLSX descargable. |

## 15. Pendientes y riesgos

### Pendientes frontend

- Alinear `ChangePasswordView.vue`/`auth.ts` con los campos backend `contraseñaActual`, `nuevaContraseña`, `nuevaContraseña_confirmation`.
- Probar manualmente recuperacion por palabra clave con datos reales.
- Exponer accion de consumo automatico de inventario desde el flujo de cita si se requiere para demo.
- Revisar `RecetasView.vue` si se va a presentar.

### Pendientes backend

- No se detectan endpoints principales faltantes; `route:list` muestra contratos requeridos.
- Confirmar politica de inventario: backend permite admin/recepcionista, frontend menu lo restringe a admin.

### Pendientes de requisitos del profesor

- Falta generacion/descarga de al menos un archivo PDF/DOCX/XLSX.

### Fuera de alcance por decision del equipo

- Facturacion fiscal CFDI/SAT.
- Timbrado fiscal.
- Correos automaticos.
- Recuperacion por correo.

## 16. Guion breve para exposicion

1. Presentar DentalSys como sistema web para clinica dental.
2. Explicar arquitectura separada: Vue 3 + Laravel + API REST.
3. Mostrar login: payload, token Bearer, store Pinia e interceptor Axios.
4. Explicar roles: administrador, recepcionista, dentista.
5. Recorrer modulos: pacientes, agenda, servicios, pagos, cortes, comprobantes, inventario, dashboard y recetas.
6. Flujo ejemplo: recepcionista registra paciente, agenda cita, abre corte, registra pago y emite comprobante interno; admin administra inventario.
7. Explicar validaciones: pagos completos, corte abierto, roles, stock insuficiente, doble consumo.
8. Requisitos del profesor: modelos/tablas, vistas, controladores, eventos.
9. Cerrar con estado: sistema avanzado y probado en backend, con brecha pendiente del archivo descargable.

## 17. Checklist de requisitos del profesor

| Requisito | Cumple | Evidencia | Archivo |
|---|---|---|---|
| Modelo de cada tabla | Si | Modelos Eloquent y migraciones detectados para dominio principal. | `C:\laragon\www\dentistaWebPg\app\Models`, `database/migrations` |
| Vista de cada tabla | Parcial | Vistas para tablas principales; tablas tecnicas/pivote no tienen vista directa. | `src/views/*` |
| Al menos 2 controladores | Si | Hay mas de 10 controladores API. | `app/Http/Controllers` |
| Archivo descargable PDF/DOCX/XLSX | No | No se encontro implementacion de descarga/export. | Pendiente |
| Al menos 4 eventos | Si | Hay multiples `@click`, `@submit`, `onMounted`, `watch`, `@focusout`. | `src/views`, `src/layouts` |
| Al menos 2 tipos diferentes de eventos | Si | `submit`, `click`, ciclo de vida, watcher, focus. | `src/views`, `src/layouts` |
| Al menos 3 eventos con rutinas JavaScript | Si | `handleLogin`, `auth.logout`, `abrirCorte`, `registrarPago`, etc. | Archivos listados en seccion 11 |

## Validacion final ejecutada

| Comando | Resultado |
|---|---|
| `npm.cmd run type-check` | Pasa |
| `npx.cmd eslint . --no-cache` | Pasa |
| `npm.cmd run build` | Pasa |
| `php artisan route:list --path=api` | Pasa, 72 rutas API |
| `php artisan test` | Pasa, 155 tests y 556 assertions; advertencia no bloqueante: no pudo escribir `.phpunit.result.cache` por permisos |
