#!/usr/bin/env python3
"""The café is the home page; the site is home + one level (Library · Open source · Blog · Join),
with one more level only for leaves (blog posts, the public cases, the frameworks explorer).
Run from the site repo root. Idempotent where it can be."""
import os, re, glob, shutil, sys
os.chdir(os.getcwd())
def rd(p): return open(p, encoding="utf-8").read()
def wr(p, s): open(p, "w", encoding="utf-8").write(s)
def sub1(s, a, b, where=""):
    if a not in s: raise SystemExit(f"anchor not found {where}: {a[:80]!r}")
    return s.replace(a, b, 1)

# ── images ─────────────────────────────────────────────────────────────────────
os.makedirs("images/wren", exist_ok=True)
PR = os.path.expanduser("~/Downloads/_aigov/Open-Source-Unified-Sept-2026/docs/wren/")
shutil.copy(PR + "wren-coffee-shop-public.jpg", "images/wren/cafe.jpg")
shutil.copy(PR + "wren-112.jpg", "images/wren/wren-112.jpg")

# ── 1. nav on every page that carries the site nav ─────────────────────────────
def nav_html(prefix, active):
    items = [("index.html", "Home", 'data-i18n="nav.home"'), ("library.html", "Library", 'data-i18n="nav.library"'),
             ("open-source.html", "Open source", 'data-i18n="nav.opensource"'), ("blog.html", "Blog", 'data-i18n="nav.blog"'),
             ("community.html", "Join", 'class="nav-join"')]
    out = []
    for href, label, attr in items:
        cls = ""
        if href == active:
            cls = ' class="active"' if "class=" not in attr else ""
            if "class=" in attr: attr = attr.replace('class="', 'class="active ')
        out.append(f'      <a href="{prefix}{href}"{cls} {attr}>{label}</a>')
    return '<nav class="main-nav">\n' + "\n".join(out) + "\n    </nav>"

FOOT = """<nav class="footer-nav">
      <a href="{p}index.html">Home</a>
      <a href="{p}library.html">Library</a>
      <a href="{p}open-source.html">Open source</a>
      <a href="{p}community.html">Community</a>
      <a href="https://community.aigovops-foundation.com" target="_blank" rel="noopener">Community platform</a>
      <a href="{p}blog.html">Blog</a>
      <a href="{p}founders.html">Founders</a>
      <a href="{p}support.html">Support</a>
      <a href="{p}privacy.html">Privacy</a>
      <a href="{p}terms.html">Terms</a>
      <a href="/feed.xml">RSS</a>
      <a href="https://aigovops.substack.com/" target="_blank" rel="noopener">Newsletter</a>
    </nav>"""

pages = sorted(glob.glob("*.html") + glob.glob("blog/*.html"))
for p in pages:
    s = rd(p)
    if 'http-equiv="refresh"' in s: continue
    m = re.search(r'<nav class="main-nav">.*?</nav>', s, re.S)
    if m:
        prefix = "../" if p.startswith("blog/") else ""
        active = "blog.html" if p.startswith("blog/") else os.path.basename(p)
        s = s[:m.start()] + nav_html(prefix, active) + s[m.end():]
    m = re.search(r'<nav class="footer-nav">.*?</nav>', s, re.S)
    if m:
        prefix = "../" if p.startswith("blog/") else ""
        s = s[:m.start()] + FOOT.format(p=prefix) + s[m.end():]
    wr(p, s)
print("nav + footer updated on", len(pages), "pages")

# ── 2. the home page: the café ─────────────────────────────────────────────────
s = rd("index.html")
s = sub1(s, '<p class="hero-sub" data-i18n="hero.sub">Governance as code that makes AI safe to say yes to — built in the open, proven in ten minutes. Come see. Come join.</p>',
            '<p class="hero-sub" data-i18n="hero.sub">Governance as code that makes AI safe to say yes to — built in the open, proven in ten minutes. Sit down: what brought you in?</p>', "hero.sub")
s = sub1(s, '<img src="images/porch/hero-garden.jpg" alt="" width="2400" height="780" loading="eager" />',
            '<img src="images/wren/cafe.jpg" alt="" width="1600" height="900" loading="eager" />', "hero band")
s = re.sub(r'\s*<div class="porch-band-markers" aria-hidden="true">.*?</div>', "", s, count=1, flags=re.S)
s = sub1(s, 'class="action-card action-beacon" onclick="if(window.plausible)plausible(\'Home: Read the Library\')"',
            'class="action-card action-beacon" onclick="if(window.plausible)plausible(\'Home: Read the Library\')" data-x="1"', "come see")
