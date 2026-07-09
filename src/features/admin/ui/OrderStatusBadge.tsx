export function OrderStatusBadge({
  status,
}: {
  status: "new" | "prod" | "ready" | "shipped" | "done" | "cancelled";
}) {
  const labels = {
    new: "Nuevo",
    prod: "En producción",
    ready: "Listo",
    shipped: "Enviado",
    done: "Completado",
    cancelled: "Cancelado",
  };

  return <span className={`status status--${status}`}>{labels[status]}</span>;
}
