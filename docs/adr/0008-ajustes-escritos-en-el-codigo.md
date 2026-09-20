# 8. Los ajustes del dibujo se escriben en el código del diagrama

Fecha: 2026-09-20 · Estado: aceptado · Sustituye a [ADR 7](0007-ajustes-del-dibujo.md)

## Contexto

El [ADR 7](0007-ajustes-del-dibujo.md) decidió aplicar el trazo, el tamaño, el
color y la distribución al dibujar, sin tocar el código, para no complicar el
texto que escribe el usuario.

En el uso quedó claro que eso esconde lo que está pasando: se cambia un ajuste y
el panel de código no refleja nada. Además, el aspecto se perdía al guardar el
archivo `.mmd` o al abrirlo en otro editor.

## Decisión

Cada ajuste escribe una cabecera `%%{init: …}%%` en la primera línea del código,
que es el mecanismo estándar de Mermaid. La cabecera solo recoge lo que se
aparta de lo normal, y desaparece cuando todo vuelve a sus valores de serie.

La lectura funciona en los dos sentidos: si el código ya trae una cabecera,
escrita a mano o venida de otro sitio, los selectores se colocan solos. Y como
la configuración vive en el código, el enlace compartido ya no necesita
repetirla; los enlaces antiguos, que sí la llevaban en parámetros aparte, se
siguen entendiendo.

Se añade además «Color propio», que abre un selector para cada elemento del
dibujo: relleno, borde, líneas y texto, que son las variables `primaryColor`,
`primaryBorderColor`, `lineColor` y `primaryTextColor` de Mermaid. Al cambiar el
relleno, los otros tres se recalculan solos mientras no se hayan tocado a mano;
en cuanto se elige uno, ese se respeta.

No todos los ajustes son configuración: la dirección del diagrama y el mostrar
los valores de un diagrama de sectores son parte de su sintaxis, así que se
escriben en el cuerpo (`flowchart LR`, una línea `direction LR`, `pie showData`)
y no en la cabecera. Cada control aparece solo en los tipos de diagrama donde
tiene efecto, y se actualiza al cambiar el código aunque el menú esté abierto.

## Alternativas descartadas

- **Mantener la configuración solo en la aplicación (ADR 7).** Descartada: el
  usuario no ve lo que cambia y el aspecto no viaja con el archivo.
- **Escribir la cabecera solo al guardar o al compartir.** Descartada porque
  seguiría sin verse mientras se trabaja.

## Consecuencias

El código del diagrama gana una primera línea que no escribió el usuario. A
cambio, lo que se ve en pantalla es exactamente lo que contiene el archivo, y el
diagrama conserva su aspecto en cualquier editor de Mermaid.
