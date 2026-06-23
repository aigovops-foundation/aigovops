/* Jeeves — the governed AiGovOps assistant, as a drop-in corner widget.
 * One line on any site:
 *   <script src="https://www.aigovops-foundation.com/jeeves-widget.js" data-jeeves-site="foundation" defer></script>
 * Self-contained, no dependencies, scoped styles (.jv-*). Consistent look on every property; it
 * knows which site it's on (data-jeeves-site) and demos the propose -> approve gate right there.
 */
(function () {
  "use strict";
  if (window.__jeevesLoaded) return; window.__jeevesLoaded = true;
  var script = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var SITE = (script && script.getAttribute("data-jeeves-site")) || window.JEEVES_SITE || "this site";

  var SCENES = {
    foundation:  { where: "the AiGovOps Foundation site", a: "draft a short post on OVERT 1.0", b: "publish it to the blog", bword: "publish" },
    library:     { where: "the AiGovOps library", a: "draft a PR to update the agents page", b: "merge it to main", bword: "merge" },
    learning:    { where: "the NCW AI camp", a: "draft this term's classroom AI guidelines", b: "email the teachers", bword: "send" },
    community:   { where: "the community", a: "draft this week's digest", b: "post it to the feed", bword: "post" },
    beacon:      { where: "Beacon", a: "draft an evidence-bundle summary", b: "sign and publish it", bword: "publish" },
    umbrella:    { where: "Umbrella", a: "compile the EU AI Act into controls", b: "open a PR with them", bword: "open the PR" },
    rfi:         { where: "the Vendor RFI tool", a: "draft an RFI for a new vendor", b: "send it to the vendor", bword: "send" },
    "this site": { where: "AiGovOps", a: "draft an update", b: "publish it", bword: "publish" }
  };
  var S = SCENES[SITE] || SCENES["this site"];

  var MARK = '<svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#071a12"/><circle cx="16" cy="16" r="15" fill="none" stroke="#1d9e75" stroke-width="1.4"/><path d="M11 21 L16 9 L21 21 Z" fill="#0f6e56"/><circle cx="22" cy="9" r="2.4" fill="#5dcaa5"/></svg>';

  var css = ''
    + '.jv-btn{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:9px;'
    + 'background:#0c1430;color:#fff;border:none;border-radius:30px;padding:12px 18px 12px 13px;min-height:48px;cursor:pointer;'
    + 'font:600 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 6px 22px rgba(8,20,15,.28);transition:transform .15s}'
    + '.jv-btn:hover{transform:translateY(-1px)} .jv-btn .jv-dot{width:8px;height:8px;border-radius:50%;background:#1d9e75;box-shadow:0 0 0 0 rgba(29,158,117,.6);animation:jvp 2.2s infinite}'
    + '@keyframes jvp{0%{box-shadow:0 0 0 0 rgba(29,158,117,.55)}70%{box-shadow:0 0 0 7px rgba(29,158,117,0)}100%{box-shadow:0 0 0 0 rgba(29,158,117,0)}}'
    + '.jv-panel{position:fixed;right:20px;bottom:78px;z-index:2147483000;width:340px;max-width:calc(100vw - 40px);background:#fff;border-radius:16px;'
    + 'box-shadow:0 14px 50px rgba(8,20,15,.30);overflow:hidden;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1a3046;'
    + 'opacity:0;transform:translateY(10px) scale(.98);transform-origin:bottom right;transition:.16s;pointer-events:none}'
    + '.jv-panel.jv-open{opacity:1;transform:none;pointer-events:auto}'
    + '.jv-head{background:linear-gradient(135deg,#0c1430,#0a2318 78%);color:#fff;padding:15px 16px;display:flex;align-items:center;gap:11px}'
    + '.jv-head b{font-size:15px;font-weight:600;display:block} .jv-head span{font-size:11.5px;color:#8fd3ba}'
    + '.jv-x{margin-left:auto;background:none;border:none;color:#9fc3b6;font-size:22px;cursor:pointer;line-height:1;min-width:44px;min-height:44px;display:grid;place-items:center}'
    + '.jv-body{padding:15px 16px;max-height:62vh;overflow:auto}'
    + '.jv-msg{background:#f1f6f4;border-radius:12px;border-top-left-radius:3px;padding:10px 12px;margin:0 0 10px;font-size:13.5px;color:#243b30}'
    + '.jv-msg b{color:#0f6e56} .jv-ctx{font-size:12px;color:#5e6f69;margin:0 0 12px}'
    + '.jv-act{border:1px solid #e4ebe8;border-radius:12px;padding:11px 13px;margin:0 0 10px;background:#fff}'
    + '.jv-act .jv-prop{font-size:13.5px;color:#1a3046;margin:0 0 9px} .jv-act .jv-prop em{color:#0f6e56;font-style:normal;font-weight:600}'
    + '.jv-row{display:flex;gap:8px} .jv-b{flex:1;border:1px solid #d7e3dd;border-radius:9px;padding:12px 10px;min-height:44px;font:600 13px/1 inherit;cursor:pointer;background:#fff;color:#1a3046;transition:.12s}'
    + '.jv-b:hover{border-color:#0f6e56;color:#0f6e56} .jv-b.jv-yes{background:#0f6e56;border-color:#0f6e56;color:#fff} .jv-b.jv-yes:hover{background:#0b5743;color:#fff}'
    + '.jv-out{font-size:13px;border-radius:9px;padding:9px 11px;margin:9px 0 0;display:none} .jv-out.on{display:block}'
    + '.jv-out.ran{background:#e8f3ec;color:#0f7a45} .jv-out.held{background:#fbf0dd;color:#9a6410} .jv-out.stop{background:#fbe9ea;color:#a3242b}'
    + '.jv-foot{border-top:1px solid #eef1ef;padding:11px 16px;display:flex;gap:14px;font-size:12.5px}'
    + '.jv-foot a{color:#0f6e56;text-decoration:none;font-weight:600} .jv-key{font-size:11.5px;color:#5b655e;padding:0 16px 13px;text-align:center}';

  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.className = "jv-btn"; btn.setAttribute("aria-label", "Ask Jeeves");
  btn.innerHTML = '<span class="jv-dot"></span>' + MARK + '<span>Ask Jeeves</span>';
  document.body.appendChild(btn);

  var panel = document.createElement("div");
  panel.className = "jv-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Jeeves assistant");
  panel.innerHTML =
    '<div class="jv-head">' + MARK + '<div><b>Jeeves</b><span>your governed assistant</span></div><button class="jv-x" aria-label="Close">&times;</button></div>'
    + '<div class="jv-body">'
    + '<div class="jv-msg">Hi — I run the busywork across AiGovOps. <b>I propose; Ken or Bob hold the keys.</b> Here\'s how that works on ' + S.where + ':</div>'
    + '<div class="jv-act" id="jv-a1"><div class="jv-prop">I can <em>' + S.a + '</em>. It\'s reversible, so I can just do it.</div>'
    + '<div class="jv-row"><button class="jv-b jv-yes" data-s="1" data-v="approve">Approve</button><button class="jv-b" data-s="1" data-v="hold">Hold</button></div>'
    + '<div class="jv-out" id="jv-o1"></div></div>'
    + '<div class="jv-act" id="jv-a2" style="opacity:.45;pointer-events:none"><div class="jv-prop">Then I\'d <em>' + S.b + '</em> — that one can\'t be undone, so it waits for you.</div>'
    + '<div class="jv-row"><button class="jv-b jv-yes" data-s="2" data-v="approve">Approve</button><button class="jv-b" data-s="2" data-v="deny">Deny</button></div>'
    + '<div class="jv-out" id="jv-o2"></div></div>'
    + '</div>'
    + '<div class="jv-key">Green = I did it myself · amber = it waited for you. Nothing irreversible without a steward.</div>'
    + '<div class="jv-foot"><a href="https://www.aigovops-foundation.com/jeeves-demo.html" target="_blank" rel="noopener">▶ Full demo</a>'
    + '<a href="https://community.aigovops-foundation.com/" target="_blank" rel="noopener">Enter the live fleet ↗</a></div>';
  document.body.appendChild(panel);

  function toggle(open) { panel.classList.toggle("jv-open", open); btn.style.display = open ? "none" : "flex"; }
  btn.addEventListener("click", function () { toggle(true); });
  panel.querySelector(".jv-x").addEventListener("click", function () { toggle(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });

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
