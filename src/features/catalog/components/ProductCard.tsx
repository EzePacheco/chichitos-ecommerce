import Link from "next/link";
import {
  GarmentPlaceholder,
  GarmentTag,
  Icon,
} from "@/components/ui/design-system";
import { formatMoney } from "@/lib/money";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
  getProductTagVariant,
} from "../design";
import {
  catalogCategoryLabels,
  type CatalogProduct,
} from "../data/featured-products";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const design = getProductDesignVisual(product);

  return (
    <Link className="product-card" href={`/producto/${product.slug}`}>
      <div className="product-card__media">
        {product.badges[0] ? (
          <span className="product-card__tag">
            <GarmentTag variant={getProductTagVariant(product)}>
              {product.badges[0]}
            </GarmentTag>
          </span>
        ) : null}
        <span className="product-card__fav" aria-hidden="true">
          <Icon name="heart" size={16} />
        </span>
        <GarmentPlaceholder
          type={getGarmentType(product)}
          color={getProductBaseColor(product)}
          designShape={design.shape}
          designColor={design.color}
        />
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.name}</h3>
        <span className="product-card__meta">
          {catalogCategoryLabels[product.category]} · {product.sizes.length}{" "}
          talles · {product.colors.length} colores
        </span>
        <span className="product-card__price">
          {formatMoney(product.basePriceCents)} <small>desde</small>
        </span>
      </div>
    </Link>
  );
}
