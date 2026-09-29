# 33. Al elegir un tema se decide antes si se quitan los colores puestos a mano

Fecha: 2026-09-29 · Estado: aceptado

## Contexto

El tema (menú de temas: los de Mermaid, la lista de colores y «Color propio»)
se escribe en la cabecera del diagrama. Los colores dados a un elemento van
aparte y se ven por encima del tema:

- en el cuerpo, las líneas `style`, `classDef` y `linkStyle` (con su asignación
  `class`, `cssClass` o `:::clase`), que escriben el menú de colores, el botón
  derecho y el formato de los bloques ([ADR 28](0028-formato-de-los-bloques-con-style-propio-y-una-clase-comun.md));
- en la cabecera, el fondo de los rótulos de flecha (`edgeLabelBackground`) y
  los colores de los sectores (`pie1`, `pie2`…) que no son los del tema.

Hasta ahora, elegir un tema los conservaba siempre. Quien quería ver el tema
entero tenía que quitarlos uno a uno o usar «Limpiar formato», que se lleva
también el trazo, la tipografía y los grosores
([ADR 27](0027-limpiar-formato-deja-el-diagrama-sin-aspecto-propio-y-conserva-su-estructura.md)).
Juanjo pidió (29-09-2026) que al aplicar un tema se pudiera elegir, antes o
preguntando, si se borran esos colores, y que no se diga nada si no los hay.

## Decisión

El menú de temas lleva arriba, antes de la lista, la casilla «Quitar los colores
puestos a mano», con un «?» que explica qué son. Solo aparece si el diagrama los
tiene, y se abre siempre sin marcar: sin marcarla, el tema se aplica como hasta
ahora y los colores se conservan.

Con la casilla marcada, al elegir un tema:

- de cada línea `style`, `classDef` y `linkStyle` se quitan las propiedades de
  color (`fill`, `stroke`, `color`, `background`, `background-color`) y se
  queda el resto, como el grosor o el trazo discontinuo; la línea que se queda
  vacía se borra, y una clase borrada deja de asignarse;
- se quitan el fondo de los rótulos y los colores propios de los sectores;
- el cambio es una sola acción que «Deshacer» recupera entera, salvo con
  «Color propio», que antes dibuja el diagrama sin esos colores para partir de
  los del tema y deja dos pasos.

El fondo de los rótulos que se ve con «Color propio» es parte de esa paleta: no
cuenta como puesto a mano y no pasa al tema siguiente. Tampoco cuenta el que
escribe un color de la lista, que va a juego con su relleno
([ADR 34](0034-los-colores-de-la-lista-escriben-a-juego-los-fondos-que-mermaid-sacaria-girando-el-tono.md)).

Al leer un diagrama, el fondo de los rótulos se toma de lo que diga la
cabecera. Antes solo se leía con «Color propio», así que con otro tema se perdía
al cambiar cualquier ajuste de aspecto, y podía pasar el de un diagrama a otro.

## Alternativas descartadas

- **Preguntar con una ventana al elegir el tema.** Interrumpe cada vez que se
  prueban temas seguidos, y el navegador no deja dar estilo ni traducir los
  botones de `confirm()`.
- **Quitarlos siempre.** Se pierde un trabajo hecho a mano sin avisar.
- **Un botón aparte para quitarlos.** Ya existe «Limpiar formato» para quitar
  todo; un segundo botón para una parte duplicaría la función fuera del sitio
  donde se decide, que es el menú de temas.
- **Recordar la casilla marcada.** Una elección que borra no debe quedarse
  puesta para la próxima vez sin que se vea.

## Consecuencias

- Se puede ver un tema tal cual en un diagrama coloreado a mano sin tocar el
  código ni perder el trazo o los grosores.
- Las propiedades de color de las líneas de estilo que Sirena reconoce son las
  cinco citadas; otra propiedad de color que se escriba a mano (por ejemplo
  `stop-color`) no se quita.

## Evidencia

Script de Playwright sobre `index.html` servido en local, en Chromium y
Firefox, con Mermaid 12.0.0 (`vendor/mermaid/VERSION`): casilla oculta sin
colores a mano y visible con ellos; sin marcar se conservan; marcada, un
diagrama de flujo con `style`, `classDef` con `:::` y `linkStyle` queda con
`style B stroke-width:3px` y `linkStyle 0 stroke-width:4px`; «Deshacer» lo
recupera; con «Color propio» se conservan los grosores; y se quitan también los
sectores de un gráfico circular, el fondo de los rótulos, las clases de un
diagrama de clases (`cssClass`) y el relleno de la clase de bloques, que
conserva su trazo discontinuo. Sin errores de JavaScript.

## Riesgos y limitaciones

- Los fondos de región del diagrama de secuencia (`rect rgb(…)`) no se tocan:
  forman parte de la estructura del diagrama, no de un elemento.

## Validación

La prueba anterior, más una captura en móvil con tema oscuro y en castellano
para comprobar que la casilla cabe en el menú.
