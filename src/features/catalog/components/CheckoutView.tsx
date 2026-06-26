"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Eyebrow, GarmentPlaceholder } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/money";
import type { StoreSettingsRecord } from "@/server/settings/store-settings";
import { hydrateCartItems, useHydratedCartItems } from "../cart-storage";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
} from "../design";
import type { CatalogProduct } from "../data/featured-products";

type CheckoutViewProps = {
  initialProducts: CatalogProduct[];
  storeSettings: StoreSettingsRecord;
};

type DeliveryMethod = "envio" | "retiro";

type CheckoutItem = ReturnType<typeof hydrateCartItems>[number];

function itemUnitPriceCents(item: CheckoutItem) {
  const design = item.product.designs.find((candidate) => candidate.id === item.designId);
  const personalization =
    item.personalName && item.product.personalization.enabled
      ? item.product.personalization.extraPriceCents
      : 0;

  return item.product.basePriceCents + (design?.extraPriceCents ?? 0) + personalization;
}

export function CheckoutView({
  initialProducts,
  storeSettings,
}: CheckoutViewProps) {
  const items = useHydratedCartItems(initialProducts);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<DeliveryMethod>("envio");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const idempotencyKey = useRef<string | null>(null);

  const shippingCents = method === "retiro" ? 0 : storeSettings.delivery_base_price_cents;
  const subtotal = items.reduce(
    (acc, item) => acc + itemUnitPriceCents(item) * item.qty,
    0,
  );
  const total = subtotal + shippingCents;

  async function startCheckout() {
    setSubmitting(true);
    setError(null);

    const value = (id: string) =>
      (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ??
      "";
    idempotencyKey.current ??= crypto.randomUUID();
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Idempotency-Key": idempotencyKey.current,
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          productSlug: item.product.slug,
          quantity: item.qty,
          sizeId: item.sizeId,
          colorId: item.colorId,
          designId: item.designId,
          personalName: item.personalName,
        })),
        buyer: {
          name: `${value("nombre")} ${value("apellido")}`.trim(),
          email: value("email"),
          phone: value("tel"),
          dni: value("dni"),
        },
        delivery: {
          method,
          addressLine: value("addr"),
          city: value("city"),
          postalCode: value("cp"),
        },
      }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.redirectUrl) {
      setSubmitting(false);
      setError(data?.title ?? "No pudimos iniciar el pago.");
      return;
    }

    window.location.href = data.redirectUrl;
  }

  if (!storeSettings.checkout_enabled) {
    return (
      <CheckoutEmpty
        title="Checkout todavía no habilitado"
        text="Podés armar tu carrito, pero la compra online se habilita cuando pagos y operación estén configurados."
      />
    );
  }

  if (items.length === 0) {
    return (
      <CheckoutEmpty
        title="Tu carrito está vacío"
        text="Elegí una prenda del catálogo antes de finalizar la compra."
      />
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
                    <Input id="nombre" />
                  </div>
                  <div className="field">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input id="apellido" />
                  </div>
                </div>
                <div className="field">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" />
                </div>
                <div className="field-grid">
                  <div className="field">
                    <Label htmlFor="tel">Teléfono</Label>
                    <Input id="tel" />
                  </div>
                  <div className="field">
                    <Label htmlFor="dni">DNI</Label>
                    <Input id="dni" />
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
                <div className="flex-col" style={{ gap: "var(--sp-3)" }}>
                  <DeliveryButton
                    active={method === "envio"}
                    title="Envío a domicilio"
                    text="Tarifa según distancia desde el taller."
                    price={formatMoney(shippingCents)}
                    onClick={() => setMethod("envio")}
                  />
                  <DeliveryButton
                    active={method === "retiro"}
                    title="Retiro en el taller"
                    text="Dirección configurable desde el admin."
                    price="Sin cargo"
                    onClick={() => setMethod("retiro")}
                  />
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
                      <Input id="addr" />
                    </div>
                    <div className="field-grid">
                      <div className="field">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input id="city" />
                      </div>
                      <div className="field">
                        <Label htmlFor="cp">Código postal</Label>
                        <Input id="cp" />
                      </div>
                    </div>
                    <small>
                      Calculamos la distancia final antes de abrir Mercado Pago.
                      Tarifa base: {formatMoney(storeSettings.delivery_base_price_cents)}.
                    </small>
                  </div>
                ) : null}

                <div className="flex-row" style={{ justifyContent: "space-between", marginTop: "var(--sp-6)" }}>
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
                <div className="radio-card is-active" style={{ cursor: "default" }}>
                  <span className="radio-card__dot" />
                  <div style={{ flex: 1 }}>
                    <h4 className="radio-card__title">Mercado Pago</h4>
                    <p className="radio-card__sub">
                      La confirmación real llega por webhook validado.
                    </p>
                  </div>
                  <strong>MP</strong>
                </div>
                <div className="flex-row" style={{ justifyContent: "space-between", marginTop: "var(--sp-6)" }}>
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ChevronLeft size={20} /> Volver
                  </Button>
                  <Button
                    variant="primary"
                    onClick={startCheckout}
                    disabled={submitting}
                  >
                    <CreditCard size={20} />{" "}
                    {submitting ? "Creando pago..." : `Pagar ${formatMoney(total)}`}
                  </Button>
                </div>
                {error ? (
                  <div className="disclaimer" role="alert">
                    <AlertCircle size={20} />
                    <div>{error}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside>
            <div className="summary">
              <h3>Tu pedido</h3>
              <div className="flex-col" style={{ gap: 12, marginBottom: 16 }}>
                {items.map((item) => {
                  const visual = getProductDesignVisual(item.product);
                  return (
                    <div className="flex-row" style={{ gap: 12 }} key={item.id}>
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
                        <div style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600 }}>
                          {item.product.name}
                        </div>
                        <div className="caption">
                          {item.sizeLabel} · {item.designName} · x{item.qty}
                        </div>
                      </div>
                      <strong style={{ fontSize: "var(--fs-body-sm)" }}>
                        {formatMoney(itemUnitPriceCents(item) * item.qty)}
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
                <span>{shippingCents === 0 ? "Sin cargo" : formatMoney(shippingCents)}</span>
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

function DeliveryButton({
  active,
  title,
  text,
  price,
  onClick,
}: {
  active: boolean;
  title: string;
  text: string;
  price: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`radio-card ${active ? "is-active" : ""}`}
      onClick={onClick}
      style={{ textAlign: "left", font: "inherit" }}
    >
      <span className="radio-card__dot" />
      <div style={{ flex: 1 }}>
        <h4 className="radio-card__title">{title}</h4>
        <p className="radio-card__sub">{text}</p>
      </div>
      <strong>{price}</strong>
    </button>
  );
}

function CheckoutEmpty({ title, text }: { title: string; text: string }) {
  return (
    <section className="checkout">
      <div className="container">
        <div className="empty">
          <div className="empty__art">
            <ShoppingBag size={44} />
          </div>
          <h3>{title}</h3>
          <p>{text}</p>
          <Button asChild variant="primary">
            <Link href="/catalogo">Ir al catálogo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
