import { getOptionalEnv } from "@/platform/config/env";
import { calculateShippingCost } from "./calculate-shipping-cost";
import type { StoreSettingsRecord } from "@/server/settings/store-settings";

export type CheckoutDeliveryInput = {
  method: "pickup" | "shipping";
  addressLine: string;
  city?: string;
  postalCode?: string;
};

export type CheckoutDeliveryResult =
  | {
      ok: true;
      distanceKm: number | null;
      totalCents: number;
    }
  | {
      ok: false;
      status: number;
      code: string;
      title: string;
    };

function destination(input: CheckoutDeliveryInput) {
  return [input.addressLine, input.city, input.postalCode, "Argentina"]
    .filter(Boolean)
    .join(", ");
}

export async function calculateCheckoutDelivery(
  input: CheckoutDeliveryInput,
  settings: StoreSettingsRecord,
): Promise<CheckoutDeliveryResult> {
  if (input.method === "pickup") {
    return { ok: true, distanceKm: null, totalCents: 0 };
  }

  if (!input.addressLine) {
    return {
      ok: false,
      status: 400,
      code: "invalid_delivery",
      title: "Completá la dirección de envío.",
    };
  }

  const key = getOptionalEnv("GOOGLE_MAPS_API_KEY");
  const origin = settings.store_address?.trim();

  if (!key || !origin) {
    return {
      ok: false,
      status: 503,
      code: "shipping_unavailable",
      title: "El envío a domicilio todavía no está configurado.",
    };
  }

  const params = new URLSearchParams({
    origins: origin,
    destinations: destination(input),
    mode: "driving",
    units: "metric",
    key,
  });
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`,
    { cache: "no-store" },
  );
  const data = await response.json().catch(() => null);
  const meters = data?.rows?.[0]?.elements?.[0]?.distance?.value;

  if (!response.ok || data?.status !== "OK" || !Number.isFinite(meters)) {
    return {
      ok: false,
      status: 503,
      code: "shipping_unavailable",
      title: "No pudimos calcular el envío para esa dirección.",
    };
  }

  const distanceKm = meters / 1000;

  return {
    ok: true,
    distanceKm,
    totalCents: calculateShippingCost({
      distanceKm,
      baseRadiusKm: settings.delivery_base_radius_km,
      basePriceCents: settings.delivery_base_price_cents,
      extraStepKm: settings.delivery_extra_step_km,
      extraStepPriceCents: settings.delivery_extra_step_price_cents,
    }).totalCents,
  };
}
