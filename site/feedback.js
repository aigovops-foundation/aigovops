/* feedback.js — the estate's "Was this page helpful?" strip, single-source injector.
 * (M12b — the visitor half of the estate feedback loop.)
 *
 * Drop into any estate content page with one line, ABOVE the estate-footer script:
 *   <script src="feedback.js" defer></script>
 *
 * Renders ONE compact garden-styled strip (class aig-feedback) directly above the
 * page footer: 👍 / 👎 + an expandable "Tell us more" note. POSTs to the community
 * droplet's /api/feedback (source: "estate", page = this page's URL); the API strips
 * query strings, keeps no IP, and reduces the UA to a coarse family — the honest
 * privacy line below the strip is the whole story.
 *
 * Conventions (same contract as estate-footer.js):
 *   • data-theme="light" on the script tag → fixed light palette (cream/garden pages);
 *     default = dark, reusing the page's CSS vars with AA-safe charcoal fallbacks;
 *   • data-endpoint override for local testing;
 *   • dependency-free, self-contained, idempotent; degrades SILENTLY if the endpoint
 *     is unreachable (a broken feedback rail must never mark a page);
 *   • honeypot: a visually-hidden "website" field no human ever fills — the API
 *     swallows any POST that carries it;
 *   • a11y: one role="group" with a label, aria-pressed thumbs, ≥24px targets,
 *     visible focus, aria-live thank-you; never a heading element (page h1→h2
 *     order untouched).
 *
 * Governance: presentation + one anonymous POST. No cookies, no storage, no secrets.
 * Do not wire onto pages yet — wiring is a follow-up commit after the API deploys.
 */
