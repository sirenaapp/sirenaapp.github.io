# 2. El diagrama compartido viaja dentro del enlace

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Compartir un diagrama es una de las cosas que más se piden a este tipo de
herramientas. Las plataformas comerciales lo resuelven guardando el diagrama en
su servidor y devolviendo un enlace corto, lo que exige cuenta de usuario y
traslada el contenido a un tercero.

## Decisión

El botón de enlace comprime el código del diagrama con `CompressionStream`
(deflate sin cabecera), lo codifica en base64 apto para direcciones y lo coloca
en el fragmento de la dirección (`#z=…`), junto con el tema elegido (`t=…`). Al
abrir esa dirección, la página descomprime el contenido y lo carga en el editor.

El fragmento no se envía al servidor en ninguna petición, de modo que el
diagrama nunca sale del navegador de quien lo escribe ni del de quien lo abre.
Si el navegador no admite `CompressionStream`, el código viaja en base64 sin
comprimir (`#d=…`), que la página también sabe leer.

## Alternativas descartadas

- **Guardar el diagrama en un servidor propio.** Descartada: obligaría a
  mantener un servicio, a tratar datos ajenos y a gestionar cuentas.
- **Servicios de enlaces cortos.** Descartada por la misma razón, más la
  dependencia de un tercero.

## Consecuencias

El enlace crece con el tamaño del diagrama. Para diagramas muy largos puede
quedar una dirección incómoda de pegar en algunos programas; en ese caso queda
el archivo `.mmd`, que la página abre y guarda.
