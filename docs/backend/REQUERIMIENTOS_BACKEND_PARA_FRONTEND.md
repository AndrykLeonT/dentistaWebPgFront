# Requerimientos Backend para Frontend

## Objetivo

Listar los contratos backend que el frontend DentalSys necesita para quedar 100% funcional sin mocks, sin datos falsos y sin prometer funcionalidades fuera de alcance.

## Contexto

- Fecha: 2026-05-27.
- Rama frontend: `main`.
- Commit frontend: `6e5f7bf`.
- URL API usada: `http://localhost:8000/api`.
- Fase que genero el documento: Fase 06 - Cierre integral frontend preparado para backend.

## Resumen ejecutivo

| Area | Requerimiento backend | Prioridad | Estado actual observado | Impacto en frontend |
|---|---|---|---|---|
| Auth | Recuperacion por palabra clave | P0 | `POST /api/recover-password-keyword` responde `404` | Vista preparada, muestra pendiente backend y no simula exito |
| Pacientes | Historial de citas por paciente | P1 | `GET /api/personas/119/historial-citas` responde `404` | Vista preparada, muestra pendiente backend |
| Pacientes | Historial de pagos por paciente | P1 | `GET /api/personas/119/historial-pagos` responde `404` | Vista preparada, muestra pendiente backend |
| Dashboard | Resumen agregado del consultorio | P1 | `GET /api/dashboard/resumen` responde `404` | Dashboard preparado, sin metricas hardcodeadas |
| Inventario | Reglas de consumo por servicio | P1 | `GET /api/inventario/consumos-servicio` responde `404` | UI y servicio preparados |
| Inventario | Ejecutar consumo automatico por cita | P1 | No probado, contrato documentado | Servicio preparado; requiere backend |
| Roles | Inventario para recepcionista | P2 | API responde `200`, pero frontend/ruta lo restringe a admin | Backend deberia confirmar politica final |

## Endpoints requeridos

### Recuperacion por palabra clave

- Metodo: `POST`.
- Ruta: `/api/recover-password-keyword`.
- Auth requerida: No.
- Roles: No aplica.
- Payload esperado:

```json
{
  "usuario": "test.admin@dentalsys.local",
  "palabraClave": "ClaveAdmin123!",
  "new_password": "NuevaPassword123!",
  "new_password_confirmation": "NuevaPassword123!"
}
```

- Respuesta 200:

```json
{
  "message": "Contraseña actualizada correctamente."
}
```

- Errores esperados: `401` palabra clave incorrecta, `404` usuario no encontrado si backend decide revelarlo, `422` validacion por campo, `500` error general.
- Pantalla frontend: `src/views/auth/ForgotPasswordView.vue`.
- Servicio frontend: `src/services/auth.ts` metodo `recoverPasswordByKeyword`.
- Estado actual observado: no existe, responde `404`.

### Historial de citas del paciente

- Metodo: `GET`.
- Ruta: `/api/personas/{id}/historial-citas`.
- Auth requerida: Si.
- Roles: Admin, dentista, recepcionista segun politica de pacientes.
- Respuesta 200:

```json
[
  {
    "id": 1,
    "fecha": "2026-05-27",
    "hora": "10:00",
    "estado": "completada",
    "servicio": "Limpieza dental",
    "dentista": "Nombre Dentista",
    "observaciones": "Texto opcional"
  }
]
```

- Errores esperados: `401`, `403`, `404`, `500`.
- Pantalla frontend: `src/views/pacientes/VerHistorialPacienteView.vue`.
- Servicio frontend: `src/services/personas.ts` metodo `getHistorialCitas`.
- Estado actual observado: no existe, responde `404`.

### Historial de pagos del paciente

- Metodo: `GET`.
- Ruta: `/api/personas/{id}/historial-pagos`.
- Auth requerida: Si.
- Roles: Admin y recepcionista; dentista solo si negocio lo permite.
- Respuesta 200:

```json
[
  {
    "id": 1,
    "fecha": "2026-05-27",
    "total": 500,
    "efectivo": 300,
    "tarjeta": 200,
    "folioComprobante": "REC-0001",
    "estado": "pagado"
  }
]
```

- Errores esperados: `401`, `403`, `404`, `500`.
- Pantalla frontend: `src/views/pacientes/VerHistorialPacienteView.vue`.
- Servicio frontend: `src/services/personas.ts` metodo `getHistorialPagos`.
- Estado actual observado: no existe, responde `404`.

### Dashboard resumen

- Metodo: `GET`.
- Ruta: `/api/dashboard/resumen`.
- Auth requerida: Si.
- Roles: Todos los roles autenticados con metricas filtradas si aplica.
- Respuesta 200:

