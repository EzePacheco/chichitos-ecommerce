import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { CatalogProduct } from "../../model/catalog-products";
import { ProductVariantSelectors } from "./ProductVariantSelectors";

describe("product variant design selector", () => {
  it("renders the real design image and keeps an explicit selected state", () => {
    const product = {
      sizes: [{ id: "2", label: "2" }],
      colors: [{ id: "natural", name: "Natural", hex: "#ffffff" }],
      designs: [
        {
          id: "bosque",
          name: "Bosque",
          summary: "Hojas",
          imageUrl: "https://assets.example/bosque.webp",
          imageAlt: "Bosque ilustrado",
        },
      ],
    } as CatalogProduct;

    const markup = renderToStaticMarkup(
      <ProductVariantSelectors
        colorId="natural"
        currentColorName="Natural"
        currentDesignName="Bosque"
        currentSizeLabel="2"
        designId="bosque"
        designVisualByDesignId={new Map()}
        product={product}
        setColorId={vi.fn()}
        setDesignId={vi.fn()}
        setSizeGuideOpen={vi.fn()}
        setSizeId={vi.fn()}
        sizeGuideOpen={false}
        sizeId="2"
      />,
    );

    expect(markup).toContain('src="https://assets.example/bosque.webp"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('aria-label="Bosque"');
  });
});
