import Link from "next/link";
import {
  Eyebrow,
  GarmentPlaceholder,
  Icon,
} from "@/components/ui/design-system";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
} from "@/features/catalog/design";
import { getActiveCatalogProducts } from "@/features/catalog/data/featured-products";
import { formatMoney } from "@/lib/money";

export default function CheckoutPage() {
  const items = getActiveCatalogProducts()
    .slice(0, 2)
    .map((product) => ({ product, quantity: 1 }));
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.basePriceCents * item.quantity,
    0,
  );
  const shipping = 250000;
  const total = subtotal + shipping;

  return (
    <section className="checkout">
      <div className="container">
        <Eyebrow>Estás a un paso</Eyebrow>
        <h1 className="display-l mt-2">Finalizar compra</h1>

        <div className="checkout__steps mt-6" aria-label="Pasos del checkout">
          <div className="checkout-step is-done">
            <span className="checkout-step__num">
              <Icon name="check" size={14} />
            </span>
            <span className="checkout-step__label">Tus datos</span>
          </div>
          <div className="checkout-step is-active">
            <span className="checkout-step__num">2</span>
            <span className="checkout-step__label">Entrega</span>
          </div>
          <div className="checkout-step">
            <span className="checkout-step__num">3</span>
            <span className="checkout-step__label">Pago</span>
          </div>
        </div>

        <div className="checkout__grid">
          <div className="flex-col" style={{ gap: "var(--sp-6)" }}>
            <div className="card" style={{ padding: "var(--sp-6)" }}>
              <h3 style={{ marginTop: 0 }}>Tus datos</h3>
              <div className="field-grid">
                <div className="field">
                  <label>Nombre</label>
                  <input className="input" defaultValue="Camila" />
                </div>
                <div className="field">
                  <label>Apellido</label>
                  <input className="input" defaultValue="Reyes" />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  defaultValue="camila@correo.com"
                />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label>Teléfono</label>
                  <input className="input" defaultValue="+54 11 4444 0000" />
                </div>
                <div className="field">
                  <label>DNI</label>
                  <input className="input" defaultValue="38.000.000" />
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--sp-6)" }}>
              <h3 style={{ marginTop: 0 }}>¿Cómo lo recibís?</h3>
              <div className="flex-col" style={{ gap: "var(--sp-3)" }}>
                <div className="radio-card is-active">
                  <span className="radio-card__dot" />
                  <div style={{ flex: 1 }}>
                    <h4 className="radio-card__title">Envío a domicilio</h4>
                    <p className="radio-card__sub">
                      CABA y GBA. Tarifa según distancia desde el taller.
                    </p>
                  </div>
                  <strong>{formatMoney(shipping)}</strong>
                </div>
                <div className="radio-card">
                  <span className="radio-card__dot" />
                  <div style={{ flex: 1 }}>
                    <h4 className="radio-card__title">Retiro en el taller</h4>
                    <p className="radio-card__sub">
                      Dirección configurable desde el admin.
                    </p>
                  </div>
                  <strong style={{ color: "var(--salvia-d)" }}>
                    Sin cargo
                  </strong>
                </div>
              </div>

              <div
                className="mt-6"
                style={{
                  background: "var(--cream-100)",
                  borderRadius: "var(--r-lg)",
                  padding: "var(--sp-4)",
                }}
              >
                <div className="field">
                  <label>Dirección</label>
                  <input className="input" defaultValue="Av. Corrientes 1234" />
                </div>
                <div className="field-grid">
                  <div className="field">
                    <label>Ciudad</label>
                    <input className="input" defaultValue="CABA" />
                  </div>
                  <div className="field">
                    <label>Código postal</label>
                    <input className="input" defaultValue="1414" />
                  </div>
                </div>
                <div className="field">
                  <label>
                    Distancia desde el taller: <strong>2,5 km</strong>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.5"
                    defaultValue="2.5"
                    style={{ width: "100%" }}
                  />
                  <small>
                    Hasta 3 km: $2.500 fijo. Después, incremento cada 0,5 km
                    adicional.
                  </small>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "var(--sp-6)" }}>
              <h3 style={{ marginTop: 0 }}>Pago</h3>
              <div className="radio-card is-active">
                <span className="radio-card__dot" />
                <div style={{ flex: 1 }}>
                  <h4 className="radio-card__title">Mercado Pago</h4>
                  <p className="radio-card__sub">
                    Tarjeta, débito, efectivo o cuenta MP. La confirmación real
                    llega por webhook validado.
                  </p>
                </div>
                <svg
                  viewBox="0 0 36 24"
                  width="48"
                  height="32"
                  aria-hidden="true"
                >
                  <rect width="36" height="24" rx="4" fill="#00B1EA" />
                  <text
                    x="18"
                    y="16"
                    textAnchor="middle"
                    fontSize="9"
                    fill="white"
                    fontFamily="sans-serif"
                    fontWeight="700"
                  >
                    MP
                  </text>
                </svg>
              </div>
              <div className="product__cta-row">
                <Link className="btn btn--ghost" href="/carrito">
                  <Icon name="chevronL" /> Volver
                </Link>
                <span
                  className="btn btn--primary btn--lg btn--disabled"
                  aria-disabled="true"
                >
                  <Icon name="card" /> Pagar {formatMoney(total)}
                </span>
              </div>
            </div>
          </div>

          <aside>
            <div className="summary">
              <h3>Tu pedido</h3>
              <div className="flex-col" style={{ gap: 12, marginBottom: 16 }}>
                {items.map((item) => {
                  const visual = getProductDesignVisual(item.product);
                  return (
                    <div
                      className="flex-row"
                      style={{ gap: 12 }}
                      key={item.product.id}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          background: "var(--cream-200)",
                          borderRadius: "var(--r-md)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <GarmentPlaceholder
                          type={getGarmentType(item.product)}
                          color={getProductBaseColor(item.product)}
                          designShape={visual.shape}
                          designColor={visual.color}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "var(--fs-body-sm)",
                            fontWeight: 700,
                          }}
                        >
                          {item.product.name}
                        </div>
                        <div className="caption">
                          {item.product.sizes[0]?.label} ·{" "}
                          {item.product.designs[0]?.name} · ×{item.quantity}
                        </div>
                      </div>
                      <strong style={{ fontSize: "var(--fs-body-sm)" }}>
                        {formatMoney(
                          item.product.basePriceCents * item.quantity,
                        )}
                      </strong>
                    </div>
                  );
                })}
              </div>
              <div className="summary__row">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="summary__row">
                <span>Envío</span>
                <span>{formatMoney(shipping)}</span>
              </div>
              <div className="summary__row summary__row--total">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
