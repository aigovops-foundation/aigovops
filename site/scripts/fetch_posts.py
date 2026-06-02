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

    print("Fetching LinkedIn posts...")
    bob_posts = fetch_feed(bob_url, 'Bob Rapp')
    ken_posts = fetch_feed(ken_url, 'Ken Johnston')

    payload = {
        'updated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'bob': bob_posts,
        'ken': ken_posts,
    }

    out_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'linkedin-posts.json')
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Wrote data/linkedin-posts.json  (Bob: {len(bob_posts)}, Ken: {len(ken_posts)})")


if __name__ == '__main__':
    main()
