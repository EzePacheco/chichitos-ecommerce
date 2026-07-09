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
      <div className="field-grid">
        <div className="field">
          <label htmlFor="productName">Nombre</label>
          <input
            className="input"
            id="productName"
            name="name"
            defaultValue={product?.name ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="productSlug">Slug</label>
          <input
            className="input"
            id="productSlug"
            name="slug"
            readOnly={lockSlug}
            defaultValue={product?.slug ?? ""}
          />
        </div>
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
          <label htmlFor="productPrice">Precio base en pesos</label>
          <input
            className="input"
            id="productPrice"
            inputMode="numeric"
            name="basePrice"
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
        <label htmlFor="productSummary">Resumen</label>
        <input
          className="input"
          id="productSummary"
          name="summary"
          defaultValue={product?.summary ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor="productDescription">Descripción</label>
        <textarea
          className="textarea"
          id="productDescription"
          name="description"
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
            defaultValue={product?.productionTime ?? ""}
          />
        </div>
      </div>
    </section>
  );
}
