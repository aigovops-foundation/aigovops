# Contributing

Thanks for helping improve the AIGovOps Vendor RFI project. This repo follows the AIGovOps Foundation open-source style: governance artifacts should be versioned, testable, observable, and auditable.

## How to contribute

- Open an issue describing the change before large work.
- Fork, branch from main, and open a pull request.
- Vendor data changes must include a source and a status rationale (Ready/Integrate/Gap).
- Sponsorship-related changes must comply with vendor-sponsorship.md (no buying rank or hiding gaps).

## Vendor corrections & neutrality

The catalog is a **living, governed surface**, not a static list. The single source of truth is
[`vendors-data.js`](vendors-data.js); `VENDOR_META.lastReviewed` records the last audit, and
[`.github/workflows/freshness.yml`](.github/workflows/freshness.yml) opens a tracking issue if the
catalog goes past its quarterly cadence.

- **Spotted something wrong or missing?** Open a [vendor correction](../../issues/new?template=vendor-correction.yml).
  Cite a public source — corrections are verified neutrally.
- **Neutrality is governed**: ranking can't be bought and gaps can't be hidden
  (see [`docs/vendor-sponsorship.html`](docs/vendor-sponsorship.html)).
- Vendor data changes must carry a source and a status rationale (Ready / Integrate / Gap), and the
  honest "best at" vs "gap" for each entry.

## Local preview

The webapp is a set of static HTML pages (landing, advisor, comparison, training) plus
`vendors-data.js`. Open any page directly in a browser, or serve the folder with any static server.
No build step is required.
