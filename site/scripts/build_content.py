#!/usr/bin/env python3
"""Drop a story in a folder and it publishes.

    content/stories/<anything>.md  →  blog/<slug>.html  +  a card at the top of blog.html  +  feed.xml

Ken writes Markdown with three lines of front matter and never touches HTML, a PR, or a test:

    ---
    title: Doing AI better, September
    date: 2026-09-15
    author: Ken Johnston          # optional; default Ken Johnston
    summary: One sentence for the card and the feed.   # optional; default first paragraph
    image: https://…              # optional; default the Foundation logo
    slug: doing-ai-better-september   # optional; default from the filename
    ---
    The story, in Markdown.

The rendered post uses blog/what-is-aigovops.html as its skeleton (same header, footer, fonts,
CSP, feedback loader), so a generated post is indistinguishable from a hand-made one. blog.html
cards for generated stories live between <!-- content:start --> and <!-- content:end -->; the
hand-made cards below the markers are never touched. feed.xml gets one <item> per story, newest
first, ahead of the legacy items. Files starting with an underscore (the template) are ignored.

Run locally:  python3 scripts/build_content.py          (needs: pip install markdown)
In CI:        .github/workflows/publish-content.yml runs this on every push to content/**
"""
import datetime as dt
import glob
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORIES = os.path.join(ROOT, "content", "stories")
TEMPLATE = os.path.join(ROOT, "blog", "what-is-aigovops.html")
BLOG_INDEX = os.path.join(ROOT, "blog.html")
FEED = os.path.join(ROOT, "feed.xml")
SITE = "https://www.aigovops-foundation.com"
DEFAULT_IMAGE = f"{SITE}/images/story-default.png"
START, END = "<!-- content:start -->", "<!-- content:end -->"
# ONE PATH (2026-09-02): every story also becomes a newsletter section and a LinkedIn draft, written
# to content/drafts/<slug>.newsletter.md and <slug>.linkedin.md. Both end on the same door — the
# ten-minute Gate Check — tagged with the channel, so the funnel can say which path brought people.
DRAFTS = os.path.join(ROOT, "content", "drafts")
GATE_CHECK = "https://community.aigovops-foundation.com/gate-check.html"
LINKEDIN_LIMIT = 1300
HASHTAGS = "#AIGovernance #AiGovOps #ResponsibleAI"


def parse(path):
    raw = open(path, encoding="utf-8").read()
    meta = parse_text(raw, path=path)
    meta["path"] = path
    return meta


def parse_text(raw, slug=None, date=None, image=None, path="<text>"):
    """Front matter + body → meta. Used for story files and for their cached translations (which keep
    the English slug, date and image so the Spanish page sits beside the English one)."""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", raw, re.S)
    if not m:
        raise SystemExit(f"{path}: needs front matter (--- title/date --- then the story)")
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.lstrip().startswith("#"):
            k, v = line.split(":", 1)
            meta[k.strip().lower()] = v.split("  #")[0].strip().strip('"').strip("'")
    body = m.group(2).strip()
    for k in ("title", "date"):
        if not meta.get(k):
            raise SystemExit(f"{path}: front matter needs '{k}:'")
    if date:
        meta["date"] = date
    dt.date.fromisoformat(meta["date"])            # validates YYYY-MM-DD
    base = os.path.splitext(os.path.basename(path))[0]
    if slug:
        meta["slug"] = slug
    meta.setdefault("slug", re.sub(r"[^a-z0-9]+", "-", re.sub(r"^\d{4}-\d{2}(-\d{2})?-", "", base).lower()).strip("-"))
    meta.setdefault("author", "Ken Johnston")
    if image:
        meta["image"] = image
    meta.setdefault("image", DEFAULT_IMAGE)
    first_para = next((p.strip() for p in re.split(r"\n\s*\n", body) if p.strip() and not p.strip().startswith("#")), "")
    meta.setdefault("summary", re.sub(r"[*_`\[\]()>#]", "", first_para)[:220])
    words = len(re.findall(r"\w+", body))
    meta["minutes"] = max(1, round(words / 220))
    meta["body_md"] = body
    return meta


