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
      src: 'img/roombot-sketch.jpg',
      w: 1500, h: 1000,
      alt: {
        de: 'Frühe Notizbuchskizze des Roboters: ein Kopf mit animiertem Gesicht, beschriftet mit Kamera, Live-Daten und Konversation',
        en: 'Early notebook sketch of the robot: a head with an animated face, labelled camera, live data and conversation'
      }
    },
    build: { href: '#TODO-yusu-repo' },
    follow: {
      href: '#TODO-instagram',
      label: { de: 'Updates auf Instagram', en: 'Updates on Instagram' }
    },
    de: {
      title: 'Yusu – OneHumanity R1',
      tagline: 'Ein modularer Roboter. Begleiter statt Diener.',
      text: 'Yusu zeigt Gefühle mit Display-Augen und einem LED-Mund, läuft komplett lokal und ist aus Modulen gebaut, die man einzeln tauschen, reparieren und weiterentwickeln kann. Wir fangen beim Kopf an.',
      facts: ['Emotionale Mimik', 'Läuft lokal', 'Modular austauschbar'],
      timeline: [
        { state: 'done', text: 'Konzept und erste Skizzen' },
        { state: 'now',  text: 'In Entwicklung: der Kopf – Augen, Mund, Mimik' },
        { state: 'next', text: 'Als Nächstes: Dateien und Firmware des Kopfes veröffentlichen' }
      ]
    },
    en: {
      title: 'Yusu – OneHumanity R1',
      tagline: 'A modular robot. A companion, not a servant.',
      text: 'Yusu shows emotion with display eyes and an LED mouth, runs entirely locally and is built from modules you can swap, repair and improve one at a time. We are starting with the head.',
      facts: ['Expressive face', 'Runs locally', 'Modular and swappable'],
      timeline: [
        { state: 'done', text: 'Concept and first sketches' },
        { state: 'now',  text: 'In development: the head – eyes, mouth, expressions' },
        { state: 'next', text: 'Next: publish files and firmware for the head' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'badge',
    status: 'new',
    featured: true,
    build: {
      href: '#TODO-makerworld-badge',
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
