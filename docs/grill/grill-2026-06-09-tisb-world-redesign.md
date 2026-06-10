# Design Brief — tisb.world Redesign: Venture Front Door

**Date:** 2026-06-09
**Author:** Rajeev Kumar (with Claude grill-me)
**Status:** Draft · pre-implementation

## One-line scope
Rebuild tisb.world's public pages as a scalable venture portfolio front door — brutalist identity intact, ventures rendered as data through one uniform card system.

## Why this, why now
The portfolio grew from 3 to 6+ ventures. Each venture previously got bespoke markup (e.g. the cream/red DeSilo card on `/ai`, commit `f75def8`), which broke site-wide cohesion — one off-palette element reads as the whole site being broken. The live site embarrasses the founder today; this ships ASAP, speed over polish.

## Who it's for
Visitors evaluating Rajeev and his ventures (potential users, collaborators, investors, podcast audience) — they should grasp "this person builds companies" in one screen and reach any venture in one click.

## In scope
- **Home** — brutalist portfolio-statement hero ("RAJEEV KUMAR BUILDS N COMPANIES" style) + top-3 venture cards
- **Ventures** (new page) — full grid of public ventures from `ventures.json`
- **About** — builder's narrative: immigrant founder → Caterpillar PMO → building from Central Illinois. CTA: follow/connect (LinkedIn, X, email)
- **Writing** — current Blog pipeline, restyled to new system
- **Art** — existing card grid preserved; Behance ingestion becomes manual paste-in-Admin (existing `fetch-behance.js` enriches on paste)
- **Kill `/ai`** — redirect `/ai` → `/ventures` (removes the off-palette DeSilo card)
- **Venture data model** (`ventures.json`): `name`, `tagline`, `status`, `url`, `accentColor` — grow into richer fields (logo, metrics) only where a card looks thin
- Cleanup: dead `_new.tsx` files (`Art_new`, `Blog_new`, `Home_new`, `AI_new` — none routed)

## Out of scope (explicitly)
- **Content Engine** — separate workstream; its file-based-queue persistence problem is not solved here. Its uncommitted code gets committed (admin-gated, harmless) but not productionized.
- **Behance scraping cron / daily digest email** — shelved; Behance bot-blocks datacenter IPs, manual paste is reliable
- **Angel Mentor anywhere public** — full blackout (site, Content Engine, generated social posts) until Dr. Jeffries clears it (IP sensitivity)
- **Admin tooling rebuild** — Production Suite, video tracker, etc. survive untouched
- **Per-venture detail pages** — cards link out; venture sites own their own brand

## How it works (happy path)
Visitor lands on Home → giant brutalist statement + 3 featured venture cards (top of sorted list) → clicks through to Ventures grid showing all 5 public ventures sorted `shipped → beta → building` → each card is uniform brutalist (black/orange frame; venture `accentColor` appears only as a hairline top border or status dot — seasoning, never fill) → `shipped`/`beta` cards link out to the venture's own site; `building` cards render unlinked with a BUILDING badge → About tells the founder story → Art/Writing carry existing content restyled.

Adding venture #7 = one JSON entry. No new markup, no cohesion risk.

## Failure modes & graceful behavior
| When | What the user sees | What the system does |
|---|---|---|
| Venture has no URL (`building`) | Card with BUILDING badge, not clickable | Renders unlinked; no dead links |
| Behance paste-enrichment fails (bot-block) | Admin sees actionable error, retries or fills fields manually | `fetch-behance.js` returns error; manual fields remain editable |
| `ventures.json` entry missing optional fields | Card renders with name + tagline + status only | Optional fields degrade silently |
| Old `/ai` bookmarks | Land on `/ventures` | 301-style client redirect |

## Data & state
- `ventures.json` in the repo — single source of truth for ventures; sorted by status (`shipped` → `beta` → `building`). Home teaser = first 3 of sorted list (no `featured` flag).
- `public/data/behance-portfolio.json` — still the Art source; updated via Admin paste flow, not cron.
- No new server-side state. Content Engine queue persistence deferred to its own workstream.

