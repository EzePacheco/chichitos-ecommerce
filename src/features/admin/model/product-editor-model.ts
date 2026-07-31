import type { CatalogProduct } from "@/features/catalog/public";
import {
  createProductEditorState,
  type ProductEditorState,
} from "./product-editor-state";

export type ProductEditorStep =
  | "identity"
  | "content"
  | "options"
  | "personalization";

export const productEditorSteps: Array<{
  id: ProductEditorStep;
  label: string;
}> = [
  { id: "identity", label: "Producto" },
  { id: "content", label: "Contenido" },
  { id: "options", label: "Opciones" },
  { id: "personalization", label: "Personalización" },
];

export type ProductEditorDraft = {
  name: string;
  category: CatalogProduct["category"];
  status: CatalogProduct["status"];
  featured: boolean;
  basePrice: string;
  summary: string;
  description: string;
  productionTime: string;
  personalizationEnabled: boolean;
  personalizationPrice: string;
  personalizationLabel: string;
  personalizationDescription: string;
  variants: ProductEditorState;
};

export function productEditorStepForHash(
  hash: string,
): ProductEditorStep | null {
  const field = hash.startsWith("#") ? hash.slice(1) : hash;

  if (
    ["name", "slug", "category", "status", "basePrice", "product-data"].includes(
      field,
    )
  ) {
    return "identity";
  }
  if (
    [
      "summary",
      "description",
      "image",
      "productionTime",
      "product-content",
    ].includes(field)
  ) {
    return "content";
  }
  if (["sizes", "colors", "designs", "stock", "options"].includes(field)) {
    return "options";
  }
  if (
    [
      "personalization",
      "personalizationPrice",
      "personalizationLabel",
      "personalizationDescription",
    ].includes(field)
  ) {
    return "personalization";
  }

  return null;
}

export function createProductEditorDraft(
  product?: CatalogProduct | null,
): ProductEditorDraft {
  return {
    name: product?.name ?? "",
    category: product?.category ?? "remeras",
    status: product?.status ?? "draft",
    featured: product?.featured ?? false,
    basePrice: product
      ? String(Math.round(product.basePriceCents / 100))
      : "",
    summary: product?.summary ?? "",
    description: product?.description ?? "",
    productionTime: product?.productionTime ?? "",
    personalizationEnabled: product?.personalization.enabled ?? true,
    personalizationPrice: product
      ? String(Math.round(product.personalization.extraPriceCents / 100))
      : "0",
    personalizationLabel:
      product?.personalization.label ?? "Nombre o frase corta",
    personalizationDescription: product?.personalization.description ?? "",
    variants: createProductEditorState(product),
  };
}
