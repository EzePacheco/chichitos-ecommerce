import { afterEach, describe, expect, it, vi } from "vitest";
import { calculateCheckoutDelivery } from "./checkout-shipping";
import { mergeStoreSettingsWithDefaults } from "@/server/settings/store-settings";

const settings = mergeStoreSettingsWithDefaults({
  store_address: "Taller 123, Buenos Aires",
  delivery_base_radius_km: 3,
  delivery_base_price_cents: 10000,
  delivery_extra_step_km: 1,
  delivery_extra_step_price_cents: 5000,
});

describe("calculateCheckoutDelivery", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not require Maps for pickup", async () => {
    await expect(
      calculateCheckoutDelivery({ method: "pickup", addressLine: "" }, settings),
    ).resolves.toEqual({ ok: true, distanceKm: null, totalCents: 0 });
  });

  it("blocks shipping when Maps config is missing", async () => {
    await expect(
      calculateCheckoutDelivery(
        { method: "shipping", addressLine: "Cliente 456" },
        settings,
      ),
    ).resolves.toMatchObject({
      ok: false,
      code: "shipping_unavailable",
    });
  });

  it("calculates shipping from Google distance", async () => {
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          status: "OK",
          rows: [{ elements: [{ distance: { value: 4500 } }] }],
        }),
      ),
    );

    await expect(
      calculateCheckoutDelivery(
        { method: "shipping", addressLine: "Cliente 456" },
        settings,
      ),
    ).resolves.toEqual({
      ok: true,
      distanceKm: 4.5,
      totalCents: 20000,
    });
  });
});
