# Research memo 1 — the global AI-governance standards landscape (13 September 2026)

*Briefing for the One Receipt whitepaper. Every dated claim carries a source. Items that could not be confirmed are marked "unverified". Researched with web search on 13 September 2026 by Claude for Bob Rapp.*

## 1. Management & risk standards

| Standard | Steward | Current version / status (verified) | What it standardises | Not covered | Receipt-protocol hook |
|---|---|---|---|---|---|
| ISO/IEC 42001 | ISO/IEC JTC 1/SC 42 | 42001:2023 published; still edition 1 (https://www.iso.org/standard/42001). A CEN "EN ISO/IEC 42001:2026" listing exists (https://standards.iteh.ai/catalog/standards/cen/adc675e8-4669-4965-b4c1-c8f724832217/en-iso-iec-42001-2026) — European adoption, content unverified | AI management system (AIMS): policy, roles, risk, impact assessment, lifecycle controls (Annex A) | Runtime evidence; per-transaction logging format; cross-org verification | Receipts are the evidence an AIMS auditor asks for under A.6/A.8 controls |
| ISO/IEC 42005:2025 | SC 42 | Published 2025 (https://www.iso.org/standard/42005) | AI system impact assessment process | Nothing machine-readable; no runtime | Impact-assessment id referenced in the receipt |
| ISO/IEC 42006:2025 | SC 42 / CASCO | Published July 2025, ed. 1 (https://www.iso.org/standard/42006) | Requirements for bodies auditing/certifying AIMS (supplements 17021-1) | Product/system certification | Defines the accredited third parties who could act as receipt auditors |
| ISO/IEC 23894, 5338 | SC 42 | 23894:2023 (risk guidance) and 5338:2023 (AI lifecycle) per https://www.iso.org/sectors/it-technologies/ai; no 2026 revisions found | Risk guidance (ISO 31000 lens); lifecycle process model | Formats, receipts | Lifecycle stage vocabulary for a receipt "phase" field |
| NIST AI RMF 1.0 + AI 600-1 | NIST | RMF 1.0 (Jan 2023) and GenAI Profile AI 600-1 (July 2024) remain current; no "RMF 2.0" (https://www.ispartnersllc.com/blog/nist-ai-rmf-2025-2026-updates-what-you-need-to-know-about-the-latest-framework-changes/) | Govern/Map/Measure/Manage; GenAI risk list and actions | Not auditable; no evidence format | MEASURE/MANAGE map to attest/incident stages |
| NIST Cyber AI Profile + COSAiS | NIST | Preliminary draft CSF 2.0 AI Profile 16 Dec 2025, comments to 30 Jan 2026; SP 800-53 "Control Overlays for Securing AI Systems" in development (https://www.globalpolicywatch.com/2026/01/nist-publishes-preliminary-draft-of-cybersecurity-framework-profile-for-artificial-intelligence-for-public-comment/; https://csrc.nist.gov/Projects/cosais/publications) | Secure/Defend/Thwart focus areas over CSF functions | Draft | Control ids for a receipt "controls evaluated" field |
| NIST AI Agent Standards Initiative | NIST / CAISI | Launched 17 Feb 2026; CAISI RFI on agent security closed 9 Mar 2026; three workstreams (https://www.nist.gov/artificial-intelligence/ai-agent-standards-initiative) | Convening, gap analysis | No spec yet | Likely venue for a receipt profile |
| NCCoE Software & AI Agent Identity and Authorization | NIST NCCoE | Concept paper Feb 2026; comments closed 2 Apr 2026; "reviewing comments", no build started (https://www.nccoe.nist.gov/projects/software-and-ai-agent-identity-and-authorization) | Applying identity standards to enterprise agents | Not a standard | Identity-stage reference implementation |
| CSA AI Controls Matrix | Cloud Security Alliance | AICM v1.1, 26 June 2026: 247 controls, 18 domains (new Model Security domain), AI-CAIQ v1.1 (320 questions), mappings to ISO 42001, NIST AI RMF/600-1, EU AI Act, AIUC-1 (https://virtualizationreview.com/articles/2026/06/26/cloud-security-ai-controls-matrix-turns-ai-governance-into-assessment-framework.aspx) | Shared-responsibility control set | Runtime evidence | Control ids as receipt vocabulary |
| MITRE ATLAS | MITRE | v2026.08 (1 Sep 2026): 16 tactics, 114 techniques, 83 sub-techniques, 39 mitigations, 72 case studies; 18 new autonomous-agent techniques (https://github.com/mitre-atlas/atlas-data/releases) | Adversary TTP taxonomy | Controls/evidence | ATLAS technique ids in incident records |
| OWASP GenAI Security Project | OWASP | Top 10 for Agentic Applications 2026 (9 Dec 2025); GenAI LLM Top 10 2026 (3 Aug 2026) (https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/; https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) | Risk lists | No format | Risk tags for the policy stage |

## 2. Regulation

EU AI Act (Reg. 2024/1689) as amended by the Digital Omnibus on AI, Regulation (EU) 2026/1744, OJ 24 July 2026, in force 27 July 2026 (https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act); political agreement 6 May, Council 13 May 2026 (https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/); Council final green light 29 Jun 2026 (https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/); Orrick's eight changes (https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes).

| Obligation | Date |
|---|---|
| Annex III stand-alone high-risk (Arts 9–15, 17, 72, 73) | 2 Dec 2027 (was 2 Aug 2026) |
| Annex I embedded high-risk | 2 Aug 2028 |
| Art. 50 transparency (chatbot disclosure, deepfake labels) | 2 Aug 2026, unchanged |
| Art. 50(2) machine-readable marking for systems on the market before 2 Aug 2026 | grace to 2 Dec 2026 |
| New Art. 5 prohibitions (NCII/CSAM generators) | 2 Dec 2026 |
| GPAI obligations / AI Office enforcement | in force 2 Aug 2025; enforcement from 2 Aug 2026; legacy models by 2 Aug 2027 (https://artificialintelligenceact.eu/code-of-practice-overview/) |

- Art. 12 record-keeping: automatic event logging over the lifetime; for Annex III 1(a) biometrics the minimum log is period of use, reference database, matching input data, identity of verifying persons (https://artificialintelligenceact.eu/article/12/). Harmonised standard prEN 18229-1 (Logging) at Enquiry; EN 18286 (QMS) at Formal Vote; JTC 21 targeted Q4 2026; M/613 deadline 28 Feb 2027 (https://kla.digital/blog/jtc-21-standards-tracker).
- Art. 13/14 (transparency to deployers; human oversight): prEN 18229-2/-3 drafting (https://artificialintelligenceact.eu/article/14/).
- Art. 50: Commission Guidelines 20 July 2026; Code of Practice on Transparency of AI-generated Content finalised 10 June 2026, ~190 signatories; the "standard solution" is signed metadata plus imperceptible watermarking; agents must disclose artificial nature and on whose behalf they act (https://www.faegredrinker.com/en/insights/publications/2026/7/eu-ai-act-commission-confirms-transparency-code-of-practice-as-adequate-and-publishes-final-version-of-its-guidelines-on-transparency-obligations; https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content).
- Art. 72/73: 15/10/2-day deadlines (https://artificialintelligenceact.eu/article/73/); draft guidance + template consulted to 7 Nov 2025; final high-risk guidance unverified; GPAI systemic-risk incident template 4 Nov 2025 (https://digital-strategy.ec.europa.eu/en/library/ai-act-commission-publishes-reporting-template-serious-incidents-involving-general-purpose-ai).
- GPAI Code of Practice: 10 July 2025, three chapters (https://artificialintelligenceact.eu/code-of-practice-overview/).

United States. Colorado: federal order 27 Apr 2026 blocked SB 24-205; SB 26-189 signed 14 May 2026, notice-based regime effective 1 Jan 2027 (https://www.mcdermottlaw.com/insights/colorado-ai-law-in-flux-comprehensive-replacement-bill-signed-after-federal-court-blocks-predecessors-enforcement/). California: SB 53 and AB 2013 effective 1 Jan 2026; SB 942 AI Transparency Act effective 2 Aug 2026 after AB 853; CPPA ADMT rules 1 Jan 2026 / 1 Jan 2027 (https://secureprivacy.ai/blog/california-ai-transparency-law). Federal: CISA/NSA/Five Eyes agentic-AI guidance 1 May 2026; CAISI pre-deployment agreements 5 May 2026 (https://labs.cloudsecurityalliance.org/research/csa-research-note-agentic-ai-governance-cisa-nist-caisi-2026/).

United Kingdom. No AI Act; King's Speech 13 May 2026 (Regulating for Growth Bill; Police Reform Bill); Crime and Policing Act 2026; ICO AI-cyber guidance May 2026; autumn 2026 taskforce report on labelling promised (https://www.osborneclarke.com/insights/regulatory-outlook-may-2026-artificial-intelligence; https://www.twobirds.com/en/insights/2026/ai-in-the-kings-speech-2026-regulating-for-growth-bill-announced); DSIT Trusted Third-Party AI Assurance Roadmap (Sept 2025) (https://www.burges-salmon.com/articles/102l5fo/trusted-third-party-ai-assurance-dsit-roadmap/).

Singapore. IMDA Model AI Governance Framework for Agentic AI (Jan 2026, updated May 2026); AI TAP planned Q3 2026; ISO/IEC 42119-8 proposed Apr 2026; MAS MindForge Mar 2026 (https://www.mayerbrown.com/en/insights/publications/2026/07/ai-regulation-in-singapore-and-hong-kong-a-mid-year-checkpoint); Project Moonshot / AI Verify continue (https://www.imda.gov.sg/resources/blog/blog-articles/2026/02/redefining-ai-safety).

Japan. AI Promotion Act in force 4 June 2025; AI Basic Plan 14 July 2026; Guidelines for Business v1.2 (31 Mar 2026); AISI Evaluation Guide v1.20 (7 Jul 2026) (https://vorplabs.com/ai-regulatory-updates/japan/2026-07/ai-promotion-act-basic-plan-business-guidance).

Korea. AI Basic Act effective 22 Jan 2026: high-impact duties, generative notice and labelling, fines ≤ KRW 30M, ≥1-year grace (https://www.cooley.com/news/insight/2026/2026-01-27-south-koreas-ai-basic-act-overview-and-key-takeaways).

China. Labeling Measures effective 1 Sep 2025: explicit labels plus implicit metadata (content attribute, provider name/code, content reference number); GB 45438-2025 (https://www.chinalawtranslate.com/en/ai-labeling/; https://www.loeb.com/en/insights/publications/2025/03/chinas-ai-labeling-measures-and-mandatory-national-standards-take-effect-september-1). The only regime mandating a per-output reference number.

## 3. Provenance & content

| Item | Status | Gap for session receipts |
|---|---|---|
| C2PA Content Credentials 2.3 (spec 5 Jan 2026; launch 9 Feb 2026): live video, plain text, richer edit actions; Conformance Program; ">6,000 members and affiliates" (https://c2pa.org/the-c2pa-launches-content-credentials-2-3-and-celebrates-5-years-of-impact-across-the-digital-ecosystem/; https://spec.c2pa.org/specifications/specifications/2.3/specs/_attachments/C2PA_Specification.pdf) | Published, adopted | Binds assertions to an asset, not the session/API call; no human principal; stripped by platforms (https://arxiv.org/html/2604.24890v1) |
| IPTC Photo Metadata 2025.1 (27 Nov 2025): AI System Used/Version, AI Prompt Information, AI Prompt Writer Name; adding IPTC fields can invalidate C2PA manifests (https://iptc.org/news/iptc-photo-metadata-standard-2025-1-adds-ai-properties/) | Published | Images only; no signature |
| W3C PROV-O (Rec. 2013) (https://www.w3.org/TR/prov-o/) | Stable | Good vocabulary; no signing/transport |
| SynthID (Google) text watermark open-sourced; detector portal (https://synthid-detector.com/) | Proprietary per vendor | Detects; does not attest who/why |
| EU Transparency Code (10 Jun 2026) + Art. 50 Guidelines (20 Jul 2026) | Published, voluntary/safe harbour | Requires marking, not verifiable session linkage |
| D&TA Data Provenance Standards v1.0.0 (9 Jul 2024) → OASIS DPS TC (https://www.dtaalliance.org/news/announcing-the-data-provenance-standards-v1-0-0; https://www.oasis-open.org/tc-dps/) | Committee | Training data, not runtime |

## 4. Identity & authorization

- W3C VC 2.0 Recommendation 15 May 2025 (https://www.w3.org/press-releases/2025/verifiable-credentials-2-0/); VC WG charter Mar 2026–Mar 2028 (VCDM 2.1 expected Apr 2027) (https://w3c.github.io/vc-charter-2026/); DID 1.1 Candidate Recommendation 5 Mar 2026 (https://w3.org/news/2026/w3c-invites-implementations-of-decentralized-identifiers-dids-v1-1/). Nothing agent-specific.
- IETF: draft-klrc-aiagent-auth-03 (6 Jul 2026; Kasselman, Lombardo, Rosomakho, Campbell, Steele, Parecki) composing WIMSE, SPIFFE, OAuth 2.0, Transaction Tokens, CIBA, HTTP Message Signatures, Shared Signals (https://datatracker.ietf.org/doc/draft-klrc-aiagent-auth/); draft-oauth-transaction-tokens-for-agents-04; draft-ni-wimse-ai-agent-identity-02. WG adoption status unverified.
- OpenID Foundation AIIM CG (chartered Apr 2025): whitepaper Oct 2025; flags the gap "how to assert the identity of the LLM and/or agent to external servers" (https://openid.net/cg/artificial-intelligence-identity-management-community-group/).
- ITU-T FG-TIDA (Trust and Identity for Humans and Agentic AI), under SG17, announced 9 Jul 2026; first meeting Paris Nov 2026, second Geneva Jan 2027 (https://www.itu.int/en/mediacentre/Pages/PR-2026-07-09-focus-group-agentic-AI.aspx).
- CoSAI (OASIS): MCP Security Taxonomy (27 Jan 2026); agentic identity research and Open Delegation & Identity Standard (ODIS) workstream (6 May 2026) (https://www.coalitionforsecureai.org/coalition-for-secure-ai-unveils-new-agentic-identity-and-security-research-following-high-profile-sessions-at-rsac-2026/).
- Vendors: Auth0/Okta agent identity (https://www.okta.com/newsroom/press-releases/auth0-platform-innovation/); Workday "Agent Passport" (2 Jun 2026) — a product, not a standard (https://newsroom.workday.com/2026-06-02-Workday-Launches-Agent-Passport-to-Test,-Verify,-and-Continuously-Monitor-Every-AI-Agent-in-the-Enterprise). SPIFFE/SPIRE has no agent-specific spec.

## 5. Transparency logs & attestations

- RFC 9943 SCITT Architecture — Proposed Standard, June 2026: Transparency Service, Signed Statements (COSE_Sign1), Registration Policy, Receipts (https://www.rfc-editor.org/rfc/rfc9943.html). RFC 9942 COSE Receipts — June 2026 (https://www.rfc-editor.org/rfc/rfc9942.html). SCRAPI draft-ietf-scitt-scrapi-11 in the RFC Editor queue (https://datatracker.ietf.org/doc/draft-ietf-scitt-scrapi/). RFC 9162 CT v2 lineage.
- Sigstore Rekor v2 GA 10 Oct 2025 (https://blog.sigstore.dev/rekor-v2-ga/); OpenSSF Model Signing v1.0 (Apr 2025); SLSA v1.2 (24 Nov 2025), no AI track (https://slsa.dev/blog).
- OVERT 1.1 (Glacis): v1.1 published 11 June 2026, identifier overt.is/1.1, royalty-free patent covenant (https://overt.is/; https://overt.is/ipr-policy). Six domains GOVERN, IDENTIFY, PROTECT, ATTEST, MEASURE, RESPOND; AAL-1 self-asserted docs → AAL-2 operator records → AAL-3 machine telemetry → AAL-4 independently signed proofs, zero content access; IAP structurally independent, 72-hour incident disclosure (https://overt.is/OVERT_v1.1_STANDARD.pdf). Conformance: four maturity levels (Foundation, Enforcement, Measurement, Evidence-Grade), scope Core / Agentic / Agentic-Extended, SD- self-declared profiles valid only to Level 2, Qualified OVERT Assessor mandatory at Level 4, assessor registry maintained by Glacis; no IAPs or assessors named (https://www.overt.is/OVERT_1.1_Conformance.pdf). Crosswalks: NIST AI RMF/600-1, ISO 42001, EU AI Act, AIUC-1, OWASP Agentic, SP 800-53/FedRAMP, OMB M-25-21/22, DASF 3.0, IMDRF N93, CHAI; MCP-1..3; no SCITT, C2PA or OpenTelemetry mapping (https://www.overt.is/OVERT_1.1_Crosswalks.pdf). Normative refs include RFC 9334 RATS and RFC 6962. Out of scope: training, data lifecycle, output truthfulness, infra security, legal guarantees.
- Glacis (GeekWire 7 Apr 2026): Joe Braidwood CEO, Dr Jennifer Shannon CMO, Rohit Tatachar co-founder/CTO from Microsoft Foundry; $575k raised; 5 staff; Arbiter, Witness Network, auto-redteam; two healthcare pilots (https://www.geekwire.com/2026/seattle-startup-glacis-brings-longtime-microsoft-leader-aboard-to-target-ais-biggest-blind-spot/). Docs: receipts signed and chained, hashes/line-ranges not content, offline-verifiable; runtime "OVERT Level 1 Core / AAL-3" (https://docs.glacis.io/). Independent adoption of OVERT beyond Glacis: none found.

## 6. Telemetry & interoperability

- OpenTelemetry GenAI semconv still "Development": v1.41.0 (28 Apr 2026) streaming metrics/agent operation types; v1.42.0 (12 Jun 2026) split into open-telemetry/semantic-conventions-genai; MCP conventions merged; gen_ai.system → gen_ai.provider.name (https://dev.to/azena-ai/opentelemetrys-genai-semantic-conventions-are-not-stable-yet-heres-what-actually-shipped-in-2026-3mke).
- MCP donated to the Linux Foundation Agentic AI Foundation (AAIF), formed 9 Dec 2025 with MCP, goose, AGENTS.md; platinum members AWS, Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, OpenAI (https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation). Spec 2026-07-28: stateless transport (no Mcp-Session-Id), RFC 9207 issuer validation, Client ID Metadata Documents, Tasks extension (https://blog.modelcontextprotocol.io/posts/2026-07-28/).
- A2A v1.0 stable (Mar/Apr 2026), signed Agent Cards; 150+ orgs; joined AAIF 17 Aug 2026; authorization out of scope (https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year).
- AGNTCY (Cisco) donated to LF July 2025 (https://www.theregister.com/2025/07/30/agntcy_lf_donation/). W3C AI Agent Protocol CG (May 2025), no standards-track output (https://github.com/w3c-cg/ai-agent-protocol).
- IETF AIPREF: draft-ietf-aipref-vocab-07 (19 Aug 2026) and draft-ietf-aipref-attach (Content-Usage header; robots.txt content-usage) (https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/). llms.txt: no body, no confirmed consumption.

## 7. Supply chain & BOMs

CycloneDX 1.7 (21 Oct 2025; ECMA-424; ML-BOM) (https://cyclonedx.org/specification/overview/); SPDX 3.0.1 AI and Dataset profiles (https://spdx.github.io/spdx-spec/v3.0.1/model/AI/AI/); ISO/IEC DIS 5962 vote closed 9 Jun 2026 (https://www.iso.org/standard/93810.html); Hugging Face model cards; Anthropic system cards (https://www.anthropic.com/system-cards). "AI nutrition labels" — no standard found. BOMs describe the artefact, not the transaction.

## 8. Incident registries

OECD AI Incidents Monitor and the Feb 2025 common reporting framework (https://www.oecd.org/en/publications/towards-a-common-reporting-framework-for-ai-incidents_f326d4ac-en.html); AI Incident Database; AIAAIC; MIT AI Incident Tracker June 2026 update (https://airisk.mit.edu/blog/ai-incident-tracker-june-2026-update). None accepts a machine-verifiable session reference.

## 9. Named groups

- "UP Path" / "UP-Path" / "UPPath" / "Unified Path" / "Universal Protocol": nothing credible exists as an AI-governance body. Hits resolve to UiPath (PATH; founding contributor to AIUC-1, 19 Nov 2025: https://ir.uipath.com/news/detail/418/uipath-becomes-founding-contributor-to-aiuc-1-joining-aiuc-in-promoting-security-standards-for-enterprise-ai-adoption), Google's Universal Commerce Protocol, UTCP, and an arXiv paper. Read as UiPath → AIUC-1.
- AIUC-1: insurance-backed agent standard (Orrick, Stanford, CSA, MIT, MITRE); UiPath certified (https://www.uipath.com/newsroom/uipath-achieves-aiuc-1-certification).
- Frontier Model Forum briefs: incident sharing (12 May 2026), agent security practices (3 Jun 2026) (https://www.frontiermodelforum.org/publications/). Partnership on AI Six AI Governance Priorities (11 Feb 2026) (https://partnershiponai.org/resource/six-ai-governance-priorities/). MLCommons AILuminate v1.1. ETSI EN 304 223 (May 2026) (https://www.etsi.org/enjoy-magazine/articles/ai-cybersecurity-standard-etsi-en-304-223/). IEEE 7001-2021; CertifAIEd (2022). ITU AI for Good Standards Exchange. Trustmarks: ISO 42001 certification bodies; Nemko AI Trust Mark. AI Alliance / DPGA 2026 activity unverified.

## 10. Gap analysis — what nobody covers for a stranger verifying one AI transaction end to end

1. No transaction identifier standard (only China's reference number; MCP removed session ids; OTel unsigned/unstable).
2. Identity split three ways (human / workload / agent-model) with no binding at call time.
3. Policy decisions asserted, not attested (only OVERT, single vendor, no IAPs; prEN 18229-1 at Enquiry).
4. Transparency logs (RFC 9943/9942) have no AI statement profile; OVERT does not reference SCITT; Rekor v2 dropped attestation storage.
5. Content provenance asset-bound, not session-bound; text/voice/code carry nothing.
6. Audit rights stop at the organisation; no "verify offline with a public key" norm.
7. Incident linkage manual — no registry takes a receipt hash.
8. Interface coverage uneven — voice, IDE, on-device, browser extension, A2A.

The protocol therefore needs: a session/transaction id and receipt schema profiled as a SCITT Signed Statement (COSE) with an RFC 9942 receipt; a binding claim set (human VC/OIDC subject, agent SPIFFE/DID, model hash/BOM ref, policy-decision hash, C2PA manifest hash); a registration policy per interface; and an incident record that cites the receipt.
