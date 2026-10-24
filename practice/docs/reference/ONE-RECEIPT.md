# One Receipt

> **Superseded by v0.2 (14 September 2026).** The paper, the core specification, schemas, reference verifier, twelve corpus test vectors, the master plan with twelve decisions and the coalition playbook now live in [aigovops-foundation/One-ai-Receipt-aigovops-foundation](https://github.com/aigovops-foundation/One-ai-Receipt-aigovops-foundation) — read [`docs/WHITEPAPER.md`](https://github.com/aigovops-foundation/One-ai-Receipt-aigovops-foundation/blob/main/docs/WHITEPAPER.md) there, or the [PDF](https://github.com/aigovops-foundation/One-ai-Receipt-aigovops-foundation/blob/main/docs/One-Receipt-v0.2.pdf). This v0.1 draft stays here as history; the research memos in `research/` remain the per-claim sources. What v0.2 changed: bounded claims lead; OR-0…OR-5 is our own verifier-computed ladder (no AAL borrowing); contestability is an object; privacy has a threat model; witnessing and four separated roles; how each Foundation project adopts it is in that repo's `docs/ADOPTION.md`.

**A proposal for an end-to-end protocol that lets anyone verify one generative-AI transaction — across every interface, for every party.**

Whitepaper review draft v0.1 · AiGovOps Foundation · 13 September 2026 · Authors: Bob Rapp, Ken Johnston, with Claude · Status: **for review** (Ken and Bob; then the Review Circle). Review page: the artifact "One Receipt" (kept current; never re-created).

*Assumption stated up front: "UP Path" in the brief is read as UiPath — founding contributor to, and first platform certified under, AIUC-1. Every claim below carries a source (research memos in `research/`); items marked "unverified" could not be confirmed on 13 September 2026 and must not be printed publicly.*

---

## 0. In one paragraph

Today a person can talk to an AI in a chat window, through an API, by voice, inside an IDE, through a browser extension, on a phone, or through another agent — and no party can later prove, without trusting the operator, what model answered, under which policy, on whose authority, with what checks, and whether the record was altered afterwards. Eleven standards bodies each hold one piece: ISO 42001 certifies the organisation, AIUC-1 certifies the agent quarterly, OVERT signs the decision, C2PA signs the file, SCITT gives the transparency log, AP2 signs the shopping mandate, OpenTelemetry names the fields, the EU AI Act says logs must exist. Nothing joins them into **one receipt per transaction that a stranger can verify offline**. This paper proposes that receipt — content-free, signed, chained, interface-agnostic — as a *profile that sits on the standards that exist*, contributed upstream rather than issued by the Foundation, and governed so that no party that sells the runtime also grades it.

## 1. The eight seams

1. **No transaction identifier.** Only China's labelling rules (in force 1 Sep 2025) require a per-output "content reference number". MCP's 2026-07-28 spec *removed* session ids; OpenTelemetry's `gen_ai.*` conventions are still "Development" and unsigned. No id survives chat → API → agent → extension → product.
2. **Identity is split three ways and never bound.** Human (OIDC, W3C VC 2.0), workload (SPIFFE/WIMSE, `draft-klrc-aiagent-auth-03`), and agent/model (A2A signed Agent Cards; ITU FG-TIDA, first meeting Nov 2026). Nothing signs *human + agent + model version + tool* together at call time.
3. **Policy decisions are asserted, not attested.** ISO 42001, NIST AI RMF, CSA AICM v1.1 and EU Arts 9–14 say controls must exist; only OVERT 1.1 specifies a per-action proof that a control ran — and OVERT has one vendor implementation, no registered Independent Attestation Provider, and no assessor registry yet. The EU's harmonised logging standard, prEN 18229-1, is at Enquiry stage.
4. **Transparency logs have a transport but no AI payload.** RFC 9943 (SCITT architecture) and RFC 9942 (COSE receipts) were published June 2026; there is no registered SCITT statement profile for "AI inference / agent action". OVERT does not reference SCITT.
5. **Provenance is bound to the asset, not the session.** C2PA 2.3 and IPTC 2025.1 describe what produced a *file*; free-form text, voice and code — most of what generative AI emits — carry nothing, and platforms strip manifests.
6. **Audit rights stop at the organisation.** EU Art. 12/26(6) logs are for the provider, deployer and regulator; ISO 42006 accredits auditors of *management systems*; there is no "verify with a public key, offline" norm outside Sigstore and OVERT tooling.
7. **Incidents are narrative.** Art. 73 templates, OECD AIM, AIID and the Frontier Model Forum's incident sharing accept prose; none takes a receipt hash or inclusion proof as the anchor. NYC Local Law 144's audit regime produced two complaints and no enforcement in two years — evidence that summaries without artefacts do not work.
8. **Interfaces are uneven.** Voice has no marking channel; coding agents have AGENTS.md (guidance); on-device AI has RATS (RFC 9334) but no AI profile; A2A puts authorisation out of scope by design; commerce protocols (AP2, Visa TAP, Mastercard Verifiable Intent, OpenAI/Stripe ACP) prove *who* transacted but not *what the model did* between intent and cart.

## 2. What exists, in one table

| Layer | Standard (steward, status) | What it answers | What it cannot |
|---|---|---|---|
| Organisation | ISO/IEC 42001:2023 (+42005 impact, 42006 audit bodies); NIST AI RMF 1.0 + AI 600-1 | Does the operator have a management system? | Anything about one transaction |
| Agent (periodic) | **AIUC-1** (AIUC; quarterly releases, Jul 2026 current; six domains; third-party audit + quarterly adversarial testing; insurance-priced; UiPath, Intercom, Cursor, Harvey, ElevenLabs, KPMG certified) | Was this agent tested and insured this quarter? | Whether the certified controls ran on *your* call |
| Decision (runtime) | **OVERT 1.1** (Glacis, 11 Jun 2026; six domains; AAL-1…4; IAP + Qualified Assessor defined, none registered) | Did a control execute on this action, signed and chained? | Cross-vendor adoption; SCITT/C2PA/OTel mapping; human mandate |
| Log | **IETF SCITT** RFC 9943 / RFC 9942 (Jun 2026); Sigstore Rekor v2 (Oct 2025) | Was the statement registered and unaltered? | What an AI statement should contain |
| Identity | W3C VC 2.0 / DID 1.1 CR; SPIFFE; `draft-klrc-aiagent-auth`; OpenID AIIM CG; Cloudflare Web Bot Auth (operator only, forbids human binding) | Who is the human / workload / bot? | Binding all three to one act |
| Mandate | Google **AP2** (Sep 2025; Intent/Cart/Payment Mandates as VCs); Mastercard Verifiable Intent (Mar 2026); Visa TAP (RFC 9421 signatures); OpenAI/Stripe ACP (allowance tokens) | What did the human authorise the agent to buy? | Anything outside commerce; what the model did |
| Telemetry | OpenTelemetry GenAI semconv v1.42 (Development) | Field names for model, tokens, tools, agents | Signing; stability |
| Content | C2PA 2.3 (Feb 2026); IPTC 2025.1; EU Transparency Code (Jun 2026) + Art. 50 Guidelines (Jul 2026) | What produced this file? | Text/voice/code; the session |
| Supply chain | CycloneDX 1.7 ML-BOM; SPDX 3.0.1 AI profile; OpenSSF Model Signing 1.0 | What is the model made of? | The transaction |
| Regulation | EU AI Act as amended by (EU) 2026/1744: Art. 12 logging, Art. 50 (live 2 Aug 2026), Annex III 2 Dec 2027, Art. 73 incidents; Colorado SB 26-189 (1 Jan 2027); Korea AI Basic Act (22 Jan 2026); China labelling (1 Sep 2025); California SB 942 (2 Aug 2026) | What must be logged, disclosed, explained, reported | A format; a verifier |
| Incidents | OECD AIM; AIID; AIAAIC; FMF incident sharing (May 2026); MIT tracker | What went wrong, in prose | Linkage to evidence |
| Confidential compute | Apple PCC (expanded to Google Cloud, Jun 2026); Google Confidential Space; Intel Trust Authority | Which binary ran, in which enclave | What it answered |

## 3. The proposal

### 3.1 One receipt, six stages

A **receipt** is a content-free, signed statement about one *transaction* — one request and its response, or one agent action — chained into a transparency log, with pointers (never payloads) to the evidence each stakeholder may later be entitled to see.

| Stage | Field group | Binds | Built on |
|---|---|---|---|
| 1 Identity | `principal` (human subject or "none"), `operator`, `agent`, `model` (name, version, weights hash or BOM ref) | Who acted, on whose behalf, with what | OIDC/VC 2.0 subject; Web Bot Auth key; A2A Agent Card; SPDX/CycloneDX ref |
| 2 Mandate | `mandate` (hash of a signed intent, scope, limits, expiry) | What the human authorised | AP2 Intent/Cart Mandate VC; Mastercard Verifiable Intent; or a Foundation "plain-words rule" for non-commerce |
| 3 Policy | `policy` (policy id + version hash, tier, decision ∈ {allow, constrain, hold, deny}, `controls[]` executed with outcomes, human-in-loop flag) | Which gate ran and what it decided | OVERT GOVERN/PROTECT ControlActions; AIUC-1 control ids; CSA AICM ids; Umbrella UCID |
| 4 Runtime | `io` (salted commitments to input and output, token counts, latency), `env` (TEE attestation ref if any), `tools[]` (each tool call as a nested receipt id) | What was computed, where | OTel GenAI attributes; RATS RFC 9334 evidence; MCP/A2A ids |
| 5 Provenance | `output_manifest` (C2PA manifest hash or "text: none"), `disclosure` (was the AI nature disclosed; how) | What left the system and how it was marked | C2PA 2.3; Art. 50; China reference number |
| 6 Audit | `log` (SCITT transparency-service id, inclusion proof, checkpoint), `registry` (Art. 71 / ATRS / AIUC-1 cert / OVERT profile ids), `explain_ref`, `complaint_ref`, `retention` | Where the proof lives; how to challenge it | RFC 9943/9942; Art. 86; Art. 26(6) six-month floor |

Envelope: COSE_Sign1 over a CBOR/JCS-canonical body, Ed25519 by default with a hybrid post-quantum option; registered as a **SCITT statement profile** so any RFC 9943 transparency service can hold it. Selective disclosure via SD-JWT (RFC 9901) for the pointer fields. One receipt id, one URL pattern (`…/r/<id>`), one offline verifier.

### 3.2 Interface profiles

The same six stages; what changes is how the id is carried and how the user sees it.

| Interface | Id carrier | Disclosure to the user | Notes |
|---|---|---|---|
| Chat / web | Response header + a visible "receipt" affordance | Link under every answer | The café's Wren Card pattern |
| API | `AI-Receipt` response header (id + log URL); request may carry `AI-Mandate` | Client's responsibility; SDK prints it | Maps 1:1 to OTel span |
| Voice | Spoken id on request; DTMF/URL in transcript | "Say 'receipt'" | Fills the only channel Art. 50 admits is weak |
| Agent-to-agent | A2A message metadata; nested receipts per hop | Root receipt for the human principal | MCP has no session id — the receipt is the session |
| Browser extension / IDE | Receipt id in the edit/commit trailer | `Receipt:` git trailer | Coding agents already sign commits |
| Embedded product / phone | On-device receipt with TEE evidence; uploads when online | Settings → receipts | RATS profile |
| Commerce | AP2 Cart Mandate hash in `mandate` | Merchant receipt cites it | Visa/Mastercard/ACP compatible |

### 3.3 Roles — and the independence rule

- **Operator** (seller/deployer) issues receipts.
- **Notary** (transparency service) registers them — structurally outside the operator's trust boundary above assurance level 2.
- **Assessor** verifies samples without content access — never the same legal entity as the notary or the operator, and never the party that sells the runtime.
- **Registry** holds the public entries a receipt points to (EU Art. 71 database when live; UK ATRS; AIUC-1 certificate ids; OVERT profile ids).
- **Verifier** is anyone with the public key and the log — no account, no network required.

Assurance ties directly to OVERT's AAL-1…4 so nothing is re-invented: level 1 self-declared, 2 operator records, 3 operator-hosted notary, 4 independent notary + assessor. The addition is a **certificate-to-receipt link**: a quarterly certificate (AIUC-1, ISO 42001) becomes checkable against per-call evidence — "you said control A006 exists; show me it ran on the calls that mattered".

### 3.4 What each party can now ask, and get

| Party | Question | Answered by |
|---|---|---|
| Buyer / deployer | Which model and system-prompt hash served this call? Did the certified control run? Can I keep six months of evidence without holding content? | stages 1, 3, 4, 6 |
| End user | Was I talking to an AI, run by whom? What did I authorise, and did the agent stay inside it? Where is the explanation this exact interaction owes me (Art. 86, SB 26-189)? Can I prove my session was deleted? | stages 1, 2, 5, 6 (`explain_ref`, `retention`) |
| Regulator | Is the vendor's marketing claim traceable to production runs (FTC substantiation)? Was the log altered after the incident? Can I inspect without trade secrets (Art. 78)? | stages 3, 4, 6; SD-JWT disclosure |
| Civil society | Is this system in a public register, and does the receipt say so? Can an independent auditor verify a sample without the vendor's cooperation? Is there a complaint channel keyed to the receipt id? | stage 6 (`registry`, `complaint_ref`); assessor role |
| Seller / vendor | Can I prove controls ran without exposing prompts or weights? Does the receipt lower my premium and liability? Is human intent separated from my agent's identity so I am not liable for what I never authorised? | content-free by design; `mandate` separates the human from the agent; insurers (AIUC, Armilla/Lloyd's, Munich Re) already price on audits — receipts are the next step |

