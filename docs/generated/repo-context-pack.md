# Browser ChatGPT Repo Context Pack

Paste everything below into the browser chat before asking for architecture, design, migration, or technical planning help.

## Generated Evidence Notice

- Authority: generated evidence, not product or architecture authority.

- Confirm material claims against source files, contracts, tests, runtime evidence, or accepted docs before updating durable documentation.

- Suggested location: `docs/generated/` or outside the repo when sensitivity/churn makes committed generated context inappropriate.

- Regenerate with: `collect_repo_context.py <repo> --profile <compact|full> --out <path>`.

## Prompt Wrapper

You are advising on this repository using only the context below. Separate facts from inferences, call out unknowns, avoid assuming files not shown, and ask targeted questions when the repo context is insufficient.

## Repo Snapshot

- Root: `/home/phreak/Desktop/projects/chichitos-ecommerce`

- Collected at: `2026-07-08T23:53:56+00:00`

- Git branch: `main`

- Git commit: `af6df90`

- Working tree status:
```text
M CHANGELOG.md
 M README.md
 M docs/adr/README.md
 D docs/database/README.md
 M docs/design/README.md
 D docs/design/inbox/2026-05-25-chichitos-system/bundle.bin
 D docs/design/inbox/2026-05-25-chichitos-system/bundle.tar
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/README.md
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/chats/chat1.md
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/README.md
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/SKILL.md
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/assets/logo-chichitos-dark.jpeg
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/assets/logo-chichitos-dark.png
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/assets/logo-chichitos-full.jpeg
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/assets/logo-chichitos-full.png
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/assets/logo-chichitos-white.jpeg
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/assets/logo-chichitos-white.png
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/colors_and_type.css
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/buttons-primary.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/buttons-soft-wa.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/colors-accents.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/colors-base.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/colors-semantic.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/eyebrow.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/garment-tag.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/iconography.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/inputs.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/logo-marks.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/order-status.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/product-card.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/radii.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/shadows.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/spacing.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/type-body.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/type-display.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/type-scale.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/type-script.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/preview/whatsapp-float.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/Admin.jsx
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/Cart.jsx
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/Catalog.jsx
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/Checkout.jsx
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/Home.jsx
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/Product.jsx
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/README.md
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/components.jsx
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/data.js
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/index.html
 D docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/ui_kits/chichitos-store/styles.css
 D "docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/uploads/WhatsApp Image 2026-05-17 at 1.07.21 PM (1).jpeg"
 D "docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/uploads/WhatsApp Image 2026-05-17 at 1.07.21 PM (2).jpeg"
 D "docs/design/inbox/2026-05-25-chichitos-system/chichitos-design-system/project/uploads/WhatsApp Image 2026-05-17 at 1.07.21 PM.jpeg"
 D specs/catalog-admin-production.spec.md
 M src/app/(store)/carrito/page.tsx
 M src/app/(store)/catalogo/page.tsx
 M src/app/(store)/checkout/page.tsx
 M src/app/(store)/layout.tsx
 M src/app/(store)/page.tsx
 M src/app/(store)/producto/[slug]/page.tsx
 M src/app/admin/(panel)/configuracion/page.tsx
 M src/app/admin/(panel)/disenos/[slug]/page.tsx
 M src/app/admin/(panel)/disenos/nuevo/page.tsx
 M src/app/admin/(panel)/disenos/page.tsx
 M src/app/admin/(panel)/layout.tsx
 M src/app/admin/(panel)/page.tsx
 M src/app/admin/(panel)/pedidos/[id]/page.tsx
 M src/app/admin/(panel)/pedidos/page.tsx
 M src/app/admin/(panel)/productos/[slug]/page.tsx
 M src/app/admin/(panel)/productos/nuevo/page.tsx
 M src/app/admin/(panel)/productos/page.tsx
 M src/app/admin/actions.ts
 M src/app/admin/login/page.tsx
 M src/app/api/health/route.ts
 M src/app/api/mercado-pago/webhook/route.ts
 M src/app/api/readiness/route.ts
 M src/app/auth/callback/route.ts
 D src/components/layout/SiteFooter.tsx
 D src/components/layout/SiteHeader.tsx
 D src/components/layout/WhatsAppFloat.tsx
 D src/components/ui/ButtonLink.tsx
 D src/components/ui/EmptyState.tsx
 D src/components/ui/Stepper.tsx
 D src/components/ui/Toast.tsx
 D src/components/ui/badge.tsx
 D src/components/ui/button.tsx
 D src/components/ui/card.tsx
 D src/components/ui/design-system.tsx
 D src/components/ui/dialog.tsx
 D src/components/ui/input.tsx
 D src/components/ui/label.tsx
 D src/features/admin/components/AdminLoginForm.tsx
 D src/features/admin/components/AdminNav.tsx
 D src/features/admin/components/AdminShell.tsx
 D src/features/admin/components/DesignEditor.tsx
 D src/features/admin/components/ProductEditor.tsx
 D src/features/admin/product-editor-state.test.ts
 D src/features/admin/product-editor-state.ts
 D src/features/catalog/cart-storage.ts
 D src/features/catalog/components/CartView.tsx
 D src/features/catalog/components/CatalogView.tsx
 D src/features/catalog/components/CheckoutView.tsx
 D src/features/catalog/components/ProductCard.tsx
 D src/features/catalog/components/ProductView.tsx
 D src/features/catalog/data/featured-products.test.ts
 D src/features/catalog/data/featured-products.ts
 D src/features/catalog/design.ts
 D src/lib/money.ts
 D src/lib/supabase/browser.ts
 D src/lib/supabase/server.ts
 D src/lib/utils.ts
 D src/lib/whatsapp.test.ts
 D src/lib/whatsapp.ts
 M src/server/auth/admin-authorization.ts
 D src/server/catalog/admin-catalog.test.ts
 M src/server/catalog/admin-catalog.ts
 D src/server/catalog/admin-designs.test.ts
 M src/server/catalog/admin-designs.ts
 D src/server/catalog/public-catalog.test.ts
 M src/server/catalog/public-catalog.ts
 D src/server/checkout/checkout.test.ts
 M src/server/checkout/checkout.ts
 D src/server/config/env.ts
 D src/server/config/readiness.test.ts
 D src/server/config/readiness.ts
 D src/server/config/runtime.ts
 D src/server/http/responses.ts
 M src/server/orders/admin-orders.ts
 M src/server/payments/mercado-pago.ts
 M src/server/settings/store-settings.ts
 M src/server/shipping/checkout-shipping.ts
 D src/server/supabase/admin.ts
 M src/supabase/README.md
?? LLM_CONTEXT.md
?? docs/adr/0005-modular-repo-structure.md
?? docs/architecture.md
?? docs/database.md
?? docs/design/archive/
?? docs/generated/
?? docs/product.md
?? specs/active/
?? src/features/admin/model/
?? src/features/admin/server/
?? src/features/admin/ui/
?? src/features/catalog/model/
?? src/features/catalog/ui/
?? src/features/store-shell/
?? src/platform/
?? src/screens/
?? src/server/catalog/commands/
?? src/server/catalog/queries/
?? src/server/checkout/use-cases/
?? src/shared/
```

