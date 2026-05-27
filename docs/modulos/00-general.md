# Modulo General / Preparacion

## Objetivo

Preparar la base tecnica de DentalSys Frontend antes de integrar nuevos modulos,
cerrando pendientes generales pequenos y validando contra Laravel los modulos que ya
habian sido conectados a API: Auth, Servicios, Usuarios/Empleados y Agenda/Citas.

No se integro Pacientes, Pagos, Cortes, Recetas, Dashboard ni Inventario.

## Fecha y contexto

| Campo | Valor |
|---|---|
| Fecha | 2026-05-27 |
| Rama | `main` |
| Commit inicial | `6e5f7bf` - `USUARIOS (#8)` |
| Commit final | Sin commit nuevo; working tree con correcciones y documentacion de esta fase |
| Backend Laravel | `C:\laragon\www\dentistaWebPg` |
| API frontend configurada | `http://localhost:8000/api` |
| Backend disponible | Si; Laragon responde en `http://dentistawebpg.test/api` y se levanto temporalmente `php artisan serve` en `localhost:8000` para respetar `.env` |
| Credenciales disponibles inicialmente | No |
| Base de datos usada | Si: MySQL `dentista_db` del backend local |
| Datos de prueba creados | Si; ver `docs/modulos/00-datos-prueba.md` |

## Estado inicial

### Git

| Comando | Resultado |
|---|---|
| `git status --short --branch --untracked-files=all` | `## main...origin/main` y `?? docs/cambios/27_05_2026_8-40am.md` preexistente al inicio de esta fase |
| `git branch --show-current` | `main` |
| `git log --oneline --decorate -5` | HEAD `6e5f7bf (HEAD -> main, origin/main) USUARIOS (#8)` |

### Validacion tecnica inicial

| Comando | Resultado inicial | Observaciones |
|---|---|---|
| `npm run type-check` | Pasa | `vue-tsc --build` codigo `0`. |
| `npm run build` | Pasa | Vite genera bundle; 2514 modulos transformados. |
| `npm run build-only` | Pasa | Vite genera bundle; 2514 modulos transformados. |
| `npx eslint . --no-cache` | Falla | `src/views/pacientes/PacientesView.vue:241:36`: `Unexpected any. Specify a different type` (`@typescript-eslint/no-explicit-any`). |
| `npm run lint` | No ejecutado | Los scripts `lint:oxlint` y `lint:eslint` incluyen `--fix`; se evito modificacion automatica no controlada. |

### Archivos relevantes revisados

- `package.json` y `.env`.
- `src/services/api.ts`, `src/stores/auth.ts`, `src/router/index.ts`.
- `src/layouts/MainLayout.vue`.
- `src/views/pacientes/PacientesView.vue`.
- `src/views/agenda/AgendaView.vue`, `EditarCitaModal.vue`, `Nuevacitamodal.vue`.
- `src/views/servicios/ServiciosView.vue`.
- `src/views/usuarios/UsuariosView.vue`.
- `src/services/citas.ts`, `src/services/servicios.ts`, `src/services/empleados.ts`.
- Backend: `routes/api.php`, controladores, requests, resources, modelos,
  middleware `CheckRol`, servicio `DisponibilidadCitaService` y esquema `citas`.

## Cambios realizados

