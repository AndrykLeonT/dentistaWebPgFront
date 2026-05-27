# Status por Modulo e Integracion

## Convencion de estados

| Estado | Significado |
|---|---|
| Integrado | La vista llama a API mediante store o servicio |
| Parcial | Existe flujo real, pero falta validar o completar casos |
| Mock interactivo | La pantalla reacciona, pero opera sobre datos locales |
| Placeholder | Solo existe estructura visual basica |
| Preparado | Existe servicio o tipo, pero la UI no lo utiliza |

## Matriz funcional

| Modulo | Ruta | Vista principal | UI | API desde vista | Estado |
|---|---|---|---|---|---|
| Login | `/login` | `views/auth/LoginView.vue` | Completa | Si, mediante store | Parcial/Integrado |
| Cambio de contrasena | `/change-password` | `views/auth/ChangePasswordView.vue` | Completa | Si | Parcial/Integrado |
| Recuperacion | `/forgot-password` | `views/auth/ForgotPasswordView.vue` | Completa | No | Mock interactivo |
| Dashboard | `/dashboard` | `views/dashboard/DashboardView.vue` | Completa | No | Mock |
| Pacientes | `/pacientes` | `views/pacientes/PacientesView.vue` | Completa | No | Mock interactivo |
| Historial paciente | `/pacientes/:id/historial` | `views/pacientes/VerHistorialPacienteView.vue` | Completa | No | Mock |
| Editar paciente | `/pacientes/:id/editar` | `views/pacientes/EditarPacienteView.vue` | Completa | No | Mock |
| Citas | `/citas` | `views/agenda/AgendaView.vue` | Completa | No | Mock interactivo |
| Servicios | `/servicios` | `views/servicios/ServiciosView.vue` | Completa | No | Mock interactivo |
| Empleados | `/empleados` | `views/usuarios/UsuariosView.vue` | Completa | No | Mock interactivo |
| Pagos | `/pagos` | `views/pagos/PagosView.vue` | Completa | No | Mock interactivo |
| Inventario | `/inventario` | `views/inventario/InventarioView.vue` | Completa | No hay servicio | Mock interactivo |
| Recetas | `/recetas` | `views/recetas/RecetasView.vue` | Minima | No | Placeholder |
| Cortes | `/cortes` | `views/cortes/CortesView.vue` | Minima | No | Placeholder |

## Autenticacion

### Ya existe

- `POST /login` ejecutado en `src/stores/auth.ts`.
- Almacenamiento local de token, empleado y bandera de cambio obligatorio.
- `POST /logout`.
- `POST /change-password` desde la vista correspondiente.
- `GET /me` declarado en store y servicio.
- Guards y sidebar condicionados por rol.
- Manejo global inicial para respuestas `401` y `403`.

### Falta

- Endpoint real de recuperacion de contrasena desde
  `ForgotPasswordView.vue`.
- Verificacion automatizada de sesion persistida y expiracion.
- Confirmar contrato real del backend para todos los casos de error.

## Dashboard

### Ya existe

- Tarjetas de indicadores.
- Lista de citas del dia.
- Panel de alertas de inventario.

### Falta

- Consultar estadisticas reales.
- Consultar citas del dia reales.
- Consultar alertas reales de inventario.
- Definir endpoints o agregaciones requeridas.

## Pacientes

### Ya existe

- Listado con busqueda y filtro de estado.
- Drawer para registro.
- Vista de historial con tabs.
- Pantalla de edicion.
- Servicio `src/services/personas.ts` con CRUD.

### Falta

- Consumir `personas.getAll()` en listado.
- Crear pacientes desde drawer y manejar validaciones.
- Cargar paciente por `route.params.id`.
- Actualizar paciente y desactivar registro.
- Sustituir datos de citas/pagos del historial por respuestas reales.
- Eliminar `console.log` como comportamiento de guardado.

## Agenda / Citas

### Ya existe

- Calendario diario, filtro de dentista y modales de alta/edicion.
- Servicio `src/services/citas.ts`.

### Falta

