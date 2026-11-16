#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║  Cloud-Mary v3 — AiGovOps Foundation Test Orchestrator          ║
# ║  Runs all test tiers and produces a unified pass/fail report     ║
# ║  Run: bash scripts/cloud-mary.sh                                 ║
# ║  Flags: --unit  --design  --security  --privacy  --arch  --e2e   ║
# ║         --happy  --ux  --a11y  --i18n  --scale  --chaos  --docs  ║
# ║         --dns  --uptime  --errors                                ║
# ║         --skip-network  (skip tests requiring live site)         ║
# ╚══════════════════════════════════════════════════════════════════╝

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKIP_NETWORK=false
RUN_ALL=true
TIERS=()

# Parse flags
for arg in "$@"; do
  case $arg in
    --unit)         TIERS+=("unit");  RUN_ALL=false ;;
    --design)       TIERS+=("design"); RUN_ALL=false ;;
    --security)     TIERS+=("security"); RUN_ALL=false ;;
    --privacy)      TIERS+=("privacy");  RUN_ALL=false ;;
    --arch)         TIERS+=("arch");     RUN_ALL=false ;;
    --ux)           TIERS+=("ux");       RUN_ALL=false ;;
    --e2e)          TIERS+=("e2e");   RUN_ALL=false ;;
    --happy)        TIERS+=("happy"); RUN_ALL=false ;;
    --dns)          TIERS+=("dns");    RUN_ALL=false ;;
    --uptime)       TIERS+=("uptime"); RUN_ALL=false ;;
    --errors)       TIERS+=("errors"); RUN_ALL=false ;;
    --a11y)         TIERS+=("a11y");  RUN_ALL=false ;;
    --i18n)         TIERS+=("i18n");  RUN_ALL=false ;;
    --scale)        TIERS+=("scale"); RUN_ALL=false ;;
    --chaos)        TIERS+=("chaos"); RUN_ALL=false ;;
    --docs)         TIERS+=("docs");  RUN_ALL=false ;;
    --message)      TIERS+=("message"); RUN_ALL=false ;;
    --skip-network) SKIP_NETWORK=true ;;
  esac
done
[ "$RUN_ALL" = "true" ] && TIERS=("unit" "design" "security" "privacy" "arch" "e2e" "dns" "uptime" "errors" "happy" "ux" "a11y" "i18n" "scale" "chaos" "docs" "message")

cd "$REPO" || { echo "❌ Cannot cd to $REPO"; exit 1; }

# ── Utilities ──────────────────────────────────────────────────────────────
BOLD='\033[1m'; RESET='\033[0m'; GREEN='\033[0;32m'; RED='\033[0;31m'
YELLOW='\033[0;33m'; CYAN='\033[0;36m'

TOTAL_PASS=0; TOTAL_FAIL=0; TOTAL_SKIP=0
# Per-tier results as name-mangled scalars (TIER_RESULT_<name>) — macOS ships
# bash 3.2, where `declare -A` fails and associative subscripts silently
# collapse to index 0, rendering every tier with the LAST tier's result.
tier_set_result() { eval "TIER_RESULT_$1=\"\$2\""; }
tier_get_result() { eval "printf '%s' \"\${TIER_RESULT_$1:-NOT RUN}\""; }
tier_set_note()   { eval "TIER_NOTE_$1=\"\$2\""; }
tier_get_note()   { eval "printf '%s' \"\${TIER_NOTE_$1}\""; }

run_tier() {
  local name="$1" cmd="$2" label="$3"
  echo ""
  echo -e "${CYAN}${BOLD}── $label ──────────────────────────────────────────────${RESET}"
  local status=0
  eval "$cmd" || status=$?
  if [ "$status" -eq 0 ]; then
    tier_set_result "$name" "PASS"
    TOTAL_PASS=$((TOTAL_PASS+1))
  elif [ "$status" -eq 3 ]; then
    # exit 3 = the tier's tests could not run (network unreachable) —
    # honest SKIP, counted in the Skipped column, never in Passed.
    tier_set_result "$name" "SKIP"
    tier_set_note "$name" "network unreachable (exit 3)"
    TOTAL_SKIP=$((TOTAL_SKIP+1))
  else
    tier_set_result "$name" "FAIL"
    TOTAL_FAIL=$((TOTAL_FAIL+1))
  fi
}

