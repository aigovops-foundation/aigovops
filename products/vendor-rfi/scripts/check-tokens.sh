#!/usr/bin/env bash
# Guard: this vendored tokens.css must match the canonical AiGovOps brand source (the foundation site).
# Tolerant by design — if the canonical can't be fetched (network blip / Pages mid-deploy), it SKIPS
# rather than flaking CI. It only fails on a real, fetched-and-different drift.
set -euo pipefail
CANON="${TOKENS_CANONICAL_URL:-https://www.aigovops-foundation.com/css/tokens.css}"
LOCAL="${1:-tokens.css}"
tmp="$(mktemp)"
if ! curl -fsS --max-time 20 "$CANON" -o "$tmp"; then
  echo "i  tokens-guard: canonical unreachable ($CANON) — skipping drift check."; exit 0
fi
if diff -u "$tmp" "$LOCAL"; then
  echo "OK  $LOCAL matches the canonical brand tokens."
else
  echo "!!  $LOCAL has DRIFTED from the canonical tokens.css."
  echo "    Re-sync:  curl -fsS $CANON -o $LOCAL"
  exit 1
fi
