#!/usr/bin/env python3
"""Contract checks for the seven static AEO answer pages."""

import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.aigovops-foundation.com"
PAGES = (
    "ai-governance.html",
    "aigovops.html",
    "nonprofit.html",
    "overt.html",
    "beacon.html",
    "audit.html",
    "starter-kits.html",
)
RELEVANT_LINKS = (
    "library.html",
    "community.aigovops-foundation.com/library/",
    "practice.aigovops-foundation.com",
    "gate-check.html",
    "aigovops-beacon",
    "aigovops-vendor-rfi",
    "aigovops-ncw-ai-camp",
    "overt.is",
    "umbrella-govops",
    "aigovops-lantern",
    "f-ai-friday.html",
)

passed = 0
failed = 0


def check(label, condition, detail=""):
    global passed, failed
    if condition:
        print(f"  ✅  {label}")
        passed += 1
    else:
        print(f"  ❌  {label}" + (f" — {detail}" if detail else ""))
        failed += 1


def attr(tag, name):
    match = re.search(
        rf'(?:^|\s){re.escape(name)}\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+))',
        tag,
        re.I,
    )
    return next((value for value in match.groups() if value is not None), None) if match else None


def plain_text(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]*>", " ", fragment))).strip()


def meta_content(document, name):
    for tag in re.findall(r"<meta\b[^>]*>", document, re.I):
        if (attr(tag, "name") or "").lower() == name.lower():
            return html.unescape(attr(tag, "content") or "")
    return None


def google_fonts_href(document):
    for tag in re.findall(r"<link\b[^>]*>", document, re.I):
        href = html.unescape(attr(tag, "href") or "")
        if "fonts.googleapis.com/css2" in href or "/fonts/fonts.css" in href:
            return href
    return None


try:
    sitemap_root = ET.parse(ROOT / "sitemap.xml").getroot()
    sitemap_urls = {
        (loc.text or "").strip()
        for loc in sitemap_root.findall(".//{*}loc")
    }
except Exception as error:
    sitemap_urls = set()
    check("sitemap.xml parses", False, str(error))

llms_path = ROOT / "llms.txt"
llms = llms_path.read_text(encoding="utf-8") if llms_path.exists() else ""
topics_section = ""
if "## Topics" in llms:
    topics_section = llms.split("## Topics", 1)[1].split("\n## ", 1)[0]
check("llms.txt contains a Topics section", bool(topics_section))
reference_document = (ROOT / "open-source.html").read_text(encoding="utf-8")
reference_fonts_href = google_fonts_href(reference_document)
check("open-source.html has a Google Fonts CSS2 href", reference_fonts_href is not None)

