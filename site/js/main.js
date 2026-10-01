// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── LinkedIn Posts ─────────────────────────────────────────────────────────
const LINKEDIN = {
  bob: { name: 'Bob Rapp',      url: 'https://www.linkedin.com/in/bobrapp/',      icon: '💡' },
  ken: { name: 'Ken Johnston',  url: 'https://www.linkedin.com/in/rkjohnston/',  icon: '💡' },
};

function fmtDate(str) {
  if (!str) return '';
  try { return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return str.slice(0, 16); }
}

// EVERY FIELD BELOW CAME OFF A THIRD-PARTY FEED. TREAT IT AS HOSTILE.
//
// Found by the review council, 2026-09-30. title, link, summary and date are read
// straight out of the rss.app bridge by scripts/fetch_posts.py (only summary saw a
// regex tag-strip, which is not an escaper and is bypassable inside a template
// literal), then interpolated into the string assigned to grid.innerHTML below. The
// page's CSP allows 'unsafe-inline', so an <img src=x onerror=…> in a post title
// executed in every visitor's browser. The feed is NOT limited to Bob's and Ken's own
// prose — the committed JSON has carried posts authored by four other people — so the
// text was never ours to trust.
//
// Two rules, and they are belt and braces on purpose (fetch_posts.py escapes too, so
// the committed JSON carries no markup at all):
//   esc()      — any feed string that reaches markup, including inside an attribute.
//   safeHref() — a URL in an href must also be scheme-checked, because escaping does
//                nothing about javascript:. Anything not http(s) becomes '#'.
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function safeHref(u) {
  const raw = String(u == null ? '' : u).trim();
  // An empty link is '#', not the current page. Caught by scripts/test-xss.js on the
  // first run: new URL('', baseURI) succeeds and resolves to index.html, so an item
  // with no link would have rendered as a post card that silently reloads the home
  // page — a dead control dressed as a working one.
  if (!raw) return '#';
  // Parsed, not pattern-matched: a relative URL resolves against the page and a
  // malformed one throws, and both of those answers are "not a link we vouch for".
  try {
    const parsed = new URL(raw, document.baseURI);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return '#';
    return esc(parsed.href);
  } catch (e) { return '#'; }
}

function renderPostCard(p) {
  const title = (p.title || p.summary || 'Read post').slice(0, 100);
  const summary = (p.summary || '').slice(0, 200);
  const truncTitle = title.length >= 100 ? title.slice(0, title.lastIndexOf(' ', 97)) + '…' : title;
  const truncSummary = summary.length >= 200 ? summary.slice(0, summary.lastIndexOf(' ', 197)) + '… Read →' : summary;
  // esc() covers the aria-label too — the old .replace(/"/g,'&quot;') closed the quote
  // but left < and > alone, so the attribute was an injection point of its own.
  return `<a class="post-card" href="${safeHref(p.link)}" target="_blank" rel="noopener" aria-label="${esc(truncTitle)}, opens in new tab">
    <span class="post-title">${esc(truncTitle)}</span>
    ${truncSummary ? `<span class="post-summary">${esc(truncSummary)}</span>` : ''}
    <span class="post-date">${esc(fmtDate(p.date))}</span>
  </a>`;
}

function renderCol(person, posts) {
  const p = LINKEDIN[person];
  const profileBtn = `<a class="linkedin-profile-btn" href="${p.url}" target="_blank" rel="noopener">
    ${p.icon} View all ${p.name.split(' ')[0]}'s posts →
  </a>`;
  if (!posts || posts.length === 0) {
    return `<div class="founders-col">
      <div class="founders-col-header">${p.name}</div>
      ${profileBtn}
    </div>`;
  }
  // Teaser mode (2026-07-18 one-word fixes): the porch shows the 2 newest per
  // founder; the full feed lives on their LinkedIn profiles via the button below.
  const teaser = posts.slice(0, 2);
  return `<div class="founders-col">
    <div class="founders-col-header">${p.name}</div>
    ${teaser.map(renderPostCard).join('')}
    ${profileBtn}
  </div>`;
}

