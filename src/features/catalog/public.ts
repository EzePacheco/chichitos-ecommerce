export type ProductCategory =
  | "remeras"
  | "bodies"
  | "abrigos"
  | "sets"
  | "accesorios";

export type ProductStatus = "active" | "draft";

export type CatalogDesign = {
  id: string;
  name: string;
  summary: string;
  imageUrl?: string | null;
  imageAlt?: string;
  extraPriceCents?: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  status: ProductStatus;
  featured: boolean;
  summary: string;
  description: string;
  basePriceCents: number;
  productionTime: string;
  accentColor: string;
  imageUrl?: string | null;
  imageAlt?: string;
  badges: string[];
  sizes: Array<{
    id: string;
    label: string;
    note?: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
  }>;
  designs: CatalogDesign[];
  personalization: {
    enabled: boolean;
    label: string;
    description: string;
    extraPriceCents: number;
  };
  stock?: Array<{
    sizeCode: string;
    colorCode: string;
    designId?: string | null;
    quantityAvailable: number;
    trackStock: boolean;
  }>;
};

export type CatalogDesignOption = {
  slug: string;
  name: string;
  summary: string;
  baseExtraPriceCents: number;
};

export const CATALOG_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const CATALOG_IMAGE_ACCEPT = CATALOG_IMAGE_MIME_TYPES.join(",");
export const CATALOG_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const catalogImageMimeTypes = new Set<string>(CATALOG_IMAGE_MIME_TYPES);

export function validateCatalogImage(
  file: Pick<File, "size" | "type"> | null,
): string | null {
  if (!file) return null;

  if (!catalogImageMimeTypes.has(file.type)) {
    return "Elegí una imagen PNG, JPG, WebP o AVIF.";
  }

  if (file.size > CATALOG_IMAGE_MAX_BYTES) {
    return "Elegí una imagen de hasta 5 MB.";
  }

  return null;
}
