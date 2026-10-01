#!/usr/bin/env python3
"""Per-author feed health: a dead bridge fails the job, an idle founder does not.

WHY THIS FILE EXISTS
--------------------
Two separate defects, found on 2026-10-01 while asking why `main` was red:

1. `scripts/test-e2e-v3.sh` asserted `ken_count > 0` — "Ken has posts". From 2026-09-20
   that was false for eleven days, not because anything broke, but because Ken's newest
   LinkedIn post was 20 Aug and fetch_posts.py's 30-day freshness rule correctly dropped
   the last of them. The feed was fine: that morning's runner fetched ten items. So the
   only failing assertion on `main` was a claim about a person's posting habits, which no
   commit can satisfy — and a gate nobody can satisfy trains everyone to ignore the gate.

2. The exit contract only failed when **both** feeds died (`STATE['both_failed']`). "Both"
   is the wrong quantifier. When one bridge lapses, the other author's posts keep arriving
   and the job reports success, so the single visible signal was that same unsatisfiable
   live assertion. In June this exact failure mode showed June posts under the heading
   "Latest" for seven weeks.

The fix records WHY a section is empty (`feed_health`) and gates on the half this repo
controls. These tests pin the distinction, because it is the whole point and it is the
kind of thing a later simplification would quietly collapse.

HOW IT RUNS THE CODE
--------------------
fetch_posts.py writes to a path derived from its own `__file__`. Rather than redirect that
with module rebinding — which is how I overwrote the real sitemap.xml earlier today — this
copies the script into a temp tree and runs it there. The real data/ then cannot be reached
even if the test is wrong, which is a structural guarantee instead of a careful one.

Run:  python3 scripts/test-feed-health.py
"""

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PASS, FAIL = 0, 0


def check(label, ok, detail=""):
    global PASS, FAIL
    if ok:
        print(f"  ✅  {label}")
        PASS += 1
    else:
        print(f"  ❌  {label} — {detail}")
        FAIL += 1


RSS = """<?xml version="1.0"?><rss version="2.0"><channel>
<title>f</title>{items}</channel></rss>"""
ITEM = """<item><title>{t}</title><link>https://example.com/{n}</link>
<pubDate>{d}</pubDate><description>A real body with several words in it.</description></item>"""


def feed(dates):
    items = "".join(ITEM.format(t=f"A governance post number {n} about policy", n=n, d=d)
                    for n, d in enumerate(dates))
    return RSS.format(items=items).encode()


def run_case(name, responses, expect_exit, env=None):
    """Copy the script into a temp tree, patch urlopen per-URL, run it as __main__."""
    tmp = Path(tempfile.mkdtemp(prefix="feedhealth-"))
    (tmp / "scripts").mkdir()
    (tmp / "data").mkdir()
    shutil.copy(REPO / "scripts" / "fetch_posts.py", tmp / "scripts" / "fetch_posts.py")

    # responses maps a URL substring -> bytes (serve it) or an Exception (raise it).
    driver = tmp / "scripts" / "_driver.py"
    driver.write_text(
        "import io, json, runpy, sys, urllib.request\n"
        f"RESP = {responses!r}\n"
        "class R(io.BytesIO):\n"
        "    def __enter__(self): return self\n"
        "    def __exit__(self, *a): return False\n"
        "def fake(req, timeout=None):\n"
        "    url = req.full_url if hasattr(req, 'full_url') else str(req)\n"
        "    for key, val in RESP.items():\n"
        "        if key in url:\n"
        "            if isinstance(val, str):\n"
        "                raise Exception(val)\n"
        "            return R(val)\n"
        "    raise Exception('HTTP Error 404: Not Found')\n"
        "urllib.request.urlopen = fake\n"
        "runpy.run_path(%r, run_name='__main__')\n" % str(tmp / "scripts" / "fetch_posts.py")
    )
    import os
    e = dict(os.environ)
    e.pop("ANTHROPIC_API_KEY", None)          # keep the Haiku pass out of the way
    e.update(env or {})
    p = subprocess.run([sys.executable, str(driver)], capture_output=True, text=True,
                       timeout=180, env=e)
    out = p.stdout + p.stderr
    data = {}
    f = tmp / "data" / "linkedin-posts.json"
    if f.exists():
        data = json.loads(f.read_text())
    check(f"[{name}] exit code is {expect_exit}", p.returncode == expect_exit,
          f"got {p.returncode}\n{out[-700:]}")
    shutil.rmtree(tmp, ignore_errors=True)
    return data, out


