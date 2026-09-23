# 21. El botón derecho sobre el diagrama abre las opciones del objeto

Fecha: 2026-09-22 · Estado: aceptado

## Contexto

La barra del editor ([ADR 20](0020-una-barra-encima-del-codigo-para-empezar-orientar-y-colorear.md))
aplica los cambios al elemento donde está el cursor del código. Quien no
conoce Mermaid mira el dibujo, no el texto: para colorear una caja tiene que
localizar antes su línea en el editor.

## Decisión

El botón derecho sobre el diagrama abre un menú con lo que se puede cambiar
del objeto señalado, y coloca además el cursor del editor en su línea, de modo
que los botones de la barra pasan a actuar sobre él.

- **Sobre una caja**: color (toda la caja, solo el texto o solo el borde),
  quitar el color, grosor del borde, forma, escribir el texto y borrarla.
- **Sobre una flecha**: color de la línea y de su texto, quitar el color,
  grosor, escribir su texto y borrarla.
- **Sobre el texto de una flecha**: su color (`linkStyle N color:…`, sin tocar
  la línea), quitarlo, el fondo de los rótulos (que en Mermaid solo se puede
  cambiar para todos a la vez, `edgeLabelBackground`) y el paso a las
  propiedades de la flecha.
- **Sobre el fondo**: lo general que aplique al tipo de diagrama (colores,
  líneas, forma de todas las cajas, trazo, tamaño del texto, motor, unir las
  flechas que van al mismo sitio y orientación). «Unir flechas» aparece como
  interruptor, con su marca cuando está puesto, igual que su botón de la
  barra. También está ahí el título y la descripción accesibles.

La forma de la caja se abre con el alcance que corresponde al sitio desde el
que se pide (la caja señalada o todas), sin ofrecer el otro, para no cambiar
sin querer lo que no se quería; los dos alcances solo se eligen desde el
botón de la barra. El fondo de los rótulos de flecha tiene un submenú propio,
con su paleta y su vuelta al color del tema, en vez de llevar al menú de
colores entero, y se escribe como `edgeLabelBackground` con cualquier tema
(comprobado), no solo con colores propios.

Las opciones que no caben en una pulsación se abren como submenú propio, y no
llevando al menú de la barra, que el autor consideró poco profesional
(22-09-2026). El submenú cuelga al lado de su opción, como en cualquier menú
de escritorio, y se abre al pasar el ratón o al pulsar; si no cabe a la
derecha, sale a la izquierda. En pantalla estrecha, donde no cabe al lado, se
entra y se vuelve dentro del mismo menú. Para no mantener dos juegos de
controles, el submenú toma prestado el menú de la barra que le toca: se mueve
al menú contextual, se muestra sin su marco y vuelve a su sitio al cerrar. Las
formas de caja, que son cincuenta y dos, se abren en una ventana, que es
también la que abre el botón de la barra.

El objeto se identifica en el SVG que dibuja Mermaid: las cajas llevan su
identificador en el id (`…-flowchart-A-0`) y las flechas van en el mismo orden
que los índices de `linkStyle` (comprobado con ELK y con Dagre). El rótulo de
una flecha no dice a cuál pertenece, y acertar un trazo de dos píxeles con el
ratón es difícil, así que en ambos casos se toma la flecha que pase más cerca
(hasta doce píxeles del puntero).

Con Mayús pulsada no se intercepta, de modo que sigue disponible el menú del
navegador para guardar o copiar la imagen. En pantalla táctil lo abre la
pulsación larga. En el modo visor ([ADR 5](0005-modo-visor-para-incrustar.md))
no aparece nada de esto, porque ahí no se edita: ni el menú, ni el aviso, ni
los puntos de anclaje, ni el doble clic (comprobado el 22-09-2026 tras verse
los puntos en un enlace a pantalla completa).

