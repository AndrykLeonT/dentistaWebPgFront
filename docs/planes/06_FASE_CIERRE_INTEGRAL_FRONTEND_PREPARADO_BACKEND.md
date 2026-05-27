Actúa como agente de desarrollo dentro del proyecto FRONTEND Vue de DentalSys usando Codex.

FASE: 06 - Cierre integral frontend preparado para backend

IMPORTANTE:
Estás trabajando SOLO en el frontend.
NO modifiques backend.
NO crees migraciones.
NO edites controladores Laravel.
NO edites modelos Laravel.
NO edites seeders Laravel.
NO edites base de datos directamente.

PERO:
Si durante esta fase detectas que falta un endpoint, un campo, una respuesta, un filtro o una regla en backend, NO detengas completamente el desarrollo frontend. Debes:

1. Documentar el cambio requerido en backend en un reporte separado.
2. Implementar el frontend como si ese cambio backend ya existiera, usando un contrato claro.
3. Manejar correctamente el error real actual si el backend todavía responde 404, 422, 500, etc.
4. Dejar el frontend listo para funcionar en cuanto el backend implemente el contrato documentado.
5. No simular éxito ni guardar datos falsos.
6. No usar mocks para fingir funcionalidad real.

OBJETIVO GENERAL:
Cerrar, corregir o dejar preparados todos los pendientes restantes del frontend DentalSys en una sola fase integral, priorizando funcionalidad real con API, contratos claros y documentación completa.

Esta fase debe atender:

1. Recuperación de contraseña por palabra clave.
2. Estabilización final de pagos, cortes y comprobantes.
3. Integración real de inventario.
4. Preparación del consumo automático de inventario por servicio.
5. Historial real del paciente.
6. Dashboard con datos reales o preparado para endpoint agregado.
7. Limpieza de funciones fuera de alcance:
   - PDF.
   - correos automáticos.
   - facturación CFDI/SAT.
8. Validación final de módulos propios.
9. Smoke test de módulos de compañeros.
10. Documentación completa de frontend y de pendientes backend.

DECISIONES FUNCIONALES DEFINITIVAS:
No habrá:
- Reportes PDF.
- Exportaciones PDF.
- Envío de correos automáticos.
- Recuperación por correo.
- Notificaciones por email.
- Facturación CFDI/SAT.
- Timbrado fiscal.
- Reportes fiscales.
- Envío de comprobantes por email.

Sí puede existir:
- Comprobante interno.
- Recibo interno.
- Impresión nativa del navegador solo si ya existe y no se presenta como PDF formal.
- Recuperación por palabra clave.
- Dashboard con datos reales.
- Consumo automático de inventario por servicio, preparado por contrato API.

REGLA ESPECIAL SOBRE BACKEND FALTANTE:
Si una funcionalidad requiere backend y actualmente el endpoint no existe, debes dejar el frontend conectado al contrato propuesto, no como mock.

Ejemplo:
- Si falta `POST /api/recover-password-keyword`, crea el método frontend `recoverPasswordByKeyword()` apuntando a ese endpoint.
- Si al probar responde 404, muestra error claro y documenta pendiente backend.
- El formulario debe quedar funcional desde el punto de vista del frontend: validaciones, payload, loading, errores, éxito si algún día responde 200.
- No dejes el botón permanentemente deshabilitado solo porque hoy falta backend, salvo que la acción sea peligrosa o no tenga contrato claro.

DOCUMENTO OBLIGATORIO DE PENDIENTES BACKEND:
Crea o actualiza:

`docs/backend/REQUERIMIENTOS_BACKEND_PARA_FRONTEND.md`

Si la carpeta `docs/backend/` no existe, créala.

Este documento debe incluir todos los cambios o endpoints que el frontend necesita del backend para quedar 100% funcional.

Estructura obligatoria:

# Requerimientos Backend para Frontend

## Objetivo
Explicar que este documento lista contratos backend requeridos por el frontend.

## Contexto
- Fecha.
- Rama frontend.
- URL API usada.
- Fase que generó el documento.

