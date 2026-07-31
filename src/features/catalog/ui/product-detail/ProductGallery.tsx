"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { GarmentPlaceholder } from "@/features/catalog/ui/GarmentVisuals";
import type {
  DesignShape,
  GarmentType,
} from "@/features/catalog/ui/GarmentVisuals";
import type { CatalogDesign } from "@/features/catalog/public";
import type { CatalogProduct } from "../../model/catalog-products";

type ProductGalleryProps = {
  baseColor: string;
  currentDesign?: CatalogDesign;
  currentVisual?: { shape: DesignShape; color: string };
  garmentType: GarmentType;
  product: CatalogProduct;
};

type ProductGalleryView =
  | { key: "mockup"; kind: "mockup"; shape: DesignShape | null; scale: number }
  | { key: "photo"; kind: "photo" }
  | {
      key: "front" | "back" | "folded";
      kind: "placeholder";
      shape: DesignShape | null;
      scale: number;
    };

export function getProductGalleryViews(
  productImageUrl: string | null | undefined,
  designImageUrl: string | null | undefined,
  currentShape?: DesignShape,
): ProductGalleryView[] {
  if (designImageUrl) {
    return [
      {
        key: "mockup",
        kind: "mockup",
        shape: currentShape ?? null,
        scale: 1,
      },
      ...(productImageUrl
        ? [{ key: "photo", kind: "photo" } as const]
        : []),
    ];
  }

  if (productImageUrl) return [{ key: "photo", kind: "photo" }];

  return [
    {
      key: "front",
      kind: "placeholder",
      shape: currentShape ?? null,
      scale: 1,
    },
    { key: "back", kind: "placeholder", shape: null, scale: 1 },
    {
      key: "folded",
      kind: "placeholder",
      shape: currentShape ?? null,
      scale: 0.55,
    },
  ];
}

export function ProductGallery({
  baseColor,
  currentDesign,
  currentVisual,
  garmentType,
  product,
}: ProductGalleryProps) {
  const [thumbIdx, setThumbIdx] = useState(0);
  const [failedDesignUrl, setFailedDesignUrl] = useState<string | null>(null);
  const designImageUrl =
    currentDesign?.imageUrl && failedDesignUrl !== currentDesign.imageUrl
      ? currentDesign.imageUrl
      : null;
  const views = getProductGalleryViews(
    product.imageUrl,
    currentDesign?.imageUrl,
    currentVisual?.shape,
  );
  const currentView = views[thumbIdx] ?? views[0];

  function renderView(view: ProductGalleryView, thumbnail = false) {
    if (view.kind === "photo") {
      return (
        <img
          src={product.imageUrl ?? ""}
          alt={thumbnail ? "" : product.imageAlt || product.name}
          decoding="async"
          loading={thumbnail ? "lazy" : "eager"}
        />
      );
    }

    return (
      <GarmentPlaceholder
        type={garmentType}
        color={baseColor}
        designShape={view.shape}
        designColor={currentVisual?.color}
        designImageAlt={currentDesign?.imageAlt || currentDesign?.name}
        designImageUrl={view.kind === "mockup" ? designImageUrl : null}
        onDesignImageError={
          currentDesign?.imageUrl
            ? () => setFailedDesignUrl(currentDesign.imageUrl ?? null)
            : undefined
        }
        scale={view.scale}
      />
    );
  }

  return (
    <div className="gallery">
      <div className="gallery__main">
        {currentView ? renderView(currentView) : null}
        {currentView?.kind === "mockup" ? (
          <span className="gallery__view-label">Vista previa ilustrativa</span>
        ) : currentView?.kind === "photo" && views.length > 1 ? (
          <span className="gallery__view-label">Foto real</span>
        ) : null}
      </div>
      {views.length > 1 ? (
        <div className="gallery__thumbs" aria-label="Galería del producto">
          {views.map((view, index) => (
            <button
              type="button"
              key={view.key}
              className={`gallery__thumb ${index === thumbIdx ? "is-active" : ""}`}
              onClick={() => setThumbIdx(index)}
              aria-label={
                view.kind === "mockup"
                  ? `Mockup con ${currentDesign?.name || "el diseño seleccionado"}`
                  : view.kind === "photo"
                    ? `Foto real de ${product.name}`
                    : `Vista ilustrativa ${index + 1}`
              }
              aria-pressed={index === thumbIdx}
            >
              {renderView(view, true)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