| Archivo | Metodo/elemento afectado | Tipo | Motivo | Descripcion tecnica | Riesgo | Resultado |
|---|---|---|---|---|---|---|
| `src/views/pacientes/PacientesView.vue` | `PacienteGuardado` | Agregado | Eliminar `any` sin integrar pacientes a API | Interfaz local que representa el payload ya emitido por el drawer | Bajo; solo tipado en tiempo de desarrollo | ESLint deja de reportar el error |
| `src/views/pacientes/PacientesView.vue` | `onPacienteGuardado` | Modificado | Resolver `@typescript-eslint/no-explicit-any` | Parametro cambia de `any` a `PacienteGuardado`; conserva el comportamiento mock existente | Bajo; no realiza HTTP ni cambia UI | Correcto |
| `src/views/agenda/Nuevacitamodal.vue` | Archivo SFC | Renombrado | Seguridad en sistemas case-sensitive | Renombrado por Git a `NuevaCitaModal.vue` usando paso intermedio seguro en Windows | Bajo; requiere actualizar import | Correcto, rename registrado por Git |
| `src/views/agenda/AgendaView.vue` | Import de `NuevaCitaModal` | Modificado | Consumir el nombre PascalCase real | `./Nuevacitamodal.vue` pasa a `./NuevaCitaModal.vue` | Bajo | Type-check pasa |
| `docs/INDICE.md` | Indice | Agregado | Distinguir contexto vigente de historico | Orden de lectura para proximas fases | Ninguno | Creado |
| `docs/modulos/00-general.md` | Reporte | Agregado | Documentar preparacion | Evidencias, politica de errores y cambios | Ninguno | Creado |
| `docs/modulos/01-validacion-integraciones.md` | Reporte | Agregado | Documentar pruebas API reales | Resultados por modulo y bloqueos | Ninguno | Creado |
| `docs/modulos/00-datos-prueba.md` | Reporte | Agregado | Registrar modificaciones de BD | Datos TEST y credenciales temporales | Ninguno | Creado |

No se modifico `src/services/api.ts`: la revision no justifico un cambio de
comportamiento general en esta fase.

Nota de Git: debido al renombrado que cambia solo capitalizacion en Windows,
`NuevaCitaModal.vue` y su import en `AgendaView.vue` quedaron registrados en el area
staged como una unidad coherente. El tipado de Pacientes y los reportes quedan en el
working tree para revision.

## Metodos agregados

No se agregaron metodos funcionales. Se agrego el tipo TypeScript
`PacienteGuardado` en `PacientesView.vue` para describir el payload existente del
evento `guardado`.

## Metodos modificados

| Nombre | Archivo | Antes | Ahora | Motivo |
|---|---|---|---|---|
| `onPacienteGuardado` | `src/views/pacientes/PacientesView.vue` | Recibia `datos: any` | Recibe `datos: PacienteGuardado` | Cumplir tipado estricto y ESLint sin alterar el mock ni integrar API. |

## Metodos eliminados

No se eliminaron metodos.

## Manejo de errores y permisos

### Politica confirmada

| Caso | Politica actual | Evidencia | Decision de esta fase |
|---|---|---|---|
| `401` | Global: limpia sesion y redirige a `/login`, salvo el intento de login para que la vista muestre credenciales invalidas | Interceptor en `src/services/api.ts` y `clearSession()` en auth store | Mantener |
| `403` en acceso a ruta | Guard global envia a `/forbidden` por rol | `src/router/index.ts` y `ForbiddenView.vue` | Mantener |
| `403` en accion API de Servicios/Usuarios | Feedback local: `useApiError()` transforma `403` en mensaje y toast | `src/composables/useApiError.ts`, vistas integradas | Mantener manejo local para conservar contexto del formulario |
| `403` en accion API de Agenda | Mensaje inline del modal menciona permisos | `AgendaView.vue` | Mantener; documentar que no distingue el status HTTP |
| `422` | Servicios y Usuarios muestran errores por campo; Agenda maneja mensaje local | `useApiError()` y vistas | Validado en API para Servicios/Usuarios; Agenda bloqueada por error backend |
| Backend sin red | `useApiError()` genera `Sin conexion con el servidor` en vistas que lo usan | `fallbackMessage(undefined)` | Mantener |

### Razon para no agregar redireccion global de `403`

Servicios y Usuarios ya muestran feedback contextual cuando una operacion de formulario
es rechazada. Redirigir globalmente al usuario reemplazaria ese feedback y podria hacer
perder el contexto de edicion. La politica elegida es: guards para rutas y manejo local
para operaciones API. Agenda debe revisarse en su proxima correccion funcional si se
requiere informar status especifico.

## Convenciones aplicadas

- **TypeScript:** no se uso `any`, `@ts-ignore` ni reglas deshabilitadas; el payload
  mock existente fue tipado explicitamente.
- **Vue:** se conservo Composition API y componentes actuales; no hubo cambio visual.
- **Servicios:** no se agregaron llamadas HTTP directas en vistas.
- **Nomenclatura:** componente SFC de agenda normalizado a PascalCase
  `NuevaCitaModal.vue`.
