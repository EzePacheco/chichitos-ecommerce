# Product - Chichitos Web

Chichitos Web is a full-stack ecommerce for an Argentine children's clothing
brand with DTF prints and original designs.

## Customers

- Shoppers browse children's garments, choose size, color, design and optional
  personalization, then checkout online.
- The store owner administers products, designs, orders, commercial settings and
  operational order status.

## Public Storefront

- Home highlights the brand, featured products, DTF authorship, and buying flow.
- Catalog lists active products with filters and sort controls.
- Product detail lets shoppers select size, color, design, quantity and optional
  personalization.
- Cart is browser-side state, hydrated after mount.
- Checkout sends cart, buyer and delivery data to the server. The backend
  reloads authoritative products, recalculates prices, calculates delivery, and
  creates the Mercado Pago preference.

## Admin

- Admin access uses Supabase Google Auth plus server-side authorization.
- Admin pages cover dashboard, orders, products, designs and store settings.
- Admin can update operational order/customer/delivery fields, but payment state
  remains controlled by provider webhook reconciliation.

## Out Of Scope For Current MVP

- Customer accounts.
- Automatic refunds/returns.
- Full logistics carrier integration.
- Multi-role admin permissions beyond the current admin model.
