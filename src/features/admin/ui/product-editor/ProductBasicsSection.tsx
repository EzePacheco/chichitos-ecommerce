import type { CatalogProduct } from "@/features/catalog/model/catalog-products";

type ProductBasicsSectionProps = {
  product?: CatalogProduct | null;
  lockSlug: boolean;
};

export function ProductBasicsSection({
  product,
  lockSlug,
}: ProductBasicsSectionProps) {
  return (
    <section className="admin-form__section">
      <h3>Datos principales</h3>
      <p className="admin-form__hint">Los campos con * son obligatorios.</p>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="productName">Nombre *</label>
          <input
            className="input"
            id="productName"
            name="name"
            placeholder="Ej: Remera bosque de amigos"
            required
            defaultValue={product?.name ?? ""}
          />
        </div>
        {lockSlug ? (
          <div className="field">
            <label htmlFor="productSlug">Dirección en la tienda</label>
            <input
              className="input"
              id="productSlug"
              name="slug"
              readOnly
              defaultValue={product?.slug ?? ""}
            />
          </div>
        ) : null}
      </div>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="productCategory">Categoría</label>
          <select
            className="select"
            id="productCategory"
            name="category"
            defaultValue={product?.category ?? "remeras"}
          >
            <option value="remeras">Remeras</option>
            <option value="bodies">Bodies</option>
            <option value="abrigos">Abrigos</option>
            <option value="sets">Sets</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="productStatus">Estado</label>
          <select
            className="select"
            id="productStatus"
            name="status"
            defaultValue={product?.status ?? "draft"}
          >
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
          </select>
        </div>
      </div>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="productPrice">Precio base en pesos *</label>
          <input
            className="input"
            id="productPrice"
            inputMode="numeric"
            min={1}
            name="basePrice"
            required
            step={1}
            type="number"
            defaultValue={
              product ? String(Math.round(product.basePriceCents / 100)) : ""
            }
          />
        </div>
        <label className="radio-card" htmlFor="productFeatured">
          <input
            defaultChecked={product?.featured ?? false}
            id="productFeatured"
            name="featured"
            type="checkbox"
          />
          <div>
            <h4 className="radio-card__title">Destacado</h4>
            <p className="radio-card__sub">Aparece en la home.</p>
          </div>
        </label>
      </div>
      <div className="field">
        <label htmlFor="productSummary">Resumen *</label>
        <input
          className="input"
          id="productSummary"
          name="summary"
          placeholder="Una línea corta que se ve en el catálogo"
          required
          defaultValue={product?.summary ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor="productDescription">Descripción *</label>
        <textarea
          className="textarea"
          id="productDescription"
          name="description"
          required
          rows={3}
          defaultValue={product?.description ?? ""}
        />
      </div>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="productImage">Imagen principal</label>
          <input
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="input"
            id="productImage"
            name="image"
            type="file"
          />
        </div>
        <div className="field">
          <label htmlFor="productionTime">Tiempo de producción</label>
          <input
            className="input"
            id="productionTime"
            name="productionTime"
            placeholder="Ej: 5 a 7 días hábiles"
            defaultValue={product?.productionTime ?? ""}
          />
        </div>
      </div>
    </section>
  );
}
