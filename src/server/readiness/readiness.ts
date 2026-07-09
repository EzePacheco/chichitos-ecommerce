import { getOptionalEnv } from "@/platform/config/env";
import { isProductionRuntime } from "@/platform/config/runtime";
import { getSupabaseElevatedKey } from "@/platform/supabase/admin";
import { getStoreSettings } from "@/server/settings/store-settings";

const EXAMPLE_SUPABASE_URL = "https://example.supabase.co";

function hasRealValue(name: string) {
  const value = getOptionalEnv(name);

  return Boolean(value && !value.startsWith("replace-with"));
}

export function hasRealSupabaseConfig() {
  const url = getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = getOptionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  return Boolean(
    url &&
      key &&
      url !== EXAMPLE_SUPABASE_URL &&
      !key.startsWith("replace-with") &&
      getSupabaseElevatedKey(),
  );
}

export async function getReadiness() {
  const checks: Record<string, boolean> = {
    siteUrl: hasRealValue("NEXT_PUBLIC_SITE_URL"),
    supabase: hasRealSupabaseConfig(),
    mercadoPago: hasRealValue("MERCADO_PAGO_ACCESS_TOKEN"),
    mercadoPagoWebhook: hasRealValue("MERCADO_PAGO_WEBHOOK_SECRET"),
  };
  let checkoutEnabled = false;

  if (checks.supabase) {
    try {
      const settings = await getStoreSettings();
      checkoutEnabled = settings.checkout_enabled;

      if (settings.checkout_enabled) {
        checks.storeAddress = Boolean(settings.store_address?.trim());
        checks.googleMaps = hasRealValue("GOOGLE_MAPS_API_KEY");
      }
    } catch {
      checks.supabase = false;
    }
  }

  const required = isProductionRuntime() || checkoutEnabled;
  const ready = required ? Object.values(checks).every(Boolean) : true;

  return {
    ready,
    mode: isProductionRuntime() ? "production" : "non-production",
    checkoutEnabled,
    checks,
  };
}
