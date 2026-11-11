# PRD — ExcuseMe Fase 3: WhatsApp y llamada real con Twilio

10 de noviembre de 2026 · Mario · Estado: en espera; depende de los resultados de la fase 2 (analítica de uso)

Este PRD está incompleto a propósito. Solo recoge el contexto y las restricciones ya investigadas; el resto se escribe si la fase 2 cumple su criterio de decisión.

## Contexto

ExcuseMe hoy simula una llamada dentro del navegador: el usuario abre la web, elige una excusa y ve una pantalla de llamada entrante con tono y voz sintetizada. El teléfono no suena de verdad.

| Aspecto | Fase 1 (publicada) |
| --- | --- |
| Dónde vive | Web estática en [wlwzrd.github.io/excuseme](https://wlwzrd.github.io/excuseme/) |
| Excusas | Familia, Empresa, Random, con guion fijo |
| Retardo | Ahora, 5 s, 10 s o 30 s |
| Llamada | Simulada en pantalla; tono y voz del navegador |
| Backend | Ninguno |
| Código | [github.com/wlwzrd/excuseme](https://github.com/wlwzrd/excuseme), arquitectura hexagonal con 21 pruebas |

La fase 3 propone que la excusa llegue por canales reales: un bot de WhatsApp para pedirla y una llamada verdadera al celular, ambos con Twilio.

## Dependencias y restricciones de Twilio y Meta

La ruta más simple es WhatsApp para el chat y una llamada telefónica normal; la llamada dentro de WhatsApp tiene requisitos que una cuenta nueva no cumple.

| Producto | Uso en ExcuseMe | Restricciones conocidas |
| --- | --- | --- |
| Programmable Messaging (WhatsApp) | Bot que recibe el pedido y muestra el menú de excusas | Requiere un número registrado como remitente de WhatsApp; se paga la tarifa de Meta más un cargo de Twilio |
| Programmable Voice | Llamada real al celular con voz que lee el guion | Cobro por minuto; hace falta un número de origen |
| [WhatsApp Business Calling](https://www.twilio.com/docs/voice/whatsapp-business-calling) | Llamada que entra por WhatsApp | Permiso explícito del usuario antes de llamar; límite mínimo de 2.000 conversaciones iniciadas por la empresa cada 24 h; la llamada aparece a nombre de la empresa |

- Las credenciales de Twilio no pueden estar en el navegador: la fase 3 necesita un backend, y GitHub Pages solo sirve archivos estáticos.
- Las llamadas salientes por WhatsApp no están disponibles para remitentes de EE. UU., Canadá, Egipto, Nigeria y Turquía; Colombia no está excluida.
- Las tarifas de Meta cambian cada trimestre; hay que confirmarlas en la página de precios de Twilio antes de estimar costos.
- Por confirmar: si el Sandbox de WhatsApp de Twilio alcanza para el prototipo sin registrar una empresa en Meta.

## Secciones pendientes

Problema y oportunidad, usuarios objetivo, objetivos y métricas, solución propuesta, requisitos funcionales y no funcionales, riesgos y plan de lanzamiento.
