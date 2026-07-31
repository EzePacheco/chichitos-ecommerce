import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeWhatsAppPhoneNumber } from "@/shared/contact/whatsapp";
import type { ValidationIssue } from "@/shared/validation/validation-issue";
import {
  createAdminSupabaseClient,
  isAdminSupabaseConfigured,
} from "@/platform/supabase/admin";

export type StoreSettingsRecord = {
  id: boolean;
  store_name: string;
  whatsapp_number: string | null;
  store_address: string | null;
  store_latitude: number | null;
  store_longitude: number | null;
  delivery_base_radius_km: number;
  delivery_base_price_cents: number;
  delivery_extra_step_km: number;
  delivery_extra_step_price_cents: number;
  changes_returns_policy: string;
  production_time_text: string;
  default_personalization_extra_price_cents: number;
  checkout_enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

export type StoreSettingsFormInput = {
  storeName: FormDataEntryValue | null;
  whatsappNumber: FormDataEntryValue | null;
  storeAddress: FormDataEntryValue | null;
  deliveryBaseRadiusKm: FormDataEntryValue | null;
  deliveryBasePrice: FormDataEntryValue | null;
  deliveryExtraStepKm: FormDataEntryValue | null;
  deliveryExtraStepPrice: FormDataEntryValue | null;
  changesReturnsPolicy: FormDataEntryValue | null;
  productionTimeText: FormDataEntryValue | null;
  defaultPersonalizationExtraPrice: FormDataEntryValue | null;
  checkoutEnabled: FormDataEntryValue | null;
};

export type StoreSettingsValidationResult =
  | { ok: true; settings: StoreSettingsRecord }
  | { ok: false; errors: ValidationIssue[] };

const DEFAULT_STORE_SETTINGS: StoreSettingsRecord = {
  id: true,
  store_name: "Chichitos",
  whatsapp_number: null,
  store_address: null,
  store_latitude: null,
  store_longitude: null,
  delivery_base_radius_km: 3,
  delivery_base_price_cents: 0,
  delivery_extra_step_km: 0.5,
  delivery_extra_step_price_cents: 0,
  changes_returns_policy: "",
  production_time_text: "",
  default_personalization_extra_price_cents: 0,
  checkout_enabled: false,
};

export function getDefaultStoreSettings() {
  return { ...DEFAULT_STORE_SETTINGS };
}

function textValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableTextValue(value: FormDataEntryValue | null) {
  const text = textValue(value);
  return text.length > 0 ? text : null;
}

function parsePositiveDecimal(
  value: FormDataEntryValue | null,
  fieldLabel: string,
) {
  const raw = textValue(value).replace(",", ".");
  const number = Number(raw);

  if (!Number.isFinite(number) || number <= 0) {
    return { value: null, error: `${fieldLabel} debe ser mayor a cero.` };
  }

  return { value: number, error: null };
}

export function parseMoneyToCents(
  value: FormDataEntryValue | null,
  fieldLabel: string,
) {
  const raw = textValue(value);

  if (!raw) {
    return { value: 0, error: null };
  }

  const normalized = raw
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const number = Number(normalized);

  if (!Number.isFinite(number) || number < 0) {
    return { value: null, error: `${fieldLabel} debe ser un importe valido.` };
  }

  return { value: Math.round(number * 100), error: null };
}

export function parseStoreSettingsInput(
  input: StoreSettingsFormInput,
): StoreSettingsValidationResult {
  const errors: ValidationIssue[] = [];
  const storeName = textValue(input.storeName) || "Chichitos";
  const rawWhatsappNumber = textValue(input.whatsappNumber);
  const whatsappNumber = rawWhatsappNumber
    ? (sanitizeWhatsAppPhoneNumber(rawWhatsappNumber) ?? null)
    : null;

  if (rawWhatsappNumber && !whatsappNumber) {
    errors.push({
      field: "whatsappNumber",
      message: "Ingresá un WhatsApp válido con código de área.",
    });
  }

  const deliveryBaseRadius = parsePositiveDecimal(
    input.deliveryBaseRadiusKm,
    "El radio base de envio",
  );
  const deliveryExtraStepKm = parsePositiveDecimal(
    input.deliveryExtraStepKm,
    "El tramo adicional de envio",
  );
  const deliveryBasePrice = parseMoneyToCents(
    input.deliveryBasePrice,
    "La tarifa base de envio",
  );
  const deliveryExtraStepPrice = parseMoneyToCents(
    input.deliveryExtraStepPrice,
    "La tarifa por tramo adicional",
  );
  const defaultPersonalizationExtraPrice = parseMoneyToCents(
    input.defaultPersonalizationExtraPrice,
    "El costo de personalizacion",
  );

  const numericResults = [
    ["deliveryBaseRadiusKm", deliveryBaseRadius],
    ["deliveryExtraStepKm", deliveryExtraStepKm],
    ["deliveryBasePrice", deliveryBasePrice],
    ["deliveryExtraStepPrice", deliveryExtraStepPrice],
    ["defaultPersonalizationExtraPrice", defaultPersonalizationExtraPrice],
  ] as const;

  for (const [field, result] of numericResults) {
    if (result.error) {
      errors.push({ field, message: result.error });
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    settings: {
      id: true,
      store_name: storeName,
      whatsapp_number: whatsappNumber,
      store_address: nullableTextValue(input.storeAddress),
      store_latitude: null,
      store_longitude: null,
      delivery_base_radius_km: deliveryBaseRadius.value ?? 3,
      delivery_base_price_cents: deliveryBasePrice.value ?? 0,
      delivery_extra_step_km: deliveryExtraStepKm.value ?? 0.5,
      delivery_extra_step_price_cents: deliveryExtraStepPrice.value ?? 0,
      changes_returns_policy: textValue(input.changesReturnsPolicy),
      production_time_text: textValue(input.productionTimeText),
      default_personalization_extra_price_cents:
        defaultPersonalizationExtraPrice.value ?? 0,
      checkout_enabled: input.checkoutEnabled === "on",
    },
  };
}

export function getStoreSettingsFormInput(
  formData: FormData,
): StoreSettingsFormInput {
  return {
    storeName: formData.get("storeName"),
    whatsappNumber: formData.get("whatsappNumber"),
    storeAddress: formData.get("storeAddress"),
    deliveryBaseRadiusKm: formData.get("deliveryBaseRadiusKm"),
    deliveryBasePrice: formData.get("deliveryBasePrice"),
    deliveryExtraStepKm: formData.get("deliveryExtraStepKm"),
    deliveryExtraStepPrice: formData.get("deliveryExtraStepPrice"),
    changesReturnsPolicy: formData.get("changesReturnsPolicy"),
    productionTimeText: formData.get("productionTimeText"),
    defaultPersonalizationExtraPrice: formData.get(
      "defaultPersonalizationExtraPrice",
    ),
    checkoutEnabled: formData.get("checkoutEnabled"),
  };
}

export function mergeStoreSettingsWithDefaults(
  settings?: Partial<StoreSettingsRecord> | null,
): StoreSettingsRecord {
  return { ...DEFAULT_STORE_SETTINGS, ...settings, id: true };
}

export function isStoreSettingsOnboardingComplete(
  settings: StoreSettingsRecord,
) {
  return Boolean(
    settings.store_name.trim() &&
    settings.whatsapp_number &&
    settings.store_address?.trim() &&
    settings.delivery_base_radius_km > 0 &&
    settings.delivery_base_price_cents > 0 &&
    settings.delivery_extra_step_km > 0 &&
    settings.production_time_text.trim() &&
    settings.changes_returns_policy.trim(),
  );
}

export function getMissingStoreSettingsFields(settings: StoreSettingsRecord) {
  const missing: string[] = [];

  if (!settings.store_name.trim()) missing.push("nombre de tienda");
  if (!settings.whatsapp_number) missing.push("WhatsApp");
  if (!settings.store_address?.trim()) missing.push("direccion del taller");
  if (settings.delivery_base_price_cents <= 0)
    missing.push("tarifa base de envio");
  if (!settings.production_time_text.trim())
    missing.push("tiempos de produccion");
  if (!settings.changes_returns_policy.trim())
    missing.push("politica de cambios");

  return missing;
}

export function formatCentsForAdminInput(cents: number) {
  return String(Math.round(cents / 100));
}

export function formatDecimalForAdminInput(value: number) {
  return String(value);
}

export async function getStoreSettings(
  supabase?: SupabaseClient,
) {
  if (!supabase && !isAdminSupabaseConfigured()) {
    return mergeStoreSettingsWithDefaults(null);
  }

  const client = supabase ?? createAdminSupabaseClient();
  const { data, error } = await client
    .from("store_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle<StoreSettingsRecord>();

  if (error) {
    throw new Error(`No pudimos leer store_settings: ${error.message}`);
  }

  return mergeStoreSettingsWithDefaults(data);
}

export async function upsertStoreSettings(
  settings: StoreSettingsRecord,
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  const { data, error } = await supabase
    .from("store_settings")
    .upsert(settings, { onConflict: "id" })
    .select("*")
    .single<StoreSettingsRecord>();

  if (error) {
    throw new Error(`No pudimos guardar store_settings: ${error.message}`);
  }

  return mergeStoreSettingsWithDefaults(data);
}
