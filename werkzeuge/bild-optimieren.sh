#!/bin/bash
# Erzeugt web-optimierte WebP-Versionen eines Bildes.
#   werkzeuge/bild-optimieren.sh <quelle> <zielordner> [name]
# Ergebnis: <zielordner>/<name>-400.webp, -800.webp und -1600.webp
# (Breite in Pixeln; kleinere Originale werden nicht vergrößert).
# Dateinamen bitte nur mit a–z, 0–9 und Bindestrich.
set -euo pipefail
quelle="$1"; ziel="$2"; name="${3:-$(basename "${quelle%.*}")}"
mkdir -p "$ziel"
for breite in 400 800 1600; do
  magick "$quelle" -auto-orient -resize "${breite}x>" -strip -quality 80 "$ziel/$name-$breite.webp"
done
