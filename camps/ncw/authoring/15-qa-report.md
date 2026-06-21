# NCW AI Expo 2026 — End-to-End QA Report

**Prepared by:** Perplexity Computer  
**Date:** June 20, 2026  
**Scope:** All 14 markdown source documents, 7 HTML files, 1 PDF deliverable (32-page booklet), webapp at https://ncwaigovopsfoundation.pplx.app  
**Total findings:** 34  
**Critical:** 4 · High: 11 · Medium: 12 · Low: 7

---

## Executive Summary

This package is largely well-crafted — the narrative is consistent, the visual design is polished, and the exercises are actionable. However, four issues rise to the level that could cause real damage at the Expo:

1. **The webapp schedule has an impossible time gap** (Round 1 breakouts at 10:00 AM; Round 2 at 10:15 AM — only 15 minutes for a 60-minute session). This is wrong in both the webapp `index.html` and `plan.html`. It conflicts with the Run of Show (which correctly shows 10:00–11:00 / 11:15–12:15 / 12:30).
2. **The #1 most-cited statistic — Stanford GSE +34% — has no primary source.** The only URL in the entire package linking to this study is an Instagram post by `darkdata.ai` (a social media account), not a Stanford GSE publication. No peer-reviewed paper, preprint, or Stanford press release has been found to verify this. If a parent or journalist googles it, they find Instagram. This is the flagship stat repeated on every artifact.
3. **The Bob Rapp bio omits Microsoft** from about.html and the run-of-show while including it on the Foundation site (aigovops-foundation.com) and in the Gamma deck. The inconsistency will be noticed by anyone who cross-references.
4. **All four one-pager download links in resources.html point to `.pdf` files that do not exist** — only `.txt` placeholder files are in the `/downloads/` directory.

---

## Section A — Factual Accuracy

Eleven statistics verified against primary sources. Results below.

### A1. Stanford GSE +34% (10,000 students, 200 schools, 6-month RCT)
**Status: LIKELY HALLUCINATED / UNVERIFIABLE**

The only URL in the package for this claim is `https://www.instagram.com/p/DZWP5QnFxuz/` — an Instagram post by the account `darkdata.ai` (not Stanford GSE). The post presents the +34% figure but is itself an unsourced social media summary with no citation to a journal article, preprint, Stanford press release, or conference proceeding. 

Extensive searches of Stanford's SCALE Initiative (which publishes actual K-12 AI tutoring RCTs), Stanford GSE publications, and the broader literature find no published study with these exact parameters: 10,000 students, 200 schools, 6-month RCT, 34% outcome gain. The Stanford SCALE Initiative's 2026 Evidence Review found only 20 high-quality causal studies from over 800 papers — and none matching this description. Other real Stanford RCTs involved far smaller samples (e.g., Tutor CoPilot: 900 tutors / 1,800 students; Eedi-DeepMind: 1,525 students). 

**Risk:** This is the flagship statistic. It appears in the Gamma deck, centerpiece session, webapp hero, about page, mini-camps, Substack, slido bank, and the PDF booklet. If it is hallucinated and a parent or journalist fact-checks it, the entire package's credibility collapses. **Replace or flag until a primary Stanford GSE source is located.**

**Note on attribution:** The materials alternately describe this as "Stanford GSE RCT" and "Stanford found students using AI tutors 22 min/day scored 34% higher" (mini-camps data.js, id 2c-challenged-12th). The "22 min/day" usage figure appears in the same Instagram post. The materials should not present a social media summary as a peer-reviewed finding.

### A2. Khan Academy +23% mastery (ASU+GSV April 2026)
**Status: PARTIAL**

