/* ==========================================================================
   projects.data.js — the only file you edit to add or change a project.
   ==========================================================================

   Both the home page and the projects page are built from this list.
   Add a project = add one object below. Nothing else to touch.

   FIELDS
     id        short slug, used as a CSS hook. Must be unique.
     status    'live' | 'testing' | 'design' | 'sketch' | 'open'
               The label and colour come from projects.render.js —
               change them there once, not per project.
     featured  true  → also appears on the home page (keep this to 3)
               false → projects page only
     link      optional. Makes the home-page card clickable.
     image     optional. { src, w, h, alt: { de, en } }
               Leave it out and the card renders without a picture.
     actions   optional. Buttons at the bottom of the projects-page card.
               [{ href, primary: true|false, label: { de, en } }]
     de / en   title, text, and the timeline for that language.

   TIMELINE
     Each step is { state, text }.
       state: 'done' → already happened
              'now'  → where it stands today   (use exactly one per project)
              'next' → the next step you intend to take
     Keep it to 2–4 steps. The 'next' step is the one that shows the
     project is alive, so try not to leave it out.
*/

window.OH_PROJECTS = [

  /* ---------------------------------------------------------------- */
  {
    id: 'mode-system',
    status: 'live',
    featured: true,
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
      text: 'Fünf Sachen angefangen, keine fertig. Die Karten bringen dich in einen Zustand zur Zeit und benennen, was dieser Zustand ausschließt. Fünf Karten, ein paar Regeln, keine App — Start mit einer Karte und fünf Minuten.',
      timeline: [
        { state: 'done', text: 'Als Regelwerk für mich selbst aufgeschrieben' },
        { state: 'done', text: 'Erste Serie gedruckt und laminiert' },
        { state: 'now',  text: 'Täglich im Einsatz, Guide online, Versand über Etsy' },
        { state: 'next', text: 'Als Nächstes: Farbcodierung, neue Icons, eine Ausstiegsbedingung pro Modus' }
      ]
    },
    en: {
      title: 'Mode System',
      text: 'Five things started, none of them finished. The cards put you in one state at a time and name what that state excludes. Five cards, a few rules, no app — one card and five minutes to start.',
      timeline: [
        { state: 'done', text: 'Written as a set of rules for myself' },
        { state: 'done', text: 'First printed and laminated series' },
        { state: 'now',  text: 'In use daily, guide online, shipping from Etsy' },
        { state: 'next', text: 'Next: colour coding, new icons, an exit condition per mode' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'lifebar',
    status: 'testing',
    featured: true,
    link: 'lifebar.html',
    image: {
      src: 'img/lifebar-device.jpg',
      w: 2000, h: 1198,
      alt: {
        de: 'Die LifeBar auf dem Schreibtisch, Lockscreen mit Uhrzeit, Level und EXP',
        en: 'The LifeBar on a desk, lock screen showing time, level and EXP'
      }
    },
    actions: [
      { href: 'lifebar.html', primary: true, label: { de: 'Doku lesen', en: 'Read the documentation' } }
    ],
    de: {
      title: 'LifeBar',
      text: 'Am Sonntag weißt du nicht, wo die Woche hin ist. Ein ESP32-S3-Balkendisplay, das investierte Minuten in EXP, Level und verdiente Titel verwandelt. Es steht auf dem Schreibtisch und lässt sich nicht wegwischen. Alle Daten bleiben auf dem Gerät.',
      timeline: [
        { state: 'done', text: 'Idee: eine Ressourcenleiste wie im Strategiespiel' },
        { state: 'done', text: 'Erstes Board, gedrucktes Gehäuse, Firmware läuft' },
        { state: 'now',  text: 'Läuft auf meinem eigenen Schreibtisch — Level 14 und weiter' },
        { state: 'next', text: 'Als Nächstes: Firmware veröffentlicht, Bauanleitung, Teileliste' }
      ]
    },
    en: {
      title: 'LifeBar',
      text: 'By Sunday you have no idea where the week went. An ESP32-S3 bar display that turns invested minutes into EXP, levels and earned titles. It sits on the desk and can’t be swiped away. All data stays on the device.',
      timeline: [
        { state: 'done', text: 'Idea: a resource bar like in a strategy game' },
        { state: 'done', text: 'First board, printed case, firmware running' },
        { state: 'now',  text: 'Running on my own desk — level 14 and counting' },
        { state: 'next', text: 'Next: firmware published, build guide, parts list' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'proof',
    status: 'design',
    featured: true,
    link: 'proof.html',
    actions: [
      { href: 'proof.html', primary: true, label: { de: 'Mehr lesen', en: 'Read more' } }
    ],
    de: {
      title: 'Proof',
      text: 'Sieh deinen Tag, wie er wirklich war. Ein Token pro Sache, die passiert ist — kein Tracking, kein Druck, kein Schönreden.',
      timeline: [
        { state: 'done', text: 'Konzept und Regeln aufgeschrieben' },
        { state: 'now',  text: 'Die physische Form eines Tokens wird ausgearbeitet' },
        { state: 'next', text: 'Als Nächstes: ein erstes Set zum Testen' }
      ]
    },
    en: {
      title: 'Proof',
      text: 'See your day as it actually was. One token per thing that happened — no tracking, no pressure, no pretending.',
      timeline: [
        { state: 'done', text: 'Concept and rules written down' },
        { state: 'now',  text: 'Working out the physical form of a token' },
        { state: 'next', text: 'Next: a first set to test with' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'room-bot',
    status: 'sketch',
    featured: false,
    image: {
      src: 'img/roombot-sketch.jpg',
      w: 1500, h: 1000,
      alt: {
        de: 'Notizbuchskizze des Room Bot: ein kastenförmiges Gerät mit animiertem Gesicht, beschriftet mit Kamera, Live-Daten und Konversation',
        en: 'Notebook sketch of the Room Bot: a boxy device with an animated face, labelled camera, live data and conversation'
      }
    },
    de: {
      title: 'Room Bot',
      text: 'Ein kleines Tischwesen, das seine Stimmung aus dem Raum bezieht, in dem es steht — Helligkeit, Farbtemperatur, Tageszeit — und sie über ein animiertes Gesicht zeigt. Bisher zwei Seiten im Notizbuch.',
      timeline: [
        { state: 'now',  text: 'Skizziert: Sensorik, Gesicht, was die Stimmung treibt' },
        { state: 'next', text: 'Als Nächstes: Licht- und Farbwerte auf ein Display bringen' }
      ]
    },
    en: {
      title: 'Room Bot',
      text: 'A small desk creature that takes its mood from the room it stands in — brightness, colour temperature, time of day — and shows it on an animated face. Two pages in a notebook so far.',
      timeline: [
        { state: 'now',  text: 'Sketched: sensors, face, what drives the mood' },
        { state: 'next', text: 'Next: get light and colour readings onto a display' }
      ]
    }
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'open',
    status: 'open',
    featured: false,
    actions: [
      {
        href: 'https://docs.google.com/forms/d/e/1FAIpQLScWkpiObt9dsZZTg1nW82hWRVyb8-oSdZoOqfZSrBDZrqmtzw/viewform',
        label: { de: 'Kontakt aufnehmen', en: 'Get in touch' }
      }
    ],
    de: {
      title: 'Was als Nächstes kommt',
      text: 'Auf dem Tisch liegt immer etwas, das hier noch nicht steht. Wenn du eine frühe Version von irgendwas hier ausprobieren willst, oder eine Idee hast, die du lieber gebaut als behalten siehst: melde dich.'
    },
    en: {
      title: 'Whatever comes next',
      text: 'There is always something on the desk that isn’t here yet. If you want to try an early version of any of this, or you have an idea you’d rather see built than keep, get in touch.'
    }
  }

];
