import { createHmac, timingSafeEqual } from "crypto";
import { getOptionalEnv, getRequiredEnv } from "@/platform/config/env";

type PreferenceItem = {
  title: string;
  quantity: number;
  unitPriceCents: number;
};
type MercadoPagoPreferenceInput = {
  orderId: string;
  publicCode: string;
  buyerEmail?: string | null;
  items: PreferenceItem[];
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

export function buildMercadoPagoPreferenceBody(
  input: MercadoPagoPreferenceInput,
  siteUrl: string,
) {
  const publicHttps = siteUrl.startsWith("https://");
  const body: Record<string, unknown> = {
    external_reference: input.orderId,
    payer: input.buyerEmail ? { email: input.buyerEmail } : undefined,
    items: input.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      currency_id: "ARS",
      unit_price: centsToPesos(item.unitPriceCents),
    })),
  };

  if (publicHttps) {
    body.notification_url = `${siteUrl}/api/mercado-pago/webhook?source_news=webhooks`;
    body.back_urls = {
      success: `${siteUrl}/checkout?payment=success&order=${input.publicCode}`,
      failure: `${siteUrl}/checkout?payment=failure&order=${input.publicCode}`,
      pending: `${siteUrl}/checkout?payment=pending&order=${input.publicCode}`,
    };
    body.auto_return = "approved";
  }

  return body;
}

export async function createMercadoPagoPreference(input: MercadoPagoPreferenceInput) {
  const siteUrl = getRequiredEnv("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "");
  const idempotencyKey = `pref-${input.orderId}`;
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      authorization: `Bearer ${getRequiredEnv("MERCADO_PAGO_ACCESS_TOKEN")}`,
      "content-type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(buildMercadoPagoPreferenceBody(input, siteUrl)),
  });
  const data = await response.json().catch(() => null);
  const initPoint = data?.sandbox_init_point ?? data?.init_point;

  if (!response.ok || !data?.id || !initPoint) {
    throw new Error("Mercado Pago no pudo crear la preferencia.");
  }

  return {
    id: String(data.id),
    initPoint: String(initPoint),
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
  nowMs?: number;
  maxAgeMs?: number;
}) {
  const secret = input.secret ?? getOptionalEnv("MERCADO_PAGO_WEBHOOK_SECRET");
  const parsed = parseSignature(input.signature);

  if (!secret || !parsed.timestamp || !parsed.hash || !input.requestId || !input.dataId) {
    return false;
  }

  const timestamp = Number(parsed.timestamp);
  const timestampMs = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000;
  const nowMs = input.nowMs ?? Date.now();
  const maxAgeMs = input.maxAgeMs ?? 10 * 60 * 1000;

  if (!Number.isFinite(timestampMs) || Math.abs(nowMs - timestampMs) > maxAgeMs) {
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
