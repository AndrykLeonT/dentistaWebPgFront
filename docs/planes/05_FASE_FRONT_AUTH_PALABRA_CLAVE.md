Actúa como agente de desarrollo dentro del proyecto FRONTEND Vue de DentalSys usando Codex.

FASE: 05 - Frontend Auth: recuperación/cambio de contraseña por palabra clave

IMPORTANTE:
Estás trabajando SOLO en el frontend.
NO modifiques backend.
NO crees migraciones.
NO edites controladores Laravel.
NO edites modelos Laravel.
NO edites seeders Laravel.
NO edites base de datos directamente.

Si detectas que falta un endpoint, que el endpoint responde distinto, o que el backend requiere cambios, repórtalo en la documentación como “pendiente backend” y detente en esa parte. No intentes corregir el backend desde este proyecto.

OBJETIVO DE ESTA FASE:
Actualizar el flujo frontend de recuperación de contraseña para que use palabra clave en lugar de correo.

El flujo ya NO debe prometer:
- envío de correo
- recuperación por email
- enlaces de recuperación
- códigos enviados por correo

El flujo correcto será:
- usuario/correo
- palabra clave
- nueva contraseña
- confirmación de nueva contraseña

CONTEXTO:
Actualmente `ForgotPasswordView.vue` muestra una funcionalidad pendiente o no disponible. El documento de pendientes menciona recuperación por correo, pero esa funcionalidad queda descartada. La recuperación será por palabra clave.

El backend está separado del frontend. Según el usuario, la base de datos ya tiene atributo de palabra clave. Tu tarea es adaptar el frontend para consumir el endpoint correspondiente, si existe.

USUARIOS TEST DISPONIBLES:
Puedes usar estas cuentas para probar login y recuperación si el backend lo permite:

Admin:
- usuario/correo: `test.admin@dentalsys.local`
- password: `TestAdmin123!`

Recepcionista:
- usuario/correo: `test.recepcionista@dentalsys.local`
- password: `TestRecep123!`

Dentista:
- usuario/correo: `test.dentista@dentalsys.local`
- password: `TestDentista123!`

Si el frontend actual usa `usuario` y `contraseña` para login, respeta ese contrato porque ya fue validado en fases anteriores.
No rompas el login normal.

MÓDULOS QUE NO DEBES MODIFICAR:
No modifiques estos módulos:
- Pacientes
- Pagos
- Cortes
- Comprobantes
- Inventario
- Agenda / Citas
- Servicios
- Usuarios / Empleados
- Dashboard
- Recetas

Puedes leerlos solo si necesitas confirmar patrones de manejo de errores o estilos visuales, pero no cambies su lógica.

ARCHIVOS PROBABLES A REVISAR:
- `src/views/auth/ForgotPasswordView.vue`
- `src/views/auth/LoginView.vue`, solo lectura salvo ajuste mínimo de navegación
- `src/services/auth.ts`
- `src/stores/auth.ts`, solo si estrictamente necesario
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si existe
- `src/services/api.ts`, solo lectura salvo bug crítico
- `src/router/index.ts`, solo si la ruta de recuperación está mal configurada

ARCHIVOS QUE PUEDES MODIFICAR:
- `src/views/auth/ForgotPasswordView.vue`
- `src/services/auth.ts`
- `src/types/index.ts`
- `src/composables/useApiError.ts`, si se necesita reutilizar errores 422
- documentación en `docs/`

NO MODIFICAR:
- Backend
- Archivos Laravel
- Base de datos
- Módulos ajenos al auth frontend

REGLAS DE CALIDAD:
- No usar `any`.
- No usar `@ts-ignore`.
- No usar `eslint-disable`.
- No agregar mocks.
- No dejar `console.log`.
- No dejar TODOs nuevos sin documentar.
- No simular éxito si la API falla.
- No decir que se envió un correo.
- No mencionar recuperación por email.
- Usar Axios centralizado.
- Tipar payloads, respuestas y errores.
- Mantener Vue 3 Composition API.
- Mantener el estilo visual existente.