titles = []
for filename in PAGES:
    path = ROOT / filename
    if not path.exists():
        check(f"{filename} exists", False, "answer page is missing")
        continue

    document = path.read_text(encoding="utf-8")
    expected_url = f"{SITE}/{filename}"
    main_matches = list(re.finditer(r"<main\b([^>]*)>([\s\S]*?)</main\s*>", document, re.I))
    check(f"{filename}: exactly one main landmark", len(main_matches) == 1, str(len(main_matches)))
    skip_link = re.search(
        r'<a\b[^>]*class=["\'][^"\']*\bskip-link\b[^"\']*["\'][^>]*>',
        document,
        re.I,
    )
    main_id = attr(f"<main {main_matches[0].group(1)}>", "id") if main_matches else None
    skip_target = attr(skip_link.group(0), "href") if skip_link else None
    check(
        f"{filename}: skip link targets the main landmark",
        main_id is not None and skip_target == f"#{main_id}",
        str(skip_target),
    )
    inline_scripts = re.findall(
        r"<script\b([^>]*)>([\s\S]*?)</script\s*>",
        document,
        re.I,
    )
    has_inline_nav_handler = any(
        not re.search(r"\bsrc\s*=", attributes, re.I)
        and re.search(r"\.nav-toggle[\s\S]*?addEventListener\s*\(", script, re.I)
        for attributes, script in inline_scripts
    )
    check(f"{filename}: no inline .nav-toggle addEventListener", not has_inline_nav_handler)
    check(
        f"{filename}: no I18N_SET or i18n.js reference",
        re.search(r"\bI18N_SET\b|i18n\.js", document, re.I) is None,
    )
    check(
        f"{filename}: Google Fonts href matches open-source.html",
        google_fonts_href(document) == reference_fonts_href,
    )
    title_match = re.search(r"<title\b[^>]*>([\s\S]*?)</title\s*>", document, re.I)
    title = plain_text(title_match.group(1)) if title_match else ""
    titles.append(title)
    check(f"{filename}: unique title", bool(title))

    description = meta_content(document, "description") or ""
    check(f"{filename}: description is 150 characters or fewer", 0 < len(description) <= 150, str(len(description)))
    check(f"{filename}: robots allows indexing", meta_content(document, "robots") == "index, follow")

    canonical = re.search(r'<link\b[^>]*rel=["\']canonical["\'][^>]*>', document, re.I)
    canonical_url = attr(canonical.group(0), "href") if canonical else None
    check(f"{filename}: canonical equals page URL", canonical_url == expected_url, str(canonical_url))
    check(f"{filename}: canonical appears in sitemap.xml", expected_url in sitemap_urls)
    check(f"{filename}: page appears in llms.txt Topics", expected_url in topics_section)

    answer_match = re.search(
        r"<h1\b[^>]*>([\s\S]*?)</h1>\s*<p\b[^>]*class=[\"']answer[\"'][^>]*>([\s\S]*?)</p>",
        document,
        re.I,
    )
    if answer_match:
        question = plain_text(answer_match.group(1))
        answer_text = plain_text(answer_match.group(2))
        words = re.findall(r"\b[\w]+(?:[’'-][\w]+)*\b", answer_text, re.UNICODE)
        check(f"{filename}: question H1 directly precedes answer", question.endswith("?"))
        check(f"{filename}: answer has 40–60 words", 40 <= len(words) <= 60, f"{len(words)} words")
    else:
        question = ""
        answer_text = ""
        check(f"{filename}: question H1 directly precedes answer", False, "missing H1 followed by .answer")
        check(f"{filename}: answer has 40–60 words", False, "missing answer paragraph")
    answer_inside_main = (
        len(main_matches) == 1
        and answer_match is not None
        and answer_match.group(0) in main_matches[0].group(2)
    )
    check(f"{filename}: .answer is inside main", answer_inside_main)

    key_facts = re.findall(
        r"<ul\b[^>]*class=[\"']answer-facts[\"'][^>]*>([\s\S]*?)</ul>",
        document,
        re.I,
    )
    fact_count = len(re.findall(r"<li\b", key_facts[0], re.I)) if key_facts else 0
    check(f"{filename}: has 4–6 key facts", 4 <= fact_count <= 6, str(fact_count))

    detail_blocks = re.findall(r"<details\b[^>]*>([\s\S]*?)</details\s*>", document, re.I)
    visible_faqs = []
    for block in detail_blocks:
        summary = re.search(r"<summary\b[^>]*>([\s\S]*?)</summary\s*>", block, re.I)
        paragraphs = re.findall(r"<p\b[^>]*>([\s\S]*?)</p\s*>", block, re.I)
        if summary and paragraphs:
            visible_faqs.append((plain_text(summary.group(1)), plain_text(paragraphs[0])))
    check(f"{filename}: has 5–8 FAQs", 5 <= len(visible_faqs) <= 8, str(len(visible_faqs)))

    schema_blocks = []
    schema_error = None
    for raw in re.findall(
        r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script\s*>',
        document,
        re.I,
    ):
        try:
            schema_blocks.append(json.loads(raw))
        except Exception as error:
            schema_error = str(error)
    check(f"{filename}: JSON-LD blocks parse", schema_error is None and bool(schema_blocks), schema_error or "")

    faq_schema = next(
        (block for block in schema_blocks if block.get("@type") == "FAQPage"),
        None,
    )
    schema_faqs = []
    if faq_schema:
        for entity in faq_schema.get("mainEntity", []):
            accepted = entity.get("acceptedAnswer", {})
            schema_faqs.append((entity.get("name", ""), accepted.get("text", "")))
    check(f"{filename}: FAQ JSON-LD matches visible questions and answers", schema_faqs == visible_faqs)

    article_schema = next(
        (block for block in schema_blocks if isinstance(block.get("@graph"), list)),
        None,
    )
    graph = article_schema.get("@graph", []) if article_schema else []
    article = next((node for node in graph if node.get("@type") == "Article"), None)
    webpage = next((node for node in graph if node.get("@type") == "WebPage"), None)
    author_nodes = article.get("author", []) if article else []
    publisher = article.get("publisher", {}) if article else {}
    check(f"{filename}: Article and WebPage JSON-LD present", article is not None and webpage is not None)
    check(
        f"{filename}: Person authors and Foundation publisher present",
        len(author_nodes) == 2
        and all(node.get("@type") == "Person" for node in author_nodes)
        and publisher == {"@id": f"{SITE}/#organization"},
    )

    updated = "Updated 2026-10-09 · Ken Johnston & Bob Rapp"
    check(f"{filename}: update line present", updated in plain_text(document))

    hrefs = [
        html.unescape(value)
        for value in re.findall(r"<a\b[^>]*\bhref=[\"']([^\"']+)[\"']", document, re.I)
    ]
    other_pages = [page for page in PAGES if page != filename]
    crosslinks = {
        target for target in other_pages
        if any(href.split("#", 1)[0].split("?", 1)[0].endswith(target) for href in hrefs)
    }
    check(f"{filename}: links to at least two other answer pages", len(crosslinks) >= 2, str(len(crosslinks)))
    relevant_links = {
        href for href in hrefs
        if any(marker in href.lower() for marker in RELEVANT_LINKS)
    }
    check(f"{filename}: has at least four relevant destination links", len(relevant_links) >= 4, str(len(relevant_links)))

    next_step = re.search(
        r'<section\b[^>]*class=["\'][^"\']*\banswer-next\b[^"\']*["\'][^>]*>([\s\S]*?)</section>',
        document,
        re.I,
    )
    next_buttons = re.findall(r'<a\b[^>]*class=["\'][^"\']*\bbtn\b[^"\']*\bbtn-primary\b[^"\']*["\']', next_step.group(1), re.I) if next_step else []
    check(f"{filename}: one final next-step button", len(next_buttons) == 1)

    pending_near_overt = re.search(r"(?:OVERT.{0,120}pending|pending.{0,120}OVERT)", document, re.I | re.S)
    check(f"{filename}: no pending wording near OVERT", pending_near_overt is None)

check("all seven titles are unique", len(titles) == len(PAGES) and len(set(titles)) == len(PAGES))
print(f"\nAnswer page contract: {passed} passed, {failed} failed")
sys.exit(1 if failed else 0)
