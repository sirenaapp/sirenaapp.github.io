Mermaid ha publicado la versión **$ULTIMA**. Sirena sigue con la **$INSTALADA**.

Para actualizarla:

```bash
scripts/actualizar-mermaid.sh
```

Después conviene comprobar lo que indica [docs/pruebas.md](../blob/main/docs/pruebas.md):
que todos los ejemplos se dibujan y se exportan a PNG en Chromium y en Firefox, y que
el enlace compartido sigue restaurando el código. En un salto de versión mayor,
revisar además si ha cambiado la sintaxis de algún tipo de diagrama.

## Parches de Sirena a fallos de Mermaid

Cada ejemplo se ha dibujado con Mermaid $ULTIMA sola. Si un fallo aparece como
**corregido**, al actualizar se quita su parche (y su fila de
`scripts/parches-mermaid.json`) y se prueba el ejemplo en Sirena. Detalles en
[docs/parches-mermaid.md](../blob/main/docs/parches-mermaid.md).

$PARCHES

Aviso automático de [.github/workflows/check-mermaid-version.yml](../blob/main/.github/workflows/check-mermaid-version.yml).