s = s.replace('<a href="https://community.aigovops-foundation.com/library/" target="_blank" rel="noopener" class="action-card action-beacon" onclick="if(window.plausible)plausible(\'Home: Read the Library\')" data-x="1">',
              '<a href="library.html" class="action-card action-beacon" onclick="if(window.plausible)plausible(\'Home: Read the Library\')">')
# quiet links: one short line
m = re.search(r'<p class="hero-quiet-links" style="margin-top:14px;font-size:0.92rem;">.*?</p>', s, re.S)
quiet = """<p class="hero-quiet-links" style="margin-top:14px;font-size:0.92rem;">
      Or <button onclick="window.SCHEDULE && window.SCHEDULE.open()" aria-label="Schedule a call with a community leader" style="cursor:pointer;background:none;border:none;padding:0;font:inherit;color:inherit;text-decoration:underline;">schedule a call with a community leader</button>
      &nbsp;·&nbsp; <a href="https://aigovops.substack.com/" target="_blank" rel="noopener">Newsletter</a>
      &nbsp;·&nbsp; <a href="community.html#ways-to-contribute" onclick="if(window.plausible)plausible('Home: Give time')">give time</a>
      &nbsp;·&nbsp; <a href="support.html" onclick="if(window.plausible)plausible('Home: Give money')">give money</a>
    </p>"""
s = s[:m.start()] + quiet + s[m.end():]

CAFE = """
<!-- THE CAFÉ — start with your problem (11 Sept 2026: the café is the home page) -->
<section class="section-light cafe-section" id="problem" aria-labelledby="cafe-title">
  <div class="container">
    <div class="cafe-head">
      <img src="images/wren/wren-112.jpg" alt="Wren, the practitioner at the table" width="56" height="56" class="cafe-wren" />
      <div>
        <h2 class="section-title" id="cafe-title" style="text-align:left;margin-bottom:4px">What brought you in?</h2>
        <p class="cafe-lead">Wren keeps the table by the door. Say what happened — or what you are afraid will happen — and leave in an hour with a rule in your own words, a signed receipt, and a Thursday. Every door below is a real case from the hundred verified AI harms.</p>
      </div>
    </div>
    <div class="cafe-doors">
      <a class="cafe-door" href="https://www.aigovops-foundation.com/practice/#promise" onclick="if(window.plausible)plausible('Cafe: 100')"><span class="cafe-lv">Level 100 · Begin · 45 min</span><q>An AI told someone something it shouldn't have — and now we're on the hook.</q><small>Air Canada, 2022. A rule, one decision, a real signed receipt in your browser.</small></a>
      <a class="cafe-door" href="https://www.aigovops-foundation.com/practice/#ship" onclick="if(window.plausible)plausible('Cafe: 200')"><span class="cafe-lv">Level 200 · Retrofit · 60 min</span><q>I have a bot or an agent already, and I'm not sure it's safe to ship.</q><small>The $1 Chevy; Knight Capital. Your rule in CI, refusing the merge on weakening.</small></a>
      <a class="cafe-door" href="https://www.aigovops-foundation.com/practice/#running" onclick="if(window.plausible)plausible('Cafe: 300')"><span class="cafe-lv">Level 300 · Hold · 60 min</span><q>It's already running, and nobody can say who's watching it or how to stop it.</q><small>Arup; Cigna PXDX; nH Predict. Holds for a named human, and the decay arithmetic.</small></a>
      <a class="cafe-door" href="https://www.aigovops-foundation.com/practice/#prove" onclick="if(window.plausible)plausible('Cafe: 400')"><span class="cafe-lv">Level 400 · Prove it · 60 min + a Thursday</span><q>Someone needs proof of what the AI actually did — a regulator, a court, a board.</q><small>Robodebt; Toeslagenaffaire; Horizon. Verify evidence you did not make, offline.</small></a>
      <a class="cafe-door cafe-door-start" href="https://community.aigovops-foundation.com/gate-check.html?src=home-cafe" target="_blank" rel="noopener" onclick="if(window.plausible)plausible('Cafe: Gate Check')"><span class="cafe-lv">Start here · 10 min</span><q>I'm not sure what my problem is — I just know AI is in the building.</q><small>The ten-minute Gate Check. No account. You keep the card.</small></a>
    </div>
  </div>
</section>

<!-- TEN MINUTES — the one thing to do first -->
<section class="section-mid ten-section" id="ten" aria-labelledby="ten-title">
  <div class="container">
    <h2 class="section-title" id="ten-title">Ten minutes to get started</h2>
    <ol class="ten-steps">
      <li><b>Run the Gate Check.</b> Ten questions about one AI you know. No account, nothing installed.</li>
      <li><b>Keep the Gate Card.</b> Your verdict and your gaps — never your answers. It is your first receipt.</li>
      <li><b>Pick the door that stung.</b> One hour on a real case; a rule in your own words; a signed receipt; then Thursday at 09:00, where a host marks it.</li>
    </ol>
    <p class="ten-cta"><a href="https://community.aigovops-foundation.com/gate-check.html?src=home-ten" target="_blank" rel="noopener" class="btn btn-primary" onclick="if(window.plausible)plausible('Home: Ten minutes')">Run the ten-minute Gate Check →</a> <span class="ten-note">Then everything else on this site is one click away: <a href="library.html">the Library</a> to read, <a href="open-source.html">the open source</a> to build, <a href="community.html">the community</a> to return to.</span></p>
  </div>
</section>
"""
s = sub1(s, "<!-- CORE PILLARS -->", CAFE + "\n<!-- CORE PILLARS -->", "pillars marker")
s = sub1(s, '<h2 class="section-title" data-i18n="pillars.title">Our Core Pillars</h2>',
            '<h2 class="section-title" data-i18n="pillars.title">The four gates — one rule, four moments</h2>', "pillars title")
