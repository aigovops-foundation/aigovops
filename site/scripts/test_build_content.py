#!/usr/bin/env python3
"""Self-test for build_content.py — runs the whole pipeline against a throwaway copy of the repo.

    python3 scripts/test_build_content.py        (needs: pip install markdown)

The publish workflow runs this before rendering, so a story that would break the blog, the feed
or the drafts never reaches main. Nothing here touches the real blog/, blog.html, feed.xml or
content/ — every check happens in a temp directory.
"""
import os
import re
import shutil
import subprocess
os.environ.setdefault("PUBLISH_UNTIL", "9999-12-01")   # the self-test story is dated; publish it regardless of today
import sys
import tempfile
import importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_p = _f = 0


def check(name, cond):
    global _p, _f
    if cond:
        _p += 1
    else:
        _f += 1
        print(f"  FAIL: {name}")


def load(root):
    """Import build_content with ROOT pointed at a copy of the repo."""
    spec = importlib.util.spec_from_file_location("bc", os.path.join(ROOT, "scripts", "build_content.py"))
    bc = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(bc)
    # Captured BEFORE the redirects, so the leak check below has something to compare
    # against. bc.ROOT is the real repository at this point.
    _REAL_ROOT = bc.ROOT
    bc.ROOT = root
    bc.STORIES = os.path.join(root, "content", "stories")
    bc.TEMPLATE = os.path.join(root, "blog", "what-is-aigovops.html")
    bc.BLOG_INDEX = os.path.join(root, "blog.html")
    bc.FEED = os.path.join(root, "feed.xml")
    bc.DRAFTS = os.path.join(root, "content", "drafts")
    bc.FOUNDERS_MD = os.path.join(root, "content", "founders.md")
    bc.FOUNDERS_HTML = os.path.join(root, "founders.html")
    bc.TRANSLATIONS = os.path.join(root, "content", "translations")
    bc.SITEMAP = os.path.join(root, "sitemap.xml")

    # EVERY ROOT-DERIVED PATH, or this test writes into the real repository.
    #
    # It already did, on 2026-09-30. update_sitemap() was added to build_content.py with
    # a module-level SITEMAP constant, this redirect list did not know about it, and the
    # self-test's run therefore rewrote the REAL sitemap.xml — replacing the live entries
    # with one for its fixture story, "a-test-story". That got committed and published, so
    # the sitemap briefly advertised /blog/a-test-story.html to crawlers: a 404.
    #
    # The list above is the same drift that caused #153, one layer in. So instead of
    # trusting it, derive the check: any module-level constant built off the real ROOT and
    # still pointing there after redirection is a write target this test would leak to.
    leaked = sorted(
        name for name, val in vars(bc).items()
        if name.isupper() and isinstance(val, str) and val.startswith(_REAL_ROOT)
    )
    if leaked:
        raise AssertionError(
            "test_build_content would write into the real repository: "
            + ", ".join(f"bc.{n}" for n in leaked)
            + f" still point under {_REAL_ROOT}. Add each to the redirect list above "
              "before running anything — a self-test that can modify the repo it is "
              "testing has already broken the thing it was meant to protect."
        )
    return bc


STORY = """---
title: A test story about gates
date: 2026-09-15
author: Ken Johnston
---
The first paragraph says what the story is about, in one plain sentence that a manager would read twice.

The second paragraph has a [link](https://example.com) and *emphasis* and `code` that must not leak into a LinkedIn post.

## A heading that should be dropped from drafts

""" + ("A third paragraph long enough to force the LinkedIn draft to trim. " * 30)


