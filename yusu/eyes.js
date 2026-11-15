/* Yusu – Augen und LED-Mund im Browser.
   Port von emotion_lab/render.py und mouth.py (gleiche Werte wie config.py und die ESP32-Firmware):
   leuchtende LED-Matrix-Ovale, Emotion nur über die Lidform, Blinzeln, Mikrobewegungen, Lichthof.
   Alle Maße beziehen sich auf das 480er Display des Kopfes und werden skaliert. */
(function () {
  'use strict';

  const CFG = {
    EYE_SIZE: [40, 88], EYE_SPACING: 110, EYE_CENTER_Y: 225,
    EYE_GLOW: 0.45, EYE_GLOW_SIGMA: 14,
    EYE_CORE_SIZE: [0.50, 0.70], EYE_CORE_ADAPT_SEC: 1.5, EYE_CORE_FOLLOW: [0.30, 0.20],
    LID_SHADOW: 0.45, LED_PITCH: 8, LED_DOT: 6, LED_GAP_LEVEL: 0.42,
    EYE_GAZE_RANGE: [42, 26], EYE_TRANSITION_SEC: 0.3,
    MICRO_MOVE_PX: 3.0, MICRO_MOVE_INTERVAL_SEC: [0.6, 2.0], BREATH_PX: 2.0,
    BLINK_INTERVAL_SEC: [3.0, 6.0], BLINK_DOUBLE_CHANCE: 0.15, BLINK_MEET: 0.25,
    MOUTH_LEDS: 6, MOUTH_MAX: 0.6, MOUTH_IDLE: [0.10, 0.30], MOUTH_BREATH_SEC: 4.0,
    MOUTH_SLEEP: [0.02, 0.08], MOUTH_SLEEP_BREATH_SEC: 9.0,
    MOUTH_THINK: 0.45, MOUTH_THINK_SEC: 1.6, MOUTH_SPEAK: [0.15, 1.0], MOUTH_FADE_SEC: 0.08,
    MAX_PIXELS: 720            // größte Kantenlänge des Bildspeichers (schont Akku und Rechenzeit)
  };

  // Augenform je Emotion (config.EYE_SHAPES): Ober-/Unterlid als Masken, in halben Augenhöhen ab der Mitte
  const S = (up_in, up_out, up_curve, lo, lo_curve, sx, sy, core) =>
    ({ up_in, up_out, up_curve, lo, lo_curve, sx, sy, core });
  const EYE_SHAPES = {
    ruhig:       S(-0.82, -0.82, 0.18, 1.10, 0.0, 1.00, 1.00, 1.00),
    zufrieden:   S(-1.10, -1.10, 0.0, 0.70, 0.40, 1.00, 1.00, 1.00),
    freudig:     S(-1.10, -1.10, 0.0, 0.40, 0.85, 1.04, 1.02, 1.00),
    neugierig:   S(-1.10, -1.10, 0.0, 1.10, 0.0, 1.05, 1.08, 1.10),
    ueberrascht: S(-1.10, -1.10, 0.0, 1.10, 0.0, 1.30, 0.96, 0.75),
    traurig:     S(-0.95, -0.20, 0.0, 1.10, 0.0, 1.00, 0.96, 1.05),
    besorgt:     S(-0.80, -0.35, 0.0, 0.95, 0.0, 1.00, 1.00, 1.00),
    muede:       S(-0.05, -0.05, 0.1, 0.85, 0.0, 1.00, 0.95, 1.00),
    gelangweilt: S(-0.35, -0.35, 0.0, 0.55, 0.0, 1.02, 0.95, 1.00),
    herzlich:    S(-1.10, -1.10, 0.0, 0.80, 0.40, 1.10, 1.06, 1.25),
    schlafend:   S(0.18, 0.18, -0.15, 0.28, -0.15, 1.00, 1.00, 1.00)
  };

  // Augenfarben (config.EYE_COLORS): heller Kern -> Mitte -> Rand -> Lichthof
  const EYE_COLORS = {
    hellblau: { label: 'Hellblau', core: [235, 252, 255], mid: [150, 228, 255], edge: [55, 150, 245], glow: [60, 150, 255] },
    gruen:    { label: 'Grün',     core: [235, 255, 240], mid: [120, 255, 150], edge: [20, 210, 90],  glow: [30, 230, 100] },
    rot:      { label: 'Rot',      core: [255, 235, 230], mid: [255, 120, 100], edge: [230, 30, 40],  glow: [255, 40, 40] },
    pink:     { label: 'Pink',     core: [255, 235, 250], mid: [255, 140, 220], edge: [240, 50, 170], glow: [255, 60, 190] },
    lila:     { label: 'Lila',     core: [245, 235, 255], mid: [190, 150, 255], edge: [130, 60, 240], glow: [140, 70, 255] },
    weiss:    { label: 'Weiß',     core: [255, 255, 255], mid: [235, 240, 255], edge: [170, 185, 215], glow: [200, 210, 235] }
  };

  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const rand = (a, b) => a + Math.random() * (b - a);
  const ease = (cur, target, dt, tau) => (tau <= 0 ? target : cur + (target - cur) * (1 - Math.exp(-dt / tau)));

  /* Natürliches Blinzeln: zufällige Abstände, weiches Lid, selten doppelt. 0 = offen, 1 = zu. */
  class Blinker {
    constructor() { this.start = -10; this.next = 2; this.double = false; }
    static tri(x) {
      const CLOSE = 0.10, HOLD = 0.04, OPEN = 0.16;
      const sm = (u) => u * u * (3 - 2 * u);
      if (x < 0 || x > CLOSE + HOLD + OPEN) return 0;
      if (x < CLOSE) return sm(x / CLOSE);
      if (x < CLOSE + HOLD) return 1;
      return 1 - sm((x - CLOSE - HOLD) / OPEN);
    }
    now(t) {
      if (t - this.start > 0.30) {
        this.start = t; this.double = false;
        this.next = t + rand(CFG.BLINK_INTERVAL_SEC[0], CFG.BLINK_INTERVAL_SEC[1]);
      }
    }
    closure(t, allowNew) {
      if (t >= this.next) {
        this.next = t + rand(CFG.BLINK_INTERVAL_SEC[0], CFG.BLINK_INTERVAL_SEC[1]);
        if (allowNew) { this.start = t; this.double = Math.random() < CFG.BLINK_DOUBLE_CHANCE; }
      }
      const x = t - this.start;
      return Math.max(Blinker.tri(x), this.double ? Blinker.tri(x - 0.38) : 0);
    }
  }

  class Face {
    /* eyes/glow: <canvas>, leds: Liste der Mund-LED-Elemente, wrap: Element, dessen Deckkraft die Augenhelligkeit ist */
    constructor(eyes, glow, leds, wrap) {
      this.canvas = eyes; this.ctx = eyes.getContext('2d');
      this.glow = glow; this.gctx = glow.getContext('2d');
      this.leds = Array.from(leds); this.wrap = wrap;
      this.shape = Object.assign({}, EYE_SHAPES.ruhig);
      this.gaze = [0, 0];
      this.core = (CFG.EYE_CORE_SIZE[0] + CFG.EYE_CORE_SIZE[1]) / 2;
      this.blinker = new Blinker();
      this.micro = [0, 0]; this.microTarget = [0, 0]; this.nextMicro = 0;
      this.intensity = 1; this.t = null;
      this.palette = EYE_COLORS.hellblau;
      this.ledLevel = this.leds.map(() => 0);
      this.size = 0; this.img = null; this.dot = null;
      this.resize(480);
    }

    setColor(key) {
      this.palette = EYE_COLORS[key] || EYE_COLORS.hellblau;
      const g = this.palette.glow;
      this.glowStyle = 'rgb(' + g[0] + ',' + g[1] + ',' + g[2] + ')';
    }

    /* px = Kantenlänge in Gerätepixeln; der Bildspeicher wird auf MAX_PIXELS begrenzt. */
    resize(px) {
      const size = Math.max(120, Math.min(CFG.MAX_PIXELS, Math.round(px)));
      if (size === this.size) return;
      this.size = size;
      this.canvas.width = this.canvas.height = size;
      const g = Math.max(60, Math.round(size / 4));     // Lichthof wird ohnehin weichgezeichnet
      this.glow.width = this.glow.height = g;
      this.img = this.ctx.createImageData(size, size);
      // LED-Raster: fest auf dem Display, Punkte mit weicher Kante
      const k = size / 480, p = CFG.LED_PITCH * k, d = CFG.LED_DOT * k;
      this.dot = new Float32Array(size);
      for (let i = 0; i < size; i++) this.dot[i] = clamp01(0.5 + (d / 2 - Math.abs((i % p) - p / 2 + 0.5)));
      if (!this.glowStyle) this.setColor('hellblau');
    }

    blink(t) { this.blinker.now(t); }

    /* Ein Bild zeichnen.
       state: Emotion, brightness: Umgebungslicht 0..1 (weitet den Kern), gaze: [x, y] in -1..1 oder null,
       intensity: Augenhelligkeit 0.1..1, mouth: 'idle' | 'think' | 'speak', level: Sprachpegel 0..1 */
    frame(t, o) {
      const state = EYE_SHAPES[o.state] ? o.state : 'ruhig';
      const dt = this.t === null ? 0 : Math.min(0.2, Math.max(0, t - this.t));
      this.t = t;
      const asleep = state === 'schlafend';
      const target = EYE_SHAPES[state], sh = this.shape;
      for (const key in sh) sh[key] = ease(sh[key], target[key], dt, CFG.EYE_TRANSITION_SEC / 3);

      let gaze = o.gaze;
      const W = 2 * Math.PI / 20;                         // Umherschauen: nahtloser 20-s-Loop
      if (!gaze) gaze = asleep ? [0, 0] : [0.45 * Math.sin(W * t), 0.2 * Math.sin(W * 2 * t)];
      this.gaze[0] = ease(this.gaze[0], gaze[0], dt, 0.12);
      this.gaze[1] = ease(this.gaze[1], gaze[1], dt, 0.12);

      const light = clamp01(((o.brightness === undefined ? 0.5 : o.brightness) - 0.1) / 0.5);
      const cLo = CFG.EYE_CORE_SIZE[0], cHi = CFG.EYE_CORE_SIZE[1];
      this.core = ease(this.core, cHi + (cLo - cHi) * light, dt, CFG.EYE_CORE_ADAPT_SEC / 3);

      if (t >= this.nextMicro) {
        const r = asleep ? 0 : CFG.MICRO_MOVE_PX;
        this.microTarget = [rand(-r, r), rand(-r, r) * 0.6];
        this.nextMicro = t + rand(CFG.MICRO_MOVE_INTERVAL_SEC[0], CFG.MICRO_MOVE_INTERVAL_SEC[1]);
      }
      this.micro[0] = ease(this.micro[0], this.microTarget[0], dt, 0.04);
      this.micro[1] = ease(this.micro[1], this.microTarget[1], dt, 0.04);

      const want = Math.min(1, Math.max(0.1, o.intensity === undefined ? 1 : o.intensity));
      this.intensity = ease(this.intensity, want, dt, 0.3);
      const closure = this.blinker.closure(t, !asleep);

      const size = this.size, k = size / 480;
      const breath = CFG.BREATH_PX * Math.sin(2 * Math.PI * t / CFG.MOUTH_BREATH_SEC);
      const gx = CFG.EYE_GAZE_RANGE[0] * this.gaze[0] + this.micro[0];
      const gy = CFG.EYE_GAZE_RANGE[1] * this.gaze[1] + this.micro[1] + breath;
      const rx = CFG.EYE_SIZE[0] * sh.sx * k, ry = CFG.EYE_SIZE[1] * sh.sy * k;
      this.img.data.fill(0);
      for (const side of [-1, 1]) {                       // -1 = linkes Auge auf dem Display
        const ex = size / 2 + k * (side * CFG.EYE_SPACING + gx);
        const ey = k * (CFG.EYE_CENTER_Y + gy);
        this._eye(ex, ey, rx, ry, side, closure, k);
      }
      this.ctx.putImageData(this.img, 0, 0);

      // Lichthof: die Augenform in der Lichthof-Farbe, per CSS weichgezeichnet (liegt unter den Augen)
      const g = this.gctx, gs = this.glow.width;
      g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, gs, gs);
      g.drawImage(this.canvas, 0, 0, gs, gs);
      g.globalCompositeOperation = 'source-in';
      g.fillStyle = this.glowStyle;
      g.fillRect(0, 0, gs, gs);

      this.wrap.style.opacity = this.intensity.toFixed(3);
      this._mouth(t, dt, o.mouth || 'idle', o.level || 0, asleep);
    }

    _eye(ex, ey, rx, ry, side, closure, k) {
      const sh = this.shape, size = this.size, data = this.img.data, dot = this.dot, pal = this.palette;
      const x0 = Math.max(0, Math.floor(ex - rx - 2)), x1 = Math.min(size, Math.ceil(ex + rx + 3));
      const y0 = Math.max(0, Math.floor(ey - ry - 2)), y1 = Math.min(size, Math.ceil(ey + ry + 3));
      if (x0 >= x1 || y0 >= y1) return;
      const m = CFG.BLINK_MEET, c = closure;
      const hx = ex + CFG.EYE_CORE_FOLLOW[0] * rx * this.gaze[0];
      const hy = ey + CFG.EYE_CORE_FOLLOW[1] * ry * this.gaze[1];
      const core = this.core * sh.core;
      const cc = pal.core, cm = pal.mid, ce = pal.edge;
      const gap = CFG.LED_GAP_LEVEL;
      for (let x = x0; x < x1; x++) {
        const u = (x - ex) / rx;
        if (u <= -1.1 || u >= 1.1) continue;
        // Lider: tt = 0 innen (zur Nase), 1 außen; Blinzeln schiebt beide zum Treffpunkt
        const tt = clamp01(0.5 + side * u / 2);
        const bump = 1 - (2 * tt - 1) * (2 * tt - 1);
        let up = sh.up_in + (sh.up_out - sh.up_in) * tt - sh.up_curve * bump;
        let lo = sh.lo - sh.lo_curve * bump;
        up += (m - up) * c; lo += (m - lo) * c;
        const yUp = ey + up * ry, yLo = ey + lo * ry;
        const yTop = ey - ry * Math.sqrt(clamp01(1 - u * u));
        const cut = clamp01((yUp - yTop) / (6 * k));      // Schatten nur, wo das Lid ins Auge schneidet
        const ur = u / rx, dx = (x - hx) / rx;
        const ya = Math.max(y0, Math.floor(yUp - 1)), yb = Math.min(y1, Math.ceil(yLo + 1));
        for (let y = ya; y < yb; y++) {
          const v = (y - ey) / ry;
          const r2 = u * u + v * v;
          const grad = 2 * Math.sqrt(ur * ur + (v / ry) * (v / ry)) + 1e-6;
          let a = clamp01(0.5 - (r2 - 1) / grad);         // Ellipse mit weicher Kante
          if (a <= 0) continue;
          a *= clamp01(0.5 + (y - yUp)) * clamp01(0.5 + (yLo - y));
          if (a <= 0) continue;
          // heller Kern -> Mitte -> Rand; der Kern wandert in Blickrichtung
          const dy = (y - hy) / ry;
          const rn = Math.sqrt(dx * dx + dy * dy);
          let r, g, b;
          if (rn < core) {
            const q = (rn / core) * (rn / core);
            r = cc[0] + (cm[0] - cc[0]) * q; g = cc[1] + (cm[1] - cc[1]) * q; b = cc[2] + (cm[2] - cc[2]) * q;
          } else {
            const q = clamp01((rn - core) / (1.15 - core));
            r = cm[0] + (ce[0] - cm[0]) * q; g = cm[1] + (ce[1] - cm[1]) * q; b = cm[2] + (ce[2] - cm[2]) * q;
          }
          let f = 1 - CFG.LID_SHADOW * cut * (1 - clamp01((y - yUp) / (10 * k)));
          // LED-Raster nur auf hellen Bereichen
          const luma = Math.max(r, g, b) * f * a / 255;
          const w = clamp01((luma - 0.30) / 0.30);
          f *= 1 - w + w * (gap + (1 - gap) * Math.min(dot[x], dot[y]));
          const i = (y * size + x) * 4;
          const al = a * 255;
          if (al > data[i + 3]) { data[i] = r * f; data[i + 1] = g * f; data[i + 2] = b * f; data[i + 3] = al; }
        }
      }
    }

    /* LED-Mund (mouth.py): idle = Atmen, think = Lauflicht, speak = Breite/Helligkeit folgt dem Pegel */
    _mouth(t, dt, mode, level, asleep) {
      const n = this.leds.length;
      for (let i = 0; i < n; i++) {
        let b;
        if (mode === 'think') {
          const pos = (n - 1) * (0.5 - 0.5 * Math.cos(2 * Math.PI * t / CFG.MOUTH_THINK_SEC));
          b = 0.04 + CFG.MOUTH_THINK * Math.max(0, 1 - Math.abs(i - pos) / 1.2);
        } else if (mode === 'speak') {
          const d = Math.abs(i - (n - 1) / 2);
          const on = clamp01(level * n / 2 - d + 0.5);
          b = on * (CFG.MOUTH_SPEAK[0] + (CFG.MOUTH_SPEAK[1] - CFG.MOUTH_SPEAK[0]) * level) * CFG.MOUTH_MAX;
        } else {
          const rng = asleep ? CFG.MOUTH_SLEEP : CFG.MOUTH_IDLE;
          const per = asleep ? CFG.MOUTH_SLEEP_BREATH_SEC : CFG.MOUTH_BREATH_SEC;
          b = rng[0] + (rng[1] - rng[0]) * (0.5 - 0.5 * Math.cos(2 * Math.PI * t / per));
        }
        this.ledLevel[i] = ease(this.ledLevel[i], b, dt, CFG.MOUTH_FADE_SEC);
        this.leds[i].style.opacity = Math.min(1, this.ledLevel[i] / CFG.MOUTH_MAX).toFixed(3);
      }
    }
  }

  window.YusuEyes = { Face, EYE_COLORS, EYE_SHAPES, GLOW: CFG.EYE_GLOW, GLOW_SIGMA: CFG.EYE_GLOW_SIGMA, ease };
})();
