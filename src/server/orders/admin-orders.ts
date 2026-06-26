import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeWhatsAppPhoneNumber } from "@/lib/whatsapp";
import { isSupabaseCatalogConfigured } from "@/server/catalog/public-catalog";
import { createAdminSupabaseClient } from "@/server/supabase/admin";

export type AdminOrderSummary = {
  id: string;
  publicCode: string;
  customer: string;
  items: number;
  totalCents: number;
  date: string;
  status: "new" | "prod" | "ready" | "shipped" | "done" | "cancelled";
  paymentStatus: string;
};

export type AdminOrderDetail = AdminOrderSummary & {
  buyerEmail: string | null;
  buyerPhone: string;
  currency: string;
  subtotalCents: number;
  personalizationTotalCents: number;
  deliveryTotalCents: number;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  rawStatus: OrderRow["operational_status"];
  delivery: {
    method: "pickup" | "shipping";
    recipientName: string | null;
    addressLine: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    distanceKm: number | null;
    costCents: number;
    instructions: string | null;
  } | null;
  payment: {
    status: string;
    providerStatus: string | null;
    providerPaymentId: string | null;
    providerPreferenceId: string | null;
  } | null;
  lines: Array<{
    id: string;
    productName: string;
    size: string;
    color: string;
    design: string;
    personalization: string | null;
    quantity: number;
    unitPriceCents: number;
    personalizationPriceCents: number;
    lineTotalCents: number;
  }>;
};

export type AdminOrderOperationInput = {
  orderId: FormDataEntryValue | null;
  operationalStatus: FormDataEntryValue | null;
  buyerName: FormDataEntryValue | null;
  buyerEmail: FormDataEntryValue | null;
  buyerPhone: FormDataEntryValue | null;
  adminNotes: FormDataEntryValue | null;
  recipientName: FormDataEntryValue | null;
  addressLine: FormDataEntryValue | null;
  city: FormDataEntryValue | null;
  province: FormDataEntryValue | null;
  postalCode: FormDataEntryValue | null;
  instructions: FormDataEntryValue | null;
};

type OrderRow = {
  id: string;
  public_code: string;
  buyer_name: string;
  buyer_email: string | null;
  buyer_phone: string;
  currency: string;
  subtotal_cents: number;
  personalization_total_cents: number;
  delivery_total_cents: number;
  total_cents: number;
  customer_notes: string | null;
  admin_notes: string | null;
  payment_status: string;
  operational_status:
    | "new"
    | "in_production"
    | "ready"
    | "shipped"
    | "completed"
    | "cancelled";
  created_at: string;
  updated_at: string;
  order_items: Array<{
    id: string;
    product_name_snapshot: string;
    size_label_snapshot: string;
    color_name_snapshot: string;
    design_name_snapshot: string;
    personalization_detail: string | null;
    unit_price_cents: number;
    personalization_price_cents: number;
    quantity: number;
    line_total_cents: number;
  }>;
  deliveries: Array<{
    method: "pickup" | "shipping";
    recipient_name: string | null;
    address_line: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    distance_km: number | null;
    cost_cents: number;
    instructions: string | null;
  }>;
  payments: Array<{
    status: string;
    provider_status: string | null;
    provider_payment_id: string | null;
    provider_preference_id: string | null;
  }>;
};

const statuses = [
  "new",
  "in_production",
  "ready",
  "shipped",
  "completed",
  "cancelled",
] as const;

const statusMap: Record<OrderRow["operational_status"], AdminOrderSummary["status"]> = {
  new: "new",
  in_production: "prod",
  ready: "ready",
  shipped: "shipped",
  completed: "done",
  cancelled: "cancelled",
};

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: FormDataEntryValue | null) {
  const cleaned = text(value);
  return cleaned ? cleaned : null;
}

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function mapOrderSummary(order: OrderRow): AdminOrderSummary {
  return {
    id: order.id,
    publicCode: order.public_code,
    customer: order.buyer_name,
    items: order.order_items.reduce((acc, item) => acc + item.quantity, 0),
    totalCents: order.total_cents,
    date: formatOrderDate(order.created_at),
    status: statusMap[order.operational_status],
    paymentStatus: order.payment_status,
  };
}

