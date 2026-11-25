/* ==========================================================================
   gallery.js — the walkable 3D gallery on the start page.

   Five rooms around a foyer: Robotics (main hall with the Yusu head),
   Games, Workshop (tools + 3D design) and Art. The exhibits come from the
   same data as the rest of the site:
     assets/projects.data.js  → projects, Yusu stages and current state
     assets/artworks.data.js  → pictures in the art room
   so a new project or artwork shows up here without touching this file.

   Moving: drag to look, click/tap the floor to walk there, click a picture
   or object for its info panel, WASD/arrows to walk, room bar to jump.
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
    toolsTitle: 'Tools', workshopTitle: 'Die Werkstatt',
    workshopText: '3D-Druck, Elektronik, Lötstation, CAD und ein Schreibtisch für Code – alles für die erste Version eines Projekts steht in einem Raum in Aachen.',
    artSoon: 'Artworks folgen', artSoonText: 'Bis dahin alles auf Instagram unter @marcelloswigswag.',
    artWall: 'Bilder, Zeichnungen, Experimente.',
    itchSign: 'Alle Spiele auf itch.io',
    allStages: 'Alle Etappen auf der Projektseite →', toProject: '← Zurück zu Yusu',
    onInstagram: 'Auf Instagram ansehen', clickHint: 'Anklicken für mehr',
    renderCaption: 'Der erste Entwurf als Render',
    hintMouse: 'Ziehen zum Umsehen · Boden anklicken zum Hingehen · WASD oder Pfeiltasten zum Laufen',
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
    toolsTitle: 'Tools', workshopTitle: 'The workshop',
    workshopText: '3D printing, electronics, soldering station, CAD and a desk for code – everything for the first version of a project is in one room in Aachen.',
    artSoon: 'Artworks coming soon', artSoonText: 'Until then, everything is on Instagram as @marcelloswigswag.',
    artWall: 'Pictures, drawings, experiments.',
    itchSign: 'All games on itch.io',
    allStages: 'Every stage on the project page →', toProject: '← Back to Yusu',
    onInstagram: 'View on Instagram', clickHint: 'Click for more',
    renderCaption: 'The first design as a render',
    hintMouse: 'Drag to look around · click the floor to walk there · WASD or arrow keys to move',
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
const ROOMS = {
  foyer:     { x: 0,     z: 0,     w: 14, d: 12, h: 4.6, wall: 0xebe6dc, floor: 0xd8cfc2, ceil: 0xf6f3ed, pattern: 'tiles',
               doors: ['n', 'e', 's', 'w'] },
  robotics:  { x: 0,     z: -18.2, w: 20, d: 22, h: 6.5, wall: 0x2b323c, floor: 0x50555c, ceil: 0x1c2128, pattern: 'concrete',
               doors: ['s'] },
  games:     { x: 15.2,  z: 0,     w: 14, d: 12, h: 4.6, wall: 0x2a2850, floor: 0x24223d, ceil: 0x17162b, pattern: 'carpet',
               doors: ['w'] },
  kunst:     { x: -15.2, z: 0,     w: 14, d: 12, h: 5.2, wall: 0xf6f4f0, floor: 0xb99b76, ceil: 0xfbfaf7, pattern: 'planks',
               doors: ['e'] },
  werkstatt: { x: 0,     z: 14.2,  w: 16, d: 14, h: 4.6, wall: 0xe8dfd2, floor: 0x9f7f5c, ceil: 0xf2ece3, pattern: 'planks',
               doors: ['n'] }
};
const ROOM_ORDER = ['foyer', 'robotics', 'games', 'werkstatt', 'kunst'];

/* Where each side room meets the foyer: a point just inside the room and
   one just inside the foyer. Paths between rooms run through these. */
const PASSAGES = {
  robotics:  { side: 'n', inRoom: new THREE.Vector3(0, EYE, -8.6),  inFoyer: new THREE.Vector3(0, EYE, -4.8) },
  games:     { side: 'e', inRoom: new THREE.Vector3(9.6, EYE, 0),   inFoyer: new THREE.Vector3(5.8, EYE, 0) },
  kunst:     { side: 'w', inRoom: new THREE.Vector3(-9.6, EYE, 0),  inFoyer: new THREE.Vector3(-5.8, EYE, 0) },
  werkstatt: { side: 's', inRoom: new THREE.Vector3(0, EYE, 8.6),   inFoyer: new THREE.Vector3(0, EYE, 4.8) }
};

/* First view of each room (room bar, links like index.html#games). */
const ENTRY = {
  foyer:     { pos: [0, EYE, 4.2],    look: [0, 1.7, -14] },
  robotics:  { pos: [0, EYE, -11.2],  look: [0, 1.7, -19.5] },
  games:     { pos: [9.8, EYE, 0],    look: [22, 1.6, 0] },
  werkstatt: { pos: [0, EYE, 9.4],    look: [0, 1.6, 21] },
  kunst:     { pos: [-9.8, EYE, 0],   look: [-22, 2.0, 0] }
};

/* --------------------------------------------------------------------------
   DOM
   -------------------------------------------------------------------------- */
