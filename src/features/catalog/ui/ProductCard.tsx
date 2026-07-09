"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import {
  GarmentPlaceholder,
  GarmentTag,
} from "@/features/catalog/ui/GarmentVisuals";
import { formatMoney } from "@/shared/formatting/money";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
  getProductTagVariant,
} from "../model/design";
import {
  catalogCategoryLabels,
  type CatalogProduct,
} from "../model/catalog-products";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const design = getProductDesignVisual(product);
  const [liked, setLiked] = useState(false);

  function toggleLike(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setLiked((current) => !current);
  }

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
        <button
          type="button"
          className={`product-card__fav ${liked ? "is-liked" : ""}`}
          onClick={toggleLike}
          aria-label={liked ? "Quitar de favoritos" : "Marcar favorito"}
          aria-pressed={liked}
        >
          <Heart
            size={16}
            strokeWidth={liked ? 0 : 1.75}
            fill={liked ? "currentColor" : "none"}
          />
        </button>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt || product.name}
            style={{ height: "100%", objectFit: "cover", width: "100%" }}
          />
        ) : (
          <GarmentPlaceholder
            type={getGarmentType(product)}
            color={getProductBaseColor(product)}
            designShape={design.shape}
            designColor={design.color}
          />
        )}
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
