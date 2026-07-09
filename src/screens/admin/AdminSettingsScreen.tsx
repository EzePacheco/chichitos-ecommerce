import { Check, Info } from "lucide-react";
import { saveStoreSettingsAction } from "@/features/admin/server/actions";
import { Button } from "@/shared/ui/button";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import {
  formatCentsForAdminInput,
  formatDecimalForAdminInput,
  getMissingStoreSettingsFields,
  getStoreSettings,
  isStoreSettingsOnboardingComplete,
} from "@/server/settings/store-settings";

type PageProps = {
  searchParams?: Promise<{ settings?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const status = firstParam((await searchParams)?.settings);
  const storeSettings = await getStoreSettings();
  const settingsComplete = isStoreSettingsOnboardingComplete(storeSettings);
  const missingFields = getMissingStoreSettingsFields(storeSettings);

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuración"
        title="Ajustes comerciales"
        action={
          <span className={`status ${settingsComplete ? "status--done" : "status--new"}`}>
            {settingsComplete ? "Configuración completa" : "Onboarding pendiente"}
          </span>
        }
      />

      {!settingsComplete ? (
        <div className="disclaimer admin__notice">
          <Info size={20} />
          <div>
            <strong>Completá la configuración inicial.</strong>
            <p style={{ margin: "4px 0 0" }}>
              Falta: {missingFields.join(", ")}.
            </p>
          </div>
        </div>
      ) : null}

      {status === "saved" ? (
        <div className="disclaimer admin__notice">
          <Check size={20} />
          <div>Los ajustes comerciales se guardaron correctamente.</div>
        </div>
      ) : null}

      {status === "invalid" ? (
        <div className="disclaimer admin__notice">
          <Info size={20} />
          <div>Revisá WhatsApp, distancias y precios antes de volver a intentar.</div>
        </div>
      ) : null}

      <form action={saveStoreSettingsAction} className="card admin-form">
        <section className="admin-form__section">
          <h3>Datos de tienda</h3>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="storeName">Nombre de tienda</label>
              <input
                className="input"
                defaultValue={storeSettings.store_name}
                id="storeName"
                name="storeName"
              />
            </div>
            <div className="field">
              <label htmlFor="whatsappNumber">WhatsApp</label>
              <input
                className="input"
                defaultValue={storeSettings.whatsapp_number ?? ""}
                id="whatsappNumber"
                inputMode="tel"
                name="whatsappNumber"
                placeholder="Ej: +54 9 11 1234 5678"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="storeAddress">Dirección/origen del taller</label>
            <input
              className="input"
              defaultValue={storeSettings.store_address ?? ""}
              id="storeAddress"
              name="storeAddress"
              placeholder="Dirección usada para calcular envíos"
            />
          </div>
        </section>

        <section className="admin-form__section">
          <h3>Política de envíos</h3>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="deliveryBaseRadiusKm">Radio base en km</label>
              <input
                className="input"
                defaultValue={formatDecimalForAdminInput(
                  storeSettings.delivery_base_radius_km,
                )}
                id="deliveryBaseRadiusKm"
                inputMode="decimal"
                name="deliveryBaseRadiusKm"
              />
            </div>
            <div className="field">
              <label htmlFor="deliveryBasePrice">Tarifa base en pesos</label>
              <input
                className="input"
                defaultValue={formatCentsForAdminInput(
                  storeSettings.delivery_base_price_cents,
                )}
                id="deliveryBasePrice"
                inputMode="numeric"
                name="deliveryBasePrice"
              />
            </div>
          </div>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="deliveryExtraStepKm">Tramo adicional en km</label>
              <input
                className="input"
                defaultValue={formatDecimalForAdminInput(
                  storeSettings.delivery_extra_step_km,
                )}
                id="deliveryExtraStepKm"
                inputMode="decimal"
                name="deliveryExtraStepKm"
              />
            </div>
            <div className="field">
              <label htmlFor="deliveryExtraStepPrice">
                Adicional por tramo en pesos
              </label>
              <input
                className="input"
                defaultValue={formatCentsForAdminInput(
                  storeSettings.delivery_extra_step_price_cents,
                )}
                id="deliveryExtraStepPrice"
                inputMode="numeric"
                name="deliveryExtraStepPrice"
              />
            </div>
          </div>
        </section>

        <section className="admin-form__section">
          <h3>Producción y checkout</h3>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="defaultPersonalizationExtraPrice">
                Costo default de personalización en pesos
              </label>
              <input
                className="input"
                defaultValue={formatCentsForAdminInput(
                  storeSettings.default_personalization_extra_price_cents,
                )}
                id="defaultPersonalizationExtraPrice"
                inputMode="numeric"
                name="defaultPersonalizationExtraPrice"
              />
            </div>
            <label className="radio-card" htmlFor="checkoutEnabled">
              <input
                defaultChecked={storeSettings.checkout_enabled}
                id="checkoutEnabled"
                name="checkoutEnabled"
                type="checkbox"
              />
              <div>
                <h4 className="radio-card__title">Checkout habilitado</h4>
                <p className="radio-card__sub">
                  Usalo cuando ya estén listos envío, pagos y operación.
                </p>
              </div>
            </label>
          </div>
          <div className="field">
            <label htmlFor="productionTimeText">Tiempos de producción</label>
            <textarea
              className="textarea"
              defaultValue={storeSettings.production_time_text}
              id="productionTimeText"
              name="productionTimeText"
              rows={3}
            />
          </div>
          <div className="field">
            <label htmlFor="changesReturnsPolicy">Cambios y devoluciones</label>
            <textarea
              className="textarea"
              defaultValue={storeSettings.changes_returns_policy}
              id="changesReturnsPolicy"
              name="changesReturnsPolicy"
              rows={5}
            />
          </div>
        </section>

        <Button type="submit" variant="primary">
          <Check size={20} /> Guardar cambios
        </Button>
      </form>
    </>
  );
}
