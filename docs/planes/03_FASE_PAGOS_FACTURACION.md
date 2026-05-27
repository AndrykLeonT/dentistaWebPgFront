Actúa como agente de desarrollo dentro de Antigravity IDE usando Gemini 3.1 Pro High.

FASE: 03 - Pagos, cortes y facturación interna / comprobantes

OBJETIVO DE ESTA FASE:
Integrar el flujo financiero del frontend DentalSys con la API real del backend Laravel.

Esta fase debe dejar funcionando:

1. Consulta de corte activo.
2. Apertura de corte.
3. Cierre de corte.
4. Historial/listado de cortes.
5. Registro real de pagos.
6. Validación de pago liquidado: total = efectivo + tarjeta.
7. Bloqueo de cobro si no hay corte activo.
8. Emisión de comprobante interno desde un pago.
9. Consulta/listado de comprobantes, si la UI lo contempla.
10. Cancelación lógica de comprobante, si la UI lo contempla.
11. Manejo correcto de 401, 403, 404 y 422.
12. Permisos por rol: admin/recepcionista pueden operar caja; dentista no.
13. Documentación completa de lo realizado.

IMPORTANTE:
El backend está corriendo y debería ser accesible. Antes de modificar el módulo, confirma conectividad real, login y disponibilidad de endpoints.

Si no puedes acceder al backend, si las rutas no responden, si el login falla o si algún endpoint no existe realmente, comunícalo claramente en el reporte y en tu respuesta final. No avances inventando respuestas ni simulando operaciones financieras.

MÓDULOS QUE NO DEBES MODIFICAR:
Estos módulos son de compañeros y deben tratarse como cajas negras funcionales:

- Usuarios / Empleados.
- Citas / Agenda.
- Servicios.

No modifiques:

- `src/views/usuarios/`
- `src/views/agenda/`
- `src/views/servicios/`
- `src/services/empleados.ts`
- `src/services/citas.ts`
- `src/services/servicios.ts`

Solo puedes leerlos si necesitas entender dependencias o consumir datos desde servicios ya existentes, pero no debes cambiar su lógica.

MÓDULOS QUE TAMPOCO DEBES IMPLEMENTAR EN ESTA FASE:

- Inventario.
- Dashboard.
- Recetas.
- Empleados.
- Agenda.
- Servicios.

PACIENTES:
El módulo de pacientes ya fue trabajado en la Fase 02.
Puedes consumir `personasService` si necesitas seleccionar o mostrar un paciente relacionado con un pago, pero evita modificar el módulo de pacientes salvo corrección mínima indispensable y documentada.

CONTEXTO DE FASES ANTERIORES:
La Fase 00 preparó documentación y confirmó estructura.
La Fase 01 ajustó autenticación y seguridad.
La Fase 02 integró pacientes/personas con backend real.

Según el reporte de Fase 02:
- Backend disponible: Sí.
- Login funcionando con usuarios TEST.
- Pacientes carga desde backend.
- `type-check`, ESLint y build pasan.
- El backend real parece esperar en login campos `usuario` y `contraseña`, aunque algunos documentos indicaban `correoElectronico` y `password`. No reviertas los cambios de auth si ya están funcionando.
- No debes tocar auth salvo que esta fase detecte un problema crítico con 401/403 que bloquee pagos.

USUARIOS TEST DISPONIBLES:

Admin:
- usuario/correo: `test.admin@dentalsys.local`
- password: `TestAdmin123!`
- Uso: validar apertura/cierre de corte, pagos, comprobantes y permisos completos.

Recepcionista:
- usuario/correo: `test.recepcionista@dentalsys.local`
- password: `TestRecep123!`
- Uso: validar operación de caja.

Dentista:
- usuario/correo: `test.dentista@dentalsys.local`
- password: `TestDentista123!`
- Uso: validar bloqueo de caja y errores 403.

Si el formulario o servicio de auth usa `usuario` internamente, usa esos correos como valor de `usuario`.
Si usa `correoElectronico`, usa esos correos como valor de `correoElectronico`.
No cambies auth si ya funciona.

