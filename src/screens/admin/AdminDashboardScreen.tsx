import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { OrderStatusBadge } from "@/features/admin/ui/OrderStatusBadge";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { AdminFeedback } from "@/features/admin/ui/AdminFeedback";
import { getAdminDisplayName } from "@/screens/admin/AdminShell";
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
  return (
    <>
      <AdminPageHeader
        eyebrow={`Hola ${getAdminDisplayName(email)}`}
        title="Panel de Chichitos"
        subtitle="Lo importante para preparar pedidos y mantener la tienda al día."
        action={
          <Button asChild variant="primary">
            <Link href="/admin/productos/nuevo">
              <Plus size={20} /> Nuevo producto
            </Link>
          </Button>
        }
      />

      {!settingsComplete ? (
        <AdminFeedback tone="warning" title="Completá la configuración inicial">
          Falta: {missingSettingsFields.join(", ")}.{" "}
          <Link href="/admin/configuracion">Ir a configuración</Link>
        </AdminFeedback>
      ) : null}

      <section className="stats" aria-label="Métricas de admin">
        <div className="stat">
          <div className="stat__label">Pedidos listados</div>
          <div className="stat__value">{orders.length}</div>
          <div className="stat__delta">Últimos 50</div>
        </div>
        <div className="stat">
          <div className="stat__label">Nuevos</div>
          <div className="stat__value">
            {orders.filter((order) => order.status === "new").length}
          </div>
          <div className="stat__delta">Requieren revisión</div>
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
          <div className="admin-resource-table">
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
                {orders.length === 0 ? (
                  <tr>
                    <td className="table__empty" colSpan={5}>
                      Todavía no hay pedidos para mostrar.
                    </td>
                  </tr>
                ) : null}
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
          <div className="admin-resource-cards">
            {orders.slice(0, 8).map((order) => (
              <Link
                className="card admin-resource-card"
                href={`/admin/pedidos/${order.id}`}
                key={order.id}
              >
                <div className="admin-resource-card__head">
                  <strong>{order.publicCode}</strong>
                  <OrderStatusBadge status={order.status} />
                </div>
                <span>{order.customer}</span>
                <span className="caption">
                  {order.date} · {formatMoney(order.totalCents)}
                </span>
              </Link>
            ))}
            {orders.length === 0 ? (
              <p className="caption">Todavía no hay pedidos para mostrar.</p>
            ) : null}
          </div>
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
