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
| [7](0007-ajustes-del-dibujo.md) | El aspecto del dibujo se ajusta con la configuración, sin tocar el código | sustituido por el 8 |
| [8](0008-ajustes-escritos-en-el-codigo.md) | Los ajustes del dibujo se escriben en el código del diagrama | aceptado |
| [9](0009-ajuste-de-la-vista.md) | Un diagrama muy alargado se ajusta por su lado corto | aceptado |
| [10](0010-sugerencia-de-orientacion.md) | La página propone la dirección en lugar de maquillar el resultado | descartado |
| [11](0011-biblioteca-en-el-navegador.md) | Los diagramas se guardan en el propio navegador | aceptado |
| [12](0012-motor-de-distribucion-escrito-en-la-cabecera.md) | El motor de distribución es elk por defecto y se escribe en la cabecera | aceptado |
| [13](0013-la-biblioteca-no-pierde-un-diagrama-al-sustituir-el-texto.md) | Sustituir el texto abre un diagrama nuevo, y la biblioteca tiene un máximo | aceptado |
| [14](0014-la-impresion-se-monta-en-una-hoja-aparte.md) | La impresión se monta en una hoja aparte, sin biblioteca de PDF | aceptado |

Para añadir una, se copia [la plantilla](0000-plantilla.md) con el número
siguiente y se anota aquí. Una decisión que deje de valer no se borra: se marca
como «sustituida por» la nueva, para que quede el rastro.
