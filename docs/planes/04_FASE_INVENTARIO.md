Actúa como agente de desarrollo dentro de Antigravity IDE usando Gemini 3.1 Pro High.

FASE: 04 - Inventario

OBJETIVO DE ESTA FASE:
Integrar el módulo de inventario del frontend DentalSys con la API real del backend Laravel, reemplazando completamente los datos mock de inventario por productos y movimientos reales.

Esta fase debe dejar funcionando:

1. Listado real de productos de inventario.
2. Creación real de productos.
3. Edición real de productos sin modificar stock directamente.
4. Baja lógica real de productos.
5. Consulta real de movimientos de inventario.
6. Registro real de movimientos:
   - entrada
   - salida
   - ajuste
7. Validación de stock insuficiente con error 422.
8. Visualización de bajo stock usando el campo devuelto por backend.
9. Manejo correcto de permisos por rol.
10. Manejo correcto de errores 401, 403, 404 y 422.
11. Eliminación de `mockInsumos` en la operación real.
12. Documentación completa de lo realizado.

IMPORTANTE:
El backend está corriendo y debería ser accesible. Antes de modificar inventario, debes confirmar conectividad real, login y disponibilidad de endpoints.

Si no puedes acceder al backend, si las rutas no responden, si el login falla o si algún endpoint no existe realmente, comunícalo claramente en el reporte y en tu respuesta final. No avances inventando respuestas ni simulando movimientos de inventario.

MÓDULOS QUE NO DEBES MODIFICAR:
Estos módulos son de compañeros o ya fueron trabajados y deben tratarse como cajas negras funcionales:

- Usuarios / Empleados.
- Citas / Agenda.
- Servicios.
- Pacientes.
- Pagos.
- Cortes.
- Comprobantes.

No modifiques:

- `src/views/usuarios/`
- `src/views/agenda/`
- `src/views/servicios/`
- `src/views/pacientes/`
- `src/views/pagos/`
- `src/views/cortes/`
- `src/services/empleados.ts`
- `src/services/citas.ts`
- `src/services/servicios.ts`
- `src/services/personas.ts`
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- `src/services/comprobantes.ts`

Solo puedes leer esos archivos si necesitas confirmar patrones de servicios, permisos, manejo de errores o estilos visuales.

MÓDULOS QUE TAMPOCO DEBES IMPLEMENTAR EN ESTA FASE:

- Dashboard.
- Recetas.
- Reportes.
- PDF.
- Correos.
- Facturación CFDI/SAT.
- Consumo automático de inventario desde citas.

CONTEXTO DE FASES ANTERIORES:
La Fase 01 ajustó autenticación y seguridad.
La Fase 02 integró pacientes/personas con backend real.
La Fase 03 integró pagos, cortes y comprobantes internos.

Según el reporte de Fase 03:
- Backend disponible: Sí.
- Usuario usado para pruebas: `test.admin@dentalsys.local`.
- Cortes y pagos ya consumen API real.
- Se creó `src/services/comprobantes.ts`.
- Cortes y pagos ya no usan mocks.
- No se implementó inventario.
- No se modificaron módulos de compañeros.

USUARIOS TEST DISPONIBLES:

Admin:
- usuario/correo: `test.admin@dentalsys.local`
- password: `TestAdmin123!`
- Uso: validar gestión completa de inventario.

Recepcionista:
- usuario/correo: `test.recepcionista@dentalsys.local`
- password: `TestRecep123!`
- Uso: validar permisos de inventario si el backend permite admin/recep.

Dentista:
- usuario/correo: `test.dentista@dentalsys.local`
- password: `TestDentista123!`
- Uso: validar bloqueo de inventario y errores 403.

Si el formulario o servicio de auth usa `usuario` internamente, usa esos correos como valor de `usuario`.
Si usa `correoElectronico`, usa esos correos como valor de `correoElectronico`.
No cambies auth si ya funciona.

DOCUMENTOS QUE DEBES LEER ANTES:

- `docs/modulos/00-plan-restante.md`
- `docs/modulos/01-auth-seguridad.md`
- `docs/modulos/02-pacientes.md`
- `docs/modulos/03-pagos-facturacion.md`
- `docs/INDICE.md`, si existe
- `docs/modulos/00-datos-prueba.md`, si existe
- `GUIA_FRONTEND_API.md`, si está disponible en el proyecto
- `RESUMEN_ENDPOINTS_API.md`, si está disponible en el proyecto
- `REVISION_FINAL_BACKEND.md`, si está disponible en el proyecto

