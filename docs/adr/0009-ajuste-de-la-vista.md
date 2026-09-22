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
  es del usuario y no se toca sin pedirlo; la barra del editor tiene el botón
  de orientación para quien lo quiera.

## Lo que se probó antes

Se midieron los otros motores de trazado que Mermaid 12 trae de serie, sobre un
diagrama de flujo de veinte pasos (476 × 1949 con el trazado normal):

| Trazado | Tamaño | Resultado |
|---|---|---|
| por defecto | 476 × 1949 | columna estrecha y muy alta |
| elk | 476 × 1949 | igual, porque en Mermaid 12 ya es el motor por defecto ([ADR 12](0012-motor-de-distribucion-escrito-en-la-cabecera.md)) |
| elk.mrtree | 558 × 1490 | algo menos alto, rótulos de flecha descolocados |
| elk.stress | 911 × 631 | compacto, pero los pasos se solapan |
| elk.rectpacking | 728 × 464 | entra entero, pero el orden se pierde |

Ninguno sirve para un diagrama de flujo educativo, porque reordenan los pasos y
se deja de seguir la secuencia. También se probó el paquete
`@mermaid-js/layout-elk` y se descartó: Mermaid 12 ya trae esos algoritmos, así
que no aportaba nada y añadía 2,5 MB al repositorio.

Lo que sí reparte bien el diagrama es la dirección: el mismo código en
horizontal pasa de 476 × 1949 a 2838 × 334, conservando el orden de lectura. Por
eso la página propone ese cambio en lugar de tocar el motor de trazado.

## Consecuencias

Un diagrama largo ya no se ve entero de un vistazo al abrirlo. El botón del
porcentaje devuelve el tamaño natural y la rueda del ratón permite alejarse
para verlo completo.
