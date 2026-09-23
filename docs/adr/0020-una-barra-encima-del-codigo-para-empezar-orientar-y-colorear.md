# 20. Una barra encima del código para empezar, orientar y colorear

Fecha: 2026-09-22 · Estado: aceptado

## Contexto

Quien no conoce Mermaid llega a Sirena de dos maneras: pegando el código que le
ha dado una IA o queriendo escribir el diagrama por su cuenta. Para lo segundo,
la chuleta de la ayuda (ADR 6) explica la sintaxis, pero está dentro de una
ventana y no resuelve las tres cosas que más cuestan al empezar: qué línea
define cada tipo de diagrama, cómo se cambia la orientación y cómo se colorea
un elemento concreto, que en Mermaid exige conocer `style`, `classDef` y
`class`.

## Decisión

El panel del código lleva una barra de herramientas propia, con tres grupos:

- **Tipo de diagrama.** Un botón con el nombre del tipo que hay en el editor
  (o «Tipo de diagrama» si no hay ninguno) abre un menú con los 22 tipos que
  tienen ejemplo, agrupados como los ejemplos y con su línea de definición. Con
  el editor vacío, la línea se inserta; con un diagrama escrito, se abre uno
  nuevo y el anterior queda en la biblioteca (ADR 13). El mapa conceptual,
  que en Mermaid es un diagrama de flujo con los enlaces rotulados con un
  verbo, figura como tipo propio por su peso en el aula: escribe `flowchart
  TD` más un comentario que explica cómo se rotulan los enlaces, y por ese
  comentario la barra lo reconoce como mapa conceptual. Un código que solo
  tiene esa línea se muestra como vacío, sin error, para no despistar.
- **Orientación.** Un botón que muestra la flecha de la orientación actual y
  despliega las cuatro con su nombre, solo en los tipos que la admiten (flujo,
  estados, clases y entidad-relación); las cuatro flechas sueltas ocupaban
  sitio y se agruparon a petición del autor. Escribe
  en el código como antes (`flowchart LR` o una línea `direction`).
- **Tema.** Desde el 23-09-2026, un botón propio (icono `swatch-book` de
  Lucide) con una sola lista de los colores del diagrama entero: los temas de
  Mermaid (predeterminado, neutro, bosque y oscuro) y, tras una raya, la
  paleta de Sirena (cinco colores) y «Color propio…». Antes el tema y el
  color principal eran dos filas del menú de colores, y el primero quedaba
  deshabilitado al elegir el segundo, porque Mermaid solo admite colores
  propios sobre el tema `base`; para quien usa el programa son la misma
  elección, y el autor pidió sacarla a la vista. Cada opción se ve dibujada
  (una caja con una flecha, con su relleno, su borde y su línea, los de las
  variables de tema de Mermaid 12), y la del predeterminado sigue al modo
  claro u oscuro, como el propio tema. «Base» no figura porque sin colores
  propios apenas se distingue del predeterminado; solo aparece, marcado, si
  el código ya lo trae. Al elegir «Color propio…» el menú sigue abierto con
  los selectores de relleno, borde, líneas, texto y fondo de los rótulos de
  flecha, que toman los colores que el diagrama tiene en pantalla, leídos del
  SVG dibujado, de modo que nada cambia hasta que se toca algo. El fondo de
  los rótulos está también aquí, a petición del autor, porque es uno de los
  colores del diagrama entero, y con color propio se escribe siempre (el del
  relleno mientras no se toque): el tema `base` lo sacaría girando el tono
  del relleno, y un relleno verde daba un rótulo rojo. En el botón derecho sobre el fondo,
  «Tema» es la primera entrada.
- **Colores.** Solo en flujo, estados, clases, bloques y entidad-relación,
  que son los tipos con rótulos en las flechas. Dos secciones: el color del
  elemento del cursor y el fondo de los rótulos de flecha
  (`edgeLabelBackground`, desde el 22-09-2026), que se escribe solo si se ha
  elegido y vale para todos a la vez, porque el de un solo rótulo no lo
  permite Mermaid. «Color del elemento donde está el cursor», solo en
  flujo, estados, clases y bloques, toma el elemento de la línea del cursor
  (si hay varios, el que está bajo el cursor) o los de las líneas
  seleccionadas, y deja elegir qué se colorea: toda la caja, solo el texto o
  solo el borde. Toda la caja escribe relleno, borde y texto a juego: un
  elemento recibe una línea `style`; varios, una clase `classDef` con su
  asignación (`class A,B nombre`, o `cssClass` en el diagrama de clases), que
  es la forma que Mermaid recomienda para colorear por categorías, y se
  retiran las líneas anteriores de esos elementos y las clases de Sirena que
  queden sin uso. Solo el texto o solo el borde cambian esa propiedad
  (`color` o `stroke`) en la línea `style` del elemento, creándola si no
  existe, sin tocar el resto; para ellos la paleta ofrece los colores oscuros
  del borde, porque el relleno claro no se leería. En un diagrama de flujo,
  cuando la línea del cursor lleva una flecha, aparece una cuarta opción, «La
  flecha», que escribe `linkStyle N stroke:…,color:…` (línea y texto del
  rótulo); Sirena cuenta las flechas como lo hace Mermaid, por orden de
  aparición desde 0 y contando las que suman «&» y las encadenadas, que es lo
  que más cuesta hacer a mano. El fondo del rótulo de una sola flecha no se
  puede cambiar en Mermaid; el de todos es la variable `edgeLabelBackground`.
