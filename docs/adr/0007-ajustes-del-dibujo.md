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
(22-09-2026). El menú del botón derecho sobre el fondo lo ofrece como submenú. Se escribe en la cabecera como
`"flowchart": {"wrappingWidth": 300}` y solo cuando no es el de serie; se lee
de ahí al cargar; y no aparece en otros tipos. Medido con un texto de veinte
palabras: 152×117 a 120, 219×86 a 200, 317×71 a 300.

Una caja con fórmula no lo respetaba, porque Mermaid la mide como una fila
sin saltos de línea antes de que Sirena la recomponga
([ADR 22](0022-las-formulas-se-escriben-con-latex-y-se-editan-con-edicuatex.md)).
Se deja partir ya en el elemento de medida, con una regla de CSS, y con eso
la caja con fórmula sale al mismo ancho que las demás (482 frente a 813 a
450 píxeles).

## Consecuencias

Al elegir un color principal, el dibujo pasa al tema base de Mermaid, porque es
el que admite variables de color; el selector de tema deja de notarse mientras
haya un color elegido. Los ajustes no quedan dentro del archivo `.mmd`: quien
abra ese archivo en otro editor verá el diagrama con el aspecto de serie.
