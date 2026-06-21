# NCW AI Mini-Camps — Booklet Format Note

**File:** `deliverables/ncw_mini_camps_booklet.pdf`
**32 pages, designed for saddle-stitch binding, 8.5 × 11 in finished trim.**

- Page count is a multiple of 4 (one 32-page signature), so it folds and staples cleanly down the spine with no padding needed.
- Letter-sized (8.5×11) portrait pages; full-bleed color cover and back cover, cream interior.
- Built as an HTML + CSS print stylesheet rendered to PDF with headless WeasyPrint (cleaner booklet typography than reportlab).
- 21 clickable source hyperlinks; metadata Title/Author set (Author = "Perplexity Computer").

## Page sequence
1. **Front cover** — "Five Scenarios · Seven Voices · One Principle" + tagline "Human in the driver's seat. AI does the painful work." + AiGovOps × NCW Tech Alliance.
2. **Inside cover (The Frame)** — framing intro with the side-by-side "What the human keeps" vs "AI does the painful work" table + the three habits.
3. **The Five Scenarios at a Glance** — overview table.
4–7. **Scenario 1 — Gifted Student (green):** opener + 4th / 8th / 12th grader camps.
8–11. **Scenario 2 — Challenged Student (blue):** opener + 4th / 8th / 12th grader camps.
12–15. **Scenario 3 — Teacher & Administrator (yellow):** opener + Teacher + Administrator camps.
16. **Scenario 4 — Small Business Owner (orange):** opener + camp.
17–20. **Scenario 5 — Community Leader (purple):** opener + Community Leader + Local Government Leader camps.
(Longest camps — the two 12th-grade protocols, the Teacher and Administrator camps — flow onto a second page.)
- **Workbook pages (×3):** Pick Your Camp / Write Your One Rule / Keep the Receipts (lined note pages; also serve as the saddle-stitch pad to 32 pp).
32. **Back cover** — the unifying Who / What AI does / What stays 100% human matrix (color-coded borders) + Pledge URL (aigovops-foundation.com/ncw-pledge) + AiGovOps Foundation × NCW Tech Alliance branding.

## Design choices
- **Color-tabbed sections** via stepped edge tabs that bleed off the right trim: green = gifted student, blue = challenged student, yellow = teacher/admin, orange = SMB owner, purple = community leader. The tab steps down the page edge per scenario so a closed booklet shows a color index. The same accent color drives each camp's badge, step-number circles, callout box, and accent rules.
- **Audience badge** pill on every camp page (e.g. "FOR A 4TH GRADER") with an age/reading-level subline.
- **"The One Rule"** in a filled callout box matching the section color (rendered as a numbered list where the source supplies multiple rules — Teacher, Administrator, SMB, Community, Local Gov).
- **Citations as footnotes:** superscript markers in body text with a hyperlinked numbered source list at the foot of the relevant pages.
- **Scenario openers** include the "Cover image idea" (set as an accented note) and the painful-thing / human-keeps two-cell table.
- **Typography:** Source Serif 4 (friendly serif) for all headers/titles + the "Lora-class" editorial italic notes; Inter for body, badges, labels, tables. Generous 1.62 line height. Embedded TTF static instances.
- **Palette:** orchard green #2E7D4F, signal orange #E07A2A, cream #FAF7F0 background, charcoal #1F1F1F text, with per-scenario tab colors as accent rules. (Blue/yellow/purple tab hues chosen to read distinctly on cream and to stay colorblind-friendly.)

## Source content note
The source file contains 11 fully written mini-camps (Scenario 3 has Teacher + Administrator; Scenario 4 has one SMB camp; Scenario 5 has Community Leader + Local Government Leader), not a full 7-per-scenario grid. The booklet renders every camp present in the source and labels each clearly; the back-cover matrix lists all seven voices.
