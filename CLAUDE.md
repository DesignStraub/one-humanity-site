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
- **Games (Godot):** Kometen & Kronen (Repo `aliens-in-earth`), Underground Sprint (Repo `underground-sprint`), Pfandpanik Aachen (Brotato-artiges Arena-Survival, im Chat gebaut, liegt in einem Claude-Scratch-Ordner `pfand_und_panik`, kein Repo; Tagline wie auf itch.io „Ein Penner-Survival aus Öcher Gassen. Mit Pfand, Pech und Printen.“ – Marcello, 26.11.2026: „wir sind real“). itch.io-Seiten noch `#TODO-itch-…`.
- **Tools:** TubeShield (Open-Source-Adblocker für Safari mit YouTube-Auto-Pause-Block, optional Startseite ohne Vorschläge und Shorts ausblenden; Repo `tubeshield`, lokal `~/Projekte/tubeshield`; Bild ist ein echter Screenshot `img/tubeshield-screenshot.svg`, bleibt immer Open Source, weitere Funktionen folgen), LifeBar (fertig, täglich im Einsatz), GlideSplit (Konzept, Repo + YouTube-Short), Nixie-Uhr (Skizze).
- **3D-Design:** Laptop-Badge (Weltherz), LifeBar-Standfuß, Low-Profile-Tastenkappen, Skadis-Schreibtischwand, Gelber-Sack-Halterung (alle MakerWorld), Sticker & Lesezeichen.
- **Archiv:** Mode System, Proof.
- **Nicht auf die Seite:** NSFW-/Erotik-Modelle (z. B. auf MakerWorld/Cults3D) und das interne Bild-zu-3D-Projekt.

**Wichtig:** Auf den gedruckten Mode-System-Karten ist ein QR-Code zu `https://oneplanetonehumanity.com/Mode-system-guide.html`. Diese Datei nie umbenennen, verschieben oder löschen (GitHub Pages unterscheidet Groß-/Kleinschreibung). Generell: bestehende URLs bleiben erreichbar.

