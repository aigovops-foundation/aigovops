#!/usr/bin/env python3
"""Render the repo's Markdown docs into styled HTML pages in the AIGovOps "deep ocean" brand.

Dependency-free (stdlib only) so the static site stays buildable anywhere. Handles the constructs
these docs use: headings, GitHub pipe tables, ordered/unordered/checkbox lists, blockquotes, fenced
code, horizontal rules, and inline bold/italic/code/links/footnote-refs.

  python3 scripts/md2html.py docs/vendor-guide.md "Vendor Guide" docs/vendor-guide.html
"""
import html
import re
import sys

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — AIGovOps Vendor RFI</title>
<link rel="canonical" href="{canonical}">
<meta name="description" content="{title} — part of the AIGovOps open-source Vendor RFI.">
<meta property="og:title" content="{title} — AIGovOps Vendor RFI">
<meta property="og:type" content="article">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="https://aigovops-foundation.github.io/aigovops-vendor-rfi/assets/og-vendor-rfi.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* AIGovOps "deep ocean governance" brand — shared with Beacon & Umbrella */
:root{{--bg:#0e141b;--surface:#141c24;--surface2:#192330;--border:#2a333c;--text:#e2e7e9;--muted:#7e919a;
  --primary:#14b393;--primary2:#0f8e74;--radius:12px;
  --font:'Satoshi','General Sans',system-ui,Segoe UI,Roboto,Arial,sans-serif;
  --mono:'JetBrains Mono','Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace}}
*{{box-sizing:border-box}}body{{margin:0;font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.65}}
.topbar{{border-top:3px solid var(--primary);border-bottom:1px solid var(--border);padding:16px 20px}}
.topbar .inner{{max-width:860px;margin:0 auto;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}}
.eyebrow{{font-family:var(--mono);text-transform:uppercase;letter-spacing:.16em;font-size:11px;color:var(--primary);font-weight:500}}
.back{{color:var(--primary);text-decoration:none;font-weight:700;font-size:14px}}
.doc{{max-width:860px;margin:0 auto;padding:28px 20px 80px}}
.doc h1{{font-size:clamp(1.8rem,3.4vw,2.6rem);line-height:1.1;letter-spacing:-.01em;margin:.4em 0 .5em}}
.doc h2{{font-size:1.5rem;margin:1.8em 0 .5em;padding-bottom:.3em;border-bottom:1px solid var(--border)}}
.doc h3{{font-size:1.2rem;margin:1.5em 0 .4em;color:var(--primary)}}
.doc h4{{font-size:1.02rem;margin:1.2em 0 .3em;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}}
.doc p{{margin:.7em 0}}.doc a{{color:var(--primary)}}
.doc strong{{color:#fff}}
.doc ul,.doc ol{{margin:.6em 0;padding-left:1.4em}}.doc li{{margin:.3em 0}}
.doc li.task{{list-style:none;margin-left:-1.2em}}
.doc blockquote{{margin:1em 0;padding:.4em 1em;border-left:3px solid var(--primary);background:var(--surface);color:var(--muted);border-radius:0 8px 8px 0}}
.doc hr{{border:0;border-top:1px solid var(--border);margin:2em 0}}
.doc code{{font-family:var(--mono);font-size:.88em;background:var(--surface2);border:1px solid var(--border);border-radius:5px;padding:.08em .35em}}
.doc pre{{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;overflow:auto}}
.doc pre code{{background:none;border:0;padding:0}}
.doc sup{{color:var(--primary);font-size:.7em;font-weight:700}}
.doc table{{width:100%;border-collapse:collapse;margin:1.2em 0;font-size:.94rem;display:block;overflow-x:auto}}
.doc th,.doc td{{text-align:left;padding:.6em .8em;border:1px solid var(--border);vertical-align:top}}
.doc th{{background:var(--surface);color:var(--muted);font-weight:600;white-space:nowrap}}
.doc tr:nth-child(even) td{{background:rgba(255,255,255,.015)}}
</style>
</head>
<body>
<div class="topbar"><div class="inner">
  <span class="eyebrow">AiGovOps Foundation · Beacon × Umbrella</span>
  <a class="back" href="../index.html">↩ Overview</a>
</div></div>
<article class="doc">
{body}
</article>
</body>
</html>
"""


def inline(text):
    """Inline markdown -> HTML on already-trusted-structure text. Escapes HTML first."""
    out, codes = text, []
    # protect inline code spans
    def stash(m):
        codes.append(m.group(1)); return f"\x00{len(codes)-1}\x00"
    out = re.sub(r"`([^`]+)`", stash, out)
    out = html.escape(out, quote=False)
    out = re.sub(r"\[\^(\d+)\]", r"<sup>\1</sup>", out)                       # footnote refs
    out = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', out)     # links
    out = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", out)             # bold
    out = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", out)    # italic
    for i, c in enumerate(codes):
        out = out.replace(f"\x00{i}\x00", f"<code>{html.escape(c, quote=False)}</code>")
    return out


def render(md):
    lines = md.split("\n")
    out, i, n = [], 0, len(lines)
    while i < n:
        ln = lines[i]
        s = ln.strip()
        if not s:
            i += 1; continue
        if s.startswith("```"):                                              # fenced code
            i += 1; buf = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(html.escape(lines[i], quote=False)); i += 1
            i += 1; out.append("<pre><code>" + "\n".join(buf) + "</code></pre>"); continue
        if re.fullmatch(r"(\*\s*){3,}|(-\s*){3,}|(_\s*){3,}", s):             # hr (*** --- ___)
            out.append("<hr>"); i += 1; continue
        m = re.match(r"(#{1,4})\s+(.*)", s)
        if m:
            lvl = len(m.group(1)); out.append(f"<h{lvl}>{inline(m.group(2))}</h{lvl}>"); i += 1; continue
        if "|" in s and i + 1 < n and re.fullmatch(r"\s*\|?[\s:|-]+\|?\s*", lines[i+1].strip()) and "-" in lines[i+1]:
            header = [c.strip() for c in s.strip("|").split("|")]
            i += 2; rows = []
            while i < n and "|" in lines[i] and lines[i].strip():
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            t = ["<table><thead><tr>"] + [f"<th>{inline(h)}</th>" for h in header] + ["</tr></thead><tbody>"]
            for r in rows:
                t.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>")
            t.append("</tbody></table>"); out.append("".join(t)); continue
        if s.startswith(">"):                                                # blockquote
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip()); i += 1
            out.append("<blockquote>" + inline(" ".join(buf)) + "</blockquote>"); continue
        if re.match(r"[-*]\s+|[-*]\s+\[[ xX]\]", s):                          # unordered / task list
            buf = []
            while i < n and re.match(r"[-*]\s+", lines[i].strip()):
                item = re.sub(r"^[-*]\s+", "", lines[i].strip())
                tm = re.match(r"\[([ xX])\]\s+(.*)", item)
                if tm:
                    box = "☑" if tm.group(1).lower() == "x" else "☐"
                    buf.append(f'<li class="task">{box} {inline(tm.group(2))}</li>')
                else:
                    buf.append(f"<li>{inline(item)}</li>")
                i += 1
            out.append("<ul>" + "".join(buf) + "</ul>"); continue
        if re.match(r"\d+\.\s+", s):                                          # ordered list
            buf = []
            while i < n and re.match(r"\d+\.\s+", lines[i].strip()):
                buf.append("<li>" + inline(re.sub(r"^\d+\.\s+", "", lines[i].strip())) + "</li>"); i += 1
            out.append("<ol>" + "".join(buf) + "</ol>"); continue
        buf = []                                                             # paragraph
        while i < n and lines[i].strip() and not re.match(r"(#{1,4}\s|[-*]\s|\d+\.\s|>|```)", lines[i].strip()):
            buf.append(lines[i].strip()); i += 1
        out.append("<p>" + inline(" ".join(buf)) + "</p>")
    return "\n".join(out)


def main():
    src, title, dst = sys.argv[1], sys.argv[2], sys.argv[3]
    body = render(open(src, encoding="utf-8").read())
    canonical = "https://aigovops-foundation.github.io/aigovops-vendor-rfi/" + dst.replace("\\", "/")
    open(dst, "w", encoding="utf-8").write(SHELL.format(title=html.escape(title), canonical=canonical, body=body))
    print(f"wrote {dst}  ({len(body)} chars of body)")


if __name__ == "__main__":
    main()
