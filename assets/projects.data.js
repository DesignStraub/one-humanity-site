/* ==========================================================================
   projects.data.js — the only file you edit to add or change a project.
   ==========================================================================

   The home page roadmap and tools.html are both built from this list.
   Add a project = add one object below. Order here = order on the page.

   FIELDS
     id        short slug. Also the anchor: index.html#project-<id>
     status    'live' | 'wip' | 'concept' | 'playable' | 'new' | 'free' | 'testing' | 'design' | 'sketch' | 'open'
               Labels and colours live in projects.render.js.
     featured  true  → large roadmap card in its area
               false → small card
     group     'robotics' | 'games' | 'tools' | 'design' | 'archive'
               robotics/games/tools → large cards per area (home + tools.html)
               design   → small cards ("3D-Design")
               archive  → "Archiv & Projekthistorie" (tools.html#archiv)
     link      optional. Page with more detail ("Learn more").
     image     optional. { src, w, h, alt: { de, en } }
     build     optional. "Build it yourself" — files, repo, print PDF.
               { href, label?: { de, en } }
     buy       optional. "Buy it ready-made".
               { href, label?: { de, en } }
     gallery   optional. More pictures under the card (tools.html and home).
               [{ src, w, h, alt: { de, en }, caption?: { de, en } }]
     demo      optional. "Try it" — something that runs in the browser.
               { href, label: { de, en } }
     follow    optional. Extra link, e.g. updates on Instagram.
               { href, label: { de, en } }
     actions   optional, legacy. Free-form buttons for tools.html cards.
     de / en   title, tagline (one line), text, facts (short chips),
               timeline [{ state: 'done' | 'now' | 'next', text }]

   LINKS NOT KNOWN YET
     Use an href starting with "#TODO-". The button renders greyed out
     with "soon", and `grep -rn "#TODO" .` lists everything still open.
*/