Si los documentos backend no están dentro del proyecto, usa el contrato descrito en este prompt.

CONTRATO BACKEND - INVENTARIO:

Base URL probable:

- `http://localhost:8000/api`
- o `http://dentistawebpg.test/api`

Todas las rutas privadas requieren token Bearer.

Headers:

Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json

ROLES ESPERADOS:
- Admin: puede gestionar inventario.
- Recepcionista: puede gestionar inventario si el backend lo permite.
- Dentista: no debe gestionar inventario; debe recibir bloqueo visual o 403.

ENDPOINTS PRODUCTOS DE INVENTARIO:

1. GET `/api/inventario/productos`
   - Auth: sí.
   - Roles esperados: admin, recepcionista.
   - Respuesta esperada: listado de productos activos.
   - Producto inactivo no debe aparecer en flujo normal.
   - Cada producto puede incluir `bajoStock` como booleano.

2. GET `/api/inventario/productos/{id}`
   - Auth: sí.
   - Roles esperados: admin, recepcionista.
   - Respuesta esperada: detalle del producto.
   - Producto inactivo debe devolver 404.

3. POST `/api/inventario/productos`
   - Auth: sí.
   - Roles esperados: admin, recepcionista.
   - Body esperado:
     {
       "nombre": "...",
       "unidadMedida": "...",
       "stockInicial": 10
     }
   - Respuesta 201.
   - Debe crear producto y movimiento inicial si el backend lo implementa así.

4. PUT/PATCH `/api/inventario/productos/{id}`
   - Auth: sí.
   - Roles esperados: admin, recepcionista.
   - Body esperado:
     {
       "nombre": "...",
       "unidadMedida": "...",
       "descripcion": "..."
     }
   - IMPORTANTE:
     No editar `stockActual` directamente aquí.
   - El stock solo se modifica mediante movimientos.

5. DELETE `/api/inventario/productos/{id}`
   - Auth: sí.
   - Roles esperados: admin, recepcionista.
   - Baja lógica.
   - Respuesta 204.
   - Producto dado de baja debe devolver 404 en consulta individual.

ENDPOINTS MOVIMIENTOS DE INVENTARIO:

1. GET `/api/inventario/movimientos`
   - Auth: sí.
   - Roles esperados: admin, recepcionista.
   - Respuesta esperada: historial de movimientos de stock.

2. POST `/api/inventario/movimientos`
   - Auth: sí.
   - Roles esperados: admin, recepcionista.
   - Body esperado:
     {
       "idProductoInventario": 1,
       "tipoMovimiento": "entrada",
       "cantidad": 5,
       "motivo": "Compra de material"
     }
   - `tipoMovimiento` permitido:
     - `entrada`
     - `salida`
     - `ajuste`
   - Reglas:
     - `entrada` suma stock.
     - `salida` resta stock.
     - `ajuste` sobreescribe el stock físico total.
   - El backend controla:
     - `idEmpleado`
     - `stockAnterior`
     - `stockNuevo`
   - Si una salida deja stock negativo, backend debe responder 422.

FUERA DE ALCANCE:
- Consumo automático de inventario desde citas.
- Lotes.
- Caducidades.
- Proveedores.
- Compras.
- Integración con dashboard, salvo documentar pendiente.
- Reportes avanzados.
- Exportar PDF/Excel.
- Correos.

MANEJO DE ERRORES ESPERADO:
- 401:
  - Limpiar sesión.
  - Redirigir a login.
- 403:
  - Mostrar mensaje claro: “No tienes permisos para realizar esta acción.”
  - Dentista intentando gestionar inventario debe quedar bloqueado.
- 404:
  - Producto no encontrado o inactivo.
  - Mostrar mensaje claro y volver al listado si aplica.
- 422:
  - Mostrar errores por campo o regla de negocio.
  - Ejemplos:
    - Nombre requerido.
    - Stock inicial inválido.
    - Salida mayor al stock disponible.
    - Tipo de movimiento inválido.
- 500+:
  - Mostrar error general.
  - No cerrar formularios ni mostrar éxito si la operación falló.

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
- No editar `stockActual` directamente desde formularios de producto.