## How To Run / Verify

- `pnpm install`
- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm start`

Source: `README.md` and `package.json`. This repo uses `pnpm@11.0.9`; npm-style script names are collector inference only.

## Top-Level Layout

- `.env.example`: 1 files
- `.gitignore`: 1 files
- `CHANGELOG.md`: 1 files
- `README.md`: 1 files
- `components.json`: 1 files
- `docs`: 11 files
- `eslint.config.mjs`: 1 files
- `next-env.d.ts`: 1 files
- `next.config.ts`: 1 files
- `package.json`: 1 files
- `pnpm-workspace.yaml`: 1 files
- `postcss.config.mjs`: 1 files
- `public`: 4 files
- `src`: 56 files
- `tailwind.config.ts`: 1 files
- `tsconfig.json`: 1 files
- `vitest.config.ts`: 1 files

## Module Map

- `eslint.config.mjs`: `eslint.config.mjs`
- `next-env.d.ts`: `next-env.d.ts`
- `next.config.ts`: `next.config.ts`
- `postcss.config.mjs`: `postcss.config.mjs`
- `src/app`: `src/app/(store)/carrito/page.tsx`, `src/app/(store)/catalogo/page.tsx`, `src/app/(store)/checkout/page.tsx`, `src/app/(store)/layout.tsx`, `src/app/(store)/page.tsx`, `src/app/(store)/producto/[slug]/page.tsx`, `src/app/admin/(panel)/configuracion/page.tsx`, `src/app/admin/(panel)/disenos/[slug]/page.tsx`
- `src/server`: `src/server/auth/admin-authorization-rules.test.ts`, `src/server/auth/admin-authorization-rules.ts`, `src/server/auth/admin-authorization.ts`, `src/server/auth/admin-bootstrap.test.ts`, `src/server/auth/admin-bootstrap.ts`, `src/server/auth/redirects.test.ts`, `src/server/auth/redirects.ts`, `src/server/catalog/admin-catalog.ts`
- `src/supabase`: `src/supabase/migrations/20260517143000_initial_schema.sql`, `src/supabase/migrations/20260626090000_catalog_assets.sql`, `src/supabase/migrations/20260626120000_checkout_production_hardening.sql`, `src/supabase/migrations/20260626130000_fix_checkout_public_code_ambiguity.sql`, `src/supabase/migrations/20260626140000_update_admin_order_operation.sql`
- `tailwind.config.ts`: `tailwind.config.ts`
- `vitest.config.ts`: `vitest.config.ts`

## Architecture Summary

Current architecture authority is `docs/architecture.md`, with routing guidance in
`LLM_CONTEXT.md` and repo-specific guardrails in `AGENTS.md`.

Summary:

- `src/app/**` is the Next.js routing boundary.
- `src/screens/**` owns page composition for store/admin routes.
- `src/features/**` owns product feature UI, model/state and feature server adapters.
- `src/shared/**` owns product-agnostic reusable code; `shared/ui` is presentational.
- `src/platform/**` owns technical infrastructure such as Supabase clients, config and HTTP helpers.
- `src/server/**` owns server-side business logic by capability/use case.
- `src/supabase/migrations/**` is the schema source of truth.

## Data Flow

Current data-flow authority is `docs/architecture.md`.

Key flows:

- Public catalog reads Supabase when configured and local typed fallback only outside production.
- Checkout validates idempotency, buyer, cart and delivery server-side before creating local order/payment rows and a Mercado Pago preference.
- Mercado Pago webhook validates signature, deduplicates events, fetches payment server-side, validates order reference/amount/currency, and updates payment/order state.
- Admin Server Actions authorize before mutation and revalidate affected routes.

## Decisions / Constraints

Facts should come from ADRs, docs, comments, config, and package choices. Conflicts should be listed explicitly.

## TODOs / Migration Notes

- `docs/adr/0000-template.md:3` - **Estado:** proposed | accepted | superseded | deprecated | rejected
- `docs/adr/README.md:15` - Estados validos: `proposed`, `accepted`, `superseded`, `deprecated`, `rejected`.
- `src/supabase/config.toml:389` # Experimental features may be deprecated any time

## File Tree

- `.env.example`
- `.gitignore`
- `CHANGELOG.md`
- `README.md`
- `components.json`
- `docs/adr/0000-template.md`
- `docs/adr/0001-nextjs-fullstack-mercado-pago.md`
- `docs/adr/0002-supabase-postgres-auth-admin-google.md`
- `docs/adr/0003-google-maps-envio-distancia.md`
- `docs/adr/0004-pnpm-vercel-nextjs-deploy.md`
- `docs/adr/README.md`
- `docs/design/README.md`
- `docs/design/chichitos-visual-brief.md`
- `docs/design/exports/.gitkeep`
- `docs/design/inbox/.gitkeep`
- `docs/design/references/.gitkeep`
- `eslint.config.mjs`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `pnpm-workspace.yaml`
- `postcss.config.mjs`
- `public/brand/logo-chichitos-dark.png`
- `public/brand/logo-chichitos-full.png`
- `public/brand/logo-chichitos-white.png`
- `public/favicon.ico`
- `src/app/(store)/carrito/page.tsx`
- `src/app/(store)/catalogo/page.tsx`
- `src/app/(store)/checkout/page.tsx`
- `src/app/(store)/layout.tsx`
- `src/app/(store)/page.tsx`
- `src/app/(store)/producto/[slug]/page.tsx`
- `src/app/admin/(panel)/configuracion/page.tsx`
- `src/app/admin/(panel)/disenos/[slug]/page.tsx`
- `src/app/admin/(panel)/disenos/nuevo/page.tsx`
- `src/app/admin/(panel)/disenos/page.tsx`
- `src/app/admin/(panel)/layout.tsx`
- `src/app/admin/(panel)/page.tsx`
- `src/app/admin/(panel)/pedidos/[id]/page.tsx`
- `src/app/admin/(panel)/pedidos/page.tsx`
- `src/app/admin/(panel)/productos/[slug]/page.tsx`
- `src/app/admin/(panel)/productos/nuevo/page.tsx`
- `src/app/admin/(panel)/productos/page.tsx`
- `src/app/admin/actions.ts`
- `src/app/admin/login/page.tsx`
- `src/app/api/checkout/route.ts`
- `src/app/api/health/route.ts`
- `src/app/api/mercado-pago/webhook/route.ts`
- `src/app/api/readiness/route.ts`
- `src/app/auth/callback/route.ts`
- `src/app/favicon.ico`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/server/auth/admin-authorization-rules.test.ts`
- `src/server/auth/admin-authorization-rules.ts`
- `src/server/auth/admin-authorization.ts`
- `src/server/auth/admin-bootstrap.test.ts`
- `src/server/auth/admin-bootstrap.ts`
- `src/server/auth/redirects.test.ts`
- `src/server/auth/redirects.ts`
- `src/server/catalog/admin-catalog.ts`
- `src/server/catalog/admin-designs.ts`
- `src/server/catalog/public-catalog.ts`
- `src/server/checkout/checkout.ts`
- `src/server/orders/admin-orders.test.ts`
- `src/server/orders/admin-orders.ts`
- `src/server/payments/mercado-pago.test.ts`
- `src/server/payments/mercado-pago.ts`
- `src/server/settings/store-settings.test.ts`
- `src/server/settings/store-settings.ts`
- `src/server/shipping/calculate-shipping-cost.test.ts`
- `src/server/shipping/calculate-shipping-cost.ts`
- `src/server/shipping/checkout-shipping.test.ts`
- `src/server/shipping/checkout-shipping.ts`
- `src/supabase/.gitignore`
- `src/supabase/README.md`
- `src/supabase/config.toml`
- `src/supabase/migrations/20260517143000_initial_schema.sql`
- `src/supabase/migrations/20260626090000_catalog_assets.sql`
- `src/supabase/migrations/20260626120000_checkout_production_hardening.sql`
- `src/supabase/migrations/20260626130000_fix_checkout_public_code_ambiguity.sql`
- `src/supabase/migrations/20260626140000_update_admin_order_operation.sql`
- `tailwind.config.ts`
- `tsconfig.json`
- `vitest.config.ts`

## Selected Source Excerpts

### `README.md`

```md
# Chichitos Web

Ecommerce full-stack para Chichitos, marca argentina de ropa infantil estampada
con DTF y diseños propios.

## Stack

- Next.js 16.2.6 App Router + React 19.2.4 + TypeScript.
- pnpm 11.0.9, Node >= 20.9.0.
- Vercel como hosting/deploy objetivo.
- Supabase Postgres/Auth para datos y admin.
- Mercado Pago Checkout Pro para pagos.
- Google Maps Platform para dirección y distancia de envío.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Documentación clave

- `AGENTS.md` - reglas locales para agentes, límites de arquitectura y seguridad.
- `LLM_CONTEXT.md` - mapa corto de lectura para agentes.
- `docs/product.md` - alcance y flujos vigentes del producto.
- `docs/architecture.md` - arquitectura actual y boundaries del repo.
- `docs/adr/` - decisiones arquitectónicas aceptadas.
- `docs/database.md` - resumen de schema y accesos esperados.
- `docs/design/` - guía visual vigente y archivo histórico de bundles de diseño.
- `specs/active/` - specs activas para cambios materiales.

## Seguridad

No commitear secretos. Usar `.env.example` como lista de variables esperadas y
configurar valores reales en el entorno local o Vercel.
```

### `docs/adr/0000-template.md`

```md
# ADR-NNNN: Titulo corto y descriptivo

- **Estado:** proposed | accepted | superseded | deprecated | rejected
- **Fecha:** YYYY-MM-DD
- **Decisores:** nombres o roles
- **Unidad:** chichitos-web
- **Supersede:** ADR-MMMM si aplica
- **Superseded by:** ADR-MMMM si aplica

## Contexto

Que problema o situacion motivo esta decision. Incluir restricciones tecnicas, comerciales y operativas relevantes.

## Alternativas evaluadas

1. **Alternativa A** - Pros, contras y motivo de descarte.
2. **Alternativa B** - Pros, contras y motivo de descarte.
3. **No hacer nada** - Si aplica, explicar por que no alcanza.

## Decision

Decision clara en una o dos oraciones.

## Consecuencias

- **Positivas:** beneficios esperados.
- **Negativas:** costos, limites o riesgos aceptados.
- **Deuda introducida:** que queda pendiente.
- **Seguridad:** impacto si aplica.
- **Operacion:** impacto si aplica.

## Como se revierte o migra si falla

- **Plan:** pasos para cambiar o revertir la decision.
- **Senales:** eventos o metricas que indicarian que la decision falla.
- **Costo cualitativo:** trivial | moderado | costoso | irreversible.

## Referencias

- Links a documentacion, issues, PRs o ADRs relacionados.
```

### `docs/adr/0001-nextjs-fullstack-mercado-pago.md`

```md
# ADR-0001: Next.js full-stack con Mercado Pago Checkout Pro

- **Estado:** accepted
- **Fecha:** 2026-05-17
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

Chichitos necesita un ecommerce para vender ropa infantil estampada con DTF y disenos propios en Argentina.

El MVP debe permitir compra online completa, consultas por WhatsApp, administracion simple y una operacion inicial made-to-order: cada compra se arma por talle, color y diseno. Todavia no hay stock estricto, pero el modelo debe permitir incorporarlo mas adelante sin reescribir pedidos ni catalogo.

El proyecto arranca greenfield, por lo que conviene elegir una arquitectura simple, verificable y con bajo costo operativo inicial, sin cerrar la puerta a separar backend o admin si el negocio crece.

## Alternativas evaluadas

1. **Next.js full-stack con backend server-side propio**
   - Pros: un solo proyecto, un solo deploy, buen soporte SEO, Server Components para datos server-side, Route Handlers para webhooks y endpoints, baja friccion para MVP.
   - Contras: requiere disciplina para no mezclar UI con logica de negocio.
   - Resultado: elegida.

2. **Frontend Next.js + backend separado desde el dia uno**
   - Pros: boundaries fisicos claros, escalabilidad independiente, backend reusable por otros clientes.
   - Contras: mayor infraestructura, mas deploys, mas configuracion, mas superficie operativa para un MVP.
   - Resultado: descartada por sobredimensionar la etapa inicial.

3. **Plataforma ecommerce SaaS o plugin ecommerce existente**
   - Pros: admin, checkout y operacion resueltos mas rapido.
   - Contras: menor control sobre experiencia, modelo made-to-order y evolucion tecnica; dependencia fuerte de plataforma.
   - Resultado: descartada para este proyecto porque se busca una web propia y extensible.

4. **Catalogo estatico con cierre por WhatsApp**
   - Pros: muy simple y rapido.
   - Contras: no cumple compra online completa ni trazabilidad automatica de pagos.
   - Resultado: descartada por requisito funcional.

## Decision

Adoptamos Next.js full-stack con App Router como arquitectura inicial de Chichitos Web.

El frontend publico, el admin simple y el backend server-side viviran en el mismo repositorio y deployment. La logica de negocio se mantendra separada de las paginas y componentes visuales mediante modulos server-side. Mercado Pago Checkout Pro sera la integracion de pago inicial, y los webhooks validados seran la fuente de verdad para el estado de pago.

## Consecuencias

- **Positivas:** menor costo operativo inicial, velocidad de desarrollo, buen SEO, experiencia integrada para catalogo, carrito, checkout y admin.
- **Positivas:** permite crear preferencias de Mercado Pago server-side sin exponer credenciales al navegador.
- **Positivas:** permite recibir webhooks en Route Handlers y actualizar ordenes en el mismo dominio.
- **Negativas:** exige mantener boundaries internos claros para evitar acoplar UI, pagos, ordenes y persistencia.
- **Negativas:** si el volumen o complejidad crecen mucho, podria requerir extraer backend o admin.
- **Deuda introducida:** el admin inicial sera simple y no resolvera roles complejos, auditoria avanzada, gestion detallada de inventario ni integracion con operadores logisticos.
- **Seguridad:** secretos de Mercado Pago y credenciales admin deben vivir en variables de entorno; el cliente no debe poder definir precios, estado de pago ni permisos.
- **Operacion:** el pago no se considera confirmado por retorno del navegador; solo por webhook validado y consulta server-side si hace falta.

## Como se revierte o migra si falla

- **Plan:** extraer la logica bajo modulos server-side a un backend separado, manteniendo contratos HTTP para checkout, ordenes, productos y admin.
- **Plan:** mantener el frontend Next.js consumiendo esos contratos, sin reescribir vistas publicas.
- **Senales:** el admin requiere roles complejos, integraciones externas intensivas, jobs asincronicos pesados, escalado separado o reglas de negocio que vuelven insuficiente el deployment unico.
- **Costo cualitativo:** moderado si los boundaries internos se respetan; costoso si la logica queda mezclada con componentes y rutas.

## Referencias

- Next.js App Router: https://nextjs.org/docs/app
- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
- Mercado Pago Checkout Pro: https://www.mercadopago.com.ar/developers/es/docs/prestashop/payment-configuration/checkout-pro
- Mercado Pago webhooks: https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/payment-notifications
```

### `docs/adr/0002-supabase-postgres-auth-admin-google.md`

```md
# ADR-0002: Supabase Postgres y Auth admin con Google

- **Estado:** accepted
- **Fecha:** 2026-05-17
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

Chichitos Web necesita persistencia para catalogo, disenos, pedidos, pagos, configuracion comercial y datos del admin. Tambien necesita autenticacion para un panel administrativo simple.

El MVP debe mantener bajo costo operativo y velocidad de implementacion, pero sin perder una base solida para evolucionar a stock por variante, roles mas finos, auditoria y consultas operativas.

La emprendedora quiere administrar con una cuenta Gmail/Google. El sitio no requiere cuentas de cliente en el MVP.

## Alternativas evaluadas

1. **Supabase Postgres + Supabase Auth con Google**
   - Pros: Postgres administrado, Auth integrada, soporte para login con Google, Row Level Security, buen encaje con Next.js server-side.
   - Contras: dependencia de plataforma y necesidad de configurar politicas correctamente.
   - Resultado: elegida.

2. **Postgres administrado separado + Auth propia**
   - Pros: mayor control y menor acoplamiento a una plataforma.
   - Contras: mas implementacion, mas seguridad propia, mas superficie operativa para un MVP.
   - Resultado: descartada por costo inicial.

3. **SQLite/local DB o archivo JSON inicial**
   - Pros: muy simple para prototipo.
   - Contras: no sirve bien para compra online real, webhooks, concurrencia, admin y despliegue productivo.
   - Resultado: descartada por no ser suficiente para ecommerce.

4. **Auth propia con email/password**
   - Pros: control total.
   - Contras: implica gestionar passwords, recovery, hardening y riesgo de seguridad innecesario para admin simple.
   - Resultado: descartada para el MVP.

## Decision

Usaremos Supabase como proveedor inicial de base de datos Postgres y autenticacion.

El admin usara login con Google/Gmail mediante Supabase Auth. El acceso administrativo no se concedera a cualquier cuenta Google autenticada: debe existir una allowlist o un rol admin persistido server-side. Las operaciones administrativas se validaran en backend y no dependeran solo del estado del cliente.

## Consecuencias

- **Positivas:** acelera el MVP con Postgres administrado, Auth integrada y una ruta clara para Next.js server-side.
- **Positivas:** permite evolucionar el modelo hacia stock por variante, historial de pedidos y configuracion comercial sin cambiar de motor.
- **Positivas:** reduce el riesgo de implementar passwords propios.
- **Negativas:** introduce dependencia de Supabase como plataforma.
- **Negativas:** exige configurar correctamente variables de entorno, redirect URLs, dominio y politicas de acceso.
- **Deuda introducida:** el MVP puede empezar con un modelo admin simple; roles avanzados, auditoria detallada y permisos granulares quedan para una etapa posterior.
- **Seguridad:** Row Level Security debe estar habilitada en tablas expuestas; las rutas server-side deben validar rol admin antes de mutar datos.
- **Operacion:** se debe configurar Google OAuth, Site URL, Redirect URLs y cuentas autorizadas antes de produccion.

## Como se revierte o migra si falla

- **Plan:** mantener acceso a datos a traves de repositorios internos; si Supabase deja de convenir, migrar Postgres a otro proveedor y reemplazar Auth por otro proveedor compatible con OAuth.
- **Plan:** evitar dependencias directas a Supabase en componentes visuales; centralizar clientes y queries.
- **Senales:** costos no aceptables, limites de plataforma, necesidad de auth/roles no soportados por el modelo elegido o requerimientos operativos incompatibles.
- **Costo cualitativo:** moderado si el acceso a datos y auth quedan encapsulados; costoso si Supabase queda acoplado en toda la UI.

## Referencias

- Supabase Database: https://supabase.com/docs/guides/database/overview
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Server-Side Auth: https://supabase.com/docs/guides/auth/server-side
- Supabase Auth con Google: https://supabase.com/docs/guides/auth/social-login/auth-google
```

### `docs/adr/0003-google-maps-envio-distancia.md`

```md
# ADR-0003: Google Maps Platform para direccion y distancia de envio

- **Estado:** accepted
- **Fecha:** 2026-05-17
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

Chichitos necesita calcular costo de envio segun distancia desde la tienda: hasta 3 km aplica un precio fijo y, superado ese radio, el precio aumenta por cada tramo adicional de 0.5 km.

La direccion/origen de la tienda y los valores de envio deben poder configurarse desde el panel admin. Para reducir errores de direccion y calcular distancia de forma consistente, se evalua integrar Google Maps Platform.

## Alternativas evaluadas

1. **Google Maps Platform con Places/Autocomplete y calculo server-side de distancia**
   - Pros: mejor UX al cargar direcciones, normalizacion de ubicaciones, calculo de distancia mas confiable que texto libre.
   - Contras: requiere cuenta Google Cloud con billing, restricciones de API keys, control de costos y manejo de cuotas.
   - Resultado: elegida.

2. **Direccion manual + distancia declarada por el comprador o admin**
   - Pros: implementacion simple y sin proveedor externo.
   - Contras: propensa a errores, manipulable y mala UX para checkout.
   - Resultado: viable como fallback operativo, no ideal para compra online completa.

3. **Tabla manual por zonas/barrios**
   - Pros: control total de costos y simple de entender para la emprendedora.
   - Contras: menos precisa, requiere mantenimiento manual y no sigue naturalmente la regla por kilometros.
   - Resultado: descartada como regla principal, puede servir como fallback futuro.

## Decision

Usaremos Google Maps Platform para asistir carga de direcciones y calcular distancia de envio.

El admin configurara direccion/origen de tienda, precio fijo hasta 3 km e incremento por cada 0.5 km adicional. El checkout usara direccion de envio del comprador para calcular distancia server-side y obtener el costo aplicable. Las API keys se restringiran por uso y entorno; los calculos de precio finales ocurriran en backend.

Debe existir fallback operativo para cuando Google Maps no pueda resolver una direccion, no responda o el costo operativo obligue a pausar la integracion.

## Consecuencias

- **Positivas:** mejora UX, reduce errores de direccion y permite automatizar el costo de envio.
- **Positivas:** mantiene la regla comercial configurable desde admin.
- **Negativas:** introduce dependencia externa y posible costo variable.
- **Negativas:** requiere manejo cuidadoso de API keys, cuotas y errores del proveedor.
- **Deuda introducida:** definir fallback si Google Maps no responde o si el costo excede lo aceptable.
- **Seguridad:** la clave publica de mapas debe estar restringida por dominio; claves server-side deben estar solo en variables de entorno.
- **Operacion:** se necesita monitorear uso/costo y configurar alertas de billing.

## Como se revierte o migra si falla

- **Plan:** reemplazar calculo automatico por tabla de zonas o carga manual de costo de envio desde admin.
- **Plan:** mantener el calculo de envio encapsulado en un servicio interno para cambiar proveedor sin tocar checkout completo.
- **Senales:** costo excesivo, errores frecuentes de geocoding/routing, mala cobertura local o friccion operativa con Google Cloud.
- **Costo cualitativo:** moderado si se encapsula el servicio de distancia; costoso si la integracion queda acoplada a componentes de UI.

## Referencias

- Google Maps Platform - Routes API: https://developers.google.com/maps/documentation/routes
- Google Maps Platform - Places Autocomplete: https://developers.google.com/maps/documentation/javascript/place-autocomplete
- Google Maps Platform - Geocoding API: https://developers.google.com/maps/documentation/geocoding
- Google Maps Platform - API Security Best Practices: https://developers.google.com/maps/api-security-best-practices
```

### `docs/adr/0004-pnpm-vercel-nextjs-deploy.md`

```md
# ADR-0004: pnpm y Vercel para build y despliegue

- **Estado:** accepted
- **Fecha:** 2026-05-17
- **Decisores:** Chichitos, desarrollo
- **Unidad:** chichitos-web
- **Supersede:** no aplica
- **Superseded by:** no aplica

## Contexto

Chichitos Web necesita un flujo reproducible para instalar dependencias, construir la app Next.js y desplegar previews/produccion con bajo costo operativo.

El proyecto sera un single-app Next.js full-stack. No hay monorepo ni necesidad actual de infraestructura propia.

## Alternativas evaluadas

1. **pnpm + Vercel**
   - Pros: lockfile reproducible, installs rapidos, buen encaje con Next.js, Vercel detecta Next.js y pnpm por `pnpm-lock.yaml`.
   - Contras: dependencia de Vercel para hosting y funciones serverless.
   - Resultado: elegida.

2. **npm + Vercel**
   - Pros: menor friccion universal.
   - Contras: installs mas lentos y menor control de workspace/dependencias que pnpm.
   - Resultado: descartada por preferencia tecnica del proyecto.

3. **pnpm + VPS/Docker**
   - Pros: mas control de infraestructura.
   - Contras: mayor operacion, backups, runtime, TLS, despliegue y monitoreo a cargo del equipo.
   - Resultado: descartada para el MVP.

4. **Plataforma ecommerce SaaS**
   - Pros: hosting y operacion simplificados.
   - Contras: contradice la decision de web propia y modelo extensible.
   - Resultado: descartada por ADR-0001.

## Decision

Usaremos pnpm como package manager del repo y Vercel como plataforma inicial de hosting/deploy.

El repositorio debe versionar `pnpm-lock.yaml` y declarar el package manager en `package.json`. Los comandos base seran `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`.

Vercel debe usar el preset de Next.js y detectar pnpm desde el lockfile. Las variables de entorno y secretos se configuraran por ambiente en Vercel, Supabase, Mercado Pago y Google Cloud, no en el repositorio.

## Consecuencias

- **Positivas:** setup simple, previews por branch, buen soporte para Next.js full-stack y bajo costo operativo inicial.
- **Positivas:** `pnpm-lock.yaml` mejora reproducibilidad local/CI/deploy.
- **Negativas:** dependencia operativa de Vercel y sus limites de funciones, builds y pricing.
- **Negativas:** si el backend crece hacia jobs largos o procesos persistentes, puede requerir una plataforma adicional.
- **Operacion:** Vercel debe tener variables separadas para preview y produccion.
- **Seguridad:** `.env` no se versiona; `.env.example` documenta solo nombres y placeholders.

## Como se revierte o migra si falla

- **Plan:** mantener la app Next.js portable para poder moverla a otro host compatible con Node.js.
- **Plan:** evitar dependencias especificas de Vercel salvo que se justifiquen por ADR.
- **Plan:** si el backend requiere procesos largos, evaluar worker externo o backend separado.
- **Costo cualitativo:** bajo para cambiar de package manager al inicio; moderado para migrar hosting si se usan capacidades especificas de Vercel.

## Referencias

- Next.js create-next-app: https://nextjs.org/docs/app/api-reference/cli/create-next-app
- Next.js App Router: https://nextjs.org/docs/app
- Vercel builds y deteccion de package manager: https://vercel.com/docs/fundamentals/builds
- Vercel project settings: https://vercel.com/docs/project-configuration/project-settings
```

### `docs/adr/README.md`

```md
# ADR - Chichitos Web

Architecture Decision Records para Chichitos Web.

## Alcance

Este directorio contiene decisiones arquitectonicas que afectan al ecommerce, su admin, integraciones de pago, modelo de datos, seguridad, operacion y stack.

No usar ADR para decisiones triviales, cambios cosmeticos o implementaciones reversibles sin impacto estructural.

## Convenciones

- Numeracion secuencial con padding de 4 digitos: `0001`, `0002`, etc.
- Nombre de archivo en kebab-case: `0001-nextjs-fullstack-mercado-pago.md`.
- Estados validos: `proposed`, `accepted`, `superseded`, `deprecated`, `rejected`.
- Un ADR aceptado no se reescribe en su decision principal; si cambia, se crea otro ADR que lo supersede.
- Cada ADR debe explicar contexto, alternativas, decision, consecuencias y reversibilidad.

## Indice

| ADR | Titulo | Estado | Fecha |
| --- | --- | --- | --- |
| 0001 | Next.js full-stack con Mercado Pago Checkout Pro | accepted | 2026-05-17 |
| 0002 | Supabase Postgres y Auth admin con Google | accepted | 2026-05-17 |
| 0003 | Google Maps Platform para direccion y distancia de envio | accepted | 2026-05-17 |
| 0004 | pnpm y Vercel para build y despliegue | accepted | 2026-05-17 |
| 0005 | Modular repo structure for Chichitos Web | accepted | 2026-07-08 |
```

### `docs/design/README.md`

```md
# Diseño - Chichitos Web

Esta carpeta guarda la fuente visual vigente y el historial de handoffs de
diseño. Antes de cambiar dirección visual, revisar este archivo y
`docs/design/chichitos-visual-brief.md`.

## Fuentes vigentes

- `docs/design/chichitos-visual-brief.md` - brief visual base.
- `public/brand/` - logos usados por la app real.
- `src/app/globals.css` y `src/shared/ui/design-system.tsx` - tokens y
  componentes visuales implementados.

## Histórico

- `docs/design/archive/2026-05-25-chichitos-system/` - bundle exportado de
  Claude Design con chats, UI kit, previews, assets y prototipos. Es referencia
  histórica, no autoridad de producción por sí sola.

## Reglas

- No guardar secretos, PII ni datos de clientes.
- Si un asset pasa a producción, moverlo a `public/brand/` u otra ruta pública
  explícita y actualizar el código.
- Archivos nuevos sin clasificar pueden entrar en `docs/design/inbox/`, pero
  deben moverse a `references/`, `archive/` o producción cuando se confirme su
  rol.
```

### `docs/design/chichitos-visual-brief.md`

```md
# Brief visual - Chichitos Web

## Objetivo

Generar propuestas visuales para un ecommerce de ropa infantil estampada con DTF, con disenos propios, compra online completa y una identidad calida, creativa y confiable.

## Prompt base para v0 / herramientas de diseno

```text
Disena una web ecommerce responsive para "Chichitos", una marca argentina de ropa infantil estampada con DTF y disenos propios.

Objetivo del sitio:
- Vender online ropa infantil configurable por talle, color y diseno.
- Transmitir ternura, creatividad artesanal, confianza y calidad.
- Mostrar que los disenos son de autoria propia.
- Incluir WhatsApp como canal de consulta, pero mantener checkout online completo.

Estilo visual:
- Calido, jugueton y cuidado, sin parecer generico ni infantilizado en exceso.
- Evitar estetica corporate SaaS.
- Evitar paleta violeta generica y fondos blancos planos.
- Usar una direccion visual tipo boutique infantil creativa: texturas suaves, formas organicas, detalles de estampa, ilustraciones sutiles, etiquetas tipo prenda y composiciones editoriales.
- Paleta sugerida: crema algodon, durazno suave, verde salvia, celeste lavado, acentos coral o mostaza.
- Tipografia con personalidad: una serif suave o display amable para titulos y una sans legible para textos. Evitar Inter/Roboto/Arial como primera opcion.

Pantallas requeridas:
1. Home:
   - Hero con propuesta de valor clara.
   - CTA principal "Comprar online".
   - CTA secundario "Consultar por WhatsApp".
   - Bloque de productos destacados.
   - Bloque "Disenos propios estampados en DTF".
   - Bloque de como comprar: elegir prenda, elegir talle/color/diseno, pagar, recibir o retirar.

2. Catalogo:
   - Grid de productos.
   - Filtros por prenda, talle, color y tipo de diseno.
   - Cards con imagen, precio base y etiqueta si admite personalizacion.

3. Producto:
   - Galeria de imagenes.
   - Selector de talle.
   - Selector de color.
   - Selector de diseno.
   - Opcion de personalizacion con costo extra.
   - Guia de talles visible.
   - CTA agregar al carrito.
   - CTA consultar por WhatsApp con producto prellenado.

4. Carrito:
   - Items con snapshot de producto, talle, color, diseno, personalizacion y cantidad.
   - Subtotal, costo de envio/retiro y total.
   - CTA checkout.

5. Checkout:
   - Datos del comprador.
   - Metodo de entrega: retiro o envio.
   - Envio calculado por distancia: hasta 3 km precio fijo, luego incremento por cada 0.5 km.
   - Pago con Mercado Pago.

6. Admin simple:
   - Dashboard limpio para la emprendedora.
   - Productos, disenos, pedidos y configuracion comercial.
   - Editor simple de politicas de cambios/devoluciones.
   - Estados de pedido: nuevo, en produccion, listo, enviado, completado, cancelado.

Componentes clave:
- Header con logo, catalogo, como comprar, WhatsApp y carrito.
- Floating WhatsApp button no invasivo.
- Product cards con imagen grande y etiquetas suaves.
- Empty states cuidados.
- Estados de loading/error accesibles.
- Footer con politicas, contacto, medios de pago y entrega.

Requisitos UX:
- Mobile-first.
- Accesible, con buen contraste y foco visible.
- Checkout simple, de pocos pasos.
- No usar imagenes reales de menores; usar placeholders de prendas, estampas o mockups textiles.
- El resultado debe sentirse como una marca real, no como template generico.

Entregable:
- Propuesta visual completa con home, catalogo, producto, carrito, checkout y admin simple.
- Componentes reutilizables.
- Tokens de color, tipografia, radios, sombras y espaciado.
```

## Pendientes de marca

- Logo.
- Paleta final.
- Fotografias o mockups de prendas.
- Guia de talles.
- Tono de voz.
- Numero de WhatsApp Business.
```

### `package.json`

```json
{
  "name": "chichitos-web",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@11.0.9",
  "engines": {
    "node": ">=20.9.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@supabase/ssr": "^0.10.3",
    "@supabase/supabase-js": "^2.105.4",
    "autoprefixer": "^10.5.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "next": "16.2.6",
    "postcss": "^8.5.14",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwind-merge": "^2.6.1",
    "tailwindcss": "^3.4.19"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "typescript": "^5",
    "vitest": "^4.1.6"
  }
}
```

### `src/supabase/README.md`

```md
# Supabase

Contrato operativo inicial para la base de datos de Chichitos Web.

## Fuente de verdad

Las migraciones versionadas bajo `src/supabase/migrations/` son la fuente de verdad del schema. Evitar cambios manuales en el dashboard que no queden reflejados en una migracion.

Migracion inicial:

- `src/supabase/migrations/20260517143000_initial_schema.sql`

## Setup del proyecto remoto

1. Crear un proyecto Supabase para Chichitos.
2. Copiar al `.env` local:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` para backend server-side, o `SUPABASE_SERVICE_ROLE_KEY` como fallback legacy.
3. Mantener la clave elevada de Supabase solo server-side. Nunca usarla en componentes cliente ni exponerla con prefijo `NEXT_PUBLIC_`.
4. Configurar Google como provider de Auth en Supabase cuando se implemente login admin.
5. Agregar URLs de redirect cuando exista la ruta de callback de auth:
   - Local: `http://localhost:3000/auth/callback`
   - Vercel preview/production: dominios correspondientes cuando existan.

## Aplicar migraciones

Opcion recomendada con Supabase CLI:

```powershell
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Estado actual: la CLI `supabase` no esta instalada en esta maquina.

Opcion temporal sin CLI:

1. Abrir Supabase Dashboard.
2. Ir a SQL Editor.
3. Ejecutar el contenido de `src/supabase/migrations/20260517143000_initial_schema.sql`.
4. No editar el schema luego desde el dashboard sin crear una migracion equivalente en el repo.

## Modelo de seguridad

- RLS esta habilitado en todas las tablas publicas del dominio.
- Catalogo activo es publico de solo lectura.
- Pedidos, pagos, direcciones y webhook events no tienen acceso publico.
- Admin se define por `public.admin_users` y la funcion privada `private.is_admin()`.
- El bootstrap inicial debe hacerse desde backend con `ADMIN_BOOTSTRAP_EMAILS` y clave elevada server-side.

## Estado tecnico

- Los clientes Supabase viven bajo `src/platform/supabase/`.
- El cliente elevado server-side esta en `src/platform/supabase/admin.ts`.
- El catalogo publico lee Supabase cuando hay configuracion real y usa fallback
  local solo fuera de produccion.
- Auth callback, bootstrap admin y autorizacion admin estan implementados.
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

## Safety Notes

- Secret-like filenames and common generated/dependency directories were skipped.

- Secret-looking assignment values inside included text were redacted.
