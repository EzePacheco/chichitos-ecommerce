import { describe, expect, it } from "vitest";
import type { CatalogProduct } from "./catalog-products";
import {
  getDesignVisualById,
  getProductDetailTotalCents,
} from "./product-options";

const product: CatalogProduct = {
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
  designs: [
    { id: "bosque", name: "Bosque", summary: "" },
    { id: "dino", name: "Dino", summary: "" },
  ],
  personalization: {
    enabled: true,
    label: "Nombre",
    description: "",
    extraPriceCents: 300,
  },
};

describe("product options", () => {
  it("maps design visuals by design id", () => {
    const visuals = getDesignVisualById(product);

    expect(visuals.get("bosque")?.shape).toBeTruthy();
    expect(visuals.get("dino")?.shape).toBeTruthy();
  });

  it("adds personalization cost only when selected", () => {
    expect(getProductDetailTotalCents({ product, personalize: false })).toBe(1000);
    expect(getProductDetailTotalCents({ product, personalize: true })).toBe(1300);
  });
});
