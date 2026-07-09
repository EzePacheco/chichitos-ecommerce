import { designVisuals } from "./design";
import type { CatalogProduct } from "./catalog-products";

export function getDesignVisualById(product: CatalogProduct) {
  const map = new Map<string, (typeof designVisuals)[number]>();
  product.designs.forEach((design, index) => {
    map.set(design.id, designVisuals[index % designVisuals.length]);
  });
  return map;
}

export function getProductDetailTotalCents({
  product,
  personalize,
}: {
  product: CatalogProduct;
  personalize: boolean;
}) {
  return (
    product.basePriceCents +
    (personalize ? product.personalization.extraPriceCents : 0)
  );
}