- **Estilo del trazo** y **Tamaño del texto**, cada uno en su botón. El del
  estilo del trazo (antes «Trazo», renombrado el 23-09-2026 a petición del
  autor) abre directamente la lista de los tres estilos, cada uno dibujado:
  clásico con esquinas vivas, a mano alzada con líneas repasadas que se
  cruzan en las esquinas y moderno redondeado con sombra; antes abría un
  desplegable dentro del menú. El del tamaño ofrece
  los cuatro de la lista y un campo para escribir cualquier número de píxeles
  (de 8 a 72), a petición del autor; el valor libre se conserva en el selector
  y se lee de vuelta de la cabecera.
- **Motor de distribución.** Un botón que lista todos los motores que trae
  Mermaid 12: dagre y los algoritmos de ELK (por capas, árbol, radial, por
  tensión, por fuerzas, sin solapamientos, en cajas, empaquetado y por
  partes), cada uno con una línea que dice cómo reparte los elementos. Se
  excluye `elk.random`, que coloca al azar y solo sirve para pruebas. Aparece
  en flujo, estados, clases y entidad-relación, y el motor elegido se escribe
  en la cabecera (ADR 12). Va en segundo lugar, justo después del tipo, porque
  condiciona qué ajustes tienen sentido después.
- **Un botón por ajuste.** El resto del antiguo menú de aspecto de la barra
  superior, a petición del autor, con un botón por ajuste que solo aparece
  cuando el tipo de diagrama y el motor lo atienden, comprobado uno a uno:
  «Líneas» en flujo, con dos secciones como el de colores: para todas, la
  forma (solo con dagre) y el grosor de las flechas (`linkStyle default
  stroke-width`) y de los bordes (`classDef default stroke-width`); y para la
  flecha o el elemento de la línea del cursor, su grosor en su `linkStyle N`
  o `style A`, fundido con el color que ya tengan; separación solo con dagre; unir las flechas que van
  al mismo sitio (`elk.mergeEdges`) solo con ELK por capas, y como solo tiene
  dos estados su botón es un interruptor, sin menú, encendido cuando está
  puesto; cada grosor
  ofrece además un campo para escribir cualquier valor entre 0,5 y 20
  píxeles, como el tamaño del texto; márgenes en flujo
  con cualquier motor; numeración en secuencia; valores en sectores. La
  orientación se oculta con los motores que no la atienden (tensión, fuerzas,
  cajas y empaquetado). Cada botón abre la lista de opciones con la actual
  marcada. El tema de Mermaid salió de la barra superior al pasar a esta
  barra, y desde ese momento se escribe en la cabecera
  (`"theme":"forest"`), porque el autor señaló que lo que no está en el
  editor no se comparte; «Predeterminado» no escribe nada y sigue al modo
  claro u oscuro. Con un color de la paleta o propio, el tema escrito es
  `base`.
- **Forma de la caja.** En flujo, un botón con las 52 formas que Mermaid 12
  dibuja (comprobadas una a una; `datastore` se dejó fuera porque sale como
  rectángulo), agrupadas en básicas, proceso, datos y documentos y otras, con
  su nombre en cada idioma, su sintaxis al lado y una miniatura de la forma
  real: `scripts/generar-formas-iconos.mjs` la dibuja con el Mermaid del
  repositorio, se queda con la silueta (muestreo del trazado y reducción de
  puntos, porque rough.js genera cientos de curvas) y la guarda en
  `js/formas-iconos.js` (unos 30 KB para las 52). Hay que volver a generarlas
  al actualizar Mermaid o al cambiar la lista. Van en rejilla de cuatro
  columnas, con la sintaxis en el rótulo emergente, porque en lista una
  debajo de otra la ventana no cabía en pantalla. Con «Esta caja» cambia la
  forma del elemento de la línea del cursor; con «Todas las cajas», la de
  los elementos que llevan la forma general, uno a uno, porque Mermaid no
  tiene un ajuste global de forma. La forma general es la última que se dio
  a todas (el rectángulo si nunca se hizo) y queda apuntada en el código
  como comentario, `%% formaGeneral: rounded`, que Mermaid ignora; así las
  cajas cambiadas una a una se respetan al volver a cambiar todas, también
  después de reabrir el diagrama, tal como pidió el autor. Reescribe cada
  definición allí donde esté, conservando su texto: con
  la sintaxis clásica (`A{Texto}`, `A([Texto])`…) cuando la forma la tiene, y
  con la nueva (`A@{ shape: doc, label: "Texto" }`) para el resto. Un
  elemento que solo aparece suelto recibe una línea propia.
