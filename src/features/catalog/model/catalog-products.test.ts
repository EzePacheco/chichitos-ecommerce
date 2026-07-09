import { describe, expect, it } from "vitest";
import {
  buildProductWhatsAppHref,
  getActiveCatalogProducts,
  getCatalogCategories,
  getCatalogProductBySlug,
  getFeaturedCatalogProducts,
  type CatalogProduct,
} from "./catalog-products";

function createProduct(overrides: Partial<CatalogProduct> = {}): CatalogProduct {
  return {
    id: "prd_test",
    name: "Producto test",
    slug: "producto-test",
    category: "remeras",
    status: "active",
    featured: false,
    summary: "Resumen de prueba",
    description: "Descripcion de prueba",
    basePriceCents: 100000,
    productionTime: "3 dias habiles",
    accentColor: "var(--durazno)",
    badges: ["A pedido"],
    sizes: [{ id: "2", label: "2" }],
    colors: [{ id: "natural", name: "Natural", hex: "#fff7e7" }],
    designs: [{ id: "dino", name: "Dino", summary: "Diseno dino" }],
    personalization: {
      description: "Nombre corto",
      enabled: true,
      extraPriceCents: 150000,
      label: "Nombre",
    },
    ...overrides,
  };
}

describe("catalog product helpers", () => {
  it("should return only active products", () => {
    const active = createProduct({ id: "active", slug: "active" });
    const draft = createProduct({ id: "draft", slug: "draft", status: "draft" });

    expect(getActiveCatalogProducts([active, draft])).toEqual([active]);
  });

  it("should not resolve draft products by slug", () => {
    const draft = createProduct({ slug: "draft-product", status: "draft" });

    expect(getCatalogProductBySlug("draft-product", [draft])).toBeUndefined();
  });

  it("should return featured products only when they are active", () => {
    const featuredActive = createProduct({ featured: true, id: "featured-active", slug: "featured-active" });
    const featuredDraft = createProduct({ featured: true, id: "featured-draft", slug: "featured-draft", status: "draft" });

    expect(getFeaturedCatalogProducts([featuredActive, featuredDraft])).toEqual([featuredActive]);
  });

  it("should count active products by category", () => {
    const products = [
      createProduct({ category: "remeras", id: "remera-1", slug: "remera-1" }),
      createProduct({ category: "remeras", id: "remera-2", slug: "remera-2" }),
      createProduct({ category: "sets", id: "set-1", slug: "set-1" }),
      createProduct({ category: "bodies", id: "draft-body", slug: "draft-body", status: "draft" }),
    ];

    expect(getCatalogCategories(products)).toEqual([
      { count: 2, id: "remeras", label: "Remeras" },
      { count: 1, id: "sets", label: "Sets" },
    ]);
  });

  it("should build a WhatsApp link with sanitized phone number and encoded product context", () => {
    const product = createProduct({ name: "Remera test" });

    expect(buildProductWhatsAppHref(product, "+54 9 11 1234-5678")).toBe(
      "https://wa.me/5491112345678?text=Hola%20Chichitos%2C%20quiero%20consultar%20por%20Remera%20test.%20Me%20interesa%20elegir%20talle%2C%20color%20y%20diseno.",
    );
  });

  it("should not build a WhatsApp link without a usable phone number", () => {
    const product = createProduct();

    expect(buildProductWhatsAppHref(product)).toBeUndefined();
    expect(buildProductWhatsAppHref(product, "sin-numero")).toBeUndefined();
  });
});
