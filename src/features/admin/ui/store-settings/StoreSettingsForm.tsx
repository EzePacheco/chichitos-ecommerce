"use client";

import { useState, type ReactNode } from "react";
import type { StoreSettingsRecord } from "@/server/settings/store-settings";
import { saveStoreSettingsAction } from "@/features/admin/server/actions";
import { AdminActionForm } from "@/features/admin/ui/AdminActionForm";
import { AdminCurrencyInput } from "@/features/admin/ui/AdminCurrencyInput";
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

type SettingsSectionProps = {
  children: ReactNode;
  className?: string;
  description: string;
  eyebrow: string;
  id: string;
  title: string;
};

function formatCentsForInput(cents: number) {
  return String(Math.round(cents / 100));
}

function SettingsSection({
  children,
  className,
  description,
  eyebrow,
  id,
  title,
}: SettingsSectionProps) {
  return (
    <section
      className={`card admin-form__section admin-settings__section${className ? ` ${className}` : ""}`}
      id={id}
    >
      <div className="admin-settings__section-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
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
        className="admin-form admin-settings-form"
        pendingLabel="Guardando cambios..."
        submitLabel="Guardar cambios"
      >
        <nav className="admin-settings__nav" aria-label="Secciones de configuración">
          <a href="#settings-store">Tienda</a>
          <a href="#settings-delivery">Envíos</a>
          <a href="#settings-production">Producción</a>
        </nav>

        <div className="admin-settings__grid">
        <SettingsSection
          description="Datos visibles y punto de origen para los envíos."
          eyebrow="Identidad y contacto"
          id="settings-store"
          title="Tienda"
        >
          <div className="field-grid">
            <AdminField
              label="Nombre público"
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
        </SettingsSection>

        <SettingsSection
          description="Definí la tarifa inicial y cómo aumenta con la distancia."
          eyebrow="Cobertura y precio"
          id="settings-delivery"
          title="Envíos"
        >
          <div className="field-grid">
            <AdminField
              hint="Kilómetros incluidos en la tarifa base."
              label="Cobertura incluida"
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
              hint="Monto cobrado dentro de la cobertura incluida."
              label="Tarifa base"
              name="deliveryBasePrice"
              requirement="required"
            >
              <AdminCurrencyInput
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
              hint="Cada cuántos kilómetros se suma otro tramo."
              label="Distancia por tramo adicional"
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
              hint="Usá 0 si no querés sumar costo por distancia."
              label="Precio por tramo adicional"
              name="deliveryExtraStepPrice"
              requirement="optional"
            >
              <AdminCurrencyInput
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
        </SettingsSection>

        <SettingsSection
          className="admin-settings__production-section"
          description="Costos, tiempos y políticas que necesita conocer la clienta."
          eyebrow="Promesa de compra"
          id="settings-production"
          title="Producción y venta"
        >
          <div className="admin-settings__production-grid">
            <AdminField
              hint="Monto predeterminado; cada producto puede definir otro."
              label="Extra de personalización"
              name="defaultPersonalizationExtraPrice"
              requirement="optional"
            >
              <AdminCurrencyInput
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
              hint="Ejemplo: 5 a 7 días hábiles."
              label="Tiempo estimado"
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
              className="field admin-settings__policy"
              hint="Explicá plazos, condiciones y excepciones de forma simple."
              label="Cambios y devoluciones"
              name="changesReturnsPolicy"
              requirement="required"
            >
              <textarea
                className="textarea"
                defaultValue={settings.changes_returns_policy}
                rows={4}
              />
            </AdminField>
          </div>
          <div className="admin-settings__checkout">
            <div>
              <strong>Checkout de la tienda</strong>
              <p>
                {checkoutEnabled
                  ? "Las clientas pueden iniciar compras."
                  : "La tienda muestra el catálogo, pero no permite comprar."}
              </p>
            </div>
            <label className="admin-switch">
              <span>{checkoutEnabled ? "Habilitado" : "Deshabilitado"}</span>
            <input
              aria-label="Habilitar checkout de la tienda"
              checked={checkoutEnabled}
              name="checkoutEnabled"
              onChange={(event) => {
                if (event.target.checked && !settings.checkout_enabled) {
                  setCheckoutConfirmationOpen(true);
                  return;
                }

                setCheckoutEnabled(event.target.checked);
              }}
              role="switch"
              type="checkbox"
            />
              <span aria-hidden="true" className="admin-switch__track" />
            </label>
          </div>
        </SettingsSection>
        </div>
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
