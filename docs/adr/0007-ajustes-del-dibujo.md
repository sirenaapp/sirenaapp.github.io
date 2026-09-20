# 7. El aspecto del dibujo se ajusta con la configuración, sin tocar el código

Fecha: 2026-09-20 · Estado: aceptado

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

## Consecuencias

Al elegir un color principal, el dibujo pasa al tema base de Mermaid, porque es
el que admite variables de color; el selector de tema deja de notarse mientras
haya un color elegido. Los ajustes no quedan dentro del archivo `.mmd`: quien
abra ese archivo en otro editor verá el diagrama con el aspecto de serie.
