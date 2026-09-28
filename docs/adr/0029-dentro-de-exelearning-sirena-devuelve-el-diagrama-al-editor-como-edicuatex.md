# 29. Dentro de eXeLearning, Sirena devuelve el diagrama al editor, como Edicuatex

Fecha: 2026-09-28 · Estado: aceptado

## Contexto

eXeLearning trae un botón para diagramas Mermaid en su editor de texto
(TinyMCE): abre un cuadro con un área de texto donde se pega el código y lo
guarda en la caja como `<pre class="mermaid">…</pre>`, con un ancho y un alto
máximos opcionales. Quien no sabe Mermaid no puede hacer nada con él.

Con las fórmulas, eXe resolvió lo mismo integrando Edicuatex: su botón abre el
editor en una ventana del propio TinyMCE y Edicuatex, al detectar que está
dentro de eXe, escribe el resultado en la caja y cierra la ventana. eXe lo
incorpora desde el paquete de npm con un script que lo copia en su código.
Además, eXe pidió que Edicuatex usara sus traducciones: sus textos en inglés
van en `lang/en.js` dentro de llamadas `_('…')`, que eXe recoge para su
catálogo, y dentro de eXe `_` es su función de traducción. Así, Edicuatex sale
en todos los idiomas de eXe.

El objetivo es entregar a eXe una integración de Sirena lista, por el mismo
camino. Este ADR recoge la parte que corresponde a Sirena. La web
sirenaapp.github.io tiene que seguir funcionando igual en todo momento.

## Decisión

**Detección.** Sirena está en eXe cuando la página de fuera tiene `eXeLearning`
y `tinymce` con un editor activo, se puede leer (mismo origen) y la dirección no
lleva `v=1` (modo visor). En cualquier otro caso el acceso falla o no se cumple
y Sirena funciona como siempre. La web, al no tener página de fuera, nunca
entra en este modo.

**Qué hace en eXe.**

- Al abrirse, carga el diagrama donde está el cursor (`pre.mermaid`), con su
  ancho y alto máximos; si no lo hay, lo seleccionado, como el cuadro de eXe;
  y si tampoco, el diagrama de muestra. Mientras la ventana se carga, el editor
  de eXe pierde la selección, así que el botón de Mermaid de eXe la anota al
  pulsarse (el diagrama, el texto seleccionado y una marca de la posición del
  cursor) y la ofrece con `editor.plugins.exemermaid.getContext()`. Sirena usa
  ese contexto si existe y, si no, la selección del momento. Un diagrama nuevo
  se inserta en la posición anotada.
- El pie se sustituye por una barra con el ancho y el alto máximos (opcionales),
  «Cancelar» e «Insertar». Las medidas siguen las reglas de eXe (número mayor
  que 0 en px, em, rem o %): si eXe ofrece su comprobador
  (`eXeLearning.mermaidMaxSize`) se usa ese, para que las dos reglas no se
  separen nunca.
- «Insertar» escribe `<pre class="mermaid">` con el código escapado y el
  estilo `max-width`/`max-height`, en el mismo formato que el cuadro de eXe.
  Si se abrió desde un diagrama, lo sustituye en su sitio. Todo va en un único
  paso de deshacer de TinyMCE.
- No usa la biblioteca del navegador ni guarda el código en `localStorage`: el
  diagrama vive en el material.
- Se ocultan la biblioteca, compartir, imprimir y el idioma, que no tienen
  sentido dentro de un material. La marca se oculta a la vista porque el título
  lo pone la ventana de eXe, pero el título de la página sigue ahí para los
  lectores de pantalla.
- El botón de fórmula abre la copia de Edicuatex que lleva eXe (la dirección
  `edicuatex_url` de su editor), no la pública: así funciona sin conexión.

**Idiomas.** Se sigue el modelo de Edicuatex. Cada texto de `lang/en.js` va
dentro de `_('…')`; en ese archivo `_` es una función que devuelve el texto tal
cual, así que fuera de eXe no cambia nada. En eXe, cada texto se pide a su
catálogo por la frase inglesa; si eXe aún no la tiene traducida, se usa la
traducción de Sirena, y si Sirena tampoco la tiene, la inglesa. El catálogo de
eXe guarda cada frase tal como está escrita en `lang/en.js`, sin interpretar los
escapes (un apóstrofo entre comillas simples queda como `\'` y un salto de
línea como `\n`), así que, si la frase no aparece tal cual, Sirena la pide
también en esa forma escrita y convierte los `\n` de la respuesta en saltos de
línea (versión 1.0.2). La lengua de
los ejemplos y del diagrama de muestra es la de eXe si Sirena la tiene; el
valenciano toma la del catalán y el resto, la del inglés. Los textos de la
barra nueva repiten las frases del cuadro de Mermaid de eXe («Max. width
(optional)», «Insert»…), que eXe ya tiene traducidas a todos sus idiomas.

## Alternativas descartadas

- **Mantener un catálogo de traducciones solo de Sirena dentro de eXe.** Es lo
  que eXe pidió cambiar en Edicuatex: los textos quedarían fuera de su sistema
  de traducción y solo estarían en las cinco lenguas de Sirena.
- **Pasar el código por la dirección (`?sel=`), como Edicuatex.** Un diagrama
  puede ser largo, y leerlo del editor permite además recuperar el ancho y el
  alto y sustituir el bloque en su sitio.
