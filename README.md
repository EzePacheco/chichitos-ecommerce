# Chichitos Web

Ecommerce full-stack para Chichitos, marca argentina de ropa infantil estampada con DTF y disenos propios.

## Stack inicial

- Next.js App Router + TypeScript.
- pnpm como package manager.
- Vercel como hosting/deploy objetivo.
- Supabase Postgres/Auth para datos y admin.
- Mercado Pago Checkout Pro para pagos.
- Google Maps Platform para direccion y distancia de envio.

## Comandos

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Documentacion clave

- `docs/adr/` - decisiones arquitectonicas.

## Seguridad

No commitear secretos. Usar `.env.example` como lista de variables esperadas y configurar valores reales en el entorno local o Vercel.
