# Sirena

Editor libre de diagramas [Mermaid](https://mermaid.js.org/) que funciona por
completo en el navegador: **<https://sirenaapp.github.io>**

No hay cuenta, ni servidor, ni límite de diagramas. El código que se escribe no
sale del equipo, y el enlace para compartir lleva el diagrama comprimido dentro
de la propia dirección.

## Qué permite hacer

- Escribir el diagrama como texto y verlo dibujado al momento.
- Elegir entre 18 ejemplos agrupados por tipo (procesos, tiempo, estructuras,
  datos y comunicación), pensados para el ámbito educativo.
- Cambiar el aspecto del diagrama: los cinco temas de Mermaid y, en el menú de
  aspecto, el trazo (clásico, a mano alzada o moderno), el tamaño del texto, el
  color principal (una paleta de cinco colores, o uno propio con selector
  independiente para el relleno, el borde, las líneas y el texto) y, en los
  diagramas de
  flujo, la forma de las líneas y la distribución. Cada ajuste se escribe en el
  código como cabecera `%%{init: …}%%`, de modo que viaja con el archivo y se ve
  igual en cualquier editor de Mermaid.
- Descargar el resultado en PNG, SVG, página HTML o código `.mmd`, o copiarlo
  como imagen.
- Poner título y descripción accesibles al diagrama, que quedan dentro del SVG y
  leen los lectores de pantalla.
- Recibir un aviso cuando el diagrama sale desproporcionado, con un botón que lo
  pone en horizontal (o en vertical) escribiéndolo en el propio código.
- Consultar la sintaxis del tipo de diagrama que se está escribiendo, en la
  ventana de ayuda, e insertar los fragmentos con una pulsación.
- Abrir y guardar archivos `.mmd`.
- Compartir un enlace que contiene el diagrama, sin subirlo a ningún sitio.
- Incrustar el diagrama en un blog o en un material de eXeLearning, con el botón
  que copia el código listo para pegar.
- Trabajar en castellano, catalán, gallego, euskera o inglés, con los ejemplos y
  la ayuda también traducidos.
- Usarlo en móvil y tableta. El aspecto sigue al del dispositivo mientras no se
  elija otro.

## Incrustar un diagrama en otra página

El botón de incrustar copia un código como este, que se pega en el HTML del
material. El diagrama viaja dentro de la dirección, así que la página incrustada
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

El parámetro `v=1` deja la página con el diagrama solo, sin editor ni barra de
herramientas, y con un enlace discreto para abrirlo y editarlo. El guion es
opcional: sirve para que el marco se ajuste solo al alto del diagrama.

## Cómo funciona por dentro

Es una página estática. Mermaid se sirve desde el propio repositorio
(`vendor/mermaid`), sin CDN ni peticiones a terceros, y se carga por partes: solo
se descarga el código del tipo de diagrama que se está usando.

Para actualizar Mermaid:

```bash
scripts/actualizar-mermaid.sh          # última versión publicada
scripts/actualizar-mermaid.sh 12.0.0   # una versión concreta
```

Una acción programada avisa cada lunes, abriendo una incidencia, cuando Mermaid
publica una versión nueva.

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
