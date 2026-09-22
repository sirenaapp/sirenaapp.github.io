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
  quitar el color, grosor del borde y acceso al menú de formas.
- **Sobre una flecha o su rótulo**: color de la línea y de su texto, quitar el
  color y grosor.
- **Sobre el fondo**: los menús generales de la barra que apliquen al tipo de
  diagrama (colores, líneas, forma de todas las cajas, trazo, tamaño del
  texto, motor y orientación).

El objeto se identifica en el SVG que dibuja Mermaid: las cajas llevan su
identificador en el id (`…-flowchart-A-0`) y las flechas van en el mismo orden
que los índices de `linkStyle` (comprobado con ELK y con Dagre). El rótulo de
una flecha no dice a cuál pertenece, y acertar un trazo de dos píxeles con el
ratón es difícil, así que en ambos casos se toma la flecha que pase más cerca
(hasta doce píxeles del puntero).

Con Mayús pulsada no se intercepta, de modo que sigue disponible el menú del
navegador para guardar o copiar la imagen. En pantalla táctil lo abre la
pulsación larga. En el modo visor ([ADR 5](0005-modo-visor-para-incrustar.md))
no aparece, porque ahí no se edita.

## Alternativas descartadas

- **Editar sobre el dibujo (arrastrar, escribir dentro de la caja).**
  Descartado: el código es la fuente y el dibujo lo genera Mermaid; permitir
  edición directa obligaría a mantener una correspondencia que Mermaid no
  garantiza.
- **Un panel lateral de propiedades.** Descartado: ocupa sitio permanente y
  Sirena ya tiene la barra del editor.
- **Duplicar en el menú contextual todas las opciones de la barra.**
  Descartado: lo que cuesta una sola pulsación se resuelve ahí; para lo
  demás (formas, tema) el menú lleva al de la barra, sin mantener dos listas.

## Consecuencias

Se puede dar formato mirando el dibujo, sin buscar la línea en el código, y
todo se sigue escribiendo en el código ([ADR 8](0008-ajustes-escritos-en-el-codigo.md)).
El menú depende de cómo Mermaid nombra los elementos del SVG: al actualizarlo
hay que comprobar que las cajas siguen llevando `-flowchart-<id>-<n>` y que el
orden de las flechas sigue coincidiendo con `linkStyle`.