(function () {
  if (document.querySelector('.aig-feedback')) return;   // idempotent

  var DS = (document.currentScript && document.currentScript.dataset) || {};
  var THEME = DS.theme === 'light' ? 'light' : 'dark';
  var ENDPOINT = DS.endpoint || 'https://community.aigovops-foundation.com/api/feedback';
  var STRINGS = {
    en: {
      group: 'Page feedback',
      question: 'Was this page helpful?',
      up: 'Yes, this page was helpful',
      down: 'No, this page was not helpful',
      more: 'Tell us more',
      honeypot: 'Leave this field empty',
      textarea: 'Tell us more about this page',
      placeholder: 'What worked, what didn’t…',
      send: 'Send',
      privacy: 'Sent to the founders. No account, no cookies; don’t include personal info.',
      thanks: 'Thanks!',
      noteThanks: 'Thank you — the founders read every note.'
    },
    es: {
      group: 'Comentarios de la página',
      question: '¿Te resultó útil esta página?',
      up: 'Sí, esta página fue útil',
      down: 'No, esta página no fue útil',
      more: 'Cuéntanos más',
      honeypot: 'Deja este campo vacío',
      textarea: 'Cuéntanos más sobre esta página',
      placeholder: '¿Qué funcionó y qué no…?',
      send: 'Enviar',
      privacy: 'Se envía a los fundadores. Sin cuenta ni cookies; no incluyas información personal.',
      thanks: '¡Gracias!',
      noteThanks: 'Gracias — los fundadores leen todas las notas.'
    }
  };

  // AA on both grounds: light = garden ink/green on cream (≥4.5:1); dark = the
  // estate-footer's charcoal set, page vars honored with safe fallbacks.
  var C = THEME === 'light' ? {
    ink: '#2b2b28', muted: '#4c4a42', accent: '#085041',
    line: 'rgba(0,0,0,.16)', bg: 'rgba(8,80,65,.04)',
    btnbg: '#ffffff', focus: '#085041'
  } : {
    ink: 'var(--ink,#e7f3f1)', muted: 'var(--ink2,#9fc0bd)',
    accent: 'var(--green2,var(--green,#6fe6a3))',
    line: 'var(--line,rgba(120,180,180,.22))', bg: 'var(--card,rgba(255,255,255,.03))',
    btnbg: 'rgba(255,255,255,.04)', focus: 'var(--green2,var(--green,#6fe6a3))'
  };

  function injectStyle() {
    if (document.getElementById('aig-feedback-css')) return;
    var css =
      '.aig-feedback{margin:44px 0 0;padding:18px 22px;border-top:1px solid ' + C.line + ';' +
        'background:' + C.bg + ';color:' + C.muted + ';' +
        "font-family:'Source Sans 3','Inter',system-ui,-apple-system,Segoe UI,sans-serif;" +
        'font-size:15px;line-height:1.5}' +
      '.aig-feedback .aig-fb-inner{max-width:1000px;margin:0 auto}' +
      '.aig-feedback .aig-fb-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px}' +
      '.aig-feedback .aig-fb-q{color:' + C.ink + ';font-weight:600}' +
      '.aig-feedback button{font:inherit;cursor:pointer;border-radius:10px;' +
        'border:1.5px solid ' + C.line + ';background:' + C.btnbg + ';color:' + C.ink + ';' +
        'min-width:44px;min-height:34px;padding:4px 12px}' +
      '.aig-feedback button:hover{border-color:' + C.accent + '}' +
      '.aig-feedback button[aria-pressed="true"]{border-color:' + C.accent + ';' +
        'box-shadow:inset 0 0 0 1px ' + C.accent + '}' +
      '.aig-feedback button:disabled{cursor:default;opacity:.55}' +
      '.aig-feedback .aig-fb-more{color:' + C.accent + ';border-color:transparent;' +
        'background:transparent;text-decoration:underline;padding:4px 6px}' +
      '.aig-feedback .aig-fb-send{border-color:' + C.accent + ';color:' + C.accent + ';font-weight:600}' +
      /* :not([hidden]) — an author display rule must never defeat the hidden attribute */
      '.aig-feedback form:not([hidden]){display:flex;flex-wrap:wrap;gap:10px;margin:12px 0 0;align-items:flex-start}' +
      '.aig-feedback form[hidden],.aig-feedback [hidden]{display:none}' +
      '.aig-feedback textarea{flex:1 1 340px;min-height:74px;max-width:640px;font:inherit;' +
        'color:' + C.ink + ';background:' + C.btnbg + ';border:1.5px solid ' + C.line + ';' +
        'border-radius:10px;padding:8px 10px;resize:vertical}' +
      '.aig-feedback textarea:focus,.aig-feedback button:focus-visible{outline:2px solid ' +
        C.focus + ';outline-offset:2px}' +
      '.aig-feedback .aig-fb-privacy{margin:10px 0 0;font-size:12.5px;color:' + C.muted + '}' +
      '.aig-feedback .aig-fb-thanks{color:' + C.accent + ';font-weight:600}' +
      /* honeypot: removed from every human's flow, present for bots */
      '.aig-feedback .aig-fb-hp{position:absolute;left:-9999px;width:1px;height:1px;' +
        'overflow:hidden;opacity:0}' +
      '@media(max-width:560px){.aig-feedback{padding:16px 14px}}';
    var st = document.createElement('style');
    st.id = 'aig-feedback-css';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  function send(payload, done) {
    // Silent by contract: any failure (offline, CORS, 4xx/5xx) still resolves the UI.
    try {
      var body = JSON.stringify({
        source: 'estate',
        page: location.href,
        vote: payload.vote || null,
        text: payload.text || '',
        website: payload.website || ''      // honeypot passthrough (always empty for humans)
      });
      if (!window.fetch) { done(); return; }
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true
      }).then(function () { done(); }, function () { done(); });
    } catch (e) { done(); }
  }

  function build() {
    if (document.querySelector('.aig-feedback')) return;
    injectStyle();

    var strip = document.createElement('div');
    strip.className = 'aig-feedback';
    strip.setAttribute('role', 'group');
    strip.innerHTML =
      '<div class="aig-fb-inner">' +
        '<div class="aig-fb-row">' +
          '<span class="aig-fb-q"></span>' +
          '<button type="button" class="aig-fb-up" aria-pressed="false">👍</button>' +
          '<button type="button" class="aig-fb-down" aria-pressed="false">👎</button>' +
          '<button type="button" class="aig-fb-more" aria-expanded="false"></button>' +
          '<span class="aig-fb-note" role="status" aria-live="polite"></span>' +
        '</div>' +
        '<form hidden novalidate>' +
          '<label class="aig-fb-hp" aria-hidden="true"><span class="aig-fb-hp-label"></span>' +
            '<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
          '<textarea maxlength="2000"></textarea>' +
          '<button type="submit" class="aig-fb-send"></button>' +
        '</form>' +
        '<p class="aig-fb-privacy"></p>' +
      '</div>';

    var up = strip.querySelector('.aig-fb-up');
    var down = strip.querySelector('.aig-fb-down');
    var more = strip.querySelector('.aig-fb-more');
    var form = strip.querySelector('form');
    var ta = strip.querySelector('textarea');
    var hp = strip.querySelector('input[name="website"]');
    var note = strip.querySelector('.aig-fb-note');
    var voted = false;
    var noteType = '';

    function renderLanguage() {
      var lang = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
      var text = STRINGS[lang] || STRINGS.en;
      strip.setAttribute('aria-label', text.group);
      strip.querySelector('.aig-fb-q').textContent = text.question;
      up.setAttribute('aria-label', text.up);
      down.setAttribute('aria-label', text.down);
      more.textContent = text.more;
      strip.querySelector('.aig-fb-hp-label').textContent = text.honeypot;
      ta.setAttribute('aria-label', text.textarea);
      ta.placeholder = text.placeholder;
      form.querySelector('.aig-fb-send').textContent = text.send;
      strip.querySelector('.aig-fb-privacy').textContent = text.privacy;
      note.textContent = noteType ? text[noteType] : '';
    }

    renderLanguage();
    new MutationObserver(function (mutations) {
      if (mutations.some(function (mutation) { return mutation.attributeName === 'lang'; })) renderLanguage();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    function vote(which, btn, other) {
      if (voted) return;
      voted = true;
      btn.setAttribute('aria-pressed', 'true');
      up.disabled = down.disabled = true;
      other.setAttribute('aria-pressed', 'false');
      send({ vote: which, website: hp.value }, function () {
        noteType = 'thanks';
        renderLanguage();
      });
    }
    up.addEventListener('click', function () { vote('up', up, down); });
    down.addEventListener('click', function () { vote('down', down, up); });

    more.addEventListener('click', function () {
      var open = form.hasAttribute('hidden');
      if (open) { form.removeAttribute('hidden'); ta.focus(); } else { form.setAttribute('hidden', ''); }
      more.setAttribute('aria-expanded', String(open));
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var text = (ta.value || '').trim();
      if (!text) { ta.focus(); return; }
      form.querySelector('.aig-fb-send').disabled = true;
      // The thumb (if any) already posted; a note travels on its own so nothing double-counts.
      send({ vote: null, text: text.slice(0, 2000), website: hp.value }, function () {
        form.setAttribute('hidden', '');
        more.setAttribute('hidden', '');
        noteType = 'noteThanks';
        renderLanguage();
      });
    });

    // Above the footer: the estate footer if present, else the page's own footer,
    // else the end of main/body. estate-footer.js replaces the page footer IN PLACE,
    // so inserting before the existing footer holds its spot either way.
    var footer = document.querySelector('footer.aig-estate-footer') || document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(strip, footer);
    } else {
      (document.querySelector('main') || document.querySelector('.wrap') || document.body).appendChild(strip);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