- **Errores:** politica `401` global y `403` local/ruta documentada sin refactor.
- **Datos:** todos los registros creados usan identificadores `TEST` o descripcion
  `TEST`; no se borro ni modifico ningun registro preexistente.
- **Documentacion:** se centraliza el corte vigente en `docs/modulos/` y se conserva
  documentacion historica.

## Backend y hallazgo bloqueante

`curl` inicialmente fallo en `http://localhost:8000/api` porque no habia proceso
sirviendo ese puerto. Laragon si atendia el backend mediante
`http://dentistawebpg.test/api/login`, que respondio `405 Method Not Allowed` para
`GET`, confirmando que la ruta `POST /api/login` existe.

Para probar sin cambiar `.env`, se inicio temporalmente:

```text
php artisan serve --host=127.0.0.1 --port=8000
```

Una vez levantado:

| URL | Resultado |
|---|---|
| `GET http://localhost:8000/api` | `404`, servidor Laravel activo y ruta base no definida |
| `GET http://localhost:8000/api/login` | `405`, endpoint existe y exige `POST` |

### Bloqueo de Agenda

`POST /api/citas` retorna `500`. La evidencia del log Laravel indica:

```text
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'idEmpleado' in 'where clause'
```

La causa fue confirmada al consultar el esquema: la tabla `citas` no contiene
`idEmpleado`, mientras `DisponibilidadCitaService::tieneTraslape()` consulta esa
columna y el frontend envia `idEmpleado`. Corregir el contrato o la migracion pertenece
al backend y no se modifico en esta fase.

## Pruebas ejecutadas

| Comando / prueba | Resultado | Observaciones |
|---|---|---|
| `git status --short --branch --untracked-files=all` | Correcto | Estado inicial capturado. |
| `git branch --show-current` | Correcto | `main`. |
| `git log --oneline --decorate -5` | Correcto | HEAD `6e5f7bf`. |
| `npm run type-check` inicial | Pasa | Antes de editar. |
| `npm run build` inicial | Pasa | Antes de editar. |
| `npm run build-only` inicial | Pasa | Antes de editar. |
| `npx eslint . --no-cache` inicial | Falla | Unico error `any` en pacientes. |
| `php artisan route:list --path=api` | Pasa | 51 rutas API listadas. |
| `curl` Laragon/API configurada | Pasa tras servir puerto 8000 | Backend disponible para prueba. |
| API real Auth/Servicios/Usuarios/Agenda | Parcial | Detalle en `01-validacion-integraciones.md`. |
| Navegacion automatizada en frontend | Bloqueada | La herramienta de navegador fallo al preparar recursos internos en dos intentos, antes de abrir la app. |

### Validacion final despues de correcciones

| Comando | Resultado final | Observaciones |
|---|---|---|
| `npm run type-check` | Pasa | El import `NuevaCitaModal.vue` y el tipado de pacientes son validos. |
| `npx eslint . --no-cache` | Pasa | El error `any` inicial fue corregido sin silenciar reglas. |
| `npm run build` | Pasa | Type-check y bundle de produccion completados; 2514 modulos transformados. |
| `npm run build-only` | Pasa | Bundle Vite completado; 2514 modulos transformados. |

## Estado final

**Parcial.** La preparacion tecnica frontend queda cerrada para las correcciones
permitidas: el `any` esta tipado, la nomenclatura del modal es portable y la politica
de errores esta definida. Auth, Servicios y Usuarios se validaron con API real. Agenda
queda bloqueada por una incompatibilidad backend confirmada.

## Pendientes generales

1. Resolver en backend el contrato de dentista asignado a `citas` (`idEmpleado`) y
   repetir pruebas de crear, editar, cancelar, traslape y persistencia.
2. Repetir prueba visual frontend cuando la automatizacion de navegador este
   disponible, incluyendo `localStorage`, rutas y feedback.
3. Decidir si Agenda debe adoptar `useApiError()` para distinguir `403`, `422` y
   errores de servidor con el mismo patron de Servicios/Usuarios.
4. Mantener los datos activos `TEST` hasta completar la repeticion de Agenda; luego
   limpiarlos de manera controlada.
