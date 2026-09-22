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
  (o «Tipo de diagrama» si no hay ninguno) abre un menú con los 21 tipos que
  tienen ejemplo, agrupados como los ejemplos y con su línea de definición. Con
  el editor vacío, la línea se inserta; con un diagrama escrito, se abre uno
  nuevo y el anterior queda en la biblioteca (ADR 13). Un código que solo
  tiene esa línea se muestra como vacío, sin error, para no despistar.
- **Orientación.** Cuatro botones con flechas, con el actual marcado, solo en
  los tipos que la admiten (flujo, estados, clases y entidad-relación). Escribe
  en el código como antes (`flowchart LR` o una línea `direction`). Sale del
  menú de aspecto, donde estaba como desplegable, para no tener dos veces lo
  mismo.
- **Color del elemento.** Solo en flujo, estados, clases y bloques. Toma el
  elemento de la línea del cursor (si hay varios, el que está bajo el cursor) o
  los de las líneas seleccionadas, y ofrece la paleta de cinco colores del
  menú de aspecto más un color propio; el borde y el texto se derivan del
  relleno. Un elemento recibe una línea `style`; varios, una clase `classDef`
  con su asignación (`class A,B nombre`, o `cssClass` en el diagrama de
  clases), que es la forma que Mermaid recomienda para colorear por
  categorías. Al volver a colorear o al quitar el color se retiran las líneas
  anteriores de esos elementos y las clases de Sirena que queden sin uso.

Todo se escribe en el propio código, como el resto de ajustes (ADR 8), de modo
que el diagrama se ve igual en cualquier sitio y quien lo lee aprende la
sintaxis. Los iconos son de Lucide y los rótulos están en los cinco idiomas.

## Alternativas descartadas

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
y el código resultante la enseña. La barra ocupa una línea encima del código y
en pantalla estrecha se desplaza en horizontal. Al añadir un tipo de diagrama
nuevo a los ejemplos hay que darle también su línea de definición en
`TYPE_HEADERS`, y si admite `style` o `classDef`, incluirlo en `COLORABLE` y en
la detección de elementos de `targetNodes`.
