import type { CatalogProduct } from "@/features/catalog/model/catalog-products";

type ProductPersonalizationSectionProps = {
  product?: CatalogProduct | null;
};

export function ProductPersonalizationSection({
  product,
}: ProductPersonalizationSectionProps) {
  return (
    <section className="admin-form__section">
      <h3>Personalización</h3>
      <div className="field-grid">
        <label className="radio-card" htmlFor="personalizationEnabled">
          <input
            defaultChecked={product?.personalization.enabled ?? true}
            id="personalizationEnabled"
            name="personalizationEnabled"
            type="checkbox"
          />
          <div>
            <h4 className="radio-card__title">Permite personalizar</h4>
            <p className="radio-card__sub">Nombre, inicial o frase corta.</p>
          </div>
        </label>
        <div className="field">
          <label htmlFor="personalizationPrice">Extra en pesos</label>
          <input
            className="input"
            id="personalizationPrice"
            inputMode="numeric"
            min={0}
            name="personalizationPrice"
            step={1}
            type="number"
            defaultValue={
              product
                ? String(Math.round(product.personalization.extraPriceCents / 100))
                : "0"
            }
          />
        </div>
      </div>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="personalizationLabel">Label</label>
          <input
            className="input"
            id="personalizationLabel"
            name="personalizationLabel"
            defaultValue={product?.personalization.label ?? "Nombre o frase corta"}
          />
        </div>
        <div className="field">
          <label htmlFor="personalizationDescription">Descripción</label>
          <input
            className="input"
            id="personalizationDescription"
            name="personalizationDescription"
            defaultValue={product?.personalization.description ?? ""}
          />
        </div>
      </div>
    </section>
  );
}
