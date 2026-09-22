# 19. Los ejemplos incluyen tipos de diagrama en beta

Fecha: 2026-09-22 · Estado: aceptado

## Contexto

Mermaid 12 dibuja 35 tipos de diagrama y los ejemplos de Sirena cubrían 21.
De los que faltaban, tres tienen uso claro en el aula: el gráfico de radar
(perfil de competencias), el diagrama de Venn (comparar conceptos) y el de
Ishikawa o espina de pescado (análisis de causas). Los tres están marcados por
Mermaid como «beta» (`radar-beta`, `venn-beta`, `ishikawa-beta`): su sintaxis
puede cambiar en versiones futuras sin aviso de compatibilidad.

Los demás tipos que faltan son técnicos y quedan fuera del público de Sirena:
C4, requisitos, paquetes de red, casos de uso, carriles, Wardley, Cynefin,
modelado de eventos y los cuatro diagramas de gramáticas (ABNF, EBNF, PEG y
raíles). El árbol de carpetas (`treeView-beta`) se probó y se dejó fuera porque
con nombres entre comillas el dibujo sale mal ordenado en esta versión.

## Decisión

Se añaden ejemplos de radar, Venn e Ishikawa, en los cinco idiomas y cada uno
en su grupo (datos, estructuras y procesos). Solo el radar lleva `accTitle` y
`accDescr`: el analizador del Venn los rechaza y el del Ishikawa los dibuja
como si fueran texto del diagrama. En esos dos, el título y la descripción van
en comentarios `%%` al principio del código, que Mermaid retira antes de
analizar y por eso valen en cualquier tipo de diagrama.

Al actualizar Mermaid (`scripts/actualizar-mermaid.sh`) hay que cargar estos
tres ejemplos y comprobar que siguen dibujándose; si la sintaxis ha cambiado,
se corrige el ejemplo en `js/examples.js` en la misma actualización.

## Alternativas descartadas

- **Solo tipos estables.** Descartado: dejaría fuera los tres organizadores
  gráficos más usados en clase de entre los que faltaban.
- **Añadir todos los tipos que admite Mermaid.** Descartado: los técnicos
  alargan el menú sin servir al profesorado, y cada ejemplo hay que
  mantenerlo en cinco idiomas.

## Dos tipos más: carriles y árbol (22-09-2026)

Del inventario de lo que Mermaid 12.0.0 dibuja y Sirena no ofrecía, el autor
aprobó dos tipos nuevos, con el mismo criterio de esta decisión (uso en el
aula, no ingeniería): **carriles** (`swimlane-beta`, un proceso repartido
por quién hace cada cosa: alumnado y profesorado en el ejemplo) y **árbol**
(`treeView-beta`, una jerarquía por sangría: la estructura de un trabajo de
investigación en el ejemplo, con notas y un elemento resaltado). Los dos
admiten título y descripción accesibles (comprobado), así que no van como
comentario. Quedan fuera, por ser de ingeniería o consultoría, `requirement`,
`C4`, `packet`, `agentflow`, `eventmodeling`, `wardley`, `cynefin`,
`railroad` y `usecase`.

## Consecuencias

El menú pasa de 21 a 24 ejemplos y cubre los organizadores gráficos habituales
en el aula (25 desde el 22-09-2026, con el mapa conceptual de la ecuación de
segundo grado, que enseña las fórmulas del [ADR 22](0022-las-formulas-se-escriben-con-latex-y-se-editan-con-edicuatex.md)). A cambio, cada actualización de Mermaid añade una comprobación, y
un cambio de sintaxis en los tipos beta puede romper el ejemplo hasta que se
corrija.
