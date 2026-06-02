#!/usr/bin/env python3
"""
AiGovOps Foundation — LinkedIn Post Fetcher
Fetches the 5 latest posts from Bob and Ken's rss.app LinkedIn feeds
and writes data/linkedin-posts.json for the site to display.

Run locally:   BOB_RSS="..." KEN_RSS="..." python3 scripts/fetch_posts.py
Run via CI:    GitHub Actions reads secrets automatically.
"""

import urllib.request
import xml.etree.ElementTree as ET
import json
import os
import re
from datetime import datetime, timezone

MAX_POSTS = 5

def strip_html(text):
    """Remove HTML tags and collapse whitespace."""
    text = re.sub(r'<[^>]+>', ' ', text or '')
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def _first_sentence(text):
    """Extract the first meaningful sentence from plain text."""
    if not text:
        return ''
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    for s in sentences:
        s = s.strip()
        words = [w for w in s.split() if not w.startswith(('#', '@', 'http'))]
        if len(words) >= 5:
            return s[:120]
    return text[:120]

def clean_title(title, summary=''):
    """Return a human-readable title; fall back to first real sentence if title is hashtag-only."""
    if not title:
        return _first_sentence(summary)
    core = re.sub(r'#\S+', '', title)
    core = re.sub(r'@\S+', '', core)
    core = re.sub(r'[^\w\s]', '', core)
    core = re.sub(r'\s+', ' ', core).strip()
    if len(core.split()) < 4:
        return _first_sentence(summary) or title
    return title

def fetch_feed(url, author_name, max_items=MAX_POSTS):
    """Fetch an rss.app (or any RSS 2.0 / Atom) feed, return list of post dicts."""
    if not url:
        print(f"  [{author_name}] No URL provided — skipping.")
        return []
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'AiGovOps-PostFetcher/1.0'}
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read()

        root = ET.fromstring(raw)
        ns = {'atom': 'http://www.w3.org/2005/Atom',
              'media': 'http://search.yahoo.com/mrss/'}

        # Detect RSS 2.0 vs Atom
        channel = root.find('channel')
        if channel is not None:
            # RSS 2.0
            raw_items = channel.findall('item')[:max_items]
            posts = []
            for item in raw_items:
                title = item.findtext('title', '').strip()
                link  = item.findtext('link', '').strip()
                date  = item.findtext('pubDate', '').strip()
                desc  = item.findtext('description', '') or item.findtext('content:encoded', '')
                summary = strip_html(desc)[:280]
                title = clean_title(title, summary)
                # Try to grab an image from media:thumbnail or enclosure
                image = None
                thumb = item.find('media:thumbnail', ns)
                if thumb is not None:
                    image = thumb.get('url')
                enc = item.find('enclosure')
                if not image and enc is not None and (enc.get('type', '').startswith('image')):
                    image = enc.get('url')
                posts.append({
                    'title':   title,
                    'link':    link,
                    'date':    date,
                    'summary': summary,
                    'image':   image,
                    'author':  author_name,
                })
        else:
            # Atom
            entries = root.findall('atom:entry', ns)[:max_items]
            posts = []
            for entry in entries:
                title   = entry.findtext('atom:title', '', ns).strip()
                link_el = entry.find('atom:link', ns)
                link    = link_el.get('href', '') if link_el is not None else ''
                date    = entry.findtext('atom:updated', '', ns).strip()
                summary = strip_html(entry.findtext('atom:summary', '', ns) or
                                     entry.findtext('atom:content', '', ns))[:280]
                title = clean_title(title, summary)
                posts.append({
                    'title':   title,
                    'link':    link,
                    'date':    date,
                    'summary': summary,
                    'image':   None,
                    'author':  author_name,
                })

        print(f"  [{author_name}] Fetched {len(posts)} posts.")
        return posts

    except Exception as exc:
        print(f"  [{author_name}] ERROR: {exc}")
        return []


def main():
    bob_url = os.environ.get('BOB_RSS', '').strip()
    ken_url = os.environ.get('KEN_RSS', 'https://rss.app/feeds/g12M4qd70BrS5rcy.xml').strip()

    out_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'linkedin-posts.json')
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)

    # Load last successful payload as fallback
    last_payload = None
    if os.path.exists(out_path):
        try:
            with open(out_path, encoding='utf-8') as f:
                last_payload = json.load(f)
        except Exception:
            pass

    # Staleness check — warn if last update > 48h ago
    if last_payload and last_payload.get('updated'):
        try:
            last_updated = datetime.fromisoformat(last_payload['updated'].replace('Z', '+00:00'))
            age_hours = (datetime.now(timezone.utc) - last_updated).total_seconds() / 3600
            if age_hours > 48:
                print(f"  ⚠️  WARNING: Posts data is {age_hours:.0f}h old (threshold: 48h)")
        except Exception:
            pass

    print("Fetching LinkedIn posts...")

    # Retry logic with exponential backoff
    def fetch_with_retry(url, name, retries=3):
        for attempt in range(1, retries + 1):
            result = fetch_feed(url, name)
            if result:
                return result
            if attempt < retries:
                wait = 2 ** attempt
                print(f"  [{name}] Retry {attempt}/{retries-1} in {wait}s...")
                import time; time.sleep(wait)
        return []

    bob_posts = fetch_with_retry(bob_url, 'Bob Rapp') if bob_url else []
    ken_posts = fetch_with_retry(ken_url, 'Ken Johnston')

    # If both fetches failed, keep last successful data
    if not bob_posts and not ken_posts and last_payload:
        print("  ⚠️  Both feeds failed — keeping last successful data")
        last_payload['fetch_error'] = True
        last_payload['fetch_attempted'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(last_payload, f, indent=2, ensure_ascii=False)
        print("  Preserved last successful linkedin-posts.json")
        return

    # If one feed failed, use fallback for that person
    if not bob_posts and last_payload and last_payload.get('bob'):
        print("  [Bob Rapp] Feed failed — using last successful posts as fallback")
        bob_posts = last_payload['bob']
    if not ken_posts and last_payload and last_payload.get('ken'):
        print("  [Ken Johnston] Feed failed — using last successful posts as fallback")
        ken_posts = last_payload['ken']

    payload = {
        'updated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'bob': bob_posts,
        'ken': ken_posts,
    }

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Wrote data/linkedin-posts.json  (Bob: {len(bob_posts)}, Ken: {len(ken_posts)})")


if __name__ == '__main__':
    main()
