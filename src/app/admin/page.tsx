import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DesignSvg,
  Eyebrow,
  GarmentPlaceholder,
  Icon,
  Logo,
  OrderStatusBadge,
} from "@/components/ui/design-system";
import {
  designVisuals,
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
} from "@/features/catalog/design";
import { getActiveCatalogProducts } from "@/features/catalog/data/featured-products";
import { formatMoney } from "@/lib/money";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
import { buildAdminLoginPath } from "@/server/auth/redirects";

const deniedReasonLabels: Record<string, string> = {
  admin_lookup_failed:
    "No pudimos validar tu rol admin. Probá nuevamente o revisá la configuración server-side.",
  bootstrap_failed:
    "Tu email está en la allowlist, pero no pudimos crear el registro admin.",
  inactive_admin: "Tu usuario admin existe pero está desactivado.",
  missing_email: "La cuenta autenticada no tiene email verificable.",
  not_allowlisted:
    "Tu cuenta Google no está autorizada para administrar Chichitos.",
};

export const dynamic = "force-dynamic";

function getAdminDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? "admin";
  const firstToken = localPart.split(/[._-]/)[0] || "admin";

  return `${firstToken.charAt(0).toUpperCase()}${firstToken.slice(1)}`;
}

const orders = [
  {
    id: "#1042",
    customer: "Camila R.",
    items: 2,
    total: 3980000,
    date: "17 may",
    status: "new" as const,
  },
  {
    id: "#1041",
    customer: "Pedro M.",
    items: 1,
    total: 1490000,
    date: "17 may",
    status: "prod" as const,
  },
  {
    id: "#1040",
    customer: "Luciana B.",
    items: 3,
    total: 6230000,
    date: "16 may",
    status: "prod" as const,
  },
  {
    id: "#1039",
    customer: "Federico V.",
    items: 1,
    total: 2850000,
    date: "16 may",
    status: "ready" as const,
  },
  {
    id: "#1038",
    customer: "Soledad G.",
    items: 2,
    total: 2430000,
    date: "15 may",
    status: "shipped" as const,
  },
  {
    id: "#1037",
    customer: "Andrea S.",
    items: 4,
    total: 7890000,
    date: "14 may",
    status: "done" as const,
  },
];

