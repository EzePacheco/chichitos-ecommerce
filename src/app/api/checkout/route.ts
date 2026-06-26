import { createCheckout } from "@/server/checkout/checkout";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const result = await createCheckout(
      await request.json(),
      request.headers.get("Idempotency-Key") ?? "",
    );

    if (!result.ok) {
      return Response.json(
        {
          type: "about:blank",
          title: result.title,
          status: result.status,
          code: result.code,
        },
        { status: result.status },
      );
    }

    return Response.json(result);
  } catch {
    return Response.json(
      {
        type: "about:blank",
        title: "No pudimos crear el checkout.",
        status: 500,
        code: "checkout_failed",
      },
      { status: 500 },
    );
  }
}
