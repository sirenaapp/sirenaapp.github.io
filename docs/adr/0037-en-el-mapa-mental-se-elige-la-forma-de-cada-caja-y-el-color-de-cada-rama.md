# 37. En el mapa mental se elige la forma de cada caja y el color de cada rama

Fecha: 2026-10-06 · Estado: aceptado

## Contexto

El mapa mental solo tenía ajustes de todo el diagrama (tema, trazo, letra y,
desde el [ADR 36](0036-el-grosor-de-las-ramas-del-mapa-mental-se-escribe-en-la-cabecera.md),
el grosor de las ramas). Para cambiar la forma de una caja había que conocer su
sintaxis, y no había forma de dar color a una rama.

Lo que Mermaid 12.1.0 permite en un mapa mental:

- **Siete formas**, cada una con sus marcas: por defecto (sin marcas), cuadrado
  `id[…]`, redondeado `id(…)`, círculo `id((…))`, hexágono `id{{…}}`, nube
  `id)…(` y explosión `id))…((`. No admite la forma nueva del diagrama de flujo
  (`@{ shape: … }`).
- **Color por rama, no por caja.** Mermaid colorea cada rama que sale del centro
  (caja, subcajas y líneas) con una variable del tema: `cScale1` la primera,
  `cScale2` la segunda… y `git0` el centro. No tiene `style` ni `classDef` para
  una caja suelta, ni `linkStyle` para una línea.

## Decisión

**Forma.** El botón de forma de la barra, en un mapa mental, abre un
desplegable con las siete formas dibujadas tal como las pinta Mermaid
(`scripts/generar-formas-iconos.mjs` las genera en un mapa mental, porque su
nube y su explosión no son las del diagrama de flujo), para la caja del cursor
o para todas. Con el botón derecho sobre una caja, «Forma de la caja» se
despliega como submenú. Al pasar a una forma con marcas, la caja que no tenía
identificador recibe uno libre (`n1`, `n2`…); el texto con negrita o cursiva se
pone entre comillas y acentos graves, y el que lleva paréntesis, entre comillas.
La forma por defecto no admite en el texto paréntesis, corchetes ni llaves
(Mermaid los toma por otra forma y, con los rótulos como texto SVG, no traduce
sus códigos `#40;`): si alguna caja los lleva, esa opción aparece desactivada y
su rótulo emergente dice por qué.

**Color.** Con el botón derecho sobre una caja o una rama, o con el botón de
color de la barra y el cursor en la línea de una caja, se elige el color de su
rama (o del centro): la paleta de siempre, otro color o quitarlo. Se escribe en
la cabecera, en `themeVariables`, junto con el color de su texto (`cScaleLabel1`…
o `gitBranchLabel0`), negro o blanco según cuál contraste más, porque Mermaid no
lo ajusta solo. «Quitar los colores puestos a mano» y «Limpiar formato» los
quitan.

**Compatibilidad con eXeLearning.** Dentro de eXe, Sirena dibuja con el Mermaid
de eXe ([ADR 29](0029-dentro-de-exelearning-sirena-devuelve-el-diagrama-al-editor-como-edicuatex.md)),
y con él se exporta el material: la copia que sirve su editor es la 11.12.0
(aunque su `package.json` pide la 11.17.2) y dibuja los rótulos en HTML. En esa
versión las formas, el grosor y el color de las ramas funcionan igual, pero el
color del texto (`cScaleLabel…`) solo se aplica a los rótulos SVG: con HTML el
texto queda negro. Por eso, cuando el texto de una rama tiene que ser blanco,
se escribe además en `themeCSS` (`.section-0 span{color:#ffffff}`; el centro,
`.section-root span`), que esa versión sí respeta. Con un color claro no se
escribe nada más. Mermaid 11.17.2 y la 12 ya aplican `cScaleLabel…` también en
HTML.

## Alternativas descartadas

- **Colorear cajas sueltas con `themeCSS`.** Mermaid no da a cada caja una
  clase propia estable, y el resultado no se parecería a lo que hace Mermaid
  con el color de las ramas.
- **Las formas en la ventana grande del diagrama de flujo.** Son siete: caben
  en un desplegable, que es más rápido.

## Consecuencias

La forma y el color se cambian desde el dibujo y viajan en el código, que se ve
igual en cualquier editor de Mermaid. Mermaid tiene once colores de rama: la
duodécima rama comparte color con la primera, y cambiar uno cambia los dos.

## Evidencia

Medido con Mermaid 12.1.0 solo: las cajas se numeran en el orden del código
(`node_0` es el centro) y las ramas llevan el número de sus dos cajas
(`edge_1_3`); `cScale1` colorea la caja, las subcajas y las líneas de la primera
rama; con un color oscuro (`#1f3a93`) el texto queda negro si no se da
`cScaleLabel1`; la rama 12 vuelve a la sección 0.

## Validación

06-10-2026, en Chromium y Firefox: forma de una caja desde el submenú del botón
derecho y desde el desplegable de la barra, todas las cajas en una forma y de
vuelta a la de por defecto; color de una rama desde la paleta, desde un color
propio oscuro (texto blanco) y desde la barra; color del centro; sin errores de
JavaScript y los 27 ejemplos en cinco idiomas, sin fallos. Con el Mermaid de
eXe (11.12.0, `public/app/common/mermaid/mermaid.min.js` de su rama principal) y
su configuración: las siete formas, el grosor (3 y 1,5 px), la negrita, la
numeración de cajas y ramas que usa el botón derecho, y una rama y un centro
oscuros escritos por Sirena, con el texto en blanco.
