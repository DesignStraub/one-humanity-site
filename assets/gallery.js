/* ==========================================================================
   gallery.js — the walkable 3D gallery on the start page.

   Five rooms around a foyer: Robotics (main hall with the Yusu head),
   Games, Workshop (tools + 3D design) and Art. The exhibits come from the
   same data as the rest of the site:
     assets/projects.data.js  → projects, Yusu stages and current state
     assets/artworks.data.js  → pictures in the art room
   so a new project or artwork shows up here without touching this file.

   The building floats in space: open rooms under a starry sky with one
   planet. On the welcome card you choose a room and are beamed in – a short
   flight, a flash, and a look at your own (holographic) hands.

   Moving: drag to look, click/tap the floor to walk there, click a picture
   or object for its info panel, WASD/arrows to walk (Shift runs), space to
   jump, room bar at the top to beam between rooms.
   ========================================================================== */
import * as THREE from './vendor/three.module.min.js';
import WORLD_HEART from './models/world-heart.js?v=20261126i';

const PROJECTS = window.OH_PROJECTS || [];
const ARTWORKS = window.OH_ARTWORKS || [];
const ART_PROFILE = window.OH_ARTWORKS_PROFILE || 'https://www.instagram.com/marcelloswigswag/';
const R = window.OH_RENDER;

const projectById = (id) => PROJECTS.find((p) => p.id === id);
const projectsIn = (group) => PROJECTS.filter((p) => p.group === group);
const lang = () => (document.documentElement.lang === 'de' ? 'de' : 'en');
const pick = (v) => (v && typeof v === 'object' ? v[lang()] || v.en || v.de || '' : v || '');
const esc = (v) => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, sans-serif';
const EYE = 1.6;          // eye height in metres
const WALL = 0.2;         // wall thickness
const DOOR_W = 3.2;
const DOOR_H = 3.2;
const MAX_TEX = coarse ? 768 : 1280;

const LINKS = {
  youtube: 'https://www.youtube.com/@marcelloswigswag',
  instagram: 'https://www.instagram.com/marcelloswigswag/',
  github: 'https://github.com/DesignStraub',
  makerworld: 'https://makerworld.com/@MarcelloStr',
  itch: 'https://onehumanity.itch.io',
  stickers: 'https://docs.google.com/forms/d/e/1FAIpQLScWkpiObt9dsZZTg1nW82hWRVyb8-oSdZoOqfZSrBDZrqmtzw/viewform',
  etsy: 'https://oneplanetonehumanity.etsy.com'
};

/* Words that appear inside the 3D rooms and in the panels. */
const TEXT = {
  de: {
    foyer: 'Foyer', robotics: 'Robotics', games: 'Games', werkstatt: 'Werkstatt', kunst: 'Kunst', apps: 'Apps',
    appsTitle: 'Online ausprobieren', appsNote: 'Läuft im Browser – ohne Konto, ohne Installation.', appOpen: 'Jetzt öffnen ↗',
    werkstattSub: 'Tools & 3D-Design', kunstSub: 'Art · @marcelloswigswag', roboticsSub: 'Hauptraum · Yusu',
    gamesSub: 'Dahinter: Kunst',
    appsSub: 'Im Browser ausprobieren',
    welcomeLead: 'Ein unabhängiges Lab aus Aachen. Wir bauen Roboter, entwickeln Spiele und Werkzeuge, gestalten 3D-Modelle und machen Kunst. Verschiedene Projekte, eine Haltung.',
    values: 'Wofür wir stehen',
    v1: 'Offen', v1t: 'Code, Dateien und Anleitungen werden veröffentlicht, wo immer es geht.',
    v2: 'Lokal', v2t: 'Kein Account, keine Cloud – Geräte und Werkzeuge funktionieren für sich.',
    v3: 'Menschlich', v3t: 'Für Menschen gemacht, nicht für Kennzahlen.',
    aboutKicker: 'Wer dahinter steckt', aboutTitle: 'Hi, ich bin Marcello.',
    aboutText: 'Gründer von OneHumanity Labs – im Netz meist als MarcelloSwigswag unterwegs. Von Beruf Software-Entwickler, gelernter Handwerker, deshalb arbeite ich gern mit Code und mit den Händen. Bisher ist das Lab nur ich; künftig sollen hier auch weitere Menschen mitbauen.',
    join: 'Mitmachen', joinTitle: 'Zuschauen, spielen, nachbauen.',
    joinText: 'Videos zu den Projekten, offene Dateien und offener Code, kostenlose Spiele – und freie Sticker für gute Orte.',
    map: 'Lageplan', mapHint: 'Raum anklicken zum Hingehen',
    pastTitle: 'So ist Yusu entstanden', nowTitle: 'Aktueller Stand',
    designTitle: '3D-Design', designSub: 'Druckdateien auf MakerWorld',
    planTitle: 'Etappen', planDone: '{n} von {m} geschafft', openMore: coarse ? 'Antippen für mehr →' : 'Klicken für mehr →',
    toolsTitle: 'Tools', benchTitle: 'Auf der Werkbank', workshopTitle: 'Die Werkstatt',
    workshopText: '3D-Druck, Elektronik, Lötstation, CAD und ein Schreibtisch für Code – alles für die erste Version eines Projekts steht in einem Raum in Aachen.',
    artSoon: 'Artworks folgen', comingSoon: 'Bald hier', artDoorText: 'Bis dahin findest du alle Bilder auf Instagram.', artSoonText: 'Bis dahin alles auf Instagram unter @marcelloswigswag.',
    artWall: 'Bilder, Zeichnungen, Experimente.',
    itchSign: 'Alle Spiele auf itch.io',
    allStages: 'Alle Etappen auf der Projektseite →', toProject: '← Zurück zu Yusu',
    onInstagram: 'Auf Instagram ansehen', clickHint: 'Anklicken für mehr',
    renderCaption: 'Der erste Entwurf als Render',
    hintMouse: 'Klicken, dann mit der Maus umsehen · WASD zum Laufen · Leertaste zum Springen',
    hintDrag: 'Ziehen zum Umsehen · Boden anklicken zum Hingehen · WASD zum Laufen · Leertaste zum Springen',
    hintLook: 'Maus bewegen zum Umsehen · Klick öffnet, was im Fadenkreuz ist · WASD zum Laufen · Esc gibt die Maus frei',
    hintRelock: 'Ins Bild klicken, um wieder mit der Maus zu schauen',
    beamPrep: 'Gleich geht’s los – der Beam wird vorbereitet …',
    greet1: 'Hallo! Schön, dass du da bist.',
    greet2: 'Mein Kopf läuft schon – gerade lerne ich neue Sachen dazu. Schau dich um!',
    hintTouch: 'Stick links zum Laufen · wischen zum Umsehen · Bild antippen für mehr',
    ready: 'Bereit.', loading: 'Galerie wird geladen …',
    noWebgl: 'Dein Browser kann die 3D-Galerie leider nicht anzeigen – die Übersicht funktioniert überall.',
    ytHint: 'Walkthroughs und Fortschritte zu Robotern, Spielen und allem anderen auf der Werkbank.',
    igHint: 'Artworks, Skizzen und Einblicke in die Werkstatt.',
    ghHint: 'Spiele, Firmware, CAD und Platinen.',
    mwHint: 'Druckdateien zu allem aus dem Bereich 3D-Design.',
    itchHint: 'Kostenlos herunterladen und spielen.',
    stickerHint: 'Limitierte kostenlose Sets – Druck und Versand übernehmen wir.',
    etsyHint: 'Sticker, Lesezeichen und fertige Stücke. Jeder Kauf fließt ins nächste Projekt.',
    ytLabel: 'One Humanity Lab auf YouTube', igLabel: '@marcelloswigswag auf Instagram',
    ghLabel: 'Code & Dateien auf GitHub', mwLabel: '3D-Modelle auf MakerWorld', itchLabel: 'Spiele auf itch.io',
    stickerLabel: 'Kostenloses Sticker-Set anfragen', etsyLabel: 'Zum Shop'
  },
  en: {
    foyer: 'Foyer', robotics: 'Robotics', games: 'Games', werkstatt: 'Workshop', kunst: 'Art', apps: 'Apps',
    appsTitle: 'Try it online', appsNote: 'Runs in the browser – no account, nothing to install.', appOpen: 'Open now ↗',
    werkstattSub: 'Tools & 3D design', kunstSub: 'Art · @marcelloswigswag', roboticsSub: 'Main hall · Yusu',
    gamesSub: 'Behind it: art',
    appsSub: 'Try in the browser',
    welcomeLead: 'An independent lab from Aachen. We build robots, make games and tools, design 3D models and make art. Different projects, one attitude.',
    values: 'What we stand for',
    v1: 'Open', v1t: 'Code, files and guides are published wherever possible.',
    v2: 'Local', v2t: 'No account, no cloud – devices and tools work on their own.',
    v3: 'Human', v3t: 'Made for people, not for metrics.',
    aboutKicker: 'Who is behind it', aboutTitle: 'Hi, I’m Marcello.',
    aboutText: 'Founder of OneHumanity Labs – online mostly as MarcelloSwigswag. Software developer by profession and trained craftsman, so I like working with code and with my hands. For now the lab is just me; in the future more people are meant to build here too.',
    join: 'Take part', joinTitle: 'Follow along, play, rebuild.',
    joinText: 'Videos of the projects, open files and code, free games – and free stickers for good places.',
    map: 'Floor plan', mapHint: 'Click a room to walk there',
    pastTitle: 'How Yusu came to be', nowTitle: 'Current state',
    designTitle: '3D design', designSub: 'Print files on MakerWorld',
    planTitle: 'Milestones', planDone: '{n} of {m} done', openMore: coarse ? 'Tap for more →' : 'Click for more →',
    toolsTitle: 'Tools', benchTitle: 'On the workbench', workshopTitle: 'The workshop',
    workshopText: '3D printing, electronics, soldering station, CAD and a desk for code – everything for the first version of a project is in one room in Aachen.',
    artSoon: 'Artworks coming soon', comingSoon: 'Coming soon', artDoorText: 'Until then, all the pictures are on Instagram.', artSoonText: 'Until then, everything is on Instagram as @marcelloswigswag.',
    artWall: 'Pictures, drawings, experiments.',
    itchSign: 'All games on itch.io',
    allStages: 'Every stage on the project page →', toProject: '← Back to Yusu',
    onInstagram: 'View on Instagram', clickHint: 'Click for more',
    renderCaption: 'The first design as a render',
    hintMouse: 'Click, then look around with the mouse · WASD to move · space to jump',
    hintDrag: 'Drag to look around · click the floor to walk there · WASD to move · space to jump',
    hintLook: 'Move the mouse to look around · click opens what is in the crosshair · WASD to move · Esc frees the mouse',
    hintRelock: 'Click the view to look around with the mouse again',
    beamPrep: 'Almost there – preparing the beam …',
    greet1: 'Hi! Nice to have you here.',
    greet2: 'My head already works – and I’m learning new things. Have a look around!',
    hintTouch: 'Stick on the left to walk · swipe to look around · tap a picture for more',
    ready: 'Ready.', loading: 'Loading the gallery …',
    noWebgl: 'Your browser can’t show the 3D gallery – the overview works everywhere.',
    ytHint: 'Walkthroughs and progress on robots, games and everything else on the bench.',
    igHint: 'Artworks, sketches and glimpses of the workshop.',
    ghHint: 'Games, firmware, CAD and circuit boards.',
    mwHint: 'Print files for everything from the 3D design section.',
    itchHint: 'Download and play for free.',
    stickerHint: 'Limited free sets – we cover printing and shipping.',
    etsyHint: 'Stickers, bookmarks and finished pieces. Every purchase goes into the next project.',
    ytLabel: 'One Humanity Lab on YouTube', igLabel: '@marcelloswigswag on Instagram',
    ghLabel: 'Code & files on GitHub', mwLabel: '3D models on MakerWorld', itchLabel: 'Games on itch.io',
    stickerLabel: 'Request a free sticker set', etsyLabel: 'Visit the shop'
  }
};
const t = (key) => TEXT[lang()][key] ?? TEXT.en[key] ?? key;

/* --------------------------------------------------------------------------
   Floor plan. Rooms sit 1.2 m apart and are joined by short passages, so no
   two walls ever share a plane. x → east, z → south, y → up.
   -------------------------------------------------------------------------- */
const GAP = 0.4; // between the foyer and each room: a short bridge
const ROOMS = {
  foyer:     { x: 0,     z: 0,     w: 14, d: 12, h: 4.6, accent: 0xf3d7a2, wall: 0x0b1020, floor: 0x121b36,
               doors: ['n', 'e', 's', 'w'] },
  robotics:  { x: 0,     z: -(6 + GAP + 11), w: 20, d: 22, h: 6.5, accent: 0x8fd8ff, wall: 0x091022, floor: 0x0f1a36,
               doors: ['s'] },
  games:     { x: 7 + GAP + 7, z: 0,     w: 14, d: 12, h: 4.6, accent: 0xff6fb0, wall: 0x120c26, floor: 0x1a1334,
               doors: ['w', 'e'] },
  // west of the foyer: apps you can open right away in the browser
  apps:      { x: -(7 + GAP + 7), z: 0,     w: 14, d: 12, h: 5.2, accent: 0x6dffc4, wall: 0x07141a, floor: 0x0c2128,
               doors: ['e'] },
  // behind the games: art
  kunst:     { x: 7 + GAP + 14 + GAP + 7, z: 0, w: 14, d: 12, h: 5.2, accent: 0xbca2ff, wall: 0x0f0c22, floor: 0x171330,
               doors: ['w'] },
  werkstatt: { x: 0,     z: 6 + GAP + 7,  w: 16, d: 14, h: 4.6, accent: 0xffbb73, wall: 0x13111a, floor: 0x1e1820,
               doors: ['n'] }
};
const ROOM_ORDER = ['foyer', 'robotics', 'games', 'apps', 'werkstatt', 'kunst'];

/* Where each side room meets the room before it (the foyer, unless `from`
   says otherwise): a point just inside the room and one just inside the
   room before (`inFoyer`). Paths between rooms run through these. */
const PASSAGES = {
  robotics:  { side: 'n', inRoom: new THREE.Vector3(0, EYE, -(6 + GAP + 1.4)), inFoyer: new THREE.Vector3(0, EYE, -4.8) },
  games:     { side: 'e', inRoom: new THREE.Vector3(7 + GAP + 1.4, EYE, 0),   inFoyer: new THREE.Vector3(5.8, EYE, 0) },
  apps:      { side: 'w', inRoom: new THREE.Vector3(-(7 + GAP + 1.4), EYE, 0), inFoyer: new THREE.Vector3(-5.8, EYE, 0) },
  werkstatt: { side: 's', inRoom: new THREE.Vector3(0, EYE, 6 + GAP + 1.4),   inFoyer: new THREE.Vector3(0, EYE, 4.8) },
  kunst:     { side: 'e', from: 'games', inRoom: new THREE.Vector3(7 + GAP + 14 + GAP + 1.4, EYE, 0), inFoyer: new THREE.Vector3(7 + GAP + 14 - 1.4, EYE, 0) }
};
const parentOf = (id) => (PASSAGES[id] && PASSAGES[id].from) || 'foyer';
const chainOf = (id) => { const c = [id]; while (c[c.length - 1] !== 'foyer') c.push(parentOf(c[c.length - 1])); return c; };

/* First view of each room (room bar, links like index.html#games). */
const ENTRY = {
  foyer:     { pos: [0, EYE, 4.2],    look: [0, 1.7, -14] },
  robotics:  { pos: [0, EYE, -(6 + GAP + 4)],   look: [0, 1.7, -(6 + GAP + 12.3)] },
  games:     { pos: [7 + GAP + 1.6, EYE, 0],    look: [7 + GAP + 14, 1.6, 0] },
  werkstatt: { pos: [0, EYE, 6 + GAP + 2.2],    look: [0, 1.6, 6 + GAP + 14] },
  apps:      { pos: [-(7 + GAP + 1.6), EYE, 0], look: [-(7 + GAP + 14), 2.0, 0] },
  kunst:     { pos: [7 + GAP + 14 + GAP + 1.6, EYE, 0], look: [7 + GAP + 14 + GAP + 14, 2.0, 0] }
};

/* Until there are artworks, the art room stays closed: its door at the
   back of the games room points to Instagram instead. */
const ART_OPEN = ARTWORKS.length > 0;
if (!ART_OPEN) ENTRY.kunst = { pos: [ROOMS.games.x + 1.6, EYE, 0], look: [ROOMS.games.x + 7, 2.2, 0] };

/* --------------------------------------------------------------------------
   DOM
   -------------------------------------------------------------------------- */
const stage = document.querySelector('[data-stage]');
const intro = document.querySelector('[data-intro]');
const choiceButtons = document.querySelectorAll('[data-choice]');
const statusEl = document.querySelector('[data-status]');
const panel = document.querySelector('[data-panel]');
const panelBody = document.querySelector('[data-panel-body]');
const toastEl = document.querySelector('[data-toast]');
const roomButtons = document.querySelectorAll('[data-room]');

/* --------------------------------------------------------------------------
   Renderer, scene, camera
   -------------------------------------------------------------------------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  renderer = null;
}
if (!renderer) {
  statusEl.textContent = t('noWebgl');
  choiceButtons.forEach((b) => { if (b.tagName === 'A') b.href = 'uebersicht.html'; else b.addEventListener('click', () => { location.href = 'uebersicht.html'; }); });
  throw new Error('WebGL not available');
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03050c);
scene.fog = new THREE.FogExp2(0x02040d, 0.012);
const camera = new THREE.PerspectiveCamera(coarse ? 70 : 62, window.innerWidth / window.innerHeight, 0.05, 400);
scene.add(camera); // the hands for the arrival hang on the camera

/* Where the welcome card floats: outside, south of the building, looking
   past the rooms at the planet. */
const ORBIT = { pos: new THREE.Vector3(0, 15, 42), look: new THREE.Vector3(0, 16.5, -14) };

const state = {
  pos: new THREE.Vector3(...ENTRY.foyer.pos),
  yaw: 0,
  pitch: -0.02,
  started: false,      // you can walk
  arriving: null,      // the arrival scene while it plays
  room: null,
  glide: null,
  keys: new Set(),
  stick: { x: 0, y: 0 }, // touch joystick, -1..1
  shake: 0,
  hovered: null,
  viewShift: 0,
  viewShiftY: 0,
  jumpY: 0,
  jumpV: 0,
  bob: 0,
  vel: new THREE.Vector3(),
  fovKick: 0,
  flash: 0,
  flashTarget: 0,
  light: 1,
  lightTarget: 1
};

/* Lights: a cool night light from the sky, the sun far away, a coloured
   glow in every room. */
const SUN_DIR = new THREE.Vector3(1, 0.32, 0.18).normalize();
const hemi = new THREE.HemisphereLight(0x5f74d0, 0x0a0c24, 0.8);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1de, 0.7);
sun.position.copy(SUN_DIR).multiplyScalar(30);
scene.add(sun);
const lamps = [];
for (const id of ROOM_ORDER) {
  const r = ROOMS[id];
  const lamp = new THREE.PointLight(r.accent, id === 'robotics' ? 30 : 16, 0, 1.6);
  lamp.position.set(r.x, r.h - 0.6, r.z);
  lamp.userData.full = lamp.intensity;
  scene.add(lamp);
  lamps.push(lamp);
}
hemi.userData.full = hemi.intensity;

/* --------------------------------------------------------------------------
   Collections used for picking and walking
   -------------------------------------------------------------------------- */
const floors = [];        // meshes you can click to walk to
const blockers = [];      // walls: stop clicks from going through
const pickables = [];     // exhibit meshes
const exhibits = [];      // { id, root, meshes, center, normal, view, room, open, onPick }
const walkRects = [];     // [minX, maxX, minZ, maxZ]
const obstacles = [];     // { x, z, r } circles
const labels = [];        // canvas textures that depend on the language
const animated = [];      // per-frame callbacks (dt, time)

/* --------------------------------------------------------------------------
   Canvas helpers: text boards, plaques, procedural floors
   -------------------------------------------------------------------------- */
const HEART = new Path2D('M20 28c0-5.5 4.5-10 10-10 3.1 0 6 1.5 7.9 4 1.9-2.5 4.8-4 7.9-4 5.5 0 10 4.5 10 10 0 11.8-18.1 19.4-18.1 19.4S20 39.8 20 28z');

function drawHeart(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 36, size / 36);
  ctx.translate(-20, -16);
  ctx.fillStyle = color;
  ctx.fill(HEART);
  ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
  const words = String(text).split(/\s+/);
  let line = '';
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      if (lines === maxLines - 1) { ctx.fillText(line + ' …', x, y); return y + lineHeight; }
      ctx.fillText(line, x, y);
      line = words[i];
      y += lineHeight;
      lines++;
    } else {
      line = test;
    }
  }
  if (line) { ctx.fillText(line, x, y); y += lineHeight; }
  return y;
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function canvasTexture(canvas, repeat) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
}

/* A flat board whose texture is painted by `paint(ctx, w, h)`. It is painted
   again when the language changes. */
function board(width, height, paint, { px = 1024, transparent = false } = {}) {
  const cw = px;
  const ch = Math.round(px * height / width);
  const material = new THREE.MeshBasicMaterial({ transparent, toneMapped: false });
  const repaint = () => {
    const c = makeCanvas(cw, ch);
    const ctx = c.getContext('2d');
    ctx.textBaseline = 'top';
    paint(ctx, cw, ch);
    if (material.map) material.map.dispose();
    material.map = canvasTexture(c);
    material.needsUpdate = true;
  };
  repaint();
  labels.push(repaint);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.userData.size = [width, height];
  return mesh;
}

/* Seeded random numbers, so every visit looks the same. */
function rng(seed) {
  let x = seed >>> 0 || 1;
  return () => { x = Math.imul(x ^ (x >>> 15), 2246822519) + 0x9e3779b9 >>> 0; x ^= x >>> 13; return (x >>> 0) / 4294967296; };
}
const css = (hex, a = 1) => {
  const c = new THREE.Color(hex);
  return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;
};

/* Dark polished floor with a faint grid in the room colour and a few
   specks, as if the floor were a slice of night sky. */
