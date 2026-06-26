import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import {
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
