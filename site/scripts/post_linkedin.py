#!/usr/bin/env python3
"""Post the Tuesday story's LinkedIn text through Postiz — the keeper's LinkedIn step, as a cron.

    python3 scripts/post_linkedin.py            # posts today's story (type "now") — Tuesdays 07:00 Pacific
    python3 scripts/post_linkedin.py --draft    # creates a Postiz DRAFT instead (nothing reaches LinkedIn)
    python3 scripts/post_linkedin.py --date 2026-09-22 --draft

Reads: content/stories/*.md (front matter `date`, optional `hold: true`, optional `slug`) and
content/drafts/<slug>.linkedin.md (written a week ahead by build_content.py).
Needs: POSTIZ_API_KEY (repo secret) and POSTIZ_INTEGRATION_ID (repo variable or env; the channel
"Bob Rapp" on Postiz). Exit 2 when there is no story dated today — a quiet Tuesday, not a failure.
"""
import argparse, datetime as dt, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORIES = os.path.join(ROOT, "content", "stories")
DRAFTS = os.path.join(ROOT, "content", "drafts")
API = "https://api.postiz.com/public/v1/posts"


def front_matter(path):
    raw = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
    meta = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip().strip('"').strip("'")
    base = os.path.splitext(os.path.basename(path))[0]
    meta.setdefault("slug", re.sub(r"[^a-z0-9]+", "-", re.sub(r"^\d{4}-\d{2}(-\d{2})?-", "", base).lower()).strip("-"))
    return meta


def story_for(day):
    for name in sorted(os.listdir(STORIES)):
        if not name.endswith(".md") or name.startswith("_") or name == "README.md":
            continue
        meta = front_matter(os.path.join(STORIES, name))
        if meta.get("date") == day.isoformat() and meta.get("hold", "").lower() != "true":
            return meta
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=None, help="YYYY-MM-DD (default: today, Pacific)")
    ap.add_argument("--draft", action="store_true", help="create a Postiz draft; never publishes")
    a = ap.parse_args()
    if a.date:
        day = dt.date.fromisoformat(a.date)
    else:
        # Pacific 'today' from UTC without a tz database: subtract 7h in summer, 8h in winter (close enough at 07:00)
        now = dt.datetime.utcnow()
        day = (now - dt.timedelta(hours=7)).date()
    meta = story_for(day)
    if not meta:
        print(f"post_linkedin: no story dated {day} (or it is held) — nothing to post")
        return 2
    draft = os.path.join(DRAFTS, f"{meta['slug']}.linkedin.md")
    if not os.path.exists(draft):
        print(f"post_linkedin: {draft} missing — run scripts/build_content.py first")
        return 1
    text = open(draft, encoding="utf-8").read().strip()
    key = os.environ.get("POSTIZ_API_KEY")
    integ = os.environ.get("POSTIZ_INTEGRATION_ID")
    if not key or not integ:
        print("post_linkedin: POSTIZ_API_KEY / POSTIZ_INTEGRATION_ID not set")
        return 1
    body = {
        "type": "draft" if a.draft else "now",
        "date": dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "shortLink": False,
        "tags": [],
        "posts": [{
            "integration": {"id": integ},
            "value": [{"content": text, "image": []}],
            "settings": {"__type": "linkedin-page", "post_as_images_carousel": False},
        }],
    }
    req = urllib.request.Request(API, data=json.dumps(body).encode(), method="POST",
                                 headers={"Authorization": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            out = r.read().decode()
    except urllib.error.HTTPError as e:
        print("post_linkedin: Postiz refused:", e.code, e.read().decode()[:500])
        return 1
    print(f"post_linkedin: {'draft created' if a.draft else 'posted'} — {meta['slug']} — {out[:300]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