## 4. What it improves on

**The AiGovOps Foundation.** Beacon already signs Ed25519 over JCS with an append-only Merkle log and an offline `VERIFY.md`; Umbrella already compiles law to UCIDs and binds receipts to controls; Lantern already reads them. What the Foundation lacks is the *shape*: its receipt is its own, not a SCITT statement; it has no `principal`/`mandate`, no interface profiles, no certificate link, and no registry pointers. Adopting One Receipt means Beacon emits a SCITT-profiled envelope, Lantern's verify page becomes the reference verifier, the 100-case corpus becomes the test-vector set (each case's plain-words gate as the `policy` fixture), and the practitioner ladder maps rung-for-rung: a 100 reads a receipt, a 200 emits one from CI, a 300 runs a notary with holds, a 400 verifies a stranger's receipt offline. The Foundation's own rule stands: it issues no standard; it contributes this upstream and implements it first.

**Glacis / OVERT.** OVERT is the best-specified per-decision receipt in the field and this proposal keeps its domains and AALs intact. It improves on it in four ways OVERT's own crosswalks leave open: (1) a SCITT profile so any transparency service can hold OVERT receipts, not only Glacis's notary; (2) OTel, C2PA and AP2 mappings; (3) explicit human-mandate and disclosure fields (OVERT scopes out truthfulness and user-facing obligations); (4) a governance separation — today the OVERT steward sells the runtime and would qualify the assessors, and no assessor or IAP is registered fourteen months after 1.0. The ask to Glacis is unchanged from May: sign the Beacon profile; co-author the SCITT profile; let the community's 400s form the first verification pool.

