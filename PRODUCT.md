# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Yerffrey Romero's two audiences arrive with different jobs in the same place:

- **Hiring teams and technical recruiters** evaluating him for senior developer or technical-lead roles. Their job is to judge seniority fast: current role, years in the field, employers, stack, and how to reach him.
- **Prospective freelance and consulting clients** evaluating the eondev brand for paid work. Their job is to judge whether he can be trusted with a project: what he builds, what he has shipped, and how to start a conversation.

Spanish-speaking visitors are the primary audience; English is a first-class second language, not a translation afterthought. Both audiences are served by the same content; the site does not split into two funnels.

## Product Purpose

A personal portfolio and service front page for Yerffrey Romero, published under the eondev identity. It exists to convert a cold visit into a conversation: an interview, an offer, or a paid project. Success is qualified inbound contact, not traffic volume or time on page.

## Positioning

One person presented as both practitioner and technical leader across the whole stack — from AI adoption strategy and team leadership down to shipped Vue/Node code — with a verifiable employment history instead of self-declared skill badges. A neighboring portfolio could not truthfully copy that record.

## Operating Context

- Visitors browse on both mobile and desktop; the site is mobile-first and responsive.
- The experience is a single-page Vue application with client-side routing over four surfaces: home, about (career timeline), blog, contact.
- Visitors often arrive from a LinkedIn profile or a shared link, so any route can be the first screen.
- Language can be switched at any time; the chosen language is a persistent visitor preference, not a redirect.
- Contact begins outside the site: the visitor is handed to their own mail client.

## Capabilities and Constraints

- **Career timeline is the core evidence**: seven roles from 2015 to the present, rendered from a local bilingual data source (`src/composables/use-about.composable.ts`), not from a CMS or API.
- **Blog is deliberately external curation**, not own writing: posts are read live from the public TechCrunch WordPress REST API (`src/config/api.ts`), with search, category filters, pagination, caching, and skeleton states on top. Only `https://techcrunch.com` is an allowed origin; this constraint is enforced in code and must not be loosened casually.
- **Contact is `mailto:` only** (confirmed). The form validates name/email/message and then opens the visitor's mail client with a prefilled draft; failure falls back to a direct address. There is no backend, no form endpoint, and none is planned.
- **Bilingual ES/EN** via `vue-i18n`; all UI copy lives in `src/locales/messages.ts`. Every new string must exist in both languages.
- **Blog content and brand of TechCrunch remain TechCrunch's**: the site presents headlines and links out; it does not republish full articles.
- Static deployment (Vercel config with a strict CSP, HSTS, and no framing); the CSP `connect-src` must keep allowing the TechCrunch API.
- Undecided for the future: whether own-article publishing is ever added, and whether the two audiences ever get separate landing paths.

## Brand Commitments

- The personal name **Yerffrey Romero** and the project identity **eondev** (contact address `hola@eondev.site`, GitHub org `eondev-inc`) are both real and must stay consistent.
- Professional, calm, technical voice in both languages; Spanish is neutral/professional, not regional.
- Existing public profiles are the canonical social links: LinkedIn `linkedin.com/in/yromeroc`, GitHub `github.com/eondev-inc`, Steemit `@seventrust`.
- A prior direction was deliberately retired: gradients, blurred blobs, glassmorphism, and gradient text were removed in favor of a flat system with the corporate palette unchanged. Do not reintroduce those effects.
- The corporate palette (turquoise primary, magenta secondary, orange accent, mint, warm neutrals) is established and lives in `tailwind.config.js`.

## Evidence on Hand

- Real employment history with employers, dates, and role descriptions, in ES and EN (`src/composables/use-about.composable.ts`).
- Real employer and product links per role (Imed, mimed.com, Izit, Tu Clase, Starken).
- Live third-party article feed from TechCrunch.
- Domain, logo assets (`src/assets/img/logo.png`), and illustrative imagery (`Coding.png`, `Coding_dark.png`).
- Absent and must not be fabricated: testimonials, client names, case studies with metrics, pricing, certificates, press mentions, and project counts or experience figures beyond what the timeline states.

## Product Principles

1. **The career record is the argument.** Employment history with dates, employers, and concrete work outranks adjectives; when in doubt, show the record instead of claiming a trait.
2. **One person, two doors.** Hiring and freelance intent share one narrative and diverge only at the moment of contact.
3. **Contact must always be reachable.** Any change that could dead-end the visitor is wrong; the honest `mailto:` path is acceptable, a fake submit is not.
4. **Bilingual parity is non-negotiable.** A string in one language without its counterpart is an incomplete feature.
5. **External content stays external.** Curated third-party reading is a service to the visitor and never a substitute for the owner's own credibility.

## Accessibility & Inclusion

The project targets WCAG 2.1 AA: keyboard-navigable routes with skip links, ARIA labelling, managed focus, and screen-reader support. Language switching must be operable by keyboard, and motion must respect reduced-motion preferences.
