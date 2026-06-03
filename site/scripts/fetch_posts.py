#!/usr/bin/env python3
"""
AiGovOps Foundation — LinkedIn Post Fetcher + NLP Quality Pipeline
Fetches the 5 latest posts from Bob and Ken's rss.app LinkedIn feeds,
runs a Claude Haiku quality pass (if ANTHROPIC_API_KEY is set),
and writes data/linkedin-posts.json for the site to display.

Run locally:   BOB_RSS="..." KEN_RSS="..." python3 scripts/fetch_posts.py
Run via CI:    GitHub Actions reads secrets automatically.
NLP pass:      Set ANTHROPIC_API_KEY secret to enable Haiku enrichment.
"""

import urllib.request
import urllib.error
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


def strip_urls(text):
    """Remove URLs from summary text for cleaner card display."""
    text = re.sub(r'https?://\S+', '', text or '')
    text = re.sub(r'\s+', ' ', text).strip()
    return text


# ── Haiku NLP Quality Pipeline ────────────────────────────────────────────────

def haiku_enrich_posts(posts, author_name):
    """
    Run a Claude Haiku pass over fetched posts to:
      1. Extract a clean 1-sentence summary if current title/summary is weak
      2. Detect language (for i18n layer)
      3. Strip embedded URLs from summaries
      4. Flag posts that are purely promotional vs. thought leadership

    Degrades gracefully if ANTHROPIC_API_KEY is not set — returns posts unchanged.
    Cost: ~$0.001 per full batch of 5 posts.
    """
    api_key = os.environ.get('ANTHROPIC_API_KEY', '').strip()
    if not api_key:
        print(f"  [{author_name}] ANTHROPIC_API_KEY not set — skipping Haiku NLP pass")
        return posts

    # Build compact prompt for all posts in one API call
    posts_text = '\n'.join([
        f'POST {i+1}:\nTitle: {p.get("title","")}\nSummary: {p.get("summary","")[:200]}'
        for i, p in enumerate(posts)
    ])

    prompt = f"""Analyze these {len(posts)} LinkedIn posts from {author_name}. For each post return a JSON array with objects containing:
- "idx": post number (1-based)
- "clean_title": A clear, compelling title (max 100 chars). If the current title is hashtag-only or vague, extract a real headline from the summary. Otherwise keep the original.
- "clean_summary": A clean 1-2 sentence summary (max 180 chars). Remove URLs, hashtags, emoji, and promotional language. Keep the insight.
- "lang": 2-letter ISO language code of the post content (en, es, fr, de, etc.)
- "type": "thought_leadership" | "announcement" | "promotional" | "personal"

Return ONLY a JSON array. No markdown, no explanation.

{posts_text}"""

    try:
        payload = json.dumps({
            'model': 'claude-haiku-4-5-20251001',
            'max_tokens': 800,
            'system': 'You are a content quality analyzer. Return only valid JSON arrays.',
            'messages': [{'role': 'user', 'content': prompt}]
        }).encode('utf-8')

        req = urllib.request.Request(
            'https://api.anthropic.com/v1/messages',
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01',
            },
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())

        # Extract text content from response
        text = ''.join(
            block.get('text', '')
            for block in data.get('content', [])
            if block.get('type') == 'text'
        )

        # Parse JSON — strip any markdown fences
        text = re.sub(r'```json|```', '', text).strip()
        enriched = json.loads(text)

        # Apply enrichments back to posts
        for item in enriched:
            idx = item.get('idx', 0) - 1
            if 0 <= idx < len(posts):
                if item.get('clean_title') and len(item['clean_title'].strip()) > 10:
                    posts[idx]['title'] = item['clean_title'].strip()
                if item.get('clean_summary') and len(item['clean_summary'].strip()) > 20:
                    posts[idx]['summary'] = item['clean_summary'].strip()
                if item.get('lang'):
                    posts[idx]['lang'] = item['lang']
                if item.get('type'):
                    posts[idx]['content_type'] = item['type']

        print(f"  [{author_name}] Haiku NLP pass complete — {len(enriched)} posts enriched")
        return posts

    except Exception as exc:
        print(f"  [{author_name}] Haiku NLP pass failed (non-fatal): {exc}")
        return posts  # degrade gracefully

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

    # Strip URLs from summaries (clean display)
    for posts in [bob_posts, ken_posts]:
        for p in posts:
            p['summary'] = strip_urls(p.get('summary', ''))

    # ── Haiku NLP Quality Pipeline (optional, requires ANTHROPIC_API_KEY) ──
    print("Running NLP quality pass...")
    bob_posts = haiku_enrich_posts(bob_posts, 'Bob Rapp')
    ken_posts = haiku_enrich_posts(ken_posts, 'Ken Johnston')

    payload = {
        'updated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'bob': bob_posts,
        'ken': ken_posts,
    }

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Wrote data/linkedin-posts.json  (Bob: {len(bob_posts)}, Ken: {len(ken_posts)})")

    # ── Regenerate RSS feed ───────────────────────────────────────────────
    rss_path = Path(__file__).parent.parent / 'feed.xml'
    _regenerate_rss(payload, rss_path)
    print(f"Wrote feed.xml")


def _rss_escape(s):
    return (s or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def _regenerate_rss(data, rss_path):
    from email.utils import formatdate
    import calendar

    def to_rfc2822(iso):
        try:
            from datetime import datetime, timezone
            dt = datetime.fromisoformat(iso.replace('Z', '+00:00'))
            return formatdate(calendar.timegm(dt.timetuple()), usegmt=True)
        except Exception:
            return formatdate(usegmt=True)

    all_posts = []
    for p in (data.get('ken') or []):
        all_posts.append((p, 'ken.johnston@aigovops.community (Ken Johnston)'))
    for p in (data.get('bob') or []):
        all_posts.append((p, 'bob.rapp@aigovops.community (Bob Rapp)'))
    all_posts.sort(key=lambda x: x[0].get('date', ''), reverse=True)

    build_date = to_rfc2822(data.get('updated', ''))
    items_xml  = ''
    for post, author in all_posts:
        title   = _rss_escape((post.get('title') or post.get('summary', ''))[:100])
        summary = _rss_escape((post.get('summary') or '')[:300])
        link    = _rss_escape(post.get('link', ''))
        pub     = to_rfc2822(post.get('date', ''))
        items_xml += f"""    <item>
      <title>{title}</title>
      <link>{link}</link>
      <description>{summary}</description>
      <author>{author}</author>
      <pubDate>{pub}</pubDate>
      <guid isPermaLink="true">{link}</guid>
    </item>\n"""

    rss = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AiGovOps Foundation — Latest from Ken &amp; Bob</title>
    <link>https://www.aigovops-foundation.com</link>
    <description>The latest posts from Ken Johnston and Bob Rapp on AI governance, policy-as-code, and open-source compliance tooling.</description>
    <language>en-us</language>
    <lastBuildDate>{build_date}</lastBuildDate>
    <atom:link href="https://www.aigovops-foundation.com/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://www.aigovops-foundation.com/images/logo.png</url>
      <title>AiGovOps Foundation</title>
      <link>https://www.aigovops-foundation.com</link>
    </image>
{items_xml}  </channel>
</rss>"""

    with open(rss_path, 'w', encoding='utf-8') as f:
        f.write(rss)


if __name__ == '__main__':
    main()