ARCHIVOS PROBABLES A REVISAR:
- `src/views/inventario/InventarioView.vue`
- `src/lib/mock-data.ts`
- `src/services/inventario.ts`, si existe
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si existe
- `src/services/api.ts`, solo lectura salvo bug crítico
- `src/stores/auth.ts`, solo lectura salvo bug crítico

ARCHIVOS QUE PUEDES MODIFICAR:
- `src/views/inventario/InventarioView.vue`
- `src/services/inventario.ts`, crearlo si no existe
- `src/types/index.ts`
- Componentes nuevos dentro de una carpeta propia de inventario, si son necesarios
- `src/composables/useApiError.ts`, si se necesita reutilizar manejo de 422
- Documentación en `docs/`

NO MODIFICAR:
- `src/views/usuarios/`
- `src/views/agenda/`
- `src/views/servicios/`
- `src/views/pacientes/`
- `src/views/pagos/`
- `src/views/cortes/`
- `src/services/empleados.ts`
- `src/services/citas.ts`
- `src/services/servicios.ts`
- `src/services/personas.ts`
- `src/services/pagos.ts`
- `src/services/cortes.ts`
- `src/services/comprobantes.ts`

FASE 04.1 - REVISIÓN INICIAL

Antes de modificar, ejecuta:

git status --short --branch
git log --oneline -5
npm run type-check
npx eslint . --no-cache
npm run build

Revisa y documenta:
- Cambios locales existentes.
- Si hay archivos modificados de módulos que no pertenecen a inventario.
- Si esos cambios no pertenecen a esta fase, no los toques.
- Estado de `docs/modulos/03-pagos-facturacion.md`.
- Estado de `docs/modulos/00-datos-prueba.md`.

Objetivo:
Confirmar que empiezas desde una base estable y no vas a mezclar trabajo de otros módulos.

FASE 04.2 - VALIDACIÓN OBLIGATORIA DE BACKEND Y AUTH

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
- Debes tener token válido de admin o recepcionista antes de probar inventario.
- Debes intentar login con dentista para validar 403 o bloqueo visual.

Si el backend no responde:
- Detente.
- Documenta backend no disponible.
- No implementes inventario a ciegas.
- Comunica el problema en la respuesta final.

Si login falla:
- Documenta error exacto.
- No continúes con operaciones privadas sin token válido.
- Si el campo de login usa `usuario` en lugar de `correoElectronico`, usa el formato ya validado en el proyecto.

FASE 04.3 - INSPECCIÓN DE RUTAS REALES DEL BACKEND

Si tienes acceso al backend en el workspace, ejecuta o solicita:

php artisan route:list --path=api

Busca específicamente:
- inventario/productos
- inventario/movimientos

Si no puedes ejecutar artisan, inspecciona:
- backend routes/api.php si está disponible
- controladores de inventario si están disponibles
- `RESUMEN_ENDPOINTS_API.md`
- `GUIA_FRONTEND_API.md`

Documenta:
- Qué endpoints existen realmente.
- Qué métodos HTTP están disponibles.
- Qué payloads reales esperan.
- Si los nombres de campos son:
  - `idProductoInventario`
  - `tipoMovimiento`
  - `unidadMedida`
  - `stockInicial`
  o si el backend usa variantes.
- Si hay diferencias contra este prompt.

Regla:
El contrato real del backend tiene prioridad sobre suposiciones del frontend.

FASE 04.4 - DATOS DE PRUEBA

Puedes crear datos de prueba si son necesarios para validar inventario.

Reglas:
- Usar prefijo `TEST`.
- No borrar datos reales.
- No modificar datos reales.
- No ejecutar `migrate:fresh`.
- No ejecutar `db:wipe`.
- No truncar tablas.
- No alterar estructura de base de datos.

Producto de prueba sugerido:

{
  "nombre": "TEST Producto Inventario",
  "unidadMedida": "pieza",
  "stockInicial": 10
}

Movimientos de prueba sugeridos:

Entrada:
{
  "idProductoInventario": "{id del producto TEST}",
  "tipoMovimiento": "entrada",
  "cantidad": 5,
  "motivo": "TEST entrada de validación frontend"
}

