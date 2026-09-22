# 22. Las fórmulas se escriben con LaTeX y se editan con Edicuatex

Fecha: 2026-09-22 · Estado: aceptado · Matiza el [ADR 3](0003-etiquetas-sin-html.md)

## Contexto

En matemáticas y en ciencias un diagrama sin fórmulas se queda corto. Mermaid
sabe dibujarlas: acepta LaTeX entre `$$…$$` y lo compone con KaTeX, que ya
viene dentro de la distribución que se sirve desde el repositorio
([ADR 1](0001-mermaid-en-el-repositorio.md)), así que no hay nada que añadir.

El problema es que solo las dibuja con los rótulos en HTML, que es justo lo que
Sirena evita: el [ADR 3](0003-etiquetas-sin-html.md) eligió el texto SVG porque
un SVG con HTML dentro no se deja convertir en PNG.

Medido el 22-09-2026 con Mermaid 12: la razón de aquella limitación no era el
HTML en sí, sino cómo se le da el SVG al navegador. Servido como blob, el
lienzo queda «contaminado» y el PNG falla; escrito como dirección de datos
(`data:image/svg+xml,…`), el mismo diagrama con fórmulas se convierte en PNG
sin problema, con la fórmula bien compuesta, en Chromium y en Firefox.

## Decisión

Un diagrama que lleva `$$…$$` se dibuja con los rótulos en HTML; los demás
siguen con texto SVG, como hasta ahora. El cambio es automático: al escribir o
al borrar una fórmula, Sirena vuelve a preparar Mermaid.

Al exportar, la copia conserva las fórmulas tal cual (no se aplanan como el
resto de bloques HTML, que las echaría a perder) y el SVG se le pasa al
navegador como dirección de datos cuando lleva HTML dentro.

El botón de fórmula abre **Edicuatex** (<https://edicuatex.github.io/>), el
editor de fórmulas de la misma casa, en una ventana aparte, con `?pm=1&origin=…`,
y recoge el LaTeX que devuelve por `postMessage` comprobando que viene de ahí.
Como Edicuatex no se cierra al enviar, la cierra Sirena, que es quien la abrió.
Si el cursor está dentro de un rótulo, la fórmula se inserta ahí y el rótulo se
entrecomilla (las llaves del LaTeX romperían la sintaxis); si no, se crea una
caja con ella. También se puede escribir a mano, sin abrir nada.

El botón aparece solo en los tipos que las dibujan, comprobados uno a uno:
flujo (y mapa conceptual), estados, clases, secuencia, bloques, kanban y
entidad-relación. En los demás el `$$…$$` saldría tal cual. La chuleta de
cada uno de esos tipos lleva una fila con el fragmento que funciona (en
clases solo en la etiqueta de una relación o de la clase, no en sus miembros,
comprobado el 22-09-2026), y avisa de que `<` y `>` se escriben `\lt` y
`\gt`: Mermaid los convierte en `&lt;` y `&gt;` antes de pasar la fórmula a
KaTeX, que entonces da error. Como ejemplo hay un mapa conceptual de la
ecuación de segundo grado, con fórmulas en las cajas y en los rótulos de
flecha.

Con los rótulos en HTML aparecieron dos problemas, medidos el 22-09-2026
también fuera de Sirena, así que vienen de Mermaid 12:

- Reparte el texto en 120 píxeles (`flowchart.wrappingWidth`, que es su valor
  de serie) y con esa medida calcula el tamaño de la caja, así que un texto
  normal ya no cabía. Se sube a 300 solo en este modo; en el de siempre no se
  toca, para no cambiar los diagramas que ya existen.
- Dibuja el rótulo como una tabla, de modo que el texto no se reparte en
  líneas sino que se alarga, y lo que sobresale del hueco se corta. Ya
  dibujado, se le da al rótulo el ancho de su caja (menos un margen, mayor en
  rombos y círculos, que solo ofrecen toda su anchura en el centro) y se
  compone en bloque, que es lo que hace que el texto se reparta. Si aun así no
  cabe, porque una fórmula no se puede partir en dos líneas, se encoge un poco
  la letra antes que cortar nada. Si el texto ocupa más líneas de las que
  Mermaid contaba, la caja se estira para que no se salga.
- El rótulo que lleva una fórmula lo arma además como una fila que no deja
  saltar de línea, así que un texto largo acompañado de una fórmula salía
  cortado. Esa fila se pasa también a bloque, y entonces el texto se reparte y
  la fórmula queda como una palabra más. Lo que sobresale se mide sobre los
  elementos de dentro, no solo sobre el rótulo, porque lo que desborda de una
  fila no cuenta en la medida del padre.
- Decide si el texto se parte o no (`white-space`) con una medida previa que
  hace en un elemento fuera de pantalla, y en el Chrome del autor esa medida
  le decía que cabía en una línea cuando no cabía: el rótulo salía en `nowrap`
  y cortado. Se parte siempre. Y el arreglo se hace en el momento, forzando la
  composición, no en el siguiente fotograma: en una pestaña que el navegador
  considera oculta no dibuja fotogramas y el arreglo no llegaba a hacerse
  (así se destapó, 22-09-2026, con la pestaña de la extensión del navegador).
- En un rótulo con fórmula se come los `<br>`. Antes de dibujar se cambian por
  una marca invisible, que viaja como texto normal, y después se vuelven a
  poner como saltos de verdad.

## Alternativas descartadas

- **Guardar una copia de Edicuatex dentro del repositorio.** Descartada: pesa
  15 MB, de los que 14 son MathJax, casi el triple que Mermaid. Se abre en su
  propia dirección y solo cuando se pide, de modo que quien no use fórmulas no
  sale de esta página.
- **Dibujar los rótulos siempre en HTML.** Descartada: cambiaría el aspecto y
  la exportación de todos los diagramas por una función que solo usan algunos.
- **Componer las fórmulas aparte y meterlas en el SVG como dibujo.**
  Descartada: mucho trabajo para el mismo resultado que ya da Mermaid.

## Consecuencias

Los diagramas con fórmulas llevan HTML dentro del SVG: se ven bien en el
navegador y se descargan en PNG y en SVG, pero programas como Inkscape no los
abrirán bien, igual que ocurría antes con el recorrido de usuario. El editor de
fórmulas necesita conexión; el resto de Sirena, no.
