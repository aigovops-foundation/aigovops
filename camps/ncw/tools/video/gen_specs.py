"""Generate video specs for every tool page, matching the Claude template.
Reads docs/tools/<slug>.html -> tools/video/specs/<slug>.json (title/tool/cool/rules/outro slides
with narration). The 'rules' slide is the camp's three habits + the tool page's own 'data cost of
free' framing, so it's consistent + on-message across every tool."""
import html
import json
import pathlib
import re

TOOLS = pathlib.Path("docs/tools")
OUT = pathlib.Path("tools/video/specs")
OUT.mkdir(parents=True, exist_ok=True)
SKIP = {"lab-tools"}   # a bundle page, not a single tool

# nice display names where the h1 differs / needs disambiguation
NAME = {"chatgpt": "ChatGPT", "notebooklm": "NotebookLM", "chatprd": "ChatPRD", "n8n": "n8n",
        "magic-patterns": "Magic Patterns", "wispr-flow": "Wispr Flow", "bolt": "Bolt",
        "glean": "Glean", "gamma": "Gamma", "gemini": "Gemini", "granola": "Granola",
        "khanmigo": "Khanmigo", "lovable": "Lovable", "perplexity": "Perplexity",
        "replit": "Replit", "claude": "Claude"}


def _text(frag):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", frag))).strip()


def _section(page, heading_rx):
    m = re.search(r"<h2[^>]*>\s*" + heading_rx + r".*?</h2>(.*?)(?=<h2|\Z)", page, re.S | re.I)
    return _text(m.group(1)) if m else ""


def _sentences(t):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", t) if s.strip()]


def clip(s, n, ell=True):
    """Truncate on a WORD boundary (never mid-word). Adds an ellipsis for slide text; narration
    caps are set generously so a complete clause is never cut."""
    s = str(s).strip()
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(" ", 1)[0].rstrip(" ,;")
    return cut + ("…" if ell else "")


def build(slug, page):
    name = NAME.get(slug) or _text(re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S).group(1)).split("\n")[0]
    what = _section(page, r"What it does")
    best = _section(page, r"Best for")
    ws = _sentences(what)
    what_one = clip(" ".join(ws[:2]), 240, ell=False) if ws else f"{name} is one of the AI tools we teach at the camp."
    free = "There's a free tier to start" if re.search(r"\bfree\b", what + page[:4000], re.I) else "It's worth a look"

    # cool bullets: pull the role-tagged uses (Educators:/Teachers:/SMB…/Community…)
    roles = re.findall(r"(Educators?|Teachers?|SMB owners?|Small businesses?|Community leaders?|Nonprofits?|Utility|Tribal)[^:]*:\s*([^.]+)\.",
                       best)
    cool_lines, cool_say = [], []
    for role, use in roles[:3]:
        role = role.strip()
        u = use.strip().rstrip(",;")
        cool_lines.append(f"{role}: {clip(u, 150)}")
        cool_say.append(f"{role} can {clip(u, 220, ell=False)}")
    if not cool_lines:  # fallback: first two sentences of 'best for'
        bs = _sentences(best)[:2]
        cool_lines = [clip(b, 150) for b in bs] or ["A practical tool for teachers, small businesses, and community leaders."]
        cool_say = [clip(b, 220, ell=False) for b in bs] or ["it helps teachers, small businesses, and community leaders get real work done"]

    what_lines = [clip(s, 140) for s in ws[:3]] or [clip(what_one, 140)]

    spec = {
        "slug": slug, "tool": name, "voice": "narrator",
        "slides": [
            {"kind": "title", "title": name, "sub": "A 90-second guide · AiGovOps Foundation",
             "narration": f"A ninety-second guide to {name}, from the AiGovOps Foundation and the NCW AI Camp."},
            {"kind": "tool", "title": "What it is", "lines": what_lines,
             "narration": f"{what_one} {free}."},
            {"kind": "cool", "title": "What's cool for NCW", "lines": cool_lines,
             "narration": "Here's what's cool for our valley. " + "; ".join(cool_say) + "."},
            {"kind": "rules", "title": "The rules — the AiGovOps way",
             "lines": ["A human on the trigger — you read it before it goes out",
                       "Keep the receipts — save your prompt and the answer",
                       "Mind the data cost of “free” — no student records, IEPs, or private details in a free tool"],
             "narration": ("Now the rules, the AiGovOps way. Keep a human on the trigger: you read it "
                           "before it goes out. Keep the receipts: save your prompt and the answer. And "
                           "mind the data cost of free — never paste student records, an I-E-P, or a "
                           "customer's private details into a free tool, because free tools learn from "
                           "what you type.")},
            {"kind": "outro", "title": "Good AI, the NCW way.",
             "sub": "NCW AI Camp · Aug 11, 2026 · AiGovOps Foundation",
             "narration": f"Good A-I, the NCW way. That's {name}. Learn more at the NCW AI Camp. AiGovOps Foundation."},
        ],
    }
    return spec


made = []
for f in sorted(TOOLS.glob("*.html")):
    slug = f.stem
    if slug in SKIP:
        continue
    if slug == "claude" and (OUT / "claude.json").exists():
        made.append(slug + " (kept hand-tuned)")
        continue
    spec = build(slug, f.read_text())
    (OUT / f"{slug}.json").write_text(json.dumps(spec, indent=2, ensure_ascii=False))
    made.append(slug)
print(f"generated {len(made)} specs:")
for m in made:
    print(" ", m)
