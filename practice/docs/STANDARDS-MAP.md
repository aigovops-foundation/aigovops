# Global standards — what the ladder conforms to, crosswalks to, and is ready for

As of 11 September 2026. Sources at the end; dates re-checked on the day this was written and to be
re-checked before any public copy uses them. The Foundation does not issue standards (STANDARDS.md); it
implements, adopts, teaches and builds community around them.

## 1. The one we conform to — OVERT 1.1

| | |
|---|---|
| Steward | Glacis Technologies, Inc. (Seattle). CEO Joe Braidwood; co-founder/CTO Rohit Tatachar (ex-Microsoft Foundry, joined April 2026) |
| Versions | OVERT 1.0 published 25 March 2026; **OVERT 1.1, June 2026** (current) |
| What it defines | Observable verification evidence at the AI runtime boundary. **Six domains:** GOVERN · IDENTIFY · PROTECT · ATTEST · MEASURE · RESPOND. **Four Attestation Assurance Levels:** AAL-1 Policy Documentation · AAL-2 Process Records · AAL-3 Automated Monitoring · AAL-4 Cryptographic Attestation (independent third party produces tamper-evident proof without content access) |
| Profiles | AAL-1 may declare no profile; AAL-1–2 may self-declare; **AAL-3–4 require a registered profile** with published test vectors and crosswalks |
| Independent Attestation Provider | Structurally independent of the operator; runs notary infrastructure, validates attestations, publishes transparency-log entries. Required at AAL-4 |
| IPR | Royalty-free, irrevocable patent covenant with defensive termination (overt.is/ipr-policy) |
| Our status | Beacon profile `aigovops-beacon.v1` — registration **pending Glacis sign-off since May 2026** (ADR-0001). Until registered, public copy says *targeting OVERT 1.1 conformance* |
| Where the ladder maps | 100 → AAL-1 pattern · 200 → AAL-2 · 300 → AAL-3 · 400 → AAL-4. A claim about the person's demonstrated practice, never about a system's conformance (PRD v3 §4) |
| Corrections to carry | v1 PRD §6 "OVERT Level 1 Core" → AAL-1 Policy Documentation. Beacon README "AAL-2 with IAP on roadmap" → re-check: IAP is an AAL-4 requirement in 1.1 |

Glacis's product is Arbiter — signed, unalterable records of inference calls, safety checks and outputs;
starter and pro plans; healthcare, fintech and insurance pilots. That is the runtime a funded operator
buys. The Foundation's open reference implementation and its practitioners are what make the standard
adoptable by the operators Glacis does not sell to. Complementary by construction; see
[`GLACIS-ALIGNMENT.md`](GLACIS-ALIGNMENT.md).

## 2. The regulation that sets the readiness date — EU AI Act and the Digital Omnibus

| Obligation | Original date | Now | Status |
|---|---|---|---|
| Prohibited practices (Art. 5) | 2 Feb 2025 | unchanged; new prohibition on non-consensual intimate imagery / CSAM generation, transition to 2 Dec 2026 | **live** |
| GPAI model obligations | 2 Aug 2025 | unchanged | **live** |
| Transparency (Art. 50) — disclose AI interaction, label synthetic content | 2 Aug 2026 | unchanged; watermarking grace for existing systems to 2 Dec 2026 | **live as of 2 Aug 2026** |
| High-risk, Annex III (employment, credit, benefits, biometrics, education, justice…) | 2 Aug 2026 | **2 December 2027** | deferred |
| High-risk, Annex I (AI in regulated products) | 2 Aug 2027 | **2 August 2028** | deferred |
| AI literacy (Art. 4) | — | softened to "support the development of" | changed |
| Regulatory sandboxes | 2 Aug 2026 | 2 Aug 2027 | deferred |

Provisional political agreement 6 May 2026, confirmed by Council 13 May 2026. Formal adoption and OJ
publication follow; dates above are the agreed text as reported by counsel and should be re-verified
against the Official Journal before the site prints them.

**What it means for the ladder.** Every Annex III category has a case in the corpus — Robodebt and the
toeslagenaffaire (benefits), iTutorGroup, Amazon and Workday (employment), Apple Card (credit), the four
Detroit arrests and Bridges (biometrics), Ofqual (education), COMPAS (justice). The deferral is fifteen
months of runway, not a reprieve. **The readiness promise: a 300 can take an Annex III-class system to
the operate-gate pattern before 2 December 2027.**

## 3. The frameworks the UCID registry crosswalks

