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
      }
    ],
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
      text: 'Unser erster großer Roboter. Yusu nimmt Gesichter, Licht und Sprache wahr, leitet daraus einen eigenen emotionalen Zustand ab und zeigt ihn über leuchtende Augen und einen LED-Mund. Alles läuft lokal auf dem Gerät. Gebaut wird in Modulen, Schritt für Schritt – angefangen beim Kopf.',
      facts: ['Gesichts- und Spracherkennung lokal', 'Emotions-Engine', 'Eigener ESP32 pro Modul', 'Zielplattform Jetson'],
      timeline: [
        { state: 'done', text: 'Konzept, Charakter und Sicherheitsregeln festgelegt' },
        { state: 'done', text: 'Emotions-Engine, Augen und Sprache laufen am Rechner' },
        { state: 'done', text: 'Kopf konstruiert und gedruckt (Version 8 mit Visier)' },
        { state: 'now',  text: 'Phase 0: Elektronik in den Kopf – Kameras, Display, Mikrofone' },
        { state: 'next', text: 'Danach: Rumpf und erste Bewegung' }
      ]
    },
    en: {
      title: 'Yusu – OneHumanity R1',
      tagline: 'A modular, human-sized robot. A companion, not a servant.',
      text: 'Our first large robot. Yusu perceives faces, light and speech, derives its own emotional state from them and shows it through glowing eyes and an LED mouth. Everything runs locally on the device. It is built in modules, step by step – starting with the head.',
      facts: ['Local face and speech recognition', 'Emotion engine', 'Own ESP32 per module', 'Target platform: Jetson'],
      timeline: [
        { state: 'done', text: 'Concept, character and safety rules defined' },
        { state: 'done', text: 'Emotion engine, eyes and speech running on the computer' },
        { state: 'done', text: 'Head designed and printed (version 8 with visor)' },
        { state: 'now',  text: 'Phase 0: electronics into the head – cameras, display, microphones' },
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
        de: 'Cover von Underground Sprint: ein getuntes blaues Auto mit Neonlicht in einer dunklen Garage, darüber der Titel',
        en: 'Underground Sprint cover: a tuned blue car with neon lights in a dark garage, the title above'
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
      href: '#TODO-itch-sprint',
      label: { de: 'Kostenlos auf itch.io', en: 'Free on itch.io' }
    },
    de: {
      title: 'Underground Sprint',
      tagline: 'Nächtliches Street-Racing im Stil der frühen 2000er.',
      text: 'Low-Poly-3D mit Pixel-Look, gebaut mit Godot: Rennen durch die Stadt bei Nacht, Drift, Nitro und eine Garage zum Tunen. Siege schalten Autos, Strecken und Teile frei. Kostenlos, für Windows, macOS und Linux.',
      facts: ['Godot 4', 'Tastatur + Gamepad', 'Windows · macOS · Linux'],
      timeline: [
        { state: 'done', text: 'Fahrphysik, Strecken, Garage und Tuning' },
        { state: 'done', text: 'Builds für drei Plattformen, Trailer' },
        { state: 'now',  text: 'Spielbar, Code öffentlich' },
        { state: 'next', text: 'Als Nächstes: Veröffentlichung auf itch.io' }
      ]
    },
    en: {
      title: 'Underground Sprint',
      tagline: 'Night street racing in the style of the early 2000s.',
      text: 'Low-poly 3D with a pixel look, built in Godot: races through the city at night, drifting, nitro and a garage for tuning. Wins unlock cars, tracks and parts. Free, for Windows, macOS and Linux.',
      facts: ['Godot 4', 'Keyboard + gamepad', 'Windows · macOS · Linux'],
      timeline: [
        { state: 'done', text: 'Driving physics, tracks, garage and tuning' },
        { state: 'done', text: 'Builds for three platforms, trailer' },
        { state: 'now',  text: 'Playable, code public' },
        { state: 'next', text: 'Next: release on itch.io' }
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
    build: { href: 'https://github.com/DesignStraub/lifebar' },
    de: {
      title: 'LifeBar',
      tagline: 'Ein Werkzeug für die eigene Zeit – fertig gebaut und täglich im Einsatz.',
      text: 'Gamification fürs echte Leben auf eigener Hardware: ein Balkendisplay auf dem Schreibtisch, das investierte Minuten in EXP, Level und verdiente Titel verwandelt. Du siehst auf einen Blick, wohin deine Woche geht – ohne App, ohne Konto. Alles bleibt auf dem Gerät.',
      facts: ['ESP32-S3', 'Bar-Display', '100 % lokal', 'Gehäuse aus Fusion 360'],
      timeline: [
        { state: 'done', text: 'Idee: eine Ressourcenleiste wie im Strategiespiel' },
        { state: 'done', text: 'Eigenes Board-Setup, gedrucktes Gehäuse, Firmware läuft' },
        { state: 'now',  text: 'Täglich im Einsatz, Repo öffentlich' },
        { state: 'next', text: 'Als Nächstes: Bauanleitung und Teileliste ausbauen' }
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
        { state: 'now',  text: 'In daily use, repository public' },
        { state: 'next', text: 'Next: expand the build guide and parts list' }
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
