# 36. El grosor de las ramas del mapa mental se escribe en la cabecera

Fecha: 2026-10-06 · Estado: aceptado

## Contexto

Con el aspecto clásico, Mermaid dibuja las ramas del mapa mental muy gruesas:
11 px las que salen del centro, 5 px las del nivel siguiente y 3 px las demás. El
mapa resulta pesado, y la sintaxis del mapa mental no tiene forma de cambiarlo
(no hay `linkStyle`). El trazo «moderno» solo las baja a 8 y 4 px.

Mermaid sí admite en la cabecera `themeCSS`, una hoja de estilo que añade al
dibujo, y la conserva cualquier editor que lea el archivo.

## Decisión

En los mapas mentales, el botón de líneas ofrece solo «Grosor de las ramas»:
fino (3 px), normal (6 px), grueso (el de serie, sin nada escrito) y un campo
para escribir otro. El valor es el de las ramas que salen del centro; las de los
niveles siguientes adelgazan en la misma proporción que las de serie (5/11 y
3/11, redondeado a medio píxel y nunca por debajo de 1 px). Se escribe en la
cabecera:

```
%%{init: {"themeCSS":".edge{stroke-width:1px}.edge-depth-1{stroke-width:3px}.edge-depth-3{stroke-width:1.5px}"}}%%
```

Mermaid pone a las ramas las clases `edge-depth-1`, `edge-depth-3`, `-5`…
según su nivel. Si el código ya traía un `themeCSS` escrito a mano, se conserva
delante del de las ramas. «Limpiar formato» lo quita, como el resto del aspecto
([ADR 27](0027-limpiar-formato-deja-el-diagrama-sin-aspecto-propio-y-conserva-su-estructura.md)).

El ejemplo del mapa mental viene con las ramas finas.

## Alternativas descartadas

- **Ramas finas por defecto, sin escribir nada.** Un mapa sin cabecera se vería
  distinto en Sirena y en los demás editores, que es lo que el
  [ADR 12](0012-motor-de-distribucion-escrito-en-la-cabecera.md) evita.
- **Cambiar el tema o el trazo por defecto.** Cambia también colores y letra, y
  afecta a todos los tipos de diagrama.
- **Un mismo grosor para todas las ramas.** Se pierde que el mapa adelgace
  hacia fuera, que ayuda a leerlo.

## Consecuencias

El grosor viaja con el archivo y se ve igual en cualquier editor de Mermaid. La
cabecera de un mapa mental con grosor propio es larga.

## Evidencia

Medido con Mermaid 12.1.0 solo: sin cabecera, las ramas miden 11, 5 y 3 px; con
la cabecera de arriba, 3, 1,5 y 1 px, también con el trazo «moderno». Mermaid
pasa `themeCSS` por `sanitizeCss`, que solo exige llaves equilibradas.

## Validación

06-10-2026, en Chromium y Firefox: el ejemplo abre con «Fino» marcado y ramas de
3 y 1,5 px; «Normal», «Grueso» y un valor a mano (8 px) escriben y quitan la
cabecera como se espera; un `themeCSS` escrito a mano se conserva al cambiar el
grosor; sin errores de JavaScript.
