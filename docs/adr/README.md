# Decisiones de arquitectura (ADR)

Cada archivo recoge una decisión que condiciona el trabajo futuro: por qué se
tomó, qué se descartó y qué consecuencias tiene. Sirven para que nadie las
deshaga después de buena fe, ni siquiera nosotros dentro de un año.

| Nº | Decisión | Estado |
|---|---|---|
| [1](0001-mermaid-en-el-repositorio.md) | Mermaid se sirve desde el propio repositorio | aceptado |
| [2](0002-compartir-por-enlace.md) | El diagrama compartido viaja dentro del enlace | aceptado |
| [3](0003-etiquetas-sin-html.md) | Los rótulos se dibujan como texto SVG, no como HTML | aceptado |
| [4](0004-aviso-de-version-nueva.md) | El aviso de versión nueva llega por incidencia y por Telegram | aceptado |
| [5](0005-modo-visor-para-incrustar.md) | El diagrama se incrusta con la propia página en modo visor | aceptado |
| [6](0006-ayuda-y-accesibilidad.md) | La ayuda de sintaxis y los textos accesibles viven dentro de la página | aceptado |
| [7](0007-ajustes-del-dibujo.md) | El aspecto del dibujo se ajusta con la configuración, sin tocar el código | aceptado |

Para añadir una, se copia [la plantilla](0000-plantilla.md) con el número
siguiente y se anota aquí. Una decisión que deje de valer no se borra: se marca
como «sustituida por» la nueva, para que quede el rastro.
