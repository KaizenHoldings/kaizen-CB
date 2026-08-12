---
name: Kaizen Casa de Bolsa
description: Institutional navy-and-white brokerage system where evidence is published, not promised.
colors:
  navy: "#0E3048"
  blue: "#205890"
  blue-2: "#3E7CB0"
  tint: "#EAF1F8"
  tint-2: "#DBE8F4"
  pearl: "#F5F7FA"
  white: "#FFFFFF"
  ink: "#1B2A3A"
  muted: "#5B6B7E"
  line: "rgba(14, 48, 72, 0.10)"
  emerald: "#0E9F6E"
  emerald-hover: "#0B855C"
  positive: "#1B8A5A"
  negative: "#C0392B"
  positive-on-navy: "#5FE0A6"
  negative-on-navy: "#FF9C8E"
  chart-light: "#9DC2E6"
typography:
  display:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 3.1vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 1.55rem + 2.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.35rem + 1.9vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 1.15rem + 1vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  card-title:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body-small:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  chip-sm: "10px"
  chip: "12px"
  card: "16px"
  panel: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section: "clamp(4rem, 8vw, 7.5rem)"
  card: "1.5rem"
  row: "1.25rem"
components:
  action-button-light-primary:
    backgroundColor: "transparent"
    textColor: "{colors.blue}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "clamp(0.75rem, 1vw, 0.95rem) clamp(1.25rem, 2.4vw, 2.25rem)"
    height: "2.75rem"
  action-button-light-primary-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "clamp(0.75rem, 1.4vw, 1rem)"
  action-button-light-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  action-button-dark-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  action-button-blue-accent:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
  download-button:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    size: "clamp(2.75rem, 2.55rem + 0.5vw, 3.125rem)"
  download-button-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
  icon-chip:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.blue}"
    rounded: "{rounded.chip}"
    size: "2.75rem"
  icon-chip-sm:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.blue}"
    rounded: "{rounded.chip-sm}"
    size: "2.25rem"
  content-tag:
    typography: "{typography.card-title}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.625rem"
  publication-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  header-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "0.5rem 0.125rem"
---

# Design System: Kaizen Casa de Bolsa

> **Binding external authority.** `BRAND.md` and `BUTTON_SYSTEM.md` at the project root are the client's own brand book. They own the palette, the two type families, logo usage, shadow character, iconography, tone, and the two authorized button behaviours. This file **records how that pinned world landed in code** — the token layer, the composition rules, the type ramp in use, the named patterns. It does not decide those things and must never contradict them. Where a value comes from `BRAND.md`, the section cites it. If the two disagree, `BRAND.md` wins and this file is stale.

## Overview

**Creative North Star: "The Public Record"**

A casa de bolsa is chosen by the evidence it publishes, not by the promise it makes. The system is built to make documents, figures, dates and sources look like the primary content of the site rather than the fine print underneath it. Institutional navy and white carry the page; blue is where action lives; Tint and Pearl exist only to separate one block from the next. Nothing is decorated to look more valuable than it is — a downloadable financial statement gets a real filename, a real type and a real size, and it sits on a hairline like a line in a register.

The material language is thin, not boxy. A 1px rule (`--color-line`, `rgba(14,48,72,0.10)`) is the default separator; a card is the exception, taken only when a piece of content is genuinely a discrete object. Elevation is declared once and never stacked: the surface is either a hairline or a shadow. The shadows themselves are blue and diffuse (`BRAND.md` §9), never black, never hard-offset — the page should feel lit rather than layered.

The refused world is the trading terminal. No neon, no gold, no crypto purple, no glassmorphism as a language, no continuous motion competing with the reading. `BRAND.md` §16 makes those refusals binding; the build honours them, including in the market ticker, which is deliberately paced, pausable and labelled with its source rather than flashing.

