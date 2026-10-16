# CLAUDE.md – Website-Relaunch oneplanetonehumanity.com

## Ziel
Die Website neu aufstellen: professioneller erster Eindruck, klare Haltung, Projekte als Roadmap. Die alte Seite positionierte das Projekt als kleine Papier-/Sticker-Werkstatt ("No philosophy attached"). Das stimmt nicht mehr – die Seite soll die Vision zeigen.

Arbeite auf einem eigenen Branch (`redesign`). Live-Seite (`main`) nicht anfassen, bis Marcello freigibt.

## Marke
- Markenname: **OneHumanity** (kurz, für Logo, Gehäuse, Roboter)
- Leitsatz / Manifest: **One Planet, One Humanity**
- Logo: das Weltherz – steht für den Verbund der Menschheit
- Rechtlicher Rahmen: MorphicMoons (Einzelunternehmen, Aachen) – nur im Impressum/Footer
- Domain bleibt: oneplanetonehumanity.com
- Sprachen: Deutsch und Englisch (bestehender DE/EN-Umschalter bleibt)

## Positionierung
Offenes Hardware-Studio aus Aachen, das langfristig auf Robotik zuläuft. Kernbotschaft (sinngemäß):
> Wir bauen Technik, die dir dient, statt dich zu verbrauchen. Alles ist offen. Bau es selbst – kostenlos. Oder kauf es fertig gebaut.

### Prinzipien (Abschnitt "Wofür wir stehen")
1. Open Source – Dateien, Firmware und Anleitungen frei zum Nachbauen.
2. Kein Account, keine Cloud, kein Feed – Daten bleiben beim Menschen.
3. Für Menschen gebaut, nicht für Kennzahlen – in Harmonie mit Technik leben, statt sich von ihr auffressen zu lassen.

## Ton
- Positiv, offen, einladend. Sagen, was wir wollen – nicht, wogegen wir sind.
- Keine Kampfbegriffe, kein Anti-Kapitalismus-Slogan; Haltung über Taten zeigen (offen, reparierbar, kein Abo, kein Datensammeln).
- Persönlich, aber professionell. Kein Hobby-Entschuldigungston.

## Wer dahinter steckt (kurz halten)
Marcello – Software-Entwickler, gelernter Handwerker (Lackierer), baut in Aachen. Ein bis zwei Sätze reichen.

## Projekte (Roadmap mit Status)
- **LifeBar** – Gamification fürs echte Leben auf eigener Hardware (ESP32-S3, Bar-Display, Minuten → EXP/Level/Titel, alles lokal). Status: täglich im Einsatz, Repo öffentlich (github.com/DesignStraub/lifebar), eigenes Gehäuse (Fusion 360). Seite: lifebar.html.
- **Yusu – OneHumanity R1** – modularer Roboter, Begleiter statt Diener. Emotionale Mimik (Display-Augen, LED-Mund), alles läuft lokal, modular austauschbar. Status: in Entwicklung (Kopf zuerst). Platz für Updates/Instagram. (Der frühere "Room Bot" geht darin auf.)
- **Laptop-Badge (Weltherz)** – 3D-gedrucktes Logo-Cover. Status: neu. Links: Datei (MakerWorld) + Kauf (Etsy).
- **Sticker & Lesezeichen** – freie Sticker-Sets, Druck-PDF, Etsy-Shop. Der "Mitmachen"-Bereich (Formular, PDF, Etsy) bleibt erhalten.

Jedes Projekt bekommt: Status-Label, kurze Beschreibung, Button "Selbst bauen" und – falls vorhanden – "Fertig kaufen".

Mode System und Proof stehen nicht mehr auf der Startseite; ihre Seiten (Mode-system-guide.html, proof.html) bleiben online und erscheinen auf tools.html unter "Weitere Projekte".

## Seitenstruktur Startseite
1. Hero: Weltherz-Logo, Leitsatz, ein Satz Mission, Buttons "Projekte ansehen" / "Selbst bauen"
2. Wofür wir stehen (3 Prinzipien)
3. Projekte als Roadmap
4. Wer dahinter steckt
5. Mitmachen (freie Sticker, Dateien, Updates zum Roboter)
6. Footer: Impressum, Datenschutz, Etsy, GitHub, MakerWorld, © MorphicMoons

## Technik / Regeln
- Statische Seite, kein Build-Schritt. Gemeinsame Dateien in `assets/`:
  - `site.css` – Design-System (Tokens oben, Hell-/Dunkelmodus über Tokens)
  - `site.js` – Navigation, Sprache, Theme-Umschalter, Reveal
  - `projects.data.js` – **einzige Stelle, um Projekte zu pflegen** (Startseite + tools.html)
  - `projects.render.js` – baut die Karten
- Bestehende Seiten (impressum.html, datenschutz.html, tools.html, lifebar.html) erhalten und im selben Design halten.
- Schnell, leicht, responsive, Hell-/Dunkelmodus. Keine Tracker, keine externen Analytics (passt zu "keine Cloud").
- Bilder/Logo liegen im Repo (img/). Nichts von fremden Servern einbinden, was Daten über Besucher sammelt (keine Webfonts, keine Embeds).
- Fehlende Links sind als `#TODO-…` markiert: `grep -rn "#TODO" .` zeigt alle.
- Vor größeren Umbauten kurz Plan zeigen, dann umsetzen.
