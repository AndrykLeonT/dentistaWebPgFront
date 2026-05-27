# Modulo Servicios

## Objetivo

Convertir el modulo de servicios de un CRUD visual basado en datos locales a un catalogo conectado a la API real de DentalSys, con listado, alta, edicion, desactivacion, categorias reales, permisos y manejo de errores.

## Estado inicial

El modulo mostraba una tabla y modales funcionales visualmente, pero dependia de arreglos locales. Las acciones de crear y editar actualizaban memoria del navegador, no persistian en backend. La desactivacion no estaba conectada a API y existia un error ESLint por una variable `cat` declarada y no usada.

Se solicito revisar `docs/modulos/00-general.md`, pero ese archivo no existe en este repositorio. Se usaron como referencia los documentos disponibles en `docs/STATUS_GENERAL.md` y `docs/STATUS_MODULOS.md`.

## Archivos revisados

- `docs/STATUS_GENERAL.md`
- `docs/STATUS_MODULOS.md`
- `src/views/servicios/ServiciosView.vue`
- `src/services/servicios.ts`
- `src/types/index.ts`
- `src/stores/auth.ts`
- `src/composables/useApiError.ts`
- `routes/api.php`
- `app/Http/Controllers/ServicioController.php`
- `app/Http/Requests/StoreServicioRequest.php`
- `app/Http/Requests/UpdateServicioRequest.php`
- `app/Http/Resources/ServicioResource.php`
- `app/Models/Servicio.php`
- `app/Models/ClaseServicio.php`

## Archivos modificados

- `src/views/servicios/ServiciosView.vue`: reemplazo de mocks por carga real desde API, formularios conectados, estados de carga/error/vacio, permisos y desactivacion real.
- `src/services/servicios.ts`: servicio tipado para listar, consultar, crear, actualizar, desactivar servicios y consultar clases.
- `src/types/index.ts`: tipos alineados al contrato real del backend para servicios, clases y payloads.
- `app/Http/Controllers/ServicioController.php`: listado ordenado, visibilidad de inactivos solo para roles administradores del catalogo y reutilizacion de permiso interno.
- `app/Http/Requests/UpdateServicioRequest.php`: soporte validado para actualizar `estado`.
- `app/Http/Resources/ServicioResource.php`: exposicion de `estado`, `activo` y `precio` para el frontend.

## Problemas corregidos

| Problema | Archivo | Causa | Solucion | Por que es segura |
|---|---|---|---|---|
| CRUD visual sin persistencia | `ServiciosView.vue` | Se usaban arreglos locales | Se reemplazo por `serviciosService` | La UI depende del backend y recarga despues de cada accion |
| Categorias locales | `ServiciosView.vue` | Las opciones estaban hardcodeadas | Se cargan desde `/clases-servicio` | Usa el catalogo real existente |
| Error ESLint `cat` | `ServiciosView.vue` | Parametro no utilizado | Se elimino la funcion mock asociada | No afecta comportamiento real |
| Desactivacion simulada o ausente | `ServiciosView.vue`, `ServicioController.php` | No habia llamada real desde UI | Se usa `DELETE /servicios/{id}` | El registro solo cambia tras respuesta exitosa |
| Estado no editable | `UpdateServicioRequest.php` | `estado` no estaba permitido | Se agrego validacion booleana | Laravel valida el tipo antes de guardar |
| Front sin estado real | `ServicioResource.php` | La respuesta no exponia estado normalizado | Se agregaron `estado` y `activo` | Mantiene compatibilidad y claridad para UI |
| Precio no normalizado | `ServicioResource.php` | Backend exponia `costo` como valor original | Se agrego `precio` numerico | Evita conversiones ambiguas en vista |

## Integracion API

El frontend reutiliza `api.ts` mediante `src/services/servicios.ts`.

Endpoints usados:

