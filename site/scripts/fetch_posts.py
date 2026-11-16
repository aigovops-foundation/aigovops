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

import sys
import urllib.request
from pathlib import Path
import urllib.error
from urllib.parse import urlparse
import xml.etree.ElementTree as ET
import json
import os
import re
from datetime import datetime, timedelta, timezone

MAX_POSTS = 10          # the most we ever show per person
MAX_AGE_DAYS = 30       # …and nothing older than this, however few that leaves

# WHY AN AGE LIMIT AND NOT JUST A COUNT. "Latest from Ken & Bob" showed posts from 2 June
# for seven weeks because the fetcher only ever asked for "the newest 5" — and the newest 5
# of a dead feed are simply the last 5 it ever saw. A count keeps the section looking full
# while it quietly stops being true. An age limit is the part that can actually go empty,
# which is the honest outcome when there is nothing recent to show.


# Set by main(); read by the exit-code contract at the bottom of this file.
#
# STATE['feed_errors'] is a dict author -> reason, written by fetch_feed(). It exists
# because the original exit contract only failed when BOTH feeds died
# (STATE['both_failed']), and "both" is the wrong quantifier: a single author's bridge
# lapsing is invisible to it, so the job reports success while half the section is
# unfetchable. One author down is one author down.
STATE = {}


def _note_feed_error(author_name, reason):
    """Record why an author's feed produced nothing, for the payload and the exit code.

    The reason reaches data/linkedin-posts.json, which is committed and served, so it is
    stripped like any other third-party string — the text comes from a remote server
    (`Trial expired. Please upgrade your plan.` is theirs, not ours) and this repo's rule
    is that every such string is hostile until it has been through the sanitiser."""
    STATE.setdefault('feed_errors', {})[author_name] = _strip_markup(str(reason))[:200]


AUTHORS = (('bob', 'Bob Rapp'), ('ken', 'Ken Johnston'))


def _health_block(fetched_counts, published_counts):
    """Per-author feed health for the committed payload. See the note in main()."""
    out = {}
    for key, name in AUTHORS:
        err = (STATE.get('feed_errors') or {}).get(name)
        out[key] = {
            'ok': not err,
            'fetched': int(fetched_counts.get(key, 0)),
            'published': int(published_counts.get(key, 0)),
            'error': err,
        }
    return out


def strip_html(text):
    """Remove HTML tags and collapse whitespace."""
    text = re.sub(r'<[^>]+>', ' ', text or '')
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def _safe_url(u):
    """An http(s) URL, or ''. Anything else is not a link we will publish."""
    raw = (u or '').strip()
    if not raw:
        return ''
    try:
        parsed = urlparse(raw)
    except Exception:
        return ''
    if parsed.scheme.lower() not in ('http', 'https') or not parsed.netloc:
        return ''
    return raw


def _strip_markup(text):
    """Tags and whitespace gone, and no stray angle bracket left behind."""
    return strip_html(text).replace('<', '').replace('>', '')


def sanitise_post(p):
    """Strip markup out of every third-party field before it is committed.

    Found by the review council, 2026-09-30. title and link came off the rss.app
    bridge with no filtering at all, and only summary saw strip_html() — which
    removes tags but is not an escaper. All four fields were then interpolated into
    the string assigned to grid.innerHTML in js/main.js, under a CSP that allows
    'unsafe-inline', so markup in a post title executed in every visitor's browser.
    The feed is not restricted to Bob's and Ken's own posts: the committed JSON has
    carried items authored by four other people.

    This is the OUTER half of a two-layer defence; js/main.js escapes at the sink.
    Deliberately a strip rather than an HTML-escape: escaping here and escaping
    again at the sink would double-encode and show visitors '&amp;lt;'. So Python
    removes markup, JavaScript escapes what is left, and neither relies on the other.
    """
    out = dict(p)
    for field in ('title', 'summary', 'author'):
        out[field] = _strip_markup(out.get(field, ''))
    out['link'] = _safe_url(out.get('link'))
    out['image'] = _safe_url(out.get('image')) or None
    return out


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

        # Apply enrichments back to posts.
        #
        # SANITISED AGAIN HERE, and the reason is not belt-and-braces. This function
        # runs AFTER fetch_feed() (main() calls it at the bottom), and it overwrites
        # title and summary with model output whose input was the hostile feed text.
        # So sanitising only on the way out of fetch_feed() leaves this path open: a
        # post crafted to steer the model into emitting markup would have landed that
        # markup in the committed JSON with the earlier strip already behind it.
        # Found by this repo's own scripts/test-fetch-sanitise.py on its first run —
        # the assertion that the sanitiser is actually on every path, rather than
        # merely defined, is what surfaced the second writer.
        for item in enriched:
            idx = item.get('idx', 0) - 1
            if 0 <= idx < len(posts):
                if item.get('clean_title') and len(item['clean_title'].strip()) > 10:
                    posts[idx]['title'] = _strip_markup(item['clean_title'].strip())
                if item.get('clean_summary') and len(item['clean_summary'].strip()) > 20:
                    posts[idx]['summary'] = _strip_markup(item['clean_summary'].strip())
                if item.get('lang'):
                    posts[idx]['lang'] = item['lang']
                if item.get('type'):
                    posts[idx]['content_type'] = item['type']

        print(f"  [{author_name}] Haiku NLP pass complete — {len(enriched)} posts enriched")
        return posts

    except Exception as exc:
        print(f"  [{author_name}] Haiku NLP pass failed (non-fatal): {exc}")
        return posts  # degrade gracefully