function floorTexture(color, accent) {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d');
  ctx.fillStyle = css(color);
  ctx.fillRect(0, 0, 512, 512);
  const rnd = rng(11);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.04 + rnd() * 0.22})`;
    const s = rnd() < 0.9 ? 1 : 2;
    ctx.fillRect(rnd() * 512, rnd() * 512, s, s);
  }
  ctx.strokeStyle = css(accent, 0.16);
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 510, 510);
  ctx.strokeStyle = css(accent, 0.06);
  ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 512); ctx.moveTo(0, 256); ctx.lineTo(512, 256); ctx.stroke();
  return c;
}

/* Stars and faint constellations for the walls (used as glow map). */
function wallStarsTexture() {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 512, 512);
  const rnd = rng(5);
  const pts = [];
  for (let i = 0; i < 150; i++) {
    const x = rnd() * 512;
    const y = rnd() * 512;
    const b = rnd();
    pts.push([x, y]);
    ctx.fillStyle = `rgba(255,255,255,${0.15 + b * 0.75})`;
    ctx.beginPath();
    ctx.arc(x, y, b > 0.93 ? 1.9 : b > 0.7 ? 1.2 : 0.7, 0, Math.PI * 2);
    ctx.fill();
    if (b > 0.97) {
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.fillRect(x - 7, y - 0.5, 14, 1);
      ctx.fillRect(x - 0.5, y - 7, 1, 14);
    }
  }
  // a few constellations: short chains between neighbouring stars
  ctx.strokeStyle = 'rgba(255,255,255,.13)';
  ctx.lineWidth = 1;
  for (let k = 0; k < 6; k++) {
    let [x, y] = pts[Math.floor(rnd() * pts.length)];
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let j = 0; j < 4; j++) {
      const near = pts.filter(([a, b]) => Math.hypot(a - x, b - y) > 25 && Math.hypot(a - x, b - y) < 75 && a > 8 && a < 504 && b > 8 && b < 504);
      if (!near.length) break;
      [x, y] = near[Math.floor(rnd() * near.length)];
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return c;
}
const WALL_STARS = wallStarsTexture();

function glowTexture() {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 110, 4, 128, 120, 128);
  g.addColorStop(0, 'rgba(225,238,255,0.9)');
  g.addColorStop(0.45, 'rgba(190,215,255,0.3)');
  g.addColorStop(1, 'rgba(190,215,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return canvasTexture(c);
}
/* Round soft dot for glowing orbs and sparkles. */
function dotTexture() {
  const c = makeCanvas(128, 128);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, 'rgba(255,255,255,.75)');
  g.addColorStop(0.5, 'rgba(255,255,255,.16)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return canvasTexture(c);
}
const DOT = dotTexture();
const GLOW = glowTexture();

/* --------------------------------------------------------------------------
   Images and videos: resized on a canvas so big photos stay light on phones
   -------------------------------------------------------------------------- */
const textures = new Map();
let pendingImages = 0;

function imageTexture(src, w, h) {
  if (textures.has(src)) return textures.get(src);
  const tex = new THREE.Texture();
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textures.set(src, tex);
  pendingImages++;
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    const iw = img.naturalWidth || w || 1024;
    const ih = img.naturalHeight || h || 768;
    const s = Math.min(1, MAX_TEX / Math.max(iw, ih));
    const c = makeCanvas(Math.max(1, Math.round(iw * s)), Math.max(1, Math.round(ih * s)));
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    tex.image = c;
    tex.needsUpdate = true;
    pendingImages--;
  };
  img.onerror = () => { pendingImages--; };
  img.src = src;
  return tex;
}

const videos = [];
function videoTexture(item) {
  const video = document.createElement('video');
  video.src = item.video;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  const tex = new THREE.VideoTexture(video);
  tex.colorSpace = THREE.SRGBColorSpace;
  const poster = imageTexture(item.poster, item.w, item.h);
  const entry = { video, tex, poster, material: null, room: null };
  video.addEventListener('playing', () => { if (entry.material) { entry.material.map = tex; entry.material.needsUpdate = true; } });
  videos.push(entry);
  return entry;
}

/* --------------------------------------------------------------------------
   Building blocks
   -------------------------------------------------------------------------- */
const MAT = {
  frameDark: new THREE.MeshStandardMaterial({ color: 0x1b1e23, roughness: 0.5 }),
  frameWood: new THREE.MeshStandardMaterial({ color: 0x6f4e30, roughness: 0.7 }),
  frameLight: new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.6 }),
  screen: new THREE.MeshStandardMaterial({ color: 0x0c0f14, roughness: 0.35, metalness: 0.2 }),
  plinth: new THREE.MeshStandardMaterial({ color: 0x1f242b, roughness: 0.55 }),
  plinthLight: new THREE.MeshStandardMaterial({ color: 0xf1eee8, roughness: 0.7 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x6b4c34, roughness: 0.6 }),
  trim: new THREE.MeshStandardMaterial({ color: 0x0e1322, roughness: 0.35, metalness: 0.5 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x0d1530, roughness: 0.2, metalness: 0.3, transparent: true, opacity: 0.6 })
};

function box(w, h, d, material) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}

/* Side of a room → where its inner wall face is and which way it faces. */
function wallSpot(roomId, side, along, y, out = 0.03) {
  const r = ROOMS[roomId];
  const inset = WALL + out;
  switch (side) {
    case 'n': return { pos: new THREE.Vector3(r.x + along, y, r.z - r.d / 2 + inset), rotY: 0, normal: new THREE.Vector3(0, 0, 1) };
    case 's': return { pos: new THREE.Vector3(r.x - along, y, r.z + r.d / 2 - inset), rotY: Math.PI, normal: new THREE.Vector3(0, 0, -1) };
    case 'w': return { pos: new THREE.Vector3(r.x - r.w / 2 + inset, y, r.z - along), rotY: Math.PI / 2, normal: new THREE.Vector3(1, 0, 0) };
    default:  return { pos: new THREE.Vector3(r.x + r.w / 2 - inset, y, r.z + along), rotY: -Math.PI / 2, normal: new THREE.Vector3(-1, 0, 0) };
  }
}

function place(object, spot) {
  object.position.copy(spot.pos);
  object.rotation.y = spot.rotY;
  scene.add(object);
  return object;
}

/* Glowing line material per colour, shared. */
const lineMats = new Map();
function glowMat(color, opacity = 1) {
  const key = color + ':' + opacity;
  if (!lineMats.has(key)) {
    lineMats.set(key, new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false, fog: false }));
  }
  return lineMats.get(key);
}

/* A room: polished floor, starry walls with glowing edges, no ceiling –
   the sky is the roof, and through the glass floor you see stars below:
   every room is a module floating in space. */
/* A glowing ring in the floor with the room's sign, like the heart in the
   foyer: each room gets one in its own colour. */
function floorEmblem(roomId, x, z, icon, size = 3.0) {
  const c = ROOMS[roomId].accent;
  const inlay = board(size, size, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, css(c, 0.26));
    g.addColorStop(0.7, css(c, 0.07));
    g.addColorStop(1, css(c, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = css(c, 0.75);
    ctx.lineWidth = w * 0.008;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = w * 0.003;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.37, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.cos(a) * w * 0.375, h / 2 + Math.sin(a) * w * 0.375);
      ctx.lineTo(w / 2 + Math.cos(a) * w * (i % 6 ? 0.4 : 0.415), h / 2 + Math.sin(a) * w * (i % 6 ? 0.4 : 0.415));
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.fillStyle = css(c, 0.85);
    ctx.strokeStyle = css(c, 0.85);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    icon(ctx, w * 0.3);
    ctx.restore();
  }, { px: 768, transparent: true });
  inlay.material.blending = THREE.AdditiveBlending;
  inlay.material.depthWrite = false;
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.set(x, 0.006, z);
  scene.add(inlay);
  return inlay;
}
const roundRectPath = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};
const EMBLEMS = {
  // Yusu's face: a rounded screen with two eyes
  robotics: (ctx, s) => {
    ctx.lineWidth = s * 0.07;
    roundRectPath(ctx, -s * 0.5, -s * 0.36, s, s * 0.72, s * 0.2);
    ctx.stroke();
    for (const k of [-1, 1]) { roundRectPath(ctx, k * s * 0.2 - s * 0.07, -s * 0.16, s * 0.14, s * 0.26, s * 0.07); ctx.fill(); }
  },
  // a game pad
  games: (ctx, s) => {
    ctx.lineWidth = s * 0.07;
    roundRectPath(ctx, -s * 0.55, -s * 0.28, s * 1.1, s * 0.56, s * 0.28);
    ctx.stroke();
    ctx.fillRect(-s * 0.36, -s * 0.04, s * 0.22, s * 0.08);
    ctx.fillRect(-s * 0.29, -s * 0.11, s * 0.08, s * 0.22);
    for (const [x, y] of [[0.22, -0.06], [0.34, 0.06]]) { ctx.beginPath(); ctx.arc(x * s, y * s, s * 0.05, 0, Math.PI * 2); ctx.fill(); }
  },
  // a browser window
  apps: (ctx, s) => {
    ctx.lineWidth = s * 0.06;
    roundRectPath(ctx, -s * 0.55, -s * 0.38, s * 1.1, s * 0.76, s * 0.08);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.2); ctx.lineTo(s * 0.55, -s * 0.2); ctx.stroke();
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(-s * 0.44 + k * s * 0.1, -s * 0.29, s * 0.03, 0, Math.PI * 2); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.02); ctx.lineTo(-s * 0.26, s * 0.1); ctx.lineTo(-s * 0.12, s * 0.22);
    ctx.moveTo(s * 0.12, -s * 0.02); ctx.lineTo(s * 0.26, s * 0.1); ctx.lineTo(s * 0.12, s * 0.22); ctx.stroke();
  },
  // a gear
  werkstatt: (ctx, s) => {
    const teeth = 8;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const a0 = (i / (teeth * 2)) * Math.PI * 2;
      const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
      const r = i % 2 ? s * 0.4 : s * 0.5;
      ctx.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
      ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  },
  // the heart, for art
  kunst: (ctx, s) => { drawHeart(ctx, 0, 0, s, ctx.fillStyle); }
};

function buildRoom(id) {
  const r = ROOMS[id];
  const group = new THREE.Group();
  const accent = glowMat(r.accent);
  const accentSoft = glowMat(r.accent, 0.55);

  // a glass floor: you walk on light, the stars go on underneath
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.2, metalness: 0.3, envMapIntensity: 1.2,
    transparent: true, opacity: 0.5, depthWrite: true,
    map: canvasTexture(floorTexture(r.floor, r.accent), [r.w / 4, r.d / 4])
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.d), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(r.x, 0, r.z);
  group.add(floor);
  floors.push(floor);
  // glowing rim around the floor plate
  for (const [w, d, x, z] of [[r.w + 0.06, 0.05, 0, -r.d / 2], [r.w + 0.06, 0.05, 0, r.d / 2],
    [0.05, r.d + 0.06, -r.w / 2, 0], [0.05, r.d + 0.06, r.w / 2, 0]]) {
    const seam = box(w, 0.05, d, accentSoft);
    seam.position.set(r.x + x, -0.03, r.z + z);
    group.add(seam);
  }

  for (const side of ['n', 'e', 's', 'w']) {
    const horizontal = side === 'n' || side === 's';
    const len = horizontal ? r.w : r.d;
    const hasDoor = r.doors.includes(side);
    const pieces = hasDoor
      ? [[-(len + DOOR_W) / 4, (len - DOOR_W) / 2, r.h, r.h / 2], [(len + DOOR_W) / 4, (len - DOOR_W) / 2, r.h, r.h / 2],
         [0, DOOR_W, r.h - DOOR_H, DOOR_H + (r.h - DOOR_H) / 2]]
      : [[0, len, r.h, r.h / 2]];
    const inward = side === 'n' || side === 'w' ? 1 : -1; // towards the room centre
    for (const [offset, l, h, cy] of pieces) {
      const stars = new THREE.CanvasTexture(WALL_STARS);
      stars.wrapS = stars.wrapT = THREE.RepeatWrapping;
      stars.repeat.set(l / 5, h / 5);
      const wallMat = new THREE.MeshStandardMaterial({
        color: r.wall, roughness: 0.85, metalness: 0.1,
        emissive: new THREE.Color(r.accent).lerp(new THREE.Color(0xffffff), 0.55), emissiveMap: stars, emissiveIntensity: 0.85
      });
      const mesh = horizontal ? box(l, h, WALL, wallMat) : box(WALL, h, l, wallMat);
      const cx = horizontal ? r.x + offset : (side === 'w' ? r.x - r.w / 2 + WALL / 2 : r.x + r.w / 2 - WALL / 2);
      const cz = horizontal ? (side === 'n' ? r.z - r.d / 2 + WALL / 2 : r.z + r.d / 2 - WALL / 2) : r.z + offset;
      mesh.position.set(cx, cy, cz);
      group.add(mesh);
      blockers.push(mesh);
      // glowing edge on top of every wall
      const top = horizontal ? box(l, 0.05, WALL + 0.02, accent) : box(WALL + 0.02, 0.05, l, accent);
      top.position.set(cx, cy + h / 2 + 0.025, cz);
      group.add(top);
      if (cy === h / 2) {
        // a thin light line along the floor
        const base = horizontal ? box(l, 0.025, 0.02, accentSoft) : box(0.02, 0.025, l, accentSoft);
        base.position.set(
          horizontal ? cx : cx + inward * (WALL / 2 + 0.012), 0.06,
          horizontal ? cz + inward * (WALL / 2 + 0.012) : cz);
        group.add(base);
      }
    }
    if (hasDoor) {
      // portal frame around the door, on the room side
      const spot = wallSpot(id, side, 0, 0, 0.012);
      const frame = new THREE.Group();
      const th = 0.06;
      for (const s of [-1, 1]) {
        const post = box(th, DOOR_H, 0.02, accent);
        post.position.set(s * (DOOR_W / 2 + th / 2), DOOR_H / 2, 0);
        frame.add(post);
      }
      const lintel = box(DOOR_W + th * 2, th, 0.02, accent);
      lintel.position.set(0, DOOR_H + th / 2, 0);
      frame.add(lintel);
      const haze = new THREE.Mesh(new THREE.PlaneGeometry(DOOR_W + 1.6, DOOR_H + 1.2),
        new THREE.MeshBasicMaterial({ map: GLOW, color: r.accent, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      haze.position.set(0, DOOR_H / 2 + 0.2, -0.005);
      frame.add(haze);
      frame.position.copy(spot.pos);
      frame.rotation.y = spot.rotY;
      group.add(frame);
    }
  }
  scene.add(group);

  const m = WALL + 0.4;
  walkRects.push([r.x - r.w / 2 + m, r.x + r.w / 2 - m, r.z - r.d / 2 + m, r.z + r.d / 2 - m]);
}

/* Short open bridge between the foyer and a room. */
function buildPassage(id) {
  const p = PASSAGES[id];
  const f = ROOMS[parentOf(id)];
  const r = ROOMS[id];
  const cx = f.x; // the passage runs along the parent's centre line
  const cz = f.z;
  const along = p.side === 'n' || p.side === 's';
  const a = along ? (p.side === 'n' ? f.z - f.d / 2 : f.z + f.d / 2) : (p.side === 'e' ? f.x + f.w / 2 : f.x - f.w / 2);
  const b = along ? (p.side === 'n' ? r.z + r.d / 2 : r.z - r.d / 2) : (p.side === 'e' ? r.x - r.w / 2 : r.x + r.w / 2);
  const mid = (a + b) / 2;
  const len = Math.abs(b - a);
  const mat = new THREE.MeshStandardMaterial({ color: 0x141a2a, roughness: 0.7 });
  const light = glowMat(r.accent, 0.8);

  const closed = id === 'kunst' && !ART_OPEN;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(along ? DOOR_W : len, along ? len : DOOR_W), MAT.glass);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(along ? cx : mid, 0.001, along ? mid : cz);
  scene.add(floor);
  if (!closed) floors.push(floor);
  for (const s of [-1, 1]) {
    const side = along ? box(WALL, DOOR_H, len, mat) : box(len, DOOR_H, WALL, mat);
    side.position.set(along ? cx + s * (DOOR_W / 2 + WALL / 2) : mid, DOOR_H / 2, along ? mid : cz + s * (DOOR_W / 2 + WALL / 2));
    scene.add(side);
    blockers.push(side);
    const top = along ? box(WALL + 0.02, 0.04, len, light) : box(len, 0.04, WALL + 0.02, light);
    top.position.set(side.position.x, DOOR_H + 0.02, side.position.z);
    scene.add(top);
    const strip = along ? box(0.03, 0.01, len, light) : box(len, 0.01, 0.03, light);
    strip.position.set(along ? cx + s * (DOOR_W / 2 - 0.12) : mid, 0.006, along ? mid : cz + s * (DOOR_W / 2 - 0.12));
    scene.add(strip);
  }
  const half = DOOR_W / 2 - 0.45;
  const lo = Math.min(a, b) - 1.2;
  const hi = Math.max(a, b) + 1.2;
  if (!closed) walkRects.push(along ? [cx - half, cx + half, lo, hi] : [lo, hi, cz - half, cz + half]);
}

/* A framed picture (or video screen) with an optional plaque under it. */
function framed({ src, w = 4, h = 3, video, maxW = 1.6, maxH = 1.2, style = 'dark', glow = true }) {
  const aspect = w / h;
  let pw = maxW;
  let ph = pw / aspect;
  if (ph > maxH) { ph = maxH; pw = ph * aspect; }
  const border = style === 'screen' ? 0.05 : 0.07;
  const group = new THREE.Group();
  const frameMat = style === 'wood' ? MAT.frameWood : style === 'light' ? MAT.frameLight : style === 'screen' ? MAT.screen : MAT.frameDark;
  const frame = box(pw + border * 2, ph + border * 2, 0.05, frameMat);
  group.add(frame);
  const picMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  let videoEntry = null;
  if (video) {
    videoEntry = videoTexture(video);
    videoEntry.material = picMat;
    picMat.map = videoEntry.poster;
  } else if (src) {
    picMat.map = imageTexture(src, w, h);
  }
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), picMat);
  pic.position.z = 0.027;
  group.add(pic);
  if (glow) {
    const wash = new THREE.Mesh(new THREE.PlaneGeometry(pw * 2.1, ph * 2.2),
      new THREE.MeshBasicMaterial({ map: GLOW, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
    wash.position.set(0, ph * 0.18, -0.02);
    group.add(wash);
  }
  group.userData.size = [pw + border * 2, ph + border * 2];
  return { group, meshes: [frame, pic], videoEntry };
}

function plaque(title, line, { width = 1.0, accent = 0x8fd8ff } = {}) {
  return board(width, width * 0.3, (ctx, w, h) => {
    ctx.fillStyle = '#0d1220';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = css(accent, 0.9);
    ctx.fillRect(0, 0, w * 0.012, h);
    ctx.fillStyle = '#f2f7f8';
    ctx.font = `700 ${Math.round(h * 0.19)}px ${FONT}`;
    const y = wrapText(ctx, pick(title), w * 0.06, h * 0.12, w * 0.88, h * 0.23, 2);
    const sub = typeof line === 'function' ? line() : pick(line);
    if (sub) {
      ctx.fillStyle = 'rgba(242,247,248,.66)';
      ctx.font = `500 ${Math.round(h * 0.15)}px ${FONT}`;
      ctx.fillText(sub, w * 0.06, Math.max(y + h * 0.04, h * 0.42), w * 0.88);
    }
  }, { px: 640 });
}

/* Registers something clickable. `view` is where the camera goes. */
function addExhibit({ id, root, meshes, room, open, viewDist, onPick }) {
  root.updateMatrixWorld(true);
  const center = new THREE.Vector3();
  new THREE.Box3().setFromObject(meshes[0]).getCenter(center);
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(root.getWorldQuaternion(new THREE.Quaternion()));
  normal.y = 0;
  normal.normalize();
  const size = root.userData.size || [1.2, 1.2];
  const dist = viewDist || viewDistanceFor(size[0], size[1]);
  const ex = { id, root, meshes, room, center, normal, open, onPick, dist, fixedDist: !!viewDist };
  meshes.forEach((m) => { m.userData.exhibit = ex; pickables.push(m); });
  exhibits.push(ex);
  return ex;
}

function viewDistanceFor(w, h) {
  const vfov = THREE.MathUtils.degToRad(camera.fov);
  const aspect = window.innerWidth / window.innerHeight;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
  const byH = (h * 1.35 / 2) / Math.tan(vfov / 2);
  const byW = (w * 1.25 / 2) / Math.tan(hfov / 2);
  return Math.max(1.5, byH, byW);
}

/* --------------------------------------------------------------------------
   Foyer: welcome, values, about, how to take part, floor plan
   -------------------------------------------------------------------------- */
function buildFoyer() {
  const gold = ROOMS.foyer.accent;
  // welcome board left of the Robotics door
  const welcome = board(4.6, 2.7, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#111a33');
    g.addColorStop(1, '#0a0f1e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = css(gold, 0.45);
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    drawHeart(ctx, w * 0.1, h * 0.2, h * 0.2, '#f6e7c8');
    ctx.fillStyle = '#f2f7f8';
    ctx.font = `800 ${Math.round(h * 0.13)}px ${FONT}`;
    ctx.fillText('OneHumanity Labs', w * 0.06, h * 0.34, w * 0.9);
    ctx.fillStyle = css(gold, 0.85);
    ctx.font = `700 ${Math.round(h * 0.045)}px ${FONT}`;
    ctx.fillText('ONE PLANET, ONE HUMANITY', w * 0.06, h * 0.51);
    ctx.fillStyle = 'rgba(242,247,248,.86)';
    ctx.font = `400 ${Math.round(h * 0.05)}px ${FONT}`;
    wrapText(ctx, t('welcomeLead'), w * 0.06, h * 0.62, w * 0.86, h * 0.07);
  }, { px: 1600 });
  place(welcome, wallSpot('foyer', 'n', -4.15, 2.15));
  addExhibit({ id: 'welcome', root: welcome, meshes: [welcome], room: 'foyer', open: () => openText('welcome') });

  // values right of the door
  const values = board(4.2, 2.7, (ctx, w, h) => {
    ctx.fillStyle = '#0c1222';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = css(gold, 0.3);
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.fillStyle = css(gold, 0.85);
    ctx.font = `700 ${Math.round(h * 0.05)}px ${FONT}`;
    ctx.fillText(t('values').toUpperCase(), w * 0.07, h * 0.09);
    [['v1', 'v1t'], ['v2', 'v2t'], ['v3', 'v3t']].forEach(([a, b], i) => {
      const y = h * (0.22 + i * 0.25);
      ctx.fillStyle = '#f2f7f8';
      ctx.font = `800 ${Math.round(h * 0.085)}px ${FONT}`;
      ctx.fillText(t(a), w * 0.07, y);
      ctx.fillStyle = 'rgba(242,247,248,.7)';
      ctx.font = `400 ${Math.round(h * 0.045)}px ${FONT}`;
      wrapText(ctx, t(b), w * 0.07, y + h * 0.11, w * 0.86, h * 0.055, 2);
    });
  }, { px: 1400 });
  place(values, wallSpot('foyer', 'n', 4.3, 2.15));
  addExhibit({ id: 'values', root: values, meshes: [values], room: 'foyer', open: () => openText('values') });

  // glowing signs above the doors, in the colour of the room behind
  const signs = [
    ['n', 'robotics', 'roboticsSub'], ['e', 'games', 'gamesSub'], ['s', 'werkstatt', 'werkstattSub'], ['w', 'apps', 'appsSub']
  ];
  for (const [side, key, sub] of signs) {
    const color = ROOMS[key].accent;
    const sign = board(3.0, 0.78, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.shadowColor = css(color, 1);
      ctx.shadowBlur = h * 0.18;
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${Math.round(h * 0.44)}px ${FONT}`;
      ctx.fillText(t(key), w / 2, h * 0.04, w * 0.96);
      ctx.shadowBlur = 0;
      ctx.fillStyle = css(color, 0.9);
      ctx.font = `600 ${Math.round(h * 0.2)}px ${FONT}`;
      ctx.fillText(t(sub), w / 2, h * 0.62, w * 0.96);
    }, { px: 1024, transparent: true });
    place(sign, wallSpot('foyer', side, 0, DOOR_H + 0.66));
  }

  // about: west wall, north part
  const about = framed({ src: 'img/marcello.jpg', w: 1500, h: 1000, maxW: 2.0, maxH: 1.4, style: 'dark' });
  place(about.group, wallSpot('foyer', 'w', 3.6, 1.95));
  const aboutPlaque = plaque({ de: 'Hi, ich bin Marcello.', en: 'Hi, I’m Marcello.' }, () => t('aboutKicker'), { width: 1.4, accent: gold });
  place(aboutPlaque, wallSpot('foyer', 'w', 3.6, 0.9));
  addExhibit({ id: 'about', root: about.group, meshes: [...about.meshes, aboutPlaque], room: 'foyer', open: () => openText('about') });

  // star chart of the building: east wall, north part
  const map = board(2.4, 2.0, paintMap, { px: 1024 });
  place(map, wallSpot('foyer', 'e', -3.6, 1.85));
  addExhibit({
    id: 'map', root: map, meshes: [map], room: 'foyer', open: null,
    onPick: (hit) => {
      const room = mapRoomAt(hit.uv);
      if (room) beamTo(room);
    }
  });


  // take part: south wall, left of the workshop door (seen from inside)
  const join = board(3.6, 2.3, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#2C6390');
    g.addColorStop(1, '#1a3a63');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.font = `700 ${Math.round(h * 0.055)}px ${FONT}`;
    ctx.fillText(t('join').toUpperCase(), w * 0.07, h * 0.1);
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(h * 0.1)}px ${FONT}`;
    wrapText(ctx, t('joinTitle'), w * 0.07, h * 0.22, w * 0.86, h * 0.12, 2);
    ctx.font = `500 ${Math.round(h * 0.05)}px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,.86)';
    ['YouTube · One Humanity Lab', 'Instagram · @marcelloswigswag', 'GitHub · MakerWorld · itch.io', 'Sticker · Shop'].forEach((line, i) => {
      ctx.fillText(line, w * 0.07, h * (0.52 + i * 0.09));
    });
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.font = `600 ${Math.round(h * 0.045)}px ${FONT}`;
    ctx.fillText(t('clickHint') + ' →', w * 0.07, h * 0.89);
  }, { px: 1400 });
  place(join, wallSpot('foyer', 's', 4.2, 2.0));
  addExhibit({ id: 'mitmachen', root: join, meshes: [join], room: 'foyer', open: () => openLinks() });

  // glowing ring with the heart in the floor
  const inlay = board(3.0, 3.0, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, css(gold, 0.28));
    g.addColorStop(0.7, css(gold, 0.08));
    g.addColorStop(1, css(gold, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = w * 0.008;
    ctx.strokeStyle = css(gold, 0.75);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = w * 0.003;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.37, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.cos(a) * w * 0.375, h / 2 + Math.sin(a) * w * 0.375);
      ctx.lineTo(w / 2 + Math.cos(a) * w * (i % 6 ? 0.4 : 0.415), h / 2 + Math.sin(a) * w * (i % 6 ? 0.4 : 0.415));
      ctx.stroke();
    }
    drawHeart(ctx, w / 2, h / 2, w * 0.3, css(gold, 0.85));
  }, { px: 768, transparent: true });
  inlay.material.blending = THREE.AdditiveBlending;
  inlay.material.depthWrite = false;
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.set(0, 0.006, 0);
  scene.add(inlay);

  // the world heart floats high over the foyer, above the walls under the
  // stars, so it never hides the signs over the doors
  const HEART_Y = 5.6;
  const heart = new THREE.Mesh(worldHeartGeometry(2.0, 0.12), new THREE.MeshStandardMaterial({
    color: 0xfff3dc, roughness: 0.25, metalness: 0.35, emissive: gold, emissiveIntensity: 0.7, envMapIntensity: 1.5
  }));
  heart.position.set(0, HEART_Y, 0);
  scene.add(heart);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: gold, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  halo.scale.setScalar(4.4);
  halo.position.copy(heart.position);
  scene.add(halo);
  heart.userData.size = [2.0, 2.0];
  const heartEx = addExhibit({ id: 'heart', root: heart, meshes: [heart], room: 'foyer', open: () => openText('welcome'), viewDist: 3.6 });
  heartEx.noHover = true;
  heartEx.normal.set(0, 0, 1);
  animated.push((dt, time) => {
    heart.rotation.y = time * 0.45;
    heart.position.y = HEART_Y + Math.sin(time * 0.9) * 0.1;
    halo.position.y = heart.position.y;
    halo.material.opacity = 0.38 + Math.sin(time * 1.7) * 0.08;
  });
}

