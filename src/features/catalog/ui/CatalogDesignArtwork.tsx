"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { CatalogDesign } from "@/features/catalog/public";
import { DesignSvg, type DesignShape } from "./GarmentVisuals";

type CatalogDesignArtworkProps = {
  className?: string;
  design: CatalogDesign;
  fallbackVisual?: {
    shape: DesignShape;
    color: string;
  };
};

export function CatalogDesignArtwork({
  className,
  design,
  fallbackVisual,
}: CatalogDesignArtworkProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageAvailable =
    Boolean(design.imageUrl) && failedUrl !== design.imageUrl;

  if (imageAvailable) {
    return (
      <img
        alt=""
        className={className}
        decoding="async"
        loading="lazy"
        onError={() => setFailedUrl(design.imageUrl ?? null)}
        src={design.imageUrl ?? ""}
      />
    );
  }

  if (fallbackVisual) {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="-20 -20 40 40"
      >
        <DesignSvg
          shape={fallbackVisual.shape}
          color={fallbackVisual.color}
        />
      </svg>
    );
  }

  return (
    <span aria-hidden="true" className={className}>
      {design.name.slice(0, 1)}
    </span>
  );
}
