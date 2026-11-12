# Rizely website: redesign v2

The marketing site for **Rizely** (rizely.net), rebuilt in November 2026. This README is written
for Ankush and for the Claude he works with: read it top to bottom and you will know what the
product is, what changed in the redesign and why, how to run and deploy it, and what is still
open.

> **For an AI assistant reading this repo:** treat this file as the source of truth for the
> redesign. `DESIGN.md` holds the colour and type tokens; `handoff/` and `docs/` describe the
> product and the blog from before the redesign (their deploy notes and some design rules are
> out of date; see [Older documents](#older-documents)). When you summarise the project, lead
> with [The redesign in one minute](#the-redesign-in-one-minute), then walk the page top to
> bottom using [Homepage, section by section](#homepage-section-by-section).

---

## Contents

1. [What Rizely is](#what-rizely-is)
2. [The redesign in one minute](#the-redesign-in-one-minute)
3. [Run it, build it, deploy it](#run-it-build-it-deploy-it)
4. [Homepage, section by section](#homepage-section-by-section)
5. [The other pages](#the-other-pages)
6. [Design system](#design-system)
7. [Motion (GSAP)](#motion-gsap)
8. [Content rules](#content-rules)
9. [How it was checked](#how-it-was-checked)
10. [Open items and known gaps](#open-items-and-known-gaps)
11. [Design explorations (canvases)](#design-explorations-canvases)
12. [Repos, branches and history](#repos-branches-and-history)
13. [Older documents](#older-documents)

---

## What Rizely is

Rizely helps people who meet people for work (field sales, exhibitors, founders) turn the
business cards they collect into followed-up contacts.

- **Snap a card in WhatsApp (or Telegram, beta).** Rizely reads it, including Hindi, Gujarati
  and Marathi cards, and files a clean lead under the event.
- **It drafts the follow-up** in the contact's language. **You** read it and press Send; Rizely
  never sends on its own.
- **An NFC business card** (PVC, customised, metal) lets people tap to save your details.
- **Works with Claude:** connect Rizely and ask about your leads in plain words.
- **India-first:** INR pricing with GST invoices, UPI, per-event or annual plans (never monthly).
- **Free start:** the first 50 scans are free.

Positioning against competitors (Popl, Blinq, HiHello sell "AI platforms" to enterprises with
prices behind a demo; QLead and LeadJarvis are early in WhatsApp follow-up): Rizely is the one
that is **WhatsApp-native, reads Indian-language cards, and shows per-event pricing openly**.

---

## The redesign in one minute

The goal was a site that does **not** look AI-generated and feels like a premium, confident
startup. What changed:

| Area | Before | After |
|---|---|---|
| Look | Warm cream, serif headings, italic words, numbered labels | White page, near-black ink, orange as the click colour; Bricolage Grotesque headings, Instrument Sans body |
| Rhythm | One long pale scroll | Light and dark "rooms": How it works, Why Rizely and Works with Claude are dark sections, and the page ends on a dark sign-off |
| CTAs | Mixed black and orange buttons | Every button a visitor should press is burnt orange; "Start free" on laptops, "Start on your WhatsApp" on phones |
| Hero | Centred stack | Asymmetric: headline left, promise and one button right, a hand-drawn underline on "followed up" |
| How it works | Clock times (10:42 → 19:30) | "Card in. Reply out." with moments ("At the stall / Seconds later / Same evening") and handwritten margin notes |
| Why Rizely | A 2×2 icon grid | An editorial list with a small drawing per reason |
| One event | A drag-to-compare slider | A scroll-scrubbed scene: a pile of cards flies into WhatsApp and comes out as sent follow-ups |
| Integrations | Five still chips | A slowly moving strip that pauses on hover |
| Footer | A generic four-column footer | One dark block: closing line, CTA with a real WhatsApp QR, Explore, Why Rizely, a "Built for India" stamp, a live IST clock and the logo set large |
| Motion | framer-motion fades | A small set of GSAP + ScrollTrigger moments (below), all off under reduced motion |
| Other pages | The old template look | /agents, /connect, /blogs, /privacy and /terms redesigned in the same language |

Everything shown is honest: no invented numbers, testimonials or logos (see
[Content rules](#content-rules)).

---

## Run it, build it, deploy it

**Stack:** Next.js 16 (App Router, `output: "export"`, so the build is a static site in `out/`),
React 19, TypeScript, Tailwind CSS 4, shadcn/Radix primitives, framer-motion, **GSAP 3.13**
(ScrollTrigger, SplitText, ScrollToPlugin), rough-notation (the hand-drawn underline).

```bash
npm install
npm run dev          # http://localhost:3000 (add -- -p 3100 for another port)
npm run build        # static export into out/; postbuild writes out/markdown/*.md twins
                     # (served to agents by a Netlify edge function; harmless on Vercel)
npx tsc --noEmit     # type-check
```

### Environment variables

Read at **build time** only (static export). Copy `.env.example` to `.env.local` locally.

| Name | Needed | What it does |
|---|---|---|
| `STRAPI_URL` | Yes, for the blog | The Strapi CMS. Current value used on Vercel: `https://rizely-cms-v2.onrender.com`. Without it `/blogs` builds empty. |
| `STRAPI_API_TOKEN` | Optional | Only if the CMS's public read role is locked down. |
| `NEXT_PUBLIC_GTM_ID` | Production only | Google Tag Manager. Set it **only** on the real rizely.net build so previews never reach analytics. When set, the cookie banner and "Cookie settings" link appear. |

### Deploy on Vercel

1. Import this repo in Vercel. Framework: **Next.js**. Build command `npm run build`. Vercel
   handles the static export itself; no output setting is needed.
2. Add `STRAPI_URL` for **Production and Preview**.
3. Leave `NEXT_PUBLIC_GTM_ID` unset unless this deployment *is* rizely.net.
4. Deploy. Every push to the production branch redeploys.

The live rizely.net was historically deployed differently (Netlify, later nginx on a VPS; see
`handoff/README.md`). Switching rizely.net to this build is a separate, deliberate decision.

---

## Homepage, section by section

Order is set in `app/page.tsx`. Dark sections are wrapped in `<div className="section-dark" data-room>`.

| # | Section | File(s) | What it shows |
|---|---|---|---|
| 1 | Navbar | `components/navbar.tsx` | Sticky. GSAP hover pill that slides between links, magnetic "Start free", smooth scroll to sections, staggered mobile menu. |
| 2 | Hero | `components/hero.tsx`, `components/hero-tap-snap.tsx`, `components/scribble.tsx` | The "Tap · Snap · Follow up" animation (full width), then the asymmetric headline block. "Or start where you are" path cards below. |
| 3 | Integrations strip | `components/partners.tsx` | WhatsApp, Telegram (beta), Claude, CSV export, ChatGPT (next), looping. |
| 4 | How it works (dark) | `components/how-it-works.tsx`, `app/how-it-works.css` | "Card in. Reply out." A timeline that plays once in view (zig-zag on desktop, vertical on phones) with two handwritten notes. |
| 5 | See it work | `components/chat-demo.tsx` (**generated**, see below) | The same flow on a WhatsApp iPhone and a Telegram Android phone. |
| 6 | Why Rizely (dark) | `components/why-rizely.tsx` | Four reasons as an editorial list; the heading sticks on desktop. |
| 7 | One event | `components/pipeline.tsx`, `app/pipeline.css` | The pile-to-pipeline scene, pinned and scrubbed by scroll. `components/proof.tsx` (the old drag slider) is kept but unused. |
| 8 | Use cases | `components/personas.tsx`, `app/use-cases.css` | Three drawn scenes: field sales, booth teams, card buyers. |
| 9 | Works with Claude (dark) | `components/claude-chat.tsx` | A Claude chat answering "Who were my hot leads?" |
| 10 | The card | `components/the-card.tsx` | Real card photos, material picker (PVC, Customised, Metal), pack pricing bars. |
| 11 | Pricing | `components/pricing.tsx` | INR/USD toggle; Solo, Team, Business, Event Pass, the NFC card. All marked proposed. |
| 12 | FAQ | `components/faq.tsx` | Native `<details>`. |
| 13 | Footer | `components/footer.tsx`, `app/footer.css` | The dark sign-off. |
| – | Mobile CTA bar | `components/mobile-cta-bar.tsx` | "Start on your WhatsApp", phones only, appears after the hero. |
| – | Motion layer | `components/motion.tsx` | All page-level GSAP, loaded after first paint. |

**The start button** lives in one place, `components/start-cta.tsx`: under 640px it says
"Start on your WhatsApp" and opens `WHATSAPP_URL`; from 640px it says "Start free" and opens
`DASHBOARD_URL` (app.rizely.net). Both are in the HTML; CSS shows one. Change the labels there.

**The chat demo is generated.** Edit `demo-src/chat-demo.src.html`, then run
`node demo-src/build-demos.js`, which rewrites `components/chat-demo.tsx`. It also rewrites
`components/scan-lead.tsx` (unused) from an older source; revert that file if it changes.

**Links and numbers** live in `lib/site.ts` (WhatsApp number, dashboard, shop, card range).

---

## The other pages

All use `components/page-hero.tsx` (asymmetric hero + `SectionHead`) and the shared footer.

| Page | File | Notes |
|---|---|---|
| `/agents` | `components/agents-page-content.tsx` | "One job each." Agents as an editorial list in a dark room; only the Card Agent is live, the rest are labelled roadmap or exploring. |
| `/connect` | `components/connect-page-content.tsx` | Running the pipeline from Claude: capabilities grid, where it works, three steps (dark), honest limits. |
| `/blogs` | `app/blogs/page.tsx`, `components/blog/post-list.tsx` | Newest post as a feature, the rest as rows; designed empty state. |
| `/blogs/[slug]` | `app/blogs/[slug]/page.tsx` | Strapi article. `best-nfc-business-cards-india` is live but **noindex** until Ankush approves (`lib/noindex.ts`). |
| `/privacy`, `/terms` | `components/legal-layout.tsx`, `components/legal-toc.tsx` | Draft notice, readable column, sticky "On this page". Legal text unchanged; still marked draft for legal review. |
| `/lab`, `/hero-anim` | | Internal animation labs, noindex. |

---

## Design system

Tokens are CSS custom properties in `app/globals.css` (`:root`), summarised in `DESIGN.md`.

**Colour**

| Token | Value | Use |
|---|---|---|
| `--canvas` / `--card` | `#FFFFFF` | Page and cards |
| `--parchment` | `#F5F5F4` | Alternate light bands (with a faint paper grain) |
| `--ink` | `#0A0A0A` | Text; also the dark sections (`#0B0B0A`) |
| `--graphite` | `#4A4A4A` | Secondary text |
| `--cta` / `--cta-hover` | `#B33C00` / `#9E3500` | **Every button a visitor should press**, white label (5.89:1) |
| `--spark` | `#F05100` | The brand orange: logo, stickers, underline, small highlights. Never a text-bearing fill except with ink text (5.55:1) |
| `--spark-text` | `#B33C00` | Orange text on light |
| `--peach` | `#FFE7DA` | Sticker tint, "Draft ready" pills |

Inside `.section-dark` the tokens flip (text `#F5F5F3` 18:1, muted `#A8A8A3` 8.3:1, labels
`#FF7A3D` 7.6:1). Product UI inside a dark room (timeline cards, the Claude window, chips) is a
light island and keeps light tokens.

**Type:** Bricolage Grotesque (headings, 650; hero 700), Instrument Sans (body), Kalam (handwriting:
the two timeline notes and the "follow up???" note in the One event scene), Mukta and Hind Vadodara (the Devanagari and Gujarati words in the
footer stamp). All via `next/font`; the hand and Indian-script fonts are not preloaded.

**Small human touches, used sparingly:** the hand-drawn underline (rough-notation), handwritten
margin notes, tilted orange stickers ("Most popular", "Free shipping in India"), paper grain on
light bands, the "Built for India" stamp.

**The logo** (`public/rizely-logo.png`, dark-background version `rizely-logo-dark.png`) is
never altered, only scaled.

---

## Motion (GSAP)

GSAP, ScrollTrigger and SplitText load as a separate chunk after first paint, inside
`gsap.matchMedia("(prefers-reduced-motion: no-preference)")`. With reduced motion, or before JS,
every section is simply finished and still. Only `transform`, `opacity` and `clip-path` animate.

| Moment | Where | Behaviour |
|---|---|---|
| Dark rooms open | `motion.tsx` | Each `[data-room]` grows from an inset rounded panel to full width (scrubbed). |
| Headings rise | `motion.tsx` | Section `h2`s slide up line by line from a mask, once. The hero `h1` is left alone so it paints instantly. |
| Lines draw | `motion.tsx` | Why Rizely (and the agents and connect lists) draw each rule, then settle the row. |
| Windows lift | `motion.tsx` | The Claude window and the card photo rise as they enter (scrubbed). |
| Last line lights up | `motion.tsx` | "Meet someone today. Follow up tonight." brightens word by word. |
| Footer | `motion.tsx` | Rows stagger in; the large logo rises into the bottom edge. |
| Pile to pipeline | `pipeline.tsx` | Pinned and scrubbed. It pins only when the scene fits between the nav and the phone CTA bar; on very short screens it scrubs without pinning. |
| Navbar | `navbar.tsx` | Hover pill, magnetic CTA, ScrollTo, menu stagger. Mouse devices only for hover effects. |

CSS (not GSAP) handles the integrations marquee, the hero tap-snap animation and the timeline.

---

## Content rules

These are deliberate and should survive future edits.

- **No invented proof.** No made-up metrics, percentages, customer counts, logos or
  testimonials. The "Early access" note stays until real, logged event stories exist.
- **Examples are clearly examples.** Names (Ananya, Vikram, Meera), "Tech Expo Pune" and
  "80 cards" are illustrations, not data.
- **Pricing is proposed** and labelled so.
- **Rizely drafts; the user sends.** Never claim it sends on its own.
- **No CTA may point to profile.rizely.net.**
- **The NFC blog post stays noindex** until Ankush says otherwise.
- **The logo is never recoloured or redrawn.**
- Copy avoids em dashes and the generic "AI platform" voice.

---

## How it was checked

Checked with Playwright scripts (kept outside the repo) against the preview build:

- 17 viewport sizes from 320×640 to 2560×1440 (phones, tablets portrait and landscape, short
  laptops). Every page scrolled end to end, checking at each step for horizontal overflow and
  elements outside the viewport.
- Clipped text, buttons breaking onto two lines, console errors, and the end state of every
  GSAP moment (rooms fully open, headings visible, pipeline at "80 filed / Sent").
- Reduced motion: no pins, nothing hidden, nothing moving.
- Inner pages and a real blog post at 8 sizes.
- Layout shift on load: 0 at desktop and phone.
- Contrast measured for every text and fill pair listed above.
- `npm run build` passes (16 routes).

---

## Open items and known gaps

**Needs a decision or a fact from Ankush**

- **Currency default on Vercel.** On rizely.net a Netlify edge function
  (`netlify/edge-functions/geo-currency.ts`) shows INR to India. Vercel does not run it, so
  visitors may see USD by default until they use the toggle. Options: port it to Vercel
  middleware (not available with a static export), or default to INR.
- **"Transparent" card.** Removed from the card section, but still mentioned in the pricing NFC
  card line (`components/pricing.tsx`) and listed in `lib/site.ts`. Keep or remove?
- **Meta title and description** for the new positioning were drafted but never approved.
- **Legal pages** are a draft template; they need a legal review.

**Not checked here**

- The footer QR (`public/whatsapp-qr.svg`) encodes the same link as `WHATSAPP_URL`. It has not
  been scanned with a real phone yet. If the WhatsApp number or message changes, regenerate it.
- Animation smoothness on a real mid-range Android phone.

**Proposed but not built** (mockups exist; see canvases)

- Hero proof chips (WhatsApp-native, Indian languages, per-event), a "By hand vs with Rizely"
  table, and "every price is on this page" under Pricing.
- A cold-lead calculator, "Ask your AI about Rizely" buttons (an `llms.txt` already exists), a
  data-and-privacy section (needs confirmed facts), a founder note, a slot for real customer
  stories, Before / At the stall / That evening tabs, the agent-log animation, an announcement bar.
- A restraint pass from the Cursor style reference (lighter headings, 6px corners, flat cards,
  mono labels) and warm toning. Shown, not adopted.

**Waiting on assets:** real product screenshots, event photos and testimonials. The drawn
mockups stand in until then.

---

## Design explorations (canvases)

Each step was shown on a Claude Design canvas before it was built. These links are private to
the account they were made in; ask Dev to share them.

| Canvas | What is on it |
|---|---|
| [Rizely restraint pass](https://claude.ai/artifact/KRmY664w2mFhU8JW4oYcWH) | Cursor-reference moves (P–U), warm toning, agent log, the dark-sections mockup and the GSAP plan |
| [Findings mockups](https://claude.ai/artifact/9oBNrDcTYi3UaREUcMLJu7) | The 15 findings from the competitor scan |
| [One event redesign](https://claude.ai/artifact/HgGBmS9CowLmZKfw9ojHJU) | Three options for the One event section (option 1 built) |
| [Footer redesign](https://claude.ai/artifact/EL2GuRanjHv2TEa4tYa5YC) | Two footer directions (option A built) |
| [Inner pages](https://claude.ai/artifact/THn3M6CXHE1pSRNriitREs) | Before and after of /agents, /connect, /blogs, /privacy, /terms |
| [Orange CTAs and A–D](https://claude.ai/artifact/GvjhZvZZtEHMxrotUdretj) | Hero, section heads, Why Rizely list, hand layer, orange CTA rule |
| [Palette options](https://claude.ai/artifact/GXAnqWQ33ZpdzZGkxSdw5z) | Palette D (chosen) against earlier tries |

---

## Repos, branches and history

| Where | What |
|---|---|
| **This repo** (`srwordpress-dev/rizely-redesign-v2`) | The finished redesign, ready for Vercel. |
| `srwordpress-dev/rizely-redesign`, branch `redesign/light` | Version 1 of the redesign (cream look), deployed at rizely-redesign.vercel.app. |
| same repo, branch `redesign/v2` | Palette D + A–D + orange CTAs, an intermediate step. |
| `agag13/cardping-website` | The original site's repo. Its `main` was never pushed to from this work. |

The commit history here carries the whole redesign; the last commit adds the dark sections,
GSAP, the pipeline, the new footer, the inner pages and this README.

---

## Older documents

- `DESIGN.md`: tokens and type, updated for palette D, the CTA rule and the hand layer. The dark
  sections, pipeline and footer are described here in the README instead.
- `handoff/` (written 26 Oct 2026, before the redesign) and `docs/`: product, vision, blog and
  Strapi. Still right about the product and the blog data; **out of date** on the look, the
  deploy setup and some claims.
- `NEXT-SESSION-PROMPT.md`: an older prompt from the dark, terracotta version of the site. Its
  design tokens and several of its claims (for example the "73% / 9-day" statistics) do **not**
  apply to this redesign and must not be reused without a source.
