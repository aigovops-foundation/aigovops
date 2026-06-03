#!/usr/bin/env bash
# Cloud-Mary — 📄 Documentation Validation
# Checks all required docs exist, have meaningful content, and key sections are present

REPO="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0; FAIL=0

check() {
  local desc="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $desc"; ((PASS++))
  else
    echo "  ❌  $desc — $result"; ((FAIL++))
  fi
}

check_file() {
  local path="$REPO/$1" desc="$2"
  if [ -f "$path" ] && [ -s "$path" ]; then
    check "$desc exists and non-empty" "ok"
  else
    check "$desc exists and non-empty" "missing or empty: $1"
  fi
}

check_contains() {
  local path="$REPO/$1" desc="$2" needle="$3"
  if [ -f "$path" ] && grep -q "$needle" "$path"; then
    check "$desc" "ok"
  else
    check "$desc" "pattern '$needle' not found in $1"
  fi
}

echo ""
echo "📄  Documentation Validation"
echo ""

echo "  [Required doc files]"
check_file "docs/prd/PRD.md"                              "PRD exists"
check_file "docs/mrd/MRD.md"                              "MRD exists"
check_file "docs/tech-spec/TECH-SPEC.md"                  "Tech Spec exists"
check_file "docs/design/DESIGN-SYSTEM.md"                 "Design System exists"
check_file "docs/ux/UX-SPEC.md"                           "UX Spec exists"
check_file "docs/security/SECURITY.md"                    "Security Plan exists"
check_file "docs/version-control/VERSION-CONTROL.md"      "Version Control doc exists"
check_file "docs/version-control/CLOUD-MARY.md"           "Cloud-Mary spec exists"
check_file "docs/data-flow/DATA-FLOW.md"                  "Data Flow doc exists"
check_file "docs/architecture/ARCHITECTURE.md"            "Architecture doc exists"
check_file "docs/version-control/PR-TEMPLATE.md"          "PR Template exists"
check_file "docs/README.md"                               "Docs README exists"

echo ""
echo "  [PRD content checks]"
check_contains "docs/prd/PRD.md"               "PRD has personas section"        "Personas"
check_contains "docs/prd/PRD.md"               "PRD has success metrics"         "Success metrics"
check_contains "docs/prd/PRD.md"               "PRD has feature inventory"       "Feature inventory"

echo ""
echo "  [Tech Spec content checks]"
check_contains "docs/tech-spec/TECH-SPEC.md"   "Tech Spec has repo structure"    "Repository structure"
check_contains "docs/tech-spec/TECH-SPEC.md"   "Tech Spec has secrets list"      "Secrets inventory"
check_contains "docs/tech-spec/TECH-SPEC.md"   "Tech Spec has workflows"         "GitHub Actions workflows"

echo ""
echo "  [Security content checks]"
check_contains "docs/security/SECURITY.md"     "Security has threat model"       "Threat model"
check_contains "docs/security/SECURITY.md"     "Security has secrets rotation"   "Rotation cadence"
check_contains "docs/security/SECURITY.md"     "Security has HTTPS"              "HTTPS"

echo ""
echo "  [Version Control content checks]"
check_contains "docs/version-control/VERSION-CONTROL.md" "VC has branching strategy" "Branching strategy"
check_contains "docs/version-control/VERSION-CONTROL.md" "VC has PR process"         "PR process"
check_contains "docs/version-control/VERSION-CONTROL.md" "VC has commit standard"    "Commit message"

echo ""
echo "  [Data Flow content checks]"
check_contains "docs/data-flow/DATA-FLOW.md"   "Data flow has LinkedIn pipeline"  "LinkedIn"
check_contains "docs/data-flow/DATA-FLOW.md"   "Data flow has chatbot flow"       "chatbot"
check_contains "docs/data-flow/DATA-FLOW.md"   "Data flow has analytics flow"     "Plausible"

echo ""
echo "  [Repo hygiene]"
check_file "README.md"            "README.md exists"
check_file "CNAME"                "CNAME exists"
check_file "sitemap.xml"          "sitemap.xml exists"
check_file "robots.txt"           "robots.txt exists"
check_file "feed.xml"             "feed.xml exists"

echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All documentation tests passed" || echo "  ❌  ${FAIL} doc test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
