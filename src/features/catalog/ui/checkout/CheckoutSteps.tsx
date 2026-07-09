import { Check } from "lucide-react";

export type CheckoutStep = 1 | 2 | 3;

const steps = [
  { n: 1, label: "Tus datos" },
  { n: 2, label: "Entrega" },
  { n: 3, label: "Pago" },
] as const;

export function CheckoutSteps({ step }: { step: CheckoutStep }) {
  return (
    <div className="checkout__steps" aria-label="Pasos del checkout">
      {steps.map((item) => (
        <div
          key={item.n}
          className={`checkout-step ${step === item.n ? "is-active" : ""} ${
            step > item.n ? "is-done" : ""
          }`}
        >
          <span className="checkout-step__num">
            {step > item.n ? <Check size={14} /> : item.n}
          </span>
          <span className="checkout-step__label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
