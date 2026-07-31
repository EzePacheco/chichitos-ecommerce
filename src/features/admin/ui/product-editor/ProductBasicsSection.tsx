import type { CatalogProduct } from "@/features/catalog/public";
import type { ProductEditorDraft } from "../../model/product-editor-model";
import { AdminCurrencyInput } from "../AdminCurrencyInput";
import { AdminField } from "../AdminField";
import { CatalogImageUploadField } from "../CatalogImageUploadField";

type ProductBasicsSectionProps = {
  draft: ProductEditorDraft;
  product?: CatalogProduct | null;
  lockSlug: boolean;
  onChange: (patch: Partial<ProductEditorDraft>) => void;
};

export function ProductIdentitySection({
  draft,
  product,
  lockSlug,
  onChange,
}: ProductBasicsSectionProps) {
  return (
    <section
      className="admin-form__section admin-editor__group"
      id="product-data"
    >
      <div className="admin-editor__group-head">
        <span className="eyebrow">Paso 1</span>
        <h2>Datos principales</h2>
        <p>La información que presenta el producto en el catálogo.</p>
      </div>
      <div className="field-grid">
        <AdminField label="Nombre" name="name" requirement="required">
          <input
            className="input"
            placeholder="Ej: Remera bosque de amigos"
            value={draft.name}
            onChange={(event) => onChange({ name: event.target.value })}
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
              readOnly
              defaultValue={product?.slug ?? ""}
            />
          </AdminField>
        ) : null}
      </div>
      <div className="field-grid">
        <AdminField label="Categoría" name="category" requirement="required">
          <select
            className="select"
            value={draft.category}
            onChange={(event) =>
              onChange({
                category: event.target.value as ProductEditorDraft["category"],
              })
            }
          >
            <option value="remeras">Remeras</option>
            <option value="bodies">Bodies</option>
            <option value="abrigos">Abrigos</option>
            <option value="sets">Sets</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </AdminField>
        <AdminField
          label="Estado"
          name="status"
          requirement="required"
          hint="Un borrador no aparece en la tienda."
        >
          <select
            className="select"
            value={draft.status}
            onChange={(event) =>
              onChange({
                status: event.target.value as ProductEditorDraft["status"],
              })
            }
          >
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
          </select>
        </AdminField>
      </div>
      <div className="field-grid">
        <AdminField
          label="Precio base en pesos"
          name="basePrice"
          requirement="required"
          hint="Ingresá pesos enteros, sin puntos ni centavos."
        >
          <AdminCurrencyInput
            inputMode="numeric"
            min={1}
            step={1}
            type="number"
            value={draft.basePrice}
            onChange={(event) => onChange({ basePrice: event.target.value })}
          />
        </AdminField>
        <label className="radio-card" htmlFor="productFeatured">
          <input
            checked={draft.featured}
            id="productFeatured"
            name="featured"
            type="checkbox"
            onChange={(event) => onChange({ featured: event.target.checked })}
          />
          <div>
            <h4 className="radio-card__title">Destacado</h4>
            <p className="radio-card__sub">Aparece en la home.</p>
          </div>
        </label>
      </div>
    </section>
  );
}

export function ProductContentSection({
  draft,
  existingImageUrl,
  onChange,
  onImagePreviewChange,
}: Pick<ProductBasicsSectionProps, "draft" | "onChange"> & {
  existingImageUrl?: string | null;
  onImagePreviewChange: (url: string | null) => void;
}) {
  return (
    <section
      className="admin-form__section admin-editor__group"
      id="product-content"
    >
      <div className="admin-editor__group-head">
        <span className="eyebrow">Paso 2</span>
        <h2>Contenido de la publicación</h2>
        <p>Textos, imagen y tiempos que ve la clienta en la tienda.</p>
      </div>
      <AdminField
        label="Resumen"
        name="summary"
        requirement="required"
        hint="Una línea corta para las tarjetas del catálogo."
      >
        <input
          className="input"
          placeholder="Una línea corta que se ve en el catálogo"
          value={draft.summary}
          onChange={(event) => onChange({ summary: event.target.value })}
        />
      </AdminField>
      <AdminField
        label="Descripción"
        name="description"
        requirement="required"
      >
        <textarea
          className="textarea"
          rows={3}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </AdminField>
      <div className="field-grid">
        <CatalogImageUploadField
          existingImageUrl={existingImageUrl}
          label="Imagen principal"
          hint="PNG, JPG, WebP o AVIF de hasta 5 MB."
          onPreviewChange={onImagePreviewChange}
        />
        <AdminField
          label="Tiempo de producción"
          name="productionTime"
          requirement="optional"
          hint="Indicá un rango realista para preparar el pedido."
        >
          <input
            className="input"
            placeholder="Ej: 5 a 7 días hábiles"
            value={draft.productionTime}
            onChange={(event) =>
              onChange({ productionTime: event.target.value })
            }
          />
        </AdminField>
      </div>
    </section>
  );
}
