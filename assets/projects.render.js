/* ==========================================================================
   projects.render.js — builds the project cards from window.OH_PROJECTS.
   You should not need to edit this file to add a project. Edit
   assets/projects.data.js instead.
   ==========================================================================

   Containers in the HTML:
     <div data-projects="featured"> … </div>   home page, featured only, no timeline
     <div data-projects="all">      … </div>   projects page, everything, with timeline

   Loads before site.js and renders immediately, so the reveal observer and
   the language switch in site.js pick the cards up like any other markup.
*/
(function () {
  'use strict';

  var projects = window.OH_PROJECTS || [];
  var containers = document.querySelectorAll('[data-projects]');
  if (!containers.length || !projects.length) return;

  /* Status labels live here — one place for all projects. */
  var STATUS = {
    live:    { cls: 'is-live',  de: 'Im Einsatz',    en: 'In use' },
    testing: { cls: 'is-wip',   de: 'Im Test',       en: 'In testing' },
    design:  { cls: 'is-idea',  de: 'In Gestaltung', en: 'In design' },
    sketch:  { cls: 'is-idea',  de: 'Skizze',        en: 'Sketch' },
    open:    { cls: 'is-open',  de: 'Offen',         en: 'Open' }
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

  function imageHTML(project, lang) {
    var img = project.image;
    if (!img || !img.src) return '';
    return '<figure class="media" style="margin-bottom:var(--sp-4)">' +
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

  function actionsHTML(project, lang) {
    var actions = project.actions || [];
    if (!actions.length) return '';
    var buttons = actions.map(function (action) {
      var external = /^https?:/i.test(action.href);
      return '<a class="btn' + (action.primary ? ' primary' : '') + '" href="' + esc(action.href) + '"' +
        (external ? ' target="_blank" rel="noopener"' : '') + '>' +
        esc(pick(action.label, lang)) + '</a>';
    }).join('');
    return '<div class="actions">' + buttons + '</div>';
  }

  /* Home page: compact card, no timeline, whole card is the link. */
  function featuredCard(project, lang) {
    var copy = project[lang] || project.en || {};
    var inner =
      statusHTML(project, lang) +
      '<h3 class="h3">' + esc(copy.title) + '</h3>' +
      '<p>' + esc(copy.text) + '</p>';

    if (project.link) {
      return '<a class="card reveal in" id="project-' + esc(project.id) + '" href="' + esc(project.link) + '">' +
        inner + '</a>';
    }
    return '<article class="card reveal in" id="project-' + esc(project.id) + '">' + inner + '</article>';
  }

  /* Projects page: picture, status, text, timeline, buttons. */
  function fullCard(project, lang) {
    var copy = project[lang] || project.en || {};
    return '<article class="card hoverable reveal in" id="project-' + esc(project.id) + '">' +
      imageHTML(project, lang) +
      statusHTML(project, lang) +
      '<h2 class="h3">' + esc(copy.title) + '</h2>' +
      '<p>' + esc(copy.text) + '</p>' +
      timelineHTML(project, lang) +
      actionsHTML(project, lang) +
      '</article>';
  }

  function render(lang) {
    if (lang !== 'de' && lang !== 'en') lang = 'en';
    containers.forEach(function (container) {
      var mode = container.getAttribute('data-projects');
      var list = mode === 'featured'
        ? projects.filter(function (p) { return p.featured; })
        : projects;
      container.innerHTML = list.map(function (p) {
        return mode === 'featured' ? featuredCard(p, lang) : fullCard(p, lang);
      }).join('');
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
