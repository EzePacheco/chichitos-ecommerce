import { describe, expect, it } from "vitest";
import type { CatalogProduct } from "@/features/catalog/public";
import {
  createDesignEditorDraft,
  type EditableAdminDesign,
} from "./design-editor-model";
import {
  createProductEditorDraft,
  productEditorStepForHash,
} from "./product-editor-model";

function createProduct(): CatalogProduct {
  return {
    id: "product-id",
    slug: "remera",
    name: "Remera",
    category: "remeras",
    status: "active",
    featured: true,
    summary: "Resumen",
    description: "Descripción",
    basePriceCents: 120000,
    productionTime: "3 días",
    accentColor: "#fff",
    badges: [],
    sizes: [{ id: "2", label: "2" }],
    colors: [{ id: "natural", name: "Natural", hex: "#fcf7ec" }],
    designs: [{ id: "bosque", name: "Bosque", summary: "Hojas" }],
    personalization: {
      enabled: true,
      label: "Nombre",
      description: "Una línea",
      extraPriceCents: 10000,
    },
  };
}

describe("product editor model", () => {
  it("creates a draft from a persisted product", () => {
    expect(createProductEditorDraft(createProduct())).toMatchObject({
      name: "Remera",
      status: "active",
      basePrice: "1200",
      personalizationPrice: "100",
      variants: {
        sizes: [{ code: "2", label: "2", note: "" }],
      },
    });
  });

  it("creates the expected defaults for a new product", () => {
    expect(createProductEditorDraft()).toMatchObject({
      category: "remeras",
      status: "draft",
      personalizationEnabled: true,
      personalizationPrice: "0",
    });
  });

  it.each([
    ["#name", "identity"],
    ["product-content", "content"],
    ["#stock", "options"],
    ["#personalizationPrice", "personalization"],
    ["#unknown", null],
  ] as const)("resolves %s to %s", (hash, expected) => {
    expect(productEditorStepForHash(hash)).toBe(expected);
  });
});

describe("design editor model", () => {
  it("creates a draft from a persisted design", () => {
    const design: EditableAdminDesign = {
      slug: "bosque",
      name: "Bosque",
      summary: "Hojas",
      description: "Descripción",
      status: "archived",
      baseExtraPriceCents: 25000,
      imageUrl: "/bosque.png",
      imageAlt: "Bosque",
    };

    expect(createDesignEditorDraft(design)).toEqual({
      name: "Bosque",
      summary: "Hojas",
      description: "Descripción",
      status: "archived",
      baseExtraPrice: "250",
    });
  });

  it("creates the expected defaults for a new design", () => {
    expect(createDesignEditorDraft()).toEqual({
      name: "",
      summary: "",
      description: "",
      status: "draft",
      baseExtraPrice: "0",
    });
  });
});
