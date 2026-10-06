# 35. Sirena centra el texto de las cajas de los mapas mentales

Fecha: 2026-10-06 · Estado: aceptado

## Contexto

En el ejemplo del mapa mental, «Célula» no cabía en su círculo: el texto
empezaba en el centro y se salía por la derecha, encima de la rama amarilla.

Es un fallo de Mermaid. Sirena dibuja los rótulos como texto SVG
(`htmlLabels: false`, [ADR 3](0003-etiquetas-sin-html.md)) para que el diagrama
se pueda convertir en PNG. Con esa forma, Mermaid coloca el rótulo de cada caja
en su centro dando por hecho que el texto se centra en ese punto
(`labelHelper`, en `rendering-util/rendering-elements/shapes/util.ts`). La hoja de
estilo del diagrama de flujo sí lo centra (`.node .label text { text-anchor:
middle }`), pero la del mapa mental no; el texto queda alineado a la izquierda y
arranca en el centro de la forma. Pasa con el círculo, el cuadrado, la caja
redondeada y el hexágono; la forma por defecto, la nube y la explosión colocan
el rótulo por su cuenta y salen bien. En mermaid.live no se ve porque dibuja los
rótulos en HTML; con `"htmlLabels": false` en su configuración, sale igual.

Ocurre con Mermaid 12.0.0 y 12.1.0, y en su rama de desarrollo (comprobado el
06-10-2026). No había ninguna incidencia sobre ello.

## Decisión

Después de dibujar, `centrarTextoMapaMental()` pone `text-anchor="middle"` en el
texto de los rótulos de mapa mental que Mermaid ha colocado en el centro de su
caja (`translate(0, …)`) sin centrarlo. Los que ya están centrados, o colocados
de otra forma, no se tocan. Como la corrección queda en el dibujo, llega también
a las descargas. Dentro de eXeLearning no se aplica, como los demás parches
([ADR 29](0029-dentro-de-exelearning-sirena-devuelve-el-diagrama-al-editor-como-edicuatex.md)).

El fallo se comunica a Mermaid. Cuando lo corrija, la función se quita: lo dice
la comprobación del aviso de versión nueva
([ADR 31](0031-los-parches-a-mermaid-se-comprueban-con-cada-version-nueva.md)),
que lleva su ejemplo y su control en `scripts/parches-mermaid.json`.

## Alternativas descartadas

- **Dibujar los mapas mentales con los rótulos en HTML.** El PNG dejaría de
  poder descargarse (ADR 3).
- **Añadir la regla de centrado a la hoja de estilo del dibujo.** Centraría
  también los rótulos que Mermaid ya coloca por su borde izquierdo (nube y
  explosión), que se desplazarían a la izquierda.

## Consecuencias

El texto de los mapas mentales queda centrado en su caja, en pantalla y en las
descargas. Hay un parche más que vigilar con cada versión de Mermaid.

## Evidencia

Medido con Mermaid solo, en Chromium, con un mapa mental de cada forma: con los
rótulos en HTML, el texto queda a 0 px del centro de su caja; como texto SVG, a
23 px (círculo «Célula»), 35 px (cuadrado), 46 px (redondeado) y 36 px
(hexágono). En los demás ejemplos de Sirena no hay rótulos así: el diagrama de
clases alinea a la izquierda sus atributos a propósito.

## Validación

06-10-2026, en Chromium y Firefox: con la corrección, el texto de todas las
cajas del ejemplo queda a 0 px del centro de su forma, también en el PNG
descargado. `scripts/comprobar-parches.mjs` da el control bien (rótulos en HTML)
y el ejemplo con el fallo, a 32 px del centro.
