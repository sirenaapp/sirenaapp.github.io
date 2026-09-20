# 14. La impresión se monta en una hoja aparte, sin biblioteca de PDF

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Falta una forma de llevar el diagrama al papel o a un PDF. Los formatos que ya
se descargan (PNG, SVG, HTML y `.mmd`) sirven para insertar el diagrama en otro
documento, pero no para imprimirlo tal cual ni para obtener un PDF de una hoja.

## Decisión

Un botón propio de la barra, con el icono de impresora de Lucide, abre el
diálogo de impresión del navegador. Desde ahí se imprime en papel o se elige
«Guardar como PDF», que es la manera habitual de obtener el archivo.

La hoja se monta en un marco (`iframe`) aparte, con su propia página: el SVG
exportado, el título y la descripción accesibles como pie, y hoja A4 con
márgenes de 12 mm. El fondo es siempre blanco, aunque se esté trabajando en modo
oscuro, y la orientación sale de la forma del diagrama: apaisada cuando es más
ancho que alto y vertical en los demás casos. El dibujo se amplía hasta llenar
la hoja, ya que es vectorial y no pierde calidad al agrandarse.

No se añade ninguna biblioteca para generar el PDF. El navegador ya lo hace, y
el resultado conserva el texto seleccionable y las líneas vectoriales.

## Alternativas descartadas

- **Imprimir la propia página con reglas `@media print`.** Descartada: obligaría
  a esconder una por una la barra, el editor, el pie y los controles de la
  vista, y a deshacer la ampliación y el desplazamiento del lienzo. Cualquier
  añadido posterior a la interfaz habría que acordarse de esconderlo también.
- **Generar el PDF con una biblioteca como jsPDF y svg2pdf.** Descartada: es
  alrededor de un megabyte que habría que guardar en el repositorio
  ([ADR 1](0001-mermaid-en-el-repositorio.md)) y mantener actualizado, para
  hacer peor lo que el navegador ya hace bien.
- **Una entrada más en el menú de descargas.** Descartada: ese menú se abre con
  el icono de descargar y se llama «Descargar el diagrama», e imprimir no es
  descargar.

## Consecuencias

El tamaño de la hoja y los márgenes quedan escritos en el código de la página de
impresión. Quien necesite otro tamaño puede cambiarlo en el propio diálogo del
navegador, que manda sobre lo que pide la página.

Un diagrama muy alargado se imprime pequeño en la dirección corta de la hoja,
porque se conservan sus proporciones. En esos casos conviene cambiar antes la
dirección del diagrama en el menú de aspecto, como ya recomienda el
[ADR 10](0010-sugerencia-de-orientacion.md).
