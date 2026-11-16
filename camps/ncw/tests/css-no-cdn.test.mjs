// Every page loads the compiled Tailwind stylesheet; none loads the Play CDN (a 3 MB dev-only script
// Tailwind itself says not to use in production) or carries an inline tailwind.config.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : []; });
const css = statSync("docs/assets/css/tailwind.css");
let bad = [];
if (css.size < 20_000) bad.push(`docs/assets/css/tailwind.css is only ${css.size} bytes — run npm run build:css`);
for (const f of walk("docs")) {
  const s = readFileSync(f, "utf8");
  for (const [, src] of s.matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/gi)) {
    const host = URL.canParse(src) ? new URL(src).hostname : "";
    if (host === "cdn.tailwindcss.com") bad.push(`${f}: still loads the Tailwind Play CDN`);
  }
  if (/tailwind\.config\s*=/.test(s)) bad.push(`${f}: still carries an inline tailwind.config`);
  if (/\bclass="[^"]*\b(bg|text|flex|grid|p|m|px|py|mx|my|rounded)-/.test(s)) {
    const want = relative(dirname(f), "docs/assets/css/tailwind.css").split("\\").join("/");
    if (!s.includes(`href="${want}"`)) bad.push(`${f}: uses Tailwind classes but does not link ${want}`);
  }
}
if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
console.log(`css-no-cdn: ${walk("docs").length} pages link the compiled stylesheet; no CDN, no inline config`);
