/**
 * schedule.js — AiGovOps Meeting Request Agent
 *
 * Flow:
 *  1. Ask: Ken, Bob, or Either?
 *  2. Ask: visitor name + email + topic
 *  3. Agent checks M365 free/busy for 3-5pm PST slots across next 5 weekdays
 *  4. Suggests slots that *might* be free (never exposes calendar details)
 *  5. Visitor picks a slot → mailto: request sent to chosen leader
 *
 * Slot windows (PST / UTC-7 or UTC-8):
 *   3:00–3:25  |  3:30–3:55  |  4:00–4:25  |  4:30–4:55
 */

const SCHEDULE = (() => {

  const LEADERS = {
    ken: { name: 'Ken Johnston', email: 'ken.johnston@aigovops.community' },
    bob: { name: 'Bob Rapp',     email: 'bob.rapp@aigovops.community'     },
  };

  // 25-min slots within 3–5pm window — UTC offset calculated at runtime
  const SLOT_OFFSETS = [
    { label: '3:00 – 3:25 PM',  hour: 15, min: 0  },
    { label: '3:30 – 3:55 PM',  hour: 15, min: 30 },
    { label: '4:00 – 4:25 PM',  hour: 16, min: 0  },
    { label: '4:30 – 4:55 PM',  hour: 16, min: 30 },
  ];

  // Detect current Pacific offset (PST = UTC-8, PDT = UTC-7)
  function getPacificLabel() {
    // Jan 15 is always PST, Jul 15 is always PDT
    const jan = new Date(new Date().getFullYear(), 0, 15);
    const jul = new Date(new Date().getFullYear(), 6, 15);
    const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    const now = new Date();
    const isDST = now.getTimezoneOffset() < stdOffset;
    // Pacific is UTC-8 standard, UTC-7 DST
    return isDST ? 'PDT (UTC−7)' : 'PST (UTC−8)';
  }

  function slotLabel(s) {
    return `${s.label} ${getPacificLabel()}`;
  }

  /* ── helpers ─────────────────────────────────────────────────────────── */

  function nextWeekdays(n = 5) {
    const days = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1); // start tomorrow
    while (days.length < n) {
      const dow = d.getDay();
      if (dow >= 1 && dow <= 5) days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  function fmtDay(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }

  // Build candidate slot objects for the next 5 weekdays
  function buildCandidates() {
    return nextWeekdays(5).flatMap(day =>
      SLOT_OFFSETS.map(s => ({
        day,
        dayLabel: fmtDay(day),
        slotLabel: slotLabel(s),
        hour: s.hour,
        min: s.min,
        id: `${day.toISOString().slice(0,10)}-${s.hour}-${s.min}`,
      }))
    );
  }

  /* ── M365 free/busy check via Anthropic agent ────────────────────────── */

  async function checkAvailability(leaderKey) {
    const leader = LEADERS[leaderKey];
    const candidates = buildCandidates();

    // Build a concise prompt — agent checks free/busy and returns JSON
    const slotsDesc = candidates.map(c =>
      `${c.dayLabel} ${c.slotLabel}`
    ).join('\n');

    const prompt = `You are a scheduling assistant for the AiGovOps Foundation.

Check the Microsoft 365 calendar for ${leader.name} (${leader.email}) and determine which of the following 25-minute slots are FREE (no conflicts):

${slotsDesc}

Rules:
- Only check the calendar for the email address above
- A slot is "free" only if there are NO events overlapping the entire 25-minute window
- Do NOT reveal any event titles, attendees, or details from the calendar
- Return ONLY a JSON array of free slot IDs (the date-hour-minute strings) like:
  ["2026-06-03-15-0","2026-06-04-15-30"]
- If you cannot check the calendar, return: {"error": "calendar_unavailable"}
- No explanation, no markdown, just the JSON.

Slot IDs to check:
${candidates.map(c => c.id).join('\n')}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a calendar availability checker. You have access to Microsoft 365 calendar data. Return only JSON.',
          messages: [{ role: 'user', content: prompt }],
          mcp_servers: [{
            type: 'url',
            url: 'https://microsoft365.mcp.claude.com/mcp',
            name: 'microsoft365',
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (parsed.error) return { freeIds: null, error: parsed.error };
      return { freeIds: new Set(parsed), candidates };
    } catch (e) {
      return { freeIds: null, error: 'calendar_unavailable' };
    }
  }

  /* ── UI renderer ─────────────────────────────────────────────────────── */

  function renderModal() {
    if (document.getElementById('schedModal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'schedModal';
    overlay.innerHTML = `
<div class="sched-overlay" id="schedOverlay">
  <div class="sched-box" role="dialog" aria-modal="true" aria-label="Schedule a Call">
    <button class="sched-close" id="schedClose" aria-label="Close">&times;</button>
    <div class="sched-inner" id="schedInner">
      <!-- steps rendered here -->
    </div>
  </div>
</div>`;
    document.body.appendChild(overlay);

    document.getElementById('schedClose').addEventListener('click', close);
    document.getElementById('schedOverlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) close();
    });
  }

  function close() {
    const m = document.getElementById('schedModal');
    if (m) m.remove();
  }

  function setInner(html) {
    document.getElementById('schedInner').innerHTML = html;
  }

  /* ── Step 1: pick leader ─────────────────────────────────────────────── */

  function stepPickLeader() {
    setInner(`
      <div class="sched-step">
        <div class="sched-icon">📆</div>
        <h2 class="sched-title">Schedule a Call with a Community Leader</h2>
        <p class="sched-sub">Who would you like to connect with?</p>
        <div class="sched-choices">
          <button class="sched-btn" data-leader="ken">
            <strong>Ken Johnston</strong>
            <span>AI strategy, governance, platform leadership</span>
          </button>
          <button class="sched-btn" data-leader="bob">
            <strong>Bob Rapp</strong>
            <span>Data science, AI ops, enterprise deployment</span>
          </button>
          <button class="sched-btn" data-leader="either">
            <strong>Either / No preference</strong>
            <span>We'll check who's available first</span>
          </button>
        </div>
      </div>`);

    document.querySelectorAll('.sched-btn[data-leader]').forEach(btn => {
      btn.addEventListener('click', () => stepContactInfo(btn.dataset.leader));
    });
  }

  /* ── Step 2: contact info ────────────────────────────────────────────── */

  function stepContactInfo(leaderKey) {
    const leaderLabel = leaderKey === 'either' ? 'Ken or Bob' : LEADERS[leaderKey].name;
    setInner(`
      <div class="sched-step">
        <div class="sched-icon">👤</div>
        <h2 class="sched-title">A little about you</h2>
        <p class="sched-sub">So ${leaderLabel} knows who's reaching out.</p>
        <div class="sched-form">
          <label>Your name <input id="sched-name" type="text" placeholder="Jane Smith" /></label>
          <label>Your email <input id="sched-email" type="email" placeholder="you@example.com" /></label>
          <label>Topic / what you'd like to discuss
            <textarea id="sched-topic" rows="3" placeholder="e.g. AI governance framework, open source collaboration…"></textarea>
          </label>
          <button class="sched-primary" id="sched-next-2">Check availability →</button>
        </div>
      </div>`);

    document.getElementById('sched-next-2').addEventListener('click', () => {
      const name  = document.getElementById('sched-name').value.trim();
      const email = document.getElementById('sched-email').value.trim();
      const topic = document.getElementById('sched-topic').value.trim();
      if (!name || !email) {
        alert('Please enter your name and email.');
        return;
      }
      stepCheckAvailability(leaderKey, { name, email, topic });
    });
  }

  /* ── Step 3: checking ────────────────────────────────────────────────── */

  async function stepCheckAvailability(leaderKey, visitor) {
    setInner(`
      <div class="sched-step sched-checking">
        <div class="sched-spinner"></div>
        <h2 class="sched-title">Checking availability…</h2>
        <p class="sched-sub">Peeking at the calendar — won't take long.</p>
      </div>`);

    const leaders = leaderKey === 'either' ? ['ken', 'bob'] : [leaderKey];
    const results = await Promise.all(leaders.map(k => checkAvailability(k)));

    // Merge: find slots free for at least one leader
    const candidates = results[0].candidates || buildCandidates();
    const freeSlots = [];

    candidates.forEach(c => {
      const freeFor = [];
      leaders.forEach((k, i) => {
        const r = results[i];
        if (r.freeIds && r.freeIds.has(c.id)) freeFor.push(k);
      });
      if (freeFor.length > 0) freeSlots.push({ ...c, freeFor });
    });

    stepShowSlots(leaderKey, visitor, freeSlots, candidates, results);
  }

  /* ── Step 4: show suggested slots ───────────────────────────────────── */

  function stepShowSlots(leaderKey, visitor, freeSlots, candidates, results) {
    const calUnavailable = results.every(r => r.error === 'calendar_unavailable');
    const leaders = leaderKey === 'either' ? ['ken', 'bob'] : [leaderKey];

    // If calendar unavailable, fall back to suggesting default slots as "might be free"
    const displaySlots = (freeSlots.length > 0 || calUnavailable)
      ? (freeSlots.length > 0 ? freeSlots.slice(0, 6) : candidates.slice(0, 6).map(c => ({ ...c, freeFor: leaders, tentative: true })))
      : [];

    if (displaySlots.length === 0) {
      setInner(`
        <div class="sched-step">
          <div class="sched-icon">😔</div>
          <h2 class="sched-title">No slots available this week</h2>
          <p class="sched-sub">It looks like all the 3–5 PM windows are taken for the next 5 weekdays. You can still send a direct request and they'll suggest a time.</p>
          <button class="sched-primary" id="sched-direct">Send a direct request →</button>
          <button class="sched-secondary" id="sched-back">← Go back</button>
        </div>`);
      document.getElementById('sched-direct').addEventListener('click', () => stepConfirm(leaderKey, visitor, null, results));
      document.getElementById('sched-back').addEventListener('click', () => stepPickLeader());
      return;
    }

    const slotsHtml = displaySlots.map((s, i) => {
      const who = s.freeFor.map(k => LEADERS[k].name.split(' ')[0]).join(' & ');
      const tentativeNote = (calUnavailable || s.tentative)
        ? `<span class="sched-slot-note">📌 might be free — we'll confirm</span>`
        : `<span class="sched-slot-note sched-slot-free">✓ looks free for ${who}</span>`;
      return `<button class="sched-slot" data-idx="${i}">
        <span class="sched-slot-day">${s.dayLabel}</span>
        <span class="sched-slot-time">${s.slotLabel}</span>
        ${tentativeNote}
      </button>`;
    }).join('');

    const headline = calUnavailable
      ? 'These times <em>might</em> work'
      : 'These slots look promising';
    const subtext = calUnavailable
      ? "We couldn't confirm the calendar right now, but these are the usual open windows. We'll verify and confirm with you."
      : "Based on the calendar, these windows look open. Pick one and we'll send a request — they'll confirm shortly.";

    setInner(`
      <div class="sched-step">
        <div class="sched-icon">🗓️</div>
        <h2 class="sched-title">${headline}</h2>
        <p class="sched-sub">${subtext}</p>
        <div class="sched-slots">${slotsHtml}</div>
        <button class="sched-secondary" id="sched-back">← Different person</button>
      </div>`);

    document.querySelectorAll('.sched-slot').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = displaySlots[+btn.dataset.idx];
        stepConfirm(leaderKey, visitor, slot, results);
      });
    });
    document.getElementById('sched-back').addEventListener('click', () => stepPickLeader());
  }

  /* ── Step 5: confirm & send ──────────────────────────────────────────── */

  function stepConfirm(leaderKey, visitor, slot, results) {
    // Pick the best leader: prefer the one that's free, else default to ken for either
    let chosenKey = leaderKey === 'either' ? 'ken' : leaderKey;
    if (slot && slot.freeFor && !slot.freeFor.includes(chosenKey)) {
      chosenKey = slot.freeFor[0];
    }
    const leader = LEADERS[chosenKey];
    const slotText = slot ? `${slot.dayLabel} at ${slot.slotLabel}` : 'a mutually convenient time';

    const subject = encodeURIComponent(`Meeting Request: ${visitor.topic || 'AiGovOps Foundation'}`);
    const body = encodeURIComponent(
`Hi ${leader.name.split(' ')[0]},

I'd love to schedule a 25-minute call with you through the AiGovOps Foundation.

Requested time: ${slotText}
Topic: ${visitor.topic || '(see below)'}

My details:
  Name:  ${visitor.name}
  Email: ${visitor.email}

Please confirm or suggest an alternative time. I look forward to connecting!

Best,
${visitor.name}`);

    const mailto = `mailto:${leader.email}?subject=${subject}&body=${body}`;

    setInner(`
      <div class="sched-step">
        <div class="sched-icon">✅</div>
        <h2 class="sched-title">Ready to send your request</h2>
        <div class="sched-summary">
          <div class="sched-summary-row"><span>To</span><strong>${leader.name}</strong></div>
          <div class="sched-summary-row"><span>Time</span><strong>${slotText}</strong></div>
          <div class="sched-summary-row"><span>Topic</span><strong>${visitor.topic || '—'}</strong></div>
          <div class="sched-summary-row"><span>Your email</span><strong>${visitor.email}</strong></div>
        </div>
        <p class="sched-sub">Clicking below opens your email client with everything pre-filled. ${leader.name.split(' ')[0]} will confirm the time shortly.</p>
        <a class="sched-primary" href="${mailto}" id="sched-send">📧 Open email to send request →</a>
        <button class="sched-secondary" id="sched-back">← Pick a different slot</button>
      </div>`);

    document.getElementById('sched-back').addEventListener('click', () => stepPickLeader());
  }

  /* ── public open() ───────────────────────────────────────────────────── */

  function open() {
    renderModal();
    stepPickLeader();
  }

  return { open, close };

})();

// Expose globally for hero card button + chatbot
window.SCHEDULE = SCHEDULE;