## Resumen ejecutivo
Tabla:
- Área.
- Requerimiento backend.
- Prioridad.
- Estado actual observado.
- Impacto en frontend.

## Endpoints requeridos
Para cada endpoint:
- Método.
- Ruta.
- Auth requerida.
- Roles.
- Payload esperado.
- Respuesta 200/201 esperada.
- Errores esperados: 401, 403, 404, 422, 500.
- Ejemplo de request.
- Ejemplo de response.
- Pantalla frontend que lo consume.
- Servicio frontend que lo consume.
- Estado actual observado: existe / no existe / responde distinto / no probado.

## Campos requeridos en respuestas
Si una vista necesita campos específicos:
- entidad
- campo
- tipo
- obligatorio sí/no
- pantalla que lo usa
- fallback frontend si falta

## Reglas de negocio requeridas
Ejemplo:
- consumo automático no se ejecuta dos veces para la misma cita.
- salida de inventario no permite stock negativo.
- comprobante interno no es CFDI.
- recuperación por palabra clave debe validar hash.

## Pendientes críticos
Separar:
- P0 bloquea flujo principal.
- P1 bloquea funcionalidad secundaria.
- P2 mejora o refuerzo.

## Notas para backend
Incluir recomendaciones claras sin modificar backend.

CONTRATOS BACKEND QUE DEBES ASUMIR SI FALTAN:
Si los endpoints no existen, usa estos contratos frontend para dejar el código preparado.

1. Recuperación por palabra clave:
POST `/api/recover-password-keyword`
Payload:
{
  "usuario": "test.admin@dentalsys.local",
  "palabraClave": "ClaveAdmin123!",
  "new_password": "NuevaPassword123!",
  "new_password_confirmation": "NuevaPassword123!"
}
Respuesta 200:
{
  "message": "Contraseña actualizada correctamente."
}
Errores:
- 422 por campos.
- 401 si palabra clave incorrecta.
- 404 si usuario no existe, solo si backend decide revelar eso.
- 500 error general.

2. Historial citas paciente:
GET `/api/personas/{id}/historial-citas`
Respuesta 200:
[
  {
    "id": 1,
    "fecha": "2026-05-27",
    "hora": "10:00",
    "estado": "completada",
    "servicio": "Limpieza dental",
    "dentista": "Nombre Dentista",
    "observaciones": "..."
  }
]

3. Historial pagos paciente:
GET `/api/personas/{id}/historial-pagos`
Respuesta 200:
[
  {
    "id": 1,
    "fecha": "2026-05-27",
    "total": 500,
    "efectivo": 300,
    "tarjeta": 200,
    "folioComprobante": "REC-0001",
    "estado": "pagado"
  }
]

4. Dashboard resumen:
GET `/api/dashboard/resumen`
Respuesta 200:
{
  "pacientesActivos": 20,
  "citasHoy": 8,
  "ingresosHoy": 2500,
  "productosBajoStock": 4,
  "citasProximas": [],
  "alertasInventario": []
}

5. Configuración de consumo por servicio:
GET `/api/inventario/consumos-servicio`
POST `/api/inventario/consumos-servicio`
GET `/api/inventario/consumos-servicio/{id}`
PUT/PATCH `/api/inventario/consumos-servicio/{id}`
DELETE `/api/inventario/consumos-servicio/{id}`

Payload POST:
{
  "idServicio": 1,
  "idProductoInventario": 1,
  "cantidad": 2
}

Respuesta:
{
  "id": 1,
  "idServicio": 1,
  "servicio": "Limpieza dental",
  "idProductoInventario": 1,
  "producto": "Guantes",
  "cantidad": 2,
  "activo": true
}

6. Ejecutar consumo automático:
POST `/api/citas/{id}/consumir-inventario`
Payload:
{
  "confirmar": true
}
Respuesta:
{
  "message": "Consumo de inventario aplicado correctamente.",
  "movimientos": []
}

Errores:
- 422 stock insuficiente.
- 409 inventario ya consumido para esa cita.
- 404 cita no encontrada.

CONTEXTO DE FASES PREVIAS:
Fase 01 - Auth:
- Se ajustó autenticación.
- Login real usa `{ usuario, contraseña }`.
- No revertir este contrato si ya funciona.