# the tradeoffs card goes to the open-source page
s = re.sub(r'<!-- ANNOUNCEMENT: DataCenter-Ai-And-Social-Tradeoffs -->.*?</section>\s*', "", s, count=1, flags=re.S)
s = sub1(s, '<a href="stay-at-yes.html#toolkit" class="toolkit-link">Explore the toolkit on Stay at Yes <span class="toolkit-arrow">→</span></a>',
            '<a href="open-source.html#toolkit" class="toolkit-link">Explore the open source <span class="toolkit-arrow">→</span></a>', "toolkit link")
CSS = """
    /* ── the café (11 Sept 2026) ── */
    .cafe-section { padding: 56px 0; }
    .cafe-head { display: flex; gap: 18px; align-items: flex-start; max-width: 860px; margin: 0 auto 26px; }
    .cafe-wren { width: 56px; height: 56px; border-radius: 50%; border: 2px solid var(--garden-gold, #E8B54A); flex: none; }
    .cafe-lead { color: var(--garden-ink-soft, #55524a); font-size: 1rem; line-height: 1.6; margin: 0; max-width: 62ch; }
    .cafe-doors { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; }
    .cafe-door { display: grid; gap: 6px; background: #fff; border: 1px solid rgba(43,43,40,.14); border-radius: 14px; padding: 18px 20px; text-decoration: none; color: inherit; transition: border-color .15s, transform .15s; }
    .cafe-door:hover, .cafe-door:focus-visible { border-color: var(--garden-green, #2E7D4F); transform: translateY(-2px); outline: none; }
    .cafe-door q { quotes: "“" "”"; font-family: var(--porch-serif, var(--garden-serif, Georgia, serif)); font-style: italic; font-size: 1.12rem; line-height: 1.3; color: var(--garden-charcoal, #2b2b28); }
    .cafe-door small { color: var(--garden-ink-soft, #55524a); font-size: .86rem; line-height: 1.5; }
    .cafe-lv { font: 600 11px 'Courier New', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--garden-green-ink, #1F5E3A); }
    .cafe-door-start { background: var(--garden-deep-cream, #F3EBDD); }
    .ten-section { padding: 56px 0; }
    .ten-steps { max-width: 760px; margin: 0 auto 22px; padding-left: 1.4em; line-height: 1.7; font-size: 1.02rem; }
    .ten-steps li { margin-bottom: 8px; }
    .ten-steps b { color: var(--garden-charcoal, #2b2b28); }
    .ten-cta { text-align: center; margin: 0; }
    .ten-note { display: block; margin-top: 14px; font-size: .92rem; color: var(--garden-ink-soft, #55524a); }
    @media (max-width: 600px) { .cafe-head { flex-direction: column; } }
"""
s = sub1(s, "    /* the toolkit band, reduced to one line", CSS + "    /* the toolkit band, reduced to one line", "css hook")
s = s.replace('<meta name="description" content="Ship safe AI — never unsafe AI. Get to yes, stay at yes, recover to yes: governance as code, verifiable evidence, and proof in ten minutes." />',
              '<meta name="description" content="Ship safe AI — never unsafe AI. Sit down at the AiGovOps Foundation café: say what brought you in, run the ten-minute Gate Check, and leave in an hour with a rule, a signed receipt and a Thursday." />')
wr("index.html", s)
print("index.html: the café")

