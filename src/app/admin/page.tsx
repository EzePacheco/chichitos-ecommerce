import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Check,
  ChevronLeft,
  Home,
  Info,
  Layers,
  Package,
  Plus,
  Settings,
  Store,
} from "lucide-react";
import { saveCatalogProductAction, saveStoreSettingsAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  DesignSvg,
  Eyebrow,
  GarmentPlaceholder,
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
import {
  getAdminCatalogProducts,
  slugifyCatalogValue,
} from "@/server/catalog/admin-catalog";
import { isSupabaseCatalogConfigured } from "@/server/catalog/public-catalog";
import { getAdminOrderSummaries } from "@/server/orders/admin-orders";
import {
  formatCentsForAdminInput,
  formatDecimalForAdminInput,
  getMissingStoreSettingsFields,
  getStoreSettings,
  isStoreSettingsOnboardingComplete,
} from "@/server/settings/store-settings";

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

type AdminPageProps = {
  searchParams?: Promise<{
    settings?: string | string[];
    catalog?: string | string[];
  }>;
};

function getAdminDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? "admin";
  const firstToken = localPart.split(/[._-]/)[0] || "admin";

  return `${firstToken.charAt(0).toUpperCase()}${firstToken.slice(1)}`;
}

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const settingsStatus = getFirstSearchParam(params?.settings);
  const catalogStatus = getFirstSearchParam(params?.catalog);
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
              <Info size={20} />
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

  const products = isSupabaseCatalogConfigured()
    ? await getAdminCatalogProducts()
    : getActiveCatalogProducts();
  const firstProduct = products[0];
  const storeSettings = await getStoreSettings();
  const missingSettingsFields = getMissingStoreSettingsFields(storeSettings);
  const settingsComplete = isStoreSettingsOnboardingComplete(storeSettings);
  const orders = await getAdminOrderSummaries();
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
            <Home size={18} /> Dashboard
          </a>
          <a href="#pedidos">
            <Package size={18} /> Pedidos
          </a>
          <a href="#productos">
            <Store size={18} /> Productos
          </a>
          <a href="#disenos">
            <Layers size={18} /> Diseños
          </a>
          <a href="#configuracion">
            <Settings size={18} /> Configuración
          </a>
        </nav>
        <div style={{ marginTop: "auto" }}>
          <Button asChild variant="soft" size="sm">
            <Link href="/">
              <ChevronLeft size={16} /> Volver a la tienda
            </Link>
          </Button>
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
          <a className="btn btn--primary" href="#producto-form">
            <Plus size={20} /> Nuevo producto
          </a>
        </div>

        <section className="stats" aria-label="Métricas de admin">
          <div className="stat">
            <div className="stat__label">Pedidos esta semana</div>
            <div className="stat__value">{orders.length}</div>
            <div className="stat__delta">Pedidos registrados</div>
          </div>
          <div className="stat">
            <div className="stat__label">Ingresos</div>
            <div className="stat__value">
              {formatMoney(orders.reduce((acc, order) => acc + order.totalCents, 0))}
            </div>
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
                      <strong>{order.publicCode}</strong>
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
                      <strong>{order.publicCode}</strong>
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
            <a className="btn btn--primary" href="#producto-form">
              <Plus size={20} /> Nuevo producto
            </a>
          </div>

          {catalogStatus === "saved" ? (
            <div className="disclaimer" style={{ maxWidth: 760 }}>
              <Check size={20} />
              <div>El producto se guardó y el catálogo público fue refrescado.</div>
            </div>
          ) : null}

          {catalogStatus === "invalid" ? (
            <div className="disclaimer" style={{ maxWidth: 760 }}>
              <Info size={20} />
              <div>
                No pudimos guardar el producto. Revisá nombre, precio, color,
                talles, diseños, stock e imagen.
              </div>
            </div>
          ) : null}

          {!isSupabaseCatalogConfigured() ? (
            <div className="disclaimer" style={{ maxWidth: 760 }}>
              <Info size={20} />
              <div>
                El admin de catálogo real requiere variables Supabase reales.
                Mientras tanto se muestra el catálogo mock.
              </div>
            </div>
          ) : null}

          <form
            action={saveCatalogProductAction}
            className="card"
            id="producto-form"
            style={{
              marginBottom: "var(--sp-6)",
              padding: "var(--sp-6)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Producto</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="productName">Nombre</label>
                <input
                  className="input"
                  id="productName"
                  name="name"
                  defaultValue={firstProduct?.name ?? ""}
                />
              </div>
              <div className="field">
                <label htmlFor="productSlug">Slug</label>
                <input
                  className="input"
                  id="productSlug"
                  name="slug"
                  defaultValue={
                    firstProduct ? slugifyCatalogValue(firstProduct.slug) : ""
                  }
                />
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="productCategory">Categoría</label>
                <select
                  className="select"
                  id="productCategory"
                  name="category"
                  defaultValue={firstProduct?.category ?? "remeras"}
                >
                  <option value="remeras">Remeras</option>
                  <option value="bodies">Bodies</option>
                  <option value="abrigos">Abrigos</option>
                  <option value="sets">Sets</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="productStatus">Estado</label>
                <select
                  className="select"
                  id="productStatus"
                  name="status"
                  defaultValue={firstProduct?.status ?? "draft"}
                >
                  <option value="draft">Borrador</option>
                  <option value="active">Activo</option>
                </select>
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="productPrice">Precio base en pesos</label>
                <input
                  className="input"
                  id="productPrice"
                  name="basePrice"
                  inputMode="numeric"
                  defaultValue={
                    firstProduct
                      ? String(Math.round(firstProduct.basePriceCents / 100))
                      : ""
                  }
                />
              </div>
              <label className="radio-card" htmlFor="productFeatured">
                <input
                  id="productFeatured"
                  name="featured"
                  type="checkbox"
                  defaultChecked={firstProduct?.featured ?? false}
                />
                <div>
                  <h4 className="radio-card__title">Destacado</h4>
                  <p className="radio-card__sub">Aparece en la home.</p>
                </div>
              </label>
            </div>
            <div className="field">
              <label htmlFor="productSummary">Resumen</label>
              <input
                className="input"
                id="productSummary"
                name="summary"
                defaultValue={firstProduct?.summary ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="productDescription">Descripción</label>
              <textarea
                className="textarea"
                id="productDescription"
                name="description"
                rows={3}
                defaultValue={firstProduct?.description ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="productImage">Imagen principal</label>
              <input
                className="input"
                id="productImage"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
              />
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="productSizes">Talles: código|label|nota</label>
                <textarea
                  className="textarea"
                  id="productSizes"
                  name="sizes"
                  rows={5}
                  defaultValue={
                    firstProduct?.sizes
                      .map((size) =>
                        [size.id, size.label, size.note ?? ""].join("|"),
                      )
                      .join("\n") ?? "2|2|\n4|4|\n6|6|"
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="productColors">Colores: código|nombre|hex</label>
                <textarea
                  className="textarea"
                  id="productColors"
                  name="colors"
                  rows={5}
                  defaultValue={
                    firstProduct?.colors
                      .map((color) => [color.id, color.name, color.hex].join("|"))
                      .join("\n") ?? "natural|Natural|#fcf7ec"
                  }
                />
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="productDesigns">
                  Diseños: slug|nombre|resumen|extra pesos
                </label>
                <textarea
                  className="textarea"
                  id="productDesigns"
                  name="designs"
                  rows={5}
                  defaultValue={
                    firstProduct?.designs
                      .map((design) =>
                        [
                          design.id,
                          design.name,
                          design.summary,
                          Math.round((design.extraPriceCents ?? 0) / 100),
                        ].join("|"),
                      )
                      .join("\n") ?? "bosque|Bosque de amigos|Animalitos y hojas|0"
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="productStock">
                  Stock: talle|color|diseño|cantidad|si/no
                </label>
                <textarea
                  className="textarea"
                  id="productStock"
                  name="stock"
                  rows={5}
                  defaultValue={
                    firstProduct?.stock
                      ?.map((stock) =>
                        [
                          stock.sizeCode,
                          stock.colorCode,
                          stock.designId ?? "",
                          stock.quantityAvailable,
                          stock.trackStock ? "si" : "no",
                        ].join("|"),
                      )
                      .join("\n") ?? "2|natural|bosque|10|si"
                  }
                />
              </div>
            </div>
            <h3>Personalización</h3>
            <div className="field-grid">
              <label className="radio-card" htmlFor="personalizationEnabled">
                <input
                  id="personalizationEnabled"
                  name="personalizationEnabled"
                  type="checkbox"
                  defaultChecked={firstProduct?.personalization.enabled ?? true}
                />
                <div>
                  <h4 className="radio-card__title">Permite personalizar</h4>
                  <p className="radio-card__sub">Nombre, inicial o frase corta.</p>
                </div>
              </label>
              <div className="field">
                <label htmlFor="personalizationPrice">Extra en pesos</label>
                <input
                  className="input"
                  id="personalizationPrice"
                  name="personalizationPrice"
                  inputMode="numeric"
                  defaultValue={
                    firstProduct
                      ? String(
                          Math.round(
                            firstProduct.personalization.extraPriceCents / 100,
                          ),
                        )
                      : "0"
                  }
                />
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="personalizationLabel">Label</label>
                <input
                  className="input"
                  id="personalizationLabel"
                  name="personalizationLabel"
                  defaultValue={
                    firstProduct?.personalization.label ?? "Nombre o frase corta"
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="productionTime">Tiempo de producción</label>
                <input
                  className="input"
                  id="productionTime"
                  name="productionTime"
                  defaultValue={firstProduct?.productionTime ?? ""}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="personalizationDescription">Descripción</label>
              <textarea
                className="textarea"
                id="personalizationDescription"
                name="personalizationDescription"
                rows={2}
                defaultValue={firstProduct?.personalization.description ?? ""}
              />
            </div>
            <Button type="submit" variant="primary">
              <Check size={20} /> Guardar producto
            </Button>
          </form>
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
              <Plus size={20} /> Subir diseño
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
            <span
              className={`status ${settingsComplete ? "status--done" : "status--new"}`}
            >
              {settingsComplete
                ? "Configuración completa"
                : "Onboarding pendiente"}
            </span>
          </div>

          {!settingsComplete ? (
            <div className="disclaimer" style={{ maxWidth: 760 }}>
              <Info size={20} />
              <div>
                <strong>Completá la configuración inicial.</strong>
                <p style={{ margin: "4px 0 0" }}>
                  Falta: {missingSettingsFields.join(", ")}. Estos datos se van
                  a usar para checkout, envíos y mensajes públicos.
                </p>
              </div>
            </div>
          ) : null}

          {settingsStatus === "saved" ? (
            <div className="disclaimer" style={{ maxWidth: 760 }}>
              <Check size={20} />
              <div>Los ajustes comerciales se guardaron correctamente.</div>
            </div>
          ) : null}

          {settingsStatus === "invalid" ? (
            <div className="disclaimer" style={{ maxWidth: 760 }}>
              <Info size={20} />
              <div>
                No pudimos guardar los ajustes. Revisá WhatsApp, distancias y
                precios antes de volver a intentar.
              </div>
            </div>
          ) : null}

          <form
            action={saveStoreSettingsAction}
            className="card"
            style={{ padding: "var(--sp-6)", maxWidth: 920 }}
          >
            <h3 style={{ marginTop: 0 }}>Datos de tienda</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="storeName">Nombre de tienda</label>
                <input
                  className="input"
                  id="storeName"
                  name="storeName"
                  defaultValue={storeSettings.store_name}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsappNumber">WhatsApp</label>
                <input
                  className="input"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  inputMode="tel"
                  placeholder="Ej: +54 9 11 1234 5678"
                  defaultValue={storeSettings.whatsapp_number ?? ""}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="storeAddress">Dirección/origen del taller</label>
              <input
                className="input"
                id="storeAddress"
                name="storeAddress"
                placeholder="Dirección usada para calcular envíos"
                defaultValue={storeSettings.store_address ?? ""}
              />
            </div>

            <h3>Política de envíos</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="deliveryBaseRadiusKm">Radio base en km</label>
                <input
                  className="input"
                  id="deliveryBaseRadiusKm"
                  name="deliveryBaseRadiusKm"
                  inputMode="decimal"
                  defaultValue={formatDecimalForAdminInput(
                    storeSettings.delivery_base_radius_km,
                  )}
                />
              </div>
              <div className="field">
                <label htmlFor="deliveryBasePrice">Tarifa base en pesos</label>
                <input
                  className="input"
                  id="deliveryBasePrice"
                  name="deliveryBasePrice"
                  inputMode="numeric"
                  defaultValue={formatCentsForAdminInput(
                    storeSettings.delivery_base_price_cents,
                  )}
                />
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="deliveryExtraStepKm">
                  Tramo adicional en km
                </label>
                <input
                  className="input"
                  id="deliveryExtraStepKm"
                  name="deliveryExtraStepKm"
                  inputMode="decimal"
                  defaultValue={formatDecimalForAdminInput(
                    storeSettings.delivery_extra_step_km,
                  )}
                />
              </div>
              <div className="field">
                <label htmlFor="deliveryExtraStepPrice">
                  Adicional por tramo en pesos
                </label>
                <input
                  className="input"
                  id="deliveryExtraStepPrice"
                  name="deliveryExtraStepPrice"
                  inputMode="numeric"
                  defaultValue={formatCentsForAdminInput(
                    storeSettings.delivery_extra_step_price_cents,
                  )}
                />
              </div>
            </div>

            <h3>Producción y personalización</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="defaultPersonalizationExtraPrice">
                  Costo default de personalización en pesos
                </label>
                <input
                  className="input"
                  id="defaultPersonalizationExtraPrice"
                  name="defaultPersonalizationExtraPrice"
                  inputMode="numeric"
                  defaultValue={formatCentsForAdminInput(
                    storeSettings.default_personalization_extra_price_cents,
                  )}
                />
              </div>
              <label className="radio-card" htmlFor="checkoutEnabled">
                <input
                  id="checkoutEnabled"
                  name="checkoutEnabled"
                  type="checkbox"
                  defaultChecked={storeSettings.checkout_enabled}
                />
                <div>
                  <h4 className="radio-card__title">Checkout habilitado</h4>
                  <p className="radio-card__sub">
                    Usalo cuando ya estén listos envío, pagos y operación.
                  </p>
                </div>
              </label>
            </div>

            <div className="field">
              <label htmlFor="productionTimeText">Tiempos de producción</label>
              <textarea
                className="textarea"
                id="productionTimeText"
                name="productionTimeText"
                rows={3}
                defaultValue={storeSettings.production_time_text}
              />
            </div>
            <div className="field">
              <label htmlFor="changesReturnsPolicy">
                Cambios y devoluciones
              </label>
              <textarea
                className="textarea"
                id="changesReturnsPolicy"
                name="changesReturnsPolicy"
                rows={5}
                defaultValue={storeSettings.changes_returns_policy}
              />
            </div>
            <Button type="submit" variant="primary">
              <Check size={20} /> Guardar cambios
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
