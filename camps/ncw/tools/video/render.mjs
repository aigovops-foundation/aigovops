// Branded slide renderer for the AiGovOps tool-tutorial videos.
// spec JSON (tools/video/specs/<slug>.json) -> one 1920x1080 PNG per slide, garden-warm brand.
// Pairs with tts.py (ElevenLabs voiceover per slide) + assemble.sh (ffmpeg -> MP4).
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const specPaths = process.argv.slice(2);
if (!specPaths.length) { console.error("usage: node render.mjs specs/<slug>.json [more...]"); process.exit(1); }

const W = 1920, H = 1080;
const KICKER = { title: "", tool: "THE TOOL", cool: "WHAT’S COOL", rules: "THE RULES", outro: "" };
const ACCENT = { title: "#2E7D4F", tool: "#1F5E3A", cool: "#E07A2A", rules: "#2E7D4F", outro: "#2E7D4F" };
const MARK = `<svg width="46" height="46" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#2E7D4F"/><path d="M4 22 L11 11 L16 18 L21 9 L28 22 Z" fill="#FAF7F0"/><circle cx="24" cy="8" r="3" fill="#E07A2A"/></svg>`;

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function slideHTML(s, i, total) {
  const accent = ACCENT[s.kind] || "#2E7D4F";
  const kicker = KICKER[s.kind] || "";
  const isTitle = s.kind === "title", isOutro = s.kind === "outro";
  const body = (s.lines || []).map((l) =>
    `<li><span class="dot" style="background:${accent}"></span><span>${esc(l)}</span></li>`).join("");
  const center = isTitle || isOutro;
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    body{font-family:"Source Sans 3",system-ui,sans-serif;color:#2b2a26;
      background:radial-gradient(1400px 900px at 78% -10%, #F7F3E8 0%, #FAF7F0 55%);}
    .frame{position:absolute;inset:0;padding:96px 120px;display:flex;flex-direction:column;
      ${center ? "align-items:center;justify-content:center;text-align:center;" : "justify-content:center;"}}
    .brand{position:absolute;top:60px;left:120px;display:flex;align-items:center;gap:16px}
    .brand .wm{font-family:"Fraunces",serif;font-weight:700;font-size:27px;color:#2b2a26;line-height:1}
    .brand .wm small{display:block;font-family:"Source Sans 3";font-weight:600;font-size:15px;color:#6b6862;letter-spacing:.12em;text-transform:uppercase;margin-top:3px}
    .kicker{font-weight:700;font-size:24px;letter-spacing:.22em;color:${accent};text-transform:uppercase;margin-bottom:26px}
    h1{font-family:"Fraunces",serif;font-weight:700;color:#2b2a26;line-height:1.02;letter-spacing:-.5px;}
    .title h1{font-size:118px}
    .frame h1{font-size:${center ? 96 : 92}px}
    .sub{font-family:"Fraunces",serif;font-weight:600;font-size:40px;color:#6b6862;margin-top:22px}
    ul{list-style:none;margin-top:44px;display:flex;flex-direction:column;gap:26px;max-width:1400px}
    li{display:flex;align-items:flex-start;gap:22px;font-size:44px;line-height:1.32;font-weight:400;color:#333029}
    li b,li strong{font-weight:700;color:#1F5E3A}
    .dot{flex:0 0 auto;width:20px;height:20px;border-radius:6px;margin-top:16px}
    .bar{position:absolute;left:0;top:0;bottom:0;width:14px;background:${accent}}
    .foot{position:absolute;bottom:56px;left:120px;right:120px;display:flex;justify-content:space-between;align-items:center;
      font-size:22px;color:#8b877e;font-weight:600;border-top:1px solid #e6e1d6;padding-top:22px}
    .pill{background:${accent};color:#fff;border-radius:999px;padding:8px 22px;font-size:21px;font-weight:700;letter-spacing:.03em}
    .big-mark{transform:scale(2.6);margin-bottom:40px}
  </style></head>
  <body>
    <div class="bar"></div>
    ${center ? "" : `<div class="brand">${MARK}<div class="wm">AiGovOps Foundation<small>NCW AI Camp</small></div></div>`}
    <div class="frame ${s.kind}">
      ${isTitle ? `<div class="big-mark">${MARK}</div>` : ""}
      ${kicker ? `<div class="kicker">${kicker}</div>` : ""}
      <h1>${esc(s.title)}</h1>
      ${s.sub ? `<div class="sub">${esc(s.sub)}</div>` : ""}
      ${body ? `<ul>${body}</ul>` : ""}
    </div>
    <div class="foot">
      <span>aigovops-foundation.github.io/aigovops-ncw-ai-camp</span>
      <span class="pill">${isTitle || isOutro ? "AiGovOps Foundation" : "Good AI, the NCW way"}</span>
    </div>
  </body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
for (const specPath of specPaths) {
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const outDir = path.join("tools/video/out", spec.slug);
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < spec.slides.length; i++) {
    await page.setContent(slideHTML(spec.slides[i], i, spec.slides.length), { waitUntil: "networkidle" });
    await page.waitForTimeout(300); // let fonts settle
    await page.screenshot({ path: path.join(outDir, `slide_${String(i + 1).padStart(2, "0")}.png`) });
  }
  console.log(`rendered ${spec.slides.length} slides -> ${outDir}`);
}
await browser.close();