def main():
    print("\n\U0001f4e1  Feed health — per-author\n")
    recent = "Mon, 29 Sep 2026 10:00:00 GMT"
    old = "Thu, 20 Aug 2026 23:19:55 GMT"

    # ── 1. Both feeds alive and recent: green, both ok, both publishing ──────
    print("  [1] both alive, both recent")
    data, out = run_case("alive", {"bobfeed": feed([recent, recent]),
                                   "kenfeed": feed([recent])},
                         0, {"BOB_RSS": "https://x/bobfeed", "KEN_RSS": "https://x/kenfeed"})
    h = data.get("feed_health") or {}
    check("feed_health is written", bool(h), repr(data.keys()))
    check("bob ok", (h.get("bob") or {}).get("ok") is True, repr(h.get("bob")))
    check("ken ok", (h.get("ken") or {}).get("ok") is True, repr(h.get("ken")))
    check("bob published 2", (h.get("bob") or {}).get("published") == 2, repr(h.get("bob")))
    check("fetched is recorded", (h.get("bob") or {}).get("fetched") == 2, repr(h.get("bob")))

    # ── 2. THE ELEVEN-DAY CASE. Ken's feed is healthy; his posts are all old. ──
    # This must be GREEN. It is the case the old `ken_count > 0` assertion failed on, and
    # the one no commit could ever fix.
    print("\n  [2] ken's feed healthy, every item older than the 30-day window")
    data, out = run_case("idle-founder", {"bobfeed": feed([recent]),
                                          "kenfeed": feed([old, old, old])},
                         0, {"BOB_RSS": "https://x/bobfeed", "KEN_RSS": "https://x/kenfeed"})
    h = data.get("feed_health") or {}
    check("ken is ok:true — an idle author is not a broken feed",
          (h.get("ken") or {}).get("ok") is True, repr(h.get("ken")))
    check("ken published 0", (h.get("ken") or {}).get("published") == 0, repr(h.get("ken")))
    check("ken fetched 3 — the bridge DID carry items",
          (h.get("ken") or {}).get("fetched") == 3, repr(h.get("ken")))
    check("ken's error is null", (h.get("ken") or {}).get("error") is None, repr(h.get("ken")))
    check("the published list is genuinely empty", data.get("ken") == [], repr(data.get("ken")))

    # ── 3. ONE bridge lapsed. Must FAIL, and must name the author. ───────────
    # Before this change: exit 0, because `both_failed` was the only trigger.
    print("\n  [3] one bridge lapsed (HTTP 402), the other fine")
    data, out = run_case("one-lapsed", {"bobfeed": feed([recent]),
                                        "kenfeed": "HTTP Error 402: Payment Required"},
                         1, {"BOB_RSS": "https://x/bobfeed", "KEN_RSS": "https://x/kenfeed"})
    check("the error names the author", "Ken Johnston" in out, out[-400:])
    check("…and quotes the cause", "402" in out, out[-400:])
    check("bob is unaffected and still ok",
          ((data.get("feed_health") or {}).get("bob") or {}).get("ok") is True,
          repr((data.get("feed_health") or {}).get("bob")))
    check("ken is ok:false", ((data.get("feed_health") or {}).get("ken") or {}).get("ok") is False,
          repr((data.get("feed_health") or {}).get("ken")))

    # ── 4. The sanitiser applies to the error string too ────────────────────
    # It is a string from a remote server that lands in a committed, served file. This
    # repo's rule is that every third-party string is hostile until stripped.
    print("\n  [4] a hostile error string is stripped before it reaches the JSON")
    data, out = run_case("hostile", {"bobfeed": feed([recent]),
                                     "kenfeed": "<img src=x onerror=alert(1)> expired"},
                         1, {"BOB_RSS": "https://x/bobfeed", "KEN_RSS": "https://x/kenfeed"})
    err = ((data.get("feed_health") or {}).get("ken") or {}).get("error") or ""
    check("no '<' survives in the recorded error", "<" not in err, repr(err))
    check("no 'onerror=' survives", "onerror=" not in err, repr(err))
    check("but the human-readable part is kept", "expired" in err, repr(err))

    # ── 5. ok:true must never sit beside fetch_error:true ────────────────────
    # The both-failed path returns early, so it needs its own health stamp. Without it the
    # file keeps the previous run's block — the one state the block must never report.
    print("\n  [5] both feeds dead: the preserved file cannot claim ok:true")
    tmp = Path(tempfile.mkdtemp(prefix="feedhealth-prev-"))
    try:
        (tmp / "scripts").mkdir(); (tmp / "data").mkdir()
        shutil.copy(REPO / "scripts" / "fetch_posts.py", tmp / "scripts" / "fetch_posts.py")
        (tmp / "data" / "linkedin-posts.json").write_text(json.dumps({
            "updated": "2026-09-30T19:10:02Z",
            "feed_health": {"bob": {"ok": True, "fetched": 9, "published": 9, "error": None},
                            "ken": {"ok": True, "fetched": 9, "published": 0, "error": None}},
            "bob": [{"title": "An older governance post with words", "link": "https://e/1",
                     "date": "Mon, 29 Sep 2026 10:00:00 GMT", "summary": "Body text here.",
                     "image": None, "author": "Bob Rapp"}],
            "ken": [],
        }))
        drv = tmp / "scripts" / "_d.py"
        drv.write_text(
            "import runpy, urllib.request\n"
            "def fake(req, timeout=None): raise Exception('HTTP Error 402: Payment Required')\n"
            "urllib.request.urlopen = fake\n"
            "runpy.run_path(%r, run_name='__main__')\n" % str(tmp / "scripts" / "fetch_posts.py")
        )
        import os
        e = dict(os.environ); e.pop("ANTHROPIC_API_KEY", None)
        e.update({"BOB_RSS": "https://x/bobfeed", "KEN_RSS": "https://x/kenfeed"})
        p = subprocess.run([sys.executable, str(drv)], capture_output=True, text=True,
                           timeout=120, env=e)
        d2 = json.loads((tmp / "data" / "linkedin-posts.json").read_text())
        check("exit code is 1", p.returncode == 1, f"got {p.returncode}\n{(p.stdout+p.stderr)[-500:]}")
        check("fetch_error is set", d2.get("fetch_error") is True, repr(d2.get("fetch_error")))
        hb = d2.get("feed_health") or {}
        check("the stale ok:true was overwritten for bob",
              (hb.get("bob") or {}).get("ok") is False, repr(hb.get("bob")))
        check("…and for ken", (hb.get("ken") or {}).get("ok") is False, repr(hb.get("ken")))
        check("the last good posts are still preserved", len(d2.get("bob") or []) == 1,
              repr(d2.get("bob")))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    # ── 6. The live E2E script no longer gates on a person's posting habits ──
    print("\n  [6] the live assertion was actually replaced, not just supplemented")
    e2e = (REPO / "scripts" / "test-e2e-v3.sh").read_text()
    check('no `check "Ken has posts"` remains', 'check "Ken has posts"' not in e2e,
          "the unsatisfiable assertion is still there")
    check("it reads feed_health", "feed_health" in e2e, "not wired to the health block")
    # The subshell trap: `echo | while read` discards every PASS/FAIL the loop counts, so
    # the script would print ❌ and still exit 0. Assert the here-string form survives.
    #
    # Scanned over CODE ONLY. The first version of this assertion read the whole file and
    # tripped on the comment above line 147, which quotes the bad form in order to warn
    # against it. That is the third time today a check has matched the prose explaining it
    # rather than the thing it was written to find — a check that reads comments is testing
    # the documentation.
    code = "\n".join(ln for ln in e2e.splitlines() if not ln.lstrip().startswith("#"))
    check("the health loop is fed by a here-string, not a pipe",
          "done <<<" in code and "| while read" not in code,
          "a piped while-loop runs in a subshell and loses its FAIL count")

    print(f"\n  {PASS} passed, {FAIL} failed\n")
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
