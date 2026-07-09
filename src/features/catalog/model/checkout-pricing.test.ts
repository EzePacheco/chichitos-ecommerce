import { describe, expect, it } from "vitest";
import type { HydratedCartItem } from "./cart-storage";
import {
  calculateCheckoutTotals,
  getCheckoutItemUnitPriceCents,
} from "./checkout-pricing";

function createItem(overrides: Partial<HydratedCartItem> = {}): HydratedCartItem {
  return {
    id: "item-1",
    qty: 2,
    sizeId: "2",
    sizeLabel: "2",
    colorId: "natural",
    colorName: "Natural",
    designId: "bosque",
    designName: "Bosque",
    personalName: "Mateo",
    product: {
      id: "prd",
      name: "Remera",
      slug: "remera",
      category: "remeras",
      status: "active",
      featured: false,
      summary: "Resumen",
      description: "Descripcion",
      basePriceCents: 1000,
      productionTime: "3 dias",
      accentColor: "var(--durazno)",
      badges: [],
      sizes: [{ id: "2", label: "2" }],
      colors: [{ id: "natural", name: "Natural", hex: "#fff" }],
      designs: [{ id: "bosque", name: "Bosque", summary: "", extraPriceCents: 200 }],
      personalization: {
        enabled: true,
        label: "Nombre",
        description: "",
        extraPriceCents: 300,
      },
    },
    ...overrides,
  };
}

describe("checkout pricing", () => {
  it("adds design and personalization to the unit price", () => {
    expect(getCheckoutItemUnitPriceCents(createItem())).toBe(1500);
  });

  it("does not charge personalization when disabled or empty", () => {
    expect(getCheckoutItemUnitPriceCents(createItem({ personalName: null }))).toBe(
      1200,
    );
    expect(
      getCheckoutItemUnitPriceCents(
        createItem({
          product: {
            ...createItem().product,
            personalization: {
              ...createItem().product.personalization,
              enabled: false,
            },
          },
        }),
      ),
    ).toBe(1200);
  });

  it("calculates subtotal, shipping and total by delivery method", () => {
    expect(
      calculateCheckoutTotals({
        items: [createItem()],
        method: "envio",
        deliveryBasePriceCents: 400,
      }),
    ).toEqual({ subtotalCents: 3000, shippingCents: 400, totalCents: 3400 });

    expect(
      calculateCheckoutTotals({
        items: [createItem()],
        method: "retiro",
        deliveryBasePriceCents: 400,
      }),
    ).toEqual({ subtotalCents: 3000, shippingCents: 0, totalCents: 3000 });
  });
});
