import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { OrderStatusBadge } from "@/features/admin/ui/OrderStatusBadge";
import { OrderOperationForm } from "@/features/admin/ui/order-operation/OrderOperationForm";
import { formatMoney } from "@/shared/formatting/money";
import { SearchParamToast } from "@/shared/ui/SearchParamToast";
import { getAdminOrderDetail } from "@/server/orders/admin-orders";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({
  params,
}: PageProps) {
  const { id } = await params;
  const order = await getAdminOrderDetail(id);

  if (!order) notFound();

  return (
    <>
      <AdminPageHeader
        backHref="/admin/pedidos"
        backLabel="Volver a pedidos"
        eyebrow="Pedido"
        title={order.publicCode}
        subtitle="Actualizá la preparación y los datos de entrega. El estado del pago es informativo."
        action={<OrderStatusBadge status={order.status} />}
      />

      <SearchParamToast
        messages={{ saved: "El pedido se actualizó correctamente." }}
        param="order"
      />

      <div className="admin__row">
        <OrderOperationForm order={order} />

        <aside className="card admin-form">
          <section className="admin-form__section">
            <h3>Pago y totales</h3>
            <div className="summary__row">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotalCents)}</span>
            </div>
            <div className="summary__row">
              <span>Personalización</span>
              <span>{formatMoney(order.personalizationTotalCents)}</span>
            </div>
            <div className="summary__row">
              <span>Entrega</span>
              <span>{formatMoney(order.deliveryTotalCents)}</span>
            </div>
            <div className="summary__row summary__row--total">
              <span>Total</span>
              <span>{formatMoney(order.totalCents)}</span>
            </div>
            <p className="caption">
              Pago: {order.payment?.status ?? order.paymentStatus}. Los pagos se
              confirman por webhook.
            </p>
          </section>
          <section className="admin-form__section">
            <h3>Items</h3>
            <div className="flex-col" style={{ gap: 12 }}>
              {order.lines.map((line) => (
                <div className="admin__line-item" key={line.id}>
                  <strong>{line.productName}</strong>
                  <div className="caption">
                    {line.size} · {line.color} · {line.design} · x{line.quantity}
                  </div>
                  <div>{formatMoney(line.lineTotalCents)}</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
