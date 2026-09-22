# 24. Tipo de línea y puntas de las flechas, escritos en cada flecha

Fecha: 2026-09-22 · Estado: aceptado

## Contexto

Mermaid escribe el tipo de cada flecha en su propia sintaxis: continua
`-->`, punteada `-.->`, gruesa `==>`, invisible `~~~`; sin punta `---`, con
punta en los dos extremos `<-->`, y con círculo o cruz `--o`, `--x`, `o--o`,
`x--x`. No hay ningún ajuste de configuración para ello, así que no se puede
escribir en la cabecera como el resto ([ADR 8](0008-ajustes-escritos-en-el-codigo.md)).
Quien no conoce la sintaxis no sabe que existen, y era lo más pedido después
del color en un mapa conceptual.

Comprobado el 22-09-2026 con Mermaid 12.0.0: la punta inicial solo se dibuja
cuando es igual a la final (`<-->`, `o--o`, `x--x`); las mezclas como `o-->`
las acepta pero no la pinta. Y un `o` o una `x` iniciales solo cuentan
precedidos de un espacio: `Foo-->` es la caja `Foo`.

## Decisión

Cada flecha tiene **tipo de línea** (continua, punteada, discontinua, raya y
punto, gruesa, invisible) y **puntas** (ninguna; flecha, círculo o cruz al
final; flecha, círculo o cruz en los dos extremos). Se ofrecen en tres sitios,
con el mismo patrón que la forma de las cajas:

- **Botón derecho sobre una flecha**: dos submenús en cascada, «Tipo de
  línea» y «Puntas», con cada opción dibujada y con su nombre, en vertical.
- **Botón de líneas de la barra**, sección «Donde está el cursor»: lo mismo
  para la flecha de la línea del cursor.
- **Botón de líneas, sección «Todas las líneas»**: cambia las flechas que
  siguen con el valor general y respeta las cambiadas una a una, y apunta el
  nuevo general en el código como `%% flechaGeneral: punteada doble`, igual
  que `formaGeneral`. Las flechas nuevas (arrastre o «caja conectada») salen
  con ese tipo general.

En el menú de la barra cada lista va plegada bajo una fila que muestra el
valor actual dibujado; con las cuatro listas abiertas el menú se salía de la
pantalla. El autor pidió los dibujos en lugar de los nombres y la lista en
vertical (22-09-2026).

La reescritura conserva lo demás de la flecha: el rótulo (en medio, `-- Sí
-->`, o entre barras, `-->|Sí|`) y los guiones de más que alargan la flecha.
El rótulo en medio se mantiene en la línea continua, también con punta
inicial (`o-- Sí --o`, comprobado); con punta inicial en las otras líneas, o
con puntos de más en la punteada, pasa a barras, que es lo que la sintaxis
admite. Una flecha invisible pierde el rótulo, porque `~~~` no lo lleva.

**Discontinua y raya y punto** no existen en la sintaxis: se escriben como
estilo, `linkStyle N stroke-dasharray:8 4` y `10 3 2 3`, sobre una flecha
continua (con «todas», en `linkStyle default`). Si el general lleva trazo y
una flecha vuelve a continua o punteada, hay que anularlo a mano en la suya
(`stroke-dasharray:0` o `3`), porque el `default` seguiría aplicándose. Al
leer el tipo de una flecha, el trazo por estilo manda sobre la sintaxis.

Como efecto colateral, al reescribir el código desde un menú el cursor se
queda en la misma línea: antes se iba al final y «la flecha del cursor»
dejaba de ser la misma al volver a abrir el menú.

## Alternativas descartadas

- **Punta inicial independiente de la final.** Descartada: Mermaid no la
  dibuja.
- **Solo desde el botón derecho.** Descartada por el autor: lo quería también
  para todas y desde la barra, como los demás ajustes.
- **Más trazos por estilo (punto largo, doble raya).** No se han pedido; el
  mecanismo admite añadirlos en `TRAZOS`.

## Consecuencias

El troceado de una línea de flujo ([ADR 21](0021-el-boton-derecho-sobre-el-diagrama-abre-las-opciones-del-objeto.md))
reconoce ahora `o` y `x` iniciales tras un espacio, y `<` con rótulo en
medio. Al actualizar Mermaid hay que volver a comprobar qué puntas dibuja.
