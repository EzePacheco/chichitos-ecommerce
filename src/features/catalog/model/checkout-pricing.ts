import type { HydratedCartItem } from "./cart-storage";

export type DeliveryMethod = "envio" | "retiro";

export function getCheckoutItemUnitPriceCents(item: HydratedCartItem) {
  const design = item.product.designs.find(
    (candidate) => candidate.id === item.designId,
  );
  const personalization =
    item.personalName && item.product.personalization.enabled
      ? item.product.personalization.extraPriceCents
      : 0;

  return item.product.basePriceCents + (design?.extraPriceCents ?? 0) + personalization;
}

export function calculateCheckoutTotals({
  items,
  method,
  deliveryBasePriceCents,
}: {
  items: HydratedCartItem[];
  method: DeliveryMethod;
  deliveryBasePriceCents: number;
}) {
  const shippingCents = method === "retiro" ? 0 : deliveryBasePriceCents;
  const subtotalCents = items.reduce(
    (acc, item) => acc + getCheckoutItemUnitPriceCents(item) * item.qty,
    0,
  );

  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}
