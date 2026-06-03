/**
 * AiGovOps Foundation — Locked-Down Assistant
 *
 * This chatbot ONLY responds about:
 *   1. Newsletter (Substack)
 *   2. Events (Luma)
 *   3. Ken Johnston's LinkedIn
 *   4. Bob Rapp's LinkedIn
 *   5. Open Source tools (Beacon + Lantern, shown together)
 *   6. Beacon specifically (GitHub)
 *   7. Lantern specifically (GitHub Pages)
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
    url:   'https://www.aigovops-foundation.com/ken.html',
    label: "Ken Johnston — AiGovOps Foundation Co-founder",
    cta:   'View Ken\'s page →',
  },
  bob: {
    url:   'https://www.aigovops-foundation.com/bob.html',
    label: "Bob Rapp — AiGovOps Foundation Co-founder",
    cta:   'View Bob\'s page →',
  },
  beacon: {
    url:   'https://aigovops-foundation.github.io/aigovops-beacon/',
    label: 'Beacon — AI scanner and evidence signer (live)',
    cta:   'Open Beacon →',
  },
  umbrella: {
    url:   'https://aigovops-foundation.github.io/umbrella-govops/',
    label: 'Umbrella — AI governance compiler (live)',
    cta:   'Open Umbrella →',
  },
  support: {
    url:   'https://www.aigovops-foundation.com/support.html',
    label: 'Support the AiGovOps Foundation',
    cta:   'Fund the Standard →',
  },
  meeting: {
    url:   'https://outlook.office365.com/owa/calendar/Meetwithaaigovopsfoundationvolunteer@aigovops.community/bookings/',
    label: 'Meet with an AiGovOps Foundation Volunteer',
    cta:   'Book a Meeting →',
  },
  frameworks: {
    url:   'https://aigovops-foundation.github.io/umbrella-govops/',
    label: 'Browse 40+ governance frameworks',
    cta:   'Explore Frameworks →',
  },
};
// ────────────────────────────────────────────────────────────────────────────

// Keyword → intent mapping (order matters: first match wins)
// 'opensource' must come BEFORE 'beacon' and 'lantern' so generic queries
// show both tools rather than snapping to just one.
const INTENT_RULES = [
  { intent: 'support',     keywords: ['donate', 'donation', 'sponsor', 'support', 'fund', 'coffee', 'sustainer', 'partner', 'give'] },
  { intent: 'frameworks',  keywords: ['framework', 'frameworks', 'nist', 'eu ai act', 'iso', '42001', 'gdpr', 'hipaa', 'compliance', 'regulation', 'regulatory', 'audit', 'applies', 'which law', 'what law', 'overt', 'umbrella framework'] },
  { intent: 'meeting',    keywords: ['meeting', 'meet', 'book', 'booking', 'schedule', 'volunteer', 'chat', 'talk', 'call', 'connect'] },
  { intent: 'newsletter', keywords: ['newsletter', 'substack', 'subscribe', 'email', 'updates', 'weekly', 'digest'] },
  { intent: 'event',      keywords: ['event', 'events', 'luma', 'meetup', 'attend', 'join', 'register', 'conference', 'summit', 'upcoming', 'next'] },
  { intent: 'ken',        keywords: ['ken', 'johnston', "ken's"] },
  { intent: 'bob',        keywords: ['bob', 'rapp', "bob's"] },
  { intent: 'beacon',     keywords: ['beacon', 'beakon'] },
  { intent: 'umbrella',   keywords: ['lantern', 'umbrella', 'umbrela', 'govops platform'] },
  { intent: 'opensource', keywords: ['open source', 'opensource', 'open-source', 'github', 'projects', 'repos', 'repository', 'repositories', 'contribute'] },
  { intent: 'linkedin',   keywords: ['linkedin', 'posts', 'thoughts', 'insights', 'founders'] },
];

const CHIP_LABELS = {
  frameworks:  '⚖️ Which frameworks apply?',
  meeting:     '📆 Schedule a Call',
  support:     '💚 Support / Donate',
  newsletter:  '📰 Newsletter',
  event:       '📅 Next Event',
  ken:         "💡 Ken's posts",
  bob:         "💡 Bob's posts",
  opensource:  '💻 Open Source',
  beacon:      '🔦 Beacon',
  umbrella:    '🏮 Lantern',
};

const FALLBACK = `I can help with ten things — tap a chip below or type: "frameworks", "meeting", "support", "newsletter", "event", "Ken", "Bob", "open source", "Beacon", or "Lantern".`;

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

function track(event, props) {
  try { if (window.plausible) window.plausible(event, { props }); } catch(e) {}
}

function openChat() {
  window_.hidden = false;
  badge.style.display = 'none';
  track('Chatbot Open');
  // Apply i18n to welcome message and chip labels if available
  if (window.I18N && window.I18N.chatbot) {
    const welcome = messages.querySelector('.chat-msg.bot');
    if (welcome) {
      welcome.innerHTML = `<code class="cli">${window.I18N.chatbot.welcome}</code><br><br>${window.I18N.chatbot.ready}`;
    }
  }
  // Re-render chips with i18n labels if available
  if (window.I18N && window.I18N.chips) {
    chips.querySelectorAll('.chip').forEach(chip => {
      const intent = chip.dataset.intent;
      if (window.I18N.chips[intent]) chip.textContent = window.I18N.chips[intent];
    });
  }
  input.focus();
}
function closeChat() {
  window_.hidden = true;
  bubble.focus();
}

// Chip clicks
chips.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    track('Chatbot Chip', { intent: chip.dataset.intent });
    handleIntent(chip.dataset.intent);
  });
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
  // ── DEPLOY REQUIRED ────────────────────────────────────────────────────────
  // The Cloudflare Worker proxy is built but not yet deployed.
  // To go live:
  //   1. cd functions
  //   2. wrangler deploy
  //   3. wrangler secret put ANTHROPIC_API_KEY
  //   4. Set PROXY_URL below to your worker URL (e.g. https://aigovops-frameworks-agent.workers.dev)
  // Until deployed, the agent falls back to direct browser→API (fine for community use,
  // but the API key is not protected client-side in that mode).
  // ─────────────────────────────────────────────────────────────────────────────
  const PROXY_URL = '';

  const thinking = document.createElement('div');
  thinking.className = 'chat-msg bot';
  thinking.innerHTML = '<code class="cli">scanning frameworks...</code>';
  document.getElementById('chatMessages').appendChild(thinking);
  document.getElementById('chatMessages').scrollTop = 9999;

  const LANTERN_URL = 'https://aigovops-foundation.github.io/umbrella-govops/';
  const SYSTEM = `You are the AiGovOps Foundation governance framework assistant.
Given a user's context (region, industry, AI use cases), identify the top 3-5 most applicable AI governance frameworks from: EU AI Act, NIST AI RMF, ISO/IEC 42001, GDPR, HIPAA, UK AI Act, CCPA, Colorado AI Act, Korea AI Basic Act, OVERT 1.0, UNESCO AI Ethics, WCAG 2.2.
For each framework: name, why it applies in ONE sentence, risk level (High/Medium/Low).
Format as compact HTML using <strong> for names. End with one sentence pointing to Lantern to map into code.
Be direct and technical. Max 250 words. No preamble.`;

  try {
    let reply;
    if (PROXY_URL) {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userContext }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      reply = data.reply;
    } else {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: SYSTEM,
          messages: [{ role: 'user', content: userContext }],
        }),
      });
      const data = await res.json();
      reply = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || 'Unable to analyze frameworks right now.';
    }
    thinking.innerHTML = reply + `<br><br><a href="${LANTERN_URL}" target="_blank" rel="noopener" style="color:var(--teal);font-weight:700;">Map these to code with Lantern →</a>`;
  } catch {
    thinking.innerHTML = `Framework analysis unavailable right now. <a href="${LANTERN_URL}" target="_blank" rel="noopener" style="color:var(--teal);">Browse all 40+ frameworks on Lantern →</a>`;
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
    track('Frameworks Agent Start');
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
    track('Schedule Call Intent');
    addMsg(
      `Great! I'll open our scheduling assistant — it'll check availability and help you request a 25-minute call with Ken or Bob. 👇`,
      'bot'
    );
    setTimeout(() => {
      if (window.SCHEDULE) window.SCHEDULE.open();
    }, 600);
    return;
  }

  // Special case: open source shows both Beacon and Lantern
  if (intent === 'opensource') {
    const b = RESOURCES.beacon;
    const u = RESOURCES.umbrella;
    const btn = (url, cta) =>
      `<a href="${url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;margin-right:6px;padding:8px 14px;background:#6c3de6;color:#fff;border-radius:8px;font-size:0.82rem;font-weight:700;text-decoration:none;">${cta}</a>`;
    addMsg(
      `We have two live open-source tools — and one coming soon:<br><br>` +
      `<strong><a href="${b.url}" target="_blank" rel="noopener">${b.label}</a></strong><br>` +
      btn(b.url, b.cta) +
      `<br><br>` +
      `<strong><a href="${u.url}" target="_blank" rel="noopener">${u.label}</a></strong><br>` +
      btn(u.url, u.cta) +
      `<br><br>` +
      `<span style="opacity:0.65">🚧 <strong>Lantern CLI</strong> — next-gen human-carried companion to Beacon. <a href="https://github.com/aigovops-foundation/aigovops-lantern" target="_blank" rel="noopener" style="color:var(--teal)">Follow on GitHub →</a></span>`,
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

  // Speak bot responses aloud if voice is active
  if (role === 'bot' && window.VOICE_SPEAK) window.VOICE_SPEAK(html);

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

// ── Voice input (Web Speech API) ──────────────────────────────────────────
(function initVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceBtn  = document.getElementById('voiceBtn');
  const chatInput = document.getElementById('chatInput');
  const voiceIcon = document.getElementById('voiceIcon');
  if (!SpeechRecognition || !voiceBtn) return;

  // Show the button — browser supports speech
  voiceBtn.style.display = 'inline-flex';

  const ICON_MIC  = '<rect x="9" y="1" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8"/>';
  const ICON_STOP = '<circle cx="12" cy="12" r="9" fill="currentColor" opacity=".15"/><rect x="9" y="9" width="6" height="6" rx="1"/>';

  let recognition = null;
  let listening   = false;

  function startListening() {
    recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang === 'es' ? 'es-ES' : 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listening = true;
      voiceBtn.setAttribute('aria-label', 'Stop voice input');
      voiceBtn.style.color = '#e24b4a';
      voiceIcon.innerHTML = ICON_STOP;
      chatInput.placeholder = 'Listening…';
      track('Voice input started');
    };

    recognition.onresult = (e) => {
      const transcript = [...e.results].map(r => r[0].transcript).join('');
      chatInput.value  = transcript;
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
    };

    recognition.onend = () => {
      listening = false;
      voiceBtn.setAttribute('aria-label', 'Start voice input');
      voiceBtn.style.color = '';
      voiceIcon.innerHTML = ICON_MIC;
      chatInput.placeholder = 'Type or tap above…';

      // Auto-submit if we got text
      const text = chatInput.value.trim();
      if (text) {
        setTimeout(() => {
          document.getElementById('chatForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }, 300);
      }
    };

    recognition.onerror = (e) => {
      listening = false;
      voiceBtn.style.color = '';
      voiceIcon.innerHTML = ICON_MIC;
      chatInput.placeholder = 'Type or tap above…';
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        addMsg('bot', `Voice input error: ${e.error}. Try typing instead.`);
      }
    };

    recognition.start();
  }

  function stopListening() {
    if (recognition) recognition.stop();
  }

  voiceBtn.addEventListener('click', () => {
    if (listening) { stopListening(); } else { startListening(); }
  });

  // Keyboard: Space/Enter on voice button
  voiceBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (listening) { stopListening(); } else { startListening(); }
    }
  });

  // TTS — speak bot responses aloud if voice is active
  function speakResponse(text) {
    if (!window.speechSynthesis || !listening) return;
    // Strip HTML tags for speech
    const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!plain || plain.length < 3) return;
    const utt = new SpeechSynthesisUtterance(plain.slice(0, 300));
    utt.lang  = document.documentElement.lang === 'es' ? 'es-ES' : 'en-US';
    utt.rate  = 0.95;
    window.speechSynthesis.speak(utt);
  }

  // Expose so addMsg can call it
  window.VOICE_SPEAK = speakResponse;
})();
