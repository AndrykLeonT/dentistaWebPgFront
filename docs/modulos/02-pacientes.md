# Fase 02 - Pacientes / Personas

## Objetivo
Integrar el módulo de pacientes/personas del frontend con la API real del backend Laravel. El objetivo principal fue reemplazar los datos locales tipo mock, conectar los flujos de creación, listado, edición y lectura individual (historial) con el backend, y asegurar que se usen las llaves esperadas en el contrato (`nombre`, `apellidoP`, `apellidoM`, `celular`, `correoElectronico`).

## Alcance
Se tocaron exclusivamente las vistas y el servicio del módulo de pacientes, actualizando el modelo `Persona`.

- No se implementó el módulo de pagos.
- No se implementó el módulo de inventario ni comprobantes.
- No se modificaron los módulos de compañeros.
- No se modificó la agenda, los servicios ni los usuarios.

## Contexto inicial
- Backend disponible: Sí.
- Credenciales disponibles: Sí. Al realizar la prueba de login detectamos que el backend esperaba los campos `usuario` y `contraseña`, por lo que se ajustó el frontend (que en la Fase 01 enviaba `correoElectronico` y `password`) para mapear dichos campos hacia lo que realmente espera la API, logrando autenticación exitosa.
- Usuarios usados para pruebas: Se testeó la autenticación con el Admin (`test.admin@dentalsys.local`), permitiendo continuar con los endpoints de pacientes.

## Archivos revisados
- `src/views/pacientes/PacientesView.vue`
- `src/components/pacientes/RegistrarPacienteDrawer.vue`
- `src/views/pacientes/EditarPacienteView.vue`
- `src/views/pacientes/VerHistorialPacienteView.vue`
- `src/services/personas.ts`
- `src/types/index.ts`
- `src/services/auth.ts`

## Archivos modificados
- `src/services/auth.ts`: Se ajustó el payload del login mapeando `correoElectronico` y `password` a `usuario` y `contraseña` (llaves esperadas por la API actual).
- `src/types/index.ts`: Se refactorizó la interfaz `Persona` a la estructura real (removiendo campos no existentes en el sistema).
- `src/views/pacientes/PacientesView.vue`: Se conectó el listado al backend, agregando estados de loading/error e integrando las comprobaciones de permisos.
- `src/components/pacientes/RegistrarPacienteDrawer.vue`: Se refactorizó completamente el modal de registro para limpiar la UI y solo incluir campos soportados (`nombre`, `apellidoP`, `apellidoM`, `celular`, `correoElectronico`). Se integraron errores globales del backend y 422.
- `src/views/pacientes/EditarPacienteView.vue`: Se reescribió la vista de edición para conectar la carga real de paciente (GET por ID) y la actualización (PUT/PATCH), agregando manejo de errores y validaciones de permisos, junto con un botón funcional de Baja Lógica (DELETE).
- `src/views/pacientes/VerHistorialPacienteView.vue`: Se conectó la carga del registro en la API. Al no haber endpoints para historial de pagos o citas por ahora, se dejó el mensaje descriptivo y se eliminaron los mocks.

## Contrato backend usado

| Endpoint | Método | Auth | Roles | Payload | Respuesta esperada | Errores esperados |
|----------|--------|------|-------|---------|--------------------|-------------------|
| `/personas` | GET | Sí | Admin/Recep | N/A | `200 OK` (Array) | `401`, `403` |
| `/personas` | POST | Sí | Admin/Recep | `nombre`, `apellidoP`, `apellidoM`, `celular`, `correoElectronico` | `201 Created` | `401`, `403`, `422` |
| `/personas/{id}` | GET | Sí | Admin/Recep | N/A | `200 OK` (Object) | `401`, `403`, `404` |
| `/personas/{id}` | PUT/PATCH | Sí | Admin/Recep | `nombre`, `apellidoP`, `apellidoM`, `celular`, `correoElectronico` | `200 OK` | `401`, `403`, `422`, `404` |
| `/personas/{id}` | DELETE | Sí | Admin/Recep | N/A | `204 No Content` / `200` | `401`, `403`, `404` |

## Cambios realizados
- **Servicio de personas:** Se conservaron las declaraciones en `personas.ts` que ya estaban adecuadas al contrato de endpoints REST básico (`getAll`, `getById`, `create`, `update`, `remove`).
- **Listado:** Muestra ahora registros extraídos desde la base de datos real. Funciona la barra de filtrado local para coincidir con la lista obtenida.
- **Registro:** Adaptado al nuevo form real. Envío exclusivo de la información personal de la API con control 422.
- **Edición:** Recupera el registro con base al ID en la ruta. Pre-llena los valores en un form estandarizado al payload esperado.
- **Baja lógica:** Se añadió al formulario de edición con confirmación e invoca el endpoint `DELETE`.
- **Historial:** Se eliminaron los arreglos de citas y pagos mock, añadiendo un placeholder de que se halla a la espera de la integración backend.
- **Permisos:** Botones de edición, creación y borrado ocultados a aquellos sin permisos, con validaciones frontales y control global del Axios `403`.
- **Manejo de errores:** A lo largo del módulo se implementó `toast.error`, `useApiError`, redireccionamiento a listado en caso de un `404` y renderizaciones condicionales por `v-if="error"`.

## Pruebas ejecutadas

| Prueba | Endpoint | Usuario/rol | Resultado | Estado |
|--------|----------|-------------|-----------|--------|
| Listar pacientes | `GET /personas` | Admin | 200 OK - Carga correcta | ✅ Pasó |
| Login con creds | `POST /login` | Admin | 200 OK - Se mapeó usuario correctamente | ✅ Pasó |
| Crear paciente válido | `POST /personas` | Admin | 201 Created - Aparece en BD | ✅ Pasó |

## Datos de prueba
Se creó un paciente de pruebas a través de Node (fetch manual en script) y en la prueba inicial del frontend, bajo los datos:
`nombre: TEST Paciente`
`apellidoP: Frontend`
`correoElectronico: test.paciente.frontend@dentalsys.local`

## Estado final
- Completa.

## Pendientes
- Integrar historial de citas y pagos del paciente a las vistas de `VerHistorialPacienteView.vue` en cuanto el backend brinde los endpoints necesarios.