- Sustituir catalogos locales por pacientes, dentistas y servicios reales.
- Implementar `create` y `update`; los modales aun contienen `TODO`.
- Implementar cancelacion.
- Manejar colisiones de horario y errores `422`.
- Unificar nombre de archivo `NuevaCitaModal.vue` y tipar scripts con TypeScript.

## Servicios

### Ya existe

- Tabla, filtros, modal de alta y edicion.
- Servicio CRUD y servicio de categorias en `src/services/servicios.ts`.

### Falta

- Cargar catalogo desde API.
- Crear/actualizar/desactivar usando servicio.
- Cargar clases de servicio desde API.
- Permisos de accion: definir quien puede administrar catalogos.

## Empleados

### Ya existe

- Tabla, filtros, alta y edicion visual.
- Servicio CRUD y reset de contrasena en `src/services/empleados.ts`.

### Falta

- Consumir API.
- Crear empleado con contrato real y contrasena temporal.
- Implementar desactivacion y reset de contrasena.
- Restringir acciones de administracion a administrador.
- Corregir errores TypeScript actuales de la vista.

## Pagos

### Ya existe

- Pantalla, modal de registro y modal de comprobante.
- Servicio `src/services/pagos.ts`.
- Restriccion de acceso para admin/recepcionista en router.

### Falta

- Consultar corte activo antes de habilitar cobros.
- Cargar pacientes/citas/servicios y pagos reales.
- Registrar pago mediante API.
- Calcular y validar efectivo/tarjeta/total.
- Decidir e implementar exportacion, impresion, email y facturacion.

## Cortes de caja

### Ya existe

- Ruta protegida.
- Servicio con `getActivo`, `create`, `close`, listado y detalle.

### Falta

- Toda la interfaz operativa: apertura, corte activo, totales, cierre e historial.
- Integracion obligatoria con el flujo de pagos.

## Recetas

### Ya existe

- Ruta restringida a administrador o dentista.
- Servicio con listado, detalle, alta y actualizacion.

### Falta

- Toda la pantalla operativa.
- Seleccion/asociacion de cita.
- Validacion de receta duplicada.
- Visualizacion y edicion de indicaciones.

## Inventario

### Ya existe

- Tabla, filtros, modales y alertas visuales.
- Datos mock centralizados en `src/lib/mock-data.ts`.
- Ruta limitada a administrador.

### Falta

- Contrato API y archivo `src/services/inventario.ts`, si el modulo forma parte del
  alcance final.
- Persistencia de insumos y movimientos.
- Conexion de alertas del dashboard.

## Servicios definidos pero no consumidos en UI

| Archivo | Estado de consumo |
|---|---|
| `src/services/auth.ts` | Consumido parcialmente por cambio de contrasena |
| `src/services/personas.ts` | No consumido por vistas |
| `src/services/citas.ts` | No consumido por vistas |
| `src/services/servicios.ts` | No consumido por vistas |
| `src/services/empleados.ts` | No consumido por vistas |
| `src/services/pagos.ts` | No consumido por vistas |
| `src/services/recetas.ts` | No consumido por vistas |
| `src/services/cortes.ts` | No consumido por vistas |

## Archivos a observar primero al implementar

| Objetivo | Archivos clave |
|---|---|
| Autenticacion | `src/stores/auth.ts`, `src/services/api.ts`, `src/views/auth/*` |
| Permisos | `src/router/index.ts`, `src/layouts/MainLayout.vue` |
| Pacientes | `src/views/pacientes/*`, `src/components/pacientes/*`, `src/services/personas.ts` |
| Citas | `src/views/agenda/*`, `src/services/citas.ts` |
| Finanzas | `src/views/pagos/PagosView.vue`, `src/views/cortes/CortesView.vue`, `src/services/pagos.ts`, `src/services/cortes.ts` |
| Catalogos | `src/views/servicios/ServiciosView.vue`, `src/services/servicios.ts` |
| Personal | `src/views/usuarios/UsuariosView.vue`, `src/services/empleados.ts` |

