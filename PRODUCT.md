# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + Payload CMS (integrated admin backend) + TypeScript (strict) + Tailwind CSS + Motion (`motion/react`) + PostgreSQL via `@payloadcms/db-postgres`. Fixed by `TECHNICAL_ARCHITECTURE (1).md`, which is the source of truth for stack, layering, access models, and security rules; design work may improve UX, accessibility, composition, responsiveness, and finish but must not change these.

## Users

Two audiences, weighted equally: individual investors (persona natural) and companies (persona jurídica) opening accounts and investing through Kaizen Casa de Bolsa. Both need to understand products, review market/financial information, access institutional and compliance documents, and complete account-opening for their respective entity type.

## Product Purpose

A regulated Venezuelan brokerage (casa de bolsa) website: informs prospective and current clients about investment products and market conditions, publishes institutional/financial/compliance documentation, and converts visitors into opened accounts (individual or corporate) and newsletter subscribers.

## Positioning

Personal advisory and accompaniment ("acompañamiento") through the investment process — close, educational guidance rather than a self-serve/aggressive trading platform. Distinct from Kaizen's predecessor brand KFG Sociedad de Inversión (different brand entirely: no shared colors, logo, copy, or tokens) and from speculative/crypto-styled trading platforms. Balances dynamism with institutional stability.

## Operating Context

- Landing structure (conceptual baseline from `kcb_reference.html`): market/Banco Central ticker → navbar → hero → quiénes somos y valores → productos → ventajas → cotizaciones/información de mercado → información financiera y documentos → cumplimiento, publicaciones y documentos de referencia → pasos para abrir cuenta → registro persona natural/jurídica → contacto → newsletter → footer.
- Payload CMS manages only content that must be published/updated without a deploy: institutional documentation, financial statements, reference/compliance documents, publications/newsletters, associated media, newsletter subscriptions. Static institutional copy (hero, quiénes somos, product descriptions, account-opening steps, contact) stays in section components, not the CMS.
- Roles: Super Admin (full access) and Editor (documents/publications/newsletters/files only, no users/config).
- Market/Banco Central data ticker has no confirmed API yet; must be built behind a `MarketDataProvider` contract with an explicit "unavailable" state — no fabricated figures.
- Two distinct account-opening forms (persona natural / persona jurídica); final integration/provider not yet confirmed.

## Capabilities and Constraints

- Reference implementation (`kcb_reference.html`) defines structure, content, and functional intent only — its HTML/CSS/JS must not be copied literally; the button examples use `styled-components`, which must be translated to Tailwind/CSS, not installed.
- No credentials/secrets reach the browser; admin session via secure HTTP-only cookies only, never LocalStorage.
- Public reads are limited to published content; writes are limited to the subscription endpoint; all create/update/delete requires an authorized admin user.
- Financial figures and market data must never be shown as real when they are placeholder/mock — an explicit "not available" state is required instead.
- Undecided (do not invent): official Banco Central/market data API and contract; production file storage provider; email provider and campaign strategy; final persona natural/jurídica form integration; subscriber/version/document retention policy; final production domain; additional compliance requirements for data/recaudos handling.

## Brand Commitments

Full identity and verbal/visual rules are recorded in `BRAND.md` (name, logo usage, color palette, typography — Sora + Inter only, iconography, tone of voice, prohibited uses) and `BUTTON_SYSTEM.md`. Name: "Kaizen Casa de Bolsa" (full name on first/institutional mentions; "Kaizen" alone only when unambiguous; no public use of "KFG" or "KCB" without approval). Voice is consistently "tú", never "usted". These files are binding design authority — impeccable does not restate or override them here.

## Evidence on Hand

Everything in `kcb_reference.html` (market figures, documents, testimonials, tax-benefit claims marked "VERIFICAR") is placeholder/sample data as of this writing — none of it may be published as real content. No confirmed regulator/compliance body (e.g. SUNAVAL) or real institutional documents, financial statements, or testimonials exist yet. Future work must preserve this distinction rather than treating reference-file content as real evidence.

## Product Principles

1. Advisory closeness over self-serve speculation: every surface should read as accompaniment, not a trading terminal.
2. Never present placeholder/mock data (market figures, documents, testimonials) as real.
3. Equal weight to individual and corporate journeys — neither audience is the default the other is bolted onto.
4. Institutional trust through restraint: dynamism and stability balanced, never crypto/hype-coded.
5. Compliance and documentation are first-class product surfaces, not an afterthought bolted onto marketing pages.

## Accessibility & Inclusion

WCAG AA contrast; full keyboard navigation with visible focus; semantic HTML and landmarks; labels/descriptions/errors bound to their fields; never communicate positive/negative variation by color alone; accessible tables with headers/context; tooltips supplement labels, never replace them; motion respects `prefers-reduced-motion`, and the market ticker must be pausable.
