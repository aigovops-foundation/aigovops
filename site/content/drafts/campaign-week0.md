# The Café Campaign — week 0 set

*11 September 2026. Companion to the brief. Paste-ready; nothing here sends itself.*

## 1 · The Substack welcome email (Settings → Emails → Welcome email)

**Subject:** Sit down. What brought you in?

You just subscribed to the Tuesday Letter — thank you. Here is the whole of what happens next.

Every Tuesday you get one story from the practice: a real case, a real receipt, a real mark from
Thursday, and the count of marks by level, no names. That is the only thing the Foundation sends.

If you have ten minutes now, run the **Gate Check** — ten questions about one AI you know, no account,
nothing installed. Keep the card; it is your first receipt.
https://community.aigovops-foundation.com/gate-check.html?src=welcome

If you have an hour, sit down at the café and say what brought you in. Five doors, each a real case;
you leave with a rule in your own words and a signed receipt.
https://www.aigovops-foundation.com/?src=welcome

Thursdays at 09:00 Pacific are for receipts. Bring one, or come and watch someone else's.

Ship safe AI — never unsafe AI: get to yes, stay at yes, recover to yes. Prove it in ten minutes.

— Ken and Bob

## 2 · The Substack "about" page (one paragraph)

The Tuesday Letter from the AiGovOps Foundation: one story from the practice each week — a real AI
harm and the gate that would have caught it, a receipt someone made, the marks by level from
Thursday, and the countdown to 2 December 2027. Nothing else, ever. Start at the café:
www.aigovops-foundation.com.

## 3 · The band copy on the site (live in this PR)

**Heading:** The Tuesday Letter.
**Line:** One story from the practice, the week's marks by level, the countdown to 2 December 2027.
No other sends, ever.
**Fine print:** Delivered by Substack. Unsubscribe any time.

## 4 · Plausible goals (Site settings → Goals → add custom event)

Already fired by the pages; add each as a custom-event goal so they show in the dashboard:

- `Home: Ten minutes` — the ten-minutes button
- `Cafe: 100` · `Cafe: 200` · `Cafe: 300` · `Cafe: 400` · `Cafe: not sure` — the five doors
- `Gate Check: footer` — the constant CTA
- `Founder: Newsletter` — the newsletter links
- `Library: step 1` · `Library: step 2` · `Library: step 3`
- `Open source: step 1` · `Open source: step 2` · `Open source: step 3` · `Open source: cafe`
- `Community: step 1` · `Community: step 2` · `Community: step 3`

UTM convention on every outbound link to the café or Substack: `?src=` for links inside the estate
(`site-newsletter`, `welcome`, `letter`, `linkedin`, `thursday`), `utm_source=` on Substack itself.

## 5 · Recommendation asks — six candidates, pick five (Ken's voice)

Real, current AI-governance Substacks found today; check each is still active before writing:

- AI Governance Today — Anmol Kumar — https://aigovernancetoday.substack.com/
- AI Policy Weekly — https://aipolicyus.substack.com/
- Enterprise AI Governance — Oliver Patel — https://oliverpatel.substack.com/
- AI Governance Lead — https://aigovernancelead.substack.com/
- AI Oversight — https://aioversight.substack.com/
- All Tech Is Human — https://alltechishuman.substack.com/

**The ask (one paragraph, send from Ken's Substack account via Recommendations, or by email):**

Hi <name> — I write the Tuesday Letter for the AiGovOps Foundation, a 501(c)(3) that keeps a
hundred verified AI-harm cases and teaches a practice built on OVERT, the open runtime-trust standard.
We just opened a new front door — a café where people say what brought them in and leave with a
signed receipt — and I'm choosing five newsletters to recommend to our readers. Yours is one. I'd
recommend you regardless; if you'd recommend us back, we'd be glad of it. Here's a recent letter so
you can judge the tone: <link>. — Ken

## 6 · The Thursday invitation (reuse)

`practice/docs/practitioners/STRANGER-INVITE.md` — every attendee sends it to one person for the
following Thursday. Unchanged.