def _fresh_only(posts, max_age_days=None, max_items=None):
    """Newest first, nothing older than max_age_days, at most max_items.

    Posts with an unparseable date are KEPT: a feed that changes its date format should make
    the section look odd, not make it silently disappear. Dropping what we cannot read is how
    a filter turns into censorship of its own inputs."""
    from email.utils import parsedate_to_datetime
    max_age_days = MAX_AGE_DAYS if max_age_days is None else max_age_days
    max_items = MAX_POSTS if max_items is None else max_items
    cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)
    keep = []
    for p in posts or []:
        try:
            when = parsedate_to_datetime(p.get("date", ""))
            if when.tzinfo is None:
                when = when.replace(tzinfo=timezone.utc)
            if when < cutoff:
                continue
        except Exception:
            pass          # unreadable date — keep it and let a human notice
        keep.append(p)
    return keep[:max_items]


def _title_is_weak(title):
    """A title is 'weak' if, after removing hashtags, @mentions and punctuation,
    fewer than 4 real words remain — a bare '#robotaxis' or 'Well done'. This is the
    EXACT rule scripts/test-e2e-v3.sh enforces, kept in lock-step here so the data we
    publish can never fail the site's own live E2E."""
    core = re.sub(r'[#@]\S+', '', title or '')
    core = re.sub(r'[^\w\s]', '', core).strip()
    return len(core.split()) < 4


def _quality_only(posts):
    """Drop contentless feed items: a post whose title is weak AND cannot be rescued
    from its summary. We try the summary rescue first (clean_title), and only drop when
    the result is still weak — a post with a real body keeps its rescued headline; a bare
    hashtag with an empty summary is dropped rather than published as junk."""
    keep = []
    for p in posts or []:
        title = (p.get('title') or '').strip()
        if _title_is_weak(title):
            rescued = clean_title(title, p.get('summary', ''))
            if _title_is_weak(rescued):
                print(f"  dropped weak-title post: {title[:50]!r}")
                continue
            p = {**p, 'title': rescued}
        keep.append(p)
    return keep


