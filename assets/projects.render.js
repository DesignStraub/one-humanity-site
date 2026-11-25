/* ==========================================================================
   projects.render.js — builds the project markup from window.OH_PROJECTS.
   You should not need to edit this file to add a project. Edit
   assets/projects.data.js instead.
   ==========================================================================

   Containers in the HTML:
     <ol data-projects="rail">               home page: grid (two rows + "show all") of every
                                             project (not the archive), with filter
                                             chips [data-rail-filter] and the button
                                             [data-rail-more] inside the same
                                             [data-rail] section
     <ol data-projects="index:archive">      compact list rows of one group
     <ol data-projects="area:games">        large cards of one group (add data-timeline for stages)
     <div data-projects="cards:design">     small cards of one group
     <ol data-projects="roadmap">           all featured projects (legacy)
     <div data-projects="workshop|archive|more">  small cards (legacy)

   Loads before site.js and renders immediately, so the reveal observer and
   the language switch in site.js pick the markup up like any other.
*/
(function () {
  'use strict';

  var projects = window.OH_PROJECTS || [];
  var containers = document.querySelectorAll('[data-projects]');
  /* Status labels live here — one place for all projects. */
  var STATUS = {
    live:    { cls: 'is-live', de: 'Täglich im Einsatz', en: 'In daily use' },
    wip:     { cls: 'is-wip',  de: 'In Entwicklung',     en: 'In development' },
    concept: { cls: 'is-idea', de: 'Designstudie',       en: 'Design study' },
    playable:{ cls: 'is-live', de: 'Spielbar',           en: 'Playable' },
    new:     { cls: 'is-new',  de: 'Neu',                en: 'New' },
    free:    { cls: 'is-open', de: 'Frei verfügbar',     en: 'Freely available' },
    testing: { cls: 'is-wip',  de: 'Im Test',            en: 'In testing' },
    design:  { cls: 'is-idea', de: 'In Gestaltung',      en: 'In design' },
    sketch:  { cls: 'is-idea', de: 'Skizze',             en: 'Sketch' },
    open:    { cls: 'is-open', de: 'Offen',              en: 'Open' }
  };

  var LABELS = {
    build: { de: 'Selbst bauen',   en: 'Build it yourself' },
    buy:   { de: 'Fertig kaufen',  en: 'Buy it ready-made' },
    more:  { de: 'Mehr erfahren',  en: 'Learn more' },
    soon:  { de: 'bald',           en: 'soon' },
    soonTitle: { de: 'Link folgt in Kürze', en: 'Link coming soon' },
    open:  { de: 'Öffnen', en: 'Open' },
    play:  { de: 'Video abspielen', en: 'Play video' },
    past:  { de: 'Frühere Stände', en: 'Earlier stages' },
    pictures: { de: 'Bilder', en: 'pictures' }
  };

  /* Area names for the rail and the archive list. */
  var GROUPS = {
    robotics: { de: 'Robotics',  en: 'Robotics' },
    games:    { de: 'Games',     en: 'Games' },
    tools:    { de: 'Tools',     en: 'Tools' },
    design:   { de: '3D-Design', en: '3D design' },
    archive:  { de: 'Archiv',    en: 'Archive' }
  };
  var RAIL_GROUPS = ['robotics', 'games', 'tools', 'design'];

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function pick(value, lang) {
    if (value && typeof value === 'object') return value[lang] || value.en || value.de || '';
    return value || '';
  }

  function statusHTML(project, lang) {
    var s = STATUS[project.status];
    if (!s) return '';
    return '<span class="pill status ' + s.cls + '">' + esc(s[lang] || s.en) + '</span>';
  }

  function imageHTML(project, lang, style) {
    var img = project.image;
    if (!img || !img.src) return '';
    return '<figure class="media"' + (style ? ' style="' + style + '"' : '') + '>' +
      '<img src="' + esc(img.src) + '"' +
      (img.w ? ' width="' + esc(img.w) + '"' : '') +
      (img.h ? ' height="' + esc(img.h) + '"' : '') +
      ' loading="lazy" alt="' + esc(pick(img.alt, lang)) + '">' +
      '</figure>';
  }

  /* Current state of a build: a few photos and short clips. Clips play
     muted on hover, or on a tap of the play button. */
  function nowHTML(project, lang) {
    var now = project.now;
    if (!now || !(now.items || []).length) return '';
    return '<div class="now">' +
      '<h4 class="now-title">' + esc(pick(now.title, lang)) + '</h4>' +
      '<div class="now-grid">' + now.items.map(function (item) {
        var caption = pick(item.caption, lang);
        var alt = esc(pick(item.alt, lang));
        var size = (item.w ? ' width="' + esc(item.w) + '"' : '') + (item.h ? ' height="' + esc(item.h) + '"' : '');
        var media = item.video
          ? '<video src="' + esc(item.video) + '" poster="' + esc(item.poster) + '"' + size +
              ' muted loop playsinline preload="none" aria-label="' + alt + '"></video>' +
            '<button class="now-play" type="button" aria-label="' + esc(pick(LABELS.play, lang)) + '">' +
              '<svg class="icon-play" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>' +
              '<svg class="icon-pause" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>' +
            '</button>'
          : '<a href="' + esc(item.src) + '" target="_blank" rel="noopener">' +
              '<img src="' + esc(item.src) + '"' + size + ' loading="lazy" alt="' + alt + '"></a>';
        return '<figure class="now-item' + (item.video ? ' is-video' : '') + '">' +
          '<div class="now-frame">' + media + '</div>' +
          (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') +
          '</figure>';
      }).join('') + '</div>' +
    '</div>';
  }

  /* Extra pictures under a roadmap card. With a current state above them
     they are the older stages and fold away. */
  function galleryHTML(project, lang) {
    var items = project.gallery || [];
    if (!items.length) return '';
    if (project.now) {
      return '<details class="gallery-past"><summary>' +
        esc(pick(LABELS.past, lang)) + ' · ' + items.length + ' ' + esc(pick(LABELS.pictures, lang)) +
        '</summary>' + galleryHTML({ gallery: items }, lang) + '</details>';
    }
    return '<div class="gallery">' + items.map(function (img) {
      var caption = pick(img.caption, lang);
      var wide = img.w && img.h && img.w / img.h >= 2;
      return '<figure class="media' + (wide ? ' is-wide' : '') + '">' +
        '<img src="' + esc(img.src) + '"' +
        (img.w ? ' width="' + esc(img.w) + '"' : '') +
        (img.h ? ' height="' + esc(img.h) + '"' : '') +
        ' loading="lazy" alt="' + esc(pick(img.alt, lang)) + '">' +
        (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') +
        '</figure>';
    }).join('') + '</div>';
  }

  function timelineHTML(project, lang) {
    var steps = (project[lang] && project[lang].timeline) || [];
    if (!steps.length) return '';
    var items = steps.map(function (step) {
      var state = step.state === 'done' || step.state === 'now' || step.state === 'next' ? step.state : '';
      return '<li class="' + state + '">' + esc(step.text) + '</li>';
    }).join('');
    return '<ol class="timeline">' + items + '</ol>';
  }

  /* One button. Links starting with "#TODO" render greyed out with "soon". */
  function buttonHTML(link, fallbackLabel, primary, lang) {
    if (!link || !link.href) return '';
    var label = esc(pick(link.label || fallbackLabel, lang));
    var cls = 'btn' + (primary ? ' primary' : '');
    if (link.href.indexOf('#TODO') === 0) {
      return '<span class="' + cls + ' is-todo" aria-disabled="true" title="' +
        esc(pick(LABELS.soonTitle, lang)) + '">' + label + ' · ' + esc(pick(LABELS.soon, lang)) + '</span>';
    }
    var external = /^https?:/i.test(link.href);
    var download = /\.pdf$/i.test(link.href);
    return '<a class="' + cls + '" href="' + esc(link.href) + '"' +
      (external ? ' target="_blank" rel="noopener"' : '') +
      (download ? ' download' : '') + '>' + label + '</a>';
  }

  function legacyActionsHTML(project, lang) {
    var actions = project.actions || [];
    if (!actions.length) return '';
    return '<div class="actions">' + actions.map(function (action) {
      return buttonHTML(action, action.label, action.primary, lang);
    }).join('') + '</div>';
  }

  /* Roadmap entry: status, title, tagline, text, facts, build / buy. */
  function roadmapItem(project, lang, withTimeline) {
    var copy = project[lang] || project.en || {};
    var s = STATUS[project.status] || {};
    var facts = (copy.facts || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
    var media = imageHTML(project, lang);

    var actions =
      buttonHTML(project.demo, project.demo && project.demo.label, true, lang) +
      buttonHTML(project.build, LABELS.build, !project.demo, lang) +
      buttonHTML(project.buy, LABELS.buy, false, lang) +
      buttonHTML(project.follow, project.follow && project.follow.label, false, lang) +
      (project.link
        ? '<a class="more" href="' + esc(project.link) + '">' + esc(pick(LABELS.more, lang)) + ' →</a>'
        : '');

    return '<li class="roadmap-item reveal in ' + (s.cls || '') + '" id="project-' + esc(project.id) + '">' +
      '<article class="roadmap-card' + (media ? '' : ' no-media') + '">' +
        '<div>' +
          statusHTML(project, lang) +
          '<h3 class="h3">' + esc(copy.title) + '</h3>' +
          (copy.tagline ? '<p class="tagline">' + esc(copy.tagline) + '</p>' : '') +
          '<p>' + esc(copy.text) + '</p>' +
          (facts ? '<ul class="facts">' + facts + '</ul>' : '') +
          (withTimeline ? timelineHTML(project, lang) : '') +
          (actions ? '<div class="actions">' + actions + '</div>' : '') +
        '</div>' +
        media +
        nowHTML(project, lang) +
        galleryHTML(project, lang) +
      '</article>' +
    '</li>';
  }

  /* Card for the smaller projects (workshop, archive). */
  function moreCard(project, lang) {
    var copy = project[lang] || project.en || {};
    var actions = project.actions
      ? legacyActionsHTML(project, lang)
      : '<div class="actions">' +
          buttonHTML(project.build, LABELS.build, true, lang) +
          buttonHTML(project.buy, LABELS.buy, false, lang) +
        '</div>';
    return '<article class="card reveal in" id="project-' + esc(project.id) + '">' +
      imageHTML(project, lang, 'margin-bottom:var(--sp-4)') +
      statusHTML(project, lang) +
      '<h3 class="h3">' + esc(copy.title) + '</h3>' +
      '<p>' + esc(copy.text) + '</p>' +
      (project.group === 'archive' ? timelineHTML(project, lang) : '') +
      actions +
      '</article>';
  }

  /* Rail card: picture, area · status, title, one line. Links to the full
     card with all stages on tools.html. */
  function railCard(project, lang) {
    var copy = project[lang] || project.en || {};
    var s = STATUS[project.status] || {};
    var img = project.image;
    var line = copy.tagline || copy.text || '';
    var media = img && img.src
      ? '<img src="' + esc(img.src) + '"' +
          (img.w ? ' width="' + esc(img.w) + '"' : '') +
          (img.h ? ' height="' + esc(img.h) + '"' : '') +
          ' loading="lazy" alt="' + esc(pick(img.alt, lang)) + '">'
      : '';
    return '<li class="rail-item" data-group="' + esc(project.group) + '">' +
      '<a class="rail-card" href="tools.html#project-' + esc(project.id) + '">' +
        '<span class="rail-media">' + media + '</span>' +
        '<span class="rail-body">' +
          '<span class="rail-meta">' +
            '<span>' + esc(pick(GROUPS[project.group], lang)) + '</span>' +
            (s[lang] ? '<span class="rail-status ' + (s.cls || '') + '">' + esc(s[lang]) + '</span>' : '') +
          '</span>' +
          '<span class="rail-title">' + esc(copy.title) + '</span>' +
          '<span class="rail-line">' + esc(line) + '</span>' +
        '</span>' +
      '</a>' +
    '</li>';
  }

  /* Order for the rail: new big projects first, then the other big
     projects (in data order), then the 3D designs. */
  function railProjects() {
    var inRail = projects.filter(function (p) { return RAIL_GROUPS.indexOf(p.group) !== -1; });
    var big = inRail.filter(function (p) { return p.featured; });
    return big.filter(function (p) { return p.status === 'new'; })
      .concat(big.filter(function (p) { return p.status !== 'new'; }))
      .concat(inRail.filter(function (p) { return !p.featured; }));
  }

  /* Compact archive row: title, area, status, one line, link. */
  function indexRow(project, lang) {
    var copy = project[lang] || project.en || {};
    var href = project.link || (project.actions && project.actions[0] && project.actions[0].href) || '';
    var title = href
      ? '<a href="' + esc(href) + '">' + esc(copy.title) + ' →</a>'
      : esc(copy.title);
    return '<li class="index-row" id="project-' + esc(project.id) + '">' +
      '<span class="index-title">' + title + '</span>' +
      '<span class="index-text">' + esc(copy.tagline || copy.text) + '</span>' +
      statusHTML(project, lang) +
    '</li>';
  }

  function render(lang) {
    if (lang !== 'de' && lang !== 'en') lang = 'en';
    containers.forEach(function (container) {
      var mode = container.getAttribute('data-projects');
      if (mode === 'rail') {
        container.innerHTML = railProjects().map(function (p) { return railCard(p, lang); }).join('');
        return;
      }
      if (mode.indexOf('index:') === 0) {
        var group = mode.slice(6);
        container.innerHTML = projects
          .filter(function (p) { return p.group === group; })
          .map(function (p) { return indexRow(p, lang); }).join('');
        return;
      }
      /* "area:games" → large cards of one group, "cards:design" → small cards of one group */
      var parts = mode.split(':');
      if (parts.length === 2) {
        var inGroup = projects.filter(function (p) { return p.group === parts[1]; });
        container.innerHTML = inGroup.map(function (p) {
          return parts[0] === 'cards' ? moreCard(p, lang) : roadmapItem(p, lang, container.hasAttribute('data-timeline'));
        }).join('');
        return;
      }
      /* workshop / archive: small cards for one group; "more" = everything not featured */
      if (mode === 'workshop' || mode === 'archive' || mode === 'more') {
        container.innerHTML = projects
          .filter(function (p) { return mode === 'more' ? !p.featured : p.group === mode; })
          .map(function (p) { return moreCard(p, lang); }).join('');
        return;
      }
      var withTimeline = container.hasAttribute('data-timeline');
      container.innerHTML = projects
        .filter(function (p) { return p.featured; })
        .map(function (p) { return roadmapItem(p, lang, withTimeline); }).join('');
    });
  }

  /* Initial paint uses the same preference logic as site.js, then site.js
     fires oh:langchange on load and we re-render with the final choice. */
  /* The 3D gallery on the start page builds its info panels from the same
     pieces, so labels and buttons look the same everywhere. */
  window.OH_RENDER = {
    STATUS: STATUS, LABELS: LABELS, GROUPS: GROUPS,
    esc: esc, pick: pick, statusHTML: statusHTML, buttonHTML: buttonHTML
  };

  if (!containers.length || !projects.length) return;

  var stored = null;
  try { stored = localStorage.getItem('onehumanity-lang'); } catch (e) { /* private mode */ }
  var browserLang = (navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  render(stored || browserLang);

  /* Cards are built by script, so the browser may not find
     tools.html#project-… on its own – scroll there once everything is in. */
  if (location.hash.indexOf('#project-') === 0) {
    window.addEventListener('load', function () {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'instant' });
    });
  }

  document.addEventListener('oh:langchange', function (event) {
    render(event.detail && event.detail.lang);
    applyFilter();
  });

  /* --- clips in the current state: hover previews, the button toggles --- */
  function setPlaying(figure, play) {
    var video = figure.querySelector('video');
    if (!video) return;
    if (play) {
      var started = video.play();
      if (started && started.catch) started.catch(function () { /* autoplay refused */ });
    } else {
      video.pause();
    }
    figure.classList.toggle('is-playing', play);
  }
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (canHover) {
    document.addEventListener('mouseover', function (event) {
      var figure = event.target.closest && event.target.closest('.now-item.is-video');
      if (figure && !figure.contains(event.relatedTarget)) setPlaying(figure, true);
    });
    document.addEventListener('mouseout', function (event) {
      var figure = event.target.closest && event.target.closest('.now-item.is-video');
      if (figure && !figure.contains(event.relatedTarget) && !figure.hasAttribute('data-pinned')) setPlaying(figure, false);
    });
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('.now-play');
    if (!button) return;
    var figure = button.closest('.now-item');
    var play = !figure.hasAttribute('data-pinned');
    figure.toggleAttribute('data-pinned', play);
    button.setAttribute('aria-pressed', String(play));
    setPlaying(figure, play);
  });

  /* --- project grid: filter chips, "show all", #robotics-style links --- */
  var rail = document.querySelector('[data-rail]');
  var filter = 'all';
  var open = false;

  function moreLabel(key, n) {
    var lang = document.documentElement.lang === 'de' ? 'de' : 'en';
    var dict = (window.OH_I18N && window.OH_I18N[lang]) || {};
    var fallback = { railMore: 'Show all {n} projects', railLess: 'Show fewer' };
    return (dict[key] || fallback[key]).replace('{n}', n);
  }

  /* two rows: as many cards as the grid has columns, times two */
  function rowLimit(grid) {
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
    return Math.max(1, cols) * 2;
  }

  function applyFilter() {
    if (!rail) return;
    var grid = rail.querySelector('[data-projects="rail"]');
    var more = rail.querySelector('[data-rail-more]');
    rail.querySelectorAll('[data-rail-filter]').forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-rail-filter') === filter ? 'true' : 'false');
    });
    var limit = rowLimit(grid);
    var shown = 0;
    grid.querySelectorAll('.rail-item').forEach(function (item) {
      var match = filter === 'all' || item.getAttribute('data-group') === filter;
      item.hidden = !match;
      if (match) shown += 1;
      if (match && shown > limit) item.setAttribute('data-over', '');
      else item.removeAttribute('data-over');
    });
    grid.classList.toggle('is-open', open);
    if (more) {
      more.hidden = shown <= limit;
      more.textContent = open ? moreLabel('railLess', shown) : moreLabel('railMore', shown);
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  }

  function filterFromHash() {
    var id = location.hash.slice(1);
    if (RAIL_GROUPS.indexOf(id) !== -1) { filter = id; open = false; applyFilter(); }
  }

  if (rail) {
    rail.querySelectorAll('[data-rail-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        filter = chip.getAttribute('data-rail-filter');
        open = false;
        applyFilter();
      });
    });
    var moreBtn = rail.querySelector('[data-rail-more]');
    if (moreBtn) moreBtn.addEventListener('click', function () {
      open = !open;
      applyFilter();
      /* when closing, keep the grid in view instead of leaving the reader far below */
      if (!open) {
        var top = rail.querySelector('[data-projects="rail"]').getBoundingClientRect().top;
        if (top < 0) rail.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
    var resizeQueued = false;
    window.addEventListener('resize', function () {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(function () { resizeQueued = false; applyFilter(); });
    });
    window.addEventListener('hashchange', filterFromHash);
    filterFromHash();
    applyFilter();
  }
})();
