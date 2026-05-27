Actúa como agente de desarrollo dentro de Antigravity IDE usando Gemini 3.1 Pro High.

FASE: 02 - Pacientes / Personas

OBJETIVO DE ESTA FASE:
Integrar el módulo de pacientes/personas del frontend DentalSys con la API real del backend Laravel, reemplazando datos mock, arreglos locales y acciones simuladas por operaciones reales contra `/api/personas`.

Esta fase debe dejar funcionando:

1. Listado real de pacientes.
2. Búsqueda real o filtrado usando datos reales.
3. Registro real de paciente.
4. Edición real de paciente.
5. Baja lógica real de paciente.
6. Manejo de errores 401, 403, 404 y 422.
7. Estados de loading, error y empty state.
8. Validación de permisos con usuarios reales.
9. Documentación completa de lo realizado.

IMPORTANTE:
El backend ya fue reiniciado con `php artisan migrate:fresh --seed` y debe tener usuarios TEST disponibles para pruebas. Antes de modificar el módulo, confirma conectividad real con el backend y prueba login con las credenciales proporcionadas.

Si no puedes acceder al backend, si las rutas no responden o si el login falla, comunícalo claramente en el reporte y en tu respuesta final. No avances inventando datos ni simulando respuestas.

USUARIOS TEST DISPONIBLES:

Admin:
- correoElectronico: `test.admin@dentalsys.local`
- password: `TestAdmin123!`
- Uso: validar login, listado, creación, edición y baja lógica de pacientes.

Recepcionista:
- correoElectronico: `test.recepcionista@dentalsys.local`
- password: `TestRecep123!`
- Uso: validar gestión de pacientes con rol recepcionista.

Dentista:
- correoElectronico: `test.dentista@dentalsys.local`
- password: `TestDentista123!`
- Uso: validar bloqueo de acciones no permitidas y errores 403.

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

Solo puedes leerlos si necesitas confirmar dependencias, pero no debes cambiar su lógica.

MÓDULOS QUE TAMPOCO DEBES IMPLEMENTAR EN ESTA FASE:

- Pagos.
- Cortes.
- Comprobantes.
- Inventario.
- Dashboard.
- Recetas.

CONTEXTO DE FASES ANTERIORES:
La Fase 00 dejó configurada la documentación en `docs/modulos/` y confirmó que el proyecto compila.
La Fase 01 actualizó autenticación para usar:

- `correoElectronico`
- `password`
- `/login`
- `/me`
- `/logout`
- `/change-password`

Ahora ya existen usuarios TEST para probar autenticación, permisos y acceso a pacientes.

DOCUMENTOS QUE DEBES LEER ANTES:

- `docs/modulos/00-plan-restante.md`
- `docs/modulos/01-auth-seguridad.md`
- `docs/INDICE.md`, si existe
- `docs/modulos/00-datos-prueba.md`, si existe
- `GUIA_FRONTEND_API.md`, si está disponible en el proyecto
- `RESUMEN_ENDPOINTS_API.md`, si está disponible en el proyecto
- `REVISION_FINAL_BACKEND.md`, si está disponible en el proyecto

Si los documentos backend no están dentro del proyecto, usa este contrato de pacientes:

CONTRATO BACKEND - PACIENTES / PERSONAS:

Base URL probable:

- `http://localhost:8000/api`
- o `http://dentistawebpg.test/api`

Todas las rutas privadas requieren token Bearer.

Headers:

Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json

Endpoints:

1. GET `/api/personas`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Soporta búsqueda:
     `/api/personas?search=Nombre`
   - Devuelve pacientes/personas activas.
   - No debe devolver inactivos.

2. POST `/api/personas`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Body esperado:
     {
       "nombre": "...",
       "apellidoP": "...",
       "apellidoM": "...",
       "celular": "...",
       "correoElectronico": "..."
     }
   - `correoElectronico` puede ser nullable según backend, pero si se envía debe ser único.
   - Respuesta 201.
   - Correo repetido debe devolver 422.

3. GET `/api/personas/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Devuelve detalle de paciente activo.
   - Si está inactivo o no existe, devuelve 404.

4. PUT/PATCH `/api/personas/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Actualiza paciente.
   - Si está inactivo, devuelve 404.
   - Validaciones devuelven 422.

5. DELETE `/api/personas/{id}`
   - Auth: sí.
   - Roles: admin, recepcionista.
   - Baja lógica.
   - Respuesta 204.
   - Segundo DELETE debe devolver 404.

Permisos esperados:

- Admin puede listar, crear, editar y dar de baja pacientes.
- Recepcionista puede listar, crear, editar y dar de baja pacientes.
- Dentista no debe poder crear ni modificar pacientes.
- Si dentista intenta crear, editar o eliminar, el backend debe responder 403.

