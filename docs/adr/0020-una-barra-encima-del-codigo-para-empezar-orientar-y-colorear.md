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
- **Colores.** Un solo menú con dos secciones. «Todo el diagrama» es el color
  principal de antes (paleta de cinco colores o colores propios de relleno,
  borde, líneas y texto). «Color del elemento donde está el cursor», solo en
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
- **Trazo y texto.** El trazo y el tamaño del texto, en un botón.
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
  forma de las líneas y separación solo con dagre; unir las flechas que van
  al mismo sitio (`elk.mergeEdges`) solo con ELK por capas; márgenes en flujo
  con cualquier motor; numeración en secuencia; valores en sectores. La
  orientación se oculta con los motores que no la atienden (tensión, fuerzas,
  cajas y empaquetado). Cada botón abre la lista de opciones con la actual
  marcada. El selector de tema de Mermaid pasa también de la barra superior
  al menú de colores, como primera fila: es un juego de colores y ahí lo buscó
  el autor. Y desde ese momento el tema se escribe en la cabecera
  (`"theme":"forest"`), porque el autor señaló que lo que no está en el
  editor no se comparte; «Predeterminado» no escribe nada y sigue al modo
  claro u oscuro. Con un color principal elegido el tema es `base` y el
  selector queda deshabilitado, porque Mermaid solo admite colores propios
  sobre ese tema.
- **Título y descripción accesibles.** El botón pasa de la barra superior a
  esta, junto al resto de lo que se escribe en el código. En los tipos que
  rechazan `accTitle` y `accDescr` o los ignoran (mapa mental, kanban, línea
  del tiempo, bloques, Sankey, Venn e Ishikawa, comprobados uno a uno) se
  escriben como comentario `%% accTitle:` y `%% accDescr:`, con las mismas
  palabras, y la ventana avisa de que así no llegan al lector de pantalla.

Todo se escribe en el propio código, como el resto de ajustes (ADR 8), de modo
que el diagrama se ve igual en cualquier sitio y quien lo lee aprende la
sintaxis. Los iconos son de Lucide y los rótulos están en los cinco idiomas.

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

## Consecuencias

Empezar un diagrama, orientarlo y colorearlo se hace sin conocer la sintaxis,
y el código resultante la enseña. La barra lleva además deshacer y rehacer con
historial propio (Ctrl+Z y Ctrl+Y), porque el del navegador se pierde cada vez
que un botón escribe en el código; lo tecleado seguido se agrupa en una sola
entrada y el historial empieza de cero al cambiar de documento. La barra ocupa una línea encima del código y
en pantalla estrecha se desplaza en horizontal. Donde los ADR anteriores
hablan del «menú de aspecto» hay que leer ahora estos menús de la barra del
editor. Al añadir un tipo de diagrama
nuevo a los ejemplos hay que darle también su línea de definición en
`TYPE_HEADERS`, y si admite `style` o `classDef`, incluirlo en `COLORABLE` y en
la detección de elementos de `targetNodes`.
