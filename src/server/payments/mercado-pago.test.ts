import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import {
  buildMercadoPagoPreferenceBody,
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
});