**Key Characteristics:**
- Navy and White dominate; Blue means action; Tint and Pearl separate blocks (`BRAND.md` §5).
- Sora for headings, interface and labels; Inter for reading. No third family (`BRAND.md` §8).
- Hairlines before boxes; a card is a deliberate exception.
- Elevation declared once, blue and diffuse — never black, never doubled.
- Every figure ships with unit, period and source; nothing simulated is presented as real.
- No hidden state is ever server-rendered: without JS or with reduced motion the page is fully readable.

## Colors

The palette is pinned by `BRAND.md` §5–§6 and mirrored one-to-one into `src/styles/tokens.css` as a Tailwind v4 `@theme` block, with `--kcb-*` aliases on `:root` for the button system's per-surface variables. No color enters a component that is not already in that file.

### Primary
- **Institutional Navy** (`{colors.navy}`): the brand's authority color. Dark surfaces, footer, the market ticker bar, heading text on light surfaces, the resting fill of the Download Button, and the dark end of the only authorized gradient.
- **Signal Blue** (`{colors.blue}`): action and direction. The Action Button's border and expanding fill on light surfaces, text links (`.kcb-link`), rich-text links, header link hover, icon-chip glyphs, and the light end of the gradient.

### Secondary
- **Atlantic Blue** (`{colors.blue-2}`): secondary chart series and complementary states. Never used for a call to action.
- **Chart Light** (`{colors.chart-light}`): the pale blue that carries small supporting marks on dark ground — hero route icons, the group label above the two routes, the ticker's unavailable icon, and light data series.

### Tertiary
- **Institutional Emerald** (`{colors.emerald}`): reserved. Live-status signalling (the pulsing ticker dot), the focus ring hue, and the `accent` button emphasis. It is not the icon color of the site.
- **Positive / Negative** (`{colors.positive}`, `{colors.negative}`) and their on-navy counterparts (`{colors.positive-on-navy}`, `{colors.negative-on-navy}`): financial direction only, on light and dark ground respectively. Never decoration (`BRAND.md` §6).

### Neutral
- **White** (`{colors.white}`): the page ground (`body`), card surfaces, and text on navy/blue.
- **Pearl** (`{colors.pearl}`) and **Tint** (`{colors.tint}`): the two quiet section grounds that create rhythm without darkening the page. Tint also backs icon chips and image placeholders. On dark ground, Tint is the body-text color.
- **Tint 2** (`{colors.tint-2}`): soft hover, alternating rows, and the text-selection background.
- **Ink** (`{colors.ink}`): body copy on light ground and the download tooltip surface.
- **Muted** (`{colors.muted}`): secondary text and metadata — dates, file type, size, period.
- **Line** (`{colors.line}`): every discrete separator on light ground. Its dark-ground counterparts are `rgba(255,255,255,0.16)` for content rules and `rgba(255,255,255,0.25)` for the hero's route divider.

### Named Rules

**The Pinned Palette Rule.** `BRAND.md` §5–§6 owns the palette. New surfaces select from `src/styles/tokens.css`; they never introduce a hue, not even once, and never redefine a token locally. Audit test: a hex literal outside `tokens.css` is a defect unless it is a per-category editorial tag color from `BRAND.md` §6.

**The Emerald Reserve Rule.** Emerald signals *live* and *positive accent*, never "icon color". Measured: Emerald `#0E9F6E` on Tint `#EAF1F8` is **2.97:1 and fails AA**. This is why `.kcb-chip` renders its glyph in Blue `#205890` on Tint — **6.45:1** — and why `BRAND.md` §16's "no Emerald in excess" is a contrast fact here, not a taste preference.

**The Muted Floor Rule.** Muted `#5B6B7E` on Tint `#EAF1F8` measures **4.79:1** — it passes AA for normal text and is the floor of the entire system. Do not put Muted on any ground lighter-contrast than Tint, do not use it below `0.875rem`, and never use it for a control label. `BRAND.md` §15 states this constraint; the number is the build's measurement of it.

