# 6. La ayuda de sintaxis y los textos accesibles viven dentro de la página

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Quien prepara materiales no suele conocer la sintaxis de Mermaid, y la
documentación oficial está en inglés. Además, un diagrama publicado sin título
ni descripción no es accesible para quien usa un lector de pantalla.

## Decisión

La ventana de ayuda muestra la sintaxis del tipo de diagrama que se está
escribiendo, detectado a partir del propio código (`js/sintaxis.js`). Cada línea
es un fragmento que se inserta en el editor al pulsarlo, con su explicación en
los cinco idiomas de la interfaz.

El título y la descripción accesibles se editan en una ventana propia y se
guardan en el código como `accTitle` y `accDescr`, que es el mecanismo estándar
de Mermaid: acaban dentro del SVG, de modo que viajan con el diagrama a
cualquier sitio donde se inserte. Desde el 22-09-2026 el botón está en la barra
del editor y, en los tipos que no admiten esas dos órdenes, el título y la
descripción se guardan como comentario (ver [ADR 20](0020-una-barra-encima-del-codigo-para-empezar-orientar-y-colorear.md)).

Los ejemplos también están traducidos a los cinco idiomas, y al cambiar de
idioma el ejemplo que esté cargado se sustituye por su versión traducida.

### Revisión del 23-09-2026

Una revisión con axe-core 4.13 (reglas WCAG 2.1 A y AA y buenas prácticas) y
con el teclado, en escritorio con tema claro y oscuro, con menús y ventanas
abiertos y en móvil, llevó a estos cambios:

- El separador entre el código y el dibujo tiene nombre («Ancho del panel del
  código») y dice su valor (`aria-valuenow`, del 15 al 75 %).
- Cada ventana toma su nombre de su título (`aria-labelledby`); al abrirse, el
  foco entra en ella, y al cerrarse vuelve a donde estaba.
- Al cerrar un menú de la barra con Escape, el foco vuelve a su botón.
- El editor de código marca el foco cuando se llega con el teclado.
- El color de acento y el gris secundario del tema claro se oscurecen un poco
  (`#0c7585` y `#5a6d75`) para llegar a 4,5 sobre el fondo de las opciones
  marcadas; antes daban 4,21 y 4,46.
- Con la página en modo oscuro y el diagrama en el tema predeterminado, el
  fondo de los rótulos de flecha pasa de `#585858` a `#505050` (contraste
  5,02 en vez de 4,43). No se escribe en el código: solo vale mientras el
  diagrama sigue al modo de la página, y Mermaid se vuelve a iniciar al dejar
  de seguirlo, para que no pase a otros temas. Con el tema «Oscuro» elegido
  queda el 4,43 de Mermaid.
- Los créditos, las licencias y la declaración de uso de IA (nivel 4 del
  MIAE) van en su propia ventana, con un botón de información en la barra
  superior, y no en la ayuda, que es la de la sintaxis: así lo pidió el autor.
  La lista completa de las bibliotecas que incluye Mermaid está en
  `vendor/mermaid/TERCEROS.md`.

El dibujo no se recorre con el teclado: el menú del botón derecho es un atajo,
y todo lo que ofrece está también en la barra del editor, que actúa sobre el
elemento de la línea donde está el cursor.

## Alternativas descartadas

- **Enlazar la documentación oficial y ya está.** Descartada: está en inglés y
  obliga a salir de la página.
- **Campos de título y descripción siempre visibles.** Descartados para no
  cargar la interfaz con algo que no se toca en cada diagrama.
- **Traducir solo los rótulos de los ejemplos.** Descartado: un ejemplo con el
  menú en gallego y el contenido en castellano no sirve de modelo.

## Consecuencias

La chuleta cubre los veintiún tipos de diagrama que tienen ejemplo en el menú
(empezó con once, los más usados en clase, y el 22-09-2026 se completó con los
diez restantes). Para cualquier otro, la ayuda remite a la referencia de
Mermaid. Al añadir un tipo nuevo a los ejemplos hay que escribir también sus
filas en los cinco idiomas, para que ejemplos y chuleta vayan a la par.
