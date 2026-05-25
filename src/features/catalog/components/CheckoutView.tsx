"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import {
  Eyebrow,
  GarmentPlaceholder,
} from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/money";
import { calculateShippingCost } from "@/server/shipping/calculate-shipping-cost";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
} from "../design";
import type { CatalogProduct } from "../data/featured-products";

type CheckoutViewProps = {
  initialProducts: CatalogProduct[];
};

type DeliveryMethod = "envio" | "retiro";

const BASE_RADIUS_KM = 3;
const BASE_PRICE_CENTS = 250000;
const EXTRA_STEP_KM = 0.5;
const EXTRA_STEP_PRICE_CENTS = 40000;

export function CheckoutView({ initialProducts }: CheckoutViewProps) {
  const items = useMemo(
    () =>
      initialProducts.slice(0, 2).map((product, index) => ({
        id: `${product.id}-${index}`,
        product,
        qty: 1,
        sizeLabel: product.sizes[0]?.label ?? "Único",
        designName: product.designs[0]?.name ?? "Diseño propio",
      })),
    [initialProducts],
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<DeliveryMethod>("envio");
  const [distanceKm, setDistanceKm] = useState(2.5);
  const [done, setDone] = useState(false);

  const shippingCents =
    method === "retiro"
      ? 0
      : calculateShippingCost({
          distanceKm,
          baseRadiusKm: BASE_RADIUS_KM,
          basePriceCents: BASE_PRICE_CENTS,
          extraStepKm: EXTRA_STEP_KM,
          extraStepPriceCents: EXTRA_STEP_PRICE_CENTS,
        }).totalCents;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.basePriceCents * item.qty,
    0,
  );
  const total = subtotal + shippingCents;

  if (done) {
    return (
      <section className="checkout">
        <div className="container" style={{ maxWidth: 640 }}>
          <div style={{ padding: "var(--sp-12) 0", textAlign: "center" }}>
            <div
              style={{
                alignItems: "center",
                background: "var(--salvia)",
                borderRadius: "var(--r-blob)",
                color: "white",
                display: "flex",
                height: 100,
                justifyContent: "center",
                margin: "0 auto var(--sp-6)",
                width: 100,
              }}
            >
              <Check size={48} strokeWidth={2.5} />
            </div>
            <Eyebrow>Compra confirmada</Eyebrow>
            <h1 className="display-l" style={{ margin: "8px 0 12px" }}>
              ¡Gracias!
            </h1>
            <p
              style={{
                color: "var(--ink-500)",
                margin: "0 auto var(--sp-6)",
                maxWidth: "44ch",
              }}
            >
              Te mandamos un mail con los detalles. Empezamos a imprimir mañana
              y en 5-7 días hábiles está listo. Te avisamos por WhatsApp cuando
              salga el despacho.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <Button asChild variant="primary">
                <Link href="/">Volver al inicio</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/catalogo">Seguir mirando</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="container">
        <Eyebrow>Estás a un paso</Eyebrow>
        <h1 className="display-l" style={{ margin: "8px 0 32px" }}>
          Finalizar compra
        </h1>

        <div className="checkout__steps" aria-label="Pasos del checkout">
          {([
            { n: 1, label: "Tus datos" },
            { n: 2, label: "Entrega" },
            { n: 3, label: "Pago" },
          ] as const).map((s) => (
            <div
              key={s.n}
              className={`checkout-step ${step === s.n ? "is-active" : ""} ${step > s.n ? "is-done" : ""}`}
            >
              <span className="checkout-step__num">
                {step > s.n ? <Check size={14} /> : s.n}
              </span>
              <span className="checkout-step__label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="checkout__grid">
          <div>
            {step === 1 ? (
              <div className="card" style={{ padding: "var(--sp-6)" }}>
                <h3 style={{ margin: "0 0 var(--sp-4)" }}>Tus datos</h3>
                <div className="field-grid">
                  <div className="field">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" defaultValue="Camila" />
                  </div>
                  <div className="field">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input id="apellido" defaultValue="Reyes" />
                  </div>
                </div>
                <div className="field">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="camila@correo.com"
                  />
                </div>
                <div className="field-grid">
                  <div className="field">
                    <Label htmlFor="tel">Teléfono</Label>
                    <Input id="tel" defaultValue="+54 11 4444 0000" />
                  </div>
                  <div className="field">
                    <Label htmlFor="dni">DNI</Label>
                    <Input id="dni" defaultValue="38.000.000" />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="primary" onClick={() => setStep(2)}>
                    Continuar <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="card" style={{ padding: "var(--sp-6)" }}>
                <h3 style={{ margin: "0 0 var(--sp-4)" }}>¿Cómo lo recibís?</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--sp-3)",
                  }}
                >
                  <button
                    type="button"
                    className={`radio-card ${method === "envio" ? "is-active" : ""}`}
                    onClick={() => setMethod("envio")}
                    style={{ textAlign: "left", font: "inherit" }}
                  >
                    <span className="radio-card__dot" />
                    <div style={{ flex: 1 }}>
                      <h4 className="radio-card__title">Envío a domicilio</h4>
                      <p className="radio-card__sub">
                        CABA y GBA. Tarifa según distancia desde el taller.
                      </p>
                    </div>
                    <strong>
                      {method === "envio" ? formatMoney(shippingCents) : "—"}
                    </strong>
                  </button>
                  <button
                    type="button"
                    className={`radio-card ${method === "retiro" ? "is-active" : ""}`}
                    onClick={() => setMethod("retiro")}
                    style={{ textAlign: "left", font: "inherit" }}
                  >
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
                  </button>
                </div>

                {method === "envio" ? (
                  <div
                    className="mt-6"
                    style={{
                      background: "var(--cream-100)",
                      borderRadius: "var(--r-lg)",
                      padding: "var(--sp-4)",
                    }}
                  >
                    <div className="field">
                      <Label htmlFor="addr">Dirección</Label>
                      <Input id="addr" defaultValue="Av. Corrientes 1234" />
                    </div>
                    <div className="field-grid">
                      <div className="field">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input id="city" defaultValue="CABA" />
                      </div>
                      <div className="field">
                        <Label htmlFor="cp">Código postal</Label>
                        <Input id="cp" defaultValue="1414" />
                      </div>
                    </div>
                    <div className="field">
                      <Label htmlFor="dist">
                        Distancia desde el taller:{" "}
                        <strong>{distanceKm.toFixed(1)} km</strong>
                      </Label>
                      <input
                        id="dist"
                        type="range"
                        min="0.5"
                        max="15"
                        step="0.5"
                        value={distanceKm}
                        onChange={(event) =>
                          setDistanceKm(parseFloat(event.target.value))
                        }
                        style={{ width: "100%" }}
                      />
                      <small>
                        Hasta {BASE_RADIUS_KM} km:{" "}
                        {formatMoney(BASE_PRICE_CENTS)} fijo. Después,{" "}
                        {formatMoney(EXTRA_STEP_PRICE_CENTS)} cada{" "}
                        {EXTRA_STEP_KM} km adicional.
                      </small>
                    </div>
                  </div>
                ) : null}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "var(--sp-6)",
                  }}
                >
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ChevronLeft size={20} /> Volver
                  </Button>
                  <Button variant="primary" onClick={() => setStep(3)}>
                    Continuar al pago <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="card" style={{ padding: "var(--sp-6)" }}>
                <h3 style={{ margin: "0 0 var(--sp-4)" }}>Pago</h3>
                <div
                  className="radio-card is-active"
                  style={{ cursor: "default" }}
                >
                  <span className="radio-card__dot" />
                  <div style={{ flex: 1 }}>
                    <h4 className="radio-card__title">Mercado Pago</h4>
                    <p className="radio-card__sub">
                      Tarjeta, débito, efectivo o cuenta MP. La confirmación
                      real llega por webhook validado.
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
                <p
                  style={{
                    color: "var(--ink-500)",
                    fontSize: "var(--fs-body-sm)",
                    marginTop: "var(--sp-6)",
                  }}
                >
                  Al confirmar te redirigimos a Mercado Pago. Volvés a Chichitos
                  al terminar.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "var(--sp-6)",
                  }}
                >
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ChevronLeft size={20} /> Volver
                  </Button>
                  <Button variant="primary" onClick={() => setDone(true)}>
                    <CreditCard size={20} /> Pagar {formatMoney(total)}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <aside>
            <div className="summary">
              <h3>Tu pedido</h3>
              <div
                className="flex-col"
                style={{ gap: 12, marginBottom: 16 }}
              >
                {items.map((item) => {
                  const visual = getProductDesignVisual(item.product);
                  return (
                    <div
                      className="flex-row"
                      style={{ gap: 12 }}
                      key={item.id}
                    >
                      <div
                        style={{
                          alignItems: "center",
                          background: "var(--surface)",
                          borderRadius: "var(--r-md)",
                          display: "flex",
                          flexShrink: 0,
                          height: 56,
                          justifyContent: "center",
                          width: 56,
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
                            fontWeight: 600,
                          }}
                        >
                          {item.product.name}
                        </div>
                        <div className="caption">
                          {item.sizeLabel} · {item.designName} · ×{item.qty}
                        </div>
                      </div>
                      <strong style={{ fontSize: "var(--fs-body-sm)" }}>
                        {formatMoney(item.product.basePriceCents * item.qty)}
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
                <span>{method === "retiro" ? "Retiro" : "Envío"}</span>
                <span>
                  {shippingCents === 0
                    ? "Sin cargo"
                    : formatMoney(shippingCents)}
                </span>
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
