import type { CSSProperties } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { catalogCategoryLabels, type CatalogProduct } from "../data/featured-products";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card product-card">
      <div className="product-art" style={{ "--accent-color": product.accentColor } as CSSProperties}>
        <span className="product-art-shape" aria-hidden="true" />
      </div>
      <div>
        <span className="product-category">{catalogCategoryLabels[product.category]}</span>
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
      </div>
      <strong>Desde {formatMoney(product.basePriceCents)}</strong>
      <div className="button-row" aria-label="Etiquetas de producto">
        {product.badges.map((badge) => (
          <span className="chip" key={badge}>
            {badge}
          </span>
        ))}
      </div>
      <Link className="button button-ghost product-card-button" href={`/producto/${product.slug}`}>
        Ver detalle
      </Link>
    </article>
  );
}