CONTRATO FRONTEND ESPERADO:
El formulario debe enviar al backend un payload equivalente a:

{
  "usuario": "test.admin@dentalsys.local",
  "palabraClave": "valor-capturado",
  "new_password": "NuevaPassword123!",
  "new_password_confirmation": "NuevaPassword123!"
}

Si el backend espera otros nombres reales, como:
- `correoElectronico`
- `palabra_clave`
- `palabraClave`
- `clave`
- `password`
- `password_confirmation`

entonces adapta el frontend al contrato real observado, pero documenta claramente la diferencia.

ENDPOINT:
Primero inspecciona si ya existe algún endpoint usado/documentado en el frontend o en documentación local.

Posibles nombres a probar, solo si no hay documentación clara:
- `POST /api/recover-password-keyword`
- `POST /api/recuperar-password-palabra-clave`
- `POST /api/reset-password-keyword`
- `POST /api/forgot-password-keyword`
- `POST /api/recuperar-password`

No inventes endpoint definitivo sin comprobarlo.

Si ningún endpoint existe o todos responden 404:
- No dejes el formulario como funcional.
- Deja la vista preparada, pero muestra estado claro: “Funcionalidad pendiente de endpoint backend”.
- Documenta el endpoint requerido para backend.
- No simules recuperación.

MANEJO DE ERRORES ESPERADO:
- 200:
  - Mostrar éxito.
  - Permitir volver a login.
- 401:
  - Palabra clave incorrecta o usuario inválido, si el backend usa 401.
  - Mostrar error claro sin cerrar formulario.
- 404:
  - Si endpoint no existe, documentar pendiente backend.
  - Si usuario no existe, mostrar mensaje prudente.
- 422:
  - Mostrar errores por campo.
  - Campos esperados:
    - usuario
    - palabraClave
    - new_password
    - new_password_confirmation
- 500+:
  - Mostrar error general.
  - No mostrar éxito.

FASE 05.1 - REVISIÓN INICIAL

Antes de modificar, ejecuta:

git status --short --branch
git log --oneline -5
npm run type-check
npx eslint . --no-cache
npm run build

Revisa:
- `docs/modulos/01-auth-seguridad.md`
- `docs/modulos/00-plan-restante.md`
- `docs/INDICE.md`, si existe
- `src/views/auth/ForgotPasswordView.vue`
- `src/services/auth.ts`
- `src/router/index.ts`

Documenta el estado inicial.

FASE 05.2 - VALIDACIÓN DE BACKEND DESDE FRONTEND

Detecta `VITE_API_URL` desde `.env`.

Prueba conectividad básica:

curl -i http://localhost:8000/api
curl -i http://dentistawebpg.test/api

Si `/api` da 404 pero Laravel responde, no lo tomes como backend caído.

Prueba login normal con un usuario TEST para confirmar que el backend está accesible:

- `test.admin@dentalsys.local`
- `TestAdmin123!`

Usa el contrato real de login ya funcional en el frontend:
- si usa `usuario`, usa `usuario`
- si usa `correoElectronico`, usa `correoElectronico`

No cambies login si ya funciona.

FASE 05.3 - IDENTIFICAR ENDPOINT REAL DE PALABRA CLAVE

Busca en el frontend y documentación:
- `palabra`
- `clave`
- `keyword`
- `recover`
- `recuperar`
- `forgot`
- `reset-password`

Revisa si `src/services/auth.ts` ya tiene método relacionado.

Si hay documentación local del endpoint, úsala.

Si no hay documentación, puedes probar endpoints candidatos con payload controlado.

Payload de prueba:

{
  "usuario": "test.admin@dentalsys.local",
  "palabraClave": "valor-de-prueba",
  "new_password": "TempPassword123!",
  "new_password_confirmation": "TempPassword123!"
}

