"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import type {
  CatalogDesignOption,
  CatalogProduct,
} from "@/features/catalog/public";
import type { AdminActionState } from "../model/admin-action-state";
import {
  createProductEditorDraft,
  productEditorStepForHash,
  productEditorSteps,
  type ProductEditorDraft,
  type ProductEditorStep,
} from "../model/product-editor-model";
import {
  serializeProductEditorState,
  type ProductEditorState,
} from "../model/product-editor-state";
import { AdminActionForm } from "./AdminActionForm";
import { EditorPreviewLayout } from "./EditorPreviewLayout";
import {
  ProductContentSection,
  ProductIdentitySection,
} from "./product-editor/ProductBasicsSection";
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
  availableDesigns?: CatalogDesignOption[];
};

export function ProductEditor({
  action,
  product,
  lockSlug = false,
  availableDesigns = [],
}: ProductEditorProps) {
  const [draft, setDraft] = useState<ProductEditorDraft>(() =>
    createProductEditorDraft(product),
  );
  const [activeStep, setActiveStep] =
    useState<ProductEditorStep>("identity");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    product?.imageUrl ?? null,
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

  useEffect(() => {
    function selectHashStep() {
      const nextStep = productEditorStepForHash(window.location.hash);
      if (nextStep) setActiveStep(nextStep);
    }

    selectHashStep();
    window.addEventListener("hashchange", selectHashStep);
    return () => window.removeEventListener("hashchange", selectHashStep);
  }, []);

  function handleStepKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % productEditorSteps.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + productEditorSteps.length) % productEditorSteps.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = productEditorSteps.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextStep = productEditorSteps[nextIndex];
    if (!nextStep) return;
    setActiveStep(nextStep.id);
    document.getElementById(`product-tab-${nextStep.id}`)?.focus();
  }

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

      <nav
        className="admin-editor__nav"
        aria-label="Etapas del producto"
        role="tablist"
      >
        {productEditorSteps.map((step, index) => (
          <button
            aria-controls={`product-step-${step.id}`}
            aria-selected={activeStep === step.id}
            id={`product-tab-${step.id}`}
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            onKeyDown={(event) => handleStepKeyDown(event, index)}
            role="tab"
            tabIndex={activeStep === step.id ? 0 : -1}
            type="button"
          >
            {step.label}
          </button>
        ))}
      </nav>

      <EditorPreviewLayout
        renderPreview={(titleId) => (
          <ProductEditorPreview
            draft={draft}
            imageUrl={previewImageUrl}
            titleId={titleId}
          />
        )}
      >
          <div
            aria-labelledby="product-tab-identity"
            hidden={activeStep !== "identity"}
            id="product-step-identity"
            role="tabpanel"
          >
            <ProductIdentitySection
              draft={draft}
              lockSlug={lockSlug}
              onChange={(patch) =>
                setDraft((current) => ({ ...current, ...patch }))
              }
              product={product}
            />
          </div>
          <div
            aria-labelledby="product-tab-content"
            hidden={activeStep !== "content"}
            id="product-step-content"
            role="tabpanel"
          >
            <ProductContentSection
              draft={draft}
              existingImageUrl={product?.imageUrl}
              onImagePreviewChange={setPreviewImageUrl}
              onChange={(patch) =>
                setDraft((current) => ({ ...current, ...patch }))
              }
            />
          </div>
          <div
            aria-labelledby="product-tab-options"
            hidden={activeStep !== "options"}
            id="product-step-options"
            role="tabpanel"
          >
            <div
              className="admin-editor__group"
              aria-labelledby="options-title"
              id="options"
            >
              <div className="admin-editor__group-head">
                <span className="eyebrow">Paso 3</span>
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
          </div>
          <div
            aria-labelledby="product-tab-personalization"
            hidden={activeStep !== "personalization"}
            id="product-step-personalization"
            role="tabpanel"
          >
            <ProductPersonalizationSection
              draft={draft}
              onChange={(patch) =>
                setDraft((current) => ({ ...current, ...patch }))
              }
            />
          </div>
      </EditorPreviewLayout>
    </AdminActionForm>
  );
}