## 3D-Galerie (Startseite `index.html`)
Entscheidung (Marcello, 25.11.2026): eine 3D-Galerie, durch die man läuft – ähnlich dem Raumplaner. Seit 26.11.2026 (abends, Marcello: „die Galerie soll der Default sein“) ist die Galerie die **Startseite `index.html`**. Die bisherige Übersicht liegt unter `uebersicht.html` (Links „Liste“ in der Galerie, „Projekte“/„Mitmachen“ im Menü der Unterseiten). „3D-Galerie“ im Top-Menü führt zu `index.html`. `galerie.html` bleibt als Weiterleitung auf `/` (mit Hash) erhalten. Überarbeitet 26.11.2026: **Sternemuseum** – mystisch, wie im Weltall, kein normales Museum; man soll sich fühlen, als schwebe man durchs All, und die Ankunft soll cinematic sein. Code: `assets/gallery.js` (Szene), `assets/gallery.css` (Overlay), three.js r160 liegt im Repo unter `assets/vendor/` (kein CDN).
- Look: dunkel, nachtblau bis schwarz. Räume ohne Decke unter Sternenhimmel (ein Planet mit Stadtlichtern auf der Nachtseite = „One Planet“), Glasböden, durch die man Sterne unter sich sieht, in jedem Raum ein leuchtendes Bodenzeichen in der Raumfarbe (`floorEmblem`/`EMBLEMS`: Foyer Herz, Robotics Yusu-Gesicht am Eingang, Games Gamepad, Apps Browserfenster, Werkstatt Zahnrad, Kunst Herz). Wände mit Sternbildern, leuchtende Kanten in der Raumfarbe (Foyer gold, Robotics cyan, Games pink, Werkstatt amber, Kunst violett), schwebende Lichtpartikel. Bewegung mit Trägheit, leichtes Schweben im Stand, Sprünge mit wenig Schwerkraft.
- Start (HTML, auch für Suchmaschinen): Filmtitel über dem All mit schwarzen Balken, dahinter die **Weltkugel** (geht wie ein Erdaufgang hinter dem Knopf auf), ein Knopf **„Eintreten“** → erst wird in die Erde hineingezoomt, Lichtblitz, dann steht man im Robotics-Raum. Darunter gut sichtbare Raum-Knöpfe (Pillen mit Farbpunkt) und der Link „Zur Webansicht ohne 3D“.
- Ankunft (Reihenfolge bewusst ohne Anflug, Marcello 26.11.2026: erst Raum, dann dunkel, dann Hände war unlogisch): Zoom in die Erde (ca. 3 s, mit Warp-Streifen, Titelkarte „One Planet / One Humanity“ und leichtem Wackeln), Lichtblitz, Aufprall (Bass-Schlag, Kamera-Ruck, Vibration am Handy), man steht im gedämpften Raum auf dem Bodenzeichen und sieht die eigenen holografischen Hände, Blick hoch, dann gehen die Lichter an, Yusus Gesicht fährt hoch und Yusu begrüßt einen (Untertitel + Piepsstimme). Danach Balken weg, Bedienung frei. Klick/Leertaste überspringt. Wer schon einmal da war (localStorage `oh-arrived`), bekommt die kurze Ankunft (kürzerer Zoom, ohne Hände, ca. 3,5 s). Andere Räume zeigen beim Ankommen/Beamen den Raumnamen als Untertitel.
- Ton: erzeugt mit Web Audio (keine Dateien) – leiser Weltraum-Klang, Whoosh, Beam, Yusus Stimme. Lautsprecher-Knopf oben schaltet ihn aus, die Wahl wird im Browser gemerkt.
- Räume um ein Foyer, mit kurzen Brücken dazwischen (`GAP` in gallery.js; ein Raum kann über `from` in `PASSAGES` auch an einem anderen Raum hängen): **Foyer** (Willkommen, Wofür wir stehen, Marcello, Sternkarte/Lageplan, Mitmachen, schwebendes Weltherz = das echte Logo in 3D mit ausgeschnittenen Kontinenten, Form in `assets/models/world-heart.js`, erzeugt mit `tools-dev/svg_to_shape.py` aus `~/Documents/Design/Design 2.0/Heart_Badge_Export/logo.svg`), **Robotics** (nur für Yusu – andere Roboter-Ideen wie Ringwheel stehen in der Werkstatt „Auf der Werkbank“; Yusu als Hologramm – seit 26.11.2026 der **echte Kopf aus dem CAD** (`assets/models/yusu-head.bin`: weiße Low-Poly-Schale, schwarze Teile, silbernes Visier); Augen, LED-Mund und rote Wangen leuchten direkt auf dem Visier (Canvas frontal projiziert, Layout `EYES_VISOR`); schwebt über einem Projektor und dreht sich zum Besucher; der gezeichnete Kopf ist nur Ersatz, falls das Modell nicht lädt; Westwand Entstehung = `image` + `gallery`, kompakt: eine Station pro Schritt, nur ein Augen-Bild, ohne App-Screenshot (der hängt im Apps-Raum), Ostwand aktueller Stand = `now` mit Videos, Nordwand: zwei Tafeln links und rechts von Yusu – Vorstellung und Etappen aus `timeline` –, damit das Hologramm nichts verdeckt), **Games** (Automaten pro Spiel, itch.io), **Apps** (hinter dem Games-Raum, Akzent grün: alles, was man direkt im Browser öffnen kann = Projekte mit `demo`-Link, z. B. Raumplaner und Yusu-Begleit-App; große Bildschirme mit „Jetzt öffnen ↗“; optionales Feld `app` in `projects.data.js` für eigenes Bild/Titel im Apps-Raum; diese Projekte stehen nicht zusätzlich in der Werkstatt), **Werkstatt** (Tools und weitere Robotik-Projekte an Tischen, 3D-Design an der Lochwand, Werkstatt-Fotos), **Kunst** (Bilder aus `assets/artworks.data.js`; solange die Liste leer ist, bleibt die Tür im Foyer zu: „Bald hier“ + Instagram, Klick öffnet den Instagram-Link – sobald Artworks eingetragen sind, öffnet sich der Raum von selbst).
- Bedienung: Ziehen/Wischen = umsehen (Maus und Touch gleich: nach rechts ziehen = nach rechts schauen), Boden klicken = hingehen, Exponat klicken = Info-Tafel (Texte/Buttons aus `projects.data.js`), WASD/Pfeile laufen zügig, Shift rennt, Leertaste springt, auf Touch-Geräten Joystick unten links (laufen, Stärke = Tempo) und Sprung-Knopf rechts, Schnellnavigation oben beamt in die Räume. Links `/#robotics|games|apps|tools|design|kunst|mitmachen|project-<id>` beamen direkt in den Raum.
- Neue Projekte erscheinen automatisch im passenden Raum. Kunstwerke nur in `artworks.data.js` pflegen (Bilder nach `img/art/`, verkleinert, ohne EXIF).
- Echtes CAD des Yusu-Kopfs: `assets/models/yusu-head.bin` (erzeugt mit `tools-dev/stl_to_mesh.py` aus `Emotional Robot/emotion_lab/hardware/kopf/export/stl/`). Kein Display hinter dem Visier mehr (passte nicht), stattdessen Augen als Leuchten auf dem Visier.
- Hände bei der Ankunft: Roboterhände wie Yusus Körperkonzept (weiße facettierte Schalen, schwarze Gelenke), bauen sich mit blauem Lichtrand auf.
- `?debug` an der Adresse stellt `window.OH_GALLERY` zum Testen bereit (`advance(sek)` spult die Szene vor, nützlich im verdeckten Browser-Fenster).
- „Webansicht“ (mobil „Web“) in der Galerie führt zur Übersicht `uebersicht.html`.

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
  - `gallery.js` / `gallery.css` – 3D-Galerie (Startseite)
- Bestehende Seiten (impressum.html, datenschutz.html, tools.html, lifebar.html, Mode-system-guide.html, proof.html) erhalten und im selben Design halten.
- Schnell, leicht, responsive, Hell-/Dunkelmodus. Keine Tracker, keine Embeds (auch kein YouTube-Embed – nur Links). Einzige Ausnahme: GoatCounter (`onehumanity.goatcounter.com`) auf allen Seiten, nur für Seitenaufrufzahlen, cookielos. Keine weiteren Analytics-Dienste ohne Freigabe.
- Bilder liegen im Repo (img/). Fotos vor dem Einbinden verkleinern und Metadaten (EXIF/GPS) entfernen.
- Nach CSS-/JS-Änderungen den Versionsparameter `?v=…` in allen HTML-Dateien hochzählen, sonst zeigen Browser (v. a. Safari) alte Dateien aus dem Cache.
- Fehlende Links sind als `#TODO-…` markiert: `grep -rn "#TODO" .` zeigt alle.
- Vor größeren Umbauten kurz Plan zeigen, dann umsetzen.
