import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = sorted(ROOT.rglob("*.html"))
failures = []

def check(condition, message):
    if not condition:
        failures.append(message)
    print(f"  {'ok' if condition else 'FAIL'} {message}")

feedback_tags = []
for page in HTML:
    text = page.read_text()
    if "feedback.js" in text:
        feedback_tags.extend(re.findall(r"<script\b[^>]*feedback\.js[^>]*>", text))
check(len(feedback_tags) == 44, "all 44 feedback pages remain covered")
check(
    all('data-theme="light"' in tag and "?v=20261011b" in tag for tag in feedback_tags),
    "feedback pages use the light palette and bumped script version",
)
check(
    all('aria-label="AiGovOps Foundation home"' not in page.read_text() for page in HTML),
    "shared logo links do not override their visible/image names",
)
check(
    all(
        label not in page.read_text()
        for page in HTML
        for label in ('aria-label="Switch to English"', 'aria-label="Cambiar a español"', 'aria-label="Cambiar a espanol"')
    ),
    "language buttons do not mask their visible EN/ES labels",
)

buttons = [
    (page, button)
    for page in HTML
    for button in re.findall(r"<button\b[^>]*\blang-btn\b[^>]*>.*?</button>", page.read_text(), re.S)
]
check(
    all('data-lang="en"' not in button or 'EN<span class="sr-only">, switch to English</span>' in button for _, button in buttons),
    "English language controls include visible EN and a hidden instruction",
)
check(
    all('data-lang="es"' not in button or 'ES<span class="sr-only">, cambiar a español</span>' in button for _, button in buttons),
    "Spanish language controls include visible ES and a hidden instruction",
)

main_js = (ROOT / "js/main.js").read_text()
check(
    'class="post-card"' in main_js and re.search(r'class="post-card".*aria-label', main_js, re.S) is None,
    "LinkedIn cards use their visible text as the name",
)
stale_fragments = ("#promise", "#ship", "#running", "#prove")
search_files = HTML + list((ROOT / "js/i18n").glob("strings-*.js"))
check(
    not any(fragment in page.read_text() for page in search_files for fragment in stale_fragments),
    "Practice cards do not link to dead level fragments",
)

if failures:
    print(f"\n{len(failures)} regression check(s) failed")
    raise SystemExit(1)
print("\nAll live-sweep regression checks passed")
