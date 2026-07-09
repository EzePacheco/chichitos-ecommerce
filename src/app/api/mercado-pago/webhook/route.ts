import { processMercadoPagoWebhook } from "@/server/payments/process-mercado-pago-webhook";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const payload = await request.json().catch(() => ({}));
  const dataId = url.searchParams.get("data.id") ?? payload?.data?.id ?? null;
  const result = await processMercadoPagoWebhook({
    payload,
    dataId: dataId ? String(dataId) : null,
    requestId: request.headers.get("x-request-id"),
    signature: request.headers.get("x-signature"),
  });

  if (!result.ok) return new Response(null, { status: result.status });

  return Response.json(result.body, { status: result.status });
}