window.OH_PROJECTS = [

  /* ---------------------------------------------------------------- */
  {
    id: 'yusu',
    status: 'wip',
    group: 'robotics',
    featured: true,
    image: {
      src: 'img/yusu-head-render.jpg',
      w: 1600, h: 1200,
      alt: {
        de: 'Render des Roboterkopfs: weiße Low-Poly-Schale, dunkles Visier, dahinter leuchten blaue Augen und ein LED-Mund, auf einem schwarzen Ständer',
        en: 'Render of the robot head: white low-poly shell, dark visor with glowing blue eyes and an LED mouth behind it, on a black stand'
      }
    },
    /* Current state: shown above the older pictures, only on tools.html.
       Videos are short clips without sound; the still is the poster frame. */
    now: {
      title: { de: 'Aktueller Stand · November 2026', en: 'Current state · November 2026' },
      items: [
        {
          src: 'img/yusu-now-0820.jpg', w: 1050, h: 1400,
          caption: { de: 'Der Kopf mit Elektronik auf der Werkbank', en: 'The head with its electronics on the bench' },
          alt: {
            de: 'Weißer Low-Poly-Roboterkopf auf der Werkbank, im Gesicht ein Display mit zwei leuchtend blauen Augen, dahinter Lötstation und Werkzeugwand',
            en: 'White low-poly robot head on the workbench, a display with two glowing blue eyes in its face, soldering station and tool wall behind it'
          }
        },
        {
          video: 'img/yusu-video-face.mp4', poster: 'img/yusu-video-face.jpg', w: 540, h: 960,
          caption: { de: 'Augen und LED-Mund im ersten Test', en: 'Eyes and LED mouth in a first test' },
          alt: {
            de: 'Video: Der Roboterkopf auf seinem Ständer, die Augen wechseln den Ausdruck, der Mund leuchtet auf',
            en: 'Video: the robot head on its stand, the eyes change expression and the mouth lights up'
          }
        },
        {
          video: 'img/yusu-video-blush.mp4', poster: 'img/yusu-video-blush.jpg', w: 540, h: 960,
          caption: { de: 'Verlegen – mit roten Wangen', en: 'Bashful – with blushing cheeks' },
          alt: {
            de: 'Video: Der Roboterkopf im violetten Licht, die Augen werden zu Halbmonden mit roten Wangen',
            en: 'Video: the robot head in violet light, the eyes turn into crescents with blushing cheeks'
          }
        },
        {
          src: 'img/yusu-now-0819.jpg', w: 1050, h: 1400,
          caption: { de: 'Offen: Display, Platinen und Kabel im Kopf', en: 'Opened up: display, boards and wiring inside the head' },
          alt: {
            de: 'Aufgeklappte weiße Kopfschale auf der Silikonmatte, innen Platinen und rote und schwarze Kabel',
            en: 'Opened white head shell on the silicone mat, boards and red and black wires inside'
          }
        },
        {
          video: 'img/yusu-video-visor.mp4', poster: 'img/yusu-video-visor.jpg', w: 540, h: 960,
          caption: { de: 'Licht hinter dem Visier', en: 'Light behind the visor' },
          alt: {
            de: 'Video: Der Kopf mit geschlossenem Visier, dahinter leuchtet das Display hell durch',
            en: 'Video: the head with its visor closed, the display shining brightly through it'
          }
        }
      ]
    },
    gallery: [
      {
        src: 'img/yusu-head-print.jpg', w: 1050, h: 1400,
        caption: { de: 'Der erste gedruckte Kopf auf dem Ständer', en: 'The first printed head on its stand' },
        alt: {
          de: 'Gedruckter Low-Poly-Roboterkopf in Weiß auf einem runden Ständer in der Werkstatt',
          en: 'Printed white low-poly robot head on a round stand in the workshop'
        }
      },
      {
        src: 'img/yusu-head-parts.jpg', w: 1600, h: 1200,
        caption: { de: 'Gedruckte Teile: Schale, Visier, Elektronikträger, Hals', en: 'Printed parts: shell, visor, electronics carrier, neck' },
        alt: {
          de: 'Gedruckte Einzelteile des Kopfes auf einer Silikonmatte: Schädelschale, transparentes Visier, Gesichtsrahmen, Halterungen und Hals',
          en: 'Printed head parts on a silicone mat: skull shell, translucent visor, face frame, mounts and neck'
        }
      },
      {
        src: 'img/yusu-eyes-display.jpg', w: 1440, h: 480,
        caption: { de: 'Die Augen auf dem Display: zufrieden, verärgert, müde', en: 'The eyes on the display: content, annoyed, tired' },
        alt: {
          de: 'Drei Augenpaare in leuchtendem Blau auf schwarzem Grund, gerendert im Pixelraster des Displays',
          en: 'Three pairs of glowing blue eyes on black, rendered in the display’s pixel grid'
        }
      },
      {
        src: 'img/yusu-eyes-firmware.jpg', w: 960, h: 480,
        caption: { de: 'Direkt aus dem Display im Kopf: freudig und überrascht', en: 'Straight from the display in the head: joyful and surprised' },
        alt: {
          de: 'Zwei Augenpaare aus dem Bildspeicher des Displays: lachende Sichel-Augen und weit geöffnete runde Augen in Hellblau',
          en: 'Two pairs of eyes from the display’s frame buffer: laughing crescent eyes and wide round eyes in light blue'
        }
      },
      {
        src: 'img/yusu-app.jpg', w: 1400, h: 700,
        caption: { de: 'Die Begleit-App im Browser (Prototyp)', en: 'The companion app in the browser (prototype)' },
        alt: {
          de: 'Bildschirmfoto der Begleit-App: zwei leuchtende Augen und sechs Mund-Punkte auf Schwarz, unten ein Eingabefeld',
          en: 'Screenshot of the companion app: two glowing eyes and six mouth dots on black, a text field below'
        }
      },
      {
        src: 'img/yusu-body-concept.jpg', w: 1000, h: 1500,
        caption: { de: 'Konzept des ganzen Roboters – bisher nur ein Render', en: 'Concept of the whole robot – so far only a render' },
        alt: {
          de: 'Render eines schlanken weißen Low-Poly-Roboters mit schwarzen Gelenken, leuchtend blauen Augen und Turnschuhen',
          en: 'Render of a slim white low-poly robot with black joints, glowing blue eyes and sneakers'
        }
      }
    ],
    demo: {
      href: 'yusu/',
      label: { de: 'Im Browser ansehen', en: 'See it in the browser' }
    },
    // shown in the gallery's apps room
    app: {
      image: { src: 'img/yusu-app.jpg', w: 1400, h: 700 },
      de: { title: 'Yusu – Begleit-App' },
      en: { title: 'Yusu – companion app' }
    },
    build: {
      href: '#TODO-yusu-repo',
      label: { de: 'Dateien & Code', en: 'Files & code' }
    },
    follow: {
      href: 'https://www.youtube.com/@marcelloswigswag',
      label: { de: 'Updates auf YouTube', en: 'Updates on YouTube' }
    },
    de: {
      title: 'Yusu – OneHumanity R1',
      tagline: 'Ein modularer Roboter in Menschengröße. Begleiter statt Diener.',
      text: 'Unser erster großer Roboter. Yusu nimmt Gesichter, Licht und Sprache wahr, leitet daraus einen eigenen emotionalen Zustand ab und zeigt ihn über leuchtende Augen und einen LED-Mund. Alles läuft lokal auf dem Gerät, ganz ohne Funk. Name, Stimme und Augenfarbe wählt, wer ihn einrichtet. Gebaut wird in Modulen, zuerst der Kopf.',
      facts: ['Komplett offline, kein Funk', 'Gesichts- und Spracherkennung lokal', 'Gedächtnis nur mit Einwilligung', 'Eigener ESP32 pro Modul', 'Zielplattform Jetson'],
      timeline: [
        { state: 'done', text: 'Konzept, Charakter und Sicherheitsregeln festgelegt' },
        { state: 'done', text: 'Emotions-Engine, Augen und Sprache laufen am Rechner' },
        { state: 'done', text: 'Kopf konstruiert und gedruckt (Version 8 mit Visier)' },
        { state: 'done', text: 'Eigene Stimmung, Tag-Nacht-Rhythmus und Gedächtnis mit Einwilligung' },
        { state: 'done', text: 'Ersteinrichtung: Name, Stimme und Augenfarbe frei wählbar' },
        { state: 'done', text: 'Hals-Servo: Der Kopf dreht sich zur Person' },
        { state: 'done', text: 'Begleit-App im Browser als Prototyp' },
        { state: 'now',  text: 'Elektronik in den Kopf – Kameras, Display, Mikrofone – und Umzug auf den Jetson' },
        { state: 'next', text: 'Danach: Rumpf und erste Bewegung' }
      ]
    },
    en: {
      title: 'Yusu – OneHumanity R1',
      tagline: 'A modular, human-sized robot. A companion, not a servant.',
      text: 'Our first large robot. Yusu perceives faces, light and speech, derives its own emotional state from them and shows it through glowing eyes and an LED mouth. Everything runs locally on the device, with no radio at all. Whoever sets it up chooses its name, voice and eye colour. It is built in modules, head first.',
      facts: ['Fully offline, no radio', 'Local face and speech recognition', 'Memory only with consent', 'Own ESP32 per module', 'Target platform: Jetson'],
      timeline: [
        { state: 'done', text: 'Concept, character and safety rules defined' },
        { state: 'done', text: 'Emotion engine, eyes and speech running on the computer' },
        { state: 'done', text: 'Head designed and printed (version 8 with visor)' },
        { state: 'done', text: 'Own mood, day-night rhythm and memory with consent' },
        { state: 'done', text: 'First setup: name, voice and eye colour are yours to choose' },
        { state: 'done', text: 'Neck servo: the head turns towards the person' },
        { state: 'done', text: 'Companion app in the browser as a prototype' },
        { state: 'now',  text: 'Electronics into the head – cameras, display, microphones – and the move to the Jetson' },
        { state: 'next', text: 'Then: torso and first movement' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'ringwheel',
    status: 'concept',
    featured: true,
    group: 'robotics',
    image: {
      src: 'img/ringwheel-flight.jpg',
      w: 1600, h: 1000,
      alt: {
        de: 'CAD-Render der Ringwheel-Drohne im Flugmodus: vier Propeller in Ringen über einem schmalen Rumpf',
        en: 'CAD render of the Ringwheel drone in flight mode: four propellers in rings above a narrow body'
      }
    },
    gallery: [
      {
        src: 'img/ringwheel-drive.jpg', w: 1600, h: 1000,
        caption: { de: 'Fahrmodus: Die Ringe klappen um 90° und werden zu Rädern', en: 'Drive mode: the rings fold 90° and become wheels' },
        alt: {
          de: 'CAD-Render im Fahrmodus: die vier Propellerringe stehen senkrecht und dienen als Räder mit Profil',
          en: 'CAD render in drive mode: the four propeller rings stand upright and act as treaded wheels'
        }
      }
    ],
    build: {
      href: 'https://github.com/DesignStraub/ringwheel-hybrid-drone',
      label: { de: 'CAD & Platinen auf GitHub', en: 'CAD & PCBs on GitHub' }
    },
    follow: {
      href: 'https://www.youtube.com/shorts/o1WtWeNPCIw',
      label: { de: 'Video ansehen', en: 'Watch the video' }
    },
    de: {
      title: 'Ringwheel – Hybrid-Drohne',
      tagline: 'Eine Drohne, deren Propellerringe zu Rädern werden.',
      text: 'Ein 5-Zoll-Quadcopter, der landet, seine vier Ringe um 90° umklappt und auf ihnen weiterfährt. Dieselben vier Motoren fliegen und fahren – über ein Planetengetriebe in der Nabe und eine eigene Steuerplatine. Fahren braucht einen Bruchteil der Energie des Schwebens und ist leise.',
      facts: ['Fliegen + Fahren', 'Eigene Platine (ESP32-S3)', 'Planetengetriebe 1:4', '≈ 950 g'],
      timeline: [
        { state: 'done', text: 'Konstruktion in Fusion 360: Klappmechanik, Getriebe, Rumpf' },
        { state: 'done', text: 'Eigene Platinen in KiCad, Kostenliste' },
        { state: 'done', text: 'Veröffentlicht: Repo und Video auf YouTube' },
        { state: 'next', text: 'Als Nächstes: Getriebestufe drucken und testen, Firmware' }
      ]
    },
    en: {
      title: 'Ringwheel – hybrid drone',
      tagline: 'A drone whose propeller rings become wheels.',
      text: 'A 5-inch quadcopter that lands, folds its four rings down by 90° and drives away on them. The same four motors fly and drive – through a planetary stage in the hub and a custom control board. Driving takes a fraction of the energy of hovering, and it is quiet.',
      facts: ['Flies + drives', 'Custom board (ESP32-S3)', '1:4 planetary gear', '≈ 950 g'],
      timeline: [
        { state: 'done', text: 'Designed in Fusion 360: folding mechanism, gearbox, body' },
        { state: 'done', text: 'Custom PCBs in KiCad, parts list' },
        { state: 'done', text: 'Published: repository and video on YouTube' },
        { state: 'next', text: 'Next: print and test the gear stage, firmware' }
      ]
    }
  },

  /* ---------------- games --------------------------------------- */
  {
    id: 'kometen',
    status: 'playable',
    featured: true,
    group: 'games',
    image: {
      src: 'img/game-kometen-cover.jpg',
      w: 1260, h: 1000,
      alt: {
        de: 'Cover von Kometen & Kronen: Pixelgrafik mit drei Völkern – Säugetiere, Aliens und lebende Pflanzen – vor ihren Hauptsitzen, darüber ein Komet',
        en: 'Kometen & Kronen cover: pixel art of three factions – mammals, aliens and living plants – in front of their headquarters, a comet above'
      }
    },
    gallery: [
      {
        src: 'img/game-kometen-battle.jpg', w: 1600, h: 773,
        caption: { de: 'Schlacht mit Mauern, Türmen und Konter-Einheiten', en: 'Battle with walls, towers and counter units' },
        alt: { de: 'Screenshot einer Schlacht im Pixel-Strategiespiel', en: 'Screenshot of a battle in the pixel strategy game' }
      }
    ],
    build: {
      href: 'https://github.com/DesignStraub/aliens-in-earth',
      label: { de: 'Code auf GitHub', en: 'Code on GitHub' }
    },
    buy: {
      href: '#TODO-itch-kometen',
      label: { de: 'Auf itch.io spielen', en: 'Play on itch.io' }
    },
    de: {
      title: 'Kometen & Kronen',
      tagline: 'Pixel-Echtzeitstrategie: Säugetiere, Aliens und lebende Pflanzen.',
      text: 'Ein klassisches Echtzeit-Strategiespiel mit Wirtschaft, fünf Zeitaltern und Konter-Einheiten, gebaut mit Godot. Drei Völker kämpfen auf zufällig erzeugten Karten – gegen einen Computer-Gegner, der seine Wirtschaft aufbaut und in Wellen angreift. Alle Sounds entstehen zur Laufzeit.',
      facts: ['Godot 4', '3 Völker', '5 Zeitalter', 'Bis zu 4 Spieler'],
      timeline: [
        { state: 'done', text: 'Völker, Wirtschaft, Zeitalter und KI-Gegner' },
        { state: 'done', text: 'Pixelgrafik, Sounds, Menüs, Speichern & Laden' },
        { state: 'now',  text: 'Spielbar, Code öffentlich' },
        { state: 'next', text: 'Als Nächstes: Veröffentlichung auf itch.io' }
      ]
    },
    en: {
      title: 'Kometen & Kronen',
      tagline: 'Pixel real-time strategy: mammals, aliens and living plants.',
      text: 'A classic real-time strategy game with an economy, five ages and counter units, built in Godot. Three factions fight on randomly generated maps – against a computer opponent that builds its economy and attacks in waves. All sounds are synthesised at runtime.',
      facts: ['Godot 4', '3 factions', '5 ages', 'Up to 4 players'],
      timeline: [
        { state: 'done', text: 'Factions, economy, ages and AI opponent' },
        { state: 'done', text: 'Pixel art, sound, menus, save & load' },
        { state: 'now',  text: 'Playable, code public' },
        { state: 'next', text: 'Next: release on itch.io' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'sprint',
    status: 'playable',
    featured: true,
    group: 'games',
    image: {
      src: 'img/game-sprint-cover.jpg',
      w: 1260, h: 1000,
      alt: {
        de: 'Cover von Need for Geschwindigkeit: ein getuntes blaues Auto mit Neonlicht in einer dunklen Garage, darüber der Titel',
        en: 'Need for Geschwindigkeit cover: a tuned blue car with neon lights in a dark garage, the title above'
      }
    },
    gallery: [
      {
        src: 'img/game-sprint-nitro.jpg', w: 1600, h: 900,
        caption: { de: 'Nachts durch die Stadt, mit Nitro', en: 'Through the city at night, with nitro' },
        alt: { de: 'Screenshot: Auto mit Nitro-Effekt auf einer nächtlichen Straße mit Neonschildern', en: 'Screenshot: car with nitro effect on a night street with neon signs' }
      }
    ],
    build: {
      href: 'https://github.com/DesignStraub/underground-sprint',
      label: { de: 'Code auf GitHub', en: 'Code on GitHub' }
    },
    buy: {
      href: 'https://onehumanity.itch.io/need-for-geschwindigkeit',
      label: { de: 'Kostenlos auf itch.io', en: 'Free on itch.io' }
    },
    de: {
      title: 'Need for Geschwindigkeit',
      tagline: 'Nächtliches Street-Racing im Stil der frühen 2000er.',
      text: 'Früher „Underground Sprint“. Low-Poly-3D mit Pixel-Look, gebaut mit Godot: Rennen durch die Stadt bei Nacht, Drift, Nitro und eine Garage zum Tunen. Siege schalten Autos, Strecken und Teile frei. Kostenlos, für Windows, macOS und Linux.',
      facts: ['Godot 4', 'Tastatur + Gamepad', 'Windows · macOS · Linux'],
      timeline: [
        { state: 'done', text: 'Fahrphysik, Strecken, Garage und Tuning' },
        { state: 'done', text: 'Builds für drei Plattformen, Trailer' },
        { state: 'done', text: 'Auf itch.io kostenlos spielbar, Code öffentlich' },
        { state: 'now',  text: 'Version 2.35 im Repo: mehrere Städte mit Schnellreise, Fahrer-Level, neues Drift-Modell, Vinyls' }
      ]
    },
    en: {
      title: 'Need for Geschwindigkeit',
      tagline: 'Night street racing in the style of the early 2000s.',
      text: 'Formerly “Underground Sprint”. Low-poly 3D with a pixel look, built in Godot: races through the city at night, drifting, nitro and a garage for tuning. Wins unlock cars, tracks and parts. Free, for Windows, macOS and Linux.',
      facts: ['Godot 4', 'Keyboard + gamepad', 'Windows · macOS · Linux'],
      timeline: [
        { state: 'done', text: 'Driving physics, tracks, garage and tuning' },
        { state: 'done', text: 'Builds for three platforms, trailer' },
        { state: 'done', text: 'Free to play on itch.io, code public' },
        { state: 'now',  text: 'Version 2.35 in the repository: several cities with fast travel, driver level, new drift model, vinyls' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'pfandpanik',
    status: 'playable',
    featured: true,
    group: 'games',
    image: {
      src: 'img/game-pfandpanik-cover.jpg',
      w: 1260, h: 1000,
      alt: {
        de: 'Cover von Pfandpanik Aachen: Comic-Figur mit Krone und Mütze zwischen Pfandflaschen, umringt von Tauben, Ordnungsamt und Kontrolleuren',
        en: 'Pfandpanik Aachen cover: a cartoon character with crown and beanie among deposit bottles, surrounded by pigeons, wardens and ticket inspectors'
      }
    },
    gallery: [
      {
        src: 'img/game-pfandpanik-elite.jpg', w: 1280, h: 720,
        caption: { de: 'Welle 11 am Elisenbrunnen: ein Elite-Gegner taucht auf', en: 'Wave 11 at the Elisenbrunnen: an elite enemy appears' },
        alt: { de: 'Screenshot: Spielfigur auf einem Platz in Aachen, oben Lebensbalken und Wellenanzeige, daneben ein Elite-Gegner', en: 'Screenshot: player character on a square in Aachen, health bar and wave counter at the top, an elite enemy next to it' }
      }
    ],
    buy: {
      href: '#TODO-itch-pfandpanik',
      label: { de: 'Auf itch.io spielen', en: 'Play on itch.io' }
    },
    de: {
      title: 'Pfandpanik Aachen',
      tagline: 'Satirisches Arena-Survival mitten in Aachen – mit Pfand, Pech und Printen.',
      text: 'Ein Arena-Roguelite im Stil von Brotato, gebaut mit Godot. 20 Wellen vom Bushof über die Pontstraße und den Elisenbrunnen bis zum Markt, Pfandflaschen als Währung und ein Kiosk zwischen den Wellen. Gegner sind Tauben, Ordnungsamt, Hipster mit Lastenrad und Immobilienmakler – am Ende warten zwei Aachener Baustellen als Endbosse.',
      facts: ['Godot 4', '6 Figuren', '16 Waffen', 'Im Browser spielbar'],
      timeline: [
        { state: 'done', text: 'Figuren, Waffen, Items, Kiosk und 20 Wellen mit Endbossen' },
        { state: 'done', text: 'Schwierigkeitsstufen, Freischaltbares, Endlosmodus' },
        { state: 'now',  text: 'Spielbar, Browser-Version fertig' },
        { state: 'next', text: 'Als Nächstes: Veröffentlichung auf itch.io' }
      ]
    },
    en: {
      title: 'Pfandpanik Aachen',
      tagline: 'Satirical arena survival in the middle of Aachen – with bottle deposits, bad luck and Printen.',
      text: 'An arena roguelite in the style of Brotato, built in Godot. 20 waves from the bus station via Pontstraße and the Elisenbrunnen to the market square, deposit bottles as currency and a kiosk between waves. Enemies include pigeons, wardens, hipsters on cargo bikes and estate agents – two Aachen building sites wait as final bosses.',
      facts: ['Godot 4', '6 characters', '16 weapons', 'Playable in the browser'],
      timeline: [
        { state: 'done', text: 'Characters, weapons, items, kiosk and 20 waves with bosses' },
        { state: 'done', text: 'Difficulty levels, unlockables, endless mode' },
        { state: 'now',  text: 'Playable, browser version ready' },
        { state: 'next', text: 'Next: release on itch.io' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'tubeshield',
    status: 'new',
    featured: true,
    group: 'tools',
    image: {
      src: 'img/tubeshield-screenshot.svg',
      w: 720, h: 540,
      alt: {
        de: 'Screenshot: YouTube-Startseite ohne Vorschläge und ohne Shorts, daneben das TubeShield-Popup mit vier eingeschalteten Schaltern',
        en: 'Screenshot: the YouTube home page without recommendations or Shorts, next to the TubeShield popup with four switches turned on'
      }
    },
    build: {
      href: 'https://github.com/DesignStraub/tubeshield',
      label: { de: 'Code auf GitHub', en: 'Code on GitHub' }
    },
    de: {
      title: 'TubeShield',
      tagline: 'Ein Open-Source-Adblocker für Safari – mit YouTube-Auto-Pause-Block.',
      text: 'Blockiert Werbung und Tracker auf allen Websites und überspringt Werbung auf YouTube. Dazu bestätigt TubeShield YouTubes Frage „Video pausiert. Weiterschauen?“ automatisch, damit Musik und lange Videos einfach weiterlaufen. Auf Wunsch blendet es die Vorschläge der YouTube-Startseite und alle Shorts aus. Keine Konten, keine Telemetrie, keine Daten – das Blockieren übernimmt Safari selbst. TubeShield bleibt immer Open Source; weitere Funktionen kommen dazu.',
      facts: ['Safari · macOS', '≈ 93.000 Filterregeln', 'Sammelt keine Daten', 'Open Source · GPL-3.0'],
      timeline: [
        { state: 'done', text: 'Werbung und Tracker auf allen Websites blockieren (EasyList, EasyPrivacy, EasyList Germany)' },
        { state: 'done', text: 'YouTube: Werbung überspringen, Premium-Dialoge schließen, Auto-Pause verhindern' },
        { state: 'done', text: 'Schalter für eine Startseite ohne Vorschläge und für das Ausblenden von Shorts' },
        { state: 'now',  text: 'Version 1.3 im täglichen Einsatz, Code öffentlich auf GitHub' },
        { state: 'next', text: 'Als Nächstes: weitere Funktionen' }
      ]
    },
    en: {
      title: 'TubeShield',
      tagline: 'An open-source ad blocker for Safari – with a YouTube auto-pause block.',
      text: 'Blocks ads and trackers on every website and skips ads on YouTube. TubeShield also answers YouTube’s “Video paused. Continue watching?” prompt for you, so music and long videos simply keep playing. If you like, it hides the YouTube home feed and all Shorts. No accounts, no telemetry, no data – Safari does the blocking itself. TubeShield will always stay open source; more features are on the way.',
      facts: ['Safari · macOS', '≈ 93,000 filter rules', 'Collects no data', 'Open source · GPL-3.0'],
      timeline: [
        { state: 'done', text: 'Block ads and trackers on every website (EasyList, EasyPrivacy, EasyList Germany)' },
        { state: 'done', text: 'YouTube: skip ads, close Premium dialogs, prevent auto-pause' },
        { state: 'done', text: 'Switches for a home page without recommendations and for hiding Shorts' },
        { state: 'now',  text: 'Version 1.3 in daily use, code public on GitHub' },
        { state: 'next', text: 'Next: more features' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'raumplaner',
    status: 'new',
    featured: true,
    group: 'tools',
    image: {
      src: 'img/raumplaner-screenshot.jpg',
      w: 1600, h: 1000,
      alt: {
        de: 'Screenshot des Raumplaners: Grundriss einer 3-Zimmer-Wohnung mit farbigen Räumen, links Werkzeuge und Voreinstellungen, rechts die Raumliste mit Flächen',
        en: 'Screenshot of the room planner: floor plan of a three-room flat with coloured rooms, tools and defaults on the left, the room list with areas on the right'
      }
    },
    demo: {
      href: 'https://designstraub.github.io/raumplaner/',
      label: { de: 'Im Browser öffnen', en: 'Open in the browser' }
    },
    build: {
      href: 'https://github.com/DesignStraub/raumplaner',
      label: { de: 'Code auf GitHub', en: 'Code on GitHub' }
    },
    de: {
      title: 'Raumplaner',
      tagline: 'Grundriss zeichnen und die Wohnung in 3D einrichten – direkt im Browser.',
      text: 'Grundriss zeichnen oder Vorlage wählen, Räume benennen und die Wohnung in 3D einrichten – Wandtexturen, Böden, Türen und Fenster. Läuft im Browser und auf dem Handy.',
      facts: ['Browser · Handy', 'three.js', 'Eine HTML-Datei', 'Kein Konto'],
      timeline: [
        { state: 'done', text: 'Grundriss-Editor: Vorlagen, Rechteck und Vieleck, Räume benennen' },
        { state: 'done', text: '3D-Einrichtung: Texturen pro Wandseite und Boden, Türen und Fenster, begehbar' },
        { state: 'now',  text: 'Online über GitHub Pages, Code öffentlich' }
      ]
    },
    en: {
      title: 'Room Planner',
      tagline: 'Draw a floor plan and furnish the flat in 3D – right in the browser.',
      text: 'Draw a floor plan or pick a template, name the rooms and fit out the flat in 3D – wall textures, floors, doors and windows. Runs in the browser and on your phone.',
      facts: ['Browser · phone', 'three.js', 'A single HTML file', 'No account'],
      timeline: [
        { state: 'done', text: 'Floor plan editor: templates, rectangles and polygons, room names' },
        { state: 'done', text: '3D fit-out: textures per wall side and floor, doors and windows, walkable' },
        { state: 'now',  text: 'Online via GitHub Pages, code public' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'lifebar',
    status: 'live',
    featured: true,
    group: 'tools',
    link: 'lifebar.html',
    image: {
      src: 'img/lifebar-device.jpg',
      w: 2000, h: 1198,
      alt: {
        de: 'Die LifeBar auf dem Schreibtisch: blaues gedrucktes Gehäuse mit schmalem Balkendisplay, Lockscreen mit Uhrzeit, Level und EXP',
        en: 'The LifeBar on a desk: blue printed case with a narrow bar display, lock screen showing time, level and EXP'
      }
    },
    gallery: [
      {
        src: 'img/lifebar-deck-cad.jpg', w: 1600, h: 1022,
        caption: { de: 'In Arbeit: Gehäuse mit drei Tasten und Drehknopf (CAD, noch nicht gedruckt)', en: 'In progress: case with three keys and a knob (CAD, not printed yet)' },
        alt: {
          de: 'CAD-Ansicht eines weißen Pultgehäuses mit Balkendisplay, drei Medientasten, Drehknopf und kleinem Weltherz-Logo vorn',
          en: 'CAD view of a white desk console with a bar display, three media keys, a knob and a small World Heart logo on the front'
        }
      }
    ],
    build: { href: 'https://github.com/DesignStraub/lifebar' },
    de: {
      title: 'LifeBar',
      tagline: 'Ein Werkzeug für die eigene Zeit – fertig gebaut und täglich im Einsatz.',
      text: 'Gamification fürs echte Leben auf eigener Hardware: ein Balkendisplay auf dem Schreibtisch, das investierte Minuten in EXP, Level und verdiente Titel verwandelt. Du siehst auf einen Blick, wohin deine Woche geht – ohne App, ohne Konto. Alles bleibt auf dem Gerät.',
      facts: ['ESP32-S3', 'Bar-Display', '100 % lokal', 'Gehäuse aus Fusion 360'],
      timeline: [
        { state: 'done', text: 'Idee: eine Ressourcenleiste wie im Strategiespiel' },
        { state: 'done', text: 'Eigenes Board-Setup, gedrucktes Gehäuse, Firmware läuft' },
        { state: 'done', text: 'Bedienung über Tasten, Oberfläche neu in Schwarz-Weiß' },
        { state: 'now',  text: 'Täglich im Einsatz, Repo öffentlich' },
        { state: 'next', text: 'Als Nächstes: Gehäuse mit Tasten und Drehknopf drucken, Bauanleitung ausbauen' }
      ]
    },
    en: {
      title: 'LifeBar',
      tagline: 'A tool for your own time – built and in daily use.',
      text: 'Gamification for real life on its own hardware: a bar display on your desk that turns invested minutes into EXP, levels and earned titles. You see at a glance where your week is going – no app, no account. Everything stays on the device.',
      facts: ['ESP32-S3', 'Bar display', '100% local', 'Case designed in Fusion 360'],
      timeline: [
        { state: 'done', text: 'Idea: a resource bar like in a strategy game' },
        { state: 'done', text: 'Board set up, printed case, firmware running' },
        { state: 'done', text: 'Hardware controls, interface restyled in black and white' },
        { state: 'now',  text: 'In daily use, repository public' },
        { state: 'next', text: 'Next: print the case with keys and knob, expand the build guide' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'glidesplit',
    status: 'concept',
    featured: true,
    group: 'tools',
    image: {
      src: 'img/glidesplit-hero.jpg',
      w: 1600, h: 1000,
      alt: {
        de: 'Render der GlideSplit: zwei Tastaturhälften mit je einem Maus-Griff hinten',
        en: 'Render of GlideSplit: two keyboard halves, each with a mouse grip at the back'
      }
    },
    build: {
      href: 'https://github.com/DesignStraub/glidesplit',
      label: { de: 'Konzept auf GitHub', en: 'Concept on GitHub' }
    },
    follow: {
      href: 'https://youtube.com/shorts/S3FE6H6Afo0',
      label: { de: 'Video ansehen', en: 'Watch the video' }
    },
    de: {
      title: 'GlideSplit',
      tagline: 'Eine kabellose Split-Tastatur, deren Hälften auch die Maus sind.',
      text: 'Jede Hälfte hat hinten einen Maus-Griff und unten einen optischen Sensor. Beide bewegen den Cursor – die Hände bleiben auf der Tastatur. Gedacht für Büro und Alltag. Ein durchgerechnetes Konzept mit CAD, Teileliste und Firmware-Plan.',
      facts: ['ZMK', 'nRF52840', 'PMW3610-Sensor', 'Kabellos'],
      timeline: [
        { state: 'done', text: 'Konzept, CAD, Teileliste, Kostenschätzung' },
        { state: 'done', text: 'Veröffentlicht: Repo und Video' },
        { state: 'next', text: 'Als Nächstes: erster Prototyp' }
      ]
    },
    en: {
      title: 'GlideSplit',
      tagline: 'A wireless split keyboard whose halves are also the mouse.',
      text: 'Each half has a mouse grip at the back and an optical sensor underneath. Both move the cursor – your hands stay on the keyboard. Meant for office and everyday use. A worked-out concept with CAD, parts list and firmware plan.',
      facts: ['ZMK', 'nRF52840', 'PMW3610 sensor', 'Wireless'],
      timeline: [
        { state: 'done', text: 'Concept, CAD, parts list, cost estimate' },
        { state: 'done', text: 'Published: repository and video' },
        { state: 'next', text: 'Next: first prototype' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'badge',
    status: 'new',
    featured: false,
    group: 'design',
    image: {
      src: 'img/badge-laptop.jpg',
      w: 900, h: 1200,
      alt: {
        de: 'Das schwarz-weiße Weltherz-Badge auf einem silbernen Laptop-Deckel',
        en: 'The black-and-white World Heart badge on a silver laptop lid'
      }
    },
    gallery: [
      {
        src: 'img/badge.jpg', w: 900, h: 1200,
        caption: { de: 'Zweifarbig gedruckt', en: 'Printed in two colours' },
        alt: {
          de: 'Nahaufnahme des runden Badges: weißes Herz mit schwarzer Weltkarte auf schwarzem Grund',
          en: 'Close-up of the round badge: a white heart with a black world map on a black disc'
        }
      }
    ],
    build: {
      href: 'https://makerworld.com/models/3447099-heart-world-laptop-logo-badge-coaster',
      label: { de: 'Datei auf MakerWorld', en: 'File on MakerWorld' }
    },
    buy: { href: '#TODO-etsy-badge' },
    de: {
      title: 'Laptop-Badge – Weltherz',
      tagline: 'Das Logo zum Aufkleben, aus dem 3D-Drucker.',
      text: 'Ein 3D-gedrucktes Weltherz-Cover für den Laptop-Deckel. Die Druckdatei ist frei – druck es selbst in deiner Lieblingsfarbe oder hol dir ein fertiges.',
      facts: ['3D-Druck', 'Freie Datei'],
      timeline: [
        { state: 'done', text: 'Entworfen und gedruckt' },
        { state: 'now',  text: 'Neu: Datei frei, fertige Badges im Shop' }
      ]
    },
    en: {
      title: 'Laptop badge – World Heart',
      tagline: 'The logo for your laptop, from the 3D printer.',
      text: 'A 3D-printed World Heart cover for your laptop lid. The print file is free – print it yourself in your favourite colour, or get one ready-made.',
      facts: ['3D printed', 'Free file'],
      timeline: [
        { state: 'done', text: 'Designed and printed' },
        { state: 'now',  text: 'New: file is free, finished badges in the shop' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'lifebar-stand',
    status: 'free',
    featured: false,
    group: 'design',
    image: {
      src: 'img/lifebar-stand.jpg',
      w: 1400, h: 1050,
      alt: { de: 'Render des LifeBar-Standfußes mit Display und Weltherz-Logo', en: 'Render of the LifeBar desk stand with display and World Heart logo' }
    },
    build: {
      href: 'https://makerworld.com/models/3447599-lifebar-stand-waveshare-esp32-s3-touch-lcd-3-49',
      label: { de: 'Datei auf MakerWorld', en: 'File on MakerWorld' }
    },
    de: { title: 'LifeBar-Standfuß', text: 'Schräger Tischständer für das Waveshare-ESP32-S3-Display der LifeBar, mit und ohne Logo.' },
    en: { title: 'LifeBar desk stand', text: 'Angled desk stand for the LifeBar’s Waveshare ESP32-S3 display, with or without logo.' }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'keycaps',
    status: 'free',
    featured: false,
    group: 'design',
    image: {
      src: 'img/keycaps-desk.jpg',
      w: 1400, h: 1050,
      alt: { de: 'Weiße Low-Profile-Tastatur mit minimalistischen gedruckten Tastenkappen auf dem Schreibtisch', en: 'White low-profile keyboard with minimalist printed keycaps on a desk' }
    },
    build: {
      href: 'https://makerworld.com/models/3516612-minimalistic-low-profile-keycaps',
      label: { de: 'Datei auf MakerWorld', en: 'File on MakerWorld' }
    },
    de: { title: 'Low-Profile-Tastenkappen', text: 'Minimalistische, flache Tastenkappen zum Selbstdrucken – getestet auf einer 65-%-Tastatur.' },
    en: { title: 'Low-profile keycaps', text: 'Minimalist flat keycaps to print yourself – tested on a 65% keyboard.' }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'skadis',
    status: 'free',
    featured: false,
    group: 'design',
    image: {
      src: 'img/workshop-bench.jpg',
      w: 1600, h: 1200,
      alt: { de: 'Werkbank mit Skadis-Lochwand, die an den Schreibtisch geklemmt ist', en: 'Workbench with a Skadis pegboard clamped to the desk' }
    },
    build: {
      href: 'https://makerworld.com/models/3482229-skadis-desk-wall-clamp-on-pegboard-80-cm-desk',
      label: { de: 'Datei auf MakerWorld', en: 'File on MakerWorld' }
    },
    de: { title: 'Skadis-Schreibtischwand', text: 'Klemm-Halterung, mit der eine Skadis-Lochwand ohne Bohren hinten am Schreibtisch steht.' },
    en: { title: 'Skadis desk wall', text: 'Clamp mount that holds a Skadis pegboard at the back of a desk – no drilling.' }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'trash',
    status: 'free',
    featured: false,
    group: 'design',
    image: {
      src: 'img/trash-holder.jpg',
      w: 1400, h: 1050,
      alt: { de: 'Render einer ausziehbaren Halterung unter der Tischplatte für den Gelben Sack', en: 'Render of a sliding under-desk holder for a recycling bag' }
    },
    build: {
      href: 'https://makerworld.com/models/3518925-sliding-under-desk-holder-for-gelber-sack',
      label: { de: 'Datei auf MakerWorld', en: 'File on MakerWorld' }
    },
    de: { title: 'Untertisch-Halterung für den Gelben Sack', text: 'Ausziehbarer Rahmen, der unter die Tischplatte geklemmt wird. Hält den Gelben Sack griffbereit und verschwindet danach wieder.' },
    en: { title: 'Under-desk recycling bag holder', text: 'Sliding frame that clamps under the desk. Keeps the recycling bag within reach and slides away afterwards.' }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'stickers',
    status: 'free',
    featured: false,
    group: 'design',
    image: {
      src: 'sticker.png',
      w: 720, h: 720,
      alt: { de: 'Der OneHumanity-Sticker', en: 'The OneHumanity sticker' }
    },
    build: {
      href: 'oneforall.pdf',
      label: { de: 'Druck-PDF laden', en: 'Download print PDF' }
    },
    buy: {
      href: 'https://oneplanetonehumanity.etsy.com',
      label: { de: 'Im Etsy-Shop', en: 'In the Etsy shop' }
    },
    de: {
      title: 'Sticker & Lesezeichen',
      tagline: 'Kleine Botschaften für gute Orte.',
      text: 'Freie Sticker-Sets und ein Druck-PDF für zu Hause. Druck sie, teil sie, kleb sie irgendwohin, wo sie jemandem den Tag besser machen. Gedruckte Sticker und Lesezeichen gibt es im Shop.',
      facts: ['Frei zum Drucken', 'Kostenlose Sets'],
      timeline: [
        { state: 'done', text: 'Erste Sets gedruckt und verschickt' },
        { state: 'now',  text: 'Frei verfügbar: PDF, kostenlose Sets, Etsy-Shop' }
      ]
    },
    en: {
      title: 'Stickers & bookmarks',
      tagline: 'Small messages for good places.',
      text: 'Free sticker sets and a print PDF for home. Print them, share them, put them somewhere they make someone’s day a little better. Printed stickers and bookmarks are in the shop.',
      facts: ['Free to print', 'Free sets'],
      timeline: [
        { state: 'done', text: 'First sets printed and sent out' },
        { state: 'now',  text: 'Freely available: PDF, free sets, Etsy shop' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'nixie',
    status: 'sketch',
    featured: true,
    group: 'tools',
    image: {
      src: 'img/nixie-clock-walnuss.jpg',
      w: 1600, h: 900,
      alt: {
        de: 'Render der Nixie-Uhr an der Wand: vier leuchtend orangene Röhren zeigen die Ziffern 1, 2, 4 und 8 auf einem Walnussbrett',
        en: 'Render of the nixie clock on the wall: four glowing orange tubes show the digits 1, 2, 4 and 8 on a walnut board'
      }
    },
    build: {
      href: '#TODO-nixie-repo',
      label: { de: 'Dateien & Anleitung', en: 'Files & guide' }
    },
    de: {
      title: 'Nixie-Uhr 4× IN-12',
      tagline: 'Eine Wanduhr mit vier Nixie-Röhren, jede mit eigenem Treiber.',
      text: 'Vier IN-12B-Röhren in Walnuss oder Ahorn, gesteuert von einem ESP32-C5 mit WLAN für 2,4 und 5 GHz. Jede Röhre erzeugt ihre Hochspannung selbst. Die Schaltung pro Röhre stammt aus dem Open-Source-Projekt cnixxi. Die Platine ist entworfen; die Uhr ist ein technisches Konzept.',
      facts: ['4× IN-12B', 'ESP32-C5 · WLAN 2,4/5 GHz', 'Eigener Treiber pro Röhre', 'USB-C 5 V'],
      timeline: [
        { state: 'done', text: 'Schaltplan und vierlagige Platine entworfen (KiCad)' },
        { state: 'done', text: 'Fertigungsdaten, Stückliste und Firmware-Entwurf erstellt' },
        { state: 'next', text: 'Als Nächstes: Platine bestellen und in Betrieb nehmen' }
      ]
    },
    en: {
      title: 'Nixie clock 4× IN-12',
      tagline: 'A wall clock with four nixie tubes, each with its own driver.',
      text: 'Four IN-12B tubes in walnut or maple, driven by an ESP32-C5 with 2.4 and 5 GHz Wi-Fi. Each tube generates its high voltage itself. The circuit per tube comes from the open-source cnixxi project. The board is designed; the clock is a technical concept.',
      facts: ['4× IN-12B', 'ESP32-C5 · Wi-Fi 2.4/5 GHz', 'Own driver per tube', 'USB-C 5 V'],
      timeline: [
        { state: 'done', text: 'Schematic and four-layer board designed (KiCad)' },
        { state: 'done', text: 'Production files, parts list and firmware draft ready' },
        { state: 'next', text: 'Next: order the board and commission it' }
      ]
    }
  },

  /* ---------------- tools.html only ------------------------------- */
  {
    id: 'mode-system',
    status: 'live',
    featured: false,
    group: 'archive',
    link: 'Mode-system-guide.html',
    image: {
      src: 'mode.jpeg',
      w: 1600, h: 1000,
      alt: {
        de: 'Die fünf gedruckten Modus-Karten nebeneinander',
        en: 'The five printed Mode System cards side by side'
      }
    },
    actions: [
      { href: 'Mode-system-guide.html', primary: true, label: { de: 'Guide öffnen', en: 'Open guide' } },
      { href: 'https://oneplanetonehumanity.etsy.com', label: { de: 'Auf Etsy ansehen', en: 'View on Etsy' } }
    ],
    de: {
      title: 'Mode System',
      text: 'Fünf Karten, ein paar Regeln, keine App. Jede Karte bringt dich in einen Zustand zur Zeit und benennt, was dieser Zustand ausschließt.',
      timeline: [
        { state: 'done', text: 'Erste Serie gedruckt und laminiert' },
        { state: 'now',  text: 'Im Einsatz, Guide online, Versand über Etsy' }
      ]
    },
    en: {
      title: 'Mode System',
      text: 'Five cards, a few rules, no app. Each card puts you in one state at a time and names what that state leaves out.',
      timeline: [
        { state: 'done', text: 'First printed and laminated series' },
        { state: 'now',  text: 'In use, guide online, shipping from Etsy' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'proof',
    status: 'design',
    featured: false,
    group: 'archive',
    link: 'proof.html',
    actions: [
      { href: 'proof.html', primary: true, label: { de: 'Mehr lesen', en: 'Read more' } }
    ],
    de: {
      title: 'Proof',
      text: 'Sieh deinen Tag, wie er wirklich war. Ein Token pro Sache, die passiert ist – ohne Tracking.',
      timeline: [
        { state: 'done', text: 'Konzept und Regeln aufgeschrieben' },
        { state: 'now',  text: 'Die physische Form eines Tokens wird ausgearbeitet' }
      ]
    },
    en: {
      title: 'Proof',
      text: 'See your day as it actually was. One token per thing that happened – no tracking.',
      timeline: [
        { state: 'done', text: 'Concept and rules written down' },
        { state: 'now',  text: 'Working out the physical form of a token' }
      ]
    }
  }

];
