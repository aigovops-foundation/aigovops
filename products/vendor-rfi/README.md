# aigov-ops-open-source-vendor-rfi-rapp-johnston-june-2026

AIGovOps Foundation open-source Vendor RFI/RFP webapp — evidence-oriented vendor stack composer for Beacon & Umbrella, with auditor value model and neutral vendor sponsorship framework.

## Quick start

**New here? Start with the [audit-training tool](training.html)** — learn the AIGovOps governance stack, take a scored knowledge check, run a self-audit, and export a verifiable receipt.

Open `index.html` (the overview) in a browser, then "Open webapp" to launch the advisor — or open
`vendor-rfi-advisor.html` directly.

## What this is

A static, two-page site in the AIGovOps "deep ocean governance" brand (shared with Beacon & Umbrella):

- **`index.html`** — the overview / landing page: what the RFI gives auditors and vendors, the
  Beacon · Umbrella · Lantern roadmap, and links into the app and docs.
- **`vendor-rfi-advisor.html`** — the advisor webapp. Two operating views:
  - **Beacon lens** — an unsigned evidence-receipt preview (canonical JSON + SHA-256), ready for
    Beacon Ed25519 + JCS signing.
  - **Umbrella lens** — a profile-driven stack composer across audit, policy-as-code, gates/controls,
    dashboards, runtime guardrails, and shipping code, with JSON/YAML export and a light/dark toggle.

The advisor's vendor data and recommendation logic are derived from `docs/vendor-guide.md`.

## Files

- `index.html` — overview / landing
- `training.html` — interactive audit-training tool (lessons + knowledge check + self-audit + completion receipt)
- `comparison.html` — side-by-side comparison of 50 (2026) AI-governance vendors across 5 categories
- `vendors-data.js` — the vendor dataset (single source of truth, maintained by aigovops-agent-vendor-rfi)
- `vendor-rfi-advisor.html` — the advisor webapp (profiles → stack → recommendation → receipt)
- `docs/vendor-guide.md` — AI Governance Policy-as-Code Vendor Guide for Fortune 100 Manufacturing (source content)
- `docs/auditor-value.md` — evidence-oriented auditor value model
- `docs/vendor-sponsorship.md` — neutral sponsorship model (sponsor the surface, not the score)
- `.github/workflows/pages.yml` — GitHub Pages deploy workflow
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/` — contribution + governance

## Hosting

Enable GitHub Pages (Settings > Pages > Source: GitHub Actions). Once deployed, the site can be linked or embedded from the Beacon and Umbrella sites on www.aigovops-foundation.com.

## License

Apache-2.0.
