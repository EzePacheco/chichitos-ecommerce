import { createHmac } from "crypto";
import { describe, expect, it, vi } from "vitest";
import {
  buildMercadoPagoPreferenceBody,
  createMercadoPagoPreference,
  mapMercadoPagoPaymentStatus,
  minimalMercadoPagoPaymentPayload,
  validateMercadoPagoPaymentForOrder,
  verifyMercadoPagoWebhookSignature,
} from "./mercado-pago";

describe("Mercado Pago helpers", () => {
  it("validates webhook signatures with the official manifest shape", () => {
    const secret = "secret";
    const manifest = "id:123;request-id:req-1;ts:1700000000;";
    const hash = createHmac("sha256", secret).update(manifest).digest("hex");

    expect(
      verifyMercadoPagoWebhookSignature({
        signature: `ts=1700000000,v1=${hash}`,
        requestId: "req-1",
        dataId: "123",
        secret,
        nowMs: 1700000000 * 1000,
      }),
    ).toBe(true);
  });

  it("rejects invalid webhook signatures", () => {
    expect(
      verifyMercadoPagoWebhookSignature({
        signature: "ts=1700000000,v1=00",
        requestId: "req-1",
        dataId: "123",
        secret: "secret",
        nowMs: 1700000000 * 1000,
      }),
    ).toBe(false);
  });

  it("rejects valid signatures outside the replay window", () => {
    const secret = "secret";
    const manifest = "id:123;request-id:req-1;ts:1700000000;";
    const hash = createHmac("sha256", secret).update(manifest).digest("hex");

    expect(
      verifyMercadoPagoWebhookSignature({
        signature: `ts=1700000000,v1=${hash}`,
        requestId: "req-1",
        dataId: "123",
        secret,
        nowMs: 1700000000 * 1000 + 11 * 60 * 1000,
      }),
    ).toBe(false);
  });

  it("maps provider statuses to local statuses", () => {
    expect(mapMercadoPagoPaymentStatus("approved")).toBe("approved");
    expect(mapMercadoPagoPaymentStatus("in_process")).toBe("pending");
    expect(mapMercadoPagoPaymentStatus("something-new")).toBe("unknown");
  });

  it("omits callback URLs for local sandbox preferences", () => {
    const body = buildMercadoPagoPreferenceBody(
      {
        orderId: "order-1",
        publicCode: "CHI-1",
        items: [{ title: "Remera", quantity: 1, unitPriceCents: 100000 }],
      },
      "http://localhost:3000",
    );

    expect(body).not.toHaveProperty("notification_url");
    expect(body).not.toHaveProperty("back_urls");
    expect(body).not.toHaveProperty("auto_return");
  });

  it("adds callback URLs for public HTTPS preferences", () => {
    const body = buildMercadoPagoPreferenceBody(
      {
        orderId: "order-1",
        publicCode: "CHI-1",
        items: [{ title: "Remera", quantity: 1, unitPriceCents: 100000 }],
      },
      "https://tienda.example.com",
    );

    expect(body).toMatchObject({
      notification_url:
        "https://tienda.example.com/api/mercado-pago/webhook?source_news=webhooks",
      auto_return: "approved",
    });
  });

  it("requires external reference, amount and currency to match the local order", () => {
    const payment = {
      id: 123,
      status: "approved",
      external_reference: "order-1",
      transaction_amount: 10.5,
      currency_id: "ARS",
    };

    expect(
      validateMercadoPagoPaymentForOrder(payment, {
        id: "order-1",
        total_cents: 1050,
        currency: "ARS",
      }),
    ).toBe(true);
    expect(
      validateMercadoPagoPaymentForOrder(payment, {
        id: "order-1",
        total_cents: 1051,
        currency: "ARS",
      }),
    ).toBe(false);
  });

  it("keeps only reconciliation fields from provider payloads", () => {
    expect(
      minimalMercadoPagoPaymentPayload({
        id: 123,
        status: "approved",
        external_reference: "order-1",
        transaction_amount: 10.5,
        currency_id: "ARS",
      }),
    ).toEqual({
      id: "123",
      status: "approved",
      external_reference: "order-1",
      transaction_amount: 10.5,
      currency_id: "ARS",
    });
  });

  it("sends a stable idempotency key when creating preferences", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://tienda.example.com");
    vi.stubEnv("MERCADO_PAGO_ACCESS_TOKEN", "token");
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        id: "pref-1",
        init_point: "https://mercadopago.example/init",
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createMercadoPagoPreference({
        orderId: "11111111-1111-4111-8111-111111111111",
        publicCode: "CHI-1",
        items: [{ title: "Remera", quantity: 1, unitPriceCents: 100000 }],
      }),
    ).resolves.toEqual({
      id: "pref-1",
      initPoint: "https://mercadopago.example/init",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.mercadopago.com/checkout/preferences",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Idempotency-Key": "pref-11111111-1111-4111-8111-111111111111",
        }),
      }),
    );
  });
});
