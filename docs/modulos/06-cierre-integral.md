# Fase 06 - Cierre integral frontend

## Objetivo

Cerrar pendientes restantes del frontend DentalSys sin tocar backend, dejando las pantallas preparadas para contratos API claros cuando el backend todavia no expone el endpoint.

## Alcance

- No se modifico backend.
- No se modifico base de datos.
- No se implementaron correos.
- No se implementaron PDFs.
- No se implemento facturacion CFDI/SAT.
- No se refactorizaron modulos de companeros.
- El frontend quedo preparado para endpoints backend pendientes.

## Contexto inicial

| Dato | Resultado |
|---|---|
| Rama | `main` |
| Commit | `6e5f7bf` |
| Backend disponible | Si, Laravel responde en `/api` con 404 de ruta base |
| URL API | `http://localhost:8000/api` |
| Usuarios usados | `test.admin@dentalsys.local`, `test.recepcionista@dentalsys.local`, `test.dentista@dentalsys.local` |
| Fase 01 | Auth alineado al backend real con `{ usuario, contraseña }` |
| Fase 02 | Pacientes conectados; historial pendiente |
| Fase 03 | Pagos/cortes/comprobantes conectados parcialmente |
| Fase 04 | Inventario con API real para productos/movimientos |
| Fase 05 | Auth palabra clave visual, ahora conectado al contrato propuesto |

## Archivos revisados

- `docs/planes/06_FASE_CIERRE_INTEGRAL_FRONTEND_PREPARADO_BACKEND.md`
- `docs/modulos/00-plan-restante.md`
- `docs/modulos/01-auth-seguridad.md`
- `docs/modulos/02-pacientes.md`
- `docs/modulos/03-pagos-facturacion.md`
- `docs/modulos/04-inventario.md`
- `docs/modulos/05-auth-palabra-clave.md`
- `src/views/auth/ForgotPasswordView.vue`
- `src/views/auth/SendMailLoginView.vue`
- `src/views/pagos/PagosView.vue`
- `src/views/cortes/CortesView.vue`
- `src/views/inventario/InventarioView.vue`
- `src/views/pacientes/VerHistorialPacienteView.vue`
- `src/views/dashboard/DashboardView.vue`
- `src/services/auth.ts`
- `src/services/personas.ts`
- `src/services/inventario.ts`
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- `src/services/comprobantes.ts`
- `src/types/index.ts`

## Archivos modificados

| Archivo | Motivo |
|---|---|
| `src/services/auth.ts` | Agregar `recoverPasswordByKeyword` contra `/recover-password-keyword`. |
| `src/services/api.ts` | Evitar que un `401` de recuperacion publica limpie sesion/redirija como si fuera token expirado. |
| `src/views/auth/ForgotPasswordView.vue` | Conectar formulario de palabra clave al servicio real y manejar `401`, `404`, `422`, `500`. |
| `src/views/auth/SendMailLoginView.vue` | Retirar promesa de correo y redirigir al flujo por palabra clave. |
| `src/services/personas.ts` | Agregar metodos de historial por paciente. |
| `src/views/pacientes/VerHistorialPacienteView.vue` | Cargar historial real o mostrar pendiente backend sin mocks. |
| `src/services/inventario.ts` | Agregar reglas de consumo por servicio y consumo automatico por cita. |
| `src/views/inventario/InventarioView.vue` | Agregar seccion de consumo por servicio y restringir gestion a admin. |
| `src/services/dashboard.ts` | Crear servicio `getResumen`. |
| `src/views/dashboard/DashboardView.vue` | Quitar datos hardcodeados y consumir `/dashboard/resumen`. |
| `src/views/pagos/PagosView.vue` | Cambiar texto de "Facturacion" por "Comprobantes Internos". |
| `src/types/index.ts` | Agregar tipos de contratos nuevos. |
| `docs/backend/REQUERIMIENTOS_BACKEND_PARA_FRONTEND.md` | Documentar contratos backend requeridos. |
| `docs/modulos/06-cierre-integral.md` | Documentar la fase. |
| `docs/INDICE.md` | Agregar documentos nuevos al indice. |

## Pendientes del documento original

