#!/bin/bash
# Erzeugt web-optimierte WebP-Versionen eines Bildes.
#   werkzeuge/bild-optimieren.sh <quelle> <zielordner> [name]
# Ergebnis: <zielordner>/<name>-800.webp und <name>-1600.webp (nur so groß wie das Original).
set -euo pipefail
quelle="$1"; ziel="$2"; name="${3:-$(basename "${quelle%.*}")}"
mkdir -p "$ziel"
for breite in 800 1600; do
  magick "$quelle" -auto-orient -resize "${breite}x${breite}>" -strip -quality 80 "$ziel/$name-$breite.webp"
done
