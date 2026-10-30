#!/usr/bin/env python3
"""Write data/next-meeting.json from the public Luma calendar.

The home page shows the next monthly community meeting (AI House + online).
Only in-person meetings count; the calendar also lists online-only salons.
The ICS is third-party input: it is unfolded, stripped of markup and control
characters, and the event URL must be on luma.com or lu.ma.
"""
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone

ICS_URL = "https://api.lu.ma/ics/get?entity=calendar&id=cal-lioZbM7QP4iwOIw"
CALENDAR_URL = "https://luma.com/aigovops"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "next-meeting.json")
IN_PERSON = re.compile(r"in[\s-]*person", re.IGNORECASE)
LUMA_URL = re.compile(r"^https://(luma\.com|lu\.ma)/\S+$")
TITLE_MAX = 140


def unfold(text):
    return re.sub(r"\r?\n[ \t]", "", text.replace("\r\n", "\n"))


def clean_text(value):
    value = re.sub(r"(?is)<(script|style)\b.*?</\1\s*>", "", value)
    value = re.sub(r"<[^>]*>", "", value)
    value = value.replace("\\,", ",").replace("\\;", ";").replace("\\n", " ")
    value = re.sub(r"[\x00-\x1f\x7f]", "", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:TITLE_MAX]


def parse_dt(value):
    value = value.strip()
    if re.fullmatch(r"\d{8}T\d{6}Z", value):
        return datetime.strptime(value, "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
    return None


def prop(event, name):
    m = re.search(r"^" + name + r"(?:;[^:\n]*)?:(.*)$", event, re.MULTILINE)
    return m.group(1).strip() if m else ""


def pick_next(ics_text, now=None):
    now = now or datetime.now(timezone.utc)
    best = None
    for raw in unfold(ics_text).split("BEGIN:VEVENT")[1:]:
        event = raw.split("END:VEVENT")[0]
        start = parse_dt(prop(event, "DTSTART"))
        title = clean_text(prop(event, "SUMMARY"))
        if not start or start <= now or not IN_PERSON.search(title):
            continue
        if best and start >= best["start_dt"]:
            continue
        url = clean_text(prop(event, "LOCATION")) or clean_text(prop(event, "URL"))
        if not LUMA_URL.match(url):
            url = CALENDAR_URL
        best = {"start_dt": start, "title": title, "url": url}
    if not best:
        return {"title": None, "start": None, "url": CALENDAR_URL}
    return {
        "title": best["title"],
        "start": best["start_dt"].strftime("%Y-%m-%dT%H:%M:%SZ"),
        "url": best["url"],
    }


def main():
    try:
        req = urllib.request.Request(ICS_URL, headers={"User-Agent": "aigovops-foundation-site/1.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            ics_text = resp.read().decode("utf-8", "replace")
    except Exception as exc:  # network trouble keeps the previous file
        print(f"warning: could not fetch Luma calendar ({exc}); keeping existing file", file=sys.stderr)
        return 0
    result = pick_next(ics_text)
    result["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(result, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"next meeting: {result['title'] or 'none scheduled'} ({result['start']})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
