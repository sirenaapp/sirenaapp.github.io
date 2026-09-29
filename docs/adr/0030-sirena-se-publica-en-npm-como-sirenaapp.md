# 30. Sirena se publica en npm como `sirenaapp`

Fecha: 2026-09-28 · Estado: aceptado

## Contexto

Para que eXeLearning lleve Sirena dentro ([ADR 29](0029-dentro-de-exelearning-sirena-devuelve-el-diagrama-al-editor-como-edicuatex.md))
tiene que poder instalarla como el resto de sus dependencias. Así lleva
Edicuatex: fija una versión del paquete de npm en su `package.json` y un script
copia sus archivos en `public/app/common/edicuatex`. Actualizar es cambiar el
número de versión.

## Decisión

Sirena se publica en npm con el nombre `sirenaapp`, el mismo de la organización
de GitHub. El nombre `sirena` está ocupado por un paquete ajeno.

- **Contenido.** El paquete es la web tal como se sirve, sin construir nada y
  sin Mermaid: `index.html`, `favicon.svg`, `css`, `js`, `lang`,
  `vendor/lucide` (los iconos), las dos licencias y el README. Quedan fuera
  `vendor/mermaid`, `docs`, `scripts` y `.github`. La lista está en `files` de
  `package.json`.
- **Sin Mermaid (desde la 2.0.0).** El paquete es para programas que ya tienen
  su Mermaid, como eXe, que quiere una sola versión para editar, previsualizar y
  exportar (revisión de Ernesto Serrano al PR #2482 de eXe, 29-09-2026). Sirena
  carga su Mermaid solo si hace falta: en la web, siempre; dentro de eXe, solo
  si no está el de eXe, y en el paquete no lo encuentra y avisa en el recuadro
  de error. Hasta la 1.0.10 el paquete lo llevaba y `sirena.js` lo cargaba
  siempre al empezar, también dentro de eXe, aunque dibujara con el de eXe.
- **Licencia.** `AGPL-3.0-or-later`, como el resto de proyectos del autor. Cada
  archivo de código lo indica en su primera línea con
  `SPDX-License-Identifier`, y los contenidos (textos, ejemplos y
  documentación) van con CC BY-SA 4.0 en `LICENSE-CONTENIDOS`.
- **Versiones.** Se numeran con versionado semántico, empezando por la 1.0.0,
  y cada una se marca con una etiqueta `vX.Y.Z` que no se mueve ni se reutiliza.
- **Publicación.** Subir una etiqueta `vX.Y.Z` lanza
  `.github/workflows/publish.yml`, que comprueba que la versión coincide con la
  etiqueta y que el paquete lleva lo que tiene que llevar, y publica. npm confía
  en ese flujo por OIDC («publicador de confianza»), con el entorno `npm` del
  repositorio: no hay ningún token guardado. La primera versión se publica a
  mano, porque la confianza se configura en npm sobre un paquete que ya existe;
  por eso el flujo no falla si la versión ya está publicada.

## Alternativas descartadas

- **Dos paquetes, con Mermaid y sin él.** Su único usuario es eXe, que no lo
  necesita, y habría que publicar y mantener los dos a la vez.
- **Nombres como `sirena-mermaid` o `@sirenaapp/sirena`.** `sirenaapp` coincide
  con la organización y con la web, y no obliga a crear un ámbito en npm.
- **Que eXe copie Sirena desde GitHub.** eXe ya resuelve sus dependencias con
  npm y fija versiones; un caso aparte le obligaría a mantener otro mecanismo.
- **Publicar con un token guardado en el repositorio.** Es lo que evita el
  publicador de confianza, igual que en Edicuatex.

## Consecuencias

- Una versión publicada en npm no se puede sustituir: cada cambio que tenga que
  llegar a eXe necesita una versión nueva y su etiqueta.
- El paquete pesa 687 KB descomprimido (19 archivos); con Mermaid eran 6,1 MB
  (127 archivos). Solo, sin un Mermaid del programa que lo lleva, no dibuja.
- La web no cambia: se sirve desde el repositorio, que sí lleva
  `vendor/mermaid`; `package.json`, el flujo y la segunda licencia no afectan a
  lo que se sirve.

## Evidencia

- Edicuatex: `.github/workflows/publish.yml` y `package.json` en
  `edicuatex/edicuatex.github.io` (commit `c7e498f`). Su versión 1.5.0 no tiene
  ejecución del flujo; la primera es la de la 1.5.1 (`gh run list`), así que la
  primera versión se publicó a mano.
- `npm view sirena` devuelve un paquete ajeno (1.1.4); `npm view sirenaapp`,
  404 (28-09-2026).
- El entorno `npm` del repositorio se creó con la misma configuración que el de
  Edicuatex: sin reglas de protección.

## Riesgos y limitaciones

- Que la primera versión deba publicarse a mano sale de lo que hizo Edicuatex,
  no de la documentación de npm: es una hipótesis pendiente de validación. Si
  npm permitiera configurar la confianza antes, bastaría con la etiqueta.

## Validación

28-09-2026: `npm pack` produce 127 archivos. Extraído y servido aparte, el
paquete carga, dibuja los 27 ejemplos en Chromium y Firefox sin errores ni
archivos que falten, y mantiene la biblioteca y el idioma. Las comprobaciones
del flujo, ejecutadas a mano sobre ese paquete, pasan.
