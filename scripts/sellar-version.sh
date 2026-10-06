#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later
# Pone (o actualiza) un ?v=<huella> en los archivos propios de CSS y JS que
# carga index.html, para que el navegador no siga sirviendo una versión
# guardada cuando el archivo cambia. La huella sale del contenido, así que
# solo cambia lo que de verdad ha cambiado.
#
# También la pone en la dirección con que js/sirena.js carga Mermaid
# (vendor/mermaid/mermaid.esm.min.mjs), que no cambia de nombre al actualizarlo.
# Va antes que las huellas de index.html, porque cambia js/sirena.js.
#
# También escribe en index.html el número de versión de package.json, en el
# pie y en la ventana de créditos, con el enlace a las notas de esa versión.
#
# Se ejecuta desde la raíz del repositorio, antes de confirmar los cambios:
#   scripts/sellar-version.sh
set -euo pipefail
cd "$(dirname "$0")/.."

python3 - <<'PY'
import hashlib, io, re

def huella(ruta):
    with open(ruta, 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]

codigo = 'js/sirena.js'
fuente = io.open(codigo, encoding='utf-8').read()
con_huella = re.sub(r"(vendor/mermaid/mermaid\.esm\.min\.mjs)(?:\?v=[^'\"]*)?",
                    r'\g<1>?v=' + huella('vendor/mermaid/mermaid.esm.min.mjs'), fuente)
if con_huella != fuente:
    io.open(codigo, 'w', encoding='utf-8').write(con_huella)
    print(codigo + ' sellado')

pagina = 'index.html'
texto = io.open(pagina, encoding='utf-8').read()

def sellar(m):
    atributo, ruta = m.group(1), m.group(2)
    if ruta.startswith(('http', '//', 'vendor/')):
        return m.group(0)
    try:
        return '%s="%s?v=%s"' % (atributo, ruta, huella(ruta))
    except FileNotFoundError:
        return m.group(0)

nuevo = re.sub(r'\b(href|src)="((?:css|js|lang)/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"', sellar, texto)

import json
version = json.load(io.open('package.json', encoding='utf-8'))['version']
nuevo = re.sub(r'(<span class="version-num">)[^<]*(</span>)', r'\g<1>' + version + r'\g<2>', nuevo)
nuevo = re.sub(r'(sirenaapp\.github\.io/releases/tag/v)[0-9][^"]*', r'\g<1>' + version, nuevo)
if nuevo != texto:
    io.open(pagina, 'w', encoding='utf-8').write(nuevo)
    print('index.html sellado')
else:
    print('sin cambios')
PY
