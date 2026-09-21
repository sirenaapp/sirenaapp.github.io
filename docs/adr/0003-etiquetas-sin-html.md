# 3. Los rótulos se dibujan como texto SVG, no como HTML

Fecha: 2026-09-20 · Estado: aceptado · Ampliado el 21-09-2026 con el fondo de los rótulos de las flechas

## Contexto

Mermaid puede dibujar los rótulos de dos maneras: como texto propio del SVG o
como HTML incrustado dentro de un `<foreignObject>`, que es lo que hace de
manera predeterminada. El HTML permite formato enriquecido, pero el navegador
considera «contaminado» el lienzo que recibe un SVG con HTML dentro y se niega a
convertirlo en PNG. Otros programas de dibujo, como Inkscape, tampoco lo abren
bien.

Descargar el diagrama en PNG es una de las razones de ser de Sirena, así que esa
limitación no es aceptable.

## Decisión

Se dibuja con `htmlLabels: false`, de modo que los rótulos son texto SVG. El
formato se consigue con el Markdown propio de Mermaid, que sí funciona:

```
A["`Texto **en negrita**`"]
```

Los saltos de línea con `<br/>` siguen funcionando. Lo que no funciona es el
HTML dentro de un rótulo: `<b>negrita</b>` se muestra tal cual, con sus
etiquetas a la vista.

Algunos tipos de diagrama (el recorrido de usuario, por ejemplo) usan
`<foreignObject>` aunque se les diga lo contrario. Para esos, la copia que se
exporta convierte cada bloque en texto SVG (`flattenForeignObjects`), de manera
que todos los tipos se pueden descargar en PNG.

Con los rótulos en texto SVG, el fondo de las etiquetas de las flechas se queda
en el `<rect>` que Mermaid pinta con `opacity: 0.5`: la línea se transparenta y
cruza el texto, cosa que con los rótulos en HTML no ocurre porque el recuadro
tapa la línea. Medido con el mismo diagrama en las dos configuraciones. Por eso
Sirena añade al SVG que dibuja una regla que deja ese fondo opaco
(`opaqueEdgeLabels`), con el mismo color que el tema ya usaba, solo que sin
transparencia. La regla viaja dentro del SVG, así que la pantalla, el PNG, la
impresión y el archivo descargado se ven igual.

También se mantiene `securityLevel: 'strict'`, porque un diagrama puede llegar
desde un enlace compartido por otra persona. Los enlaces con `click … "http…"`
siguen funcionando; lo que queda bloqueado es llamar a funciones del navegador.

## Alternativas descartadas

- **Dejar el HTML activado y renunciar al PNG.** Descartada: la descarga en
  imagen es de lo primero que se pide a un editor de diagramas.
- **HTML activado y aplanar solo al exportar.** Descartada porque el dibujo de
  la pantalla y el de la imagen dejarían de coincidir, y el formato enriquecido
  se perdería igualmente al exportar.

## Consecuencias

Un diagrama traído de otro editor que use HTML en los rótulos se verá con las
etiquetas a la vista. La solución es sustituirlas por el Markdown de Mermaid.