**AIUC-1 and the insurance track.** AIUC-1 is the strongest *periodic* certification — audited, adversarially re-tested quarterly, priced into cover — and its 120-member consortium (UiPath among the founding contributors) is the widest industry table. Its limits are structural: a certificate says the agent passed last quarter, not that control A006 ran on this call; the standard's editor also accredits auditors and underwrites the policy. One Receipt gives AIUC-1 what it cannot produce itself — per-call evidence that a certified control executed — and gives insurers a loss-adjustment artefact. The ask: an AIUC-1 requirement that certified agents emit receipts, and a control-id vocabulary shared with OVERT.

## 5. Standards path and governance

1. **IETF SCITT** — an Internet-Draft "AI Transaction Statement Profile" (the six stages as a CBOR map; RFC 9942 receipts). Co-authors sought from Glacis, Microsoft (SCITT editors), and one payments network.
2. **OVERT** — a registered profile `one-receipt.v1` under Agentic-Extended scope; Beacon's `aigovops-beacon.v1` conforms to it.
3. **OpenTelemetry** — a mapping table `gen_ai.*` ↔ receipt fields, submitted to the semantic-conventions-genai repo.
4. **C2PA** — an assertion type carrying the receipt id, so a signed file points back to the session.
5. **AP2 / Mastercard Verifiable Intent** — the `mandate` slot accepts their credentials unchanged.
6. **NIST AI Agent Standards Initiative / NCCoE** — the interface-profile matrix as a public-interest use-case submission; **ITU FG-TIDA** (Nov 2026) for the identity binding.
7. **EU** — feed the six-month retention and content-free pattern into the prEN 18229-1 (Art. 12 logging) enquiry; propose the receipt id as the Art. 73 incident anchor.

