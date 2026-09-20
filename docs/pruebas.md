# Pruebas

La página se prueba con `probar-web` (Playwright), que cubre Chromium, Firefox y
WebKit en escritorio, móvil y tableta.

```bash
python3 -m http.server 8931           # hace falta servidor: la página usa módulos ES
probar-web http://localhost:8931/index.html -n chromium,firefox -d escritorio,movil -t ambos
```

Antes de publicar un cambio que toque el dibujo o la exportación conviene
comprobar, con un script de pasos, estas tres cosas:

1. Que los 18 ejemplos se dibujan sin error en Chromium y en Firefox.
2. Que cada ejemplo se exporta a PNG. Algunos tipos de diagrama (el recorrido de
   usuario, por ejemplo) colocan los rótulos en `<foreignObject>`; al exportar se
   sustituyen por texto SVG, porque si no el navegador impide convertir el
   dibujo en imagen.
3. Que el enlace compartido restaura el código tal cual, con acentos y eñes.

## Aviso de versión nueva de Mermaid

Cada lunes, la acción `.github/workflows/check-mermaid-version.yml` compara
`vendor/mermaid/VERSION` con la última versión publicada en npm y, si son
distintas, abre una incidencia con los pasos de actualización. También se puede
lanzar a mano desde la pestaña Actions del repositorio.

## Ajustes que dependen de la versión de Mermaid

Mermaid 12 cambió el motor de distribución por defecto de `dagre` a `elk`, que
no atiende a la forma de las líneas (`flowchart.curve`) ni a la separación
(`nodeSpacing`, `rankSpacing`). Sirena mantiene `elk`, pasa a `dagre` al elegir otra forma de línea y escribe
siempre el motor en la cabecera; la tabla con lo medido está en
[docs/adr/0012](adr/0012-motor-de-distribucion-escrito-en-la-cabecera.md). Al
actualizar Mermaid conviene repetir esas medidas.