DOCUMENTOS QUE DEBES LEER ANTES:
- `docs/modulos/00-plan-restante.md`
- `docs/modulos/01-auth-seguridad.md`
- `docs/modulos/02-pacientes.md`
- `docs/INDICE.md`, si existe
- `docs/modulos/00-datos-prueba.md`, si existe
- `GUIA_FRONTEND_API.md`, si está disponible en el proyecto
- `RESUMEN_ENDPOINTS_API.md`, si está disponible en el proyecto
- `REVISION_FINAL_BACKEND.md`, si está disponible en el proyecto

Si los documentos backend no están dentro del proyecto, usa el contrato descrito en este prompt.

CONTRATO BACKEND - PAGOS, CORTES Y COMPROBANTES:

Base URL probable:

- `http://localhost:8000/api`
- o `http://dentistawebpg.test/api`

Todas las rutas privadas requieren token Bearer.

Headers:

Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json

ROLES:
- Admin: puede operar caja.
- Recepcionista: puede operar caja.
- Dentista: no debe operar caja; debe recibir bloqueo visual o 403.

ENDPOINTS CORTES:

1. GET `/api/cortes`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Respuesta esperada: historial/listado de cortes.

2. GET `/api/cortes/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Respuesta esperada: detalle de corte.

3. GET `/api/cortes/activo`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Respuesta esperada: corte activo del turno actual, si existe.
   - Si no hay corte activo, el backend puede responder 404, null, mensaje controlado o estructura vacía. Detecta el comportamiento real y ajústalo en frontend sin inventar.

4. POST `/api/cortes`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Body esperado: vacío o el mínimo que pida el backend real.
   - Respuesta 201.
   - Regla: solo puede existir un corte activo.
   - Si ya hay corte activo, debe devolver 422.

5. PUT/PATCH `/api/cortes/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Body esperado según backend:
     {
       "fechaFin": "..."
     }
     o vacío si backend calcula todo automáticamente.
   - El backend calcula totales automáticos.
   - El frontend NO controla `tEfectivo` ni `tTarjeta`.
   - Corte cerrado es inmutable.

ENDPOINTS PAGOS:

1. POST `/api/pagos`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Body esperado base:
     {
       "total": 500,
       "efectivo": 500,
       "tarjeta": 0
     }
   - El frontend NO debe enviar:
     - `idEmpleado`
     - `idCorte`
     - `pagado`
   - El backend toma el empleado desde auth.
   - El backend usa el corte activo.
   - Regla: `total = efectivo + tarjeta`.
   - No hay pagos parciales.
   - Si no cuadra, debe devolver 422.
   - Si no hay corte activo, debe devolver error controlado, probablemente 422.

2. PUT/PATCH `/api/pagos/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Body esperado según backend real.
   - Pagos de corte cerrado no se editan; debe devolver 422.

IMPORTANTE SOBRE PAGOS:
Algunos documentos indican solo POST y PUT/PATCH para pagos. Antes de asumir que existe `GET /pagos`, revisa:
- `src/services/pagos.ts`
- `php artisan route:list --path=api`, si el backend está accesible
- `RESUMEN_ENDPOINTS_API.md`
- Controlador de pagos, si está en el workspace

No inventes listado de pagos si el backend no tiene endpoint. Si la vista actual muestra historial de pagos pero no hay endpoint para listar, documenta el pendiente o usa la información desde cortes/comprobantes si el backend la incluye.

ENDPOINTS COMPROBANTES INTERNOS:

1. GET `/api/comprobantes`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Respuesta esperada: lista de recibos internos activos.

2. POST `/api/comprobantes`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Body:
     {
       "idPago": 1,
       "observaciones": "..."
     }
   - El backend genera el folio.
   - El backend congela montos del pago.
   - No enviar importe desde frontend.
   - Si el pago ya tiene recibo, debe devolver 422.
   - Es comprobante interno, NO CFDI.

3. GET `/api/comprobantes/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Respuesta esperada: detalle del recibo.

