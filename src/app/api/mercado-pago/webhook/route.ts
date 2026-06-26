import {
  getMercadoPagoPayment,
  mapMercadoPagoPaymentStatus,
  minimalMercadoPagoPaymentPayload,
  validateMercadoPagoPaymentForOrder,
  verifyMercadoPagoWebhookSignature,
} from "@/server/payments/mercado-pago";
import { createAdminSupabaseClient } from "@/server/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const payload = await request.json().catch(() => ({}));
  const dataId = url.searchParams.get("data.id") ?? payload?.data?.id ?? null;
  const requestId = request.headers.get("x-request-id");

  if (
    !verifyMercadoPagoWebhookSignature({
      signature: request.headers.get("x-signature"),
      requestId,
      dataId,
    })
  ) {
    return new Response(null, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  const eventId = String(payload?.id ?? `${dataId}-${requestId}`);
  const { error: eventError } = await supabase
    .from("payment_webhook_events")
    .insert({
      external_event_id: eventId,
      event_type: String(payload?.type ?? "payment"),
      payload: {
        id: payload?.id ?? null,
        type: payload?.type ?? null,
        data_id: dataId,
      },
    });

  if (eventError?.code === "23505") {
    return Response.json({ ok: true, duplicate: true });
  }
  if (eventError) {
    return new Response(null, { status: 500 });
  }

  try {
    if (payload?.type === "payment" && dataId) {
      const payment = await getMercadoPagoPayment(String(dataId));
      const status = mapMercadoPagoPaymentStatus(payment.status);

      if (payment.external_reference) {
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select("id,total_cents,currency")
          .eq("id", payment.external_reference)
          .maybeSingle<{ id: string; total_cents: number; currency: string }>();

        if (orderError) throw new Error(orderError.message);

        if (!order || !validateMercadoPagoPaymentForOrder(payment, order)) {
          await supabase
            .from("payment_webhook_events")
            .update({ processed_at: new Date().toISOString() })
            .eq("external_event_id", eventId);

          return Response.json({ ok: true, ignored: true });
        }

        await supabase
          .from("payments")
          .update({
            provider_payment_id: String(payment.id),
            provider_status: payment.status,
            status,
            raw_payload: minimalMercadoPagoPaymentPayload(payment),
          })
          .eq("order_id", payment.external_reference);
        await supabase
          .from("orders")
          .update({ payment_status: status })
          .eq("id", payment.external_reference);

        if (status === "approved") {
          const { error: captureError } = await supabase.rpc("capture_order_stock", {
            target_order_id: payment.external_reference,
          });

          if (captureError) throw new Error(captureError.message);
        }
      }
    }

    await supabase
      .from("payment_webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("external_event_id", eventId);

    return Response.json({ ok: true });
  } catch {
    return new Response(null, { status: 500 });
  }
}
