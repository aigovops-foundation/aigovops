# Giving rails — parked state & the one-command finish

**Decision (July 2026):** donations go **direct via Stripe Payment Links**. No Open
Collective, no GitHub Sponsors.

## Current state: PARKED

`support.html` ships in a *parked* state because the real Stripe Payment Links
don't exist yet — Ken (the Stripe admin) creates them and sends the four URLs.

While parked:

- Every giving CTA points at `https://github.com/aigovops-foundation` (a safe,
  live destination — never a 404 or a dead sponsor/OC page) and carries its
  **intended** destination in a `data-orig="…"` attribute. `data-orig` is the
  mapping key the finish script reads; **do not edit those values.**
- A visible **`giving-interim`** notice (between `<!-- giving-interim:start -->`
  and `<!-- giving-interim:end -->`) tells donors that secure Stripe checkout is
  being set up and to email `bob.rapp@aigovops.community` to pledge.
- All page copy says **Stripe** (secure checkout) — no promises of Sponsors/OC.
- The Jeeves `giving_rails` nightly job (Omni-Rapp) watches this page. While
  parked it reports **“awaiting Stripe links from Ken”** in its needs-Bob list
  rather than failing; once live it verifies every `buy.stripe.com` link is 200
  and not deactivated, and flags any sponsor/OC URL that creeps back.

## The finish: one command

When Ken sends the four `https://buy.stripe.com/...` Payment Links, run:

```bash
bash scripts/apply-stripe-links.sh <DONATE> <CONTRIBUTOR> <SUSTAINER> <FOUNDING>
```

The script (`scripts/apply-stripe-links.sh`) is **idempotent** and **abort-loud**:

1. **Validates** all four URLs are `buy.stripe.com`, return **200**, and are not
   deactivated (`"link is no longer active"`) — *before touching any file*.
2. **Maps** each parked CTA by its `data-orig` URL:
   `…contributor…` → CONTRIBUTOR · `…sustainer…` → SUSTAINER ·
   `…founding…` → FOUNDING · everything else (donate / bare sponsor / OC) → DONATE.
3. Sets each `href` to its Stripe link, removes `data-orig`, enforces
   `target="_blank" rel="noopener"`, points the JS coffee button at DONATE, and
   **strips the `giving-interim` block**.
4. Updates the literal-string **unit-test assertions** to the Stripe end-state.
5. Runs the full **Cloud-Mary** gate, then **ships its own PR** per the deploy
   workflow (branch → gate → PR → squash merge).

Offline sanity check (no network, changes nothing real):

```bash
bash scripts/apply-stripe-links.sh --selftest
```

## Argument → tier mapping (for reference)

| Stripe arg   | Tier                     | Parked `data-orig` it replaces |
|--------------|--------------------------|--------------------------------|
| `DONATE`     | one-time / general give  | bare sponsor, OC org, `/donate`, coffee button |
| `CONTRIBUTOR`| Contributor ($50)        | `…?tier=contributor`, `…/contribute/contributor-50` |
| `SUSTAINER`  | Sustainer ($1,000)       | `…?tier=sustainer`, `…/contribute/sustainer-1000` |
| `FOUNDING`   | Founding Steward Partner | `…/contribute/founding-partner-10000` |

## Do NOT

- Do **not** remove the interim notice by hand — the script does it atomically
  with the link swap, so donors never see live-but-broken buttons.
- Do **not** touch the Stripe dashboard, API keys, or payout settings from here —
  that is Bob/Ken's step.
