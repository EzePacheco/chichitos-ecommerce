"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/features/catalog/model/catalog-products";
import type { AdminActionState } from "../model/admin-action-state";
import {
  createProductEditorState,
  serializeProductEditorState,
  type ProductEditorState,
} from "../model/product-editor-state";
import { AdminActionForm } from "./AdminActionForm";
import { ProductBasicsSection } from "./product-editor/ProductBasicsSection";
import { ProductPersonalizationSection } from "./product-editor/ProductPersonalizationSection";
import { ProductVariantSections } from "./product-editor/ProductVariantSections";

type ProductEditorProps = {
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  product?: CatalogProduct | null;
  lockSlug?: boolean;
};

export function ProductEditor({ action, product, lockSlug = false }: ProductEditorProps) {
  const [state, setState] = useState<ProductEditorState>(() =>
    createProductEditorState(product),
  );
  const serialized = useMemo(() => serializeProductEditorState(state), [state]);

  return (
    <AdminActionForm
      action={action}
      submitLabel="Guardar producto"
      pendingLabel="Guardando producto..."
    >
      <input name="sizes" type="hidden" value={serialized.sizes} />
      <input name="colors" type="hidden" value={serialized.colors} />
      <input name="designs" type="hidden" value={serialized.designs} />
      <input name="stock" type="hidden" value={serialized.stock} />

      <ProductBasicsSection product={product} lockSlug={lockSlug} />
      <ProductVariantSections state={state} setState={setState} />
      <ProductPersonalizationSection product={product} />
    </AdminActionForm>
  );
}
