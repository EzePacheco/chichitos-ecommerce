# ADR-0005: Modular repo structure for Chichitos Web

- **Estado:** accepted
- **Fecha:** 2026-07-08
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

The repo grew from initial scaffold into a full-stack ecommerce with public
store, admin, Supabase, Mercado Pago, checkout, webhooks and readiness checks.
The previous structure worked, but route files, feature UI, server logic,
shared UI and infrastructure ownership were becoming harder to distinguish.

## Alternativas evaluadas

1. **Keep current folders**
   - Pros: no migration cost.
   - Contras: route files and feature folders keep accumulating unrelated
     responsibilities.
   - Resultado: rejected.

2. **Layer-first folders**
   - Pros: familiar technical grouping.
   - Contras: product changes scatter across routes, components, services and
     helpers.
   - Resultado: rejected.

3. **Modular capability structure with screens/features/shared/platform/server**
   - Pros: aligns routes, product ownership, server use cases and technical
     infrastructure while preserving Next.js conventions.
   - Contras: requires import churn and documentation updates.
   - Resultado: accepted.

## Decisión

Use `src/app` as the Next.js framework boundary, `src/screens` for route/page
composition, `src/features` for product capabilities, `src/shared` for
product-agnostic reusable code, `src/platform` for technical infrastructure, and
`src/server` for server-side business logic by capability/use case.

Feature internals use `ui/`, `model/`, and `server/` only when those folders
contain real code.

## Consecuencias

- Route files stay thin and framework-specific.
- Shared UI is protected from product logic, auth, data fetching and provider
  concerns.
- Server-side use cases and provider clients have clearer owners.
- Existing public URLs, API contracts, migrations and environment variables do
  not change.
- Some compatibility facade files remain temporarily while imports converge.

## Validación

- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- Import checks for server-only code leaking into browser-executable feature or
  shared UI.

## Revisión

Revisit if the app splits into multiple deployables, adds a separate backend, or
needs package-level boundaries.
