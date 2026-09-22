# 25. El calendario del diagrama de Gantt se ajusta desde la barra y se escribe en el cuerpo

Fecha: 2026-09-22 · Estado: aceptado

## Contexto

Mermaid dibuja el Gantt con la semana empezando en domingo y las fechas del
eje como `2026-01-07`, que no es lo habitual en un centro educativo de aquí.
Lo corrige con directivas que van en el cuerpo del diagrama, al lado de
`dateFormat`: `axisFormat`, `tickInterval`, `weekday` y `excludes`. Son las
que salieron en el inventario de lo que Mermaid permite y Sirena no ofrecía
(22-09-2026), y el autor las puso en segundo lugar.

## Decisión

Un botón «Calendario» en la barra, solo en el Gantt, con cuatro ajustes:

- **Fechas del eje** (`axisFormat`): como Mermaid, día/mes, día/mes/año con
  cuatro o con dos cifras, y un campo para escribir otro formato, con la
  ayuda de qué es `%d`, `%m`, `%Y` y `%y`.
- **Marcas del eje** (`tickInterval`): automáticas, cada día, semana, dos
  semanas o mes.
- **La semana empieza en** (`weekday`): domingo, que es lo de serie, o lunes.
- **Saltar los fines de semana** (`excludes weekends`): las tareas se alargan
  por encima de sábados y domingos.

Se escriben en el cuerpo, debajo de `dateFormat` (o de la cabecera del
diagrama si no lo hay), y no en la cabecera de configuración, porque Mermaid
los tiene como directivas del propio Gantt y así se leen en el código como el
resto de su sintaxis. El valor de serie borra la línea. `excludes` puede
llevar además fechas sueltas: solo se toca la palabra `weekends`. El menú se
lee del código al abrirse y, si está abierto mientras cambia el código,
también en cada dibujado. El botón derecho sobre el fondo lo ofrece como
submenú, y la chuleta del Gantt lleva las cuatro directivas. El ejemplo del
Gantt pasa a marcas semanales desde el lunes.

Comprobado el 22-09-2026 con Mermaid 12.0.0: con `tickInterval 1week` las
marcas caen en domingo (11/01, 18/01) y con `weekday monday` en lunes (12/01,
19/01); con `excludes weekends` una tarea de diez días pasa de 618 a 639
píxeles. Los nombres de mes (`%b`) salen en inglés, porque Mermaid usa la
localización de d3 en inglés; por eso las opciones de la lista son numéricas.

## Alternativas descartadas

- **Escribirlo en la cabecera `%%{init}%%`** (`gantt.axisFormat`…).
  Descartado: existe, pero el cuerpo es donde Mermaid documenta estas
  directivas y donde las verá quien lea el código.
- **Cambiar el valor de serie a lunes sin que el usuario lo pida.**
  Descartado: el código debe dibujarse igual en cualquier editor de Mermaid
  ([ADR 8](0008-ajustes-escritos-en-el-codigo.md)).
- **`displayMode compact` y `topAxis`.** No se han pedido; se pueden añadir al
  mismo menú.

## Consecuencias

`diagramKind()` reconoce ahora `gantt`, que antes caía en «otro». Cada
directiva se lee con una expresión por línea; si Mermaid añadiera otras del
mismo tipo, van al mismo sitio.
