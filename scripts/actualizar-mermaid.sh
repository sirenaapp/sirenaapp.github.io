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

echo "Mermaid actualizado a $NUEVA en vendor/mermaid ($(du -sh "$DESTINO" | cut -f1))."
echo "Conviene probar los ejemplos antes de publicar: ver docs/pruebas.md"
