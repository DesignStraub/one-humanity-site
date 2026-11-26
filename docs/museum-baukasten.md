# Museum-Baukasten – Konzept

Stand: 26.11.2026 · Grundlage: das Sternemuseum auf oneplanetonehumanity.com (`index.html` + `assets/gallery.js`)

## 1. Idee und Erlebnis

Jeder Mensch soll sich ein eigenes begehbares Sternemuseum bauen können – für Projekte, Kunst, ein Studio, einen Verein –, indem er nur Daten einfüllt: Räume, Farben, Exponate, Bilder, Texte, Links. Der Code bleibt derselbe; die Datei macht das Museum.

Was Besucher erleben, so wie heute bei OneHumanity Labs:

- **Start:** eine lesbare HTML-Karte über dem All mit Weltkugel, Logo, Leitsatz, Knopf „Eintreten“ und Direktlinks in die Räume.
- **Ankunft:** Zoom auf die Erde, Lichtblitz, Ring und Lichtsäule, im Dunkeln die eigenen holografischen Roboterhände, dann gehen die Lichter an und das Hauptexponat begrüßt einen (Untertitel + Stimme aus Web Audio).
- **Räume** um ein Foyer, jeder mit eigener Leuchtfarbe und einem großen Bodenzeichen, Glasböden mit Sternen darunter, kein Dach, ein Planet am Himmel.
- **Hauptexponat als Hologramm** auf einem Projektor, das sich zum Besucher dreht; drumherum Wände mit Entstehung, aktuellem Stand (auch Videos) und Etappen.
- **Apps-Raum** mit Bildschirmen für alles, was direkt im Browser läuft.
- **Webansicht ohne 3D** (`uebersicht.html`) aus denselben Daten – für Suchmaschinen, Screenreader und schwache Geräte.
- **DE/EN**, Ton an/aus, **Handy** mit Joystick und Sprungknopf, Desktop mit Maus, WASD und Klick-zum-Hingehen.
- Ohne Tracker, ohne Konto, ohne Cloud – statische Dateien, die überall laufen, z. B. auf GitHub Pages.

## 2. Was heute schon datengetrieben ist – und was fest im Code steckt

### Schon aus Daten

| Was | Wo |
|---|---|
| Projekte mit Bildern, Galerie, `now` (Fotos/Videos), `timeline`, `demo`, `build`, `buy`, `follow`, `app`, Texte DE/EN | `assets/projects.data.js` (`window.OH_PROJECTS`) |
| Zuordnung Projekt → Raum über `group` (`robotics`, `games`, `tools`, `design`, `archive`) | `projectsIn(group)` in `gallery.js` |
| Apps-Raum: alle Projekte mit echtem `demo.href` (`isApp()`), Bild aus `app.image` | `buildApps()` |
| Automaten im Games-Raum, Tische in der Werkstatt, Lochwand mit 3D-Design | `buildGames()`, `buildWorkshop()` |
| Kunstraum inkl. „Tür bleibt zu, solange leer“ | `assets/artworks.data.js`, `ART_OPEN`, `buildArt()` |
| Info-Tafeln, Statusnamen, Kartenlayout | `openProject()`, `projects.render.js` (`window.OH_RENDER`) |

### Noch fest im Code (müsste heraus)

- **Grundriss:** `ROOMS` (Position, Größe, Höhe, Farben, Türen), `ROOM_ORDER`, `PASSAGES` (Durchgänge, auch `apps` hinter `games`), `ENTRY` (erster Blick je Raum), `GAP`, `MAP_BOUNDS` für den Lageplan. Alles von Hand in Metern gerechnet.
- **Raumtypen sind Funktionen pro Raum-ID:** `buildRobotics()`, `buildGames()`, `buildApps()`, `buildWorkshop()`, `buildArt()`, `buildFoyer()` greifen direkt auf `ROOMS.robotics`, `ROOMS.werkstatt` usw. zu. Ein Raum „Musik“ oder zwei Galerien sind so nicht möglich.
- **Hauptexponat = Yusu:** `projectById('yusu')`, `HEAD_SPOT`, `loadYusuHead()` mit `assets/models/yusu-head.bin` und `HEAD_SCALE`, Ersatz `buildYusuFace()`, Augen `createEyes()` mit `EYES_FACE`/`EYES_VISOR`, Text „ONEHUMANITY R1“, Filter `/yusu-app\./`.
- **Texte:** `TEXT.de`/`TEXT.en` (rund 60 Schlüssel – Willkommen, Werte, „Hi, ich bin Marcello“, Werkstatt-Text, Begrüßung `greet1`/`greet2`, Link-Beschriftungen) sowie `window.OH_I18N` in `index.html`.
- **Links:** `LINKS` (YouTube, Instagram, GitHub, MakerWorld, itch.io, Sticker-Formular, Etsy) und `OH_ARTWORKS_PROFILE`.
- **Bodenzeichen:** `EMBLEMS` – je Raum eine Canvas-Zeichenfunktion (Gesicht, Gamepad, Browserfenster, Zahnrad, Herz).
- **Logo:** Herz-Pfad `HEART` in `gallery.js` und doppelt als SVG in `index.html`; das 3D-Weltherz aus `assets/models/world-heart.js` (erzeugt mit `tools-dev/svg_to_shape.py`).
- **Startseite:** `index.html` hat Titel, Meta-Tags, OG-Bild, Raum-Knöpfe (`data-room`, `data-choice`, Farben als `--c`) und Footer (MorphicMoons) fest eingetragen.
- **Ankunft und Ton:** Ablauf in `stepArrival()`, `finishArrival()`, `greet()`; Start immer im Robotics-Raum (`data-choice="robotics"`). Klang in der Sound-Sektion (`AudioContext`, `sound.chatter`). Das ist gutes Allgemeingut – nur Zielraum, Begrüßungstext und Stimme sollten Einstellungen werden.
- **Himmel:** `buildPlanet()`, `buildStars()`, `nebulaTexture()` – passt zu jedem Museum, Farben könnten optional werden.
- **Statistik:** GoatCounter-Zeile in `index.html` gehört nur zu OneHumanity.

