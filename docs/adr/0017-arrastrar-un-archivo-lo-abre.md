# 17. Arrastrar un archivo sobre la ventana lo abre

Fecha: 2026-09-21 · Estado: aceptado

## Contexto

Para abrir un diagrama guardado en el equipo había que usar el botón de abrir y
recorrer el diálogo de archivos del sistema. Arrastrar el archivo sobre la
página es lo que espera cualquiera que venga de un editor de escritorio, y hasta
ahora no hacía nada: el navegador se limitaba a mostrar el archivo, con lo que
se salía de Sirena y se perdía el trabajo sin guardar.

## Decisión

Al arrastrar un archivo sobre la ventana, el editor se marca con un borde
discontinuo y, al soltarlo, se abre igual que con el botón: el contenido pasa al
editor y el nombre del archivo pasa a ser el del diagrama en la biblioteca.

Se aceptan los mismos archivos que el botón de abrir (`.mmd`, `.mermaid`, `.md`,
`.txt` y cualquier archivo de texto) y, además, las copias `.json` de la
biblioteca ([ADR 16](0016-copia-de-seguridad-de-la-biblioteca.md)), que se
importan. Con cualquier otro archivo no pasa nada y se avisa de cuáles se
pueden abrir.

En el modo visor, que es la página incrustada en otro sitio
([ADR 5](0005-modo-visor-para-incrustar.md)), arrastrar no hace nada: ahí no hay
editor ni biblioteca.

## Alternativas descartadas

- **Aceptar solo la extensión `.mmd`.** Descartada: los diagramas llegan a menudo
  dentro de un `.md` o de un `.txt`, que el botón de abrir ya admitía.
- **Abrir varios archivos a la vez en varios diagramas.** Descartada: solo hay un
  editor, y no está claro cuál debería quedar a la vista.

## Consecuencias

El aviso de que un archivo no vale es la única respuesta a algo que el navegador
antes resolvía a su manera. Conviene que el texto diga qué se puede soltar, no
solo que eso no vale.
