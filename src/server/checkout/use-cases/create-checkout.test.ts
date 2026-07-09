import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCheckout } from "./create-checkout";
import { createMercadoPagoPreference } from "@/server/payments/mercado-pago";

vi.mock("@/server/payments/mercado-pago", () => ({
  createMercadoPagoPreference: vi.fn(async () => ({
    id: "pref-1",
    initPoint: "https://mercadopago.example/init",
  })),
}));

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

function fakeSupabaseForCheckout(options?: {
  preferenceClaim?: {
    claimed: boolean;
    in_progress: boolean;
    provider_preference_init_point: string | null;
  };
}) {
  const settings = fakeSupabaseWithSettings(true).from("store_settings");
  const product = {
    id: "product-1",
    slug: "remera",
    name: "Remera",
    base_price_cents: 100000,
    product_sizes: [{ code: "2", label: "Talle 2" }],
    product_colors: [{ code: "natural", name: "Natural" }],
    product_designs: [
      {
        extra_price_cents: 10000,
        designs: { id: "design-1", slug: "bosque", name: "Bosque" },
      },
    ],
    product_personalization_options: [],
  };
  const rpc = vi.fn((name: string) => {
    if (name === "create_checkout_local") {
      return {
        single: async () => ({
          data: {
            order_id: "order-1",
            public_code: "CHI-2026-ABC",
            payment_id: "payment-1",
            provider_preference_id: null,
            provider_preference_init_point: null,
          },
          error: null,
        }),
      };
    }

    if (name === "claim_mercado_pago_preference_creation") {
      return {
        single: async () => ({
          data:
            options?.preferenceClaim ?? {
              claimed: true,
              in_progress: false,
              provider_preference_init_point: null,
            },
          error: null,
        }),
      };
    }

    if (name === "complete_mercado_pago_preference_creation") {
      return {
        single: async () => ({
          data: {
            provider_preference_init_point: "https://mercadopago.example/init",
          },
          error: null,
        }),
      };
    }

    throw new Error(`unexpected rpc ${name}`);
  });

  return {
    rpc,
    from(table: string) {
      if (table === "store_settings") return settings;
      if (table === "products") {
        return {
          select() {
            return this;
          },
          eq() {
            return this;
          },
          async maybeSingle() {
            return { data: product, error: null };
          },
        };
      }
      if (table === "orders") {
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
                buyer_email: "persisted@example.com",
                order_items: [
                  {
                    product_name_snapshot: "Remera persistida",
                    quantity: 1,
                    unit_price_cents: 110000,
                    personalization_price_cents: 0,
                  },
                ],
              },
              error: null,
            };
          },
        };
      }
      throw new Error(`unexpected table ${table}`);
    },
  };
}

describe("createCheckout validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("claims and completes one Mercado Pago preference for a local checkout", async () => {
    const supabase = fakeSupabaseForCheckout();

    await expect(
      createCheckout(
        {
          buyer: { name: "Ada", phone: "11 5555-5555", email: "ada@example.com" },
          delivery: { method: "retiro" },
          items: [
            {
              productSlug: "remera",
              quantity: 1,
              sizeId: "2",
              colorId: "natural",
              designId: "bosque",
            },
          ],
        },
        "idem-12345",
        supabase as never,
      ),
    ).resolves.toMatchObject({
      ok: true,
      redirectUrl: "https://mercadopago.example/init",
    });

    expect(supabase.rpc).toHaveBeenCalledWith(
      "claim_mercado_pago_preference_creation",
      { target_payment_id: "payment-1" },
    );
    expect(supabase.rpc).toHaveBeenCalledWith(
      "complete_mercado_pago_preference_creation",
      expect.objectContaining({ target_payment_id: "payment-1" }),
    );
    expect(createMercadoPagoPreference).toHaveBeenCalledTimes(1);
    expect(createMercadoPagoPreference).toHaveBeenCalledWith(
      expect.objectContaining({
        buyerEmail: "persisted@example.com",
        items: [
          {
            title: "Remera persistida",
            quantity: 1,
            unitPriceCents: 110000,
          },
        ],
      }),
    );
  });

  it("does not create another provider preference while one is in progress", async () => {
    const supabase = fakeSupabaseForCheckout({
      preferenceClaim: {
        claimed: false,
        in_progress: true,
        provider_preference_init_point: null,
      },
    });

    await expect(
      createCheckout(
        {
          buyer: { name: "Ada", phone: "11 5555-5555" },
          delivery: { method: "retiro" },
          items: [
            {
              productSlug: "remera",
              quantity: 1,
              sizeId: "2",
              colorId: "natural",
              designId: "bosque",
            },
          ],
        },
        "idem-12345",
        supabase as never,
      ),
    ).resolves.toMatchObject({
      ok: false,
      code: "checkout_in_progress",
    });

    expect(createMercadoPagoPreference).not.toHaveBeenCalled();
  });
});
