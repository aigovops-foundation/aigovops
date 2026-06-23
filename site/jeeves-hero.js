/* Jeeves agent-first hero — the consistent "what do you need?" entry for every AiGovOps site.
 * One line on a homepage:
 *   <div id="jeeves-hero"></div>
 *   <script src="https://www.aigovops-foundation.com/jeeves-hero.js" data-jeeves-site="foundation" defer></script>
 * Renders into #jeeves-hero (or prepends to <body>). Self-contained, scoped .jh-*, per-site chips.
 * Jeeves leads: suggests a few workflows and DRIVES them — reversible runs, irreversible waits for you.
 */
(function () {
  "use strict";
  if (window.__jeevesHero) return; window.__jeevesHero = true;
  var script = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var SITE = (script && script.getAttribute("data-jeeves-site")) || window.JEEVES_SITE || "foundation";

  // step = [label, reversible?]  — reversible runs on its own; irreversible waits for a steward.
  var SCENES = {
    foundation: { hi: "Hi, I'm Jeeves.", sub: "I run the busywork across AiGovOps. Tell me what you need — I'll suggest a path and do it. Anything that can't be undone waits for your yes.", chips: [
      { q: "Draft a post on OVERT 1.0", steps: [["draft the post", true], ["publish it to the blog", false]] },
      { q: "What frameworks apply to my hiring AI?", steps: [["map it to the frameworks that bind it", true], ["hand you the path to Yes", true]] },
      { q: "Run a governance report", steps: [["compile the controls", true], ["sign the evidence bundle", true], ["publish the report", false]] },
      { q: "What's waiting for my approval?", steps: [["pull your queue (read-only)", true]] } ] },
    library: { hi: "Hi, I'm Jeeves.", sub: "I run the governed core. Ask me to do something, or pick one — reversible work just runs; anything irreversible waits for a steward.", chips: [
      { q: "Draft a PR to update the agents page", steps: [["draft the change", true], ["merge it to main", false]] },
      { q: "What frameworks apply to my model?", steps: [["map it to the binding frameworks", true]] },
      { q: "Run the gate self-test", steps: [["exercise the engine (read-only)", true]] },
      { q: "Show me the latest signed receipts", steps: [["pull the ledger tail (read-only)", true]] } ] },
    learning: { hi: "Hi, I'm Jeeves.", sub: "I help you run the classroom side. Tell me what you need — I'll draft it and do the safe parts; sending or publishing waits for you.", chips: [
      { q: "Draft this term's classroom AI guidelines", steps: [["draft the guidelines", true], ["email them to teachers", false]] },
      { q: "What rules fit my classroom?", steps: [["map your use to what applies", true]] },
      { q: "Make a parent-friendly explainer", steps: [["draft the explainer", true], ["post it to the site", false]] } ] },
    community: { hi: "Hi, I'm Jeeves.", sub: "I run the day-to-day in the garden. Ask me, or pick one — I do the reversible work and hold anything irreversible for a steward.", chips: [
      { q: "Draft this week's digest", steps: [["draft the digest", true], ["post it to the feed", false]] },
      { q: "What's waiting for my approval?", steps: [["pull your queue (read-only)", true]] },
      { q: "Summarize this week's activity", steps: [["read the ledger and summarize", true]] } ] }
  };
  var S = SCENES[SITE] || SCENES.foundation;
  var MARK = '<svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="none" stroke="#1d9e75" stroke-width="2"/><path d="M11 21 L16 9 L21 21 Z" fill="#0f6e56"/></svg>';

  var css =
    '.jh{--jt:#0f6e56;--jtd:#0b5743;--jn:#0c1430;--jl:#e4ebe8;--jm:#566;background:#f5f8f7;border-bottom:1px solid var(--jl);padding:46px 20px 38px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'
    + '.jh-in{max-width:660px;margin:0 auto;text-align:center;color:#16304a}'
    + '.jh-mk{width:64px;height:64px;margin:0 auto 14px;display:block}'
    + '.jh .jh-hi{font-family:Georgia,serif;font-weight:700;font-size:clamp(1.5rem,3.4vw,2.1rem);color:var(--jn);margin:0 0 7px;line-height:1.13}'
    + '.jh :focus-visible{outline:2px solid var(--jt);outline-offset:2px} .jh input:focus-visible{outline:2px solid var(--jt);outline-offset:1px}'
    + '@media (prefers-reduced-motion: reduce){.jh *{transition:none!important}}'
    + '.jh-sub{font-size:1.02rem;color:var(--jm);max-width:520px;margin:0 auto 22px}'
    + '.jh-ask{display:flex;gap:8px;max-width:540px;margin:0 auto 14px;background:#fff;border:1px solid var(--jl);border-radius:14px;padding:7px 7px 7px 16px;box-shadow:0 6px 22px rgba(8,20,15,.07)}'
    + '.jh-ask input{flex:1;border:none;outline:none;font:400 1rem/1.5 inherit;color:#16304a;background:transparent}'
    + '.jh-ask button{flex:0 0 auto;background:var(--jt);color:#fff;border:none;border-radius:10px;min-width:48px;min-height:48px;font-size:1.1rem;cursor:pointer}'
    + '.jh-ask button:hover{background:var(--jtd)}'
    + '.jh-cap{font-size:11.5px;color:#5b655e;text-transform:uppercase;letter-spacing:.1em;margin:0 0 11px}'
    + '.jh-chips{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;max-width:600px;margin:0 auto}'
    + '.jh-chip{background:#fff;border:1px solid var(--jl);border-radius:22px;padding:10px 16px;min-height:44px;font-size:13.5px;color:#16304a;cursor:pointer;transition:.14s;display:inline-flex;align-items:center;gap:7px}'
    + '.jh-chip:hover{border-color:var(--jt);color:var(--jt)} .jh-chip .s{color:#1d9e75;font-size:12px}'
    + '.jh-th{max-width:560px;margin:18px auto 0;text-align:left;display:none} .jh-th.on{display:block}'
    + '.jh-msg{border-radius:14px;padding:12px 15px;margin:0 0 10px;font-size:14px}'
    + '.jh-msg.you{background:var(--jn);color:#fff;margin-left:40px;border-bottom-right-radius:4px}'
    + '.jh-msg.jv{background:#fff;border:1px solid var(--jl);border-bottom-left-radius:4px}'
    + '.jh-who{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--jt);font-size:13px;margin-bottom:6px}'
    + '.jh-step{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--jl);font-size:13.5px} .jh-step:first-of-type{border-top:0}'
    + '.jh-step .l{flex:1} .jh-step .l em{font-style:normal;font-weight:600;color:var(--jn)}'
    + '.jh-pill{font-size:11px;font-weight:700;padding:3px 9px;border-radius:7px;white-space:nowrap}'
    + '.jh-pill.a{background:#e8f3ec;color:#0f7a45} .jh-pill.h{background:#fbf0dd;color:#8a5a0d}'
    + '.jh-ap{display:flex;gap:8px;margin-top:5px} .jh-ap button{border:1px solid #d7e3dd;border-radius:8px;padding:9px 14px;min-height:44px;font:600 13px/1 inherit;cursor:pointer;background:#fff;color:#16304a}'
    + '.jh-ap button.y{background:var(--jt);border-color:var(--jt);color:#fff} .jh-ap button.y:hover{background:var(--jtd)} .jh-ap button.n:hover{border-color:#a3242b;color:#a3242b}'
    + '.jh-rs{background:none;border:none;color:var(--jt);font:600 13.5px inherit;cursor:pointer;margin-top:6px;padding:8px 0;min-height:40px}';

  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var host = document.getElementById("jeeves-hero");
  if (!host) { host = document.createElement("div"); document.body.insertBefore(host, document.body.firstChild); }
  host.className = "jh";
  var chipHtml = S.chips.map(function (c, i) { return '<button class="jh-chip" data-i="' + i + '"><span class="s">▸</span>' + c.q + '</button>'; }).join("");
  host.innerHTML =
    '<div class="jh-in">'
    + '<svg class="jh-mk" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#0c1430"/><circle cx="16" cy="16" r="15" fill="none" stroke="#1d9e75" stroke-width="1.3"/><path d="M11 21 L16 9 L21 21 Z" fill="#0f6e56"/><circle cx="22" cy="9" r="2.6" fill="#5dcaa5"/></svg>'
    + '<p class="jh-hi">' + S.hi + '</p><p class="jh-sub">' + S.sub + '</p>'
    + '<form class="jh-ask" id="jh-ask"><input id="jh-in" placeholder="Ask me to do something…" aria-label="Ask Jeeves" /><button type="submit" aria-label="Send">→</button></form>'
    + '<p class="jh-cap">Or start with one of these</p><div class="jh-chips">' + chipHtml + '</div>'
    + '<div class="jh-th" id="jh-th" aria-live="polite"></div>'
    + '</div>';

  var th = document.getElementById("jh-th");
  function esc(s) { return String(s).replace(/</g, "&lt;"); }
  function plan(q) { var h = S.chips.filter(function (c) { return c.q.toLowerCase() === q.toLowerCase(); })[0]; return h ? h.steps : [["draft what you asked for", true], ["publish / send it", false]]; }
  function run(q, steps) {
    th.classList.add("on");
    var holds = steps.filter(function (s) { return !s[1]; }).length;
    var rows = steps.map(function (s) { return s[1]
      ? '<div class="jh-step"><span class="l">Jeeves <em>' + esc(s[0]) + '</em></span><span class="jh-pill a">runs now ✓</span></div>'
      : '<div class="jh-step" data-h="1"><span class="l">Jeeves wants to <em>' + esc(s[0]) + '</em></span><span class="jh-pill h">waits for you</span></div>'; }).join("");
    var ap = holds ? '<div class="jh-ap"><button class="y" id="jh-y">Approve</button><button class="n" id="jh-n">Hold</button></div>' : '';
    th.innerHTML = '<div class="jh-msg you">' + esc(q) + '</div><div class="jh-msg jv"><div class="jh-who">' + MARK + 'Jeeves</div>'
      + '<div style="color:#566;font-size:13px;margin-bottom:6px">Here\'s my plan' + (holds ? ' — the last bit needs your yes' : '') + ':</div>' + rows + ap + '</div>';
    th.scrollIntoView({ behavior: "smooth", block: "nearest" });
    var y = document.getElementById("jh-y"), n = document.getElementById("jh-n");
    if (y) y.onclick = function () { fin(true); };
    if (n) n.onclick = function () { fin(false); };
    if (!holds) msg("All reversible — done, and signed into the ledger.");
  }
  function fin(yes) {
    [].forEach.call(th.querySelectorAll(".jh-step[data-h]"), function (s) { var p = s.querySelector(".jh-pill"); p.className = "jh-pill " + (yes ? "a" : "h"); p.textContent = yes ? "approved · done ✓" : "held · never ran"; });
    var a = th.querySelector(".jh-ap"); if (a) a.remove();
    msg(yes ? "Done — and notice that step needed your yes. Anything irreversible always does." : "Held. It never runs — you hold the keys.");
  }
  function msg(t) {
    var d = document.createElement("div"); d.className = "jh-msg jv";
    d.innerHTML = '<div class="jh-who">' + MARK + 'Jeeves</div>' + t + '<br><button class="jh-rs" id="jh-rs">↺ ask me something else</button>';
    th.appendChild(d); document.getElementById("jh-rs").onclick = function () { th.classList.remove("on"); th.innerHTML = ""; };
    d.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  host.addEventListener("click", function (e) { var b = e.target.closest(".jh-chip"); if (!b) return; var c = S.chips[+b.getAttribute("data-i")]; run(c.q, c.steps); });
  document.getElementById("jh-ask").addEventListener("submit", function (e) { e.preventDefault(); var v = document.getElementById("jh-in").value.trim(); if (!v) return; document.getElementById("jh-in").value = ""; run(v, plan(v)); });
})();
