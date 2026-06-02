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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── LinkedIn Posts Loader ──────────────────────────────────────────────────
(async function loadPosts() {
  const grid = document.getElementById('postsGrid');
  const meta = document.getElementById('postsMeta');
  if (!grid) return;

  try {
    const res = await fetch('data/linkedin-posts.json');
    if (!res.ok) throw new Error('not found');
    const data = await res.json();

    const hasBob = data.bob && data.bob.length > 0;
    const hasKen = data.ken && data.ken.length > 0;

    if (!hasBob && !hasKen) {
      grid.innerHTML = '<div class="posts-loading">Posts coming soon — check back tomorrow.</div>';
      return;
    }

    function fmtDate(str) {
      if (!str) return '';
      try { return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
      catch { return str.slice(0, 16); }
    }

    function renderCol(posts, name, profileUrl) {
      if (!posts || posts.length === 0) return '';
      const header = `<div class="posts-col-header">
        <span>— ${name}</span>
      </div>`;
      const cards = posts.map(p => `
        <div class="post-card">
          <a href="${p.link}" target="_blank" rel="noopener">${p.title || p.summary.slice(0, 90) + '…'}</a>
          ${p.summary ? `<p class="post-summary">${p.summary.slice(0, 180)}${p.summary.length > 180 ? '…' : ''}</p>` : ''}
          <span class="post-date">${fmtDate(p.date)}</span>
        </div>`).join('');
      return `<div><div class="posts-col-header"><span>— ${name}</span></div>${cards}</div>`;
    }

    grid.innerHTML =
      renderCol(data.bob, 'Bob Rapp', 'https://www.linkedin.com/in/bobrapp/') +
      renderCol(data.ken, 'Ken Johnston', 'https://www.linkedin.com/in/kenjohnston/');

    if (data.updated) {
      meta.textContent = `Last updated ${fmtDate(data.updated)} · Updated daily`;
    }
  } catch (e) {
    grid.innerHTML = '<div class="posts-loading">Posts loading shortly.</div>';
  }
})();
