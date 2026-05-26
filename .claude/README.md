# .claude/ — Índice de documentación del frontend

Este directorio contiene la documentación estructurada del proyecto Vue 3 para Claude Code.
Leer este índice antes de cualquier tarea para saber qué archivo consultar.

## Archivos en este directorio

| Archivo | Contenido |
|---|---|
| `architecture.md` | Stack, estructura de carpetas, layouts, router, convenciones de estilo |
| `api-integration.md` | Cliente HTTP, stores Pinia, servicios por módulo, manejo de errores |
| `domain-and-permissions.md` | Roles, permisos por pantalla, guards de ruta, visibilidad de acciones en UI |
| `views-and-components.md` | Qué vistas existen, qué componentes usa cada una, flujos de usuario |
| `dev-conventions.md` | Convenciones de código Vue 3: naming, composables, TypeScript, estilos |

## Regla de oro para el agente

> Antes de crear una vista o componente, leer `architecture.md` y `dev-conventions.md`.
> Antes de hacer una llamada a la API, leer `api-integration.md`.
> Antes de mostrar u ocultar una acción según el rol, leer `domain-and-permissions.md`.
> Para saber qué ya existe y qué falta, leer `views-and-components.md`.
