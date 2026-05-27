Actúa como agente de desarrollo dentro de Antigravity IDE usando Gemini 3.1 Pro High.

FASE: 00 - Preparación general del frontend DentalSys

OBJETIVO DE ESTA FASE:
Preparar el proyecto antes de trabajar módulos específicos. Esta fase NO debe implementar pacientes, pagos, inventario ni autenticación todavía. Solo debe revisar el estado actual, confirmar contratos del backend, organizar documentación, validar comandos base y dejar preparada una estructura clara de reportes.

MÓDULOS QUE SÍ SE TRABAJARÁN EN FASES POSTERIORES:
1. Autenticación y seguridad.
2. Pacientes.
3. Pagos, cortes y facturación interna/comprobantes.
4. Inventario.

MÓDULOS QUE NO DEBES MODIFICAR:
Estos módulos pertenecen a compañeros y deben tratarse como cajas negras funcionales:
- Usuarios / Empleados.
- Citas / Agenda.
- Servicios.

Puedes leerlos para entender dependencias, pero NO debes refactorizarlos, reescribirlos ni cambiar su lógica interna.

DOCUMENTOS QUE DEBES LEER PRIMERO:
- GUIA_FRONTEND_API.md
- RESUMEN_ENDPOINTS_API.md
- REVISION_FINAL_BACKEND.md

Usa esos documentos como contrato principal. No inventes rutas, payloads, roles ni reglas de negocio si ya están definidos ahí.

CONTEXTO DEL BACKEND:
El backend Laravel está listo para integración frontend. Usa Laravel Sanctum con tokens Bearer. Todas las rutas privadas requieren:

Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json

Códigos relevantes:
- 200: consulta o actualización correcta.
- 201: creación correcta.
- 204: eliminación lógica o cancelación sin contenido.
- 401: token inválido, expirado, no enviado o sesión inactiva.
- 403: usuario autenticado sin permisos para la acción.
- 404: recurso inexistente o inactivo.
- 422: error de validación o regla de negocio rota.
- 500+: error interno del servidor.

REGLAS GENERALES:
- No uses `any`.
- No uses `@ts-ignore`.
- No uses `eslint-disable` salvo caso extremo, justificado y documentado.
- No agregues mocks nuevos.
- No dejes `console.log`.
- No dejes TODOs nuevos sin documentar.
- No hagas refactors grandes.
- No cambies diseño visual.
- No modifiques módulos de compañeros.
- No hagas llamadas HTTP directas desde vistas si corresponde usar `src/services`.
- Respeta Vue 3 Composition API.
- Usa TypeScript de forma estricta.
- Mantén separación entre:
  - views
  - services
  - stores
  - types
  - components
  - layouts
  - router

REGLAS SOBRE BASE DE DATOS:
Laragon puede estar encendido. En esta fase puedes comprobar conectividad, pero NO debes crear, editar ni borrar datos todavía, salvo que sea estrictamente necesario para verificar conexión y lo documentes.

No puedes:
- Ejecutar `migrate:fresh`.
- Ejecutar `db:wipe`.
- Truncar tablas.
- Borrar datos reales.
- Modificar contraseñas reales.
- Alterar estructura de base de datos.
- Crear datos de prueba todavía, salvo que sea imprescindible y documentado.

FASE 00.1 - REVISIÓN DEL ESTADO DEL PROYECTO

Ejecuta y documenta:

git status --short --branch
git branch --show-current
git log --oneline -5
npm run type-check
npx eslint . --no-cache
npm run build
npm run build-only

Si `npm run build-only` no existe, documenta que no existe y continúa.

Revisa también:
- package.json
- .env
- src/services/api.ts
- src/stores/auth.ts
- src/router/index.ts
- src/layouts/MainLayout.vue
- src/types/index.ts

Objetivo:
Confirmar si el proyecto compila, si ESLint pasa, qué rama está activa y si hay cambios locales.

FASE 00.2 - REVISIÓN DEL CONTRATO API

Lee y resume en el reporte lo relevante de:

1. GUIA_FRONTEND_API.md
2. RESUMEN_ENDPOINTS_API.md
3. REVISION_FINAL_BACKEND.md

Debes extraer específicamente:
- Base URL esperada.
- Mecanismo de autenticación.
- Headers obligatorios.
- Manejo esperado de 401.
- Manejo esperado de 403.
- Manejo esperado de 422.
- Endpoints relevantes para:
  - Auth.
  - Personas/pacientes.
  - Pagos.
  - Cortes.
  - Comprobantes.
  - Inventario productos.
  - Inventario movimientos.
- Módulos que deben tratarse como cajas negras:
  - Usuarios / empleados.
  - Citas / agenda.
  - Servicios.

FASE 00.3 - VALIDACIÓN DE BACKEND

Revisa `.env` del frontend y detecta `VITE_API_URL`.

