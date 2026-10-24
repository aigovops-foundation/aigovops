#!/usr/bin/env bash
# Cloud-Mary DNS tier — resolution, apex→GitHub, www CNAME, stale-record detection.
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$REPO/scripts/lib/health-checks.sh"
PASS=0; FAIL=0
APEX="${APEX_DOMAIN:-aigovops-foundation.com}"
echo ""
echo "🌐  DNS Tests — $APEX"
echo ""
echo "  [Resolution]"
dns_resolves "$APEX"
dns_resolves "www.$APEX"
echo ""
echo "  [Points at the right host]"
dns_apex_points_to_github "$APEX"
dns_cname_target "www.$APEX" "github.io"
echo ""
echo "  [No stale records]"
# After the org migration, nothing should still point at bobrapp.github.io
dns_not_stale "www.$APEX" "bobrapp.github.io"
echo ""
echo "  ${PASS} passed, ${FAIL} failed"
echo ""
[ $FAIL -eq 0 ] && echo "  ✅  All DNS tests passed" || echo "  ❌  ${FAIL} DNS test(s) failed"
echo ""
exit $((FAIL > 0 ? 1 : 0))
