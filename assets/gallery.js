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
    foyer: 'Foyer', robotics: 'Robotics', games: 'Games', werkstatt: 'Werkstatt', kunst: 'Kunst',
    werkstattSub: 'Tools & 3D-Design', kunstSub: 'Art · @marcelloswigswag', roboticsSub: 'Hauptraum · Yusu',
    gamesSub: 'Spielbar im Browser und zum Download',
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
    toolsTitle: 'Tools', benchTitle: 'Auf der Werkbank', workshopTitle: 'Die Werkstatt',
    workshopText: '3D-Druck, Elektronik, Lötstation, CAD und ein Schreibtisch für Code – alles für die erste Version eines Projekts steht in einem Raum in Aachen.',
    artSoon: 'Artworks folgen', comingSoon: 'Bald hier', artDoorText: 'Bis dahin findest du alle Bilder auf Instagram.', artSoonText: 'Bis dahin alles auf Instagram unter @marcelloswigswag.',
    artWall: 'Bilder, Zeichnungen, Experimente.',
    itchSign: 'Alle Spiele auf itch.io',
    allStages: 'Alle Etappen auf der Projektseite →', toProject: '← Zurück zu Yusu',
    onInstagram: 'Auf Instagram ansehen', clickHint: 'Anklicken für mehr',
    renderCaption: 'Der erste Entwurf als Render',
    hintMouse: 'Ziehen zum Umsehen · Boden anklicken zum Hingehen · WASD zum Laufen · Leertaste zum Springen',
    beamPrep: 'Gleich geht’s los – der Beam wird vorbereitet …',
    greet1: 'Hallo! Schön, dass du da bist.',
    greet2: 'Ich bin noch im Bau – schau dich ruhig um.',
    hintTouch: 'Wischen zum Umsehen · Boden antippen zum Hingehen · Bild antippen für mehr',
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
    foyer: 'Foyer', robotics: 'Robotics', games: 'Games', werkstatt: 'Workshop', kunst: 'Art',
    werkstattSub: 'Tools & 3D design', kunstSub: 'Art · @marcelloswigswag', roboticsSub: 'Main hall · Yusu',
    gamesSub: 'Playable in the browser and as a download',
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
    toolsTitle: 'Tools', benchTitle: 'On the workbench', workshopTitle: 'The workshop',
    workshopText: '3D printing, electronics, soldering station, CAD and a desk for code – everything for the first version of a project is in one room in Aachen.',
    artSoon: 'Artworks coming soon', comingSoon: 'Coming soon', artDoorText: 'Until then, all the pictures are on Instagram.', artSoonText: 'Until then, everything is on Instagram as @marcelloswigswag.',
    artWall: 'Pictures, drawings, experiments.',
    itchSign: 'All games on itch.io',
    allStages: 'Every stage on the project page →', toProject: '← Back to Yusu',
    onInstagram: 'View on Instagram', clickHint: 'Click for more',
    renderCaption: 'The first design as a render',
    hintMouse: 'Drag to look around · click the floor to walk there · WASD to move · space to jump',
    beamPrep: 'Almost there – preparing the beam …',
    greet1: 'Hi! Nice to have you here.',
    greet2: 'I’m still being built – have a look around.',
    hintTouch: 'Swipe to look around · tap the floor to walk there · tap a picture for more',
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
               doors: ['w'] },
  kunst:     { x: -(7 + GAP + 7), z: 0,     w: 14, d: 12, h: 5.2, accent: 0xbca2ff, wall: 0x0f0c22, floor: 0x171330,
               doors: ['e'] },
  werkstatt: { x: 0,     z: 6 + GAP + 7,  w: 16, d: 14, h: 4.6, accent: 0xffbb73, wall: 0x13111a, floor: 0x1e1820,
               doors: ['n'] }
};
const ROOM_ORDER = ['foyer', 'robotics', 'games', 'werkstatt', 'kunst'];

/* Where each side room meets the foyer: a point just inside the room and
   one just inside the foyer. Paths between rooms run through these. */
const PASSAGES = {
  robotics:  { side: 'n', inRoom: new THREE.Vector3(0, EYE, -(6 + GAP + 1.4)), inFoyer: new THREE.Vector3(0, EYE, -4.8) },
  games:     { side: 'e', inRoom: new THREE.Vector3(7 + GAP + 1.4, EYE, 0),   inFoyer: new THREE.Vector3(5.8, EYE, 0) },
  kunst:     { side: 'w', inRoom: new THREE.Vector3(-(7 + GAP + 1.4), EYE, 0), inFoyer: new THREE.Vector3(-5.8, EYE, 0) },
  werkstatt: { side: 's', inRoom: new THREE.Vector3(0, EYE, 6 + GAP + 1.4),   inFoyer: new THREE.Vector3(0, EYE, 4.8) }
};

