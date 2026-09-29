# 34. Los colores de la lista escriben a juego los fondos que Mermaid sacaría girando el tono

Fecha: 2026-09-29 · Estado: aceptado

## Contexto

Los colores de la lista del menú de temas (azul, verde, naranja, morado, gris)
y «Color propio» se escriben como tema `base` de Mermaid con el relleno, el
borde y las líneas. El tema `base` calcula el resto girando el tono del relleno
(Mermaid 12.0.0, `vendor/mermaid/VERSION`):

- `secondaryColor` es el relleno con el tono a −120°, y de él salen el fondo de
  los rótulos de flecha (`edgeLabelBackground`), el de las etiquetas de commit
  (`commitLabelBackground`) y el de las activaciones de la secuencia
  (`activationBkgColor`);
- `tertiaryColor` es el relleno con el tono a +180°, y de él salen el fondo y el
  borde de los grupos y carriles (`clusterBkg`, `clusterBorder`) y el de las
  secciones del Gantt (`sectionBkgColor`);
- el borde de las cajas es un degradado que va de `primaryBorderColor` a
  `secondaryBorderColor` (`gradientStop`), también girado.

Con el morado, los rótulos salían verdes y el borde de las cajas acababa en
verde; con el verde, los rótulos salían rojizos y los grupos, magenta. Juanjo lo
vio en un diagrama de flujo (29-09-2026: «¿es normal que si elijo por ejemplo el
morado, el fondo de los rótulos salga verde?»). «Color propio» ya escribía el
fondo de los rótulos igual que el relleno por esta misma razón, pero no el
resto.

## Decisión

Cada color de la lista y «Color propio» escriben también, a juego con su
relleno (`fondosAJuego` en `js/sirena.js`):

| Variable | Valor |
|---|---|
| `edgeLabelBackground`, `commitLabelBackground` | el relleno |
| `clusterBkg`, `sectionBkgColor`, `activationBkgColor` | el relleno mezclado al 50 % con blanco |
| `clusterBorder`, `activationBorderColor`, `gradientStop` | el borde |

Lo que un color ya trae escrito manda: el blanco y negro conserva sus valores.
Las variables del Gantt, del gitgraph y de la secuencia solo se escriben en ese
tipo de diagrama, como ya se hacía con los sectores y la gráfica XY, para no
alargar la cabecera de los demás. Con «Color propio», el fondo de los rótulos se
sigue eligiendo aparte.

Al leer un diagrama, el fondo de los rótulos que trae el propio color de la
lista no cuenta como puesto a mano
([ADR 33](0033-al-elegir-un-tema-se-decide-antes-si-se-quitan-los-colores-puestos-a-mano.md)).

No se tocan los colores de categoría, que Mermaid varía a propósito para
distinguir partes y que también varían con sus otros temas: sectores, ramas del
gitgraph, secciones del mapa mental, de la cronología, del treemap y del
kanban, recorrido de usuario, Venn, radar, gráfica XY y Sankey. Tampoco las
notas, que Mermaid pinta en amarillo con todos sus temas.

## Alternativas descartadas

- **Fijar `secondaryColor` y `tertiaryColor` al color de la lista.** Arregla
  los fondos de una vez, pero de esas dos variables salen también los colores
  de categoría (sectores, ramas, secciones): todos quedarían del mismo color y
  dejarían de distinguirse.
- **Fondo blanco para los rótulos.** Rompe con lo que ya hacía «Color propio»,
  que usa el relleno.

## Consecuencias

- Los diagramas de flujo, estados, clases, ER, carriles, Gantt, gitgraph y
  secuencia quedan en el tono del color elegido.
- La cabecera es algo más larga: unos 110 caracteres en un diagrama de flujo.
- Un diagrama guardado con la cabecera anterior se sigue reconociendo por el
  relleno, el borde y las líneas; recibe los fondos nuevos la próxima vez que
  se cambie su aspecto en Sirena.

## Evidencia

- Las fórmulas del tema `base` en `vendor/mermaid/chunks/mermaid.esm.min/`:
  `secondaryColor=…||o(this.primaryColor,{h:-120})`,
  `tertiaryColor=…||o(this.primaryColor,{h:180,l:5})`,
  `edgeLabelBackground=…||this.secondaryColor`,
  `clusterBkg=…||this.tertiaryColor`,
  `commitLabelBackground=…||this.secondaryColor`,
  `gradientStop=this.secondaryBorderColor`.
- Script de Playwright que dibuja los 27 ejemplos con el azul, el verde, el
  naranja y el morado y anota todo relleno, borde, color de texto y parada de
  degradado con saturación de al menos 0,25 y un tono a más de 35° del relleno.
  Antes del cambio salían los fondos citados en el contexto; después, solo los
  colores de categoría, las notas y los colores escritos en los propios
  ejemplos. Se añadieron casos que los ejemplos no cubren (Gantt de cuatro
  secciones, estados compuestos, espacios de nombres en clases, secuencia con
  activaciones, bucles y notas, bloques y grupos anidados) y se repitió con los
  trazos moderno y a mano alzada.

## Riesgos y limitaciones

- Otro tipo de diagrama que Mermaid añada en el futuro puede sacar otro fondo
  del giro de tono. La misma medición lo detectaría.

## Validación

La medición anterior en Chromium y la prueba de la casilla del ADR 33 en
Chromium y Firefox, que sigue oculta con los colores de la lista, con el blanco
y negro y con «Color propio» si no hay nada puesto a mano. Sin errores de
JavaScript.