Governance: a multi-stakeholder working group with a seat each for sellers, buyers, users, regulators (observer) and civil society; a rule that no member sells the notary or assessor service for a system it operates; royalty-free IPR (the OVERT covenant pattern); test vectors and reference verifier in the open.

## 6. Ninety days for the Foundation

- **Weeks 1–3:** the SCITT profile draft and test vectors from ten corpus cases; Beacon emits `one-receipt.v1` behind a flag.
- **Weeks 4–6:** Lantern verify page reads it; the café's Wren Card shows a receipt id; interface profiles for chat, API and IDE shipped in the 200 worksheet.
- **Weeks 7–9:** the Glacis ask; the AIUC-1 contribution; the NIST submission; a Thursday devoted to a stranger verifying a receipt offline.
- **Weeks 10–13:** first external verification by a 400; the joint story; v0.2 of this paper with what broke.

## 7. Risks and open questions

Salted commitments are the privacy floor, but a hash cannot explain — `explain_ref` must be honoured or Art. 86 is unmet. Receipts for every token of a streaming voice session need a batching rule. On-device and TEE evidence is environment-level, not answer-level; the paper does not claim otherwise. zkML proof-of-inference (Lagrange DeepProve, EZKL) is not viable per request at frontier scale in 2026. Adoption will follow procurement clauses and insurance premiums, not goodwill — the EU model contractual clauses (MCC-AI, Mar 2025) and AIUC pricing are the levers. And the Foundation must not become the thing it warns against: it implements and teaches; it does not grade its own receipts.