Como un menú contextual no se ve, sobre el lienzo aparece un aviso flotante
que lo cuenta, junto con el doble clic para escribir (con los gestos de la
pantalla táctil cuando no hay ratón). Dice desde la primera palabra que vale
en los diagramas de flujo y los mapas conceptuales, y solo sale cuando el
diagrama cargado es de esos: con otro tipo se retira, y vuelve si se pasa a
uno de flujo sin haberlo cerrado. Se retira al usar el menú, al cerrarlo a
mano (con la ✕ o pulsando en cualquier parte del aviso) o a los 20 segundos de estar en pantalla, para que no tape el diagrama, pero solo durante esa visita: al volver a entrar o al recargar vuelve a
salir, porque no se guarda nada en el navegador. Así lo pidió el autor, para
que un menú que no se ve no se olvide. No aparece en el modo visor.

## Alternativas descartadas

- **Mover las cajas con el ratón.** Descartado: Mermaid coloca los elementos
  con su motor y no admite coordenadas, así que una caja arrastrada volvería a
  su sitio al redibujar.
- **Un panel lateral de propiedades.** Descartado: ocupa sitio permanente y
  Sirena ya tiene la barra del editor.
- **Explicar el botón derecho solo en la ayuda.** Descartado: quien no abre la
  ayuda no llega a enterarse de que existe.
- **Duplicar en el menú contextual todas las opciones de la barra.**
  Descartado: lo que cuesta una sola pulsación se resuelve ahí; para lo
  demás (formas, tema) el menú lleva al de la barra, sin mantener dos listas.

## Escribir y borrar sobre el dibujo (22-09-2026)

En los diagramas de flujo (y con ellos el mapa conceptual), el doble clic
sobre una caja o sobre el texto de una flecha abre un campo encima del propio
elemento, a su medida y con el tamaño de letra del zoom. Intro confirma,
Mayús+Intro añade un salto, que se guarda como `<br>`, Escape cancela y pulsar
fuera confirma. Ese pulsar fuera se atiende a mano: el lienzo se queda con el
ratón para desplazar el diagrama, de modo que el campo no perdía el foco solo y
solo se salía con Intro.

Pegada al campo va una barra con cuatro botones, que es lo que se puede
necesitar escribiendo un rótulo: negrita, cursiva, salto de línea y fórmula
(que abre Edicuatex, [ADR 22](0022-las-formulas-se-escriben-con-latex-y-se-editan-con-edicuatex.md)).
Se coloca encima del campo, o debajo si no cabe arriba, y no le quita el foco al
pulsarla. Los acentos graves que marcan el Markdown ([ADR 20](0020-una-barra-encima-del-codigo-para-empezar-orientar-y-colorear.md))
no se enseñan ahí: se quitan al abrir el campo y se vuelven a poner al guardar
si el texto lleva marcado. El texto se reescribe conservando la forma de la caja y el
estilo de la flecha (`A -- Sí -->` sigue siendo así, y `-->|Sí|` también).

Borrar tiene su cuidado: los estilos de las flechas van por número
(`linkStyle 2`), así que al quitar una se renumeran los posteriores y se
retiran los que se queden sin flecha. Al borrar una caja se parte la línea por
donde estaba, sin unir lo que ella unía, se quitan su `style` y su lugar en
las asignaciones de clase, y las cajas que se quedan sueltas se conservan
salvo que ya aparezcan en otra línea. Una línea que describe varias flechas de
una vez (`A & B --> C`) se retira entera, porque no se puede quitar solo una
de sus flechas sin reescribirla.

El motor de todo esto es el troceo de una línea de flujo: se enmascaran los
textos (para que un guion dentro de una caja no se confunda con una flecha) y
se localizan las flechas con su rótulo y su posición.

## Crear cajas y flechas (22-09-2026)

Al pasar el ratón sobre una caja de un diagrama de flujo aparecen cuatro
puntos de anclaje; arrastrando de uno de ellos sale una línea guía y la caja
bajo el cursor se resalta. Al soltar sobre otra caja se escribe `A --> B`; al
soltar en el vacío se crea la caja de destino con la forma general del
diagrama y se abre el campo para escribir su texto, que es lo que permite
construir un diagrama entero sin tocar el código. El arrastre sale solo de los
puntos, nunca del cuerpo de la caja, para no estorbar al desplazamiento del
lienzo, y Escape lo cancela.

El doble clic en el lienzo vacío añade una caja suelta, y el menú del botón
derecho ofrece «Añadir una caja» sobre el fondo y «Añadir una caja conectada»
sobre una caja, que es la vía en pantalla táctil, donde no hay puntos de
anclaje.

