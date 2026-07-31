import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { CatalogProduct } from "../../model/catalog-products";
import {
  getProductGalleryViews,
  ProductGallery,
} from "./ProductGallery";

describe("product gallery views", () => {
  it("does not invent placeholder views when the product has an image", () => {
    expect(
      getProductGalleryViews(
        "https://assets.example/product.webp",
        null,
        "star",
      ),
    ).toEqual([{ key: "photo", kind: "photo" }]);
  });

  it("renders only the real image when one is available", () => {
    const markup = renderToStaticMarkup(
      <ProductGallery
        baseColor="#ffffff"
        garmentType="Remera"
        product={
          {
            imageUrl: "https://assets.example/product.webp",
            imageAlt: "Remera real",
            name: "Remera",
          } as CatalogProduct
        }
      />,
    );

    expect(markup).toContain("<img");
    expect(markup).not.toContain("gallery__thumbs");
    expect(markup).not.toContain("<svg");
  });

  it("shows a selected design as a mockup and preserves the real photo", () => {
    expect(
      getProductGalleryViews(
        "https://assets.example/product.webp",
        "https://assets.example/design.webp",
        "star",
      ),
    ).toEqual([
      { key: "mockup", kind: "mockup", shape: "star", scale: 1 },
      { key: "photo", kind: "photo" },
    ]);

    const markup = renderToStaticMarkup(
      <ProductGallery
        baseColor="#ffffff"
        currentDesign={{
          id: "bosque",
          name: "Bosque",
          summary: "Hojas",
          imageUrl: "https://assets.example/design.webp",
          imageAlt: "Bosque ilustrado",
        }}
        currentVisual={{ shape: "star", color: "#ff0000" }}
        garmentType="Remera"
        product={
          {
            imageUrl: "https://assets.example/product.webp",
            imageAlt: "Remera real",
            name: "Remera",
          } as CatalogProduct
        }
      />,
    );

    expect(markup).toContain(
      'href="https://assets.example/design.webp"',
    );
    expect(markup).toContain("Vista previa ilustrativa");
    expect(markup).toContain("Foto real de Remera");
  });

  it("keeps illustrative views for products without an image", () => {
    expect(getProductGalleryViews(null, null, "star")).toEqual([
      { key: "front", kind: "placeholder", shape: "star", scale: 1 },
      { key: "back", kind: "placeholder", shape: null, scale: 1 },
      {
        key: "folded",
        kind: "placeholder",
        shape: "star",
        scale: 0.55,
      },
    ]);
  });
});
