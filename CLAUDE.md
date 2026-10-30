# CLAUDE.md – oneplanetonehumanity.com (OneHumanity Robotics)

## Ziel
Die Website von **OneHumanity Robotics**: Robotik aus Aachen, gerade in der Gründung. Kein Hobby-Projekt mehr, sondern ein Robotik-Vorhaben, das Konzepte und erste Prototypen zeigt. Die Seite soll vermitteln: Hier entsteht ernsthaft Robotik, Schritt für Schritt – das zeigt sich an den Projekten selbst, nicht an Sprüchen.

Die Seite ist live (`main` → GitHub Pages). Größere Änderungen auf einem eigenen Branch vorbereiten und erst nach Freigabe nach `main` mergen. Nach einem Merge startet Pages manchmal keinen Build – dann `gh api -X POST repos/DesignStraub/one-humanity-site/pages/builds`.

## Marke
- Name: **OneHumanity Robotics** (kurz **OneHumanity** für Logo, Gehäuse, Roboter). Kein „i. G.“ o. ä. auf der Seite.
- Leitsatz / Manifest: **One Planet, One Humanity**
- Logo: das Weltherz – steht für den Verbund der Menschheit
- Rechtlicher Rahmen: MorphicMoons (Einzelunternehmen, Aachen) – nur im Impressum/Footer
- Domain bleibt: oneplanetonehumanity.com
- Sprachen: Deutsch und Englisch (DE/EN-Umschalter)

## Positionierung
Robotik aus Aachen. Wir entwickeln Roboter und Maschinen, die Menschen begleiten – vom ersten Konzept bis zum funktionierenden Prototyp. Schritt für Schritt und offen dokumentiert.

- Bisher eine Einzelperson (Marcello): Konzeption und erste Prototypen.
- Gerade im Bau: der erste große Roboter (Yusu). Weitere Ideen werden festgehalten.
- Kernbotschaft der Arbeitsweise: **Ein Schritt nach dem anderen.** Ein Schritt gilt erst als fertig, wenn er funktioniert und dokumentiert ist. Formulierungen wie „zu Ende bringen“ / „bis zum Ende“ vermeiden – wirkt aufgesetzt (Marcellos Feedback); die Arbeitsweise lieber zeigen als behaupten.

### Arbeitsweise (Abschnitt "Arbeitsweise")
1. Konzept – Zweck, Charakter, Sicherheitsregeln stehen fest, bevor gebaut wird.
2. Prototyp – konstruieren, drucken, löten, programmieren, testen in der eigenen Werkstatt.
3. Abschließen – fertig = läuft + dokumentiert; erst dann der nächste Schritt (Beleg: LifeBar).

### Wofür wir stehen
- Offen – Dateien, Firmware, Anleitungen veröffentlichen, wo immer es geht.
- Lokal – kein Account, keine Cloud; Wahrnehmung und Daten bleiben auf dem Gerät.
- Menschlich – für Menschen gebaut, nicht für Kennzahlen; Roboter sagen ehrlich, dass sie Roboter sind.

## Ton
- Positiv, offen, einladend. Sagen, was wir wollen – nicht, wogegen wir sind.
- Professionell, aber persönlich. Kein Hobby-Entschuldigungston, aber auch nichts übertreiben: Status ehrlich angeben (Designstudie ist Designstudie).

## Wer dahinter steckt (kurz halten)
Marcello – Gründer, Software-Entwickler, gelernter Handwerker (Lackierer), baut in Aachen. Arbeitet gründlich, Schritt für Schritt.

## Projekte
Pflege nur in `assets/projects.data.js`. Gruppen: `robotics` (Roadmap Startseite + tools.html), `workshop` („Aus der Werkstatt“), `archive` (tools.html#archiv).

- **Yusu – OneHumanity R1** (robotics, Flaggschiff) – modularer Roboter in Menschengröße, Begleiter statt Diener. Emotions-Engine, LED-Augen, LED-Mund, Sprache, alles lokal; eigener ESP32 pro Modul, Ziel Jetson. Stand: Phase 0 Kopf (v8 mit Visier gedruckt, Elektronik kommt rein). Code-Repo `DesignStraub/emotion-lab` ist privat → Button „Dateien & Code“ noch `#TODO-yusu-repo`. (Persönlichkeit heißt im Code „Roxy“ – auf der Seite nicht verwenden, außer Marcello will es.)
- **Ringwheel – Hybrid-Drohne** (robotics) – Propellerringe klappen um und werden Räder. Designstudie (nicht gebaut). Repo github.com/DesignStraub/ringwheel-hybrid-drone, Video youtube.com/shorts/o1WtWeNPCIw.
- **LifeBar** (robotics) – fertig gebaut, täglich im Einsatz, Repo öffentlich. Seite lifebar.html.
- **Laptop-Badge (Weltherz)**, **Sticker & Lesezeichen** (workshop).
- **Mode System**, **Proof** (archive).

**Wichtig:** Auf den gedruckten Mode-System-Karten ist ein QR-Code zu `https://oneplanetonehumanity.com/Mode-system-guide.html`. Diese Datei nie umbenennen, verschieben oder löschen (GitHub Pages unterscheidet Groß-/Kleinschreibung). Generell: bestehende URLs bleiben erreichbar.

## Seitenstruktur Startseite
1. Hero: Weltherz-Logo, „OneHumanity Robotics“, Leitsatz, Mission, Buttons „Projekte ansehen“ / „Auf YouTube folgen“, Render des Roboterkopfs
2. Arbeitsweise (3 Stufen) + Wofür wir stehen
3. Projekte als Roadmap (robotics)
4. Die Werkstatt (Fotos) + Kleine Dinge aus der Werkstatt (workshop)
5. Wer dahinter steckt
6. Mitmachen (YouTube, GitHub/MakerWorld, freie Sticker, Shop)
7. Footer: Projekte, YouTube, GitHub, MakerWorld, Etsy, Impressum, Datenschutz, © MorphicMoons

## Links
- YouTube: https://www.youtube.com/@marcelloswigswag
- GitHub: https://github.com/DesignStraub
- MakerWorld: https://makerworld.com/@MarcelloStr
- Etsy: https://oneplanetonehumanity.etsy.com

## Technik / Regeln
- Statische Seite, kein Build-Schritt. Gemeinsame Dateien in `assets/`:
  - `site.css` – Design-System (Tokens oben, Hell-/Dunkelmodus über Tokens)
  - `site.js` – Navigation, Sprache, Theme-Umschalter, Reveal
  - `projects.data.js` – **einzige Stelle, um Projekte zu pflegen**
  - `projects.render.js` – baut die Karten
- Bestehende Seiten (impressum.html, datenschutz.html, tools.html, lifebar.html, Mode-system-guide.html, proof.html) erhalten und im selben Design halten.
- Schnell, leicht, responsive, Hell-/Dunkelmodus. Keine Tracker, keine externen Analytics, keine Embeds (auch kein YouTube-Embed – nur Links).
- Bilder liegen im Repo (img/). Fotos vor dem Einbinden verkleinern und Metadaten (EXIF/GPS) entfernen.
- Nach CSS-/JS-Änderungen den Versionsparameter `?v=…` in allen HTML-Dateien hochzählen, sonst zeigen Browser (v. a. Safari) alte Dateien aus dem Cache.
- Fehlende Links sind als `#TODO-…` markiert: `grep -rn "#TODO" .` zeigt alle.
- Vor größeren Umbauten kurz Plan zeigen, dann umsetzen.
