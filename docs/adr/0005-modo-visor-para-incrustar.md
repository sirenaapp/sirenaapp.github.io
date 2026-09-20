# 5. El diagrama se incrusta con la propia página en modo visor

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Los diagramas acaban dentro de un blog o de un material de eXeLearning. Se podía
descargar el PNG e insertarlo como imagen, pero entonces el diagrama deja de
poder corregirse y pierde nitidez al ampliarlo.

## Decisión

La misma página sirve de visor. Con `v=1` en la dirección se queda solo con el
diagrama —sin barra, editor ni pie— y muestra un enlace discreto para abrirlo y
editarlo. El código del diagrama sigue viajando comprimido dentro de la
dirección, como en cualquier enlace compartido (ver
[ADR 2](0002-compartir-por-enlace.md)), de modo que la página incrustada tampoco
depende de un servidor.

Un botón de la barra copia el código de incrustación completo: el `<iframe>` y
un guion opcional que ajusta su altura. Para eso, la página en modo visor envía
a la de fuera un mensaje `{ sirena: "altura", altura: … }` cada vez que dibuja.

## Alternativas descartadas

- **Insertar el PNG como imagen.** Descartada: no se puede corregir después ni
  ampliar sin perder calidad.
- **Un archivo aparte para el visor.** Descartado para no mantener dos páginas
  que hacen casi lo mismo.
- **Una biblioteca de terceros para el ajuste de altura.** Descartada: quince
  líneas de guion propio bastan y no añaden dependencias.

## Consecuencias

El material que incrusta un diagrama depende de que sirenaapp.github.io siga en
línea. Quien prefiera no depender de nada puede seguir insertando el PNG o el
SVG descargado.
