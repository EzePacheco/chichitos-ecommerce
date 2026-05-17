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
