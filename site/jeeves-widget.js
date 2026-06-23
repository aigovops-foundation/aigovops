/* Jeeves — the governed AiGovOps assistant, present on every page: ready and waiting, never in your
 * face. A calm corner launcher opens a small panel with two views:
 *   • Help — Jeeves greets and shows the propose -> approve gate inline.
 *   • Map  — the whole estate: every site + sub-site, with where-you-are highlighted.
 * One line on any site:
 *   <script src="https://www.aigovops-foundation.com/jeeves-widget.js" data-jeeves-site="foundation" defer></script>
 * Self-contained, no deps, scoped .jv-* styles. data-jeeves-site sets context + highlights the map.
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

  var css = ''
    + '.jv-btn{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:8px;'
    + 'background:#0c1430;color:#fff;border:none;border-radius:30px;padding:11px 16px 11px 12px;min-height:46px;cursor:pointer;opacity:.92;'
    + 'font:600 13.5px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 5px 18px rgba(8,20,15,.22);transition:opacity .15s,transform .15s}'
    + '.jv-btn:hover{opacity:1;transform:translateY(-1px)} .jv-btn .jv-dot{width:7px;height:7px;border-radius:50%;background:#1d9e75;opacity:.9}'
    + '.jv-panel{position:fixed;right:20px;bottom:78px;z-index:2147483000;width:344px;max-width:calc(100vw - 40px);background:#fff;border-radius:16px;'
    + 'box-shadow:0 14px 50px rgba(8,20,15,.30);overflow:hidden;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1a3046;'
    + 'opacity:0;transform:translateY(10px) scale(.98);transform-origin:bottom right;transition:.16s;pointer-events:none}'
    + '.jv-panel.jv-open{opacity:1;transform:none;pointer-events:auto}'
    + '.jv-head{background:linear-gradient(135deg,#0c1430,#0a2318 78%);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:11px}'
    + '.jv-head b{font-size:15px;font-weight:600;display:block} .jv-head span{font-size:11.5px;color:#8fd3ba}'
    + '.jv-x{margin-left:auto;background:none;border:none;color:#9fc3b6;font-size:22px;cursor:pointer;line-height:1;min-width:44px;min-height:44px;display:grid;place-items:center}'
    + '.jv-tabs{display:flex;border-bottom:1px solid #e4ebe8}'
    + '.jv-tab{flex:1;border:none;background:none;padding:11px;min-height:44px;font:600 13px inherit;color:#5e6f69;cursor:pointer;border-bottom:2px solid transparent}'
    + '.jv-tab.on{color:#0f6e56;border-bottom-color:#0f6e56}'
    + '.jv-body{padding:15px 16px;max-height:60vh;overflow:auto}'
    + '.jv-msg{background:#f1f6f4;border-radius:12px;border-top-left-radius:3px;padding:10px 12px;margin:0 0 10px;font-size:13.5px;color:#243b30}'
    + '.jv-msg b{color:#0f6e56}'
    + '.jv-act{border:1px solid #e4ebe8;border-radius:12px;padding:11px 13px;margin:0 0 10px;background:#fff}'
    + '.jv-act .jv-prop{font-size:13.5px;color:#1a3046;margin:0 0 9px} .jv-act .jv-prop em{color:#0f6e56;font-style:normal;font-weight:600}'
    + '.jv-row{display:flex;gap:8px} .jv-b{flex:1;border:1px solid #d7e3dd;border-radius:9px;padding:12px 10px;min-height:44px;font:600 13px/1 inherit;cursor:pointer;background:#fff;color:#1a3046;transition:.12s}'
    + '.jv-b:hover{border-color:#0f6e56;color:#0f6e56} .jv-b.jv-yes{background:#0f6e56;border-color:#0f6e56;color:#fff} .jv-b.jv-yes:hover{background:#0b5743;color:#fff}'
    + '.jv-out{font-size:13px;border-radius:9px;padding:9px 11px;margin:9px 0 0;display:none} .jv-out.on{display:block}'
    + '.jv-out.ran{background:#e8f3ec;color:#0f7a45} .jv-out.held{background:#fbf0dd;color:#8a5a0d} .jv-out.stop{background:#fbe9ea;color:#a3242b}'
    + '.jv-site{border:1px solid #e4ebe8;border-radius:11px;padding:10px 12px;margin:0 0 9px} .jv-site.here{border-color:#0f6e56;background:#f1f6f4}'
    + '.jv-site h4{margin:0;font-size:13.5px;color:#0c1430;display:flex;align-items:center;gap:7px} .jv-site h4 small{font-weight:400;color:#7c867f;font-size:11px}'
    + '.jv-here-chip{font-size:10px;font-weight:700;color:#0f6e56;background:#e1f5ee;border-radius:6px;padding:2px 6px}'
    + '.jv-subs{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px} .jv-subs a{font-size:12px;color:#16304a;text-decoration:none;border:1px solid #e4ebe8;border-radius:20px;padding:5px 10px;min-height:30px;display:inline-flex;align-items:center}'
    + '.jv-subs a:hover{border-color:#0f6e56;color:#0f6e56}'
    + '.jv-foot{border-top:1px solid #eef1ef;padding:11px 16px;display:flex;gap:14px;font-size:12.5px}'
    + '.jv-foot a{color:#0f6e56;text-decoration:none;font-weight:600}'
    + '.jv-key{font-size:11.5px;color:#5b655e;padding:0 16px 13px;text-align:center}'
    + '.jv-view{display:none} .jv-view.on{display:block}'
    + '.jv-panel :focus-visible{outline:2px solid #0f6e56;outline-offset:2px}'
    + '@media (prefers-reduced-motion: reduce){.jv-panel{transition:none}}';

  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.className = "jv-btn"; btn.setAttribute("aria-label", "Jeeves — ask or open the map");
  btn.innerHTML = '<span class="jv-dot"></span>' + MARK + '<span>Jeeves</span>';
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
    + '<div class="jv-tabs"><button class="jv-tab on" data-v="help">Help</button><button class="jv-tab" data-v="map">The map</button></div>'
    + '<div class="jv-body">'
    + '<div class="jv-view on" id="jv-help">'
    + '<div class="jv-msg">Hi — I run the busywork across AiGovOps. <b>I propose; Ken or Bob hold the keys.</b> Here\'s how that works on ' + S.where + ':</div>'
    + '<div class="jv-act" id="jv-a1"><div class="jv-prop">I can <em>' + S.a + '</em>. It\'s reversible, so I can just do it.</div>'
    + '<div class="jv-row"><button class="jv-b jv-yes" data-s="1" data-v="approve">Approve</button><button class="jv-b" data-s="1" data-v="hold">Hold</button></div>'
    + '<div class="jv-out" id="jv-o1"></div></div>'
    + '<div class="jv-act" id="jv-a2" style="opacity:.45;pointer-events:none"><div class="jv-prop">Then I\'d <em>' + S.b + '</em> — that one can\'t be undone, so it waits for you.</div>'
    + '<div class="jv-row"><button class="jv-b jv-yes" data-s="2" data-v="approve">Approve</button><button class="jv-b" data-s="2" data-v="deny">Deny</button></div>'
    + '<div class="jv-out" id="jv-o2"></div></div>'
    + '</div>'
    + '<div class="jv-view" id="jv-map">' + mapHtml() + '</div>'
    + '</div>'
    + '<div class="jv-key">Green = I did it myself · amber = it waited for you. Nothing irreversible without a steward.</div>'
    + '<div class="jv-foot"><a href="' + F + '/jeeves-console.html" target="_blank" rel="noopener">▶ The console</a>'
    + '<a href="' + COM + '/" target="_blank" rel="noopener">Enter the live fleet ↗</a></div>';
  document.body.appendChild(panel);

  function toggle(open) { panel.classList.toggle("jv-open", open); btn.style.display = open ? "none" : "flex"; }
  btn.addEventListener("click", function () { toggle(true); });
  panel.querySelector(".jv-x").addEventListener("click", function () { toggle(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });

  // tabs
  [].forEach.call(panel.querySelectorAll(".jv-tab"), function (t) {
    t.addEventListener("click", function () {
      [].forEach.call(panel.querySelectorAll(".jv-tab"), function (x) { x.classList.toggle("on", x === t); });
      var v = t.getAttribute("data-v");
      panel.querySelector("#jv-help").classList.toggle("on", v === "help");
      panel.querySelector("#jv-map").classList.toggle("on", v === "map");
    });
  });

  // the propose -> approve demo (Help view)
  panel.addEventListener("click", function (e) {
    var b = e.target.closest(".jv-b"); if (!b) return;
    var step = b.getAttribute("data-s"), v = b.getAttribute("data-v");
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
