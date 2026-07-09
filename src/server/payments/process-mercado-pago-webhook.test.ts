import { describe, expect, it, vi } from "vitest";
import { processMercadoPagoWebhook } from "./process-mercado-pago-webhook";
import type { MercadoPagoPayment } from "./mercado-pago";

function createSupabaseMock(options?: {
  claim?: {
    should_process: boolean;
    duplicate_processed: boolean;
    processing_in_progress: boolean;
  };
  order?: { id: string; total_cents: number; currency: string } | null;
  orderError?: { message: string } | null;
}) {
  const rpc = vi.fn((name: string) => {
    if (name === "claim_payment_webhook_event") {
      return {
        single: async () => ({
          data:
            options?.claim ?? {
              should_process: true,
              duplicate_processed: false,
              processing_in_progress: false,
            },
          error: null,
        }),
      };
    }

    return Promise.resolve({ data: null, error: null });
  });
  const maybeSingle = vi.fn(async () => ({
    data: options?.order ?? { id: "order-1", total_cents: 1050, currency: "ARS" },
    error: options?.orderError ?? null,
  }));

  return {
    rpc,
    from: vi.fn(() => ({
      select() {
        return this;
      },
      eq() {
        return this;
      },
      maybeSingle,
    })),
    maybeSingle,
  };
}

const validPayment: MercadoPagoPayment = {
  id: 123,
  status: "approved",
  external_reference: "order-1",
  transaction_amount: 10.5,
  currency_id: "ARS",
};

describe("processMercadoPagoWebhook", () => {
  it("rejects invalid signatures before touching the database", async () => {
    const supabase = createSupabaseMock();

    await expect(
      processMercadoPagoWebhook(
        {
          payload: { id: "evt-1", type: "payment", data: { id: "123" } },
          dataId: "123",
          requestId: "req-1",
          signature: "invalid",
        },
        {
          supabase: supabase as never,
          verifySignature: () => false,
        },
      ),
    ).resolves.toEqual({ ok: false, status: 401 });

    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("returns duplicate without refetching Mercado Pago when the event is processed", async () => {
    const supabase = createSupabaseMock({
      claim: {
        should_process: false,
        duplicate_processed: true,
        processing_in_progress: false,
      },
    });
    const getPayment = vi.fn();

    await expect(
      processMercadoPagoWebhook(
        {
          payload: { id: "evt-1", type: "payment", data: { id: "123" } },
          dataId: "123",
          requestId: "req-1",
          signature: "valid",
        },
        {
          supabase: supabase as never,
          getPayment,
          verifySignature: () => true,
        },
      ),
    ).resolves.toMatchObject({ ok: true, body: { duplicate: true } });

    expect(getPayment).not.toHaveBeenCalled();
  });

  it("uses the delivery request id when Mercado Pago does not send an event id", async () => {
    const supabase = createSupabaseMock({
      claim: {
        should_process: false,
        duplicate_processed: false,
        processing_in_progress: true,
      },
    });

    await expect(
      processMercadoPagoWebhook(
        {
          payload: { type: "payment", data: { id: "123" } },
          dataId: "123",
          requestId: "req-1",
          signature: "valid",
        },
        {
          supabase: supabase as never,
          verifySignature: () => true,
        },
      ),
    ).resolves.toEqual({ ok: false, status: 500 });

    expect(supabase.rpc).toHaveBeenCalledWith(
      "claim_payment_webhook_event",
      expect.objectContaining({
        webhook_external_event_id: "payment:123:req-1",
      }),
    );
  });


  it("applies a validated payment through the transactional RPC", async () => {
    const supabase = createSupabaseMock();

    await expect(
      processMercadoPagoWebhook(
        {
          payload: { id: "evt-1", type: "payment", data: { id: "123" } },
          dataId: "123",
          requestId: "req-1",
          signature: "valid",
        },
        {
          supabase: supabase as never,
          getPayment: async () => validPayment,
          verifySignature: () => true,
        },
      ),
    ).resolves.toMatchObject({ ok: true, body: { ok: true } });

    expect(supabase.rpc).toHaveBeenCalledWith(
      "apply_mercado_pago_payment_webhook",
      expect.objectContaining({
        webhook_external_event_id: "payment:evt-1:req-1",
        target_order_id: "order-1",
        mp_provider_payment_id: "123",
        mp_provider_payment_status: "approved",
        mp_local_payment_status: "approved",
      }),
    );
  });

  it("ignores mismatched amount without mutating payment state", async () => {
    const supabase = createSupabaseMock({
      order: { id: "order-1", total_cents: 999, currency: "ARS" },
    });

    await expect(
      processMercadoPagoWebhook(
        {
          payload: { id: "evt-1", type: "payment", data: { id: "123" } },
          dataId: "123",
          requestId: "req-1",
          signature: "valid",
        },
        {
          supabase: supabase as never,
          getPayment: async () => validPayment,
          verifySignature: () => true,
        },
      ),
    ).resolves.toMatchObject({ ok: true, body: { ignored: true } });

    expect(supabase.rpc).toHaveBeenCalledWith("mark_payment_webhook_event_ignored", {
      webhook_external_event_id: "payment:evt-1:req-1",
    });
    expect(supabase.rpc).not.toHaveBeenCalledWith(
      "apply_mercado_pago_payment_webhook",
      expect.anything(),
    );
  });
});
