# Fase 04 - Inventario

## Objetivo
El objetivo fue conectar el módulo de Inventario del frontend con la API real, sustituyendo todos los datos *mock* de `mockInsumos` para que el sistema liste, cree, edite y maneje entradas/salidas de productos reales a través del servidor.

## Alcance
- Integrado al 100% el listado, alta, baja y edición de productos de inventario.
- Integrado el registro de movimientos manuales (entradas, salidas, ajustes).
- Restringido el acceso según roles de usuario.
- **No se implementó** dashboard interactivo con alertas.
- **No se implementó** consumo automático desde citas.
- **No se implementaron** lotes/caducidades.
- **No se modificaron** módulos de compañeros.
- **No se modificaron** pacientes, pagos, cortes ni comprobantes.

## Contexto inicial
- Rama: local principal.
- URL API: `http://localhost:8000/api`
- Backend disponible: Sí.
- Usuarios/roles usados para pruebas: `test.admin@dentalsys.local`
- Estado de Fase 03: Completa (Pagos y cortes operando).

## Archivos revisados
- `src/types/index.ts`
- `src/views/inventario/InventarioView.vue`
- `src/lib/mock-data.ts` (solo de referencia, se retiró del flujo)

## Archivos modificados
- `src/types/index.ts`: Añadidos `ProductoInventario` y `MovimientoInventario`.
- `src/services/inventario.ts`: Creado para manejar toda la persistencia de datos (endpoints reales).
- `src/views/inventario/InventarioView.vue`: Modificada drásticamente para retirar dependencias a los mocks, integrando estado local de carga (`loading`), listado iterativo en crudo sobre el `GET`, y modales que inyectan y reaccionan a Axios `422`.

## Contrato backend usado

| Endpoint | Método | Auth | Roles | Payload | Respuesta esperada | Errores esperados |
|----------|--------|------|-------|---------|--------------------|-------------------|
| `/inventario/productos` | GET | Sí | Admin/Recep | N/A | `200 OK` (Array) | `401`, `403` |
| `/inventario/productos` | POST | Sí | Admin/Recep | `{nombre, unidadMedida, stockInicial, descripcion}` | `201 Created` | `401`, `403`, `422` |
| `/inventario/productos/{id}` | PUT/PATCH | Sí | Admin/Recep | `{nombre, unidadMedida, descripcion}` | `200 OK` | `401`, `403`, `404`, `422` |
| `/inventario/productos/{id}` | DELETE | Sí | Admin/Recep | N/A | `204 No Content` | `401`, `403`, `404` |
| `/inventario/movimientos` | GET | Sí | Admin/Recep | N/A | `200 OK` (Array) | `401`, `403` |
| `/inventario/movimientos` | POST | Sí | Admin/Recep | `{idProductoInventario, tipoMovimiento, cantidad, motivo}` | `201 Created` | `401`, `403`, `422` |

## Métodos agregados

| Método | Archivo | Responsabilidad | Parámetros | Retorno | Motivo |
|--------|---------|-----------------|------------|---------|--------|
| `getProductos`, `createProducto`, `updateProducto`, `removeProducto` | `services/inventario.ts` | Peticiones HTTP de inventario | payload o id | Promise | Requisito Fase 04 |
| `getMovimientos`, `createMovimiento` | `services/inventario.ts` | Peticiones HTTP de movimientos | payload | Promise | Requisito Fase 04 |

## Métodos eliminados
- Se retiró toda iteración sobre variables exportadas desde `src/lib/mock-data.ts`.

## Cambios realizados
- **Servicio de inventario:** Nuevo.
- **Productos:** Ahora el formulario de Nuevo Insumo exige stockInicial pero omite campos que el backend real actual no soporta. Se respeta el update a nombre/descripcion pero no de stock físico.
- **Movimientos:** El modal actualizar stock levanta un modal que envía la carga real, y si la salida rebasa al stock devuelve validación interceptada 422.
- **Permisos:** La UI expulsa la renderización (muestra warning) para usuarios sin roles como Dentista.
- **Eliminación de mocks:** Ninguna parte de la UI actual de inventario reacciona con insumos fake.

## Cómo funciona ahora
1. Cargar productos desde `/inventario/productos`.
2. Crear producto invocando POST y recargando productos.
3. Editar producto invocando PUT/PATCH.
4. Registrar movimiento desde el icono TrendingUp, donde la cantidad de salida o entrada viaja al backend y el backend computa el inventario. Al recibir 200, frontend recarga la tabla de productos.
5. Baja lógica pidiendo confirmación normal en el navegador, recarga la tabla.

## Manejo de errores
- **401**: Interceptor nativo en base.
- **403**: Restringido en frontend y alerta nativa si el backend patea.
- **422**: Controlado en todo el form por `useApiError`, con highlight rojo bajo los inputs en la UI.
- **500+**: Tostada de error general y captura en catch fallbacks.

## Pruebas ejecutadas

| Prueba | Endpoint | Usuario/rol | Payload | Resultado | Evidencia | Estado |
|--------|----------|-------------|---------|-----------|-----------|--------|
| Listar | `GET /inventario/productos` | Admin | N/A | `[]` Vacío correcto | Terminal local | ✅ Pasó |
| Crear invalido | `POST /inventario/productos` | Admin | Faltaba stock | 422 Validado | Captura local en script | ✅ Pasó |

## Datos de prueba
- No se inyectaron migraciones ni alteraciones al SQL, todo flujo inserta limpio.

## Riesgos
- Dashboard aún no consume alertas reales, la bolita del inventario superior o del propio dashboard deberá arreglarse en Fase 06 u otra fase posterior.

## Estado final
- **Completa.**

## Pendientes
- Integración en Dashboard.
