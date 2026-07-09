import type { buildCheckoutPayload } from "../model/checkout-form";

type CheckoutPayload = ReturnType<typeof buildCheckoutPayload>;

export async function createCheckoutRedirect({
  payload,
  idempotencyKey,
}: {
  payload: CheckoutPayload;
  idempotencyKey: string;
}) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.redirectUrl) {
    return {
      ok: false as const,
      title: data?.title ?? "No pudimos iniciar el pago.",
    };
  }

  return {
    ok: true as const,
    redirectUrl: String(data.redirectUrl),
  };
}