const stage = document.querySelector('[data-stage]');
const intro = document.querySelector('[data-intro]');
const startBtn = document.querySelector('[data-start]');
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
  startBtn.hidden = true;
  throw new Error('WebGL not available');
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1219);
const camera = new THREE.PerspectiveCamera(coarse ? 70 : 62, window.innerWidth / window.innerHeight, 0.05, 90);

const state = {
  pos: new THREE.Vector3(...ENTRY.foyer.pos),
  yaw: 0,
  pitch: -0.02,
  started: false,
  room: 'foyer',
  glide: null,
  keys: new Set(),
  hovered: null,
  viewShift: 0,
  viewShiftY: 0
};

/* Lights: soft base light everywhere, a lamp per room, a spot on Yusu. */
scene.add(new THREE.HemisphereLight(0xfff8ee, 0x5a5248, 1.5));
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(6, 12, 8);
scene.add(sun);
for (const id of ROOM_ORDER) {
  const r = ROOMS[id];
  const lamp = new THREE.PointLight(id === 'games' ? 0xb7a8ff : 0xfff1dc, id === 'robotics' ? 40 : 22, 0, 1.6);
  lamp.position.set(r.x, r.h - 0.4, r.z);
  scene.add(lamp);
}

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

function floorTexture(kind, color) {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d');
  const base = new THREE.Color(color);
  ctx.fillStyle = '#' + base.getHexString();
  ctx.fillRect(0, 0, 512, 512);
  const shade = (a) => `rgba(0,0,0,${a})`;
  const light = (a) => `rgba(255,255,255,${a})`;
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  if (kind === 'planks') {
    for (let row = 0; row < 8; row++) {
      const y = row * 64;
      let x = -rnd() * 200;
      while (x < 512) {
        const len = 160 + rnd() * 200;
        ctx.fillStyle = rnd() > 0.5 ? light(0.05 * rnd()) : shade(0.07 * rnd());
        ctx.fillRect(x, y, len, 64);
        ctx.fillStyle = shade(0.25);
        ctx.fillRect(x, y, 2, 64);
        x += len;
      }
      ctx.fillStyle = shade(0.3);
      ctx.fillRect(0, y, 512, 2);
      for (let g = 0; g < 14; g++) {
        ctx.fillStyle = shade(0.04);
        ctx.fillRect(0, y + 6 + rnd() * 52, 512, 1);
      }
    }
  } else if (kind === 'tiles') {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      ctx.fillStyle = (i + j) % 2 ? light(0.05) : shade(0.03);
      ctx.fillRect(i * 128, j * 128, 128, 128);
    }
    ctx.strokeStyle = shade(0.16);
    ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(i * 128, 0); ctx.lineTo(i * 128, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * 128); ctx.lineTo(512, i * 128); ctx.stroke();
    }
  } else {
    const n = kind === 'carpet' ? 9000 : 6000;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = rnd() > 0.5 ? light(0.04) : shade(0.06);
      const s = kind === 'carpet' ? 2 : 1 + rnd() * 3;
      ctx.fillRect(rnd() * 512, rnd() * 512, s, s);
    }
    if (kind === 'concrete') {
      ctx.strokeStyle = shade(0.18);
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 512, 512);
    }
  }
  return c;
}

function glowTexture() {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 90, 4, 128, 120, 128);
  g.addColorStop(0, 'rgba(255,244,225,0.95)');
  g.addColorStop(0.45, 'rgba(255,240,215,0.35)');
  g.addColorStop(1, 'rgba(255,240,215,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return canvasTexture(c);
}
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
  wood: new THREE.MeshStandardMaterial({ color: 0x8a6544, roughness: 0.75 }),
  trim: new THREE.MeshStandardMaterial({ color: 0x232830, roughness: 0.6 })
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

function buildRoom(id) {
  const r = ROOMS[id];
  const group = new THREE.Group();

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: r.pattern === 'concrete' ? 0.55 : 0.8,
    map: canvasTexture(floorTexture(r.pattern, r.floor), [r.w / 4, r.d / 4])
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.d), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(r.x, 0, r.z);
  group.add(floor);
  floors.push(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.d), new THREE.MeshBasicMaterial({ color: new THREE.Color(r.ceil).multiplyScalar(0.82) }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(r.x, r.h, r.z);
  group.add(ceil);

  const wallMat = new THREE.MeshStandardMaterial({ color: r.wall, roughness: 0.92 });
  const skirt = new THREE.MeshStandardMaterial({ color: new THREE.Color(r.wall).multiplyScalar(0.72), roughness: 0.8 });
  for (const side of ['n', 'e', 's', 'w']) {
    const horizontal = side === 'n' || side === 's';
    const len = horizontal ? r.w : r.d;
    const hasDoor = r.doors.includes(side);
    const pieces = hasDoor
      ? [[-(len + DOOR_W) / 4, (len - DOOR_W) / 2, r.h, r.h / 2], [(len + DOOR_W) / 4, (len - DOOR_W) / 2, r.h, r.h / 2],
         [0, DOOR_W, r.h - DOOR_H, DOOR_H + (r.h - DOOR_H) / 2]]
      : [[0, len, r.h, r.h / 2]];
    for (const [offset, l, h, cy] of pieces) {
      const mesh = horizontal ? box(l, h, WALL, wallMat) : box(WALL, h, l, wallMat);
      const cx = horizontal ? r.x + offset : (side === 'w' ? r.x - r.w / 2 + WALL / 2 : r.x + r.w / 2 - WALL / 2);
      const cz = horizontal ? (side === 'n' ? r.z - r.d / 2 + WALL / 2 : r.z + r.d / 2 - WALL / 2) : r.z + offset;
      mesh.position.set(cx, cy, cz);
      group.add(mesh);
      blockers.push(mesh);
      if (cy === h / 2) {
        const base = horizontal ? box(l, 0.12, 0.03, skirt) : box(0.03, 0.12, l, skirt);
        base.position.set(
          horizontal ? cx : cx + (side === 'w' ? WALL / 2 + 0.015 : -WALL / 2 - 0.015), 0.06,
          horizontal ? cz + (side === 'n' ? WALL / 2 + 0.015 : -WALL / 2 - 0.015) : cz);
        group.add(base);
      }
    }
  }
  scene.add(group);

  const m = WALL + 0.4;
  walkRects.push([r.x - r.w / 2 + m, r.x + r.w / 2 - m, r.z - r.d / 2 + m, r.z + r.d / 2 - m]);
}

