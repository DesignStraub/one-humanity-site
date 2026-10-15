/* ==========================================================================
   projects.render.js — builds the project markup from window.OH_PROJECTS.
   You should not need to edit this file to add a project. Edit
   assets/projects.data.js instead.
   ==========================================================================

   Containers in the HTML:
     <ol data-projects="roadmap">           featured projects as a roadmap
     <ol data-projects="roadmap" data-timeline>   same, with the stage list
     <div data-projects="more">             non-featured projects as cards

   Loads before site.js and renders immediately, so the reveal observer and
   the language switch in site.js pick the markup up like any other.
*/
(function () {
  'use strict';

  var projects = window.OH_PROJECTS || [];
  var containers = document.querySelectorAll('[data-projects]');
  if (!containers.length || !projects.length) return;

  /* Status labels live here — one place for all projects. */
  var STATUS = {
    live:    { cls: 'is-live', de: 'Täglich im Einsatz', en: 'In daily use' },
    wip:     { cls: 'is-wip',  de: 'In Entwicklung',     en: 'In development' },
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
    soonTitle: { de: 'Link folgt in Kürze', en: 'Link coming soon' }
  };

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
      buttonHTML(project.build, LABELS.build, true, lang) +
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
      '</article>' +
    '</li>';
  }

  /* Card for the smaller, non-featured projects on tools.html. */
  function moreCard(project, lang) {
    var copy = project[lang] || project.en || {};
    return '<article class="card reveal in" id="project-' + esc(project.id) + '">' +
      imageHTML(project, lang, 'margin-bottom:var(--sp-4)') +
      statusHTML(project, lang) +
      '<h3 class="h3">' + esc(copy.title) + '</h3>' +
      '<p>' + esc(copy.text) + '</p>' +
      timelineHTML(project, lang) +
      legacyActionsHTML(project, lang) +
      '</article>';
  }

  function render(lang) {
    if (lang !== 'de' && lang !== 'en') lang = 'en';
    containers.forEach(function (container) {
      var mode = container.getAttribute('data-projects');
      if (mode === 'more') {
        container.innerHTML = projects
          .filter(function (p) { return !p.featured; })
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
  var stored = null;
  try { stored = localStorage.getItem('onehumanity-lang'); } catch (e) { /* private mode */ }
  var browserLang = (navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  render(stored || browserLang);

  document.addEventListener('oh:langchange', function (event) {
    render(event.detail && event.detail.lang);
  });
})();
