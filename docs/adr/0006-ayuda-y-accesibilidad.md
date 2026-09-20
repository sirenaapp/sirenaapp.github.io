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
cualquier sitio donde se inserte.

Los ejemplos también están traducidos a los cinco idiomas, y al cambiar de
idioma el ejemplo que esté cargado se sustituye por su versión traducida.

## Alternativas descartadas

- **Enlazar la documentación oficial y ya está.** Descartada: está en inglés y
  obliga a salir de la página.
- **Campos de título y descripción siempre visibles.** Descartados para no
  cargar la interfaz con algo que no se toca en cada diagrama.
- **Traducir solo los rótulos de los ejemplos.** Descartado: un ejemplo con el
  menú en gallego y el contenido en castellano no sirve de modelo.

## Consecuencias

La chuleta cubre once tipos de diagrama, los más usados en clase. Para el resto,
la ayuda remite a la referencia de Mermaid. Al añadir un tipo nuevo hay que
escribir sus filas en los cinco idiomas.