def render_md(md_text):
    try:
        import markdown
    except ImportError:
        raise SystemExit("pip install markdown   (the publish workflow does this for you)")
    out = markdown.markdown(md_text, extensions=["extra", "sane_lists", "smarty"])
    # match the hand-made posts' paragraph rhythm
    return out.replace("<p>", '<p style="margin-bottom:20px">')


def month_year(d):
    return dt.date.fromisoformat(d).strftime("%B %Y")


def render_post(meta):
    t = open(TEMPLATE, encoding="utf-8").read()
    title = html.escape(meta["title"])
    desc = html.escape(meta["summary"])
    url = f"{SITE}/blog/{meta['slug']}.html"
    # metadata: replace every occurrence of the template's own values
    old_title = re.search(r"<title>(.*?) \| AiGovOps Foundation</title>", t).group(1)
    old_desc = re.search(r'<meta name="description" content="(.*?)" />', t).group(1)
    old_url = re.search(r'<link rel="canonical" href="(.*?)" />', t).group(1)
    old_img = re.search(r'<meta property="og:image" content="(.*?)" />', t).group(1)
    t = t.replace(old_title, title).replace(old_desc, desc).replace(old_url, url).replace(old_img, html.escape(meta["image"]))
    t = re.sub(r'"datePublished": "[^"]+"', f'"datePublished": "{meta["date"]}"', t)
    t = re.sub(r'<meta name="author" content="[^"]+" />', f'<meta name="author" content="{html.escape(meta["author"])}" />', t)
    t = re.sub(r'"author": \{ "@type": "Person", "name": "[^"]+" \}', f'"author": {{ "@type": "Person", "name": "{html.escape(meta["author"])}" }}', t)
    # visible header: author · month · read time
    t = re.sub(r'(<span style="font-weight:600;color:var\(--text\)">)[^<]+(</span>)', rf'\g<1>{html.escape(meta["author"])}\g<2>', t, count=1)
    t = re.sub(r'(<span>&middot;</span><span>)[^<]+(</span>\s*<span>&middot;</span><span>)[^<]+(</span>)',
               rf'\g<1>{month_year(meta["date"])}\g<2>{meta["minutes"]} min read\g<3>', t, count=1)
    # hero image alt
    t = re.sub(r'(<img src=")[^"]+(" alt=")[^"]*(" loading="lazy" style="width:100%)', rf'\g<1>{html.escape(meta["image"])}\g<2>{title}\g<3>', t, count=1)
    # body: everything inside the post-body div
    body_html = render_md(meta["body_md"])
    t = re.sub(r'(<div class="post-body"[^>]*>)(.*?)(\n  </div>)', lambda m: m.group(1) + "\n" + body_html + m.group(3), t, count=1, flags=re.S)
    return t


def card(meta):
    return (f'    <article class="blog-card" data-content-slug="{meta["slug"]}">\n'
            f'      <img class="blog-card-img" src="{html.escape(meta["image"])}" alt="{html.escape(meta["title"])}" loading="lazy" />\n'
            f'      <div class="blog-card-body">\n'
            f'        <div class="blog-card-meta"><span class="author">{html.escape(meta["author"])}</span> &middot; {dt.date.fromisoformat(meta["date"]).strftime("%b %Y")} &middot; {meta["minutes"]} min read</div>\n'
            f'        <h3><a href="blog/{meta["slug"]}.html">{html.escape(meta["title"])}</a></h3>\n'
            f'        <p>{html.escape(meta["summary"])}</p>\n'
            f'        <a class="blog-card-link" href="blog/{meta["slug"]}.html">Read more →</a>\n'
            f'      </div>\n    </article>\n')


def update_index(metas):
    t = open(BLOG_INDEX, encoding="utf-8").read()
    block = START + "\n" + "".join(card(m) for m in metas) + "    " + END
    if START in t and END in t:
        t = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: block, t, flags=re.S)
    else:
        t = t.replace('<div class="blog-grid">\n', '<div class="blog-grid">\n' + block + "\n", 1)
    open(BLOG_INDEX, "w", encoding="utf-8").write(t)


