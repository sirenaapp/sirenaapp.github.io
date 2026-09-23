#!/usr/bin/env bash
# Actualiza la copia local de Mermaid que usa Sirena.
# Uso: scripts/actualizar-mermaid.sh [version]   (por omisión, la última)
set -euo pipefail

VERSION="${1:-latest}"
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$TMP"
npm pack "mermaid@${VERSION}" >/dev/null
tar xzf mermaid-*.tgz

NUEVA="$(node -p "require('./package/package.json').version")"
DESTINO="$RAIZ/vendor/mermaid"

rm -rf "$DESTINO/chunks"
mkdir -p "$DESTINO/chunks/mermaid.esm.min"
cp package/dist/mermaid.esm.min.mjs "$DESTINO/"
cp package/dist/chunks/mermaid.esm.min/*.mjs "$DESTINO/chunks/mermaid.esm.min/"
cp package/LICENSE "$DESTINO/LICENSE.txt"
echo "$NUEVA" > "$DESTINO/VERSION"

# Bibliotecas que Mermaid lleva dentro, con su licencia: la lista de npm
# sustituye a la anterior al final de TERCEROS.md (la tabla explicada de arriba
# se repasa a mano con ella delante).
sed -i '/^## Dependencias de Mermaid /,$d' "$DESTINO/TERCEROS.md"
sed -i -e :a -e '/^\n*$/{$d;N;ba' -e '}' "$DESTINO/TERCEROS.md"
{
  echo
  echo "## Dependencias de Mermaid $NUEVA según npm ($(date +%d-%m-%Y))"
  echo
  node -p "Object.keys(require('./package/package.json').dependencies).join('\\n')" | while read -r dep; do
    case "$dep" in @types/*) continue ;; esac
    licencia="$(npm view "$dep" license 2>/dev/null || true)"
    echo "- $dep: ${licencia:-sin dato en npm: comprobar a mano}"
  done
} >> "$DESTINO/TERCEROS.md"

echo "Mermaid actualizado a $NUEVA en vendor/mermaid ($(du -sh "$DESTINO" | cut -f1))."
echo "Conviene probar los ejemplos antes de publicar: ver docs/pruebas.md"
