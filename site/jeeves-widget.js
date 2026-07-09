/* Jeeves — the governed AiGovOps assistant, present on every page. A calm corner launcher
 * opens a quarter-screen chatbot panel with three views:
 *   • Help — Jeeves greets and shows the propose -> approve gate inline.
 *   • Tour — the guided video tour, embedded and deep-linked to THIS property; fully opt-in
 *            (pick "these pages" or "the whole estate"). It never auto-opens or auto-plays.
 *   • Map  — the whole estate: every site + sub-site, with where-you-are highlighted.
 * One line on any site:
 *   <script src="https://www.aigovops-foundation.com/jeeves-widget.js" data-jeeves-site="foundation" defer></script>
 * Self-contained, no deps, scoped .jv-* styles. data-jeeves-site sets context + the tour chapter.
 */
(function () {
  "use strict";
  if (window.__jeevesLoaded) return; window.__jeevesLoaded = true;
  var script = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var SITE = (script && script.getAttribute("data-jeeves-site")) || window.JEEVES_SITE || "this site";

  var SCENES = {
    foundation:  { where: "the AiGovOps Foundation site", a: "draft a short post on OVERT 1.0", b: "publish it to the blog" },
    library:     { where: "the AiGovOps library", a: "draft a PR to update the agents page", b: "merge it to main" },
    learning:    { where: "the NCW AI camp", a: "draft this term's classroom AI guidelines", b: "email the teachers" },
    community:   { where: "the community", a: "draft this week's digest", b: "post it to the feed" },
    "this site": { where: "AiGovOps", a: "draft an update", b: "publish it" }
  };
  var S = SCENES[SITE] || SCENES["this site"];

  // The whole estate — every site + its key sub-sites. Absolute URLs so links work cross-site.
  var F = "https://www.aigovops-foundation.com";
  var LIB = "https://aigovops-foundation.github.io/aigovops-library-june-ken-bob";
  var NCW = "https://aigovops-foundation.github.io/aigovops-ncw-ai-camp";
  var COM = "https://community.aigovops-foundation.com";
  var TOUR = LIB + "/onboarding.html";           // the guided video tour
  var IDLE_MS = 10000;                            // auto-offer the tour after 10s of no interaction
  var SITES = [
    { key: "foundation", name: "Foundation", tag: "the public hub", subs: [
      ["Home", F + "/"], ["Ecosystem", F + "/ecosystem.html"], ["Frameworks", F + "/frameworks.html"],
      ["The tools", F + "/alpha.html"], ["Writing", F + "/blog.html"], ["The console", F + "/jeeves-console.html"]] },
    { key: "library", name: "The Library", tag: "the governed core", subs: [
      ["Home", LIB + "/index.html"], ["Blueprint", LIB + "/blueprint.html"], ["Control plane", LIB + "/control-plane.html"],
      ["Walk the rooms", LIB + "/rooms.html"], ["The gates", LIB + "/gates.html"], ["Guided tour", LIB + "/tour.html"]] },
    { key: "learning", name: "NCW Learning", tag: "the on-ramp", subs: [
      ["Home", NCW + "/index.html"], ["Resources", NCW + "/resources.html"], ["Courses", NCW + "/courses.html"]] },
    { key: "community", name: "Community", tag: "the garden", subs: [
      ["The garden", COM + "/portal.html"], ["Ask Jeeves", COM + "/concierge.html"], ["Your console", COM + "/console.html"],
      ["System map", COM + "/system-map.html"]] }
  ];

  var MARK = '<svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#0c1430"/><circle cx="16" cy="16" r="15" fill="none" stroke="#1d9e75" stroke-width="1.4"/><path d="M11 21 L16 9 L21 21 Z" fill="#0f6e56"/><circle cx="22" cy="9" r="2.4" fill="#5dcaa5"/></svg>';

  // One palette, scoped to the widget — Jeeves looks identical on every site (no host tokens inherited).
  var css = ''
    + ':root{--jv-teal:#0f6e56;--jv-teal-d:#0b5743;--jv-navy:#0c1430;--jv-mint:#1d9e75;'
    + '--jv-ink:#1a3046;--jv-line:#e4ebe8;--jv-mut:#5b655e;--jv-wash:#f1f6f4}'
    + '.jv-btn{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:8px;'
    + 'background:var(--jv-navy);color:#fff;border:none;border-radius:30px;padding:11px 16px 11px 12px;min-height:46px;cursor:pointer;opacity:.94;'
    + 'font:600 13.5px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 5px 18px rgba(8,20,15,.22);transition:opacity .15s,transform .15s}'
    + '.jv-btn:hover{opacity:1;transform:translateY(-1px)} .jv-btn .jv-play{color:var(--jv-mint);font-size:12px}'
    // quarter-screen panel, bottom-right, as a flex column
    + '.jv-panel{position:fixed;right:20px;bottom:78px;z-index:2147483000;width:clamp(340px,34vw,460px);height:clamp(440px,58vh,620px);'
    + 'max-width:calc(100vw - 40px);max-height:calc(100vh - 96px);background:#fff;border-radius:16px;display:flex;flex-direction:column;'
    + 'box-shadow:0 14px 50px rgba(8,20,15,.30);overflow:hidden;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--jv-ink);'
    + 'opacity:0;transform:translateY(10px) scale(.98);transform-origin:bottom right;transition:.16s;pointer-events:none}'
    + '.jv-panel.jv-open{opacity:1;transform:none;pointer-events:auto}'
    + '.jv-head{background:linear-gradient(135deg,var(--jv-navy),#0a2318 78%);color:#fff;padding:13px 16px;display:flex;align-items:center;gap:11px;flex:none}'
    + '.jv-head b{font-size:15px;font-weight:600;display:block} .jv-head span{font-size:11.5px;color:#8fd3ba}'
    + '.jv-x{margin-left:auto;background:none;border:none;color:#9fc3b6;font-size:22px;cursor:pointer;line-height:1;min-width:44px;min-height:44px;display:grid;place-items:center}'
    + '.jv-tabs{display:flex;border-bottom:1px solid var(--jv-line);flex:none}'
    + '.jv-tab{flex:1;border:none;background:none;padding:11px;min-height:44px;font:600 13px inherit;color:#5e6f69;cursor:pointer;border-bottom:2px solid transparent}'
    + '.jv-tab.on{color:var(--jv-teal);border-bottom-color:var(--jv-teal)} .jv-tab .jv-play{color:#06875e}'  // WCAG AA: mint (#1d9e75) is 3.39:1 on the white panel; #06875e passes 4.5:1 (launcher keeps mint — it sits on navy, 4.9:1)
    + '.jv-body{flex:1;min-height:0;position:relative;display:flex}'
    + '.jv-view{display:none;width:100%;overflow:auto;padding:15px 16px}'
    + '.jv-view.on{display:block}'
    + '.jv-view#jv-tour.on{display:flex;flex-direction:column;padding:0;overflow:hidden}'
    + '.jv-frame{flex:1;width:100%;border:0;background:#03100f;min-height:0}'
    + '.jv-offer{padding:12px 14px;background:var(--jv-wash);border-bottom:1px solid var(--jv-line)}'
    + '.jv-offer p{margin:0 0 9px;font-size:13px;color:#243b30} .jv-offer p b{color:var(--jv-teal)}'
    + '.jv-offer .jv-row{display:flex;gap:7px;flex-wrap:wrap}'
    + '.jv-cta{display:block;width:100%;margin:0 0 10px;border:none;border-radius:10px;background:var(--jv-teal);color:#fff;padding:12px;min-height:46px;font:700 13.5px inherit;cursor:pointer;text-align:center}'
    + '.jv-cta:hover{background:var(--jv-teal-d)}'
    + '.jv-msg{background:var(--jv-wash);border-radius:12px;border-top-left-radius:3px;padding:10px 12px;margin:0 0 10px;font-size:13.5px;color:#243b30}'
    + '.jv-msg b{color:var(--jv-teal)}'
    + '.jv-act{border:1px solid var(--jv-line);border-radius:12px;padding:11px 13px;margin:0 0 10px;background:#fff}'
    + '.jv-act .jv-prop{font-size:13.5px;color:var(--jv-ink);margin:0 0 9px} .jv-act .jv-prop em{color:var(--jv-teal);font-style:normal;font-weight:600}'
    + '.jv-row{display:flex;gap:8px} .jv-b{flex:1;border:1px solid #d7e3dd;border-radius:9px;padding:12px 10px;min-height:44px;font:600 13px/1 inherit;cursor:pointer;background:#fff;color:var(--jv-ink);transition:.12s}'
    + '.jv-b:hover{border-color:var(--jv-teal);color:var(--jv-teal)} .jv-b.jv-yes{background:var(--jv-teal);border-color:var(--jv-teal);color:#fff} .jv-b.jv-yes:hover{background:var(--jv-teal-d);color:#fff}'
    + '.jv-b.jv-ghost{flex:none;color:var(--jv-mut)}'
    + '.jv-out{font-size:13px;border-radius:9px;padding:9px 11px;margin:9px 0 0;display:none} .jv-out.on{display:block}'
    + '.jv-out.ran{background:#e8f3ec;color:#0f7a45} .jv-out.held{background:#fbf0dd;color:#8a5a0d} .jv-out.stop{background:#fbe9ea;color:#a3242b}'
    + '.jv-site{border:1px solid var(--jv-line);border-radius:11px;padding:10px 12px;margin:0 0 9px} .jv-site.here{border-color:var(--jv-teal);background:var(--jv-wash)}'
    + '.jv-site h4{margin:0;font-size:13.5px;color:var(--jv-navy);display:flex;align-items:center;gap:7px} .jv-site h4 small{font-weight:400;color:#7c867f;font-size:11px}'
    + '.jv-here-chip{font-size:10px;font-weight:700;color:var(--jv-teal);background:#e1f5ee;border-radius:6px;padding:2px 6px}'
    + '.jv-subs{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px} .jv-subs a{font-size:12px;color:#16304a;text-decoration:none;border:1px solid var(--jv-line);border-radius:20px;padding:5px 10px;min-height:30px;display:inline-flex;align-items:center}'
    + '.jv-subs a:hover{border-color:var(--jv-teal);color:var(--jv-teal)}'
    + '.jv-foot{border-top:1px solid #eef1ef;padding:10px 16px;display:flex;gap:14px;font-size:12.5px;flex:none}'
    + '.jv-foot a{color:var(--jv-teal);text-decoration:none;font-weight:600}'
    + '.jv-panel.jv-tourmode .jv-foot{display:none}'
    + '.jv-panel :focus-visible{outline:2px solid var(--jv-teal);outline-offset:2px}'
    + '@media (prefers-reduced-motion: reduce){.jv-panel,.jv-btn{transition:none}}'
    // Phones: keep it a contained bottom-right card (margins both sides via the clamp) and cap the
    // height so a clear band of the page always shows above — never a full-screen takeover.
    + '@media (max-width:560px){.jv-panel{max-height:56vh;bottom:72px}}';

  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.className = "jv-btn"; btn.setAttribute("aria-label", "Jeeves — ask, watch the tour, or open the map");
  btn.innerHTML = MARK + '<span>Jeeves</span><span class="jv-play">▶</span>';
  document.body.appendChild(btn);

  function mapHtml() {
    var rows = SITES.map(function (s) {
      var here = s.key === SITE;
      var subs = s.subs.map(function (x) { return '<a href="' + x[1] + '">' + x[0] + '</a>'; }).join("");
      return '<div class="jv-site' + (here ? ' here' : '') + '"><h4>' + s.name
        + (here ? ' <span class="jv-here-chip">you are here</span>' : '')
        + ' <small>' + s.tag + '</small></h4><div class="jv-subs">' + subs + '</div></div>';
    }).join("");
    return '<div class="jv-msg">The whole estate — everywhere you can go. <b>You\'re on ' + S.where + '.</b></div>' + rows;
  }

  var panel = document.createElement("div");
  panel.className = "jv-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "Jeeves assistant");
  panel.innerHTML =
    '<div class="jv-head">' + MARK + '<div><b>Jeeves</b><span>ready when you are</span></div><button class="jv-x" aria-label="Close">&times;</button></div>'
    + '<div class="jv-tabs">'
    + '<button class="jv-tab on" data-v="help">Help</button>'
    + '<button class="jv-tab" data-v="tour"><span class="jv-play">▶</span> Tour</button>'
    + '<button class="jv-tab" data-v="map">The map</button></div>'
    + '<div class="jv-body">'
    + '<div class="jv-view on" id="jv-help">'
    + '<button class="jv-cta" data-open-tour="section">▶ Watch the guided tour</button>'
    + '<div class="jv-msg">Hi — I run the busywork across AiGovOps. <b>I propose; Ken or Bob hold the keys.</b> Here\'s how that works on ' + S.where + ':</div>'
    + '<div class="jv-act" id="jv-a1"><div class="jv-prop">I can <em>' + S.a + '</em>. It\'s reversible, so I can just do it.</div>'
    + '<div class="jv-row"><button class="jv-b jv-yes" data-s="1" data-v="approve">Approve</button><button class="jv-b" data-s="1" data-v="hold">Hold</button></div>'
    + '<div class="jv-out" id="jv-o1"></div></div>'
    + '<div class="jv-act" id="jv-a2" style="opacity:.45;pointer-events:none"><div class="jv-prop">Then I\'d <em>' + S.b + '</em> — that one can\'t be undone, so it waits for you.</div>'
    + '<div class="jv-row"><button class="jv-b jv-yes" data-s="2" data-v="approve">Approve</button><button class="jv-b" data-s="2" data-v="deny">Deny</button></div>'
    + '<div class="jv-out" id="jv-o2"></div></div>'
    + '</div>'
    + '<div class="jv-view" id="jv-tour">'
    + '<div class="jv-offer" id="jv-offer"><p id="jv-offer-msg"><b>Want a quick guided tour?</b></p>'
    + '<div class="jv-row"><button class="jv-b jv-yes" data-tour="section">▶ These pages</button>'
    + '<button class="jv-b" data-tour="estate">▶ The whole estate</button>'
    + '<button class="jv-b jv-ghost" data-tour="stop">Stop</button></div></div>'
    + '<iframe class="jv-frame" id="jv-frame" title="AiGovOps guided tour" allow="autoplay" loading="lazy"></iframe>'
    + '</div>'
    + '<div class="jv-view" id="jv-map">' + mapHtml() + '</div>'
    + '</div>'
    + '<div class="jv-foot"><a href="' + F + '/jeeves-console.html" target="_blank" rel="noopener">▶ The console</a>'
    + '<a href="' + COM + '/" target="_blank" rel="noopener">Enter the live fleet ↗</a></div>';
  document.body.appendChild(panel);

  var frame = panel.querySelector("#jv-frame");
  var offer = panel.querySelector("#jv-offer");
  var startAlias = encodeURIComponent(String(SITE).replace(/\s+/g, "-"));
  function tourUrl(scope, play) {
    var q = scope === "section" ? "start=" + startAlias : "";
    if (play) q += (q ? "&" : "") + "play=1";
    return TOUR + (q ? "?" + q : "");
  }
  // Load the tour into the panel iframe. autoplay only when triggered by a user gesture
  // (browsers block audio autoplay otherwise) — so the idle offer loads, and play starts on choice.
  var loadedScope = null;
  function loadTour(scope, play) {
    var src = tourUrl(scope, play);
    if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
    loadedScope = scope;
  }

  // ── show a view ───────────────────────────────────────────────────────────
  function showView(v) {
    [].forEach.call(panel.querySelectorAll(".jv-tab"), function (x) { x.classList.toggle("on", x.getAttribute("data-v") === v); });
    panel.querySelector("#jv-help").classList.toggle("on", v === "help");
    panel.querySelector("#jv-tour").classList.toggle("on", v === "tour");
    panel.querySelector("#jv-map").classList.toggle("on", v === "map");
    panel.classList.toggle("jv-tourmode", v === "tour");
    if (v === "tour" && loadedScope === null) loadTour("section", false); // queued, not autoplaying
  }
  function toggle(open) { panel.classList.toggle("jv-open", open); btn.style.display = open ? "none" : "flex"; }

  btn.addEventListener("click", function () { toggle(true); });
  panel.querySelector(".jv-x").addEventListener("click", function () { toggle(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
  [].forEach.call(panel.querySelectorAll(".jv-tab"), function (t) {
    t.addEventListener("click", function () {
      var v = t.getAttribute("data-v");
      // Entering the Tour tab shows the choice ("these pages / the whole estate") and does NOT autoplay —
      // peeking at Tour shouldn't blast narration. Sound starts only when the user PICKS a tour below,
      // or via the explicit "Watch the guided tour" CTA in Help.
      if (v === "tour") { offer.hidden = false; }
      showView(v);
    });
  });
  // "Watch the guided tour" CTA in Help → jump to the tour tab and play
  panel.querySelector("[data-open-tour]").addEventListener("click", function () {
    loadTour("section", true); offer.hidden = true; showView("tour");
  });

  // ── the 10s-idle auto-offer ────────────────────────────────────────────────
  var STOP_KEY = "jv-tour-stopped";
  var offered = false, idleTimer;
  function stopped() { try { return localStorage.getItem(STOP_KEY) === "1"; } catch (e) { return false; } }
  function armIdle() {
    // Auto-offer DISABLED: Jeeves stays a quiet collapsed bubble in the corner and never pops itself
    // open — the page gets to be a page first. The tour is fully opt-in: open the bubble and pick Tour
    // (or the "Watch the guided tour" CTA in Help). Kept as a no-op so the interaction listeners below
    // don't error.
  }
  function autoOffer() {
    if (offered || stopped()) return;
    offered = true;
    loadTour("section", false);     // queue this section; play on the user's choice
    offer.hidden = false;
    showView("tour"); toggle(true);
  }
  // any genuine interaction resets the "pause" timer; once offered, we stop watching
  ["mousemove", "mousedown", "keydown", "scroll", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, function () { if (!offered) armIdle(); }, { passive: true });
  });
  armIdle();

  // offer buttons: this section / whole estate / stop
  [].forEach.call(panel.querySelectorAll("[data-tour]"), function (b) {
    b.addEventListener("click", function () {
      var choice = b.getAttribute("data-tour");
      if (choice === "stop") { try { localStorage.setItem(STOP_KEY, "1"); } catch (e) {} toggle(false); return; }
      loadTour(choice, true);       // section | estate, with sound (this click is the gesture)
      offer.hidden = true;
    });
  });

  // delight signal — preflight-free (text/plain) cross-origin POST to the community ledger; fire-and-forget
  // feedback lives in Help; keep it lightweight
  panel.addEventListener("click", function (e) {
    var fb = e.target.closest("[data-fb]"); if (!fb) return;
    try {
      fetch(COM + "/api/feedback", { method: "POST", headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ topic: "site:" + SITE, value: fb.getAttribute("data-fb") }) });
    } catch (e2) {}
  });

  // the propose -> approve demo (Help view)
  panel.addEventListener("click", function (e) {
    var b = e.target.closest(".jv-b"); if (!b || b.hasAttribute("data-tour")) return;
    var step = b.getAttribute("data-s"); if (!step) return;
    var v = b.getAttribute("data-v");
    var out = document.getElementById("jv-o" + step);
    var row = b.parentNode; [].forEach.call(row.children, function (x) { x.style.opacity = ".5"; x.disabled = true; });
    if (step === "1") {
      if (v === "approve") { out.className = "jv-out on ran"; out.innerHTML = "&#10003; Drafted, and signed into the ledger. Reversible work just runs — no waiting on you."; }
      else { out.className = "jv-out on held"; out.innerHTML = "Held. Even the reversible bits only move when you say so."; }
      var a2 = document.getElementById("jv-a2"); a2.style.opacity = "1"; a2.style.pointerEvents = "auto";
    } else {
      if (v === "approve") { out.className = "jv-out on ran"; out.innerHTML = "&#10003; Done &mdash; and notice: this one <b>needed your yes</b>. Anything irreversible always waits for a steward."; }
      else { out.className = "jv-out on stop"; out.innerHTML = "&#10007; Held &mdash; it never runs. You hold the keys. That\'s the whole point."; }
    }
  });
})();
