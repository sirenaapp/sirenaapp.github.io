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
Si el cursor está dentro de un rótulo, la fórmula se inserta ahí y el rótulo se
entrecomilla (las llaves del LaTeX romperían la sintaxis); si no, se crea una
caja con ella. También se puede escribir a mano, sin abrir nada.

El botón aparece solo en los tipos que las dibujan, comprobados uno a uno:
flujo (y mapa conceptual), estados, clases, secuencia, bloques, kanban y
entidad-relación. En los demás el `$$…$$` saldría tal cual.

Con los rótulos en HTML, Mermaid 12 deja el hueco del texto en 120 píxeles
fijos aunque la caja sea mayor, y lo dibuja como tabla, de modo que el texto
largo ni se parte en líneas ni cabe: se sale por el lado y queda cortado
(medido el 22-09-2026, también fuera de Sirena, así que es cosa suya). El
tamaño de la caja sí lo calcula bien, de modo que después de dibujar se estira
cada rótulo hasta el ancho de su caja (menos un margen, mayor en los rombos,
que se cierran por arriba y por abajo), se dibuja en bloque para que el texto
se reparta en líneas y, si aun así no cabe porque lleva una fórmula, que no se
puede partir, se encoge un poco la letra antes que cortar nada.

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
