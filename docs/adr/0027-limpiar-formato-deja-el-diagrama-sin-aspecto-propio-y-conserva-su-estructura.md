# 27. Limpiar formato deja el diagrama sin aspecto propio y conserva su estructura

Fecha: 2026-09-23 · Estado: aceptado

## Contexto

Los ajustes de aspecto se escriben en el código (ADR 8, 20, 21 y 24): la
cabecera `%%{init: …}%%` y líneas `style`, `classDef`, `class`, `linkStyle` o
anotaciones `:::clase`. Quitarlos uno a uno obliga a recorrer todos los menús
o a conocer la sintaxis. El autor pidió un botón en el editor y una entrada en
el menú del botón derecho sobre el fondo del lienzo que dejen el diagrama «en
un estado limpio, sin nada de formato extra».

## Decisión

«Limpiar formato» está en la barra del código, junto a la negrita y la
cursiva, con el icono de Lucide `remove-formatting`, y en el menú del botón
derecho sobre el fondo. El botón se desactiva y la entrada del menú no aparece
cuando no hay nada que quitar. Se deshace como cualquier otro cambio.

Quita el aspecto:

- de la cabecera, el tema, los colores (también los de los sectores), el
  trazo, la fuente y el tamaño del texto, la forma de las líneas, la
  separación, los márgenes y el ancho de las cajas;
- las líneas `style`, `classDef`, `linkStyle` y las asignaciones de clase
  (`class`, o `cssClass` en el diagrama de clases, donde `class` define una
  clase), y las anotaciones `:::clase` (también el resaltado del árbol);
- en los diagramas de flujo, el tipo de línea de las flechas: las punteadas,
  discontinuas, de raya y punto y gruesas vuelven a la línea normal.

Conserva lo que dice qué es el diagrama o cómo se reparte: el tipo, la
orientación, el motor de distribución y la unión de flechas, las cajas y su
forma, las puntas de las flechas, las flechas invisibles (que sirven para
colocar), los bloques, los textos con su negrita y cursiva, los enlaces, el
título y la descripción accesibles, y las opciones de las gráficas que deciden
qué datos se muestran (numeración y ajustes de la secuencia, valores, anillo y
leyenda de los sectores, etiquetas de la gráfica y del diagrama de Sankey).
Una cabecera que no se puede leer como JSON se deja como está.

## Alternativas descartadas

- **Quitar también las formas de las cajas y las puntas de las flechas.**
  Descartada por ahora: en un diagrama de flujo el rombo de una decisión o la
  doble punta dicen algo del contenido, no solo del aspecto.
- **Borrar la cabecera entera.** Descartada: se perderían el motor de
  distribución y las opciones de las gráficas, que cambian lo que el diagrama
  enseña.
- **Mostrar el botón siempre activo.** Descartada: pulsarlo sin que pase nada
  parecería un fallo.

## Consecuencias

Volver al aspecto de serie es un solo clic, y el código que queda es el mínimo
que describe el diagrama. Si se añade un ajuste de aspecto nuevo, hay que
decidir si «Limpiar formato» lo quita: la lista de lo que se conserva está en
`CABECERA_SIN_FORMATO`, en `js/sirena.js`.