| Pendiente | Accion tomada | Estado |
|---|---|---|
| Recuperacion por palabra clave | Servicio y vista conectados a contrato `POST /recover-password-keyword` | Preparado para backend |
| Historial paciente | Metodos y vista conectados a endpoints propuestos | Preparado para backend |
| Cortes/pagos | Smoke API; textos de facturacion retirados | Parcial |
| Inventario | Productos/movimientos reales; consumo por servicio preparado | Parcial |
| Agenda/citas | Smoke API con admin; sin refactor | Parcial |
| Dashboard | Servicio creado y datos hardcodeados eliminados | Preparado para backend |
| Recetas | No tocado, fuera del alcance de implementacion | Fuera de alcance |
| PDF | No se implemento; no se agregaron promesas | Resuelto |
| Correos | `SendMailLoginView` ya no promete envio de correo | Resuelto |
| Facturacion | Texto cambiado a comprobantes internos | Resuelto |
| Consumo automatico inventario | Servicio y UI de reglas preparados | Preparado para backend |

## Metodos agregados

| Metodo | Archivo | Responsabilidad | Parametros | Retorno | Motivo |
|---|---|---|---|---|---|
| `recoverPasswordByKeyword` | `src/services/auth.ts` | Recuperar contrasena por palabra clave | `RecoverPasswordKeywordPayload` | `RecoverPasswordKeywordResponse` | Contrato Fase 06 |
| `getHistorialCitas` | `src/services/personas.ts` | Obtener citas del paciente | `idPersona` | `HistorialCitaPaciente[]` | Historial real |
| `getHistorialPagos` | `src/services/personas.ts` | Obtener pagos del paciente | `idPersona` | `HistorialPagoPaciente[]` | Historial real |
| `getConsumosServicio` | `src/services/inventario.ts` | Listar reglas de consumo | Ninguno | `ApiListResponse<ConsumoServicio>` | Consumo automatico |
| `createConsumoServicio` | `src/services/inventario.ts` | Crear regla de consumo | `StoreConsumoServicioPayload` | `ApiSingleResponse<ConsumoServicio>` | Consumo automatico |
| `updateConsumoServicio` | `src/services/inventario.ts` | Actualizar regla | `id`, payload parcial | `ApiSingleResponse<ConsumoServicio>` | Consumo automatico |
| `removeConsumoServicio` | `src/services/inventario.ts` | Eliminar regla | `id` | `void` | Consumo automatico |
| `consumirInventarioCita` | `src/services/inventario.ts` | Ejecutar consumo por cita | `idCita` | `{ message, movimientos }` | Contrato backend |
| `getResumen` | `src/services/dashboard.ts` | Obtener resumen dashboard | Ninguno | `DashboardResumen` | Evitar metricas falsas |

## Metodos modificados

| Metodo | Archivo | Antes | Despues | Motivo |
|---|---|---|---|---|
| `handleSubmit` | `ForgotPasswordView.vue` | Mostraba pendiente sin request | Envia request real y maneja errores | Preparar contrato backend |
| `fetchHistorial` | `VerHistorialPacienteView.vue` | No existia | Consume historiales de citas/pagos | Evitar placeholders |
| `handleSaveConsumo` | `InventarioView.vue` | No existia | Crea/actualiza reglas de consumo | Preparar consumo automatico |
| `fetchConsumosServicio` | `InventarioView.vue` | No existia | Lista reglas o muestra pendiente backend | Preparar consumo automatico |

## Metodos eliminados

| Metodo | Archivo | Motivo | Reemplazo |
|---|---|---|---|
| Ninguno | N/A | N/A | N/A |

## Cambios realizados por area

### Auth palabra clave

`ForgotPasswordView.vue` ahora ejecuta `recoverPasswordByKeyword()` y no simula exito. El backend actual responde `404`, por lo que la UI muestra pendiente backend.

### Pagos/cortes/comprobantes

`GET /pagos` responde `200`. `GET /cortes/activo` responde `404` cuando no hay corte activo y la UI lo interpreta como caja cerrada. Se cambio "Facturacion" por "Comprobantes Internos".

### Inventario

`GET /inventario/productos` y `GET /inventario/movimientos` responden `200` con listas vacias. Se agrego UI y servicios para reglas de consumo por servicio. La vista restringe gestion a admin, alineada con router.

### Consumo automatico

Se preparo contrato frontend para reglas de consumo y `POST /citas/{id}/consumir-inventario`. Backend pendiente para reglas.