# ── 3. library.html from get-to-yes + recover-to-yes ───────────────────────────
g = rd("get-to-yes.html"); r = rd("recover-to-yes.html")
lib = g
lib = lib.replace("<title>Get to Yes — before you ship | AiGovOps Foundation</title>", "<title>The Library | AiGovOps Foundation</title>")
lib = re.sub(r'<link rel="canonical" href="[^"]+" />', '<link rel="canonical" href="https://www.aigovops-foundation.com/library.html" />', lib, count=1)
lib = re.sub(r'<meta name="description" content="[^"]*" />', '<meta name="description" content="The Library — one hundred verified AI harms, each with the gate that would have caught it; the practitioner test; the gates, live; forty frameworks. Free to read: join with an email, nothing more. Ship safe AI — never unsafe AI." />', lib, count=1)
lib = re.sub(r'<meta property="og:title" content="[^"]*" />', '<meta property="og:title" content="The Library | AiGovOps Foundation" />', lib, count=1)
lib = re.sub(r'<meta property="og:url" content="[^"]*" />', '<meta property="og:url" content="https://www.aigovops-foundation.com/library.html" />', lib, count=1)
lib = re.sub(r'<meta property="og:description" content="[^"]*" />', '<meta property="og:description" content="Come see: the hundred verified cases, the test, the gates live, the frameworks — one door." />', lib, count=1)
# carry recover-to-yes styles (rec-assets, gatelaw)
rstyle = re.search(r"<style>(.*?)</style>", r, re.S).group(1)
lib = sub1(lib, "</style>", rstyle + "\n  </style>", "lib style")
# hero
lib = sub1(lib, '<p class="hero-eyebrow">Get to yes · before you ship</p>', '<p class="hero-eyebrow">Come see · the Library</p>', "lib eyebrow")
lib = sub1(lib, "<h1>Get to yes.</h1>", "<h1>The Library.</h1>", "lib h1")
lib = sub1(lib, "<p>Everything that helps you earn a yes before your AI touches the world.</p>",
                "<p>One hundred verified AI harms, each with the gate that would have caught it. The practitioner test. The gates, live. Forty frameworks. Free to read — join with an email, nothing more.</p>", "lib sub")
lib = lib.replace("plausible('Get to Yes: Read the Library')", "plausible('Library: Read the Library')")
lib = sub1(lib, '<h2 class="section-title" style="text-align:center">Before you ship</h2>', '<h2 class="section-title" style="text-align:center">What is inside</h2>', "lib h2")
lib = sub1(lib, "<h3>The rest of the shelf</h3>", "<h3>Also on the way in</h3>", "shelf")
lib = sub1(lib, "The source of truth — the governed core that defines the agents, skills, and design every other property uses. Joining costs registration, never money or secrecy.",
                "The members&rsquo; Library: the corpus, the test, FailFest, the gates live, the durability plan and the quantum wing — the governed core everything else on this site reads from. Joining costs registration, never money or secrecy.", "lib role")
lib = sub1(lib, '<li>⚛️ <a class="go" href="https://community.aigovops-foundation.com/library/aigovops-for-quantum/"',
                '<li>🛡️ <a class="go" href="https://community.aigovops-foundation.com/library/durability-plan.html" target="_blank" rel="noopener">The durability plan →</a> How the Library outlives its authors — in the members&rsquo; Library.</li>\n          <li>👀 <a class="go" href="https://community.aigovops-foundation.com/library/gates.html" target="_blank" rel="noopener">The gates, live →</a> Watch a proposal earn a 1, a 0 or a ?; the <a href="https://community.aigovops-foundation.com/library/watch-gates.html" target="_blank" rel="noopener">recorded walkthrough</a> if you have five minutes.</li>\n          <li>⚛️ <a class="go" href="https://community.aigovops-foundation.com/library/aigovops-for-quantum/"', "quantum li")
# recover's practice section + gate law, inserted after the first section; drop the estate map
rec_sec = re.search(r'  <section class="section" style="background:var\(--light\)">\s*<div class="container">\s*<h2 class="section-title" style="text-align:center">Practice the recovery</h2>.*?</section>\n', r, re.S).group(0)
rec_sec = rec_sec.replace("Practice the recovery", "The cases").replace('id="cases"', "")
rec_sec = rec_sec.replace('<section class="section" style="background:var(--light)">', '<section class="section" id="cases" style="background:var(--garden-cream)">', 1)
rec_sec = rec_sec.replace("<p style=\"margin:0\">Real, source-cited AI failures", '<p style="margin:0 0 8px">Real, source-cited AI failures')
rec_sec = rec_sec.replace("each case carries the gate that would have caught it.</p>",
                          'each case carries the gate that would have caught it. <a class="go" href="f-ai-friday.html" onclick="if(window.plausible)plausible(\'Library: F-AI-Friday corpus\')">Read the 100 cases — public, no account →</a></p>')
