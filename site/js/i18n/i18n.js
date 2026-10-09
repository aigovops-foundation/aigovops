/**
 * AiGovOps i18n — lightweight language switcher
 * Loads strings-{lang}.js and applies to data-i18n attributes
 * Usage: <span data-i18n="hero.h1"></span>
 *        <button data-i18n="chips.meeting"></button>
 */
(function() {
  const SUPPORTED = ['en', 'es'];
  const STORAGE_KEY = 'aigovops-lang';

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'en';
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    loadStrings(lang);
  }

  function applyStrings() {
    if (!window.I18N) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const keys = el.getAttribute('data-i18n').split('.');
      let val = window.I18N;
      for (const k of keys) { val = val && val[k]; }
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
        else el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const keys = el.getAttribute('data-i18n-html').split('.');
      let val = window.I18N;
      for (const k of keys) { val = val && val[k]; }
      if (val) el.innerHTML = val;
    });
    // Update lang toggle active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('lang-active', btn.dataset.lang === window.I18N.lang);
    });
    // Update html lang attribute
    document.documentElement.lang = window.I18N.lang;
  }

  // WHERE THIS FILE LIVES, resolved once, from this file's own URL.
  //
  // THE BUG, found 2026-09-30. The src below was the document-relative literal
  // `js/i18n/strings-${lang}.js`. On the home page that resolves correctly. On any page
  // under blog/ it resolves to /blog/js/i18n/strings-es.js — a 404 — so i18n never
  // loaded, the ES button did nothing, and `document.documentElement.lang` was never
  // updated, on all 14 blog pages. Nothing said so: `s.onload` was set and `s.onerror`
  // was not, so the failure was perfectly silent.
  //
  // Resolved from `document.currentScript.src` rather than hardcoded to a root-absolute
  // `/js/i18n/...`, because root-absolute breaks the moment the site is served from a
  // subpath (a GitHub Pages project page, a staging prefix, a local `python3 -m
  // http.server` in a parent directory). Deriving it from this script's own location is
  // correct in all of those and needs no configuration.
  const I18N_SCRIPT_URL = (function () {
    try {
      const self = document.currentScript && document.currentScript.src;
      if (self) return new URL(self, document.baseURI);
    } catch (e) { /* fall through */ }
    return new URL('js/i18n/i18n.js', document.baseURI);
  })();
  const I18N_DIR = new URL('.', I18N_SCRIPT_URL).href;
  const I18N_VERSION = I18N_SCRIPT_URL.searchParams.get('v');

  function loadStrings(lang) {
    // Remove existing script
    const existing = document.getElementById('i18n-strings');
    if (existing) existing.remove();
    const s = document.createElement('script');
    s.id = 'i18n-strings';
    const stringsUrl = new URL(`strings-${lang}.js`, I18N_DIR);
    if (I18N_VERSION) stringsUrl.searchParams.set('v', I18N_VERSION);
    s.src = stringsUrl.href;
    s.onload = applyStrings;
    // FAIL LOUD. A missing strings file is why this went unnoticed for months: the page
    // simply kept its English static text and looked fine. One console line is the
    // difference between a silent downgrade and something a person can find.
    s.onerror = function () {
      console.error(`[i18n] could not load ${s.src} — the page will keep its static ` +
                    `text, so a language switch will appear to do nothing.`);
    };
    document.head.appendChild(s);
  }

  // Expose globally
  window.I18N_SET = setLang;
  window.I18N_APPLY = applyStrings;

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    loadStrings(getLang());
  });
})();
