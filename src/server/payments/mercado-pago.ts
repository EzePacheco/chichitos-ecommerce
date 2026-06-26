import { createHmac, timingSafeEqual } from "crypto";
import { getOptionalEnv, getRequiredEnv } from "@/server/config/env";

type PreferenceItem = {
  title: string;
  quantity: number;
  unitPriceCents: number;
};

export type MercadoPagoPayment = {
  id: number | string;
  status: string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id: string;
};

export function centsToPesos(cents: number) {
  return Math.round(cents) / 100;
}

export async function createMercadoPagoPreference(input: {
  orderId: string;
  publicCode: string;
  buyerEmail?: string | null;
  items: PreferenceItem[];
}) {
  const siteUrl = getRequiredEnv("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "");
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      authorization: `Bearer ${getRequiredEnv("MERCADO_PAGO_ACCESS_TOKEN")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      external_reference: input.orderId,
      notification_url: `${siteUrl}/api/mercado-pago/webhook?source_news=webhooks`,
      back_urls: {
        success: `${siteUrl}/checkout?payment=success&order=${input.publicCode}`,
        failure: `${siteUrl}/checkout?payment=failure&order=${input.publicCode}`,
        pending: `${siteUrl}/checkout?payment=pending&order=${input.publicCode}`,
      },
      auto_return: "approved",
      payer: input.buyerEmail ? { email: input.buyerEmail } : undefined,
      items: input.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        currency_id: "ARS",
        unit_price: centsToPesos(item.unitPriceCents),
      })),
    }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.id || !data?.init_point) {
    throw new Error("Mercado Pago no pudo crear la preferencia.");
  }

  return {
    id: String(data.id),
    initPoint: String(data.init_point),
  };
}

export async function getMercadoPagoPayment(paymentId: string) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: {
        authorization: `Bearer ${getRequiredEnv("MERCADO_PAGO_ACCESS_TOKEN")}`,
      },
    },
  );
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.id) {
    throw new Error("Mercado Pago no pudo devolver el pago.");
  }

  return data as MercadoPagoPayment;
}

function parseSignature(signature: string | null) {
  const parts = new Map(
    (signature ?? "")
      .split(",")
      .map((part) => part.split("=").map((value) => value.trim()) as [string, string]),
  );

  return {
    timestamp: parts.get("ts"),
    hash: parts.get("v1"),
  };
}

export function verifyMercadoPagoWebhookSignature(input: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
  secret?: string;
}) {
  const secret = input.secret ?? getOptionalEnv("MERCADO_PAGO_WEBHOOK_SECRET");
  const parsed = parseSignature(input.signature);

  if (!secret || !parsed.timestamp || !parsed.hash || !input.requestId || !input.dataId) {
    return false;
  }

  const manifest = `id:${input.dataId};request-id:${input.requestId};ts:${parsed.timestamp};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(parsed.hash, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function mapMercadoPagoPaymentStatus(status: string) {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  if (status === "cancelled") return "cancelled";
  if (status === "refunded") return "refunded";
  if (status === "pending" || status === "in_process") return "pending";
  return "unknown";
}

export function validateMercadoPagoPaymentForOrder(
  payment: MercadoPagoPayment,
  order: { id: string; total_cents: number; currency: string },
) {
  return (
    payment.external_reference === order.id &&
    payment.currency_id === order.currency &&
    Math.round(payment.transaction_amount * 100) === order.total_cents
  );
}

export function minimalMercadoPagoPaymentPayload(payment: MercadoPagoPayment) {
  return {
    id: String(payment.id),
    status: payment.status,
    external_reference: payment.external_reference,
    transaction_amount: payment.transaction_amount,
    currency_id: payment.currency_id,
  };
}
