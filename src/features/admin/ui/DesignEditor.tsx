import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";

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
  action: (formData: FormData) => void | Promise<void>;
  design?: EditableAdminDesign | null;
  lockSlug?: boolean;
};

export function DesignEditor({
  action,
  design,
  lockSlug = false,
}: DesignEditorProps) {
  return (
    <form action={action} className="card admin-form" encType="multipart/form-data">
      <section className="admin-form__section">
        <h3>Diseño</h3>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="designName">Nombre</label>
            <input
              className="input"
              defaultValue={design?.name ?? ""}
              id="designName"
              name="name"
            />
          </div>
          <div className="field">
            <label htmlFor="designSlug">Slug</label>
            <input
              className="input"
              defaultValue={design?.slug ?? ""}
              id="designSlug"
              name="slug"
              readOnly={lockSlug}
            />
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="designStatus">Estado</label>
            <select
              className="select"
              defaultValue={design?.status ?? "draft"}
              id="designStatus"
              name="status"
            >
              <option value="draft">Borrador</option>
              <option value="active">Activo</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="baseExtraPrice">Extra base en pesos</label>
            <input
              className="input"
              defaultValue={
                design ? String(Math.round(design.baseExtraPriceCents / 100)) : "0"
              }
              id="baseExtraPrice"
              inputMode="numeric"
              name="baseExtraPrice"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="designSummary">Resumen</label>
          <input
            className="input"
            defaultValue={design?.summary ?? ""}
            id="designSummary"
            name="summary"
          />
        </div>
        <div className="field">
          <label htmlFor="designDescription">Descripción</label>
          <textarea
            className="textarea"
            defaultValue={design?.description ?? ""}
            id="designDescription"
            name="description"
            rows={4}
          />
        </div>
        <div className="field">
          <label htmlFor="designImage">Imagen</label>
          <input
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="input"
            id="designImage"
            name="image"
            type="file"
          />
        </div>
      </section>
      <Button type="submit" variant="primary">
        <Check size={20} /> Guardar diseño
      </Button>
    </form>
  );
}
