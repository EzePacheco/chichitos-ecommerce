import { describe, expect, it } from "vitest";
import type { HydratedCartItem } from "./cart-storage";
import { buildCheckoutPayload } from "./checkout-form";

function createItem(): HydratedCartItem {
  return {
    id: "item-1",
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
      designs: [{ id: "bosque", name: "Bosque", summary: "" }],
      personalization: {
        enabled: true,
        label: "Nombre",
        description: "",
        extraPriceCents: 300,
      },
    },
    qty: 2,
    sizeId: "2",
    sizeLabel: "2",
    colorId: "natural",
    colorName: "Natural",
    designId: "bosque",
    designName: "Bosque",
    personalName: "Luna",
  };
}

describe("checkout form", () => {
  it("builds the API payload from cart, buyer and delivery forms", () => {
    expect(
      buildCheckoutPayload({
        items: [createItem()],
        method: "envio",
        buyer: {
          nombre: " Ana ",
          apellido: " Perez ",
          email: " ana@example.com ",
          tel: " 1122334455 ",
          dni: " 12345678 ",
        },
        delivery: {
          addr: " Calle 123 ",
          city: " CABA ",
          cp: " 1000 ",
        },
      }),
    ).toEqual({
      items: [
        {
          productSlug: "remera",
          quantity: 2,
          sizeId: "2",
          colorId: "natural",
          designId: "bosque",
          personalName: "Luna",
        },
      ],
      buyer: {
        name: "Ana Perez",
        email: "ana@example.com",
        phone: "1122334455",
        dni: "12345678",
      },
      delivery: {
        method: "envio",
        addressLine: "Calle 123",
        city: "CABA",
        postalCode: "1000",
      },
    });
  });
});