Fazit: Inhalte sind schon gut getrennt; **Struktur, Raumtypen, Texte und das Hauptexponat** stecken noch im Code.

## 3. Eingabeformat: `museum.data.js`

Eine Datei, als JS (`window.MUSEUM = {…}`), damit sie ohne Server und ohne Build lädt – wie heute `projects.data.js`. Ein JSON-Export/Import ist für Web-App und Agent trotzdem möglich, weil der Inhalt reines JSON ist.

```js
window.MUSEUM = {
  version: 1,
  owner: {
    name: 'OneHumanity Labs',                 // Pflicht
    short: 'OneHumanity',
    claim: { de: 'One Planet, One Humanity', en: 'One Planet, One Humanity' },
    lead: { de: 'Ein unabhängiges Lab aus Aachen …', en: 'An independent lab from Aachen …' }, // Pflicht
    logo: 'img/logo.svg',                     // ein Pfad, wird auch zum 3D-Emblem im Foyer
    legal: { name: 'MorphicMoons', imprint: 'impressum.html', privacy: 'datenschutz.html' }, // Pflicht, wenn öffentlich
    url: 'https://oneplanetonehumanity.com'
  },
  languages: ['de', 'en'],                    // erste = Standard
  theme: { sky: 'night', foyerColor: '#f3d7a2' },
  arrival: {
    room: 'robotics',                         // wo man nach „Eintreten“ landet
    greeting: { de: ['Hallo! Schön, dass du da bist.'], en: ['Hi! Nice to have you here.'] },
    voice: 'beeps'                            // 'beeps' | 'none'
  },
  foyer: {
    values: [ { de: { title: 'Offen', text: '…' }, en: { title: 'Open', text: '…' } } ],
    about:  { image: 'img/me.jpg', de: { title: 'Hi, ich bin Marcello.', text: '…' }, en: { … } },
    join:   { de: { title: 'Zuschauen, spielen, nachbauen.', text: '…' }, en: { … } }
  },
  links: [                                    // erscheinen im Foyer („Mitmachen“) und in passenden Räumen
    { id: 'youtube', href: 'https://www.youtube.com/@…', de: { label: '…', hint: '…' }, en: { … } }
  ],
  rooms: [
    { id: 'robotics', type: 'hall',    color: '#8fd8ff', emblem: 'face',    de: { name: 'Robotics' }, en: { name: 'Robotics' },
      hero: 'yusu' },                         // Projekt-ID des Hauptexponats
    { id: 'games',    type: 'arcade',  color: '#ff6fb0', emblem: 'gamepad', de: { name: 'Games' },    en: { name: 'Games' },
      groups: ['games'], sign: 'itch' },      // sign = Link-ID für das Schild
    { id: 'apps',     type: 'screens', color: '#6dffc4', emblem: 'browser', de: { name: 'Apps' },     en: { name: 'Apps' },
      after: 'games', source: 'demos' },      // zeigt alle Projekte mit demo-Link
    { id: 'werkstatt',type: 'bench',   color: '#ffbb73', emblem: 'gear',    de: { name: 'Werkstatt' },en: { name: 'Workshop' },
      groups: ['tools', 'design'] },
    { id: 'kunst',    type: 'gallery', color: '#bca2ff', emblem: 'heart',   de: { name: 'Kunst' },    en: { name: 'Art' },
      source: 'artworks', emptyLink: 'instagram' }
  ],
  projects: [ /* wie heute OH_PROJECTS: id, group, status, image, gallery, now, timeline, demo, build, buy, app, de/en */ ],
  artworks: [ /* wie heute OH_ARTWORKS */ ],
  hero: {                                     // optional: 3D-Modell fürs Hauptexponat
    model: 'assets/models/hero.glb',          // sonst: Bild als Hologramm-Tafel
    scale: 1.0, face: 'eyes'                  // 'eyes' (animiertes Gesicht) | 'none'
  }
};
```

