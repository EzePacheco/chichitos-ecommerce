# LLM_CONTEXT.md - Chichitos Web

Generated summaries are not authority. Use this file as the first reading router
for agents, then follow the linked source documents.

## Read First

1. `README.md` - setup, stack, and commands.
2. `AGENTS.md` - repo-specific boundaries, security invariants, and workflow.
3. `docs/product.md` - current product scope and user/admin flows.
4. `docs/architecture.md` - current code organization, integrations, data,
   security, and operation notes.
5. `docs/adr/README.md` - accepted architecture decisions.
6. `specs/active/` y `specs/archive/` para estado de trabajo de cambios.

## Task Routing

- Public storefront UI: `src/app/(store)/**`, `src/screens/store/**`,
  `src/features/catalog/**`, `src/features/store-shell/**`.
- Admin UI and actions: `src/app/admin/**`, `src/screens/admin/**`,
  `src/features/admin/**`, `src/server/auth/**`.
- Checkout/payment/webhook: `src/app/api/checkout/route.ts`,
  `src/app/api/mercado-pago/webhook/route.ts`, `src/server/checkout/**`,
  `src/server/payments/**`.
- Catalog/settings/orders server logic: `src/server/catalog/**`,
  `src/server/settings/**`, `src/server/orders/**`.
- Supabase schema: `src/supabase/migrations/**`; do not infer schema from the
  dashboard.
- Design references: `docs/design/README.md` before changing visual direction.

## Current Constraints

- Browser-executable code must not import elevated Supabase clients, service
  role keys, payment secrets, or server-only provider adapters.
- Public catalog may use mock fallback only outside production.
- Payment status is confirmed by validated webhook, not browser return.
- Money is integer cents in backend/DB.
- Specs for risky active work live in `specs/active/`; completed specs are moved
  to `specs/archive/`.

## Historical Context

- `docs/design/archive/**` contains historical design handoff bundles and should
  not be treated as production source without checking current code and
  `docs/design/README.md`.

## Change History

- SPEC-005 quedó archivada en `specs/archive/catalog-admin-production.spec.md`
  luego de completar implementación de checkout/productivo, stock y pagos.

## Do Not Read By Default

- `.next/`, `node_modules/`, `.playwright-mcp/`, generated build output, and
  archived design bundles unless specifically needed.

Last updated when the repository documentation and module topology were reconciled.