gatelaw = re.search(r'  <!-- THE GATE LAW.*?</section>\n', r, re.S).group(0)
st = lib.index('<div class="map-wrap">'); i = lib.index('<h2 class="map-title">'); en = lib.index("</div>\n", lib.index("</svg>", i)) + len("</div>\n") if "</svg>" in lib[i:] else lib.index("</div>", i) + 6
# the map-wrap closes after its inner container: find the matching close by counting divs
depth = 0; j = st
while True:
    m = re.compile(r"<div\b|</div>").search(lib, j)
    depth += 1 if m.group(0).startswith("<div") else -1
    j = m.end()
    if depth == 0: break
en = j
class _E: pass
estate = _E(); estate.start = lambda: st; estate.end = lambda: en
lib = lib[:estate.start()] + "\n" + rec_sec + "\n" + gatelaw + lib[estate.end():]
wr("library.html", lib)
print("library.html written")

# ── 4. open-source.html from stay-at-yes ───────────────────────────────────────
o = rd("stay-at-yes.html")
o = o.replace("<title>Stay at Yes — while it runs | AiGovOps Foundation</title>", "<title>Open source | AiGovOps Foundation</title>")
o = re.sub(r'<link rel="canonical" href="[^"]+" />', '<link rel="canonical" href="https://www.aigovops-foundation.com/open-source.html" />', o, count=1)
o = re.sub(r'<meta name="description" content="[^"]*" />', '<meta name="description" content="The open source — one practice (four levels, one hour each) and three engines: Beacon signs, Umbrella declares, Lantern reads. Apache-2.0, conforming to OVERT. Ship safe AI — never unsafe AI." />', o, count=1)
o = re.sub(r'<meta property="og:title" content="[^"]*" />', '<meta property="og:title" content="Open source | AiGovOps Foundation" />', o, count=1)
o = re.sub(r'<meta property="og:url" content="[^"]*" />', '<meta property="og:url" content="https://www.aigovops-foundation.com/open-source.html" />', o, count=1)
o = re.sub(r'<meta property="og:description" content="[^"]*" />', '<meta property="og:description" content="Come try, then build: the practice and the three engines, all Apache-2.0." />', o, count=1)
o = sub1(o, '<p class="hero-eyebrow">Stay at yes · while it runs</p>', '<p class="hero-eyebrow">Come try · the open source</p>', "os eyebrow")
o = sub1(o, "<h1>Stay at yes.</h1>", "<h1>Open source.</h1>", "os h1")
o = sub1(o, "<p>An earned yes only holds while the evidence keeps flowing — this is the running side of the estate, live and on the record.</p>",
            "<p>One practice and three engines, all Apache-2.0, all conforming to <a href=\"https://overt.is/\" target=\"_blank\" rel=\"noopener\">OVERT</a>. Start at the café; finish with a receipt a stranger can verify.</p>", "os sub")
o = o.replace('<a href="#live" class="btn btn-primary" style="font-size:1.05rem;padding:14px 34px;border-radius:999px">See it run live →</a>',
              '<a href="https://www.aigovops-foundation.com/practice/" class="btn btn-primary" style="font-size:1.05rem;padding:14px 34px;border-radius:999px" onclick="if(window.plausible)plausible(\'Open source: cafe\')">Start at the café →</a>')
