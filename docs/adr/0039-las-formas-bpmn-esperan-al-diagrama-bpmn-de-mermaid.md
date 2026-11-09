# 39. Las formas BPMN esperan al diagrama BPMN de Mermaid

Fecha: 2026-11-09 · Estado: aceptado

## Contexto

Mermaid 12.3.0 trae nueve formas de BPMN: evento de inicio, intermedio, de
borde y de fin, compuerta, tarea, objeto de datos, almacén de datos y
anotación. Son las piezas de un tipo de diagrama nuevo, `bpmn-beta`, que
Mermaid prepara en una serie de PR ([#8160](https://github.com/mermaid-js/mermaid/issues/8160));
la que añade el diagrama ([#8166](https://github.com/mermaid-js/mermaid/pull/8166))
y la de su documentación ([#8167](https://github.com/mermaid-js/mermaid/pull/8167))
seguían sin fusionar el 09-11-2026.

En un diagrama de flujo las formas se pueden escribir
(`A@{ shape: bpmn-start }`), pero Mermaid las registra entre las formas sin
documentar, y salen vacías: lo que distingue a BPMN (el sobre del mensaje, el
reloj del temporizador, la X de la compuerta exclusiva, las marcas de bucle de
una tarea) no se puede escribir desde un diagrama de flujo.

## Decisión

Sirena no añade las formas BPMN al menú de formas del diagrama de flujo.
Cuando una versión de Mermaid publique el diagrama `bpmn-beta`, se añade como
tipo de diagrama nuevo, con su ejemplo en los cinco idiomas, sus formas con los
iconos de cada evento y su ayuda, como los demás tipos.

## Alternativas descartadas

- **Añadir ya un grupo «BPMN» con las nueve formas.** Costaría poco, pero
  serían formas BPMN sin lo que las hace BPMN, apoyadas en algo que Mermaid no
  documenta y puede cambiar en cualquier versión, y quizá habría que rehacerlas
  al llegar el diagrama.

## Consecuencias

Hasta que llegue el diagrama, quien quiera esas formas puede escribirlas a mano
en el código. Al actualizar Mermaid hay que mirar si la versión nueva trae
`bpmn-beta` ([docs/pruebas.md](../pruebas.md)).

## Evidencia

Registro de formas de Mermaid 12.3.0, en `undocumentedShapes`:
[`shapes.ts`](https://github.com/mermaid-js/mermaid/blob/mermaid%4012.3.0/packages/mermaid/src/rendering-util/rendering-elements/shapes.ts).
Las formas leen el icono y las marcas de propiedades de la caja (`icon`,
`markers`) que el diagrama de flujo no les pasa como ellas esperan.

## Validación

09-11-2026, con la copia de `vendor/mermaid` (12.3.0), en Chromium y Firefox:
las nueve formas se dibujan en un diagrama de flujo, con `dagre` y con ELK, y
el texto queda debajo de los eventos y la compuerta; con
`icon: "bpmn:message"` (o `bpmn:exclusive`, `bpmn:user`) la caja pasa a ser un
icono y sale un «?», y `markers: ["bpmn:loop"]` no dibuja nada.
