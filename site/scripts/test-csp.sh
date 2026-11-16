#!/usr/bin/env bash
# Every page that loads a cross-origin script must allow that host in its own CSP script-src.
# (community.html loaded thursday.js from a host its CSP never named — the Thursday date never
# rendered there. This keeps that from coming back.)
set -u
cd "$(dirname "$0")/.." || exit 1
fail=0
for p in *.html; do
  csp=$(grep -o 'Content-Security-Policy" content="[^"]*"' "$p" | head -1)
  [ -z "$csp" ] && continue
  script_src=$(printf '%s' "$csp" | sed -n 's/.*script-src \([^;]*\).*/\1/p')
  [ -z "$script_src" ] && continue
  for host in $(grep -o '<script[^>]*src="https://[^/"]*' "$p" | sed 's/.*src="https:\/\///' | sort -u); do
    case " $script_src " in *"https://$host"*) ;; *) echo "FAIL $p loads script from $host but script-src is: $script_src"; fail=1;; esac
  done
done
[ $fail -eq 0 ] && echo "test-csp: ok (every external script host is allowed by its page's CSP)"
exit $fail
