Mermaid ha publicado la versión **$ULTIMA**. Sirena sigue con la **$INSTALADA**.

Para actualizarla:

```bash
scripts/actualizar-mermaid.sh
```

Después conviene comprobar lo que indica [docs/pruebas.md](../blob/main/docs/pruebas.md):
que los 18 ejemplos se dibujan y se exportan a PNG en Chromium y en Firefox, y que
el enlace compartido sigue restaurando el código. En un salto de versión mayor,
revisar además si ha cambiado la sintaxis de algún tipo de diagrama.

Aviso automático de [.github/workflows/check-mermaid-version.yml](../blob/main/.github/workflows/check-mermaid-version.yml).
