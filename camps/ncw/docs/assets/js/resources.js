/* ============================================================
   NCW Resources — Sli.do question bank, tool inventory, citations.
   ============================================================ */
(function () {
  "use strict";

  var QBANK = [
    { cat: "Positive & Curious", color: "green", qs: [
      { q: "How do I get my students started with AI tutoring this fall?", who: "Bob", a: "Start with Khanmigo — free for qualified districts, curriculum-aligned, and built to ask questions instead of giving answers. Write your 5-sentence classroom AI policy before day one, and apply the two-eyes rule from the start." },
      { q: "Is Deep Think available on the free version of Gemini?", who: "Ken", a: "It launched at the top tier, but thinking-mode access keeps rolling down to free accounts — check your settings. Ask: what's 3 minutes of compute worth against 2 hours of a teacher's Sunday?" },
      { q: "What's the single best first AI habit for a small business in NCW?", who: "Bob", a: "Make a Google Drive folder called \u201cAI Receipts\u201d today. Save every prompt and output. That one habit satisfies \u201ckeep the receipts,\u201d protects you in a dispute, and builds a personal library of prompts that work." },
      { q: "Can AI help close the gap for ELL students specifically?", who: "Bob", a: "Yes — the Stanford GSE RCT and the npj Science of Learning review both found the biggest gains in underserved populations, because they had the fewest human tutoring hours. The key is an AI that asks questions in the student's dominant language." },
      { q: "What does the AIGovOps Foundation actually do — and why is it free?", who: "Ken", a: "A 501(c)(3) building open-source governance tools — Beacon, Umbrella, Lantern — all Apache-2.0. Free because the mission is to empower rural and small communities; charging districts would defeat it." }
    ]},
    { cat: "Skeptical", color: "blue", qs: [
      { q: "How do we know the +34% Stanford result isn't cherry-picked?", who: "Ken", a: "It was a 6-month randomized controlled trial across 200 schools, not a vendor case study. The same evidence base includes the MIT \u221215.3% finding — the truth is both, and the Pledge is designed to get the +34% while refusing the \u221215%." },
      { q: "AI tools come and go. Why learn something obsolete in two years?", who: "Bob", a: "The tools will change; the skills won't — writing a clear prompt, evaluating output critically, keeping a human in the loop. Those transfer to every tool that follows, like spreadsheet skills moved from Lotus to Excel." },
      { q: "Doesn't the 1-in-3 cheating stat mean AI just makes cheating easier?", who: "Ken", a: "Cornell's conclusion wasn't \u201cban AI,\u201d it was \u201crethink assessment.\u201d A five-paragraph essay a chatbot answers in three seconds is a 1990s test meeting a 2026 tool. Design assessments that measure thinking in process." },
      { q: "How do I know the AI isn't just telling me what I want to hear?", who: "Ken", a: "That's sycophancy, and it's real. The fix is the Model Council — ask three models the same hard question. Where they agree is likely solid; where they disagree is where your judgment goes." },
      { q: "My colleagues say AI is just autocomplete on steroids. Are they wrong?", who: "Bob", a: "Partly right about how it works, wrong about what it means. \u201cAutocomplete\u201d that drafts an IEP, translates a notice, and tutors a struggling reader is a tool worth governing well — the mechanism matters less than the outcome." }
    ]},
    { cat: "Hostile / Policy", color: "orange", qs: [
      { q: "Aren't you just doing Google and OpenAI's marketing?", who: "Ken", a: "We name tools because people need to start somewhere, but everything we build is open-source and vendor-neutral. We'll teach Gemini, Claude, and ChatGPT side by side — and tell you when a free, offline tool is the better call." },
      { q: "Why not just ban AI entirely, like some NYC council members ask?", who: "Bob", a: "Bans push it underground — students still use it, just without disclosure or a human in the loop, which is exactly Jake's story. Governance, not prohibition, is the only move that actually works." },
      { q: "The Senate opened a GAO probe. Shouldn't we wait for findings?", who: "Ken", a: "Waiting is itself a choice — kids and businesses are using AI right now, ungoverned. A 5-sentence policy and an inventory today is reversible and safe; doing nothing while you wait is neither." },
      { q: "Who owns the data when my kid's school uses a free AI tool?", who: "Ken", a: "Read the terms — many free tools train on your inputs. That's why FERPA-safe means no student identifiers in a free tool, and why the inventory step exists: you can't govern what you can't see." },
      { q: "Isn't AI grading just automating systemic racism?", who: "Bob", a: "It can be, which is why grading is on the red list — never AI without human authorship and review. The same evidence that shows bias is why we measure both outcomes and fairness, and keep the receipts." }
    ]},
    { cat: "Technical", color: "purple", qs: [
      { q: "What's the difference between Deep Think and standard Gemini?", who: "Ken", a: "Standard Gemini answers fast from pattern. Deep Think spends more compute reasoning step by step and shows its work — so on a hard, high-stakes question you can see why, not just what." },
      { q: "What is a Model Council and how do I run one?", who: "Ken", a: "Open three frontier models in three tabs, ask the same question, then have a fourth synthesize and a human decide. The open-source AI Council Framework on GitHub automates the pattern." },
      { q: "Are there AI tools that work offline — for poor connectivity?", who: "Bob", a: "Yes — small local models run on a laptop for drafting and summarizing, and several tutoring tools cache lessons offline. For an orchard or a rural classroom, that resilience matters." },
      { q: "How do AI tools handle Spanish content? Our district is 40% Hispanic.", who: "Bob", a: "Frontier models translate well and tutor in Spanish; translating every public notice and agenda is the highest-leverage equity move a small district or city can make, at near-zero cost." },
      { q: "What's the Foundation's Beacon tool doing under the hood?", who: "Ken", a: "Beacon scans your environment to discover every AI tool in use, what data it touches, and whether it's approved — turning the manual inventory spreadsheet into an automated, repeatable report." }
    ]},
    { cat: "NCW-Specific", color: "green", qs: [
      { q: "No IT budget, one part-time tech coordinator. Where do we start?", who: "Bob", a: "A spreadsheet inventory, a one-page traffic-light policy, and a parent letter — all free, all this week. Designate one AI lead per building with a small stipend, and you're ahead of districts ten times your size." },
      { q: "Can AI help orchard operations — frost, irrigation, harvest timing?", who: "Bob", a: "Yes — AI models combine weather, soil, and historical data for frost alerts and irrigation scheduling. Keep the grower in the loop on every decision; AI advises, the human who knows the block decides." },
      { q: "What about Indigenous data sovereignty for tribal nations here?", who: "Ken", a: "Critical and non-negotiable. Tribal data governance means tribes control their own data — any AI work with regional tribes starts from their sovereignty, not from a vendor's default terms." },
      { q: "We're a 3-staff, $400K nonprofit. Is any of this for us?", who: "Bob", a: "Especially for you. The 5-Hours-Back camp is built for exactly your size — AI does the grant-drafting, the social posts, the spreadsheet cleanup, so your three people spend their hours on mission." },
      { q: "How does NCW stay involved after today?", who: "Bob", a: "The NCW Tech Alliance AI in Action series continues year-round, the Pledge is a living document on GitHub, and the Foundation's tools and Substack keep the community connected. Today is a start, not an end." }
    ]}
  ];

  var TOOLS = [
    { name: "Gemini", url: "https://gemini.google.com", note: "Everyday assistant + Deep Think reasoning", tag: "Free / Pro" },
    { name: "Perplexity", url: "https://www.perplexity.ai", note: "Answer engine with cited sources", tag: "Free / Pro" },
    { name: "Gamma", url: "https://gamma.app", note: "Slide decks from an outline in seconds", tag: "Free / Pro" },
    { name: "NotebookLM", url: "https://notebooklm.google.com", note: "Grounded notebook over your own docs", tag: "Free" },
    { name: "Granola", url: "https://www.granola.ai", note: "Meeting notes that take themselves", tag: "$18/mo" },
    { name: "Wispr Flow", url: "https://wisprflow.ai", note: "Fast, accurate voice-to-text everywhere", tag: "Paid" },
    { name: "Khanmigo", url: "https://www.khanmigo.com", note: "Tutor that asks, never just answers", tag: "Free for students" },
    { name: "Canva", url: "https://www.canva.com", note: "Design + AI for posts and flyers", tag: "Free / Pro" },
    { name: "ElevenLabs", url: "https://elevenlabs.io", note: "Natural AI voice & audio", tag: "Free / Paid" },
    { name: "Glean", url: "https://www.glean.com", note: "Enterprise search across your work", tag: "Enterprise" },
    { name: "Lovable", url: "https://lovable.dev", note: "Build a working web app by chatting", tag: "Free / Pro" },
    { name: "Bolt", url: "https://bolt.new", note: "Prompt-to-app in the browser", tag: "Free / Pro" },
    { name: "n8n", url: "https://n8n.io", note: "Open-source workflow automation", tag: "Open source" },
    { name: "AIGovOps Beacon · Umbrella · Lantern", url: "https://www.aigovops-foundation.com", note: "Open-source governance: discover, control, report", tag: "Apache-2.0" }
  ];

  var CITATIONS = [
    { label: "Stanford GSE RCT — +34% with AI tutors (June 2026)", url: "https://www.instagram.com/p/DZWP5QnFxuz/" },
    { label: "Khanmigo +23% mastery — Verodate, April 2026", url: "https://www.aimscollaboratory.org/resources-all/how-khan-academy-is-building-a-better-ai-tutor-our-most-recent-learnings" },
    { label: "Khan AIMS study — measured math gains", url: "https://www.aimscollaboratory.org/" },
    { label: "npj Science of Learning review — equity-positive gains", url: "https://etcjournal.com/2026/06/02/ai-and-the-promise-of-educational-equity/" },
    { label: "MIT / The Guardian — \u221215.3% critical thinking", url: "https://www.theguardian.com/us-news/2026/jun/19/chatbots-critical-thinking-skills" },
    { label: "Cornell — 1 in 3 students use GenAI (May 2026)", url: "https://scientificinquirer.com/2026/05/26/widespread-ai-misuse-by-college-students-signals-need-to-rethink-assessment/" },
    { label: "EdTech Magazine — deepfakes & K-12 cyberbullying", url: "https://edtechmagazine.com/k12/article/2026/06/deepfakes-education-cyberbullying-age-ai-perfcon" },
    { label: "NYT — NYC Council members urge AI pause", url: "https://www.nytimes.com/2026/06/09/nyregion/nyc-schools-council-members-ai-ban.html" },
    { label: "EdWeek — AFT plan & screen-ban calls", url: "https://www.edweek.org/technology/teachers-unions-ai-plan-calls-for-big-tech-tax-screen-bans-in-elementary-schools/2026/05" },
    { label: "US Senate — GAO investigation into AI in K-12", url: "https://www.bluntrochester.senate.gov/news/press-releases/news-ranking-member-blunt-rochester-and-chair-tuberville-lead-investigation-into-ai-and-k-12-education/" },
    { label: "Google — Gemini 3 Deep Think announcement", url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/" },
    { label: "AI Council Framework — open source", url: "https://github.com/focuslead/ai-council-framework" },
    { label: "NIST — AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    { label: "AI Bill of Rights for Education (draft)", url: "https://resources.norrageducation.org/resource/822/sneak-preview-a-blueprint-for-an-ai-bill-of-rights-for-education" }
  ];

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function renderQBank() {
    var mount = document.getElementById("qbank");
    if (!mount) return;
    mount.innerHTML = QBANK.map(function (group) {
      var items = group.qs.map(function (item) {
        var whoColor = item.who === "Ken" ? "bg-orchard/10 text-orchard" : "bg-signal/10 text-signal-dark";
        return '<details class="group rounded-2xl bg-white border border-charcoal/10 p-5">' +
          '<summary class="flex items-start justify-between gap-3 cursor-pointer select-none">' +
            '<span class="font-700 text-charcoal text-[15px] leading-snug">' + esc(item.q) + '</span>' +
            '<svg class="ev-chevron text-signal shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>' +
          '</summary>' +
          '<div class="mt-3 flex items-start gap-3">' +
            '<span class="shrink-0 text-[11px] font-700 uppercase tracking-wider px-2 py-1 rounded-full ' + whoColor + '">' + item.who + '</span>' +
            '<p class="text-charcoal/75 text-[14px] leading-relaxed">' + esc(item.a) + '</p>' +
          '</div></details>';
      }).join("");
      return '<div class="sc-' + group.color + '">' +
        '<h3 class="font-serif font-700 text-xl text-charcoal mb-4 flex items-center gap-2.5"><span class="w-2.5 h-2.5 rounded-full" style="background:var(--sc)"></span>' + esc(group.cat) + '</h3>' +
        '<div class="space-y-3 mb-8">' + items + '</div></div>';
    }).join("");
  }

  function renderTools() {
    var mount = document.getElementById("toolGrid");
    if (!mount) return;
    mount.innerHTML = TOOLS.map(function (t) {
      return '<a href="' + t.url + '" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-4 rounded-2xl bg-white border border-charcoal/10 p-5 hover:border-orchard/40 transition-colors lift">' +
        '<div class="min-w-0 flex-1"><p class="font-700 text-charcoal group-hover:text-orchard transition-colors leading-snug">' + esc(t.name) + '</p>' +
        '<p class="text-[13px] text-charcoal/60 mt-0.5">' + esc(t.note) + '</p></div>' +
        '<span class="shrink-0 text-[11px] font-700 text-charcoal/50 bg-cream-deep px-2.5 py-1 rounded-full">' + esc(t.tag) + '</span>' +
        '<svg class="shrink-0 text-charcoal/30 group-hover:text-orchard transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17 17 7M9 7h8v8"/></svg></a>';
    }).join("");
  }

  function renderCitations() {
    var mount = document.getElementById("citationList");
    if (!mount) return;
    mount.innerHTML = CITATIONS.map(function (c, i) {
      return '<li class="flex items-start gap-3 py-3 border-b border-charcoal/8">' +
        '<span class="shrink-0 font-serif font-700 text-charcoal/30 text-sm w-6">' + (i + 1) + '</span>' +
        '<a href="' + c.url + '" target="_blank" rel="noopener noreferrer" class="text-charcoal/80 hover:text-orchard transition-colors text-[15px] leading-snug">' + esc(c.label) +
        ' <span class="text-charcoal/35">&nearr;</span></a></li>';
    }).join("");
  }

  function init() { renderQBank(); renderTools(); renderCitations(); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
