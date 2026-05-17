# Changelog - Chichitos Web

Todos los cambios visibles de este proyecto se documentan en este archivo.

El formato sigue Keep a Changelog y el versionado sera SemVer durante el MVP.

## [Unreleased]

### Added

- Documentacion inicial del proyecto Chichitos Web.
- Base de decisiones arquitectonicas en `docs/adr/`.
- Brief visual inicial para generar propuestas de UI.
- Estructura para guardar referencias y exports de diseno.
- Bundle de design system de Claude Design organizado bajo `docs/design/exports/2026-05-17-claude-design-chichitos-design-system/`.
- SPEC-001 actualizada con pnpm, Vercel, Google Maps aceptado, bootstrap admin por allowlist y criterios de scaffold.
- Scaffold tecnico Next.js con App Router, TypeScript, pnpm, ESLint, Vitest, rutas iniciales y health check.
- Tokens visuales iniciales de Chichitos y logos de marca bajo `public/brand/`.
- Funcion testeada para calcular costo de envio por radio base y tramos adicionales.
- Catalogo publico navegable con datos mock tipados, categorias, detalle por `/producto/[slug]` y CTA contextual de WhatsApp cuando exista numero configurado.
- Tests unitarios para helpers de catalogo publico.

### Decisions

- ADR-0001 - Next.js full-stack con Mercado Pago Checkout Pro ([0001-nextjs-fullstack-mercado-pago.md](docs/adr/0001-nextjs-fullstack-mercado-pago.md)).
- ADR-0002 - Supabase Postgres y Auth admin con Google ([0002-supabase-postgres-auth-admin-google.md](docs/adr/0002-supabase-postgres-auth-admin-google.md)).
- ADR-0003 - Google Maps Platform para direccion y distancia de envio ([0003-google-maps-envio-distancia.md](docs/adr/0003-google-maps-envio-distancia.md)).
- ADR-0004 - pnpm y Vercel para build y despliegue ([0004-pnpm-vercel-nextjs-deploy.md](docs/adr/0004-pnpm-vercel-nextjs-deploy.md)).
