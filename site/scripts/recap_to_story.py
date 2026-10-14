#!/usr/bin/env python3
"""Thursday → Tuesday: turn the host's recap file into next Tuesday's story.

The host writes one file after the call — practice/docs/thursdays/YYYY-MM-DD.md (mark lines, one
paragraph of what stung, who hosts next, pairs). The Monday keeper runs this to draft the story:

  python3 scripts/recap_to_story.py --recap https://raw.githubusercontent.com/aigovops-foundation/practice/main/docs/thursdays/2026-09-17.md
  python3 scripts/recap_to_story.py --recap ../Open-Source-Unified-Sept-2026/docs/thursdays/2026-09-17.md --hold-others

Writes content/stories/<tuesday>-thursday-<date>.md (the Tuesday after the recap's date, or --tuesday).
With --hold-others, any other story dated that Tuesday gets `hold: true`, so the Thursday story is the
one that publishes; remove the hold to swap back. Only what the host wrote is used — nothing is invented:
no marks, no story without a "What stung" paragraph. Exit 2 means "nothing to draft"; the keeper then
leaves the corpus case in place. --selftest runs a throwaway example.
"""
import argparse
import datetime as dt
import os
import re
import sys
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORIES = os.path.join(ROOT, "content", "stories")
MARK = re.compile(r"^MARK\s*·\s*(\d{3})\s*·\s*([^·]+?)\s*·\s*([0-9a-f]{8,64}|[^·]+?)\s*·\s*host\s+([^·]+?)\s*·\s*(\d{4}-\d{2}-\d{2})\s*$", re.I)
DOOR = {"100": "promise", "200": "ship", "300": "running", "400": "prove"}
LEVEL_NAME = {"100": "Begin", "200": "Retrofit", "300": "Hold", "400": "Prove it"}


def read(src):
    if src.startswith("http://") or src.startswith("https://"):
        with urllib.request.urlopen(src, timeout=20) as r:
            return r.read().decode("utf-8")
    return open(src, encoding="utf-8").read()


def section(text, title):
    m = re.search(r"^##\s+" + re.escape(title) + r"\s*$(.*?)(?=^##\s|\Z)", text, re.S | re.M)
    if not m:
        return ""
    body = m.group(1).strip()
    # drop the template's own instruction lines if a host left them in
    body = "\n".join(l for l in body.splitlines() if not l.strip().startswith(("One line per mark", "One paragraph, in the host", "write it so a stranger", "MARK · 100 · first name")))
    return body.strip()


def parse(text):
    head = re.search(r"^#\s+Thursday\s+(\d{4}-\d{2}-\d{2})\s*·\s*host:\s*(.+?)\s*$", text, re.M)
    if not head:
        raise SystemExit("recap: first line must be '# Thursday YYYY-MM-DD · host: NAME'")
    date, host = head.group(1), head.group(2).strip()
    marks = []
    for line in section(text, "Marks").splitlines():
        m = MARK.match(line.strip())
        if m:
            marks.append({"level": m.group(1), "who": m.group(2).strip(), "hash": m.group(3).strip()[:12], "host": m.group(4).strip(), "date": m.group(5)})
    stung = section(text, "What stung")
    stung = re.sub(r"\s*\n\s*", " ", stung).strip()
    nxt = section(text, "Who hosts next").splitlines()
    nxt = nxt[0].strip() if nxt and nxt[0].strip() and not nxt[0].strip().startswith("NAME") else ""
    pairs = section(text, "Pairs")
    return {"date": date, "host": host, "marks": marks, "stung": stung, "next": nxt, "pairs": pairs}


def next_tuesday(d):
    d = dt.date.fromisoformat(d)
    return (d + dt.timedelta(days=(1 - d.weekday()) % 7 or 7)).isoformat()


