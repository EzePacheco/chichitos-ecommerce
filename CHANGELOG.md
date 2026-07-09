# Changelog - Chichitos Web

Todos los cambios visibles de este proyecto se documentan en este archivo.

El formato sigue Keep a Changelog y el versionado sera SemVer durante el MVP.

## [Unreleased]

### Added

- Documentacion inicial del proyecto Chichitos Web.
- Base de decisiones arquitectonicas en `docs/adr/`.
- Brief visual inicial para generar propuestas de UI.
- Estructura para guardar referencias y exports de diseno.
- Bundle de design system de Claude Design organizado como referencia historica bajo `docs/design/archive/2026-05-25-chichitos-system/`.
- SPEC-001 actualizada con pnpm, Vercel, Google Maps aceptado, bootstrap admin por allowlist y criterios de scaffold.
- Scaffold tecnico Next.js con App Router, TypeScript, pnpm, ESLint, Vitest, rutas iniciales y health check.
- Tokens visuales iniciales de Chichitos y logos de marca bajo `public/brand/`.
- Funcion testeada para calcular costo de envio por radio base y tramos adicionales.
- Catalogo publico navegable con datos mock tipados, categorias, detalle por `/producto/[slug]` y CTA contextual de WhatsApp cuando exista numero configurado.
- Tests unitarios para helpers de catalogo publico.
- Migracion inicial de Supabase con schema de catalogo, settings, pedidos, pagos, webhooks, admin users, stock futuro y RLS.
- Funcion RLS de admin ubicada en schema privado `private.is_admin()` y grants explicitos para Data API.
- Documentacion operativa de Supabase y resumen del schema de base de datos.
- Dependencias oficiales de Supabase para Next.js SSR (`@supabase/supabase-js` y `@supabase/ssr`).
- Helper compartido para generar links de WhatsApp con telefono sanitizado.
- SPEC-002 de fidelidad visual al UI Kit y referencia obligatoria a `docs/design` para futuros cambios visuales.
- Alineacion visual de Home, Catalogo, Producto, Carrito, Checkout, Header, Footer, WhatsApp float y Admin con el UI Kit exportado.
- SPEC-003 de remediacion visual para corregir desviaciones contra `docs/design` antes de avanzar con nuevas funcionalidades.
- Separacion del shell publico en `src/app/(store)/layout.tsx`, dejando `/admin` y `/admin/login` sin header/footer/WhatsApp publicos.
- Ajustes de fidelidad visual en tokens, botones, chips, placeholders textiles, navegacion publica, WhatsApp float y marca visual de pago.
- SPEC-004 de onboarding admin y configuracion comercial con lectura/guardado server-side de `store_settings`.
- Formulario real en `/admin` para datos de tienda, WhatsApp, direccion del taller, parametros de envio, produccion, personalizacion, politicas y habilitacion de checkout.
- Tests unitarios para normalizacion de settings, precios en centavos, WhatsApp y estado de onboarding.
- SPEC-005 de catalogo admin productivo, uploads, stock por variante y checkout Mercado Pago.
- Catalogo publico preparado para leer Supabase con fallback local, admin de producto con upload a Storage, stock por variante y checkout server-side con webhook firmado de Mercado Pago.
- Panel admin separado en paginas de dashboard, pedidos, productos, disenos y configuracion, con edicion guiada de productos/disenos y actualizacion operativa de pedidos sin tocar pagos.
- `LLM_CONTEXT.md`, `docs/product.md`, `docs/architecture.md` y `docs/generated/README.md` como topologia documental compacta para humanos y agentes.
- ADR-0005 para la estructura modular `app -> screens -> features -> shared/platform/server`.
- Hardening de SPEC-005 para checkout productivo: grants Data API de menor privilegio, fingerprint de idempotencia de checkout, inbox reintentable de webhooks Mercado Pago, ventana anti-replay de firma, aplicacion transaccional de pago/orden/captura/liberacion de stock, y claim idempotente de preferencia MP.
- Sincronización documental de specs y rutas de autoridad: archivo de `specs/archive/` como historial técnico y ajuste de `README`, `LLM_CONTEXT.md` y `CHANGELOG` para reflejar estado activo/completado.

### Changed

- Reorganizacion interna de carpetas hacia `src/screens`, `src/shared`, `src/platform`, features con `ui/model/server`, y server use cases por capacidad.
- SPEC-005 archivada en `specs/archive/` y bundle histórico de diseño
  movido a `docs/design/archive/`.
- Documentacion de arquitectura, database y Supabase alineada con stock/reservas productivas y flujo de pagos server-side.

### Decisions

- ADR-0001 - Next.js full-stack con Mercado Pago Checkout Pro ([0001-nextjs-fullstack-mercado-pago.md](docs/adr/0001-nextjs-fullstack-mercado-pago.md)).
- ADR-0002 - Supabase Postgres y Auth admin con Google ([0002-supabase-postgres-auth-admin-google.md](docs/adr/0002-supabase-postgres-auth-admin-google.md)).
- ADR-0003 - Google Maps Platform para direccion y distancia de envio ([0003-google-maps-envio-distancia.md](docs/adr/0003-google-maps-envio-distancia.md)).
- ADR-0004 - pnpm y Vercel para build y despliegue ([0004-pnpm-vercel-nextjs-deploy.md](docs/adr/0004-pnpm-vercel-nextjs-deploy.md)).
- ADR-0005 - Modular repo structure for Chichitos Web ([0005-modular-repo-structure.md](docs/adr/0005-modular-repo-structure.md)).
