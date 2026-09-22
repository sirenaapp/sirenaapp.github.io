# 1. Mermaid se sirve desde el propio repositorio

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Sirena necesita la biblioteca Mermaid para dibujar los diagramas. La forma
habitual de incluirla es enlazar una red de distribución (CDN) como jsDelivr o
unpkg, que es cómoda y no ocupa espacio en el repositorio.

Ahora bien, el propósito de Sirena es que el diagrama no salga del equipo de
quien lo escribe. Con una CDN, cada visita comunica a un tercero qué centro o
qué persona está usando la herramienta, y la página deja de funcionar si ese
servicio falla o cambia las direcciones.

## Decisión

La distribución de Mermaid se guarda en `vendor/mermaid`, dentro del
repositorio, en su versión ESM minificada con los fragmentos separados
(`chunks/mermaid.esm.min`). Son unos 5,5 MB en total, pero el navegador solo
descarga el núcleo y el fragmento del tipo de diagrama que se esté usando.

La actualización se hace con `scripts/actualizar-mermaid.sh`, que baja el
paquete de npm y sustituye la carpeta, y la versión queda anotada en
`vendor/mermaid/VERSION`. Después hay que ejecutar
`scripts/generar-formas-iconos.mjs`, que vuelve a dibujar con el Mermaid
nuevo las miniaturas del menú de formas (ver [ADR 20](0020-una-barra-encima-del-codigo-para-empezar-orientar-y-colorear.md)).

## Alternativas descartadas

- **CDN pública.** Descartada por la dependencia de un tercero y por el rastro
  que deja cada visita.
- **Paquete único `mermaid.min.js` (UMD, 5,5 MB).** Descartado porque obliga a
  descargar toda la biblioteca aunque se dibuje un solo diagrama sencillo.
- **Compilar con un empaquetador.** Descartado para que el repositorio se pueda
  publicar en GitHub Pages tal cual, sin paso de construcción.

## Consecuencias

El repositorio pesa más y hay que actualizar Mermaid a mano. A cambio, la página
funciona sin conexión con terceros y sigue funcionando aunque el servicio
externo desaparezca.
