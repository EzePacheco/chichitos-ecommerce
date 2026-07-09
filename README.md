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
- `specs/active/` - specs activas para cambios materiales en curso.
- `specs/archive/` - specs completadas o cerradas para historial técnico.

## Seguridad

No commitear secretos. Usar `.env.example` como lista de variables esperadas y
configurar valores reales en el entorno local o Vercel.
