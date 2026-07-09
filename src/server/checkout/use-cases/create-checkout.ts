import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeWhatsAppPhoneNumber } from "@/shared/contact/whatsapp";
import { calculateCheckoutDelivery } from "@/server/shipping/checkout-shipping";
import { getStoreSettings } from "@/server/settings/store-settings";
import { createAdminSupabaseClient } from "@/platform/supabase/admin";
import { createMercadoPagoPreference } from "@/server/payments/mercado-pago";

type CheckoutPayload = {
  items?: Array<{
    productSlug?: string;
    quantity?: number;
    sizeId?: string;
    colorId?: string;
    designId?: string;
    personalName?: string | null;
  }>;
  buyer?: {
    name?: string;
    email?: string;
    phone?: string;
    dni?: string;
  };
  delivery?: {
    method?: "envio" | "retiro";
    addressLine?: string;
    city?: string;
    postalCode?: string;
  };
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  base_price_cents: number;
  product_sizes: Array<{ code: string; label: string }>;
  product_colors: Array<{ code: string; name: string }>;
  product_designs: Array<{
    extra_price_cents: number;
    designs: { id: string; slug: string; name: string } | null;
  }>;
  product_personalization_options: Array<{
    enabled: boolean;
    extra_price_cents: number;
  }>;
};

export type CheckoutResult =
  | { ok: true; orderId: string; publicCode: string; redirectUrl: string }
  | { ok: false; status: number; code: string; title: string };

type LocalCheckoutRow = {
  order_id: string;
  public_code: string;
  payment_id: string;
  provider_preference_id: string | null;
  provider_preference_init_point: string | null;
};

type PreferenceClaimRow = {
  claimed: boolean;
  in_progress: boolean;
  provider_preference_init_point: string | null;
};

type PersistedCheckoutPreference = {
  buyer_email: string | null;
  order_items: Array<{
    product_name_snapshot: string;
    quantity: number;
    unit_price_cents: number;
    personalization_price_cents: number;
  }>;
};

