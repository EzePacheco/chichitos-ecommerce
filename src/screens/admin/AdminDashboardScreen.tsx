import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { OrderStatusBadge } from "@/features/admin/ui/OrderStatusBadge";
import { AdminPageHeader, getAdminDisplayName } from "@/screens/admin/AdminShell";
import { formatMoney } from "@/shared/formatting/money";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
import { getAdminOrderSummaries } from "@/server/orders/admin-orders";
import {
  getMissingStoreSettingsFields,
  getStoreSettings,
  isStoreSettingsOnboardingComplete,
} from "@/server/settings/store-settings";

export default async function AdminDashboardPage() {
  const authorization = await getAdminAuthorization();
  const email = authorization.status === "authorized" ? authorization.email : "";
  const orders = await getAdminOrderSummaries();
  const storeSettings = await getStoreSettings();
  const settingsComplete = isStoreSettingsOnboardingComplete(storeSettings);
  const missingSettingsFields = getMissingStoreSettingsFields(storeSettings);
  const totalCents = orders.reduce((acc, order) => acc + order.totalCents, 0);

  return (
    <>
      <AdminPageHeader
        eyebrow={`Hola ${getAdminDisplayName(email)}`}
        title="Panel de Chichitos"
        action={
          <Button asChild variant="primary">
            <Link href="/admin/productos/nuevo">
              <Plus size={20} /> Nuevo producto
            </Link>
          </Button>
        }
      />

      {!settingsComplete ? (
        <div className="disclaimer admin__notice">
          <Package size={20} />
          <div>
            <strong>Configuración pendiente.</strong>
            <p style={{ margin: "4px 0 0" }}>
              Falta: {missingSettingsFields.join(", ")}.
            </p>
          </div>
        </div>
      ) : null}

      <section className="stats" aria-label="Métricas de admin">
        <div className="stat">
          <div className="stat__label">Pedidos listados</div>
          <div className="stat__value">{orders.length}</div>
          <div className="stat__delta">Últimos 50</div>
        </div>
        <div className="stat">
          <div className="stat__label">Ingresos</div>
          <div className="stat__value">{formatMoney(totalCents)}</div>
          <div className="stat__delta">Total listado</div>
        </div>
        <div className="stat">
          <div className="stat__label">En producción</div>
          <div className="stat__value">
            {orders.filter((order) => order.status === "prod").length}
          </div>
          <div className="stat__delta">Pedidos activos</div>
        </div>
        <div className="stat">
          <div className="stat__label">A despachar</div>
          <div className="stat__value">
            {orders.filter((order) => order.status === "ready").length}
          </div>
          <div className="stat__delta">Listos</div>
        </div>
      </section>

      <section className="admin__row">
        <div>
          <div className="admin__section-head">
            <h3>Últimos pedidos</h3>
            <Link className="option-group__link" href="/admin/pedidos">
              Ver todos →
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/pedidos/${order.id}`}>
                      <strong>{order.publicCode}</strong>
                    </Link>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{formatMoney(order.totalCents)}</td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>Cola de impresión</h3>
          <div className="flex-col" style={{ gap: 12 }}>
            {orders
              .filter((order) => order.status === "prod" || order.status === "new")
              .slice(0, 4)
              .map((order) => (
                <Link
                  className="card flex-row admin__queue-card"
                  href={`/admin/pedidos/${order.id}`}
                  key={order.id}
                >
                  <div>
                    <strong>{order.publicCode}</strong>
                    <div className="caption">
                      {order.customer} · {order.items} prendas
                    </div>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
