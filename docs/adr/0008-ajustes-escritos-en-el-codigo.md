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

Se añade además un color propio, elegido con el selector del sistema, del que se
deriva el borde y el color de las líneas.

## Alternativas descartadas

- **Mantener la configuración solo en la aplicación (ADR 7).** Descartada: el
  usuario no ve lo que cambia y el aspecto no viaja con el archivo.
- **Escribir la cabecera solo al guardar o al compartir.** Descartada porque
  seguiría sin verse mientras se trabaja.

## Consecuencias

El código del diagrama gana una primera línea que no escribió el usuario. A
cambio, lo que se ve en pantalla es exactamente lo que contiene el archivo, y el
diagrama conserva su aspecto en cualquier editor de Mermaid.
