# Sirena

Editor libre de diagramas [Mermaid](https://mermaid.js.org/) que funciona por
completo en el navegador: **<https://sirenaapp.github.io>**

No hay cuenta, ni servidor, ni límite de diagramas. El código que se escribe no
sale del equipo, y el enlace para compartir lleva el diagrama comprimido dentro
de la propia dirección.

## Qué permite hacer

- Escribir el diagrama como texto y verlo dibujado al momento.
- Elegir entre 18 ejemplos agrupados por tipo (procesos, tiempo, estructuras,
  datos y comunicación), pensados para el ámbito educativo.
- Cambiar el aspecto del diagrama entre los cinco temas de Mermaid.
- Descargar el resultado en SVG o en PNG, o copiarlo como imagen.
- Abrir y guardar archivos `.mmd`.
- Compartir un enlace que contiene el diagrama, sin subirlo a ningún sitio.
- Trabajar en castellano, catalán, gallego, euskera o inglés.
- Usarlo en móvil y tableta, con tema claro u oscuro.

## Cómo funciona por dentro

Es una página estática. Mermaid se sirve desde el propio repositorio
(`vendor/mermaid`), sin CDN ni peticiones a terceros, y se carga por partes: solo
se descarga el código del tipo de diagrama que se está usando.

Para actualizar Mermaid:

```bash
scripts/actualizar-mermaid.sh          # última versión publicada
scripts/actualizar-mermaid.sh 12.0.0   # una versión concreta
```

Las decisiones técnicas que condicionan el proyecto están en [docs/adr](docs/adr).

## Licencias

Código bajo [AGPL v3](LICENSE.txt) y contenidos bajo
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).
Mermaid es de Knut Sveidqvist y colaboradores, con licencia MIT
([vendor/mermaid/LICENSE.txt](vendor/mermaid/LICENSE.txt)).

Sirena es un proyecto independiente y no está asociado con el proyecto Mermaid
ni con Mermaid Chart.

© [Juan José de Haro](https://bilateria.org)