MANEJO DE ERRORES ESPERADO:

- 401:
  - Limpiar sesión.
  - Redirigir a login.

- 403:
  - Mostrar mensaje claro: “No tienes permisos para realizar esta acción.”
  - No dejar la UI como si hubiera guardado.

- 404:
  - En detalle/edición, mostrar paciente no encontrado o redirigir a listado.
  - En acciones aisladas, mostrar toast claro.

- 422:
  - Mostrar errores por campo debajo del input correspondiente.

- 500+:
  - Mostrar error general.
  - No cerrar formularios como si hubiera éxito.

REGLAS DE CALIDAD:

- No usar `any`.
- No usar `@ts-ignore`.
- No usar `eslint-disable`.
- No agregar mocks nuevos.
- No dejar `console.log`.
- No dejar TODOs nuevos sin documentar.
- No hacer llamadas HTTP directas desde vistas si corresponde usar `src/services/personas.ts`.
- Usar Axios centralizado.
- Mantener Vue 3 Composition API.
- Usar TypeScript estricto.
- Tipar payloads, respuestas, formularios y errores.
- Mantener el diseño visual existente salvo cambios necesarios para loading/error/empty states.
- No romper módulos de compañeros.

ARCHIVOS PROBABLES A REVISAR:

- `src/views/pacientes/PacientesView.vue`
- `src/views/pacientes/EditarPacienteView.vue`
- `src/views/pacientes/VerHistorialPacienteView.vue`
- `src/components/pacientes/RegistrarPacienteDrawer.vue`
- `src/services/personas.ts`
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si existe
- `src/services/api.ts`, solo lectura salvo bug de auth/error global crítico
- `src/stores/auth.ts`, solo lectura salvo bloqueo crítico

ARCHIVOS QUE PUEDES MODIFICAR:

- `src/views/pacientes/PacientesView.vue`
- `src/views/pacientes/EditarPacienteView.vue`
- `src/views/pacientes/VerHistorialPacienteView.vue`
- `src/components/pacientes/RegistrarPacienteDrawer.vue`
- `src/services/personas.ts`
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si se necesita reutilizar manejo de 422
- Documentación en `docs/`

NO MODIFICAR:

- `src/views/usuarios/`
- `src/views/agenda/`
- `src/views/servicios/`
- `src/services/empleados.ts`
- `src/services/citas.ts`
- `src/services/servicios.ts`

FASE 02.1 - REVISIÓN INICIAL

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
- Estado de `docs/modulos/01-auth-seguridad.md`.

Objetivo:
Confirmar que empiezas desde una base estable y no vas a mezclar trabajo de otros módulos.

FASE 02.2 - VALIDACIÓN OBLIGATORIA DE BACKEND, AUTH Y USUARIOS DE PRUEBA

Antes de integrar pacientes, confirma que el backend responde y que puedes autenticarte con un usuario válido.

Detecta `VITE_API_URL` desde `.env`.

Prueba conectividad:

curl -i http://localhost:8000/api
curl -i http://dentistawebpg.test/api

Si `/api` responde 404 pero Laravel responde, no lo tomes como backend caído. Prueba una ruta conocida como `/api/login`.

Prueba login con los usuarios TEST:

Admin:
correoElectronico: `test.admin@dentalsys.local`
password: `TestAdmin123!`

Recepcionista:
correoElectronico: `test.recepcionista@dentalsys.local`
password: `TestRecep123!`

Dentista:
correoElectronico: `test.dentista@dentalsys.local`
password: `TestDentista123!`

Criterio para continuar:

- Debes tener token válido de admin o recepcionista antes de probar CRUD de pacientes.
- Debes intentar login con dentista para validar bloqueo de permisos, si el backend lo permite.

Si el backend no responde:
- Detente.
- Documenta backend no disponible.
- No implementes pacientes a ciegas.
- Comunica el problema en la respuesta final.

Si el backend responde pero login falla:
- Documenta el error exacto.
- Si es 401, reporta que los usuarios TEST no están disponibles o no coinciden con el backend.
- Si es 422, revisa payload y campos esperados.
- No continúes con operaciones privadas sin token válido.

FASE 02.3 - DATOS DE PRUEBA PARA PACIENTES

Puedes crear datos de prueba si son necesarios para validar pacientes.

Reglas:

- Usar prefijo `TEST`.
- No borrar datos reales.
- No modificar datos reales.
- No ejecutar `migrate:fresh`.
- No ejecutar `db:wipe`.
- No truncar tablas.
- No alterar estructura de base de datos.

Paciente de prueba sugerido:

{
  "nombre": "TEST Paciente",
  "apellidoP": "Frontend",
  "apellidoM": "Validacion",
  "celular": "6120000000",
  "correoElectronico": "test.paciente.frontend@dentalsys.local"
}