Prueba conectividad con las URLs probables:

curl -i http://localhost:8000/api
curl -i http://dentistawebpg.test/api

Si una responde, documenta:
- URL usada.
- Código HTTP.
- Respuesta.
- Si parece Laravel.
- Si requiere auth.

Si ninguna responde, documenta:
- Backend no disponible.
- No detener la fase.
- No marcar módulos como funcionales.

No hagas pruebas de login en esta fase todavía; solo conectividad base.

FASE 00.4 - ORGANIZACIÓN DE DOCUMENTACIÓN

Revisa la carpeta `docs/`.

Reglas:
1. Si existe `docs/modulos/`, úsala.
2. Si no existe, créala.
3. No borres documentos existentes.
4. Si hay documentos previos útiles, respétalos.
5. Si no existe índice, crea `docs/INDICE.md`.

Debes crear o actualizar:

docs/modulos/00-plan-restante.md

Opcional, si ayuda:
docs/INDICE.md

El archivo `docs/modulos/00-plan-restante.md` debe contener:

# Fase 00 - Preparación general

## Objetivo
Explicar que esta fase prepara el proyecto antes de implementar módulos específicos.

## Fecha y contexto
- Fecha.
- Rama.
- Commit inicial.
- Backend disponible: Sí/No.
- URL API detectada.
- Documentos backend leídos.

## Alcance
Qué se revisó y qué no se tocó.

Debe decir claramente:
- No se implementó auth.
- No se implementó pacientes.
- No se implementó pagos.
- No se implementó inventario.
- No se modificaron módulos de compañeros.

## Estado inicial del proyecto
Tabla con:
- Comando.
- Resultado.
- Observaciones.

Incluir:
- git status
- git branch
- git log
- npm run type-check
- npx eslint . --no-cache
- npm run build
- npm run build-only

## Contrato API resumido
Incluir:
- Base URL.
- Auth.
- Headers.
- 401.
- 403.
- 404.
- 422.
- Reglas generales.

## Módulos propios pendientes
Tabla:
- Módulo.
- Estado actual si puede inferirse.
- Endpoints relevantes.
- Riesgos.

Módulos:
- Auth/seguridad.
- Pacientes.
- Pagos/cortes/comprobantes.
- Inventario.

## Módulos de compañeros / cajas negras
Tabla:
- Módulo.
- Estado según documentos.
- Regla de no modificación.
- Cuándo puede consumirse.

Módulos:
- Usuarios/empleados.
- Citas/agenda.
- Servicios.

## Backend
- URL probada.
- Resultado.
- Si respondió o no.
- Evidencia.

## Archivos revisados
Lista de archivos revisados.

## Archivos modificados
Lista de archivos modificados. En esta fase idealmente solo documentación.

## Decisiones técnicas
Explicar cualquier decisión tomada, por ejemplo:
- Dónde se guardarán reportes.
- Cómo se organizarán fases.
- Qué módulos no se tocarán.
- Qué URL API se usará.

## Riesgos detectados
Lista de riesgos:
- Backend no disponible, si aplica.
- ESLint fallando, si aplica.
- Configuración `.env` incompleta, si aplica.
- Inconsistencias de tipos o rutas, si aplica.

## Estado final
Debe ser uno:
- Completa.
- Parcial.
- Bloqueada.

## Siguiente fase sugerida
Debe indicar que la siguiente fase es:
01 - Autenticación y seguridad.

FASE 00.5 - VALIDACIÓN FINAL DE ESTA FASE

Al terminar, ejecuta nuevamente:

npm run type-check
npx eslint . --no-cache
npm run build

Si modificaste algo que pudiera afectar build, también ejecuta:

npm run build-only

CRITERIOS DE ACEPTACIÓN:
Esta fase queda completa si:

1. Se revisaron los documentos del backend.
2. Se confirmó rama y commit actual.
3. Se ejecutaron comandos base.
4. Se detectó la URL API.
5. Se probó conectividad con backend.
6. Se creó o actualizó `docs/modulos/00-plan-restante.md`.
7. Se creó o actualizó índice documental si hacía falta.
8. No se modificaron módulos de compañeros.
9. No se implementaron módulos funcionales todavía.
10. Se dejó claro qué sigue.

RESPUESTA FINAL ESPERADA:
Al terminar, responde con:

1. Estado de la fase: Completa / Parcial / Bloqueada.
2. Rama y commit revisados.
3. Backend disponible: Sí/No.
4. URL API detectada.
5. Resultado de comandos:
   - npm run type-check
   - npx eslint . --no-cache
   - npm run build
   - npm run build-only, si aplica
6. Documentos creados o actualizados.
7. Archivos modificados.
8. Confirmación de que no se tocaron módulos de compañeros.
9. Riesgos detectados.
10. Siguiente fase recomendada.