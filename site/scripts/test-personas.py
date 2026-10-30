#!/usr/bin/env python3
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
SITE_ORIGIN = "https://www.aigovops-foundation.com"
PAGES = {
    "for-founders.html": "Startup founder",
    "for-enterprise.html": "Enterprise governance lead",
    "for-students.html": "Student",
    "for-researchers.html": "Researcher",
    "for-regulators.html": "Regulator / policy",
    "for-contributors.html": "Open-source contributor",
}
SUCCESS_TARGETS = {
    "for-founders.html": "https://community.aigovops-foundation.com/gate-check.html?src=persona-founder",
    "for-enterprise.html": "https://github.com/aigovops-foundation/aigovops-vendor-rfi",
    "for-students.html": "https://www.aigovops-foundation.com/practice/levels/100-begin/WORKSHEET.html?src=persona-student",
    "for-researchers.html": "https://community.aigovops-foundation.com/library/find.html?src=persona-researcher",
    "for-regulators.html": "https://aigovops-foundation.github.io/aigovops-beacon/#demo",
    "for-contributors.html": "https://github.com/aigovops-foundation/aigovops-beacon/blob/main/CONTRIBUTING.md",
}

passed = 0
failed = 0


def check(condition, label):
    global passed, failed
    if condition:
        passed += 1
    else:
        failed += 1
        print(f"FAIL: {label}")


def clean_text(fragment):
    return html.unescape(re.sub(r"<[^>]+>", " ", fragment)).strip()


def has_class(tag, class_name):
    match = re.search(r'\bclass=["\']([^"\']*)["\']', tag)
    return match is not None and class_name in match.group(1).split()


def parse_faq_schema(page):
    faq_pages = []
    scripts = re.findall(
        r'<script\b(?=[^>]*\btype=["\']application/ld\+json["\'])[^>]*>(.*?)</script>',
        page,
        re.IGNORECASE | re.DOTALL,
    )
    for script in scripts:
        data = json.loads(script)
        nodes = data.get("@graph", [data]) if isinstance(data, dict) else []
        for node in nodes:
            if isinstance(node, dict) and node.get("@type") == "FAQPage":
                faq_pages.append(node)
    return faq_pages


def local_href_resolves(filename, href):
    parsed = urlsplit(html.unescape(href))
    if parsed.scheme or parsed.netloc or not parsed.path:
        return True
    path = unquote(parsed.path)
    target = ROOT / path.lstrip("/") if path.startswith("/") else ROOT / Path(filename).parent / path
    target = target.resolve()
    return target.is_relative_to(ROOT) and target.is_file()


def font_stylesheet(page):
    for tag in re.findall(r"<link\b[^>]*>", page, re.IGNORECASE):
        if "fonts.googleapis.com/css2" in tag or "/fonts/fonts.css" in tag:
            href = re.search(r'\bhref=["\']([^"\']+)["\']', tag, re.IGNORECASE)
            return href.group(1) if href else None
    return None


sitemap = ET.parse(ROOT / "sitemap.xml")
sitemap_urls = {
    element.text
    for element in sitemap.iter()
    if element.tag.endswith("loc") and element.text
}
llms = (ROOT / "llms.txt").read_text(encoding="utf-8")
reference_fonts = font_stylesheet((ROOT / "open-source.html").read_text(encoding="utf-8"))

