# Parches a fallos de Mermaid

Sirena corrige por su cuenta algunos fallos de Mermaid. Cada parche es
provisional: está notificado a Mermaid y se quita cuando la versión que lleva
Sirena ya trae la corrección. Dentro de eXeLearning no se aplica ninguno, porque
allí Sirena dibuja con el Mermaid de eXe, tal como saldrá en el material
([ADR 29](adr/0029-dentro-de-exelearning-sirena-devuelve-el-diagrama-al-editor-como-edicuatex.md)).

| Fallo | Parche | Incidencias de Mermaid |
|---|---|---|
| Con ELK, un rótulo de flecha queda al lado de su línea | `rotulosSobreSuLinea` ([ADR 26](adr/0026-sirena-recoloca-los-rotulos-de-flecha-que-mermaid-deja-fuera-de-su-linea.md)) | [#8292](https://github.com/mermaid-js/mermaid/issues/8292) |
| Un rótulo con fórmula no se reparte en varias líneas y pierde el espacio junto a la fórmula | `soltarFilas`, y en `ajustarRotulosHtml` la reducción de la letra de una fórmula que no cabe ([ADR 22](adr/0022-las-formulas-se-escriben-con-latex-y-se-editan-con-edicuatex.md)) | [#8340](https://github.com/mermaid-js/mermaid/issues/8340), [#6690](https://github.com/mermaid-js/mermaid/issues/6690) |
| En un rótulo con fórmula desaparecen los saltos de línea (`<br>`) | `marcarSaltos` y `restaurarSaltos` (ADR 22) | [#7194](https://github.com/mermaid-js/mermaid/issues/7194), [#5941](https://github.com/mermaid-js/mermaid/issues/5941), [#7873](https://github.com/mermaid-js/mermaid/issues/7873) |
| El rótulo de flecha con fórmula no tiene fondo opaco y la línea lo atraviesa | en `ajustarRotulosHtml`, el fondo que pone al rótulo (ADR 22) | [#5543](https://github.com/mermaid-js/mermaid/issues/5543) |
| En Chrome y Edge, con algunas escalas de pantalla o de zoom, el texto de una caja que no cabe en una línea queda en una sola y cortado | en `ajustarRotulosHtml`, el `white-space: normal` que pone al rótulo (ADR 22) | [#7794](https://github.com/mermaid-js/mermaid/issues/7794) |

La lista que usan las comprobaciones está en `scripts/parches-mermaid.json`:
por cada parche, un ejemplo mínimo que reproduce el fallo y un ejemplo de
control, el mismo caso sin la causa del fallo, que tiene que salir siempre bien.
Si el fallo depende de la escala de pantalla, el parche lleva `escala`: el
ejemplo se dibuja con Chromium a esa escala y el control, a escala 1.

## Cómo se sabe que un parche ya sobra

Cada lunes, el aviso de versión nueva de Mermaid
(`.github/workflows/check-mermaid-version.yml`) descarga la versión nueva, dibuja
con ella sola cada ejemplo y mide si el fallo sigue
(`scripts/comprobar-parches.mjs`). La incidencia que abre lleva una tabla con el
resultado y el estado de cada incidencia de Mermaid en GitHub. Un fallo aparece
como **corregido** cuando el ejemplo sale bien; si el control también falla, la
medición no se fía de esa versión y pide comprobarlo a mano.

La comprobación se hace midiendo el dibujo, no mirando si la incidencia está
cerrada: una incidencia puede cerrarse sin que la corrección haya salido aún en
una versión publicada, o corregirse sin cerrarse.

## Cómo se quita un parche

1. Actualizar Mermaid con `scripts/actualizar-mermaid.sh`.
2. Quitar la función (o la parte de la función) que indica la tabla y su
   llamada, y la entrada de `scripts/parches-mermaid.json`.
3. Probar en Sirena el ejemplo del parche y los de `docs/pruebas.md`.
4. Actualizar el ADR del parche y esta página.

## Ajustes propios de Sirena, que no son parches

Otros retoques del dibujo no corrigen fallos de Mermaid, sino que salen de cómo
dibuja Sirena, y no se vigilan: el fondo opaco de los rótulos de flecha cuando
son texto SVG (`opaqueEdgeLabels`), y en `ajustarRotulosHtml` el hueco para una
fórmula alta y el estiramiento de la caja cuando el texto ocupa más líneas de las
previstas. Con Mermaid solo, esos dos últimos casos no se reproducen.
