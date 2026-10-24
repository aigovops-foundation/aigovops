#!/usr/bin/env python3
"""The outer half of the feed injection defence: nothing hostile reaches the JSON.

Companion to scripts/test-xss.js, which guards the inner half (escaping at the DOM
sink). Two layers, two suites, neither relying on the other — because the committed
data/linkedin-posts.json is served from a CDN and read by a page, and either layer
alone is one edit away from being the only one.

THE BUG, as the review council found it on 2026-09-30. fetch_feed() read `title` and
`link` out of the rss.app bridge with no filtering whatsoever; only `summary` went
through strip_html(), which removes tags but is not an escaper. Those fields were then
interpolated into the string assigned to grid.innerHTML in js/main.js, under a CSP
that permits 'unsafe-inline'. The committed JSON has carried posts authored by four
people who are neither founder, so the text was never under our control.

Deliberately a STRIP here rather than an HTML-escape: escaping in Python and escaping
again at the sink would double-encode and show visitors '&amp;lt;'. Python removes the
characters that start an element; JavaScript escapes whatever is left.

Run:  python3 scripts/test-fetch-sanitise.py
"""

import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Loaded by path, and with bytecode writing OFF. fetch_posts.py runs work at import
# time behind a __main__ guard, so importing it is safe — but a __pycache__ entry
# written here is exactly the tracked-artifact problem the same council found in
# publish-content.yml, so this suite declines to create one.
sys.dont_write_bytecode = True
_spec = importlib.util.spec_from_file_location("fetch_posts", ROOT / "scripts" / "fetch_posts.py")
fp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fp)

PASS = FAIL = 0


def check(label, ok, detail=""):
    global PASS, FAIL
    if ok:
        PASS += 1
        print(f"  ✅  {label}")
    else:
        FAIL += 1
        print(f"  ❌  {label}" + (f"\n       → {detail}" if detail else "") + "  ← FAIL")


ATTACK = "<img src=x onerror=alert(1)>"