**The Two-Channel Rule.** Direction is never color alone. Every gain or loss carries a symbol and a text value alongside the hue (`MarketTicker`, `DocumentRow` metadata), per `BRAND.md` §6 and PRODUCT.md's accessibility commitments.

**The One Gradient Rule.** Exactly one gradient exists — `linear-gradient(160deg, #205890 0%, #0E3048 100%)`, exposed as the `kcb-gradient` utility and fixed by `BRAND.md` §7. It is used for the first viewport and for institutional dark blocks. There is no second gradient, and no component gets one of its own.

## Typography

**Display Font:** Sora (weights 400/500/600/700/800 authorized by `BRAND.md` §8), loaded as `--font-display`.
**Body Font:** Inter (weights 400/500/600/700), loaded as `--font-sans`.
**Label Font:** Sora — labels, buttons, navigation, table headers and figures are Sora, not Inter.

**Character:** Sora reads as precision and structure: geometric, tightly tracked at display sizes (`letter-spacing: -0.02em`, `line-height: 1.12` set once on `h1–h5` in `globals.css`), and always balanced (`text-wrap: balance`). Inter carries the regulatory and educational reading at a generous 1.65 line-height with `text-wrap: pretty`. The pairing is deliberately unremarkable at body size and confident at headline size — the writing is the product.

### Hierarchy
- **Display** (Sora 700, `clamp(2.25rem, 1.6rem + 3.1vw, 3.75rem)`, 1.06): the page `h1` only. Currently the hero on the gradient.
- **Lead** (Sora 600, `clamp(2.125rem, 1.55rem + 2.6vw, 3.5rem)`, 1.12): `SectionHeading size="lead"`. The second focal scale of the page, reserved for the financial-information section — the evidence the thesis rests on.
- **Headline** (Sora 600, `clamp(1.75rem, 1.35rem + 1.9vw, 2.75rem)`, 1.12): the default section `h2`.
- **Title** (Sora 600, `clamp(1.35rem, 1.15rem + 1vw, 1.875rem)`, 1.12): `SectionHeading level={3}`, subsection headings.
- **Card Title** (Sora 600, `1.0625rem`, ~1.375): publication titles, document titles, hero route names, mobile panel links. The one heading size that does not scale with viewport.
- **Body** (Inter 400, `1rem`, 1.65): the base. Section descriptions step up to `1.0625rem` (`1.125rem` under a `lead` heading); rich text runs at `1.0625rem`/1.75; metadata and dense supporting copy drop to `0.9375rem` or `0.875rem`.
- **Label** (Sora 600, `0.875rem`, `0.08em`, uppercase): small tracked labels above a content group, and the ticker's status pill at `0.6875rem`/`0.08em`.

### Named Rules

**The Two Families Rule.** Sora and Inter, and nothing else, ever — `BRAND.md` §8 and §16. Sora takes headings, navigation, buttons, labels, figures, table headers and card titles; Inter takes paragraphs, forms, metadata, legal notices.

**The Second Focal Rule.** A page has one Display and at most one `lead`. `SectionHeading size="lead"` is a claim about which section carries the evidence; if two sections claim it, neither is emphasized.

**The Bare Heading Rule.** `SectionHeading` renders no label above its title: the title carries its own weight and the description explains it. A small tracked label appears only where it names a *group of choices or items* directly beneath it, never as decoration above a section title. See "Do's and Don'ts".

**The Reserved Tracking Rule.** Wide tracking (`0.08em`) belongs to small uppercase Sora labels and status pills only — `BRAND.md` §8. Body copy is never uppercase, and headings are never tracked out.

**The Tabular Figures Rule.** Anything comparable is tabular: `table` and `[data-tabular]` get `font-variant-numeric: tabular-nums` in the base layer. Add `data-tabular` to any element where numbers stack or align.

## Layout

