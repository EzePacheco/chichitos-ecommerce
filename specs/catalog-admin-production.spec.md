# SPEC-005 - Catalogo admin, stock y checkout productivo

## Objetivo

Dejar Chichitos listo para vender con datos reales:

- admin gestiona catalogo, imagenes y stock por variante;
- tienda publica lee catalogo persistido en Supabase;
- checkout crea orden local, preferencia de Mercado Pago y confirma pago solo por webhook validado.

## Alcance

- Supabase sigue siendo fuente de verdad para catalogo, stock, settings, ordenes, pagos y webhooks.
- Imagenes de productos/disenos se suben a Supabase Storage desde servidor, con validacion admin.
- Stock se controla con `product_variant_stock` y reservas temporales por producto/talle/color/diseno.
- Checkout publico no confia en precios, stock ni distancia enviados por browser.
- Mercado Pago Checkout Pro redirige al comprador; el pago confirmado llega por webhook.

## No alcance

- Galeria multiple por producto.
- Editor avanzado de pedidos.
- Devoluciones/reembolsos automaticos.
- Google Maps autocomplete completo. Para este corte, envio usa direccion ingresada y distancia calculada server-side.
- Cron dedicado para liberar reservas. La liberacion es oportunista al crear checkout y desde operaciones admin/reconciliacion.

## Estado de despliegue

No desplegable a produccion hasta cerrar estos blockers:

- Reserva y captura/liberacion de stock deben ser transaccionales.
- Checkout debe ser idempotente por `Idempotency-Key`.
- Webhook Mercado Pago debe validar firma, dedupe, `external_reference`, monto esperado y moneda `ARS`.
- Envio a domicilio no puede confiar en `distanceKm` del browser.
- Carrito/checkout no pueden hidratar desde `localStorage` antes del mount.
- Mobile 360px+ no puede tener overflow horizontal en rutas publicas, checkout ni admin.
- Readiness debe fallar cerrado en produccion si falta Supabase real, Mercado Pago, webhook secret, site URL o Google Maps con checkout/envio activo.

## Criterios de aceptacion

- Admin autorizado puede crear producto activo/draft con talles, colores, disenos, imagen y stock.
- Usuario no autorizado no puede mutar catalogo ni subir imagenes.
- Admin guarda producto, talles, colores, disenos, personalizacion y stock como operacion atomica.
- Home, catalogo y detalle muestran productos reales cuando Supabase esta configurado.
- Sin Supabase configurado, desarrollo/build local mantiene fallback mock y checkout queda bloqueado.
- Fallback mock solo es valido local/preview; produccion falla cerrado si falta configuracion real.
- `POST /api/checkout` requiere header `Idempotency-Key`; reintentos devuelven el mismo checkout cuando ya existe.
- Checkout valida carrito server-side, crea `orders`, `order_items`, `deliveries`, `payments`, reserva stock y crea preferencia MP.
- Reservas expiran en 20 minutos y se liberan oportunisticamente.
- Webhook valida firma `x-signature`, deduplica evento y consulta MP server-side.
- Webhook solo aprueba la orden si `external_reference`, monto esperado y `currency_id = ARS` coinciden.
- Webhook persiste payload MP minimizado para auditoria.
- Stock no puede vender cantidad mayor a disponible ni variante sin fila de stock cuando `track_stock = true`.
- Carrito y checkout leen `localStorage` solo post-mount, sin hydration mismatch.
- Layout mobile-first soporta 360px sin overflow horizontal en home, catalogo, detalle, carrito, checkout y admin.
- `/api/health` sigue siendo liveness simple y `/api/readiness` valida configuracion sin exponer secretos.
- `.playwright-mcp/` no se versiona.

## Verificacion requerida

- Unit tests para parsing de catalogo admin, mapeo de catalogo, firma MP, validacion checkout, idempotency requerida, shipping sin Maps, mismatch monto/moneda MP y guardado admin por RPC atomica.
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Playwright MCP en 360x800, 375x812, 390x844 y 768x1024 para `/`, `/catalogo`, `/producto/remera-algodon`, `/carrito`, `/checkout`, `/admin/login` y `/admin` con env/auth staging.
- Staging Supabase: aplicar migraciones, probar RLS/admin, reserva concurrente, expiracion/liberacion y captura por pago aprobado.
- MP sandbox: crear preferencia, aprobar pago, replay webhook, webhook invalido y monto alterado.
- Revision final de diff para seguridad/datos/webhooks/readiness.