También puedes crear un segundo paciente para probar correo duplicado o edición:

{
  "nombre": "TEST Paciente Dos",
  "apellidoP": "Frontend",
  "apellidoM": "Edicion",
  "celular": "6120000001",
  "correoElectronico": "test.paciente.edicion@dentalsys.local"
}

Si se crean:

- Documentar en `docs/modulos/00-datos-prueba.md`.
- Indicar si deben conservarse para futuras pruebas o pueden eliminarse después.
- Registrar el endpoint o método usado para crearlos.
- Registrar si fueron creados desde UI, API, tinker o seeder.

FASE 02.4 - SERVICIO DE PERSONAS

Revisa `src/services/personas.ts`.

Debe ofrecer métodos tipados para:

- Listar personas/pacientes.
- Buscar si se usa `search`.
- Obtener por ID.
- Crear.
- Actualizar.
- Eliminar/baja lógica.

Si ya existen métodos, reutilízalos.
Si faltan o no coinciden con backend, ajústalos.

No cambies el cliente Axios centralizado salvo que haya bug crítico.

Métodos esperados, nombres sugeridos:

- `getAll(params?: { search?: string })`
- `getById(id: number | string)`
- `create(payload: PersonaCreatePayload)`
- `update(id: number | string, payload: PersonaUpdatePayload)`
- `remove(id: number | string)`

Tipos esperados:

- `Persona`
- `PersonaCreatePayload`
- `PersonaUpdatePayload`
- respuesta API si el proyecto usa wrappers.

Documentar cualquier método agregado o modificado.

FASE 02.5 - LISTADO DE PACIENTES

Revisa `src/views/pacientes/PacientesView.vue`.

Acciones:

1. Eliminar uso de arreglos locales/mock para pacientes.
2. Cargar pacientes con `personasService.getAll()`.
3. Si hay búsqueda:
   - Preferir `GET /personas?search=...` si backend lo soporta.
   - Si no se implementa búsqueda backend en UI inmediata, filtrar solo sobre datos reales cargados, no mocks.
4. Agregar loading.
5. Agregar error state.
6. Agregar empty state.
7. No mostrar pacientes falsos si API responde vacío.
8. Mantener diseño visual existente.
9. No cerrar errores con toast genérico si hay detalles útiles.

Validaciones:

- Si API responde 401, auth global debe limpiar sesión.
- Si API responde 403, mostrar permiso denegado.
- Si API responde vacío, mostrar estado vacío.
- Si API falla, mostrar error entendible.

FASE 02.6 - REGISTRO DE PACIENTE

Revisa:

- `src/components/pacientes/RegistrarPacienteDrawer.vue`
- `src/views/pacientes/PacientesView.vue`

Acciones:

1. Conectar el drawer con `personasService.create()`.
2. Enviar solo campos esperados por backend.
3. Mostrar errores 422 por campo:
   - `nombre`
   - `apellidoP`
   - `apellidoM`
   - `celular`
   - `correoElectronico`
4. Manejar correo repetido.
5. Mantener el drawer abierto si hay error.
6. Cerrar solo cuando API responda 201.
7. Refrescar listado tras crear.
8. No usar `console.log`.
9. No agregar mocks.

Si el drawer solo emite payload al padre, puedes mantener ese patrón, pero el padre debe hacer la llamada real y regresar errores/estado al drawer de forma clara.

FASE 02.7 - EDICIÓN DE PACIENTE

Revisa:

- `src/views/pacientes/EditarPacienteView.vue`

Acciones:

1. Cargar paciente por `route.params.id` usando `personasService.getById()`.
2. Eliminar datos mock.
3. Mostrar loading inicial.
4. Mostrar 404 si paciente no existe/inactivo.
5. Guardar con `PUT/PATCH /personas/{id}`.
6. Mostrar errores 422 por campo.
7. Redirigir al listado o detalle tras éxito según flujo actual.
8. No mostrar éxito si API falla.

FASE 02.8 - BAJA LÓGICA

Acciones:

1. Implementar acción de baja/desactivación si la UI la contempla.
2. Pedir confirmación antes de DELETE.
3. Ejecutar `DELETE /personas/{id}`.
4. Si responde 204, refrescar listado.
5. Si responde 404, mostrar que ya no existe o está inactivo.
6. Si responde 403, mostrar permisos insuficientes.
7. No borrar físicamente ni simular localmente sin API.

FASE 02.9 - HISTORIAL DE PACIENTE

Revisa:

- `src/views/pacientes/VerHistorialPacienteView.vue`

Acciones:

1. Cargar datos reales del paciente por ID.
2. Eliminar o desactivar datos mock de citas/pagos si no hay endpoints reales para historial.
3. Si existen endpoints reales para historial en backend, úsalos.
4. Si NO existen endpoints de historial:
   - No inventes datos.
   - Mostrar mensaje claro: “Historial clínico/financiero pendiente de endpoint o integración.”
   - Documentar pendiente.
