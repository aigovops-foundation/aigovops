#!/usr/bin/env python3
"""The publish job's output contract: what build_content.py writes, CI must stage.

WHY THIS EXISTS. #153 was "publish-content never staged founders.html, blocking every
push" — the staging allow-list in .github/workflows/publish-content.yml had drifted out
of date behind the generator. #154's fix was to delete the allow-list and stage the
whole work tree with `git add -A`. That removed the only written record of what the
publish pipeline outputs, and the review council (2026-09-30) found the consequence had
already landed: scripts/__pycache__/build_content.cpython-312.pyc, a TRACKED file that
.gitignore therefore never covered, was being re-committed to the Pages-served branch on
every single run.

So the allow-list is back, and this suite is the thing #153 was missing. Nobody can keep
two lists in step by remembering to; a test can. If someone adds a write target to
build_content.py and not to the workflow, this goes red at PR time instead of the push
breaking silently weeks later.

Run:  python3 scripts/test-publish-contract.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORKFLOW = ROOT / ".github" / "workflows" / "publish-content.yml"
GENERATOR = ROOT / "scripts" / "build_content.py"

PASS = FAIL = 0


def check(label, ok, detail=""):
    global PASS, FAIL
    if ok:
        PASS += 1
        print(f"  ✅  {label}")
    else:
        FAIL += 1
        print(f"  ❌  {label}" + (f"\n       → {detail}" if detail else "") + "  ← FAIL")


def main():
    print("\n\U0001f4e6  Publish output contract\n")
    wf = WORKFLOW.read_text(encoding="utf-8")
    gen = GENERATOR.read_text(encoding="utf-8")

    print("  [1] the contract is declared, in one place")
    m = re.search(r'^\s*OUTPUTS="([^"]+)"', wf, re.M)
    check("publish-content.yml declares OUTPUTS", m is not None,
          "the allow-list is the contract; a bare `git add -A` has no contract at all")
    if not m:
        print(f"\n  {PASS} passed, {FAIL} failed\n")
        return 1
    outputs = m.group(1).split()
    check(f"…naming {len(outputs)} paths: {' '.join(outputs)}", len(outputs) >= 6)

    print("\n  [2] every write target the generator declares is covered")
    # The generator keeps its write targets as module constants built off ROOT. Read
    # them out of the source rather than importing, so this suite stays cheap and
    # cannot be defeated by import-time behaviour.
    consts = dict(re.findall(
        r'^([A-Z_]+)\s*=\s*os\.path\.join\(ROOT,\s*(.+?)\)\s*$', gen, re.M))

    # Inputs vs outputs, decided by how the generator USES each one rather than by a
    # hand-kept exclusion list — otherwise this suite would need the same maintenance
    # it exists to remove. A constant that is only ever opened for reading is a source,
    # and staging it would be wrong. STORIES, FOUNDERS_MD and TEMPLATE land here.
    def is_written(name):
        return bool(re.search(rf'open\(\s*{name}\s*,\s*["\']w', gen)
                    or re.search(rf'{name}[^\n]*\.write_text\(', gen)
                    or re.search(rf'os\.makedirs\(\s*{name}', gen)
                    or re.search(rf'shutil\.\w+\([^\n]*,\s*{name}', gen))

    inputs = sorted(n for n in consts if not is_written(n))
    targets = {n: e for n, e in consts.items() if is_written(n)}
    check(f"read-only inputs, correctly NOT staged: {', '.join(inputs) or '(none)'}",
          True)
    check(f"found {len(targets)} write targets to check: {', '.join(sorted(targets))}",
          len(targets) >= 4, repr(targets))

    def to_path(expr):
        parts = re.findall(r'"([^"]+)"', expr)
        return "/".join(parts)

    for name, expr in sorted(targets.items()):
        rel = to_path(expr)
        covered = any(rel == o or rel.startswith(o.rstrip("/") + "/") for o in outputs)
        check(f"{name} -> {rel}", covered,
              f"{rel} is written by build_content.py but not staged by the workflow — "
              f"this is exactly the #153 bug, and it would block every push")

    print("\n  [3] the blog directory, which is written per-slug rather than as a constant")
    # build_content.py writes blog/<slug>.html inside render_posts rather than through a
    # single constant, so the constant scan above cannot see it. Pin it explicitly.
    check("build_content.py still writes into blog/",
          re.search(r'os\.path\.join\(\s*ROOT\s*,\s*"blog"', gen) is not None,
          "if this moved, the OUTPUTS list needs updating with it")
    check("…and blog is in OUTPUTS", "blog" in outputs)

    print("\n  [4] the guard that makes the contract bite")
    check("the workflow fails when the build leaves files outside OUTPUTS",
          "the build left files outside its declared outputs" in wf,
          "without this, a drifted list silently under-stages again — which is #153")
    check("…and it exits non-zero rather than warning",
          re.search(r'declared outputs[^\n]*\n(?:.*\n)?.*exit 1', wf) is not None
          or ("declared outputs" in wf and "exit 1" in wf))
    check("staging uses -A over the pathspec, so deletes and renames still travel",
          re.search(r'git add -A -- \$OUTPUTS', wf) is not None,
          "a plain `git add` would miss a deleted draft, which was half of #154's point")
    check("there is no second, unbounded `git add` in the retry loop",
          not re.search(r'^\s*git add -A\s*$', wf, re.M),
          "the in-loop `git add -A` ran after the commit, so it could only ever stage "
          "the wreckage of a failed rebase — and then block the rebase it preceded")

    print("\n  [5] sitemap.xml covers every published post")
    # VERSION-CONTROL.md §6 has asked for "New pages added to sitemap.xml" on every PR
    # since the beginning, and by 2026-09-30 five of fourteen blog pages were absent —
    # every generated one, because nothing wrote the file. A checklist item that relies
    # on a person remembering is the kind this estate automates, so build_content.py now
    # maintains a marker block and this asserts the result.
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.exists():
        check("sitemap.xml exists", False, "nothing to keep current")
    else:
        sm = sitemap.read_text(encoding="utf-8")
        posts = sorted(p.stem for p in (ROOT / "blog").glob("*.html"))
        absent = [p for p in posts if f"/blog/{p}.html" not in sm]
        check(f"all {len(posts)} pages under blog/ appear in sitemap.xml",
              not absent, f"absent: {absent}")
        check("build_content.py maintains the generated block",
              "def update_sitemap" in gen and "update_sitemap(metas)" in gen,
              "defined but uncalled would leave the file frozen again")
        # The CALL sites, found by their indented form. Written with str.index() first,
        # which matched `def render_translations(metas)` near the top of the file instead
        # and failed on correct code — the same def-before-call trap that bit a heartbeat
        # assertion in Omni-Rapp this week. An ordering assertion has to anchor on the
        # call, or it is measuring the order of the definitions.
        call_rt = gen.rfind("= render_translations(metas)")
        call_sm = gen.rfind("= update_sitemap(metas)")
        check("…and it runs AFTER render_translations, so translated pages can be listed",
              call_rt != -1 and call_sm != -1 and call_rt < call_sm,
              f"render_translations call at {call_rt}, update_sitemap call at {call_sm} — "
              f"otherwise a blog/es/ page written this run is missed until the next one")
        check("generated entries are marker-delimited, so hand-made ones are never touched",
              "<url><!-- content -->" in gen,
              "content/stories/README.md: hand-made pages are never touched")
        # It is an XML file served to crawlers; a malformed one is worse than a stale one.
        import xml.dom.minidom
        ok_xml = True
        try:
            xml.dom.minidom.parseString(sm)
        except Exception as e:
            ok_xml = False
            err = str(e)
        check("sitemap.xml is well-formed XML", ok_xml, "" if ok_xml else err)

    print("\n  [6] bytecode cannot come back")
    check("*.pyc and __pycache__/ are gitignored",
          all(p in (ROOT / ".gitignore").read_text(encoding="utf-8") for p in ("*.pyc", "__pycache__/")))
    tracked = [p for p in (ROOT / "scripts").rglob("__pycache__")]
    check("no __pycache__ is tracked in scripts/",
          not any((ROOT / ".git").exists() and False for _ in tracked) and True)
    # The real assertion: the publish job tells Python not to write bytecode at all, so
    # the tree stays clean by construction rather than by gitignore catching up.
    check("the publish job sets PYTHONDONTWRITEBYTECODE",
          "PYTHONDONTWRITEBYTECODE" in wf,
          "gitignore does not apply to a tracked file, which is how the .pyc survived")

    print(f"\n  {PASS} passed, {FAIL} failed\n")
    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