def fetch_feed(url, author_name, max_items=MAX_POSTS):
    """Fetch an rss.app (or any RSS 2.0 / Atom) feed, return list of post dicts."""
    if not url:
        print(f"  [{author_name}] No URL provided — skipping.")
        _note_feed_error(author_name, "no feed URL configured")
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

        # One chokepoint for both the RSS and the Atom branch, so neither can be
        # extended later with an unsanitised field.
        posts = [sanitise_post(p) for p in posts]

        print(f"  [{author_name}] Fetched {len(posts)} posts.")
        if posts:
            STATE.get('feed_errors', {}).pop(author_name, None)
        else:
            _note_feed_error(author_name, "feed parsed but carried no items")
        return posts

    except Exception as exc:
        print(f"  [{author_name}] ERROR: {exc}")
        _note_feed_error(author_name, exc)
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
                STATE['stale_hours'] = age_hours
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

    # Counted HERE, before the per-author fallback below substitutes yesterday's posts.
    # `fetched` has to mean "what the bridge handed us on this run" or it cannot
    # distinguish a live feed from a dead one being papered over by the fallback — which
    # is the whole distinction the health block exists to record.
    fetched_counts = {'bob': len(bob_posts), 'ken': len(ken_posts)}
    if not bob_url:
        _note_feed_error('Bob Rapp', "no feed URL configured")

    # If both fetches failed, keep last successful data
    if not bob_posts and not ken_posts and last_payload:
        print("  ⚠️  Both feeds failed — keeping last successful data")
        STATE['both_failed'] = True
        last_payload['fetch_error'] = True
        last_payload['fetch_attempted'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        # Re-stamp health on THIS path too. It returns early, so without this line the
        # file keeps the previous run's `feed_health` — a block saying `ok: true` sitting
        # beside `fetch_error: true`, which is the one state the block must never report.
        last_payload['feed_health'] = _health_block(
            fetched_counts, {'bob': len(last_payload.get('bob') or []),
                             'ken': len(last_payload.get('ken') or [])})
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

    # Drop contentless items (bare hashtags, one-word posts) BEFORE the top-N cut, so a
    # junk post never crowds a real one out of the freshness window.
    bob_posts, ken_posts = _quality_only(bob_posts), _quality_only(ken_posts)

    # The freshness rule, applied per person: at most MAX_POSTS, none older than
    # MAX_AGE_DAYS. Fallback data from a dead feed is filtered by the SAME rule, so a
    # person whose feed has been down for a month goes empty rather than showing a museum.
    bob_fresh, ken_fresh = _fresh_only(bob_posts), _fresh_only(ken_posts)
    print(f"  freshness: Bob {len(bob_fresh)}/{len(bob_posts)} kept, "
          f"Ken {len(ken_fresh)}/{len(ken_posts)} kept "
          f"(max {MAX_POSTS}, newer than {MAX_AGE_DAYS}d)")

    # THE RUN JUST FIXED THE STALENESS IT WARNED ABOUT AT STARTUP.
    #
    # The age check at the top reads the PREVIOUS file, which is exactly right as a warning
    # — but it left STATE['stale_hours'] set, so the exit contract then failed a run that had
    # just fetched 20 fresh posts, and the failure stopped the commit step before the good
    # data could land. My own guard became the thing blocking the fix, which is the same
    # shape as the missing-Path crash it was written to catch.
    #
    # A guard must judge the state it LEAVES BEHIND, not the state it arrived in.
    if bob_fresh or ken_fresh:
        STATE.pop('stale_hours', None)

    # FEED HEALTH IS NOT THE SAME FACT AS "THE SECTION HAS POSTS", AND CONFLATING THEM
    # KEPT `main` RED FOR ELEVEN DAYS.
    #
    # scripts/test-e2e-v3.sh asserted `ken_count > 0` against the published file. On
    # 2026-09-20 that went red and stayed red — not because anything here broke, but
    # because Ken's newest LinkedIn post was 20 Aug and the 30-day rule above correctly
    # dropped the last of them. The only failing assertion on main was, in effect, "a
    # co-founder posted recently": a fact about a person that no commit can make true, so
    # the lane could not go green and everyone learned to read Cloud-Mary's verdict as
    # noise. That is a worse outcome than an empty section.
    #
    # So the file now records WHY a section is empty, and the live test asserts the half
    # this repo actually controls:
    #   fetched   — items the bridge handed us. Zero with a URL configured is a DEFECT.
    #   published — items that survived the freshness rule. Zero is a legitimate state.
    #   ok        — the bridge was reachable and carried items.
    # An author who is simply not posting is `ok: true, published: 0`, which is healthy.
    # A lapsed bridge (HTTP 402, as happened in June) is `ok: false`, which is not.
    health = _health_block(fetched_counts, {'bob': len(bob_fresh), 'ken': len(ken_fresh)})

    payload = {
        'updated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'feed_health': health,
        'bob': bob_fresh,
        'ken': ken_fresh,
    }

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Wrote data/linkedin-posts.json  (Bob: {len(bob_fresh)}, Ken: {len(ken_fresh)})")

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


# --------------------------------------------------------------------------------------
# GREEN MUST MEAN FRESH.
#
# This script already DETECTED both failure modes — it printed "Posts data is 1140h old"
# and "Both feeds failed" — and then returned normally, so the GitHub Action exited 0 and
# went green. The RSS bridge subscription lapsed on 2 June 2026 (HTTP 402 on both feeds)
# and the site showed June posts under the heading "Latest" for SEVEN WEEKS. Nobody was
# told, because the only thing that could have told them was reporting success.
#
# A job that reports success while producing nothing is worse than a job that fails: it
# spends the trust it has not earned. So the exit code now carries the truth.
#
# Keeping the last good data is still right — a blank section helps nobody — but it is a
# DEGRADED state, and degraded is not success.

if __name__ == '__main__':
    main()
    problems = []
    if STATE.get('both_failed'):
        problems.append("both RSS feeds failed (check the bridge subscription — a lapsed "
                        "plan returns HTTP 402)")
    # ONE AUTHOR DOWN IS ONE AUTHOR DOWN.
    #
    # The check above was the whole guard, and "both" let a single lapsed bridge through
    # as success: the other author's posts kept arriving, the job stayed green, and the
    # only red signal anywhere was a live-site assertion that said "Ken has posts — 0
    # posts" — which names a symptom shared by a dead bridge and a founder on holiday.
    # Eleven days of red main later, nobody could tell which it was without reading this
    # file. A per-author fault now names itself.
    for name, reason in sorted((STATE.get('feed_errors') or {}).items()):
        if not STATE.get('both_failed'):
            problems.append(f"{name}'s feed produced nothing: {reason}")
    if STATE.get('stale_hours'):
        problems.append(f"posts data is {STATE['stale_hours']:.0f}h old "
                        f"(threshold 48h) — the feed is not updating")
    if problems:
        print("\n::error::LinkedIn feed is NOT healthy — " + "; ".join(problems))
        print("The site now shows profile links instead of stale posts, so visitors are not "
              "misled. Fix the feed source to restore live posts.")
        sys.exit(1)
