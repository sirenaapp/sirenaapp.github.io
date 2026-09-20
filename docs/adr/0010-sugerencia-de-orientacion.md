# 10. La página propone la dirección en lugar de maquillar el resultado

Fecha: 2026-09-20 · Estado: descartado el 20-09-2026, tras probarlo

## Contexto

Un diagrama de flujo largo sale en una columna estrecha y muy alta, y el
[ADR 9](0009-ajuste-de-la-vista.md) solo arreglaba cómo se mira: seguía siendo
un diagrama mal repartido. Cambiar el motor de trazado no sirve, porque los
algoritmos que reparten mejor pierden el orden de los pasos.

## Decisión

Cuando el diagrama dibujado es más de dos veces más alto que ancho —o al revés,
muy apaisado—, la página muestra un aviso con un botón que cambia la dirección
del diagrama. El cambio se escribe en el código con la sintaxis de siempre
(`flowchart LR` o una línea `direction`), de modo que el archivo sigue valiendo
en cualquier editor de Mermaid y en cualquier versión futura.

El aviso no vuelve a aparecer después de aceptarlo ni después de cambiar la
dirección a mano, hasta que se toque el código. Quien lo cierra, no lo vuelve a
ver para ese diagrama.

## Alternativas descartadas

- **Cambiar la dirección por cuenta propia.** Descartada: el código es del
  usuario y no se toca sin que lo pida.
- **Reorganizar el SVG ya dibujado.** Descartada: dependería de cómo Mermaid
  construye el dibujo por dentro y se rompería en cuanto cambiara de versión.
- **Cambiar de motor de trazado.** Descartada por lo medido en el
  [ADR 9](0009-ajuste-de-la-vista.md): reordena los pasos.

## Por qué se descartó

Al usarlo se vio que no arregla nada: el mismo diagrama en horizontal queda
igual de desproporcionado, solo que tumbado, y sigue sin leerse de un vistazo.
El aviso, por tanto, solo molestaba. Se retiró el mismo día.

Queda escrito para que no se vuelva a intentar: en un diagrama de flujo largo,
ni el motor de trazado (ver [ADR 9](0009-ajuste-de-la-vista.md)) ni la dirección
resuelven el problema. Lo único que hay hasta ahora es el ajuste de la vista, y
lo que de verdad lo arreglaría es partir el diagrama en varios más pequeños,
que es decisión de quien lo escribe.
