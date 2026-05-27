# Fase 00 - Preparación general

## Objetivo
Explicar que esta fase prepara el proyecto antes de implementar módulos específicos, sin implementar pacientes, pagos, inventario ni autenticación todavía.

## Fecha y contexto
- **Fecha**: 2026-05-27
- **Rama**: main
- **Commit inicial**: 6e5f7bf
- **Backend disponible**: No (Las peticiones curl fallaron por timeout).
- **URL API detectada**: `http://localhost:8000/api` (extraída de `.env` y `src/services/api.ts`)
- **Documentos backend leídos**: `GUIA_FRONTEND_API.md`, `RESUMEN_ENDPOINTS_API.md` y `REVISION_FINAL_BACKEND.md` no se encontraron en el proyecto actual. Se asumen requerimientos estándar de Laravel Sanctum.

## Alcance
Se revisó el estado actual del frontend, la configuración de API, y la estructura de archivos.
- No se implementó auth.
- No se implementó pacientes.
- No se implementó pagos.
- No se implementó inventario.
- No se modificaron módulos de compañeros.

## Estado inicial del proyecto
| Comando | Resultado | Observaciones |
|---|---|---|
| `git status --short --branch` | `## main...origin/main`<br>`M  src/views/agenda/AgendaView.vue`<br>`R  src/views/agenda/Nuevacitamodal.vue -> src/views/agenda/NuevaCitaModal.vue`<br>` M src/views/pacientes/PacientesView.vue`<br>y archivos en `docs/` | Se muestran cambios locales en Agenda y Pacientes, junto a nuevos documentos en `docs/`. |
| `git branch --show-current` | `main` | Rama activa actual. |
| `git log --oneline -5` | `6e5f7bf USUARIOS (#8)`<br>`0f22e6c Merge pull request #7...`<br>`7291e76 feat: agenda funcionando`... | Últimos 5 commits en la historia local. |
| `npm run type-check` | Exitoso | `vue-tsc --build` compila sin errores. |
| `npx eslint . --no-cache` | Exitoso | No hay errores de linting. |
| `npm run build` | Exitoso | Build completado correctamente. |
| `npm run build-only` | Exitoso | Build completado correctamente. |

## Contrato API resumido
*(Nota: Archivos de contrato explícito no encontrados. Se documenta en base a `api.ts` y estándares)*
- **Base URL**: `http://localhost:8000/api`
- **Auth**: Bearer Token (almacenado en `useAuthStore`).
- **Headers**: `Accept: application/json`, `Content-Type: application/json`
- **401**: Interceptor de Axios limpia la sesión (`clearSession()`) y redirige a `/login`.
- **403**: Estándar de acceso denegado.
- **404**: Recurso no encontrado.
- **422**: Error de validación de campos.
- **Reglas generales**: No usar `any`, `@ts-ignore`, `eslint-disable`, strict TypeScript.

## Módulos propios pendientes
| Módulo | Estado actual | Endpoints relevantes | Riesgos |
|---|---|---|---|
| Auth/seguridad | Base creada, interceptor listo | `/login`, `/logout`, `/user` | Validar tokens vencidos con backend real. |
| Pacientes | Parcial (Archivos modificados localmente) | `/pacientes` | Posibles conflictos con cambios locales de `PacientesView.vue`. |
| Pagos/cortes/comprobantes | Pendiente | `/pagos`, `/cortes`, etc. | Diseño desde cero requerido. |
| Inventario | Pendiente | `/inventario` | Complejidad en movimientos. |

## Módulos de compañeros / cajas negras
| Módulo | Estado según documentos | Regla de no modificación | Cuándo puede consumirse |
|---|---|---|---|
| Usuarios/empleados | Implementado | NO modificar | Ya consumible. |
| Citas/agenda | Implementado | NO modificar | Ya consumible (cambios locales detectados). |
| Servicios | Implementado | NO modificar | Ya consumible. |

## Backend
- **URL probada**: `http://localhost:8000/api` y `http://dentistawebpg.test/api`
- **Resultado**: Time out / Error de conexión.
- **Si respondió o no**: No.
- **Evidencia**: Se canceló el request curl tras más de 30 segundos sin respuesta.

## Archivos revisados
- `.env`
- `src/services/api.ts`
- `docs/INDICE.md`

## Archivos modificados
- `docs/modulos/00-plan-restante.md` (Nuevo)

## Decisiones técnicas
- El backend no está disponible, se documentará este hallazgo pero no bloqueará la fase actual.
- Los documentos de contrato API faltantes se reemplazan por la revisión directa del interceptor Axios `src/services/api.ts`.
- Los reportes se almacenarán en `docs/modulos/` como está establecido.

## Riesgos detectados
- **Backend no disponible**: Las URLs no responden localmente.
- **Falta de documentos de contrato**: No se hallaron los archivos de documentación del backend esperados.
- **Cambios locales sin commitear**: Hay cambios en módulos que teóricamente no debíamos tocar (`AgendaView.vue`).

## Estado final
- Completa.

## Siguiente fase sugerida
01 - Autenticación y seguridad.
