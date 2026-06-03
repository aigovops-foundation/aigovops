#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Cloud-Mary health-check library: DNS, uptime/reachability, HTTP error detection.
# Sourced by scripts/test-dns.sh, test-uptime.sh, test-errors.sh, and the E2E tier.
# Each function prints "  ✅ …" / "  ❌ …" and increments PASS/FAIL (must be defined
# by the caller). Pure curl + DoH; no extra dependencies.
# ─────────────────────────────────────────────────────────────────────────────

# Expected GitHub Pages apex IPs (the canonical A-record set).
GH_PAGES_IPS=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")

# _hc_check LABEL RESULT   (RESULT == "ok" → pass, else fail with message)
_hc_check() {
  local label="$1" result="$2"
  if [ "$result" = "ok" ]; then
    echo "  ✅  $label"; PASS=$((PASS+1))
  else
    echo "  ❌  $label — $result"; FAIL=$((FAIL+1))
  fi
}

# ── DNS via DNS-over-HTTPS (works even where raw :53 is blocked) ─────────────
# _hc_doh NAME TYPE  → prints space-separated record data (empty if none)
_hc_doh() {
  local name="$1" type="$2"
  curl -s --max-time 12 -H 'accept: application/dns-json' \
    "https://cloudflare-dns.com/dns-query?name=${name}&type=${type}" 2>/dev/null \
  | python3 -c "import json,sys
try:
    d=json.load(sys.stdin); print(' '.join(a.get('data','').rstrip('.') for a in d.get('Answer',[])))
except Exception: print('')" 2>/dev/null
}

# dns_resolves NAME  → passes if the name returns ANY A/AAAA/CNAME answer
dns_resolves() {
  local name="$1"
  local a; a=$(_hc_doh "$name" "A")
  local c; c=$(_hc_doh "$name" "CNAME")
  if [ -n "$a$c" ]; then _hc_check "DNS resolves: $name" "ok"
  else _hc_check "DNS resolves: $name" "no A/CNAME answer"; fi
}

# dns_apex_points_to_github NAME  → apex A-records must equal the GitHub Pages set
dns_apex_points_to_github() {
  local name="$1"
  local a; a=$(_hc_doh "$name" "A")
  if [ -z "$a" ]; then _hc_check "Apex A-records present: $name" "none"; return; fi
  local ok=1
  for ip in "${GH_PAGES_IPS[@]}"; do
    echo "$a" | grep -qw "$ip" || ok=0
  done
  [ "$ok" = "1" ] && _hc_check "Apex points to GitHub Pages: $name" "ok" \
                   || _hc_check "Apex points to GitHub Pages: $name" "got [$a]"
}

# dns_cname_target NAME EXPECTED_SUBSTR
dns_cname_target() {
  local name="$1" expect="$2"
  local c; c=$(_hc_doh "$name" "CNAME")
  echo "$c" | grep -qi "$expect" && _hc_check "CNAME $name → $expect" "ok" \
                                 || _hc_check "CNAME $name → $expect" "got [${c:-none}]"
}

# dns_not_stale NAME BAD_SUBSTR  → fails if a record still points at a stale host
dns_not_stale() {
  local name="$1" bad="$2"
  local all; all="$(_hc_doh "$name" A) $(_hc_doh "$name" CNAME)"
  echo "$all" | grep -qi "$bad" && _hc_check "No stale record ($bad) on $name" "still present: $bad" \
                                || _hc_check "No stale record ($bad) on $name" "ok"
}

# ── UPTIME / REACHABILITY ────────────────────────────────────────────────────
# uptime_reachable URL  → passes on any final 2xx/3xx (site is up & responding)
uptime_reachable() {
  local url="$1"
  local code; code=$(curl -sL -o /dev/null -w "%{http_code}" --max-time 20 "$url" 2>/dev/null)
  if [ "$code" -ge 200 ] 2>/dev/null && [ "$code" -lt 400 ] 2>/dev/null; then
    _hc_check "Reachable: $url" "ok"
  else
    _hc_check "Reachable: $url" "HTTP ${code:-no-response}"
  fi
}

# uptime_latency URL MAX_MS  → passes if total response time is under MAX_MS
uptime_latency() {
  local url="$1" max_ms="$2"
  local t; t=$(curl -sL -o /dev/null -w "%{time_total}" --max-time 20 "$url" 2>/dev/null)
  local ms; ms=$(python3 -c "print(int(float('${t:-99}')*1000))" 2>/dev/null || echo 99999)
  if [ "$ms" -lt "$max_ms" ] 2>/dev/null; then
    _hc_check "Latency < ${max_ms}ms: $url (${ms}ms)" "ok"
  else
    _hc_check "Latency < ${max_ms}ms: $url" "${ms}ms"
  fi
}

# uptime_tls_valid URL  → passes if HTTPS completes with a valid cert (curl exit 0).
# curl exit 60 = cert problem; 35 = TLS handshake; 6 = DNS; 28 = timeout.
uptime_tls_valid() {
  local url="$1"
  curl -sS -o /dev/null --max-time 20 "$url" 2>/dev/null
  local rc=$?
  case "$rc" in
    0)  _hc_check "TLS cert valid: $url" "ok" ;;
    60|51) _hc_check "TLS cert valid: $url" "cert error (curl $rc)" ;;
    35) _hc_check "TLS cert valid: $url" "TLS handshake failed (curl 35)" ;;
    28) _hc_check "TLS cert valid: $url" "timeout (curl 28)" ;;
    *)  _hc_check "TLS cert valid: $url" "curl exit $rc" ;;
  esac
}

# ── HTTP ERROR DETECTION ─────────────────────────────────────────────────────
# error_no_5xx URL  → fails on any 5xx (server error)
error_no_5xx() {
  local url="$1"
  local code; code=$(curl -sL -o /dev/null -w "%{http_code}" --max-time 20 "$url" 2>/dev/null)
  if [ "$code" -ge 500 ] 2>/dev/null; then _hc_check "No 5xx: $url" "HTTP $code"
  else _hc_check "No 5xx: $url" "ok"; fi
}

# error_expect_code URL EXPECTED  → passes only if status equals EXPECTED
error_expect_code() {
  local url="$1" expect="$2"
  local code; code=$(curl -sL -o /dev/null -w "%{http_code}" --max-time 20 "$url" 2>/dev/null)
  [ "$code" = "$expect" ] && _hc_check "$url → $expect" "ok" \
                          || _hc_check "$url → $expect" "got $code"
}

# error_no_redirect_loop URL  → detects "too many redirects" (the Cloudflare-Flexible bug)
error_no_redirect_loop() {
  local url="$1"
  # curl exit 47 = too many redirects. Cap at 10 hops.
  curl -sL -o /dev/null --max-redirs 10 --max-time 20 "$url" 2>/dev/null
  local rc=$?
  if [ "$rc" = "47" ]; then _hc_check "No redirect loop: $url" "too many redirects (curl 47)"
  else _hc_check "No redirect loop: $url" "ok"; fi
}

# error_soft_404 URL NEEDLE  → catches "soft 404s": 200 status but error content
error_soft_404() {
  local url="$1" needle="$2"
  local b; b=$(curl -sL --max-time 20 "$url" 2>/dev/null)
  echo "$b" | grep -qi "$needle" && _hc_check "No soft-404 content: $url" "found '$needle'" \
                                 || _hc_check "No soft-404 content: $url" "ok"
}
