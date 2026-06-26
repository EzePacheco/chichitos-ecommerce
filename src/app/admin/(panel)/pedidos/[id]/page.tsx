import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/design-system";
import { saveOrderOperationAction } from "@/app/admin/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminShell";
import { formatMoney } from "@/lib/money";
import { getAdminOrderDetail } from "@/server/orders/admin-orders";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ order?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const status = firstParam((await searchParams)?.order);
  const order = await getAdminOrderDetail(id);

  if (!order) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Pedido"
        title={order.publicCode}
        action={<OrderStatusBadge status={order.status} />}
      />

      {status === "saved" ? (
        <div className="disclaimer admin__notice">
          <Check size={20} />
          <div>El pedido se actualizó correctamente.</div>
        </div>
      ) : null}

      {status === "invalid" ? (
        <div className="disclaimer admin__notice">
          <div>Revisá estado, nombre y teléfono antes de guardar.</div>
        </div>
      ) : null}

      <div className="admin__row">
        <form action={saveOrderOperationAction} className="card admin-form">
          <input name="orderId" type="hidden" value={order.id} />
          <section className="admin-form__section">
            <h3>Operación</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="operationalStatus">Estado</label>
                <select
                  className="select"
                  defaultValue={order.rawStatus}
                  id="operationalStatus"
                  name="operationalStatus"
                >
                  <option value="new">Nuevo</option>
                  <option value="in_production">En producción</option>
                  <option value="ready">Listo</option>
                  <option value="shipped">Enviado</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="buyerPhone">Teléfono</label>
                <input
                  className="input"
                  defaultValue={order.buyerPhone}
                  id="buyerPhone"
                  name="buyerPhone"
                />
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="buyerName">Cliente</label>
                <input
                  className="input"
                  defaultValue={order.customer}
                  id="buyerName"
                  name="buyerName"
                />
              </div>
              <div className="field">
                <label htmlFor="buyerEmail">Email</label>
                <input
                  className="input"
                  defaultValue={order.buyerEmail ?? ""}
                  id="buyerEmail"
                  name="buyerEmail"
                  type="email"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="adminNotes">Notas internas</label>
              <textarea
                className="textarea"
                defaultValue={order.adminNotes ?? ""}
                id="adminNotes"
                name="adminNotes"
                rows={4}
              />
            </div>
          </section>

          <section className="admin-form__section">
            <h3>Entrega</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="recipientName">Recibe</label>
                <input
                  className="input"
                  defaultValue={order.delivery?.recipientName ?? ""}
                  id="recipientName"
                  name="recipientName"
                />
              </div>
              <div className="field">
                <label htmlFor="postalCode">Código postal</label>
                <input
                  className="input"
                  defaultValue={order.delivery?.postalCode ?? ""}
                  id="postalCode"
                  name="postalCode"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="addressLine">Dirección</label>
              <input
                className="input"
                defaultValue={order.delivery?.addressLine ?? ""}
                id="addressLine"
                name="addressLine"
              />
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="city">Ciudad</label>
                <input
                  className="input"
                  defaultValue={order.delivery?.city ?? ""}
                  id="city"
                  name="city"
                />
              </div>
              <div className="field">
                <label htmlFor="province">Provincia</label>
                <input
                  className="input"
                  defaultValue={order.delivery?.province ?? ""}
                  id="province"
                  name="province"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="instructions">Instrucciones</label>
              <textarea
                className="textarea"
                defaultValue={order.delivery?.instructions ?? ""}
                id="instructions"
                name="instructions"
                rows={3}
              />
            </div>
          </section>

          <Button type="submit" variant="primary">
            <Check size={20} /> Guardar operación
          </Button>
        </form>

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
