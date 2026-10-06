# 31. Los parches a fallos de Mermaid se comprueban con cada versión nueva

Fecha: 2026-09-28 · Estado: aceptado

## Contexto

Sirena corrige por su cuenta cuatro fallos de Mermaid (ADR 22 y 26): el rótulo
de flecha fuera de su línea con ELK, el rótulo con fórmula que no se parte, los
saltos de línea que desaparecen en un rótulo con fórmula y el rótulo de flecha
con fórmula sin fondo opaco. Todos están notificados a Mermaid, y cuando Mermaid
los corrija los parches sobran.

Los parches solo actúan cuando detectan el fallo, así que dejarlos no rompe
nada, pero quedarían como código muerto. Hasta ahora nada avisaba de cuándo
quitarlos: el aviso semanal de versión nueva de Mermaid (ADR 4) no decía nada de
ellos, GitHub avisa cuando se cierra una incidencia pero eso no significa que la
corrección haya salido en una versión publicada, y solo uno de los parches
(ADR 26) enlazaba su incidencia.

## Decisión

- **Una lista de parches**, en `docs/parches-mermaid.md` para leerla y en
  `scripts/parches-mermaid.json` para las comprobaciones: por cada parche, el
  fallo, la función que lo aplica, sus incidencias de Mermaid, un ejemplo mínimo
  que lo reproduce y un ejemplo de control, el mismo caso sin la causa del fallo.
  Cada función parche lleva en su comentario el número de la incidencia.
- **Una comprobación que mide el dibujo** (`scripts/comprobar-parches.mjs`):
  dibuja cada ejemplo con una versión de Mermaid sola, con su configuración por
  defecto, en Chromium (Playwright), y mide si el fallo aparece. Primero mide el
  control; si también da fallo, la medición no se fía de esa versión y pide
  comprobarlo a mano. Consulta además el estado de cada incidencia en GitHub.
- **En el aviso semanal**: cuando sale una versión nueva, el flujo la descarga,
  pasa la comprobación y pone la tabla en la incidencia que abre, con qué hacer
  en cada caso («mantener el parche» o «quitar tal función»).

## Alternativas descartadas

- **Vigilar solo el estado de las incidencias.** Una incidencia puede cerrarse
  sin que la corrección esté aún en una versión publicada, o arreglarse sin que
  nadie la cierre. Lo que decide es si la versión nueva dibuja bien.
- **Avisar cada vez que se cierra una incidencia, aparte del aviso de versión.**
  El parche solo se puede quitar cuando Sirena actualiza Mermaid, que es lo que
  dispara el aviso de versión; un segundo aviso sería ruido.

## Consecuencias

- Un parche nuevo exige su entrada en la lista, con ejemplo y control, y una
  medición en `comprobar-parches.mjs`.
- El aviso semanal tarda un par de minutos más cuando hay versión nueva: instala
  Playwright y Chromium en GitHub Actions. Las semanas sin novedad no hace nada
  de esto.

## Evidencia

- Mermaid 12.0.0 (la copia de `vendor/mermaid`): la comprobación da los cuatro
  fallos como vigentes, con estas medidas: el rótulo más alejado a 3,1 px de su
  línea; la caja con fórmula de 429 px frente a 152 px sin ella; las dos líneas
  del rótulo con `<br>` en la misma fila; ningún fondo opaco bajo el texto.

## Riesgos y limitaciones

- Las mediciones dependen de la estructura del dibujo de Mermaid (clases, ids,
  `data-points`). Si cambia, el control lo detecta y la tabla pide comprobarlo a
  mano en vez de dar un resultado falso.
- Dos de las cuatro mediciones (la fórmula sin partir y el fondo) no se han visto
  aún detectar una corrección oficial, porque no existe; se validaron con
  correcciones aplicadas a mano (ver Validación).

## Validación

28-09-2026: sobre una copia de Mermaid 12.0.0 con tres correcciones aplicadas a
mano en su código (la fila de la fórmula en bloque, el fondo en los bloques del
rótulo y los `<br>` sin quitar antes de KaTeX), la comprobación da esas tres como
**corregidas** y el rótulo fuera de línea, que no se tocó, como vigente. Una
primera versión de dos mediciones daba falsos resultados con esa copia (el alto
del rótulo crecía por la fórmula y no por el salto; el fondo del `span`, que es en
línea, no se pinta detrás de los bloques) y se corrigió antes de darla por buena.
Con Mermaid 12.0.0 tal cual, los cuatro controles salen bien y los cuatro fallos
aparecen.

06-10-2026, primera versión nueva real (Mermaid 12.1.0): la comprobación dio
cuatro fallos como vigentes y pidió comprobar a mano el del rótulo fuera de su
línea, porque su control con `dagre` dejaba un rótulo a 1,8 px de su línea. El
ejemplo con ELK daba 0,1 px. Medido a mano rótulo por rótulo con las dos
versiones, el fallo estaba corregido y la diferencia del control era un cambio
pequeño de `dagre`, sin relación con el fallo: el parche se retiró (ADR 26). El
mecanismo funcionó como estaba previsto: ante un control dudoso no dio un
resultado, sino que pidió comprobarlo.