function mapOrderDetail(order: OrderRow): AdminOrderDetail {
  const payment = order.payments[0] ?? null;
  const delivery = order.deliveries[0] ?? null;

  return {
    ...mapOrderSummary(order),
    buyerEmail: order.buyer_email,
    buyerPhone: order.buyer_phone,
    currency: order.currency,
    subtotalCents: order.subtotal_cents,
    personalizationTotalCents: order.personalization_total_cents,
    deliveryTotalCents: order.delivery_total_cents,
    customerNotes: order.customer_notes,
    adminNotes: order.admin_notes,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    rawStatus: order.operational_status,
    delivery: delivery
      ? {
          method: delivery.method,
          recipientName: delivery.recipient_name,
          addressLine: delivery.address_line,
          city: delivery.city,
          province: delivery.province,
          postalCode: delivery.postal_code,
          distanceKm: delivery.distance_km,
          costCents: delivery.cost_cents,
          instructions: delivery.instructions,
        }
      : null,
    payment: payment
      ? {
          status: payment.status,
          providerStatus: payment.provider_status,
          providerPaymentId: payment.provider_payment_id,
          providerPreferenceId: payment.provider_preference_id,
        }
      : null,
    lines: order.order_items.map((item) => ({
      id: item.id,
      productName: item.product_name_snapshot,
      size: item.size_label_snapshot,
      color: item.color_name_snapshot,
      design: item.design_name_snapshot,
      personalization: item.personalization_detail,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
      personalizationPriceCents: item.personalization_price_cents,
      lineTotalCents: item.line_total_cents,
    })),
  };
}

const orderSelect = `
  id, public_code, buyer_name, buyer_email, buyer_phone, currency,
  subtotal_cents, personalization_total_cents, delivery_total_cents, total_cents,
  customer_notes, admin_notes, payment_status, operational_status, created_at, updated_at,
  order_items(
    id, product_name_snapshot, size_label_snapshot, color_name_snapshot,
    design_name_snapshot, personalization_detail, unit_price_cents,
    personalization_price_cents, quantity, line_total_cents
  ),
  deliveries(
    method, recipient_name, address_line, city, province, postal_code,
    distance_km, cost_cents, instructions
  ),
  payments(status, provider_status, provider_payment_id, provider_preference_id)
`;

export async function getAdminOrderSummaries(
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  if (!isSupabaseCatalogConfigured()) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(`No pudimos leer pedidos: ${error.message}`);

  return (data as unknown as OrderRow[]).map(mapOrderSummary);
}

export async function getAdminOrderDetail(
  id: string,
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  if (!isSupabaseCatalogConfigured()) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", id)
    .maybeSingle<OrderRow>();

  if (error) throw new Error(`No pudimos leer el pedido: ${error.message}`);
  return data ? mapOrderDetail(data) : null;
}

export function getAdminOrderOperationInput(
  formData: FormData,
): AdminOrderOperationInput {
  return {
    orderId: formData.get("orderId"),
    operationalStatus: formData.get("operationalStatus"),
    buyerName: formData.get("buyerName"),
    buyerEmail: formData.get("buyerEmail"),
    buyerPhone: formData.get("buyerPhone"),
    adminNotes: formData.get("adminNotes"),
    recipientName: formData.get("recipientName"),
    addressLine: formData.get("addressLine"),
    city: formData.get("city"),
    province: formData.get("province"),
    postalCode: formData.get("postalCode"),
    instructions: formData.get("instructions"),
  };
}

export function parseAdminOrderOperationInput(input: AdminOrderOperationInput) {
  const errors: string[] = [];
  const orderId = text(input.orderId);
  const operationalStatus = text(input.operationalStatus) as OrderRow["operational_status"];
  const buyerName = text(input.buyerName);
  const buyerPhone = sanitizeWhatsAppPhoneNumber(text(input.buyerPhone));

  if (!orderId) errors.push("Pedido requerido.");
  if (!statuses.includes(operationalStatus)) errors.push("Estado inválido.");
  if (!buyerName) errors.push("Nombre del cliente requerido.");
  if (!buyerPhone) errors.push("Teléfono inválido.");

  if (errors.length > 0) return { ok: false as const, errors };

  return {
    ok: true as const,
    orderId,
    order: {
      operational_status: operationalStatus,
      buyer_name: buyerName,
      buyer_email: nullableText(input.buyerEmail),
      buyer_phone: buyerPhone,
      admin_notes: nullableText(input.adminNotes),
    },
    delivery: {
      recipient_name: nullableText(input.recipientName),
      address_line: nullableText(input.addressLine),
      city: nullableText(input.city),
      province: nullableText(input.province),
      postal_code: nullableText(input.postalCode),
      instructions: nullableText(input.instructions),
    },
  };
}

export async function updateAdminOrderOperation(
  parsed: Extract<ReturnType<typeof parseAdminOrderOperationInput>, { ok: true }>,
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  const { error } = await supabase.rpc("update_admin_order_operation", {
    target_order_id: parsed.orderId,
    order_data: parsed.order,
    delivery_data: parsed.delivery,
  });

  if (error) throw new Error(`No pudimos actualizar el pedido: ${error.message}`);
}