export default async function AdminPage() {
  const authorization = await getAdminAuthorization();

  if (authorization.status === "unauthenticated") {
    redirect(buildAdminLoginPath("/admin"));
  }

  if (authorization.status === "denied") {
    return (
      <section className="section">
        <div className="container">
          <div
            className="card"
            style={{ maxWidth: 760, padding: "var(--sp-8)" }}
          >
            <Eyebrow>Acceso restringido</Eyebrow>
            <h1 className="display-l mt-2">No tenés acceso al admin</h1>
            <p>{deniedReasonLabels[authorization.reason]}</p>
            {authorization.email ? (
              <span className="chip">Cuenta actual: {authorization.email}</span>
            ) : null}
            <div className="disclaimer">
              <Icon name="info" />
              <div>
                El panel mantiene los controles globales: sesión Google válida,
                rol persistido en Supabase y bootstrap limitado por allowlist.
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const products = getActiveCatalogProducts();
  const adminDisplayName = getAdminDisplayName(authorization.email);
  const adminInitial = adminDisplayName.charAt(0).toUpperCase();

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <Logo variant="white" height={44} />
        </div>
        <nav className="admin__nav" aria-label="Navegación de admin">
          <a className="active" href="#dashboard">
            <Icon name="home" size={18} /> Dashboard
          </a>
          <a href="#pedidos">
            <Icon name="package" size={18} /> Pedidos
          </a>
          <a href="#productos">
            <Icon name="store" size={18} /> Productos
          </a>
          <a href="#disenos">
            <Icon name="layers" size={18} /> Diseños
          </a>
          <a href="#configuracion">
            <Icon name="settings" size={18} /> Configuración
          </a>
        </nav>
        <div style={{ marginTop: "auto" }}>
          <Link className="btn btn--soft btn--sm" href="/">
            <Icon name="chevronL" size={16} /> Volver a la tienda
          </Link>
          <div
            className="flex-row mt-4"
            style={{ gap: 10, padding: "8px 12px" }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--r-pill)",
                background: "var(--durazno)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "var(--ink-900)",
              }}
            >
              {adminInitial}
            </div>
            <div className="caption">
              <div style={{ color: "var(--cream-50)", fontWeight: 700 }}>
                {adminDisplayName}
              </div>
              <div style={{ color: "var(--cream-300)" }}>
                {authorization.email}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin__main" id="dashboard">
        <div className="admin__head">
          <div>
            <Eyebrow>Hola {adminDisplayName}</Eyebrow>
            <h1>Panel de Chichitos ✨</h1>
          </div>
          <span className="btn btn--primary">
            <Icon name="plus" /> Nuevo producto
          </span>
        </div>

        <section className="stats" aria-label="Métricas de admin">
          <div className="stat">
            <div className="stat__label">Pedidos esta semana</div>
            <div className="stat__value">23</div>
            <div className="stat__delta">+18% vs anterior</div>
          </div>
          <div className="stat">
            <div className="stat__label">Ingresos</div>
            <div className="stat__value">$486k</div>
            <div className="stat__delta">+22%</div>
          </div>
          <div className="stat">
            <div className="stat__label">En producción</div>
            <div className="stat__value">7</div>
            <div className="stat__delta">2 listos hoy</div>
          </div>
          <div className="stat">
            <div className="stat__label">A despachar</div>
            <div className="stat__value">4</div>
            <div className="stat__delta stat__delta--down">1 atrasado</div>
          </div>
        </section>

        <section className="admin__row">
          <div id="pedidos">
            <div
              className="flex-row"
              style={{ justifyContent: "space-between", marginBottom: 16 }}
            >
              <h3 style={{ margin: 0 }}>Últimos pedidos</h3>
              <span className="option-group__link">Ver todos →</span>
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>{formatMoney(order.total)}</td>
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
                .filter(
                  (order) => order.status === "prod" || order.status === "new",
                )
                .slice(0, 4)
                .map((order) => (
                  <div
                    className="card flex-row"
                    key={order.id}
                    style={{ justifyContent: "space-between", padding: 14 }}
                  >
                    <div>
                      <strong>{order.id}</strong>
                      <div className="caption">
                        {order.customer} · {order.items} prendas
                      </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section
          className="section"
          id="productos"
          style={{ paddingBottom: 0 }}
        >
          <div className="admin__head">
            <div>
              <Eyebrow>Catálogo</Eyebrow>
              <h1>Productos</h1>
            </div>
            <span className="btn btn--primary">
              <Icon name="plus" /> Nuevo producto
            </span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Talles</th>
                <th>Colores</th>
                <th>Diseños</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const visual = getProductDesignVisual(product);
                return (
                  <tr key={product.id}>
                    <td style={{ width: 56 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: "var(--cream-200)",
                          borderRadius: "var(--r-sm)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <GarmentPlaceholder
                          type={getGarmentType(product)}
                          color={getProductBaseColor(product)}
                          designShape={visual.shape}
                          designColor={visual.color}
                        />
                      </div>
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatMoney(product.basePriceCents)}</td>
                    <td>{product.sizes.length}</td>
                    <td>{product.colors.length}</td>
                    <td>{product.designs.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="section" id="disenos" style={{ paddingBottom: 0 }}>
          <div className="admin__head">
            <div>
              <Eyebrow>Diseños propios</Eyebrow>
              <h1>Mis estampas</h1>
            </div>
            <span className="btn btn--primary">
              <Icon name="plus" /> Subir diseño
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 16,
            }}
          >
            {designVisuals.map((design) => (
              <div
                className="card text-center"
                key={design.id}
                style={{ padding: 16 }}
              >
                <div
                  style={{
                    aspectRatio: "1",
                    background: "var(--cream-100)",
                    borderRadius: "var(--r-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <svg viewBox="-20 -20 40 40" width="80" height="80">
                    <DesignSvg shape={design.shape} color={design.color} />
                  </svg>
                </div>
                <strong>{design.name}</strong>
                <div className="caption">Usado en productos activos</div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="section"
          id="configuracion"
          style={{ paddingBottom: 0 }}
        >
          <div className="admin__head">
            <div>
              <Eyebrow>Configuración</Eyebrow>
              <h1>Ajustes comerciales</h1>
            </div>
          </div>
          <div
            className="card"
            style={{ padding: "var(--sp-6)", maxWidth: 760 }}
          >
            <h3 style={{ marginTop: 0 }}>Política de envíos</h3>
            <div className="field-grid">
              <div className="field">
                <label>Tarifa hasta 3 km</label>
                <input className="input" defaultValue="2500" />
              </div>
              <div className="field">
                <label>Adicional cada 0,5 km</label>
                <input className="input" defaultValue="400" />
              </div>
            </div>
            <div className="field">
              <label>Cambios y devoluciones</label>
              <textarea
                className="textarea"
                rows={5}
                defaultValue="Aceptamos cambios dentro de los 15 días corridos desde la entrega, siempre que la prenda no haya sido usada ni lavada. Por ser productos personalizados, las prendas con nombre no admiten devolución salvo defecto de fábrica."
              />
            </div>
            <span className="btn btn--primary">Guardar cambios</span>
          </div>
        </section>
      </main>
    </div>
  );
}
