# verein-hfbm.de

Webseite des Vereins „Hilfe für besondere Menschen e.V.“.
Gehostet mit **GitHub Pages** aus dem Branch `master`; GitHub baut die Seite mit
[Jekyll](https://jekyllrb.com) – ein Push genügt, es gibt keinen eigenen Build-Schritt.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Startseite (Abschnitte: Begrüßung, Was wir tun, Projekte, Aktionen, Spenden, Vorstand, Kontakt) |
| `_beitraege/` | **Ein Projekt oder eine Aktion = eine Datei.** Erscheint automatisch auf der Startseite. |
| `_data/verein.yml` | Anschrift, E-Mail, Bankverbindung, Formular-Adresse – an einer Stelle |
| `_data/vorstand.yml` | Vorstand (Name, Amt, Ort, Foto) |
| `_layouts/`, `_includes/` | Seitengerüst, Kopf- und Fußzeile, Karten |
| `assets/css/stil.css` | Gestaltung (Farben aus dem Logo, oben als Variablen) |
| `assets/js/seite.js` | Menü, Bildansicht, IBAN kopieren |
| `assets/js/kontakt.js` | Kontaktformular (Formspree) |
| `assets/bilder/<beitrag>/` | Bilder als WebP in 800 und 1600 px Breite |
| `Impressum.html`, `Datenschutz.html`, `credits.html` | Rechtliche Seiten |

Keine externen Dienste beim Seitenaufruf (Schrift, Skripte, Bilder liegen hier) – nur das
Kontaktformular sendet beim Absenden an Formspree.

## Neues Projekt hinzufügen

1. Bilder optimieren (braucht ImageMagick):

   ```sh
   werkzeuge/bild-optimieren.sh ~/Downloads/titelfoto.jpg assets/bilder/mein-projekt titel
   werkzeuge/bild-optimieren.sh ~/Downloads/foto1.jpg     assets/bilder/mein-projekt bild-1
   werkzeuge/bild-optimieren.sh ~/Downloads/foto2.jpg     assets/bilder/mein-projekt bild-2
   ```

2. Datei `_beitraege/mein-projekt.html` anlegen (Dateiname = Adresse `/mein-projekt.html`,
   nur a–z, 0–9 und Bindestrich – keine Umlaute oder Großbuchstaben):

   ```html
   ---
   title: "Ausführlicher Titel der Seite"
   kurztitel: "Kurzer Titel für die Karte"
   untertitel: "Einleitungssatz unter der Überschrift"
   teaser: "Ein Satz für die Karte auf der Startseite."
   kategorie: projekt          # oder: aktion
   date: 2026-11-01            # Pflicht – bestimmt die Reihenfolge
   titelbild: titel
   bilder: [bild-1, bild-2]    # erstes Bild = großes Bild oben
   ---
   <p>Text des Beitrags …</p>
   ```

3. Committen und pushen – nach 1–2 Minuten ist die Seite live.

## Lokale Vorschau

```sh
jekyll serve        # dann http://localhost:4000
```