o = o.replace("gate-check.html?src=stay-at-yes", "gate-check.html?src=open-source").replace("plausible('Gate Check: stay-at-yes')", "plausible('Gate Check: open-source')").replace("Stay at Yes: ", "Open source: ")
PRACTICE = """
<!-- THE PRACTICE — one hour of value at every level -->
<section class="section" id="practice" style="background:var(--light);padding:64px 24px">
  <div class="container">
    <p style="font-size:.72rem;font-weight:700;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:.14em;color:var(--garden-green-ink);margin-bottom:10px">The practice · Fall 2026 Release · v1.0.0-rc.1</p>
    <h2 style="margin-bottom:6px">Four levels. One hour each. The marks are the credential.</h2>
    <p style="color:var(--garden-ink-soft);font-size:.9rem;max-width:620px;margin-bottom:28px">Whatever your policy skill or your technical skill, start where you are. Every level runs on a real case from the hundred verified harms, in plain words or as code — the same receipt either way — and ends on Thursday, where a host marks it. Levels describe your practice, never a system&rsquo;s assurance.</p>
    <div class="tools">
      <div class="tool"><span class="tag">☕ Start here</span><h3>The café</h3><p>Wren asks what brought you in. Five doors, each a real case; your card, built in the browser; your worksheet opened for you.</p><a href="https://www.aigovops-foundation.com/practice/" class="go" onclick="if(window.plausible)plausible('Open source: cafe card')">Sit down →</a></div>
      <div class="tool"><span class="tag">🟢 100 · 45 min · nothing installed</span><h3>Begin</h3><p>Air Canada. A rule in your own words, one decision against it, a real signed receipt made in your browser.</p><a href="https://www.aigovops-foundation.com/practice/levels/100-begin/WORKSHEET.html" class="go">Worksheet →</a></div>
      <div class="tool"><span class="tag">🔧 200 · 60 min · one install</span><h3>Retrofit</h3><p>The $1 Chevy; Knight Capital. Your policy in the catalog and a rule in CI that refuses the merge on weakening.</p><a href="https://www.aigovops-foundation.com/practice/levels/200-retrofit/WORKSHEET.html" class="go">Worksheet →</a></div>
      <div class="tool"><span class="tag">✋ 300 · 60 min today</span><h3>Hold</h3><p>Arup; Cigna PXDX; nH Predict. Holds for a named human, the decay arithmetic, a coverage number you can defend.</p><a href="https://www.aigovops-foundation.com/practice/levels/300-hold/WORKSHEET.html" class="go">Worksheet →</a></div>
      <div class="tool"><span class="tag">🔍 400 · 60 min + a Thursday</span><h3>Prove it</h3><p>Robodebt; Toeslagenaffaire; Horizon. Verify evidence you did not make, offline, with your name on it — then host.</p><a href="https://www.aigovops-foundation.com/practice/levels/400-prove/WORKSHEET.html" class="go">Worksheet →</a></div>
      <div class="tool"><span class="tag">📄 One page</span><h3>The manifesto</h3><p>The rule, the four gates, the ladder, the checklist. Print it, bring it Thursday. <a href="https://www.aigovops-foundation.com/practice/RELEASE.html">The release</a> says what is live today and what lands in Fall.</p><a href="https://www.aigovops-foundation.com/practice/MANIFESTO.html" class="go">Read it →</a></div>
    </div>
  </div>
</section>
"""
o = sub1(o, "<!-- OPEN-SOURCE TOOLKIT -->", PRACTICE + "\n<!-- OPEN-SOURCE TOOLKIT -->", "toolkit marker")
o = sub1(o, "<h2 style=\"margin-bottom:6px\">Three tools. One verifiable evidence chain.</h2>", "<h2 style=\"margin-bottom:6px\">Three engines. One verifiable evidence chain.</h2>", "trio h2")
o = sub1(o, "Beacon signs the evidence. Umbrella compiles it into executable controls. The Vendor RFI turns tool selection into an evidence-first decision. All Apache-2.0. All under the AiGovOps Foundation.",
            "Umbrella declares. Beacon decides and proves. Lantern reads. The Vendor RFI turns tool selection into an evidence-first decision. All Apache-2.0, all under the AiGovOps Foundation; versions in <a href=\"https://www.aigovops-foundation.com/practice/RELEASE.html\">the release</a>.", "trio sub")
LANTERN = """      <div class="tool">
        <span class="tag">🏮 Reader</span>
        <h3>AiGovOps Lantern</h3>
        <p>Beacon signs. Lantern reads: <code>read</code>, <code>diff</code>, <code>explain</code> — four role lenses (engineer, compliance, auditor, regulator) over the same signed receipts. v0.1.1 today; the public verify page in Fall.</p>
        <a href="https://github.com/aigovops-foundation/aigovops-lantern" target="_blank" rel="noopener" class="go" onclick="if(window.plausible)plausible('Open source: Lantern click')">Read a bundle →</a>
      </div>
      <div class="tool">
        <span class="tag">📋 Evidence-first RFI</span>
        <h3>Vendor RFI</h3>"""
o = sub1(o, """      <div class="tool">
        <span class="tag">📋 Evidence-first RFI</span>
        <h3>Vendor RFI</h3>""", LANTERN, "lantern insert")