/* First view of each room (room bar, links like index.html#games). */
const ENTRY = {
  foyer:     { pos: [0, EYE, 4.2],    look: [0, 1.7, -14] },
  robotics:  { pos: [0, EYE, -(6 + GAP + 4)],   look: [0, 1.7, -(6 + GAP + 12.3)] },
  games:     { pos: [7 + GAP + 1.6, EYE, 0],    look: [7 + GAP + 14, 1.6, 0] },
  werkstatt: { pos: [0, EYE, 6 + GAP + 2.2],    look: [0, 1.6, 6 + GAP + 14] },
  kunst:     { pos: [-(7 + GAP + 1.6), EYE, 0], look: [-(7 + GAP + 14), 2.0, 0] }
};

/* Until there are artworks, the art room stays closed: its door in the
   foyer points to Instagram instead. */
const ART_OPEN = ARTWORKS.length > 0;
if (!ART_OPEN) ENTRY.kunst = { pos: [-1.6, EYE, 0], look: [-7, 2.2, 0] };

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
  choiceButtons.forEach((b) => { if (b.tagName === 'A') b.href = 'index.html'; else b.addEventListener('click', () => { location.href = 'index.html'; }); });
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
  const f = ROOMS.foyer;
  const r = ROOMS[id];
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
  floor.position.set(along ? 0 : mid, 0.001, along ? mid : 0);
  scene.add(floor);
  if (!closed) floors.push(floor);
  for (const s of [-1, 1]) {
    const side = along ? box(WALL, DOOR_H, len, mat) : box(len, DOOR_H, WALL, mat);
    side.position.set(along ? s * (DOOR_W / 2 + WALL / 2) : mid, DOOR_H / 2, along ? mid : s * (DOOR_W / 2 + WALL / 2));
    scene.add(side);
    blockers.push(side);
    const top = along ? box(WALL + 0.02, 0.04, len, light) : box(len, 0.04, WALL + 0.02, light);
    top.position.set(side.position.x, DOOR_H + 0.02, side.position.z);
    scene.add(top);
    const strip = along ? box(0.03, 0.01, len, light) : box(len, 0.01, 0.03, light);
    strip.position.set(along ? s * (DOOR_W / 2 - 0.12) : mid, 0.006, along ? mid : s * (DOOR_W / 2 - 0.12));
    scene.add(strip);
  }
  const half = DOOR_W / 2 - 0.45;
  const lo = Math.min(a, b) - 1.2;
  const hi = Math.max(a, b) + 1.2;
  if (!closed) walkRects.push(along ? [-half, half, lo, hi] : [lo, hi, -half, half]);
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
    ['n', 'robotics', 'roboticsSub'], ['e', 'games', 'gamesSub'], ['s', 'werkstatt', 'werkstattSub'], ['w', 'kunst', 'kunstSub']
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

  if (!ART_OPEN) artDoor();

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

  // the world heart, floating above the ring
  const heart = new THREE.Mesh(heartGeometry(1.15, 0.16), new THREE.MeshStandardMaterial({
    color: 0xfff3dc, roughness: 0.25, metalness: 0.35, emissive: gold, emissiveIntensity: 0.55, envMapIntensity: 1.5
  }));
  heart.position.set(0, 3.25, 0);
  scene.add(heart);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: gold, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  halo.scale.setScalar(3.4);
  halo.position.copy(heart.position);
  scene.add(halo);
  const heartLight = new THREE.PointLight(gold, 6, 9, 1.8);
  heartLight.position.set(0, 3.2, 0);
  scene.add(heartLight);
  heart.userData.size = [1.4, 1.4];
  const heartEx = addExhibit({ id: 'heart', root: heart, meshes: [heart], room: 'foyer', open: () => openText('welcome'), viewDist: 3.6 });
  heartEx.noHover = true;
  heartEx.normal.set(0, 0, 1);
  animated.push((dt, time) => {
    heart.rotation.y = time * 0.45;
    heart.position.y = 3.25 + Math.sin(time * 0.9) * 0.08;
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
  // sits right in the doorway of the foyer's west wall
  place(door, wallSpot('foyer', 'w', 0, DOOR_H / 2, -WALL / 2 + 0.02));
  blockers.push(door);
  addExhibit({ id: 'art-door', root: door, meshes: [door], room: 'foyer', open: () => openArt(null), viewDist: 3.4 });
}

/* The heart from the logo as a solid, centred, `size` metres tall. */
function heartGeometry(size, depth) {
  const k = size / 30;
  const P = (x, y) => [(x - 37.9) * k, -(y - 32.7) * k];
  const shape = new THREE.Shape();
  shape.moveTo(...P(20, 28));
  shape.bezierCurveTo(...P(20, 22.5), ...P(24.5, 18), ...P(30, 18));
  shape.bezierCurveTo(...P(33.1, 18), ...P(36, 19.5), ...P(37.9, 22));
  shape.bezierCurveTo(...P(39.8, 19.5), ...P(42.7, 18), ...P(45.8, 18));
  shape.bezierCurveTo(...P(51.3, 18), ...P(55.8, 22.5), ...P(55.8, 28));
  shape.bezierCurveTo(...P(55.8, 39.8), ...P(37.7, 47.4), ...P(37.7, 47.4));
  shape.bezierCurveTo(...P(37.7, 47.4), ...P(20, 39.8), ...P(20, 28));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: depth * 0.4, bevelSize: size * 0.035, bevelSegments: 4, curveSegments: 24
  });
  geo.center();
  return geo;
}