| Framework | Nature | Where it lands in the ladder |
|---|---|---|
| **NIST AI RMF 1.0** (+ Generative AI Profile) | Voluntary; Govern · Map · Measure · Manage | UCID crosswalk (Umbrella); policy gates in CI; the corpus tags cases to RMF functions |
| **NIST AI Agent Standards Initiative** (2026) | NCCoE *Software and AI Agent Identity and Authorization* concept paper (Feb 2026; comments closed 2 Apr); CAISI RFI on agent security (closed 9 Mar); sector listening sessions (healthcare, finance, education) | F15: broker binds `agent_id` + `authority`; the answer to *No More Anonymous Ghosts*. The Foundation's public-interest use cases are the input NIST asked for; a 400 activity is to file one |
| **ISO/IEC 42001** | Certifiable AI management system (organisational) | Crosswalk only. The Foundation credentials people; ISO 42001 certifies organisations; the two are cited together, never confused |
| **HIPAA** (healthcare crosswalk in Beacon) | Sector regulation | 300's healthcare scenarios (nH Predict, Cigna PXDX) |
| **OECD AI Principles / AI Incidents Monitor**, **AIID**, **AIAAIC** | Incident registries | The corpus re-verifies against them; a 400 activity is to submit a case upstream with its gate |
| **Human Flourishing** (Beacon crosswalk) | Foundation's own advisory crosswalk | Advisory only; OVERT's crosswalks are normative |

## 4. The credentials landscape the ladder sits beside

| Credential | Owner | What it tests | Relation to the ladder |
|---|---|---|---|
| **AIGP** — AI Governance Professional | IAPP | Knowledge: governance foundations, regulatory frameworks, development and deployment oversight; multiple choice | Complement. We do not contest multiple choice. A 200 who holds AIGP has the policy side; the ladder adds the hands-on side |
| **ISO/IEC 42001 Lead Implementer / Auditor** | Training providers | Implementing or auditing an AI management system | Complement; organisational, not runtime |
| **IAPP AI Governance + Privacy certificate**; **ISACA AAISM** | IAPP; ISACA | Privacy intersection; AI security management (CISM/CISSP prerequisite) | Adjacent |
| **AiGovOps Practitioner — policy-as-code readiness, 100–400** | AiGovOps Foundation (proposed, PRD v3 D10) | **Performance**: run the four gates on verified cases, produce a signed artifact, verified offline; host-marked; ledger-minted; free | The gap none of the above fills: can this person make a gate hold, prove it, and let a stranger check it |

Glacis's own 2026 certification guide lists the first three and proposes role ladders from analyst to
Chief AI Ethics Officer, and names no hands-on runtime credential — the open land the August 10x plan
identified as Lever 6.

## 5. The ladder's crosswalk in one table

| Level | Gate owned | OVERT AAL pattern | OVERT domains exercised | EU AI Act touchpoint | NIST touchpoint |
|---|---|---|---|---|---|
| 100 Begin | Pre-pend | AAL-1 Policy Documentation | PROTECT, GOVERN | Art. 50 transparency (the chatbot must say it is one) | RMF Govern |
| 200 Retrofit | Policy gates | AAL-2 Process Records | GOVERN, IDENTIFY, PROTECT | Annex III scoping of your own system | RMF Map; agent identity (concept paper) |
| 300 Hold | Operate | AAL-3 Automated Monitoring | PROTECT, MEASURE, RESPOND | Human oversight (Art. 14) and logging (Art. 12) patterns for Annex III | RMF Measure · Manage; agent authorization |
| 400 Prove | Audit | AAL-4 Cryptographic Attestation | ATTEST, RESPOND | Post-market monitoring and incident reporting patterns (Arts. 72–73) | Incident submission to AIID / OECD AIM |

## Sources

- OVERT 1.1 standard (PDF): https://overt.is/OVERT_v1.1_STANDARD.pdf
- GeekWire, April 2026, on Glacis, Arbiter, OVERT and the CTO hire: https://www.geekwire.com/2026/seattle-startup-glacis-brings-longtime-microsoft-leader-aboard-to-target-ais-biggest-blind-spot/
- Glacis, *AI Governance Certification Guide 2026*: https://www.glacis.io/guide-ai-governance-certification
- Gibson Dunn on the EU AI Act Omnibus agreement and dates: https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
- Cloud Security Alliance research notes on the high-risk deferral: https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-omnibus-vii-deadline-delay-20260/
- NIST AI Agent Standards Initiative: https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative
- NIST NCCoE concept paper, *Accelerating the Adoption of Software and AI Agent Identity and Authorization* (Feb 2026): https://csrc.nist.gov/pubs/other/2026/02/05/accelerating-the-adoption-of-software-and-ai-agent/ipd
- Beacon repo: STANDARDS.md, STEWARD.md, ENGAGEMENT.md, docs/decisions/0001-overt-alignment.md (local clone, 11 Sept 2026)
- Library corpus: `docs/data/verified-harms-2026-W24.json` (local clone, 11 Sept 2026)
