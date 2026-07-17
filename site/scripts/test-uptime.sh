#!/usr/bin/env bash
# Cloud-Mary uptime tier — reachability, TLS validity, latency on key URLs.
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$REPO/scripts/lib/health-checks.sh"
PASS=0; FAIL=0
SITE="${SITE_URL:-https://www.aigovops-foundation.com}"
APEX="${APEX_URL:-https://aigovops-foundation.com}"
MAXMS="${MAX_LATENCY_MS:-3000}"
# All 24 top-level pages + the 9 blog posts (mirrors the repo's page inventory).
PAGES=("/" "/404.html" "/admin.html" "/alpha.html" "/blog.html" "/bob.html"
       "/community.html" "/demo.html" "/ecosystem.html" "/events.html"
       "/f-ai-friday.html" "/frameworks.html" "/get-to-yes.html"
       "/stay-at-yes.html" "/recover-to-yes.html" "/jeeves-brief.html"
       "/jeeves-console.html" "/jeeves-demo.html" "/jeeves-estate.html"
       "/jeeves-front.html" "/ken.html" "/press.html" "/status.html" "/support.html")
BLOG_PAGES=("/blog/agentic-frontiers-retrospective.html" "/blog/agentic-hell.html"
       "/blog/eu-ai-act-90-day-roadmap.html" "/blog/flow-to-trust-loop.html"
       "/blog/healthcare-ai-governance-spring-2026.html" "/blog/nist-ai-rmf-vs-real-world.html"
       "/blog/no-more-anonymous-ghosts.html" "/blog/stop-writing-for-humans.html"
       "/blog/what-is-aigovops.html")
# Design-system assets (garden-warm / aigovops-july-2026)
ASSETS=("/css/garden.css" "/css/porch.css" "/design/aigovops-july-2026/tokens.css")

echo ""
echo "⏱️   Uptime / Reachability Tests"
echo ""
echo "  [Reachability — top-level pages]"
for p in "${PAGES[@]}"; do uptime_reachable "$SITE$p"; done
echo ""
echo "  [Reachability — blog posts]"
for p in "${BLOG_PAGES[@]}"; do uptime_reachable "$SITE$p"; done
echo ""
echo "  [Reachability — design-system assets]"
for p in "${ASSETS[@]}"; do uptime_reachable "$SITE$p"; done
echo ""
echo "  [TLS certificate validity]"
uptime_tls_valid "$SITE/"
uptime_tls_valid "$APEX/"
echo ""
echo "  [Latency]"
uptime_latency "$SITE/" "$MAXMS"
echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All uptime tests passed" || echo "  ❌  ${FAIL} uptime test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