Salida válida:
{
  "idProductoInventario": "{id del producto TEST}",
  "tipoMovimiento": "salida",
  "cantidad": 3,
  "motivo": "TEST salida de validación frontend"
}

Ajuste:
{
  "idProductoInventario": "{id del producto TEST}",
  "tipoMovimiento": "ajuste",
  "cantidad": 20,
  "motivo": "TEST ajuste físico de validación frontend"
}

Salida inválida:
{
  "idProductoInventario": "{id del producto TEST}",
  "tipoMovimiento": "salida",
  "cantidad": 999999,
  "motivo": "TEST salida inválida por stock insuficiente"
}

Si creas datos:
- Actualiza `docs/modulos/00-datos-prueba.md`.
- Indica si deben conservarse para futuras pruebas o si se pueden limpiar después.
- Registra endpoint o método usado.

FASE 04.5 - SERVICIO API DE INVENTARIO

Revisa si existe:

`src/services/inventario.ts`

Si no existe, créalo.

Acciones:
1. Crear o ajustar servicio de inventario.
2. Usar Axios centralizado.
3. Alinear métodos con endpoints reales.
4. Tipar payloads y respuestas.
5. No hacer requests directos desde la vista.

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

Tipos sugeridos:
- `ProductoInventario`
- `ProductoInventarioCreatePayload`
- `ProductoInventarioUpdatePayload`
- `MovimientoInventario`
- `MovimientoInventarioCreatePayload`
- `TipoMovimientoInventario = 'entrada' | 'salida' | 'ajuste'`

Documenta cualquier método agregado/modificado/eliminado.

FASE 04.6 - VISTA DE INVENTARIO: PRODUCTOS

Revisa:

`src/views/inventario/InventarioView.vue`

Acciones:
1. Eliminar dependencia operativa de `mockInsumos`.
2. Cargar productos reales desde API.
3. Mostrar:
   - nombre
   - unidadMedida
   - stockActual, si backend lo devuelve
   - bajoStock, si backend lo devuelve
   - estado, si backend lo devuelve
4. Mostrar loading.
5. Mostrar error state.
6. Mostrar empty state.
7. Crear producto real con POST.
8. Editar producto real con PUT/PATCH.
9. Baja lógica real con DELETE.
10. No permitir editar `stockActual` directamente.
11. Si el producto tiene bajoStock, mostrar indicador claro.
12. Manejar 404 si producto ya no existe.
13. Manejar 422 por campos inválidos.

FASE 04.7 - VISTA DE INVENTARIO: MOVIMIENTOS

Acciones:
1. Cargar movimientos reales desde API.
2. Crear formulario/modal para movimiento si no existe.
3. Permitir:
   - entrada
   - salida
   - ajuste
4. Enviar:
   - `idProductoInventario`
   - `tipoMovimiento`
   - `cantidad`
   - `motivo`
5. No enviar:
   - `idEmpleado`
   - `stockAnterior`
   - `stockNuevo`
6. Después de crear movimiento:
   - refrescar movimientos
   - refrescar productos
7. Manejar 422 por stock insuficiente.
8. Mostrar stock anterior/nuevo si backend lo devuelve.
9. Si no hay movimientos, mostrar empty state real.

FASE 04.8 - PERMISOS

Validar permisos con usuarios TEST:

Admin:
- Puede listar productos.
- Puede crear producto.
- Puede editar producto.
- Puede dar de baja producto.
- Puede registrar movimientos.

Recepcionista:
- Validar si puede hacer lo mismo según backend real.

Dentista:
- No debe poder gestionar inventario.
- Debe recibir bloqueo visual o error 403.

Acciones:
1. Ocultar o deshabilitar botones si el rol no puede.
2. Aunque se oculte, manejar 403 si backend rechaza.
3. No confiar solo en frontend.
4. No cambiar lógica de router si no es necesario.

FASE 04.9 - DASHBOARD Y ALERTAS

No implementes dashboard en esta fase.

Si `DashboardView.vue` todavía consume mocks de inventario:
- No lo modifiques en esta fase.
- Documenta como pendiente para fase posterior.
- Asegúrate de que inventario tenga su propio indicador de bajo stock dentro del módulo.

FASE 04.10 - PRUEBAS FUNCIONALES

Con backend corriendo y token válido, prueba:

