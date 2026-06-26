import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminSupabaseClient } from "@/server/supabase/admin";
import { isSupabaseCatalogConfigured } from "@/server/catalog/public-catalog";

export type AdminOrderSummary = {
  id: string;
  publicCode: string;
  customer: string;
  items: number;
  totalCents: number;
  date: string;
  status: "new" | "prod" | "ready" | "shipped" | "done" | "cancelled";
};

type OrderRow = {
  id: string;
  public_code: string;
  buyer_name: string;
  total_cents: number;
  operational_status:
    | "new"
    | "in_production"
    | "ready"
    | "shipped"
    | "completed"
    | "cancelled";
  created_at: string;
  order_items: Array<{ quantity: number }>;
};

const statusMap: Record<OrderRow["operational_status"], AdminOrderSummary["status"]> = {
  new: "new",
  in_production: "prod",
  ready: "ready",
  shipped: "shipped",
  completed: "done",
  cancelled: "cancelled",
};

export async function getAdminOrderSummaries(
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  if (!isSupabaseCatalogConfigured()) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("id,public_code,buyer_name,total_cents,operational_status,created_at,order_items(quantity)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(`No pudimos leer pedidos: ${error.message}`);

  return (data as unknown as OrderRow[]).map((order) => ({
    id: order.id,
    publicCode: order.public_code,
    customer: order.buyer_name,
    items: order.order_items.reduce((acc, item) => acc + item.quantity, 0),
    totalCents: order.total_cents,
    date: new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
    }).format(new Date(order.created_at)),
    status: statusMap[order.operational_status],
  }));
}
