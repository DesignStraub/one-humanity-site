# CLAUDE.md – oneplanetonehumanity.com (OneHumanity Labs)

## Ziel
Die Website von **OneHumanity Labs**: ein unabhängiges Lab aus Aachen mit mehreren Bereichen – **Robotics, Games, Tools und 3D-Design**. Verschiedene Projekte, eine Haltung. Bisher eine Person (Marcello), künftig sollen weitere Menschen mitarbeiten. Die Seite zeigt die Projekte selbst – Ernsthaftigkeit entsteht durch echte Ergebnisse, nicht durch Sprüche.

Die Seite ist live (`main` → GitHub Pages). Größere Änderungen auf einem eigenen Branch vorbereiten und erst nach Freigabe nach `main` mergen. Nach einem Merge startet Pages manchmal keinen Build – dann `gh api -X POST repos/DesignStraub/one-humanity-site/pages/builds`.

## Marke
- Name: **OneHumanity Labs** (kurz **OneHumanity** für Logo, Gehäuse, Roboter). Auf YouTube heißt der Kanal **One Humanity Lab** (@marcelloswigswag).
- Persönlicher Handle auf den meisten Plattformen: **MarcelloSwigswag**.
- Leitsatz / Manifest: **One Planet, One Humanity**
- Logo: das Weltherz – steht für den Verbund der Menschheit
- Rechtlicher Rahmen: MorphicMoons (Einzelunternehmen, Aachen) – nur im Impressum/Footer
- Domain bleibt: oneplanetonehumanity.com
- Sprachen: Deutsch und Englisch (DE/EN-Umschalter)

## Positionierung
Ein unabhängiges Lab aus Aachen. Wir bauen Roboter, entwickeln Spiele und Werkzeuge und gestalten 3D-Modelle zum Drucken. Verschiedene Projekte, eine Haltung: offen, lokal und für Menschen gemacht. Nicht auf einen Bereich (z. B. nur Robotik) verengen.

- Kein Abschnitt „Arbeitsweise“ und keine Sätze wie „Ein Schritt nach dem anderen“ / „Stück für Stück“ / „zu Ende bringen“ – klingt aufgesetzt (Marcellos Feedback, zuletzt 15.11.2026: Abschnitt von der Startseite entfernt). Lieber zeigen als behaupten.

### Wofür wir stehen
- Offen – Code, Dateien, Anleitungen veröffentlichen, wo immer es geht.
- Lokal – kein Account, keine Cloud; Geräte und Werkzeuge funktionieren für sich.
- Menschlich – für Menschen gemacht, nicht für Kennzahlen.

## Ton
- Positiv, offen, einladend. Sagen, was wir wollen – nicht, wogegen wir sind.
- Professionell, aber persönlich. Kein Hobby-Entschuldigungston, aber auch nichts übertreiben: Status ehrlich angeben (Designstudie ist Designstudie).

## Wer dahinter steckt (kurz halten)
Marcello (MarcelloSwigswag) – Gründer, Software-Entwickler, gelernter Handwerker (Lackierer), baut in Aachen. Bisher allein, künftig mit weiteren Menschen.