- `GET /servicios`: listado real.
- `GET /servicios/{id}`: consulta individual disponible en servicio.
- `POST /servicios`: alta de servicio.
- `PUT /servicios/{id}`: edicion de servicio y cambio de estado.
- `DELETE /servicios/{id}`: desactivacion logica.
- `GET /clases-servicio`: categorias/clases reales.

Flujo general:

1. Al entrar al modulo se cargan servicios y clases en paralelo.
2. El listado se filtra solo en frontend sobre datos reales ya cargados.
3. Alta y edicion envian payloads tipados al backend.
4. Si la API responde correctamente, se cierra el modal y se recarga el listado.
5. Si la API falla, el modal permanece abierto y se muestran errores reales.

## Categorias/clases

El backend ya cuenta con `clase_servicios` y endpoint `GET /clases-servicio`. La vista dejo de usar categorias locales y ahora llena los selects con esas clases reales. No se inventaron contratos nuevos para crear categorias desde el modulo de servicios.

## Eliminacion de mocks

Se eliminaron los arreglos locales principales de servicios y categorias. La tabla ya no muestra datos inventados cuando la API esta vacia. Si no hay registros, se muestra un estado vacio.

## Manejo de errores

- `401`: el interceptor de API limpia sesion y redirige a login.
- `403`: se bloquean acciones desde UI y `useApiError` muestra mensaje de permisos si el backend rechaza.
- `422`: se muestran errores por campo debajo del input correspondiente.
- Errores generales o servidor caido: se muestra banner superior y toast con el mensaje disponible.

## Roles y permisos

Reglas aplicadas:

- Administrador puede listar, crear, editar y desactivar servicios.
- Recepcionista puede listar, crear, editar y desactivar servicios, respetando la regla ya definida en backend para el catalogo.
- Dentista puede consultar servicios, pero no administra el catalogo.
- Otros roles quedan en solo lectura si tienen acceso a la ruta.

La UI oculta botones sensibles y los handlers vuelven a validar permisos antes de llamar a API. El backend mantiene la proteccion real por middleware de roles.

## Convenciones aplicadas

- Vue con `<script setup lang="ts">`.
- Tipos explicitos para formularios y payloads.
- Sin `any` en el modulo de servicios.
- Sin `console.log` nuevos.
- Sin llamadas `fetch` o `axios` directas en la vista.
- Separacion entre `views`, `services`, `types`, `stores` y backend.
- Estilo visual conservado respecto al modulo existente.

## Pruebas ejecutadas

| Prueba | Resultado | Observaciones |
|---|---|---|
| `npm run type-check` | Correcto | Requirio permiso de escritura para actualizar `node_modules/.tmp` |
| `npx eslint src/views/servicios/ServiciosView.vue src/services/servicios.ts src/types/index.ts --no-cache` | Correcto | Servicios no reporta errores ESLint |
| `npx eslint . --no-cache` | Parcial | Falla por `src/views/pacientes/PacientesView.vue:241` con `any`, ajeno al modulo servicios y no modificado por indicacion del usuario |
| `npm run build` | Correcto | Requirio permiso elevado por lectura/escritura de temporales de Vite/esbuild |
| `php artisan test --filter=Servicio` | Correcto | Paso 1 prueba filtrada: `Tests\Feature\CitaTest::filtro por servicio id` |
| Prueba HTTP local de servicios | Bloqueada | La API levanto en `127.0.0.1:8000`, pero `admin/password123` respondio `401`; no se consultaron usuarios por indicacion del usuario |

## Estado final

Parcial por validacion global pendiente ajena a servicios. La implementacion funcional del modulo esta integrada en frontend y backend, y las validaciones enfocadas de servicios pasan.

## Pendientes

- Confirmar con datos reales en navegador: listado, alta, edicion y desactivacion.
- Resolver el `any` preexistente en `PacientesView.vue` cuando se permita tocar ese modulo para que `npx eslint . --no-cache` pase completo.
- Si el negocio decide que recepcionista no debe administrar servicios, ajustar la regla en middleware/backend y UI.
