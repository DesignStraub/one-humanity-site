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

- **Yusu-Begleit-App:** `yusu/` (eigene dunkle Seite ohne Site-CSS, Prototyp, `noindex`): Augen, Persönlichkeits-Editor, Gespräch nur mit lokalem Ollama über `python3 yusu/lokal.py`. Verlinkt im Hero und auf der Yusu-Karte (Feld `demo`).
- **Robotics:** Yusu – OneHumanity R1 (Flaggschiff, Phase 0 Kopf; Code-Repo `emotion-lab` privat → `#TODO-yusu-repo`; Persönlichkeit heißt im Code „Roxy“ – auf der Seite nicht verwenden, außer Marcello will es), Ringwheel – Hybrid-Drohne (Designstudie, Repo + YouTube-Short).
- **Games (Godot):** Kometen & Kronen (Repo `aliens-in-earth`), Underground Sprint (Repo `underground-sprint`). itch.io-Seiten noch `#TODO-itch-…`.
- **Tools:** LifeBar (fertig, täglich im Einsatz), GlideSplit (Konzept, Repo + YouTube-Short).
- **3D-Design:** Laptop-Badge (Weltherz), LifeBar-Standfuß, Low-Profile-Tastenkappen, Skadis-Schreibtischwand, Gelber-Sack-Halterung (alle MakerWorld), Sticker & Lesezeichen.
- **Archiv:** Mode System, Proof.
- **Nicht auf die Seite:** NSFW-/Erotik-Modelle (z. B. auf MakerWorld/Cults3D) und das interne Bild-zu-3D-Projekt.

**Wichtig:** Auf den gedruckten Mode-System-Karten ist ein QR-Code zu `https://oneplanetonehumanity.com/Mode-system-guide.html`. Diese Datei nie umbenennen, verschieben oder löschen (GitHub Pages unterscheidet Groß-/Kleinschreibung). Generell: bestehende URLs bleiben erreichbar.

## Seitenstruktur Startseite
1. Hero: Weltherz-Logo, „OneHumanity Labs“, Leitsatz, Mission, Buttons „Projekte ansehen“ / „Yusu im Browser ansehen“ (→ `yusu/`) / „One Humanity Lab auf YouTube“, vier Bereichs-Kacheln
2. Wofür wir stehen (Offen, Lokal, Menschlich)
3. Bereiche: Robotics, Games, Tools, 3D-Design (je eigener Abschnitt)
4. Die Werkstatt (Fotos)
5. Wer dahinter steckt
6. Mitmachen (YouTube, GitHub, MakerWorld, itch.io, freie Sticker, Shop)
7. Footer: Bereiche, YouTube, Instagram, GitHub, MakerWorld, itch.io, Etsy, Impressum, Datenschutz, © MorphicMoons

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
  - `projects.render.js` – baut die Karten
- Bestehende Seiten (impressum.html, datenschutz.html, tools.html, lifebar.html, Mode-system-guide.html, proof.html) erhalten und im selben Design halten.
- Schnell, leicht, responsive, Hell-/Dunkelmodus. Keine Tracker, keine Embeds (auch kein YouTube-Embed – nur Links). Einzige Ausnahme: GoatCounter (`onehumanity.goatcounter.com`) auf allen Seiten, nur für Seitenaufrufzahlen, cookielos. Keine weiteren Analytics-Dienste ohne Freigabe.
- Bilder liegen im Repo (img/). Fotos vor dem Einbinden verkleinern und Metadaten (EXIF/GPS) entfernen.
- Nach CSS-/JS-Änderungen den Versionsparameter `?v=…` in allen HTML-Dateien hochzählen, sonst zeigen Browser (v. a. Safari) alte Dateien aus dem Cache.
- Fehlende Links sind als `#TODO-…` markiert: `grep -rn "#TODO" .` zeigt alle.
- Vor größeren Umbauten kurz Plan zeigen, dann umsetzen.
