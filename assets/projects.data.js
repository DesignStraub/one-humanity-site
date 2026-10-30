/* ==========================================================================
   projects.data.js — the only file you edit to add or change a project.
   ==========================================================================

   The home page roadmap and tools.html are both built from this list.
   Add a project = add one object below. Order here = order on the page.

   FIELDS
     id        short slug. Also the anchor: index.html#project-<id>
     status    'live' | 'wip' | 'concept' | 'new' | 'free' | 'testing' | 'design' | 'sketch' | 'open'
               Labels and colours live in projects.render.js.
     featured  true  → on the home page roadmap (robotics)
               false → not in the roadmap
     group     'robotics' | 'workshop' | 'archive'
               workshop → "Aus der Werkstatt" (home + tools.html)
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

  /* ---------------------------------------------------------------- */
  {
    id: 'lifebar',
    status: 'live',
    featured: true,
    group: 'robotics',
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
      tagline: 'Fertig gebaut und täglich im Einsatz.',
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
      tagline: 'Built, finished and in daily use.',
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
    id: 'badge',
    status: 'new',
    featured: false,
    group: 'workshop',
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
    id: 'stickers',
    status: 'free',
    featured: false,
    group: 'workshop',
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