/* The closed door to the art room: coming soon, Instagram until then. */
function artDoor() {
  const violet = ROOMS.kunst.accent;
  const door = board(DOOR_W, DOOR_H, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#1d1640');
    g.addColorStop(1, '#0b0919');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const rnd = rng(21);
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.1 + rnd() * 0.5})`;
      ctx.fillRect(rnd() * w, rnd() * h, 2, 2);
    }
    ctx.strokeStyle = css(violet, 0.8);
    ctx.lineWidth = w * 0.012;
    ctx.strokeRect(w * 0.04, h * 0.03, w * 0.92, h * 0.94);
    drawHeart(ctx, w / 2, h * 0.2, w * 0.16, css(violet, 0.9));
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(w * 0.13)}px ${FONT}`;
    ctx.fillText(t('kunst'), w / 2, h * 0.32, w * 0.86);
    ctx.fillStyle = css(violet, 1);
    ctx.font = `700 ${Math.round(w * 0.075)}px ${FONT}`;
    ctx.fillText(t('comingSoon'), w / 2, h * 0.47, w * 0.86);
    ctx.fillStyle = 'rgba(242,247,248,.8)';
    ctx.font = `500 ${Math.round(w * 0.05)}px ${FONT}`;
    wrapText(ctx, t('artDoorText'), w / 2, h * 0.58, w * 0.8, w * 0.068, 3);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.round(w * 0.058)}px ${FONT}`;
    ctx.fillText('@marcelloswigswag →', w / 2, h * 0.82, w * 0.86);
  }, { px: 900 });
  // sits right in the doorway at the back of the games room
  place(door, wallSpot('games', 'e', 0, DOOR_H / 2, -WALL / 2 + 0.02));
  blockers.push(door);
  addExhibit({ id: 'art-door', root: door, meshes: [door], room: 'games', open: () => openArt(null), viewDist: 3.4 });
}

/* The logo – the world heart – as a solid, `size` metres wide and centred.
   The continents are cut out, so you look through them into the stars.
   Shape data comes from the logo SVG (tools-dev/svg_to_shape.py). */
function worldHeartGeometry(size, depth) {
  const o = WORLD_HEART.outer;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < o.length; i += 2) {
    minX = Math.min(minX, o[i]); maxX = Math.max(maxX, o[i]);
    minY = Math.min(minY, o[i + 1]); maxY = Math.max(maxY, o[i + 1]);
  }
  const k = size / (maxX - minX);
  const pts = (a) => {
    const out = [];
    for (let i = 0; i < a.length; i += 2) out.push(new THREE.Vector2((a[i] - (minX + maxX) / 2) * k, -(a[i + 1] - (minY + maxY) / 2) * k));
    return out;
  };
  const shape = new THREE.Shape(pts(o));
  for (const h of WORLD_HEART.holes) shape.holes.push(new THREE.Path(pts(h)));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: depth * 0.25, bevelSize: size * 0.0025, bevelSegments: 2, curveSegments: 4
  });
  geo.center();
  return geo;
}

/* The floor plan as a star chart, painted from ROOMS. */
const MAP_BOUNDS = { minX: -23, maxX: 38, minZ: -30, maxZ: 22 };
function paintMap(ctx, w, h) {
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, w, h);
  const rnd = rng(3);
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.1 + rnd() * 0.4})`;
    ctx.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
  }
  ctx.fillStyle = '#f2f7f8';
  ctx.font = `800 ${Math.round(h * 0.07)}px ${FONT}`;
  ctx.fillText(t('map'), w * 0.06, h * 0.05);
  ctx.fillStyle = 'rgba(242,247,248,.6)';
  ctx.font = `500 ${Math.round(h * 0.04)}px ${FONT}`;
  ctx.fillText(t('mapHint'), w * 0.06, h * 0.14);
  const area = { x: w * 0.06, y: h * 0.22, w: w * 0.88, h: h * 0.74 };
  const sx = area.w / (MAP_BOUNDS.maxX - MAP_BOUNDS.minX);
  const sz = area.h / (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ);
  const s = Math.min(sx, sz);
  const ox = area.x + (area.w - (MAP_BOUNDS.maxX - MAP_BOUNDS.minX) * s) / 2;
  const oz = area.y + (area.h - (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ) * s) / 2;
  paintMap.transform = { s, ox, oz, w, h };
  for (const id of ROOM_ORDER) {
    const r = ROOMS[id];
    const x = ox + (r.x - r.w / 2 - MAP_BOUNDS.minX) * s;
    const y = oz + (r.z - r.d / 2 - MAP_BOUNDS.minZ) * s;
    ctx.fillStyle = css(r.accent, 0.14);
    ctx.fillRect(x, y, r.w * s, r.d * s);
    ctx.save();
    ctx.shadowColor = css(r.accent, 1);
    ctx.shadowBlur = 10;
    ctx.strokeStyle = css(r.accent, 0.95);
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, r.w * s, r.d * s);
    ctx.restore();
    ctx.fillStyle = '#f2f7f8';
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.round(h * 0.042)}px ${FONT}`;
    ctx.fillText(t(id), x + r.w * s / 2, y + r.d * s / 2 - h * 0.02, r.w * s * 0.9);
    ctx.textAlign = 'left';
  }
}
function mapRoomAt(uv) {
  const tr = paintMap.transform;
  if (!uv || !tr) return null;
  const x = (uv.x * tr.w - tr.ox) / tr.s + MAP_BOUNDS.minX;
  const z = ((1 - uv.y) * tr.h - tr.oz) / tr.s + MAP_BOUNDS.minZ;
  return ROOM_ORDER.find((id) => {
    const r = ROOMS[id];
    return Math.abs(x - r.x) <= r.w / 2 && Math.abs(z - r.z) <= r.d / 2;
  }) || null;
}

/* --------------------------------------------------------------------------
   Robotics hall: Yusu on a plinth, its history on the west wall, the current
   state on the east wall, the plan on the north wall, other robots south
   -------------------------------------------------------------------------- */
const HEAD_SPOT = new THREE.Vector3(0, 0, ROOMS.robotics.z - 1.3);
const HEAD_Y = 2.5;
let head = null;

function buildRobotics() {
  const yusu = projectById('yusu');
  const r = ROOMS.robotics;
  const cyan = r.accent;

  // low round stage with glowing rings, an emitter in the middle
  const stageMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.4, 0.1, 64), MAT.plinth);
  stageMesh.position.set(HEAD_SPOT.x, 0.05, HEAD_SPOT.z);
  scene.add(stageMesh);
  for (const [radius, op] of [[2.33, 1], [1.7, 0.45]]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.016, 8, 96), glowMat(cyan, op));
    rim.rotation.x = Math.PI / 2;
    rim.position.set(HEAD_SPOT.x, 0.11, HEAD_SPOT.z);
    scene.add(rim);
  }
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.62, 0.9, 48), MAT.plinth);
  plinth.position.set(HEAD_SPOT.x, 0.1 + 0.45, HEAD_SPOT.z);
  scene.add(plinth);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.42, 48), glowMat(cyan, 0.9));
  lens.rotation.x = -Math.PI / 2;
  lens.position.set(HEAD_SPOT.x, 1.006, HEAD_SPOT.z);
  scene.add(lens);
  obstacles.push({ x: HEAD_SPOT.x, z: HEAD_SPOT.z, r: 1.3 });

  // the light beam that carries the projection
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 0.42, 1.25, 48, 1, true), beamMaterial(cyan, 0.5));
  beam.position.set(HEAD_SPOT.x, 1.0 + 0.625, HEAD_SPOT.z);
  scene.add(beam);

  const spot = new THREE.SpotLight(0xe8f4ff, 45, 0, 0.42, 0.8, 1.6);
  spot.position.set(HEAD_SPOT.x, r.h + 1, HEAD_SPOT.z + 3);
  spot.target.position.set(HEAD_SPOT.x, 2.4, HEAD_SPOT.z);
  scene.add(spot, spot.target);

  head = new THREE.Group();
  head.position.set(HEAD_SPOT.x, HEAD_Y, HEAD_SPOT.z);
  scene.add(head);
  buildYusuHalo(head, cyan);
  // the real head from the CAD; if it cannot load, the drawn face
  pendingImages++;
  loadYusuHead(head)
    .catch(() => buildYusuFace(head))
    .finally(() => { pendingImages--; });

  const headExhibit = addExhibit({
    id: 'project-yusu', root: plinth, meshes: [plinth, stageMesh], room: 'robotics',
    open: () => openProject(yusu), viewDist: 5.2
  });
  headExhibit.center.set(HEAD_SPOT.x, HEAD_Y - 0.2, HEAD_SPOT.z);
  headExhibit.normal.set(0, 0, 1);
  const pickBox = box(2.0, 1.7, 1.0, new THREE.MeshBasicMaterial());
  pickBox.visible = false;
  head.add(pickBox);
  pickBox.userData.exhibit = headExhibit;
  pickables.push(pickBox);
  headExhibit.noHover = true;

  const label = plaque(yusu ? { de: (yusu.de || yusu.en || {}).title || 'Yusu', en: (yusu.en || yusu.de || {}).title || 'Yusu' } : 'Yusu',
    () => pick({ de: 'Das Gesicht – wie auf seinem echten Display', en: 'The face – as on its real display' }),
    { width: 1.1, accent: cyan });
  label.position.set(HEAD_SPOT.x, 0.66, HEAD_SPOT.z + 0.68);
  label.rotation.x = -0.35;
  scene.add(label);
  label.userData.exhibit = headExhibit;
  pickables.push(label);

  if (!yusu) return;

  // history: render + gallery on the west wall
  // in the order it happened, from the door towards Yusu: idea, design,
  // printed parts, the first head, the eyes, and where it stands now
  const pool = [...(yusu.gallery || [])];
  if (yusu.image) pool.push({ ...yusu.image, caption: { de: TEXT.de.renderCaption, en: TEXT.en.renderCaption } });
  const nowItems = yusu.now ? yusu.now.items : [];
  const latest = nowItems.find((it) => !it.video);
  const when = (l) => ((yusu.now.title || {})[l] || '').split('·').pop().trim();
  if (latest) pool.push({ ...latest, caption: { de: when('de') + ': ' + latest.caption.de, en: when('en') + ': ' + latest.caption.en }, now: true });
  const ORDER = [/body-concept/, /head-render\./, /head-parts/, /head-print/, /eyes-(firmware|display)/];
  const past = [];
  for (const re of ORDER) { const it = pool.find((g) => re.test(g.src) && !past.includes(g)); if (it) past.push(it); }
  const novItem = pool.find((g) => g.now);
  if (novItem) past.push(novItem);
  wallTitle('robotics', 'w', 0, r.h - 1.1, () => t('pastTitle'), true);
  rowOnWall('robotics', 'w', past, { y: 2.4, from: -7.6, to: 7.6, maxW: 2.6, maxH: 1.8, style: 'dark', dark: true, timeline: true },
    (item, i) => () => openMedia(item, { kicker: t('pastTitle') + ' · ' + (i + 1), back: yusu }));

  // current state on the east wall, clips play while you are in the hall
  const now = yusu.now ? yusu.now.items : [];
  if (now.length) {
    wallTitle('robotics', 'e', 0, r.h - 1.1, () => pick(yusu.now.title) || t('nowTitle'), true);
    rowOnWall('robotics', 'e', now, { y: 2.2, from: 8.6, to: -8.6, maxW: 1.6, maxH: 2.3, style: 'screen', dark: true },
      (item) => () => openMedia(item, { kicker: pick(yusu.now.title), back: yusu }));
  }

  // the plan on the north wall: two boards left and right of the hologram,
  // so Yusu never stands in front of the text
  const copy = () => yusu[lang()] || yusu.en;
  const intro = board(4.2, 3.0, (ctx, w, h) => {
    ctx.fillStyle = '#121820';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(143,216,255,.85)';
    ctx.font = `700 ${Math.round(h * 0.05)}px ${FONT}`;
    ctx.fillText('ONEHUMANITY R1 · ' + (R ? pick(R.STATUS[yusu.status]) : '').toUpperCase(), w * 0.07, h * 0.09, w * 0.86);
    ctx.fillStyle = '#f2f7f8';
    ctx.font = `800 ${Math.round(h * 0.13)}px ${FONT}`;
    ctx.fillText(copy().title, w * 0.07, h * 0.17, w * 0.86);
    ctx.fillStyle = 'rgba(242,247,248,.78)';
    ctx.font = `500 ${Math.round(h * 0.058)}px ${FONT}`;
    wrapText(ctx, copy().tagline || '', w * 0.07, h * 0.38, w * 0.86, h * 0.08, 3);
    ctx.fillStyle = 'rgba(143,216,255,.9)';
    ctx.font = `700 ${Math.round(h * 0.05)}px ${FONT}`;
    ctx.fillText(t('openMore'), w * 0.07, h * 0.84, w * 0.86);
  }, { px: 1400 });
  place(intro, wallSpot('robotics', 'n', -4.4, 2.6));
  addExhibit({ id: 'yusu-plan', root: intro, meshes: [intro], room: 'robotics', open: () => openProject(yusu) });

  const plan = board(4.2, 3.0, (ctx, w, h) => {
    ctx.fillStyle = '#121820';
    ctx.fillRect(0, 0, w, h);
    const all = copy().timeline || [];
    const done = all.filter((st) => st.state === 'done');
    // short: how far along, the last two steps, what is happening now and next
    const steps = [...done.slice(-2), ...all.filter((st) => st.state === 'now'), ...all.filter((st) => st.state === 'next').slice(0, 1)];
    ctx.fillStyle = 'rgba(143,216,255,.85)';
    ctx.font = `700 ${Math.round(h * 0.05)}px ${FONT}`;
    ctx.fillText(t('planTitle').toUpperCase(), w * 0.07, h * 0.08, w * 0.86);
    ctx.fillStyle = '#f2f7f8';
    ctx.font = `800 ${Math.round(h * 0.085)}px ${FONT}`;
    ctx.fillText(t('planDone').replace('{n}', done.length).replace('{m}', all.length), w * 0.07, h * 0.15, w * 0.86);
    // progress bar
    ctx.fillStyle = 'rgba(242,247,248,.12)';
    ctx.fillRect(w * 0.07, h * 0.27, w * 0.86, h * 0.014);
    ctx.fillStyle = '#8fd8ff';
    ctx.fillRect(w * 0.07, h * 0.27, w * 0.86 * (done.length / Math.max(1, all.length)), h * 0.014);
    const lh = h * 0.058;
    let y = h * 0.34;
    steps.forEach((step) => {
      const x = w * 0.07;
      ctx.beginPath();
      ctx.arc(x + h * 0.02, y + h * 0.026, h * 0.016, 0, Math.PI * 2);
      ctx.fillStyle = step.state === 'done' ? '#8fd8ff' : step.state === 'now' ? '#f5c46b' : 'rgba(242,247,248,.35)';
      ctx.fill();
      ctx.fillStyle = step.state === 'next' ? 'rgba(242,247,248,.6)' : step.state === 'now' ? '#f5c46b' : 'rgba(242,247,248,.88)';
      ctx.font = `${step.state === 'now' ? 700 : 500} ${Math.round(h * 0.047)}px ${FONT}`;
      y = wrapText(ctx, step.text, x + h * 0.06, y, w * 0.86 - h * 0.06, lh, 2) + h * 0.035;
    });
    ctx.fillStyle = 'rgba(143,216,255,.9)';
    ctx.font = `700 ${Math.round(h * 0.045)}px ${FONT}`;
    ctx.fillText(t('openMore'), w * 0.07, h * 0.9, w * 0.86);
  }, { px: 1400 });
  place(plan, wallSpot('robotics', 'n', 4.4, 2.6));
  addExhibit({ id: 'yusu-steps', root: plan, meshes: [plan], room: 'robotics', open: () => openProject(yusu) });

  // the hall belongs to Yusu alone; other robot ideas live in the workshop
}

/* A heading painted straight onto a wall. */
function wallTitle(roomId, side, along, y, text) {
  const title = board(7, 0.7, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = css(ROOMS[roomId].accent, 0.9);
    ctx.shadowBlur = h * 0.25;
    ctx.fillStyle = 'rgba(242,247,248,.95)';
    ctx.font = `800 ${Math.round(h * 0.56)}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(text(), w / 2, h * 0.16, w * 0.98);
  }, { px: 1400, transparent: true });
  return place(title, wallSpot(roomId, side, along, y));
}

/* Pictures in a row along a wall, each with a caption plaque. */
function rowOnWall(roomId, side, items, opts, openFor) {
  const n = items.length;
  if (!n) return;
  const step = n > 1 ? (opts.to - opts.from) / (n - 1) : 0;
  items.forEach((item, i) => {
    const along = n > 1 ? opts.from + step * i : (opts.from + opts.to) / 2;
    const f = framed({ src: item.src, w: item.w, h: item.h, video: item.video ? item : null, maxW: opts.maxW, maxH: opts.maxH, style: opts.style });
    const spot = wallSpot(roomId, side, along, opts.y);
    place(f.group, spot);
    if (f.videoEntry) f.videoEntry.room = roomId;
    const [, fh] = f.group.userData.size;
    const cap = plaque(item.caption || item.alt, () => (item.video ? '▶ Video' : ''), { width: Math.min(opts.maxW, 1.5), accent: ROOMS[roomId].accent });
    place(cap, wallSpot(roomId, side, along, opts.y - fh / 2 - 0.32));
    if (opts.timeline) {
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.07, 24), new THREE.MeshBasicMaterial({ color: 0x8fd8ff }));
      place(dot, wallSpot(roomId, side, along, 0.62, 0.035));
    }
    addExhibit({ id: (item.video || item.src), root: f.group, meshes: [...f.meshes, cap], room: roomId, open: openFor(item, i) });
  });
  if (opts.timeline) {
    const len = Math.abs(opts.to - opts.from) + 1.2;
    const line = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.025), new THREE.MeshBasicMaterial({ color: 0x8fd8ff, transparent: true, opacity: 0.6 }));
    place(line, wallSpot(roomId, side, (opts.from + opts.to) / 2, 0.62, 0.032));
  }
}

/* One project as a framed picture with a plaque, opening the project panel. */
function projectFrame(p, roomId, side, along, { y = 1.75, maxW = 1.7, maxH = 1.25, style = 'dark', dark = false } = {}) {
  const img = p.image || {};
  const f = framed({ src: img.src, w: img.w || 4, h: img.h || 3, maxW, maxH, style });
  place(f.group, wallSpot(roomId, side, along, y));
  const [, fh] = f.group.userData.size;
  const status = R && R.STATUS[p.status];
  const cap = plaque({ de: (p.de || p.en || {}).title, en: (p.en || p.de || {}).title }, () => (status ? pick(status) : ''), { width: Math.min(maxW, 1.4), accent: ROOMS[roomId].accent });
  place(cap, wallSpot(roomId, side, along, y - fh / 2 - 0.3));
  return addExhibit({ id: 'project-' + p.id, root: f.group, meshes: [...f.meshes, cap], room: roomId, open: () => openProject(p) });
}

/* --------------------------------------------------------------------------
   Yusu as a hologram: a rounded white head with the black face display,
   eyes and LED mouth drawn like the firmware does. (The real CAD of the
   head is packed in assets/models/yusu-head.bin for later.)
   -------------------------------------------------------------------------- */
let eyes = null;
let faceMat = null;

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