One container, one rhythm. `kcb-container` is `max-width: 78rem` centered, with a fluid gutter of `clamp(1.25rem, 4vw, 3rem)`; the header inner and the ticker inner repeat the same two values so the logo, the nav and the first word of every section sit on one vertical line. `kcb-section` sets the vertical rhythm at `clamp(4rem, 8vw, 7.5rem)` and carries `scroll-margin-top: var(--kcb-sticky-offset)`.

Fixed chrome is measured, not guessed: `--kcb-ticker-height` (2.25rem) and `--kcb-header-height` (4.25rem, 5rem from 72rem up — the same breakpoint at which `SiteHeader` switches to full navigation) compose into `--kcb-sticky-offset`, which every section's `scroll-margin-top` consumes. An anchor link can never leave a heading hidden under the bar.

Grids are content-shaped, not column-counted. The first viewport is `lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]` — headline left, market trajectory right — and the two routes beneath the headline use `grid-rows-subgrid` so that title, description and action align across both columns even when one title wraps to two lines. Reading measure is capped by `kcb-measure` at `68ch`.

Surface rhythm alternates White → Tint/Pearl → Navy/gradient down the page (`BRAND.md` §9). Breakpoints in use are Tailwind's `sm` (40rem), `lg` (64rem) and the project's own `72rem` chrome breakpoint; the ticker drops its source line below `47.99rem`.

### Named Rules

**The No Sideways Rule.** `body` carries `overflow-x: clip`. No section, tooltip or ticker may produce horizontal scroll; the Download Button's tooltip flips side by explicit composition (`data-tooltip-side`) rather than being allowed to overflow.

**The Measured Chrome Rule.** Any new fixed or sticky element must publish its height as a `--kcb-*` custom property and fold into `--kcb-sticky-offset`. Hard-coded scroll offsets are a defect.

## Elevation & Depth

Depth is tonal first and shadowed second. Blocks are separated by ground color (White / Pearl / Tint / Navy / gradient) and by 1px hairlines; a shadow appears only when an element is genuinely lifted off the page — a floating card, the mobile panel, the header once it has scrolled, the two button patterns. All shadows are blue-tinted and diffuse, fixed by `BRAND.md` §9. There are no black shadows, no hard offsets, no multiple contours, and no borders stacked under a shadow.

### Shadow Vocabulary
- **Soft** (`box-shadow: 0 20px 50px -22px rgba(14, 48, 72, 0.28)`, token `--shadow-soft`): the lifted state. Mobile navigation panel; publication card on hover.
- **Soft Small** (`box-shadow: 0 10px 28px -16px rgba(14, 48, 72, 0.26)`, token `--shadow-soft-sm`): the resting card and the scrolled header.
- **Action hover** (`0 14px 30px -16px rgba(14, 48, 72, 0.48)`): local to `.kcb-action`, appears only on hover/focus-visible.
- **Download rest / hover** (`0 8px 22px -14px rgba(14,48,72,0.55)` → `0 12px 26px -14px rgba(14,48,72,0.60)`): local to `.kcb-download`, the one control that is elevated at rest because it is a compact circular target.

### Named Rules

**The Declare-Once Rule.** A surface is either a hairline or a shadow, never both. `SiteHeader` is the reference implementation: at rest it is a 1px `--color-line` bottom border on translucent white; at `data-scrolled="true"` the border goes transparent and `--shadow-soft-sm` takes over. Elevation is never additive.

**The Blue Shadow Rule.** Every shadow is `rgba(14, 48, 72, α)` — the navy at low alpha, per `BRAND.md` §9. A `rgba(0,0,0,…)` shadow anywhere in the build is a defect.

## Shapes

Corners are soft and contemporary, sized by hierarchy, within `BRAND.md` §9's 12–24px band: cards at **16px** (`--radius-card`), large panels at **20px** (`--radius-panel`), icon chips at **12px** (10px at `sm`), compact controls such as the burger at **12px**, the skip link at `0 0 12px 12px`, the download tooltip at **8px**, and the focus ring's own radius at **4px**. Buttons and tags are pills (`--radius-pill: 999px`).