function buildPassage(id) {
  const p = PASSAGES[id];
  const f = ROOMS.foyer;
  const r = ROOMS[id];
  const along = p.side === 'n' || p.side === 's';
  const a = along ? (p.side === 'n' ? f.z - f.d / 2 : f.z + f.d / 2) : (p.side === 'e' ? f.x + f.w / 2 : f.x - f.w / 2);
  const b = along ? (p.side === 'n' ? r.z + r.d / 2 : r.z - r.d / 2) : (p.side === 'e' ? r.x - r.w / 2 : r.x + r.w / 2);
  const mid = (a + b) / 2;
  const len = Math.abs(b - a);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2a2f37, roughness: 0.8 });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(along ? DOOR_W : len, along ? len : DOOR_W), MAT.trim);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(along ? 0 : mid, 0.001, along ? mid : 0);
  scene.add(floor);
  floors.push(floor);
  const top = floor.clone();
  top.rotation.x = Math.PI / 2;
  top.position.y = DOOR_H;
  scene.add(top);
  for (const s of [-1, 1]) {
    const side = along ? box(WALL, DOOR_H, len, mat) : box(len, DOOR_H, WALL, mat);
    side.position.set(along ? s * (DOOR_W / 2 + WALL / 2) : mid, DOOR_H / 2, along ? mid : s * (DOOR_W / 2 + WALL / 2));
    scene.add(side);
    blockers.push(side);
  }
  const half = DOOR_W / 2 - 0.45;
  const lo = Math.min(a, b) - 1.2;
  const hi = Math.max(a, b) + 1.2;
  walkRects.push(along ? [-half, half, lo, hi] : [lo, hi, -half, half]);
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