IMPORTANTE:
No dejes cambiada la contraseña del usuario TEST a un valor desconocido.
Si haces una prueba exitosa que cambia la contraseña, restáurala a `TestAdmin123!` usando el mismo flujo o reporta claramente que no fue posible.

Si ningún endpoint existe:
- Documenta “pendiente backend”.
- No rompas la vista.
- Prepara el frontend de forma segura solo si es útil, pero sin decir que funciona.

FASE 05.4 - SERVICIO AUTH

Revisa `src/services/auth.ts`.

Agrega un método tipado si el endpoint existe o si se va a dejar preparado claramente.

Nombre sugerido:
- `recoverPasswordByKeyword`
o
- `resetPasswordWithKeyword`

Payload sugerido en TypeScript:
- `usuario: string`
- `palabraClave: string`
- `new_password: string`
- `new_password_confirmation: string`

Respuesta sugerida:
- `message: string`

Reglas:
- Usar Axios centralizado.
- No hacer request directo en la vista.
- No modificar login normal.
- No modificar logout.
- No modificar change-password autenticado salvo que sea necesario por tipo compartido.

FASE 05.5 - VISTA ForgotPasswordView

Actualizar `ForgotPasswordView.vue`.

Debe dejar de ser una vista de correo.

Debe mostrar un formulario con:
1. Usuario o correo.
2. Palabra clave.
3. Nueva contraseña.
4. Confirmar nueva contraseña.

Textos sugeridos:
- Título: “Recuperar contraseña”
- Descripción: “Ingresa tu usuario, palabra clave y una nueva contraseña.”
- Botón: “Actualizar contraseña”
- Éxito: “Contraseña actualizada correctamente. Ahora puedes iniciar sesión.”
- Link/botón: “Volver al inicio de sesión”

No usar:
- “Te enviaremos un correo”
- “Revisa tu email”
- “Código enviado”
- “Link de recuperación”
- “Correo automático”

Validaciones frontend:
- usuario requerido
- palabra clave requerida
- nueva contraseña requerida
- confirmación requerida
- nueva contraseña y confirmación deben coincidir

UX:
- loading al enviar
- botón deshabilitado mientras envía
- errores por campo
- error general si API falla
- no cerrar/limpiar formulario si falla
- mostrar éxito solo si API responde éxito

Si no existe endpoint backend:
- Mostrar mensaje claro:
  “La recuperación por palabra clave está pendiente de endpoint backend.”
- Mantener el formulario deshabilitado o no enviarlo.
- Documentar qué endpoint necesita backend.

FASE 05.6 - TIPOS Y ERRORES

Revisa `src/types/index.ts`.

Agrega tipos si es necesario:
- `RecoverPasswordKeywordPayload`
- `RecoverPasswordKeywordResponse`

Si ya existe un patrón de tipos por servicio, úsalo.

Revisa `useApiError`, si existe:
- Debe poder mapear errores 422 por campo.
- Debe manejar error general.
- No debe convertir errores en éxito.

FASE 05.7 - PRUEBAS FUNCIONALES

Si existe endpoint real y funciona:

1. Abrir vista “Olvidé mi contraseña”.
2. Enviar formulario vacío.
3. Validar errores frontend.
4. Enviar confirmación distinta.
5. Validar error frontend.
6. Enviar palabra clave incorrecta.
7. Validar error backend.
8. Enviar palabra clave correcta.
9. Confirmar éxito.
10. Probar login con nueva contraseña.
11. Restaurar contraseña TEST original.
12. Confirmar login con contraseña original.

Si no existe endpoint:
1. Confirmar que la vista no promete correo.
2. Confirmar que la vista no simula éxito.
3. Confirmar que queda documentado el pendiente backend.

FASE 05.8 - DOCUMENTACIÓN OBLIGATORIA

Crea o actualiza:

`docs/modulos/05-auth-palabra-clave.md`