## 8. Decisions for Ken and Bob

1. Name: **One Receipt** (working) — yes/no.
2. Send the Glacis ask now with §4 attached, or after the SCITT draft exists.
3. Whether the Foundation proposes the working group or asks the Agentic AI Foundation (Linux Foundation) to host it.
4. Which ten corpus cases become the first test vectors.

## 9. Sources

Full, dated, per-claim sources are in `research/2026-09-13-standards-landscape.md` and `research/2026-09-13-transactions-and-stakeholders.md`. Selected: OVERT 1.1 standard, conformance and crosswalks (overt.is); Glacis docs and verifier (docs.glacis.io, verify.glacis.io); GeekWire on Glacis (7 Apr 2026); AIUC-1 site and changelog (aiuc-1.com); UiPath AIUC-1 announcements (19 Nov 2025; 9 Mar 2026); RFC 9943, RFC 9942, RFC 9901, RFC 9421; draft-klrc-aiagent-auth-03; draft-meunier-web-bot-auth-architecture-05; Regulation (EU) 2026/1744 and law-firm summaries (White & Case, Orrick, Gibson Dunn); AI Act Explorer Arts 12, 14, 50, 71, 73, 78, 86; Commission Transparency Code (10 Jun 2026) and Guidelines (20 Jul 2026); KLA JTC 21 tracker (prEN 18229-1); C2PA 2.3 spec; IPTC 2025.1; Google AP2 announcement; Visa Trusted Agent Protocol; Mastercard Verifiable Intent (PYMNTS, 5 Mar 2026); OpenAI ACP delegated payment spec; Cloudflare Web Bot Auth; Linux Foundation AAIF and A2A releases; MCP spec 2026-07-28; OpenTelemetry semconv 1.41/1.42; CSA AICM v1.1; MITRE ATLAS v2026.08; OWASP Agentic Top 10 (2026); NIST AI Agent Standards Initiative; NCCoE agent identity concept paper; ITU FG-TIDA; NY State Comptroller audit of Local Law 144 (2 Dec 2025); Colorado SB 26-189; Korea AI Basic Act (Cooley); China labelling measures (China Law Translate); Ada Lovelace *Code & Conduct*; Apple PCC expansion (8 Jun 2026); Lagrange DeepProve-1; Attested Intelligence AGA.
