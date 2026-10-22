# AiGovOps Foundation Site — Documentation

This folder contains the complete planning, design, and operational documentation for `www.aigovops-foundation.com`.

---

## Document index

| Document | Location | Purpose |
|----------|----------|---------|
| **Product Requirements** | `prd/PRD.md` | What we're building, for whom, and why |
| **Market Requirements** | `mrd/MRD.md` | Market context, competitive landscape, key messages |
| **Technical Specification** | `tech-spec/TECH-SPEC.md` | Architecture, stack, modules, workflows, secrets |
| **Architecture Overview** | `architecture/ARCHITECTURE.md` | System diagram, decision log, scalability |
| **Data Flow** | `data-flow/DATA-FLOW.md` | All data paths: content, AI agent, analytics, deploy |
| **Design System** | `design/DESIGN-SYSTEM.md` | Brand, logo, colours, typography, components, motion |
| **UX Specification** | `ux/UX-SPEC.md` | IA, components, accessibility, responsive, voice UX |
| **Security Plan** | `security/SECURITY.md` | Threat model, secrets, CORS, HTTPS, disclosure |
| **Version Control** | `version-control/VERSION-CONTROL.md` | Branching, commits, PR process, hotfix, cleanup |
| **Cloud-Mary Spec** | `version-control/CLOUD-MARY.md` | Test suite specification, 6 tiers, how to extend |
| **PR Template** | `version-control/PR-TEMPLATE.md` | Standard PR checklist for all contributions |

---

## Quick reference

**Run all tests locally:**
```bash
bash scripts/cloud-mary.sh --unit --a11y --i18n --chaos --docs
```

**Create a new PR branch:**
```bash
git checkout -b feature/short-desc-month-year
```

**Deploy:**
All pushes to `main` trigger the deploy workflow automatically.

**Update secrets:**
GitHub → Settings → Secrets and variables → Actions

**Update frameworks data:**
Edit `FRAMEWORKS` array in `frameworks.html`

**Update contact details:**
Edit `LEADERS` object in `js/schedule.js`

---

## Who to contact

| Topic | Contact |
|-------|---------|
| Site features, PRD, roadmap | Ken Johnston — ken.johnston@aigovops.community |
| Technical, security, deploy | Bob Rapp — bob.rapp@aigovops.community |
| Press / media | bob.rapp@aigovops.community |
| Governance / OVERT 1.0 | ken.johnston@aigovops.community |
