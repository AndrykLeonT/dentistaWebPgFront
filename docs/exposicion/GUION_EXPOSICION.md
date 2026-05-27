# Guion de Exposicion - DentalSys

## 1. Presentacion

Buenos dias. Nuestro proyecto se llama DentalSys. Es una aplicacion web para apoyar la administracion de una clinica dental. Permite manejar pacientes, empleados, citas, servicios, pagos, cortes de caja, comprobantes internos, inventario, dashboard y recetas.

## 2. Arquitectura

El sistema esta separado en dos partes:

- Frontend en Vue 3 con TypeScript y Vite.
- Backend en Laravel.

El frontend no accede directo a la base de datos. Se comunica con Laravel mediante una API REST. En Vue, las llamadas estan centralizadas en `src/services`, y Axios se configura en `src/services/api.ts`.

## 3. Login y seguridad

El usuario inicia sesion desde `LoginView.vue`. El frontend envia `usuario` y `contraseña` a `/api/login`. El backend valida al empleado, revisa que este activo, compara la contrasena con hash y devuelve un token Bearer.

Ese token se guarda en `localStorage` desde el store `src/stores/auth.ts`. Despues, `api.ts` lo agrega automaticamente a las peticiones con el header `Authorization: Bearer`.

Si el token falla, el sistema maneja `401`. Si un rol no tiene permiso, maneja `403` y muestra la pantalla de acceso denegado.

## 4. Roles

Hay tres roles principales:

- Administrador: administra usuarios, servicios, inventario, caja, pagos, recetas y dashboard.
- Recepcionista: atiende pacientes, citas, pagos, cortes y comprobantes.
- Dentista: consulta citas y trabaja recetas.

Los roles se validan en frontend con guards de Vue Router y tambien en backend con middleware `rol`.

## 5. Modulos principales

Pacientes permite listar, buscar, registrar, editar, dar de baja e ingresar al historial.

Agenda permite crear, editar y cancelar citas, relacionando paciente, dentista y servicio.

Servicios administra el catalogo de tratamientos y sus categorias.

Pagos registra cobros. El sistema valida que efectivo mas tarjeta sea igual al total y exige un corte activo.

Cortes de caja permite abrir una caja, acumular pagos y cerrar el corte calculando totales.

Comprobantes internos genera recibos internos asociados a pagos. No son CFDI, no son facturas SAT y no tienen timbrado fiscal.

Inventario maneja productos e insumos. El stock no se cambia directamente; se actualiza mediante movimientos de entrada, salida o ajuste.

Consumo por servicio permite definir reglas para que un servicio consuma insumos. El descuento no debe ocurrir al crear la cita, sino cuando se confirma o finaliza la atencion, para evitar descontar insumos de citas canceladas.

Dashboard muestra indicadores: pacientes activos, citas del dia, ingresos, productos bajo stock y alertas.

Recetas permite asociar indicaciones clinicas a una cita.

## 6. Requisitos del profesor

El proyecto cumple con modelos de base de datos mediante Eloquent y migraciones Laravel.

Tambien cumple con vistas para las entidades principales en Vue.

Cumple con controladores, porque Laravel tiene controladores como `AuthController`, `PersonaController`, `CitaController`, `PagoController`, `CorteController`, `ComprobanteController` e `InventarioController` separados por responsabilidad.

Cumple con eventos JavaScript: por ejemplo `@submit` en login, `@click` en logout, `@click` en pagos, `onMounted` para cargar informacion y watchers en agenda.

El punto que queda pendiente es el archivo descargable PDF, DOCX o XLSX. Actualmente el sistema genera comprobantes internos como datos en base de datos, pero no descarga un archivo. La opcion minima recomendada seria exportar pacientes, inventario o corte de caja a XLSX.

## 7. Validaciones

En frontend hay validaciones de formularios, loading, errores por campo, bloqueo de botones y reglas como que un pago debe cuadrar.

En backend hay validaciones mas fuertes: autenticacion, roles, empleados activos, baja logica, corte activo unico, stock no negativo, pago liquidado y comprobante unico.

## 8. Estado final

El backend tiene 155 pruebas pasando. El frontend pasa type-check, ESLint y build.

El proyecto esta avanzado y preparado para exposicion tecnica. El riesgo principal para entrega del requisito academico es que falta implementar una descarga PDF/DOCX/XLSX. Tambien conviene revisar el contrato del cambio de contrasena autenticado antes de demostrar ese flujo.

