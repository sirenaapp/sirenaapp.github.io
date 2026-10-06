# 23. Los archivos propios se sirven con una huella en la dirección

Fecha: 2026-09-22 · Estado: aceptado

## Contexto

Sirena es una página estática en GitHub Pages. El HTML se vuelve a pedir cada
poco, pero el CSS y el JavaScript se guardan en el navegador y se siguen
sirviendo de ahí durante horas, aunque el repositorio ya tenga otra versión.

El 22-09-2026 esto llevó a dar por roto algo que ya estaba arreglado: la página
mostraba los botones nuevos (que vienen en el HTML) pero seguía ejecutando el
JavaScript anterior, así que un fallo corregido seguía a la vista. Comprobado
el mismo diagrama en local y en la dirección publicada, los dos partían el
texto bien.

## Decisión

Los archivos propios que carga `index.html` (los de `css/`, `js/` y `lang/`)
llevan en la dirección una huella de su contenido: `js/sirena.js?v=ca5354f2`.
Al cambiar el archivo cambia la huella, y el navegador pide la versión nueva;
mientras no cambie, la sigue sirviendo de su copia, que es lo que se quiere.

La huella la pone `scripts/sellar-version.sh`, que se ejecuta desde la raíz del
repositorio antes de confirmar los cambios y reescribe `index.html`.

Mermaid, en `vendor/mermaid`, conserva el nombre de su archivo principal
(`mermaid.esm.min.mjs`) de una versión a otra; los trozos que carga a demanda
llevan ya una huella en el nombre. Desde el 06-10-2026 el mismo script pone
también la huella del archivo principal en la dirección con que `js/sirena.js`
lo carga. Sin ella, al actualizar Mermaid, un navegador con el archivo
principal anterior guardado pediría trozos que ya no existen y algunos tipos de
diagrama no se dibujarían hasta que caducase la copia (GitHub Pages la da por
buena 10 minutos). Los iconos de `vendor/lucide` no se cargan por dirección: van
dentro de `index.html`.

## Alternativas descartadas

- **Un número de versión escrito a mano.** Descartada: se olvida, y cuando se
  olvida el problema vuelve sin avisar.
- **Un sello con la fecha en cada publicación.** Descartada: obliga a descargar
  de nuevo todo aunque no haya cambiado nada.
- **Configurar las cabeceras de caché.** Descartada: GitHub Pages no deja
  elegirlas.
- **Un proceso de construcción (empaquetado, hashes en el nombre).**
  Descartada: Sirena se sirve tal cual está en el repositorio, sin compilar, y
  eso es parte de lo que la hace fácil de copiar y revisar.

## Consecuencias

Lo que se publica se ve enseguida, sin pedir a nadie que vacíe la caché. A
cambio, hay que acordarse de pasar el script cuando se toca un archivo propio;
si no se pasa, el archivo se sigue sirviendo con la huella anterior y el
cambio tarda en verse, que es justo lo que había antes.
