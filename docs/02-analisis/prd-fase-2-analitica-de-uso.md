# PRD — ExcuseMe Fase 2: Analítica de uso

10 de noviembre de 2026 · Mario · Estado: aprobado, por construir

La fase 2 agrega medición a la web para decidir con datos si vale la pena invertir en la fase 3 (WhatsApp y llamada real con Twilio).

## Objetivo y decisión

Si a los 30 días hay al menos 50 usuarios y al menos 15 hicieron una segunda llamada en otro día, se hace la fase 3; si no, se sigue mejorando la versión web.

| Elemento | Definición | Estado |
| --- | --- | --- |
| Umbral de alcance | 50 usuarios en los primeros 30 días | Decidido |
| Qué cuenta como usuario | Quien completa al menos una llamada contestada de 10 segundos o más; las visitas, las llamadas rechazadas y las más cortas no cuentan | Decidido |
| Desde cuándo corre el mes | 30 días desde la primera publicación del enlace | Decidido |
| Señal de valor | 15 usuarios (30 %) con una segunda llamada contestada en un día distinto, sin duración mínima: volver y contestar ya demuestra que le ve uso, aunque no escuche el guion | Decidido |

Hoy la web no registra nada, así que ninguna hipótesis de la fase 1 se puede confirmar ni descartar.

## Cómo se mide cada hipótesis

| Hipótesis | Cómo se mide | Qué hay que construir |
| --- | --- | --- |
| H1: la llamada simulada resulta creíble | Calificación de 1 a 5 a la pregunta "¿Te funcionó?", con opciones para tocar, sin escribir | Tarjeta de calificación |
| H2: bastan pocas excusas listas | Proporción de llamadas con excusa personalizada frente a las predefinidas | Opción Custom |
| H3: el retardo ayuda a que parezca espontánea | Reparto de llamadas por retardo elegido | Evento de selección |
| H4: se usa más de una vez | Usuarios con dos o más llamadas en días distintos | Identificador anónimo en el navegador |

El reingreso mide H4, no H1: alguien puede volver por curiosidad aunque la llamada no haya convencido a nadie.

## Alcance

**Entra**

- Registro de eventos de uso anónimos.
- Calificación de 1 a 5 después de la llamada.
- Opción Custom: el bot pide por el chat el nombre de quien llama y el texto que leerá la voz.
- Identificador anónimo guardado en el navegador para reconocer el segundo uso.
- Lanzamiento con Friends and Family y difusión de voz a voz.

**No entra**

- WhatsApp, llamadas reales y Twilio: fase 3.
- Cuentas de usuario o inicio de sesión.
- Guardar o enviar el texto de las excusas personalizadas.
- Publicidad o campañas pagadas.

## Requisitos funcionales

| ID | Requisito | Criterio de aceptación | Origen |
| --- | --- | --- | --- |
| RF-13 | Registrar el tipo de excusa elegida | Cada selección genera un evento con el tipo: Familia, Empresa, Random o Custom | Decidido |
| RF-14 | Registrar el retardo elegido | El evento de selección incluye el retardo en segundos | Decidido |
| RF-15 | Contar usuarios activos por día | Se puede consultar cuántos usuarios distintos usaron la web cada día | Decidido |
| RF-16 | Calificación "¿Te funcionó?" de 1 a 5 | Aparece al colgar una llamada contestada; se responde con un toque y se puede ignorar sin bloquear el uso | Decidido |
| RF-17 | Opción Custom | Es una cuarta opción junto a Familia, Empresa y Random; el bot pregunta por el chat quién llama y qué debe decir, el usuario responde escribiendo, y la voz lee ese texto al contestar | Decidido |
| RF-18 | Identificador anónimo en el navegador | Se crea en la primera visita con localStorage y se reutiliza en las siguientes; si no está disponible, la web funciona igual | Decidido |
| RF-19 | Registrar el desenlace de cada llamada: contestada, colgada o rechazada, y su duración | Cada llamada genera un evento al contestarla, y otro al colgarla (con la duración en segundos) o al rechazarla | Decidido |
| RF-20 | Botón para compartir la web | Abre el menú de compartir del celular con el enlace | Decidido |
| RF-21 | Un enlace distinto por canal | Cada canal usa su propia etiqueta en la dirección para saber de dónde llegó cada usuario | Decidido |
| RF-22 | Barra de escritura funcional | La barra inferior deja de ser decorativa: el usuario puede escribir y enviar mensajes, y el bot los usa para recoger los datos de la excusa Custom. Si el usuario escribe fuera del flujo Custom, el bot responde siempre con el menú de excusas | Decidido |
| RF-23 | Recordar la última excusa Custom | El nombre y el texto de la última excusa Custom se guardan en el navegador y se pueden repetir con un toque, sin escribirlos de nuevo; no salen del dispositivo (RNF-11) | Decidido |