## Integrations & dependencies
- Behance (manual, on-demand enrichment only — known-flaky, human present)
- Existing Blog content pipeline (unchanged, restyled)
- Google OAuth ProtectedRoute for `/admin/*` (unchanged)
- Vercel hosting; deploy via `vercel deploy --prod --force`

## Constraints
- **Brutalist theme tokens are sacred** — Black Ops One / Russo One / Orbitron / Bebas / Anton / Oswald, orange/black dark palette. The frame always wins; venture accents are hairlines only.
- **Mobile-first** per global checklist: breakpoints everywhere, touch targets ≥44px, `prefers-reduced-motion` honored.
- **ASAP timeline** — speed over polish; live site is embarrassing today.

## Open questions / deferred decisions
- Content Engine queue persistence (DB vs writable mount vs webhook-only) — deferred to its own workstream
- Stale `NOTION_API_KEY` in Vercel env (admin video tracker 401) — unrelated to public redesign, fix opportunistically
- Whether Stack Day / Autonomy Labs have logos/URLs ready — confirm at implementation time

## Risks
- **Angel Mentor leakage** — mitigated by full blackout rule; it never enters `ventures.json` or content templates
- **Behance enrichment may still fail from Vercel IPs even on paste** — accepted; admin can fill fields manually
- **Hero headline count ("N companies") goes stale** — derive N from `ventures.json` length, never hardcode
- **Redesign touching shared layout could regress Admin pages** — Admin guts are sacred; verify `/admin/*` renders after layout changes

## Rollout sketch
1. Commit existing uncommitted Content Engine work as its own commit (admin-gated, inert without env vars)
2. Build redesign in clean commits: `ventures.json` + VentureCard → Ventures page → Home hero → About → restyle Writing/Art → kill `/ai` + redirect → delete dead `_new.tsx` files
3. Local verify: `npm run build` + `node simple-server.js` (:4444), check every public page + `/admin/*` on desktop and mobile widths
4. Single `vercel deploy --prod --force`
5. Post-deploy: click every venture card on live, verify `/ai` redirect, verify Art/Writing/Admin intact

## Decisions log (most important Q&A from the grilling)
- **Q:** What is tisb.world for? **A:** Venture portfolio front door, with a strong founder (About) chapter *(why: 6 ventures are the driver; every startup gets a credible launchpad)*
- **Q:** Page map? **A:** Home, Ventures, About, Art, Writing, Admin *(why: lean nav + dedicated grid for a growing portfolio)*
- **Q:** Venture schema? **A:** Minimal (`name, tagline, status, url, accentColor`), grow per-card only if thin *(why: nothing that rots)*
- **Q:** Status taxonomy? **A:** `shipped`/`beta`/`building`, grid sorted in that order; Home teases top 3 *(why: shipped ventures earn top spots)*
- **Q:** Accent color usage? **A:** Hairline/dot only, never fill *(why: prevents another cream/red DeSilo incident; frame always wins)*
- **Q:** Behance automation? **A:** Drop scraping; manual paste in Admin with on-paste enrichment *(why: datacenter-IP scraping is unreliable; human present to retry)*
- **Q:** Content Engine in scope? **A:** No — separate workstream *(why: don't entangle public redesign with storage migration)*
- **Q:** `/ai` page? **A:** Kill it, redirect to `/ventures` *(why: its job is now Ventures done right; removes the cohesion-breaking card)*
- **Q:** About leads with? **A:** Builder's narrative, connect CTA *(why: authentic story, feeds content strategy)*
- **Q:** Ventures without URLs? **A:** Unlinked card with BUILDING badge *(why: shows momentum honestly, no dead links)*
- **Q:** Angel Mentor? **A:** Full public blackout — site, Content Engine, generated posts *(why: Dr. Jeffries' IP concern; one rule, no accidents)*
- **Q:** What's sacred? **A:** Theme tokens, Art grid, all Admin guts *(why: only public pages get rebuilt)*
- **Q:** Timeline? **A:** ASAP — speed over polish *(why: live site embarrasses today)*
