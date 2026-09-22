# Sirena

Editor libre de diagramas [Mermaid](https://mermaid.js.org/) que funciona por
completo en el navegador: **<https://sirenaapp.github.io>**

No hay cuenta, ni servidor, ni límite de diagramas: se pueden hacer todos los
que se quiera. Solo la biblioteca del navegador tiene un máximo de diagramas
guardados, que se elige entre 10 y 100. El código que se escribe no sale del
equipo, y el enlace para compartir lleva el diagrama comprimido dentro de la
propia dirección.

## Qué permite hacer

- Escribir el diagrama como texto y verlo dibujado al momento. Encima del
  código hay una barra con todo lo que cambia el dibujo, repartido por temas:
  un botón que escribe la línea que define el tipo de diagrama (con los 22
  tipos agrupados como los ejemplos, el mapa conceptual entre ellos); un
  desplegable con las cuatro orientaciones, en los diagramas que la admiten;
  el menú de colores, con el color principal de todo el diagrama y el color
  del elemento donde está el cursor (o de los seleccionados), de toda la caja,
  solo del texto, solo del borde o de la flecha de esa línea, escrito en el
  código como línea `style`, clase `classDef` o `linkStyle`; el trazo; el tamaño del texto, de la lista o
  escrito en píxeles; el motor de distribución (dagre
  y los nueve algoritmos de ELK que trae Mermaid, cada uno con una línea que
  dice cómo reparte los elementos); y un botón por cada ajuste que ese motor y
  ese tipo de diagrama atienden (líneas, con la forma solo con dagre y el
  grosor de todas las flechas y bordes o de la flecha y el borde donde está el
  cursor; separación con dagre; unir flechas con ELK por capas; márgenes;
  numeración de mensajes; valores en sectores), en flujo un botón con las 52
  formas de caja que dibuja Mermaid, para el elemento donde está el cursor, y
  un botón que inserta un salto de línea (`<br>`) y otros dos que ponen el
  texto en negrita o en cursiva, en los tipos cuyos rótulos lo admiten. El botón de título y descripción accesibles está también aquí.
- Dar formato desde el propio dibujo: el botón derecho sobre una caja, una
  flecha o el fondo abre las opciones que le corresponden y lleva el cursor del
  editor a su línea, y el doble clic sobre una caja o sobre el texto de una
  flecha permite escribirlo encima del propio dibujo, con una barrita de
  botones para la negrita, la cursiva, el salto de línea y la fórmula. En los diagramas de flujo
  se trazan flechas arrastrando desde los puntos que aparecen al pasar el ratón
  sobre una caja (soltando en el vacío se crea la caja de destino), el doble
  clic en el lienzo vacío añade una caja, y desde el menú se borra una caja
  (con sus flechas) o una flecha suelta. En pantalla táctil, la pulsación larga; con Mayús se deja
  pasar el menú del navegador. Un aviso flotante sobre el lienzo lo
  cuenta al entrar, solo cuando el diagrama es de flujo o un mapa conceptual,
  y se retira al usarlo o al cerrarlo.
- Elegir entre 25 ejemplos agrupados por tipo (procesos, tiempo, estructuras,
  datos y comunicación), pensados para el ámbito educativo.
- Cambiar el aspecto del diagrama: en el menú de colores, los cinco temas de
  Mermaid (escritos en la cabecera del código, como todo lo demás) y, en la
  barra del editor, el trazo (clásico, a mano alzada o moderno), el tamaño del texto, el
  color principal (una paleta de cinco colores, o uno propio con selector
  independiente para el relleno, el borde, las líneas, el texto y el fondo de
  los rótulos de flecha) y, en los
  diagramas de
  flujo, la forma de las líneas y la distribución. Cada ajuste se escribe en el
  código como cabecera `%%{init: …}%%`, de modo que viaja con el archivo y se ve
  igual en cualquier editor de Mermaid.
- Descargar el resultado en PNG, SVG, página HTML o código `.mmd`, o copiarlo
  como imagen. El PNG se puede pedir a 1×, 2× o 4× del tamaño de pantalla y con
  fondo blanco, transparente o el del editor.
- Imprimir el diagrama o guardarlo en PDF, en una hoja A4 que toma la
  orientación de la forma del diagrama.
- Escribir fórmulas matemáticas en los rótulos, con LaTeX entre `$$…$$`, a mano
  o con el editor [Edicuatex](https://edicuatex.github.io/), que se abre desde
  la barra y devuelve la fórmula al diagrama. Los signos `<` y `>` se
  escriben `\lt` y `\gt`, porque Mermaid los convierte en entidades HTML
  antes de componer la fórmula. La negrita y la cursiva no se pueden combinar
  con una fórmula en el mismo rótulo, porque Mermaid deja el marcado a la
  vista. Hay un ejemplo con fórmulas, el mapa conceptual de la ecuación de
  segundo grado, y la chuleta de cada tipo que las dibuja lleva su fragmento.
- Poner título y descripción accesibles al diagrama, que quedan dentro del SVG y
  leen los lectores de pantalla. En los tipos que no los admiten (mapa mental,
  kanban, línea del tiempo, bloques, Sankey, Venn e Ishikawa) se guardan como
  comentario `%% accTitle:` en el código, para que viajen con él.
- Consultar la sintaxis del tipo de diagrama que se está escribiendo, en la
  ventana de ayuda, e insertar los fragmentos con una pulsación.
- Abrir y guardar archivos `.mmd`, también arrastrándolos sobre la ventana.
- Guardar los diagramas en el propio navegador, con nombre, y volver a abrirlos
  otro día: al entrar aparece el último en el que se estaba trabajando. Sustituir
  todo el texto abre un diagrama nuevo y conserva el anterior, y la biblioteca
  tiene un máximo de diagramas guardados que se puede cambiar.
- Sacar una copia de seguridad de la biblioteca en un archivo `.json` y volver a
  importarla, para llevar los diagramas a otro navegador o recuperarlos si se
  borran los datos de este.
- Compartir un enlace que contiene el diagrama, sin subirlo a ningún sitio: al
  editor, para que quien lo reciba siga trabajando con el código, o a pantalla
  completa, con el diagrama solo ocupando toda la ventana.
- Incrustar el diagrama en cualquier página web —un blog, una web propia o un
  material didáctico—, con la opción que copia el código listo para pegar.
- Trabajar en castellano, catalán, gallego, euskera o inglés, con los ejemplos y
  la ayuda también traducidos.
- Usarlo en móvil y tableta: el diagrama se arrastra con un dedo y se amplía
  pellizcando. El aspecto sigue al del dispositivo mientras no se
  elija otro.

## Incrustar un diagrama en otra página

La opción «Código para incrustar», dentro del botón de compartir, copia un
código como este, que se pega en el HTML de cualquier página. El diagrama viaja dentro de la dirección, así que la página incrustada
tampoco depende de ningún servidor:

```html
<iframe src="https://sirenaapp.github.io/#z=…&v=1" title="Diagrama" loading="lazy"
        style="width:100%;height:420px;border:1px solid #d3dde0;border-radius:8px"></iframe>
<script>
addEventListener('message', function (e) {
  if (!e.data || e.data.sirena !== 'altura') return;
  document.querySelectorAll('iframe').forEach(function (marco) {
    if (marco.contentWindow === e.source) marco.style.height = e.data.altura + 'px';
  });
});
</script>
```

El parámetro `v=1` deja la página con el diagrama solo, sin editor, barra de
herramientas ni nada de edición sobre el dibujo, y con un enlace discreto para
abrirlo y editarlo. El guion es
opcional: sirve para que el marco se ajuste solo al alto del diagrama. Ese mismo
parámetro lo lleva el enlace a pantalla completa, que se copia desde el botón de
compartir y se envía tal cual a quien solo tiene que ver el diagrama.

## Cómo funciona por dentro

Es una página estática. Mermaid se sirve desde el propio repositorio
(`vendor/mermaid`), sin CDN ni peticiones a terceros, y se carga por partes: solo
se descarga el código del tipo de diagrama que se está usando.

Para actualizar Mermaid:

```bash
scripts/actualizar-mermaid.sh          # última versión publicada
scripts/actualizar-mermaid.sh 12.0.0   # una versión concreta
node scripts/generar-formas-iconos.mjs # y rehacer las miniaturas del menú de formas
```

Una acción programada avisa cada lunes, abriendo una incidencia, cuando Mermaid
publica una versión nueva.

Los archivos propios de CSS y JavaScript se enlazan con una huella de su
contenido (`js/sirena.js?v=…`), para que el navegador no siga sirviendo una
versión guardada. Al tocar uno de ellos se pasa `scripts/sellar-version.sh`
antes de confirmar los cambios.

Las decisiones técnicas que condicionan el proyecto están en [docs/adr](docs/adr).

## Licencias

Código bajo [AGPL v3](LICENSE.txt) y contenidos bajo
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).
Mermaid es de Knut Sveidqvist y colaboradores, con licencia MIT
([vendor/mermaid/LICENSE.txt](vendor/mermaid/LICENSE.txt)). Los iconos son de
[Lucide](https://lucide.dev), con licencia ISC
([vendor/lucide/LICENSE.txt](vendor/lucide/LICENSE.txt)).

Sirena es un proyecto independiente y no está asociado con el proyecto Mermaid
ni con Mermaid Chart.

© [Juan José de Haro](https://bilateria.org)