5. Si se pueden reutilizar endpoints existentes de citas/pagos filtrados por paciente, hazlo solo si el contrato lo confirma.
6. No tocar lógica interna de agenda ni pagos en esta fase.

FASE 02.10 - PERMISOS

Validar permisos con usuarios TEST:

Admin:
- Puede listar, crear, editar y eliminar.

Recepcionista:
- Puede listar, crear, editar y eliminar.

Dentista:
- Debe quedar bloqueado para crear pacientes según contrato.
- Si intenta crear, editar o eliminar, debe recibir 403 o bloqueo visual.

Acciones:

1. Ocultar o deshabilitar botones si el rol no puede.
2. Aunque se oculte, manejar 403 si backend rechaza.
3. No confiar solo en frontend.

Si por algún motivo no se puede validar con algún rol:
- Documenta que no se pudo validar.
- No inventes resultado.

FASE 02.11 - PRUEBAS FUNCIONALES

Con backend corriendo y token válido, prueba:

1. Listar pacientes.
2. Buscar paciente por nombre.
3. Crear paciente válido.
4. Crear paciente con correo repetido para obtener 422.
5. Editar paciente.
6. Ver detalle/edición por ID real.
7. Baja lógica de paciente.
8. Intentar consultar paciente dado de baja y confirmar 404.
9. Intentar acción sin permisos con usuario dentista.
10. Recargar página y verificar persistencia.

Documenta:

- Endpoint llamado.
- Payload enviado.
- Código HTTP.
- Respuesta.
- Resultado visual.
- Si pasó o falló.
- Si el fallo es frontend, backend, datos o permisos.
- Usuario/rol usado.

FASE 02.12 - DOCUMENTACIÓN OBLIGATORIA

Crea o actualiza:

`docs/modulos/02-pacientes.md`

Debe contener:

# Fase 02 - Pacientes / Personas

## Objetivo
Qué se buscó resolver.

## Alcance
Qué se tocó y qué no se tocó.

Debe decir explícitamente:

- No se implementó pagos.
- No se implementó inventario.
- No se modificaron módulos de compañeros.
- No se modificó agenda, servicios ni usuarios.

## Contexto inicial

- Rama.
- Commit.
- URL API.
- Backend disponible: Sí/No.
- Credenciales disponibles: Sí/No.
- Usuarios/roles usados para pruebas.

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

- GET `/personas`
- POST `/personas`
- GET `/personas/{id}`
- PUT/PATCH `/personas/{id}`
- DELETE `/personas/{id}`

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

- Servicio de personas.
- Listado.
- Registro.
- Edición.
- Baja lógica.
- Historial.
- Permisos.
- Manejo de errores.

## Cómo funciona ahora

Describir flujo:

1. Carga de listado.
2. Búsqueda.
3. Registro.
4. Edición.
5. Baja lógica.
6. Historial o estado pendiente.

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
Si se crearon, también actualizar `docs/modulos/00-datos-prueba.md`.

## Riesgos

Ejemplo:

- No hay endpoint de historial.
- No se pudo probar dentista.
- Backend no responde.
- Contrato distinto al esperado.

## Estado final

Uno:

- Completa.
- Parcial.
- Bloqueada.

## Pendientes

Solo pendientes reales de pacientes.

También actualiza `docs/INDICE.md` si existe, agregando:

- `docs/modulos/02-pacientes.md`

Si se crearon datos de prueba, actualiza:

- `docs/modulos/00-datos-prueba.md`

FASE 02.13 - VALIDACIÓN FINAL

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
4. Pacientes ya no usa mocks para listado principal.
5. Registro usa `POST /personas`.
6. Edición usa `PUT/PATCH /personas/{id}`.
7. Baja lógica usa `DELETE /personas/{id}`.
8. 422 se muestra por campo.
9. 403 se maneja claramente.
10. 404 se maneja claramente.
11. Historial no muestra datos falsos.
12. No se modificaron módulos de compañeros.
13. Se documentó todo en `docs/modulos/02-pacientes.md`.
14. Si hubo datos de prueba, se documentaron.
15. No se agregaron `any`, `console.log`, `@ts-ignore`, `eslint-disable` ni mocks nuevos.
16. Se usaron usuarios TEST para validar permisos o se documentó claramente por qué no fue posible.

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
    - Listado
    - Búsqueda
    - Registro
    - Edición
    - Baja lógica
    - Historial
    - Permisos
13. Confirmación de que no se tocaron módulos de compañeros.
14. Problemas encontrados con backend, si hubo.
15. Pendientes para la siguiente fase.
16. Usuarios de prueba usados:
    - Admin
    - Recepcionista
    - Dentista