/* Soft beam: bright at the bottom, fading upwards, glowing at the edges. */
const beams = [];
function beamMaterial(color, strength = 0.6) {
  const m = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uStrength: { value: strength } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime; uniform float uStrength; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float edge = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.6);
        float fade = pow(1.0 - vUv.y, 1.4);
        float lines = 0.75 + 0.25 * sin(vUv.y * 60.0 - uTime * 3.0);
        float a = (0.15 + edge * 0.85) * fade * lines * uStrength;
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false
  });
  beams.push(m);
  return m;
}

/* Yusu's real head, packed from the CAD (tools-dev/stl_to_mesh.py): white
   low-poly shell, black parts, the frosted visor. Eyes and LED mouth glow
   on the visor itself, mapped straight from the front, so they always sit
   where the display is. */
const HEAD_SCALE = 0.0074; // mm → m: a hologram about 1.9 m tall
async function loadYusuHead(group) {
  const res = await fetch('assets/models/yusu-head.bin?v=1');
  if (!res.ok) throw new Error('head model missing');
  const buf = await res.arrayBuffer();
  const view = new DataView(buf);
  const headerLength = view.getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, headerLength)));
  const span = header.max.map((m, i) => m - header.min[i]);
  let offset = 4 + headerLength;

  eyes = createEyes(EYES_VISOR);
  const white = new THREE.MeshStandardMaterial({ color: 0xe4e2dd, roughness: 0.6, metalness: 0.02, flatShading: true, envMapIntensity: 0.55 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1a1d22, roughness: 0.5, flatShading: true });
  const visor = new THREE.MeshStandardMaterial({
    color: 0x78828a, roughness: 0.5, metalness: 0.08, flatShading: true, envMapIntensity: 0.8,
    emissive: 0xffffff, emissiveMap: eyes.texture, emissiveIntensity: 0.7
  });
  eyes.texture.wrapS = eyes.texture.wrapT = THREE.ClampToEdgeWrapping;
  const materials = { white, white2: white, black, black2: black, neck: black, visor };

  // CAD is z-up with the face towards −y: stand it up, face to +z, centred
  const model = new THREE.Group();
  model.rotation.x = -Math.PI / 2;
  // CAD z is up: a touch shorter, so it matches the photos of the real head
  const SQUASH = 0.92;
  model.scale.set(HEAD_SCALE, HEAD_SCALE, HEAD_SCALE * SQUASH);
  model.position.y = -((header.min[2] + header.max[2]) / 2) * HEAD_SCALE * SQUASH;
  group.add(model);

  for (const part of header.parts) {
    const q = new Uint16Array(buf, offset, part.vertices * 3);
    offset += part.posBytes;
    const index = part.wide ? new Uint32Array(buf, offset, part.indices) : new Uint16Array(buf, offset, part.indices);
    offset += part.indBytes;
    const pos = new Float32Array(q.length);
    for (let i = 0; i < q.length; i++) {
      const a = i % 3;
      pos[i] = header.min[a] + (q[i] / 65535) * span[a];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex(new THREE.BufferAttribute(index, 1));
    if (part.name === 'visor') {
      // the eye canvas covers x −50…50 mm and z −60…70 mm, seen from the front
      const uv = new Float32Array(part.vertices * 2);
      for (let i = 0; i < part.vertices; i++) {
        uv[i * 2] = (pos[i * 3] + 50) / 100;
        uv[i * 2 + 1] = (pos[i * 3 + 2] + 60) / 130;
      }
      geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    }
    geo.computeVertexNormals();
    model.add(new THREE.Mesh(geo, materials[part.name] || white));
  }
  visorMat = visor;

  // the camera in the forehead with its ring of six small LEDs (CAD: x 0, z 77)
  const cam = new THREE.Group();
  cam.position.set(0, -75.5, 77);
  cam.rotation.x = Math.PI / 3; // the forehead slopes back
  const lens = new THREE.Mesh(new THREE.CircleGeometry(4.6, 24), new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.15, metalness: 0.6 }));
  lens.position.z = 0.6;
  cam.add(lens);
  const glint = new THREE.Mesh(new THREE.CircleGeometry(1.3, 12), new THREE.MeshBasicMaterial({ color: 0x4a7cff, transparent: true, opacity: 0.6 }));
  glint.position.set(1.2, 1.2, 0.8);
  cam.add(glint);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xe8f6ff, toneMapped: false });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const led = new THREE.Mesh(new THREE.CircleGeometry(1.0, 10), ledMat);
    led.position.set(Math.cos(a) * 9.5, Math.sin(a) * 9.5, 0.7);
    cam.add(led);
  }
  model.add(cam);

  // a key light from the side brings out the facets of the shell
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(-1.6, 1.4, 1.2);
  const aim = new THREE.Object3D();
  group.add(aim);
  key.target = aim;
  group.add(key);
}
let visorMat = null;

/* The drawn face, if the CAD head is not available. */
function buildYusuFace(group) {
  const W = 1.9, H = 1.42, D = 0.62;
  const shell = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(W, H, 0.5), { depth: D, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 6, curveSegments: 20 }),
    new THREE.MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.3, metalness: 0.05, envMapIntensity: 1.2 }));
  shell.position.z = -D / 2 - 0.1;
  group.add(shell);
  const front = D / 2 + 0.1; // front face of the shell

  // black display glass, slightly inset in the white shell
  const glass = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(1.62, 1.06, 0.34), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 16 }),
    new THREE.MeshStandardMaterial({ color: 0x05070b, roughness: 0.45, metalness: 0, envMapIntensity: 0.8 }));
  glass.position.set(0, 0.02, front - 0.012);
  group.add(glass);
  eyes = createEyes();
  const faceGeo = new THREE.ShapeGeometry(roundedRect(1.5, 0.96, 0.3), 12);
  // ShapeGeometry UVs are in shape units: map them to 0..1
  const uv = faceGeo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 1.5 + 0.5, uv.getY(i) / 0.96 + 0.5);
  faceMat = new THREE.MeshBasicMaterial({ map: eyes.texture, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.position.set(0, 0.02, front + 0.06);
  group.add(face);

}

/* Around the head: light rings, a soft glow and the gentle float. */
function buildYusuHalo(group, color) {
  // hologram rings around the head
  const rings = [];
  for (const [radius, tilt, speed] of [[1.45, 0.35, 0.4], [1.6, -0.5, -0.28]]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 6, 128), glowMat(color, 0.6));
    ring.rotation.x = Math.PI / 2 + tilt;
    ring.userData.speed = speed;
    group.add(ring);
    rings.push(ring);
  }
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  glow.scale.set(4.2, 3.4, 1);
  glow.position.z = -0.4;
  group.add(glow);

  animated.push((dt, time) => {
    group.position.y = HEAD_Y + Math.sin(time * 1.1) * 0.06;
    rings.forEach((ring) => { ring.rotation.z += ring.userData.speed * dt; });
  });
}

/* Layouts for the eye canvas: the hologram face, and the real visor
   (4 px per mm, x −50…50 mm, z 70…−60 mm in the CAD). */
const EYES_FACE = { W: 512, H: 328, ex: 128, ey: 132, k: 1, mouthY: 272, step: 30, led: 9, blushX: 150, blushY: 224, glow: 1, scan: true };
const EYES_VISOR = { W: 400, H: 520, ex: 78, ey: 160, k: 0.56, mouthY: 444, step: 26, led: 5.5, blushX: 118, blushY: 250, glow: 0.8, scan: false, photos: true };
/* The eyes are drawn like the firmware does: two glowing shapes that change
   expression now and then, with blinking in between. */