/* The floor plan as a star chart, painted from ROOMS. */
const MAP_BOUNDS = { minX: -23, maxX: 23, minZ: -30, maxZ: 22 };
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
  head.position.set(HEAD_SPOT.x, 2.55, HEAD_SPOT.z);
  scene.add(head);
  buildYusuFace(head, cyan);

  const headExhibit = addExhibit({
    id: 'project-yusu', root: plinth, meshes: [plinth, stageMesh], room: 'robotics',
    open: () => openProject(yusu), viewDist: 5.2
  });
  headExhibit.center.set(HEAD_SPOT.x, 2.3, HEAD_SPOT.z);
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
  const past = [];
  if (yusu.image) past.push({ ...yusu.image, caption: { de: TEXT.de.renderCaption, en: TEXT.en.renderCaption } });
  (yusu.gallery || []).forEach((g) => past.push(g));
  wallTitle('robotics', 'w', 0, r.h - 1.1, () => t('pastTitle'), true);
  rowOnWall('robotics', 'w', past, { y: 2.35, from: -9.2, to: 9.2, maxW: 2.1, maxH: 1.55, style: 'dark', dark: true, timeline: true },
    (item, i) => () => openMedia(item, { kicker: t('pastTitle') + ' · ' + (i + 1), back: yusu }));

  // current state on the east wall, clips play while you are in the hall
  const now = yusu.now ? yusu.now.items : [];
  if (now.length) {
    wallTitle('robotics', 'e', 0, r.h - 1.1, () => pick(yusu.now.title) || t('nowTitle'), true);
    rowOnWall('robotics', 'e', now, { y: 2.2, from: 8.6, to: -8.6, maxW: 1.6, maxH: 2.3, style: 'screen', dark: true },
      (item) => () => openMedia(item, { kicker: pick(yusu.now.title), back: yusu }));
  }

  // the plan on the north wall
  const plan = board(9.0, 4.2, (ctx, w, h) => {
    const copy = yusu[lang()] || yusu.en;
    ctx.fillStyle = '#121820';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(143,216,255,.85)';
    ctx.font = `700 ${Math.round(h * 0.04)}px ${FONT}`;
    ctx.fillText('ONEHUMANITY R1 · ' + (R ? pick(R.STATUS[yusu.status]) : '').toUpperCase(), w * 0.05, h * 0.07);
    ctx.fillStyle = '#f2f7f8';
    ctx.font = `800 ${Math.round(h * 0.11)}px ${FONT}`;
    ctx.fillText(copy.title, w * 0.05, h * 0.13, w * 0.9);
    ctx.fillStyle = 'rgba(242,247,248,.75)';
    ctx.font = `500 ${Math.round(h * 0.045)}px ${FONT}`;
    ctx.fillText(copy.tagline || '', w * 0.05, h * 0.27, w * 0.9);
    const steps = copy.timeline || [];
    const colW = w * 0.44;
    const rows = Math.ceil(steps.length / 2);
    steps.forEach((step, i) => {
      const col = i < rows ? 0 : 1;
      const row = i < rows ? i : i - rows;
      const x = w * 0.05 + col * (colW + w * 0.02);
      const y = h * 0.4 + row * h * 0.115;
      ctx.beginPath();
      ctx.arc(x + h * 0.016, y + h * 0.024, h * 0.014, 0, Math.PI * 2);
      ctx.fillStyle = step.state === 'done' ? '#8fd8ff' : step.state === 'now' ? '#f5c46b' : 'rgba(242,247,248,.35)';
      ctx.fill();
      ctx.fillStyle = step.state === 'next' ? 'rgba(242,247,248,.55)' : step.state === 'now' ? '#f5c46b' : 'rgba(242,247,248,.9)';
      ctx.font = `${step.state === 'now' ? 700 : 500} ${Math.round(h * 0.036)}px ${FONT}`;
      wrapText(ctx, step.text, x + h * 0.05, y, colW - h * 0.06, h * 0.045, 2);
    });
  }, { px: 2048 });
  place(plan, wallSpot('robotics', 'n', 0, 3.0));
  addExhibit({ id: 'yusu-plan', root: plan, meshes: [plan], room: 'robotics', open: () => openProject(yusu) });

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

function buildYusuFace(group, color) {
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

  // small ear pods with light rings
  for (const s of [-1, 1]) {
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.14, 32), MAT.plinth);
    pod.rotation.z = Math.PI / 2;
    pod.position.set(s * (W / 2 + 0.16), 0, -0.05);
    group.add(pod);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.015, 8, 40), glowMat(color));
    ring.rotation.y = Math.PI / 2;
    ring.position.set(s * (W / 2 + 0.235), 0, -0.05);
    group.add(ring);
  }

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
  const faceLight = new THREE.PointLight(color, 3, 4, 2);
  faceLight.position.set(0, -0.6, 1.2);
  group.add(faceLight);

  animated.push((dt, time) => {
    group.position.y = 2.55 + Math.sin(time * 1.1) * 0.06;
    rings.forEach((ring) => { ring.rotation.z += ring.userData.speed * dt; });
  });
}

