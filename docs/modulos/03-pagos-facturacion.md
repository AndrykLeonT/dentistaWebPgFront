# Fase 03 - Pagos, cortes y facturación interna

## Objetivo
El objetivo fue conectar el flujo de trabajo financiero del front-end con el back-end real. Esto incluye poder gestionar turnos a través de Cortes de Caja y procesar pagos asociados al corte activo, permitiendo además la generación de recibos o comprobantes internos.

## Alcance
Se tocaron exclusivamente el módulo de Pagos, Cortes, Comprobantes y las integraciones al sistema de tipos global.
- No se implementó inventario.
- No se implementó dashboard.
- No se implementó CFDI/SAT ni timbrado real.
- No se implementó envío de PDF/correo para comprobantes (no hay soporte API actual).
- No se modificaron los módulos de los compañeros (Agenda, Usuarios, Servicios).

## Contexto inicial
- Rama y Commit: Desarrollo principal local.
- URL API: `http://localhost:8000/api`
- Backend disponible: Sí.
- Usuarios/roles usados para pruebas: Se usó `test.admin@dentalsys.local` para confirmar el flujo de pagos.
- Estado de Fase 02: Completada, Pacientes integrados y el login/token operando.

## Archivos revisados
- `src/types/index.ts`
- `src/services/cortes.ts`
- `src/services/pagos.ts`
- `src/views/cortes/CortesView.vue`
- `src/views/pagos/PagosView.vue`

## Archivos modificados
- `src/types/index.ts`: Añadido el tipo `Comprobante` y acoplados los de `Pago` y `Corte` a los atributos de respuesta JSON.
- `src/services/cortes.ts`: Actualizados los request payloads de `.create()` y `.close()`.
- `src/services/pagos.ts`: El payload de `create()` se alineó para recibir { `idPersona`, `total`, `efectivo`, `tarjeta` }.
- `src/services/comprobantes.ts`: Creado para manejar las rutas `/api/comprobantes`.
- `src/views/cortes/CortesView.vue`: Retirada de información *mock*. Conectado al `cortesService.getActivo()` para mostrar métricas reales y el control de apertura y cierre de la caja con restricciones de rol.
- `src/views/pagos/PagosView.vue`: Implementado el bloqueo por falta de Caja, listado dinámico real, validación de cobro exacto y emisión de comprobantes internos bajo peticiones Axios controladas.

## Contrato backend usado

| Endpoint | Método | Auth | Roles | Payload | Respuesta esperada | Errores esperados |
|----------|--------|------|-------|---------|--------------------|-------------------|
| `/cortes` | GET | Sí | Admin/Recep | N/A | `200 OK` (Array) | `401`, `403` |
| `/cortes/activo` | GET | Sí | Admin/Recep | N/A | `200 OK` (Objeto) | `401`, `403`, `404` (Si no hay activo) |
| `/cortes` | POST | Sí | Admin/Recep | `{}` | `201 Created` | `401`, `403`, `422` (Si ya hay activo) |
| `/cortes/{id}` | PUT/PATCH | Sí | Admin/Recep | `{}` | `200 OK` | `401`, `403`, `404` |
| `/pagos` | GET | Sí | Admin/Recep | N/A | `200 OK` (Array) | `401`, `403` |
| `/pagos` | POST | Sí | Admin/Recep | `{idPersona, total, efectivo, tarjeta}` | `201 Created` | `401`, `403`, `422` |
| `/comprobantes` | GET | Sí | Admin/Recep | N/A | `200 OK` (Array) | `401`, `403` |
| `/comprobantes` | POST | Sí | Admin/Recep | `{idPago, observaciones}` | `201 Created` | `401`, `403`, `422` |

## Métodos agregados

| Método | Archivo | Responsabilidad | Parámetros | Retorno | Motivo |
|--------|---------|-----------------|------------|---------|--------|
| `getAll`, `create`, `getById`, `remove` | `services/comprobantes.ts` | Peticiones HTTP a /api/comprobantes | payload, id | Promise | Requisito de la Fase 03 |

## Métodos modificados

| Método | Archivo | Antes | Después | Motivo |
|--------|---------|-------|---------|--------|
| `create`, `close` | `services/cortes.ts` | Demandaba un body explícito obligatoriamente | Parámetros opcionales (`data?`) para ajustarse al contrato de caja general de la API | Flexibilidad |

## Cambios realizados
- **Cortes:** Nueva vista operativa, maneja error 404 del backend (cuando no hay caja) silenciosamente permitiendo abrir una caja (botón "Abrir Nueva Caja"). Muestra los totales de recaudación cuando el backend regresa el objeto activo.
- **Pagos:** El botón "Registrar Pago" se desactiva si no existe un corte activo. El formulario valida que el total concuerde.
- **Comprobantes:** Se añadió el botón para "Emitir Comprobante" en los pagos de la lista que llama al nuevo API y levanta alerta (422) si ya cuenta con él.
- **Permisos:** Se bloquearon ambas pantallas a todo nivel visual si la persona no cuenta con permisos de recepcionista o administrador.
- **Manejo de errores:** Integración de la utillería `useApiError` para centralizar el banner y notificaciones a nivel de campos con error de validación `422` sobre Axios.

## Cómo funciona ahora
1. Admin o Recepcionista entra al sistema y se va a la sección Cortes.
2. Si la caja está cerrada, se abre con un solo clic.
3. El recepcionista pasa a la pestaña Pagos. Selecciona un paciente, inserta el total (suma del pago) dividido en efectivo y tarjeta.
4. El pago es enviado al backend y aparece en el historial.
5. Sobre la fila de historial, puede emitirse un "Comprobante Interno" para ese pago en concreto.
6. Al fin del día, se regresa a Cortes y se cierra el corte actual.

## Manejo de errores
- **401**: Resuelto a nivel Interceptor.
- **403**: Validaciones front-end y captura residual local por la utillería `useApiError`.
- **404**: Considerado un "flujo normal" a la hora de verificar `/api/cortes/activo`.
- **422**: Devuelve string `fieldErrors` atados abajo de los fields.

## Pruebas ejecutadas

| Prueba | Endpoint | Usuario/rol | Resultado | Estado |
|--------|----------|-------------|-----------|--------|
| Consultar corte inexist. | `GET /cortes/activo` | Admin | 404 Not Found - Manejado en UI | ✅ Pasó |
| Abrir corte | `POST /cortes` | Admin | 201 Created | ✅ Pasó |
| Emitir comprobante | `POST /comprobantes` | Admin | 201 - Folio retornado | ✅ Pasó |
| Evitar pago mal hecho | `POST /pagos` | Admin | Bloqueado en Frontend | ✅ Pasó |

## Riesgos
- Comprobante interno no es CFDI; por ello se retiraron de la UI los placeholders de PDF/Impresión ya que el backend no retorna enlazamiento de descarga en su response.

## Estado final
- Completa.

## Pendientes
Ninguno.