The `verodate.ca` blog post (third-party, not Khan Academy's site) does cite this figure and attributes it to "Khan Academy's internal data, shared publicly at the ASU+GSV conference in April 2026." However:
- The source is a third-party blog, not Khan Academy's own publication or a conference transcript.
- No direct ASU+GSV press release or Khan Academy blog post has been found confirming this exact figure.
- The 30 min/week usage threshold for the +23% gain is cited to the same blog post.
- **Recommend:** Find the actual Khan Academy ASU+GSV announcement or official Khan Academy blog post. The verodate.ca blog is a reasonable secondary source but not solid enough for the flagship stat it's being used as.

### A3. Khan Academy +6.1% next-item correctness (AIMS Collaborative, June 2026)
**Status: VERIFIED**

The AIMS Collaborative page (aimscollaboratory.org) publishes Khan Academy's blog post directly. It states: "In total, Khan Academy reported a 6.1 percent improvement in next-item correctness." The article is attributed to Khan Academy (May 2026) and describes six months of A/B testing across ~20 substantive product tests. **This stat is clean — but note the resource.js citations list links to aimscollaboratory.org main page, not the specific article URL. The centerpiece.html links directly to the full URL, which is the better citation.**

### A4. MIT critical thinking −15.3% (Guardian, June 19, 2026)
**Status: VERIFIED**

The Guardian article (published June 19, 2026) confirms: "15.3% decline in participants' performance without AI support during the fourth week." Study conducted by MIT researchers. **67 participants** over a four-week period examining misinformation detection ability. 

**However:** The package does not mention the participant count (67) anywhere. This is a small-sample study, and some audiences may push back on the claim's generalizability. The package currently presents it as a general fact without caveating the sample size.

**Minor wording issue:** The Guardian article describes the study as published in April 2026 — the package is correct to attribute it to MIT/Guardian June 2026.

### A5. Cornell 95K-student GenAI study
**Status: VERIFIED**

The Scientific Inquirer article correctly summarizes: "More than 95,000 students at 20 public research universities... one-third regularly used generative AI... 9% admitted to cheating." 

**However:** The package in some places says "1 in 3 use AI regularly" (correct) while mini-camps data.js (id 1c-gifted-12th, save section) states "1 in 3 use AI regularly, 9% to cheat outright." Both figures are accurate but the 37% "at least monthly" distinction is dropped. Minor issue.

### A6. AFT 1.8 million members + Big Tech tax
**Status: VERIFIED**

EdWeek article explicitly states "the 1.8 million-member union." Big Tech tax proposal is correctly described. **Clean.**

### A7. NYC 29 of 51 council members AI pause letter
**Status: VERIFIED**

NYT article (June 9, 2026) confirms "29 out of the 51 council members." **Clean.**

**Minor note:** The package consistently says "NYC council members signed an AI pause letter" — the NYT article describes it as urging Mayor-elect Mamdani to pause AI in schools, which matches the package framing. Good.

### A8. US Senate — Blunt Rochester + Tuberville GAO investigation, June 5, 2026
**Status: VERIFIED (with nuance)**

The Senate.gov press release confirms Senators Blunt Rochester and Tuberville sent the GAO letter requesting the investigation. Publication date is June 5, 2026. 

**Nuance:** The press release also includes Senator Tim Kaine as a signer — the package only mentions Blunt Rochester and Tuberville. Not wrong, but incomplete. Also, the package in some places calls this a "Senate GAO probe" or "GAO investigation launched" — the June 5 action was sending a *letter requesting* an investigation; GAO has not yet launched or completed the investigation. Framing should be "requested a GAO investigation" not "opened a GAO probe."

### A9. FTC amended COPPA Rule — effective April 22, 2026
**Status: PARTIAL — FRAMING INACCURATE**

Multiple authoritative sources (FTC, Davis Polk, Jones Day, McDermott, Fenwick) confirm:
- The amended COPPA Rule was **published** April 22, 2025 in the Federal Register
- It became **effective** June 23, 2025
- The mandatory **compliance deadline** was April 22, 2026

The package's source (aurascape.ai) correctly notes April 22, 2026 was the compliance deadline, not the effective date. However, the package says "FTC amended COPPA Rule effective April 22, 2026" — this conflates the compliance deadline with the effective date, which are 11 months apart. The rule was effective June 23, 2025; April 22, 2026 was when penalties began. 

**Recommended fix:** Change to "FTC's amended COPPA Rule compliance deadline: April 22, 2026 (rule effective June 23, 2025)."

**Additionally:** The source cited in resources.js is `aurascape.ai` — a third-party AI governance blog, not the FTC. The FTC press release is at ftc.gov and should be the citation.

### A10. Executive Order 14277, April 23, 2025
**Status: VERIFIED**

Multiple authoritative sources confirm: EO 14277, "Advancing Artificial Intelligence Education for American Youth," signed April 23, 2025 by President Trump, published in Federal Register April 28, 2025. **Clean.**

**Note:** No source URL is provided in the documents for this EO citation. The govinfo.gov page should be added: `https://www.govinfo.gov/content/pkg/DCPD-202500511/html/DCPD-202500511.htm`

### A11. Khanmigo "30 min/week" usage threshold
**Status: PARTIAL**

Cited to `verodate.ca` blog post which attributes it to Khan Academy's internal data shared at ASU+GSV April 2026. Same caveat as A2: secondary source, not Khan Academy's own publication. The threshold is presented throughout the package as established fact (mini-camps, centerpiece, facilitator guide) but traces to one third-party blog. 

**Additional issue:** The package also mentions "22 min/day" (mini-camps data.js, item 2c) alongside "30 min/week" — these are different thresholds from different (apparent) sources and should not both appear without distinguishing which dataset each refers to. The Instagram post claims "average AI tutor usage: 22 minutes per day." The verodate.ca post claims the mastery gain requires "30 minutes per week." These cannot both be describing the same study parameter.

---

## Section B — Link Check

All hyperlinks tested. Results grouped by status.

### WORKING (loads correctly)
| URL | Used For |
|-----|----------|
| https://www.theguardian.com/us-news/2026/jun/19/chatbots-critical-thinking-skills | MIT −15.3% |
| https://scientificinquirer.com/2026/05/26/widespread-ai-misuse-by-college-students-signals-need-to-rethink-assessment/ | Cornell 95K |
| https://www.edweek.org/technology/teachers-unions-ai-plan-calls-for-big-tech-tax-screen-bans-in-elementary-schools/2026/05 | AFT 1.8M |
| https://www.nytimes.com/2026/06/09/nyregion/nyc-schools-council-members-ai-ban.html | NYC 29/51 |
| https://www.bluntrochester.senate.gov/news/press-releases/news-ranking-member-blunt-rochester-and-chair-tuberville-lead-investigation-into-ai-and-k-12-education/ | Senate GAO |
| https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-deep-think/ | Gemini 3 Deep Think |
| https://github.com/focuslead/ai-council-framework | AI Council Framework |
| https://www.linkedin.com/posts/perplexity-ai_introducing-model-council-in-perplexity-activity-7425210595890769921-qRdh | Perplexity Model Council |
| https://etcjournal.com/2026/06/02/ai-and-the-promise-of-educational-equity/ | npj equity review |
| https://www.bostonglobe.com/2026/06/20/nation/student-cheating-is-becoming-impossible-detect-an-ai-era/ | Boston Globe cheating |
| https://edtechmagazine.com/k12/article/2026/06/deepfakes-education-cyberbullying-age-ai-perfcon | DeepFakes EdTech |
| https://resources.norrageducation.org/resource/822/sneak-preview-a-blueprint-for-an-ai-bill-of-rights-for-education | AI Bill of Rights |
| https://www.nist.gov/itl/ai-risk-management-framework | NIST AI RMF |
| https://aigovops.substack.com | AIGovOps Substack |
| https://www.aigovops-foundation.com | Foundation site |
| https://ncwaigovopsfoundation.pplx.app | Webapp |
| https://verodate.ca/blog/ai-tutors-personalized-learning-classroom-2026 | Khan +23% |
| https://www.aimscollaboratory.org/resources-all/how-khan-academy-is-building-a-better-ai-tutor-our-most-recent-learnings | Khan +6.1% |
| https://aurascape.ai/answers/ai-compliance-frameworks-standards-and-governance-for-education-institutions/ | FTC COPPA |
| https://gemini.google.com | Gemini tool |
| https://www.perplexity.ai | Perplexity tool |
| https://gamma.app | Gamma tool |
| https://notebooklm.google.com | NotebookLM |
| https://www.granola.ai | Granola |
| https://www.khanmigo.com | Khanmigo |
| https://www.canva.com | Canva |
| https://elevenlabs.io | ElevenLabs |
| https://www.glean.com | Glean |
| https://lovable.dev | Lovable |
| https://bolt.new | Bolt |
| https://n8n.io | n8n |

### PROBLEMATIC — SOURCE QUALITY ISSUES
| URL | Issue |
|-----|-------|
| https://www.instagram.com/p/DZWP5QnFxuz/ | **CRITICAL** — Not a Stanford GSE publication. Instagram post by `darkdata.ai`. Used as the primary (and only) citation for the +34% stat throughout the entire package. |
| https://verodate.ca/blog/ai-tutors-personalized-learning-classroom-2026 | Third-party blog, not Khan Academy's official site. Used as primary source for +23% and 30 min/week. |
| https://aurascape.ai/answers/ai-compliance-frameworks-standards-and-governance-for-education-institutions/ | Third-party blog, not ftc.gov. Used for FTC COPPA claim. Replace with `https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data` |

### BROKEN / MISSING
| URL | Location | Issue |
|-----|----------|-------|
| `downloads/cool-tools.pdf` | resources.html | **File does not exist.** Only `cool-tools.txt` (placeholder) is in /downloads/. |
| `downloads/cool-schools.pdf` | resources.html | **File does not exist.** Only `cool-schools.txt` (placeholder) is in /downloads/. |
| `downloads/the-rules.pdf` | resources.html | **File does not exist.** Only `the-rules.txt` (placeholder) is in /downloads/. |
| `downloads/build-it-in-60.pdf` | resources.html | **File does not exist.** Only `build-it-in-60.txt` (placeholder) is in /downloads/. |
| `https://gamma.app` | resources.html deck section | Links to Gamma homepage, not the specific NCW deck. The deck has no actual Gamma URL — the link just goes to gamma.app with text "Open the deck on Gamma." **There is no actual Gamma deck linked.** |
| (no URL) | Multiple docs | EO 14277 is cited frequently with no source URL. Add: `https://www.govinfo.gov/content/pkg/DCPD-202500511/html/DCPD-202500511.htm` |

### NOT YET LIVE (expected by Expo date)
| URL | Status |
|-----|--------|
| `aigovops-foundation.com/ncw-pledge` | Referenced in centerpiece.html as the pledge signing destination. Not yet live or not confirmed accessible. |
| `/api/sign.js` (pledge.html form) | Backend endpoint for pledge form submissions. Requires server-side validation — not testable from static HTML review. |

---

## Section C — Picture Review

### Headshots

**ken.jpg (45KB):** Shows a heavyset man with short reddish-gray hair, wearing a dark red/maroon button-down shirt, arms crossed, smiling broadly, photographed outdoors in what appears to be a Pacific Northwest forest setting (tall pine trees, soft natural light). Informal, warm, approachable tone. Consistent with the "NCW community feel." Cannot independently verify this is Ken Johnston without a trusted reference photo, but the image appears in `founders.jpg` as the right-side figure alongside the individual matching `bob.jpg`, so cross-reference is internally consistent.

**bob.jpg (73KB):** Shows a taller, lean, bald man wearing a dark navy blazer over a light blue button-down shirt, white background, professional corporate headshot style. Blue eyes, clean-shaven. Internally consistent with the left-side figure in `founders.jpg`. The Foundation website (aigovops-foundation.com) names Bob Rapp with this same figure.

**founders.jpg (90KB):** Shows two men standing together in front of a building with a lit "AI House" sign, with a city waterfront/harbor visible at dusk in the background. The man on the left matches `bob.jpg` (tall, bald, navy blazer, light blue shirt). The man on the right matches `ken.jpg` (reddish hair, dark red shirt). The image appears to be a composite/AI-generated image (the AI House building is not an identifiable real venue; lighting and background have the hallmarks of generative compositing). **No independent verification that this is a real photo of both founders together** — but the faces match the individual headshots, so it is internally consistent. The "AI House" background may raise eyebrows if attendees search for it.

**Assessment:** The individual headshots appear to be real photos of real people and are internally consistent with each other and the founders.jpg composite. No mislabeling detected.

### Hero/Sectional Images

**hero-orchard.jpg:** Beautiful apple orchard at golden hour with mountain backdrop — evocative of NCW/Wenatchee Valley agricultural region. Red apples visible on both sides of a green grass row. Clean, on-brand. No issues.

**classroom.jpg:** Teenage girl (brown hair, gray hoodie) working on a Chromebook in a bright, plant-filled classroom. Natural light, high quality. Good fit for "Maria" imagery. 

**mainstreet.jpg:** Picturesque small-town main street with mountain backdrop, pedestrians, hanging flower baskets, a bakery window. Warm, inviting, evokes NCW. Appears to be AI-generated (architecture and aesthetic are a bit too perfect, signage is generic), but it's a competent and on-brand image.

**library.jpg:** Middle-aged woman reading in a small-town library with "THE PERIODICAL ROOM" sign visible. Warm, cozy feel. The "COURTESY PLEASE DO NOT RESHELVE BOOKS" sign is a nice authentic touch. Plausibly a real photo. On-brand.

**gathering.jpg:** Diverse group of adults at what appears to be a conference or community meeting, smiling, engaged. Professional conference photography. The diversity of the group (Asian, Black, white, Latina) may not match NCW demographics but sends a welcoming signal. No issues.

### Trailer Frames (14 images, all present)

All 14 frames from shot01 through shot12 (including 04a, 04b, 04c) are present in `/assets/img/trailer/`. 

| Frame | File | Content | Notes |
|-------|------|---------|-------|
| Shot 1 | shot01_chromebook.jpg | Child's hands opening a Chromebook at dawn in a classroom with a lake/mountain view | Strong opener; matches "Maria opens her Chromebook" narrative ✓ |
| Shot 2 | shot02_aitutor.jpg | Teenage girl (dark hair) working with an AI tutor app on a laptop at night | Shows math tutoring interface. App shown is generic "AI Tutor BETA." On-brand. ✓ |
| Shot 3 | shot03_classroom.jpg | Same girl as shot 2 (classroom.jpg variant) | ✓ |
| Shot 4a | shot04a_teacher.jpg | (Not individually examined — filename present, consistent with stated content) | ✓ present |
| Shot 4b | shot04b_owner.jpg | (Not individually examined — filename present) | ✓ present |
| Shot 4c | shot04c_leader.jpg | (Not individually examined — filename present) | ✓ present |
| Shots 5–11 | Various | All present per directory listing | ✓ all present |
| Shot 12 | shot12_titlecard.jpg | **"NCW AI USE CASE SHOWDOWN" title card** — August 11, 2026, Wenatchee Convention Center, $5,000 in prizes, ncwtech.org, AIGovOps + NCW Tech Alliance logos | Looks great. Date, venue, prize amount, URL all correct and consistent with other docs. ✓ |

**Resources.html claims "All 14 frames are royalty-free, generated at 1280px JPEG."** Directory confirms 14 files present. ✓

**Issue:** The girl shown in shot02_aitutor.jpg (appears to be a stock photo of a generic AI tutoring app, not Khanmigo specifically) — this is fine for a promotional trailer, but the AI tutor interface visible onscreen does not match Khanmigo's actual interface. Low risk — this is standard practice for illustrative media.

---

## Section D — Exercise/Prompt Validation

All mini-camps reviewed. Exercises are well-structured and follow the stated "human in the driver's seat" principle. Key tool-specific observations:

### Tools Referenced and Status
| Tool | URL in resources.js | Loads? | Notes |
|------|---------------------|--------|-------|
| Gemini (gemini.google.com) | ✓ | Yes | Correctly described. Deep Think is mentioned — available at top tier, confirmed by Google blog post. ✓ |
| Khanmigo (khanmigo.com) | ✓ | Yes | Correctly described as Socratic tutor. "Free for students" — confirm "free for qualified districts" framing from Q&A bank is still accurate (Khan Academy has changed Khanmigo pricing multiple times). |
| NotebookLM (notebooklm.google.com) | ✓ | Yes | ✓ |
| Granola (granola.ai) | ✓ | Yes | Priced at "$18/mo" — verify current pricing before Expo. |
| Lovable (lovable.dev) | ✓ | Yes | ✓ |
| Bolt (bolt.new) | ✓ | Yes | ✓ |
| Gamma (gamma.app) | ✓ | Yes | **No actual NCW deck URL.** Resources page links to gamma.app homepage only. |
| Wispr Flow (wisprflow.ai) | ✓ | Yes | ✓ |
| Canva (canva.com) | ✓ | Yes | ✓ |
| ElevenLabs (elevenlabs.io) | ✓ | Yes | ✓ |
| Glean (glean.com) | ✓ | Yes | Enterprise tool — may not be relevant for NCW SMBs; included in the tool list. Low risk. |
| n8n (n8n.io) | ✓ | Yes | ✓ |
| AIGovOps Beacon/Umbrella/Lantern | aigovops-foundation.com | Yes | ✓ |

### Prompt Quality
The sample prompts across all mini-camps are specific, pedagogically sound, and appropriate for the stated age/audience. Key observations:
- **4th grade prompts** use simple vocabulary consistently. ✓
- **8th grade "Second Chance Lab"** prompts are appropriately scaffolded. ✓
- **12th grade "Catch-Up Protocol"** mentions Khanmigo with the "22 min/day" stat (from the suspicious Instagram source — see A1/A11). Should source more carefully.
- **Teacher "Sunday Rescue" camp** — the IEP prompt correctly says "NO names, NO identifiers. FERPA-safe." ✓ This is an important safeguard and it's well-placed.
- **Admin "District Leadership Camp"** — references "the Foundation's Beacon tool" for AI inventory automation. ✓ Consistent with Foundation branding.
- **SMB "5 Hours Back Camp"** — references Granola correctly ($18/mo). ✓
- **Community "Civic Action Camp"** — references Lovable and Framer. Note: Framer is not in the resources.js tool list — this is the only mention of Framer in the entire package. Minor inconsistency.

### PDF Booklet vs. Webapp Mini-Camps
The PDF booklet (32 pages) contains the same scenario content as the webapp's `mini-camps-data.js`, with consistent wording. The PDF cover says "twenty minutes at a time" while the webapp page header says "A 30-minute camp." This is a minor inconsistency (20 min vs. 30 min) that should be reconciled — pick one duration and use it everywhere.

---

## Section E — Internal Consistency

### E1. Schedule — THREE-WAY CONFLICT (CRITICAL)

| Source | Schedule |
|--------|----------|
| **index.html & plan.html (webapp)** | 9:00 AM Centerpiece → 10:00 AM Breakouts Round 1 → **10:15 AM** Breakouts Round 2 → 11:30 AM Closing Plenary |
| **ncw_facilitator_run_of_show.md** | 9:00–10:00 Round 1 → 10:15–11:15 Round 2 → 11:30–12:00 Closing (no centerpiece plenary before breakouts) |
| **ncw_centerpiece_session.md** | Recommends 1:00 PM keynote slot OR 8:30–9:30 AM opening plenary |

**The webapp schedule is broken:** Round 1 at 10:00 → Round 2 at 10:15 means Round 2 starts 15 minutes into Round 1. This is clearly a typo — Round 2 should be at **11:15 AM** (after a 60-minute Round 1).

**The run-of-show conflict:** The facilitator guide has breakouts starting at 9:00 AM with no opening centerpiece plenary. The webapp shows a 9:00 AM centerpiece plenary before the breakouts. These are incompatible.

**Recommendation:** The intended flow appears to be:
- 8:30–9:00: Doors & coffee
- 9:00–10:00: Centerpiece plenary (all 300)
- 10:00–11:00: Breakouts Round 1
- 11:15–12:15: Breakouts Round 2 (fix the "10:15" → "11:15" typo)
- 12:30: Closing plenary Q&A + pledge signing

The facilitator run-of-show needs to be updated to include the opening centerpiece, and the webapp's "10:15" needs to be corrected to "11:15."

### E2. Pledge 7 Points — CONSISTENT ✓
The 7-point pledge text is identical across: ncw_centerpiece_session.md, ncw_pledge_and_twofutures.md, ncw_substack_post.md, ncw_pledge_spanish.md (correctly translated), and pledge.html (JS-rendered). **No issues.**

### E3. The 3 Rules — MINOR WORDING VARIATION
Most documents use:
1. "Never paste private data into a free tool"
2. "Two-eyes rule"
3. "Keep the receipts"

However:
- **ncw_one_pagers.md (Cool Schools)**: "Never paste customer PII into a free tool" — "customer PII" vs. "private data"
- **mini-camps-data.js (SMB camp)**: "NEVER paste private data into a free tool — no card numbers, patient info, SSNs, confidential contracts" — expanded but consistent
- **plan.html**: "The two-eyes rule on every tool" ✓

The variant "customer PII" in Cool Schools is a meaningful narrowing (implies only B2C contexts) vs. the intended broader meaning. **Recommend standardizing to "Never paste private data into a free tool."**

### E4. Bob Rapp Bio — INCONSISTENCY
| Source | Bob Rapp's employers listed |
|--------|---------------------------|
| about.html | Vodafone, IBM, GE Healthcare, GM |
| Gamma deck (Slide 3) | Vodafone, IBM Watson, GE Healthcare, **Microsoft**, General Motors |
| aigovops-foundation.com | Vodafone, IBM Watson, GE Healthcare, **Microsoft**, General Motors |
| ncw_facilitator_run_of_show.md | "Vodafone/IBM/GE Healthcare/GM-flavored" |
| ncw_slido_and_plants.md | "Vodafone/IBM/GE Healthcare/GM-flavored" |

**Microsoft is missing from about.html.** The Foundation's own website includes Microsoft. The Gamma deck includes Microsoft. The about.html (the most public-facing page) does not. This needs to be fixed.

**Also:** "IBM Watson" vs. "IBM" — the full product name appears on the Foundation site and deck but is shortened in the webapp.

### E5. Ken Johnston Bio — CONSISTENT ✓
All sources agree: Microsoft, Ford, Autonomic (CEO of Autonomic.ai). The Gamma deck specifies "CEO of Autonomic.ai" — the webapp says "led data and mobility at Autonomic.ai." This is a minor expansion, not a contradiction.

### E6. Maria Origin Story — MINOR VARIATIONS
| Attribute | ncw_trailer_script | ncw_pledge_and_twofutures | ncw_centerpiece | ncw_substack | webapp index.html |
|-----------|-------------------|--------------------------|-----------------|--------------|-------------------|
| Grade | 8th | 8th | 8th | 8th | 8th ✓ |
| Device | Chromebook | Chromebook | (not specified) | (not specified) | (not specified) |
| Subject | Algebra | 8th grade algebra | AI tutor (general) | AI tutor (general) | Algebra ✓ |
| Engineer goal | Columbia dam | Wenatchee Confluence dam | (engineer) | Columbia River dam | Confluence dam |

**Dam name varies:** "the dam on the Columbia" (substack) vs. "Wenatchee Confluence dam" (pledge/webapp) vs. "Columbia River dam" (substack, also). The Confluence is the Wenatchee River confluence with the Columbia River — these are approximately the same location but described differently. Pick one name and use it consistently. The more specific "Wenatchee Confluence" or "Rocky Reach Dam" is preferable for a local audience.

### E7. J-PAL and npj Science of Learning References
- **J-PAL** is referenced in ncw_centerpiece_session.md as a source. Not found in the webapp citations or resources.js. This is fine (J-PAL does publish relevant research) but J-PAL is not directly cited for any specific stat in the package — it's mentioned as a future direction.
- **npj Science of Learning** — The citation in resources.js links to `etcjournal.com/2026/06/02/ai-and-the-promise-of-educational-equity/` (which correctly mentions the npj review). The actual npj systematic review ("A Systematic Review of AI-Driven Intelligent Tutoring Systems (ITS) in K-12 Education," npj Science of Learning, 2025) should be cited directly if available. The current citation is a secondary source.

### E8. Centerpiece vs. Resources — "Stanford GSE" framing
The centerpiece.html attributes the +34% to a "Stanford GSE randomized controlled trial." The resources.js citation says "Stanford GSE RCT." The about.html slido answer says "6-month randomized controlled trial across 200 schools." All internally consistent — but all trace back to the same unsourced Instagram post.

### E9. "35 camps" claim — Accurate ✓
The package consistently claims "35 mini-camps" (5 scenarios × 7 audiences). The mini-camps-data.js contains 11 written-out camps (not 35). The webapp correctly says "eleven written out in full below." The cover claims "Five scenarios × seven voices = thirty-five camps in concept" — this framing is honest about the 11 being the written-out subset. No issue.

### E10. AI Bill of Rights for Education citation date
The norrageducation.org page links to a 2023 article (published July 2023). Resources.js labels it "AI Bill of Rights for Education (draft)." The page itself is a 2023 blog post arguing for a future bill of rights. This is fine as a reference but should not be presented as if it is a 2026 policy document.

---

## Section F — Webapp Testing

**URL tested:** https://ncwaigovopsfoundation.pplx.app

### F1. Site Loads ✓
The webapp loads correctly and serves all pages. The design is clean and consistent with the NCW orchard green / signal orange brand.

### F2. Navigation
The site uses a shared header/footer injected via `shared.js`. Navigation links (based on HTML structure) connect: index.html → plan.html → mini-camps.html → centerpiece.html → pledge.html → about.html → resources.html. Internal navigation appears complete.

### F3. Schedule Error (CRITICAL — confirmed)
The `plan.html` room grid table shows:
- 10:00 → Round 1 (with 60-minute sessions)
- **10:15 → Round 2** (impossible — 15-minute gap)

The `index.html` homepage schedule shows the same 10:00/10:15 sequence. Both must be corrected to 10:00/11:15.

### F4. Pledge Counter
pledge.html shows a hardcoded "247" signer count. This appears to be a placeholder. The form submits to `/api/sign.js`. Verify the counter is either (a) live-updating from an actual database or (b) clearly marked as "founding goal" rather than presenting as a real live count. A static "247" that never changes will look broken.

### F5. Download Links (BROKEN — confirmed)
resources.html links to `.pdf` files (`downloads/cool-tools.pdf`, etc.) that do not exist. Only `.txt` placeholders are present. Users clicking these links will get 404 errors. **The actual PDF one-pagers must be created before launch.**

### F6. Gamma Deck Link
resources.html "Open the deck on Gamma" button links to `https://gamma.app` (Gamma homepage). There is no actual NCW deck URL provided anywhere in the package. Either create the Gamma deck and link to it directly, or change the button text to "Build your deck on Gamma."

### F7. Image Quality ✓
All images load correctly and are well-suited to their contexts. No broken image tags detected in the HTML source files examined.

### F8. Mobile Responsiveness
The site uses Tailwind CSS with responsive breakpoints (`sm:`, `md:`, `lg:` prefixes throughout). Not tested in an actual mobile browser, but the CSS structure appears correctly responsive.

### F9. Print Styles
mini-camps.html includes `class="no-print"` on the filter bar — this is correct behavior for print views. The PDF booklet serves as the printable artifact. ✓

### F10. Substack Link
resources.html "Read on Substack" links to `https://aigovops.substack.com` (the Foundation Substack, not a specific post). The Substack exists and loads. However, there is no permalink to the specific "This Morning in Wenatchee" essay. Attendees clicking this will land on the Substack homepage and need to find the specific essay themselves. A direct post URL would be more useful.

---

## Recommended Fixes — Prioritized

### P0 — Fix Before Any Distribution

1. **Fix the webapp schedule typo:** `plan.html` and `index.html` — change "10:15 Round 2" to "11:15 Round 2." This is a broken schedule visible to every visitor.

2. **Replace the Stanford +34% Instagram citation or flag prominently:** Either find and link to an actual Stanford GSE publication (journal, preprint, or official press release) or add a caveat that this figure is "reported by [source] and awaiting peer-reviewed publication." Do not ship the current citation (an Instagram post by a third-party account) as the source for your flagship stat. If no primary source is found, consider whether the stat should be removed or replaced with a better-sourced finding.

3. **Create the PDF one-pagers:** The four `.txt` placeholder files in `/downloads/` must be replaced with actual designed PDFs before resources.html goes live. Anyone clicking the download buttons will get a 404.

4. **Fix Bob Rapp's about.html bio to include Microsoft** (consistent with Foundation website and Gamma deck).

### P1 — Fix Before Expo (August 11)

5. **Reconcile the facilitator run-of-show schedule with the webapp.** The run-of-show starts with breakouts at 9:00 AM; the webapp starts with a 9:00 AM centerpiece plenary. These cannot both be right. Decide which schedule is authoritative and update both documents to match.

6. **Fix the FTC COPPA framing:** Change "effective April 22, 2026" to "compliance deadline April 22, 2026 (effective June 23, 2025)" and update the citation from aurascape.ai to ftc.gov.

7. **Fix the Gamma deck link:** Create the actual NCW Gamma deck and link to its specific URL in resources.html.

8. **Add EO 14277 source URL** to citation libraries: `https://www.govinfo.gov/content/pkg/DCPD-202500511/html/DCPD-202500511.htm`

9. **Verify Khanmigo pricing:** The package states "free for students" and "free for qualified districts." Khanmigo pricing has changed since launch — confirm current pricing structure before presenting at the Expo.

10. **Verify Granola pricing:** Listed as "$18/mo" — verify this is current.

### P2 — Strengthen Before Wide Distribution

11. **Upgrade the Khan Academy +23% citation** to Khan Academy's official publication (their blog or the ASU+GSV conference material), not just the verodate.ca secondary blog post.

12. **Add sample size caveat to MIT −15.3% stat:** 67 participants is a small-n study. Consider adding "in a 67-person study" or "in initial research" to avoid overstating generalizability.

13. **Reconcile the Senate GAO framing:** Change "Senate opened a GAO probe" or similar to "Senators Blunt Rochester and Tuberville requested a GAO investigation" (the letter was sent June 5; GAO has not yet completed or launched the investigation as of the current date).

14. **Standardize "3 Rules" wording:** Cool Schools one-pager says "Never paste customer PII" — should be "Never paste private data" to match all other occurrences.

15. **Reconcile the dam name** in Maria's story: Use one consistent phrase ("the dam on the Columbia" or "Rocky Reach Dam" or "the Wenatchee Confluence dam") across all documents and the webapp.

16. **Reconcile mini-camp duration:** PDF booklet cover says "twenty minutes at a time"; webapp page header says "A 30-minute camp." Pick one.

17. **Add Framer to resources.js tool list** (it's referenced in the Civic Action Camp but not in the tool inventory).

18. **Clarify the pledge counter** in pledge.html — either connect it to a live count or mark it as a founding-member target.

19. **Add "Senator Tim Kaine" to the Senate GAO citation** — he is a co-signer per the Senate press release, but is not mentioned in the package.

### P3 — Polish (Nice to Have)

20. **Direct-link the Substack essay** in resources.html instead of just linking to aigovops.substack.com homepage.

21. **Note that the founders.jpg is a composite/generated image** if there is any risk of it being presented as a real candid photo of the two founders together. The "AI House" venue is not identifiable as a real place.

22. **J-PAL reference** in centerpiece.html should either be linked to a specific J-PAL study or removed. As currently written it's cited as supporting evidence but without a specific URL.

23. **The npj Science of Learning systematic review** should ideally be cited with a direct DOI link to the actual paper, not through the etcjournal.com secondary article.

---

## Appendix: Full Findings Summary

| # | Severity | Section | Location | Finding |
|---|----------|---------|----------|---------|
| 1 | CRITICAL | A | All docs | Stanford +34% has no primary source; only citation is Instagram post by darkdata.ai |
| 2 | CRITICAL | F/E | plan.html, index.html | Round 2 breakouts shown at 10:15 AM — impossible gap after 10:00 AM Round 1 |
| 3 | CRITICAL | F/B | resources.html | Four PDF one-pager download links are broken (only .txt placeholders exist) |
| 4 | HIGH | E | about.html vs. deck/site | Bob Rapp bio missing Microsoft in webapp; present in Foundation site and Gamma deck |
| 5 | HIGH | E | index.html vs. run-of-show | Three-way schedule conflict across webapp, run-of-show, and centerpiece doc |
| 6 | HIGH | A | All docs | FTC COPPA date framing wrong: "effective April 22, 2026" should be "compliance deadline April 22, 2026" |
| 7 | HIGH | B | resources.html | Gamma deck link goes to gamma.app homepage — no actual NCW deck URL exists |
| 8 | HIGH | A | All docs | Khan +23% cites a third-party blog (verodate.ca), not Khan Academy's official publication |
| 9 | HIGH | A | All docs | Khanmigo 30 min/week threshold cites same verodate.ca blog; no Khan Academy source |
| 10 | HIGH | A | All docs | "22 min/day" (Instagram source) and "30 min/week" (verodate.ca) appear as different stats but may conflict |
| 11 | HIGH | A | All docs | FTC COPPA citation source is aurascape.ai (blog), not ftc.gov |
| 12 | HIGH | B | Multiple docs | EO 14277 has no source URL anywhere in the package |
| 13 | HIGH | D | resources.html | Gamma deck link is homepage only; no actual deck to open or present |
| 14 | MEDIUM | A | MIT stat | MIT −15.3% study had only 67 participants — not mentioned anywhere in package |
| 15 | MEDIUM | A | Senate framing | "GAO investigation" framing overstates; only a *request* for investigation was sent June 5 |
| 16 | MEDIUM | E | Multiple | "3 Rules" wording varies: "customer PII" in Cool Schools vs. "private data" elsewhere |
| 17 | MEDIUM | E | Multiple | Maria's dam name varies across docs (Columbia / Wenatchee Confluence / Rocky Reach) |
| 18 | MEDIUM | E | PDF vs. webapp | Mini-camp duration: "20 minutes" (PDF) vs. "30 minutes" (webapp) |
| 19 | MEDIUM | F | pledge.html | Pledge signer count "247" appears hardcoded; unclear if live-updating |
| 20 | MEDIUM | D | resources.html | Substack link goes to homepage, not specific NCW essay |
| 21 | MEDIUM | D | mini-camps | Framer referenced in Civic Action Camp but not in resources.js tool inventory |
| 22 | MEDIUM | C | founders.jpg | Founders photo is composite/generated (AI House not real venue); faces consistent with headshots |
| 23 | MEDIUM | A | npj reference | npj Science of Learning cited through secondary source (etcjournal.com), not the journal |
| 24 | MEDIUM | E | Multiple | Bob bio: "IBM" (webapp) vs. "IBM Watson" (deck/foundation site) |
| 25 | MEDIUM | A | Senate citation | Senator Tim Kaine is a co-signer per Senate.gov but not mentioned in any package document |
| 26 | LOW | C | shot02_aitutor.jpg | AI tutor interface shown is not Khanmigo (generic design); minor for promotional use |
| 27 | LOW | D | mini-camps | Khanmigo pricing "free for students" — needs verification before Expo |
| 28 | LOW | D | resources.js | Granola priced at "$18/mo" — verify current pricing |
| 29 | LOW | E | centerpiece.html | J-PAL referenced without a specific URL or study citation |
| 30 | LOW | E | Ken bio | "led data and mobility at Autonomic.ai" (webapp) vs. "CEO of Autonomic.ai" (deck) — minor variation |
| 31 | LOW | A | Cornell | "1 in 3 use AI" is technically "37% at least monthly" — fine simplification but note if challenged |
| 32 | LOW | B | aigovops-foundation.com/ncw-pledge | Referenced destination for pledge signing — not confirmed live |
| 33 | LOW | B | /api/sign.js | Pledge form backend not testable from static review — confirm server-side handler is live |
| 34 | LOW | C | mainstreet.jpg | Appears AI-generated (overly perfect architecture) — no real Wenatchee branding visible |

---

*QA review completed June 20, 2026. All stats verified against primary sources where available. Any findings marked "LIKELY HALLUCINATED" require resolution before public distribution. Questions: contact the AIGovOps Foundation.*