Debe contener:

# Fase 05 - Frontend Auth por palabra clave

## Objetivo
Explicar que se reemplazó recuperación por correo por recuperación mediante palabra clave en frontend.

## Alcance
Qué se tocó y qué no se tocó.

Debe decir explícitamente:
- Solo se trabajó frontend.
- No se modificó backend.
- No se modificó base de datos.
- No se implementaron correos.
- No se implementó recuperación por email.
- No se implementaron PDFs.
- No se implementó facturación.
- No se tocaron pacientes, pagos, inventario, agenda ni servicios.

## Contexto inicial
- Rama.
- Commit.
- Backend disponible: Sí/No.
- Endpoint encontrado: Sí/No.
- Endpoint usado, si existe.
- Estado anterior de `ForgotPasswordView.vue`.

## Archivos revisados
Lista.

## Archivos modificados
Lista y motivo.

## Contrato frontend/backend observado
Tabla:
- Endpoint.
- Método.
- Payload.
- Respuesta esperada.
- Errores esperados.
- Estado: validado / pendiente backend.

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
- Servicio auth.
- ForgotPasswordView.
- Tipos.
- Manejo de errores.
- Estados de UI.

## Cómo funciona ahora
Si el endpoint existe:
1. Usuario ingresa usuario.
2. Ingresa palabra clave.
3. Ingresa nueva contraseña.
4. Frontend llama endpoint.
5. Backend valida.
6. Usuario vuelve a login.

Si el endpoint NO existe:
1. Vista ya no promete correo.
2. Se documenta endpoint requerido.
3. La funcionalidad queda bloqueada por backend.

## Manejo de errores
- palabra clave incorrecta
- usuario inexistente/inactivo
- confirmación incorrecta
- contraseña inválida
- endpoint no existe
- backend caído

## Pruebas ejecutadas
Tabla:
- Prueba.
- Payload.
- Resultado.
- Estado.

## Riesgos
Ejemplo:
- Endpoint no encontrado.
- Contrato del backend no confirmado.
- Palabra clave débil.
- Flujo público requiere rate limiting en backend.

## Estado final
Uno:
- Completa.
- Parcial.
- Bloqueada.

## Pendientes
Separar:
- Pendientes frontend.
- Pendientes backend.

También actualiza:
- `docs/INDICE.md`, si existe.

FASE 05.9 - VALIDACIÓN FINAL

Ejecuta:

npm run type-check
npx eslint . --no-cache
npm run build

Si existe:
npm run build-only

Criterios de aceptación:
1. `ForgotPasswordView.vue` ya no promete recuperación por correo.
2. No se mencionan correos automáticos.
3. No se simula envío.
4. Formulario por palabra clave existe o queda bloqueado claramente por falta de endpoint.
5. Si endpoint existe, el servicio auth lo consume.
6. Si endpoint no existe, se documenta como pendiente backend.
7. No se modificó backend.
8. No se modificaron módulos fuera de auth.
9. Type-check pasa.
10. ESLint pasa.
11. Build pasa.
12. Documentación actualizada.

RESPUESTA FINAL ESPERADA:

Al terminar, responde con:

1. Estado de la fase: Completa / Parcial / Bloqueada.
2. Rama y commit final.
3. Backend disponible: Sí/No.
4. Endpoint de palabra clave encontrado: Sí/No.
5. Endpoint usado, si aplica.
6. Archivos modificados.
7. Documentos creados/actualizados.
8. Métodos agregados.
9. Métodos modificados.
10. Métodos eliminados.
11. Resultado de pruebas:
    - type-check
    - eslint
    - build
    - build-only, si aplica
12. Resultado funcional:
    - vista de recuperación
    - payload enviado
    - errores 422
    - palabra clave incorrecta
    - éxito, si se pudo probar
13. Pendientes frontend.
14. Pendientes backend, si existen.
15. Confirmación de que no se tocaron backend ni módulos ajenos.