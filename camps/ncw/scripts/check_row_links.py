#!/usr/bin/env python3
"""Validate local href/src references in the Row Edition pages."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1] / 'docs'
PAGES = [ROOT/'row-edition.html', *sorted((ROOT/'kit').glob('*.html')), *[ROOT/'tools'/x for x in ['microsoft-copilot.html','microsoft-scout.html','elevenlabs.html','invideo.html']], ROOT/'index.html', ROOT/'workshop.html', ROOT/'checklist.html', ROOT/'resources.html', ROOT/'tools.html', ROOT/'whats-new.html']

class Finder(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in {'href','src'} and value:
                self.refs.append((tag,key,value))

def local(value):
    u=urlsplit(value)
    return not u.scheme and not u.netloc and not value.startswith(('#','data:','javascript:'))

missing=[]; checked=0
for page in PAGES:
    parser=Finder(); parser.feed(page.read_text())
    for tag,key,value in parser.refs:
        if not local(value):
            continue
        path=unquote(urlsplit(value).path)
        if not path:
            continue
        target=(page.parent/path).resolve()
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): missing.append((page.relative_to(ROOT),tag,key,value,target.relative_to(ROOT.parent)))
        checked+=1
if missing:
    print('BROKEN LOCAL REFERENCES:')
    for item in missing: print('  %s <%s %s=%r> -> %s' % item)
    sys.exit(1)
print(f'PASS: {checked} local href/src references resolve across {len(PAGES)} Row Edition or updated pages.')
