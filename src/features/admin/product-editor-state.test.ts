import { describe, expect, it } from "vitest";
import type { CatalogProduct } from "@/features/catalog/data/featured-products";
import {
  createProductEditorState,
  serializeProductEditorState,
} from "./product-editor-state";

function createProduct(overrides: Partial<CatalogProduct> = {}): CatalogProduct {
  return {
    id: "prd_test",
    name: "Producto test",
    slug: "producto-test",
    category: "remeras",
    status: "active",
    featured: false,
    summary: "Resumen",
    description: "Descripcion",
    basePriceCents: 100000,
    productionTime: "3 dias",
    accentColor: "var(--durazno)",
    badges: [],
    sizes: [{ id: "2", label: "Talle 2", note: "2 a 3 años" }],
    colors: [{ id: "natural", name: "Natural", hex: "#fcf7ec" }],
    designs: [
      {
        id: "bosque",
        name: "Bosque",
        summary: "Hojas",
        extraPriceCents: 15000,
      },
    ],
    personalization: {
      enabled: true,
      label: "Nombre",
      description: "Nombre corto",
      extraPriceCents: 10000,
    },
    stock: [
      {
        sizeCode: "2",
        colorCode: "natural",
        designId: "bosque",
        quantityAvailable: 4,
        trackStock: true,
      },
    ],
    ...overrides,
  };
}

describe("product editor state", () => {
  it("creates defaults for a new product", () => {
    const state = createProductEditorState();

    expect(state.sizes[0]).toMatchObject({ code: "2" });
    expect(state.colors[0]).toMatchObject({ code: "natural" });
    expect(state.designs[0]).toMatchObject({ slug: "bosque" });
    expect(state.stock[0]).toMatchObject({ quantity: "10" });
  });

  it("serializes existing product variants into the compact admin contract", () => {
    const state = createProductEditorState(createProduct());
    const serialized = serializeProductEditorState(state);

    expect(serialized.sizes).toBe("2|Talle 2|2 a 3 años");
    expect(serialized.colors).toBe("natural|Natural|#fcf7ec");
    expect(serialized.designs).toBe("bosque|Bosque|Hojas|150");
    expect(serialized.stock).toBe("2|natural|bosque|4|si");
  });

  it("falls back to a first variant when stock is missing", () => {
    const state = createProductEditorState(createProduct({ stock: undefined }));

    expect(state.stock).toEqual([
      {
        sizeCode: "2",
        colorCode: "natural",
        designSlug: "bosque",
        quantity: "0",
        trackStock: true,
      },
    ]);
  });
});
