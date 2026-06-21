/* ============================================================
   NCW AI Expo 2026 — shared header, footer, scroll animations
   Injects a consistent nav + footer on every page and wires up
   subtle motion (scroll fade-ins, stat count-ups, mobile menu).
   ============================================================ */
(function () {
  "use strict";

  // Which page is active? Derived from <body data-page="...">
  const PAGE = (document.body && document.body.getAttribute("data-page")) || "";
  // Path prefix for pages living in a subdirectory (e.g. /tools/*.html set data-base="../")
  const BASE = (document.body && document.body.getAttribute("data-base")) || "";
  const href = (h) => (/^https?:/.test(h) ? h : BASE + h);

  const NAV = [
    { href: "index.html", key: "home", label: "Home" },
    { href: "plan.html", key: "plan", label: "The Plan" },
    { href: "centerpiece.html", key: "centerpiece", label: "Centerpiece" },
    { href: "mini-camps.html", key: "mini-camps", label: "Mini-Camps" },
    { href: "tools.html", key: "tools", label: "Tools" },
    { href: "courses.html", key: "courses", label: "Courses" },
    { href: "pledge.html", key: "pledge", label: "Pledge" },
    { href: "hint-logs.html", key: "hint-logs", label: "Hint-Logs" },
    { href: "resources.html", key: "resources", label: "Resources" },
    { href: "about.html", key: "about", label: "About" },
  ];

  const LOGO = `
    <svg width="32" height="32" viewBox="0 0 32 32" class="shrink-0" aria-label="NCW AI Expo mark" role="img">
      <rect width="32" height="32" rx="7" fill="#2E7D4F"/>
      <path d="M4 22 L11 11 L16 18 L21 9 L28 22 Z" fill="#FAF7F0"/>
      <circle cx="24" cy="8" r="3" fill="#E07A2A"/>
    </svg>`;

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const links = NAV.map(
      (n) => `<a href="${href(n.href)}" data-nav="${n.key}"
        class="px-3 py-2 rounded-lg text-[14px] font-600 transition-colors ${
          n.key === PAGE
            ? "text-orchard bg-orchard/8"
            : "text-charcoal/70 hover:text-orchard hover:bg-orchard/5"
        }">${n.label}</a>`
    ).join("");

    const mobileLinks = NAV.map(
      (n) => `<a href="${href(n.href)}"
        class="block px-4 py-3 rounded-xl text-[15px] font-600 ${
          n.key === PAGE ? "text-orchard bg-orchard/8" : "text-charcoal/80 hover:bg-cream-deep"
        }">${n.label}</a>`
    ).join("");

    mount.innerHTML = `
      <header class="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-cream-deep">
        <div class="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-4">
          <a href="${href('index.html')}" class="flex items-center gap-2.5 group shrink-0">
            ${LOGO}
            <span class="font-serif font-700 text-charcoal text-[15px] leading-[1.05] hidden xs:block">
              NCW AI Expo<span class="block text-[11px] font-600 text-orchard tracking-wide">Aug 11, 2026 · Wenatchee</span>
            </span>
          </a>
          <nav class="hidden lg:flex items-center gap-0.5" aria-label="Primary">${links}</nav>
          <div class="flex items-center gap-2">
            <a href="${href('pledge.html')}" class="hidden sm:inline-flex items-center rounded-full bg-signal hover:bg-signal-dark transition-colors text-white font-700 text-sm px-5 py-2.5 shadow-sm">Sign the Pledge</a>
            <button id="menuBtn" class="lg:hidden grid place-items-center w-10 h-10 rounded-lg text-charcoal hover:bg-cream-deep" aria-label="Open menu" aria-expanded="false">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
        <div id="mobileMenu" class="lg:hidden hidden border-t border-cream-deep bg-cream px-4 py-3 space-y-1">
          ${mobileLinks}
          <a href="${href('pledge.html')}" class="block text-center mt-2 rounded-full bg-signal text-white font-700 px-5 py-3">Sign the Pledge</a>
        </div>
      </header>`;

    const btn = document.getElementById("menuBtn");
    const menu = document.getElementById("mobileMenu");
    if (btn && menu) {
      btn.addEventListener("click", () => {
        const open = menu.classList.toggle("hidden");
        btn.setAttribute("aria-expanded", String(!open));
      });
    }
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    mount.innerHTML = `
      <footer class="bg-charcoal text-cream mt-0">
        <div class="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div class="grid md:grid-cols-4 gap-10">
            <div class="md:col-span-1">
              <div class="flex items-center gap-2.5 mb-3">${LOGO}
                <span class="font-serif font-700 text-lg leading-tight">AIGovOps<br>Foundation</span></div>
              <p class="text-cream/60 text-sm leading-relaxed">A 501(c)(3) nonprofit. Apache-2.0. Empowering rural and small communities through better AI access and impact.</p>
              <p class="mt-4 font-serif font-600 text-signal text-[15px]">× NCW Tech Alliance</p>
            </div>
            <div>
              <p class="font-700 text-xs uppercase tracking-[0.16em] text-cream/45 mb-4">Explore the day</p>
              <ul class="space-y-2.5 text-sm">
                <li><a href="${href('plan.html')}" class="text-cream/75 hover:text-signal transition-colors">The Plan & breakouts</a></li>
                <li><a href="${href('centerpiece.html')}" class="text-cream/75 hover:text-signal transition-colors">The Centerpiece plenary</a></li>
                <li><a href="${href('mini-camps.html')}" class="text-cream/75 hover:text-signal transition-colors">The mini-camps</a></li>
                <li><a href="${href('resources.html')}" class="text-cream/75 hover:text-signal transition-colors">Resources & downloads</a></li>
              </ul>
            </div>
            <div>
              <p class="font-700 text-xs uppercase tracking-[0.16em] text-cream/45 mb-4">Take action</p>
              <ul class="space-y-2.5 text-sm">
                <li><a href="${href('pledge.html')}" class="text-cream/75 hover:text-signal transition-colors">Sign the Pledge</a></li>
                <li><a href="https://www.aigovops-foundation.com" class="text-cream/75 hover:text-signal transition-colors">aigovops-foundation.com</a></li>
                <li><a href="https://www.ncwtech.org" class="text-cream/75 hover:text-signal transition-colors">ncwtech.org</a></li>
                <li><a href="https://github.com/focuslead/ai-council-framework" class="text-cream/75 hover:text-signal transition-colors">AI Council Framework</a></li>
              </ul>
            </div>
            <div>
              <p class="font-700 text-xs uppercase tracking-[0.16em] text-cream/45 mb-4">The three habits</p>
              <ul class="space-y-3 text-sm text-cream/75">
                <li class="flex gap-2.5"><span aria-hidden="true">🤝</span><span>The two-eyes rule</span></li>
                <li class="flex gap-2.5"><span aria-hidden="true">🔍</span><span>Triangulate hard questions</span></li>
                <li class="flex gap-2.5"><span aria-hidden="true">📂</span><span>Keep the receipts</span></li>
              </ul>
            </div>
          </div>
          <div class="mt-14 pt-8 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-cream/50">
            <p class="font-serif italic">The story we tell about AI in NCW will be the story we wrote — together.</p>
            <p>NCW AI Expo 2026 · v1.0</p>
          </div>
        </div>
      </footer>`;
  }

  /* Scroll fade-ins. We add `.js-fade` to <html> so the CSS only hides
     fade-in elements when JS is running — axe-core, search crawlers, and
     no-JS visitors see fully-revealed content. */
  function initFade() {
    document.documentElement.classList.add("js-fade");
    const els = document.querySelectorAll(".fade-in");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("shown"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("shown");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    /* Safety net: if any element hasn't been revealed within 2s
       (e.g. inside an overflow:hidden parent the observer can't see),
       reveal it so it never stays invisible. */
    setTimeout(() => {
      document.querySelectorAll(".fade-in:not(.shown)").forEach((el) =>
        el.classList.add("shown")
      );
    }, 2000);
  }

  /* Count-up on stats with data-count */
  function initCountUp() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    const animate = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      els.forEach(animate);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            animate(en.target);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    els.forEach((el) => obs.observe(el));
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    initFade();
    initCountUp();
    // expose year
    document.querySelectorAll("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));
  });
})();
