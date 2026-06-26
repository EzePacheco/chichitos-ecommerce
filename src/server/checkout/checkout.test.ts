import { describe, expect, it } from "vitest";
import { createCheckout } from "./checkout";

function fakeSupabaseWithSettings(checkoutEnabled: boolean) {
  return {
    from(table: string) {
      if (table !== "store_settings") throw new Error(`unexpected table ${table}`);

      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        async maybeSingle() {
          return {
            data: {
              id: true,
              store_name: "Chichitos",
              delivery_base_radius_km: 3,
              delivery_base_price_cents: 10000,
              delivery_extra_step_km: 0.5,
              delivery_extra_step_price_cents: 5000,
              changes_returns_policy: "Cambios",
              production_time_text: "3 dias",
              checkout_enabled: checkoutEnabled,
            },
            error: null,
          };
        },
      };
    },
  };
}

describe("createCheckout validation", () => {
  it("blocks checkout when settings disable it", async () => {
    await expect(
      createCheckout({}, "idem-12345", fakeSupabaseWithSettings(false) as never),
    ).resolves.toMatchObject({
      ok: false,
      code: "checkout_disabled",
    });
  });

  it("requires buyer name and phone before touching products", async () => {
    await expect(
      createCheckout(
        { items: [{ productSlug: "x" }] },
        "idem-12345",
        fakeSupabaseWithSettings(true) as never,
      ),
    ).resolves.toMatchObject({
      ok: false,
      code: "invalid_buyer",
    });
  });

  it("requires idempotency before touching settings", async () => {
    await expect(createCheckout({}, "", {} as never)).resolves.toMatchObject({
      ok: false,
      code: "missing_idempotency_key",
    });
  });
});