o = o.replace("<span class=\"tag\">🏮 Compiler</span>", "<span class=\"tag\">☂️ Declares</span>").replace("<span class=\"tag\">🔦 Scanner + Signer</span>", "<span class=\"tag\">🔦 Decides and proves</span>")
o = o.replace("OVERT 1.0 Protocol.", "Conforms to OVERT.")
ARTIFACTS = """
<!-- PUBLISHED ARTIFACTS -->
<section class="section" style="background:var(--garden-cream);padding:40px 24px">
  <div class="container" style="max-width:900px">
    <p style="font-size:.72rem;font-weight:700;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:.14em;color:var(--garden-green-ink);margin-bottom:10px">Also published</p>
    <p style="margin:0;color:var(--garden-ink-soft);line-height:1.7"><b>Data Centers, AI &amp; Social Trade-offs</b> — an interactive, source-verified calculator that puts AI&rsquo;s energy, carbon and water costs beside phones, streaming, cars, heating, beef and steel. <a href="https://datacenter-ai-tradeoffs.pplx.app" target="_blank" rel="noopener noreferrer" onclick="if(window.plausible)plausible('Open source: Tradeoffs calculator')">Try the calculator →</a>
    &nbsp;·&nbsp; <b><code>aigovops</code> v4</b> — the self-hostable stack from a clone; <code>up --tier 1</code> is just the gate. <a href="https://github.com/aigovops-foundation/aigovops" target="_blank" rel="noopener">GitHub →</a>
    &nbsp;·&nbsp; Want to help? <a href="community.html#ways-to-contribute">Give time →</a></p>
  </div>
</section>
"""
o = re.sub(r'(<!-- LIVE — the gates \+ alpha project 1[^\n]*\n)', ARTIFACTS + r"\n\1", o, count=1)
wr("open-source.html", o)
print("open-source.html written")

# ── 5. community.html: the practice lives on one page now ──────────────────────
c = rd("community.html")
m = re.search(r'  <section class="section" id="practice".*?</section>\n', c, re.S)
short = """  <section class="section" id="practice" style="background:var(--light)">
    <div class="container" style="max-width:640px">
      <h2 data-i18n="community.practice_title">The practice — start at the café</h2>
      <p class="section-sub">Wren asks what brought you in and hands you a card. Four levels, one hour each, on real cases; a host marks it on Thursday. <a href="https://www.aigovops-foundation.com/practice/">Sit down →</a> &nbsp;·&nbsp; <a href="open-source.html#practice">The four levels, the manifesto and the engines →</a></p>
    </div>
  </section>
"""
c = c[:m.start()] + short + c[m.end():]
c = c.replace("<li><b style=\"color:var(--garden-charcoal)\">The Library opens.</b> Get to yes, stay at yes, recover to yes — and the community itself.</li>",
              "<li><b style=\"color:var(--garden-charcoal)\">The Library opens.</b> The cases, the test, the gates live — and Thursday at 09:00, where receipts are shown and marks are made.</li>")
wr("community.html", c)
print("community.html trimmed")

# ── 6. redirect stubs ──────────────────────────────────────────────────────────
stub_t = rd("press.html")
def stub(fn, title, target, canonical, desc, h1, p, pill):
    s = stub_t
    s = re.sub(r"<title>.*?</title>", f"<title>{title} | AiGovOps Foundation</title>", s, count=1)
    s = re.sub(r'content="2;url=[^"]+"', f'content="2;url={target}"', s, count=1)
    s = re.sub(r'<link rel="canonical" href="[^"]+" />', f'<link rel="canonical" href="{canonical}" />', s, count=1)
    s = re.sub(r'<meta name="description" content="[^"]*" />', f'<meta name="description" content="{desc}" />', s, count=1)
    s = re.sub(r"<h1>.*?</h1>", f"<h1>{h1}</h1>", s, count=1, flags=re.S)
    s = re.sub(r'<p>Bios, the two founder hooks.*?</p>', f"<p>{p}</p>", s, count=1, flags=re.S)
    s = re.sub(r'<a class="stub-pill" href="[^"]+">.*?</a>', f'<a class="stub-pill" href="{target}">{pill} &rarr;</a>', s, count=1, flags=re.S)
    wr(fn, s)
B = "https://www.aigovops-foundation.com/"
stub("get-to-yes.html", "Get to Yes — page moved", "library.html", B+"library.html", "Get to Yes is the Library now — one door for the cases, the test, the gates live and the frameworks.", "Get to yes lives in the Library now.", "The cases, the test, the gates live and the frameworks are on one page.", "Go to the Library")
stub("stay-at-yes.html", "Stay at Yes — page moved", "open-source.html#toolkit", B+"open-source.html", "Stay at Yes is the open-source page now — the practice and the three engines.", "Stay at yes lives on the open-source page now.", "The practice, Beacon, Umbrella, Lantern and the Vendor RFI are on one page.", "Go to the open source")
stub("recover-to-yes.html", "Recover to Yes — page moved", "library.html#cases", B+"library.html", "Recover to Yes is the Library now — the hundred verified cases and the gate law.", "Recover to yes lives in the Library now.", "The hundred verified cases, the practitioner test and FailFest are on one page.", "Go to the cases")
stub("jeeves-console.html", "Ask — page moved", "index.html", B, "Ask is the widget on every page now.", "Ask lives on every page now.", "One surface: the Ask widget in the corner of every page. Jeeves stays in the runbooks.", "Go home")
print("stubs written")

