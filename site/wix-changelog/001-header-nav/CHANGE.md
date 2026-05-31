# 001 — Header / Nav

- **Status:** planned
- **Created:** 2026-05-30 17:00 PDT
- **Author:** bobrapp
- **Spec:** ../../WIX-MAPPING.md § 1. Header / Nav
- **Wix Site History timestamp (before edit):** _to be filled when BEFORE.png is captured_
- **Wix Site History timestamp (after edit):** _to be filled after AFTER.png_

## Target state (from WIX-MAPPING.md)

- Light header, sticky on scroll, ~64px tall
- Logo: ◆ AiGovOps Foundation ("Foundation" in muted weight)
- Right nav links: What · Pillars · Programs · Tools · Events
- Primary dark Contact button at far right

## Current state (before)

- Header height ~88px, not sticky
- Logo: shield icon + "AiGovOps Foundation" (full weight, two lines)
- Right nav: HOME / BLOG / EVENTS
- No Contact button

## Exact edits to perform in Wix Harmony

1. Select Header strip, Settings, Scroll behavior: Sticky
2. Header strip height: 64px (desktop), keep responsive defaults
3. Background: white (#FFFFFF), bottom border 1px #E5E7EB
4. Logo block: keep mark, restyle text — AiGovOps semibold, Foundation regular weight 400, color #6B7280
5. Replace nav menu items:
   - Remove: HOME, BLOG, EVENTS
   - Add (in order): What (#what), Pillars (#pillars), Programs (#programs), Tools (#tools), Events (/events)
6. Add Button element to right of nav:
   - Label: Contact
   - Style: filled, background #0B1220, text #FFFFFF, radius 6px, padding 10px 16px
   - Link: #contact

## Why

Matches Beacon-style header in the live reference build and aligns nav IA with the redesigned index.html section anchors.

## Rollback

See ROLLBACK.md in this folder.
