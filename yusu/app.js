/* Yusu – Begleit-App: Zustand, Persönlichkeit, Gespräch.
   Augen: eyes.js. Charakter und Regeln: persona.js. Sprachmodell: ein Ollama-Server (siehe lokal.py). */
(function () {
  'use strict';

  const P = window.YusuPersona, E = window.YusuEyes;
  const $ = (id) => document.getElementById(id);
  const now = () => performance.now() / 1000;

  /* ---------------------------------------------------------------- Einstellungen */
  const STORE = 'yusu-app-v1';
  const DEFAULTS = {
    name: 'Yusu', voice: 'männlich', eye_color: 'hellblau', charakter: P.CHARAKTER,
    tts: true, stt: false, ttsVoice: '', llmUrl: '', llmModel: 'qwen3.5:4b'
  };
  const VOICES = ['weiblich', 'männlich'];

  function clean(o) {
    const c = Object.assign({}, DEFAULTS);
    if (o && typeof o === 'object') {
      if (typeof o.name === 'string' && o.name.trim()) c.name = o.name.trim().slice(0, 30);
      if (VOICES.indexOf(o.voice) >= 0) c.voice = o.voice;
      if (E.EYE_COLORS[o.eye_color]) c.eye_color = o.eye_color;
      if (typeof o.charakter === 'string' && o.charakter.trim()) c.charakter = o.charakter.slice(0, 20000);
      if (typeof o.tts === 'boolean') c.tts = o.tts;
      if (typeof o.stt === 'boolean') c.stt = o.stt;
      if (typeof o.ttsVoice === 'string') c.ttsVoice = o.ttsVoice.slice(0, 200);
      if (typeof o.llmUrl === 'string') c.llmUrl = o.llmUrl.trim().slice(0, 300);
      if (typeof o.llmModel === 'string' && o.llmModel.trim()) c.llmModel = o.llmModel.trim().slice(0, 100);
    }
    return c;
  }
  function load() {
    try { return clean(JSON.parse(localStorage.getItem(STORE))); } catch (e) { return clean(null); }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch (e) { /* privater Modus: nur für diese Sitzung */ }
  }
  let cfg = load();

  /* ---------------------------------------------------------------- Gesicht */
  const stage = $('stage'), faceEl = $('face'), said = $('said');
  const face = new E.Face($('eyes'), $('glow'), document.querySelectorAll('#mouth i'), $('lights'));
  face.setColor(cfg.eye_color);

  function layout() {
    const s = Math.floor(Math.min(stage.clientWidth, stage.clientHeight));
    if (s <= 0) return;
    document.documentElement.style.setProperty('--face', s + 'px');
    face.resize(s * Math.min(2, window.devicePixelRatio || 1));
  }
  if (window.ResizeObserver) new ResizeObserver(layout).observe(stage);
  window.addEventListener('resize', layout);
  layout();

  /* ---------------------------------------------------------------- Innerer Zustand */
  const st = {
    emotion: 'ruhig', emotionUntil: 0,   // gezeigte Emotion klingt nach einer Weile zu "ruhig" ab
    listening: false, thinking: false,
    speakPending: 0, fakeSpeakUntil: 0,  // Sprachausgabe läuft (echt bzw. ohne Ton nur als Mund-Animation)
    level: 0, levelTarget: 0, levelNext: 0,
    pointer: null, pointerUntil: 0,
    lastActive: now(), asleep: false
  };
  const EMOTION_HOLD_SEC = 12, SLEEP_IDLE_SEC = 20 * 60, QUIET_AFTER_SEC = 8;

  function setEmotion(state, hold) {
    st.emotion = state;
    st.emotionUntil = now() + (hold || EMOTION_HOLD_SEC);
  }
  function isNight() { const h = new Date().getHours(); return h >= 22 || h < 7; }
  function speaking(t) { return st.speakPending > 0 || t < st.fakeSpeakUntil; }

  /* Jede Bedienung weckt ihn und holt die Bedienelemente zurück. */
  function active() {
    st.lastActive = now();
    if (st.asleep) { st.asleep = false; setEmotion('ruhig', 1); face.blink(now()); }
    document.body.classList.remove('quiet');
  }

  let lastFrame = 0;
  function tick() {
    requestAnimationFrame(tick);
    const t = now();
    if (t - lastFrame < 1 / 40) return;                 // ~30 Bilder/s wie die Firmware
    const dt = Math.min(0.2, t - lastFrame); lastFrame = t;

    const idle = t - st.lastActive;
    const busy = st.listening || st.thinking || speaking(t);
    if (busy) st.lastActive = t;
    if (!st.asleep && !busy && isNight() && idle > SLEEP_IDLE_SEC) st.asleep = true;   // Tag-Nacht: nachts schläft er ein
    if (!busy && t > st.emotionUntil && st.emotion !== 'ruhig') st.emotion = 'ruhig';

    let state = st.emotion, gaze = null, mouth = 'idle';
    if (st.asleep) state = 'schlafend';
    else if (st.listening) state = 'neugierig';
    else if (st.thinking) { state = 'ruhig'; gaze = [0.35, -0.65]; mouth = 'think'; }  // sichtbares Nachdenken
    else if (speaking(t)) mouth = 'speak';
    if (!gaze && st.pointer && t < st.pointerUntil && !st.asleep) gaze = st.pointer;

    // Sprachpegel für den Mund: der Browser liefert keinen, deshalb ein Silben-Rhythmus
    if (mouth === 'speak') {
      if (t >= st.levelNext) {
        st.levelTarget = Math.random() < 0.15 ? 0.05 : 0.3 + Math.random() * 0.7;
        st.levelNext = t + 0.09 + Math.random() * 0.09;
      }
    } else st.levelTarget = 0;
    st.level = E.ease(st.level, st.levelTarget, dt, st.levelTarget > st.level ? 0.03 : 0.12);

    face.frame(t, { state, gaze, mouth, level: st.level, brightness: isNight() ? 0.25 : 0.6,
      intensity: st.asleep ? 0.6 : 1 });

    const dialogOpen = $('settings').open, typing = document.activeElement === $('text');
    if (!dialogOpen && !typing && idle > QUIET_AFTER_SEC) document.body.classList.add('quiet');
    if (!busy && said.textContent && idle > EMOTION_HOLD_SEC) said.classList.add('faded');
  }

  /* Antippen: kurze freundliche Reaktion (Touch-Reflex der Firmware); der Blick folgt dem Finger. */
  function pointerGaze(ev) {
    const r = faceEl.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * 2 - 1, y = ((ev.clientY - r.top) / r.height) * 2 - 1;
    st.pointer = [Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y * 1.2 + 0.1))];
    st.pointerUntil = now() + 2.5;
  }
  stage.addEventListener('pointerdown', (ev) => {
    const wasAsleep = st.asleep, wasQuiet = document.body.classList.contains('quiet');
    active(); pointerGaze(ev); keepAwake();
    if (!wasAsleep && !wasQuiet && !st.listening && !st.thinking) { setEmotion('freudig', 1.6); face.blink(now()); }
  });
  stage.addEventListener('pointermove', (ev) => { if (ev.pointerType === 'mouse' || ev.buttons) pointerGaze(ev); });
  document.addEventListener('keydown', active);
  $('top').addEventListener('pointerdown', active);
  $('talk').addEventListener('pointerdown', active);

  /* Bildschirm anlassen, solange die Seite sichtbar ist (Dock-Betrieb). Geht nur über https oder localhost. */
  let wakeLock = null;
  async function keepAwake() {
    try {
      if (!wakeLock && navigator.wakeLock && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } catch (e) { wakeLock = null; }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') keepAwake(); });

  /* ---------------------------------------------------------------- Sprachausgabe */
  const synth = window.speechSynthesis || null;
  let voices = [], ttsUnlocked = false;

  function loadVoices() {
    voices = synth ? synth.getVoices().filter((v) => /^de([-_]|$)/i.test(v.lang)) : [];
    fillVoiceSelect();
  }
  function pickVoice() {
    if (!voices.length) return null;
    const chosen = voices.find((v) => v.voiceURI === cfg.ttsVoice);
    if (chosen) return chosen;
    const hint = cfg.voice === 'weiblich'
      ? /anna|petra|helena|katja|marlene|vicki|female|weiblich|frau/i
      : /markus|yannick|martin|viktor|hans|conrad|stefan|daniel|male|männlich|mann/i;
    const other = cfg.voice === 'weiblich' ? /\bmale\b|markus|yannick|martin|viktor|hans|conrad|stefan/i : /female|anna|petra|helena|katja|marlene|vicki/i;
    return voices.find((v) => hint.test(v.name) && !(cfg.voice === 'männlich' && /female/i.test(v.name)))
      || voices.find((v) => !other.test(v.name)) || voices[0];
  }
  /* Browser erlauben Sprachausgabe erst nach einer Bedienung: beim ersten Absenden einmal stumm anstoßen. */
  function unlockTts() {
    if (ttsUnlocked || !synth || !cfg.tts) return;
    ttsUnlocked = true;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) { /* egal */ }
  }
  function sayPiece(text) {
    said.classList.remove('faded');
    said.textContent += (said.textContent ? ' ' : '') + text;
    if (cfg.tts && synth) {
      const style = P.voiceStyle(st.emotion), u = new SpeechSynthesisUtterance(text), v = pickVoice();
      u.lang = v ? v.lang : 'de-DE';
      if (v) u.voice = v;
      u.rate = style.tempo;
      u.pitch = Math.max(0.5, Math.min(1.5, 1 + (style.pitch - 1) * 3));   // Browser-Tonhöhe ist grober gestuft
      u.volume = style.volume;
      st.speakPending++;
      const done = () => { st.speakPending = Math.max(0, st.speakPending - 1); };
      u.onend = done; u.onerror = done;
      synth.speak(u);
    } else {
      st.fakeSpeakUntil = Math.max(now(), st.fakeSpeakUntil) + Math.max(0.8, text.length * 0.06);
    }
  }
  function stopSpeaking() {
    if (synth) synth.cancel();
    st.speakPending = 0; st.fakeSpeakUntil = 0;
  }

  /* ---------------------------------------------------------------- Sprachmodell (Ollama) */
  const llm = { base: null, model: null, models: [] };
  const localHost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  async function fetchTimeout(url, ms) {
    const ac = new AbortController(), timer = setTimeout(() => ac.abort(), ms);
    try { return await fetch(url, { signal: ac.signal }); } finally { clearTimeout(timer); }
  }
  async function probe(base) {
    try {
      const r = await fetchTimeout(base + '/api/tags', 3000);
      if (!r.ok) return null;
      const j = await r.json();
      return Array.isArray(j.models) ? j.models.map((m) => String(m.name)) : null;
    } catch (e) { return null; }
  }
  async function connect() {
    showLlm('Suche das Sprachmodell …', '');
    const candidates = [];
    if (cfg.llmUrl) candidates.push(cfg.llmUrl.replace(/\/+$/, ''));
    else {
      if (location.protocol.indexOf('http') === 0) candidates.push(location.origin + '/ollama');   // lokal.py
      if (localHost) candidates.push('http://localhost:11434');
    }
    llm.base = null; llm.model = null; llm.models = [];
    for (const base of candidates) {
      const models = await probe(base);
      if (models) {
        llm.base = base; llm.models = models;
        llm.model = models.indexOf(cfg.llmModel) >= 0 ? cfg.llmModel : (models[0] || null);
        break;
      }
    }
    if (llm.base && llm.model) {
      showLlm('Verbunden: ' + llm.model, 'ok');
      $('status').textContent = '';
    } else if (llm.base) {
      showLlm('Server gefunden, aber kein Modell installiert.', 'off');
      $('status').textContent = 'Kein Modell';
    } else {
      showLlm('Kein Sprachmodell verbunden. Augen und Persönlichkeit funktionieren, Gespräche noch nicht.', 'off');
      $('status').textContent = 'Kein Sprachmodell';
    }
  }
  function showLlm(text, cls) { const el = $('llm-state'); el.textContent = text; el.className = 'state ' + cls; }

  const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  function context() {
    const d = new Date(), m = String(d.getMinutes()).padStart(2, '0');
    return '[Uhrzeit: ' + d.getHours() + ':' + m + ' Uhr, ' + DAYS[d.getDay()] +
      ' | Deine eigene Stimmung (' + cfg.name + '): ' + (P.STATE_WORDS[st.emotion] || 'ruhig') + ']\n';
  }
  /* Für die Sprachausgabe: Markdown und Emojis raus (speech/llm.py). */
  function cleanText(s) {
    return s.replace(/[*_#`>|~]/g, '').replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, '').trim();
  }

  const HISTORY_TURNS = 10;
  let history = [], current = null;

  function interrupt() {
    if (current) { current.abort(); current = null; }
    stopSpeaking();
    st.thinking = false;
  }

  async function ask(userText) {
    interrupt();
    said.textContent = ''; said.classList.remove('faded');
    if (!llm.base || !llm.model) {
      setEmotion('neugierig');
      sayPiece('Ich bin da, aber mein Sprachmodell ist gerade nicht verbunden. Deshalb kann ich dir noch nicht richtig antworten.');
      return;
    }
    setEmotion(P.appraise(userText, ''));
    st.thinking = true;
    const ac = new AbortController(); current = ac;
    const messages = [{ role: 'system', content: P.fill(cfg.charakter, cfg.name, cfg.voice).trim() + '\n\n' + P.APP_REGELN }];
    for (const pair of P.FEW_SHOT) {
      messages.push({ role: 'user', content: P.fill(pair[0], cfg.name, cfg.voice) }, { role: 'assistant', content: pair[1] });
    }
    for (const m of history.slice(-2 * HISTORY_TURNS)) messages.push(m);
    messages.push({ role: 'user', content: context() + userText });

    let full = '', pending = '', spoke = false;
    const emit = (sentence) => {
      const s = cleanText(sentence);
      if (!s) return;
      if (!spoke) { spoke = true; st.thinking = false; setEmotion(P.appraise(userText, s)); }
      sayPiece(s);
    };
    try {
      const resp = await fetch(llm.base + '/api/chat', {
        method: 'POST', signal: ac.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: llm.model, stream: true, messages, think: false, keep_alive: '30m',
          options: { temperature: 0.7, num_predict: 100, num_ctx: 8192 }
        })
      });
      if (!resp.ok || !resp.body) throw new Error('HTTP ' + resp.status);
      const reader = resp.body.getReader(), dec = new TextDecoder();
      let buf = '', done = false;
      while (!done) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buf += dec.decode(chunk.value, { stream: true });
        let nl;
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
          if (!line) continue;
          const part = JSON.parse(line);
          const piece = (part.message && part.message.content) || '';
          full += piece; pending += piece;
          let m;
          while ((m = /([.!?…]+)(\s+|$)/.exec(pending))) {      // fertige Sätze sofort sprechen
            emit(pending.slice(0, m.index + m[0].length));
            pending = pending.slice(m.index + m[0].length);
          }
          if (part.done) {
            if (part.done_reason === 'length') { full = full.slice(0, full.length - pending.length); pending = ''; }
            done = true;
          }
        }
      }
      emit(pending);
      if (full.trim()) history.push({ role: 'user', content: userText }, { role: 'assistant', content: full.trim() });
      if (history.length > 4 * HISTORY_TURNS) history = history.slice(-2 * HISTORY_TURNS);
      if (!spoke) { setEmotion('besorgt'); sayPiece('Dazu ist mir gerade nichts eingefallen. Magst du es noch einmal sagen?'); }
    } catch (ex) {
      if (ex && ex.name === 'AbortError') return;          // unterbrochen: sofort aufhören, nichts nachschieben
      setEmotion('besorgt');
      sayPiece('Ich erreiche mein Sprachmodell gerade nicht.');
      connect();
    } finally {
      if (current === ac) { current = null; st.thinking = false; }
    }
  }

  /* ---------------------------------------------------------------- Eingabe */
  const text = $('text'), mic = $('mic');
  $('talk').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const t = text.value.trim();
    if (!t) return;
    text.value = '';
    active(); unlockTts(); keepAwake();
    ask(t);
  });

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  function updateMic() { mic.hidden = !(SR && cfg.stt); }
  mic.addEventListener('click', () => {
    active(); unlockTts(); keepAwake();
    if (rec) { rec.stop(); return; }
    interrupt();
    let heard = '';
    rec = new SR();
    rec.lang = 'de-DE'; rec.interimResults = true; rec.continuous = false;
    rec.onresult = (ev) => {
      heard = Array.from(ev.results).map((r) => r[0].transcript).join(' ').trim();
      text.value = heard;
    };
    rec.onerror = () => { heard = heard || ''; };
    rec.onend = () => {
      rec = null; st.listening = false; mic.setAttribute('aria-pressed', 'false');
      if (heard) { text.value = ''; ask(heard); }
    };
    try { rec.start(); st.listening = true; mic.setAttribute('aria-pressed', 'true'); }
    catch (e) { rec = null; st.listening = false; }
  });

  /* ---------------------------------------------------------------- Einstellungen (Dialog) */
  const dlg = $('settings');
  function fillVoiceSelect() {
    const sel = $('s-voice');
    sel.textContent = '';
    sel.add(new Option(voices.length ? 'Automatisch (passend zur Stimme)' : 'Keine deutsche Stimme gefunden', ''));
    for (const v of voices) sel.add(new Option(v.name + ' (' + v.lang + ')', v.voiceURI));
    sel.value = voices.some((v) => v.voiceURI === cfg.ttsVoice) ? cfg.ttsVoice : '';
  }
  function fillColors() {
    const box = $('p-colors');
    box.textContent = '';
    for (const key of Object.keys(E.EYE_COLORS)) {
      const c = E.EYE_COLORS[key], b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch'; b.title = c.label; b.setAttribute('aria-label', c.label);
      b.style.setProperty('--c', 'rgb(' + c.edge.join(',') + ')');
      b.setAttribute('aria-pressed', String(key === cfg.eye_color));
      b.addEventListener('click', () => { cfg.eye_color = key; face.setColor(key); save(); fillColors(); });
      box.appendChild(b);
    }
  }
  function showSettings() {
    $('p-name').value = cfg.name;
    for (const r of document.querySelectorAll('input[name="p-voice"]')) r.checked = r.value === cfg.voice;
    $('p-charakter').value = cfg.charakter;
    $('s-tts').checked = cfg.tts;
    $('s-stt').checked = cfg.stt;
    $('s-stt').disabled = !SR;
    if (!SR) $('s-stt-note').textContent = 'Dieser Browser bietet keine Spracheingabe an.';
    $('s-url').value = cfg.llmUrl;
    $('s-model').value = cfg.llmModel;
    fillColors(); fillVoiceSelect();
  }
  $('open-settings').addEventListener('click', () => {
    showSettings();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });
  dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); });   // Tipp neben das Blatt schließt
  dlg.addEventListener('close', active);

  $('p-name').addEventListener('input', (ev) => { cfg.name = ev.target.value.trim().slice(0, 30) || DEFAULTS.name; save(); });
  for (const r of document.querySelectorAll('input[name="p-voice"]')) {
    r.addEventListener('change', () => { if (r.checked) { cfg.voice = r.value; save(); } });
  }
  $('p-charakter').addEventListener('input', (ev) => { cfg.charakter = ev.target.value.slice(0, 20000) || P.CHARAKTER; save(); });
  $('p-reset').addEventListener('click', () => {
    if (!confirm('Charakterbogen auf die Vorlage zurücksetzen? Deine Änderungen am Text gehen verloren.')) return;
    cfg.charakter = P.CHARAKTER; save(); $('p-charakter').value = cfg.charakter;
  });
  $('s-tts').addEventListener('change', (ev) => { cfg.tts = ev.target.checked; if (!cfg.tts) stopSpeaking(); save(); });
  $('s-voice').addEventListener('change', (ev) => { cfg.ttsVoice = ev.target.value; save(); });
  $('s-stt').addEventListener('change', (ev) => { cfg.stt = ev.target.checked; save(); updateMic(); });
  $('s-url').addEventListener('change', (ev) => { cfg.llmUrl = ev.target.value.trim(); save(); connect(); });
  $('s-model').addEventListener('change', (ev) => { cfg.llmModel = ev.target.value.trim() || DEFAULTS.llmModel; save(); connect(); });
  $('s-connect').addEventListener('click', connect);

  /* Persönlichkeit als Datei: dieselben Felder wie identity.py (name, voice, eye_color) plus Charakterbogen. */
  $('p-export').addEventListener('click', () => {
    const doc = {
      format: 'onehumanity-persona', version: 1, exported: new Date().toISOString(),
      identity: { name: cfg.name, voice: cfg.voice, eye_color: cfg.eye_color },
      charakter: cfg.charakter
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = (cfg.name.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-') || 'persona') + '-persona.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('p-import').addEventListener('click', () => $('p-file').click());
  $('p-file').addEventListener('change', async (ev) => {
    const file = ev.target.files[0];
    ev.target.value = '';
    if (!file) return;
    try {
      if (file.size > 200000) throw new Error('zu groß');
      const doc = JSON.parse(await file.text());
      if (!doc || doc.format !== 'onehumanity-persona' || !doc.identity) throw new Error('Format');
      const merged = clean(Object.assign({}, cfg, doc.identity, { charakter: doc.charakter }));
      if (!confirm('Persönlichkeit „' + merged.name + '“ laden? Die aktuelle wird ersetzt.')) return;
      cfg = merged; save(); face.setColor(cfg.eye_color); history = []; showSettings();
    } catch (e) {
      alert('Diese Datei ist keine Persönlichkeits-Datei aus der App.');
    }
  });

  /* ---------------------------------------------------------------- Start */
  if (synth) {
    loadVoices();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', loadVoices);
  }
  updateMic();
  connect();
  requestAnimationFrame(tick);
})();