Etiquetas de RF-21:

| Canal | Etiqueta en el enlace |
| --- | --- |
| Stories de WhatsApp | `?utm_source=whatsapp&utm_medium=story` |
| Mensaje directo de WhatsApp | `?utm_source=whatsapp&utm_medium=directo` |
| Stories de Instagram | `?utm_source=instagram&utm_medium=story` |
| Botón de compartir de la web | `?utm_source=compartir&utm_medium=boton` |

## Eventos a registrar

| Evento | Cuándo ocurre | Datos | Responde a |
| --- | --- | --- | --- |
| `visita` | Se abre la web | Identificador anónimo, si es primera visita, canal de origen | Usuarios diarios, H4 |
| `excusa_elegida` | Se toca una excusa | Tipo, retardo | H2, H3 |
| `llamada_contestada` | Se toca Contestar | Tipo de excusa | Umbral de usuarios |
| `llamada_colgada` | Se cuelga una llamada contestada | Duración en segundos, tipo de excusa, longitud del guion en caracteres, si la voz terminó de leerlo | Umbral de usuarios; análisis posterior de cuánto se escucha cada guion |
| `llamada_rechazada` | Se toca Rechazar | Tipo de excusa | Abandono |
| `calificacion` | Se toca una nota al colgar | Valor de 1 a 5, tipo de excusa | H1 |
| `compartir` | Se toca el botón de compartir | Ninguno | Voz a voz |

## Privacidad y requisitos no funcionales

Esta fase cambia el requisito RNF-02 de la fase 1, que prometía no recolectar ningún dato.

| ID | Requisito |
| --- | --- |
| RNF-10 | Los eventos no incluyen nombre, teléfono, correo ni ubicación precisa |
| RNF-11 | El nombre y el texto de una excusa Custom nunca salen del navegador |
| RNF-12 | El identificador es aleatorio y no se puede vincular con una persona |
| RNF-13 | La página informa en una línea visible qué se mide y para qué |
| RNF-14 | Si el servicio de analítica falla o está bloqueado, la web funciona igual |
| RNF-15 | La analítica es un adaptador más de la arquitectura actual, reemplazable sin tocar la lógica |

La web es estática, así que los eventos se envían a un servicio externo: Google Analytics. Como usa cookies, el aviso de RNF-13 es obligatorio.

Límites de localStorage: el identificador vale para un navegador en un dispositivo. Se pierde si el usuario borra sus datos o usa modo incógnito, y la misma persona en dos dispositivos cuenta como dos usuarios.

## Plan de lanzamiento: Friends and Family

La web se comparte primero con familiares y amigos, y crece de voz a voz desde ahí.

1. Publicar la versión con analítica y comprobar que los eventos llegan.
2. Publicar piezas tipo story con el enlace en estados de WhatsApp y en Instagram, y enviar mensajes directos a un grupo de unas 50 personas, con un mensaje corto que explique para qué sirve.
3. Pedirles que la usen en una situación real y la reenvíen a quien le pueda servir.
4. Revisar los números cada semana.
5. Al día 30, comparar contra el criterio de 50 usuarios y 15 con segunda llamada, y decidir.

La audiencia inicial es de unos 400 contactos distintos entre WhatsApp e Instagram; unas 50 de esas personas reciben además un mensaje directo. Los 50 usuarios pueden salir de los tres frentes: las stories, los mensajes directos y quienes lleguen porque alguien lo compartió.

## Riesgos y preguntas abiertas

| Riesgo | Efecto |
| --- | --- |
| Los conocidos entran por cortesía y califican con generosidad | El umbral de 50 se cumple sin que haya interés real |
| La calificación aparece justo cuando el usuario se está retirando | Pocas respuestas; H1 queda sin datos |
| Custom agrega pasos antes de la llamada | La opción más lenta puede parecer la menos querida |
| Pocos contactos pasan de ver el estado a completar una llamada | El mes termina sin datos suficientes para decidir |

No quedan preguntas abiertas. Las pruebas propias se detienen antes de empezar a compartir y el conteo corre desde la primera publicación, así que no entran en los 30 días.
