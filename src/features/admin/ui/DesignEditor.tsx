"use client";

import { useState } from "react";
import type { AdminActionState } from "../model/admin-action-state";
import { AdminActionForm } from "./AdminActionForm";
import { AdminField } from "./AdminField";
import { DesignEditorPreview } from "./design-editor/DesignEditorPreview";

type EditableAdminDesign = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  status: "draft" | "active" | "archived";
  baseExtraPriceCents: number;
  imageUrl: string | null;
  imageAlt: string;
};

type DesignEditorProps = {
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  design?: EditableAdminDesign | null;
  lockSlug?: boolean;
};

export type DesignEditorDraft = {
  name: string;
  summary: string;
  description: string;
  status: EditableAdminDesign["status"];
  baseExtraPrice: string;
};

export function DesignEditor({
  action,
  design,
  lockSlug = false,
}: DesignEditorProps) {
  const [draft, setDraft] = useState<DesignEditorDraft>(() => ({
    name: design?.name ?? "",
    summary: design?.summary ?? "",
    description: design?.description ?? "",
    status: design?.status ?? "draft",
    baseExtraPrice: design
      ? String(Math.round(design.baseExtraPriceCents / 100))
      : "0",
  }));

  return (
    <AdminActionForm
      action={action}
      className="card admin-form admin-editor"
      submitLabel="Guardar diseño"
      pendingLabel="Guardando diseño..."
    >
      <div className="admin-editor__layout">
        <section
          className="admin-form__section admin-editor__group"
          id="design-data"
        >
          <div className="admin-editor__group-head">
            <span className="eyebrow">Contenido</span>
            <h2>Datos del diseño</h2>
            <p>Completá lo esencial para identificarlo y mostrarlo en la tienda.</p>
          </div>
          <div className="field-grid">
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
              <input
                className="input"
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
          <AdminField
            label="Imagen"
            name="image"
            requirement="optional"
            hint="PNG, JPG, WebP o AVIF de hasta 5 MB."
          >
            <input
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="input"
              type="file"
            />
          </AdminField>
        </section>
        <DesignEditorPreview
          draft={draft}
          imageAlt={design?.imageAlt}
          imageUrl={design?.imageUrl}
        />
      </div>
    </AdminActionForm>
  );
}
