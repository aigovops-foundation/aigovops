#!/usr/bin/env bash
# Cloud-Mary error tier — 5xx detection, redirect loops, real 404 behaviour, soft-404s.
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$REPO/scripts/lib/health-checks.sh"
PASS=0; FAIL=0
SITE="${SITE_URL:-https://www.aigovops-foundation.com}"
echo ""
echo "🚨  HTTP Error Detection Tests"
echo ""
echo "  [No server errors — all 21 top-level pages]"
for p in "/" "/404.html" "/admin.html" "/alpha.html" "/blog.html" "/bob.html" \
         "/community.html" "/demo.html" "/ecosystem.html" "/events.html" \
         "/f-ai-friday.html" "/frameworks.html" "/jeeves-brief.html" \
         "/jeeves-console.html" "/jeeves-demo.html" "/jeeves-estate.html" \
         "/jeeves-front.html" "/ken.html" "/press.html" "/status.html" "/support.html"; do
  error_no_5xx "$SITE$p"
done
echo ""
echo "  [No server errors — all 9 blog posts]"
for p in "/blog/agentic-frontiers-retrospective.html" "/blog/agentic-hell.html" \
         "/blog/eu-ai-act-90-day-roadmap.html" "/blog/flow-to-trust-loop.html" \
         "/blog/healthcare-ai-governance-spring-2026.html" "/blog/nist-ai-rmf-vs-real-world.html" \
         "/blog/no-more-anonymous-ghosts.html" "/blog/stop-writing-for-humans.html" \
         "/blog/what-is-aigovops.html"; do
  error_no_5xx "$SITE$p"
done
echo ""
echo "  [No redirect loops]  (catches Cloudflare-Flexible misconfig)"
error_no_redirect_loop "$SITE/"
echo ""
echo "  [Real 404 for missing pages]"
error_expect_code "$SITE/this-page-does-not-exist-xyz.html" "404"
echo ""
echo "  [No soft-404s on real pages]  (200 status but error content)"
error_soft_404 "$SITE/" "There isn't a GitHub Pages site here"
error_soft_404 "$SITE/frameworks.html" "Page not found"
echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All error-detection tests passed" || echo "  ❌  ${FAIL} error test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
