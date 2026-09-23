# 28. Formato de los bloques con style propio y una clase común

Fecha: 2026-09-23 · Estado: aceptado

## Contexto

Los bloques de un diagrama de flujo (`subgraph … end`, ADR 21) solo se podían
colorear escribiendo el código a mano. El autor pidió poder cambiar desde la
interfaz los colores, el grosor y el tipo de borde de un bloque, y también de
todos a la vez, y un botón en la barra del editor para crear un bloque.

Comprobado con Mermaid 12.0.0:

- `style id …` y `class id clase` valen para un bloque igual que para una caja.
- Un bloque con línea `style` propia ignora entera la clase que tenga
  asignada, no solo las propiedades que su línea repite.
- El color del título de un bloque no se dibuja con `style` ni con clase, en
  ninguno de los dos modos de rótulo; solo la variable `titleColor`, que vale
  para todos.

## Decisión

- **Un bloque**: el botón derecho sobre él ofrece, como en una caja, el color
  de todo el bloque, solo del título o solo del borde (paleta, otro color y
  quitar), el grosor del borde (tres valores y uno escrito) y el tipo de
  borde, dibujado: continuo, punteado, discontinuo y raya y punto, los mismos
  trazos que las flechas. Se escribe en una línea `style id`.
- **Todos los bloques**: una entrada del botón derecho sobre el fondo, solo
  cuando hay bloques, con los mismos controles. Se escribe en `classDef
  bloques` y su asignación `class s1,s2 bloques`.
- Como Mermaid ignora la clase en un bloque con línea propia, esa línea lleva
  también lo común que el bloque no cambia; al cambiar lo común, lo que el
  bloque tenía igual que lo común lo sigue, y lo que se cambió a mano se
  respeta. Si la línea propia queda igual que lo común, se quita.
- Un bloque nuevo entra en la asignación de la clase, y uno deshecho sale de
  ella y pierde su línea `style`: con un id que ya no es bloque, Mermaid
  dibujaría una caja.
- **El color del título** se escribe como `color:` en la línea, que es la
  sintaxis de Mermaid, y Sirena lo aplica al dibujo después de cada render,
  como hace con los rótulos de flecha (ADR 26). En otro editor de Mermaid el
  título saldrá con el color del tema.
- **Botón de la barra**: «Nuevo bloque», solo en diagramas de flujo. Con líneas
  seleccionadas el bloque nace con las cajas de esas líneas; sin selección,
  vacío, como desde el botón derecho.

## Alternativas descartadas

- **Todos los bloques con las variables del tema** (`clusterBkg`,
  `clusterBorder`, `titleColor`). Descartada: no hay variable para el grosor
  ni para el tipo de borde, y un bloque con línea propia no sabría qué
  heredar.
- **Escribir el formato común en la línea de cada bloque.** Descartada: no se
  distinguiría lo común de lo cambiado a mano.
- **No ofrecer el color del título por un solo bloque.** Descartada: el
  autor lo pidió y la sintaxis es la de Mermaid; solo falla su dibujo.

## Consecuencias

«Limpiar formato» (ADR 27) ya quita estas líneas, porque son `style`,
`classDef` y `class`. Si Mermaid llega a dibujar el color del título de un
bloque, sobra el arreglo de Sirena.