function createEyes(L = EYES_FACE) {
  const W = L.W, H = L.H;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const texture = canvasTexture(canvas);
  const moods = L.photos ? ['neutral', 'happy', 'neutral', 'surprised', 'blush', 'neutral', 'tired', 'happy'] : ['neutral', 'happy', 'neutral', 'curious', 'blush', 'neutral', 'surprised', 'happy'];
  const s = { mood: 'neutral', prev: null, fade: 1, next: 3, blink: 0, nextBlink: 2, look: 0, lookTarget: 0, talk: 0, moodIndex: 0, time: 0 };
  const setMood = (m) => { if (m !== s.mood) { s.prev = s.mood; s.fade = 0; s.mood = m; } };
  const EYE_COLOR = L.color || '#9fe0ff';

  function eye(cx, cy, mood, open) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(L.k, L.k);
    cx = 0; cy = 0;
    ctx.shadowColor = 'rgba(143,216,255,.95)';
    ctx.shadowBlur = 30 * L.glow;
    ctx.fillStyle = EYE_COLOR;
    ctx.strokeStyle = EYE_COLOR;
    const w = 96;
    const h = Math.max(7, 118 * open);
    if ((mood === 'happy' || mood === 'blush') && open > 0.3) {
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 26, 46, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (mood === 'surprised' && open > 0.3) {
      ctx.beginPath();
      ctx.arc(cx, cy, 54, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const ww = mood === 'curious' ? w * 0.9 : w;
      const r = Math.min(32, h / 2);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(cx - ww / 2, cy - h / 2, ww, h, r);
      else ctx.rect(cx - ww / 2, cy - h / 2, ww, h);
      ctx.fill();
    }
    ctx.restore();
  }

  // screenshots of the real display (two eyes per 480 px cell)
  const PHOTO_SET = {
    neutral:   ['img/yusu-eyes-display.jpg', 0],
    happy:     ['img/yusu-eyes-firmware.jpg', 0],
    blush:     ['img/yusu-eyes-firmware.jpg', 0],
    surprised: ['img/yusu-eyes-firmware.jpg', 480],
    curious:   ['img/yusu-eyes-firmware.jpg', 480],
    tired:     ['img/yusu-eyes-display.jpg', 960]
  };
  const photos = L.photos ? {} : null;
  if (photos) {
    for (const [src] of Object.values(PHOTO_SET)) {
      if (photos[src]) continue;
      const img = new Image();
      img.onload = () => draw();
      img.src = src;
      photos[src] = img;
    }
  }
  function photoEyes(mood, open, dx, alpha) {
    const [src, sx] = PHOTO_SET[mood] || PHOTO_SET.neutral;
    const img = photos[src];
    if (!img || !img.complete || !img.naturalWidth || alpha <= 0) return;
    // crop: eyes sit around y 220 of the 480 px cell; scale so they are ~40 mm apart
    const k = (L.ex * 2) / 220;
    const dw = 480 * k;
    const dh = 320 * k;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(W / 2 + dx * 0.5, L.ey);
    ctx.scale(1, Math.max(0.06, open));
    ctx.drawImage(img, sx, 60, 480, 320, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // faint scan lines, it is a hologram after all
    if (L.scan) {
      ctx.fillStyle = 'rgba(143,216,255,.05)';
      for (let y = (s.time * 40) % 6; y < H; y += 6) ctx.fillRect(0, y, W, 2);
    }
    const open = s.blink > 0 ? Math.abs(Math.cos(s.blink * Math.PI)) : 1;
    const dx = s.look * 34;
    if (photos) {
      // the real eyes, straight from the display: fade from the last
      // expression to the new one, squash for a blink
      const fade = Math.min(1, s.fade);
      if (fade < 1 && s.prev) photoEyes(s.prev, open, dx, 1 - fade);
      photoEyes(s.mood, open, dx, fade);
    } else {
      eye(W / 2 - L.ex + dx * L.k, L.ey, s.mood, open);
      eye(W / 2 + L.ex + dx * L.k, L.ey, s.mood, open * (s.mood === 'curious' ? 0.7 : 1));
    }
    if (s.mood === 'blush') {
      ctx.save();
      ctx.fillStyle = 'rgba(255,120,150,.8)';
      ctx.shadowColor = 'rgba(255,120,150,.95)';
      ctx.shadowBlur = 18;
      for (const cx of [W / 2 - L.blushX, W / 2 + L.blushX]) {
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.ellipse(cx + (-26 + k * 26) * L.k, L.blushY, 7 * L.k, 12 * L.k, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    // the six mouth LEDs
    ctx.save();
    ctx.shadowColor = 'rgba(143,216,255,.9)';
    ctx.shadowBlur = 14;
    for (let i = 0; i < 6; i++) {
      const base = s.talk > 0 ? 0.35 + 0.65 * Math.abs(Math.sin(s.time * 9 + i * 0.9)) : (i === 0 || i === 5 ? 0.3 : 0.65);
      ctx.fillStyle = `rgba(159,224,255,${base})`;
      ctx.beginPath();
      ctx.arc(W / 2 + (i - 2.5) * L.step, L.mouthY, L.led, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    texture.needsUpdate = true;
  }
  draw();

  let acc = 0;
  return {
    texture,
    /* look straight at the visitor and talk for a moment */
    greet(mood) {
      setMood(mood);
      s.lookTarget = 0;
      s.talk = mood === 'happy' ? 1.6 : 2.2;
      s.next = 3.5;
      s.blink = 0;
    },
    update(dt) {
      s.time += dt;
      s.next -= dt;
      s.nextBlink -= dt;
      if (s.next <= 0) {
        s.moodIndex = (s.moodIndex + 1) % moods.length;
        setMood(moods[s.moodIndex]);
        s.next = L.photos ? 4 + Math.random() * 3 : 2.5 + Math.random() * 2.5;
        s.lookTarget = Math.random() < 0.5 ? 0 : (Math.random() - 0.5) * 1.4;
        s.talk = s.mood === 'happy' ? 1.6 : 0;
      }
      if (s.nextBlink <= 0 && s.blink <= 0) { s.blink = 0.001; s.nextBlink = 2 + Math.random() * 3; }
      if (s.blink > 0) { s.blink += dt * 5; if (s.blink >= 1) s.blink = 0; }
      s.look += (s.lookTarget - s.look) * Math.min(1, dt * 4);
      s.talk = Math.max(0, s.talk - dt);
      s.fade = Math.min(1, s.fade + dt * 3);
      acc += dt;
      if (acc > 1 / 24) { acc = 0; draw(); }
    }
  };
}

/* --------------------------------------------------------------------------
   Games: arcade cabinets with the covers, screenshots on the wall, itch.io
   -------------------------------------------------------------------------- */
function buildGames() {
  const r = ROOMS.games;
  const games = projectsIn('games');
  const neon = [0xff5fa2, 0x5fd4ff];
  // a game with `arcade.spotlight` gets the big machine in the middle of the
  // north wall, the others stand along the south wall
  const stars = games.filter((p) => p.arcade && p.arcade.spotlight).slice(0, 1);
  const rest = games.filter((p) => !stars.includes(p));
  const spots = [
    ...stars.map((p) => ({ p, side: 'n', along: 0, big: true })),
    ...rest.map((p, k) => ({ p, side: stars.length ? 's' : (k % 2 ? 's' : 'n'),
      along: stars.length ? (k - (rest.length - 1) / 2) * 3.4 : -3.2 + Math.floor(k / 2) * 3.6 }))
  ];
  spots.forEach(({ p, side, along, big }, i) => {
    const cab = arcadeCabinet(p, big ? 0xffc93c : neon[i % 2], big);
    const spot = wallSpot('games', side, along, 0, big ? 0.6 : 0.45);
    place(cab.group, spot);
    obstacles.push({ x: spot.pos.x, z: spot.pos.z, r: big ? 1.05 : 0.85 });
    const ex = addExhibit({ id: 'project-' + p.id, root: cab.group, meshes: cab.meshes, room: 'games', open: () => openProject(p), viewDist: big ? 3.3 : 2.3 });
    ex.center.set(spot.pos.x, big ? 1.9 : 1.5, spot.pos.z);
    if (cab.videoEntry) cab.videoEntry.room = 'games';
  });
  if (!ART_OPEN) artDoor();

  // screenshots on the east wall, one per game
  const shots = games.flatMap((p) => (p.gallery || []).slice(0, 1).map((g) => ({ ...g, project: p })));
  const sign = board(4.4, 1.0, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff5fa2';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#ffd1e6';
    ctx.font = `800 ${Math.round(h * 0.5)}px ${FONT}`;
    ctx.fillText(t('itchSign'), w / 2, h * 0.18, w * 0.96);
  }, { px: 1400, transparent: true });
  place(sign, wallSpot('games', 'e', 0, 3.85));
  addExhibit({ id: 'itch', root: sign, meshes: [sign], room: 'games', open: () => openLinks(['itch']) });
  // beside the doors: east wall left and right of the way to the apps, then the west wall
  const slots = [['e', -3.9], ['e', 3.9], ['w', -3.9], ['w', 3.9]];
  shots.slice(0, slots.length).forEach((shot, i) => {
    const [side, along] = slots[i];
    const f = framed({ src: shot.src, w: shot.w, h: shot.h, maxW: 2.2, maxH: 1.5, style: 'screen' });
    place(f.group, wallSpot('games', side, along, 1.85));
    addExhibit({ id: shot.src, root: f.group, meshes: f.meshes, room: 'games', open: () => openMedia(shot, { kicker: (shot.project[lang()] || {}).title, back: shot.project }) });
  });
}

function arcadeCabinet(p, accent, big = false) {
  const group = new THREE.Group();
  const arcade = big ? p.arcade : null;
  const body = new THREE.MeshStandardMaterial({ color: 0x1b1a33, roughness: 0.6 });
  const side = new THREE.MeshStandardMaterial({ color: new THREE.Color(accent).multiplyScalar(0.25), roughness: 0.5, emissive: accent, emissiveIntensity: 0.22 });
  const base = box(1.4, 1.0, 0.85, body);
  base.position.set(0, 0.5, 0);
  const top = box(1.4, 1.25, 0.55, body);
  top.position.set(0, 1.62, -0.15);
  const deck = box(1.4, 0.08, 0.5, body);
  deck.position.set(0, 1.04, 0.2);
  deck.rotation.x = 0.25;
  for (const s of [-1, 1]) {
    const edge = box(0.04, 2.3, 0.9, side);
    edge.position.set(s * 0.72, 1.15, -0.02);
    group.add(edge);
  }
  // the big machine shows its trailer upright, like an old vertical arcade
  const img = arcade && arcade.video ? { src: arcade.poster, w: arcade.w, h: arcade.h } : (p.image || {});
  const aspect = (img.w || 4) / (img.h || 3);
  const sh = arcade ? 1.04 : 0.82;
  const sw = Math.min(1.22, sh * aspect);
  const screenMat = new THREE.MeshBasicMaterial({ map: img.src ? imageTexture(img.src, img.w, img.h) : null, toneMapped: false });
  let videoEntry = null;
  if (arcade && arcade.video) {
    videoEntry = videoTexture({ video: arcade.video, poster: arcade.poster, w: arcade.w, h: arcade.h });
    videoEntry.material = screenMat;
    screenMat.map = videoEntry.poster;
  }
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(sw, sw / aspect), screenMat);
  // in front of the cabinet face (tilted back, its top edge must stay clear)
  screen.position.set(0, arcade ? 1.7 : 1.6, 0.18);
  screen.rotation.x = -0.08;
  const marquee = board(1.36, 0.3, (ctx, w, h) => {
    ctx.fillStyle = '#0d0c1c';
    ctx.fillRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.shadowColor = '#' + new THREE.Color(accent).getHexString();
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(h * 0.42)}px ${FONT}`;
    ctx.fillText((p[lang()] || p.en).title, w / 2, h * 0.26, w * 0.92);
  }, { px: 768 });
  marquee.position.set(0, 2.38, 0.13);
  for (const k of [-1, 1]) {
    const button = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16), new THREE.MeshBasicMaterial({ color: k < 0 ? 0xff5fa2 : 0x5fd4ff }));
    button.position.set(k * 0.22, 1.1, 0.25);
    button.rotation.x = 0.25;
    group.add(button);
  }
  group.add(base, top, deck, screen, marquee);
  const meshes = [screen, top, base, marquee];
  if (arcade) {
    // a glowing badge on top and a light pool on the floor
    const badge = board(1.5, 0.34, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ffc93c';
      ctx.shadowBlur = h * 0.3;
      ctx.fillStyle = '#ffe28a';
      ctx.font = `800 ${Math.round(h * 0.52)}px ${FONT}`;
      ctx.fillText(pick(arcade.badge) || '', w / 2, h * 0.2, w * 0.96);
    }, { px: 800, transparent: true });
    badge.position.set(0, 2.78, 0.1);
    group.add(badge);
    meshes.push(badge);
    animated.push((dt, time) => { badge.position.y = 2.78 + Math.sin(time * 1.6) * 0.03; });
    const pool = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: accent, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    pool.scale.set(3.2, 1.2, 1);
    pool.position.set(0, 0.05, 0.9);
    group.add(pool);
    group.scale.setScalar(1.22);
  }
  group.userData.size = [1.4 * (arcade ? 1.22 : 1), arcade ? 3.5 : 2.5];
  return { group, meshes, videoEntry };
}

/* --------------------------------------------------------------------------
   Apps: everything you can open straight away in the browser, big screens
   with a button that opens the app in a new tab
   -------------------------------------------------------------------------- */
const isApp = (p) => !!(p.demo && p.demo.href && !p.demo.href.startsWith('#'));
function buildApps() {
  const r = ROOMS.apps;
  const apps = PROJECTS.filter(isApp)
    // tools first, they are the apps proper; then the rest
    .sort((a, b) => (a.group === 'tools' ? 0 : 1) - (b.group === 'tools' ? 0 : 1));
  wallTitle('apps', 'w', 0, r.h - 0.75, () => t('appsTitle'));
  const note = board(5.2, 0.42, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(242,247,248,.78)';
    ctx.font = `500 ${Math.round(h * 0.5)}px ${FONT}`;
    ctx.fillText(t('appsNote'), w / 2, h * 0.2, w * 0.98);
  }, { px: 1200, transparent: true });
  place(note, wallSpot('apps', 'w', 0, r.h - 1.3));
  // two big screens on the far wall, more along the side walls
  const slots = apps.length === 1 ? [['w', 0]] : [['w', -2.9], ['w', 2.9], ['n', -2.6], ['s', 2.6], ['n', 2.6], ['s', -2.6]];
  apps.slice(0, slots.length).forEach((p, i) => {
    const [side, along] = slots[i];
    const card = p.app || {};
    const copy = card[lang()] || card.en || p[lang()] || p.en || {};
    const img = card.image || p.image || {};
    const f = framed({ src: img.src, w: img.w || 4, h: img.h || 3, maxW: 2.7, maxH: 1.7, style: 'screen' });
    const y = 2.2;
    place(f.group, wallSpot('apps', side, along, y));
    const [, fh] = f.group.userData.size;
    const cap = plaque({ de: ((card.de || p.de || {}).title), en: ((card.en || p.en || {}).title) }, () => (p.app ? '' : (R && R.STATUS[p.status] ? pick(R.STATUS[p.status]) : '')), { width: 1.6, accent: r.accent });
    place(cap, wallSpot('apps', side, along, y - fh / 2 - 0.3));
    addExhibit({ id: 'project-' + p.id + (p.app ? '-app' : ''), root: f.group, meshes: [...f.meshes, cap], room: 'apps', open: () => openProject(p) });
    // the button: glows, opens the app itself
    const btn = board(1.5, 0.36, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, '#46e3a8');
      g.addColorStop(1, '#6dd8ff');
      ctx.fillStyle = g;
      const rr = h / 2;
      ctx.beginPath();
      ctx.moveTo(rr, 0); ctx.lineTo(w - rr, 0); ctx.arc(w - rr, rr, rr, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(rr, h); ctx.arc(rr, rr, rr, Math.PI / 2, Math.PI * 1.5); ctx.fill();
      ctx.fillStyle = '#04231a';
      ctx.textAlign = 'center';
      ctx.font = `800 ${Math.round(h * 0.46)}px ${FONT}`;
      ctx.fillText(t('appOpen'), w / 2, h * 0.24, w * 0.86);
    }, { px: 600, transparent: true });
    place(btn, wallSpot('apps', side, along, y - fh / 2 - 0.78, 0.04));
    addExhibit({ id: 'open-' + p.id, root: btn, meshes: [btn], room: 'apps', open: () => { window.open(p.demo.href, '_blank', 'noopener'); } });
  });
  // a hologram in the middle: a slowly turning browser window of light
  const holo = new THREE.Group();
  const lineMat = glowMat(r.accent, 0.85);
  const frameW = 1.6, frameH = 1.0;
  for (const [w, h, x, y] of [[frameW, 0.03, 0, frameH / 2], [frameW, 0.03, 0, -frameH / 2], [0.03, frameH, -frameW / 2, 0], [0.03, frameH, frameW / 2, 0], [frameW, 0.02, 0, frameH / 2 - 0.16]]) {
    const bar = box(w, h, 0.02, lineMat);
    bar.position.set(x, y, 0);
    holo.add(bar);
  }
  for (let k = 0; k < 3; k++) {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.03, 12), lineMat);
    dot.position.set(-frameW / 2 + 0.1 + k * 0.09, frameH / 2 - 0.08, 0.012);
    holo.add(dot);
  }
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: r.accent, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  glow.scale.setScalar(3.2);
  holo.add(glow);
  holo.scale.setScalar(0.6);
  holo.position.set(r.x, 3.55, r.z);
  scene.add(holo);
  animated.push((dt, time) => {
    holo.rotation.y = time * 0.35;
    holo.position.y = 3.55 + Math.sin(time * 0.8) * 0.08;
  });
}

/* --------------------------------------------------------------------------
   Workshop: tools at desks, 3D designs on a pegboard, photos of the room
   -------------------------------------------------------------------------- */
function buildWorkshop() {
  const r = ROOMS.werkstatt;
  // tools, plus robot ideas that are still future topics (e.g. Ringwheel)
  const tools = [...projectsIn('tools').filter((p) => p.featured !== false && !isApp(p)), ...projectsIn('robotics').filter((p) => p.id !== 'yusu')];
  const east = tools.slice(0, Math.ceil(tools.length / 2));
  const west = tools.slice(Math.ceil(tools.length / 2));
  wallTitle('werkstatt', 'e', 0, r.h - 0.75, () => t('toolsTitle'));
  wallTitle('werkstatt', 'w', 0, r.h - 0.75, () => t('benchTitle'));
  [['e', east], ['w', west]].forEach(([side, list]) => {
    const n = list.length;
    list.forEach((p, i) => {
      const along = n > 1 ? -4.2 + (8.4 / (n - 1)) * i : 0;
      const desk = box(1.7, 0.06, 0.75, MAT.wood);
      const spot = wallSpot('werkstatt', side, along, 0.76, 0.42);
      place(desk, spot);
      for (const k of [-1, 1]) {
        const leg = box(0.05, 0.74, 0.65, MAT.trim);
        leg.position.set(k * 0.8, -0.38, 0);
        desk.add(leg);
      }
      obstacles.push({ x: spot.pos.x, z: spot.pos.z, r: 0.95 });
      projectFrame(p, 'werkstatt', side, along, { y: 1.85, maxW: 1.6, maxH: 1.05, style: 'screen' });
    });
  });

  // 3D designs on a pegboard on the south wall
  const designs = projectsIn('design');
  wallTitle('werkstatt', 's', 0, r.h - 0.7, () => t('designTitle') + ' · ' + t('designSub'));
  const peg = board(r.w - 2.2, 2.9, (ctx, w, h) => {
    ctx.fillStyle = '#15131b';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = css(ROOMS.werkstatt.accent, 0.4);
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    ctx.fillStyle = css(ROOMS.werkstatt.accent, 0.22);
    for (let x = 18; x < w; x += 36) for (let y = 18; y < h; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, { px: 2048 });
  place(peg, wallSpot('werkstatt', 's', 0, 2.0, 0.01));
  const n = designs.length;
  designs.forEach((p, i) => {
    const along = n > 1 ? -5.6 + (11.2 / (n - 1)) * i : 0;
    projectFrame(p, 'werkstatt', 's', along, { y: 2.3, maxW: 1.45, maxH: 1.15, style: 'dark' });
  });

  // photos of the real workshop next to the door
  const photos = [
    { src: 'img/workshop-bench.jpg', w: 1600, h: 1200, alt: { de: 'Werkbank mit Lochwand, Werkzeug und Lichtleiste', en: 'Workbench with pegboard, tools and light bar' } },
    { src: 'img/workshop-evening.jpg', w: 1600, h: 1200, alt: { de: 'Die Werkstatt am Abend', en: 'The workshop in the evening' } },
    { src: 'img/workshop-desk.jpg', w: 1600, h: 1200, alt: { de: 'Schreibtisch am Fenster', en: 'Desk by the window' } }
  ];
  photos.forEach((ph, i) => {
    const along = [-5.9, -3.5, 3.6][i];
    const f = framed({ src: ph.src, w: ph.w, h: ph.h, maxW: 1.9, maxH: 1.45, style: 'dark' });
    place(f.group, wallSpot('werkstatt', 'n', along, 1.9));
    addExhibit({ id: ph.src, root: f.group, meshes: f.meshes, room: 'werkstatt',
      open: () => openMedia({ ...ph, caption: ph.alt }, { kicker: t('workshopTitle'), text: t('workshopText') }) });
  });
  const note = board(2.2, 1.45, (ctx, w, h) => {
    ctx.fillStyle = '#121019';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = css(ROOMS.werkstatt.accent, 0.9);
    ctx.fillRect(0, 0, w * 0.012, h);
    ctx.fillStyle = '#f2f7f8';
    ctx.font = `800 ${Math.round(h * 0.13)}px ${FONT}`;
    ctx.fillText(t('workshopTitle'), w * 0.08, h * 0.1, w * 0.84);
    ctx.fillStyle = 'rgba(242,247,248,.72)';
    ctx.font = `400 ${Math.round(h * 0.07)}px ${FONT}`;
    wrapText(ctx, t('workshopText'), w * 0.08, h * 0.34, w * 0.84, h * 0.095, 6);
  }, { px: 900 });
  place(note, wallSpot('werkstatt', 'n', 6.0, 1.9));

  // a work table in the middle
  const table = box(3.2, 0.08, 1.3, MAT.wood);
  table.position.set(r.x, 0.9, r.z + 0.5);
  scene.add(table);
  for (const k of [-1, 1]) for (const j of [-1, 1]) {
    const leg = box(0.08, 0.86, 0.08, MAT.trim);
    leg.position.set(r.x + k * 1.45, 0.43, r.z + 0.5 + j * 0.5);
    scene.add(leg);
  }
  const shelf = box(2.9, 0.04, 1.0, MAT.wood);
  shelf.position.set(r.x, 0.22, r.z + 0.5);
  scene.add(shelf);
  obstacles.push({ x: r.x - 0.9, z: r.z + 0.5, r: 1.0 }, { x: r.x + 0.9, z: r.z + 0.5, r: 1.0 });
}

/* --------------------------------------------------------------------------
   Art: white cube, pictures from artworks.data.js
   -------------------------------------------------------------------------- */
function buildArt() {
  const r = ROOMS.kunst;
  const title = board(5.2, 1.5, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = css(ROOMS.kunst.accent, 1);
    ctx.shadowBlur = h * 0.12;
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(h * 0.4)}px ${FONT}`;
    ctx.fillText(t('kunst'), 0, h * 0.04);
    ctx.shadowBlur = 0;
    ctx.fillStyle = css(ROOMS.kunst.accent, 0.9);
    ctx.font = `500 ${Math.round(h * 0.16)}px ${FONT}`;
    ctx.fillText(t('artWall') + '  ·  @marcelloswigswag', 0, h * 0.58, w);
  }, { px: 1400, transparent: true });
  place(title, wallSpot('kunst', 'n', 3.0, 3.9));
  addExhibit({ id: 'art-title', root: title, meshes: [title], room: 'kunst', open: () => openArt(null) });

  // slots: the far (east) wall first, then north and south
  const slots = [
    ['e', -3.6], ['e', 0], ['e', 3.6],
    ['n', -0.8], ['n', -4.4], ['s', -0.8], ['s', -4.4], ['s', 3.6]
  ];
  const works = ARTWORKS.length ? ARTWORKS : [null, null, null];
  works.slice(0, slots.length).forEach((art, i) => {
    const [side, along] = slots[i];
    let f;
    if (art) {
      f = framed({ src: art.src, w: art.w, h: art.h, maxW: 2.2, maxH: 2.0, style: 'light' });
    } else {
      f = framed({ w: 3, h: 4, maxW: 1.5, maxH: 2.0, style: 'light' });
      const placeholder = board(1.5, 2.0, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#1b1636');
        g.addColorStop(1, '#0d0b1c');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        drawHeart(ctx, w / 2, h * 0.3, w * 0.28, css(ROOMS.kunst.accent, 0.5));
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f2f7f8';
        ctx.font = `800 ${Math.round(w * 0.085)}px ${FONT}`;
        ctx.fillText(t('artSoon'), w / 2, h * 0.5, w * 0.86);
        ctx.fillStyle = 'rgba(242,247,248,.7)';
        ctx.font = `500 ${Math.round(w * 0.055)}px ${FONT}`;
        wrapText(ctx, t('artSoonText'), w / 2, h * 0.6, w * 0.8, w * 0.075, 4);
      }, { px: 600 });
      placeholder.position.z = 0.028;
      f.group.add(placeholder);
      f.meshes.push(placeholder);
    }
    place(f.group, wallSpot('kunst', side, along, 2.25));
    const [, fh] = f.group.userData.size;
    const meshes = [...f.meshes];
    if (art) {
      const cap = plaque({ de: (art.de || art.en || {}).title, en: (art.en || art.de || {}).title }, () => String(art.year || ''), { width: 0.9, accent: ROOMS.kunst.accent });
      place(cap, wallSpot('kunst', side, along, 2.25 - fh / 2 - 0.28));
      meshes.push(cap);
    }
    addExhibit({ id: art ? 'art-' + art.id : 'art-soon-' + i, root: f.group, meshes, room: 'kunst', open: () => openArt(art) });
  });

  // a bench to sit and look
  const bench = box(2.4, 0.45, 0.6, MAT.plinth);
  bench.position.set(r.x + 1, 0.225, r.z);
  bench.rotation.y = Math.PI / 2;
  scene.add(bench);
  const benchLine = box(2.42, 0.02, 0.62, glowMat(r.accent, 0.8));
  benchLine.position.y = 0.235;
  bench.add(benchLine);
  obstacles.push({ x: r.x + 1, z: r.z - 0.7, r: 0.7 }, { x: r.x + 1, z: r.z + 0.7, r: 0.7 });
}

/* --------------------------------------------------------------------------
   The sky: nebula, stars, the sun and one planet – One Planet, One Humanity.
   Everything up there moves with the camera, so it is infinitely far away.
   -------------------------------------------------------------------------- */
const sky = new THREE.Group();
const skyUniforms = { uTime: { value: 0 }, uPixel: { value: renderer.getPixelRatio() } };

function nebulaTexture() {
  const W = 2048, H = 1024;
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#010208');
  g.addColorStop(0.5, '#030615');
  g.addColorStop(1, '#010207');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const rnd = rng(42);
  const colors = [[30, 60, 170], [20, 45, 130], [60, 50, 160], [25, 90, 150], [90, 50, 150]];
  ctx.globalCompositeOperation = 'lighter';
  const blob = (x, y, r, [cr, cg, cb], a) => {
    for (const ox of [-W, 0, W]) {
      if (x + ox + r < 0 || x + ox - r > W) continue;
      const gr = ctx.createRadialGradient(x + ox, y, 0, x + ox, y, r);
      gr.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`);
      gr.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = gr;
      ctx.fillRect(x + ox - r, y - r, r * 2, r * 2);
    }
  };
  // a band of milky way across the sky, plus loose clouds
  for (let i = 0; i < 220; i++) {
    const x = rnd() * W;
    const y = H * 0.5 + Math.sin((x / W) * Math.PI * 2 + 0.8) * H * 0.18 + (rnd() - 0.5) * H * 0.16;
    blob(x, y, 30 + rnd() * 140, colors[Math.floor(rnd() * colors.length)], 0.012 + rnd() * 0.028);
  }
  for (let i = 0; i < 26; i++) {
    blob(rnd() * W, H * (0.15 + rnd() * 0.7), 120 + rnd() * 260, colors[Math.floor(rnd() * colors.length)], 0.008 + rnd() * 0.016);
  }
  // dust of very faint stars
  for (let i = 0; i < 16000; i++) {
    const x = rnd() * W;
    const band = H * 0.5 + Math.sin((x / W) * Math.PI * 2 + 0.8) * H * 0.18;
    const y = rnd() < 0.5 ? band + (rnd() - 0.5) * H * 0.22 : rnd() * H;
    ctx.fillStyle = `rgba(255,255,255,${0.05 + rnd() * 0.3})`;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalCompositeOperation = 'source-over';
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

function buildStars() {
  const n = coarse ? 1600 : 2800;
  const pos = new Float32Array(n * 3);
  const tint = new Float32Array(n * 3);
  const size = new Float32Array(n);
  const phase = new Float32Array(n);
  const rnd = rng(9);
  const palette = [[1, 1, 1], [0.75, 0.85, 1], [1, 0.92, 0.78], [0.85, 0.8, 1]];
  for (let i = 0; i < n; i++) {
    const u = rnd() * 2 - 1;
    const a = rnd() * Math.PI * 2;
    const rr = Math.sqrt(1 - u * u);
    pos.set([Math.cos(a) * rr * 190, u * 190, Math.sin(a) * rr * 190], i * 3);
    tint.set(palette[Math.floor(rnd() * palette.length)], i * 3);
    const b = rnd();
    size[i] = b > 0.985 ? 5.5 : b > 0.9 ? 3.4 : 1.4 + rnd() * 1.6;
    phase[i] = rnd() * 6.28;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('tint', new THREE.BufferAttribute(tint, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: `attribute vec3 tint; attribute float size; attribute float phase; uniform float uTime; uniform float uPixel;
      varying vec3 vC; varying float vA;
      void main(){ vC = tint; vA = 0.6 + 0.4 * sin(uTime * (0.7 + fract(phase) * 1.6) + phase * 3.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uPixel; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vC; varying float vA;
      void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); float a = smoothstep(0.5, 0.0, r); a = a * a;
        float cross = max(0.0, 1.0 - abs(d.x) * 14.0) * max(0.0, 1.0 - abs(d.y) * 2.2) + max(0.0, 1.0 - abs(d.y) * 14.0) * max(0.0, 1.0 - abs(d.x) * 2.2);
        gl_FragColor = vec4(vC, (a + cross * 0.35) * vA);
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const stars = new THREE.Points(geo, mat);
  stars.frustumCulled = false;
  sky.add(stars);
}

const NOISE_GLSL = `
  float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
`;

const PLANET_DIR = new THREE.Vector3(0.48, 0.4, -1).normalize();
// the planet's own sun: from the side, so we see about half in daylight and
// half at night, with the cities glowing on the dark side
const PLANET_SUN = SUN_DIR.clone().addScaledVector(PLANET_DIR, -SUN_DIR.dot(PLANET_DIR)).normalize().addScaledVector(PLANET_DIR, 0.12).normalize();
let planet = null;
function buildPlanet() {
  const R = 24;
  const group = new THREE.Group();
  group.position.copy(PLANET_DIR).multiplyScalar(150);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: skyUniforms.uTime, uSun: { value: PLANET_SUN } },
    vertexShader: `varying vec3 vObj; varying vec3 vN; varying vec3 vView;
      void main(){ vObj = position; vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0);
        vView = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: NOISE_GLSL + `uniform float uTime; uniform vec3 uSun; varying vec3 vObj; varying vec3 vN; varying vec3 vView;
      float fbm8(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 8; i++){ s += a * noise(p); p = p * 2.02 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }
      void main(){
        vec3 p = normalize(vObj);
        // continents from warped noise: natural, ragged coastlines
        vec3 w = vec3(fbm(p * 3.0 + 11.0), fbm(p * 3.0 + 23.0), fbm(p * 3.0 + 37.0)) - 0.5;
        float e = fbm8(p * 2.1 + vec3(3.1, 1.7, 0.4) + w * 0.55);
        const float coast = 0.515;
        float land = smoothstep(coast, coast + 0.006, e);
        float h = clamp((e - coast) / 0.22, 0.0, 1.0);
        float lat = abs(p.y);
        // oceans: deep blue, lighter over the shelves along the coasts
        float shelf = smoothstep(coast - 0.07, coast, e);
        vec3 ocean = mix(vec3(0.004, 0.025, 0.09), vec3(0.02, 0.14, 0.3), shelf);
        ocean = mix(ocean, vec3(0.05, 0.3, 0.42), smoothstep(coast - 0.015, coast, e) * 0.55);
        // land: forest and grass, deserts in the subtropics, rock up high
        float moist = fbm(p * 6.0 + 5.0);
        vec3 ground = mix(vec3(0.05, 0.15, 0.05), vec3(0.2, 0.26, 0.1), smoothstep(0.4, 0.62, moist));
        float dry = smoothstep(0.16, 0.3, lat) * (1.0 - smoothstep(0.4, 0.52, lat));
        ground = mix(ground, vec3(0.6, 0.48, 0.29), clamp(dry * 1.5 - moist * 0.7 + 0.15, 0.0, 1.0));
        ground = mix(ground, vec3(0.34, 0.3, 0.26), smoothstep(0.55, 0.95, h));
        ground *= 0.82 + 0.36 * noise(p * 95.0);
        vec3 col = mix(ocean, ground, land);
        float ice = smoothstep(0.8, 0.87, lat + (e - 0.5) * 0.25 + noise(p * 26.0) * 0.05);
        col = mix(col, vec3(0.88, 0.93, 1.0), ice);
        // clouds drift slowly, in swirls
        float t = uTime * 0.012;
        vec3 q = vec3(p.x * cos(t) - p.z * sin(t), p.y * 1.6, p.x * sin(t) + p.z * cos(t));
        q += (vec3(fbm(q * 2.0 + 3.0), fbm(q * 2.0 + 8.0), 0.0) - 0.5) * 0.6;
        float cloud = smoothstep(0.5, 0.78, fbm8(q * 3.2 + 7.0));
        vec3 n = normalize(vN);
        vec3 v = normalize(vView);
        float d = dot(n, uSun);
        float day = smoothstep(-0.12, 0.3, d);
        vec3 c = col * (0.015 + day * 1.15);
        c = mix(c, vec3(1.0) * (0.02 + day * 1.05), cloud * 0.85);
        // the sun glinting on the sea
        float spec = pow(max(dot(n, normalize(uSun + v)), 0.0), 140.0) * (1.0 - land) * (1.0 - cloud) * day;
        c += vec3(1.0, 0.9, 0.75) * spec * 0.45;
        // city lights on the night side: clusters of fine dots
        float cluster = smoothstep(0.4, 0.66, noise(p * 14.0));
        float dots = smoothstep(0.72, 0.84, noise(p * 230.0)) + 0.5 * smoothstep(0.74, 0.86, noise(p * 95.0));
        float city = dots * cluster * land * (1.0 - ice) * (1.0 - cloud * 0.85) * (1.0 - smoothstep(-0.25, 0.05, d));
        c += vec3(1.0, 0.74, 0.4) * city * 1.5;
        float rim = pow(1.0 - max(dot(n, v), 0.0), 2.6);
        c += vec3(0.3, 0.55, 1.0) * rim * (0.08 + day * 0.9);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
    fog: false
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(R, 160, 112), mat);
  ball.rotation.z = 0.35;
  group.add(ball);
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.09, 64, 48), new THREE.ShaderMaterial({
    uniforms: { uSun: { value: PLANET_SUN } },
    vertexShader: `varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(normalMatrix * normal); vW = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uSun; varying vec3 vN; varying vec3 vW;
      void main(){ float i = pow(max(0.0, 0.72 - dot(vN, vec3(0.0, 0.0, 1.0))), 2.4); float lit = 0.25 + 0.75 * smoothstep(-0.4, 0.4, dot(-vW, uSun));
        gl_FragColor = vec4(vec3(0.35, 0.62, 1.0) * i * lit * 2.2, 1.0);
        #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, fog: false
  }));
  group.add(atmo);
  sky.add(group);
  planet = ball;

  // the sun: a bright point with a wide halo
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff1d8, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  sunGlow.position.copy(SUN_DIR).multiplyScalar(170);
  sunGlow.scale.setScalar(26);
  sky.add(sunGlow);
  const sunHalo = sunGlow.clone();
  sunHalo.material = sunGlow.material.clone();
  sunHalo.material.opacity = 0.25;
  sunHalo.scale.setScalar(90);
  sky.add(sunHalo);
}

/* Motes of light drifting up in every room, and a few floating lamps. */
function buildMotes() {
  const per = coarse ? 70 : 130;
  const n = per * ROOM_ORDER.length;
  const pos = new Float32Array(n * 3);
  const tint = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  const rnd = rng(77);
  let k = 0;
  for (const id of ROOM_ORDER) {
    const r = ROOMS[id];
    const c = new THREE.Color(r.accent).lerp(new THREE.Color(0xffffff), 0.35);
    for (let i = 0; i < per; i++, k++) {
      pos.set([r.x + (rnd() - 0.5) * (r.w - 1), rnd() * (r.h + 1.5), r.z + (rnd() - 0.5) * (r.d - 1)], k * 3);
      tint.set([c.r, c.g, c.b], k * 3);
      seed[k] = rnd();
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('tint', new THREE.BufferAttribute(tint, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: skyUniforms,
    vertexShader: `attribute vec3 tint; attribute float seed; uniform float uTime; uniform float uPixel; varying vec3 vC; varying float vA;
      void main(){ vec3 p = position; float span = 6.5;
        p.y = mod(p.y + uTime * (0.08 + seed * 0.18), span);
        p.x += sin(uTime * 0.3 + seed * 20.0) * 0.25; p.z += cos(uTime * 0.25 + seed * 13.0) * 0.25;
        vA = smoothstep(0.0, 0.8, p.y) * (1.0 - smoothstep(span - 1.6, span, p.y)) * (0.5 + 0.5 * sin(uTime * 2.0 + seed * 40.0));
        vC = tint; vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (2.0 + seed * 3.0) * uPixel * (6.0 / max(1.0, -mv.z));
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying vec3 vC; varying float vA;
      void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vC, a * vA * 0.9);
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const motes = new THREE.Points(geo, mat);
  motes.frustumCulled = false;
  scene.add(motes);

  // floating lamps: small bright orbs drifting in the upper air
  for (const id of ROOM_ORDER) {
    const r = ROOMS[id];
    const count = id === 'robotics' ? 6 : 3;
    for (let i = 0; i < count; i++) {
      const orb = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: r.accent, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      const base = new THREE.Vector3(r.x + (rnd() - 0.5) * (r.w - 4), r.h - 0.9 - rnd() * 0.8, r.z + (rnd() - 0.5) * (r.d - 4));
      orb.scale.setScalar(0.35 + rnd() * 0.25);
      orb.position.copy(base);
      scene.add(orb);
      const ph = rnd() * 6.28;
      animated.push((dt, time) => {
        orb.position.set(base.x + Math.sin(time * 0.2 + ph) * 0.6, base.y + Math.sin(time * 0.5 + ph) * 0.18, base.z + Math.cos(time * 0.17 + ph) * 0.6);
      });
    }
  }
}

function buildSky() {
  const nebula = nebulaTexture();
  scene.background = nebula;
  // the nebula also lights the polished surfaces a little
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(nebula).texture;
  pmrem.dispose();
  buildStars();
  buildPlanet();
  scene.add(sky);
}

/* --------------------------------------------------------------------------
   Arriving: you are beamed in. A flash, a ring of light at your feet, and
   for a moment you look at your own hands while they take shape.
   -------------------------------------------------------------------------- */
const flashEl = document.createElement('div');
flashEl.className = 'g-flash';
flashEl.setAttribute('aria-hidden', 'true');
document.body.appendChild(flashEl);

/* Warp: streaks of light rushing past while you fall towards the planet,
   and a title card over it. Drawn in 2D on top of the scene. */
const warpEl = document.createElement('canvas');
warpEl.className = 'g-warp';
warpEl.setAttribute('aria-hidden', 'true');
document.body.appendChild(warpEl);
const titleEl = document.createElement('p');
titleEl.className = 'g-title-card';
titleEl.setAttribute('aria-hidden', 'true');
titleEl.innerHTML = '<span>One Planet</span><span>One Humanity</span>';
document.body.appendChild(titleEl);
const warp = (() => {
  const ctx = warpEl.getContext('2d');
  const stars = Array.from({ length: coarse ? 140 : 220 }, () => ({ a: Math.random() * Math.PI * 2, d: Math.random(), v: 0.4 + Math.random() * 0.9, w: 0.6 + Math.random() * 1.6 }));
  let on = false;
  return {
    step(k, dt) {
      if (k <= 0) {
        if (on) { ctx.clearRect(0, 0, warpEl.width, warpEl.height); warpEl.style.opacity = '0'; on = false; }
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.round(window.innerWidth * dpr);
      const H = Math.round(window.innerHeight * dpr);
      if (warpEl.width !== W || warpEl.height !== H) { warpEl.width = W; warpEl.height = H; }
      on = true;
      warpEl.style.opacity = '1';
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.hypot(W, H) / 2;
      const speed = 0.25 + k * k * 3.2;
      const len = 0.01 + k * k * 0.32;
      ctx.lineCap = 'round';
      for (const st of stars) {
        st.d += dt * st.v * speed;
        if (st.d > 1.15) { st.d = 0.05 + Math.random() * 0.1; st.a = Math.random() * Math.PI * 2; }
        const d0 = Math.pow(st.d, 1.6);
        const d1 = Math.pow(Math.min(1.3, st.d + len), 1.6);
        const alpha = Math.min(1, k * 1.4) * Math.min(1, st.d * 3);
        ctx.strokeStyle = `rgba(${190 + st.w * 30},${225 + st.w * 10},255,${alpha.toFixed(3)})`;
        ctx.lineWidth = st.w * dpr * (0.6 + k);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(st.a) * d0 * R, cy + Math.sin(st.a) * d0 * R);
        ctx.lineTo(cx + Math.cos(st.a) * d1 * R, cy + Math.sin(st.a) * d1 * R);
        ctx.stroke();
      }
    }
  };
})();
/* The landing hits: a jolt, a low boom, a buzz on phones. */
function impact() {
  state.shake = 1;
  sound.impact();
  // phones only buzz after a tap; arriving through a link there was none yet
  const tapped = !navigator.userActivation || navigator.userActivation.hasBeenActive;
  try { if (navigator.vibrate && tapped) navigator.vibrate([35, 40, 90]); } catch (e) { /* not supported */ }
}

/* Robot hands like Yusu's body concept: white low-poly shells, black
   joints. They take shape from the wrist up with a glowing edge, and fade
   out when you look up. */
function robotHandMat(color, glow, uniforms) {
  const m = new THREE.MeshStandardMaterial({
    color, roughness: 0.45, metalness: 0.08, flatShading: true, transparent: true,
    emissive: color, emissiveIntensity: glow
  });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms || handUniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vHP;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvHP = mvPosition.xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vHP; uniform float uReveal; uniform float uAlpha; uniform float uTime; uniform vec3 uColor;
        float hh(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
        float k = (vHP.y + 0.36) / 0.36 + hh(floor(vHP * 160.0)) * 0.22;
        float thr = uReveal * 1.45;
        if (k > thr) discard;
        float edge = 1.0 - smoothstep(0.0, 0.12, thr - k);`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
        float fres = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.0);
        gl_FragColor.rgb += uColor * (fres * 0.6 + edge * 2.2) + vec3(edge * 0.8);
        gl_FragColor.a *= uAlpha;`);
  };
  return m;
}
const handUniforms = {
  uReveal: { value: 0 }, uAlpha: { value: 1 }, uTime: skyUniforms.uTime, uColor: { value: new THREE.Color(0x8fd8ff) }
};
const HAND_WHITE = robotHandMat(0xeef0f2, 0.22);
const HAND_BLACK = robotHandMat(0x1b1e24, 0.05);

/* A robot hand: palm plate, four two-part fingers on black joints, thumb,
   wrist joint and a six-sided forearm. side = 1 right hand, −1 left. */
function buildHand(side) {
  const g = new THREE.Group();
  const part = (geo, mat = HAND_WHITE) => { const m = new THREE.Mesh(geo, mat); m.renderOrder = 50; return m; };
  const palm = part(new THREE.BoxGeometry(0.078, 0.082, 0.022));
  palm.position.y = 0.004;
  g.add(palm);
  // a black panel line across the back of the hand
  const seam = part(new THREE.BoxGeometry(0.06, 0.006, 0.024), HAND_BLACK);
  seam.position.y = -0.012;
  g.add(seam);
  const wrist = part(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 10), HAND_BLACK);
  wrist.rotation.z = Math.PI / 2;
  wrist.position.y = -0.045;
  g.add(wrist);
  const arm = part(new THREE.CylinderGeometry(0.03, 0.026, 0.24, 6));
  arm.position.set(0, -0.18, -0.006);
  g.add(arm);
  const cuff = part(new THREE.CylinderGeometry(0.031, 0.031, 0.012, 6), HAND_BLACK);
  cuff.position.set(0, -0.075, -0.006);
  g.add(cuff);
  const fingers = [];
  const lengths = [0.066, 0.074, 0.07, 0.054];
  lengths.forEach((L, i) => {
    const root = new THREE.Group();
    root.position.set(side * (0.028 - i * 0.0187), 0.047, 0);
    root.rotation.z = -side * (1.5 - i) * 0.06;
    const knuckle = part(new THREE.SphereGeometry(0.0085, 8, 6), HAND_BLACK);
    root.add(knuckle);
    const a = L * 0.55;
    const b = L * 0.45;
    const seg1 = part(new THREE.BoxGeometry(0.0145, a - 0.006, 0.015));
    seg1.position.y = a / 2 + 0.002;
    root.add(seg1);
    const joint = new THREE.Group();
    joint.position.y = a + 0.003;
    const jball = part(new THREE.SphereGeometry(0.0075, 8, 6), HAND_BLACK);
    joint.add(jball);
    const seg2 = part(new THREE.BoxGeometry(0.013, b - 0.006, 0.014));
    seg2.position.y = b / 2 + 0.002;
    joint.add(seg2);
    const tip = part(new THREE.BoxGeometry(0.011, 0.006, 0.01), HAND_BLACK);
    tip.position.set(0, b - 0.002, 0.004);
    joint.add(tip);
    root.add(joint);
    g.add(root);
    fingers.push({ root, joint, i });
  });
  const thumb = new THREE.Group();
  thumb.position.set(side * 0.04, -0.022, 0.008);
  thumb.rotation.z = -side * 0.7;
  thumb.rotation.y = side * 0.45;
  thumb.add(part(new THREE.SphereGeometry(0.0095, 8, 6), HAND_BLACK));
  const t1 = part(new THREE.BoxGeometry(0.017, 0.036, 0.016));
  t1.position.y = 0.02;
  thumb.add(t1);
  const tj = new THREE.Group();
  tj.position.y = 0.04;
  tj.add(part(new THREE.SphereGeometry(0.008, 8, 6), HAND_BLACK));
  const t2 = part(new THREE.BoxGeometry(0.015, 0.026, 0.014));
  t2.position.y = 0.015;
  tj.add(t2);
  thumb.add(tj);
  g.add(thumb);
  return { group: g, fingers, thumb, tj, side };
}

const hands = new THREE.Group();
const handL = buildHand(-1);
const handR = buildHand(1);
hands.add(handL.group, handR.group);
hands.visible = false;
/* The hands are drawn in a second pass on top of the room, like in games,
   so they never sink into a wall; they get their own soft light. */
const vmScene = new THREE.Scene();
const vmCam = new THREE.PerspectiveCamera();
const vmHemi = new THREE.HemisphereLight(0xdfe8ff, 0x1a2233, 1.2);
const vmKey = new THREE.DirectionalLight(0xffffff, 1.5);
vmKey.position.set(0.5, 1, 0.9);
vmScene.add(vmHemi, vmKey, hands);

/* The rest of the robot body (Yusu's concept: white shells, black joints):
   you see it when you look down, and the legs swing as you walk. */
// the body is always fully there (the arrival only builds up the hands)
const bodyUniforms = { uReveal: { value: 10 }, uAlpha: { value: 1 }, uTime: skyUniforms.uTime, uColor: handUniforms.uColor };
const BODY_WHITE = robotHandMat(0xeef0f2, 0.1, bodyUniforms);
const BODY_BLACK = robotHandMat(0x1b1e24, 0.03, bodyUniforms);
function buildBody() {
  const g = new THREE.Group();
  const part = (geo, mat = BODY_WHITE) => new THREE.Mesh(geo, mat);
  const add = (m, x, y, z, parent = g) => { m.position.set(x, y, z); parent.add(m); return m; };
  const TZ = 0.1; // chest a little behind the eyes, so you look past it at your feet
  const torso = add(part(new THREE.CylinderGeometry(0.15, 0.12, 0.34, 6)), 0, 1.08, TZ);
  torso.scale.z = 0.7;
  add(part(new THREE.BoxGeometry(0.18, 0.012, 0.012), BODY_BLACK), 0, 1.15, TZ - 0.15 * 0.7 * 0.92);
  add(part(new THREE.CylinderGeometry(0.125, 0.125, 0.045, 6), BODY_BLACK), 0, 0.89, TZ).scale.z = 0.72;
  add(part(new THREE.CylinderGeometry(0.13, 0.105, 0.12, 6)), 0, 0.81, TZ * 0.5).scale.z = 0.75;
  for (const sx of [-1, 1]) add(part(new THREE.SphereGeometry(0.055, 8, 6), BODY_BLACK), sx * 0.19, 1.22, TZ);
  const legs = [-1, 1].map((sx) => {
    const hip = add(new THREE.Group(), sx * 0.085, 0.77, 0);
    add(part(new THREE.SphereGeometry(0.05, 8, 6), BODY_BLACK), 0, 0, 0, hip);
    add(part(new THREE.CylinderGeometry(0.056, 0.046, 0.33, 6)), 0, -0.19, 0, hip);
    const knee = add(new THREE.Group(), 0, -0.38, 0, hip);
    add(part(new THREE.SphereGeometry(0.047, 8, 6), BODY_BLACK), 0, 0, 0, knee);
    add(part(new THREE.CylinderGeometry(0.046, 0.038, 0.31, 6)), 0, -0.18, 0, knee);
    add(part(new THREE.BoxGeometry(0.09, 0.05, 0.19)), 0, -0.36, -0.045, knee);
    return { hip, knee, sx };
  });
  g.visible = false;
  scene.add(g);
  return { group: g, legs };
}
const body = buildBody();

/* where the hands rest while you walk around: low in the corners, relaxed */
const VM = { x: 0.21, y: -0.215, z: -0.46, rx: -0.55, ry: 0.4, rz: 0.25, turn: Math.PI, rest: 0.85, scale: 0.9 };
function vmLayout() {
  const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 0.42;
  return { x: Math.min(VM.x, halfW * 0.66), scale: VM.scale * Math.min(1, halfW / 0.24), halfW };
}
function poseHands(lift, curl, time, blend = 0) {
  // keep both hands inside narrow (portrait) screens
  const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 0.42;
  const x = Math.min(0.12, halfW * 0.52);
  const scale = Math.min(1, halfW / 0.2);
  const L = vmLayout();
  const mix = (a, b) => a + (b - a) * blend;
  for (const h of [handL, handR]) {
    const sway = Math.sin(time * 1.3 + h.side) * 0.006;
    h.group.scale.setScalar(mix(scale, L.scale));
    h.group.position.set(h.side * mix(x, L.x), mix(-0.14 - lift + sway, VM.y), mix(-0.42, VM.z));
    h.group.rotation.set(mix(-0.25, VM.rx), mix(0, VM.turn) - h.side * mix(0.22, VM.ry), h.side * mix(0.28, VM.rz));
    h.fingers.forEach((f) => {
      const c = curl * (0.8 + f.i * 0.12);
      f.root.rotation.x = c * 0.65;
      f.joint.rotation.x = c * 0.95;
    });
    h.tj.rotation.x = curl * 0.5;
    h.thumb.rotation.x = curl * 0.3;
  }
}

/* After the arrival the hands stay with you, as in first-person games:
   they bob with your steps, lag a little behind when you turn, and the
   right hand points at whatever you click – a light ping marks the spot. */
const vm = { away: 1, walk: 0, swayX: 0, swayY: 0, lastYaw: 0, lastPitch: 0, point: -1, last: new THREE.Vector3(), speed: 0 };
function stepViewmodel(dt, time) {
  const moved = Math.hypot(state.pos.x - vm.last.x, state.pos.z - vm.last.z);
  vm.last.copy(state.pos);
  vm.speed += (Math.min(10, moved / Math.max(dt, 0.001)) - vm.speed) * Math.min(1, dt * 8);
  const amt = clamp01(vm.speed / 6) * (reduceMotion ? 0.3 : 1);
  vm.walk += dt * (2 + vm.speed * 1.3);

  // the body below you: follows position and heading, legs swing
  body.group.visible = state.started || (state.arriving && state.arriving.phase === 'hands');
  if (body.group.visible) {
    body.group.position.set(state.pos.x, state.pos.y - 1.6 + state.jumpY + state.bob * 0.6, state.pos.z);
    body.group.rotation.y = state.yaw;
    const air = clamp01(state.jumpY * 2);
    for (const l of body.legs) {
      const ph = vm.walk + (l.sx > 0 ? Math.PI : 0);
      l.hip.rotation.x = Math.sin(ph) * 0.55 * amt * (1 - air) - air * 0.35;
      l.knee.rotation.x = (Math.max(0, -Math.cos(ph)) * 0.7 * amt) * (1 - air) + air * 0.6;
    }
  }
  if (state.arriving) return; // the arrival poses the hands itself

  const show = state.started && panel.hidden;
  vm.away += ((show ? 0 : 1) - vm.away) * Math.min(1, dt * (show ? 3.5 : 9));
  hands.visible = vm.away < 0.985;
  if (!hands.visible) return;

  // turning: the hands trail behind a little
  let dyaw = state.yaw - vm.lastYaw;
  dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
  const dpitch = state.pitch - vm.lastPitch;
  vm.lastYaw = state.yaw;
  vm.lastPitch = state.pitch;
  const k = Math.min(1, dt * 7);
  vm.swayX += (THREE.MathUtils.clamp(dyaw / Math.max(dt, 0.001) * 0.012, -0.045, 0.045) - vm.swayX) * k;
  vm.swayY += (THREE.MathUtils.clamp(-dpitch / Math.max(dt, 0.001) * 0.01, -0.035, 0.035) - vm.swayY) * k;

  // the pointing gesture: up quickly, hold, back down
  let e = 0;
  if (vm.point >= 0) {
    vm.point += dt / 0.95;
    if (vm.point >= 1) vm.point = -1;
    else e = vm.point < 0.2 ? ease(vm.point / 0.2) : vm.point < 0.6 ? 1 : 1 - ease((vm.point - 0.6) / 0.4);
  }

  const { x: x0, scale } = vmLayout();
  for (const h of [handL, handR]) {
    const right = h.side > 0;
    const p = right ? e : 0;
    const ph = vm.walk + (right ? Math.PI : 0);
    const bob = Math.sin(ph * 2) * 0.011 * amt + Math.sin(time * 1.4 + h.side) * 0.004;
    const swing = Math.cos(ph) * 0.007 * amt;
    h.group.scale.setScalar(scale);
    h.group.position.set(
      h.side * x0 * (1 - p * 0.5) + swing - vm.swayX,
      VM.y + bob - vm.swayY + p * 0.12 - vm.away * 0.34,
      VM.z - p * 0.06
    );
    h.group.rotation.set(VM.rx - p * 0.65 + vm.swayY * 2, VM.turn - h.side * VM.ry * (1 - p), h.side * VM.rz * (1 - p));
    const rest = VM.rest;
    h.fingers.forEach((f) => {
      // pointing: the index finger stretches, the others close
      const c = f.i === 0 ? rest * (1 - p) : rest + (1.25 - rest) * p;
      f.root.rotation.x = c * (0.8 + f.i * 0.12) * 0.65;
      f.joint.rotation.x = c * (0.8 + f.i * 0.12) * 0.95;
    });
    h.tj.rotation.x = rest * 0.5 + p * 0.5;
    h.thumb.rotation.x = rest * 0.3 + p * 0.5;
  }
}

function pointFx(hit) {
  if (!hit) return;
  const n = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 1, 0);
  const color = new THREE.Color(ROOMS[state.room] ? ROOMS[state.room].accent : 0x8fd8ff);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.035, 0.055, 32), mat);
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16), mat);
  const g = new THREE.Group();
  g.add(ring, dot);
  g.position.copy(hit.point).addScaledVector(n, 0.01);
  g.lookAt(hit.point.clone().add(n));
  scene.add(g);
  const fx = { t: 0, update(dt) {
    fx.t += dt;
    const k = fx.t / 0.6;
    ring.scale.setScalar(1 + k * 5);
    mat.opacity = Math.max(0, 1 - k);
    if (k >= 1) { scene.remove(g); ring.geometry.dispose(); dot.geometry.dispose(); mat.dispose(); return false; }
    return true;
  } };
  effects.push(fx);
  sound.ping();
}
function pointAt(hit) {
  if (vm.away > 0.5) return;
  vm.point = 0;
  pointFx(hit);
}

