---
name: chichitos-design
description: Use this skill to generate well-branded interfaces and assets for Chichitos (ropa infantil estampada con DTF, marca argentina), either for production or throwaway prototypes/mocks/decks. Contains essential design guidelines, colors, type, fonts, assets, and a full ecommerce UI kit for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

This skill contains the **Chichitos** design system. Chichitos is a small Argentinian ecommerce of children's clothing with hand-illustrated DTF prints. The brand is warm, playful, artisanal — **not** SaaS-corporate, **not** generic purple-gradient.

Key files:

- `README.md` — context, content fundamentals (tone, casing, copy), visual foundations (palette, type, spacing, motion, layout), iconography
- `colors_and_type.css` — design tokens (CSS custom properties): full color system, type scale, spacing, radii, shadows, semantic styles, button + input + card primitives
- `assets/` — 3 logo variants (dark, white, full-with-tagline)
- `preview/*.html` — design-system cards (colors, type, spacing, components)
- `ui_kits/chichitos-store/` — full reference recreation of the ecommerce: home, catalog, product, cart, checkout, admin. Component-by-component React/JSX

## When using this skill

If creating visual artifacts (slides, mocks, throwaway prototypes, marketing pages, etc):
- Always `<link>` `colors_and_type.css` first
- Copy logos out of `assets/` into your artifact's folder
- Use the React components from `ui_kits/chichitos-store/components.jsx` as a reference; copy patterns, don't necessarily import wholesale
- Default to cream `--cream-100` backgrounds, never pure white
- Use coral `--coral` for primary CTA, ink `--ink-900` for default actions
- All text in **Spanish rioplatense** ("vos", not "tú"). Sentence case for titles. Eyebrows in MAYÚSCULAS with ★ separator
- No real photos of children — use the garment placeholder pattern (silhouette + colored design blob)

If working on production code, copy assets and read the rules to act as an expert designer with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design (slide deck? Instagram post? marketing page? new feature mock?), ask a few clarifying questions about audience and goals, then act as an expert designer outputting HTML artifacts or production code, depending on the need.

## Critical "do not" list

- ❌ Pure-white backgrounds (#FFF) — use cream
- ❌ Purple/violet gradients
- ❌ Inter, Roboto, or Arial as primary type — use Outfit + DM Serif Display + Caveat
- ❌ Photos of real children — use illustrated garment placeholders
- ❌ Emoji-heavy UI — only ✨ ☁️ ★ 🌤️ occasionally, never 🛒🔥💯
- ❌ Diminutive overload ("prenditas hermosositas") — keep tone warm but adult
- ❌ Generic e-commerce template look — favor editorial, boutique, garment-tag detailing
