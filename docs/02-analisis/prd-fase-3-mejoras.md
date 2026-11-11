# PRD — ExcuseMe Fase 3: Mejoras

11 de noviembre de 2026 · Mario · Estado: aprobado, por detallar. Fecha objetivo: 11 de diciembre de 2026

La fase 3 agrega la excusa personalizada y el consentimiento de cookies. Se publica cuando termine el experimento de la [fase 2](prd-fase-2-analitica-de-uso.md), para no cambiar el producto mientras se mide.

## Por qué después del experimento

El criterio de decisión de la fase 2 se mide del 11 de noviembre al 11 de diciembre de 2026. Publicar estas mejoras antes cambiaría dos cosas a la vez:

- **Custom** puede aumentar el segundo uso, y no se sabría si el resultado se debe a la idea o a la función nueva.
- **El banner de consentimiento** deja de medir a quien no acepta, así que los conteos bajarían aunque el uso fuera el mismo.

La fase se construye y se prueba durante el experimento, y se publica al cerrarlo.

## Requisitos funcionales

| ID | Requisito | Criterio de aceptación | Origen |
| --- | --- | --- | --- |
| RF-17 | Opción Custom | Es una cuarta opción junto a Familia, Empresa y Random; el bot pregunta por el chat quién llama y qué debe decir, el usuario responde escribiendo, y la voz lee ese texto al contestar | Decidido |
| RF-22 | Barra de escritura funcional | La barra inferior deja de ser decorativa: el usuario puede escribir y enviar mensajes, y el bot los usa para recoger los datos de la excusa Custom. Si el usuario escribe fuera del flujo Custom, el bot responde siempre con el menú de excusas | Decidido |
| RF-23 | Recordar la última excusa Custom | El nombre y el texto de la última excusa Custom se guardan en el navegador y se pueden repetir con un toque, sin escribirlos de nuevo | Decidido |
| RF-26 | Banner de consentimiento de cookies | En la primera visita se pregunta si se acepta la medición. Mientras no se acepte, no se envían eventos a Google Analytics | Decidido |
| RF-27 | Preferencias de cookies | El menú incluye una opción para cambiar la decisión en cualquier momento | Propuesta |

## Requisitos no funcionales

| ID | Requisito |
| --- | --- |
| RNF-11 | El nombre y el texto de una excusa Custom nunca salen del navegador; a la analítica solo llega la longitud del guion |
| RNF-17 | La app funciona igual si el usuario rechaza la medición |

## Qué permite medir

H2 (si bastan pocas excusas listas) se mide con la proporción de llamadas de tipo Custom frente a las predefinidas. Es la única hipótesis sin datos después de la fase 2.

## Riesgos

| Riesgo | Efecto |
| --- | --- |
| Custom agrega pasos antes de la llamada | La opción más lenta puede parecer la menos querida |
| Parte de los usuarios rechaza la medición | Los conteos posteriores al banner no son comparables con los del experimento |
| Texto libre leído en voz alta | Alguien puede escribir contenido ofensivo; solo lo oye quien lo escribió |

## Por detallar

- [ ] Guion de la conversación del flujo Custom: qué pregunta el bot, en qué orden y cómo se cancela.
- [ ] Límites de longitud del nombre y del texto.
- [ ] Dónde aparece la excusa recordada y cómo se cambia.
- [ ] Texto y opciones del banner de consentimiento.
- [ ] Eventos nuevos, por ejemplo cuántos empiezan el flujo Custom y lo abandonan.
