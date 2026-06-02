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

function renderPostCard(p) {
  const title = (p.title || p.summary || 'Read post').slice(0, 100);
  const summary = (p.summary || '').slice(0, 200);
  return `<a class="post-card" href="${p.link}" target="_blank" rel="noopener">
    <span class="post-title">${title}${title.length >= 100 ? '…' : ''}</span>
    ${summary ? `<span class="post-summary">${summary}${summary.length >= 200 ? '…' : ''}</span>` : ''}
    <span class="post-date">${fmtDate(p.date)}</span>
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
  return `<div class="founders-col">
    <div class="founders-col-header">${p.name}</div>
    ${posts.map(renderPostCard).join('')}
    ${profileBtn}
  </div>`;
}

function loadPosts(data) {
  const grid = document.getElementById('postsGrid');
  if (!grid) return;
  grid.innerHTML = renderCol('bob', data.bob) + renderCol('ken', data.ken);
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