## Projekte
Pflege nur in `assets/projects.data.js`. Gruppen: `robotics`, `games`, `tools` (große Karten je Bereich), `design` (kleine Karten „3D-Design“), `archive` (tools.html#archiv).

- **Aktueller Stand eines Projekts:** Feld `now` in `projects.data.js` (Fotos und kurze Videos ohne Ton, `img/*.mp4` + Poster-JPG). Wird nur auf `tools.html` gezeigt, nicht in der Übersicht; die ältere `gallery` klappt dann unter „Frühere Stände“ ein. Videos: H.264, 540 px breit, ohne Ton und Metadaten, keine Personen im Bild.
- **Yusu-Begleit-App:** `yusu/` (eigene dunkle Seite ohne Site-CSS, Prototyp, `noindex`): Augen, Persönlichkeits-Editor, Gespräch nur mit lokalem Ollama über `python3 yusu/lokal.py`. Verlinkt im Hero und auf der Yusu-Karte (Feld `demo`).
- **Robotics:** Yusu – OneHumanity R1 (Flaggschiff, Phase 0 Kopf; Code-Repo `emotion-lab` privat → `#TODO-yusu-repo`; Persönlichkeit heißt im Code „Roxy“ – auf der Seite nicht verwenden, außer Marcello will es), Ringwheel – Hybrid-Drohne (Designstudie, Repo + YouTube-Short).
- **Games (Godot):** Kometen & Kronen (Repo `aliens-in-earth`), Underground Sprint (Repo `underground-sprint`). itch.io-Seiten noch `#TODO-itch-…`.
- **Tools:** TubeShield (Open-Source-Adblocker für Safari mit YouTube-Auto-Pause-Block, optional Startseite ohne Vorschläge und Shorts ausblenden; Repo `tubeshield`, lokal `~/Projekte/tubeshield`; Bild ist ein echter Screenshot `img/tubeshield-screenshot.svg`, bleibt immer Open Source, weitere Funktionen folgen), LifeBar (fertig, täglich im Einsatz), GlideSplit (Konzept, Repo + YouTube-Short), Nixie-Uhr (Skizze).
- **3D-Design:** Laptop-Badge (Weltherz), LifeBar-Standfuß, Low-Profile-Tastenkappen, Skadis-Schreibtischwand, Gelber-Sack-Halterung (alle MakerWorld), Sticker & Lesezeichen.
- **Archiv:** Mode System, Proof.
- **Nicht auf die Seite:** NSFW-/Erotik-Modelle (z. B. auf MakerWorld/Cults3D) und das interne Bild-zu-3D-Projekt.

**Wichtig:** Auf den gedruckten Mode-System-Karten ist ein QR-Code zu `https://oneplanetonehumanity.com/Mode-system-guide.html`. Diese Datei nie umbenennen, verschieben oder löschen (GitHub Pages unterscheidet Groß-/Kleinschreibung). Generell: bestehende URLs bleiben erreichbar.

## Startseite: begehbare 3D-Galerie
Entscheidung (Marcello, 25.11.2026): Die Startseite ist eine 3D-Galerie, durch die man läuft – ähnlich dem Raumplaner. Überarbeitet 26.11.2026: **Sternemuseum** – mystisch, wie im Weltall, kein normales Museum. Code: `assets/gallery.js` (Szene), `assets/gallery.css` (Overlay), three.js r160 liegt im Repo unter `assets/vendor/` (kein CDN).
- Look: Räume ohne Decke unter Sternenhimmel (Nebel-Hintergrund, funkelnde Sterne, ein Planet mit Stadtlichtern auf der Nachtseite = „One Planet“). Wände mit Sternbildern, leuchtende Kanten in der Raumfarbe (Foyer gold, Robotics cyan, Games pink, Werkstatt amber, Kunst violett), schwebende Lichtpartikel. Das Gebäude schwebt als Module im All.
- Willkommenskarte (HTML, auch für Suchmaschinen): Logo, Leitsatz, Kurztext, Frage „Was möchtest du dir anschauen?“ mit Raum-Kacheln. Auswahl → Kamera fliegt hinunter, Lichtblitz, Ring und Lichtsäule am Boden, man schaut kurz auf die eigenen holografischen Hände, dann hoch in den Raum. Klick/Leertaste überspringt.
- Räume um ein Foyer: **Foyer** (Willkommen, Wofür wir stehen, Marcello, Sternkarte/Lageplan, Mitmachen, schwebendes Weltherz), **Robotics** (Hauptraum: Yusu als Hologramm – stilisierter weißer Kopf mit dem echten Gesicht: Augen, LED-Mund, rote Wangen; schwebt über einem Projektor und dreht sich zum Besucher; Westwand Entstehung = `image` + `gallery`, Ostwand aktueller Stand = `now` mit Videos, Nordwand Etappen aus `timeline`; weitere Robotik-Projekte am Eingang), **Games** (Automaten pro Spiel, itch.io), **Werkstatt** (Tools an Tischen, 3D-Design an der Lochwand, Werkstatt-Fotos), **Kunst** (Bilder aus `assets/artworks.data.js`, solange leer: Platzhalter mit Instagram-Link).
- Bedienung: Ziehen = umsehen (Maus: Blick folgt der Hand; Touch: Welt ziehen), Boden klicken = hingehen, Exponat klicken = Info-Tafel (Texte/Buttons aus `projects.data.js`), WASD/Pfeile laufen zügig, Shift rennt, Leertaste springt, Schnellnavigation oben beamt in die Räume. Links `index.html#robotics|games|tools|design|kunst|mitmachen|project-<id>` beamen direkt in den Raum.
- Neue Projekte erscheinen automatisch im passenden Raum. Kunstwerke nur in `artworks.data.js` pflegen (Bilder nach `img/art/`, verkleinert, ohne EXIF).
- Echtes CAD des Yusu-Kopfs: `assets/models/yusu-head.bin` (erzeugt mit `tools-dev/stl_to_mesh.py` aus `Emotional Robot/emotion_lab/hardware/kopf/export/stl/`) ist derzeit **nicht eingebunden** – Visier und Display passten nicht zusammen (Marcello, 26.11.2026: „erstmal nur das Gesicht“).
- `?debug` an der Adresse stellt `window.OH_GALLERY` zum Testen bereit (`advance(sek)` spult die Szene vor, nützlich im verdeckten Browser-Fenster).
- Die bisherige Startseite liegt als `uebersicht.html` („Als Liste ansehen“): Projekte-Raster mit Filter, Wofür wir stehen, Werkstatt, Wer dahinter steckt, Mitmachen.

`tools.html` („Alle Projekte“): Sprung-Chips, große Karten mit allen Etappen je Bereich, 3D-Design-Karten, Archiv als kompakte Liste (`data-projects="index:archive"`).

## Links
- YouTube (One Humanity Lab): https://www.youtube.com/@marcelloswigswag
- GitHub: https://github.com/DesignStraub
- MakerWorld: https://makerworld.com/@MarcelloStr
- Etsy: https://oneplanetonehumanity.etsy.com
- Cults3D: https://cults3d.com/en/users/MarcelloSwigSwag/3d-models – **auf der Seite nicht verlinken** (Marcello, 15.11.2026)
- itch.io: https://onehumanity.itch.io (Links zu den einzelnen Spielen noch offen: `#TODO-itch-kometen`, `#TODO-itch-sprint`)
- Instagram: https://www.instagram.com/marcelloswigswag/

## Technik / Regeln
- Statische Seite, kein Build-Schritt. Gemeinsame Dateien in `assets/`:
  - `site.css` – Design-System (Tokens oben, Hell-/Dunkelmodus über Tokens)
  - `site.js` – Navigation, Sprache, Theme-Umschalter, Reveal
  - `projects.data.js` – **einzige Stelle, um Projekte zu pflegen**
  - `projects.render.js` – baut die Karten (stellt `window.OH_RENDER` für die Galerie bereit)
  - `artworks.data.js` – **einzige Stelle, um Kunstwerke zu pflegen**
  - `gallery.js` / `gallery.css` – 3D-Galerie der Startseite
- Bestehende Seiten (impressum.html, datenschutz.html, tools.html, lifebar.html, Mode-system-guide.html, proof.html) erhalten und im selben Design halten.
- Schnell, leicht, responsive, Hell-/Dunkelmodus. Keine Tracker, keine Embeds (auch kein YouTube-Embed – nur Links). Einzige Ausnahme: GoatCounter (`onehumanity.goatcounter.com`) auf allen Seiten, nur für Seitenaufrufzahlen, cookielos. Keine weiteren Analytics-Dienste ohne Freigabe.
- Bilder liegen im Repo (img/). Fotos vor dem Einbinden verkleinern und Metadaten (EXIF/GPS) entfernen.
- Nach CSS-/JS-Änderungen den Versionsparameter `?v=…` in allen HTML-Dateien hochzählen, sonst zeigen Browser (v. a. Safari) alte Dateien aus dem Cache.
- Fehlende Links sind als `#TODO-…` markiert: `grep -rn "#TODO" .` zeigt alle.
- Vor größeren Umbauten kurz Plan zeigen, dann umsetzen.
