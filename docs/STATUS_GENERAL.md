# Status General: DentalSys Frontend

## Resumen ejecutivo

DentalSys Frontend presenta una interfaz amplia para administrar una clinica dental:
autenticacion, dashboard, pacientes, citas, servicios, empleados, pagos, cortes,
inventario y recetas. La aplicacion tiene buena base estructural para crecer: routing,
layout privado, control inicial por roles, cliente Axios centralizado, tipos de dominio
y componentes UI reutilizables.

El avance funcional real es menor al avance visual. Actualmente:

- El login, logout y cambio obligatorio de contrasena estan conectados a endpoints.
- Los servicios de dominio estan escritos, pero las vistas principales no los consumen.
- Siete areas de negocio presentan datos simulados o acciones solo locales.
- Dos modulos estan en estado de placeholder.
- El proyecto no supera actualmente el chequeo de tipos ni ESLint.

Conclusion: **prototipo frontend avanzado, no listo para produccion**.

## Arquitectura implementada

### Capas

| Capa | Situacion actual |
|---|---|
| Presentacion | Vistas Vue y componentes UI; gran cobertura visual |
| Layouts | `AuthLayout` y `MainLayout` implementados |
| Navegacion | Vue Router con lazy loading y guards |
| Estado global | Pinia implementado para autenticacion |
| HTTP | Axios centralizado con interceptores |
| Tipos | Interfaces para respuestas y entidades principales |
| Datos de negocio | Servicios declarados, integracion incompleta |
| Testing | Sin suite encontrada |

### Rutas existentes

| Ruta | Vista | Permiso de ruta |
|---|---|---|
| `/login` | Login | Publica |
| `/forgot-password` | Recuperacion | Publica |
| `/send-mail` | Confirmacion de correo | Publica |
| `/change-password` | Cambio de contrasena | Autenticado |
| `/dashboard` | Dashboard | Autenticado |
| `/pacientes` | Pacientes | Autenticado |
| `/pacientes/:id/historial` | Historial de paciente | Autenticado |
| `/pacientes/:id/editar` | Edicion de paciente | Autenticado |
| `/citas` | Agenda | Autenticado |
| `/servicios` | Servicios | Autenticado |
| `/empleados` | Empleados | Autenticado |
| `/recetas` | Recetas | Administrador o dentista |
| `/pagos` | Pagos | Administrador o recepcionista |
| `/cortes` | Cortes de caja | Administrador o recepcionista |
| `/inventario` | Inventario | Administrador |
| `/forbidden` | Acceso denegado | Publica/redireccion de permisos |

### API preparada

La URL se toma de `VITE_API_URL`, con fallback a `http://localhost:8000/api`.
El interceptor agrega `Authorization: Bearer <token>` y redirecciona en casos de
sesion expirada o acceso prohibido.

Servicios encontrados:

| Servicio | Operaciones declaradas |
|---|---|
| `auth.ts` | Login, logout, usuario autenticado, cambio de contrasena |
| `personas.ts` | Listar, consultar, crear, actualizar, desactivar |
| `citas.ts` | Listar, consultar, crear, actualizar, cancelar |
| `servicios.ts` | CRUD de servicios y clases |
| `empleados.ts` | CRUD y reset de contrasena |
| `pagos.ts` | Listar, consultar, registrar |
| `recetas.ts` | Listar, consultar, crear, actualizar |
| `cortes.ts` | Listar, consultar, consultar activo, abrir y cerrar |

## Lo funcional hoy

### Autenticacion

- El formulario de login llama al store de autenticacion.
- El store ejecuta `POST /login`.
- Se almacena token y empleado en `localStorage`.
- Se redirige a dashboard o cambio de contrasena segun
  `requiresPasswordChange`.
- El cambio de contrasena utiliza el servicio `auth`.
- La expiracion de sesion y el `403` tienen manejo global inicial.

La integracion requiere un backend disponible para validar el flujo completo de extremo
a extremo.

### Navegacion y layout

- El sidebar presenta los modulos segun rol.
- Los guards evitan acceso a rutas restringidas.
- Las vistas son cargadas de forma diferida.
- Existe una pantalla de acceso denegado.

## Lo simulado o incompleto

| Area | Evidencia de estado |
|---|---|
| Recuperacion de contrasena | Navega a confirmacion sin solicitar envio a API |
| Dashboard | Tarjetas, agenda y alertas declaradas en arreglos estaticos |
| Pacientes | Listado, detalle y edicion con datos mock; guardar no persiste |
| Citas | Catalogos y citas en memoria; crear/editar conserva `TODO` |
| Servicios | CRUD en arreglo local |
| Empleados | CRUD en arreglo local |
| Pagos | Listado y comprobante simulados; registro no llama API |
| Inventario | Usa `src/lib/mock-data.ts`; no tiene servicio de backend |
| Recetas | Solo encabezado |
| Cortes | Solo encabezado |

## Validaciones ejecutadas el 2026-05-26

| Comando | Resultado |
|---|---|
| `npm run type-check` | Falla |
| `npx oxlint .` | Pasa |
| `npx eslint . --no-cache` | Falla |
| `npm run build-only` | Pasa y genera `dist/` |
| `npm run build` | No aprobado: incluye `type-check`, que falla |

Errores observados:

- TypeScript no resuelve apropiadamente `AgendaView.vue` porque sus bloques script no
  estan tipados como TypeScript.
- `UsuariosView.vue` tiene accesos que TypeScript considera posiblemente `undefined` y
  una asignacion incompatible con su interfaz.
- ESLint reporta scripts sin `lang="ts"` en agenda, `any` en pacientes y variables no
  utilizadas en agenda/servicios.

## Riesgos principales

| Riesgo | Impacto |
|---|---|
| Vistas desconectadas de servicios API | El usuario cree guardar datos que se pierden |
| Modulos financieros incompletos | No puede operar cobro/corte real |
| Permisos principalmente por ruta | Acciones sensibles pueden mostrarse a roles inadecuados |
| Fallos de tipo/lint | Bloquean un pipeline de entrega serio |
| Sin pruebas automatizadas | Alta probabilidad de regresiones al integrar backend |
| Archivo/import de cita con mayusculas diferentes | Puede fallar al desplegar en Linux |
| Documentacion base incompleta | Dificulta continuidad del equipo |

## Practicas y convenciones observadas

Practicas positivas:

- Separacion por capas (`views`, `services`, `stores`, `types`, `layouts`).
- Composition API y uso mayoritario de `<script setup lang="ts">`.
- Componentes UI reutilizables disponibles.
- Alias `@/` y configuracion de formato/lint.
- Tokens visuales definidos en CSS global.

Practicas no uniformes:

- Agenda no utiliza TypeScript en sus scripts.
- Pagos e inventario emplean punto y coma aunque la configuracion usa estilo sin ellos.
- Algunas vistas usan primitivas UI; otras usan botones/inputs HTML directos.
- Algunas importaciones usan rutas relativas, aunque existe alias.
- Hay modelos locales que duplican o divergen de `src/types/index.ts`.
- Los nombres `agenda`/`citas`, `usuarios`/`empleados` y
  `Nuevacitamodal`/`NuevaCitaModal` no son consistentes.

## Criterio de finalizacion recomendado

El frontend podra considerarse completo cuando:

1. Todos los modulos visibles consuman datos reales o se marquen explicitamente fuera
   de alcance.
2. Los flujos de creacion, edicion, cancelacion y cobro persistan en backend.
3. Los permisos se apliquen tanto a rutas como a acciones.
4. `type-check`, lint y build pasen sin errores.
5. Los flujos criticos tengan pruebas o validacion repetible documentada.

