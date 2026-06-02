#!/usr/bin/env bash
# DEPRECATED — superseded by test-e2e-v3.sh / test-scale-v3.sh
# Kept for reference only. Not called by cloud-mary.sh or automation-v3.yml.

# AiGovOps — Scale Tests: concurrent load
# Run: bash scripts/test-scale.sh [concurrency=50]
# Example: bash scripts/test-scale.sh 100

SITE="https://www.aigovops-foundation.com"
CONCURRENCY=${1:-50}
URLS=("/" "/blog.html" "/events.html" "/css/style.css" "/js/chat.js" "/images/logo.png")
PASS=0; FAIL=0; TOTAL_MS=0

echo ""
echo "⚡  Scale Test — $CONCURRENCY concurrent requests to $SITE"
echo ""

ms_now() { python3 -c "import time; print(int(time.time()*1000))"; }

run_one() {
  local url="$SITE$1"
  local t0; t0=$(ms_now)
  local code; code=$(curl -sL -o /dev/null -w "%{http_code}" --max-time 10 "$url")
  local t1; t1=$(ms_now)
  echo "$code $((t1 - t0)) $url"
}

TMPFILE=$(mktemp)
for i in $(seq 1 "$CONCURRENCY"); do
  url="${URLS[$((( i - 1 ) % ${#URLS[@]}))]}"
  run_one "$url" >> "$TMPFILE" &
done
wait

SLOWEST=0
while IFS=' ' read -r code ms url; do
  if [ "$code" = "200" ]; then
    ((PASS++))
    TOTAL_MS=$((TOTAL_MS + ms))
    [ "$ms" -gt "$SLOWEST" ] && SLOWEST=$ms
  else
    ((FAIL++))
    echo "  ❌  HTTP $code in ${ms}ms → $url"
  fi
done < "$TMPFILE"
rm "$TMPFILE"

TOTAL=$((PASS + FAIL))
AVG_MS=$(( PASS > 0 ? TOTAL_MS / PASS : 0 ))
ERROR_PCT=$(( (FAIL * 100) / TOTAL ))

echo "  📊  Requests:    $TOTAL"
echo "  📊  Successful:  $PASS"
echo "  📊  Failed:      $FAIL"
echo "  📊  Error rate:  ${ERROR_PCT}%"
echo "  📊  Avg latency: ${AVG_MS}ms"
echo "  📊  Slowest:     ${SLOWEST}ms"
echo ""

if [ $ERROR_PCT -le 5 ] && [ $AVG_MS -lt 3000 ]; then
  echo "  ✅  Scale test passed (≤5% errors, <3s avg)"
  exit 0
else
  [ $ERROR_PCT -gt 5 ] && echo "  ❌  Error rate too high: ${ERROR_PCT}% (threshold: 5%)"
  [ $AVG_MS -ge 3000 ] && echo "  ❌  Avg latency too high: ${AVG_MS}ms (threshold: 3000ms)"
  exit 1
fi
