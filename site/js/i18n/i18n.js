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

  function loadStrings(lang) {
    // Remove existing script
    const existing = document.getElementById('i18n-strings');
    if (existing) existing.remove();
    const s = document.createElement('script');
    s.id = 'i18n-strings';
    s.src = `js/i18n/strings-${lang}.js`;
    s.onload = applyStrings;
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