/* Ring, light column and sparks where someone lands. */
const effects = [];
function beamFx(pos, color) {
  const group = new THREE.Group();
  group.position.set(pos.x, 0, pos.z);
  const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.5, 64), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  group.add(ring);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 7, 40, 1, true), beamMaterial(color, 1.0));
  column.position.y = 3.5;
  group.add(column);
  const n = 90;
  const pts = new Float32Array(n * 3);
  const vel = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.2 + Math.random() * 0.6;
    pts.set([Math.cos(a) * r, Math.random() * 0.4, Math.sin(a) * r], i * 3);
    vel.push(0.8 + Math.random() * 2.8);
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const sparkMat = new THREE.PointsMaterial({ map: DOT, color, size: 0.09, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  group.add(sparks);
  scene.add(group);
  const fx = { t: 0, update(dt) {
    fx.t += dt;
    const k = fx.t / 1.6;
    ring.scale.setScalar(1 + k * 9);
    ringMat.opacity = Math.max(0, 1 - k);
    column.material.uniforms.uStrength.value = Math.max(0, 1 - k * 1.3) * 1.1;
    column.scale.set(1 - k * 0.6, 1, 1 - k * 0.6);
    const a = sparkGeo.attributes.position;
    for (let i = 0; i < n; i++) a.setY(i, a.getY(i) + vel[i] * dt);
    a.needsUpdate = true;
    sparkMat.opacity = Math.max(0, 1 - k);
    if (k >= 1) {
      scene.remove(group);
      ring.geometry.dispose(); ringMat.dispose(); column.geometry.dispose(); sparkGeo.dispose(); sparkMat.dispose();
      const bi = beams.indexOf(column.material);
      if (bi >= 0) beams.splice(bi, 1);
      column.material.dispose();
      return false;
    }
    return true;
  } };
  effects.push(fx);
}

function entryOf(id) {
  const e = ENTRY[id] || ENTRY.foyer;
  const pos = new THREE.Vector3(...e.pos);
  const look = new THREE.Vector3(...e.look);
  return {
    pos, look,
    yaw: yawTo(look.x - pos.x, look.z - pos.z),
    pitch: Math.atan2(look.y - EYE, Math.hypot(look.x - pos.x, look.z - pos.z))
  };
}

/* Quick beam between rooms (room bar, floor plan). */
function beamTo(id, then) {
  if (!ENTRY[id]) return;
  if (id === 'kunst' && !ART_OPEN && !then) then = () => openArt(null);
  hidePanel();
  if (reduceMotion) {
    const e = entryOf(id);
    state.pos.copy(e.pos); state.yaw = e.yaw; state.pitch = e.pitch; state.glide = null;
    if (then) then();
    return;
  }
  state.glide = null;
  state.flashTarget = 1;
  state.fovKick = 1;
  state.beam = { id, t: 0, jumped: false, then };
  sound.beam();
}

function stepBeam(dt) {
  const b = state.beam;
  b.t += dt;
  if (!b.jumped && b.t >= 0.16) {
    const e = entryOf(b.id);
    state.pos.copy(e.pos); state.yaw = e.yaw; state.pitch = e.pitch;
    b.jumped = true;
    state.glide = null; // a walk planned in the old room must not continue here
    state.vel.set(0, 0, 0);
    state.flashTarget = 0;
    beamFx(e.pos, ROOMS[b.id].accent);
    updateRoom();
    if (!b.then) placeCard(b.id);
  }
  if (b.t >= 0.5) {
    state.beam = null;
    if (b.then) b.then();
  }
}

/* The first arrival: from the welcome view into the chosen room. */
function arrive(id, then) {
  const e = entryOf(id);
  if (reduceMotion) {
    state.pos.copy(e.pos); state.yaw = e.yaw; state.pitch = e.pitch;
    finishArrival(then);
    return;
  }
  // zoom into the planet, a flash, then you take shape in the room;
  // been here before: a shorter zoom and straight in, no hands
  let seen = false;
  try { seen = localStorage.getItem('oh-arrived') === '1'; } catch (err) { /* private mode */ }
  state.arriving = { phase: 'zoom', t: 0, e, then, id, fov: camera.fov, quick: seen };
}

/* Field of view for the welcome view: the planet fills a good part of the
   screen, on wide screens and on phones held upright. */
const PLANET_ANGLE = 2 * Math.atan(24 / 150);
function introFov() {
  const aspect = window.innerWidth / window.innerHeight;
  const share = aspect < 1 ? 0.84 : 0.5; // of the width on phones, of the height elsewhere
  const v = aspect < 1
    ? 2 * Math.atan(Math.tan(PLANET_ANGLE / share / 2) / aspect)
    : PLANET_ANGLE / share;
  return THREE.MathUtils.radToDeg(v);
}
/* Look at the planet, a little above it, so it sits below the title. */
function lookAtPlanet(fovDeg, time) {
  const drift = reduceMotion ? 0 : Math.sin(time * 0.07) * 0.015;
  state.yaw = yawTo(PLANET_DIR.x, PLANET_DIR.z) + drift;
  const base = Math.atan2(PLANET_DIR.y, Math.hypot(PLANET_DIR.x, PLANET_DIR.z));
  const lift = window.innerWidth < window.innerHeight ? 0.34 : 0.31;
  state.pitch = base + THREE.MathUtils.degToRad(fovDeg) * lift;
}

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function stepArrival(dt, time) {
  const a = state.arriving;
  a.t += dt;
  if (a.phase === 'zoom') {
    const T = a.quick ? 1.2 : 2.9;
    const k = clamp01(a.t / T);
    const kk = k * k * k;
    // the planet moves to the centre and grows until it fills the screen
    const start = a.fov;
    a.zoomFov = start + (2.2 - start) * kk;
    const base = Math.atan2(PLANET_DIR.y, Math.hypot(PLANET_DIR.x, PLANET_DIR.z));
    const lift = window.innerWidth < window.innerHeight ? 0.34 : 0.31;
    state.yaw = yawTo(PLANET_DIR.x, PLANET_DIR.z);
    state.pitch = base + THREE.MathUtils.degToRad(start) * lift * (1 - ease(k));
    if (k > 0.78) state.flashTarget = 1;
    warp.step(ease(k), dt);
    state.shake = Math.max(state.shake, kk * 0.35);
    if (!a.quick) titleEl.classList.toggle('is-on', k > 0.06 && k < 0.82);
    if (k >= 1) {
      a.zoomFov = null;
      state.flash = 1;
      warp.step(0, dt);
      titleEl.classList.remove('is-on');
      impact();
      // later visits: straight into the room
      if (a.quick) { finishArrival(a.then); return; }
      // out of the light you take shape in the room, still dim; the room
      // powers up when you look up from your hands
      a.phase = 'hands';
      a.t = 0;
      state.pos.copy(a.e.pos);
      state.yaw = a.e.yaw;
      state.pitch = -0.95;
      state.flashTarget = 0;
      state.fovKick = 0.6;
      state.light = 0.3;
      state.lightTarget = 0.3;
      hands.visible = true;
      handUniforms.uReveal.value = 0;
      handUniforms.uAlpha.value = 1;
      beamFx(a.e.pos, ROOMS[a.id].accent);
      sound.beam();
      updateRoom();
    }
    return;
  }
  // hands: take shape, flex once, then you look up into the room
  const t = a.t;
  handUniforms.uReveal.value = clamp01(t / 1.1);
  const flex = clamp01((t - 0.9) / 1.2);
  const curl = Math.sin(flex * Math.PI) * 0.75 + 0.08;
  const up = ease(clamp01((t - 2.1) / 1.6));
  if (t > 2.1 && state.lightTarget < 1) { state.lightTarget = 1; sound.powerUp(); }
  poseHands(0, curl * (1 - up) + VM.rest * up, time, up);
  handUniforms.uAlpha.value = 1;
  state.yaw = a.e.yaw + Math.sin(t * 0.8) * 0.04 * (1 - up);
  state.pitch = -0.95 + (a.e.pitch + 0.95) * up;
  if (t >= 3.7) finishArrival(a.then);
}

/* A click or key skips the arrival, once it has properly begun. */
const canSkip = () => !!state.arriving && (state.arriving.phase === 'zoom' || state.arriving.t > 0.4);

function finishArrival(then) {
  const a = state.arriving;
  if (a && a.phase !== 'hands') {
    state.pos.copy(a.e.pos);
    beamFx(a.e.pos, ROOMS[a.id].accent);
    sound.beam();
  }
  if (a) { state.yaw = a.e.yaw; state.pitch = a.e.pitch; }
  state.arriving = null;
  warp.step(0, 0);
  titleEl.classList.remove('is-on');
  try { localStorage.setItem('oh-arrived', '1'); } catch (err) { /* private mode */ }
  state.flashTarget = 0;
  state.lightTarget = 1;
  // after the full arrival the hands simply stay; otherwise they come up
  vm.away = a && a.phase === 'hands' ? 0 : 1;
  vm.lastYaw = state.yaw;
  vm.lastPitch = state.pitch;
  vm.last.copy(state.pos);
  handUniforms.uReveal.value = 1;
  handUniforms.uAlpha.value = 1;
  state.started = true;
  document.body.classList.remove('is-cinematic');
  updateRoom();
  const next = then || (a && a.then);
  if (state.room === 'robotics' && !next) greet();
  else if (next) setTimeout(showHint, 1500);
  else { placeCard(state.room); setTimeout(showHint, 3300); }
  if (next) next();
}

/* Yusu notices you and says hello. */
let greeted = false;
function greet() {
  if (greeted) { showHint(); return; }
  greeted = true;
  const lines = [t('greet1'), t('greet2')];
  let i = 0;
  const say = () => {
    if (i >= lines.length) { subtitle(''); showHint(); return; }
    if (eyes) eyes.greet(i === 0 ? 'happy' : 'neutral');
    sound.chatter(i === 0 ? 1.6 : 2.2);
    subtitle('<b>Yusu:</b> ' + esc(lines[i]));
    i++;
    setTimeout(say, i === 1 ? 3000 : 4400);
  };
  setTimeout(say, 450);
}

/* Name of the room, like a location card in a film. */
function placeCard(id) {
  if (!id || !TEXT.en[id]) return;
  const sub = { foyer: '', robotics: 'roboticsSub', games: 'gamesSub', werkstatt: 'werkstattSub', kunst: 'kunstSub', apps: 'appsSub' }[id];
  subtitle('<b>' + esc(t(id)) + '</b>' + (sub ? ' · ' + esc(t(sub)) : ''), 2600);
}

const subtitleEl = document.querySelector('[data-subtitle]');
let subtitleTimer = 0;
function subtitle(html, ms) {
  clearTimeout(subtitleTimer);
  if (!html) {
    subtitleEl.classList.add('is-fading');
    subtitleTimer = setTimeout(() => { subtitleEl.hidden = true; }, 500);
    return;
  }
  subtitleEl.innerHTML = html;
  subtitleEl.hidden = false;
  subtitleEl.classList.remove('is-fading');
  if (ms) subtitleTimer = setTimeout(() => subtitle(''), ms);
}

let hinted = false;
function showHint() {
  if (hinted) return;
  hinted = true;
  toast(coarse ? t('hintTouch') : isLocked() ? t('hintLook') : (!canLock || lockBlocked) ? t('hintDrag') : t('hintMouse'), 6500);
}

/* --------------------------------------------------------------------------
   Sound, made on the spot with the Web Audio API (no files): short effects
   only (beam, impact, ping, Yusu's little voice), no background sound.
   Off with the speaker button; the choice is remembered.
   -------------------------------------------------------------------------- */
const sound = (() => {
  const btn = document.querySelector('[data-sound]');
  let ctx = null;
  let master = null;
  let enabled = true;
  try { enabled = localStorage.getItem('oh-sound') !== 'off'; } catch (e) { /* private mode */ }
  const show = () => { if (btn) btn.setAttribute('aria-pressed', String(enabled)); };
  show();
  const live = () => ctx && enabled && ctx.state === 'running';

  function init() {
    if (ctx || !enabled) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ctx = new AC(); } catch (e) { ctx = null; return; }
    master = ctx.createGain();
    master.gain.value = 0;
    const soft = ctx.createBiquadFilter();
    soft.type = 'lowpass';
    soft.frequency.value = 1400;
    master.connect(soft).connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.5);
  }
  function tone(type, f0, f1, at, len, vol) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, at);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, at + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + Math.min(0.08, len / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(g).connect(master);
    o.start(at);
    o.stop(at + len + 0.05);
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (enabled) ctx.resume();
  });
  if (btn) btn.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem('oh-sound', enabled ? 'on' : 'off'); } catch (e) { /* private mode */ }
    if (enabled) {
      init();
      if (ctx) {
        ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.6);
      }
    } else if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    }
    show();
    btn.blur();
  });

  return {
    /* call from a click or key press: browsers only allow sound after one */
    unlock() {
      if (!enabled) return;
      init();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    },
    beam() {
      if (!live()) return;
      const at = ctx.currentTime;
      tone('sine', 392, 330, at, 0.9, 0.05);
      tone('sine', 659, 659, at + 0.08, 1.2, 0.015);
    },
    impact() {
      if (!live()) return;
      tone('sine', 72, 40, ctx.currentTime, 1.0, 0.2);
    },
    ping() {
      if (!live()) return;
      tone('sine', 660, 660, ctx.currentTime, 0.35, 0.025);
    },
    powerUp() {
      if (!live()) return;
      const at = ctx.currentTime;
      tone('sine', 110, 165, at, 1.6, 0.05);
      tone('sine', 220, 330, at + 0.2, 1.4, 0.02);
    },
    chatter(len) {
      if (!live()) return;
      let at = ctx.currentTime + 0.05;
      const end = at + len;
      while (at < end) {
        const f = 330 + Math.random() * 220;
        const d = 0.08 + Math.random() * 0.08;
        tone('sine', f, f * (0.9 + Math.random() * 0.2), at, d, 0.03);
        at += d + 0.03 + Math.random() * 0.08;
      }
    }
  };
})();

