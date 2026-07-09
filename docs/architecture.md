# Architecture - Chichitos Web

## Overview

Chichitos Web is a single Next.js App Router application with public storefront,
admin panel, server-side use cases, Supabase persistence/Auth, Mercado Pago
payments, Google Maps delivery distance support, and Vercel deployment target.

## Source Layout

- `src/app/**` is the Next.js routing boundary. Route files should stay thin and
  delegate composition to screens.
- `src/screens/**` owns page composition for store and admin routes.
- `src/features/**` owns product feature UI, model/state, and feature server
  adapters. Use `ui/`, `model/`, and `server/` only when needed.
- `src/shared/**` owns product-agnostic reusable code. `shared/ui` is
  presentational.
- `src/platform/**` owns technical infrastructure: Supabase clients, runtime
  config, HTTP helpers, and provider adapters.
- `src/server/**` owns server-side business logic by capability/use case.
- `src/supabase/migrations/**` is the schema source of truth.

## Dependency Direction

Allowed direction:

```text
src/app -> src/screens -> src/features -> src/shared
                         -> src/server  -> src/platform
```

Browser-executable feature/shared UI must not import server-only platform code.
Screens may call server functions when they are Server Components.
Feature `server/` folders are explicit server boundaries and may call
`src/server/**`. Shared product contracts may be imported by server code only
when they are pure types/helpers and contain no browser or React dependency.

## Runtime Flows

- Public catalog uses Supabase when configured and local typed fallback only
  outside production.
- Checkout route validates idempotency, buyer, cart and delivery server-side,
  creates local order/payment rows, reserves stock, and claims one Mercado Pago
  preference creation per local payment. The idempotency key is tied to a
  canonical checkout fingerprint.
- Mercado Pago webhook validates signature, claims a retryable inbox event,
  fetches payment server-side, validates order reference/amount/currency, and
  applies payment/order state plus stock capture/release through a
  transactional RPC.
- Admin Server Actions authorize before mutation and revalidate affected routes.

## Data And Security

- RLS is enabled for exposed tables and admin checks rely on `private.is_admin()`.
- Supabase Data API grants are least-privilege: browser clients may read public
  catalog/settings only. Catalog, order, payment, webhook, stock and admin
  mutations go through authorized server flows with the elevated server client.
- Elevated Supabase client lives under `src/platform/supabase/admin.ts` and must
  never be imported by browser code.
- Money is stored as integer cents.
- Payment confirmation comes from webhook processing, not browser redirect.
- `.env.example` documents names only; real secrets stay outside the repo.

## Operations

- `/api/health` is liveness.
- `/api/readiness` checks required runtime configuration and fails closed in
  production or when checkout is enabled.
- Vercel is the deployment target per ADR-0004.