skip_tier() {
  local name="$1" label="$2" reason="$3"
  echo ""
  echo -e "${YELLOW}${BOLD}── $label (SKIPPED) ──────────────────────────────────────${RESET}"
  echo "  ⏭️   Skipped: $reason"
  tier_set_result "$name" "SKIP"
  tier_set_note "$name" "$reason"
  TOTAL_SKIP=$((TOTAL_SKIP+1))
}

# ── Header ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║  ☁️   Cloud-Mary v3 — AiGovOps Test Suite    ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════╝${RESET}"
echo "  Site:   https://www.aigovops-foundation.com"
echo "  Repo:   $REPO"
echo "  Tiers:  ${TIERS[*]}"
echo "  Time:   $(date -u '+%Y-%m-%d %H:%M UTC')"

# ── Git Status ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}── Git Status ──────────────────────────────────────────────${RESET}"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
COMMIT=$(git log --oneline -1 2>/dev/null || echo "unknown")
DIRTY=""
git diff --quiet && git diff --cached --quiet || DIRTY=" ⚠️  (uncommitted changes)"
echo "  Branch: $BRANCH$DIRTY"
echo "  Latest: $COMMIT"

# ── Tier 1: Unit Tests ─────────────────────────────────────────────────────
if [[ " ${TIERS[*]} " =~ " unit " ]]; then
  run_tier "unit" \
    "node scripts/test-unit.js && node scripts/test-unit-v3.js" \
    "🧪  Unit Tests (v1 + v3)"
fi

# ── Tier 1b: Design-System Tests (local, no network) ───────────────────────
if [[ " ${TIERS[*]} " =~ " design " ]]; then
  run_tier "design" \
    "bash scripts/test-design.sh" \
    "🎨  Design-System Tests (garden-warm)"
fi

# ── Tier 1c: Security Tests (M12a — local + live headers) ──────────────────
if [[ " ${TIERS[*]} " =~ " security " ]]; then
  run_tier "security" \
    "SKIP_NETWORK=$SKIP_NETWORK bash scripts/test-security.sh" \
    "🔒  Security Tests (M12a)"
fi

# ── Tier 1d: Privacy Tests (M12a — local, no network) ──────────────────────
if [[ " ${TIERS[*]} " =~ " privacy " ]]; then
  run_tier "privacy" \
    "bash scripts/test-privacy.sh" \
    "🛡️   Privacy Tests (M12a)"
fi

# ── Tier 1e: Architecture Tests (M12a — local, no network) ─────────────────
if [[ " ${TIERS[*]} " =~ " arch " ]]; then
  run_tier "arch" \
    "bash scripts/test-arch.sh" \
    "🏛️   Architecture Tests (M12a)"
fi

# ── Tier 2: E2E Tests ──────────────────────────────────────────────────────
if [[ " ${TIERS[*]} " =~ " e2e " ]]; then
  if [ "$SKIP_NETWORK" = "true" ]; then
    skip_tier "e2e" "🌐  E2E Tests" "--skip-network flag set"
  else
    run_tier "e2e" \
      "bash scripts/test-e2e-v3.sh" \
      "🌐  E2E Tests v3"
  fi
fi

# ── Tier 2b: DNS Tests (network) ───────────────────────────────────────────
if [[ " ${TIERS[*]} " =~ " dns " ]]; then
  if [ "$SKIP_NETWORK" = "true" ]; then
    skip_tier "dns" "🌐  DNS Tests" "--skip-network flag set"
  else
    run_tier "dns" "bash scripts/test-dns.sh" "🌐  DNS Tests"
  fi
fi

# ── Tier 2c: Uptime / Reachability Tests (network) ─────────────────────────
if [[ " ${TIERS[*]} " =~ " uptime " ]]; then
  if [ "$SKIP_NETWORK" = "true" ]; then
    skip_tier "uptime" "⏱️   Uptime Tests" "--skip-network flag set"
  else
    run_tier "uptime" "bash scripts/test-uptime.sh" "⏱️   Uptime / Reachability Tests"
  fi
fi

# ── Tier 2d: HTTP Error Detection Tests (network) ──────────────────────────
if [[ " ${TIERS[*]} " =~ " errors " ]]; then
  if [ "$SKIP_NETWORK" = "true" ]; then
    skip_tier "errors" "🚨  Error Tests" "--skip-network flag set"
  else
    run_tier "errors" "bash scripts/test-errors.sh" "🚨  HTTP Error Detection Tests"
  fi
fi

