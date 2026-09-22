#!/usr/bin/env bash
# Pone (o actualiza) un ?v=<huella> en los archivos propios de CSS y JS que
# carga index.html, para que el navegador no siga sirviendo una versión
# guardada cuando el archivo cambia. La huella sale del contenido, así que
# solo cambia lo que de verdad ha cambiado.
#
# Se ejecuta desde la raíz del repositorio, antes de confirmar los cambios:
#   scripts/sellar-version.sh
set -euo pipefail
cd "$(dirname "$0")/.."

python3 - <<'PY'
import hashlib, io, re

pagina = 'index.html'
texto = io.open(pagina, encoding='utf-8').read()

def huella(ruta):
    with open(ruta, 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]

def sellar(m):
    atributo, ruta = m.group(1), m.group(2)
    if ruta.startswith(('http', '//', 'vendor/')):
        return m.group(0)
    try:
        return '%s="%s?v=%s"' % (atributo, ruta, huella(ruta))
    except FileNotFoundError:
        return m.group(0)

nuevo = re.sub(r'\b(href|src)="((?:css|js|lang)/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"', sellar, texto)
if nuevo != texto:
    io.open(pagina, 'w', encoding='utf-8').write(nuevo)
    print('index.html sellado')
else:
    print('sin cambios')
PY