Borders are discrete and always 1px, except the Action Button's 2px ring, which is the button's identity rather than a container edge. The two hairline utilities — `kcb-hairline` (`--color-line`) and `kcb-hairline-light` (`rgba(255,255,255,0.16)`) — are the default way to group content on light and dark ground respectively.

The one shape that animates is the Action Button: on hover/focus its radius travels from pill to `clamp(0.75rem, 1.4vw, 1rem)` while a circular fill expands from the center (`clip-path: circle(0%)` → `circle(150%)`). That transition is mandated by `BUTTON_SYSTEM.md` §5.2.

### Named Rules

**The Hairline-Before-Box Rule.** Group content with a 1px rule and spacing before reaching for a card. The hero's two routes, `DocumentRow`, and the mobile panel links are all hairline-separated lists, not card grids. A card is justified only when its content is a discrete object with its own image, tag and destination — `PublicationCard`.

## Components

### Buttons

Two patterns exist, both owned by `BUTTON_SYSTEM.md`. There is no third. Both are single reusable components; per-section copies are prohibited by `BUTTON_SYSTEM.md` §2.

**Action Button** (`.kcb-action`) — the confident, kinetic CTA.
- **Shape:** pill at rest (999px), softening to a rounded rectangle on hover (`clamp(0.75rem, 1.4vw, 1rem)`); 2px border; minimum height 2.75rem (44px touch target).
- **Type:** Sora 600, `clamp(0.875rem, 0.82rem + 0.2vw, 1rem)`, line-height 1.
- **Surface variants:** selected by the real background via `data-surface` (`light` / `dark` / `blue`) and `data-emphasis` (`primary` / `secondary` / `accent`), each redefining `--btn-bg`, `--btn-fg`, `--btn-border`, `--btn-fill`, `--btn-hover-fg`. On light ground primary is Blue-outlined and fills Blue; secondary is a white surface with a `rgba(14,48,72,0.28)` edge that fills Navy; on the gradient, the accent variant is Emerald filling White.
- **Hover / focus-visible:** identical treatment (never hover-only) — fill expands from the center, resting arrow exits right, a second arrow enters from the left, the label shifts `0.65rem`, and the local blue shadow appears. Easing is `--ease-kcb`, `cubic-bezier(0.23, 1, 0.32, 1)`, over 420–620ms.
- **Active / disabled / loading:** `scale(0.97)`; `opacity: 0.5` with no shadow; `aria-busy` with a `currentColor` spinner that never replaces the label, so width is preserved and there is no layout shift.
- **Focus ring:** `3px solid color-mix(in srgb, var(--kcb-focus) 55%, transparent)` at `3px` offset — the same Emerald ring as the global `:focus-visible`.
- **Not for:** menu toggles, tabs, accordions, pagination, social icons, carousel controls, downloads, or inline links (`BUTTON_SYSTEM.md` §5.1).

**Download Button** (`.kcb-download`) — a compact circular control, never a primary CTA.
- **Shape:** circle, `clamp(2.75rem, 2.55rem + 0.5vw, 3.125rem)`, Navy on light ground; `rgba(255,255,255,0.14)` with a `rgba(255,255,255,0.22)` edge on dark/blue ground.
- **State:** hover/focus lifts `2px`, shifts to Blue (or White on dark), re-enters the arrow glyph, and reveals an Ink tooltip carrying the real action, type and size.
- **Tooltip discipline:** the tooltip never holds information that is not also in the row and in `aria-label`; it is hidden entirely under `@media (hover: none)`.

### Chips

