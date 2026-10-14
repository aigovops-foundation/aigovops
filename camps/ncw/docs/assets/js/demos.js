/* ============================================================
   NCW Demo Lab — two tracks (full toolkit / free core-four),
   filter by persona + tool + Which-Yes, search, render expandable
   good-path/bad-path run sheets, print one demo.
   Modeled on mini-camps.js.
   ============================================================ */
(function () {
  "use strict";
  var DEMOS = window.DEMOS || [];
  var PERSONAS = window.DEMO_PERSONAS || {};
  var YES = window.DEMO_YES || {};
  var TOOLS = window.DEMO_TOOLS || {};
  var FREE = window.DEMO_FREE || {};

  var state = { track: "full", persona: "all", tool: "all", yes: "all", q: "" };

  // Step-by-step screenshots from the capture rig (capture/RUNBOOK.md).
  // Loaded async; cards re-render when the manifest arrives.
  var CAPTURES = {};
  if (window.fetch) {
    fetch("assets/captures/manifest.json")
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (m) { CAPTURES = m || {}; render(); })
      .catch(function () {});
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- track helpers ---- */
  function activeTool(d) {
    if (state.track === "free" && FREE[d.id]) return FREE[d.id].tool;
    return d.tool;
  }
  function activeFeature(d) {
    if (state.track === "free" && FREE[d.id]) return FREE[d.id].feature || "";
    return "";
  }
  function swapNote(d) {
    var f = FREE[d.id];
    return (state.track === "free" && f && f.swap) ? f.swap : "";
  }
  function activePrep(d) {
    var f = FREE[d.id];
    return (state.track === "free" && f && f.prep) ? f.prep : d.prep;
  }
  function toolInfo(name) {
    return TOOLS[name] || { vendor: "", tier: "freemium", url: "", signup: "" };
  }

  var TIER_BADGE = {
    free:     { label: "Free", cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    freemium: { label: "Free tier", cls: "bg-amber-100 text-amber-800 border-amber-300" },
    paid:     { label: "Paid", cls: "bg-rose-100 text-rose-800 border-rose-300" },
    builtin:  { label: "Built-in", cls: "bg-slate-200 text-slate-700 border-slate-300" },
  };
  function tierBadge(tier) {
    var t = TIER_BADGE[tier] || TIER_BADGE.freemium;
    return '<span class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-700 uppercase tracking-wide ' + t.cls + '">' + t.label + "</span>";
  }

  /* ---- track toggle ---- */
  function buildTrackToggle() {
    var mount = document.getElementById("trackToggle");
    if (!mount) return;
    var opts = [
      { val: "full", label: "Full toolkit", sub: "15 tools · the stage set" },
      { val: "free", label: "Free track", sub: "core-four + built-ins · $0" },
    ];
    mount.innerHTML = opts.map(function (o) {
      var active = state.track === o.val;
      return '<button class="track-btn flex-1 sm:flex-none rounded-xl border px-5 py-2.5 text-left transition-colors ' +
        (active ? "bg-orchard border-orchard text-white shadow-sm" : "bg-white border-charcoal/15 text-charcoal/75 hover:border-orchard/40") +
        '" data-track="' + o.val + '" aria-pressed="' + active + '">' +
        '<span class="block text-[14px] font-700">' + esc(o.label) + "</span>" +
        '<span class="block text-[11.5px] font-500 ' + (active ? "text-white/75" : "text-charcoal/50") + '">' + esc(o.sub) + "</span>" +
        "</button>";
    }).join("");
    mount.querySelectorAll(".track-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-track");
        if (state.track !== t) {
          state.track = t;
          state.tool = "all"; // tool sets differ between tracks
          buildTrackToggle();
          buildChips();
          render();
        }
      });
    });
  }

  /* ---- build chip rows ---- */
  function buildChips() {
    var pMount = document.getElementById("personaChips");
    var tMount = document.getElementById("toolChips");
    var yMount = document.getElementById("yesChips");

    var pChips = ['<button class="chip" data-type="persona" data-val="all">All personas</button>'];
    Object.keys(PERSONAS).forEach(function (k) {
      var p = PERSONAS[k];
      pChips.push('<button class="chip sc-' + p.color + '" data-type="persona" data-val="' + k + '">' + p.emoji + " " + esc(p.label) + "</button>");
    });
    pMount.innerHTML = pChips.join("");

    var toolsPresent = {};
    DEMOS.forEach(function (d) { toolsPresent[activeTool(d)] = true; });
    var tChips = ['<button class="chip" data-type="tool" data-val="all">All tools</button>'];
    Object.keys(toolsPresent).sort().forEach(function (t) {
      tChips.push('<button class="chip" data-type="tool" data-val="' + esc(t) + '">' + esc(t) + "</button>");
    });
    tMount.innerHTML = tChips.join("");

    var yChips = ['<button class="chip" data-type="yes" data-val="all">All three</button>'];
    Object.keys(YES).forEach(function (k) {
      yChips.push('<button class="chip" data-type="yes" data-val="' + k + '">' + esc(YES[k].tag) + " · " + esc(YES[k].q) + "</button>");
    });
    yMount.innerHTML = yChips.join("");

    document.querySelectorAll(".chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state[btn.getAttribute("data-type")] = btn.getAttribute("data-val");
        render();
      });
    });
    styleChips();
  }

  function styleChips() {
    document.querySelectorAll(".chip").forEach(function (btn) {
      var type = btn.getAttribute("data-type");
      var val = btn.getAttribute("data-val");
      var active = state[type] === val;
      btn.className = "chip " + (btn.className.match(/sc-\w+/) ? btn.className.match(/sc-\w+/)[0] + " " : "") +
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-700 transition-colors border " +
        (active
          ? "bg-orchard text-white border-orchard shadow-sm"
          : "bg-white text-charcoal/70 border-charcoal/15 hover:border-orchard/40 hover:text-orchard");
    });
  }

  /* ---- filtering ---- */
  function matches(d) {
    if (state.persona !== "all" && d.persona !== state.persona) return false;
    if (state.tool !== "all" && activeTool(d) !== state.tool) return false;
    if (state.yes !== "all" && String(d.yes) !== state.yes) return false;
    if (state.q) {
      var hay = (d.num + " " + d.title + " " + d.tool + " " + activeTool(d) + " " + swapNote(d) + " " +
        d.hook + " " + d.prep + " " + d.good.join(" ") + " " + d.bad.join(" ") + " " +
        d.tell + " " + d.en + " " + d.es).toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  /* ---- path step list (good = orchard, bad = ember) ---- */
  function pathHTML(kind, at, steps) {
    var isGood = kind === "good";
    var tone = isGood ? "path-good" : "path-bad";
    var label = isGood ? "🟢 Good path" : "🔴 Bad path";
    var sub = isGood ? "live, step by step" : "staged, never shipped";
    var items = steps.map(function (st, i) {
      return '<li class="flex gap-3"><span class="shrink-0 w-6 h-6 rounded-md grid place-items-center font-700 text-[12px]" style="background:var(--pt-soft);color:var(--pt)">' + (i + 1) + "</span>" +
        '<p class="text-charcoal/80 text-[14px] leading-relaxed">' + esc(st) + "</p></li>";
    }).join("");
    return '<div class="' + tone + ' rounded-2xl border p-5" style="border-color:var(--pt-line);background:var(--pt-bg)">' +
      '<div class="flex items-baseline justify-between gap-3 mb-3">' +
        '<p class="text-[13px] font-700" style="color:var(--pt)">' + label + ' <span class="font-500 text-charcoal/50">· ' + sub + "</span></p>" +
        '<span class="font-mono text-[12px] font-700 text-charcoal/45">' + esc(at) + "</span>" +
      "</div>" +
      '<ol class="space-y-3">' + items + "</ol></div>";
  }

  /* ---- captured walkthrough strip (from the capture rig) ---- */
  function capturesHTML(d) {
    var cap = CAPTURES[d.id];
    if (!cap || !cap.steps || !cap.steps.length) return "";
    var thumbs = cap.steps.map(function (s, i) {
      var src = "assets/captures/" + d.id + "/" + s.file;
      return '<a href="' + esc(src) + '" target="_blank" rel="noopener" class="block shrink-0 w-44">' +
        '<img src="' + esc(src) + '" alt="Step ' + (i + 1) + ": " + esc(s.caption) + '" loading="lazy" class="w-44 rounded-lg border border-charcoal/15 bg-white" />' +
        '<span class="mt-1 block text-[11.5px] leading-snug text-charcoal/60">' + (i + 1) + " · " + esc(s.caption) + "</span>" +
      "</a>";
    }).join("");
    return '<div class="rounded-2xl border border-charcoal/10 p-5 bg-white">' +
      '<div class="flex items-baseline justify-between gap-3 mb-3">' +
        '<p class="text-[11px] font-700 uppercase tracking-wider text-charcoal/45">As it actually looks — captured walkthrough</p>' +
        '<span class="font-mono text-[11px] font-700 text-charcoal/40">' + esc(cap.captured || "") + "</span>" +
      "</div>" +
      '<div class="flex gap-3 overflow-x-auto pb-1">' + thumbs + "</div></div>";
  }

  /* ---- tool footer (open + signup links, track-aware) ---- */
  function toolFooterHTML(d) {
    var name = activeTool(d);
    var feature = activeFeature(d);
    var info = toolInfo(name);
    var bits = [];
    if (info.tier === "builtin") {
      bits.push('<span class="text-[13px] font-600 text-charcoal/60">' + esc(info.note || "Built into the OS — no signup") + "</span>");
    } else {
      bits.push('<a href="' + esc(info.url) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[13px] font-700 text-orchard hover:underline">Open ' + esc(name) +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>');
      var signupLabel = info.tier === "free" ? "Create a free account"
        : info.tier === "freemium" ? "Sign up — free tier"
        : "Sign up — paid" + (info.note ? " (" + info.note + ")" : "");
      bits.push('<a href="' + esc(info.signup) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[13px] font-700 text-charcoal/60 hover:text-orchard transition-colors">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>' +
        esc(signupLabel) + "</a>");
    }
    // on the full track, whisper the free alternative for paid tools
    var f = FREE[d.id];
    if (state.track === "full" && f && f.tool !== d.tool) {
      bits.push('<span class="text-[12px] font-600 text-charcoal/45">Free track: ' + esc(f.tool) + (f.feature ? " (" + esc(f.feature) + ")" : "") + "</span>");
    }
    return bits.join("");
  }

  /* ---- card template ---- */
  function cardHTML(d) {
    var p = PERSONAS[d.persona] || { color: "green", label: d.persona, emoji: "" };
    var y = YES[d.yes] || { tag: "Yes-" + d.yes, q: "" };
    var name = activeTool(d);
    var feature = activeFeature(d);
    var info = toolInfo(name);
    var swap = swapNote(d);

    var swapBox = swap
      ? '<div class="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">' +
          '<p class="text-[11px] font-700 uppercase tracking-wider text-emerald-800 mb-1.5">Free-track swap — what changes</p>' +
          '<p class="text-charcoal/80 text-[14px] leading-relaxed">' + esc(swap) + "</p>" +
        "</div>"
      : "";

    return '<article id="demo-' + esc(d.id) + '" class="demo-card sc-' + p.color + ' flex flex-col rounded-3xl bg-white border border-charcoal/10 overflow-hidden lift">' +
      '<div class="h-1.5" style="background:var(--sc)"></div>' +
      '<div class="p-6 sm:p-7 flex flex-col flex-1">' +
        '<div class="flex flex-wrap items-center gap-2 mb-3">' +
          '<span class="inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-full" style="background:var(--sc-soft);color:var(--sc)">' + p.emoji + " " + esc(p.label) + "</span>" +
          '<span class="inline-flex items-center text-[11px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-full bg-charcoal/5 text-charcoal/60">' + esc(name) + (feature ? " · " + esc(feature) : "") + "</span>" +
          tierBadge(info.tier) +
          '<span class="ml-auto text-[12px] font-600 text-charcoal/50">' + d.min + " min</span>" +
        "</div>" +
        '<h3 class="font-serif font-700 text-xl sm:text-[1.4rem] text-charcoal leading-snug">' + esc(d.num) + " · " + esc(d.title) + "</h3>" +
        '<p class="mt-1.5 text-[12px] font-600 text-charcoal/50">' + esc(y.tag) + " — " + esc(y.q) + " · Pledge #" + d.pledge + "</p>" +
        '<p class="mt-3 text-charcoal/75 text-[15px] leading-relaxed">' + esc(d.hook) + "</p>" +
        '<details class="mt-5 group/d">' +
          '<summary class="inline-flex items-center gap-2 text-[14px] font-700 cursor-pointer select-none" style="color:var(--sc)">' +
            '<svg class="ev-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>' +
            "Open the run sheet" +
          "</summary>" +
          '<div class="mt-5 space-y-4">' +
            swapBox +
            '<div class="rounded-2xl border border-charcoal/10 p-5 bg-cream/60">' +
              '<p class="text-[11px] font-700 uppercase tracking-wider text-charcoal/45 mb-1.5">Prep — the night before</p>' +
              '<p class="text-charcoal/75 text-[14px] leading-relaxed">' + esc(activePrep(d)) + "</p>" +
            "</div>" +
            pathHTML("good", d.goodAt, d.good) +
            capturesHTML(d) +
            pathHTML("bad", d.badAt, d.bad) +
            '<div class="rounded-2xl p-5" style="background:var(--sc-soft)">' +
              '<div class="flex items-baseline justify-between gap-3">' +
                '<p class="text-[11px] font-700 uppercase tracking-wider mb-1.5" style="color:var(--sc)">The tell</p>' +
                '<span class="font-mono text-[12px] font-700 text-charcoal/45">' + esc(d.tellAt) + "</span>" +
              "</div>" +
              '<p class="text-charcoal/85 text-[15px] leading-relaxed font-500">' + esc(d.tell) + "</p>" +
            "</div>" +
            '<div class="rounded-2xl border border-charcoal/10 p-5 bg-white">' +
              '<div class="flex items-baseline justify-between gap-3">' +
                '<p class="text-[11px] font-700 uppercase tracking-wider text-charcoal/45 mb-1.5">Receipts → hint-log</p>' +
                '<span class="font-mono text-[12px] font-700 text-charcoal/45">' + esc(d.receiptsAt) + "</span>" +
              "</div>" +
              '<p class="text-charcoal/75 text-[14px] leading-relaxed">' + esc(d.receipts) + "</p>" +
            "</div>" +
            '<div class="rounded-2xl bg-charcoal text-cream p-5">' +
              '<p class="text-[11px] font-700 uppercase tracking-wider text-signal mb-2">The send-off</p>' +
              '<p class="text-[15px] leading-relaxed font-500">' + esc(d.en) + "</p>" +
              '<p class="mt-2 text-[14px] leading-relaxed text-cream/75 italic" lang="es">' + esc(d.es) + "</p>" +
            "</div>" +
          "</div>" +
        "</details>" +
        '<div class="mt-auto pt-5 flex flex-wrap items-center gap-x-4 gap-y-2 no-print">' +
          '<button class="print-demo inline-flex items-center gap-2 text-[13px] font-700 text-charcoal/60 hover:text-orchard transition-colors" data-demo="' + esc(d.id) + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>' +
            "Print this demo" +
          "</button>" +
          toolFooterHTML(d) +
        "</div>" +
      "</div>" +
    "</article>";
  }

  /* ---- render ---- */
  function render() {
    var grid = document.getElementById("demoGrid");
    var empty = document.getElementById("emptyState");
    var count = document.getElementById("resultCount");
    var shown = DEMOS.filter(matches);
    var trackLabel = state.track === "free" ? " · free track ($0)" : " · full toolkit";

    grid.innerHTML = shown.map(cardHTML).join("");
    empty.classList.toggle("hidden", shown.length > 0);
    grid.classList.toggle("hidden", shown.length === 0);
    count.textContent = (shown.length === DEMOS.length
      ? "All " + DEMOS.length + " demos"
      : shown.length + " of " + DEMOS.length + " demos") +
      " · ~" + totalMin(shown) + " minutes of stage time" + trackLabel;
    updateFilterCount();
    styleChips();
    wirePrint();
  }

  /* ---- active-filter badge on the Filters button ---- */
  function updateFilterCount() {
    var badge = document.getElementById("filterCount");
    if (!badge) return;
    var n = ["persona", "tool", "yes"].filter(function (k) { return state[k] !== "all"; }).length;
    badge.textContent = n;
    badge.classList.toggle("hidden", n === 0);
    badge.classList.toggle("grid", n > 0);
  }

  /* ---- filters disclosure ---- */
  function wireFilterToggle() {
    var btn = document.getElementById("filterToggle");
    var panel = document.getElementById("filterPanel");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("hidden") === false;
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  function totalMin(list) {
    return list.reduce(function (a, d) { return a + (d.min || 0); }, 0);
  }

  /* ---- print a single demo ---- */
  function wirePrint() {
    document.querySelectorAll(".print-demo").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-demo");
        var card = document.getElementById("demo-" + id);
        if (!card) return;
        var det = card.querySelector("details");
        var wasOpen = det && det.open;
        if (det) det.open = true;
        document.querySelectorAll(".demo-card").forEach(function (c) {
          c.classList.toggle("print-only-me", c === card);
          c.classList.toggle("print-hide", c !== card);
        });
        document.body.classList.add("printing-one");
        window.print();
        document.body.classList.remove("printing-one");
        document.querySelectorAll(".demo-card").forEach(function (c) {
          c.classList.remove("print-only-me", "print-hide");
        });
        if (det && !wasOpen) det.open = false;
      });
    });
  }

  /* ---- search + clear ---- */
  function wireSearch() {
    var input = document.getElementById("demoSearch");
    var clear = document.getElementById("clearFilters");
    var emptyClear = document.getElementById("emptyClear");
    input.addEventListener("input", function () { state.q = input.value.trim(); render(); });
    function reset() {
      state.persona = "all"; state.tool = "all"; state.yes = "all"; state.q = "";
      input.value = "";
      render();
    }
    clear.addEventListener("click", reset);
    emptyClear.addEventListener("click", reset);
  }

  buildTrackToggle();
  buildChips();
  wireSearch();
  wireFilterToggle();
  render();
})();