/* --------------------------------------------------------------------------
   Info panel
   -------------------------------------------------------------------------- */
let panelBuilder = null;

function showPanel(build) {
  panelBuilder = build;
  toastEl.hidden = true;
  panelBody.innerHTML = build();
  panel.hidden = false;
  document.body.classList.add('has-panel');
  panel.scrollTop = 0;
  unlockMouse();
  panel.focus({ preventScroll: true });
}
function hidePanel() {
  panel.hidden = true;
  document.body.classList.remove('has-panel');
  panelBuilder = null;
  panelBody.innerHTML = '';
  if (location.hash.startsWith('#project-')) history.replaceState(null, '', location.pathname + location.search);
}

function mediaHTML(item, controls, noCaption) {
  if (item.video) {
    return `<figure class="g-panel-media"><video src="${esc(item.video)}" poster="${esc(item.poster)}" ${controls ? 'controls' : ''} muted loop playsinline autoplay aria-label="${esc(pick(item.alt))}"></video>` +
      (item.caption && !noCaption ? `<figcaption>${esc(pick(item.caption))}</figcaption>` : '') + '</figure>';
  }
  if (!item.src) return '';
  return `<figure class="g-panel-media"><img src="${esc(item.src)}" alt="${esc(pick(item.alt))}" loading="lazy">` +
    (item.caption && !noCaption ? `<figcaption>${esc(pick(item.caption))}</figcaption>` : '') + '</figure>';
}

function openProject(p) {
  if (!p) return;
  showPanel(() => {
    const l = lang();
    const copy = p[l] || p.en || {};
    const facts = (copy.facts || []).map((f) => `<li>${esc(f)}</li>`).join('');
    const buttons = R ? [
      R.buttonHTML(p.demo, p.demo && p.demo.label, true, l),
      R.buttonHTML(p.build, R.LABELS.build, !p.demo, l),
      R.buttonHTML(p.buy, R.LABELS.buy, false, l),
      R.buttonHTML(p.follow, p.follow && p.follow.label, false, l),
      ...(p.actions || []).map((a) => R.buttonHTML(a, a.label, a.primary, l))
    ].join('') : '';
    const kicker = R && R.GROUPS[p.group] ? pick(R.GROUPS[p.group]) : '';
    return (p.image && p.image.src ? mediaHTML({ src: p.image.src, alt: p.image.alt }) : '') +
      `<p class="g-panel-kicker">${esc(kicker)}</p>` +
      (R ? R.statusHTML(p, l) : '') +
      `<h2 id="panel-title">${esc(copy.title)}</h2>` +
      (copy.tagline ? `<p class="tagline">${esc(copy.tagline)}</p>` : '') +
      `<p>${esc(copy.text)}</p>` +
      (facts ? `<ul class="facts">${facts}</ul>` : '') +
      (buttons ? `<div class="actions">${buttons}</div>` : '') +
      `<a class="g-more" href="${p.link ? esc(p.link) : 'tools.html#project-' + esc(p.id)}">${esc(t('allStages'))}</a>`;
  });
}

function openMedia(item, { kicker = '', back = null, text = '' } = {}) {
  showPanel(() => mediaHTML(item, true, true) +
    (kicker ? `<p class="g-panel-kicker">${esc(kicker)}</p>` : '') +
    `<h2 id="panel-title">${esc(pick(item.caption) || pick(item.alt))}</h2>` +
    (text ? `<p>${esc(text)}</p>` : (item.caption && item.alt ? `<p>${esc(pick(item.alt))}</p>` : '')) +
    (back ? `<div class="actions"><button class="btn" type="button" data-open-project="${esc(back.id)}">${esc(back.id === 'yusu' ? t('toProject') : '← ' + ((back[lang()] || back.en).title))}</button></div>` : ''));
}

function openText(kind) {
  showPanel(() => {
    if (kind === 'values') {
      return `<p class="g-panel-kicker">OneHumanity Labs</p><h2 id="panel-title">${esc(t('values'))}</h2><div class="g-values">` +
        ['1', '2', '3'].map((n) => `<div><h3>${esc(t('v' + n))}</h3><p>${esc(t('v' + n + 't'))}</p></div>`).join('') + '</div>';
    }
    if (kind === 'about') {
      return mediaHTML({ src: 'img/marcello.jpg', alt: { de: 'Marcello an seinem Schreibtisch im Aachener Studio', en: 'Marcello at his desk in the Aachen studio' } }) +
        `<p class="g-panel-kicker">${esc(t('aboutKicker'))}</p><h2 id="panel-title">${esc(t('aboutTitle'))}</h2><p>${esc(t('aboutText'))}</p>` +
        `<div class="actions">${linkButton(LINKS.instagram, 'Instagram')}${linkButton(LINKS.youtube, 'YouTube')}${linkButton(LINKS.github, 'GitHub')}</div>`;
    }
    return `<p class="g-panel-kicker">One Planet, One Humanity</p><h2 id="panel-title">OneHumanity Labs</h2><p>${esc(t('welcomeLead'))}</p>` +
      `<div class="actions"><button class="btn primary" type="button" data-go-room="robotics">Robotics →</button>${linkButton('uebersicht.html', document.querySelector('[data-i18n="introList"]')?.textContent || 'List', false)}</div>`;
  });
}

function linkButton(href, label, primary) {
  const external = /^https?:/.test(href);
  return `<a class="btn${primary ? ' primary' : ''}" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${esc(label)}</a>`;
}

function openLinks(only) {
  const all = [
    ['youtube', 'ytLabel', 'ytHint'], ['instagram', 'igLabel', 'igHint'], ['github', 'ghLabel', 'ghHint'],
    ['makerworld', 'mwLabel', 'mwHint'], ['itch', 'itchLabel', 'itchHint'], ['stickers', 'stickerLabel', 'stickerHint'],
    ['etsy', 'etsyLabel', 'etsyHint']
  ].filter(([k]) => !only || only.includes(k));
  showPanel(() => `<p class="g-panel-kicker">${esc(t('join'))}</p><h2 id="panel-title">${esc(only ? t(all[0][1]) : t('joinTitle'))}</h2>` +
    `<p>${esc(only ? t(all[0][2]) : t('joinText'))}</p><div class="g-links">` +
    all.map(([k, label], i) => linkButton(LINKS[k], t(label), i === 0)).join('') + '</div>');
}

function openArt(art) {
  showPanel(() => {
    if (!art) {
      return `<p class="g-panel-kicker">${esc(t('kunst'))}</p><h2 id="panel-title">${esc(t('artSoon'))}</h2><p>${esc(t('artSoonText'))}</p>` +
        `<div class="actions">${linkButton(ART_PROFILE, t('onInstagram'), true)}</div>`;
    }
    const copy = art[lang()] || art.en || {};
    return mediaHTML({ src: art.src, alt: copy.title }) +
      `<p class="g-panel-kicker">${esc(t('kunst'))}${art.year ? ' · ' + esc(art.year) : ''}</p><h2 id="panel-title">${esc(copy.title)}</h2>` +
      (copy.text ? `<p>${esc(copy.text)}</p>` : '') +
      `<div class="actions">${linkButton(art.link || ART_PROFILE, t('onInstagram'), true)}</div>`;
  });
}

panel.addEventListener('click', (e) => {
  const projectBtn = e.target.closest('[data-open-project]');
  if (projectBtn) {
    const p = projectById(projectBtn.getAttribute('data-open-project'));
    const ex = exhibits.find((x) => x.id === 'project-' + p.id);
    if (ex) visit(ex); else openProject(p);
    return;
  }
  const roomBtn = e.target.closest('[data-go-room]');
  if (roomBtn) { hidePanel(); beamTo(roomBtn.getAttribute('data-go-room')); }
});
document.querySelector('[data-panel-close]').addEventListener('click', hidePanel);

/* --------------------------------------------------------------------------
   Walking: rectangles you can stand in, circles you can't
   -------------------------------------------------------------------------- */
function canStand(x, z) {
  const inside = walkRects.some(([a, b, c, d]) => x >= a && x <= b && z >= c && z <= d);
  if (!inside) return false;
  return !obstacles.some((o) => (x - o.x) ** 2 + (z - o.z) ** 2 < o.r * o.r);
}

function tryMove(dx, dz) {
  const p = state.pos;
  if (canStand(p.x + dx, p.z + dz)) { p.x += dx; p.z += dz; return true; }
  if (canStand(p.x + dx, p.z)) { p.x += dx; return true; }
  if (canStand(p.x, p.z + dz)) { p.z += dz; return true; }
  return false;
}

function roomAt(x, z) {
  return ROOM_ORDER.find((id) => {
    const r = ROOMS[id];
    return Math.abs(x - r.x) <= r.w / 2 && Math.abs(z - r.z) <= r.d / 2;
  }) || state.room;
}

/* Nearest point you can stand on, walking back from `to` towards `from`. */
function reachable(from, to) {
  if (canStand(to.x, to.z)) return to.clone();
  for (let k = 1; k <= 24; k++) {
    const p = to.clone().lerp(from, k / 24);
    if (canStand(p.x, p.z)) return p;
  }
  return from.clone();
}

/* Waypoints: through the passages, and around obstacles in the way. */
function planPath(from, to) {
  const a = roomAt(from.x, from.z);
  const b = roomAt(to.x, to.z);
  const pts = [];
  if (a !== b) {
    // up from a to the first room both share, then down to b
    const ca = chainOf(a);
    const cb = chainOf(b);
    const common = ca.find((id) => cb.includes(id));
    for (const id of ca.slice(0, ca.indexOf(common))) pts.push(PASSAGES[id].inRoom.clone(), PASSAGES[id].inFoyer.clone());
    for (const id of cb.slice(0, cb.indexOf(common)).reverse()) pts.push(PASSAGES[id].inFoyer.clone(), PASSAGES[id].inRoom.clone());
  }
  pts.push(to.clone());
  const out = [];
  let prev = from;
  for (const p of pts) {
    for (const o of obstacles) {
      const dir = new THREE.Vector3().subVectors(p, prev).setY(0);
      const len = dir.length();
      if (len < 0.01) continue;
      dir.divideScalar(len);
      const rel = new THREE.Vector3(o.x - prev.x, 0, o.z - prev.z);
      const along = rel.dot(dir);
      if (along <= 0 || along >= len) continue;
      const closest = prev.clone().addScaledVector(dir, along);
      const dist = Math.hypot(closest.x - o.x, closest.z - o.z);
      if (dist < o.r + 0.2) {
        const side = new THREE.Vector3(-dir.z, 0, dir.x);
        const sign = side.dot(new THREE.Vector3(closest.x - o.x, 0, closest.z - o.z)) >= 0 ? 1 : -1;
        const detour = new THREE.Vector3(o.x, EYE, o.z).addScaledVector(side, sign * (o.r + 0.6));
        if (canStand(detour.x, detour.z)) { out.push(detour); prev = detour; }
      }
    }
    out.push(p);
    prev = p;
  }
  return out;
}

const yawTo = (dx, dz) => Math.atan2(-dx, -dz);
function shortestAngle(from, to) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return from + d;
}

function travel(to, look, done) {
  const target = reachable(state.pos, new THREE.Vector3(to.x, EYE, to.z));
  let endYaw = state.yaw;
  let endPitch = state.pitch;
  if (look) {
    endYaw = yawTo(look.x - target.x, look.z - target.z);
    endPitch = Math.atan2(look.y - EYE, Math.hypot(look.x - target.x, look.z - target.z));
  } else {
    endYaw = yawTo(target.x - state.pos.x, target.z - state.pos.z);
    endPitch = -0.05;
  }
  if (reduceMotion) {
    state.pos.copy(target);
    state.yaw = endYaw;
    state.pitch = endPitch;
    state.glide = null;
    if (done) done();
    return;
  }
  state.vel.set(0, 0, 0);
  state.glide = { points: planPath(state.pos, target), endYaw, endPitch, look: !!look, done, settle: 0 };
}

function visit(ex) {
  if (ex.onPick) return;
  const view = ex.center.clone().addScaledVector(ex.normal, ex.dist);
  travel(view, ex.center);
  if (ex.open) ex.open();
  if (ex.id.startsWith('project-')) history.replaceState(null, '', '#' + ex.id);
}

function goToRoom(id) {
  const e = ENTRY[id];
  if (!e) return;
  hidePanel();
  travel(new THREE.Vector3(...e.pos), new THREE.Vector3(...e.look));
}

/* --------------------------------------------------------------------------
   Input
   -------------------------------------------------------------------------- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const drag = { active: false, id: null, x: 0, y: 0, moved: 0, type: 'mouse' };

function hitAt(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([...pickables, ...floors, ...blockers], false);
  return hits[0] || null;
}

function pickHit(hit) {
  if (!hit) return;
  const ex = hit.object.userData.exhibit;
  if (ex) {
    if (ex.onPick) ex.onPick(hit);
    else visit(ex);
    return;
  }
  if (floors.includes(hit.object)) {
    hidePanel();
    travel(hit.point, null);
  }
}

/* Mouse look on computers, as in games: a click (or "Enter") hands the mouse
   to the view – moving it looks around, a crosshair aims, a click opens what
   it points at. Esc gives the mouse back; dragging still works without. */
const canLock = !coarse && 'requestPointerLock' in renderer.domElement;
const crossEl = document.createElement('div');
crossEl.className = 'g-cross';
crossEl.setAttribute('aria-hidden', 'true');
document.body.appendChild(crossEl);
function isLocked() { return document.pointerLockElement === renderer.domElement; }
function centerXY() {
  const r = renderer.domElement.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}
function lockMouse() {
  if (!canLock || lockBlocked || isLocked() || !panel.hidden) return;
  try {
    const p = renderer.domElement.requestPointerLock();
    if (p && p.catch) p.catch(() => {});
  } catch (err) { /* not allowed right now – dragging still works */ }
}
function unlockMouse() { if (isLocked()) document.exitPointerLock(); }
let wasLocked = false;
let lockBlocked = false; // the browser said no: stay with dragging
let everLocked = false;
// a refusal right after Esc is normal in Chrome; only a browser that never allows it counts
document.addEventListener('pointerlockerror', () => { if (!everLocked) lockBlocked = true; });
document.addEventListener('pointerlockchange', () => {
  const on = isLocked();
  document.body.classList.toggle('is-mouselook', on);
  if (on) {
    everLocked = true;
    state.hoverAt = null;
    if (state.started && hinted) toast(t('hintLook'), 4200);
  } else {
    crossEl.classList.remove('is-on');
    if (wasLocked && state.started && panel.hidden) toast(t('hintRelock'), 3200);
  }
  wasLocked = on;
});

