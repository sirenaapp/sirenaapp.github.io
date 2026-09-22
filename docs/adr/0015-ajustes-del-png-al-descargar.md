# 15. El PNG se descarga con la resolución y el fondo que se elijan

Fecha: 2026-09-21 · Estado: aceptado

## Contexto

Hasta ahora el PNG salía siempre al doble del tamaño de pantalla y con fondo
opaco: blanco en modo claro y oscuro en modo oscuro, sin manera de cambiarlo.
Eso deja dos problemas. Un diagrama hecho en modo oscuro llegaba con fondo
oscuro a un documento de fondo claro, y quien quería una imagen grande para un
cartel o una hoja impresa no tenía forma de pedirla.

Los demás editores libres de Mermaid (MermaidExport, mermaid.tools, Omnibus)
ofrecen la escala y, algunos, el fondo transparente.

## Decisión

Al pie del menú de descargas, debajo de los cuatro formatos, van dos ajustes:

- **Resolución del PNG**: 1× (tamaño de pantalla), 2× (nítido, el de siempre) y
  4× (para imprimir en grande).
- **Fondo del PNG**: el del editor (el de siempre), blanco o transparente.

Los dos se recuerdan en el navegador y se aplican también al botón de copiar
como imagen, que produce el mismo PNG. Los valores por defecto son los de antes,
así que quien no toque nada obtiene exactamente lo que obtenía.

## Alternativas descartadas

- **Un diálogo de opciones antes de cada descarga.** Descartada: añade un paso a
  la acción más frecuente para algo que casi nadie cambia.
- **Llevar los ajustes a los menús del dibujo de la barra del editor.**
  Descartada: esos menús son cómo se dibuja el diagrama, y todo lo que hay en
  ellos se escribe en el código
  ([ADR 8](0008-ajustes-escritos-en-el-codigo.md)). La resolución y el fondo no
  son del diagrama, sino de la copia que se descarga.
- **Añadir JPG, WebP, DOCX o PPTX**, como hace MermaidExport. Descartada: para
  llevar el diagrama a un documento o a una presentación ya está el botón de
  copiar como imagen, que es un paso en lugar de dos, y el SVG entra en los dos
  programas.

## Consecuencias

Un PNG a 4× de un diagrama grande puede ocupar varios megabytes. Se avisa en el
propio rótulo de la opción, que dice para qué sirve cada una.

Con fondo transparente, un diagrama hecho en modo oscuro tiene el texto claro y
no se lee sobre un documento blanco. Es una elección de quien exporta, y para
eso está la opción de fondo blanco, que va acompañada del tema claro.