function plaque(title, line, { width = 1.0, dark = false } = {}) {
  return board(width, width * 0.3, (ctx, w, h) => {
    ctx.fillStyle = dark ? '#151a21' : '#fbfaf7';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = dark ? '#f2f7f8' : '#14181f';
    ctx.font = `700 ${Math.round(h * 0.19)}px ${FONT}`;
    const y = wrapText(ctx, pick(title), w * 0.06, h * 0.12, w * 0.88, h * 0.23, 2);
    const sub = typeof line === 'function' ? line() : pick(line);
    if (sub) {
      ctx.fillStyle = dark ? 'rgba(242,247,248,.7)' : '#5b6068';
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
  // welcome board left of the Robotics door
  const welcome = board(4.6, 2.7, (ctx, w, h) => {
    ctx.fillStyle = '#101826';
    ctx.fillRect(0, 0, w, h);
    drawHeart(ctx, w * 0.1, h * 0.2, h * 0.2, '#f2f7f8');
    ctx.fillStyle = '#f2f7f8';
    ctx.font = `800 ${Math.round(h * 0.13)}px ${FONT}`;
    ctx.fillText('OneHumanity Labs', w * 0.06, h * 0.34, w * 0.9);
    ctx.fillStyle = 'rgba(242,247,248,.6)';
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
    ctx.fillStyle = '#fbfaf7';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#767c85';
    ctx.font = `700 ${Math.round(h * 0.05)}px ${FONT}`;
    ctx.fillText(t('values').toUpperCase(), w * 0.07, h * 0.09);
    [['v1', 'v1t'], ['v2', 'v2t'], ['v3', 'v3t']].forEach(([a, b], i) => {
      const y = h * (0.22 + i * 0.25);
      ctx.fillStyle = '#14181f';
      ctx.font = `800 ${Math.round(h * 0.085)}px ${FONT}`;
      ctx.fillText(t(a), w * 0.07, y);
      ctx.fillStyle = '#4c5259';
      ctx.font = `400 ${Math.round(h * 0.045)}px ${FONT}`;
      wrapText(ctx, t(b), w * 0.07, y + h * 0.11, w * 0.86, h * 0.055, 2);
    });
  }, { px: 1400 });
  place(values, wallSpot('foyer', 'n', 4.3, 2.15));
  addExhibit({ id: 'values', root: values, meshes: [values], room: 'foyer', open: () => openText('values') });

  // signs above the doors
  const signs = [
    ['n', 'robotics', 'roboticsSub'], ['e', 'games', 'gamesSub'], ['s', 'werkstatt', 'werkstattSub'], ['w', 'kunst', 'kunstSub']
  ];
  for (const [side, key, sub] of signs) {
    const sign = board(3.0, 0.78, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#14181f';
      ctx.textAlign = 'center';
      ctx.font = `800 ${Math.round(h * 0.46)}px ${FONT}`;
      ctx.fillText(t(key), w / 2, h * 0.04, w * 0.96);
      ctx.fillStyle = '#5b6068';
      ctx.font = `600 ${Math.round(h * 0.22)}px ${FONT}`;
      ctx.fillText(t(sub), w / 2, h * 0.62, w * 0.96);
    }, { px: 1024, transparent: true });
    place(sign, wallSpot('foyer', side, 0, DOOR_H + 0.62));
  }

  // about: west wall, north part
  const about = framed({ src: 'img/marcello.jpg', w: 1500, h: 1000, maxW: 2.0, maxH: 1.4, style: 'wood' });
  place(about.group, wallSpot('foyer', 'w', 3.6, 1.95));
  const aboutPlaque = plaque({ de: 'Hi, ich bin Marcello.', en: 'Hi, I’m Marcello.' }, () => t('aboutKicker'), { width: 1.4 });
  place(aboutPlaque, wallSpot('foyer', 'w', 3.6, 0.9));
  addExhibit({ id: 'about', root: about.group, meshes: [...about.meshes, aboutPlaque], room: 'foyer', open: () => openText('about') });

  // floor plan: east wall, north part
  const map = board(2.4, 2.0, paintMap, { px: 1024 });
  place(map, wallSpot('foyer', 'e', -3.6, 1.85));
  addExhibit({
    id: 'map', root: map, meshes: [map], room: 'foyer', open: null,
    onPick: (hit) => {
      const room = mapRoomAt(hit.uv);
      if (room) goToRoom(room);
    }
  });

  // take part: south wall, left of the workshop door (seen from inside)
  const join = board(3.6, 2.3, (ctx, w, h) => {
    ctx.fillStyle = '#2C6390';
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

  // heart inlay in the floor
  const inlay = board(2.6, 2.6, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.48, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16,24,38,.72)';
    ctx.fill();
    ctx.lineWidth = w * 0.012;
    ctx.strokeStyle = 'rgba(242,247,248,.5)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.43, 0, Math.PI * 2);
    ctx.stroke();
    drawHeart(ctx, w / 2, h / 2, w * 0.42, '#f2f7f8');
  }, { px: 512, transparent: true });
  inlay.rotation.x = -Math.PI / 2;
  inlay.position.set(0, 0.004, 0.6);
  scene.add(inlay);
}

/* The floor plan is painted from ROOMS, so it always matches the building. */
const MAP_BOUNDS = { minX: -23, maxX: 23, minZ: -30, maxZ: 22 };
function paintMap(ctx, w, h) {
  ctx.fillStyle = '#fbfaf7';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#14181f';
  ctx.font = `800 ${Math.round(h * 0.07)}px ${FONT}`;
  ctx.fillText(t('map'), w * 0.06, h * 0.05);
  ctx.fillStyle = '#767c85';
  ctx.font = `500 ${Math.round(h * 0.04)}px ${FONT}`;
  ctx.fillText(t('mapHint'), w * 0.06, h * 0.14);
  const area = { x: w * 0.06, y: h * 0.22, w: w * 0.88, h: h * 0.74 };
  const sx = area.w / (MAP_BOUNDS.maxX - MAP_BOUNDS.minX);
  const sz = area.h / (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ);
  const s = Math.min(sx, sz);
  const ox = area.x + (area.w - (MAP_BOUNDS.maxX - MAP_BOUNDS.minX) * s) / 2;
  const oz = area.y + (area.h - (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ) * s) / 2;
  paintMap.transform = { s, ox, oz, w, h };
  const colors = { foyer: '#d8cfc2', robotics: '#2b323c', games: '#2a2850', werkstatt: '#c9a97f', kunst: '#ece8e0' };
  for (const id of ROOM_ORDER) {
    const r = ROOMS[id];
    const x = ox + (r.x - r.w / 2 - MAP_BOUNDS.minX) * s;
    const y = oz + (r.z - r.d / 2 - MAP_BOUNDS.minZ) * s;
    ctx.fillStyle = colors[id];
    ctx.fillRect(x, y, r.w * s, r.d * s);
    ctx.strokeStyle = '#14181f';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, r.w * s, r.d * s);
    ctx.fillStyle = id === 'robotics' || id === 'games' ? '#f2f7f8' : '#14181f';
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.round(h * 0.042)}px ${FONT}`;
    ctx.fillText(t(id), x + r.w * s / 2, y + r.d * s / 2 - h * 0.02, r.w * s * 0.9);
    ctx.textAlign = 'left';
  }
  // "you are here"
  const px = ox + (ENTRY.foyer.pos[0] - MAP_BOUNDS.minX) * s;
  const pz = oz + (ENTRY.foyer.pos[2] - MAP_BOUNDS.minZ) * s;
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.arc(px, pz, h * 0.018, 0, Math.PI * 2);
  ctx.fill();
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
const HEAD_SPOT = new THREE.Vector3(0, 0, -19.5);
const HEAD_SCALE = 0.006; // mm → m, six times life size
let head = null;

function buildRobotics() {
  const yusu = projectById('yusu');
  const r = ROOMS.robotics;

  // plinth on a low round stage with a glowing rim
  const stageMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.4, 0.1, 64), MAT.plinth);
  stageMesh.position.set(HEAD_SPOT.x, 0.05, HEAD_SPOT.z);
  scene.add(stageMesh);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.33, 0.018, 8, 96), new THREE.MeshBasicMaterial({ color: 0x8fd8ff }));
  rim.rotation.x = Math.PI / 2;
  rim.position.set(HEAD_SPOT.x, 0.1, HEAD_SPOT.z);
  scene.add(rim);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.8, 48), MAT.plinth);
  plinth.position.set(HEAD_SPOT.x, 0.1 + 0.4, HEAD_SPOT.z);
  scene.add(plinth);
  obstacles.push({ x: HEAD_SPOT.x, z: HEAD_SPOT.z, r: 1.3 });

  const spot = new THREE.SpotLight(0xfff3e2, 95, 0, 0.45, 0.8, 1.6);
  spot.position.set(HEAD_SPOT.x, r.h - 0.2, HEAD_SPOT.z + 2.6);
  spot.target.position.set(HEAD_SPOT.x, 1.6, HEAD_SPOT.z);
  scene.add(spot, spot.target);

  head = new THREE.Group();
  head.position.set(HEAD_SPOT.x, 0.9, HEAD_SPOT.z);
  scene.add(head);
  const headExhibit = addExhibit({
    id: 'project-yusu', root: plinth, meshes: [plinth, stageMesh], room: 'robotics',
    open: () => openProject(yusu), viewDist: 3.8
  });
  headExhibit.center.set(HEAD_SPOT.x, 1.85, HEAD_SPOT.z);
  headExhibit.normal.set(0, 0, 1);
  // the CAD mesh is too dense to test on every hover: pick a box around it
  const pickBox = box(0.95, 1.6, 0.95, new THREE.MeshBasicMaterial());
  pickBox.visible = false;
  pickBox.position.set(0, 0.8, 0);
  head.add(pickBox);
  pickBox.userData.exhibit = headExhibit;
  pickables.push(pickBox);
  headExhibit.noHover = true;
  loadHead().catch(() => { /* the plinth stays, the head is optional */ });

  const label = plaque(yusu ? yusu[lang()]?.title || 'Yusu' : 'Yusu', () => pick({ de: 'Kopf · Version 8 · sechsfach vergrößert', en: 'Head · version 8 · six times life size' }),
    { width: 1.1, dark: true });
  label.position.set(HEAD_SPOT.x, 0.62, HEAD_SPOT.z + 0.74);
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

  // other robots on easels by the entrance
  projectsIn('robotics').filter((p) => p.id !== 'yusu').forEach((p, i) => {
    const along = (i % 2 ? 1 : -1) * (5.2 + Math.floor(i / 2) * 3.4);
    projectFrame(p, 'robotics', 's', along, { y: 2.1, maxW: 2.4, maxH: 1.6, dark: true });
  });
}

/* A heading painted straight onto a wall. */
function wallTitle(roomId, side, along, y, text, dark) {
  const title = board(7, 0.7, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = dark ? 'rgba(242,247,248,.9)' : '#14181f';
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
    const cap = plaque(item.caption || item.alt, () => (item.video ? '▶ Video' : ''), { width: Math.min(opts.maxW, 1.5), dark: opts.dark });
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
  const cap = plaque({ de: (p.de || p.en || {}).title, en: (p.en || p.de || {}).title }, () => (status ? pick(status) : ''), { width: Math.min(maxW, 1.4), dark });
  place(cap, wallSpot(roomId, side, along, y - fh / 2 - 0.3));
  return addExhibit({ id: 'project-' + p.id, root: f.group, meshes: [...f.meshes, cap], room: roomId, open: () => openProject(p) });
}

/* --------------------------------------------------------------------------
   Yusu's head, packed from the real CAD (tools-dev/stl_to_mesh.py)
   -------------------------------------------------------------------------- */
let eyes = null;

async function loadHead() {
  const res = await fetch('assets/models/yusu-head.bin');
  if (!res.ok) throw new Error('head model missing');
  const buf = await res.arrayBuffer();
  const view = new DataView(buf);
  const headerLength = view.getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, headerLength)));
  const span = header.max.map((m, i) => m - header.min[i]);
  let offset = 4 + headerLength;

  const white = new THREE.MeshStandardMaterial({ color: 0xf2f0eb, roughness: 0.5, flatShading: true });
  const black = new THREE.MeshStandardMaterial({ color: 0x1c1f24, roughness: 0.55, flatShading: true });
  const visor = new THREE.MeshStandardMaterial({
    color: 0xdfe8ec, roughness: 0.12, transparent: true, opacity: 0.2, depthWrite: false,
    flatShading: true, side: THREE.DoubleSide
  });
  const materials = { white, white2: white, black, black2: black, neck: black, visor };

  // CAD is z-up with the face towards -y; turn it upright, face to +z
  const model = new THREE.Group();
  model.rotation.x = -Math.PI / 2;
  model.scale.setScalar(HEAD_SCALE);
  model.position.y = 139 * HEAD_SCALE;
  head.add(model);

  const meshes = [];
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
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, materials[part.name] || white);
    if (part.name === 'visor') mesh.renderOrder = 2;
    model.add(mesh);
    meshes.push(mesh);
  }

  // the display behind the visor and the six mouth LEDs
  eyes = createEyes();
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(84, 63), new THREE.MeshBasicMaterial({ map: eyes.texture, toneMapped: false }));
  screen.rotation.x = Math.PI / 2;
  screen.position.set(0, -60, 27);
  model.add(screen);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x8fd8ff, toneMapped: false });
  eyes.leds = [];
  for (let i = 0; i < 6; i++) {
    const led = new THREE.Mesh(new THREE.CircleGeometry(2.4, 16), ledMat.clone());
    led.rotation.x = Math.PI / 2;
    led.position.set(-17.5 + i * 7, -79, -41);
    model.add(led);
    eyes.leds.push(led);
  }
  // soft glow on the plinth top from the face
  const faceLight = new THREE.PointLight(0x8fd8ff, 0.8, 2.5, 2);
  faceLight.position.set(0, 1.1, 0.7);
  head.add(faceLight);
  return meshes;
}

/* The eyes are drawn like the firmware does: two glowing shapes that change
   expression now and then, with blinking in between. */
function createEyes() {
  const canvas = makeCanvas(256, 192);
  const ctx = canvas.getContext('2d');
  const texture = canvasTexture(canvas);
  const moods = ['neutral', 'happy', 'neutral', 'curious', 'blush', 'neutral', 'surprised'];
  const s = { mood: 'neutral', next: 3, blink: 0, nextBlink: 2, look: 0, lookTarget: 0, talk: 0, moodIndex: 0 };

  function eye(cx, cy, mood, open) {
    ctx.save();
    ctx.shadowColor = 'rgba(143,216,255,.9)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#9fe0ff';
    ctx.strokeStyle = '#9fe0ff';
    const w = 54;
    const h = Math.max(4, 66 * open);
    if ((mood === 'happy' || mood === 'blush') && open > 0.3) {
      ctx.lineWidth = 13;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 14, 26, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (mood === 'surprised' && open > 0.3) {
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const ww = mood === 'curious' ? w * 0.9 : w;
      const r = Math.min(18, h / 2);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(cx - ww / 2, cy - h / 2, ww, h, r);
      else ctx.rect(cx - ww / 2, cy - h / 2, ww, h);
      ctx.fill();
    }
    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = '#04070b';
    ctx.fillRect(0, 0, 256, 192);
    const open = s.blink > 0 ? Math.abs(Math.cos(s.blink * Math.PI)) : 1;
    const dx = s.look * 20;
    eye(128 - 73 + dx, 84, s.mood, open);
    eye(128 + 73 + dx, 84, s.mood, open * (s.mood === 'curious' ? 0.7 : 1));
    if (s.mood === 'blush') {
      ctx.fillStyle = 'rgba(255,120,150,.7)';
      ctx.shadowColor = 'rgba(255,120,150,.9)';
      ctx.shadowBlur = 12;
      for (const cx of [128 - 80, 128 + 80]) {
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.ellipse(cx - 14 + k * 14, 132, 4, 7, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    }
    texture.needsUpdate = true;
  }
  draw();

  let acc = 0;
  return {
    texture,
    leds: [],
    update(dt, time) {
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
      this.leds.forEach((led, i) => {
        const base = s.talk > 0 ? 0.35 + 0.65 * Math.abs(Math.sin(time * 9 + i * 0.9)) : (i === 0 || i === 5 ? 0.25 : 0.55);
        led.material.color.setRGB(0.56 * base, 0.85 * base, 1.0 * base);
      });
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
  // neon strips along the ceiling
  [-1, 1].forEach((s, i) => {
    const strip = box(r.w - 1, 0.05, 0.05, new THREE.MeshBasicMaterial({ color: neon[i] }));
    strip.position.set(r.x, r.h - 0.25, r.z + s * (r.d / 2 - WALL - 0.1));
    scene.add(strip);
  });

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
  const side = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5, emissive: accent, emissiveIntensity: 0.25 });
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
  const tools = projectsIn('tools').filter((p) => p.featured !== false);
  const east = tools.slice(0, Math.ceil(tools.length / 2));
  const west = tools.slice(Math.ceil(tools.length / 2));
  wallTitle('werkstatt', 'e', 0, r.h - 0.75, () => t('toolsTitle'));
  wallTitle('werkstatt', 'w', 0, r.h - 0.75, () => t('toolsTitle'));
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
    ctx.fillStyle = '#efe7da';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(80,60,40,.28)';
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
    projectFrame(p, 'werkstatt', 's', along, { y: 2.3, maxW: 1.45, maxH: 1.15, style: 'light' });
  });

  // photos of the real workshop next to the door
  const photos = [
    { src: 'img/workshop-bench.jpg', w: 1600, h: 1200, alt: { de: 'Werkbank mit Lochwand, Werkzeug und Lichtleiste', en: 'Workbench with pegboard, tools and light bar' } },
    { src: 'img/workshop-evening.jpg', w: 1600, h: 1200, alt: { de: 'Die Werkstatt am Abend', en: 'The workshop in the evening' } },
    { src: 'img/workshop-desk.jpg', w: 1600, h: 1200, alt: { de: 'Schreibtisch am Fenster', en: 'Desk by the window' } }
  ];
  photos.forEach((ph, i) => {
    const along = [-5.9, -3.5, 3.6][i];
    const f = framed({ src: ph.src, w: ph.w, h: ph.h, maxW: 1.9, maxH: 1.45, style: 'wood' });
    place(f.group, wallSpot('werkstatt', 'n', along, 1.9));
    addExhibit({ id: ph.src, root: f.group, meshes: f.meshes, room: 'werkstatt',
      open: () => openMedia({ ...ph, caption: ph.alt }, { kicker: t('workshopTitle'), text: t('workshopText') }) });
  });
  const note = board(2.2, 1.45, (ctx, w, h) => {
    ctx.fillStyle = '#fbfaf7';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#14181f';
    ctx.font = `800 ${Math.round(h * 0.13)}px ${FONT}`;
    ctx.fillText(t('workshopTitle'), w * 0.08, h * 0.1, w * 0.84);
    ctx.fillStyle = '#4c5259';
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
    ctx.fillStyle = '#14181f';
    ctx.font = `800 ${Math.round(h * 0.4)}px ${FONT}`;
    ctx.fillText(t('kunst'), 0, h * 0.04);
    ctx.fillStyle = '#5b6068';
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
        ctx.fillStyle = '#efece6';
        ctx.fillRect(0, 0, w, h);
        drawHeart(ctx, w / 2, h * 0.3, w * 0.28, 'rgba(20,24,31,.18)');
        ctx.textAlign = 'center';
        ctx.fillStyle = '#14181f';
        ctx.font = `800 ${Math.round(w * 0.085)}px ${FONT}`;
        ctx.fillText(t('artSoon'), w / 2, h * 0.5, w * 0.86);
        ctx.fillStyle = '#5b6068';
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
      const cap = plaque({ de: (art.de || art.en || {}).title, en: (art.en || art.de || {}).title }, () => String(art.year || ''), { width: 0.9 });
      place(cap, wallSpot('kunst', side, along, 2.25 - fh / 2 - 0.28));
      meshes.push(cap);
    }
    addExhibit({ id: art ? 'art-' + art.id : 'art-soon-' + i, root: f.group, meshes, room: 'kunst', open: () => openArt(art) });
  });

  // a bench to sit and look
  const bench = box(2.4, 0.45, 0.6, MAT.wood);
  bench.position.set(r.x - 1, 0.225, r.z);
  bench.rotation.y = Math.PI / 2;
  scene.add(bench);
  obstacles.push({ x: r.x - 1, z: r.z - 0.7, r: 0.7 }, { x: r.x - 1, z: r.z + 0.7, r: 0.7 });
}

/* --------------------------------------------------------------------------
   Info panel
   -------------------------------------------------------------------------- */
let panelBuilder = null;

function showPanel(build) {
  panelBuilder = build;
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
  if (roomBtn) { hidePanel(); goToRoom(roomBtn.getAttribute('data-go-room')); }
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
  if (!state.started) return;
  drag.active = true;
  drag.id = e.pointerId;
  drag.x = e.clientX;
  drag.y = e.clientY;
  drag.moved = 0;
  drag.type = e.pointerType;
  renderer.domElement.setPointerCapture(e.pointerId);
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
      const k = drag.type === 'touch' ? 0.006 : 0.0042;
      state.yaw += dx * k;
      state.pitch = THREE.MathUtils.clamp(state.pitch + dy * k * 0.8, -0.8, 0.7);
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
  if (drag.moved > 6) return;
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
  const step = THREE.MathUtils.clamp(-e.deltaY * 0.004, -0.8, 0.8);
  tryMove(-Math.sin(state.yaw) * step, -Math.cos(state.yaw) * step);
}, { passive: false });

const MOVE_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !panel.hidden) { hidePanel(); return; }
  if (!state.started || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
  if (!MOVE_KEYS.includes(e.code)) return;
  if (e.target.closest && e.target.closest('.g-panel') && e.code.startsWith('Arrow')) return;
  state.keys.add(e.code);
  state.glide = null;
  if (e.code.startsWith('Arrow')) e.preventDefault();
});
window.addEventListener('keyup', (e) => state.keys.delete(e.code));
window.addEventListener('blur', () => state.keys.clear());

roomButtons.forEach((btn) => btn.addEventListener('click', () => {
  if (!state.started) start();
  goToRoom(btn.getAttribute('data-room'));
}));
document.querySelectorAll('[data-room-link]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  if (!state.started) start();
  goToRoom(a.getAttribute('data-room-link'));
}));

/* --------------------------------------------------------------------------
   Links into the gallery: #robotics, #games, #tools, #design, #kunst,
   #mitmachen, #project-<id>
   -------------------------------------------------------------------------- */
const HASH_ROOMS = {
  robotics: 'robotics', projekte: 'robotics', games: 'games', tools: 'werkstatt', design: 'werkstatt',
  werkstatt: 'werkstatt', workshop: 'werkstatt', kunst: 'kunst', art: 'kunst', foyer: 'foyer', haltung: 'foyer', ueber: 'foyer'
};
function followHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return false;
  if (h === 'mitmachen') { goToRoom('foyer'); const ex = exhibits.find((x) => x.id === 'mitmachen'); if (ex) visit(ex); return true; }
  if (HASH_ROOMS[h]) { goToRoom(HASH_ROOMS[h]); return true; }
  const ex = exhibits.find((x) => x.id === h);
  if (ex) { visit(ex); return true; }
  return false;
}
window.addEventListener('hashchange', () => { if (state.started) followHash(); });
document.querySelectorAll('.g-intro-rooms a').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  history.replaceState(null, '', a.getAttribute('href'));
  start();
}));

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
function start() {
  if (state.started) return;
  state.started = true;
  roomButtons.forEach((b) => b.setAttribute('aria-current', String(b.getAttribute('data-room') === state.room)));
  intro.classList.add('is-hidden');
  intro.setAttribute('aria-hidden', 'true');
  if (!followHash()) {
    state.pos.set(...ENTRY.foyer.pos);
  }
  toast(coarse ? t('hintTouch') : t('hintMouse'));
}
startBtn.addEventListener('click', start);

document.addEventListener('oh:langchange', () => {
  labels.forEach((repaint) => repaint());
  if (panelBuilder) panelBody.innerHTML = panelBuilder();
  if (!ready) statusEl.textContent = t('loading');
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
  const speed = 6.5;
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

function stepKeys(dt) {
  const k = state.keys;
  if (!k.size) return;
  const speed = (k.has('ShiftLeft') || k.has('ShiftRight') ? 6 : 3.2) * dt;
  const forward = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
  const strafe = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
  const turn = (k.has('ArrowLeft') || k.has('KeyQ') ? 1 : 0) - (k.has('ArrowRight') || k.has('KeyE') ? 1 : 0);
  state.yaw += turn * dt * 1.9;
  const sin = Math.sin(state.yaw);
  const cos = Math.cos(state.yaw);
  const dx = (-sin * forward + cos * strafe) * speed;
  const dz = (-cos * forward - sin * strafe) * speed;
  if (dx || dz) tryMove(dx, dz);
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

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;

  if (state.started) {
    if (state.glide) stepGlide(dt);
    stepKeys(dt);
    hoverTick += dt;
    if (hoverTick > 0.08) { hoverTick = 0; stepHover(); }
  } else {
    // behind the welcome card: a slow look around the foyer
    state.yaw = Math.sin(time * 0.12) * 0.32;
    state.pitch = -0.02;
  }
  updateRoom();

  for (const ex of exhibits) {
    if (!ex.hoverTarget || ex.noHover) continue;
    const s = ex.root.scale.x + (ex.hoverTarget - ex.root.scale.x) * Math.min(1, dt * 10);
    ex.root.scale.setScalar(s);
    if (Math.abs(s - ex.hoverTarget) < 0.001 && ex.hoverTarget === 1) ex.hoverTarget = 0;
  }

  // Yusu turns towards you, like the neck servo does
  if (head) {
    const inHall = state.room === 'robotics';
    const want = inHall
      ? THREE.MathUtils.clamp(Math.atan2(state.pos.x - HEAD_SPOT.x, state.pos.z - HEAD_SPOT.z), -1.1, 1.1)
      : Math.sin(time * 0.3) * 0.4;
    head.rotation.y += (want - head.rotation.y) * Math.min(1, dt * 1.6);
    if (eyes) eyes.update(dt, time);
  }

  // the panel covers part of the view: move the picture out from under it
  // (left on wide screens, up on phones)
  const narrow = window.innerWidth <= 700;
  const wantX = !panel.hidden && !narrow ? (panel.offsetWidth + 16) / 2 / window.innerWidth : 0;
  const wantY = !panel.hidden && narrow ? 0.22 : 0;
  if (Math.abs(state.viewShift - wantX) > 0.001 || Math.abs(state.viewShiftY - wantY) > 0.001) {
    state.viewShift += (wantX - state.viewShift) * Math.min(1, dt * 6);
    state.viewShiftY += (wantY - state.viewShiftY) * Math.min(1, dt * 6);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (state.viewShift > 0.002 || state.viewShiftY > 0.002) camera.setViewOffset(w, h, w * Math.max(0, state.viewShift), h * Math.max(0, state.viewShiftY), w, h);
    else camera.clearViewOffset();
  }

  camera.position.copy(state.pos);
  camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
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
ROOM_ORDER.forEach(buildRoom);
Object.keys(PASSAGES).forEach(buildPassage);
buildFoyer();
buildRobotics();
buildGames();
buildWorkshop();
buildArt();

camera.position.copy(state.pos);
renderer.setAnimationLoop(tick);

// ?debug in the address: handles for testing in the browser console
if (/[?&]debug\b/.test(location.search)) window.OH_GALLERY = { THREE, renderer, scene, camera, state, exhibits, goToRoom, visit };

function markReady() {
  if (ready) return;
  ready = true;
  startBtn.disabled = false;
  statusEl.textContent = t('ready');
  // arriving through a link like index.html#games: go straight in
  if (location.hash && location.hash.length > 1) start();
}
const waitStart = performance.now();
(function waitForImages() {
  if (pendingImages <= 0 || performance.now() - waitStart > 4500) markReady();
  else setTimeout(waitForImages, 120);
})();
