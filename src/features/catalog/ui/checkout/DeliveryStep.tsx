import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { formatMoney } from "@/shared/formatting/money";
import type { DeliveryForm } from "../../model/checkout-form";
import type { DeliveryMethod } from "../../model/checkout-pricing";

type DeliveryStepProps = {
  delivery: DeliveryForm;
  deliveryBasePriceCents: number;
  method: DeliveryMethod;
  shippingCents: number;
  setDelivery: Dispatch<SetStateAction<DeliveryForm>>;
  setMethod: (method: DeliveryMethod) => void;
  onBack: () => void;
  onNext: () => void;
};

export function DeliveryStep({
  delivery,
  deliveryBasePriceCents,
  method,
  shippingCents,
  setDelivery,
  setMethod,
  onBack,
  onNext,
}: DeliveryStepProps) {
  return (
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
          <DeliveryField
            id="addr"
            label="Dirección"
            value={delivery.addr}
            onChange={(addr) => setDelivery((current) => ({ ...current, addr }))}
          />
          <div className="field-grid">
            <DeliveryField
              id="city"
              label="Ciudad"
              value={delivery.city}
              onChange={(city) =>
                setDelivery((current) => ({ ...current, city }))
              }
            />
            <DeliveryField
              id="cp"
              label="Código postal"
              value={delivery.cp}
              onChange={(cp) => setDelivery((current) => ({ ...current, cp }))}
            />
          </div>
          <small>
            Calculamos la distancia final antes de abrir Mercado Pago. Tarifa
            base: {formatMoney(deliveryBasePriceCents)}.
          </small>
        </div>
      ) : null}

      <div
        className="flex-row"
        style={{ justifyContent: "space-between", marginTop: "var(--sp-6)" }}
      >
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={20} /> Volver
        </Button>
        <Button variant="primary" onClick={onNext}>
          Continuar al pago <ChevronRight size={20} />
        </Button>
      </div>
    </div>
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

function DeliveryField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
