import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { OrderStatusBadge } from "@/features/admin/ui/OrderStatusBadge";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/features/admin/ui/AdminEmptyState";
import { AdminFeedback } from "@/features/admin/ui/AdminFeedback";
import { Button } from "@/shared/ui/button";
import { formatMoney } from "@/shared/formatting/money";
import { getAdminOrderPage } from "@/server/orders/admin-orders";
import { isSupabaseCatalogConfigured } from "@/server/catalog/public-catalog";

type PageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    status?: string | string[];
    payment?: string | string[];
    page?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(
  page: number,
  values: { q: string; status: string; payment: string },
) {
  const params = new URLSearchParams();
  if (values.q) params.set("q", values.q);
  if (values.status) params.set("status", values.status);
  if (values.payment) params.set("payment", values.payment);
  params.set("page", String(page));
  return `/admin/pedidos?${params}`;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = firstParam(params?.q)?.trim() ?? "";
  const status = firstParam(params?.status) ?? "";
  const payment = firstParam(params?.payment) ?? "";
  const requestedPage = Number(firstParam(params?.page) ?? "1");
  const result = await getAdminOrderPage({
    query: q,
    status:
      status === "new" ||
      status === "in_production" ||
      status === "ready" ||
      status === "shipped" ||
      status === "completed" ||
      status === "cancelled"
        ? status
        : "",
    paymentStatus: payment,
    page: Number.isFinite(requestedPage) ? requestedPage : 1,
  });
  const configured = isSupabaseCatalogConfigured();
  const hasFilters = Boolean(q || status || payment);

  return (
    <>
      <AdminPageHeader
        eyebrow="Operación"
        title="Pedidos"
        subtitle="Encontrá pedidos y avanzá su preparación sin modificar el pago."
      />

      {!configured ? (
        <AdminFeedback tone="info">
          Los pedidos reales requieren Supabase configurado.
        </AdminFeedback>
      ) : null}

      <form className="admin-toolbar" method="get">
        <label className="admin-toolbar__search">
          <span className="sr-only">Buscar pedidos</span>
          <Search size={18} />
          <input
            className="input"
            defaultValue={q}
            name="q"
            placeholder="Código o cliente"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select className="select" defaultValue={status} name="status">
            <option value="">Todos los estados</option>
            <option value="new">Nuevo</option>
            <option value="in_production">En producción</option>
            <option value="ready">Listo</option>
            <option value="shipped">Enviado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por pago</span>
          <select className="select" defaultValue={payment} name="payment">
            <option value="">Todos los pagos</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
            <option value="cancelled">Cancelado</option>
            <option value="refunded">Reintegrado</option>
            <option value="unknown">Sin confirmar</option>
          </select>
        </label>
        <Button type="submit" variant="primary">
          Aplicar
        </Button>
        {hasFilters ? (
          <Button asChild variant="ghost">
            <Link href="/admin/pedidos">Limpiar</Link>
          </Button>
        ) : null}
      </form>

      {result.items.length === 0 ? (
        <AdminEmptyState
          title={hasFilters ? "No encontramos pedidos" : "Todavía no hay pedidos"}
          description={
            hasFilters
              ? "Probá con otra búsqueda o limpiá los filtros."
              : "Cuando un cliente complete el checkout, el pedido aparece acá."
          }
          action={
            hasFilters
              ? { href: "/admin/pedidos", label: "Limpiar filtros" }
              : undefined
          }
        />
      ) : (
        <>
          <div className="admin-resource-table">
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
                {result.items.map((order) => (
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
          </div>
          <div className="admin-resource-cards">
            {result.items.map((order) => (
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
                  {order.date} · {order.items} prendas ·{" "}
                  {formatMoney(order.totalCents)}
                </span>
                <span className="caption">Pago: {order.paymentStatus}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {result.pageCount > 1 ? (
        <nav className="admin-pagination" aria-label="Páginas de pedidos">
          <span>
            Página {result.page} de {result.pageCount} · {result.total} pedidos
          </span>
          <div>
            <Button
              asChild={result.page > 1}
              disabled={result.page <= 1}
              size="sm"
              variant="outline"
            >
              {result.page > 1 ? (
                <Link href={pageHref(result.page - 1, { q, status, payment })}>
                  <ChevronLeft size={16} /> Anterior
                </Link>
              ) : (
                <span>
                  <ChevronLeft size={16} /> Anterior
                </span>
              )}
            </Button>
            <Button
              asChild={result.page < result.pageCount}
              disabled={result.page >= result.pageCount}
              size="sm"
              variant="outline"
            >
              {result.page < result.pageCount ? (
                <Link href={pageHref(result.page + 1, { q, status, payment })}>
                  Siguiente <ChevronRight size={16} />
                </Link>
              ) : (
                <span>
                  Siguiente <ChevronRight size={16} />
                </span>
              )}
            </Button>
          </div>
        </nav>
      ) : null}
    </>
  );
}