function cleanText(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function makePublicCode() {
  return `CHI-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function checkoutFingerprint(input: {
  buyerName: string;
  buyerEmail: string | null;
  buyerPhone: string;
  deliveryMethod: "pickup" | "shipping";
  deliveryAddressLine: string | null;
  deliveryCity: string | null;
  deliveryPostalCode: string | null;
  deliveryDistanceKm: number | null;
  deliveryTotalCents: number;
  subtotalCents: number;
  personalizationTotalCents: number;
  totalCents: number;
  orderItems: unknown[];
  stockItems: unknown[];
}) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone,
        deliveryMethod: input.deliveryMethod,
        deliveryAddressLine: input.deliveryAddressLine,
        deliveryCity: input.deliveryCity,
        deliveryPostalCode: input.deliveryPostalCode,
        deliveryDistanceKm: input.deliveryDistanceKm,
        deliveryTotalCents: input.deliveryTotalCents,
        subtotalCents: input.subtotalCents,
        personalizationTotalCents: input.personalizationTotalCents,
        totalCents: input.totalCents,
        orderItems: [...input.orderItems].sort((a, b) =>
          JSON.stringify(a).localeCompare(JSON.stringify(b)),
        ),
        stockItems: [...input.stockItems].sort((a, b) =>
          JSON.stringify(a).localeCompare(JSON.stringify(b)),
        ),
      }),
    )
    .digest("hex");
}

async function getProductBySlug(slug: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, slug, name, base_price_cents,
      product_sizes(code,label),
      product_colors(code,name),
      product_designs(extra_price_cents,designs(id,slug,name)),
      product_personalization_options(enabled,extra_price_cents)
    `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle<ProductRow>();

  if (error) throw new Error(error.message);
  return data;
}

async function getPersistedCheckoutPreference(
  orderId: string,
  supabase: SupabaseClient,
) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      buyer_email,
      order_items(product_name_snapshot,quantity,unit_price_cents,personalization_price_cents)
    `,
    )
    .eq("id", orderId)
    .maybeSingle<PersistedCheckoutPreference>();

  if (error) throw new Error(error.message);
  if (!data?.order_items?.length) throw new Error("No pudimos reconstruir el checkout.");

  return data;
}

export async function createCheckout(
  payload: CheckoutPayload,
  idempotencyKey: string,
  supabase: SupabaseClient = createAdminSupabaseClient(),
): Promise<CheckoutResult> {
  if (idempotencyKey.trim().length < 8) {
    return {
      ok: false,
      status: 400,
      code: "missing_idempotency_key",
      title: "Falta Idempotency-Key para crear el checkout.",
    };
  }

  const settings = await getStoreSettings(supabase);

  if (!settings.checkout_enabled) {
    return {
      ok: false,
      status: 409,
      code: "checkout_disabled",
      title: "Checkout no habilitado.",
    };
  }

  const buyerName = cleanText(payload.buyer?.name);
  const buyerPhone = sanitizeWhatsAppPhoneNumber(cleanText(payload.buyer?.phone));

  if (!buyerName || !buyerPhone) {
    return {
      ok: false,
      status: 400,
      code: "invalid_buyer",
      title: "Completá nombre y teléfono.",
    };
  }

  if (!payload.items?.length) {
    return {
      ok: false,
      status: 400,
      code: "empty_cart",
      title: "El carrito está vacío.",
    };
  }

  const deliveryMethod = payload.delivery?.method === "retiro" ? "pickup" : "shipping";
  const delivery = await calculateCheckoutDelivery(
    {
      method: deliveryMethod,
      addressLine: cleanText(payload.delivery?.addressLine),
      city: cleanText(payload.delivery?.city),
      postalCode: cleanText(payload.delivery?.postalCode),
    },
    settings,
  );

  if (!delivery.ok) return delivery;

  const deliveryTotalCents = delivery.totalCents;

  const orderItems = [];
  const stockItems = [];
  let subtotalCents = 0;
  let personalizationTotalCents = 0;

  for (const item of payload.items) {
    const quantity = Math.max(0, Math.floor(Number(item.quantity ?? 0)));
    const product = item.productSlug
      ? await getProductBySlug(item.productSlug, supabase)
      : null;
    const size = product?.product_sizes.find((size) => size.code === item.sizeId);
    const color = product?.product_colors.find((color) => color.code === item.colorId);
    const designLink = product?.product_designs.find(
      (link) => link.designs?.slug === item.designId,
    );

    if (!product || !size || !color || !designLink?.designs || quantity <= 0) {
      return {
        ok: false,
        status: 400,
        code: "invalid_cart_item",
        title: "Hay un producto inválido en el carrito.",
      };
    }

    const personalization = product.product_personalization_options[0];
    const personalizationDetail = cleanText(item.personalName ?? undefined);
    const personalizationPriceCents =
      personalization?.enabled && personalizationDetail
        ? personalization.extra_price_cents
        : 0;
    const unitPriceCents =
      product.base_price_cents + (designLink.extra_price_cents ?? 0);
    const lineTotalCents = (unitPriceCents + personalizationPriceCents) * quantity;

    subtotalCents += unitPriceCents * quantity;
    personalizationTotalCents += personalizationPriceCents * quantity;
    orderItems.push({
      product_id: product.id,
      design_id: designLink.designs.id,
      product_slug_snapshot: product.slug,
      product_name_snapshot: product.name,
      size_label_snapshot: size.label,
      color_name_snapshot: color.name,
      design_name_snapshot: designLink.designs.name,
      personalization_detail: personalizationDetail || null,
      unit_price_cents: unitPriceCents,
      personalization_price_cents: personalizationPriceCents,
      quantity,
      line_total_cents: lineTotalCents,
    });
    stockItems.push({
      product_id: product.id,
      design_id: designLink.designs.id,
      size_code: size.code,
      color_code: color.code,
      quantity,
    });
  }

  const publicCode = makePublicCode();
  const totalCents = subtotalCents + personalizationTotalCents + deliveryTotalCents;
  const buyerEmail = cleanText(payload.buyer?.email) || null;
  const deliveryAddressLine =
    deliveryMethod === "shipping" ? cleanText(payload.delivery?.addressLine) : null;
  const deliveryCity =
    deliveryMethod === "shipping" ? cleanText(payload.delivery?.city) : null;
  const deliveryPostalCode =
    deliveryMethod === "shipping" ? cleanText(payload.delivery?.postalCode) : null;
  const idempotencyFingerprint = checkoutFingerprint({
    buyerName,
    buyerEmail,
    buyerPhone,
    deliveryMethod,
    deliveryAddressLine,
    deliveryCity,
    deliveryPostalCode,
    deliveryDistanceKm: delivery.distanceKm,
    deliveryTotalCents,
    subtotalCents,
    personalizationTotalCents,
    totalCents,
    orderItems,
    stockItems,
  });

  const { data: localCheckout, error: localCheckoutError } = await supabase
    .rpc("create_checkout_local", {
      checkout_idempotency_key: idempotencyKey.trim(),
      order_data: {
        public_code: publicCode,
        idempotency_fingerprint: idempotencyFingerprint,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        subtotal_cents: subtotalCents,
        personalization_total_cents: personalizationTotalCents,
        delivery_total_cents: deliveryTotalCents,
        total_cents: totalCents,
      },
      items_data: orderItems,
      delivery_data: {
        method: deliveryMethod,
        recipient_name: buyerName,
        address_line:
          deliveryMethod === "shipping" ? cleanText(payload.delivery?.addressLine) : null,
        city: deliveryMethod === "shipping" ? cleanText(payload.delivery?.city) : null,
        postal_code:
          deliveryMethod === "shipping" ? cleanText(payload.delivery?.postalCode) : null,
        distance_km: delivery.distanceKm,
        cost_cents: deliveryTotalCents,
      },
      stock_data: stockItems,
      reservation_minutes: 20,
    })
    .single<LocalCheckoutRow>();

  if (localCheckoutError?.message.includes("stock")) {
    return {
      ok: false,
      status: 409,
      code: "insufficient_stock",
      title: "No hay stock suficiente para una variante elegida.",
    };
  }

  if (localCheckoutError?.message.includes("idempotency conflict")) {
    return {
      ok: false,
      status: 409,
      code: "idempotency_conflict",
      title: "La clave de idempotencia ya fue usada con otro checkout.",
    };
  }

  if (localCheckoutError || !localCheckout) {
    throw new Error(localCheckoutError?.message ?? "No pudimos crear el checkout local.");
  }

  if (localCheckout.provider_preference_init_point) {
    return {
      ok: true,
      orderId: localCheckout.order_id,
      publicCode: localCheckout.public_code,
      redirectUrl: localCheckout.provider_preference_init_point,
    };
  }

  const { data: preferenceClaim, error: preferenceClaimError } = await supabase
    .rpc("claim_mercado_pago_preference_creation", {
      target_payment_id: localCheckout.payment_id,
    })
    .single<PreferenceClaimRow>();

  if (preferenceClaimError || !preferenceClaim) {
    throw new Error(
      preferenceClaimError?.message ?? "No pudimos reservar la preferencia de pago.",
    );
  }

  if (preferenceClaim.provider_preference_init_point) {
    return {
      ok: true,
      orderId: localCheckout.order_id,
      publicCode: localCheckout.public_code,
      redirectUrl: preferenceClaim.provider_preference_init_point,
    };
  }

  if (!preferenceClaim.claimed || preferenceClaim.in_progress) {
    return {
      ok: false,
      status: 409,
      code: "checkout_in_progress",
      title: "El checkout se está preparando. Reintentá en unos segundos.",
    };
  }

  const persistedPreference = await getPersistedCheckoutPreference(
    localCheckout.order_id,
    supabase,
  );

  const preference = await createMercadoPagoPreference({
    orderId: localCheckout.order_id,
    publicCode: localCheckout.public_code,
    buyerEmail: persistedPreference.buyer_email,
    items: persistedPreference.order_items.map((item) => ({
      title: item.product_name_snapshot,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents + item.personalization_price_cents,
    })),
  });

  const { data: completedPreference, error: paymentError } = await supabase
    .rpc("complete_mercado_pago_preference_creation", {
      target_payment_id: localCheckout.payment_id,
      preference_id: preference.id,
      preference_init_point: preference.initPoint,
    })
    .single<Pick<PreferenceClaimRow, "provider_preference_init_point">>();
  if (paymentError) throw new Error(paymentError.message);

  return {
    ok: true,
    orderId: localCheckout.order_id,
    publicCode: localCheckout.public_code,
    redirectUrl: completedPreference?.provider_preference_init_point ?? preference.initPoint,
  };
}
