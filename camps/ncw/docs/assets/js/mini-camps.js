/* ============================================================
   NCW Mini-Camps — filter by scenario + audience, search,
   render expandable color-coded cards, and print a single camp.
   ============================================================ */
(function () {
  "use strict";
  var CAMPS = window.MINI_CAMPS || [];
  var SCEN = window.SCENARIOS || {};
  var AUD = window.AUDIENCES || {};

  var state = { scenario: "all", audience: "all", q: "" };

  /* ---- escape helper ---- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- build chip rows ---- */
  function buildChips() {
    var sMount = document.getElementById("scenarioChips");
    var aMount = document.getElementById("audienceChips");

    var sChips = ['<button class="chip" data-type="scenario" data-val="all">All scenarios</button>'];
    Object.keys(SCEN).forEach(function (k) {
      var s = SCEN[k];
      sChips.push('<button class="chip sc-' + s.color + '" data-type="scenario" data-val="' + k + '">' + s.emoji + ' ' + esc(s.short) + '</button>');
    });
    sMount.innerHTML = sChips.join("");

    // audiences that actually exist in the data
    var present = {};
    CAMPS.forEach(function (c) { present[c.audience] = true; });
    var aChips = ['<button class="chip" data-type="audience" data-val="all">All audiences</button>'];
    Object.keys(AUD).forEach(function (k) {
      if (present[k]) aChips.push('<button class="chip" data-type="audience" data-val="' + k + '">' + esc(AUD[k]) + '</button>');
    });
    aMount.innerHTML = aChips.join("");

    document.querySelectorAll(".chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.getAttribute("data-type");
        state[type] = btn.getAttribute("data-val");
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
  function matches(c) {
    if (state.scenario !== "all" && c.scenario !== state.scenario) return false;
    if (state.audience !== "all" && c.audience !== state.audience) return false;
    if (state.q) {
      var hay = (c.title + " " + c.intro + " " + c.oneRule + " " + c.save + " " +
        c.steps.map(function (s) { return s.h + " " + s.b; }).join(" ")).toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  /* ---- card template ---- */
  function cardHTML(c, idx) {
    var s = SCEN[c.scenario] || { color: "green", label: c.scenario, emoji: "" };
    var steps = c.steps.map(function (st, i) {
      return '<li class="flex gap-3.5"><span class="shrink-0 w-7 h-7 rounded-lg grid place-items-center font-700 text-[13px]" style="background:var(--sc-soft);color:var(--sc)">' + (i + 1) + '</span>' +
        '<div><p class="font-700 text-charcoal text-[15px]">' + esc(st.h) + '</p>' +
        '<p class="text-charcoal/70 text-[14px] leading-relaxed mt-0.5">' + esc(st.b) + '</p></div></li>';
    }).join("");

    return '<article id="camp-' + esc(c.id) + '" class="camp-card sc-' + s.color + ' flex flex-col rounded-3xl bg-white border border-charcoal/10 overflow-hidden lift">' +
      '<div class="h-1.5" style="background:var(--sc)"></div>' +
      '<div class="p-6 sm:p-7 flex flex-col flex-1">' +
        '<div class="flex items-center justify-between gap-3 mb-3">' +
          '<span class="inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-full" style="background:var(--sc-soft);color:var(--sc)">' + s.emoji + ' ' + esc(s.short) + '</span>' +
          '<span class="text-[12px] font-600 text-charcoal/50">' + esc(c.badge) + '</span>' +
        '</div>' +
        '<h3 class="font-serif font-700 text-xl sm:text-[1.4rem] text-charcoal leading-snug">' + esc(c.title) + '</h3>' +
        '<p class="mt-3 text-charcoal/75 text-[15px] leading-relaxed">' + esc(c.intro) + '</p>' +
        '<details class="mt-5 group/d">' +
          '<summary class="inline-flex items-center gap-2 text-[14px] font-700 cursor-pointer select-none" style="color:var(--sc)">' +
            '<svg class="ev-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>' +
            'Open the full camp' +
          '</summary>' +
          '<div class="mt-5 space-y-5">' +
            '<ol class="space-y-4">' + steps + '</ol>' +
            '<div class="rounded-2xl p-5" style="background:var(--sc-soft)">' +
              '<p class="text-[11px] font-700 uppercase tracking-wider mb-1.5" style="color:var(--sc)">The one rule</p>' +
              '<p class="text-charcoal/85 text-[15px] leading-relaxed font-500">' + esc(c.oneRule) + '</p>' +
            '</div>' +
            '<div class="rounded-2xl border border-charcoal/10 p-5 bg-cream/60">' +
              '<p class="text-[11px] font-700 uppercase tracking-wider text-charcoal/45 mb-1.5">Save this</p>' +
              '<p class="text-charcoal/75 text-[14px] leading-relaxed">' + esc(c.save) + '</p>' +
            '</div>' +
          '</div>' +
        '</details>' +
        '<div class="mt-auto pt-5 flex items-center gap-3 no-print">' +
          '<button class="print-camp inline-flex items-center gap-2 text-[13px] font-700 text-charcoal/60 hover:text-orchard transition-colors" data-camp="' + esc(c.id) + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>' +
            'Print this camp' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* ---- render ---- */
  function render() {
    styleChips();
    var grid = document.getElementById("campGrid");
    var empty = document.getElementById("emptyState");
    var count = document.getElementById("resultCount");
    var list = CAMPS.filter(matches);

    count.textContent = list.length + (list.length === 1 ? " camp" : " camps") +
      (state.scenario === "all" && state.audience === "all" && !state.q ? " (11 written in full)" : " match your filters");

    if (!list.length) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    grid.innerHTML = list.map(cardHTML).join("");

    // wire print buttons
    grid.querySelectorAll(".print-camp").forEach(function (btn) {
      btn.addEventListener("click", function () { printCamp(btn.getAttribute("data-camp")); });
    });
  }

  /* ---- print a single camp ---- */
  function printCamp(id) {
    var card = document.getElementById("camp-" + id);
    if (!card) return;
    // open its details so steps print
    var d = card.querySelector("details");
    var wasOpen = d && d.open;
    if (d) d.open = true;
    // mark only this card to print
    document.querySelectorAll(".camp-card").forEach(function (c) {
      if (c !== card) c.classList.add("no-print");
    });
    var grid = document.getElementById("campGrid");
    grid.classList.remove("md:grid-cols-2");
    window.addEventListener("afterprint", function restore() {
      document.querySelectorAll(".camp-card").forEach(function (c) { c.classList.remove("no-print"); });
      grid.classList.add("md:grid-cols-2");
      if (d && !wasOpen) d.open = false;
      window.removeEventListener("afterprint", restore);
    });
    window.print();
  }

  /* ---- deep-link from home (#gifted etc) ---- */
  function applyHash() {
    var h = (location.hash || "").replace("#", "");
    if (h && SCEN[h]) { state.scenario = h; }
  }

  /* ---- init ---- */
  function init() {
    if (!CAMPS.length) return;
    buildChips();
    applyHash();

    var search = document.getElementById("campSearch");
    var t;
    search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = search.value.trim(); render(); }, 140);
    });

    function clearAll() {
      state = { scenario: "all", audience: "all", q: "" };
      search.value = "";
      render();
    }
    document.getElementById("clearFilters").addEventListener("click", clearAll);
    document.getElementById("emptyClear").addEventListener("click", clearAll);

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
