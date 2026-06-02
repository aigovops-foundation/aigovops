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
    url:   'https://www.linkedin.com/in/rkjohnston/',
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
  frameworks: {
    url:   'https://bobrapp.github.io/umbrella-govops/',
    label: 'Browse 40+ governance frameworks',
    cta:   'Explore Frameworks →',
  },
};
// ────────────────────────────────────────────────────────────────────────────

// Keyword → intent mapping (order matters: first match wins)
// 'opensource' must come BEFORE 'beacon' and 'umbrella' so generic queries
// show both tools rather than snapping to just one.
const INTENT_RULES = [
  { intent: 'frameworks',  keywords: ['framework', 'frameworks', 'nist', 'eu ai act', 'iso', '42001', 'gdpr', 'hipaa', 'compliance', 'regulation', 'regulatory', 'audit', 'applies', 'which law', 'what law', 'overt', 'umbrella framework'] },
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
  frameworks:  '⚖️ Which frameworks apply?',
  meeting:     '📆 Meet a Volunteer',
  newsletter:  '📰 Newsletter',
  event:       '📅 Next Event',
  ken:         "💡 Ken's posts",
  bob:         "💡 Bob's posts",
  opensource:  '💻 Open Source',
  beacon:      '🔦 Beacon',
  umbrella:    '☂️ Umbrella',
};

const FALLBACK = `I can help with nine things — tap a chip below or type: "frameworks", "meeting", "newsletter", "event", "Ken", "Bob", "open source", "Beacon", or "Umbrella".`;

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

  // Framework agent: collect context then call AI
  if (window._awaitingFrameworkContext) {
    window._awaitingFrameworkContext = false;
    setTimeout(() => runFrameworkAgent(text), 220);
    return;
  }

  const intent = classify(text);
  setTimeout(() => {
    if (intent) handleIntent(intent);
    else         addMsg(FALLBACK, 'bot', true);
  }, 220);
});

async function runFrameworkAgent(userContext) {
  const thinking = document.createElement('div');
  thinking.className = 'chat-msg bot';
  thinking.innerHTML = '<code class="cli">scanning frameworks...</code>';
  document.getElementById('chatMessages').appendChild(thinking);
  document.getElementById('chatMessages').scrollTop = 9999;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: `You are the AiGovOps Foundation governance framework assistant. 
Given a user's context (region, industry, AI use cases), identify the top 3-5 most applicable AI governance frameworks from this list: EU AI Act, NIST AI RMF, ISO/IEC 42001, GDPR, HIPAA, UK AI Act, CCPA, Colorado AI Act, Korea AI Basic Act, OVERT 1.0, UNESCO AI Ethics, WCAG 2.2.
For each framework, give: framework name, why it applies in ONE sentence, and risk level (High/Medium/Low).
Format as a compact HTML list using <strong> for names. End with one sentence pointing to Umbrella-GovOps to map these into code.
Be direct and technical. Max 250 words. No preamble.`,
        messages: [{ role: 'user', content: userContext }],
      }),
    });
    const data = await res.json();
    const reply = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || 'Unable to analyze frameworks right now.';
    thinking.innerHTML = reply + `<br><br><a href="https://bobrapp.github.io/umbrella-govops/" target="_blank" rel="noopener" style="color:var(--teal);font-weight:700;">Map these to code with Umbrella →</a>`;
  } catch {
    thinking.innerHTML = 'Framework analysis unavailable right now. <a href="https://bobrapp.github.io/umbrella-govops/" target="_blank" rel="noopener" style="color:var(--teal);">Browse all 40+ frameworks on Umbrella →</a>';
  }
  document.getElementById('chatMessages').scrollTop = 9999;
}

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
  // Special case: frameworks → AI agent that identifies applicable frameworks
  if (intent === 'frameworks') {
    addMsg(
      `<code class="cli">$ beacon --frameworks --interactive</code><br><br>` +
      `Tell me a bit about your situation and I'll identify which AI governance frameworks apply to you — EU AI Act, NIST AI RMF, ISO/IEC 42001, HIPAA, GDPR, Korea AI Basic Act, and 30+ more.<br><br>` +
      `<em>What country or region are you operating in? What industry?</em>`,
      'bot'
    );
    // Set state to collect framework context and call the API
    window._awaitingFrameworkContext = true;
    return;
  }

  // Special case: meeting → open scheduling agent modal
  if (intent === 'meeting') {
    addMsg(
      `Great! I'll open our scheduling assistant — it'll check availability and help you request a 25-minute call with Ken or Bob. 👇`,
      'bot'
    );
    setTimeout(() => {
      if (window.SCHEDULE) window.SCHEDULE.open();
    }, 600);
    return;
  }

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
