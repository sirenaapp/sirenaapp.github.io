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