# ── Tier 2e: Happy-Path Journey Tests (network) ────────────────────────────
if [[ " ${TIERS[*]} " =~ " happy " ]]; then
  if [ "$SKIP_NETWORK" = "true" ]; then
    skip_tier "happy" "😊  Happy-Path Tests" "--skip-network flag set"
  else
    run_tier "happy" "bash scripts/test-happy.sh" "😊  Happy-Path Journey Tests"
  fi
fi

# ── Tier 2f: UX Heuristic Tests (M12a — local, no network) ─────────────────
if [[ " ${TIERS[*]} " =~ " ux " ]]; then
  run_tier "ux" \
    "bash scripts/test-ux.sh" \
    "🧭  UX Heuristic Tests (M12a)"
fi

# ── Tier 3: Accessibility Tests ────────────────────────────────────────────
if [[ " ${TIERS[*]} " =~ " a11y " ]]; then
  run_tier "a11y" \
    "bash scripts/test-a11y.sh" \
    "♿  Accessibility Tests v3"
fi

# ── Tier 4: Multilingual / i18n Tests ─────────────────────────────────────
if [[ " ${TIERS[*]} " =~ " i18n " ]]; then
  run_tier "i18n" \
    "bash scripts/test-i18n.sh" \
    "🌍  Multilingual / i18n Tests v3"
fi

# ── Tier 5: Scale Tests ────────────────────────────────────────────────────
if [[ " ${TIERS[*]} " =~ " scale " ]]; then
  if [ "$SKIP_NETWORK" = "true" ]; then
    skip_tier "scale" "⚡  Scale Tests" "--skip-network flag set"
  else
    run_tier "scale" \
      "bash scripts/test-scale-v3.sh 50" \
      "⚡  Scale Tests v3 (50 concurrent)"
  fi
fi

# ── Tier 6: Chaos Monkey ──────────────────────────────────────────────────
if [[ " ${TIERS[*]} " =~ " chaos " ]]; then
  if git diff --quiet && git diff --cached --quiet; then
    run_tier "chaos" \
      "bash scripts/test-chaos.sh" \
      "🐒  Chaos Monkey"
  else
    skip_tier "chaos" "🐒  Chaos Monkey" "working tree has changes — run git stash first"
  fi
fi


if [[ " ${TIERS[*]} " =~ " docs " ]]; then
  run_tier "docs" \
    "bash scripts/test-docs.sh" \
    "📄  Documentation"
fi

if [[ " ${TIERS[*]} " =~ " message " ]]; then
  run_tier "message" \
    "bash scripts/test-message.sh" \
    "🗣️  Message lint"
fi

# ── Summary Report ─────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║  ☁️   Cloud-Mary v3 — Results Summary         ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════╝${RESET}"
echo ""

TIER_LABELS=(
  "unit:🧪  Unit Tests"
  "design:🎨  Design System"
  "security:🔒  Security"
  "privacy:🛡️   Privacy"
  "arch:🏛️   Architecture"
  "e2e:🌐  E2E Tests"
  "dns:🌐  DNS Tests"
  "uptime:⏱️   Uptime Tests"
  "errors:🚨  Error Tests"
  "happy:😊  Happy Paths"
  "ux:🧭  UX Heuristics"
  "a11y:♿  Accessibility"
  "i18n:🌍  Multilingual"
  "scale:⚡  Scale Tests"
  "chaos:🐒  Chaos Monkey"
  "docs:📄  Documentation"
)

for entry in "${TIER_LABELS[@]}"; do
  key="${entry%%:*}"
  label="${entry#*:}"
  if [[ " ${TIERS[*]} " =~ " $key " ]]; then
    result="$(tier_get_result "$key")"
    note="$(tier_get_note "$key")"
    case $result in
      PASS) echo -e "  ${GREEN}✅  $label${RESET}" ;;
      FAIL) echo -e "  ${RED}❌  $label${RESET}" ;;
      SKIP) echo -e "  ${YELLOW}⏭️   $label — $note${RESET}" ;;
      *)    echo "  ⬜  $label — not run" ;;
    esac
  fi
done

echo ""
echo "  Passed: $TOTAL_PASS  |  Failed: $TOTAL_FAIL  |  Skipped: $TOTAL_SKIP"
echo "  Total tiers: ${#TIERS[@]}"
echo ""

if [ $TOTAL_FAIL -gt 0 ]; then
  echo -e "  ${RED}${BOLD}❌  Cloud-Mary: $TOTAL_FAIL tier(s) FAILED — review output above${RESET}"
  echo ""
  exit 1
else
  echo -e "  ${GREEN}${BOLD}✅  Cloud-Mary: All tiers passed${RESET}"
  echo ""
  exit 0
fi
