# Bibliotecas incluidas en Mermaid

`vendor/mermaid` es la distribución publicada de Mermaid 12.0.0 (licencia MIT,
© Knut Sveidqvist y colaboradores, [LICENSE.txt](LICENSE.txt)). Esa
distribución lleva dentro las bibliotecas de las que depende Mermaid. Esta es
la lista, con la licencia que declara cada una en npm (comprobado el
23-09-2026):

| Biblioteca | Para qué la usa Mermaid | Licencia |
| --- | --- | --- |
| d3 | Dibujo en SVG | ISC |
| d3-sankey | Diagrama de Sankey | BSD-3-Clause |
| dagre-d3-es | Distribución «dagre» | MIT |
| elkjs | Distribución «ELK» (Eclipse Layout Kernel) | EPL-2.0 o GPL-3.0-or-later |
| cytoscape, cytoscape-cose-bilkent, cytoscape-fcose | Mapa mental y arquitectura | MIT |
| katex | Fórmulas matemáticas | MIT |
| marked | Texto en Markdown de los rótulos | MIT |
| dompurify | Limpieza del HTML de los rótulos | MPL-2.0 o Apache-2.0 |
| @braintree/sanitize-url | Limpieza de enlaces | MIT |
| roughjs | Trazo a mano alzada | MIT |
| khroma | Cálculo de colores | MIT |
| stylis | Estilos CSS | MIT |
| dayjs | Fechas del diagrama de Gantt | MIT |
| chevrotain, @mermaid-js/parser | Lectura del código | Apache-2.0 / MIT |
| @upsetjs/venn.js | Diagrama de Venn | MIT |
| @iconify/utils | Iconos | MIT |
| es-toolkit, lodash-es, ts-dedent, uuid | Utilidades | MIT |

ELK se usa bajo su licencia GPL-3.0-or-later, que es compatible con la AGPL v3
de Sirena. Algunas bibliotecas conservan además su aviso de licencia dentro de
los archivos (`@license`).

`scripts/actualizar-mermaid.sh` rehace esta lista al actualizar Mermaid.

## Dependencias de Mermaid 12.0.0 según npm (23-09-2026)

- @braintree/sanitize-url: MIT
- @iconify/utils: MIT
- @upsetjs/venn.js: MIT
- chevrotain: Apache-2.0
- cytoscape: MIT
- cytoscape-cose-bilkent: MIT
- cytoscape-fcose: MIT
- d3: ISC
- d3-sankey: BSD-3-Clause
- dagre-d3-es: MIT
- dayjs: MIT
- dompurify: (MPL-2.0 OR Apache-2.0)
- elkjs: EPL-2.0 OR GPL-3.0-or-later
- es-toolkit: MIT
- katex: MIT
- khroma: sin dato en npm: comprobar a mano
- marked: MIT
- roughjs: MIT
- stylis: MIT
- ts-dedent: MIT
- uuid: MIT
- @mermaid-js/parser: MIT