# ── 7. sitemap ─────────────────────────────────────────────────────────────────
sm = rd("sitemap.xml")
for old in ["get-to-yes.html", "stay-at-yes.html", "recover-to-yes.html", "jeeves-console.html"]:
    sm = re.sub(r"\s*<url>\s*<loc>https://www\.aigovops-foundation\.com/" + re.escape(old) + r"</loc>.*?</url>", "", sm, flags=re.S)
if "library.html" not in sm:
    sm = sm.replace("<url>\n    <loc>https://www.aigovops-foundation.com/blog.html</loc>", "<url>\n    <loc>https://www.aigovops-foundation.com/library.html</loc>\n  </url>\n  <url>\n    <loc>https://www.aigovops-foundation.com/open-source.html</loc>\n  </url>\n  <url>\n    <loc>https://www.aigovops-foundation.com/blog.html</loc>", 1)
    if "library.html" not in sm:
        sm = sm.replace("</urlset>", "  <url><loc>https://www.aigovops-foundation.com/library.html</loc></url>\n  <url><loc>https://www.aigovops-foundation.com/open-source.html</loc></url>\n</urlset>")
wr("sitemap.xml", sm)
print("sitemap updated")

# ── 8. i18n keys ───────────────────────────────────────────────────────────────
for f, lib_, os_, sub_ in [("js/i18n/strings-en.js", "Library", "Open source", "Governance as code that makes AI safe to say yes to — built in the open, proven in ten minutes. Sit down: what brought you in?"),
                          ("js/i18n/strings-es.js", "Biblioteca", "Código abierto", "Gobernanza como código para que decir sí a la IA sea seguro — construida en abierto, probada en diez minutos. Siéntate: ¿qué te trajo aquí?")]:
    s = rd(f)
    if "library:" not in s.split("nav:")[1].split("}")[0]:
        s = re.sub(r"(nav:\s*\{)", r"\1 library: '" + lib_ + "', opensource: '" + os_ + "',", s, count=1)
    s = re.sub(r"(\bsub:\s*)(['\"])(Governance as code|Gobernanza como código)[^'\"]*\2", lambda m: m.group(1) + "'" + sub_.replace("'", "\\'") + "'", s, count=1)
    wr(f, s)
print("i18n keys")

# ── 9. tests: the IA changed, the invariants follow ─────────────────────────────
t = rd("scripts/test-design.sh")
t = t.replace("for hub in get-to-yes.html stay-at-yes.html recover-to-yes.html; do", "for hub in library.html open-source.html community.html; do")
t = t.replace('missing = [w for w in ("Get to Yes", "Stay at Yes", "Recover to Yes", "Join")', 'missing = [w for w in ("Library", "Open source", "Join")')
t = t.replace("[M13 three-doors — movement hubs exist; nav carries the three doors + Join]", "[Home + one level — the hubs exist; nav carries Library, Open source + Join]")
wr("scripts/test-design.sh", t)
u = rd("scripts/test-unit-v3.js")
u = u.replace("'../stay-at-yes.html'", "'../open-source.html'").replace("(stay-at-yes.html)", "(open-source.html)").replace("stay-at-yes.html has the Vendor RFI section", "open-source.html has the Vendor RFI section").replace("stay-at-yes carries the live RFI embed", "open-source carries the live RFI embed")
wr("scripts/test-unit-v3.js", u)
e = rd("scripts/test-e2e-v3.sh")
e = e.replace('$SITE/stay-at-yes.html', '$SITE/open-source.html').replace("(stay-at-yes.html)", "(open-source.html)").replace("stay-at-yes carries the live RFI comparison embed", "open-source carries the live RFI comparison embed")
wr("scripts/test-e2e-v3.sh", e)
a = rd("scripts/test-a11y.sh")
a = a.replace('check_html "$REPO/index.html" "Toolkit band links to the Stay at Yes trio" \'href="stay-at-yes.html#toolkit"\'', 'check_html "$REPO/index.html" "Toolkit band links to the open-source trio" \'href="open-source.html#toolkit"\'')
wr("scripts/test-a11y.sh", a)
print("tests follow the IA")
print("OK")
