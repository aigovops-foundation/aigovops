// Capture recipes — one per demo, the good path only, always with the
// staging rules baked in: synthetic data, nothing published, nothing sent.
//
// A recipe is { tool, track, steps: [...] } where each step is one of:
//   { goto: url }                          — navigate
//   { type: text }                         — type into the tool's composer
//   { send: true }                         — press Enter in the composer
//   { waitResponse: seconds }              — wait for the model to finish (settle time)
//   { shot: "slug", caption: "..." }       — screenshot -> stepN-slug.png
//   { click: selector }                    — click (citation, artifact tab, …)
//   { sleep: seconds }
//
// Composer selectors are tool-specific candidates; product UIs drift, so the
// runner tries each candidate and fails loudly with a debug screenshot.
// PILOT SET: 1-1, 1-4, 2-4, 4-1. Add the rest as they're proven live.

export const COMPOSERS = {
  chatgpt: ['#prompt-textarea', '[data-testid="prompt-textarea"]', 'div[contenteditable="true"]', "textarea"],
  claude: ['div[contenteditable="true"].ProseMirror', '[data-testid="chat-input"]', 'div[contenteditable="true"]'],
  google: ['div[contenteditable="true"]', 'rich-textarea div[contenteditable="true"]', "textarea"],
  copilot: ['#userInput', 'textarea[placeholder]', 'div[contenteditable="true"]', "textarea"],
};

export const RECIPES = {
  "1-1": {
    tool: "chatgpt",
    track: "free",
    title: "The grants question — ChatGPT Search",
    steps: [
      { goto: "https://chatgpt.com/" },
      { shot: "blank", caption: "Start clean: a fresh chat, search enabled." },
      { type: "What are the top 5 STEM grants under $10K a Chelan County middle-school teacher can apply for in the next 90 days, with deadlines and eligibility?" },
      { shot: "prompt", caption: "The exact prompt from the card, typed in full." },
      { send: true },
      { waitResponse: 45 },
      { shot: "answer", caption: "The answer with source pills — the citations are the doors." },
    ],
  },
  "1-4": {
    tool: "claude",
    track: "free",
    title: "Parent night deck — Claude Artifact",
    steps: [
      { goto: "https://claude.ai/new" },
      { type: "Make a 6-slide parent-night deck for a 6th-grade class on how we're using AI this year — one slide per topic: what we use, what we don't, how we protect student data, how kids show their work, how parents can help, how to reach me. Build it as a self-contained HTML slide deck artifact." },
      { shot: "prompt", caption: "The prompt asks for the deck as an HTML Artifact." },
      { send: true },
      { waitResponse: 90 },
      { shot: "artifact", caption: "The deck lands as a shareable artifact — forty seconds of machine." },
    ],
  },
  "2-4": {
    tool: "claude",
    track: "free",
    title: "The 5-sentence disconnect policy — Claude",
    steps: [
      { goto: "https://claude.ai/new" },
      { type: "Here is a utility disconnect policy (synthetic demo stand-in): customers must receive written notice 10 days before disconnection for non-payment, a second notice 48 hours before, an offer of a payment plan, medical-hold protection on request with a physician letter, and no disconnections on Fridays, weekends, holidays, or days below 32°F. Turn this into a 5-sentence field card a lineworker can read in the truck. Keep every legal requirement. Lose every adverb. Then table every requirement in the original against the sentence that carries it, and flag any requirement with no sentence." },
      { shot: "prompt", caption: "Compression + the audit table, asked for together." },
      { send: true },
      { waitResponse: 60 },
      { shot: "card-and-audit", caption: "Five sentences, and the requirement-by-requirement audit — proven, not vibed." },
    ],
  },
  "4-1": {
    tool: "chatgpt",
    track: "free",
    title: "The 5-sentence front-desk policy — ChatGPT",
    steps: [
      { goto: "https://chatgpt.com/" },
      { type: "Draft a 5-sentence AI-use policy for a small primary care clinic front desk. Cover: what patient data can and cannot go into an LLM, when to disclose AI use to a patient, and who to call if unsure. Plain English, one page, 8th-grade reading level." },
      { shot: "prompt", caption: "The exact prompt from the card." },
      { send: true },
      { waitResponse: 45 },
      { shot: "policy", caption: "Five sentences on the desk in 30 seconds — the doctor's edit comes next." },
    ],
  },
};
