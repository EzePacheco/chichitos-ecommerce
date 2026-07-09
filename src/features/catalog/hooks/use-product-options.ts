import { useMemo } from "react";
import { getDesignVisualById } from "../model/product-options";
import type { CatalogProduct } from "../model/catalog-products";

export function useProductOptions({
  product,
  sizeId,
  colorId,
  designId,
}: {
  product: CatalogProduct;
  sizeId: string;
  colorId: string;
  designId: string;
}) {
  const designVisualByDesignId = useMemo(
    () => getDesignVisualById(product),
    [product],
  );

  return {
    currentSize: product.sizes.find((size) => size.id === sizeId),
    currentColor: product.colors.find((color) => color.id === colorId),
    currentDesign: product.designs.find((design) => design.id === designId),
    currentVisual: designVisualByDesignId.get(designId),
    designVisualByDesignId,
  };
}