1. Login como admin.
2. Listar productos.
3. Crear producto TEST.
4. Editar producto TEST.
5. Registrar entrada.
6. Registrar salida válida.
7. Registrar ajuste.
8. Registrar salida inválida por stock insuficiente y validar 422.
9. Confirmar actualización de stock tras cada movimiento.
10. Confirmar indicador bajoStock si aplica.
11. Dar de baja producto.
12. Consultar producto dado de baja y confirmar 404.
13. Login como recepcionista y validar permisos reales.
14. Login como dentista y validar bloqueo/403.
15. Recargar página y verificar persistencia.
16. Verificar que no hay `mockInsumos` visible en operación real.

Documenta:
- Endpoint llamado.
- Payload enviado.
- Código HTTP.
- Respuesta.
- Resultado visual.
- Usuario/rol usado.
- Si pasó o falló.
- Si el fallo es frontend, backend, datos o permisos.

FASE 04.11 - DOCUMENTACIÓN OBLIGATORIA

Crea o actualiza:

`docs/modulos/04-inventario.md`

Debe contener:

# Fase 04 - Inventario

## Objetivo
Qué se buscó resolver.

## Alcance
Qué se tocó y qué no se tocó.

Debe decir explícitamente:
- No se implementó dashboard.
- No se implementó consumo automático desde citas.
- No se implementaron lotes/caducidades.
- No se modificaron módulos de compañeros.
- No se modificaron pacientes, pagos, cortes ni comprobantes.

## Contexto inicial
- Rama.
- Commit.
- URL API.
- Backend disponible: Sí/No.
- Usuarios/roles usados para pruebas.
- Estado de Fase 03.

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
- GET `/inventario/productos`
- POST `/inventario/productos`
- GET `/inventario/productos/{id}`
- PUT/PATCH `/inventario/productos/{id}`
- DELETE `/inventario/productos/{id}`
- GET `/inventario/movimientos`
- POST `/inventario/movimientos`

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
- Servicio de inventario.
- Productos.
- Movimientos.
- Permisos.
- Manejo de errores.
- Validaciones.
- Eliminación de mocks.

## Cómo funciona ahora
Describir flujo:
1. Cargar productos.
2. Crear producto.
3. Editar producto.
4. Registrar movimiento.
5. Refrescar stock.
6. Baja lógica.
7. Manejar errores.

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
- No hay lotes/caducidades.
- No hay consumo automático desde citas.
- Dashboard aún no consume alertas reales.
- Recepcionista puede o no puede gestionar según backend real.

## Estado final
Uno:
- Completa.
- Parcial.
- Bloqueada.

## Pendientes
Solo pendientes reales de inventario.

También actualiza `docs/INDICE.md` si existe, agregando:
- `docs/modulos/04-inventario.md`

Si se crearon datos de prueba, actualiza:
- `docs/modulos/00-datos-prueba.md`

FASE 04.12 - VALIDACIÓN FINAL

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
4. Inventario ya no depende de `mockInsumos` para operación real.
5. Se listan productos desde API.
6. Se crea producto con API real.
7. Se edita producto con API real.
8. Se da de baja producto con API real.
9. Se listan movimientos desde API.
10. Se registra entrada con API real.
11. Se registra salida con API real.
12. Se registra ajuste con API real.
13. No se edita `stockActual` directamente.
14. El backend controla stock anterior/nuevo.
15. Salida mayor al stock muestra 422.
16. Dentista no puede gestionar inventario.
17. 403 se maneja claramente.
18. 404 se maneja claramente.
19. No se modificaron módulos de compañeros.
20. Se documentó todo en `docs/modulos/04-inventario.md`.
21. Si hubo datos de prueba, se documentaron.
22. No se agregaron `any`, `console.log`, `@ts-ignore`, `eslint-disable` ni mocks nuevos.

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
    - Listar productos.
    - Crear producto.
    - Editar producto.
    - Baja lógica.
    - Listar movimientos.
    - Entrada.
    - Salida.
    - Ajuste.
    - Stock insuficiente.
    - Bajo stock.
    - Permisos admin/recepcionista/dentista.
13. Confirmación de que no se tocaron módulos de compañeros.
14. Problemas encontrados con backend, si hubo.
15. Pendientes para la siguiente fase.
16. Usuarios de prueba usados:
    - Admin.
    - Recepcionista.
    - Dentista.