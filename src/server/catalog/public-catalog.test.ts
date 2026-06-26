import { describe, expect, it } from "vitest";
import { mapCatalogProductRow, type CatalogProductRow } from "./public-catalog";

describe("public catalog mapper", () => {
  it("maps Supabase rows to the existing UI product contract", () => {
    const product = mapCatalogProductRow({
      id: "product-id",
      slug: "remera",
      name: "Remera",
      summary: "Resumen",
      description: "Descripcion",
      category: "remeras",
      status: "active",
      featured: true,
      base_price_cents: 100000,
      production_time: "3 dias",
      sort_order: 0,
      image_url: "https://example.test/remera.webp",
      image_alt: "Remera",
      product_sizes: [{ code: "2", label: "2", note: null, sort_order: 0 }],
      product_colors: [
        { code: "natural", name: "Natural", hex: "#fcf7ec", sort_order: 0 },
      ],
      product_designs: [
        {
          extra_price_cents: 1000,
          sort_order: 0,
          designs: {
            id: "design-id",
            slug: "bosque",
            name: "Bosque",
            summary: "Hojas",
            image_url: null,
            image_alt: "",
          },
        },
      ],
      product_personalization_options: [
        {
          enabled: true,
          label: "Nombre",
          description: "Texto",
          extra_price_cents: 500,
        },
      ],
      product_variant_stock: [
        {
          size_code: "2",
          color_code: "natural",
          design_id: "design-id",
          quantity_available: 3,
          track_stock: true,
        },
      ],
    } satisfies CatalogProductRow);

    expect(product).toMatchObject({
      slug: "remera",
      imageUrl: "https://example.test/remera.webp",
      designs: [{ id: "bosque", extraPriceCents: 1000 }],
      stock: [{ designId: "bosque", quantityAvailable: 3, trackStock: true }],
    });
  });
});
