# Aligning with Glacis and Joe Braidwood

Proposal for Decision 11 (PRD v3 §8). Status: **decide**. Nothing here has been sent; the draft note at
the end is for Ken's voice and Bob's yes.

## 1. Where things actually stand (from the repo, not from memory)

- **13 May 2026** — Joe's letter, *Being OVERT about Beacon*: register a profile, attribute, position the
  Foundation downstream of OVERT rather than as a parallel standards body.
- **14 May 2026** — ADR-0001 accepted all three asks and went further: invited Glacis as **Founding
  Open-Source Curator / Project Steward** and Joe as **Launch Advisor** through the Beacon v1 window;
  published STANDARDS.md ("the Foundation does not issue standards"), STEWARD.md, ENGAGEMENT.md as v0.1
  placeholders with the pen handed to Glacis; retired "AiGovOps Foundation Protocol"; ruled out a
  standards-issuing path, "a certification program", and a commercial product.
- **Since** — profile `aigovops-beacon.v1` remains *registration in progress, pending Glacis sign-off*.
  STEWARD.md is at v0.2, "awaiting Glacis's revision". ENGAGEMENT.md's eight questions are unanswered.
  OVERT moved to 1.1 (June). The August 10x plan named the dependency its number-one risk and asked the
  founders to "decide the OVERT/Glacis question: is the receipt your standard or theirs?"
- **v1 PRD (10 Sept)** — "compatible, independent, not dependent"; publish conformance first, then talk.

Four months of silence on a seat we offered is the fact to name. Either the seat is real and we make it
cheap for Joe to say yes to one thing, or it is not and we should say so in an ADR.

## 2. The position: lock in, and be useful

**The receipt is theirs; the practitioners are ours.** OVERT 1.1 is the normative receipt envelope;
Beacon registers the profile; the Foundation is one implementation and the community on-ramp, exactly
as STANDARDS.md says. Nothing the Foundation publishes requires a Glacis account or service to verify
(v1 Decision 3), and nothing Glacis sells is undercut by anything the Foundation gives away.

| | Glacis | AiGovOps Foundation |
|---|---|---|
| Role | Steward of the standard; runtime vendor (Arbiter) | Implementer; community; training; public-interest reference implementations |
| Sells | Starter and pro plans; healthcare, fintech, insurance | Nothing. Free credential, free tools, free corpus |
| Customers | Funded operators who need AAL-3/4 in production | Nonprofits, rural and Indigenous programmes, universities, county IT, students — and the practitioners who will later work at Glacis's customers |
| Certifies | Nothing itself; defines how systems are assessed and who may attest | People — by performance, host-marked, ledger-minted |
| Standard | Writes it | Conforms, crosswalks, contributes gaps upstream with case numbers |

The FinOps / CNCF / Linux Foundation pattern the Foundation cites in ENGAGEMENT.md is precisely this
split: a specification stewarded by one party, a practitioner community and credential run by another,
neither able to capture the other.

## 3. Why the ladder is the alignment artifact

OVERT's four AALs are a ladder for *systems*. The practitioner ladder is a ladder for *people* with the
same four rungs: a 100 can write policy as code (AAL-1 pattern), a 200 can produce process records of
their own system (AAL-2), a 300 can run automated monitoring with holds and coverage (AAL-3), a 400 can
verify a stranger's evidence independently without content access (AAL-4). A practitioner pipeline
shaped like the standard is the most useful thing a community can hand a standard's steward: every 300
is a person who can bring an operator to the level where Arbiter, or Beacon, or any conformant runtime,
is worth buying or running.

The two-sentence rule that keeps it honest, in OVERT's own terms: *a practitioner level describes the
person's demonstrated practice on reference scenarios; a system's AAL is a conformance claim made by
that system's evidence and assessed as OVERT specifies.* We ask Joe to read that sentence and, if he
agrees, to say so in the criteria document.

## 4. The five asks, cheapest first

1. **Sign the profile.** One decision on his side unblocks every "conformant" claim on ours. If there
   is a reason it has not happened — a fee, a test-vector gap, a 1.0→1.1 migration — we want to hear it
   and fix our side.
2. **Read the credential criteria** for each level before they ship, in the Review Circle role STEWARD.md
   already describes. Co-signature, not approval: the Foundation owns the credential; the steward
   confirms the AAL mapping is faithful.
3. **Treat the level 100 page as the Beacon v1 launch artifact** — the Launch Advisor seat was scoped to
   "get v1 out the door"; the smallest, most filmable v1 is a stranger getting a receipt in ten minutes.
4. **A joint story** when the first outside party verifies a bundle offline — the standing line is
   *OVERT is the standard, Glacis is one implementation, we are another, and here are the people who can
   run either.*
5. **Later, and his to answer:** whether the community's 400s could constitute a verification pool under
   OVERT's Independent Attestation Provider rules. Out of the ninety days by the exclusion list; asked now
   so the answer shapes P3.

## 5. What we offer without being asked

- Attribution stays where ADR-0001 put it; STANDARDS.md stands.
- No Foundation release that touches the standard ships without the Review Circle seeing it — the
  "no surprises" habit, kept.
- Every corpus case that exposes a gap in OVERT's six domains goes upstream as an issue against the spec
  with the case number and the plain-words gate. Public-interest cases are where a standard written for
  funded operators is most likely to have gaps.
- The Foundation never resells, never runs a hosted service, never operates an IAP in the ninety days,
  and never claims an AAL above what its own evidence shows.

## 6. Sequence

Publish the profile first (his signature), then the credential criteria (our text, his reading), then
talk in public. v1 Decision 3's "publish first, then talk" holds — the profile is the publication.

## 7. The note — draft for Ken's voice, not sent

> Joe —
>
> Two things since May, and one ask.
>
> First, we have read 1.1 and we are building to it. Beacon's gate, receipt and verifier target OVERT
> 1.1; the profile is `aigovops-beacon.v1`; the ask is the one from May — a signature on the
> registration. If something on our side is holding it, tell us and we will fix it this month.
>
> Second, we are turning the community into a practitioner ladder with four rungs that map to your four
> AALs — someone at 100 can write policy as code, at 400 can verify a stranger's evidence without
> seeing content. It is a credential for people, not systems, free to attempt, minted as a receipt
> anyone can verify offline. We would like you to read the criteria before they ship, in the Review
> Circle seat STEWARD.md offered you, and to tell us if the mapping is faithful. Not approval —
> reading.
>
> The ask: sign the profile. Everything else can wait for a call.
>
> — Ken

**Rules for sending:** Bob's yes; Ken's edit; from Ken's Foundation address; no attachments; the PRD
link only if Joe asks. Recorded as a `design mark` step when sent.