**Raumtypen** (je ein Baustein statt einer Funktion pro Raum-ID):

| `type` | heute | zeigt |
|---|---|---|
| `hall` | `buildRobotics()` | ein Hauptexponat als Hologramm, Wände Entstehung / aktueller Stand / Etappen |
| `arcade` | `buildGames()` | ein Automat pro Projekt |
| `screens` | `buildApps()` | Bildschirme mit „Jetzt öffnen“ |
| `bench` | `buildWorkshop()` | Tische für Projekte, Lochwand für kleine Stücke |
| `gallery` | `buildArt()` | gerahmte Bilder |

**Bodenzeichen:** Auswahl aus fertigen Zeichen (`face`, `gamepad`, `browser`, `gear`, `heart`, später mehr) oder ein eigenes einfarbiges SVG.

**Pflicht:** `owner.name`, `owner.lead`, mindestens eine Sprache, mindestens ein Raum mit `id`, `type`, `color`, Name; je Projekt `id`, `group`, `status`, Titel; je Bild `src`, `w`, `h`, `alt`; `owner.legal`, sobald die Seite öffentlich ist (Impressumspflicht).
**Optional:** alles andere. Fehlt etwas, bleibt der Platz leer oder bekommt einen ruhigen Standard (z. B. Herz als Logo-Ersatz, keine Begrüßung, Raum ohne Hauptexponat).

Der **Grundriss wird berechnet**, nicht eingetragen: Foyer in der Mitte, die ersten vier Räume an N/O/S/W, weitere über `after` dahinter. Daraus entstehen `ROOMS`, `PASSAGES`, `ENTRY` und der Lageplan automatisch.

## 4. Der Weg dorthin

| Schritt | Was rauskommt | Aufwand (grob) | Risiken |
|---|---|---|---|
| **1. Konfiguration herausziehen** – im OneHumanity-Repo | `assets/museum.data.js` mit Texten, Links, Räumen; `gallery.js` liest sie. Grundriss-Berechnung; `build*()` werden zu Raumtypen; Yusu-Sonderfälle hinter `hero`. Die Seite sieht danach genau so aus wie vorher. | 3–5 Tage | Regressionen im laufenden Museum → auf eigenem Branch, Seite für Seite vergleichen (`?debug`, `OH_GALLERY.advance()`). Alte URLs und `#raum`-Links müssen gleich bleiben. |
| **2. Vorlage-Repo** (`museum-template`) | GitHub-Template mit Engine, three.js im Repo, Beispiel-Museum, `uebersicht.html`, Impressum/Datenschutz-Vorlagen, README „Datei ausfüllen → Pages einschalten“. | 2–3 Tage | Lizenz klären (Engine offen, OneHumanity-Inhalte nicht). Keine Tracker in der Vorlage; GoatCounter nur als auskommentierte Option. |
| **3. Prüfer + Generator** | Kleines Skript (`tools/check.py` oder Node), das `museum.data.js` prüft (Pflichtfelder, Bildgrößen, fehlende Dateien, `#TODO`-Links), Bilder verkleinert, EXIF/GPS entfernt, `sitemap.xml`, Meta-Tags und Raum-Knöpfe in `index.html` schreibt. | 2–3 Tage | Bilder ohne Rechte, Fotos mit Personen oder Ortsdaten. Der Prüfer warnt, entscheidet aber nicht. |
| **4. Claude-Skill / Agent** | Ein Skill, der im Gespräch fragt, die Datei füllt, Bilder vorbereitet, den Prüfer laufen lässt und eine Vorschau zeigt (siehe Abschnitt 5). | 2–4 Tage + Testen mit 2–3 echten Menschen | Agent erfindet Texte oder Links → nur übernehmen, was die Person sagt; Vorschläge als Vorschlag kennzeichnen. Veröffentlichen nur nach ausdrücklichem Ja. |
| **5. Web-App** | `baukasten/` auf oneplanetonehumanity.com: Formular links, Live-Vorschau des Museums rechts, Bilder werden im Browser verkleinert (Canvas → ohne EXIF), Ergebnis als ZIP oder `museum.data.js` zum Herunterladen. Als Bildschirm im Apps-Raum (über `demo` in `projects.data.js`). | 1–2 Wochen | Kein Server, also kein Speichern in der Cloud – Entwurf lokal im Browser (localStorage) plus Export. Direktes Veröffentlichen auf GitHub würde Login/OAuth brauchen → erst später oder gar nicht. |