- **Icon Chip** (`.kcb-chip`): 2.75rem (2.25rem at `data-size="sm"`) rounded square, Tint ground with a **Blue** glyph; on dark ground, `rgba(255,255,255,0.10)` with a White glyph. The Blue glyph is a contrast requirement — see The Emerald Reserve Rule.
- **Content Tag** (`.kcb-tag`): a pill in Sora 600 at `0.75rem`/`0.02em`, carrying one of the four editorial category pairs from `BRAND.md` §6 as inline background/foreground. Tags are always accompanied by readable text; they are never section backgrounds or CTA colors.

### Cards / Containers

`PublicationCard` is the reference card and the only routine use of elevation.
- **Corner Style:** 16px, content clipped.
- **Background:** White; image wells sit on Tint at `16/9`.
- **Shadow Strategy:** Soft Small at rest → Soft on hover, 300ms. Nothing else changes size or position.
- **Border:** none — the shadow is the edge.
- **Internal Padding:** 1.5rem.
- **Link discipline:** the anchor wraps the *title*, not the card, so the accessible name is exact; the "Leer la publicación" line is a visual affordance whose arrow nudges `translate-x-1` on group hover.

### Content Rows

`DocumentRow` is the other content surface, and the one the system prefers.
- A hairline-topped list item (`--color-line`, `rgba(255,255,255,0.16)` on dark), `1.25rem` vertical padding, a small icon chip, the title as the primary link in Sora 600, then a `data-tabular` metadata line joining period, file type, real size and publication date with `·`.
- Metadata is only ever real. Missing file → "Sin archivo disponible" and a disabled control, never a fake link (`BUTTON_SYSTEM.md` §9, PRODUCT.md principle 2).

### Navigation

- **Header:** sticky, `rgba(255,255,255,0.92)` with `blur(12px)`, hairline bottom border, switching to `0.97` + Soft Small shadow at `data-scrolled="true"`. Links are Sora 500 at `clamp(0.875rem, 0.8rem + 0.15vw, 0.9375rem)` in Ink, moving to Blue on hover, with no underline and no pill. The menu is `justify-content: flex-end` so a long label can never crowd the logo. Logo height 2.125rem, 2.625rem from 72rem up (`BRAND.md` §4).
- **Mobile:** below 72rem the nav collapses to a 2.75rem burger — a deliberately specialized control with a 12px radius and a Tint hover, explicitly *not* an Action Button. The panel is `min(22rem, 88vw)`, White, Soft shadow, over a `rgba(14,48,72,0.45)` scrim, with hairline-separated Sora 500 links at a 3.25rem minimum row.
- **Skip link:** `.kcb-skip-link`, Navy on White, slides in on focus.

### Iconography

One shared `Icon` component (`src/components/ui/Icon.tsx`) is the entire icon family: a 24-box viewBox, `fill: none`, `stroke: currentColor`, `strokeWidth` 1.7, rounded caps and joins — exactly `BRAND.md` §10. Icons inherit color from their context and are rendered at `size-4`/`size-5` in practice. Decorative icons are `aria-hidden` and `focusable="false"`; an icon that carries meaning receives a `title` and `role="img"`. No icon fonts, no emoji, no second family, no per-component inline SVG.

### Market Ticker (signature)

A Navy bar above the header — informative, not a trading terminal (`BRAND.md` §11). Symbols in Sora 700, values at `rgba(255,255,255,0.82)`, direction in the on-navy positive/negative pair plus symbol and text. The track scrolls at 48s linear, pauses on the explicit pause control, on `:focus-within`, and entirely under reduced motion (where it becomes a manually scrollable list with the duplicate track removed). Edges are masked so figures never cut off mid-glyph. A live Emerald dot pulses at 2.4s; when there is no data the bar states so explicitly rather than showing figures.

### Hero Trajectory (signature)

An inline SVG market line beside the headline. Its **default state is fully drawn**; the stroke-dash draw (1.4s) and the fade of area and end-dot are added only under `html[data-motion='on']`. Without JavaScript, or with reduced motion, the chart is complete rather than an empty frame.

