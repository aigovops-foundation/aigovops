#!/usr/bin/env python3
"""Offline tests for scripts/fetch_next_meeting.py (no network)."""
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(__file__))
from fetch_next_meeting import CALENDAR_URL, pick_next  # noqa: E402

NOW = datetime(2026, 10, 18, tzinfo=timezone.utc)
FIXTURE = """BEGIN:VCALENDAR
BEGIN:VEVENT
DTSTART:20261007T203000Z
SUMMARY:AI Governance (In Person + Online): Law and Liability
LOCATION:https://luma.com/event/evt-past
END:VEVENT
BEGIN:VEVENT
DTSTART:20261022T170000Z
SUMMARY:Second Brain AI Salon Online
LOCATION:https://luma.com/event/evt-online
END:VEVENT
BEGIN:VEVENT
DTSTART:20261104T213000Z
SUMMARY:AI Governance (In Person + Online): <script>alert(1)</script>Agents at
  Work\\, Seattle
LOCATION:https://luma.com/event/evt-november
END:VEVENT
BEGIN:VEVENT
DTSTART:20261202T213000Z
SUMMARY:AI Governance (In Person + Online): December
LOCATION:https://evil.example/phish
END:VEVENT
END:VCALENDAR
"""

passed = failed = 0


def check(cond, label):
    global passed, failed
    if cond:
        passed += 1
        print(f"  ok   {label}")
    else:
        failed += 1
        print(f"  FAIL {label}")


r = pick_next(FIXTURE, NOW)
check(r["start"] == "2026-11-04T21:30:00Z", "picks the first future in-person meeting, not the earlier online salon or the past one")
check(r["url"] == "https://luma.com/event/evt-november", "keeps a luma.com event URL")
check("<" not in r["title"] and "alert" not in r["title"], "strips markup from the title")
check(r["title"].endswith("Agents at Work, Seattle"), f"unfolds continuation lines and unescapes commas ({r['title']!r})")

later = pick_next(FIXTURE, datetime(2026, 11, 5, tzinfo=timezone.utc))
check(later["url"] == CALENDAR_URL and later["start"] == "2026-12-02T21:30:00Z", "replaces a non-Luma URL with the calendar URL")

none = pick_next(FIXTURE, datetime(2027, 1, 1, tzinfo=timezone.utc))
check(none == {"title": None, "start": None, "url": CALENDAR_URL}, "no future in-person meeting gives the null result with the calendar URL")

print(f"test-next-meeting.py: {passed} passed, {failed} failed")
sys.exit(1 if failed else 0)