Las cajas nuevas toman la primera letra libre (A, B, C… y luego A1, A2…) para
que el código siga leyéndose, y las flechas se escriben junto a las demás,
antes del bloque de estilos; como van al final, no alteran la numeración de
los `linkStyle` existentes.

## Enlace en una caja (22-09-2026)

En los diagramas de flujo, el botón derecho sobre una caja ofrece «Poner un
enlace» (o «Cambiar el enlace» si ya lo tiene): una ventana con la dirección
y un texto emergente opcional, que se escribe como `click A "https://…"
"texto"` al final del código, y se quita borrando la línea; al borrar la caja
se borra también. Es el punto 3 del inventario de lo que Mermaid permite
(22-09-2026).

Sirena dibuja con el nivel de seguridad estricto de Mermaid y así se queda:
el enlace se genera igual (comprobado con los cuatro niveles), pero Mermaid
retira el `_blank`, así que después de dibujar se pone `target="_blank"` y
`rel="noopener noreferrer"` a cada enlace del dibujo, como pide el criterio
de que lo externo se abra en una pestaña nueva.

El clic no llega nunca al `<a>`, porque el lienzo captura el puntero para
poder arrastrar: se atiende al soltar, si no hubo desplazamiento y debajo hay
un enlace. En el modo visor lo abre un clic; en el editor hace falta Ctrl (o
Cmd) y clic, y un clic simple avisa de ello, para que el clic normal siga
sirviendo para mover, seleccionar y editar. El SVG y el HTML exportados
conservan el enlace; en el PNG no existe.

## Bloques (22-09-2026)

Punto 8 del inventario. Un bloque es un `subgraph Id [Título] … end` de
Mermaid, que puede agrupar cajas definidas fuera de él con solo escribir su id
dentro (comprobado con Mermaid 12.0.0, también con dirección propia y con
varios bloques). Sirena trabaja solo con esas referencias sueltas, que puede
poner y quitar sin tocar las flechas; las cajas que se definan dentro de un
bloque con sus flechas se respetan, pero no se mueven desde la interfaz.

- **Crear**: desde el botón derecho sobre una caja («Meter en un bloque
  nuevo»), desde el botón de cajas de la barra con las cajas de la línea del
  cursor o de la selección, o vacío desde el fondo. El bloque se escribe antes
  de los estilos con un id libre (`G1`, `G2`…) y el título «Bloque», y se abre
  el campo para escribirlo encima del dibujo.
- **Sobre una caja**: mover a cualquiera de los bloques que haya, o sacarla.
- **Sobre un bloque** (el dibujo lo identifica como `g.cluster` con su id):
  escribir el título (también con doble clic), añadir una caja dentro,
  dirección propia (`direction` dentro del bloque, o la del diagrama) y
  deshacerlo, que quita `subgraph`, `end` y `direction` y deja las cajas.
  La «caja conectada» creada desde una caja que está en un bloque nace en el
  mismo bloque. Lo pidió el autor al no ver cómo meter elementos en un bloque
  recién creado.

## Árbol: resaltar (22-09-2026)

En el árbol (`treeView`), el botón derecho sobre una fila ofrece «Resaltar» o
«Quitar el resaltado», que pone o quita `:::highlight` en su línea (detrás de
la etiqueta y antes de la nota `## …`). La fila se identifica por su orden en
el dibujo (un `g` por fila dentro de `g.tree-view`, descontando la raíz «/»
que Mermaid añade), que coincide con el orden de las líneas del código sin
cabecera, accesibilidad ni comentarios. Lo pidió el autor al ver el resaltado
en el ejemplo sin forma de ponerlo desde la interfaz.

## Consecuencias

Se puede dar formato mirando el dibujo, sin buscar la línea en el código, y
todo se sigue escribiendo en el código ([ADR 8](0008-ajustes-escritos-en-el-codigo.md)).
El menú depende de cómo Mermaid nombra los elementos del SVG: al actualizarlo
hay que comprobar que las cajas siguen llevando `-flowchart-<id>-<n>` y que el
orden de las flechas sigue coincidiendo con `linkStyle`.
