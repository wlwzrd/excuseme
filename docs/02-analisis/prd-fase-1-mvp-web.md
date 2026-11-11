# PRD — ExcuseMe Fase 1: MVP web

10 de noviembre de 2026 · Mario · Estado: publicada

ExcuseMe es una web que simula una llamada entrante para dar una excusa creíble y salir de una conversación. La fase 1 ya está publicada; este documento registra qué se construyó y por qué.

## Contexto y problema

Salir de una conversación sin una razón visible resulta incómodo: quien se quiere ir no encuentra una excusa a tiempo o teme parecer grosero. Una llamada entrante es una salida socialmente aceptada, porque nadie cuestiona a quien dice "perdón, tengo que contestar".

La idea original: abrir ExcuseMe, que alguien te llame y tener así la excusa perfecta. La fase 1 prueba esa idea con el menor costo posible, simulando la llamada en la pantalla del propio teléfono.

## Hipótesis del MVP

El MVP existe para aprender, no para escalar. Estas hipótesis son una propuesta de redacción y están por confirmar.

| # | Hipótesis | Señal que la confirma |
| --- | --- | --- |
| H1 | Una llamada simulada en pantalla basta para que los demás crean que es real | Quien la usa logra retirarse sin que le pregunten |
| H2 | El usuario prefiere elegir entre pocas excusas listas antes que escribir la suya | Usa las tres opciones sin pedir una personalizada |
| H3 | Un retardo corto permite guardar el teléfono y que la llamada parezca espontánea | El retardo más usado no es "Ahora" |
| H4 | La gente la usaría más de una vez | Vuelve a abrir la web en otra ocasión |

## Por qué web

La web permite probar la idea en horas y sin costo recurrente; las otras dos rutas exigen cuentas, aprobaciones o un backend antes de saber si la idea funciona.

| Criterio | Web estática (elegida) | App nativa | WhatsApp y llamada real con Twilio |
| --- | --- | --- | --- |
| Tiempo hasta tener algo usable | Horas | Semanas | Días a semanas |
| Costo de operación | Cero, con GitHub Pages | Cuentas de desarrollador en las tiendas | Pago por mensaje y por minuto |
| Barrera para el usuario | Abrir un enlace | Instalar una app | Guardar un número y escribirle |
| Aprobaciones de terceros | Ninguna | Revisión de las tiendas | Registro de remitente en Meta |
| Backend | No requiere | Opcional | Obligatorio, por las credenciales |
| Realismo de la llamada | Bajo: la pantalla debe estar abierta | Medio | Alto: el teléfono suena de verdad |

La web sacrifica realismo a cambio de velocidad de aprendizaje. La fase 2 mide las hipótesis; si se confirman, el realismo se compra en la fase 3.

## Usuario objetivo y casos de uso

El usuario es un adulto con celular que está en una conversación presencial de la que quiere salir sin incomodar. Este perfil es una propuesta: falta validarlo con usuarios reales.

- **Reunión que se alarga:** programa la llamada con retardo, deja el teléfono sobre la mesa y contesta "al jefe".
- **Compromiso social:** una visita o un encuentro que no termina; contesta "a la familia".
- **Conversación con un desconocido insistente:** necesita una salida inmediata, sin retardo.

## Alcance

**Objetivos**

- Entregar una excusa creíble en menos de 30 segundos desde que se abre la web.
- Funcionar en el navegador del celular sin instalación ni registro.
- Operar sin costo y sin recolectar datos personales.

**No-objetivos de la fase 1**

- Que el teléfono suene con la pantalla apagada o la web cerrada.
- Llamadas o mensajes reales por la red telefónica o por WhatsApp.
- Excusas, nombres o guiones personalizados por el usuario.
- Cuentas de usuario, historial entre sesiones o analítica.
- Otros idiomas distintos del español.

## Flujo del usuario

1. Abre la web y ve un chat con el mensaje de bienvenida y el menú de excusas.
2. Elige el retardo: Ahora, 5 s, 10 s o 30 s. Por defecto, 5 s.
3. Toca una excusa: Familia, Empresa o Random. El chat confirma la elección.
4. Si hay retardo, ve una cuenta regresiva y puede dejar el teléfono sobre la mesa.
5. Aparece la pantalla de llamada entrante, con tono y vibración.
6. Decide:
   - **Contestar:** una voz lee el guion de la excusa y corre un cronómetro. Puede silenciar la voz o colgar.
   - **Rechazar:** la llamada termina de inmediato.
7. Vuelve al chat, que registra el resultado y la duración, y ofrece el menú otra vez.

## Requisitos funcionales

Los doce requisitos están implementados en la versión publicada. Los criterios marcados como probados tienen prueba automatizada; el audio y la vibración no se han verificado en dispositivos reales.

