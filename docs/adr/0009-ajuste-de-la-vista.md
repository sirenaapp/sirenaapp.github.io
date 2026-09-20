# 9. Un diagrama muy alargado se ajusta por su lado corto

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Mermaid dibuja los diagramas de flujo largos en una columna estrecha y muy
alta: un diagrama de veinte pasos puede medir 476 × 1949 píxeles. Al encajarlo
entero en el panel, la escala bajaba al 25 % y el texto resultaba ilegible,
aunque el diagrama estuviera bien dibujado.

## Decisión

El ajuste compara las dos escalas posibles, la que encaja el ancho y la que
encaja el alto. Cuando la menor es menos de la mitad de la mayor —es decir,
cuando el diagrama es mucho más alargado que el panel— se ajusta por su lado
corto, sin pasar del tamaño natural, y el diagrama se recorre desplazándolo.
En los demás casos se encaja entero, ampliando hasta dos veces y media si es
pequeño.

## Alternativas descartadas

- **Encajarlo siempre entero.** Descartada: es lo que dejaba el texto ilegible.
- **Reducir el tamaño del texto para que quepa.** Descartada: el problema no es
  el texto, sino la forma que Mermaid da al diagrama.
- **Cambiar la dirección por cuenta propia a horizontal.** Descartada: el código
  es del usuario y no se toca sin pedirlo; el menú de aspecto tiene el control
  de dirección para quien lo quiera.

## Consecuencias

Un diagrama largo ya no se ve entero de un vistazo al abrirlo. El botón del
porcentaje devuelve el tamaño natural y la rueda del ratón permite alejarse
para verlo completo.
