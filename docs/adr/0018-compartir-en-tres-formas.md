# 18. Compartir ofrece tres formas y el visor se comparte tal cual

Fecha: 2026-09-21 · Estado: aceptado

## Contexto

Hasta ahora el botón de compartir copiaba siempre la misma dirección, la que
abre el editor con el código a la vista. Para quien solo tiene que mirar el
diagrama, el editor estorba: ocupa media pantalla con un código que no va a
tocar. El modo visor, pensado para incrustar en otra página
(ver [ADR 5](0005-modo-visor-para-incrustar.md)), ya resuelve justo eso, pero
solo se obtenía dentro del código de un `<iframe>`.

## Decisión

El botón de compartir abre un menú con las tres formas de compartir el mismo
diagrama, cada una con la descripción de lo que hace:

- enlace al editor, que es el que había;
- enlace a pantalla completa, que es la misma dirección con `v=1`, la del modo
  visor, pero para enviarla tal cual;
- código para incrustar, que antes era un botón aparte de la barra.

Cada opción lleva su icono de Lucide —el lápiz para el editor, el marco
abierto para la pantalla completa y `</>` para el código—, porque las tres
descripciones empiezan igual y el icono las distingue antes de leerlas.

El modo visor no se toca: las direcciones con `v=1` compartidas hasta hoy
siguen funcionando igual, dentro de un marco o abiertas directamente.

## Alternativas descartadas

- **Un cuarto botón en la barra.** La barra ya está llena y las tres acciones
  son de la misma familia, así que van juntas en un desplegable.
- **Un modo de pantalla completa propio, distinto del visor.** Sería un segundo
  mecanismo para lo mismo y habría que mantener los dos en paralelo.
- **Preguntar al compartir con un diálogo.** Añade un paso a la acción más
  frecuente, que es copiar el enlace del editor.

## Consecuencias

Copiar el enlace de siempre exige ahora dos pulsaciones en lugar de una, a
cambio de que las tres formas queden a la vista y explicadas. Cualquier opción
nueva de compartir entra en este menú, no en la barra. Los textos del menú se
traducen a los cinco idiomas.
