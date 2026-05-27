# Contexto para ChatGPT: DentalSys Frontend

## Objetivo de este documento

Este archivo es el punto de entrada recomendado para cualquier asistente o programador
que retome el proyecto. Resume que existe, que funciona realmente, que esta simulado y
donde consultar el detalle.

Fecha de auditoria: **2026-05-26**  
Proyecto auditado: **`dentistaWebpgFront`**  
Alcance: frontend Vue; no se valido la implementacion interna del backend.

## Lectura rapida

DentalSys es una SPA para administracion de una clinica dental. Tiene una interfaz
amplia, rutas por rol, layout autenticado y servicios HTTP definidos para los modulos
principales. El flujo de login y cambio obligatorio de contrasena son las unicas
funcionalidades claramente conectadas con la API desde las vistas actuales.

La mayor parte de dashboard, pacientes, agenda, servicios, empleados, pagos e inventario
utiliza arreglos locales o datos mock. `Recetas` y `Cortes de Caja` solo muestran su
encabezado. Por tanto, el sistema debe tratarse como **prototipo frontend avanzado en
fase de integracion**, no como producto terminado.

## Estado global

| Area | Estado verificado |
|---|---|
| Stack y estructura base | Implementados |
| Rutas protegidas y roles | Implementados en frontend |
| Login/logout/cambio de contrasena | Integrados con API, requieren backend para prueba completa |
| Servicios API por dominio | Definidos, casi todos sin conectar a vistas |
| Modulos de negocio | Mayormente mock o incompletos |
| TypeScript / lint | Con errores pendientes |
| Build visual de Vite | Genera bundle con `npm run build-only` |
| Build de entrega | No aprobado porque `npm run type-check` falla |
| Pruebas automatizadas | No encontradas |

## Tecnologia y estructura

- Vue 3 con Composition API y componentes `.vue`.
- TypeScript y `vue-tsc`.
- Vite 7.
- Tailwind CSS 4.
- Pinia para autenticacion.
- Vue Router con guards por sesion y rol.
- Axios con interceptor Bearer y manejo de `401` / `403`.
- Reka UI y componentes estilo shadcn en `src/components/ui/`.
- `vue-sonner` para notificaciones.

Archivos centrales:

| Proposito | Archivo |
|---|---|
| Entrada de aplicacion | `src/main.ts` |
| Router y permisos | `src/router/index.ts` |
| Sidebar/layout privado | `src/layouts/MainLayout.vue` |
| Store de autenticacion | `src/stores/auth.ts` |
| Cliente HTTP global | `src/services/api.ts` |
| Modelos de dominio | `src/types/index.ts` |
| Estilos y tokens | `src/assets/main.css` |

## Documentos de handoff

Leer en este orden:

1. `docs/STATUS_GENERAL.md`: diagnostico ejecutivo, arquitectura y riesgos.
2. `docs/STATUS_MODULOS.md`: estado funcional por pantalla, rutas y servicios.
3. `docs/BACKLOG_PARA_COMPLETAR.md`: trabajo pendiente ordenado por prioridad.
4. `docs/resumen-login.md`: detalle historico del login ya integrado.

## Reglas para futuras intervenciones

Antes de afirmar que un modulo esta listo, comprobar:

1. Que la vista importe y use el servicio correspondiente.
2. Que los datos sobrevivan a una recarga y provengan del backend.
3. Que se manejen carga, error, validacion y permisos de accion.
4. Que `npm run type-check`, `npm run lint` y `npm run build` pasen.
5. Que exista al menos una verificacion del flujo critico afectado.

No asumir que una pantalla con formulario o modal guarda informacion: hoy varias solo
modifican memoria local o muestran una notificacion.

## Hallazgos criticos inmediatos

- `src/views/recetas/RecetasView.vue` no implementa operaciones.
- `src/views/cortes/CortesView.vue` no implementa operaciones.
- `src/views/agenda/AgendaView.vue` y sus modales tienen `TODO` de persistencia.
- `src/views/pacientes/*`, `ServiciosView.vue`, `UsuariosView.vue`, `PagosView.vue` e
  `InventarioView.vue` muestran datos locales en vez de consumir API.
- Existe un posible problema de capitalizacion entre el archivo
  `Nuevacitamodal.vue` y el import `NuevaCitaModal.vue`, especialmente en Linux.
- La revision de calidad registrada el 2026-05-26 encontro errores TypeScript y ESLint.

## Estado del repositorio durante la auditoria

La rama observada fue `andrykNew`. Durante la primera inspeccion aparecieron eliminaciones
locales previas dentro de `.claude/` y de `CLAUDE.md`; al verificar estos reportes, Git
solo mostro los cuatro archivos nuevos de `docs/`. La auditoria no realizo cambios sobre
aquellas rutas. Las guias historicas consultadas contenian criterios de arquitectura y
permisos, cuyos conceptos utiles se resumen en estos reportes.