### Historial paciente

La vista consume `GET /personas/{id}/historial-citas` y `GET /personas/{id}/historial-pagos`. Backend actual responde `404`; se muestra pendiente backend.

### Dashboard

El dashboard ya no muestra numeros estaticos. Consume `GET /dashboard/resumen` y muestra pendiente backend si responde `404`.

### Funciones fuera de alcance

- PDF: no implementado.
- Correos: no se promete envio.
- Facturacion fiscal: no implementada; se usan comprobantes internos.

## Manejo de errores

- `401`: auth publica muestra error local; auth privada conserva interceptor.
- `403`: interceptor muestra toast y redirige a `/forbidden` en GET.
- `404`: pantallas preparadas muestran pendiente backend cuando aplica.
- `422`: formularios muestran errores por campo cuando backend devuelve `errors`.
- `500+`: mensajes generales sin simular exito.

## Pruebas ejecutadas

| Prueba | Endpoint | Usuario/rol | Payload | Resultado | Estado |
|---|---|---|---|---|---|
| Login admin | `POST /login` | admin | `{ usuario, contraseña }` | `200`, token | Pasa |
| Login recepcionista | `POST /login` | recepcionista | `{ usuario, contraseña }` | `200`, token | Pasa |
| Login dentista | `POST /login` | dentista | `{ usuario, contraseña }` | `200`, token | Pasa |
| Recuperacion palabra clave | `POST /recover-password-keyword` | publico | payload Fase 06 | `404` | Pendiente backend |
| Dashboard | `GET /dashboard/resumen` | admin | N/A | `404` | Pendiente backend |
| Inventario productos | `GET /inventario/productos` | admin | N/A | `200`, `data: []` | Pasa |
| Inventario movimientos | `GET /inventario/movimientos` | admin | N/A | `200`, `data: []` | Pasa |
| Consumos servicio | `GET /inventario/consumos-servicio` | admin | N/A | `404` | Pendiente backend |
| Historial citas | `GET /personas/119/historial-citas` | admin | N/A | `404` | Pendiente backend |
| Historial pagos | `GET /personas/119/historial-pagos` | admin | N/A | `404` | Pendiente backend |
| Pagos | `GET /pagos` | admin | N/A | `200` | Pasa |
| Corte activo | `GET /cortes/activo` | admin | N/A | `404` | Pasa como "sin corte activo" |
| Citas smoke | `GET /citas` | admin | N/A | `200` | Pasa |
| Caja dentista | `GET /pagos`, `/cortes/activo` | dentista | N/A | `403` | Pasa |
| Inventario dentista | `GET /inventario/productos` | dentista | N/A | `403` | Pasa |
| Inventario recepcionista | `GET /inventario/productos` | recepcionista | N/A | `200` | Politica backend por confirmar |
| Type-check | N/A | N/A | `npm.cmd run type-check` | Sin errores | Pasa |
| ESLint | N/A | N/A | `npx.cmd eslint . --no-cache` | Sin errores | Pasa |

## Datos de prueba

No se crearon ni modificaron datos de prueba en esta fase.

## Riesgos

### Riesgos frontend

- Algunas pantallas dependen de endpoints aun no implementados.
- `SendMailLoginView` sigue existiendo por compatibilidad de ruta, pero ya no promete correos.

### Riesgos backend

- Falta recuperacion por palabra clave.
- Falta dashboard agregado.
- Falta historial por paciente.
- Falta configuracion de consumo por servicio.
- Politica de inventario para recepcionista no coincide claramente con el frontend.

### Riesgos de modulos de companeros

- Agenda/citas solo se valido con smoke API; no se refactorizo ni se probaron flujos manuales de crear/editar/cancelar.

## Estado final

Parcial. El frontend queda preparado para backend, con calidad tecnica pasando, pero varias funcionalidades dependen de endpoints aun no disponibles.

## Pendientes reales restantes

### Pendientes frontend

- Probar manualmente UI completa cuando backend implemente los endpoints faltantes.
- Ajustar nombres de campos si backend define contrato distinto.

### Pendientes backend

- Ver `docs/backend/REQUERIMIENTOS_BACKEND_PARA_FRONTEND.md`.

### Pendientes fuera de alcance

- PDF, correos, CFDI/SAT y facturacion fiscal permanecen fuera de alcance.