4. DELETE `/api/comprobantes/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Cancelación lógica del comprobante.
   - No cancela el pago.

FUERA DE ALCANCE:
- Facturación fiscal SAT.
- CFDI.
- Timbrado.
- Correos.
- PDF backend si no existe.
- Cancelaciones financieras formales.
- Pagos parciales.
- Reportes financieros avanzados.
- Dashboard de ingresos.

Si ya existen botones de exportar, imprimir o enviar correo:
- Implementa solo lo que pueda funcionar realmente.
- Si no hay soporte backend, deshabilita u oculta con mensaje claro.
- No prometas CFDI, email o PDF si no existe soporte.

MANEJO DE ERRORES ESPERADO:
- 401:
  - Limpiar sesión.
  - Redirigir a login.
- 403:
  - Mostrar mensaje claro: “No tienes permisos para realizar esta acción.”
  - Dentista intentando operar caja debe quedar bloqueado.
- 404:
  - Corte activo inexistente puede significar “no hay corte abierto”; manejarlo como estado normal si ese es el contrato real.
  - Recurso no encontrado debe mostrarse claramente.
- 422:
  - Mostrar errores por campo o regla de negocio.
  - Ejemplos:
    - Ya existe corte activo.
    - No hay corte activo.
    - Total no coincide con efectivo + tarjeta.
    - Pago ya tiene comprobante.
    - Corte cerrado no permite edición.
- 500+:
  - Mostrar error general.
  - No cerrar modales ni mostrar éxito si la operación falló.

REGLAS DE CALIDAD:
- No usar `any`.
- No usar `@ts-ignore`.
- No usar `eslint-disable`.
- No agregar mocks nuevos.
- No dejar `console.log`.
- No dejar TODOs nuevos sin documentar.
- No hacer llamadas HTTP directas desde vistas si corresponde crear/usar servicios.
- Usar Axios centralizado.
- Mantener Vue 3 Composition API.
- Usar TypeScript estricto.
- Tipar payloads, respuestas, formularios y errores.
- Mantener el diseño visual existente salvo cambios necesarios para loading/error/empty states.
- No romper módulos de compañeros.

ARCHIVOS PROBABLES A REVISAR:
- `src/views/pagos/PagosView.vue`
- `src/views/cortes/CortesView.vue`
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- `src/services/comprobantes.ts`, si existe
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si existe
- `src/services/api.ts`, solo lectura salvo bug crítico
- `src/stores/auth.ts`, solo lectura salvo bug crítico
- `src/services/personas.ts`, solo lectura si necesitas seleccionar pacientes
- `src/services/citas.ts`, solo lectura si el backend exige asociar pago a cita
- `src/services/servicios.ts`, solo lectura si necesitas mostrar contexto de tratamiento

ARCHIVOS QUE PUEDES MODIFICAR:
- `src/views/pagos/PagosView.vue`
- `src/views/cortes/CortesView.vue`
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- `src/services/comprobantes.ts`, si no existe y hace falta
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si se necesita reutilizar manejo de 422
- Componentes nuevos dentro de una carpeta propia de pagos/cortes si son necesarios
- Documentación en `docs/`

NO MODIFICAR:
- `src/views/usuarios/`
- `src/views/agenda/`
- `src/views/servicios/`
- `src/services/empleados.ts`
- `src/services/citas.ts`, salvo solo lectura
- `src/services/servicios.ts`, salvo solo lectura

FASE 03.1 - REVISIÓN INICIAL

Antes de modificar, ejecuta:

git status --short --branch
git log --oneline -5
npm run type-check
npx eslint . --no-cache
npm run build

Revisa y documenta:
- Cambios locales existentes.
- Si hay archivos modificados de agenda, servicios o usuarios.
- Si esos cambios no pertenecen a esta fase, no los toques.
- Estado de `docs/modulos/02-pacientes.md`.
- Estado de `docs/modulos/00-datos-prueba.md`.

Objetivo:
Confirmar que empiezas desde una base estable y no vas a mezclar trabajo de otros módulos.

FASE 03.2 - VALIDACIÓN OBLIGATORIA DE BACKEND Y AUTH

Detecta `VITE_API_URL` desde `.env`.

Prueba conectividad:

curl -i http://localhost:8000/api
curl -i http://dentistawebpg.test/api

Si `/api` responde 404 pero Laravel responde, no lo tomes como backend caído. Prueba `/api/login`.

Prueba login con usuarios TEST:

Admin:
- usuario/correo: `test.admin@dentalsys.local`
- password: `TestAdmin123!`

Recepcionista:
- usuario/correo: `test.recepcionista@dentalsys.local`
- password: `TestRecep123!`

Dentista:
- usuario/correo: `test.dentista@dentalsys.local`
- password: `TestDentista123!`

Criterio para continuar:
- Debes tener token válido de admin o recepcionista antes de probar caja.
- Debes intentar login con dentista para validar 403 o bloqueo visual.

Si el backend no responde:
- Detente.
- Documenta backend no disponible.
- No implementes pagos/cortes a ciegas.
- Comunica el problema en la respuesta final.

Si login falla:
- Documenta error exacto.
- No continúes con operaciones privadas sin token válido.
- Si el campo de login usa `usuario` en lugar de `correoElectronico`, usa el formato ya validado en el proyecto.

FASE 03.3 - INSPECCIÓN DE RUTAS REALES DEL BACKEND

Si tienes acceso al backend en el workspace, ejecuta o solicita:

php artisan route:list --path=api

Busca específicamente:
- pagos
- cortes
- comprobantes

Si no puedes ejecutar artisan, inspecciona:
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- backend routes/api.php si está disponible
- controladores de Pago, Corte, Comprobante si están disponibles

Documenta:
- Qué endpoints existen realmente.
- Qué métodos HTTP están disponibles.
- Si existe o no GET de pagos.
- Si existe o no GET de comprobantes.
- Si hay diferencias contra este prompt.

Regla:
El contrato real del backend tiene prioridad sobre suposiciones del frontend.

FASE 03.4 - DATOS DE PRUEBA

Puedes crear datos de prueba si son necesarios para validar caja.

Reglas:
- Usar prefijo `TEST`.
- No borrar datos reales.
- No modificar datos reales.
- No ejecutar `migrate:fresh`.
- No ejecutar `db:wipe`.
- No truncar tablas.
- No alterar estructura de base de datos.

Datos de prueba sugeridos:

Pago válido:
{
  "total": 500,
  "efectivo": 300,
  "tarjeta": 200
}

Pago inválido:
{
  "total": 500,
  "efectivo": 100,
  "tarjeta": 200
}

Comprobante:
{
  "idPago": "{id del pago creado}",
  "observaciones": "TEST comprobante interno generado desde frontend"
}

Si el endpoint de pagos exige asociar cita, tratamiento o paciente:
- No inventes campos.
- Inspecciona backend o respuesta 422.
- Usa datos existentes de pacientes/agenda/servicios solo si el contrato real lo exige.
- Documenta el requisito real.

Si creas datos:
- Actualiza `docs/modulos/00-datos-prueba.md`.
- Indica si deben conservarse para futuras pruebas o si se pueden limpiar después.
- Registra endpoint o método usado.

FASE 03.5 - SERVICIOS API

Revisa:
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- `src/services/comprobantes.ts`, si existe

Acciones:
1. Reutilizar servicios existentes si ya están correctos.
2. Crear `comprobantesService` si no existe y el módulo lo necesita.
3. Alinear métodos con endpoints reales.
4. Tipar payloads y respuestas en `src/types/index.ts` o archivo de tipos existente.
5. Usar Axios centralizado.
6. No hacer requests directos desde vistas.

Métodos sugeridos para `cortesService`:
- `getAll()`
- `getById(id)`
- `getActivo()`
- `create()`
- `close(id, payload?)`

Métodos sugeridos para `pagosService`:
- `create(payload)`
- `update(id, payload)`
- `getAll()` solo si endpoint existe realmente.
- `getById(id)` solo si endpoint existe realmente.

Métodos sugeridos para `comprobantesService`:
- `getAll()`
- `getById(id)`
- `create(payload: { idPago: number; observaciones?: string })`
- `remove(id)`

Tipos sugeridos:
- `Corte`
- `CorteActivo`
- `Pago`
- `PagoCreatePayload`
- `PagoUpdatePayload`
- `Comprobante`
- `ComprobanteCreatePayload`

Documenta cualquier método agregado/modificado/eliminado.

FASE 03.6 - VISTA DE CORTES

Revisa:
- `src/views/cortes/CortesView.vue`

Acciones:
1. Reemplazar placeholder por vista operativa.
2. Consultar corte activo al cargar.
3. Mostrar estado:
   - Corte abierto.
   - Sin corte activo.
   - Corte cerrado.
4. Mostrar botón “Abrir corte” si no hay corte activo.
5. Mostrar botón “Cerrar corte” si hay corte activo.
6. Confirmar antes de cerrar.
7. Mostrar historial de cortes si endpoint existe.
8. Mostrar detalle/totales si backend los devuelve.
9. No permitir editar totales calculados por backend.
10. Manejar 422 si ya existe corte activo.
11. Manejar 403 si rol no autorizado.
12. Manejar loading/error/empty state.

No cambies dashboard ni pagos aquí salvo lo estrictamente necesario para compartir servicio.

FASE 03.7 - VISTA DE PAGOS

Revisa:
- `src/views/pagos/PagosView.vue`

Acciones:
1. Eliminar pagos mock.
2. Consultar corte activo al cargar.
3. Bloquear registro de pago si no hay corte activo.
4. Mostrar mensaje claro: “Debes abrir un corte antes de registrar pagos.”
5. Crear formulario de pago real o adaptar el existente.
6. Enviar solo campos permitidos:
   - `total`
   - `efectivo`
   - `tarjeta`
   - otros campos solo si backend real los exige y están documentados por route/controller/422.
7. No enviar:
   - `idEmpleado`
   - `idCorte`
   - `pagado`
8. Validar en frontend:
   - `total > 0`
   - `efectivo >= 0`
   - `tarjeta >= 0`
   - `total = efectivo + tarjeta`
9. Aun validando frontend, manejar 422 del backend.
10. Si el pago se crea correctamente:
    - Mostrar éxito.
    - Guardar o mostrar el pago creado.
    - Ofrecer acción de emitir comprobante.
    - Refrescar corte activo o totales si aplica.
11. Si no existe endpoint para listar pagos, no inventar historial falso.
12. Si la UI tenía botones de exportar/imprimir/email sin soporte, deshabilitar, ocultar o marcar como pendiente sin prometer funcionalidad falsa.

FASE 03.8 - COMPROBANTES INTERNOS

Crear o ajustar flujo de comprobantes.

Acciones:
1. Crear `comprobantesService` si no existe.
2. Permitir emitir comprobante desde pago creado.
3. Enviar solo:
   - `idPago`
   - `observaciones`
4. No enviar importe, total, folio ni montos.
5. Mostrar folio devuelto por backend si existe.
6. Manejar 422 si el pago ya tiene comprobante.
7. Si existe listado de comprobantes:
   - Cargar desde `GET /comprobantes`.
   - Mostrar estado vacío si no hay.
8. Si existe detalle:
   - Consultar `GET /comprobantes/{id}`.
9. Si existe cancelación:
   - Confirmar antes de DELETE.
   - Explicar que cancela comprobante, no pago.
10. No implementar CFDI.
11. No prometer SAT.
12. No prometer PDF ni correo si backend no lo soporta.

FASE 03.9 - PERMISOS

Validar permisos con usuarios TEST:

Admin:
- Puede abrir corte.
- Puede cerrar corte.
- Puede registrar pago.
- Puede emitir comprobante.

Recepcionista:
- Puede abrir corte.
- Puede cerrar corte.
- Puede registrar pago.
- Puede emitir comprobante.

Dentista:
- No debe poder operar caja.
- Debe recibir bloqueo visual o error 403.

Acciones:
1. Ocultar o deshabilitar botones si el rol no puede.
2. Aunque se oculte, manejar 403 si backend rechaza.
3. No confiar solo en frontend.
4. No cambiar lógica de router si no es necesario.

FASE 03.10 - PRUEBAS FUNCIONALES

Con backend corriendo y token válido, prueba:

1. Login como admin.
2. Consultar corte activo.
3. Si no hay corte, abrir corte.
4. Intentar abrir segundo corte y validar 422.
5. Registrar pago válido.
6. Registrar pago inválido con total distinto a efectivo + tarjeta y validar 422.
7. Emitir comprobante desde pago.
8. Intentar emitir comprobante duplicado y validar 422.
9. Consultar comprobante, si endpoint existe.
10. Cancelar comprobante, si UI lo implementa.
11. Cerrar corte.
12. Intentar editar pago de corte cerrado si la UI lo permite y validar 422.
13. Login como recepcionista y validar flujo permitido.
14. Login como dentista y validar bloqueo/403.
15. Recargar página y verificar persistencia.
16. Verificar que no hay datos mock visibles.

Documenta:
- Endpoint llamado.
- Payload enviado.
- Código HTTP.
- Respuesta.
- Resultado visual.
- Usuario/rol usado.
- Si pasó o falló.
- Si el fallo es frontend, backend, datos o permisos.

FASE 03.11 - DOCUMENTACIÓN OBLIGATORIA

Crea o actualiza:

`docs/modulos/03-pagos-facturacion.md`

Debe contener:

# Fase 03 - Pagos, cortes y facturación interna

## Objetivo
Qué se buscó resolver.

## Alcance
Qué se tocó y qué no se tocó.

Debe decir explícitamente:
- No se implementó inventario.
- No se implementó dashboard.
- No se implementó CFDI/SAT.
- No se implementó PDF/correo si no existe soporte.
- No se modificaron módulos de compañeros.
- No se modificó agenda, servicios ni usuarios.

## Contexto inicial
- Rama.
- Commit.
- URL API.
- Backend disponible: Sí/No.
- Usuarios/roles usados para pruebas.
- Estado de Fase 02.

## Archivos revisados
Lista.

## Archivos modificados
Lista y motivo.

## Contrato backend usado
Tabla:
- Endpoint.
- Método.
- Auth.
- Roles.
- Payload.
- Respuesta esperada.
- Errores esperados.

Incluir:
- GET `/cortes`
- GET `/cortes/activo`
- POST `/cortes`
- PUT/PATCH `/cortes/{id}`
- POST `/pagos`
- PUT/PATCH `/pagos/{id}`, si se usa
- GET `/comprobantes`
- POST `/comprobantes`
- GET `/comprobantes/{id}`
- DELETE `/comprobantes/{id}`

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
Explicar:
- Cortes.
- Pagos.
- Comprobantes.
- Permisos.
- Manejo de errores.
- Validaciones.
- Eliminación de mocks.

## Cómo funciona ahora
Describir flujo:
1. Consultar corte activo.
2. Abrir corte.
3. Registrar pago.
4. Emitir comprobante.
5. Cerrar corte.
6. Manejar errores.

## Manejo de errores
- 401.
- 403.
- 404.
- 422.
- 500+.

## Pruebas ejecutadas
Tabla:
- Prueba.
- Endpoint.
- Usuario/rol.
- Payload.
- Resultado.
- Evidencia.
- Estado.

## Datos de prueba
Indicar si se crearon.
Si se crearon, actualizar `docs/modulos/00-datos-prueba.md`.

## Riesgos
Ejemplo:
- No existe GET de pagos.
- No hay PDF/comprobante imprimible.
- Comprobante interno no es CFDI.
- No hay cancelación financiera formal.
- Corte activo ya existía antes de la prueba.

## Estado final
Uno:
- Completa.
- Parcial.
- Bloqueada.

## Pendientes
Solo pendientes reales de pagos/cortes/comprobantes.

También actualiza `docs/INDICE.md` si existe, agregando:
- `docs/modulos/03-pagos-facturacion.md`

Si se crearon datos de prueba, actualiza:
- `docs/modulos/00-datos-prueba.md`

FASE 03.12 - VALIDACIÓN FINAL

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
4. La vista de cortes ya no es placeholder.
5. Se consulta corte activo con API real.
6. Se puede abrir corte con API real.
7. Se puede cerrar corte con API real.
8. Pagos ya no usa mocks.
9. Registro de pago usa `POST /pagos`.
10. Frontend no envía `idEmpleado`, `idCorte` ni `pagado`.
11. Se valida `total = efectivo + tarjeta`.
12. 422 se muestra correctamente.
13. 403 se maneja claramente.
14. Dentista no puede operar caja.
15. Comprobante se emite desde pago con `POST /comprobantes`.
16. No se promete CFDI/SAT.
17. No se prometen PDF/correo si no hay soporte.
18. No se modificaron módulos de compañeros.
19. Se documentó todo en `docs/modulos/03-pagos-facturacion.md`.
20. Si hubo datos de prueba, se documentaron.
21. No se agregaron `any`, `console.log`, `@ts-ignore`, `eslint-disable` ni mocks nuevos.

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
10. Datos de prueba creados o modificados.
11. Resultado de pruebas:
    - type-check
    - eslint
    - build
    - build-only, si aplica
12. Resultado funcional:
    - Corte activo.
    - Abrir corte.
    - Cerrar corte.
    - Registrar pago.
    - Validar pago inválido.
    - Emitir comprobante.
    - Cancelar comprobante, si aplica.
    - Permisos admin/recepcionista/dentista.
13. Confirmación de que no se tocaron módulos de compañeros.
14. Problemas encontrados con backend, si hubo.
15. Pendientes para la siguiente fase.
16. Usuarios de prueba usados:
    - Admin.
    - Recepcionista.
    - Dentista.