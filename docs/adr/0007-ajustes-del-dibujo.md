# 7. El aspecto del dibujo se ajusta con la configuración, sin tocar el código

Fecha: 2026-09-20 · Estado: sustituido por [ADR 8](0008-ajustes-escritos-en-el-codigo.md)

## Contexto

Un mismo diagrama sirve para una presentación proyectada, para una ficha
impresa o para una página web, y en cada caso conviene un tamaño de letra, un
color o un trazo distintos. Mermaid permite fijar todo eso, pero por dos vías:
escribiendo una cabecera `%%{init: …}%%` dentro del diagrama, o pasando la
configuración al dibujarlo.

## Decisión

Los ajustes se aplican al dibujar, desde el menú de aspecto de la barra, y no se
escriben en el código: trazo (`look`), tamaño del texto (`themeVariables.fontSize`),
color principal (`themeVariables`), forma de las líneas (`flowchart.curve`) y
distribución (`layout`, con el motor elk para la compacta).

Se guardan en el navegador y viajan dentro del enlace compartido, de manera que
el diagrama incrustado en una página se ve igual que en el editor. La forma de
las líneas y la distribución solo se muestran en los diagramas de flujo, que es
donde tienen efecto.

## Alternativas descartadas

- **Escribir `%%{init: …}%%` en el código del diagrama.** Descartada: ensucia el
  texto que el usuario escribe y complica la sintaxis justo a quien empieza. El
  usuario que quiera esa cabecera puede escribirla igualmente, y manda sobre
  estos ajustes.
- **Un panel de opciones siempre visible.** Descartado por no llenar la barra,
  que en el móvil ya ocupa varias filas.

## Ancho de las cajas (22-09-2026)

En los diagramas de flujo Mermaid corta el texto de una caja a 120 píxeles
(`flowchart.wrappingWidth`), de modo que un texto largo sale en una columna
estrecha y alta. El botón de cajas abre un menú con dos entradas, la forma
(que lleva a la ventana de formas) y el ancho, con estrecho (120, el de
serie), medio (200), ancho (300), muy ancho (450) o un valor escrito a mano
entre 60 y 800. Se puso primero en el botón de tamaño del texto y el autor lo
pasó al de cajas, por ser una propiedad de la caja y no del texto
(22-09-2026). El menú del botón derecho sobre el fondo lo ofrece como submenú.
En los diagramas de estados el mismo botón abre directamente el ancho
(`state.wrappingWidth`), porque ahí no hay formas que elegir. El mapa mental
tiene `mindmap.maxNodeWidth`, pero en Mermaid 12.0.0 no cambia nada
(comprobado con 120, 300 y 450: la raíz mide igual), así que no se ofrece. Se escribe en la cabecera como
`"flowchart": {"wrappingWidth": 300}` y solo cuando no es el de serie; se lee
de ahí al cargar; y no aparece en otros tipos. Medido con un texto de veinte
palabras: 152×117 a 120, 219×86 a 200, 317×71 a 300.

Una caja con fórmula no lo respetaba, porque Mermaid la mide como una fila
sin saltos de línea antes de que Sirena la recomponga
([ADR 22](0022-las-formulas-se-escriben-con-latex-y-se-editan-con-edicuatex.md)).
Se deja partir ya en el elemento de medida, con una regla de CSS, y con eso
la caja con fórmula sale al mismo ancho que las demás (482 frente a 813 a
450 píxeles).

## Diagrama de sectores (22-09-2026)

El botón que solo mostraba los valores pasa a ser un menú «Sectores» con
cuatro cosas: mostrar los valores (que sigue escribiéndose en el cuerpo, `pie
showData`), el anillo (`pie.donutHole`: sin anillo, fino 0,3, medio 0,5,
grueso 0,7), la posición de la leyenda (`pie.legendPosition`: derecha, que es
la de serie, izquierda, arriba o abajo) y el color de cada sector, con un
selector por sector leído del código (`"Nombre" : 5`, hasta doce), escrito
como `pie1…pie12` en las variables del tema. Es el punto 4 del inventario de
lo que Mermaid permite.

Los colores de sector solo actúan con el tema `base`, y ese tema cambia la
paleta de serie: al fijar el primer color propio se fijan también los demás
con el color que tenían en el dibujo, para que solo cambie el que se ha
tocado, y un botón devuelve los de serie. El menú se presta al botón derecho
sobre el fondo, como los demás.

## Tipografía (22-09-2026)

El menú de tamaño del texto lleva también la tipografía (`fontFamily` en la
cabecera): la del sistema, que es la que fija Sirena de serie, con remates,
monoespaciada y manuscrita, más un campo para escribir otra. Son familias
genéricas, que existen en cualquier equipo y salen en el PNG (comprobado en
Chromium y Firefox con las cuatro); cada opción se muestra con su propia
letra. Punto 5 del inventario de lo que Mermaid permite.

## Secuencia, gráfica XY y Sankey (22-09-2026)

Punto 7 del inventario. El botón de numeración de la secuencia pasa a ser un
menú «Secuencia» con tres ajustes de la cabecera: numerar los mensajes
(`showSequenceNumbers`), repetir los participantes abajo (`mirrorActors`, de
serie sí) y partir los mensajes largos (`wrap`). La gráfica XY tiene un botón
«Gráfica» con el valor sobre cada barra (`xyChart.showDataLabel`) y la
orientación, que Mermaid escribe en el cuerpo (`xychart-beta horizontal`),
así que va ahí como `showData` en sectores. Sankey tiene un botón para
mostrar u ocultar los valores (`sankey.showValues`). Los tres se prestan al
botón derecho sobre el fondo. Comprobado con Mermaid 12.0.0: sin espejo los
actores pasan de ocho a cuatro elementos, con `wrap` el mensaje largo de dos
a cinco líneas, y con los valores la gráfica muestra 5, 7 y 9.

## Consecuencias

Al elegir un color principal, el dibujo pasa al tema base de Mermaid, porque es
el que admite variables de color; el selector de tema deja de notarse mientras
haya un color elegido. Los ajustes no quedan dentro del archivo `.mmd`: quien
abra ese archivo en otro editor verá el diagrama con el aspecto de serie.
