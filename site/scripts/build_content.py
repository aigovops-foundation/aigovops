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
DEFAULT_IMAGE = f"{SITE}/images/logo.png"
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
    dt.date.fromisoformat(meta["date"])            # validates YYYY-MM-DD
    base = os.path.splitext(os.path.basename(path))[0]
    meta.setdefault("slug", re.sub(r"[^a-z0-9]+", "-", re.sub(r"^\d{4}-\d{2}(-\d{2})?-", "", base).lower()).strip("-"))
    meta.setdefault("author", "Ken Johnston")
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


def main():
    files = sorted(f for f in glob.glob(os.path.join(STORIES, "*.md")) if not os.path.basename(f).startswith("_") and os.path.basename(f).upper() != "README.MD")
    metas = sorted((parse(f) for f in files), key=lambda m: m["date"], reverse=True)
    os.makedirs(os.path.join(ROOT, "blog"), exist_ok=True)
    for m in metas:
        out = os.path.join(ROOT, "blog", f"{m['slug']}.html")
        open(out, "w", encoding="utf-8").write(render_post(m))
        print(f"build_content: blog/{m['slug']}.html  ({m['date']}, {m['minutes']} min, {m['author']})")
    update_index(metas)          # zero stories -> an empty marker block, never a stale card
    update_feed(metas)
    write_drafts(metas)
    print(f"build_content: {len(metas)} story/stories → blog.html cards + feed.xml + content/drafts/ (newsletter + LinkedIn)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