def main():
    tmp = tempfile.mkdtemp(prefix="build-content-test-")
    for f in ("blog.html", "feed.xml"):
        shutil.copy(os.path.join(ROOT, f), tmp)
    os.makedirs(os.path.join(tmp, "blog"))
    shutil.copy(os.path.join(ROOT, "blog", "what-is-aigovops.html"), os.path.join(tmp, "blog"))
    os.makedirs(os.path.join(tmp, "content", "stories"))
    open(os.path.join(tmp, "content", "stories", "2026-09-a-test-story.md"), "w", encoding="utf-8").write(STORY)
    open(os.path.join(tmp, "content", "stories", "_TEMPLATE.md"), "w").write("---\ntitle: x\ndate: 2026-01-01\n---\nignored\n")

    bc = load(tmp)
    check("pipeline runs", bc.main() == 0)

    post = os.path.join(tmp, "blog", "a-test-story.html")
    check("post rendered from the filename slug", os.path.exists(post))
    html = open(post, encoding="utf-8").read()
    check("post carries the title", "A test story about gates" in html)
    check("post carries the author", "Ken Johnston" in html)
    check("template story is ignored", not os.path.exists(os.path.join(tmp, "blog", "template.html")))

    idx = open(os.path.join(tmp, "blog.html"), encoding="utf-8").read()
    check("index has one generated card", idx.count('data-content-slug="a-test-story"') == 1)
    feed = open(os.path.join(tmp, "feed.xml"), encoding="utf-8").read()
    check("feed has one generated item", feed.count("<item><!-- content -->") == 1)

    nl = open(os.path.join(tmp, "content", "drafts", "a-test-story.newsletter.md"), encoding="utf-8").read()
    li = open(os.path.join(tmp, "content", "drafts", "a-test-story.linkedin.md"), encoding="utf-8").read()
    check("newsletter draft has a subject", nl.startswith("Subject: A test story about gates"))
    check("newsletter links the story tagged src=newsletter", "/blog/a-test-story.html?src=newsletter" in nl)
    check("newsletter ends on the Gate Check tagged src=newsletter", "gate-check.html?src=newsletter" in nl)
    check("linkedin draft opens with the hook", li.startswith("A test story about gates\n\n"))
    check("linkedin draft is under the limit", len(li) <= bc.LINKEDIN_LIMIT)
    check("linkedin draft trims on a word, not mid-word", "…" in li and "…" not in li.split("\n\n")[1][:-1].split(" ")[-1][:-1])
    check("linkedin links the story tagged src=linkedin", "/blog/a-test-story.html?src=linkedin" in li)
    check("linkedin ends on the Gate Check tagged src=linkedin", "gate-check.html?src=linkedin" in li)
    check("markdown syntax does not leak into drafts", not re.search(r"[*`]|\]\(", li + nl.replace("Subject:", "")))
    check("headings are dropped from drafts", "A heading that should be dropped" not in li and "A heading that should be dropped" not in nl)
    check("exactly three hashtags at the end", li.rstrip().endswith(bc.HASHTAGS) and li.count("#") == 3)
    check("editor line-wraps are joined into one paragraph", "\n" not in li.split("\n\n")[1] and "\n" not in nl.split("\n\n")[1])

    # idempotent: a second run changes nothing
    before = {f: open(os.path.join(tmp, "content", "drafts", f), encoding="utf-8").read() for f in os.listdir(os.path.join(tmp, "content", "drafts"))}
    bc.main()
    after = {f: open(os.path.join(tmp, "content", "drafts", f), encoding="utf-8").read() for f in os.listdir(os.path.join(tmp, "content", "drafts"))}
    check("second run is idempotent", before == after)
    check("index still has exactly one card after a re-run", open(os.path.join(tmp, "blog.html"), encoding="utf-8").read().count('data-content-slug="a-test-story"') == 1)

    # removing the story removes its post's card, feed item and drafts
    os.remove(os.path.join(tmp, "content", "stories", "2026-09-a-test-story.md"))
    bc.main()
    check("removed story → no card", 'data-content-slug="a-test-story"' not in open(os.path.join(tmp, "blog.html"), encoding="utf-8").read())
    check("removed story → no feed item", "<item><!-- content -->" not in open(os.path.join(tmp, "feed.xml"), encoding="utf-8").read())
    check("removed story → no drafts", not os.path.exists(os.path.join(tmp, "content", "drafts", "a-test-story.linkedin.md")))

    print("[founders] founders.html renders from content/founders.md (plan 2.3)")
    os.makedirs(os.path.join(tmp, "content"), exist_ok=True)
    shutil.copy(os.path.join(ROOT, "founders.html"), tmp)
    open(os.path.join(tmp, "content", "founders.md"), "w", encoding="utf-8").write(
        "# Founders\n\n## Ken Johnston\n\nTitle: Tester turned governor\nHook: A receipt for every action.\n\nKen para one with *emphasis*.\n\nKen para two.\n\n"
        "## Bob Rapp\n\nTitle: Gate keeper\nHook: Maybe is expensive.\n\nBob para one.\n\n## In their words\n\n- Bob: \"Policies describe. Code decides.\"\n- Ken: \"Beacon proves it.\"\n")
    n = bc.render_founders()
    fh = open(os.path.join(tmp, "founders.html"), encoding="utf-8").read()
    check("three regions rendered", n == 3)
    check("titles replaced", "Tester turned governor" in fh and "Gate keeper" in fh)
    check("bios replaced with emphasis rendered", "Ken para one with <em>emphasis</em>." in fh and "Bob para one." in fh)
    check("hooks rendered", "A receipt for every action." in fh and "Maybe is expensive." in fh)
    check("quotes section present with cites", fh.count('class="founder-quote"') == 2 and "<cite>Bob</cite>" in fh)
    check("old bio text gone", "Complete the Governance 101" not in fh and "spent his career at the intersection" not in fh)
    before = fh
    bc.render_founders()
    check("idempotent (second render identical)", open(os.path.join(tmp, "founders.html"), encoding="utf-8").read() == before)
    check("frame untouched (links)", "founder-link primary" in fh)
    shutil.rmtree(tmp, ignore_errors=True)
    print("[translations] Spanish story pages via a pluggable translator, cached (plan 3.3)")
    tmp2 = tempfile.mkdtemp(prefix="build-content-es-")
    for f in ("blog.html", "feed.xml"):
        shutil.copy(os.path.join(ROOT, f), tmp2)
    os.makedirs(os.path.join(tmp2, "blog")); shutil.copy(os.path.join(ROOT, "blog", "what-is-aigovops.html"), os.path.join(tmp2, "blog"))
    os.makedirs(os.path.join(tmp2, "content", "stories"))
    open(os.path.join(tmp2, "content", "stories", "2026-09-a-test-story.md"), "w", encoding="utf-8").write(STORY)
    bc2 = load(tmp2)
    calls = []
    def fake(text, lang):
        calls.append(lang)
        return text.replace("title: A test story about gates", "title: Una historia de prueba sobre puertas").replace("The first paragraph", "El primer párrafo")
    bc2.TRANSLATOR = fake
    check("pipeline runs with translations", bc2.main() == 0)
    es = os.path.join(tmp2, "blog", "es", "a-test-story.html")
    check("Spanish page rendered under blog/es/", os.path.exists(es))
    e = open(es, encoding="utf-8").read() if os.path.exists(es) else ""
    check("Spanish page has lang=es, translated title, English back-link", '<html lang="es">' in e and "Una historia de prueba" in e and 'hreflang="en"' in e)
    check("English page links to Spanish", 'hreflang="es"' in open(os.path.join(tmp2, "blog", "a-test-story.html"), encoding="utf-8").read())
    check("translation cached", os.path.exists(os.path.join(tmp2, "content", "translations", "a-test-story.es.md")))
    bc2.main()
    check("second build uses the cache (translator not called again)", calls == ["es"])
    bc2.TRANSLATOR = lambda text, lang: None
    shutil.rmtree(os.path.join(tmp2, "content", "translations")); shutil.rmtree(os.path.join(tmp2, "blog", "es"))
    bc2.main()
    check("no translation available → no Spanish page, no stub", not os.path.exists(es))
    shutil.rmtree(tmp2, ignore_errors=True)


    print(f"BUILD CONTENT: {_p} passed, {_f} failed")
    return 1 if _f else 0


if __name__ == "__main__":
    sys.exit(main())

# recap_to_story.py (Thursday → Tuesday) carries its own throwaway self-test; run it here so one
# command proves the whole content pipeline.
import subprocess as _sp, sys as _sys
_r = _sp.run([_sys.executable, os.path.join(ROOT, "scripts", "recap_to_story.py"), "--selftest"], capture_output=True, text=True)
print(_r.stdout.strip()); assert _r.returncode == 0, _r.stderr