Fase 02 - Pacientes:
- Pacientes/personas fueron conectados al backend.
- Se eliminaron mocks principales.
- Historial clínico/financiero quedó pendiente porque no había endpoints confirmados.

Fase 03 - Pagos/cortes/comprobantes:
- Cortes y pagos fueron conectados.
- Se creó `src/services/comprobantes.ts`.
- Se validó al menos con admin.
- Hay que cerrar pruebas pendientes de cierre de corte, recepcionista/dentista y endpoints reales de listado.

Fase 04 - Inventario:
- Si ya existe reporte `docs/modulos/04-inventario.md`, léelo primero.
- Si no existe o si inventario sigue usando `mockInsumos`, debes integrarlo ahora.

Fase 05 - Auth palabra clave:
- El frontend ya no promete correo.
- `ForgotPasswordView.vue` quedó visualmente orientado a palabra clave.
- No existe endpoint backend; todos los candidatos respondieron 404.
- En esta fase debes dejar el frontend conectado al contrato propuesto `POST /api/recover-password-keyword`, pero documentar que actualmente backend responde 404.

USUARIOS TEST DISPONIBLES:
Admin:
- usuario/correo: `test.admin@dentalsys.local`
- password: `TestAdmin123!`

Recepcionista:
- usuario/correo: `test.recepcionista@dentalsys.local`
- password: `TestRecep123!`

Dentista:
- usuario/correo: `test.dentista@dentalsys.local`
- password: `TestDentista123!`

Si el formulario o servicio de auth usa `usuario`, usa esos correos como valor de `usuario`.
Si alguna parte usa `correoElectronico`, usa esos correos como valor de `correoElectronico`.
No cambies auth si ya funciona.

MÓDULOS DE COMPAÑEROS:
Estos módulos pertenecen a compañeros y NO deben refactorizarse:
- Usuarios / Empleados.
- Citas / Agenda.
- Servicios.

Puedes hacer smoke tests y leer sus servicios, pero no modificar su lógica salvo una corrección mínima indispensable para que compile, documentándola claramente.

MÓDULOS PROPIOS:
Puedes trabajar:
- Auth frontend relacionado con textos/palabra clave.
- Pacientes solo para historial real o preparación del historial.
- Pagos/cortes/comprobantes para estabilización.
- Inventario.
- Dashboard.

NO IMPLEMENTAR:
- PDF.
- Correos.
- CFDI/SAT.
- Facturación.
- Reportes financieros avanzados.
- Recetas, salvo solo verificar que no se rompa.
- Agenda/citas de compañeros, salvo smoke test o integración mínima de consumo automático si queda preparada por contrato y documentada.

REGLAS DE CALIDAD:
- No usar `any`.
- No usar `@ts-ignore`.
- No usar `eslint-disable`.
- No agregar mocks nuevos.
- No dejar `console.log`.
- No dejar TODOs nuevos sin documentar.
- No mostrar éxito si la API falló.
- No prometer funciones inexistentes.
- No hacer llamadas HTTP directas desde vistas si corresponde usar servicios.
- Usar Axios centralizado.
- Mantener Vue 3 Composition API.
- Tipar payloads, respuestas, formularios y errores.
- Mantener estilo visual existente.
- Si una funcionalidad depende de backend y no existe endpoint, la UI debe:
  - estar preparada,
  - enviar al servicio correcto,
  - manejar 404/422/500,
  - mostrar mensaje claro,
  - documentar el pendiente backend.
- No usar datos mock para mostrar como si fueran reales.

COMANDOS EN WINDOWS:
Si PowerShell bloquea `npm` o `npx`, usa:
- `npm.cmd run type-check`
- `npx.cmd eslint . --no-cache`
- `npm.cmd run build`
- `npm.cmd run build-only`

FASE 06.1 - REVISIÓN INICIAL

Ejecuta:

git status --short --branch
git log --oneline -5
npm.cmd run type-check
npx.cmd eslint . --no-cache
npm.cmd run build
npm.cmd run build-only

Si `npm.cmd` no aplica en el entorno, usa los comandos normales.

