/* ==========================================================================
   OneHumanity — shared behaviour
   Nav, scroll reveal, language toggle, sticker tilt.
   Every page loads this one file. Pages may define window.OH_I18N with
   extra keys before this script runs.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- current year ---------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- nav: shadow on scroll + mobile toggle --------------------------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var toggle = nav.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }

    /* mark the current page in the nav */
    var here = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      var target = link.getAttribute('href');
      if (target && target === here) link.setAttribute('aria-current', 'page');
    });
  }

  /* --- reveal on scroll ------------------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* --- language --------------------------------------------------------
     Supports both patterns used on the site:
       [data-i18n]         → text swapped from a dictionary
       [data-lang-content] → whole blocks shown/hidden
  --------------------------------------------------------------------- */
  var BASE_I18N = {
    de: {
      navHome: 'Start',
      navTools: 'Tools',
      navLifebar: 'LifeBar',
      navLegal: 'Impressum',
      navPrivacy: 'Datenschutz',
      navMenu: 'Menü',
      footerTagline: 'Ein kleines, menschlich gemachtes Projekt.',
      footerEtsy: 'Etsy',
      footerBack: 'Zur Startseite'
    },
    en: {
      navHome: 'Home',
      navTools: 'Tools',
      navLifebar: 'LifeBar',
      navLegal: 'Legal notice',
      navPrivacy: 'Privacy',
      navMenu: 'Menu',
      footerTagline: 'A small, human-made project.',
      footerEtsy: 'Etsy',
      footerBack: 'Back to home'
    }
  };

  var pageI18N = window.OH_I18N || { de: {}, en: {} };
  var DICT = {
    de: Object.assign({}, BASE_I18N.de, pageI18N.de || {}),
    en: Object.assign({}, BASE_I18N.en, pageI18N.en || {})
  };

  var langButtons = document.querySelectorAll('[data-lang]');

  function setLang(lang) {
    if (lang !== 'de' && lang !== 'en') lang = 'en';
    var dict = DICT[lang];

    /* pages with fixed-language body copy (legal texts) keep their lang attribute */
    if (!document.documentElement.hasAttribute('data-lang-fixed')) {
      document.documentElement.lang = lang;
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (Object.prototype.hasOwnProperty.call(dict, key)) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      /* format: "aria-label:navMenu" */
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2 && dict[parts[1].trim()]) {
          el.setAttribute(parts[0].trim(), dict[parts[1].trim()]);
        }
      });
    });

    document.querySelectorAll('[data-lang-content]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang-content') === lang);
    });

    langButtons.forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try { localStorage.setItem('onehumanity-lang', lang); } catch (e) { /* private mode */ }

    /* let other scripts (projects.render.js) rebuild their markup */
    window.OH_LANG = lang;
    document.dispatchEvent(new CustomEvent('oh:langchange', { detail: { lang: lang } }));
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
  });

  var stored = null;
  try { stored = localStorage.getItem('onehumanity-lang'); } catch (e) { /* ignore */ }
  var browserLang = (navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  setLang(stored || browserLang);

  /* --- sticker tilt ---------------------------------------------------- */
  var stickerCard = document.querySelector('[data-sticker]');
  if (stickerCard && !reduceMotion) {
    var tilt = stickerCard.querySelector('.sticker');
    var sheen = stickerCard.querySelector('.sticker-sheen');

    var move = function (clientX, clientY) {
      var rect = stickerCard.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      var nx = (x / rect.width) * 2 - 1;
      var ny = (y / rect.height) * 2 - 1;

      tilt.classList.add('is-hovered');
      tilt.style.transform =
        'rotateX(' + (-ny * 15).toFixed(2) + 'deg) ' +
        'rotateY(' + (nx * 15).toFixed(2) + 'deg) ' +
        'translate(' + (nx * 6).toFixed(2) + 'px,' + (ny * 3).toFixed(2) + 'px) scale(1.03)';

      if (sheen) {
        sheen.style.opacity = '1';
        sheen.style.transform = 'translateX(' + (-120 + (x / rect.width) * 180) + '%) rotate(10deg)';
      }
      stickerCard.style.transform = 'translateY(-3px)';
    };

    var reset = function () {
      tilt.classList.remove('is-hovered');
      tilt.style.transform = '';
      if (sheen) {
        sheen.style.opacity = '0';
        sheen.style.transform = 'translateX(-120%) rotate(10deg)';
      }
      stickerCard.style.transform = '';
    };

    stickerCard.addEventListener('mouseenter', function (e) { move(e.clientX, e.clientY); });
    stickerCard.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    stickerCard.addEventListener('mouseleave', reset);
    stickerCard.addEventListener('touchmove', function (e) {
      var t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    }, { passive: true });
    stickerCard.addEventListener('touchend', reset);
  }

})();
