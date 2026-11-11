# Documentación de producto

ExcuseMe se construye simulando el ciclo completo de un producto. Cada carpeta corresponde a una etapa.

| Etapa | Carpeta | Qué contiene |
| --- | --- | --- |
| 1. Ideación | [01-ideacion](01-ideacion/idea.md) | La idea original y el problema |
| 2. Análisis | [02-analisis](02-analisis/) | Un PRD por fase |
| 3. Desarrollo | [03-desarrollo](03-desarrollo/arquitectura.md) | Arquitectura y decisiones técnicas |
| 4. Despliegue | [04-despliegue](04-despliegue/despliegue.md) | Cómo se publica y cómo se lanza |
| 5. Valor | [05-valor](05-valor/README.md) | Resultados medidos y decisión de la siguiente fase |

## Estado de las fases

| Fase | PRD | Estado |
| --- | --- | --- |
| 1. MVP web | [prd-fase-1-mvp-web.md](02-analisis/prd-fase-1-mvp-web.md) | Publicada |
| 2. Analítica de uso | [prd-fase-2-analitica-de-uso.md](02-analisis/prd-fase-2-analitica-de-uso.md) | PRD aprobado, por construir |
| 3. WhatsApp y llamada real con Twilio | [prd-fase-3-whatsapp-twilio.md](02-analisis/prd-fase-3-whatsapp-twilio.md) | En espera de los resultados de la fase 2 |

## Cómo se mantienen estos documentos

Los PRDs se redactan y discuten fuera del repositorio. Aquí se guarda la versión aprobada de cada fase, como una foto: si un PRD cambia después, se actualiza con un commit que explique el cambio.

Los requisitos tienen identificador (`RF-01`, `RNF-02`). Los commits y pull requests que implementan un requisito lo citan en su mensaje.