Lee documentación existente:
- `docs/modulos/00-plan-restante.md`
- `docs/modulos/01-auth-seguridad.md`
- `docs/modulos/02-pacientes.md`
- `docs/modulos/03-pagos-facturacion.md`
- `docs/modulos/04-inventario.md`, si existe
- `docs/modulos/05-auth-palabra-clave.md`
- `docs/modulos/00-datos-prueba.md`, si existe
- `docs/INDICE.md`, si existe
- `funcionalidades_pendientes.md`, si existe

Documenta el estado inicial.

FASE 06.2 - VALIDACIÓN DE BACKEND Y LOGIN

Detecta `VITE_API_URL` desde `.env`.

Prueba conectividad:
curl -i http://localhost:8000/api
curl -i http://dentistawebpg.test/api

Si `/api` responde 404 pero Laravel responde, considera backend disponible.

Prueba login con:
- admin
- recepcionista
- dentista

Usa el payload real ya validado:
{
  "usuario": "test.admin@dentalsys.local",
  "contraseña": "TestAdmin123!"
}

Documenta:
- backend disponible sí/no
- endpoint base usado
- login admin sí/no
- login recepcionista sí/no
- login dentista sí/no

Si login falla, documenta y sigue solo con tareas que no requieran sesión.

FASE 06.3 - LIMPIEZA DE FUNCIONES FUERA DE ALCANCE

Busca en `src/` textos, botones o funciones relacionados con:
- PDF
- Exportar PDF
- Descargar PDF
- Reporte PDF
- Enviar correo
- Email
- Facturación
- CFDI
- SAT
- Timbrar
- Factura fiscal
- Recuperación por correo
- Código enviado
- Link por email

Acciones:
1. Si aparecen en módulos propios, ocultar, deshabilitar o cambiar texto para no prometer la función.
2. No borrar componentes grandes si puede romper UI; preferir deshabilitar con mensaje claro.
3. En comprobantes, usar textos:
   - “Comprobante interno”
   - “Recibo interno”
4. No usar “Factura”.
5. En `ForgotPasswordView.vue`, confirmar que ya no menciona correo.
6. Documentar cada cambio.

No tocar módulos de compañeros salvo texto claramente global.

FASE 06.4 - AUTH PALABRA CLAVE PREPARADO PARA BACKEND

Revisa:
- `src/views/auth/ForgotPasswordView.vue`
- `src/services/auth.ts`
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si existe

Objetivo:
Dejar el frontend funcional contra el contrato propuesto, aunque el backend todavía responda 404.

Acciones:
1. Agregar en `src/services/auth.ts` método:
   - `recoverPasswordByKeyword(payload)`
2. Endpoint:
   - `POST /recover-password-keyword`
   usando Axios centralizado con base `/api`.
3. Payload:
   {
     usuario,
     palabraClave,
     new_password,
     new_password_confirmation
   }
4. Agregar tipos:
   - `RecoverPasswordKeywordPayload`
   - `RecoverPasswordKeywordResponse`
5. Actualizar `ForgotPasswordView.vue`:
   - habilitar botón si formulario es válido.
   - ejecutar servicio real.
   - manejar loading.
   - manejar 200 éxito.
   - manejar 401/422 por campo.
   - manejar 404 como “Endpoint backend pendiente”.
   - no mencionar correo.
6. No simular éxito si el endpoint responde 404.
7. Documentar en requerimientos backend que falta `POST /api/recover-password-keyword`.

FASE 06.5 - ESTABILIZACIÓN FINAL DE PAGOS, CORTES Y COMPROBANTES

Revisa:
- `src/views/pagos/PagosView.vue`
- `src/views/cortes/CortesView.vue`
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- `src/services/comprobantes.ts`
- `src/types/index.ts`

Objetivos:
1. Confirmar que cortes y pagos no usan mocks.
2. Confirmar que `GET /cortes/activo` maneja 404 como “sin corte activo”.
3. Confirmar apertura de corte.
4. Confirmar cierre de corte.
5. Confirmar que no puede abrir doble corte.
6. Confirmar pago válido.
7. Confirmar pago inválido bloqueado en frontend y/o backend.
8. Confirmar emisión de comprobante interno.
9. Confirmar comprobante duplicado devuelve 422 o se bloquea.
10. Confirmar roles:
    - admin puede operar caja.
    - recepcionista puede operar caja.
    - dentista no puede operar caja.