```json
{
  "pacientesActivos": 20,
  "citasHoy": 8,
  "ingresosHoy": 2500,
  "productosBajoStock": 4,
  "citasProximas": [],
  "alertasInventario": []
}
```

- Errores esperados: `401`, `403`, `404`, `500`.
- Pantalla frontend: `src/views/dashboard/DashboardView.vue`.
- Servicio frontend: `src/services/dashboard.ts` metodo `getResumen`.
- Estado actual observado: no existe, responde `404`.

### Reglas de consumo por servicio

- Metodos y rutas:
  - `GET /api/inventario/consumos-servicio`
  - `POST /api/inventario/consumos-servicio`
  - `GET /api/inventario/consumos-servicio/{id}`
  - `PUT/PATCH /api/inventario/consumos-servicio/{id}`
  - `DELETE /api/inventario/consumos-servicio/{id}`
- Auth requerida: Si.
- Roles: Admin.
- Payload POST:

```json
{
  "idServicio": 1,
  "idProductoInventario": 1,
  "cantidad": 2
}
```

- Respuesta 200/201:

```json
{
  "id": 1,
  "idServicio": 1,
  "servicio": "Limpieza dental",
  "idProductoInventario": 1,
  "producto": "Guantes",
  "cantidad": 2,
  "activo": true
}
```

- Errores esperados: `401`, `403`, `404`, `422`, `500`.
- Pantalla frontend: `src/views/inventario/InventarioView.vue`.
- Servicio frontend: `src/services/inventario.ts`.
- Estado actual observado: no existe, responde `404`.

### Ejecutar consumo automatico de inventario

- Metodo: `POST`.
- Ruta: `/api/citas/{id}/consumir-inventario`.
- Auth requerida: Si.
- Roles: Admin o rol autorizado para completar cita.
- Payload:

```json
{
  "confirmar": true
}
```

- Respuesta 200:

```json
{
  "message": "Consumo de inventario aplicado correctamente.",
  "movimientos": []
}
```

- Errores esperados: `404` cita no encontrada, `409` inventario ya consumido, `422` stock insuficiente, `500`.
- Servicio frontend: `src/services/inventario.ts` metodo `consumirInventarioCita`.
- Estado actual observado: no probado.

## Campos requeridos en respuestas

| Entidad | Campo | Tipo | Obligatorio | Pantalla que lo usa | Fallback frontend si falta |
|---|---|---|---|---|---|
| `DashboardResumen` | `pacientesActivos` | number | Si | Dashboard | Muestra error de contrato si endpoint falla |
| `DashboardResumen` | `citasHoy` | number | Si | Dashboard | Muestra error de contrato si endpoint falla |
| `DashboardResumen` | `ingresosHoy` | number | Si | Dashboard | Muestra `$0.00` solo si backend envia 0 |
| `DashboardResumen` | `productosBajoStock` | number | Si | Dashboard | Muestra error de contrato si endpoint falla |
| `HistorialCitaPaciente` | `servicio` | string | Si | Historial paciente | Texto del backend requerido |
| `HistorialPagoPaciente` | `folioComprobante` | string/null | No | Historial paciente | Usa `estado` |
| `ConsumoServicio` | `servicio` | string | No | Inventario | Busca nombre en catalogo de servicios |
| `ConsumoServicio` | `producto` | string | No | Inventario | Busca nombre en productos |

## Reglas de negocio requeridas

- La recuperacion por palabra clave debe validar hash o mecanismo seguro; no almacenar palabra clave en texto plano.
- La recuperacion publica debe tener rate limiting y mensajes prudentes para evitar enumeracion de usuarios.
- El consumo automatico de inventario no debe ejecutarse dos veces para la misma cita.
- La salida de inventario no debe permitir stock negativo.
- El stock debe cambiar solo por movimientos, no por edicion directa del producto.
- El comprobante interno no es CFDI, no timbra y no se envia por correo.
- Inventario debe definir si recepcionista puede consultar o gestionar; frontend actualmente restringe la ruta a admin.

## Pendientes criticos

### P0

- Implementar `POST /api/recover-password-keyword`.

### P1

- Implementar historial de citas y pagos por paciente.
- Implementar `GET /api/dashboard/resumen`.
- Implementar reglas de consumo por servicio.
- Implementar consumo automatico por cita.

### P2

- Confirmar politica backend para inventario con recepcionista.
- Estandarizar nombres de campos de error `422` para `palabraClave`, `new_password` y `new_password_confirmation`.

## Notas para backend

- No se requiere PDF, CFDI, SAT, timbrado ni envio de correos.
- Mantener comprobantes como recibos internos.
- Devolver errores JSON con `message` y `errors` para que el frontend renderice mensajes por campo.