Schritt 1 lohnt sich auch ohne die weiteren Schritte: Neue Räume und Texte für OneHumanity selbst werden danach einfacher.

## 5. Der Claude-Skill im Detail

**Form:** ein Skill (`museum-baukasten/SKILL.md` + Skripte), nutzbar in Claude Code und als Claude-App mit Dateizugriff. Arbeitet in einer Kopie des Vorlage-Repos.

**Gesprächsablauf (eine Frage nach der anderen, mit Beispielen):**

1. Wie heißt dein Museum, wer steckt dahinter, was ist dein Satz in einem Atemzug? Deutsch, Englisch oder beides?
2. Hast du ein Logo als SVG? (Sonst: Herz oder Anfangsbuchstabe.)
3. Welche Bereiche hast du? → schlägt Räume, Raumtypen, Farben und Bodenzeichen vor; die Person wählt.
4. Was ist dein Hauptstück? Gibt es ein 3D-Modell (STL/GLB) oder ein gutes Bild?
5. Je Projekt: Titel, ein Satz, Status, Bilder, Links (Code, Shop, Video, „im Browser ausprobieren“), optional Etappen.
6. Wofür stehst du (bis zu drei Werte)? Ein paar Sätze über dich?
7. Welche Profile sollen ins Foyer (YouTube, Instagram, GitHub …)?
8. Wer steht im Impressum? (Hinweis: Pflicht in Deutschland für geschäftsmäßige Seiten; der Skill gibt keine Rechtsberatung.)
9. Wo soll es hin: nur lokal ansehen, als ZIP, oder auf GitHub Pages?

**Dateien, die er schreibt:** `museum.data.js`, Bilder unter `img/` (und `img/art/`), `index.html`-Kopf (Titel, Beschreibung, OG-Bild, Raum-Knöpfe), `impressum.html`/`datenschutz.html` aus Vorlage mit den Angaben der Person, optional `assets/models/hero.bin` aus STL (wie `tools-dev/stl_to_mesh.py`) und das Logo-Emblem (wie `tools-dev/svg_to_shape.py`).

**Bilder:** lokal mit `sips` (macOS) oder Pillow: längste Kante 1600 px, JPEG ~82 %, EXIF/GPS entfernen, Breite/Höhe ins Datenfeld übernehmen. Videos mit ffmpeg: H.264, 540 px breit, ohne Ton und Metadaten, Poster-JPG dazu. Der Skill fragt bei jedem Bild nach Alt-Text und ob die Person die Rechte hat; Fotos mit erkennbaren Menschen spricht er an.

**Vorschau:** startet einen lokalen Server (`python3 -m http.server`), öffnet das Museum und die Webansicht, prüft mit dem Prüfer-Skript.

**Veröffentlichen:** nur nach ausdrücklichem Ja: neues Repo aus dem Template (`gh repo create --template`), Push, GitHub Pages einschalten, optional eigene Domain (`CNAME`). Keine Analytics, außer die Person wünscht sie ausdrücklich.

## 6. Offene Fragen an Marcello

1. **Für wen zuerst?** Für dich selbst (sauberere Struktur), für Freunde/Maker, oder gleich öffentlich für alle?
2. **Wie viel OneHumanity steckt drin?** Darf die Ankunft mit Erde, Roboterhänden und Weltherz bleiben, oder soll jedes Museum ein eigenes Startbild bekommen? Ein kleiner Hinweis „gebaut mit dem OneHumanity-Baukasten“ im Footer?
3. **Lizenz:** Engine Open Source (z. B. MIT), Inhalte (Yusu, Texte, Bilder, Weltherz) ausgenommen – passt das?
4. **Hauptexponat ohne Gesicht:** Was zeigen Museen ohne Roboter – ein drehendes 3D-Modell, ein Bild als Hologramm, oder das Logo?
5. **Raumtypen:** Reichen die fünf (Halle, Automaten, Bildschirme, Werkbank, Galerie), oder fehlt etwas – z. B. Musik/Hörstation, Video-Kino, Bücherregal?
6. **3D-Formate:** Nur STL (wie bei Yusu) oder auch GLB/glTF mit Farben? Gibt es eine Größengrenze?
7. **Web-App veröffentlichen:** Reicht „ZIP herunterladen + Anleitung“, oder soll sie direkt auf GitHub veröffentlichen können (braucht Login)?
8. **Bezahlt oder frei?** Bleibt alles kostenlos, gibt es optional Hilfe gegen Geld (Einrichtung, eigene Räume), oder später eine gehostete Variante?
9. **Zeitpunkt für Schritt 1:** Soll die Konfiguration herausgezogen werden, bevor oder nachdem die laufenden Arbeiten an `gallery.js` fertig sind?
