# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

- `pnpm dev` — Next.js dev server.
- `pnpm build` / `pnpm start` — build y arranque productivo.
- `pnpm lint` — ESLint (preset `eslint-config-next`).
- `pnpm typecheck` — `tsc --noEmit` (strict).
- `pnpm test` — Vitest una sola corrida. Para un test puntual: `pnpm vitest run path/al/archivo.test.ts` o `pnpm vitest run -t "nombre del test"`. Convivir con `pnpm vitest` watch durante iteracion.

Node `>=20.9`. Package manager fijado a `pnpm@11.0.9` — usar pnpm, no npm/yarn.

## Arquitectura

Ecommerce Next.js 16 (App Router) full-stack. Front publico, admin y backend conviven en un solo deploy (ADR-0001). Stack: Supabase (Postgres + Auth con Google) (ADR-0002), Mercado Pago Checkout Pro pendiente, Google Maps para envio (ADR-0003), Vercel + pnpm para deploy (ADR-0004).

### Boundaries

Convencion clave: UI nunca habla con Supabase ni con providers externos directo. Toda logica server-side vive bajo `src/server/**` y se consume desde Route Handlers, Server Components o Server Actions.

- `src/app/(store)/**` — shell publico (home, catalogo, producto, carrito, checkout). Su `layout.tsx` contiene Header/Footer/WhatsApp float.
- `src/app/admin/**` — panel admin **sin** shell publico. `actions.ts` define Server Actions (`saveStoreSettingsAction`) que validan autorizacion antes de mutar.
- `src/app/auth/callback/route.ts` — intercambia el `code` de OAuth por sesion via `exchangeCodeForSession`. Redirecciones internas saneadas por `sanitizeInternalRedirectPath`.
- `src/app/api/**` — Route Handlers (ej. `health`). Webhooks de Mercado Pago iran aca.
- `src/server/**` — codigo server-only:
  - `auth/` — `getAdminAuthorization()` es el unico camino para autorizar admin. Combina lookup en `admin_users` con allowlist `ADMIN_BOOTSTRAP_EMAILS` (bootstrap del primer admin). La logica pura de decision esta en `admin-authorization-rules.ts` (testeable sin DB).
  - `config/env.ts` — `getRequiredEnv` / `getOptionalEnv`. Toda lectura de `process.env` server-side pasa por aca.
  - `settings/store-settings.ts` — schema + parsing del `store_settings` (singleton con `id = true`). Precios siempre en centavos; helpers de parsing convierten `"$1.234,50"` -> `123450`.
  - `shipping/calculate-shipping-cost.ts` — funcion pura: precio base hasta `baseRadiusKm`, luego `ceil((dist - base) / extraStepKm) * extraStepPriceCents`.
  - `supabase/admin.ts` — cliente elevated (service role). Acepta `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY`. **Nunca** llamar desde codigo que pueda ejecutarse en el browser.
  - `http/responses.ts` — helpers `ok()` etc para Route Handlers.
- `src/lib/supabase/` — clientes `@supabase/ssr`:
  - `server.ts` — `createServerSupabaseClient()` con cookies de Next. Usar en Server Components / Route Handlers / Actions.
  - `browser.ts` — `createBrowserSupabaseClient()` para Client Components.
- `src/features/**` — UI agrupada por dominio (`catalog`, `admin`). Componentes + data mock + design helpers locales.
- `src/components/{ui,layout}` — design system compartido y chrome del sitio.
- `src/supabase/migrations/` — fuente de verdad del schema (no cambios via dashboard). Migracion inicial define enums (`product_category`, `catalog_status`, `delivery_method`, `order_*`, `payment_*`), tablas, RLS y `private.is_admin()`.

### Reglas de seguridad clave

- Pagos: el estado de pago se cree por webhook validado server-side, nunca por retorno del browser (ADR-0001).
- Admin: la sesion de Google sola no autoriza. Hay que pasar por `getAdminAuthorization()` (allowlist en `admin_users` + flag activo, o bootstrap email via env). Server Actions admin deben llamarla antes de cualquier mutacion (ver `src/app/admin/actions.ts`).
- RLS: tablas expuestas a Data API tienen RLS y dependen de `private.is_admin()`. Cambios de schema deben mantener esa invariante.
- Secretos: `.env` no se versiona. Variables `NEXT_PUBLIC_*` son publicas por definicion; el resto debe quedar server-only.

### Patrones a respetar

- Dinero: siempre en centavos enteros en backend / DB. Conversion a `$X,YY` solo en presentacion.
- Telefonos WhatsApp: sanear con `sanitizeWhatsAppPhoneNumber` antes de persistir o linkear.
- Tests Vitest viven al lado del codigo (`*.test.ts`). Mantener tests puros para logica pura — `admin-authorization-rules.test.ts` y `store-settings.test.ts` son referencia: testean intencion, no integracion con DB.
- Alias TS: `@/*` -> `src/*`.
- Convenciones visuales: cambios de UI deben referenciarse contra `docs/design/` (SPEC-002/003). No fabricar tokens ni variantes — usar el design system exportado.

## Documentacion

- `docs/adr/` — decisiones arquitectonicas (leer antes de cambiar stack o boundaries).
- `docs/design/` — UI Kit, brief visual y exports. Fuente de verdad visual.
- `docs/database/` — resumen del schema.
- `CHANGELOG.md` — Keep a Changelog, seccion `[Unreleased]` para WIP.
