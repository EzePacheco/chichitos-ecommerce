import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminSupabaseClient } from "@/platform/supabase/admin";
import {
  getMercadoPagoPayment,
  mapMercadoPagoPaymentStatus,
  minimalMercadoPagoPaymentPayload,
  validateMercadoPagoPaymentForOrder,
  verifyMercadoPagoWebhookSignature,
  type MercadoPagoPayment,
} from "./mercado-pago";

type MercadoPagoWebhookPayload = {
  id?: string | number | null;
  type?: string | null;
  action?: string | null;
  data?: { id?: string | number | null } | null;
};

type ProcessWebhookInput = {
  payload: MercadoPagoWebhookPayload;
  dataId: string | null;
  requestId: string | null;
  signature: string | null;
};

type WebhookClaim = {
  should_process: boolean;
  duplicate_processed: boolean;
  processing_in_progress: boolean;
};

type WebhookOrder = {
  id: string;
  total_cents: number;
  currency: string;
};

type ProcessWebhookDependencies = {
  supabase?: SupabaseClient;
  getPayment?: (paymentId: string) => Promise<MercadoPagoPayment>;
  verifySignature?: typeof verifyMercadoPagoWebhookSignature;
};

export type ProcessWebhookResult =
  | { ok: true; status: 200; body: Record<string, unknown> }
  | { ok: false; status: 401 | 500 };

function getEventType(payload: MercadoPagoWebhookPayload) {
  return String(payload?.action ?? payload?.type ?? "payment");
}

function getStableEventId(
  payload: MercadoPagoWebhookPayload,
  eventType: string,
  dataId: string | null,
  requestId: string | null,
) {
  return `${eventType}:${payload?.id ?? dataId ?? "unknown"}:${requestId ?? "unknown"}`;
}

async function markWebhookFailed(
  supabase: SupabaseClient,
  eventId: string,
  error: unknown,
) {
  await supabase.rpc("mark_payment_webhook_event_failed", {
    webhook_external_event_id: eventId,
    error_message: error instanceof Error ? error.message : "unknown error",
  });
}

export async function processMercadoPagoWebhook(
  input: ProcessWebhookInput,
  dependencies: ProcessWebhookDependencies = {},
): Promise<ProcessWebhookResult> {
  const dataId = input.dataId ?? (input.payload?.data?.id ? String(input.payload.data.id) : null);
  const verifySignature =
    dependencies.verifySignature ?? verifyMercadoPagoWebhookSignature;

  if (
    !verifySignature({
      signature: input.signature,
      requestId: input.requestId,
      dataId,
    })
  ) {
    return { ok: false, status: 401 };
  }

  const eventType = getEventType(input.payload);
  const eventId = getStableEventId(input.payload, eventType, dataId, input.requestId);
  const eventPayload = {
    id: input.payload?.id ?? null,
    type: input.payload?.type ?? null,
    data_id: dataId,
  };
  const supabase = dependencies.supabase ?? createAdminSupabaseClient();
  const { data: claim, error: claimError } = await supabase
    .rpc("claim_payment_webhook_event", {
      webhook_external_event_id: eventId,
      webhook_event_type: eventType,
      webhook_payload: eventPayload,
    })
    .single<WebhookClaim>();

  if (claimError || !claim) return { ok: false, status: 500 };

  if (claim.duplicate_processed) {
    return { ok: true, status: 200, body: { ok: true, duplicate: true } };
  }

  if (claim.processing_in_progress || !claim.should_process) {
    return { ok: false, status: 500 };
  }

  try {
    if (!eventType.includes("payment") || !dataId) {
      await supabase.rpc("mark_payment_webhook_event_ignored", {
        webhook_external_event_id: eventId,
      });
      return { ok: true, status: 200, body: { ok: true, ignored: true } };
    }

    const getPayment = dependencies.getPayment ?? getMercadoPagoPayment;
    const payment = await getPayment(String(dataId));
    const status = mapMercadoPagoPaymentStatus(payment.status);

    if (!payment.external_reference) {
      await supabase.rpc("mark_payment_webhook_event_ignored", {
        webhook_external_event_id: eventId,
      });
      return { ok: true, status: 200, body: { ok: true, ignored: true } };
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id,total_cents,currency")
      .eq("id", payment.external_reference)
      .maybeSingle<WebhookOrder>();

    if (orderError) throw new Error(orderError.message);

    if (!order || !validateMercadoPagoPaymentForOrder(payment, order)) {
      await supabase.rpc("mark_payment_webhook_event_ignored", {
        webhook_external_event_id: eventId,
      });
      return { ok: true, status: 200, body: { ok: true, ignored: true } };
    }

    const { error: applyError } = await supabase.rpc(
      "apply_mercado_pago_payment_webhook",
      {
        webhook_external_event_id: eventId,
        target_order_id: payment.external_reference,
        mp_provider_payment_id: String(payment.id),
        mp_provider_payment_status: payment.status,
        mp_local_payment_status: status,
        mp_provider_payload: minimalMercadoPagoPaymentPayload(payment),
      },
    );

    if (applyError) throw new Error(applyError.message);

    return { ok: true, status: 200, body: { ok: true } };
  } catch (error) {
    await markWebhookFailed(supabase, eventId, error);
    return { ok: false, status: 500 };
  }
}
