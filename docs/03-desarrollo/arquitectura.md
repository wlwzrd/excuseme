# Arquitectura y decisiones técnicas

La estructura del código está descrita en el [README principal](../../README.md). Este documento registra las decisiones y su motivo.

| Decisión | Motivo |
| --- | --- |
| React 18 con Vite | Arranque rápido para un MVP de una sola pantalla |
| Web estática, sin backend | Costo cero y nada que operar (RNF-02, RNF-03) |
| Arquitectura hexagonal (puertos y adaptadores) | La app depende de APIs del navegador (audio, voz, vibración, reloj). Aislarlas permite probar la lógica sin navegador y cambiar piezas sin tocar el resto |
| Pruebas con el ejecutor integrado de Node | Sin dependencias adicionales; corren en cada publicación |
| Caché de Vite fuera de la carpeta del proyecto | Las herramientas de sincronización (Dropbox, OneDrive) bloquean `node_modules/.vite` y rompen la compilación |
| Rutas relativas en la compilación | La web se sirve bajo `/excuseme/` en GitHub Pages |

## Qué habilita la arquitectura

- **Fase 2:** la analítica entra como un adaptador más (RNF-15), sin tocar el dominio.
- **Fase 4:** `domain/` y `application/` son JavaScript puro y se reutilizan en un backend de Node; Twilio sería otro adaptador.
