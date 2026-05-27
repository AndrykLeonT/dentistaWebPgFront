# Backlog para Completar DentalSys Frontend

## Proposito

Este backlog organiza lo necesario para convertir el prototipo actual en un frontend
operativo y verificable. Las prioridades parten de la auditoria realizada el
**2026-05-26**.

## Definicion de listo global

Antes de marcar el proyecto como terminado:

- `npm run type-check` pasa.
- `npm run lint` pasa.
- `npm run build` pasa.
- No quedan pantallas publicadas que guarden solo en memoria sin indicarlo.
- Los permisos de ruta y de accion estan aplicados.
- Se verifican los flujos de autenticacion, pacientes, citas y pagos/cortes.
- La documentacion refleja la implementacion final.

## P0 - Bloqueos tecnicos de entrega

| Tarea | Motivo | Criterio de aceptacion |
|---|---|---|
| Corregir errores TypeScript de agenda y empleados | `type-check` falla | `npm run type-check` termina sin errores |
| Corregir errores ESLint | El codigo no cumple las reglas configuradas | `npm run lint` termina sin errores |
| Normalizar `Nuevacitamodal.vue` / `NuevaCitaModal.vue` | Riesgo de fallo en sistemas case-sensitive | Nombre e import coinciden exactamente |
| Ejecutar build completo | El bundle solo se valido sin type-check | `npm run build` pasa |

## P1 - Funcionalidad esencial del consultorio

### Pacientes

| Tarea | Criterio de aceptacion |
|---|---|
| Conectar listado con `personas.getAll()` | Datos vienen de API y soportan busqueda |
| Conectar registro | Un paciente creado aparece tras respuesta exitosa |
| Conectar detalle e historial | Se obtiene por `id` real; citas/pagos no son mocks |
| Conectar edicion/desactivacion | Cambios persisten y se manejan errores |

### Citas

| Tarea | Criterio de aceptacion |
|---|---|
| Cargar agenda desde `citas.getAll()` | Vista diaria muestra datos del backend |
| Cargar catalogos reales | Paciente, dentista y servicio vienen de API |
| Crear/editar/cancelar cita | No quedan `TODO`; datos persisten |
| Manejar conflictos de horario | Error `422` se muestra en el formulario |

### Pagos y cortes

| Tarea | Criterio de aceptacion |
|---|---|
| Implementar pantalla de cortes | Permite abrir, visualizar y cerrar corte |
| Validar corte activo al cobrar | Pago bloqueado si no existe corte abierto |
| Registrar pago real | Cobro persiste con totales validados |
| Mostrar historial real | Pagos/cortes se obtienen de API |

## P2 - Modulos necesarios para cobertura completa

| Modulo | Trabajo requerido |
|---|---|
| Servicios | Conectar listado, clases, alta, edicion y desactivacion |
| Empleados | Conectar CRUD, roles, desactivacion y reset de contrasena |
| Recetas | Construir listado, alta, edicion y asociacion con cita |
| Dashboard | Reemplazar valores fijos por indicadores reales |
| Recuperacion de contrasena | Definir/consumir endpoint y manejar envio real |
| Inventario | Acordar backend; crear servicio e integrar CRUD/movimientos |

## P3 - Seguridad, UX y calidad

| Tarea | Resultado esperado |
|---|---|
| Aplicar permisos por accion | Botones de alta/edicion/cobro solo visibles para roles autorizados |
| Estandarizar errores y loading | Todos los formularios usan patron consistente |
| Añadir paginacion y estados vacios | Listados listos para volumen real |
| Revisar estrategia de token | Evaluar seguridad de `localStorage` segun backend/despliegue |
| Validar accesibilidad y responsive | Operacion util en tamanos previstos |
| Decidir exportacion/impresion/email | Botones implementados o retirados |

## P4 - Mantenibilidad y cierre de entrega

| Tarea | Resultado esperado |
|---|---|
| Unificar nomenclatura | `Citas/Agenda`, `Empleados/Usuarios` y nombres de archivos consistentes |
| Unificar componentes UI | Evitar patrones visuales y de formularios divergentes |
| Eliminar plantilla Vue sin uso | Retirar componentes de bienvenida no referenciados |
| Actualizar `index.html` | Titulo y metadatos de DentalSys |
| Reescribir `README.md` | Setup, variables, scripts, roles y estado actual |
| Preservar/documentar decisiones | Las guias vigentes viven en `docs/` |

## Plan sugerido por iteraciones

### Iteracion 1: estabilizacion

- Resolver P0.
- Definir contrato API real con backend.
- Establecer patron comun de carga/error/formulario.

### Iteracion 2: operacion diaria

- Integrar pacientes.
- Integrar citas.
- Construir cortes y conectar pagos.

### Iteracion 3: administracion y clinica

- Integrar servicios y empleados.
- Construir recetas.
- Resolver recuperacion de contrasena.

### Iteracion 4: reporting y cierre

- Conectar dashboard e inventario segun alcance acordado.
- Crear pruebas automatizadas.
- Uniformar UI/documentacion y preparar despliegue.

## Pruebas minimas recomendadas

| Flujo | Pruebas necesarias |
|---|---|
| Login | Credenciales validas, invalidas, cambio obligatorio, expiracion |
| Roles | Admin, dentista y recepcionista ven y acceden solo a lo permitido |
| Pacientes | Listar, crear, editar, desactivar, validar errores |
| Citas | Crear, editar, cancelar, conflicto de horario |
| Pagos/cortes | No cobrar sin corte; abrir, cobrar, cerrar y consultar historial |
| Recetas | Crear y evitar duplicado por cita |
| Build | Type-check, lint y build en integracion continua |

## Preguntas pendientes para producto/backend

1. Inventario forma parte de la entrega final y existen endpoints para insumos y
   movimientos?
2. El backend ya ofrece recuperacion de contrasena por correo?
3. Que roles pueden crear o editar pacientes, servicios y empleados?
4. Pagos requiere factura real, exportacion Excel, impresion y envio por correo, o son
   elementos de maqueta?
5. El dashboard requiere endpoints agregados o puede componerse desde listados?