def main():
    print("\n\U0001f6e1️  Feed sanitiser — nothing hostile reaches the committed JSON\n")

    print("  [1] the attack as reported")
    out = fp.sanitise_post({
        "title": f"Governance debt {ATTACK}",
        "link": "https://www.linkedin.com/posts/example",
        "date": "Mon, 22 Sep 2026 10:00:00 +0000",
        "summary": f"A post body {ATTACK} with markup",
        "image": "https://media.licdn.com/x.jpg",
        "author": "Ken Johnston",
    })
    check("no angle bracket survives in the title", "<" not in out["title"] and ">" not in out["title"],
          repr(out["title"]))
    check("nor in the summary", "<" not in out["summary"] and ">" not in out["summary"],
          repr(out["summary"]))
    check("the post is still READABLE — stripped, not emptied",
          "Governance debt" in out["title"] and "A post body" in out["summary"],
          "a sanitiser that deletes the content is not a fix")
    check("a legitimate link passes through unchanged",
          out["link"] == "https://www.linkedin.com/posts/example", out["link"])
    check("a legitimate image passes through unchanged",
          out["image"] == "https://media.licdn.com/x.jpg", str(out["image"]))

    print("\n  [2] the URL fields need a scheme check, not escaping")
    for bad in ("javascript:alert(1)", "  JaVaScRiPt:alert(1)", "data:text/html,<script>1</script>",
                "vbscript:msgbox(1)", "file:///etc/passwd", "//evil.test/x", "not a url at all", ""):
        check(f"refused: {bad!r:42}", fp._safe_url(bad) == "", repr(fp._safe_url(bad)))
    check("https passes", fp._safe_url("https://x.test/a") == "https://x.test/a")
    check("http passes too — the feed bridge is not always https",
          fp._safe_url("http://x.test/a") == "http://x.test/a")
    check("a hostile link becomes empty rather than being published",
          fp.sanitise_post({"link": "javascript:alert(1)"})["link"] == "")
    check("a hostile image becomes None, which the page already handles",
          fp.sanitise_post({"image": "javascript:alert(1)"})["image"] is None)

    print("\n  [3] shapes a real feed produces")
    check("a post missing every field does not raise",
          fp.sanitise_post({}) == {"title": "", "summary": "", "author": "", "link": "", "image": None},
          repr(fp.sanitise_post({})))
    check("None values are coerced, not propagated",
          fp.sanitise_post({"title": None, "summary": None})["title"] == "")
    check("fields the sanitiser does not own are passed through untouched",
          fp.sanitise_post({"date": "Mon, 22 Sep 2026 10:00:00 +0000"})["date"]
          == "Mon, 22 Sep 2026 10:00:00 +0000")
    check("the author name is sanitised too — it is feed data, not ours",
          "<" not in fp.sanitise_post({"author": f"Ken {ATTACK}"})["author"])

    print("\n  [4] the sanitiser is actually ON THE PATH")
    # The assertions above would all pass with sanitise_post() defined and never
    # called. This is the one that makes them mean something.
    src = (ROOT / "scripts" / "fetch_posts.py").read_text(encoding="utf-8")
    check("fetch_feed() runs every post through it before returning",
          "posts = [sanitise_post(p) for p in posts]" in src,
          "defined but uncalled is the shape of a test that guards nothing")

    # EVERY writer, not just the first one. This assertion's first draft counted
    # `return posts` occurrences expecting one, found four, and that is how the second
    # writer turned up: haiku_enrich_posts() runs AFTER fetch_feed() and overwrites
    # title and summary with model output derived from the same hostile feed text, so
    # sanitising only on the way out of fetch_feed() left the real path open. Assert on
    # the writes instead of on the returns, because the writes are what can reintroduce
    # markup.
    writes = [ln.strip() for ln in src.splitlines()
              if ("posts[idx]['title']" in ln or "posts[idx]['summary']" in ln) and "=" in ln]
    check(f"every post-fetch write to title/summary is stripped ({len(writes)} found)",
          len(writes) >= 2 and all("_strip_markup(" in w for w in writes),
          "\n       ".join(writes) or "no writes found — has the enrichment pass moved?")

    # And drive it, rather than only reading the source: the model's output is the one
    # field in this pipeline that no human reviews before it is committed and served.
    enriched = fp.sanitise_post({"title": "ok", "summary": "ok"})
    # A well-formed tag is removed WHOLE, attributes and all — `<[^>]+>` eats the
    # onerror= with it. That is stronger than this assertion's first draft expected
    # (it predicted the attributes would survive as text), and the expectation was
    # corrected to the real behaviour rather than the behaviour being loosened to it.
    check("…and the stripper they call removes a well-formed tag entirely",
          fp._strip_markup(f"Clean headline {ATTACK}") == "Clean headline",
          repr(fp._strip_markup(f"Clean headline {ATTACK}")))
    # The harder case: a tag with no closing bracket defeats the regex, so the
    # bracket-removal pass behind it is what has to hold.
    check("…and a MALFORMED tag, which the regex cannot match, still loses its bracket",
          fp._strip_markup("Headline <img src=x onerror=alert(1)") == "Headline img src=x onerror=alert(1)",
          repr(fp._strip_markup("Headline <img src=x onerror=alert(1)")))
    check("a model-authored title with markup could not reach the JSON",
          "<" not in fp._strip_markup("<script>alert(1)</script>Title") and enriched["title"] == "ok")

    print("\n  [5] the committed data file carries no markup today")
    import json
    data = json.loads((ROOT / "data" / "linkedin-posts.json").read_text(encoding="utf-8"))
    dirty = [f"{who}[{i}].{f}"
             for who in ("bob", "ken")
             for i, p in enumerate(data.get(who) or [])
             for f in ("title", "summary", "author")
             if "<" in str(p.get(f) or "")]
    check("no committed post contains an angle bracket", not dirty, str(dirty))
    bad_links = [f"{who}[{i}]"
                 for who in ("bob", "ken")
                 for i, p in enumerate(data.get(who) or [])
                 if p.get("link") and not str(p["link"]).startswith(("http://", "https://"))]
    check("every committed link is http(s)", not bad_links, str(bad_links))

    print(f"\n  {PASS} passed, {FAIL} failed\n")
    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
