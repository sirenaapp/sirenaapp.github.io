# 32. El tema blanco y negro es un tema de todo el diagrama

Fecha: 2026-09-28 · Estado: aceptado

## Contexto

Un diagrama que se imprime en una impresora de tinta negra, o se fotocopia,
pierde los colores: los rellenos claros salen como grises parecidos entre sí y
los tonos de los temas de Mermaid gastan tóner sin aportar nada. Hacía falta una
forma de dejar el diagrama en blanco y negro sin rehacerlo.

Sirena ya ofrece en el menú de temas los de Mermaid y una lista de colores
(azul, verde, naranja, morado, gris), que se escriben en la cabecera del
diagrama como `theme: 'base'` con sus `themeVariables`. Esos colores sirven
también de muestras para colorear una caja, una flecha o el fondo de los
rótulos.

## Decisión

Se añade «Blanco y negro» a la lista de colores del menú de temas. Escribe en la
cabecera un tema `base` con cajas, notas y grupos blancos, y bordes, líneas y
texto en negro. Lo que Mermaid solo distingue por el color va en grises:

- los sectores, en una serie de grises alternos, opacos (`pieOpacity: '1'`) y
  sin el blanco, porque la leyenda dibuja su cuadro sin borde y no se vería;
- la gráfica XY, con la primera barra en gris medio y la primera línea en negro,
  para que la línea se vea encima de la barra.

Las variables de los sectores y de la gráfica XY solo se escriben en esos tipos
de diagrama, para no alargar la cabecera de los demás.

Es un tema de todo el diagrama: no aparece entre las muestras de color de una
caja o una flecha (en `COLORS` lleva `{ soloTema: true }` y las muestras salen
de `COLORES_MUESTRA`). Al leer un diagrama, un color de la lista se reconoce por
el relleno, el borde y las líneas, y los sectores que trae el propio tema no
cuentan como colores elegidos a mano.

## Alternativas descartadas

- **Una opción de impresión** que pasara a blanco y negro solo al imprimir o
  exportar. Obliga a mantener un segundo dibujo que no se ve en pantalla y no
  sirve para el diagrama que se inserta en otro sitio (eXeLearning, una
  presentación). Juanjo prefirió el tema de la lista (28-09-2026: «solo tema de
  lista»).
- **Usar el tema `neutral` de Mermaid.** Tiene grises en las cajas y los grupos,
  y colores en los sectores y en otros tipos.
- **Un filtro de escala de grises (CSS) sobre el dibujo.** No viaja con el
  código, así que el diagrama pegado en otro sitio seguiría en color.

## Consecuencias

- El diagrama queda en blanco y negro en el propio código y se ve igual en
  cualquier sitio que lo dibuje con Mermaid.
- La cabecera de los sectores y de la gráfica XY es más larga (unos 900
  caracteres), porque Mermaid necesita cada gris por separado.

## Evidencia

Los 27 ejemplos de Sirena con el tema aplicado, en Chromium y Firefox, con
Mermaid 12.0.0 (`vendor/mermaid/VERSION`): ninguno da error, y se revisó la hoja
de capturas.

## Riesgos y limitaciones

- **Sankey** y **arquitectura** conservan sus colores: Mermaid no los toma de las
  variables del tema (los flujos del Sankey usan su propia paleta y los iconos de
  arquitectura llevan el color dentro).
- Los colores puestos a mano en cajas o flechas (`style`, `classDef`) se
  mantienen: el tema no los sobrescribe.
- Dentro de eXeLearning, Sirena dibuja con el Mermaid de eXe (ADR 29); si su
  versión no conociera alguna de estas variables, la ignoraría y dejaría el
  valor del tema.

## Validación

Script de Playwright que elige el tema en el menú de un diagrama de flujo, uno
de sectores y una gráfica XY: el tema queda marcado, al releer el código se
reconoce como «Blanco y negro», y las muestras de color de caja no lo incluyen.
Después se aplicó a los 27 ejemplos en los dos navegadores.
