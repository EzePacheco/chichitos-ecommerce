import { AdminField } from "../AdminField";
import { AdminCurrencyInput } from "../AdminCurrencyInput";
import type { ProductEditorDraft } from "../../model/product-editor-model";

type ProductPersonalizationSectionProps = {
  draft: ProductEditorDraft;
  onChange: (patch: Partial<ProductEditorDraft>) => void;
};

export function ProductPersonalizationSection({
  draft,
  onChange,
}: ProductPersonalizationSectionProps) {
  return (
    <section
      className="admin-form__section admin-editor__group"
      id="personalization"
    >
      <div className="admin-editor__group-head">
        <span className="eyebrow">Paso 4</span>
        <h2>Personalización</h2>
        <p>Configurá el texto opcional que puede sumar la clienta.</p>
      </div>
      <div className="field-grid">
        <label className="radio-card" htmlFor="personalizationEnabled">
          <input
            checked={draft.personalizationEnabled}
            id="personalizationEnabled"
            name="personalizationEnabled"
            type="checkbox"
            onChange={(event) =>
              onChange({ personalizationEnabled: event.target.checked })
            }
          />
          <div>
            <h4 className="radio-card__title">Permite personalizar</h4>
            <p className="radio-card__sub">Nombre, inicial o frase corta.</p>
          </div>
        </label>
        <AdminField
          label="Extra en pesos"
          name="personalizationPrice"
          requirement="optional"
          hint="Usá 0 si no tiene costo adicional."
        >
          <AdminCurrencyInput
            inputMode="numeric"
            min={0}
            step={1}
            type="number"
            value={draft.personalizationPrice}
            onChange={(event) =>
              onChange({ personalizationPrice: event.target.value })
            }
          />
        </AdminField>
      </div>
      <div className="field-grid">
        <AdminField
          label="Etiqueta del campo"
          name="personalizationLabel"
          requirement="optional"
        >
          <input
            className="input"
            value={draft.personalizationLabel}
            onChange={(event) =>
              onChange({ personalizationLabel: event.target.value })
            }
          />
        </AdminField>
        <AdminField
          label="Ayuda para la clienta"
          name="personalizationDescription"
          requirement="optional"
        >
          <input
            className="input"
            value={draft.personalizationDescription}
            onChange={(event) =>
              onChange({ personalizationDescription: event.target.value })
            }
          />
        </AdminField>
      </div>
    </section>
  );
}
