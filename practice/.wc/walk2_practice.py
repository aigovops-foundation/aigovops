#!/usr/bin/env python3
"""Café Walk run 2 — practice fixes: step 1 is a link; the level-100 worksheet reads without
release plumbing; the nav is short and says things once; Thursday opens on Next Thursday and
carries the way in; one way to ask; the doors exist without JavaScript."""
import re, os, sys
ROOT = os.getcwd()
def rd(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def wr(p, s): open(os.path.join(ROOT, p), 'w', encoding='utf-8').write(s)
def must(c, m):
    if not c: sys.exit('FAIL: ' + m)

CASES = 'https://www.aigovops-foundation.com/f-ai-friday.html'
# 1 · step 1 is a link (every level, EN + ES)
for p, first in [('levels/100-begin/WORKSHEET.md', 'VH-001'), ('docs/es/levels/100-begin/WORKSHEET.md', 'VH-001'),
                 ('levels/200-retrofit/WORKSHEET.md', None), ('levels/300-hold/WORKSHEET.md', None), ('levels/400-prove/WORKSHEET.md', None)]:
    s = rd(p); o = s
    link = CASES + ('?id=' + first if first else '')
    s = s.replace('(`f-ai-friday.html`)', '([%s](%s))' % ('the 100 cases' if '/es/' not in p else 'los 100 casos', link))
    s = s.replace('the public cases page on the site (', 'the public cases page (') if False else s
    if s == o and 'f-ai-friday' not in s:
        # other levels name the cases differently; link the first mention of "FailFest"
        s = s.replace('FailFest', '[FailFest](%s)' % link, 1)
    wr(p, s)

# 2 · level 100 reads without release plumbing (everything on it is live today)
p = 'levels/100-begin/WORKSHEET.md'; s = rd(p)
s = re.sub(r'\n\*\*Train:\*\*[^\n]*', '', s)
s = s.replace('| Step | Minutes | Status |\n|---|---|---|\n', '| Step | Minutes |\n|---|---|\n')
s = re.sub(r'^\| (\d[^|]*)\| (\d+) \| live[^|]*\|$', r'| \1| \2 |', s, flags=re.M)
s = re.sub(r'^(### \d · [^\n]*?\((?:\d+) min\)) — live[^\n]*$', r'\1', s, flags=re.M)
s = re.sub(r'\n\*Fall:\* the Gate Check page gains[^\n]*\n[^\n]*\n[^\n]*', '\n*Today the decision is yours on paper; the receipt in step 5 is real.*', s)
must('| Status |' not in s and '— live' not in s and 'Train:' not in s, 'level-100 plumbing still present')
# 3 · one way to ask
s = s.replace('Post the bundle hash in the cohort thread with your one sentence. A host marks asynchronously; ask Wren for the next second-hour Thursday (proposed for people who cannot make 09:00 Pacific).',
              'Write the bundle hash and your one sentence on your Wren Card and [send it to a person](https://community.aigovops-foundation.com/help.html); a host marks asynchronously and pairs you for the next Thursday you can make.')
s = s.replace('Hover the tier in the worksheet on Pages, or ask Wren: one sentence each.', 'One sentence each, above in step 2.')
must('ask Wren' not in s and 'cohort thread' not in s, 'ask Wren still in 100')
wr(p, s)
p = 'docs/es/levels/100-begin/WORKSHEET.md'; s = rd(p)
s = re.sub(r'Publica el hash del paquete en el hilo de la cohorte con tu frase\.', 'Escribe el hash del paquete y tu frase en tu Wren Card y [envíalo a una persona](https://community.aigovops-foundation.com/help.html).', s)
wr(p, s)

# 4 · the nav is short and says things once (Manifesto and Community live in the café's back room)
p = '_layouts/default.html'; s = rd(p)
nav_old = re.search(r'<nav class="practice-nav" aria-label="Practice">.*?</nav>', s, re.S); must(nav_old, 'layout nav')
nav_new = '''<nav class="practice-nav" aria-label="Practice">
      <b><a href="{{ "/" | relative_url }}">The café</a></b>
      <a href="{{ "/levels/100-begin/WORKSHEET.html" | relative_url }}">100</a>
      <a href="{{ "/levels/200-retrofit/WORKSHEET.html" | relative_url }}">200</a>
      <a href="{{ "/levels/300-hold/WORKSHEET.html" | relative_url }}">300</a>
      <a href="{{ "/levels/400-prove/WORKSHEET.html" | relative_url }}">400</a>
      <a href="{{ "/docs/THURSDAY.html" | relative_url }}">Thursday</a>
      <a href="https://github.com/aigovops-foundation/practice">GitHub</a>
    </nav>'''
s = s.replace(nav_old.group(0), nav_new); wr(p, s)

# 5 · Thursday opens on Next Thursday and carries the way in; the adoption note goes last
p = 'docs/THURSDAY.md'; s = rd(p)
note = re.search(r'\n\*Adopted 11 September 2026.*?\*\n', s, re.S); must(note, 'adoption note')
s = s.replace(note.group(0), '\n')
s = s.replace('''· Ken hosts · join from the
[community events page](https://community.aigovops-foundation.com/events.html) — the link is posted there the
morning of. Bring a receipt, or come to watch one. *(A host updates this line each week.)*''',
'''· Ken hosts.

**Join:** the host posts the meeting link **here** and on the
[community events page](https://community.aigovops-foundation.com/events.html) by 08:45 Pacific on the day;
until then this line is the promise. Bring a receipt, or come to watch one. *(A host updates this line each week.)*''')
s = s.replace('The second-hour Thursday (for people who cannot make 09:00) is proposed, not yet on the calendar; ask Wren.',
              'The second-hour Thursday (for people who cannot make 09:00 Pacific) is proposed, not yet on the calendar; say so on your Wren Card and a host pairs you.')
s = s.rstrip('\n') + '\n\n---\n\n<small>' + note.group(0).strip().strip('*') + '</small>\n'
must('ask Wren' not in s, 'ask Wren still in Thursday')
wr(p, s)

# 6 · the doors exist without JavaScript; the cohort thread has a door
p = 'index.html'; s = rd(p)
if '<noscript' not in s:
    s = s.replace('<div class="doors" id="doors"></div>', '''<div class="doors" id="doors"></div>
  <noscript><ul class="doors-noscript">
    <li><a href="levels/100-begin/WORKSHEET.html">Level 100 · Begin — An AI told someone something it shouldn't have — and now we're on the hook.</a></li>
    <li><a href="levels/200-retrofit/WORKSHEET.html">Level 200 · Retrofit — I have a bot or an agent already, and I'm not sure it's safe to ship.</a></li>
    <li><a href="levels/300-hold/WORKSHEET.html">Level 300 · Hold — It's already running, and nobody can say who's watching it or how to stop it.</a></li>
    <li><a href="levels/400-prove/WORKSHEET.html">Level 400 · Prove it — Someone needs proof of what the AI actually did.</a></li>
    <li><a href="https://community.aigovops-foundation.com/gate-check.html?src=cafe">Not sure yet — the ten-minute Gate Check.</a></li>
  </ul></noscript>''')
s = s.replace('Post the hash and your sentence in the cohort thread; a host marks asynchronously.',
              'Write the hash and your sentence on your Wren Card and <a href="https://community.aigovops-foundation.com/help.html">send it to a person</a>; a host marks asynchronously.')
wr(p, s)
print('practice edits applied')