### Section Entrances (the motion contract)

This is a correctness rule, not a preference.

**The No-Hidden-Server-State Rule.** Hidden state is never server-rendered. `Reveal` marks its element `data-reveal`, but the hidden values live only in `globals.css` under `html[data-motion='on'] [data-reveal]` (`opacity: 0`, and `translateY(16px)` for `up`). `data-motion` is set by a pre-paint inline script in `src/app/(frontend)/layout.tsx`, and only when `prefers-reduced-motion` is not set. So with no JavaScript, with reduced motion, or if hydration fails, content renders **visible**. A reduced-motion safety net additionally forces `opacity: 1 !important; transform: none !important`.

**The Mount-In-View Rule.** First-viewport content uses `trigger="mount"`, never scroll-triggered — content already on screen must not wait for a scroll event that may never come. Below the fold, `trigger="view"` fires once at 15% visibility with an 80px bottom margin. Duration is 0.55s on `cubic-bezier(0.16, 1, 0.3, 1)`; stagger stays within `0.08s` steps and never delays a heading — `SectionHeading` itself does not animate, so reading can begin immediately.

## Do's and Don'ts

### Do:
- **Do** take every color from `src/styles/tokens.css`, which mirrors `BRAND.md` §5–§6. Add nothing to it.
- **Do** separate content with a 1px hairline (`kcb-hairline`, `--color-line`) and spacing before considering a card.
- **Do** let Navy and White dominate, use Blue for action, and keep Tint and Pearl for block separation (`BRAND.md` §5).
- **Do** render icon-chip glyphs in Blue on Tint (6.45:1). Emerald on Tint is 2.97:1 and fails.
- **Do** keep the second focal scale (`SectionHeading size="lead"`) for the financial-information section, and use it once per page.
- **Do** give hover and focus-visible the same treatment on every interactive element, and keep the Emerald focus ring at 3px/3px offset.
- **Do** pair every figure with unit, period and source, and every direction with a symbol and a value as well as a color.
- **Do** use a small uppercase tracked Sora label (`0.08em`) **only** to name a group of choices or items that follows immediately beneath it — `BRAND.md` §8 authorizes eyebrows and labels as a Sora use and reserves wide tracking for them.
- **Do** publish the height of any new sticky element as a `--kcb-*` token and fold it into `--kcb-sticky-offset`.
- **Do** keep hidden state out of the server-rendered HTML: gate every entrance on `html[data-motion='on']`.

### Don't:
- **Don't** introduce a third type family, or set body copy in uppercase (`BRAND.md` §8).
- **Don't** use Emerald as a general icon or text color, or as an implied promise of growth (`BRAND.md` §16).
- **Don't** put Muted below `0.875rem` or on any ground lighter-contrast than Tint — 4.79:1 is the floor of the system.
- **Don't** ship a black or hard-offset shadow, stack shadows, or leave a border under a shadow. One elevation, declared once.
- **Don't** build a third button pattern, duplicate the two that exist, or use the Action Button for menu toggles, tabs, accordions, pagination or downloads (`BUTTON_SYSTEM.md` §5.1).
- **Don't** invent a second gradient or apply the authorized one to components (`BRAND.md` §7).
- **Don't** wrap a whole card in a link when a title can carry the accessible name.
- **Don't** let a tooltip be the only place a fact appears, and don't let one cause horizontal overflow.
- **Don't** put a tracked uppercase label above a `SectionHeading` title as decoration — the title carries its own weight.
- **Don't** show placeholder or simulated figures as real; use the explicit unavailable state (`BRAND.md` §14, PRODUCT.md principle 2).
- **Don't** recolor, redraw, animate in parts, or add effects to the logo (`BRAND.md` §4).
- **Don't** adopt glassmorphism as a language; the header's single 12px blur is the whole of it (`BRAND.md` §16).
