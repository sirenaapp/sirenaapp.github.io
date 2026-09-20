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
    subgraph S1[1. Elegir a la persona]
        direction TB
        A([Inicio: quiero hacer un amigo]) --> B[Elegir una persona]
        V3([3]) --> B
        B --> C{¿Conozco sus intereses?}
        C -- No --> D[Preguntarle qué le gusta]
        C -- Sí --> X1([1])
        D --> X1
    end

    subgraph S2[2. Buscar un interés común]
        direction TB
        Y1([1]) --> E[Buscar un interés común]
        E --> F{¿Tenemos algún interés común?}
        F -- No --> H[Preguntar por otro interés]
        H --> E
        F -- Sí --> X2([2])
    end

    subgraph S3[3. Quedar y valorar]
        direction TB
        Y2([2]) --> G[Invitarle a hacer una actividad]
        G --> I{¿Acepta la invitación?}
        I -- No --> K[Proponer otra actividad]
        K --> I
        I -- Sí --> J[Realizar la actividad juntos]
        J --> L{¿La interacción ha ido bien?}
        L -- Sí --> M[Repetir actividades]
        M --> O([Amistad establecida])
        L -- No --> N[Elegir otra persona]
        N --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3
```

Todo es sintaxis corriente de Mermaid, así que el archivo sigue valiendo en
cualquier editor y en las versiones que vengan.
