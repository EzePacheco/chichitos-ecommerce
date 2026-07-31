"use client";

import { Ruler } from "lucide-react";
import type { DesignShape } from "@/features/catalog/ui/GarmentVisuals";
import { CatalogDesignArtwork } from "@/features/catalog/ui/CatalogDesignArtwork";
import type { CatalogProduct } from "../../model/catalog-products";
import { SizeGuide } from "./SizeGuide";

type ProductVariantSelectorsProps = {
  colorId: string;
  currentColorName?: string;
  currentDesignName?: string;
  currentSizeLabel?: string;
  designId: string;
  designVisualByDesignId: Map<string, { shape: DesignShape; color: string }>;
  product: CatalogProduct;
  setColorId: (colorId: string) => void;
  setDesignId: (designId: string) => void;
  setSizeId: (sizeId: string) => void;
  setSizeGuideOpen: (open: boolean | ((current: boolean) => boolean)) => void;
  sizeGuideOpen: boolean;
  sizeId: string;
};

export function ProductVariantSelectors({
  colorId,
  currentColorName,
  currentDesignName,
  currentSizeLabel,
  designId,
  designVisualByDesignId,
  product,
  setColorId,
  setDesignId,
  setSizeId,
  setSizeGuideOpen,
  sizeGuideOpen,
  sizeId,
}: ProductVariantSelectorsProps) {
  return (
    <>
      <div className="option-group">
        <div className="option-group__head">
          <span className="option-group__label">
            Talle: <strong>{currentSizeLabel}</strong>
          </span>
          <button
            type="button"
            className="option-group__link"
            onClick={() => setSizeGuideOpen((open) => !open)}
          >
            <Ruler size={14} /> Guía de talles
          </button>
        </div>
        <div className="option-row size-row">
          {product.sizes.map((size) => (
            <button
              type="button"
              key={size.id}
              className={`chip ${sizeId === size.id ? "is-active" : ""}`}
              onClick={() => setSizeId(size.id)}
              title={size.note}
            >
              {size.label}
            </button>
          ))}
        </div>
        {sizeGuideOpen ? (
          <SizeGuide onClose={() => setSizeGuideOpen(false)} />
        ) : null}
      </div>

      <div className="option-group">
        <span className="option-group__label">
          Color base: <strong>{currentColorName}</strong>
        </span>
        <div className="option-row mt-2">
          {product.colors.map((color) => (
            <button
              type="button"
              key={color.id}
              aria-label={color.name}
              title={color.name}
              className={`swatch ${colorId === color.id ? "is-active" : ""}`}
              style={{ background: color.hex }}
              onClick={() => setColorId(color.id)}
            />
          ))}
        </div>
      </div>

      <div className="option-group">
        <span className="option-group__label">
          Diseño: <strong>{currentDesignName}</strong>
        </span>
        <div className="option-row mt-2">
          {product.designs.map((design) => {
            const visual = designVisualByDesignId.get(design.id);
            return (
              <button
                type="button"
                key={design.id}
                className={`design-card ${designId === design.id ? "is-active" : ""}`}
                onClick={() => setDesignId(design.id)}
                aria-label={design.name}
                aria-pressed={designId === design.id}
                title={design.summary}
              >
                <CatalogDesignArtwork
                  className="design-card__artwork"
                  design={design}
                  fallbackVisual={visual}
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