Puntos específicos:
- Si `pagosService.getAll()` tiene comentarios de incertidumbre, reemplazar por implementación real si el endpoint existe.
- Si `GET /pagos` no existe, documentar requerimiento backend o ajustar UI sin historial falso.
- Si existe `GET /pagos`, usarlo.
- Si pagos requiere `idPersona` y ya fue validado, mantenerlo y documentarlo como contrato real observado.
- No enviar `idEmpleado`, `idCorte` ni `pagado` si backend no lo pide.
- Si el backend exige algún campo adicional real, documentarlo.

FASE 06.6 - INVENTARIO REAL

Revisa:
- `src/views/inventario/InventarioView.vue`
- `src/services/inventario.ts`, si existe
- `src/lib/mock-data.ts`
- `src/types/index.ts`

Objetivo:
Dejar inventario operativo con API real.

Endpoints esperados:
- GET `/api/inventario/productos`
- POST `/api/inventario/productos`
- GET `/api/inventario/productos/{id}`
- PUT/PATCH `/api/inventario/productos/{id}`
- DELETE `/api/inventario/productos/{id}`
- GET `/api/inventario/movimientos`
- POST `/api/inventario/movimientos`

Reglas:
- No usar `mockInsumos` para operación real.
- No editar `stockActual` directamente.
- El stock se modifica con movimientos.
- Movimientos:
  - entrada
  - salida
  - ajuste
- No enviar:
  - idEmpleado
  - stockAnterior
  - stockNuevo
- El backend debe controlar esos datos.
- Salida mayor a stock debe mostrar 422.

Si `src/services/inventario.ts` no existe, créalo.

Métodos sugeridos:
Productos:
- `getProductos()`
- `getProductoById(id)`
- `createProducto(payload)`
- `updateProducto(id, payload)`
- `removeProducto(id)`

Movimientos:
- `getMovimientos(params?)`
- `createMovimiento(payload)`

Si backend endpoints no existen:
- Aun así crea el servicio y conecta la UI al contrato esperado.
- Maneja 404 mostrando “Endpoint backend pendiente”.
- Documenta requerimientos en `docs/backend/REQUERIMIENTOS_BACKEND_PARA_FRONTEND.md`.
- No mostrar datos falsos.

FASE 06.7 - CONSUMO AUTOMÁTICO DE INVENTARIO POR SERVICIO

Objetivo:
Preparar el frontend para configurar reglas de consumo de insumos por servicio y, si existe endpoint, ejecutar consumo automático.

No implementar consumo local sin backend.

Crear dentro del área de inventario una sección o pestaña:
- “Consumo por servicio”

La sección debe permitir:
1. Listar reglas de consumo.
2. Crear regla:
   - servicio
   - producto inventario
   - cantidad
3. Editar regla.
4. Eliminar/desactivar regla.
5. Mostrar estado si endpoint backend no existe.

Servicios frontend sugeridos:
En `src/services/inventario.ts`, agregar:
- `getConsumosServicio()`
- `createConsumoServicio(payload)`
- `updateConsumoServicio(id, payload)`
- `removeConsumoServicio(id)`
- `consumirInventarioCita(idCita)`

Contratos:
GET `/inventario/consumos-servicio`
POST `/inventario/consumos-servicio`
PUT/PATCH `/inventario/consumos-servicio/{id}`
DELETE `/inventario/consumos-servicio/{id}`
POST `/citas/{id}/consumir-inventario`

Puedes leer `serviciosService` para listar servicios.
No modificar lógica del módulo servicios.

Si los endpoints no existen:
- La UI debe mostrar que está pendiente backend.
- Los formularios pueden estar preparados, pero deben manejar 404.
- Documentar en requerimientos backend.

FASE 06.8 - HISTORIAL REAL DEL PACIENTE PREPARADO PARA BACKEND

