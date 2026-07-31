"use client";

import { useState } from "react";
import type { StoreSettingsRecord } from "@/server/settings/store-settings";
import { saveStoreSettingsAction } from "@/features/admin/server/actions";
import { AdminActionForm } from "@/features/admin/ui/AdminActionForm";
import { AdminField } from "@/features/admin/ui/AdminField";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type StoreSettingsFormProps = {
  settings: StoreSettingsRecord;
};

function formatCentsForInput(cents: number) {
  return String(Math.round(cents / 100));
}

export function StoreSettingsForm({ settings }: StoreSettingsFormProps) {
  const [checkoutEnabled, setCheckoutEnabled] = useState(
    settings.checkout_enabled,
  );
  const [checkoutConfirmationOpen, setCheckoutConfirmationOpen] =
    useState(false);

  return (
    <>
      <AdminActionForm
        action={saveStoreSettingsAction}
        pendingLabel="Guardando cambios..."
        submitLabel="Guardar cambios"
      >
        <section className="admin-form__section">
          <h3>Tienda</h3>
          <div className="field-grid">
            <AdminField
              label="Nombre de tienda"
              name="storeName"
              requirement="required"
            >
              <input className="input" defaultValue={settings.store_name} />
            </AdminField>
            <AdminField
              hint="Incluí código de país y código de área."
              label="WhatsApp"
              name="whatsappNumber"
              requirement="required"
            >
              <input
                className="input"
                defaultValue={settings.whatsapp_number ?? ""}
                inputMode="tel"
                placeholder="Ej: +54 9 11 1234 5678"
                type="tel"
              />
            </AdminField>
          </div>
          <AdminField
            hint="Se usa como origen para calcular los envíos."
            label="Dirección del taller"
            name="storeAddress"
            requirement="required"
          >
            <input
              className="input"
              defaultValue={settings.store_address ?? ""}
            />
          </AdminField>
        </section>

        <section className="admin-form__section">
          <h3>Envíos</h3>
          <div className="field-grid">
            <AdminField
              label="Radio base en km"
              name="deliveryBaseRadiusKm"
              requirement="required"
            >
              <input
                className="input"
                defaultValue={String(settings.delivery_base_radius_km)}
                inputMode="decimal"
                min={0.1}
                step={0.1}
                type="number"
              />
            </AdminField>
            <AdminField
              label="Tarifa base en pesos"
              name="deliveryBasePrice"
              requirement="required"
            >
              <input
                className="input"
                defaultValue={formatCentsForInput(
                  settings.delivery_base_price_cents,
                )}
                inputMode="numeric"
                min={0}
                step={1}
                type="number"
              />
            </AdminField>
          </div>
          <div className="field-grid">
            <AdminField
              label="Tramo adicional en km"
              name="deliveryExtraStepKm"
              requirement="required"
            >
              <input
                className="input"
                defaultValue={String(settings.delivery_extra_step_km)}
                inputMode="decimal"
                min={0.1}
                step={0.1}
                type="number"
              />
            </AdminField>
            <AdminField
              label="Adicional por tramo en pesos"
              name="deliveryExtraStepPrice"
              requirement="optional"
            >
              <input
                className="input"
                defaultValue={formatCentsForInput(
                  settings.delivery_extra_step_price_cents,
                )}
                inputMode="numeric"
                min={0}
                step={1}
                type="number"
              />
            </AdminField>
          </div>
        </section>

        <section className="admin-form__section">
          <h3>Producción</h3>
          <AdminField
            label="Costo de personalización en pesos"
            name="defaultPersonalizationExtraPrice"
            requirement="optional"
          >
            <input
              className="input"
              defaultValue={formatCentsForInput(
                settings.default_personalization_extra_price_cents,
              )}
              inputMode="numeric"
              min={0}
              step={1}
              type="number"
            />
          </AdminField>
          <AdminField
            label="Tiempos de producción"
            name="productionTimeText"
            requirement="required"
          >
            <textarea
              className="textarea"
              defaultValue={settings.production_time_text}
              rows={3}
            />
          </AdminField>
          <AdminField
            label="Cambios y devoluciones"
            name="changesReturnsPolicy"
            requirement="required"
          >
            <textarea
              className="textarea"
              defaultValue={settings.changes_returns_policy}
              rows={5}
            />
          </AdminField>
          <AdminField
            className="admin-form__checkout-toggle field"
            hint="Activá el checkout sólo cuando envíos, pagos y operación estén listos."
            label="Checkout habilitado"
            name="checkoutEnabled"
            requirement="optional"
          >
            <input
              checked={checkoutEnabled}
              onChange={(event) => {
                if (event.target.checked && !settings.checkout_enabled) {
                  setCheckoutConfirmationOpen(true);
                  return;
                }

                setCheckoutEnabled(event.target.checked);
              }}
              type="checkbox"
            />
          </AdminField>
        </section>
      </AdminActionForm>

      <Dialog
        open={checkoutConfirmationOpen}
        onOpenChange={setCheckoutConfirmationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Habilitar checkout</DialogTitle>
            <DialogDescription>
              Al guardar, la tienda podrá iniciar compras reales. Confirmá que
              envíos, pagos y operación estén listos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setCheckoutConfirmationOpen(false)}
              type="button"
              variant="ghost"
            >
              Volver
            </Button>
            <Button
              onClick={() => {
                setCheckoutEnabled(true);
                setCheckoutConfirmationOpen(false);
              }}
              type="button"
              variant="primary"
            >
              Sí, habilitar checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
