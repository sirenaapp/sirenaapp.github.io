# Diagramas de flujo largos

Un proceso con muchos pasos encadenados sale en una columna estrecha y muy alta,
porque Mermaid coloca una fila por cada nivel del diagrama. El ejemplo de abajo
mide 476 × 1949 píxeles escrito de la forma corriente, y 1489 × 1103 plegado en
cajas, que ya cabe en una pantalla.

## Las cuatro reglas

1. `flowchart LR` por fuera, y cada tramo dentro de un `subgraph` con `direction TB`.
2. Ninguna flecha cruza de una caja a otra: Mermaid ignora la dirección interna
   de un subgrafo en cuanto una flecha lo atraviesa, y entonces todo vuelve a
   alinearse en una tira.
3. La continuidad se marca con conectores numerados, como en los diagramas de
   flujo de papel: un tramo acaba en `([1])` y el siguiente empieza en `([1])`.
4. Enlaces invisibles entre las cajas (`S1 ~~~ S2`) para que se coloquen en fila
   y no apiladas.

Conviene usar `([1])` para los conectores y no `((1))`: el círculo sale enorme y
se come media caja.

## Ejemplo

```mermaid
flowchart LR
    accTitle: Algoritmo de la amistad en cajas, de Sheldon Cooper (The Big Bang Theory)
    accDescr: El mismo algoritmo de la serie The Big Bang Theory, plegado en tres cajas unidas por conectores numerados.
    subgraph S1[1. Elegir a la persona]
        direction TB
        A([Inicio]) --> B[Elegir a la persona]
        V3([3]) --> B
        B --> C[Averiguar sus intereses]
        C --> F[/Intentos = 0/]
        F --> X1([1])
    end

    subgraph S2[2. Buscar un interés común]
        direction TB
        Y1([1]) --> D{¿Hay algún interés común?}
        Y4([4]) --> I
        D -- No --> I[/Intentos = Intentos + 1/]
        I --> J{¿Intentos menor que 3?}
        J -- Sí --> E[Preguntar por otro interés]
        E --> D
        J -- No --> L[Quedarse con la actividad menos desagradable]
        L --> X2([2])
        D -- Sí --> X2
    end

    subgraph S3[3. Quedar y valorar]
        direction TB
        Y2([2]) --> G[Proponer compartir esa actividad]
        G --> H{¿Acepta la invitación?}
        H -- No --> X4([4])
        H -- Sí --> M[Compartir la actividad]
        M --> N{¿Ha resultado agradable?}
        N -- Sí --> O[Repetir la actividad]
        O --> P([Amistad establecida])
        N -- No --> Q[Elegir otra persona]
        Q --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3
```

Todo es sintaxis corriente de Mermaid, así que el archivo sigue valiendo en
cualquier editor y en las versiones que vengan.