| ID | Requisito | Criterio de aceptación | Verificación |
| --- | --- | --- | --- |
| RF-01 | Chat de bienvenida con apariencia de mensajería en modo oscuro | Al cargar se ve un mensaje de bienvenida y el menú de excusas | Probado |
| RF-02 | Menú con tres excusas: Familia, Empresa y Random | Cada opción muestra título, subtítulo y botón "Llamar" | Probado |
| RF-03 | Selector de retardo: Ahora, 5 s, 10 s, 30 s | Arranca en 5 s; no acepta otros valores | Probado |
| RF-04 | Registro de la elección en el chat | Aparecen el mensaje del usuario y la confirmación; el menú anterior se oculta | Probado |
| RF-05 | Cuenta regresiva visible cuando hay retardo | Baja de uno en uno cada segundo hasta que suena la llamada | Probado |
| RF-06 | Pantalla de llamada entrante | Muestra nombre y número de quien llama, y los botones Contestar y Rechazar | Probado |
| RF-07 | Tono de llamada y vibración mientras suena | El tono se repite cada 3 s; ambos se detienen al contestar o rechazar | Lógica probada; sonido sin verificar en dispositivo |
| RF-08 | Voz que lee el guion al contestar | Lee el guion completo en español, con preferencia por voces de Colombia y Latinoamérica | Lógica probada; voz sin verificar en dispositivo |
| RF-09 | Cronómetro de la llamada en curso | Avanza cada segundo en formato mm:ss | Probado |
| RF-10 | Silenciar y reanudar la voz | Pausa y reanuda la lectura; se reinicia al colgar | Probado |
| RF-11 | Registro de fin de llamada | El chat indica si fue rechazada o terminada, con la duración, y ofrece el menú de nuevo | Probado |
| RF-12 | Una sola llamada a la vez | Mientras hay una llamada programada o activa, no se puede iniciar otra | Probado |

## Requisitos no funcionales

| ID | Categoría | Requisito |
| --- | --- | --- |
| RNF-01 | Acceso | Funciona desde un enlace, sin instalación, registro ni inicio de sesión |
| RNF-02 | Privacidad | No recolecta ni envía datos del usuario; no tiene backend |
| RNF-03 | Costo | Operación sin costo: alojamiento estático en GitHub Pages |
| RNF-04 | Compatibilidad | Navegadores con Web Speech API y Web Audio API: Chrome, Edge, Safari o Brave |
| RNF-05 | Diseño | Pensado para pantalla de celular; en escritorio se muestra como columna centrada |
| RNF-06 | Despliegue | Cada cambio en la rama principal ejecuta las pruebas, compila y publica automáticamente |
| RNF-07 | Calidad | La lógica de la llamada tiene 21 pruebas automatizadas que corren sin navegador |
| RNF-08 | Mantenibilidad | Arquitectura hexagonal: tono, voz, vibración y reloj son adaptadores reemplazables |
| RNF-09 | Idioma | Interfaz y guiones en español |

## Métricas de éxito

Hoy no se puede medir nada: la web no tiene analítica, por diseño (RNF-02). Validar las hipótesis exige elegir entre medir a mano o agregar una analítica sin datos personales.

| Métrica | Hipótesis | Cómo medirla hoy | Meta |
| --- | --- | --- | --- |
| Personas que logran retirarse usando la llamada | H1 | Prueba con 5 a 10 conocidos y entrevista posterior | Por definir |
| Reparto de uso entre las tres excusas | H2 | Requiere analítica | Por definir |
| Retardo más elegido | H3 | Requiere analítica | Por definir |
| Personas que la usan una segunda vez | H4 | Entrevista a las dos semanas | Por definir |

## Limitaciones conocidas y riesgos

| Limitación o riesgo | Efecto | Qué hacer |
| --- | --- | --- |
| El teléfono no suena de verdad: la web debe estar abierta y la pantalla encendida | Es la mayor amenaza para H1 | Motivo principal de la fase 3 |
| Los navegadores bloquean el audio hasta que el usuario toca la página | Con retardo funciona, porque el toque ya ocurrió; conviene confirmarlo en iPhone | Probar en dispositivos reales |
| La voz depende de las voces instaladas en cada dispositivo | Puede sonar robótica o con acento de España | Fase 3: voz generada en servidor |
| Guiones fijos y nombres genéricos ("Mamá (Urgente)") | Menos creíble para quien conoce al usuario | Fase 2: opción Custom |
| La barra para escribir es decorativa | Puede confundir: parece un chat, pero no acepta texto | Quitarla o activarla |
| Los estilos se cargan desde internet | Sin conexión, la página se ve sin formato | Empaquetar los estilos en la compilación |
| Apariencia e ícono tomados de WhatsApp | Posible reclamo de marca si el producto crece | Revisar antes de promocionarlo |
| Uso para engañar en contextos serios | Riesgo de reputación | Mantener el tono de humor y las excusas inofensivas |

## Preguntas abiertas

Las preguntas sobre hipótesis, metas y analítica se resolvieron en el [PRD de la fase 2](prd-fase-2-analitica-de-uso.md). Quedan dos:

- [ ] ¿El perfil de usuario propuesto coincide con quién la usaría de verdad?
- [ ] ¿La barra de escritura decorativa se quita o se convierte en función?
