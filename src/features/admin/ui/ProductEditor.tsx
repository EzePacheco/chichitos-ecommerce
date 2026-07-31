"use client";

import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CatalogProduct } from "@/features/catalog/model/catalog-products";
import type { AdminActionState } from "../model/admin-action-state";
import {
  createProductEditorState,
  serializeProductEditorState,
  type ProductEditorDesignOption,
  type ProductEditorState,
} from "../model/product-editor-state";
import { AdminActionForm } from "./AdminActionForm";
import { ProductBasicsSection } from "./product-editor/ProductBasicsSection";
import { ProductEditorPreview } from "./product-editor/ProductEditorPreview";
import { ProductPersonalizationSection } from "./product-editor/ProductPersonalizationSection";
import { ProductVariantSections } from "./product-editor/ProductVariantSections";

type ProductEditorProps = {
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  product?: CatalogProduct | null;
  lockSlug?: boolean;
  availableDesigns?: ProductEditorDesignOption[];
};

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

function createProductEditorDraft(
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

export function ProductEditor({
  action,
  product,
  lockSlug = false,
  availableDesigns = [],
}: ProductEditorProps) {
  const [draft, setDraft] = useState<ProductEditorDraft>(() =>
    createProductEditorDraft(product),
  );
  const serialized = useMemo(
    () => serializeProductEditorState(draft.variants),
    [draft.variants],
  );
  const setVariantState: Dispatch<SetStateAction<ProductEditorState>> = (
    nextState,
  ) => {
    setDraft((current) => ({
      ...current,
      variants:
        typeof nextState === "function"
          ? nextState(current.variants)
          : nextState,
    }));
  };

  return (
    <AdminActionForm
      action={action}
      className="card admin-form admin-editor"
      submitLabel="Guardar producto"
      pendingLabel="Guardando producto..."
    >
      <input name="sizes" type="hidden" value={serialized.sizes} />
      <input name="colors" type="hidden" value={serialized.colors} />
      <input name="designs" type="hidden" value={serialized.designs} />
      <input name="stock" type="hidden" value={serialized.stock} />

      <nav className="admin-editor__nav" aria-label="Secciones del producto">
        <a href="#product-data">Datos</a>
        <a href="#sizes">Opciones</a>
        <a href="#stock">Stock</a>
        <a href="#personalization">Personalización</a>
      </nav>

      <div className="admin-editor__layout">
        <div className="admin-editor__content">
          <ProductBasicsSection
            draft={draft}
            lockSlug={lockSlug}
            onChange={(patch) =>
              setDraft((current) => ({ ...current, ...patch }))
            }
            product={product}
          />
          <div className="admin-editor__group" aria-labelledby="options-title">
            <div className="admin-editor__group-head">
              <span className="eyebrow">Paso 2</span>
              <h2 id="options-title">Opciones de compra</h2>
              <p>
                Definí las combinaciones que la clienta puede elegir en la
                tienda.
              </p>
            </div>
            <ProductVariantSections
              availableDesigns={availableDesigns}
              setState={setVariantState}
              state={draft.variants}
            />
          </div>
          <ProductPersonalizationSection
            draft={draft}
            onChange={(patch) =>
              setDraft((current) => ({ ...current, ...patch }))
            }
          />
        </div>
        <ProductEditorPreview draft={draft} imageUrl={product?.imageUrl} />
      </div>
    </AdminActionForm>
  );
}
