/* ==========================================================================
   projects.data.js — the only file you edit to add or change a project.
   ==========================================================================

   The home page roadmap and tools.html are both built from this list.
   Add a project = add one object below. Order here = order on the page.

   FIELDS
     id        short slug. Also the anchor: index.html#project-<id>
     status    'live' | 'wip' | 'new' | 'free' | 'testing' | 'design' | 'sketch' | 'open'
               Labels and colours live in projects.render.js.
     featured  true  → on the home page roadmap
               false → tools.html only, under "More projects"
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
    id: 'lifebar',
    status: 'live',
    featured: true,
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
      tagline: 'Gamification fürs echte Leben, auf eigener Hardware.',
      text: 'Ein Balkendisplay auf dem Schreibtisch, das investierte Minuten in EXP, Level und verdiente Titel verwandelt. Du siehst auf einen Blick, wohin deine Woche geht – ohne App, ohne Konto. Alles bleibt auf dem Gerät.',
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
      tagline: 'Gamification for real life, on its own hardware.',
      text: 'A bar display on your desk that turns invested minutes into EXP, levels and earned titles. You see at a glance where your week is going – no app, no account. Everything stays on the device.',
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
    id: 'yusu',
    status: 'wip',
    featured: true,
    image: {
      src: 'img/yusu-sketch-side.jpg',
      w: 1400, h: 1050,
      alt: {
        de: 'Buntstiftskizze des Roboterkopfs von vorn und von der Seite, beschriftet mit Screen, Kamera, Lautsprecher und Mikrofon-Array sowie LED-Streifen',
        en: 'Coloured-pencil sketch of the robot head from the front and the side, labelled screen, camera, speaker and mic array, and LED strip'
      }
    },
    gallery: [
      {
        src: 'img/yusu-eyes-display.jpg', w: 1440, h: 480,
        caption: { de: 'Die Augen auf dem Display: zufrieden, verärgert, müde', en: 'The eyes on the display: content, annoyed, tired' },
        alt: {
          de: 'Drei Augenpaare in leuchtendem Blau auf schwarzem Grund, gerendert im Pixelraster des Displays',
          en: 'Three pairs of glowing blue eyes on black, rendered in the display’s pixel grid'
        }
      },
      {
        src: 'img/yusu-eyes-states.jpg', w: 1600, h: 640,
        caption: { de: 'Zehn Gefühlslagen, von ruhig bis gelangweilt', en: 'Ten moods, from calm to bored' },
        alt: {
          de: 'Übersicht von zehn Augenausdrücken: ruhig, zufrieden, freudig, neugierig, überrascht, traurig, besorgt, verärgert, müde, gelangweilt',
          en: 'Overview of ten eye expressions: calm, content, happy, curious, surprised, sad, worried, annoyed, tired, bored'
        }
      }
    ],
    build: { href: '#TODO-yusu-repo' },
    follow: {
      href: '#TODO-instagram',
      label: { de: 'Updates auf Instagram', en: 'Updates on Instagram' }
    },
    de: {
      title: 'Yusu – OneHumanity R1',
      tagline: 'Ein modularer Roboter. Begleiter statt Diener.',
      text: 'Yusu zeigt Gefühle mit Display-Augen und einem LED-Mund, läuft komplett lokal und ist aus Modulen gebaut, die man einzeln tauschen, reparieren und weiterentwickeln kann. Wir fangen beim Kopf an: Die Augen beherrschen schon zehn Gefühlslagen.',
      facts: ['Emotionale Mimik', 'Kamera, Mikrofon, Lautsprecher', 'Läuft lokal', 'Modular austauschbar'],
      timeline: [
        { state: 'done', text: 'Konzept und Skizzen des Kopfes' },
        { state: 'done', text: 'Augen-Engine: zehn Gefühlslagen, auf dem Display gerendert' },
        { state: 'now',  text: 'In Entwicklung: Kopf-Gehäuse, Mund und Mimik' },
        { state: 'next', text: 'Als Nächstes: Dateien und Firmware des Kopfes veröffentlichen' }
      ]
    },
    en: {
      title: 'Yusu – OneHumanity R1',
      tagline: 'A modular robot. A companion, not a servant.',
      text: 'Yusu shows emotion with display eyes and an LED mouth, runs entirely locally and is built from modules you can swap, repair and improve one at a time. We are starting with the head: the eyes already know ten moods.',
      facts: ['Expressive face', 'Camera, mic, speaker', 'Runs locally', 'Modular and swappable'],
      timeline: [
        { state: 'done', text: 'Concept and sketches of the head' },
        { state: 'done', text: 'Eye engine: ten moods, rendered on the display' },
        { state: 'now',  text: 'In development: head shell, mouth and expressions' },
        { state: 'next', text: 'Next: publish files and firmware for the head' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'badge',
    status: 'new',
    featured: true,
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
    featured: true,
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