Revisa:
- `src/views/pacientes/VerHistorialPacienteView.vue`
- `src/services/personas.ts`
- `src/types/index.ts`

Objetivo:
Dejar el frontend preparado para consumir historial real.

Agregar métodos si no existen:
- `getHistorialCitas(idPersona)`
- `getHistorialPagos(idPersona)`

Endpoints propuestos:
- GET `/personas/{id}/historial-citas`
- GET `/personas/{id}/historial-pagos`

Acciones:
1. Actualizar vista para llamar esos métodos.
2. Mostrar loading.
3. Mostrar empty state.
4. Mostrar errores.
5. Si endpoint responde 404:
   - mostrar “Historial pendiente de endpoint backend”.
   - documentar requerimiento.
6. No usar mocks.
7. No consultar todos los pagos/citas para simular historial si no hay filtro backend.

FASE 06.9 - DASHBOARD CON DATOS REALES O CONTRATO PREPARADO

Revisa:
- `src/views/dashboard/DashboardView.vue`
- crear `src/services/dashboard.ts` si no existe
- `src/types/index.ts`

Objetivo:
Quitar datos estáticos del dashboard o reemplazarlos por contrato API preparado.

Endpoint preferido:
GET `/api/dashboard/resumen`

Servicio:
- `dashboardService.getResumen()`

Tipo:
- `DashboardResumen`

Respuesta esperada:
{
  "pacientesActivos": 20,
  "citasHoy": 8,
  "ingresosHoy": 2500,
  "productosBajoStock": 4,
  "citasProximas": [],
  "alertasInventario": []
}

Acciones:
1. Crear servicio dashboard.
2. Conectar `DashboardView.vue` a `getResumen()`.
3. Quitar números hardcodeados.
4. Mostrar loading.
5. Mostrar empty/no disponible si endpoint responde 404.
6. Documentar requerimiento backend si falta.
7. No simular métricas.
8. No tocar módulo agenda de compañeros.

FASE 06.10 - SMOKE TEST DE AGENDA / CITAS

Agenda es módulo de compañeros.

No refactorizar.
No rediseñar.
No modificar salvo corrección mínima indispensable para compilar.

Solo validar:
1. La vista carga.
2. Crear cita persiste, si la UI lo permite.
3. Editar cita persiste, si la UI lo permite.
4. Cancelar cita persiste, si la UI lo permite.
5. Si hay TODOs visibles o acciones simuladas, documentarlas.

Si falla:
- Documentar.
- No corregir sin autorización, salvo error mínimo de tipos causado por cambios propios.

FASE 06.11 - DOCUMENTACIÓN OBLIGATORIA

Crea o actualiza:

`docs/modulos/06-cierre-integral.md`

Debe contener:

# Fase 06 - Cierre integral frontend

## Objetivo
Explicar que esta fase cerró pendientes restantes del frontend sin tocar backend.

## Alcance
Qué se tocó y qué no se tocó.

Debe indicar explícitamente:
- No se modificó backend.
- No se implementaron correos.
- No se implementaron PDFs.
- No se implementó facturación CFDI/SAT.
- No se modificaron módulos de compañeros salvo si hubo corrección mínima documentada.
- El frontend quedó preparado para endpoints backend pendientes.

## Contexto inicial
- Rama.
- Commit.
- Backend disponible.
- Usuarios usados.
- Estado de fases 01 a 05.

## Archivos revisados
Lista.

## Archivos modificados
Lista y motivo.

## Pendientes del documento original
Tabla:
- Pendiente.
- Acción tomada.
- Estado: resuelto / preparado para backend / parcial / bloqueado por backend / fuera de alcance.

Incluir:
- recuperación por palabra clave.
- historial paciente.
- cortes/pagos.
- inventario.
- agenda/citas.
- dashboard.
- recetas.
- PDF.
- correos.
- facturación.
- consumo automático inventario.

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

## Cambios realizados por área

### Auth palabra clave
Estado y pendientes backend.

### Pagos/cortes/comprobantes
Qué se validó y qué se corrigió.

### Inventario
Qué se implementó o qué quedó preparado.

