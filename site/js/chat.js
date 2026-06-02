/**
 * AiGovOps Foundation — Locked-Down Assistant
 *
 * This chatbot ONLY responds about:
 *   1. Newsletter (Substack)
 *   2. Events (Luma)
 *   3. Ken Johnston's LinkedIn
 *   4. Bob Rapp's LinkedIn
 *   5. Open Source tools (Beacon + Umbrella, shown together)
 *   6. Beacon specifically (GitHub)
 *   7. Umbrella specifically (GitHub Pages)
 *
 * Everything else gets a polite refusal pointing back to these six things.
 * Zero external API calls. Pure rule-based matching. Fully offline.
 *
 * To update a URL: search for the RESOURCE URLS section below.
 */

// ─── RESOURCE URLS ──────────────────────────────────────────────────────────
// Update these when URLs change. That's the only thing you should ever edit here.
const RESOURCES = {
  newsletter: {
    url:   'https://aigovops.substack.com/',
    label: 'AiGovOps Newsletter on Substack',
    cta:   'Subscribe on Substack →',
  },
  event: {
    url:   'https://luma.com/2mypeqtr',
    label: 'Upcoming AiGovOps Event on Luma',
    cta:   'View & Register on Luma →',
  },
  ken: {
    url:   'https://rss.app/feeds/g12M4qd70BrS5rcy.xml',
    label: "Ken Johnston's LinkedIn posts",
    cta:   "Open Ken's LinkedIn →",
  },
  bob: {
    url:   'https://www.linkedin.com/in/bobrapp/',
    label: "Bob Rapp's LinkedIn posts",
    cta:   "Open Bob's LinkedIn →",
  },
  beacon: {
    url:   'https://bobrapp.github.io/aigovops-beacon/',
    label: 'Beacon — open-source AI governance tool',
    cta:   'View Beacon on GitHub →',
  },
  umbrella: {
    url:   'https://bobrapp.github.io/umbrella-govops/',
    label: 'Umbrella — AI GovOps platform',
    cta:   'Open Umbrella →',
  },
  meeting: {
    url:   'https://outlook.office365.com/owa/calendar/Meetwithaaigovopsfoundationvolunteer@aigovops.community/bookings/',
    label: 'Meet with an AiGovOps Foundation Volunteer',
    cta:   'Book a Meeting →',
  },
};
// ────────────────────────────────────────────────────────────────────────────

// Keyword → intent mapping (order matters: first match wins)
// 'opensource' must come BEFORE 'beacon' and 'umbrella' so generic queries
// show both tools rather than snapping to just one.
const INTENT_RULES = [
  { intent: 'meeting',    keywords: ['meeting', 'meet', 'book', 'booking', 'schedule', 'volunteer', 'chat', 'talk', 'call', 'connect'] },
  { intent: 'newsletter', keywords: ['newsletter', 'substack', 'subscribe', 'email', 'updates', 'weekly', 'digest'] },
  { intent: 'event',      keywords: ['event', 'events', 'luma', 'meetup', 'attend', 'join', 'register', 'conference', 'summit', 'upcoming', 'next'] },
  { intent: 'ken',        keywords: ['ken', 'johnston', "ken's"] },
  { intent: 'bob',        keywords: ['bob', 'rapp', "bob's"] },
  { intent: 'beacon',     keywords: ['beacon', 'beakon'] },
  { intent: 'umbrella',   keywords: ['umbrella', 'umbrela', 'govops platform'] },
  { intent: 'opensource', keywords: ['open source', 'opensource', 'open-source', 'github', 'projects', 'repos', 'repository', 'repositories', 'contribute'] },
  { intent: 'linkedin',   keywords: ['linkedin', 'posts', 'thoughts', 'insights', 'founders'] },
];

const CHIP_LABELS = {
  meeting:     '📆 Meet a Volunteer',
  newsletter:  '📰 Newsletter',
  event:       '📅 Next Event',
  ken:         "💡 Ken's posts",
  bob:         "💡 Bob's posts",
  opensource:  '💻 Open Source',
  beacon:      '🔦 Beacon',
  umbrella:    '☂️ Umbrella',
};

const FALLBACK = `I can only help with these eight things — tap one below or type a keyword like "meeting", "newsletter", "event", "Ken", "Bob", "open source", "Beacon", or "Umbrella".`;

// DOM refs
const bubble   = document.getElementById('chatBubble');
const badge    = document.getElementById('chatBadge');
const window_  = document.getElementById('chatWindow');
const closeBtn = document.getElementById('chatClose');
const messages = document.getElementById('chatMessages');
const chips    = document.getElementById('chatChips');
const form     = document.getElementById('chatForm');
const input    = document.getElementById('chatInput');

// Open / close
bubble.addEventListener('click', openChat);
bubble.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openChat(); });
closeBtn.addEventListener('click', closeChat);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !window_.hidden) closeChat(); });

function openChat() {
  window_.hidden = false;
  badge.style.display = 'none';
  input.focus();
}
function closeChat() {
  window_.hidden = true;
  bubble.focus();
}

// Chip clicks
chips.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => handleIntent(chip.dataset.intent));
});

// Text input
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, 'user');
  input.value = '';
  const intent = classify(text);
  setTimeout(() => {
    if (intent) handleIntent(intent);
    else         addMsg(FALLBACK, 'bot', true);
  }, 220);
});

function classify(text) {
  const lower = text.toLowerCase();
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      // 'linkedin' without a name → ask which one
      if (rule.intent === 'linkedin') return null;
      return rule.intent;
    }
  }
  return null;
}

function handleIntent(intent) {
  // Special case: open source shows both Beacon and Umbrella
  if (intent === 'opensource') {
    const b = RESOURCES.beacon;
    const u = RESOURCES.umbrella;
    const btn = (url, cta) =>
      `<a href="${url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;margin-right:6px;padding:8px 14px;background:#6c3de6;color:#fff;border-radius:8px;font-size:0.82rem;font-weight:700;text-decoration:none;">${cta}</a>`;
    addMsg(
      `We have two open-source tools:<br><br>` +
      `<strong><a href="${b.url}" target="_blank" rel="noopener">${b.label}</a></strong><br>` +
      btn(b.url, b.cta) +
      `<br><br>` +
      `<strong><a href="${u.url}" target="_blank" rel="noopener">${u.label}</a></strong><br>` +
      btn(u.url, u.cta),
      'bot'
    );
    return;
  }

  const r = RESOURCES[intent];
  if (!r) return;
  addMsg(
    `Here you go: <a href="${r.url}" target="_blank" rel="noopener"><strong>${r.label}</strong></a><br><br><a href="${r.url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:4px;padding:8px 16px;background:#6c3de6;color:#fff;border-radius:8px;font-size:0.82rem;font-weight:700;text-decoration:none;">${r.cta}</a>`,
    'bot'
  );
}

function addMsg(html, role, showChips = false) {
  // Remove old chip bar if any
  const old = messages.querySelector('.chat-chips-inline');
  if (old) old.remove();

  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = html;
  messages.appendChild(div);

  if (showChips) {
    const inline = document.createElement('div');
    inline.className = 'chat-chips chat-chips-inline';
    Object.entries(CHIP_LABELS).forEach(([intent, label]) => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = label;
      btn.addEventListener('click', () => handleIntent(intent));
      inline.appendChild(btn);
    });
    messages.appendChild(inline);
  }

  messages.scrollTop = messages.scrollHeight;
}
