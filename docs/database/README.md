# Database Schema

## Objetivo

Schema inicial para soportar el MVP de Chichitos sin acoplar el frontend a detalles de persistencia.

## Principios aplicados

- Constraints reales para estados, dinero en centavos, slugs, snapshots y relaciones criticas.
- RLS habilitado desde la primera migracion.
- Catalogo publico separado de operaciones confidenciales.
- Ordenes guardan snapshot historico de lo comprado.
- Pagos y webhook events preparados para idempotencia de Mercado Pago.
- Stock futuro modelado en `product_variant_stock`, pero el MVP puede operar made-to-order.

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
- `payment_webhook_events`: deduplicacion/auditoria de webhooks.
- `product_variant_stock`: preparacion para stock por variante futura.

## Accesos esperados

- Publico anonimo: lectura de productos/disenos/opciones activas y settings publicos.
- Admin autenticado autorizado: gestion de catalogo, settings, pedidos, pagos visibles y stock futuro.
- Backend con secret key/service role: creacion de ordenes, pagos, webhook events y bootstrap admin.
- Admin autenticado: policies RLS delegan el chequeo de rol en `private.is_admin()` fuera del schema expuesto.

## Datos sensibles

- `orders`, `deliveries`, `payments` y `admin_users` contienen datos confidenciales.
- `payment_webhook_events.raw_payload` puede contener metadata del proveedor; no debe exponerse a cliente.
- No se almacenan datos de tarjeta.