for filename, label in PAGES.items():
    path = ROOT / filename
    page = path.read_text(encoding="utf-8")
    canonical = f"{SITE_ORIGIN}/{filename}"
    check(page.count("<main ") == 1 and 'id="main-content"' in page, f"{filename}: exactly one main landmark")
    check('<html lang="en">' in page, f"{filename}: English document language")
    check('i18n.js' not in page and 'lang-toggle' not in page,
          f"{filename}: English only — no i18n loader or language toggle")
    local_scripts = [
        href for href in re.findall(r"<script\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>", page, re.IGNORECASE)
        if not urlsplit(href).scheme and not urlsplit(href).netloc
    ]
    check(
        local_scripts == ["js/main.js?v=20261011b"],
        f"{filename}: main.js is the only local script and is versioned",
    )
    feedback_loader = re.search(
        r"""<script\b(?=[^>]*\bsrc=["']feedback\.js\?v=20261011b["'])(?=[^>]*\bclass=["']aig-feedback-loader["'])(?=[^>]*\bdefer(?:\s|>))[^>]*></script>""",
        page,
        re.IGNORECASE,
    )
    check(feedback_loader is None, f"{filename}: no feedback strip (retired 2026-10-19)")
    local_stylesheets = [
        href for href in re.findall(r"<link\b[^>]*\bhref=[\"']([^\"']+)[\"'][^>]*>", page, re.IGNORECASE)
        if href.endswith(".css?v=20261011b")
    ]
    check(len(local_stylesheets) == 4, f"{filename}: all four local stylesheets (tokens, style, page, fonts) are versioned")
    check(font_stylesheet(page) == reference_fonts, f"{filename}: font stylesheet href matches open-source.html")
    check(re.search(r'<meta\b(?=[^>]*\bname=["\']robots["\'])(?=[^>]*\bcontent=["\']index, follow["\'])[^>]*>', page, re.IGNORECASE) is not None, f"{filename}: indexable robots metadata")
    check(re.search(r'<meta\b(?=[^>]*\bproperty=["\']og:title["\'])[^>]*>', page, re.IGNORECASE) is not None, f"{filename}: Open Graph title")

    main = re.search(r"<main\b[^>]*>(.*?)</main>", page, re.IGNORECASE | re.DOTALL)
    answer_matches = list(re.finditer(
        r"<p\b[^>]*class=[\"'][^\"']*\banswer\b[^\"']*[\"'][^>]*>(.*?)</p>",
        page,
        re.IGNORECASE | re.DOTALL,
    ))
    check(
        main is not None and len(answer_matches) == 1
        and main.start(1) <= answer_matches[0].start() < answer_matches[0].end() <= main.end(1),
        f"{filename}: one answer paragraph inside main",
    )
    answer_text = clean_text(answer_matches[0].group(1)) if answer_matches else ""
    answer_words = re.findall(r"\b[\w]+(?:[’'-][\w]+)*\b", answer_text, re.UNICODE)
    check(40 <= len(answer_words) <= 60, f"{filename}: answer has 40–60 words (found {len(answer_words)})")

    steps_match = re.search(
        r"<ol\b[^>]*class=[\"'][^\"']*\bpersona-steps\b[^\"']*[\"'][^>]*>(.*?)</ol>",
        page,
        re.IGNORECASE | re.DOTALL,
    )
    step_items = re.findall(r"<li\b[^>]*class=[\"'][^\"']*\bpersona-step\b[^\"']*[\"'][^>]*>(.*?)</li>", steps_match.group(1), re.IGNORECASE | re.DOTALL) if steps_match else []
    check(2 <= len(step_items) <= 3, f"{filename}: two or three persona steps")
    first_link = re.search(r"<a\b[^>]*\bhref=[\"']([^\"']+)[\"'][^>]*>", step_items[0], re.IGNORECASE) if step_items else None
    check(
        first_link is not None and html.unescape(first_link.group(1)) == SUCCESS_TARGETS[filename],
        f"{filename}: step 1 href matches the success target",
    )
    for index, item in enumerate(step_items, start=1):
        anchors = re.findall(r"<a\b[^>]*>", item, re.IGNORECASE)
        primary_links = [anchor for anchor in anchors if has_class(anchor, "btn-primary")]
        expected_primary_links = 0 if filename == "for-contributors.html" and index == 2 else 1
        check(
            len(primary_links) == expected_primary_links,
            f"{filename}: step {index} has {expected_primary_links} primary link(s)",
        )
        if filename == "for-contributors.html" and index == 2:
            search_link = next(
                (
                    match
                    for match in re.finditer(
                        r"<a\b[^>]*\bhref=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>",
                        item,
                        re.IGNORECASE | re.DOTALL,
                    )
                    if html.unescape(match.group(1))
                    == "https://github.com/search?q=org%3Aaigovops-foundation+label%3A%22good+first+issue%22+state%3Aopen&type=issues"
                ),
                None,
            )
            check(
                search_link is not None
                and clean_text(search_link.group(2)) == "Search open good first issues →"
                and not has_class(search_link.group(0), "btn-primary"),
                "for-contributors.html: step 2 issue search is a plain link",
            )

    details = re.findall(
        r"<details\b[^>]*>\s*<summary\b[^>]*>(.*?)</summary>\s*<p\b[^>]*>(.*?)</p>\s*</details>",
        page,
        re.IGNORECASE | re.DOTALL,
    )
    visible_faqs = [
        (clean_text(question), clean_text(answer))
        for question, answer in details
    ]
    check(len(visible_faqs) == 3, f"{filename}: exactly three visible FAQs")
    faq_schemas = parse_faq_schema(page)
    check(len(faq_schemas) == 1, f"{filename}: exactly one FAQPage JSON-LD node")
    schema_faqs = []
    if len(faq_schemas) == 1:
        schema_faqs = [
            (item.get("name", ""), item.get("acceptedAnswer", {}).get("text", ""))
            for item in faq_schemas[0].get("mainEntity", [])
        ]
    check(visible_faqs == schema_faqs, f"{filename}: visible FAQs match FAQPage JSON-LD")

    check(
        re.search(r'<link\b(?=[^>]*\brel=["\']canonical["\'])(?=[^>]*\bhref=["\']([^"\']+)["\'])[^>]*>', page, re.IGNORECASE) is not None
        and re.search(r'<link\b(?=[^>]*\brel=["\']canonical["\'])(?=[^>]*\bhref=["\']([^"\']+)["\'])[^>]*>', page, re.IGNORECASE).group(1) == canonical,
        f"{filename}: canonical matches page URL",
    )
    check(canonical in sitemap_urls, f"{filename}: listed in sitemap")
    check(f"/{filename}" in llms, f"{filename}: listed in llms.txt")

    web_pages = [
        node
        for script in re.findall(
            r'<script\b(?=[^>]*\btype=["\']application/ld\+json["\'])[^>]*>(.*?)</script>',
            page,
            re.IGNORECASE | re.DOTALL,
        )
        for node in (json.loads(script).get("@graph", []))
        if isinstance(node, dict) and node.get("@type") == "WebPage"
    ]
    check(
        len(web_pages) == 1
        and web_pages[0].get("publisher") == {"@id": f"{SITE_ORIGIN}/#organization"},
        f"{filename}: WebPage publisher is the Foundation",
    )

    anchors = re.findall(r"<a\b[^>]*\bhref=[\"']([^\"']+)[\"'][^>]*>", page, re.IGNORECASE)
    for href in anchors:
        if not local_href_resolves(filename, href):
            check(False, f"{filename}: local href resolves ({href})")
    if filename == "for-regulators.html":
        steps_match = re.search(
            r'<ol\b(?=[^>]*\bclass=["\'][^"\']*\bpersona-steps\b[^"\']*["\'])[^>]*>(.*?)</ol>',
            page,
            re.IGNORECASE | re.DOTALL,
        )
        step_markup = steps_match.group(1) if steps_match else ""
        check(
            not re.search(r'\bhref=["\'][^"\']*(?:signin|sign[-_]?up|register)', step_markup, re.IGNORECASE)
            and not re.search(r"\b(?:sign[- ]?up|register)\b", step_markup, re.IGNORECASE),
            "for-regulators.html: no sign-up step (standard nav Join allowed)",
        )

index = (ROOT / "academy.html").read_text(encoding="utf-8")
chips_match = re.search(
    r"<nav\b(?=[^>]*\bclass=[\"'][^\"']*\bpersona-chips\b[^\"']*[\"'])[^>]*>(.*?)</nav>",
    index,
    re.IGNORECASE | re.DOTALL,
)
chip_hrefs = re.findall(r"<a\b[^>]*\bhref=[\"']([^\"']+)[\"'][^>]*>", chips_match.group(1), re.IGNORECASE) if chips_match else []
check(chips_match is not None, "academy.html: labelled persona chip navigation exists")
check(chip_hrefs == list(PAGES), "academy.html: six chips point to persona pages in required order")
for href in chip_hrefs:
    check((ROOT / href).is_file(), f"academy.html: persona chip target exists ({href})")

print(f"test-personas.py: {passed} passed, {failed} failed")
sys.exit(1 if failed else 0)