def rfc822(d):
    return dt.datetime.combine(dt.date.fromisoformat(d), dt.time(9, 0), tzinfo=dt.timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")


def update_feed(metas):
    t = open(FEED, encoding="utf-8").read()
    # drop every item this script generated before (marked), keep the hand-made/LinkedIn items
    t = re.sub(r"\s*<item><!-- content -->(?:(?!</item>).)*?</item>", "", t, flags=re.S)
    items = "".join(
        f"\n    <item><!-- content -->\n      <title>{html.escape(m['title'])}</title>\n      <link>{SITE}/blog/{m['slug']}.html</link>\n"
        f"      <guid isPermaLink=\"true\">{SITE}/blog/{m['slug']}.html</guid>\n      <pubDate>{rfc822(m['date'])}</pubDate>\n"
        f"      <dc:creator>{html.escape(m['author'])}</dc:creator>\n      <description>{html.escape(m['summary'])}</description>\n    </item>"
        for m in metas)
    t = re.sub(r"(<lastBuildDate>)[^<]*(</lastBuildDate>)", rf"\g<1>{dt.datetime.now(dt.timezone.utc).strftime('%a, %d %b %Y %H:%M:%S +0000')}\g<2>", t, count=1)
    # insert after the channel's <image>…</image> block if present, else after <atom:link …/>
    if "</image>" in t:
        t = t.replace("</image>", "</image>" + items, 1)
    else:
        t = re.sub(r"(<atom:link[^>]*/>)", lambda m: m.group(1) + items, t, count=1)
    open(FEED, "w", encoding="utf-8").write(t)


SITEMAP = os.path.join(ROOT, "sitemap.xml")


def update_sitemap(metas):
    """Keep sitemap.xml current for generated story pages, and only those.

    ADDED 2026-09-30. Nothing wrote sitemap.xml, so every generated post was simply
    absent from it — five of fourteen by the time anyone checked, and the gap grew by
    one every Tuesday. `docs/version-control/VERSION-CONTROL.md` §6 has asked for
    "New pages added to sitemap.xml" on every PR since the beginning; a checklist item
    that depends on a person remembering is the kind this estate has learned to automate.

    Same marker discipline as update_index() and update_feed(): generated entries live
    between markers and are rewritten wholesale, every hand-made entry above them is left
    exactly alone. The existing file's formatting is inconsistent (some entries on one
    line, some across three, some with no lastmod at all) — that is deliberately not
    normalised, because reflowing lines nobody asked about buries the real change.
    """
    if not os.path.exists(SITEMAP):
        print("build_content: sitemap.xml absent — skipped (nothing to keep current)")
        return 0
    t = open(SITEMAP, encoding="utf-8").read()
    t = re.sub(r"\s*<url><!-- content -->(?:(?!</url>).)*?</url>", "", t, flags=re.S)

    entries = []
    for m in metas:
        entries.append(f'\n  <url><!-- content --><loc>{SITE}/blog/{m["slug"]}.html</loc>'
                       f'<lastmod>{m["date"]}</lastmod>'
                       f'<changefreq>monthly</changefreq><priority>0.7</priority></url>')
        # Translated pages are real, indexable URLs with their own content, so they
        # belong here too — and render_translations() only writes one when a cached
        # translation exists, so this follows what was actually published.
        for lang in LANGS:
            if os.path.exists(os.path.join(ROOT, "blog", lang, f"{m['slug']}.html")):
                entries.append(
                    f'\n  <url><!-- content --><loc>{SITE}/blog/{lang}/{m["slug"]}.html</loc>'
                    f'<lastmod>{m["date"]}</lastmod>'
                    f'<changefreq>monthly</changefreq><priority>0.6</priority></url>')

    block = "".join(entries)
    if "</urlset>" not in t:
        print("build_content: sitemap.xml has no </urlset> — left untouched")
        return 0
    t = t.replace("</urlset>", f"{block}\n</urlset>", 1)
    open(SITEMAP, "w", encoding="utf-8").write(t)
    return len(entries)


def _plain(md_text):
    """Markdown → plain sentences for a social/email draft (no headings, links become their text)."""
    t = re.sub(r"^#+\s.*$", "", md_text, flags=re.M)
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", t)
    t = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", t)
    t = re.sub(r"[*_`>]", "", t)
    # a paragraph wrapped at 90 columns in the editor is one paragraph on LinkedIn
    return [re.sub(r"\s*\n\s*", " ", p.strip()) for p in re.split(r"\n\s*\n", t) if p.strip()]


def _trim(text, limit):
    if len(text) <= limit:
        return text
    cut = text[: limit - 1]
    cut = cut[: max(cut.rfind(". "), cut.rfind(" "))].rstrip(" ,;:—-")
    return cut + "…"


def newsletter_draft(meta):
    url = f"{SITE}/blog/{meta['slug']}.html?src=newsletter"
    paras = _plain(meta["body_md"])
    lead = " ".join(paras[:2])
    return (f"Subject: {meta['title']}\n\n"
            f"{_trim(lead, 700)}\n\n"
            f"Read the whole story: {url}\n\n"
            f"Ten minutes, no account — the Gate Check: {GATE_CHECK}?src=newsletter\n\n"
            f"— {meta['author']}, AiGovOps Foundation\n")


def linkedin_draft(meta):
    url = f"{SITE}/blog/{meta['slug']}.html?src=linkedin"
    paras = _plain(meta["body_md"])
    tail = (f"\n\nFull story: {url}\n"
            f"Ten minutes, no account — the Gate Check: {GATE_CHECK}?src=linkedin\n\n{HASHTAGS}\n")
    hook = meta["title"].strip()
    room = LINKEDIN_LIMIT - len(hook) - 2 - len(tail)
    body = _trim(" ".join(paras[:3]), room)
    return f"{hook}\n\n{body}{tail}"


def write_drafts(metas):
    os.makedirs(DRAFTS, exist_ok=True)
    keep = set()
    for m in metas:
        for kind, fn in (("newsletter", newsletter_draft), ("linkedin", linkedin_draft)):
            p = os.path.join(DRAFTS, f"{m['slug']}.{kind}.md")
            open(p, "w", encoding="utf-8").write(fn(m))
            keep.add(os.path.basename(p))
    # a story that was removed takes its drafts with it (never a stale draft for a dead story)
    for f in glob.glob(os.path.join(DRAFTS, "*.md")):
        if os.path.basename(f) not in keep and not os.path.basename(f).startswith("_") and os.path.basename(f).upper() != "README.MD":
            os.remove(f)


# ── Founders from a file (plan step 2.3, Labor-Day-Big-Redesign) ─────────────────────────────
# content/founders.md is the source of truth for each founder's title, bio and the "In their words"
# quotes. The build rewrites ONLY those regions of founders.html (the page's frame, links and
# speaking section stay hand-authored), so Ken edits a text file and never HTML.
FOUNDERS_MD = os.path.join(ROOT, "content", "founders.md")
FOUNDERS_HTML = os.path.join(ROOT, "founders.html")
QUOTES_START, QUOTES_END = "<!-- founders:quotes:start -->", "<!-- founders:quotes:end -->"


def parse_founders(md_text):
    """→ {"ken": {title, hook, bio:[paras]}, "bob": {...}, "quotes": [(who, text)]}"""
    out = {"quotes": []}
    cur, key = None, None
    for raw in md_text.splitlines():
        line = raw.rstrip()
        if line.startswith("## "):
            h = line[3:].strip().lower()
            key = "ken" if h.startswith("ken") else "bob" if h.startswith("bob") else "quotes" if "words" in h else None
            if key in ("ken", "bob"):
                out[key] = {"title": "", "hook": "", "bio": []}
            cur = key
            continue
        if cur in ("ken", "bob"):
            if line.startswith("Title:"):
                out[cur]["title"] = line[6:].strip()
            elif line.startswith("Hook:"):
                out[cur]["hook"] = line[5:].strip()
            elif line.strip():
                out[cur]["bio"].append(line.strip())
        elif cur == "quotes" and line.startswith("- "):
            who, _, text = line[2:].partition(":")
            out["quotes"].append((who.strip(), text.strip().strip('"')))
    return out


def _esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _inline(t):
    t = _esc(t)
    t = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", t)
    return t


def render_founders():
    """Rewrite founders.html's title/bio/quotes regions from content/founders.md. No file → no-op.
    Returns the number of regions rewritten."""
    if not (os.path.exists(FOUNDERS_MD) and os.path.exists(FOUNDERS_HTML)):
        return 0
    data = parse_founders(open(FOUNDERS_MD, encoding="utf-8").read())
    html = open(FOUNDERS_HTML, encoding="utf-8").read()
    n = 0
    for who in ("ken", "bob"):
        f = data.get(who)
        if not f or not f["bio"]:
            continue
        sec = re.search(r'(<section class="founder-section" id="%s">.*?</section>)' % who, html, re.S)
        if not sec:
            continue
        block = sec.group(1)
        new = re.sub(r'<p class="founder-title">.*?</p>', '<p class="founder-title">' + _esc(f["title"]) + "</p>", block, count=1, flags=re.S)
        bio = "\n".join("          <p>" + _inline(p) + "</p>" for p in f["bio"])
        if f["hook"]:
            bio += '\n          <p class="founder-hook"><em>&ldquo;' + _esc(f["hook"]) + '&rdquo;</em></p>'
        new = re.sub(r'<div class="founder-bio">.*?</div>', '<div class="founder-bio">\n' + bio + "\n        </div>", new, count=1, flags=re.S)
        html = html.replace(block, new, 1)
        n += 1
    if data["quotes"]:
        items = "\n".join('        <blockquote class="founder-quote"><p>&ldquo;' + _esc(q) + '&rdquo;</p><cite>' + _esc(w) + "</cite></blockquote>" for w, q in data["quotes"])
        section = (QUOTES_START + '\n  <section class="founder-words" id="in-their-words">\n    <div class="container">\n      <h2>In their words</h2>\n'
                   + items + "\n    </div>\n  </section>\n  " + QUOTES_END)
        if QUOTES_START in html and QUOTES_END in html:
            html = html[:html.index(QUOTES_START)] + section + html[html.index(QUOTES_END) + len(QUOTES_END):]
        else:
            html = html.replace('  <section class="speaking-section">', section + '\n  <section class="speaking-section">', 1)
        n += 1
    open(FOUNDERS_HTML, "w", encoding="utf-8").write(html)
    return n


# ── Spanish story pages (plan step 3.3) ───────────────────────────────────────────────────────
# The site speaks EN/ES. Every story also renders as blog/es/<slug>.html, translated once by Claude
# Haiku (ANTHROPIC_API_KEY in the publish workflow) and CACHED at content/translations/<slug>.es.md so a
# rebuild never re-spends or drifts. Terms that must not be translated are pinned in GLOSSARY. With no
# key and no cache the Spanish page is simply not produced (and the build says so) — never a machine
# stub passed off as a translation. TRANSLATOR is pluggable so the test can swap in a fake.
TRANSLATIONS = os.path.join(ROOT, "content", "translations")
LANGS = ()   # English only since 2026-10-19 (Bob): no translated pages are rendered
GLOSSARY = ["Gate Check", "Beacon", "Umbrella", "Lantern", "AiGovOps", "Ship safe AI — never unsafe AI", "Tuesday Letter"]
TRANSLATOR = None   # callable(text, lang) -> text


def _claude_translate(text, lang):
    import json as _json
    import urllib.request
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    names = {"es": "Spanish"}
    sysmsg = (f"Translate the following Markdown story into natural {names.get(lang, lang)} for AI-governance practitioners. "
              "Keep Markdown structure, links and the YAML front matter keys exactly; translate the values of title and summary. "
              "Never translate these terms: " + ", ".join(GLOSSARY) + ". Return only the translated Markdown.")
    body = _json.dumps({"model": os.environ.get("TRANSLATE_MODEL", "claude-haiku-4-5"), "max_tokens": 6000,
                        "system": sysmsg, "messages": [{"role": "user", "content": text}]}).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body, headers={
        "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        out = _json.loads(r.read())
    return "".join(c.get("text", "") for c in out.get("content", []) if c.get("type") == "text").strip() or None


def translated_markdown(meta, lang):
    """Cached translation of the whole story file (front matter + body) or None."""
    os.makedirs(TRANSLATIONS, exist_ok=True)
    cache = os.path.join(TRANSLATIONS, f"{meta['slug']}.{lang}.md")
    if os.path.exists(cache):
        return open(cache, encoding="utf-8").read()
    src = open(meta["path"], encoding="utf-8").read() if meta.get("path") and os.path.exists(meta["path"]) else None
    if not src:
        return None
    fn = TRANSLATOR or _claude_translate
    try:
        out = fn(src, lang)
    except Exception:  # noqa: BLE001 — a translation hiccup skips the language, never breaks the build
        out = None
    if not out or not out.lstrip().startswith("---"):
        return None
    open(cache, "w", encoding="utf-8").write(out)
    return out


def render_translations(metas):
    """blog/<lang>/<slug>.html for every story with a translation; cross-links EN <-> lang. Returns count."""
    n = 0
    for m in metas:
        for lang in LANGS:
            md = translated_markdown(m, lang)
            if not md:
                continue
            tm = parse_text(md, m["slug"], m["date"], m.get("image"))
            page = render_post(tm)
            page = page.replace('<html lang="en">', f'<html lang="{lang}">', 1)
            page = page.replace(f'{SITE}/blog/{m["slug"]}.html', f'{SITE}/blog/{lang}/{m["slug"]}.html')
            page = page.replace('href="../', 'href="../../').replace('src="../', 'src="../../')
            page = page.replace('<div class="post-body"', f'<p class="lang-switch"><a href="../{m["slug"]}.html" hreflang="en">Read in English →</a></p>\n  <div class="post-body"', 1)
            outdir = os.path.join(ROOT, "blog", lang); os.makedirs(outdir, exist_ok=True)
            open(os.path.join(outdir, f"{m['slug']}.html"), "w", encoding="utf-8").write(page)
            # back-link on the English page
            en = os.path.join(ROOT, "blog", f"{m['slug']}.html")
            if os.path.exists(en):
                e = open(en, encoding="utf-8").read()
                link = f'<p class="lang-switch"><a href="{lang}/{m["slug"]}.html" hreflang="{lang}">Leer en español →</a></p>'
                if 'class="lang-switch"' not in e:
                    e = e.replace('<div class="post-body"', link + '\n  <div class="post-body"', 1)
                    open(en, "w", encoding="utf-8").write(e)
            n += 1
    return n


def main():
    files = sorted(f for f in glob.glob(os.path.join(STORIES, "*.md")) if not os.path.basename(f).startswith("_") and os.path.basename(f).upper() != "README.MD")
    allm = sorted((parse(f) for f in files), key=lambda m: m["date"], reverse=True)
    # The Letter runs itself: a story dated in the future waits in content/stories/ until its day.
    # publish-content.yml runs every Tuesday morning, so a dated story publishes on its date with
    # nobody at the keyboard. Drafts (newsletter + LinkedIn) are written a week ahead so Monday's
    # paste into Substack is ready. PUBLISH_UNTIL=YYYY-MM-DD overrides (the self-test uses it).
    until = dt.date.fromisoformat(os.environ.get("PUBLISH_UNTIL") or dt.date.today().isoformat())
    # `hold: true` in the front matter keeps a story out of every output until someone removes it —
    # the daily runbook email sets it when Ken or Bob replies NO to "publish?".
    held = [m for m in allm if str(m.get("hold", "")).lower() in ("true", "yes", "1")]
    live = [m for m in allm if m not in held]
    metas = [m for m in live if dt.date.fromisoformat(m["date"]) <= until]
    ahead = [m for m in live if dt.date.fromisoformat(m["date"]) <= until + dt.timedelta(days=7)]
    for m in held:
        print(f"build_content: {m['slug']} is HELD (hold: true) — not published, no drafts")
    for m in live:
        if m not in metas:
            print(f"build_content: {m['slug']} waits until {m['date']}")
    os.makedirs(os.path.join(ROOT, "blog"), exist_ok=True)
    for m in metas:
        out = os.path.join(ROOT, "blog", f"{m['slug']}.html")
        open(out, "w", encoding="utf-8").write(render_post(m))
        print(f"build_content: blog/{m['slug']}.html  ({m['date']}, {m['minutes']} min, {m['author']})")
    update_index(metas)          # zero stories -> an empty marker block, never a stale card
    update_feed(metas)
    write_drafts(ahead)
    nt = render_translations(metas)
    if nt:
        print(f"build_content: {nt} translated story page(s) under blog/<lang>/")
    # AFTER render_translations, not before: update_sitemap only lists a translated page
    # that actually exists on disk, so it has to run once those have been written.
    ns = update_sitemap(metas)
    if ns:
        print(f"build_content: sitemap.xml — {ns} generated URL(s)")
    nf = render_founders()
    if nf:
        print(f"build_content: founders.html — {nf} region(s) rendered from content/founders.md")
    print(f"build_content: {len(metas)} story/stories → blog.html cards + feed.xml + content/drafts/ (newsletter + LinkedIn)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
