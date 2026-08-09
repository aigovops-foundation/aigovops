/* ============================================================
   NCW AI Partnership Pledge — commitments + anonymous, local-only
   commitment.

   PRIVACY / CHILD-SAFETY (2026-07): This pledge is used by a
   general audience that includes minors. It therefore collects
   NO personal data: no name, no email, no role, no organization,
   no city. Nothing is sent to any server (there is no /api/sign
   call). The only thing stored is an anonymous "I committed" flag
   plus an OPTIONAL free-text note that the person keeps for
   themselves — it lives only in this browser's localStorage and is
   never transmitted. There is no signer count and no signer wall,
   so no fabricated ("baseline") numbers are shown as if real.
   ============================================================ */
(function () {
  "use strict";

  var COMMITMENTS = [
    {
      title: "AI is a partner, not a replacement.",
      body: "We never let AI be the final word on a student's learning, a worker's job, or a community member's well-being.",
      why: "Without a human in the loop, AI atrophies the very skills it's supposed to support.",
      evidence: 'MIT, June 2026: students who over-relied on AI to spot fake news had a <strong>15.3% decline</strong> in their ability to do it themselves after 4 weeks.',
      link: "https://www.theguardian.com/us-news/2026/jun/19/chatbots-critical-thinking-skills",
      linkLabel: "MIT / The Guardian, June 19 2026"
    },
    {
      title: "We use AI to expand opportunity, especially for those without it.",
      body: "Rural students. ELL students. Special-ed students. First-generation small-business owners. Native communities. AI that doesn't reach them isn't worth the electricity.",
      why: "AI tutoring shows the biggest gains for the learners who struggle most.",
      evidence: 'J-PAL evaluations and the 2025 npj Science of Learning systematic review find consistent, equity-positive gains for AI tutoring in K–12. Khan Academy reports a <strong>+23%</strong> mastery gain for students using Khanmigo 30+ min/week (ASU+GSV April 2026), plus <strong>+6.1%</strong> next-item correctness across A/B tests (June 2026).',
      link: "https://etcjournal.com/2026/06/02/ai-and-the-promise-of-educational-equity/",
      linkLabel: "npj Science of Learning systematic review, 2025"
    },
    {
      title: "We govern AI like we engineer it — with checklists, evidence, and reviews.",
      body: "Every district, every business, every nonprofit in NCW commits to a written, public AI use policy. Even if it's 5 sentences.",
      why: "Good governance is a one-page checklist a teacher actually uses, not a 200-page binder no one read.",
      evidence: 'The NIST AI Risk Management Framework is the methodology the US government uses for AI risk. The Foundation translates it — and 40+ global frameworks — into free, practical tools.',
      link: "https://www.nist.gov/itl/ai-risk-management-framework",
      linkLabel: "NIST AI Risk Management Framework"
    },
    {
      title: "We protect critical thinking, not just outcomes.",
      body: "If a tool makes our kids better at the test but worse at thinking, it fails. We measure both.",
      why: "Misuse is widespread, and bans aren't the answer — better assessment is.",
      evidence: 'Cornell, 95,000-student study, 2026: 1 in 3 college students regularly use GenAI for assignments; <strong>9% admit outright cheating</strong>. We need new assessments, not new bans.',
      link: "https://scientificinquirer.com/2026/05/26/widespread-ai-misuse-by-college-students-signals-need-to-rethink-assessment/",
      linkLabel: "Cornell, May 2026"
    },
    {
      title: "We disclose. Always.",
      body: "When AI helped write it, we say so. We teach our kids to do the same.",
      why: "Transparency is the foundation: people have a right to know when AI is grading, teaching, or answering them.",
      evidence: 'The draft AI Bill of Rights for Education is built on transparency — students, parents, and customers all have a right to know when AI is involved.',
      link: "https://resources.norrageducation.org/resource/822/sneak-preview-a-blueprint-for-an-ai-bill-of-rights-for-education",
      linkLabel: "AI Bill of Rights for Education (draft)"
    },
    {
      title: "We triangulate hard questions.",
      body: "No single AI gets to answer a question that matters. We use Model Councils, second opinions, and Deep Think for anything important.",
      why: "Three frontier models in parallel beat any single model on hard questions — and a human still decides.",
      evidence: "Perplexity's Model Council, Gemini 3 Deep Think, and the open-source AI Council Framework consistently outperform any single model on hard questions. This is table stakes now.",
      link: "https://github.com/focuslead/ai-council-framework",
      linkLabel: "AI Council Framework (open source)"
    },
    {
      title: "We keep the receipts.",
      body: "Prompts saved. Outputs saved. Edits saved. So a parent, a regulator, an auditor — or our own conscience — can verify our work.",
      why: '"We didn\'t keep records" is no longer a defense.',
      evidence: "Senators Blunt Rochester, Tuberville, and Kaine have requested a GAO investigation into AI in K-12 (June 5, 2026). The FTC's amended COPPA Rule (effective June 23, 2025; compliance deadline April 22, 2026) now treats biometrics as personal information. Both raise the bar for record-keeping.",
      link: "https://www.bluntrochester.senate.gov/news/press-releases/news-ranking-member-blunt-rochester-and-chair-tuberville-lead-investigation-into-ai-and-k-12-education/",
      linkLabel: "US Senate GAO investigation, June 2026"
    }
  ];

  /* ---- storage: localStorage when allowed, in-memory otherwise ----
     Stores ONLY an anonymous commitment flag + an optional private,
     never-transmitted note. No name/email/role/org/city, ever. */
  var LS_KEY = "ncw_pledge_commitment_v2";
  var memStore = {};
  var store = (function () {
    try {
      var k = "__ncw_test__";
      var ls = window.localStorage;
      ls.setItem(k, "1"); ls.removeItem(k);
      return ls;
    } catch (e) {
      return {
        getItem: function (k) { return k in memStore ? memStore[k] : null; },
        setItem: function (k, v) { memStore[k] = String(v); },
        removeItem: function (k) { delete memStore[k]; }
      };
    }
  })();

  /* ---- render commitments (the 7-point pledge) ---- */
  function renderCommitments() {
    var ol = document.getElementById("commitList");
    if (!ol) return;
    ol.innerHTML = COMMITMENTS.map(function (c, i) {
      return '<li class="group bg-white rounded-2xl border border-charcoal/10 p-6 sm:p-7 hover:shadow-md transition-shadow fade-in">' +
        '<div class="flex gap-5">' +
          '<div class="shrink-0 w-11 h-11 rounded-xl bg-orchard text-white font-serif font-700 text-xl grid place-items-center">' + (i + 1) + '</div>' +
          '<div class="min-w-0">' +
            '<h3 class="font-serif font-700 text-xl text-charcoal leading-snug">' + c.title + '</h3>' +
            '<p class="mt-2 text-charcoal/75 leading-relaxed">' + c.body + '</p>' +
            '<p class="mt-3 text-[14px] text-orchard-dark font-600 flex items-start gap-2"><span class="text-signal">&rarr;</span> Why this matters: <span class="font-500 text-charcoal/70">' + c.why + '</span></p>' +
            '<details class="mt-3"><summary class="inline-flex items-center gap-1.5 text-[13px] font-700 text-signal hover:text-signal-dark transition-colors">' +
              '<svg class="ev-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>See the evidence</summary>' +
              '<div class="mt-3 rounded-xl bg-cream p-4 text-[14px] text-charcoal/80 leading-relaxed">' + c.evidence +
                ' <a href="' + c.link + '" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex items-center gap-1 font-600 text-orchard hover:underline">' + c.linkLabel +
                ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17 17 7M9 7h8v8"/></svg></a>' +
              '</div></details>' +
          '</div></div></li>';
    }).join("");
  }

  /* ============================================================
     Where to park the page after someone commits.

     PRESENTATION ONLY. Everything below measures boxes and sets
     window.scrollY. It reads no field, stores nothing, and sends
     nothing — the anonymity guarantee above is untouched.

     The success card is 917-1129px tall on a phone against a 568-823px
     viewport, so no scroll position can show all of it. Two things must
     both hold wherever we stop:

       1. "Thank you for committing." is on screen. Otherwise a fresh
          signer gets no confirmation that anything happened at all.
       2. No action in the card (toolkit / sign-another / weekly-note /
          community) sits under the floating Jeeves launcher. That
          launcher is not ours to move: shared.js injects it from the
          Foundation site's jeeves-widget.js and every AiGovOps property
          shares it. It is position:fixed at right:20px/bottom:20px,
          46px tall, at z-index 2147483000 — so it permanently owns the
          bottom-right ~141x66px of the viewport and paints above this
          card. A thumb aiming at a covered CTA opens Jeeves instead.

     No single scrollIntoView() option satisfies both, because which
     element lands in the launcher's band is a function of
     cardHeight - viewportHeight, and that differs on every phone:

       block:"center"  (what we used to do) — satisfies (1) only on the
                       taller phones, and parks "Get the weekly note"
                       under the launcher on 360x640 (49x33px),
                       375x667 (42x32px) and 390x664 (34x22px).
       block:"end"     — satisfies (2) on every size, but scrolls the
                       confirmation off the top of the card entirely.
       block:"start"   — satisfies (1), but drops "Get the free toolkit"
                       into the band on 320x568 and the community link
                       on 412x823.

     So we solve for the position instead of guessing at it: start from
     "confirmation just below the top of the screen, showing as much of
     the card underneath it as will fit", then slide the page by the
     smallest amount that lifts every action clear of the launcher,
     staying inside the range that keeps the confirmation on screen.

     Desktop is deliberately left alone. Where the whole card fits on
     screen, centring it already shows the confirmation and all four
     actions at once, and the centred, narrow card never shares a column
     with the hard-right launcher — so that path still calls the same
     scrollIntoView({block:"center"}) it always did.
     ============================================================ */

  // Never land flush against the launcher — leave a thumb's worth of air.
  var LAUNCHER_MARGIN = 8;
  // How far below the top of the screen the confirmation should sit.
  var CONFIRM_TOP_GAP = 16;

  /* The launcher's live rect once the widget has loaded. If it hasn't
     (blocked, offline, or still in flight), fall back to the geometry it
     ships with, so a late arrival still finds a layout that clears it. */
  function launcherKeepOut() {
    var el = document.querySelector(".jv-btn");
    var r = el && el.getBoundingClientRect();
    if (!r || !r.width || !r.height) {
      r = { left: window.innerWidth - 141, right: window.innerWidth - 20,
            top: window.innerHeight - 66, bottom: window.innerHeight - 20 };
    }
    return { left: r.left - LAUNCHER_MARGIN, right: r.right + LAUNCHER_MARGIN,
             top: r.top - LAUNCHER_MARGIN, bottom: r.bottom + LAUNCHER_MARGIN };
  }

  /* For each action in the card, the span of document scrollTop values that
     would leave it sitting under the launcher. Actions that never share the
     launcher's column contribute nothing. */
  function blockedSpans(card) {
    var ko = launcherKeepOut();
    var sy = window.scrollY;
    var spans = [];
    Array.prototype.forEach.call(card.querySelectorAll("a[href], button"), function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      if (r.right <= ko.left || r.left >= ko.right) return;
      var top = sy + r.top;
      spans.push([top - ko.bottom, top + r.height - ko.top]);
    });
    return spans;
  }

  function clearsLauncher(spans, s) {
    return spans.every(function (b) { return s <= b[0] || s >= b[1]; });
  }

  /* What scrollIntoView({block:"center"}) will land on. Used only as a
     predicate — when it comes out clear we hand off to the real
     scrollIntoView, so desktop's resting position is unchanged to the
     pixel and a rounding error here can never move it. */
  function centredScrollTop(card) {
    var cs = getComputedStyle(document.documentElement);
    var pad = function (v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; };
    var top = pad(cs.scrollPaddingTop);
    var bottom = pad(cs.scrollPaddingBottom);
    var port = window.innerHeight - top - bottom;
    var r = card.getBoundingClientRect();
    return window.scrollY + r.top - top - (port - r.height) / 2;
  }

  /* Returns the document scrollTop to rest at, or null if the page cannot
     satisfy (1) at all — in which case the caller leaves scrolling alone. */
  function restingScrollTop(card, spans) {
    var vh = window.innerHeight;
    var sy = window.scrollY;
    var maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
    var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };

    // The card's first h3 is the "Thank you for committing." confirmation.
    var heading = card.querySelector("h3");
    if (!heading) return null;
    var hr = heading.getBoundingClientRect();
    var headTop = sy + hr.top;

    // Scroll positions that keep the whole confirmation inside the viewport.
    var lo = Math.max(0, Math.ceil(headTop + hr.height - vh));
    var hi = Math.min(maxScroll, Math.floor(headTop));
    if (hi < lo) return null;

    var want = clamp(headTop - CONFIRM_TOP_GAP, lo, hi);
    if (clearsLauncher(spans, want)) return want;

    // Otherwise the nearest scroll position on the edge of a blocked span
    // that clears every action and still shows the confirmation.
    var best = null;
    spans.forEach(function (b) {
      [Math.floor(b[0]), Math.ceil(b[1])].forEach(function (edge) {
        var s = clamp(edge, lo, hi);
        if (!clearsLauncher(spans, s)) return;
        if (best === null || Math.abs(s - want) < Math.abs(best - want)) best = s;
      });
    });
    return best === null ? want : best;
  }

  function settleOnSuccess(card) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var behavior = reduce ? "auto" : "smooth";
    var spans = blockedSpans(card);

    // Desktop, and any viewport tall enough to hold the whole card: keep
    // centring it, exactly as before.
    if (card.offsetHeight <= window.innerHeight &&
        clearsLauncher(spans, centredScrollTop(card))) {
      card.scrollIntoView({ behavior: behavior, block: "center" });
      return;
    }

    var top = restingScrollTop(card, spans);
    if (top === null) { card.scrollIntoView({ behavior: behavior, block: "start" }); return; }
    window.scrollTo({ top: top, behavior: behavior });
  }

  /* ---- anonymous, local-only commitment ---- */
  function initForm() {
    var form = document.getElementById("pledgeForm");
    var success = document.getElementById("successCard");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var noteEl = document.getElementById("f-action");
      // Anonymous record. No PII is read from the page and nothing is
      // sent anywhere — the optional note stays only in this browser.
      var record = {
        committed: true,
        committedAt: new Date().toISOString(),
        note: noteEl ? noteEl.value.trim() : ""
      };
      try { store.setItem(LS_KEY, JSON.stringify(record)); } catch (_) {}
      form.classList.add("hidden");
      if (success) {
        success.classList.remove("hidden");
        settleOnSuccess(success);
      }
      form.reset();
    });
    var another = document.getElementById("signAnother");
    if (another) another.addEventListener("click", function () {
      if (success) success.classList.add("hidden");
      form.classList.remove("hidden");
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function init() {
    renderCommitments();
    initForm();
    // fade for dynamically-added commitments
    if (window.IntersectionObserver) {
      var obs = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("shown"); obs.unobserve(e.target); } }); }, { threshold: 0.1 });
      document.querySelectorAll("#commitList .fade-in").forEach(function (el) { obs.observe(el); });
    } else {
      document.querySelectorAll("#commitList .fade-in").forEach(function (el) { el.classList.add("shown"); });
    }
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
