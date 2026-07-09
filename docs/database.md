# Database Schema

## Objetivo

Schema inicial para soportar el MVP de Chichitos sin acoplar el frontend a detalles de persistencia.

## Fuente de verdad

Las migraciones versionadas bajo `src/supabase/migrations/` son la fuente de
verdad del schema. Evitar cambios manuales en el dashboard que no queden
reflejados en una migracion.

## Principios aplicados

- Constraints reales para estados, dinero en centavos, slugs, snapshots y relaciones criticas.
- RLS habilitado desde la primera migracion.
- Catalogo publico separado de operaciones confidenciales.
- Ordenes guardan snapshot historico de lo comprado.
- Pagos y webhook events modelados con idempotencia, deduplicacion y reintento.
- Stock productivo modelado en `product_variant_stock` y reservas temporales en
  `stock_reservations`.

## Tablas principales

- `admin_users`: admins autorizados vinculados a Supabase Auth.
- `store_settings`: configuracion singleton de tienda, envio, politicas y WhatsApp.
- `products`: prendas vendibles.
- `product_sizes`: talles por producto.
- `product_colors`: colores por producto.
- `designs`: disenos DTF propios.
- `product_designs`: relacion producto-diseno.
- `product_personalization_options`: personalizacion y costo extra por producto.
- `orders`: pedido local previo a pago.
- `order_items`: snapshot historico de cada item comprado.
- `deliveries`: envio o retiro asociado a una orden.
- `payments`: estado y metadata de Mercado Pago.
- `payment_webhook_events`: inbox de deduplicacion, reintento y auditoria de webhooks.
- `product_variant_stock`: stock disponible por producto/talle/color/diseno.
- `stock_reservations`: reservas temporales asociadas a checkouts pendientes.

## Accesos esperados

- Publico anonimo: lectura de productos/disenos/opciones activas y settings publicos.
- Admin autenticado autorizado: acceso operativo por Server Actions; la lectura directa por Data API queda limitada por RLS y las mutaciones pasan por backend.
- Backend con secret key/service role: creacion de ordenes, pagos, webhook events, reservas de stock, mutaciones operativas y bootstrap admin.
- Admin autenticado: policies RLS delegan el chequeo de rol en `private.is_admin()` fuera del schema expuesto.
- Data API no otorga escritura directa a usuarios autenticados sobre catalogo,
  settings, ledger de pedidos, pagos, webhooks, stock ni reservas.

## Datos sensibles

- `orders`, `deliveries`, `payments` y `admin_users` contienen datos confidenciales.
- `payment_webhook_events.payload` y `payments.raw_payload` pueden contener metadata del proveedor; no deben exponerse a cliente.
- No se almacenan datos de tarjeta.
