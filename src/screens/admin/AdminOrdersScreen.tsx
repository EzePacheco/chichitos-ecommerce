import Link from "next/link";
import { OrderStatusBadge } from "@/features/admin/ui/OrderStatusBadge";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { formatMoney } from "@/shared/formatting/money";
import { getAdminOrderSummaries } from "@/server/orders/admin-orders";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrderSummaries();

  return (
    <>
      <AdminPageHeader eyebrow="Operación" title="Pedidos" />
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
