# Research memo 2 — AIUC-1, Glacis, agentic-commerce receipts, stakeholder needs, prior art, privacy (13 September 2026)

*Companion to memo 1. Items that could not be confirmed are marked "unverified". Researched with web search on 13 September 2026 by Claude for Bob Rapp.*

## A. AIUC-1

- Publisher: Artificial Intelligence Underwriting Company (San Francisco; founder Rune Kvist, ex-Anthropic; $15M seed led by Nat Friedman) (https://agentmarketcap.ai/blog/2026/04/15/ai-agent-error-insurance-lloyds-aig-beazley-hallucination-liability). Developed with Orrick, MITRE, CSA, Stanford, MIT (https://ir.uipath.com/news/detail/418/uipath-becomes-founding-contributor-to-aiuc-1-joining-aiuc-in-promoting-security-standards-for-enterprise-ai-adoption).
- Versions: launch 22 July 2025; quarterly releases 1 Oct 2025, 15 Jan 2026 (voice-agent controls), 15 Apr 2026, 15 Jul 2026 (current; next 15 Oct 2026); July 2026 added coding-agent requirements A008 (secrets leakage) and B010 (secure generated code) (https://www.aiuc-1.com/changelog).
- Domains: six — Data & Privacy, Security, Safety, Reliability, Accountability, Society (https://www.aiuc-1.com/; https://www.tevora.com/resource/what-is-aiuc-1-a-guide-to-the-newest-ai-compliance-framework/; https://mindgard.ai/blog/aiuc-1-explained). 51 requirements / 130 controls (65 mandatory) per one secondary source — unverified (https://vettedaiagents.com/aiuc-1/).
- Audit model: accredited third-party audit (Schellman first) plus adversarial testing across thousands of scenarios, re-run at least quarterly; certificates valid 12 months but lapse without quarterly re-testing; 5–10 weeks to certify (https://www.uipath.com/newsroom/uipath-achieves-aiuc-1-certification).
- Insurance: framework + audits + liability cover priced off audit results; AIUC as MGA with carriers such as Beazley; limits unpublished.
- Certified: Intercom Fin (Dec 2025), UiPath (9 Mar 2026), and per aiuc-1.com KPMG, Cursor, Harvey, ElevenLabs.
- Governance: 120+ member consortium (Stanford, Microsoft, Google Cloud, Meta, Anthropic, Databricks, IBM, Salesforce, Fidelity, Visa, 100+ Fortune-500 CISOs); 200+ peer-review comments per cycle; technical contributors MITRE, Cisco, ElevenLabs, UiPath, OWASP; no published charter, voting rule or independent steering body — AIUC is sole editor (unverified beyond the site).
- Fees: unpublished; "aimed at large-scale businesses".
- Criticism: vertical integration / issuer-pays — AIUC writes the standard, accredits auditors, underwrites (https://mindgard.ai/blog/aiuc-1-explained). No academic or civil-society critique found.
- Relation: ISO 42001 certifies the organisation's management system; AIUC-1 certifies a specific deployed agent by behaviour testing; both crosswalk to ISO 42001 / NIST / EU AI Act; neither AIUC-1 nor OVERT references the other (unverified). AIUC-1 = periodic certificate; OVERT AAL-3/4 = per-decision signed receipt. Complementary layers.
- "UP Path" = UiPath: founding contributor (Nov 2025) and first enterprise-automation platform certified (Mar 2026).

## B. Glacis

- Company: Seattle; Joe Braidwood CEO, Dr Jennifer Shannon CMO, Rohit Tatachar co-founder/CTO (Apr 2026); $575k pre-seed (Safe AI Fund, Mighty Capital, Sourdough, AI2 Incubator), Cloudflare Launchpad, Plug and Play Seattle; two healthcare pilots; seed targeted later 2026, no close announced (unverified); pricing $49/mo starter, $499/mo pro (https://www.geekwire.com/2026/seattle-startup-glacis-brings-longtime-microsoft-leader-aboard-to-target-ais-biggest-blind-spot/). "Glacis Labs" ($6.8M, July 2026) is an unrelated crypto company.
- Naming: GeekWire says Arbiter + Witness Network; current docs say governance proxy, Notary, Dashboard; the verifier page mentions "two internal arbiters: a network proxy and an endpoint guard (Pulse)" (https://docs.glacis.io/runtime/; https://verify.glacis.io/). No public Witness Network docs (unverified).
- Receipt format glacis.receipt.v1: Ed25519 over RFC 8785 JCS canonical JSON; SHA-256 of input/output; attestation_hash; key fingerprints; "every field is a hash, a counter, a key, or a label"; line-ranges not text; RFC 6962-shaped Merkle log with inclusion proof, signed checkpoint, consistency proof; `pip install glacis && python -m glacis verify receipt.json`, offline, cross-runtime Rust/TS/Python; offline-only receipts labelled UNVERIFIED for third parties (AAL-3 max); SDK v0.8.0 (24 Mar 2026), Apache-2.0, fields attestation_id, timestamp, service_id, operation type, input/output hashes, control-plane results, signature (https://docs.glacis.io/verify/; https://docs.glacis.io/overt/conformance-ladder/; https://github.com/Glacis-io/glacis-python).
- Assurance: AAL-1 self-attestation → AAL-2 live enforcement → AAL-3 signed, chained, operator-hosted notary → AAL-4 notary outside the operator's trust boundary plus a qualified, structurally independent assessor; Glacis's own bundle is AAL-3 and "must not be represented as AAL-4".
- Qualified assessor / IAP registry: defined in OVERT 1.1 Part V §22; no public registry or named assessor (unverified).
- Partners: nVoq, PACT AI (founding member, 26 Aug 2026), DiMe, CHAI, ScaleHealth, EisnerAmper, Cloudflare (https://www.glacis.io/). Nature of CHAI/DiMe relationships unverified.
- Criticism: none public. Structural: the OVERT steward sells the runtime and would qualify assessors.
- Competing signed per-inference records: Attested Intelligence "AGA" (Ed25519/ML-DSA-65 hybrid, hash-linked receipts, offline bundles, TS/Go/Python, live verifier) (https://attestedintelligence.com/); Pangea Secure Audit Log (tamper-evident Merkle log, not a caller-held receipt) (https://pangea.cloud/docs/audit/overview/about). Credo AI, Holistic AI, Vera, Arthur, Fiddler, WitnessAI, Lakera, Guardrails AI, Cranium, Vijil, Zenity: no public per-inference signed receipts found (unverified individually).

## C. Agentic commerce protocols

| Protocol | Status / date | What is signed | Human intent binding | Verifiable later | Source |
|---|---|---|---|---|---|
| Google AP2 | Open spec 16 Sep 2025; 60+ partners; A2A x402 extension | Intent, Cart, Payment Mandates as Verifiable Credentials | Human-present: user signs Cart Mandate; human-not-present: pre-signed Intent Mandate with limits | Non-repudiable intent→cart→payment chain | https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol |
| Visa Trusted Agent Protocol | 14 Oct 2025 with Cloudflare; Microsoft, Shopify, Stripe, Adyen, Worldpay; open GitHub | RFC 9421 HTTP Message Signatures (timestamp, session id, keyid, alg) bound to domain and operation | Weak — agent-asserted intent; no user-signed mandate | Agent legitimacy, replay prevention | https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html; https://github.com/visa/trusted-agent-protocol |
| Mastercard Agent Pay / Verifiable Intent | Agent Pay live; Verifiable Intent open standard announced 5 Mar 2026 with Google, Fiserv, IBM, Checkout.com | Tamper-resistant record linking consumer identity, instructions, outcome; selective disclosure | Explicit consent before action; agent registration | Authorization validity, adherence, outcome | https://www.pymnts.com/mastercard/2026/mastercard-unveils-open-standard-to-verify-ai-agent-transactions/ |
| OpenAI/Stripe ACP Delegated Payment | API 2025-09-29; live in ChatGPT Instant Checkout | Single-use vault token with allowance {max_amount, expires_at, merchant_id, checkout_session_id}; Signature, Timestamp, Idempotency-Key | Consent only via checkout_session_id — no user-signed artifact | Authenticity, freshness, idempotency, allowance | https://developers.openai.com/commerce/specs/payment |
| Shopify/Google UCP | 11 Jan 2026; Etsy, Target, Walmart, Wayfair | Capabilities only; no signed receipt | Not addressed | Not addressed | https://shopify.engineering/UCP |
| PayPal Agentic Commerce Services | 28 Oct 2025 | Not published (unverified) | — | — | https://newsroom.paypal-corp.com/2025-10-28-PayPal-Launches-Agentic-Commerce-Services-to-Power-AI-Driven-Shopping |
| Cloudflare Web Bot Auth | In Verified Bots since 1 Jul 2025; IETF WG; draft-meunier-web-bot-auth-architecture-05 (2 Mar 2026) | RFC 9421 signature over @authority/@target-uri; key directory at .well-known | Explicitly must NOT bind a human — keys represent a role/company/automation | Bot/operator identity only | https://blog.cloudflare.com/verified-bots-with-cryptography/; https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture |

Only AP2 (and Mastercard Verifiable Intent, once specified) produces a user-signed mandate; TAP / Web Bot Auth / ACP prove agent or session identity, not consent. None records what the model did between intent and cart.

## D. Stakeholder needs

1. Buyers/deployers. NYC Local Law 144: the NY State Comptroller (2 Dec 2025) found DCWP received only 2 complaints, took no enforcement action, and missed at least 17 potential violations among 32 employers checked (https://www.osc.ny.gov/state-agencies/audits/2025/12/02/enforcement-local-law-144-automated-employment-decision-tools). EU MCC-AI updated 5 Mar 2025: High-Risk and Light templates mirroring Chapter III (https://public-buyers-community.ec.europa.eu/communities/procurement-ai/resources/updated-eu-ai-model-contractual-clauses). AI Act Art. 26(6): deployers keep logs under their control ≥ 6 months, from 2 Dec 2027 for Annex III (https://www.legalithm.com/en/blog/eu-ai-act-log-retention-record-keeping-6-months). Need: per-call evidence that certified controls ran on their traffic.
2. End users. Art. 50 (from 2 Aug 2026) and Art. 86 right to a "clear and meaningful explanation of the role of the AI system and the main elements of the decision" (https://artificialintelligenceact.eu/article/86/). Colorado SB 26-189 (effective 1 Jan 2027): disclosure, post-adverse-decision explanation, correction, human review, 3-year records, AG enforcement (https://www.consumerfinancemonitor.com/2026/05/12/colorado-rewrites-its-landmark-ai-law-unpacking-sb-26-189-and-what-it-means-for-businesses/). Korea AI Basic Act (22 Jan 2026): advance notice, labelling, meaningful explanation. "Disclosure by Design" (Mar 2026): models' self-disclosure of AI identity collapses under role-play — an out-of-band verifiable receipt is needed (https://arxiv.org/pdf/2603.16874). No shipping "AI receipt for the user" beyond Glacis's verify page (unverified).
3. Regulators. FTC 6(b) orders 11 Sep 2025 to seven companion-chatbot makers (persona design, engagement features, monetisation, age-gating, testing/monitoring, sensitive-content handling, complaints); 44 state AGs letter 25 Aug 2025 (https://www.dlapiper.com/en-us/insights/publications/2025/09/ftc-ai-chatbots). Operation AI Comply orders centre on substantiation records (https://www.aipolicydesk.com/blog/ftc-ai-enforcement-actions-2026). Italy: Garante €15M OpenAI fine annulled by the Court of Rome 19 Mar 2026; DeepSeek blocked since Jan 2025. No regulator specifies a log format (unverified). Art. 78: authorities request only what is strictly necessary; protect source code and trade secrets (https://artificialintelligenceact.eu/article/78/).
4. Civil society. Ada Lovelace *Code & Conduct* (Jun 2024): data access is the greatest obstacle to audits; calls for mandated auditor access, auditor standards, public registers, challenge mechanisms (https://www.adalovelaceinstitute.org/report/code-conduct-ai/). EU Art. 71 database not yet publicly operational; Annex III registration due 2 Dec 2027; non-public section for law enforcement/migration (https://artificialintelligenceact.eu/article/71/). UK ATRS mandatory for central-government tools that significantly influence a decision or interact with the public (https://gov.uk/government/publications/algorithmic-transparency-recording-standard-mandatory-scope-and-exemptions-policy/algorithmic-transparency-recording-standard-atrs-mandatory-scope-and-exemptions-policy). AI Now, AJL, EFF, Access Now, AlgorithmWatch, Mozilla not individually fetched (unverified).
5. Sellers/vendors. Resistance grounded in Art. 78 confidentiality and Art. 86's "main elements" limit. Incentives: AIUC cover priced off audits; Armilla (Lloyd's coverholder, Chaucer, up to $25M, Apr 2025) covers hallucination, drift, data leakage; Munich Re aiSure (up to $15M per vendor) (https://www.armilla.ai/). Insurers publish no log format (unverified).

## E. Prior art — one receipt per interaction

| Proposal | Type | Status |
|---|---|---|
| Glacis/OVERT signed receipts | Industry | Shipping (AAL-3); AAL-4 not yet achievable |
| Attested Intelligence AGA | Industry spec + SDKs | Shipping, small |
| AP2 mandates | Industry | Spec + reference impl; production use unverified |
| zkML proof of inference — Lagrange DeepProve-1 proved full GPT-2 inference (18 Aug 2025); EZKL; zkLLM | Research → early product | Not viable per request at frontier scale (https://lagrange.dev/blog/deepprove-1; https://arxiv.org/pdf/2404.16109) |
| TEE attestation — Apple PCC expanded to Google Cloud (8 Jun 2026); Google Confidential Space H100 GA; Intel Trust Authority (23 Jun 2026); "Attestable Audits" (Jun 2025) | Shipping (infrastructure) | Attests environment/binary, not per-response content (https://security.apple.com/blog/expanding-pcc/; https://cloud.google.com/blog/products/identity-security/verifiable-trust-in-the-ai-era-whats-new-in-confidential-computing; https://arxiv.org/abs/2506.23706) |
| OpenAI Deployment Safety Hub; Anthropic Transparency Hub | Industry | Model-level only; no per-session artefacts (https://deploymentsafety.openai.com/; https://www.anthropic.com/transparency) |
| "Google AI transparency receipts" | — | Not found; likely conflation with SynthID |

## F. Privacy constraints

- Minimisation and storage limitation: Art. 12 logging and Art. 19/26(6) six-month floor apply "unless provided otherwise" by data-protection law; receipts content-free by default.
- Content-free hashing: Glacis (hashes + line ranges), AGA (hash-linked). Unsalted hashes of short prompts are dictionary-attackable — use salted/HMAC commitments (design inference; unverified against any standard).
- Tension with Art. 86 / GDPR Art. 22: a hash cannot explain; the receipt must reference an explanation record disclosable on demand.
- Selective disclosure: SD-JWT is RFC 9901 (Nov 2025); SD-JWT VC at draft-19; BBS+ still a CFRG draft (https://www.rfc-editor.org/info/rfc9901/). Mastercard Verifiable Intent already uses selective disclosure.
- Identity binding: Web Bot Auth forbids human-bound keys; separate operator identity (Web Bot Auth), agent identity (TAP), human mandate (AP2 VC).

## G. Design constraints the protocol must satisfy

| Stakeholder | Verifiable question | Existing answer |
|---|---|---|
| Buyer/deployer | Which model/version and system-prompt hash served this call? | OTel GenAI attrs (unsigned); Glacis receipt (signed) |
| | Did the vendor's certified controls execute on this call? | OVERT ControlAction only; AIUC-1 is periodic |
| | Can I retain evidence ≥ 6 months without content? | Hash-only receipts — no open standard |
| | Was a human in the loop when policy required? | None per call |
| End user | Was I talking to an AI, and which operator? | Art. 50 / Korea notice — non-verifiable text |
| | What did I authorise and did the agent stay within it? | AP2 mandates (commerce only) |
| | Can I get the Art. 86 / SB 26-189 explanation from this exact interaction? | None — needs receipt → explanation-record pointer |
| | Can I prove deletion of my session? | None |
| Regulator | Is the substantiation for a claim traceable to production runs? | None |
| | Was the log altered after the incident? | RFC 6962 logs (Glacis); SCITT |
| | Can I inspect without trade secrets (Art. 78)? | Hash-only + SD-JWT partially |
| Civil society | Is the system in a public register, referenced by the receipt? | Art. 71 DB (not live), ATRS — no linkage |
| | Can an independent auditor verify a sample without vendor cooperation? | OVERT AAL-4 (no assessors yet) |
| | Is there a complaint channel keyed to the receipt id? | None (LL144 shows channels fail without artefacts) |
| Vendor | Can I prove controls ran without exposing prompts/weights? | Content-free receipts; TEE attestation of binary |
| | Does the receipt reduce premium/liability? | Insurers price on audits, not yet receipts (unverified) |
| | Are operator/agent/human identities separated? | Web Bot Auth / TAP / AP2 — three unlinked layers |

Derived: (1) content-free, salted commitments with a disclosure pointer; (2) Ed25519/JCS + RFC 6962 inclusion proofs; (3) three separable identity layers; (4) a mandate slot compatible with AP2 VCs; (5) a registry-reference field; (6) selective disclosure via SD-JWT; (7) a certificate-to-receipt link; (8) notary and assessor outside the operator's trust boundary.
