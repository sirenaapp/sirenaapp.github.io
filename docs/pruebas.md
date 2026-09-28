# Pruebas

La página se prueba con `probar-web` (Playwright), que cubre Chromium, Firefox y
WebKit en escritorio, móvil y tableta.

```bash
python3 -m http.server 8931           # hace falta servidor: la página usa módulos ES
probar-web http://localhost:8931/index.html -n chromium,firefox -d escritorio,movil -t ambos
```

Antes de publicar un cambio que toque el dibujo o la exportación conviene
comprobar, con un script de pasos, estas tres cosas:

1. Que todos los ejemplos se dibujan sin error en Chromium y en Firefox, en los
   cinco idiomas: cada idioma tiene su propio código, y un texto sin comillas
   puede fallar en uno y no en otro.
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

## Modo eXeLearning

El modo eXe ([ADR 29](adr/0029-dentro-de-exelearning-sirena-devuelve-el-diagrama-al-editor-como-edicuatex.md))
solo se activa con Sirena abierta dentro del editor de eXe y en su mismo origen.
Para probarlo sin montar eXe basta una página, servida junto a Sirena, que
cargue el TinyMCE y `app/common/mermaidMaxSize.js` de un clon de eXe, defina
`window.eXeLearning = { app: { locale: { lang } }, mermaidMaxSize }` y una
función `window._`, y abra Sirena con
`tinymce.activeEditor.windowManager.openUrl({ url: '…/index.html', buttons: [] })`.

Los ejemplos se comprueban también con el Mermaid de eXe
(`app/common/mermaid/mermaid.min.js` de su versión estática): todos, en los
cinco idiomas. Los que no entienda no se ofrecen dentro de eXe (ADR 29), pero
conviene que los demás valgan para las dos versiones.

Conviene comprobar, en Chromium y en Firefox: insertar un diagrama nuevo (con
`<`, `&` y `$$…$$`), el rechazo de una medida mal escrita, volver a abrir el
diagrama y sustituirlo en su sitio, deshacer, cancelar, que no se escribe nada
en `localStorage` y el idioma (uno que traduzca eXe, uno de Sirena y el
valenciano). Después, en un eXe de verdad: la versión web que lleva dentro la
aplicación de escritorio (`resources/app.asar`, carpeta `dist/static`), con
Sirena copiada en `app/common/sirena`. En una caja de texto hay dos editores
(texto y retroalimentación): antes de abrir Sirena a mano hay que enfocar el
visible, porque el diagrama va al editor activo.

## Parches a fallos de Mermaid

Los fallos de Mermaid que Sirena corrige por su cuenta están en
[docs/parches-mermaid.md](parches-mermaid.md). Para saber si siguen en una
versión de Mermaid:

```bash
npm i --no-save playwright@1.63.0      # si no está; con npx playwright install chromium
node scripts/comprobar-parches.mjs                        # la copia de vendor/mermaid
node scripts/comprobar-parches.mjs --mermaid <carpeta>    # otra versión (package/dist)
```

El aviso semanal de versión nueva lo hace solo y pone el resultado en su
incidencia.
