"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { CatalogProduct } from "@/features/catalog/model/catalog-products";
import {
  createProductEditorState,
  serializeProductEditorState,
  type ProductEditorState,
} from "../model/product-editor-state";
import { ProductBasicsSection } from "./product-editor/ProductBasicsSection";
import { ProductPersonalizationSection } from "./product-editor/ProductPersonalizationSection";
import { ProductVariantSections } from "./product-editor/ProductVariantSections";

type ProductEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  product?: CatalogProduct | null;
  lockSlug?: boolean;
};

export function ProductEditor({ action, product, lockSlug = false }: ProductEditorProps) {
  const [state, setState] = useState<ProductEditorState>(() =>
    createProductEditorState(product),
  );
  const serialized = useMemo(() => serializeProductEditorState(state), [state]);

  return (
    <form action={action} className="card admin-form" encType="multipart/form-data">
      <input name="sizes" type="hidden" value={serialized.sizes} />
      <input name="colors" type="hidden" value={serialized.colors} />
      <input name="designs" type="hidden" value={serialized.designs} />
      <input name="stock" type="hidden" value={serialized.stock} />

      <ProductBasicsSection product={product} lockSlug={lockSlug} />
      <ProductVariantSections state={state} setState={setState} />
      <ProductPersonalizationSection product={product} />

      <Button type="submit" variant="primary">
        <Check size={20} /> Guardar producto
      </Button>
    </form>
  );
}
