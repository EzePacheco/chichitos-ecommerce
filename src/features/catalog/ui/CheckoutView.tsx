"use client";

import { useRef, useState } from "react";
import { Eyebrow } from "@/shared/ui/design-system";
import { createCheckoutRedirect } from "../api/checkout-api";
import type { CheckoutStoreSettings } from "../model/checkout-settings";
import {
  buildCheckoutPayload,
  initialBuyerForm,
  initialDeliveryForm,
} from "../model/checkout-form";
import {
  calculateCheckoutTotals,
  type DeliveryMethod,
} from "../model/checkout-pricing";
import { useHydratedCartItems } from "../model/cart-storage";
import type { CatalogProduct } from "../model/catalog-products";
import { BuyerStep } from "./checkout/BuyerStep";
import { CheckoutEmpty } from "./checkout/CheckoutEmpty";
import { CheckoutSteps, type CheckoutStep } from "./checkout/CheckoutSteps";
import { CheckoutSummaryPanel } from "./checkout/CheckoutSummaryPanel";
import { DeliveryStep } from "./checkout/DeliveryStep";
import { PaymentStep } from "./checkout/PaymentStep";

type CheckoutViewProps = {
  initialProducts: CatalogProduct[];
  storeSettings: CheckoutStoreSettings;
};

export function CheckoutView({
  initialProducts,
  storeSettings,
}: CheckoutViewProps) {
  const items = useHydratedCartItems(initialProducts);
  const [step, setStep] = useState<CheckoutStep>(1);
  const [method, setMethod] = useState<DeliveryMethod>("envio");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [buyer, setBuyer] = useState(initialBuyerForm);
  const [delivery, setDelivery] = useState(initialDeliveryForm);
  const idempotencyKey = useRef<string | null>(null);

  const totals = calculateCheckoutTotals({
    items,
    method,
    deliveryBasePriceCents: storeSettings.delivery_base_price_cents,
  });

  async function startCheckout() {
    setSubmitting(true);
    setError(null);

    idempotencyKey.current ??= crypto.randomUUID();
    const result = await createCheckoutRedirect({
      idempotencyKey: idempotencyKey.current,
      payload: buildCheckoutPayload({ items, buyer, delivery, method }),
    });

    if (!result.ok) {
      setSubmitting(false);
      setError(result.title);
      return;
    }

    window.location.href = result.redirectUrl;
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

        <CheckoutSteps step={step} />

        <div className="checkout__grid">
          <div>
            {step === 1 ? (
              <BuyerStep
                buyer={buyer}
                setBuyer={setBuyer}
                onNext={() => setStep(2)}
              />
            ) : null}
            {step === 2 ? (
              <DeliveryStep
                delivery={delivery}
                deliveryBasePriceCents={storeSettings.delivery_base_price_cents}
                method={method}
                shippingCents={totals.shippingCents}
                setDelivery={setDelivery}
                setMethod={setMethod}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            ) : null}
            {step === 3 ? (
              <PaymentStep
                error={error}
                submitting={submitting}
                totalCents={totals.totalCents}
                onBack={() => setStep(2)}
                onSubmit={startCheckout}
              />
            ) : null}
          </div>

          <CheckoutSummaryPanel
            items={items}
            method={method}
            shippingCents={totals.shippingCents}
            subtotalCents={totals.subtotalCents}
            totalCents={totals.totalCents}
          />
        </div>
      </div>
    </section>
  );
}