def render(r, tuesday):
    d = dt.date.fromisoformat(r["date"])
    when = d.strftime("%-d %B %Y")
    by = {}
    for m in r["marks"]:
        by[m["level"]] = by.get(m["level"], 0) + 1
    n = len(r["marks"])
    counts = " · ".join(f"{lvl} × {by[lvl]}" for lvl in sorted(by)) if by else "no marks"
    title = f"Thursday {d.strftime('%-d %B')}: {n} mark{'s' if n != 1 else ''}, and what stung"
    summary = (r["stung"][:200].rsplit(" ", 1)[0] + "…") if len(r["stung"]) > 200 else r["stung"]
    lines = ["---", f"title: {title}", f"date: {tuesday}", f"author: {r['host']}", f"summary: {summary}", "---",
             r["stung"], "", "## The marks", "",
             f"Marks by level this Thursday: {counts}. A mark names a level, never a system; the hash is the artifact's, never its content.", ""]
    for m in r["marks"]:
        lines.append(f"`MARK · {m['level']} · {m['who']} · {m['hash']} · host {m['host']} · {m['date']}`  ")
    lines.append("")
    if r["pairs"] and not r["pairs"].lower().startswith("first name — first name"):
        lines += ["## Pairs", "", r["pairs"], ""]
    lines += ["## Next Thursday", "",
              (f"{r['next']} hosts. " if r["next"] else "") + "15:00 Pacific; the first five minutes are for receipts. Bring one, or come to watch one.", "",
              "Sit down. What brought you in?", "",
              "— [The café](https://www.aigovops-foundation.com/?src=letter#problem) · [Thursday](https://www.aigovops-foundation.com/practice/docs/THURSDAY.html) · [the run-of-show](https://www.aigovops-foundation.com/practice/docs/THURSDAY.html#run-of-show-60-minutes-ken-hosts-until-a-400-does)", ""]
    return "\n".join(lines)


def hold_others(tuesday, keep):
    held = []
    for f in sorted(os.listdir(STORIES)):
        if not f.endswith(".md") or f.startswith("_") or f == keep:
            continue
        p = os.path.join(STORIES, f)
        s = open(p, encoding="utf-8").read()
        if re.search(rf"^date:\s*{tuesday}\s*$", s, re.M) and not re.search(r"^hold:\s*true", s, re.M):
            s = s.replace("\n---\n", "\nhold: true\n---\n", 1)
            open(p, "w", encoding="utf-8").write(s)
            held.append(f)
    return held


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--recap", help="path or URL of practice/docs/thursdays/YYYY-MM-DD.md")
    ap.add_argument("--tuesday", help="story date (default: the Tuesday after the recap)")
    ap.add_argument("--hold-others", action="store_true", help="put hold: true on other stories dated that Tuesday")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args(argv)
    if a.selftest:
        return selftest()
    if not a.recap:
        ap.error("--recap is required")
    r = parse(read(a.recap))
    if not r["marks"] and not r["stung"]:
        print("recap: no marks and no 'What stung' paragraph — nothing to draft (the corpus case publishes)")
        return 2
    if not r["stung"]:
        print("recap: no 'What stung' paragraph — a story needs the host's words; nothing drafted")
        return 2
    tuesday = a.tuesday or next_tuesday(r["date"])
    name = f"{tuesday}-thursday-{r['date']}.md"
    os.makedirs(STORIES, exist_ok=True)
    open(os.path.join(STORIES, name), "w", encoding="utf-8").write(render(r, tuesday))
    print(f"recap_to_story: content/stories/{name}  ({len(r['marks'])} mark(s), host {r['host']}, publishes {tuesday})")
    if a.hold_others:
        for h in hold_others(tuesday, name):
            print(f"recap_to_story: hold: true on {h}")
    return 0


def selftest():
    global STORIES
    tmp = tempfile.mkdtemp(prefix="recap-"); STORIES = tmp
    open(os.path.join(tmp, "2026-09-22-the-one-dollar-tahoe.md"), "w").write("---\ntitle: x\ndate: 2026-09-22\nauthor: Bob Rapp\n---\nbody\n")
    recap = ("# Thursday 2026-09-17 · host: Ken\n\n## Marks\n\nMARK · 100 · Bob · 7f3a9c1e02bd · host Ken · 2026-09-17\nMARK · 100 · a member · b70b6150efd1 · host Ken · 2026-09-17\n\n"
             "## What stung\n\nThe Air Canada door. Two rules said aloud; one was better than the worksheet's.\n\n## Who hosts next\n\nKen · 2026-09-24\n\n## Pairs\n\nnone this week\n")
    r = parse(recap)
    assert r["host"] == "Ken" and len(r["marks"]) == 2 and r["marks"][1]["who"] == "a member", r
    assert next_tuesday("2026-09-17") == "2026-09-22"
    out = render(r, "2026-09-22")
    assert "title: Thursday 17 September: 2 marks, and what stung" in out and "100 × 2" in out and "7f3a9c1e02bd" in out, out
    held = hold_others("2026-09-22", "keep.md")
    assert held == ["2026-09-22-the-one-dollar-tahoe.md"] and "hold: true" in open(os.path.join(tmp, held[0])).read()
    empty = parse("# Thursday 2026-09-17 · host: Ken\n\n## Marks\n\n## What stung\n\n")
    assert not empty["marks"] and not empty["stung"]
    print("recap_to_story selftest: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
