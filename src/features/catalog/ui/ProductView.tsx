"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { GarmentTag } from "@/features/catalog/ui/GarmentVisuals";
import { Eyebrow } from "@/shared/ui/design-system";
import { formatMoney } from "@/shared/formatting/money";
import { useProductOptions } from "../hooks/use-product-options";
import { addStoredCartItem } from "../model/cart-storage";
import { getGarmentType, getProductTagVariant } from "../model/design";
import { getProductDetailTotalCents } from "../model/product-options";
import {
  catalogCategoryLabels,
  type CatalogProduct,
} from "../model/catalog-products";
import { ProductActions } from "./product-detail/ProductActions";
import { ProductBreadcrumb } from "./product-detail/ProductBreadcrumb";
import { ProductGallery } from "./product-detail/ProductGallery";
import { ProductPersonalizationField } from "./product-detail/ProductPersonalizationField";
import { ProductVariantSelectors } from "./product-detail/ProductVariantSelectors";

type ProductViewProps = {
  product: CatalogProduct;
  whatsappHref?: string;
};

export function ProductView({ product, whatsappHref }: ProductViewProps) {
  const [sizeId, setSizeId] = useState<string>(product.sizes[0]?.id ?? "");
  const [colorId, setColorId] = useState<string>(product.colors[0]?.id ?? "");
  const [designId, setDesignId] = useState<string>(product.designs[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [personalize, setPersonalize] = useState(false);
  const [personalName, setPersonalName] = useState("");
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const {
    currentColor,
    currentDesign,
    currentSize,
    currentVisual,
    designVisualByDesignId,
  } = useProductOptions({ product, sizeId, colorId, designId });
  const totalCents = getProductDetailTotalCents({ product, personalize });

  function addToCart() {
    if (!currentSize || !currentColor || !currentDesign) return;

    addStoredCartItem({
      productSlug: product.slug,
      qty,
      sizeId: currentSize.id,
      colorId: currentColor.id,
      designId: currentDesign.id,
      personalName: personalize ? personalName.trim() || null : null,
    });
    setAdded(true);
  }

  return (
    <div className="container">
      <ProductBreadcrumb productName={product.name} />

      <section className="product">
        <ProductGallery
          baseColor={currentColor?.hex ?? "var(--cream-50)"}
          currentVisual={currentVisual}
          garmentType={getGarmentType(product)}
          product={product}
        />

        <div>
          <Eyebrow>{catalogCategoryLabels[product.category]}</Eyebrow>
          {product.badges[0] ? (
            <span style={{ marginLeft: 12 }}>
              <GarmentTag variant={getProductTagVariant(product)}>
                {product.badges[0]}
              </GarmentTag>
            </span>
          ) : null}
          <h1 className="product__title">{product.name}</h1>
          <div className="product__price">
            {formatMoney(totalCents)}
            {personalize ? (
              <small>
                incluye personalización (+
                {formatMoney(product.personalization.extraPriceCents)})
              </small>
            ) : null}
          </div>
          <p>{product.description}</p>

          <ProductVariantSelectors
            colorId={colorId}
            currentColorName={currentColor?.name}
            currentDesignName={currentDesign?.name}
            currentSizeLabel={currentSize?.label}
            designId={designId}
            designVisualByDesignId={designVisualByDesignId}
            product={product}
            setColorId={setColorId}
            setDesignId={setDesignId}
            setSizeId={setSizeId}
            setSizeGuideOpen={setSizeGuideOpen}
            sizeGuideOpen={sizeGuideOpen}
            sizeId={sizeId}
          />
          <ProductPersonalizationField
            personalName={personalName}
            personalization={product.personalization}
            personalize={personalize}
            setPersonalName={setPersonalName}
            setPersonalize={setPersonalize}
          />
          <ProductActions
            added={added}
            onAddToCart={addToCart}
            qty={qty}
            setQty={setQty}
            totalCents={totalCents}
            whatsappHref={whatsappHref}
          />

          <div className="disclaimer">
            <Info size={20} />
            <div>
              <strong>Producción a pedido.</strong> {product.productionTime}{" "}
              Imprimimos tu prenda apenas confirmás el pago.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