/* The eyes are drawn like the firmware does: two glowing shapes that change
   expression now and then, with blinking in between. */
function createEyes() {
  const W = 512, H = 328;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const texture = canvasTexture(canvas);
  const moods = ['neutral', 'happy', 'neutral', 'curious', 'blush', 'neutral', 'surprised', 'happy'];
  const s = { mood: 'neutral', next: 3, blink: 0, nextBlink: 2, look: 0, lookTarget: 0, talk: 0, moodIndex: 0, time: 0 };
  const EYE_COLOR = '#9fe0ff';

  function eye(cx, cy, mood, open) {
    ctx.save();
    ctx.shadowColor = 'rgba(143,216,255,.95)';
    ctx.shadowBlur = 30;
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

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // faint scan lines, it is a hologram after all
    ctx.fillStyle = 'rgba(143,216,255,.05)';
    for (let y = (s.time * 40) % 6; y < H; y += 6) ctx.fillRect(0, y, W, 2);
    const open = s.blink > 0 ? Math.abs(Math.cos(s.blink * Math.PI)) : 1;
    const dx = s.look * 34;
    eye(W / 2 - 128 + dx, 132, s.mood, open);
    eye(W / 2 + 128 + dx, 132, s.mood, open * (s.mood === 'curious' ? 0.7 : 1));
    if (s.mood === 'blush') {
      ctx.save();
      ctx.fillStyle = 'rgba(255,120,150,.8)';
      ctx.shadowColor = 'rgba(255,120,150,.95)';
      ctx.shadowBlur = 18;
      for (const cx of [W / 2 - 150, W / 2 + 150]) {
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.ellipse(cx - 26 + k * 26, 224, 7, 12, 0.5, 0, Math.PI * 2);
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
      ctx.arc(W / 2 - 75 + i * 30, 272, 9, 0, Math.PI * 2);
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
      s.mood = mood;
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
        s.mood = moods[s.moodIndex];
        s.next = 2.5 + Math.random() * 2.5;
        s.lookTarget = Math.random() < 0.5 ? 0 : (Math.random() - 0.5) * 1.4;
        s.talk = s.mood === 'happy' ? 1.6 : 0;
      }
      if (s.nextBlink <= 0 && s.blink <= 0) { s.blink = 0.001; s.nextBlink = 2 + Math.random() * 3; }
      if (s.blink > 0) { s.blink += dt * 5; if (s.blink >= 1) s.blink = 0; }
      s.look += (s.lookTarget - s.look) * Math.min(1, dt * 4);
      s.talk = Math.max(0, s.talk - dt);
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

  games.forEach((p, i) => {
    const onNorth = i % 2 === 0;
    const slot = Math.floor(i / 2);
    const along = -3.2 + slot * 3.6;
    const side = onNorth ? 'n' : 's';
    const cab = arcadeCabinet(p, neon[i % 2]);
    const spot = wallSpot('games', side, along, 0, 0.45);
    place(cab.group, spot);
    obstacles.push({ x: spot.pos.x, z: spot.pos.z, r: 0.85 });
    const ex = addExhibit({ id: 'project-' + p.id, root: cab.group, meshes: cab.meshes, room: 'games', open: () => openProject(p), viewDist: 2.3 });
    ex.center.set(spot.pos.x, 1.5, spot.pos.z);
  });

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
  place(sign, wallSpot('games', 'e', 0, 3.55));
  addExhibit({ id: 'itch', root: sign, meshes: [sign], room: 'games', open: () => openLinks(['itch']) });
  shots.forEach((shot, i) => {
    const along = shots.length > 1 ? -2.6 + (5.2 / (shots.length - 1)) * i : 0;
    const f = framed({ src: shot.src, w: shot.w, h: shot.h, maxW: 2.4, maxH: 1.6, style: 'screen' });
    place(f.group, wallSpot('games', 'e', along, 1.85));
    addExhibit({ id: shot.src, root: f.group, meshes: f.meshes, room: 'games', open: () => openMedia(shot, { kicker: (shot.project[lang()] || {}).title, back: shot.project }) });
  });
}

function arcadeCabinet(p, accent) {
  const group = new THREE.Group();
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
  const img = p.image || {};
  const aspect = (img.w || 4) / (img.h || 3);
  const sh = 0.82;
  const sw = Math.min(1.22, sh * aspect);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(sw, sw / aspect),
    new THREE.MeshBasicMaterial({ map: img.src ? imageTexture(img.src, img.w, img.h) : null, toneMapped: false }));
  screen.position.set(0, 1.6, 0.13);
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
  group.userData.size = [1.4, 2.5];
  return { group, meshes: [screen, top, base, marquee] };
}

/* --------------------------------------------------------------------------
   Workshop: tools at desks, 3D designs on a pegboard, photos of the room
   -------------------------------------------------------------------------- */
function buildWorkshop() {
  const r = ROOMS.werkstatt;
  // tools, plus robot ideas that are still future topics (e.g. Ringwheel)
  const tools = [...projectsIn('tools').filter((p) => p.featured !== false), ...projectsIn('robotics').filter((p) => p.id !== 'yusu')];
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
  place(title, wallSpot('kunst', 'n', -3.0, 3.9));
  addExhibit({ id: 'art-title', root: title, meshes: [title], room: 'kunst', open: () => openArt(null) });

  // slots: west wall first, then north and south
  const slots = [
    ['w', -3.6], ['w', 0], ['w', 3.6],
    ['n', 0.8], ['n', 4.4], ['s', 0.8], ['s', 4.4], ['s', -3.6]
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
  bench.position.set(r.x - 1, 0.225, r.z);
  bench.rotation.y = Math.PI / 2;
  scene.add(bench);
  const benchLine = box(2.42, 0.02, 0.62, glowMat(r.accent, 0.8));
  benchLine.position.y = 0.235;
  bench.add(benchLine);
  obstacles.push({ x: r.x - 1, z: r.z - 0.7, r: 0.7 }, { x: r.x - 1, z: r.z + 0.7, r: 0.7 });
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
let planet = null;
function buildPlanet() {
  const R = 24;
  const group = new THREE.Group();
  group.position.copy(PLANET_DIR).multiplyScalar(150);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: skyUniforms.uTime, uSun: { value: SUN_DIR } },
    vertexShader: `varying vec3 vObj; varying vec3 vN; varying vec3 vView;
      void main(){ vObj = position; vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0);
        vView = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: NOISE_GLSL + `uniform float uTime; uniform vec3 uSun; varying vec3 vObj; varying vec3 vN; varying vec3 vView;
      void main(){
        vec3 p = normalize(vObj);
        float e = fbm(p * 2.1 + vec3(3.1, 1.7, 0.4));
        float land = smoothstep(0.515, 0.535, e);
        vec3 ocean = mix(vec3(0.01, 0.04, 0.14), vec3(0.03, 0.15, 0.34), smoothstep(0.3, 0.52, e));
        vec3 ground = mix(vec3(0.09, 0.22, 0.09), vec3(0.45, 0.38, 0.22), smoothstep(0.56, 0.72, e));
        vec3 col = mix(ocean, ground, land);
        col = mix(col, vec3(0.92, 0.95, 1.0), smoothstep(0.8, 0.88, abs(p.y) + e * 0.12));
        float t = uTime * 0.012;
        vec3 q = vec3(p.x * cos(t) - p.z * sin(t), p.y * 1.7, p.x * sin(t) + p.z * cos(t));
        float cloud = smoothstep(0.52, 0.78, fbm(q * 3.0 + 7.0));
        col = mix(col, vec3(1.0), cloud * 0.8);
        vec3 n = normalize(vN);
        float d = dot(n, uSun);
        float day = smoothstep(-0.12, 0.3, d);
        vec3 c = col * (0.015 + day * 1.2);
        float city = step(0.74, noise(p * 70.0)) * land * (1.0 - cloud) * (1.0 - smoothstep(-0.25, 0.05, d));
        c += vec3(1.0, 0.72, 0.38) * city * 0.9;
        float rim = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 2.6);
        c += vec3(0.3, 0.55, 1.0) * rim * (0.08 + day * 0.9);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
    fog: false
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), mat);
  ball.rotation.z = 0.35;
  group.add(ball);
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.09, 64, 48), new THREE.ShaderMaterial({
    uniforms: { uSun: { value: SUN_DIR } },
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

const handUniforms = {
  uReveal: { value: 0 }, uAlpha: { value: 1 }, uTime: skyUniforms.uTime, uColor: { value: new THREE.Color(0x8fd8ff) }
};
const handMat = new THREE.ShaderMaterial({
  uniforms: handUniforms,
  vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP;
    void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vP = mv.xyz; vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform float uReveal; uniform float uAlpha; uniform float uTime; uniform vec3 uColor; varying vec3 vN; varying vec3 vV; varying vec3 vP;
    float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
    void main(){
      float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
      float grain = h(floor(vP * 160.0));
      float k = (vP.y + 0.36) / 0.36 + grain * 0.22;
      float thr = uReveal * 1.45;
      if (k > thr) discard;
      float edge = 1.0 - smoothstep(0.0, 0.14, thr - k);
      float scan = 0.82 + 0.18 * sin(vP.y * 420.0 - uTime * 8.0);
      vec3 col = uColor * (0.35 + fres * 1.5) + vec3(1.0) * edge * 1.4;
      float a = (0.16 + fres * 0.8 + edge * 0.9) * scan * uAlpha;
      gl_FragColor = vec4(col, a);
      #include <colorspace_fragment>
    }`,
  transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false
});

/* A hand from simple shapes: palm, four fingers with two joints, thumb,
   forearm. side = 1 right hand, -1 left. Palm faces the viewer. */
function buildHand(side) {
  const g = new THREE.Group();
  const part = (geo) => { const m = new THREE.Mesh(geo, handMat); m.renderOrder = 50; return m; };
  const palm = part(new THREE.SphereGeometry(1, 24, 16));
  palm.scale.set(0.041, 0.05, 0.016);
  palm.position.y = 0.004;
  g.add(palm);
  // the knuckle line is wider than the wrist
  const knuckles = part(new THREE.CapsuleGeometry(0.014, 0.05, 4, 12));
  knuckles.rotation.z = Math.PI / 2;
  knuckles.position.set(0, 0.038, 0);
  g.add(knuckles);
  const arm = part(new THREE.CapsuleGeometry(0.027, 0.24, 6, 14));
  arm.position.set(0, -0.17, -0.01);
  g.add(arm);
  const fingers = [];
  const lengths = [0.07, 0.078, 0.073, 0.056];
  lengths.forEach((L, i) => {
    const root = new THREE.Group();
    root.position.set(side * (0.027 - i * 0.018), 0.05, 0);
    root.rotation.z = -side * (1.5 - i) * 0.085;
    const a = L * 0.56;
    const b = L * 0.44;
    const seg1 = part(new THREE.CapsuleGeometry(0.0088, a, 4, 10));
    seg1.position.y = a / 2;
    root.add(seg1);
    const joint = new THREE.Group();
    joint.position.y = a;
    const seg2 = part(new THREE.CapsuleGeometry(0.008, b, 4, 10));
    seg2.position.y = b / 2;
    joint.add(seg2);
    root.add(joint);
    g.add(root);
    fingers.push({ root, joint, i });
  });
  const thumb = new THREE.Group();
  thumb.position.set(side * 0.034, -0.026, 0.008);
  thumb.rotation.z = -side * 0.62;
  thumb.rotation.y = side * 0.45;
  const t1 = part(new THREE.CapsuleGeometry(0.011, 0.04, 4, 10));
  t1.position.y = 0.02;
  thumb.add(t1);
  const tj = new THREE.Group();
  tj.position.y = 0.042;
  const t2 = part(new THREE.CapsuleGeometry(0.0098, 0.03, 4, 10));
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
camera.add(hands);

function poseHands(lift, curl, time) {
  // keep both hands inside narrow (portrait) screens
  const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 0.42;
  const x = Math.min(0.12, halfW * 0.52);
  const scale = Math.min(1, halfW / 0.2);
  for (const h of [handL, handR]) {
    const sway = Math.sin(time * 1.3 + h.side) * 0.006;
    h.group.scale.setScalar(scale);
    h.group.position.set(h.side * x, -0.14 - lift + sway, -0.42);
    h.group.rotation.set(-0.25, -h.side * 0.22, h.side * 0.28);
    h.fingers.forEach((f) => {
      const c = curl * (0.8 + f.i * 0.12);
      f.root.rotation.x = c * 0.65;
      f.joint.rotation.x = c * 0.95;
    });
    h.tj.rotation.x = curl * 0.5;
    h.thumb.rotation.x = curl * 0.3;
  }
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

/* The first arrival: from the welcome view down into the chosen room. */
function arrive(id, then) {
  const e = entryOf(id);
  if (reduceMotion) {
    state.pos.copy(e.pos); state.yaw = e.yaw; state.pitch = e.pitch;
    finishArrival(then);
    return;
  }
  const from = camera.position.clone();
  const fromYaw = state.yaw;
  const fromPitch = state.pitch;
  const focus = id === 'robotics' ? new THREE.Vector3(HEAD_SPOT.x, 2.5, HEAD_SPOT.z) : e.look;
  state.arriving = { phase: 'dive', t: 0, e, from, fromYaw, fromPitch, focus, then, id };
}

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function stepArrival(dt, time) {
  const a = state.arriving;
  a.t += dt;
  if (a.phase === 'dive') {
    const T = 2.6;
    const k = ease(clamp01(a.t / T));
    // a curve: out over the building, then down through the open roof
    const p0 = a.from, p2 = a.e.pos;
    const mid = new THREE.Vector3(p2.x, 15, p2.z + 10);
    const q = (1 - k) * (1 - k);
    const m = 2 * (1 - k) * k;
    const kk = k * k;
    state.pos.set(q * p0.x + m * mid.x + kk * p2.x, q * p0.y + m * mid.y + kk * (p2.y + 2.2), q * p0.z + m * mid.z + kk * p2.z);
    // turn from the welcome view towards what the room is about
    const f = a.focus;
    const wantYaw = yawTo(f.x - state.pos.x, f.z - state.pos.z);
    const wantPitch = Math.atan2(f.y - state.pos.y, Math.hypot(f.x - state.pos.x, f.z - state.pos.z));
    const turn = ease(clamp01(a.t / (T * 0.55)));
    state.yaw = a.fromYaw + (shortestAngle(a.fromYaw, wantYaw) - a.fromYaw) * turn;
    state.pitch = a.fromPitch + (wantPitch - a.fromPitch) * turn;
    state.fovKick = Math.sin(k * Math.PI) * 0.9 + k * 0.5;
    if (a.t > T - 0.2) state.flashTarget = 1;
    if (a.t >= T) {
      a.phase = 'hands';
      a.t = 0;
      state.pos.copy(a.e.pos);
      state.yaw = a.e.yaw;
      state.pitch = -0.95;
      state.flashTarget = 0;
      state.fovKick = 0.6;
      // you materialise in the dark; the room powers up when you look up
      state.light = 0.12;
      state.lightTarget = 0.12;
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
  poseHands(up * 0.45, curl, time);
  handUniforms.uAlpha.value = 1 - up;
  state.yaw = a.e.yaw + Math.sin(t * 0.8) * 0.04 * (1 - up);
  state.pitch = -0.95 + (a.e.pitch + 0.95) * up;
  if (t >= 3.7) finishArrival(a.then);
}

/* A click or key skips the arrival, once it has properly begun. */
const canSkip = () => !!state.arriving && state.arriving.t > (state.arriving.phase === 'dive' ? 0.8 : 0.4);

function finishArrival(then) {
  const a = state.arriving;
  if (a && a.phase === 'dive') {
    state.pos.copy(a.e.pos);
    beamFx(a.e.pos, ROOMS[a.id].accent);
    sound.beam();
  }
  if (a) { state.yaw = a.e.yaw; state.pitch = a.e.pitch; }
  state.arriving = null;
  state.flashTarget = 0;
  state.lightTarget = 1;
  hands.visible = false;
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
    setTimeout(say, i === 1 ? 3000 : 3600);
  };
  setTimeout(say, 450);
}

/* Name of the room, like a location card in a film. */
function placeCard(id) {
  if (!id || !TEXT.en[id]) return;
  const sub = { foyer: '', robotics: 'roboticsSub', games: 'gamesSub', werkstatt: 'werkstattSub', kunst: 'kunstSub' }[id];
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
  toast(coarse ? t('hintTouch') : t('hintMouse'), 6500);
}

/* --------------------------------------------------------------------------
   Sound, made on the spot with the Web Audio API (no files): a quiet space
   drone, a whoosh for the flight, the beam, Yusu's little voice.
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

  function noise(seconds = 2) {
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }
  function drone() {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 650;
    const out = ctx.createGain();
    out.gain.value = 0.05;
    lp.connect(out).connect(master);
    [55, 82.41, 110, 164.81, 246.94].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i - 2) * 5;
      const g = ctx.createGain();
      g.gain.value = i > 2 ? 0.08 : 0.22;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + i * 0.025;
      const depth = ctx.createGain();
      depth.gain.value = g.gain.value * 0.6;
      lfo.connect(depth).connect(g.gain);
      o.connect(g).connect(lp);
      o.start();
      lfo.start();
    });
    // a breath of air moving through
    const n = noise(4);
    n.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 700;
    bp.Q.value = 0.5;
    const ng = ctx.createGain();
    ng.gain.value = 0.01;
    const sweep = ctx.createOscillator();
    sweep.frequency.value = 0.06;
    const sweepDepth = ctx.createGain();
    sweepDepth.gain.value = 350;
    sweep.connect(sweepDepth).connect(bp.frequency);
    n.connect(bp).connect(ng).connect(master);
    n.start();
    sweep.start();
  }
  function init() {
    if (ctx || !enabled) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ctx = new AC(); } catch (e) { ctx = null; return; }
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 3);
    drone();
  }
  function tone(type, f0, f1, at, len, vol) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, at);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, at + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + Math.min(0.03, len / 4));
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
        master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 0.6);
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
    whoosh(len = 2.6) {
      if (!live()) return;
      const at = ctx.currentTime;
      const n = noise(len + 0.2);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(160, at);
      bp.frequency.exponentialRampToValueAtTime(2600, at + len * 0.9);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.28, at + len * 0.75);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len);
      n.connect(bp).connect(g).connect(master);
      n.start(at);
      n.stop(at + len + 0.1);
    },
    beam() {
      if (!live()) return;
      const at = ctx.currentTime;
      tone('sine', 1600, 160, at, 0.7, 0.14);
      tone('triangle', 660, 660, at + 0.05, 1.8, 0.05);
      tone('triangle', 990, 990, at + 0.1, 2.0, 0.035);
      tone('sine', 1320, 1320, at + 0.16, 2.2, 0.025);
    },
    powerUp() {
      if (!live()) return;
      const at = ctx.currentTime;
      tone('sine', 110, 220, at, 1.6, 0.08);
      tone('sine', 220, 440, at + 0.2, 1.4, 0.04);
    },
    chatter(len) {
      if (!live()) return;
      let at = ctx.currentTime + 0.05;
      const end = at + len;
      while (at < end) {
        const f = 520 + Math.random() * 620;
        const d = 0.05 + Math.random() * 0.07;
        tone('sine', f, f * (0.85 + Math.random() * 0.4), at, d, 0.05);
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
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
}
function hidePanel() {
  panel.hidden = true;
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
      `<div class="actions"><button class="btn primary" type="button" data-go-room="robotics">Robotics →</button>${linkButton('index.html', document.querySelector('[data-i18n="introList"]')?.textContent || 'List', false)}</div>`;
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
    if (a !== 'foyer') pts.push(PASSAGES[a].inRoom.clone(), PASSAGES[a].inFoyer.clone());
    if (b !== 'foyer') pts.push(PASSAGES[b].inFoyer.clone(), PASSAGES[b].inRoom.clone());
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

renderer.domElement.addEventListener('pointerdown', (e) => {
  if (canSkip()) { finishArrival(); return; }
  if (!state.started) return;
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
      // mouse: the view follows the hand (drag right = look right);
      // touch: you drag the world, like on a map
      const k = drag.type === 'touch' ? 0.006 : 0.0042;
      const dir = drag.type === 'touch' ? 1 : -1;
      state.yaw += dir * dx * k;
      state.pitch = THREE.MathUtils.clamp(state.pitch + dir * dy * k * 0.8, -1.0, 0.9);
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
  if (drag.moved > 6 || state.beam) return;
  const hit = hitAt(e.clientX, e.clientY);
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
  werkstatt: 'werkstatt', workshop: 'werkstatt', kunst: 'kunst', art: 'kunst', foyer: 'foyer', haltung: 'foyer', ueber: 'foyer'
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
  sound.whoosh(2.6);
  arrive(id, ex ? () => visit(ex) : (id === 'kunst' && !ART_OPEN ? () => openArt(null) : null));
}

choiceButtons.forEach((el) => el.addEventListener('click', (e) => {
  e.preventDefault();
  const id = el.getAttribute('data-choice');
  // the big button just enters; the small links keep their address
  const plain = el.classList.contains('g-enter') || id === 'foyer';
  history.replaceState(null, '', plain ? location.pathname + location.search : '#' + id);
  sound.unlock();
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
  if (k.size) {
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
  const rate = k.size ? 5 : 2.6; // speeds up quickly, drifts out slowly
  v.x += (wx - v.x) * Math.min(1, dt * rate);
  v.z += (wz - v.z) * Math.min(1, dt * rate);
  if (Math.abs(v.x) < 0.01 && Math.abs(v.z) < 0.01) { v.x = 0; v.z = 0; return; }
  if (!tryMove(v.x * dt, v.z * dt)) { v.x *= 0.5; v.z *= 0.5; }
}

function stepHover() {
  if (!state.hoverAt || drag.active) return;
  const hit = hitAt(state.hoverAt[0], state.hoverAt[1]);
  const ex = hit && hit.object.userData.exhibit;
  stage.classList.toggle('is-pointing', !!ex);
  if (ex !== state.hovered) {
    if (state.hovered) state.hovered.hoverTarget = 1;
    state.hovered = ex || null;
    if (ex) ex.hoverTarget = 1.035;
  }
}

let debugTime = 0;
function tick() {
  frame(Math.min(clock.getDelta(), 0.05), clock.elapsedTime + debugTime);
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
    // behind the welcome card: drifting outside, the building and the planet in view
    const a = reduceMotion ? 0 : Math.sin(time * 0.05) * 0.45;
    state.pos.set(ORBIT.pos.x + Math.sin(a) * 14, ORBIT.pos.y + (reduceMotion ? 0 : Math.sin(time * 0.13) * 0.6), ORBIT.pos.z - (1 - Math.cos(a)) * 6);
    state.yaw = yawTo(ORBIT.look.x - state.pos.x, ORBIT.look.z - state.pos.z);
    state.pitch = Math.atan2(ORBIT.look.y - state.pos.y, Math.hypot(ORBIT.look.x - state.pos.x, ORBIT.look.z - state.pos.z));
  }
  if (state.started && !state.arriving) updateRoom();

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
  const baseFov = coarse ? 70 : 62;
  const fov = baseFov + state.fovKick * 14;
  if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

  // the room lights (dimmed while you materialise)
  if (Math.abs(state.light - state.lightTarget) > 0.001) {
    state.light += (state.lightTarget - state.light) * Math.min(1, dt * (state.lightTarget > state.light ? 1.1 : 6));
    for (const lamp of lamps) lamp.intensity = lamp.userData.full * state.light;
    hemi.intensity = hemi.userData.full * (0.25 + 0.75 * state.light);
    if (faceMat) faceMat.opacity = clamp01((state.light - 0.35) / 0.65);
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
  camera.rotation.set(state.pitch, state.yaw, roll, 'YXZ');
  sky.position.copy(camera.position);
  renderer.render(scene, camera);
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
buildRobotics();
buildGames();
buildWorkshop();
buildArt();
buildMotes();

camera.position.copy(state.pos);
renderer.setAnimationLoop(tick);

// ?debug in the address: handles for testing in the browser console
if (/[?&]debug\b/.test(location.search)) window.OH_GALLERY = { THREE, renderer, scene, camera, state, exhibits, goToRoom, visit, beamTo, arrive, finishArrival, hands, handUniforms, poseHands,
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
