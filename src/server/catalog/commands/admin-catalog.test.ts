import { describe, expect, it, vi } from "vitest";
import {
  getCatalogProductFormInput,
  parseCatalogProductInput,
  slugifyCatalogValue,
  upsertCatalogProduct,
} from "./admin-catalog";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("admin catalog parsing", () => {
  it("normalizes product, variants and stock from the compact admin form", () => {
    const formData = new FormData();
    formData.set("name", "Remera Ñandú");
    formData.set("summary", "Resumen");
    formData.set("description", "Descripcion");
    formData.set("category", "remeras");
    formData.set("status", "active");
    formData.set("basePrice", "12.500");
    formData.set("sizes", "2|Talle 2|\n4|Talle 4|");
    formData.set("colors", "natural|Natural|#fcf7ec");
    formData.set("designs", "bosque|Bosque|Hojas|100");
    formData.set("stock", "2|natural|bosque|7|si");

    const parsed = parseCatalogProductInput(getCatalogProductFormInput(formData));

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.product.slug).toBe("remera-nandu");
    expect(parsed.product.basePriceCents).toBe(1250000);
    expect(parsed.product.sizes).toHaveLength(2);
    expect(parsed.product.sizes[0]).toEqual({
      code: "2",
      label: "Talle 2",
      note: null,
    });
    expect(parsed.product.colors[0]).toEqual({
      code: "natural",
      name: "Natural",
      hex: "#fcf7ec",
    });
    expect(parsed.product.designs[0]).toMatchObject({
      slug: "bosque",
      extraPriceCents: 10000,
    });
    expect(parsed.product.stock[0]).toEqual({
      sizeCode: "2",
      colorCode: "natural",
      designSlug: "bosque",
      quantityAvailable: 7,
      trackStock: true,
    });
  });

  it("rejects invalid colors", () => {
    const formData = new FormData();
    formData.set("name", "Producto");
    formData.set("summary", "Resumen");
    formData.set("description", "Descripcion");
    formData.set("category", "remeras");
    formData.set("status", "active");
    formData.set("basePrice", "100");
    formData.set("sizes", "2|2|");
    formData.set("colors", "natural|Natural|red");
    formData.set("designs", "bosque|Bosque|Hojas|0");

    expect(parseCatalogProductInput(getCatalogProductFormInput(formData))).toMatchObject({
      ok: false,
    });
  });

  it("slugifies accented values", () => {
    expect(slugifyCatalogValue(" Body Bebé! ")).toBe("body-bebe");
  });

  it("saves products through the atomic RPC", async () => {
    const formData = new FormData();
    formData.set("name", "Remera");
    formData.set("summary", "Resumen");
    formData.set("description", "Descripcion");
    formData.set("category", "remeras");
    formData.set("status", "active");
    formData.set("basePrice", "100");
    formData.set("sizes", "2|2|");
    formData.set("colors", "natural|Natural|#fcf7ec");
    formData.set("designs", "bosque|Bosque|Hojas|0");
    formData.set("stock", "2|natural|bosque|7|si");
    const parsed = parseCatalogProductInput(getCatalogProductFormInput(formData));
    const rpc = vi.fn(async () => ({ data: "product-id", error: null }));

    if (!parsed.ok) throw new Error("expected valid product");

    await expect(upsertCatalogProduct(parsed, { rpc } as never)).resolves.toBe("product-id");
    expect(rpc).toHaveBeenCalledWith(
      "save_catalog_product_atomic",
      expect.objectContaining({
        product_data: expect.objectContaining({
          slug: "remera",
          stock: [
            {
              size_code: "2",
              color_code: "natural",
              design_slug: "bosque",
              quantity_available: 7,
              track_stock: true,
            },
          ],
        }),
      }),
    );
  });
});
