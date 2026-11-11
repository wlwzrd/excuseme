# Analítica de uso: cómo está implementada

Implementa la entrega 1 del [PRD de la fase 2](../02-analisis/prd-fase-2-analitica-de-uso.md). El servicio es Google Analytics 4; el ID de medición está en `src/config.js`.

## Dónde vive en el código

| Pieza | Archivo | Requisito |
| --- | --- | --- |
| Puerto `Analytics` y nombres de eventos | `src/application/ports.js`, `src/application/events.js` | RNF-15 |
| Adaptador de Google Analytics | `src/infrastructure/googleAnalytics.js` | RF-13 a RF-15, RNF-14 |
| Memoria anónima del visitante | `src/infrastructure/localVisitorStore.js` | RF-18, RNF-12 |
| Canal de origen (etiquetas UTM) | `src/infrastructure/campaign.js` | RF-21 |
| Botón de compartir | `src/infrastructure/webSharer.js`, `src/ui/components/Header.jsx` | RF-20 |
| Calificación "¿Te funcionó?" | `src/ui/components/RatingCard.jsx` | RF-16 |
| Aviso de medición | `src/ui/components/InputBar.jsx` | RNF-13 |

## Eventos y parámetros

| Evento | Parámetros |
| --- | --- |
| `visita` | `primera_visita` (sí/no), `canal` (por ejemplo `whatsapp/story`, o `sin_etiqueta`) |
| `excusa_elegida` | `tipo`, `retardo` (segundos) |
| `llamada_contestada` | `tipo`, `dia_de_uso` (en cuántos días distintos ha contestado este visitante) |
| `llamada_colgada` | `tipo`, `duracion` (segundos), `longitud_guion` (caracteres), `guion_completo` (sí/no), `valida` (sí si duró 10 s o más) |
| `llamada_rechazada` | `tipo` |
| `calificacion` | `valor` (1 a 5), `tipo` |
| `compartir` | Ninguno |

## Cómo leer el criterio de decisión

- **Usuarios:** usuarios con al menos un evento `llamada_colgada` con `valida` = sí.
- **Segundo uso:** usuarios con al menos un evento `llamada_contestada` con `dia_de_uso` de 2 o más.

## Configuración pendiente en Google Analytics

Para que los parámetros aparezcan en los informes hay que registrarlos como definiciones personalizadas en la propiedad (Administrar → Definiciones personalizadas):

- Dimensiones de evento: `tipo`, `canal`, `primera_visita`, `guion_completo`, `valida`
- Métricas de evento: `retardo`, `duracion`, `longitud_guion`, `valor`, `dia_de_uso`

## Decisiones

- **No se mide en desarrollo local** (`localhost` o el archivo abierto directamente), para que las pruebas no cuenten.
- **El identificador anónimo no se envía a Google.** Solo se usa en el navegador para saber si es la primera visita y en cuántos días distintos se ha usado; Google Analytics cuenta usuarios con su propio identificador.
- **Si Google Analytics falla o está bloqueado**, la app funciona igual: ningún caso de uso depende de la analítica.
