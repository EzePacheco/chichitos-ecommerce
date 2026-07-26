import Link from "next/link";
import { Info } from "lucide-react";
import { OrderStatusBadge } from "@/features/admin/ui/OrderStatusBadge";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { formatMoney } from "@/shared/formatting/money";
import { getAdminOrderSummaries } from "@/server/orders/admin-orders";
import { isSupabaseCatalogConfigured } from "@/server/catalog/public-catalog";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrderSummaries();
  const configured = isSupabaseCatalogConfigured();

  return (
    <>
      <AdminPageHeader eyebrow="Operación" title="Pedidos" />

      {!configured ? (
        <div className="disclaimer admin__notice">
          <Info size={20} />
          <div>Los pedidos reales requieren Supabase configurado.</div>
        </div>
      ) : null}

      <table className="table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Prendas</th>
            <th>Total</th>
            <th>Pago</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td className="table__empty" colSpan={7}>
                Todavía no hay pedidos. Cuando un cliente complete el checkout,
                el pedido aparece acá.
              </td>
            </tr>
          ) : null}
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link href={`/admin/pedidos/${order.id}`}>
                  <strong>{order.publicCode}</strong>
                </Link>
              </td>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>{order.items}</td>
              <td>{formatMoney(order.totalCents)}</td>
              <td>{order.paymentStatus}</td>
              <td>
                <OrderStatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