function loadPosts(data) {
  const grid = document.getElementById('postsGrid');
  if (!grid) return;

  // IS THIS FEED ACTUALLY ALIVE?
  //
  // On 2026-07-20 this section had been showing posts from 2 June under the heading
  // "Latest" for seven weeks. The RSS bridge subscription had lapsed (HTTP 402) and the
  // fetch job reported success every run, so nothing anywhere said otherwise. The data
  // itself was honest — it carried fetch_error:true and updated:2026-06-02 — and both
  // layers that could have read it did not.
  //
  // A stale feed must not be dressed as a live one. Past the threshold we show the
  // profile links (always correct, never stale) instead of pretending June is today.
  const STALE_HOURS = 48;
  const MAX_POSTS = 10;      // never show more than this per person
  const MAX_AGE_DAYS = 30;   // …and nothing older than this, however few that leaves

  // The same rule the fetcher applies, applied again here. Belt and braces on purpose: the
  // JSON is a file on a CDN and can be cached, hand-edited, or simply old, and the page is
  // the last thing between a stale post and a visitor who will read it as current. A post
  // with an unreadable date is KEPT — a feed changing its date format should look odd, not
  // vanish silently.
  function fresh(posts){
    const cutoff = Date.now() - MAX_AGE_DAYS * 86400000;
    return (posts || []).filter(function (p) {
      const t = Date.parse(p && p.date);
      return isNaN(t) ? true : t >= cutoff;
    }).slice(0, MAX_POSTS);
  }
  let ageHours = null;
  if (data && data.updated) {
    try { ageHours = (Date.now() - new Date(data.updated)) / 3600000; } catch (e) {}
  }
  const stale = (data && data.fetch_error) || (ageHours !== null && ageHours > STALE_HOURS);

  const bob = stale ? [] : fresh(data.bob);
  const ken = stale ? [] : fresh(data.ken);
  grid.innerHTML = renderCol('bob', bob) + renderCol('ken', ken);

  // If the feed is technically fresh but nothing survives the age filter, say so rather than
  // showing two empty columns that look like a broken page.
  const emptied = !stale && !bob.length && !ken.length;

  const ts = document.getElementById('postsUpdated');
  if (!ts) return;
  if (emptied) {
    ts.textContent = 'No posts in the last ' + MAX_AGE_DAYS + ' days — visit our profiles for the latest.';
    ts.style.color = 'var(--muted)';
    return;
  }
  if (stale) {
    // Say it plainly and visibly. A staleness notice in muted 0.75rem grey next to a
    // heading that says "Latest" is not a notice, it is decoration.
    ts.textContent = 'Live feed is not updating right now — visit our profiles for the latest.';
    ts.style.color = 'var(--warn, #b8860b)';
    ts.title = data && data.updated ? 'Last successful fetch: ' + new Date(data.updated).toLocaleString() : '';
  } else if (ageHours !== null) {
    const label = ageHours < 1 ? 'just now'
      : ageHours < 24 ? Math.round(ageHours) + 'h ago'
      : Math.round(ageHours / 24) + 'd ago';
    ts.textContent = 'Updated ' + label;
    ts.style.color = '';
    try { ts.title = new Date(data.updated).toLocaleString(); } catch (e) {}
  }
}

// Fetch with XMLHttpRequest (more compatible than fetch in some cached contexts)
(function () {
  const grid = document.getElementById('postsGrid');
  if (!grid) return;

  // Fallback: show LinkedIn buttons immediately, replace if data loads
  grid.innerHTML = renderCol('bob', []) + renderCol('ken', []);

  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/linkedin-posts.json?v=' + Date.now(), true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      try { loadPosts(JSON.parse(xhr.responseText)); } catch (e) { /* keep fallback */ }
    }
  };
  xhr.send();
})();
