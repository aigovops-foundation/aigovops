#!/usr/bin/env python3
"""Flip foundation-site links from the bare github.io URLs to branded *.aigovops-foundation.com.

SAFE BY DESIGN: a tool's links are flipped ONLY if its branded subdomain actually RESOLVES
(HTTP < 400) — so a live link is never pointed at a domain that 404s. That deterministic check is
the whole point: don't flip ahead of DNS.

  python3 scripts/flip_links.py            # dry-run: what would flip, what's skipped (and why)
  python3 scripts/flip_links.py --apply    # write the changes (only for subdomains that resolve)
  python3 scripts/flip_links.py --selftest # offline unit check of the flip/skip/idempotence logic

Idempotent: re-running after a flip is a no-op. Run it after the Cloudflare CNAMEs + GitHub Pages
custom domains are live (see Omni-Rapp docs/UNIFY-ARCHITECTURE.md), then open a PR with the result.
"""
import glob
import os
import re
import sys
import urllib.request

# github.io repo path  ->  branded subdomain
MAP = {
    "aigovops-vendor-rfi": "rfi",
    "aigovops-beacon": "beacon",
    "aigovops-library-june-ken-bob": "library",
    "umbrella-govops": "umbrella",
}
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # foundation-site/


def resolves(sub):
    """True if https://<sub>.aigovops-foundation.com/ answers < 400 (DNS + Pages + cert are live)."""
    url = f"https://{sub}.aigovops-foundation.com/"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=8) as r:
            return r.status < 400
    except Exception:  # noqa: BLE001 — any failure (DNS/cert/timeout) means "not live yet"
        return False


def flip_text(text, live):
    """Rewrite github.io/<repo>/ -> <sub>.aigovops-foundation.com/ for each repo whose sub is in `live`."""
    changed = 0
    for repo, sub in MAP.items():
        if sub not in live:
            continue
        pat = re.compile(r"aigovops-foundation\.github\.io/" + re.escape(repo) + r"/")
        text, n = pat.subn(f"{sub}.aigovops-foundation.com/", text)
        changed += n
    return text, changed


def main(argv):
    if "--selftest" in argv:
        return _selftest()
    apply = "--apply" in argv
    live = {sub for sub in MAP.values() if resolves(sub)}
    print(f"  resolving subdomains: {sorted(live) or 'none'}")
    skipped = sorted(sub for sub in MAP.values() if sub not in live)
    if skipped:
        print(f"  SKIPPED (don't resolve — links left as github.io): {skipped}")
    total = 0
    for f in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
        new, n = flip_text(open(f).read(), live)
        if n:
            total += n
            print(f"  {'flip' if apply else 'would flip'} {os.path.basename(f)}: {n} link(s)")
            if apply:
                open(f, "w").write(new)
    tail = "" if apply else "  (dry-run — pass --apply to write)"
    print(f"  {'flipped' if apply else 'would flip'} {total} link(s){tail}")
    return 0


def _selftest():
    sample = '<a href="https://aigovops-foundation.github.io/aigovops-vendor-rfi/comparison.html">x</a>'
    out, n = flip_text(sample, {"rfi"})
    assert n == 1 and "rfi.aigovops-foundation.com/comparison.html" in out and "github.io" not in out, out
    out2, n2 = flip_text(sample, set())            # subdomain not live -> untouched
    assert n2 == 0 and out2 == sample
    out3, n3 = flip_text(out, {"rfi"})             # idempotent
    assert n3 == 0
    multi = "github.io/aigovops-beacon/ and github.io/umbrella-govops/"
    _, n4 = flip_text("aigovops-foundation.github.io/aigovops-beacon/x aigovops-foundation.github.io/umbrella-govops/y",
                      {"beacon"})                  # flips only the live one
    assert n4 == 1, multi
    print("  selftest: OK (flip · skip-when-not-live · idempotent · per-tool)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
