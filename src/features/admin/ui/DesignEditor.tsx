"use client";

import { useState } from "react";
import type { AdminActionState } from "../model/admin-action-state";
import {
  createDesignEditorDraft,
  type DesignEditorDraft,
  type EditableAdminDesign,
} from "../model/design-editor-model";
import { AdminActionForm } from "./AdminActionForm";
import { AdminCurrencyInput } from "./AdminCurrencyInput";
import { AdminField } from "./AdminField";
import { CatalogImageUploadField } from "./CatalogImageUploadField";
import { EditorPreviewLayout } from "./EditorPreviewLayout";
import { DesignEditorPreview } from "./design-editor/DesignEditorPreview";

type DesignEditorProps = {
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  design?: EditableAdminDesign | null;
  lockSlug?: boolean;
};

export function DesignEditor({
  action,
  design,
  lockSlug = false,
}: DesignEditorProps) {
  const [draft, setDraft] = useState<DesignEditorDraft>(() =>
    createDesignEditorDraft(design),
  );
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    design?.imageUrl ?? null,
  );

  return (
    <AdminActionForm
      action={action}
      className="card admin-form admin-editor admin-design-editor"
      submitLabel="Guardar diseño"
      pendingLabel="Guardando diseño..."
    >
      <EditorPreviewLayout
        renderPreview={(titleId) => (
          <DesignEditorPreview
            draft={draft}
            imageAlt={design?.imageAlt}
            imageUrl={previewImageUrl}
            titleId={titleId}
          />
        )}
      >
          <section
            className="admin-form__section admin-editor__group"
            id="design-data"
          >
          <div className="admin-editor__group-head">
            <span className="eyebrow">Contenido</span>
            <h2>Datos del diseño</h2>
            <p>Completá lo esencial para identificarlo y mostrarlo en la tienda.</p>
          </div>
          <div
            className={
              lockSlug
                ? "field-grid"
                : "field-grid admin-design-editor__single-field"
            }
          >
            <AdminField label="Nombre" name="name" requirement="required">
              <input
                className="input"
                placeholder="Ej: Bosque de amigos"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </AdminField>
            {lockSlug ? (
              <AdminField
                label="Dirección en la tienda"
                name="slug"
                requirement="optional"
                hint="Se conserva para no romper enlaces existentes."
              >
                <input
                  className="input"
                  defaultValue={design?.slug ?? ""}
                  readOnly
                />
              </AdminField>
            ) : null}
          </div>
          <div className="field-grid">
            <AdminField
              label="Estado"
              name="status"
              requirement="required"
              hint="Sólo los diseños activos pueden ofrecerse en la tienda."
            >
              <select
                className="select"
                value={draft.status}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    status: event.target
                      .value as DesignEditorDraft["status"],
                  }))
                }
              >
                <option value="draft">Borrador</option>
                <option value="active">Activo</option>
                <option value="archived">Archivado</option>
              </select>
            </AdminField>
            <AdminField
              label="Extra base en pesos"
              name="baseExtraPrice"
              requirement="required"
              hint="Usá 0 cuando el diseño no suma costo."
            >
              <AdminCurrencyInput
                inputMode="numeric"
                min={0}
                step={1}
                type="number"
                value={draft.baseExtraPrice}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    baseExtraPrice: event.target.value,
                  }))
                }
              />
            </AdminField>
          </div>
          <AdminField
            label="Resumen"
            name="summary"
            requirement="required"
            hint="Una frase breve para reconocer el diseño al elegirlo."
          >
            <input
              className="input"
              placeholder="Ej: Animalitos y hojas"
              value={draft.summary}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
            />
          </AdminField>
          <div className="admin-design-editor__media-fields">
            <AdminField
              label="Descripción"
              name="description"
              requirement="optional"
            >
              <textarea
                className="textarea"
                rows={4}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </AdminField>
            <CatalogImageUploadField
              existingImageUrl={design?.imageUrl}
              onPreviewChange={setPreviewImageUrl}
            />
          </div>
          </section>
      </EditorPreviewLayout>
    </AdminActionForm>
  );
}
