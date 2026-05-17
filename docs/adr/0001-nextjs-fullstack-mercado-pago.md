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

