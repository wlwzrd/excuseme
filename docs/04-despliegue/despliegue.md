# Despliegue

## Publicación técnica

La web se publica en GitHub Pages: <https://wlwzrd.github.io/excuseme/>

Cada cambio en la rama `main` dispara el flujo `.github/workflows/deploy.yml`, que:

1. Instala las dependencias (`npm ci`).
2. Ejecuta las pruebas (`npm test`). Si fallan, no se publica.
3. Compila con Vite (`npm run build`).
4. Publica la carpeta `dist/` en GitHub Pages.

## Lanzamiento a usuarios

El plan de lanzamiento de cada fase vive en su PRD. El de la fase 2 (Friends and Family, con enlaces etiquetados por canal) está en el [PRD de la fase 2](../02-analisis/prd-fase-2-analitica-de-uso.md#plan-de-lanzamiento-friends-and-family).
