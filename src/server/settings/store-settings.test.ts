import { describe, expect, it } from "vitest";
import {
  formatCentsForAdminInput,
  formatDecimalForAdminInput,
  getMissingStoreSettingsFields,
  isStoreSettingsOnboardingComplete,
  mergeStoreSettingsWithDefaults,
  parseMoneyToCents,
  parseStoreSettingsInput,
} from "./store-settings";

const baseInput = {
  storeName: "Chichitos",
  whatsappNumber: "+54 9 11 1234-5678",
  storeAddress: "Av. Corrientes 1234",
  deliveryBaseRadiusKm: "3",
  deliveryBasePrice: "2.500",
  deliveryExtraStepKm: "0,5",
  deliveryExtraStepPrice: "400",
  changesReturnsPolicy: "Cambios dentro de los 15 dias.",
  productionTimeText: "3 a 5 dias habiles.",
  defaultPersonalizationExtraPrice: "1.500",
  checkoutEnabled: "on",
};

describe("store settings rules", () => {
  it("normalizes admin form input for persistence", () => {
    const result = parseStoreSettingsInput(baseInput);

    expect(result.ok).toBe(true);

    if (!result.ok) return;

    expect(result.settings).toMatchObject({
      id: true,
      store_name: "Chichitos",
      whatsapp_number: "5491112345678",
      store_address: "Av. Corrientes 1234",
      delivery_base_radius_km: 3,
      delivery_base_price_cents: 250000,
      delivery_extra_step_km: 0.5,
      delivery_extra_step_price_cents: 40000,
      default_personalization_extra_price_cents: 150000,
      checkout_enabled: true,
    });
  });

  it("rejects invalid WhatsApp and distance values", () => {
    const result = parseStoreSettingsInput({
      ...baseInput,
      whatsappNumber: "123",
      deliveryBaseRadiusKm: "0",
    });

    expect(result).toEqual({
      ok: false,
      errors: [
        "WhatsApp debe tener al menos 8 digitos.",
        "El radio base de envio debe ser mayor a cero.",
      ],
    });
  });

  it("parses pesos to cents with Argentinian separators", () => {
    expect(parseMoneyToCents("12.345,50", "Importe")).toEqual({
      value: 1234550,
      error: null,
    });
    expect(parseMoneyToCents("", "Importe")).toEqual({
      value: 0,
      error: null,
    });
  });

  it("detects incomplete onboarding fields", () => {
    const settings = mergeStoreSettingsWithDefaults({
      delivery_base_price_cents: 0,
      production_time_text: "",
      changes_returns_policy: "",
    });

    expect(isStoreSettingsOnboardingComplete(settings)).toBe(false);
    expect(getMissingStoreSettingsFields(settings)).toEqual([
      "WhatsApp",
      "direccion del taller",
      "tarifa base de envio",
      "tiempos de produccion",
      "politica de cambios",
    ]);
  });

  it("formats values for admin inputs", () => {
    expect(formatCentsForAdminInput(250000)).toBe("2500");
    expect(formatDecimalForAdminInput(0.5)).toBe("0.5");
    expect(formatDecimalForAdminInput(3)).toBe("3");
  });
});