### Consumo automático
Qué UI/servicios se prepararon y qué backend falta.

### Historial paciente
Qué se conectó o qué endpoint falta.

### Dashboard
Qué se conectó o qué endpoint falta.

### Funciones fuera de alcance
Confirmar:
- PDF eliminado/oculto.
- Correos eliminados/ocultos.
- Facturación eliminada/oculta.

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
- Estado.

## Datos de prueba
Actualizar también `docs/modulos/00-datos-prueba.md` si se crearon datos.

## Riesgos
Separar:
- Riesgos frontend.
- Riesgos backend.
- Riesgos de módulos de compañeros.

## Estado final
Uno:
- Completa.
- Parcial.
- Bloqueada.

## Pendientes reales restantes
Separar:
- Pendientes frontend.
- Pendientes backend.
- Pendientes fuera de alcance.

También actualiza:
- `docs/INDICE.md`, si existe.
- `docs/modulos/00-datos-prueba.md`, si se crearon datos.
- `docs/backend/REQUERIMIENTOS_BACKEND_PARA_FRONTEND.md`.

FASE 06.12 - VALIDACIÓN FINAL

Ejecuta:

npm.cmd run type-check
npx.cmd eslint . --no-cache
npm.cmd run build
npm.cmd run build-only

Si `npm.cmd` no aplica, usa npm normal.

Validar manualmente o mediante API:

Auth:
- login admin.
- login recepcionista.
- login dentista.
- ForgotPassword sin correo.
- ForgotPassword llama endpoint de palabra clave y maneja 404 como pendiente backend.

Pacientes:
- listado carga.
- historial no muestra mocks.
- historial maneja endpoint faltante.

Pagos/cortes:
- corte activo.
- abrir/cerrar corte.
- pago válido.
- pago inválido.
- comprobante interno.
- dentista bloqueado.

Inventario:
- productos reales o endpoint pendiente.
- movimientos reales o endpoint pendiente.
- stock insuficiente o endpoint pendiente.
- dentista bloqueado.

Consumo automático:
- reglas de consumo preparadas.
- endpoint faltante documentado si no existe.

Dashboard:
- usa servicio dashboard o endpoint pendiente.
- no muestra datos hardcodeados falsos.

Fuera de alcance:
- no PDF.
- no correos.
- no facturación.

Criterios de aceptación:
1. Type-check pasa.
2. ESLint pasa.
3. Build pasa.
4. No hay mocks en módulos propios finalizados.
5. No hay promesas de correo/PDF/facturación.
6. Inventario está integrado o preparado con contrato backend documentado.
7. Pagos/cortes están estables o documentan fallos reales.
8. Historial paciente no muestra datos falsos.
9. Dashboard no muestra números falsos sin aclaración.
10. No se tocó backend.
11. No se refactorizaron módulos de compañeros.
12. Documentación actualizada.
13. Requerimientos backend documentados en archivo separado.
14. Frontend está conectado a contratos propuestos cuando backend falta.

RESPUESTA FINAL ESPERADA:

Al terminar, responde con:

1. Estado de la fase: Completa / Parcial / Bloqueada.
2. Rama y commit final.
3. Backend disponible: Sí/No.
4. Usuarios usados.
5. Archivos modificados.
6. Documentos creados/actualizados.
7. Métodos agregados.
8. Métodos modificados.
9. Métodos eliminados.
10. Datos de prueba creados o modificados.
11. Resultado de comandos:
    - type-check
    - eslint
    - build
    - build-only
12. Resultado por área:
    - Auth palabra clave.
    - Pagos/cortes/comprobantes.
    - Inventario.
    - Consumo automático.
    - Historial paciente.
    - Dashboard.
    - Agenda smoke test.
13. Funciones fuera de alcance eliminadas/ocultas:
    - PDF.
    - Correos.
    - Facturación.
14. Pendientes frontend.
15. Pendientes backend.
16. Confirmación de que no se tocó backend.
17. Confirmación de que no se refactorizaron módulos de compañeros.
18. Confirmación de que se creó/actualizó `docs/backend/REQUERIMIENTOS_BACKEND_PARA_FRONTEND.md`.