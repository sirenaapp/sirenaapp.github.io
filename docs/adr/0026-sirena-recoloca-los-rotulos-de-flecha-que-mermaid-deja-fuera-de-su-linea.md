# 26. Sirena recoloca los rótulos de flecha que Mermaid deja fuera de su línea

Fecha: 2026-09-22 · Estado: aceptado

## Contexto

En el ejemplo del diagrama de flujo, el rótulo «Sí» que sale del primer rombo
no queda centrado sobre su línea, sino unos píxeles a la derecha (6 px en
Sirena, 3 px con Mermaid solo). Los demás rótulos del ejemplo sí están sobre
su línea.

Es un fallo de Mermaid 12.0.0 con el motor ELK. Después de trazar las
flechas, Mermaid quita el escalón con que una flecha sale de una caja o llega
a ella (`straightenEdgeTerminals`, en
`rendering-util/layout-algorithms/elk/render.ts`). Para hacerlo desplaza el
tramo largo de la línea hasta 16 px, pero no mueve el rótulo, que se queda
donde ELK lo había puesto. Con `elk.straightenEdges: false` el rótulo vuelve a
estar sobre la línea, pero reaparece el escalón. El fallo sigue en la rama de
desarrollo de Mermaid y no había ninguna incidencia abierta (comprobado el
22-09-2026, repasando todas las creadas desde que entró el enderezado, el
27-08-2026).

## Decisión

Después de dibujar, `rotulosSobreSuLinea()` lleva cada rótulo de flecha al
punto más cercano de su línea, que Mermaid deja escrita en el atributo
`data-points` del trazo. Solo se mueve el rótulo que está a más de 1 px de su
línea y a no más de 16,5 px, que es lo máximo que la desplaza el enderezado:
un rótulo más alejado no se debe a este fallo y no se toca. Como la
corrección se hace sobre el dibujo, llega también a las descargas.

El fallo se ha comunicado a Mermaid en la incidencia
[#8292](https://github.com/mermaid-js/mermaid/issues/8292). Cuando lo
corrija, la función se quita.

Comprobado el 22-09-2026 en Chromium y Firefox con todos los ejemplos: solo se
mueve el rótulo «Sí» (o «Yes») del diagrama de flujo, y todos los rótulos
quedan a menos de 0,5 px de su línea.

## Alternativas descartadas

- **Desactivar el enderezado** (`elk.straightenEdges: false`). Devuelve los
  escalones a todas las flechas, que es un defecto más visible que este.
- **Corregir el archivo de Mermaid en `vendor`.** Es código minificado: el
  cambio se perdería en cada actualización (ver [ADR 1](0001-mermaid-en-el-repositorio.md))
  y habría que rehacerlo a mano.
- **Dejarlo hasta que lo corrija Mermaid.** El rótulo desplazado se ve en el
  primer ejemplo que se abre.

## Consecuencias

Los rótulos quedan sobre su línea con el motor ELK. A cambio, hay una
corrección que depende de cómo dibuja Mermaid (el atributo `data-points` y el
`translate` del rótulo): al actualizar Mermaid hay que comprobar si el fallo
sigue y, si ya está corregido, quitar la función y marcar este ADR como
sustituido.