renderer.domElement.addEventListener('pointerdown', (e) => {
  if (canSkip()) { finishArrival(); return; }
  if (!state.started) return;
  if (isLocked()) {
    if (e.button === 0 && !state.beam) { const hit = hitAt(...centerXY()); pointAt(hit); pickHit(hit); }
    return;
  }
  if (canLock && !lockBlocked && e.pointerType === 'mouse' && e.button === 0) {
    // an exhibit under the arrow still opens on release, anywhere else takes the mouse
    const hit = hitAt(e.clientX, e.clientY);
    if (!(hit && hit.object.userData.exhibit)) lockMouse();
  }
  drag.active = true;
  drag.id = e.pointerId;
  drag.x = e.clientX;
  drag.y = e.clientY;
  drag.moved = 0;
  drag.type = e.pointerType;
  try { renderer.domElement.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
});
renderer.domElement.addEventListener('pointermove', (e) => {
  if (!state.started) return;
  if (isLocked()) {
    const k = 0.0024;
    if (state.glide) { state.glide.look = false; }
    state.yaw -= (e.movementX || 0) * k;
    state.pitch = THREE.MathUtils.clamp(state.pitch - (e.movementY || 0) * k * 0.85, -1.3, 0.9);
    if (state.glide) { state.glide.endYaw = state.yaw; state.glide.endPitch = state.pitch; }
    return;
  }
  if (drag.active && e.pointerId === drag.id) {
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    if (drag.moved > 6) {
      stage.classList.add('is-dragging');
      if (state.glide && !state.glide.look) state.glide = null;
      if (state.glide) state.glide.look = false;
      // the view follows the hand: drag or swipe right = look right
      const k = drag.type === 'touch' ? 0.006 : 0.0042;
      state.yaw -= dx * k;
      state.pitch = THREE.MathUtils.clamp(state.pitch - dy * k * 0.8, -1.3, 0.9);
      if (state.glide) { state.glide.endYaw = state.yaw; state.glide.endPitch = state.pitch; }
    }
  } else if (e.pointerType === 'mouse') {
    state.hoverAt = [e.clientX, e.clientY];
  }
});
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!drag.active || e.pointerId !== drag.id) return;
  drag.active = false;
  stage.classList.remove('is-dragging');
  if (isLocked()) return; // this click only handed the mouse to the view
  if (drag.moved > 6 || state.beam) return;
  const hit = hitAt(e.clientX, e.clientY);
  pointAt(hit);
  pickHit(hit);
});
renderer.domElement.addEventListener('pointercancel', () => { drag.active = false; stage.classList.remove('is-dragging'); });
renderer.domElement.addEventListener('wheel', (e) => {
  if (!state.started) return;
  e.preventDefault();
  state.glide = null;
  const step = THREE.MathUtils.clamp(-e.deltaY * 0.006, -1.0, 1.0);
  tryMove(-Math.sin(state.yaw) * step, -Math.cos(state.yaw) * step);
}, { passive: false });

const MOVE_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
function jump() {
  if (state.jumpY > 0.001 || state.jumpV !== 0) return;
  state.jumpV = 4.4;
}
/* Touch joystick: a round knob you drag, as known from games. Left thumb
   walks, the right thumb swipes the view and taps the jump button. */
const stickEl = document.querySelector('[data-stick]');
const jumpBtn = document.querySelector('[data-jump]');
if (stickEl) {
  const knob = stickEl.querySelector('i');
  const pad = { id: null, cx: 0, cy: 0 };
  const radius = () => stickEl.offsetWidth * 0.36;
  const setStick = (dx, dy) => {
    const r = radius();
    const len = Math.hypot(dx, dy);
    if (len > r) { dx *= r / len; dy *= r / len; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    // a small dead zone so a resting thumb does not drift
    const nx = dx / r;
    const ny = dy / r;
    const m = Math.hypot(nx, ny);
    state.stick.x = m < 0.12 ? 0 : nx;
    state.stick.y = m < 0.12 ? 0 : ny;
  };
  const release = () => {
    pad.id = null;
    stickEl.classList.remove('is-active');
    knob.style.transform = '';
    state.stick.x = 0;
    state.stick.y = 0;
  };
  stickEl.addEventListener('pointerdown', (e) => {
    if (canSkip()) { finishArrival(); return; }
    if (!state.started || pad.id !== null) return;
    e.preventDefault();
    sound.unlock();
    const rect = stickEl.getBoundingClientRect();
    pad.id = e.pointerId;
    pad.cx = rect.left + rect.width / 2;
    pad.cy = rect.top + rect.height / 2;
    stickEl.classList.add('is-active');
    try { stickEl.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
    if (!panel.hidden) hidePanel();
    setStick(e.clientX - pad.cx, e.clientY - pad.cy);
  });
  stickEl.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pad.id) return;
    e.preventDefault();
    setStick(e.clientX - pad.cx, e.clientY - pad.cy);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => stickEl.addEventListener(type, (e) => { if (e.pointerId === pad.id) release(); }));
  window.addEventListener('blur', release);
}
if (jumpBtn) {
  jumpBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (canSkip()) { finishArrival(); return; }
    if (state.started) jump();
  });
}

const inField = (el) => el && el.closest && el.closest('input, textarea, select, [contenteditable]');
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hidden) { hidePanel(); return; }
  if (canSkip() && (e.code === 'Space' || e.code === 'Escape' || e.code === 'Enter')) {
    e.preventDefault();
    finishArrival();
    return;
  }
  if (!state.started || e.metaKey || e.ctrlKey || e.altKey) return;
  if (inField(e.target)) return;
  if (e.code === 'Space') {
    // space jumps – unless it is pressing a link or button in the panel
    if (e.target.closest && e.target.closest('.g-panel a, .g-panel button, .g-hud-top a, .g-hud-top button, video')) return;
    e.preventDefault();
    if (document.activeElement && document.activeElement !== document.body && !panel.contains(document.activeElement)) document.activeElement.blur();
    jump();
    return;
  }
  if (!MOVE_KEYS.includes(e.code)) return;
  if (e.target.closest && e.target.closest('.g-panel') && e.code.startsWith('Arrow')) return;
  state.keys.add(e.code);
  state.glide = null;
  if (e.code.startsWith('Arrow')) e.preventDefault();
});
window.addEventListener('keyup', (e) => {
  state.keys.delete(e.code);
  if (e.code === 'Space' && state.started && !inField(e.target) && !(e.target.closest && e.target.closest('.g-panel a, .g-panel button, .g-hud-top a, .g-hud-top button, video'))) e.preventDefault();
});
window.addEventListener('blur', () => state.keys.clear());

roomButtons.forEach((btn) => btn.addEventListener('click', () => {
  const id = btn.getAttribute('data-room');
  btn.blur();
  if (!state.started) { choose(id); return; }
  beamTo(id);
}));
document.querySelectorAll('[data-room-link]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  const id = a.getAttribute('data-room-link');
  if (!state.started) { choose(id); return; }
  beamTo(id);
}));

/* --------------------------------------------------------------------------
   Links into the gallery: #robotics, #games, #tools, #design, #kunst,
   #mitmachen, #project-<id>
   -------------------------------------------------------------------------- */
const HASH_ROOMS = {
  robotics: 'robotics', projekte: 'robotics', games: 'games', tools: 'werkstatt', design: 'werkstatt',
  werkstatt: 'werkstatt', workshop: 'werkstatt', kunst: 'kunst', art: 'kunst', foyer: 'foyer', haltung: 'foyer', ueber: 'foyer',
  apps: 'apps', online: 'apps'
};
/* Where a link points: a room, and maybe an exhibit in it. */
function hashTarget() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return null;
  if (h === 'mitmachen') return { room: 'foyer', ex: exhibits.find((x) => x.id === 'mitmachen') };
  if (HASH_ROOMS[h]) return { room: HASH_ROOMS[h] };
  const ex = exhibits.find((x) => x.id === h);
  if (ex) return { room: ex.room, ex };
  return null;
}
function followHash() {
  const target = hashTarget();
  if (!target) return false;
  if (target.ex) {
    if (!state.beam && roomAt(state.pos.x, state.pos.z) === target.room) visit(target.ex);
    else beamTo(target.room, () => visit(target.ex));
  } else {
    beamTo(target.room);
  }
  return true;
}
window.addEventListener('hashchange', () => { if (state.started) followHash(); });

/* --------------------------------------------------------------------------
   Start, toast, language
   -------------------------------------------------------------------------- */
let toastTimer = 0;
function toast(text, ms = 5200) {
  toastEl.textContent = text;
  toastEl.hidden = false;
  toastEl.classList.remove('is-fading');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.add('is-fading');
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 450);
  }, ms);
}

let ready = false;
let pendingChoice = null;

/* "What would you like to see?" – the answer beams you into that room. */
function choose(id, ex) {
  if (state.started || state.arriving) return;
  if (!ready) {
    pendingChoice = [id, ex];
    statusEl.textContent = t('beamPrep');
    return;
  }
  intro.classList.add('is-hidden');
  intro.setAttribute('aria-hidden', 'true');
  document.body.classList.add('is-touring', 'is-cinematic');
  arrive(id, ex ? () => visit(ex) : (id === 'kunst' && !ART_OPEN ? () => openArt(null) : null));
}

choiceButtons.forEach((el) => el.addEventListener('click', (e) => {
  e.preventDefault();
  const id = el.getAttribute('data-choice');
  // the big button just enters; the small links keep their address
  const plain = el.classList.contains('g-enter') || id === 'foyer';
  history.replaceState(null, '', plain ? location.pathname + location.search : '#' + id);
  sound.unlock();
  lockMouse();
  choose(id);
}));
// arriving through a link starts without a click: sound waits for the first one
['pointerdown', 'keydown'].forEach((type) => window.addEventListener(type, () => sound.unlock(), { once: true, capture: true }));

document.addEventListener('oh:langchange', () => {
  labels.forEach((repaint) => repaint());
  if (panelBuilder) panelBody.innerHTML = panelBuilder();
  statusEl.textContent = ready ? t('ready') : pendingChoice ? t('beamPrep') : t('loading');
});

/* --------------------------------------------------------------------------
   Frame loop
   -------------------------------------------------------------------------- */
const clock = new THREE.Clock();
let hoverTick = 0;

function updateRoom() {
  const id = roomAt(state.pos.x, state.pos.z);
  if (id === state.room) return;
  state.room = id;
  roomButtons.forEach((b) => b.setAttribute('aria-current', String(b.getAttribute('data-room') === id)));
  for (const v of videos) {
    if (v.room === id) {
      const p = v.video.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.video.pause();
    }
  }
}

function stepGlide(dt) {
  const g = state.glide;
  const speed = 8;
  if (g.points.length) {
    const target = g.points[0];
    const dx = target.x - state.pos.x;
    const dz = target.z - state.pos.z;
    const dist = Math.hypot(dx, dz);
    const step = Math.min(dist, speed * dt * Math.min(1, 0.35 + dist));
    if (dist > 0.02) {
      state.pos.x += (dx / dist) * step;
      state.pos.z += (dz / dist) * step;
    }
    const last = g.points.length === 1;
    const wantYaw = last && (g.look || dist < 1.2) ? g.endYaw : (dist > 0.05 ? yawTo(dx, dz) : state.yaw);
    const wantPitch = last ? g.endPitch : -0.04;
    state.yaw += (shortestAngle(state.yaw, wantYaw) - state.yaw) * Math.min(1, dt * 4.5);
    state.pitch += (wantPitch - state.pitch) * Math.min(1, dt * 4);
    if (dist <= 0.03) g.points.shift();
    return;
  }
  // arrived: turn to the final view, then finish
  state.yaw += (shortestAngle(state.yaw, g.endYaw) - state.yaw) * Math.min(1, dt * 6);
  state.pitch += (g.endPitch - state.pitch) * Math.min(1, dt * 6);
  g.settle += dt;
  if (g.settle > 0.5) {
    state.glide = null;
  }
}

/* Keys set a wish; the body follows with a little inertia, so walking
   feels like gliding through weightless space rather than stepping. */
function stepKeys(dt) {
  const k = state.keys;
  let wx = 0;
  let wz = 0;
  const st = state.stick;
  const stickOn = st.x !== 0 || st.y !== 0;
  if (stickOn && !k.size) {
    // the stick walks and strafes; how far you push it sets the pace
    const mag = Math.min(1, Math.hypot(st.x, st.y));
    const speed = mag > 0.92 ? 8.5 : 6.5 * mag;
    const forward = -st.y / (mag || 1);
    const strafe = st.x / (mag || 1);
    const sin = Math.sin(state.yaw);
    const cos = Math.cos(state.yaw);
    wx = (-sin * forward + cos * strafe) * speed;
    wz = (-cos * forward - sin * strafe) * speed;
    if (state.glide) state.glide = null;
  } else if (k.size) {
    // always at a brisk pace; Shift is for really running
    const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? 10 : 6.5;
    const forward = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    const strafe = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    const turn = (k.has('ArrowLeft') || k.has('KeyQ') ? 1 : 0) - (k.has('ArrowRight') || k.has('KeyE') ? 1 : 0);
    state.yaw += turn * dt * 1.9;
    const sin = Math.sin(state.yaw);
    const cos = Math.cos(state.yaw);
    const len = Math.hypot(forward, strafe) || 1;
    wx = (-sin * forward + cos * strafe) / len * speed;
    wz = (-cos * forward - sin * strafe) / len * speed;
  }
  const v = state.vel;
  const moving = k.size || stickOn;
  const rate = moving ? 5 : 2.6; // speeds up quickly, drifts out slowly
  v.x += (wx - v.x) * Math.min(1, dt * rate);
  v.z += (wz - v.z) * Math.min(1, dt * rate);
  if (Math.abs(v.x) < 0.01 && Math.abs(v.z) < 0.01) { v.x = 0; v.z = 0; return; }
  if (!tryMove(v.x * dt, v.z * dt)) { v.x *= 0.5; v.z *= 0.5; }
}

function stepHover() {
  const at = isLocked() ? centerXY() : state.hoverAt;
  if (!at || drag.active) return;
  const hit = hitAt(at[0], at[1]);
  const ex = hit && hit.object.userData.exhibit;
  stage.classList.toggle('is-pointing', !!ex);
  crossEl.classList.toggle('is-on', !!ex);
  if (ex !== state.hovered) {
    if (state.hovered) state.hovered.hoverTarget = 1;
    state.hovered = ex || null;
    if (ex) ex.hoverTarget = 1.035;
  }
}

let debugTime = 0;
/* Keep it smooth: on a device that cannot keep up, render a little coarser;
   when there is room again, sharpen back up. */
const MAX_PR = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75);
const MIN_PR = Math.min(MAX_PR, coarse ? 0.8 : 1);
const perf = { sum: 0, n: 0, good: 0 };
function adaptQuality(raw) {
  if (document.hidden || raw > 0.25 || state.arriving) return;
  perf.sum += raw;
  perf.n++;
  if (perf.sum < 2) return;
  const avg = perf.sum / perf.n;
  perf.sum = 0;
  perf.n = 0;
  const pr = renderer.getPixelRatio();
  if (avg > 1 / 40 && pr > MIN_PR + 0.01) {
    renderer.setPixelRatio(Math.max(MIN_PR, pr - 0.2));
    perf.good = 0;
  } else if (avg < 1 / 56 && pr < MAX_PR - 0.01) {
    if (++perf.good >= 3) { renderer.setPixelRatio(Math.min(MAX_PR, pr + 0.2)); perf.good = 0; }
  } else {
    perf.good = 0;
  }
}
function tick() {
  const raw = clock.getDelta();
  adaptQuality(raw);
  frame(Math.min(raw, 0.05), clock.elapsedTime + debugTime);
}
function frame(dt, time) {
  skyUniforms.uTime.value = time;
  for (const m of beams) m.uniforms.uTime.value = time;

  if (state.arriving) {
    stepArrival(dt, time);
  } else if (state.started) {
    if (state.beam) stepBeam(dt);
    if (state.glide) stepGlide(dt);
    stepKeys(dt);
    hoverTick += dt;
    if (hoverTick > 0.08) { hoverTick = 0; stepHover(); }
  } else {
    // behind the welcome card: the planet, alone among the stars
    state.pos.copy(ORBIT.pos);
    lookAtPlanet(introFov(), time);
  }
  if (state.started && !state.arriving) updateRoom();
  stepViewmodel(dt, time);

  // low gravity: jumps float up and sink back down slowly
  if (state.jumpV !== 0 || state.jumpY > 0) {
    state.jumpV -= (state.jumpV > 0 ? 6.5 : 4.2) * dt;
    state.jumpY += state.jumpV * dt;
    if (state.jumpY <= 0) { state.jumpY = 0; state.jumpV = 0; state.bob = -0.04; }
  }
  // and even standing still you hover a little, like in water
  const hover = state.started && !reduceMotion ? Math.sin(time * 0.7) * 0.035 + Math.sin(time * 0.31) * 0.02 : 0;
  state.bob += (hover - state.bob) * Math.min(1, dt * 3);

  // the beam flash and a short widening of the view
  state.flash += (state.flashTarget - state.flash) * Math.min(1, dt * (state.flashTarget > state.flash ? 14 : 3.2));
  flashEl.style.opacity = state.flash > 0.004 ? state.flash.toFixed(3) : '0';
  if (!state.arriving) state.fovKick += (0 - state.fovKick) * Math.min(1, dt * 3);
  // upright phones: a wider view so the boards beside an exhibit stay in sight
  const aspect = camera.aspect;
  const baseFov = aspect < 1
    ? THREE.MathUtils.clamp(2 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(THREE.MathUtils.degToRad(26)) / aspect)), 70, 82)
    : (coarse ? 70 : 62);
  let fov = baseFov + state.fovKick * 14;
  if (!state.started && !state.arriving) fov = introFov();
  else if (state.arriving && state.arriving.zoomFov) fov = state.arriving.zoomFov;
  if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

  // the room lights (dimmed while you materialise)
  if (Math.abs(state.light - state.lightTarget) > 0.001) {
    state.light += (state.lightTarget - state.light) * Math.min(1, dt * (state.lightTarget > state.light ? 1.1 : 6));
    for (const lamp of lamps) lamp.intensity = lamp.userData.full * state.light;
    hemi.intensity = hemi.userData.full * (0.25 + 0.75 * state.light);
    if (faceMat) faceMat.opacity = clamp01((state.light - 0.35) / 0.65);
    if (visorMat) visorMat.emissiveIntensity = 0.7 * clamp01((state.light - 0.35) / 0.65);
  }
  for (let i = effects.length - 1; i >= 0; i--) if (!effects[i].update(dt)) effects.splice(i, 1);
  for (const fn of animated) fn(dt, time);

  for (const ex of exhibits) {
    if (!ex.hoverTarget || ex.noHover) continue;
    const s = ex.root.scale.x + (ex.hoverTarget - ex.root.scale.x) * Math.min(1, dt * 10);
    ex.root.scale.setScalar(s);
    if (Math.abs(s - ex.hoverTarget) < 0.001 && ex.hoverTarget === 1) ex.hoverTarget = 0;
  }

  // Yusu turns towards you, like the neck servo does
  if (head) {
    const inHall = state.started && state.room === 'robotics';
    const want = inHall
      ? THREE.MathUtils.clamp(Math.atan2(state.pos.x - HEAD_SPOT.x, state.pos.z - HEAD_SPOT.z), -1.1, 1.1)
      : Math.sin(time * 0.3) * 0.4;
    head.rotation.y += (want - head.rotation.y) * Math.min(1, dt * 1.6);
    if (eyes) eyes.update(dt, time);
  }
  if (planet) planet.rotation.y += dt * 0.01;

  // the panel covers part of the view: move the picture out from under it
  // (left on wide screens, up on phones)
  const narrow = window.innerWidth <= 700;
  const wantX = !panel.hidden && !narrow ? (panel.offsetWidth + 16) / 2 / window.innerWidth : 0;
  const wantY = !panel.hidden && narrow ? 0.13 : 0;
  if (Math.abs(state.viewShift - wantX) > 0.001 || Math.abs(state.viewShiftY - wantY) > 0.001) {
    state.viewShift += (wantX - state.viewShift) * Math.min(1, dt * 6);
    state.viewShiftY += (wantY - state.viewShiftY) * Math.min(1, dt * 6);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (state.viewShift > 0.002 || state.viewShiftY > 0.002) camera.setViewOffset(w, h, w * Math.max(0, state.viewShift), h * Math.max(0, state.viewShiftY), w, h);
    else camera.clearViewOffset();
  }

  camera.position.set(state.pos.x, state.pos.y + state.jumpY + state.bob, state.pos.z);
  const roll = state.started && !reduceMotion && !state.arriving ? Math.sin(time * 0.4) * 0.006 - state.vel.x * Math.cos(state.yaw) * 0.002 + state.vel.z * Math.sin(state.yaw) * 0.002 : 0;
  // a jolt that dies away (landing, the rush into the planet)
  state.shake *= Math.exp(-dt * 3.2);
  const sh = reduceMotion || state.shake < 0.002 ? 0 : state.shake;
  camera.rotation.set(state.pitch + (Math.random() - 0.5) * sh * 0.03, state.yaw + (Math.random() - 0.5) * sh * 0.03, roll + (Math.random() - 0.5) * sh * 0.02, 'YXZ');
  sky.position.copy(camera.position);
  renderer.render(scene, camera);
  if (hands.visible) {
    vmCam.projectionMatrix.copy(camera.projectionMatrix);
    vmCam.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
    const lit = 0.35 + 0.65 * state.light;
    vmHemi.intensity = 1.2 * lit;
    vmKey.intensity = 1.5 * lit;
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(vmScene, vmCam);
    renderer.autoClear = true;
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  state.viewShift = -1; // forces the view offset to be recalculated
  state.viewShiftY = -1;
  for (const ex of exhibits) {
    if (ex.root.userData.size && !ex.fixedDist) ex.dist = viewDistanceFor(...ex.root.userData.size);
  }
});

/* --------------------------------------------------------------------------
   Build everything, then let people in
   -------------------------------------------------------------------------- */
statusEl.textContent = t('loading');
buildSky();
ROOM_ORDER.forEach(buildRoom);
Object.keys(PASSAGES).forEach(buildPassage);
buildFoyer();
// the floor sign of each room; in the robotics hall just inside the door, in front of Yusu
floorEmblem('robotics', ROOMS.robotics.x, ROOMS.robotics.z + 6.2, EMBLEMS.robotics);
for (const id of ['games', 'apps', 'werkstatt', 'kunst']) floorEmblem(id, ROOMS[id].x, ROOMS[id].z, EMBLEMS[id]);
buildRobotics();
buildGames();
buildApps();
buildWorkshop();
buildArt();
buildMotes();

camera.position.copy(state.pos);
renderer.setAnimationLoop(tick);

// ?debug in the address: handles for testing in the browser console
if (/[?&]debug\b/.test(location.search)) window.OH_GALLERY = { THREE, renderer, scene, camera, state, exhibits, goToRoom, visit, beamTo, arrive, finishArrival, hands, handUniforms, poseHands, vm, VM, body, pointAt,
  // run the scene forward by `sec` seconds at once (hidden tabs barely animate)
  advance(sec, step = 1 / 30) { for (let x = 0; x < sec; x += step) { debugTime += step; frame(step, clock.elapsedTime + debugTime); } }
};

function markReady() {
  if (ready) return;
  ready = true;
  intro.classList.add('is-ready');
  statusEl.textContent = t('ready');
  if (pendingChoice) { choose(...pendingChoice); return; }
  // arriving through a link like index.html#games: beam straight in
  const target = hashTarget();
  if (target) choose(target.room, target.ex);
}
const waitStart = performance.now();
(function waitForImages() {
  if (pendingImages <= 0 || performance.now() - waitStart > 4500) markReady();
  else setTimeout(waitForImages, 120);
})();
