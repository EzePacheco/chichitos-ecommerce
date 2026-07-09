"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { GarmentPlaceholder } from "@/features/catalog/ui/GarmentVisuals";
import type {
  DesignShape,
  GarmentType,
} from "@/features/catalog/ui/GarmentVisuals";
import type { CatalogProduct } from "../../model/catalog-products";

type ProductGalleryProps = {
  baseColor: string;
  currentVisual?: { shape: DesignShape; color: string };
  garmentType: GarmentType;
  product: CatalogProduct;
};

export function ProductGallery({
  baseColor,
  currentVisual,
  garmentType,
  product,
}: ProductGalleryProps) {
  const [thumbIdx, setThumbIdx] = useState(0);
  const thumbs = [
    { key: "front" as const, shape: currentVisual?.shape ?? null, scale: 1 },
    { key: "back" as const, shape: null, scale: 1 },
    {
      key: "folded" as const,
      shape: currentVisual?.shape ?? null,
      scale: 0.55,
    },
  ];

  return (
    <div className="gallery">
      <div className="gallery__main">
        {product.imageUrl && thumbIdx === 0 ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt || product.name}
            style={{
              borderRadius: "var(--r-xl)",
              height: "100%",
              objectFit: "cover",
              width: "100%",
            }}
          />
        ) : (
          <GarmentPlaceholder
            type={garmentType}
            color={baseColor}
            designShape={thumbs[thumbIdx].shape}
            designColor={currentVisual?.color}
            scale={thumbs[thumbIdx].scale}
          />
        )}
      </div>
      <div className="gallery__thumbs" aria-label="Galería del producto">
        {thumbs.map((thumb, index) => (
          <button
            type="button"
            key={thumb.key}
            className={`gallery__thumb ${index === thumbIdx ? "is-active" : ""}`}
            onClick={() => setThumbIdx(index)}
            aria-label={`Vista ${index + 1}`}
          >
            <GarmentPlaceholder
              type={garmentType}
              color={baseColor}
              designShape={thumb.shape}
              designColor={currentVisual?.color}
              scale={thumb.scale}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
