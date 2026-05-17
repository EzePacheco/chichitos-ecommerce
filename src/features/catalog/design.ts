import type { DesignShape, GarmentType } from "@/components/ui/design-system";
import type { CatalogProduct, ProductCategory } from "./data/featured-products";

export type CatalogDesignVisual = {
  id: string;
  name: string;
  shape: DesignShape;
  color: string;
};

export const designVisuals: CatalogDesignVisual[] = [
  { id: "nubecita", name: "Nubecita", shape: "cloud", color: "var(--celeste)" },
  { id: "estrella", name: "Estrellita", shape: "star", color: "var(--mostaza)" },
  { id: "soleado", name: "Soleado", shape: "sun", color: "var(--coral)" },
  { id: "lunita", name: "Lunita", shape: "moon", color: "var(--celeste-d)" },
  { id: "cohete", name: "Cohete", shape: "rocket", color: "var(--coral-d)" },
  { id: "florcita", name: "Florcita", shape: "flower", color: "var(--salvia-d)" },
  { id: "corazon", name: "Corazón", shape: "heart", color: "var(--rosa)" },
  { id: "arcoiris", name: "Arcoíris", shape: "rainbow", color: "var(--mostaza)" },
];

const garmentByCategory: Record<ProductCategory, GarmentType> = {
  remeras: "Remera",
  bodies: "Body",
  abrigos: "Buzo",
  sets: "Accesorio",
  accesorios: "Accesorio",
};

export function getGarmentType(product: CatalogProduct): GarmentType {
  return garmentByCategory[product.category];
}

export function getProductBaseColor(product: CatalogProduct) {
  return product.colors[0]?.hex ?? "var(--cream-50)";
}

export function getProductDesignVisual(product: CatalogProduct) {
  const index = Math.abs([...product.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % designVisuals.length;
  return designVisuals[index];
}

export function getProductTagVariant(product: CatalogProduct): "dashed" | "durazno" | "salvia" | "celeste" | "mostaza" {
  const firstBadge = product.badges[0]?.toLowerCase() ?? "";

  if (firstBadge.includes("nuevo")) return "mostaza";
  if (firstBadge.includes("personal")) return "durazno";
  if (firstBadge.includes("regalo")) return "celeste";
  if (firstBadge.includes("pedido")) return "salvia";

  return "dashed";
}