- **Insertar el diagrama como imagen SVG.** Se vería idéntico, pero dejaría de
  ser editable con el cuadro de eXe y no pasaría por su dibujo ni por su
  exportación.

## Consecuencias

- Todo texto nuevo de la interfaz se escribe en `lang/en.js` dentro de `_()`.
- La parte de eXe (dependencia de npm, script que copia Sirena, botón que la
  abre, pruebas) se prepara aparte, en una rama del fork de eXe.
- Mientras eXe use Mermaid 11 y Sirena la 12, lo que se ve en Sirena puede no
  coincidir con lo que dibuja eXe (tipos en beta como Venn o Ishikawa, motor
  elk). Se resolverá cuando eXe pase a Mermaid 12 o cuando Sirena use, dentro
  de eXe, el Mermaid de eXe.

## Evidencia

- Edicuatex: `lang/en.js` y `js/edicuatex-tools.js` (detección de eXe y uso de
  `parent._`) en `edicuatex/edicuatex.github.io`, commit `c7e498f`.
- eXe: el extractor de traducciones (`src/cli/commands/translations.ts`) recoge
  las llamadas `_('…')` de `public/app/**/*.js`, donde queda la copia de
  Edicuatex; el cuadro de Mermaid está en
  `public/libs/tinymce_5/js/tinymce/plugins/exemermaid/plugin.min.js` y las
  reglas de medidas en `public/app/common/mermaidMaxSize.js` (commit
  `f64d72fb5` de `exelearning/exelearning`).
- La función `_` de eXe (`public/app/locate/locale.js`) quita la marca `~` de
  las traducciones pendientes de revisar.

## Riesgos y limitaciones

- Hay servidores que sirven la página como carpeta sin barra final (el que usa
  eXe para sus pruebas de la versión estática, `serve`, redirige
  `…/sirena/index.html` a `…/sirena`). Sin la barra, las rutas relativas de
  Sirena apuntan a la carpeta de arriba y no carga ni su CSS ni su código. Desde
  la versión 1.0.3, un pequeño guion al principio de `index.html` vuelve a
  cargar la página con la barra; una marca en `sessionStorage` evita el bucle
  con un servidor que la quite, y se borra al cargar bien. No usa `<base>`,
  como Edicuatex, porque cambiaría la resolución de las referencias `#id` de
  los iconos SVG.

- En la aplicación de escritorio de eXe (Electron), la ventana emergente de
  Edicuatex que abre el botón de fórmula no se ha probado: hipótesis pendiente
  de validación.
- Por un fallo de eXe, al guardar una caja cada `$$` pasa a ser `$`, y las
  fórmulas de los diagramas no se dibujan
  ([exelearning#2475](https://github.com/exelearning/exelearning/issues/2475)).
  Sirena escribe el código bien; la corrección depende de eXe.
- La detección exige mismo origen: Sirena tiene que ir copiada dentro de eXe,
  como Edicuatex. Abierta desde sirenaapp.github.io en un marco de eXe, no
  entra en este modo.

## Validación

28-09-2026, con la rama de eXe que abre Sirena desde su botón de Mermaid: sus
cuatro pruebas E2E de ese botón (insertar y dibujar, editar un diagrama, el
prerrenderizado al previsualizar y conservar otros estilos al cambiar el ancho)
pasan en Chromium y en Firefox. Esas pruebas mostraron que, en los dos
navegadores, cuando Sirena termina de cargar el editor ya ha perdido la
selección (se leía `P` en vez de `PRE`): de ahí el contexto que anota el botón,
añadido en la versión 1.0.1. Con el servidor de eXe en francés, «Don't show
again» solo se traducía al pedirlo en su forma escrita, `Don\'t show again`: de
ahí la segunda consulta de la versión 1.0.2, con la que aparece «Ne plus
afficher».

Antes, en Chromium y Firefox:

- Con una página que carga el TinyMCE y el comprobador de medidas de eXe:
  insertar un diagrama nuevo con `<`, `&` y `$$…$$` (se escapa y vuelve
  intacto), rechazar «abc» como ancho con el mensaje de eXe, volver a abrir el
  diagrama y sustituirlo en su sitio, deshacerlo en un paso, cancelar sin
  cambios, no escribir nada en `localStorage`, y el idioma: francés con
  traducción de eXe, catalán y valenciano con la de Sirena.
- En eXe 4.0.5 (versión web de la aplicación instalada, con Sirena copiada en
  `app/common/sirena`): insertar desde una caja de texto, guardar la caja y ver
  el diagrama dibujado por eXe con su ancho máximo; volver a abrirlo con su
  código y su ancho; el botón de fórmula abre el Edicuatex de eXe y la fórmula
  vuelve al rótulo.
- La web, sin cambios: `probar-web` en Chromium, Firefox y WebKit, escritorio,
  móvil y tableta, claro y oscuro, sin errores; biblioteca e idioma como antes;
  los textos en inglés de `lang/en.js`, idénticos a los anteriores.
- axe (WCAG 2.1 AA y buenas prácticas) sobre Sirena en eXe, claro y oscuro: sin
  incidencias. De paso se corrigió el contraste del botón principal en oscuro,
  que también afectaba a las ventanas de la web.
