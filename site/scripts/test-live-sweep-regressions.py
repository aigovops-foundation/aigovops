from html.parser import HTMLParser
import re
from pathlib import Path
from subprocess import check_output
from urllib.parse import urlparse
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent
HTML = [
    ROOT / path
    for path in check_output(["git", "ls-files", "--", "*.html"], cwd=ROOT, text=True).splitlines()
]
failures = []

def check(condition, message):
    if not condition:
        failures.append(message)
    print(f"  {'ok' if condition else 'FAIL'} {message}")


class LinkNameParser(HTMLParser):
    VOID = {
        "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
        "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__()
        self.links = []
        self.active_links = []
        self.frames = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        parent = self.frames[-1] if self.frames else {}
        in_svg = parent.get("in_svg", False) or tag == "svg"
        hidden = parent.get("hidden", False) or attrs.get("aria-hidden", "").lower() == "true" or "hidden" in attrs
        if tag == "a" and "href" in attrs:
            link = {
                "href": attrs.get("href", ""),
                "aria_name": bool(attrs.get("aria-label", "").strip() or attrs.get("aria-labelledby", "").strip()),
                "text": [],
                "svg_title": [],
                "image_alt": False,
            }
            self.links.append(link)
            self.active_links.append(link)
        elif not hidden and (attrs.get("aria-label", "").strip() or attrs.get("aria-labelledby", "").strip()):
            for link in self.active_links:
                link["aria_name"] = True
        if tag == "img" and attrs.get("alt", "").strip() and not hidden:
            for link in self.active_links:
                link["image_alt"] = True
        frame = {
            "tag": tag,
            "hidden": hidden,
            "skip_text": parent.get("skip_text", False) or tag in ("script", "style"),
            "in_svg": in_svg,
            "in_svg_title": parent.get("in_svg_title", False) or (tag == "title" and in_svg),
        }
        if tag not in self.VOID:
            self.frames.append(frame)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == "a" and self.active_links:
            self.active_links.pop()
        if tag in self.VOID:
            return
        for index in range(len(self.frames) - 1, -1, -1):
            if self.frames[index]["tag"] == tag:
                del self.frames[index:]
                break

    def handle_data(self, data):
        if not self.active_links or not self.frames:
            return
        frame = self.frames[-1]
        if frame["hidden"] or frame["skip_text"]:
            return
        if frame["tag"] == "title" and not frame["in_svg"]:
            return
        for link in self.active_links:
            if frame["in_svg_title"]:
                link["svg_title"].append(data)
            else:
                link["text"].append(data)

    def unnamed_links(self):
        return [
            link for link in self.links
            if not (
                link["aria_name"]
                or "".join(link["text"]).strip()
                or "".join(link["svg_title"]).strip()
                or link["image_alt"]
            )
        ]


unnamed_links = []
for page in HTML:
    parser = LinkNameParser()
    parser.feed(page.read_text())
    unnamed_links.extend((page.relative_to(ROOT), link["href"]) for link in parser.unnamed_links())
for page, href in unnamed_links:
    print(f"  FAIL {page}: <a href={href!r}> has an empty accessible name")
check(not unnamed_links, f"all tracked HTML links have an accessible name ({len(HTML)} pages audited)")

feedback_tags = []
feedback_pages = set()
for page in HTML:
    text = page.read_text()
    page_tags = re.findall(r"<script\b[^>]*feedback\.js[^>]*>", text)
    if page_tags:
        feedback_pages.add(page)
        feedback_tags.extend(page_tags)

# A floor, not equality: the publish job adds a feedback page with every new story.
check(len(feedback_tags) >= 44, f"feedback pages remain covered ({len(feedback_tags)}, floor 44)")

expected_feedback_pages = {
    ROOT / urlparse(element.text).path.lstrip("/")
    for element in ElementTree.parse(ROOT / "sitemap.xml").iter()
    if element.tag.endswith("loc")
    and element.text
    and urlparse(element.text).path.endswith(".html")
}
expected_feedback_pages.add(ROOT / "index.html")
for page in sorted(expected_feedback_pages - feedback_pages):
    print(f"  FAIL {page.relative_to(ROOT)}: feedback strip missing")
for page in sorted(feedback_pages - expected_feedback_pages):
    print(f"  FAIL {page.relative_to(ROOT)}: unexpected feedback strip")
check(
    feedback_pages == expected_feedback_pages,
    f"all {len(expected_feedback_pages)} feedback pages remain covered",
)
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