- **Salto de línea.** Un botón escribe `<br>` donde esté el cursor, que es
  como Mermaid parte un rótulo en varias líneas. Solo aparece en los tipos
  cuyos rótulos lo admiten, comprobados uno a uno con Mermaid 12; en los
  demás (Gantt, sectores, radar, Venn, mapa de árbol y ramas de Git) se
  dibujaría tal cual, como texto, así que el botón se oculta.
- **Título y descripción accesibles.** El botón pasa de la barra superior a
  esta, junto al resto de lo que se escribe en el código. En los tipos que
  rechazan `accTitle` y `accDescr` o los ignoran (mapa mental, kanban, línea
  del tiempo, bloques, Sankey, Venn e Ishikawa, comprobados uno a uno) se
  escriben como comentario `%% accTitle:` y `%% accDescr:`, con las mismas
  palabras, y la ventana avisa de que así no llegan al lector de pantalla.

Todo se escribe en el propio código, como el resto de ajustes (ADR 8), de modo
que el diagrama se ve igual en cualquier sitio y quien lo lee aprende la
sintaxis. Los iconos son de Lucide y los rótulos están en los cinco idiomas.

**Orden de la barra** (23-09-2026, a petición del autor, que pidió un orden
más lógico y coherente): primero lo que condiciona el resto, que es la
distribución (tipo, motor, dirección, separación, márgenes y unir flechas);
luego el aspecto, del conjunto a lo concreto (tema, colores, estilo del
trazo, tipografía, líneas y cajas); después lo propio de cada tipo de
diagrama y «Limpiar formato»; luego lo que escribe contenido (nuevo bloque,
negrita, cursiva, fórmula y salto de línea); y al final accesibilidad, ayuda,
deshacer y rehacer. Un separador solo se ve si tiene botones visibles a los
dos lados, porque según el tipo de diagrama un grupo entero puede quedar
vacío.

## Alternativas descartadas

- **Mantener los ajustes del dibujo en la barra superior.** Descartado: el
  autor los quiso junto al código, repartidos por temas, para que quien
  empieza encuentre en un mismo sitio todo lo que cambia el dibujo.
- **Una barra con fragmentos de cada tipo (caja, rombo, flecha…).** Descartada
  por ahora: repite la chuleta de la ayuda, que ya inserta cada fragmento al
  pulsarlo. Si la práctica lo pide, se añadirá sacando las filas de la propia
  chuleta, sin mantener dos listas.
- **Colorear editando el elemento con `:::clase`.** Descartado: obliga a
  modificar la línea donde se define cada elemento, con todas las formas
  posibles, y es más frágil que añadir `class A,B nombre` al final.
- **Colorear en los gráficos de datos (sectores, XY, radar…).** Aplazado: ahí
  el color va por serie con variables del tema, no por elemento.
- **Deshabilitar el botón de color cuando no hay elemento bajo el cursor.**
  Descartado: un botón deshabilitado no muestra su rótulo en todos los
  navegadores. El menú se abre igual y explica dónde poner el cursor.

## Negrita y cursiva (22-09-2026)

La barra lleva dos botones más, negrita y cursiva, que envuelven lo elegido
en `**` y `*`. Mermaid solo atiende ese marcado si el rótulo entero va entre
acentos graves (`A["`Uno **dos**`"]`), así que al aplicarlo por primera vez se
pasa el rótulo a esa forma, y como los acentos graves obligan a entrecomillar,
se entrecomilla también. Comprobado en cajas, en rombos y en los rótulos de
flecha, con los rótulos en texto SVG y en HTML.

Lo que no se puede es juntar el marcado con una fórmula: Mermaid deja los
asteriscos a la vista. Si el rótulo lleva `$$…$$`, los botones no hacen nada y
lo dicen con un aviso, en vez de escribir algo que saldría mal.

Desde el 23-09-2026, a petición del autor, los dos botones ponen y quitan,
como en un procesador de textos: antes cada pulsación añadía asteriscos. Se
cuentan los que rodean lo elegido, dentro o justo fuera de la selección (dos
son negrita, uno cursiva y tres las dos), y cada botón añade o quita solo los
suyos. Lo elegido sigue elegido, para poder volver a pulsar. «Limpiar
formato» no los quita (ADR 27): son énfasis del texto, no aspecto del
diagrama, y su rótulo emergente lo dice.

## Consecuencias

Empezar un diagrama, orientarlo y colorearlo se hace sin conocer la sintaxis,
y el código resultante la enseña. La barra lleva además deshacer y rehacer con
historial propio (Ctrl+Z y Ctrl+Y), porque el del navegador se pierde cada vez
que un botón escribe en el código; lo tecleado seguido se agrupa en una sola
entrada y el historial empieza de cero al cambiar de documento. La barra va encima del código y crece en
filas cuando no caben los botones (el autor prevé seguir añadiendo); en
pantalla estrecha se desplaza en horizontal. Donde los ADR anteriores
hablan del «menú de aspecto» hay que leer ahora estos menús de la barra del
editor. Al añadir un tipo de diagrama
nuevo a los ejemplos hay que darle también su línea de definición en
`TYPE_HEADERS`, y si admite `style` o `classDef`, incluirlo en `COLORABLE` y en
la detección de elementos de `targetNodes`.
