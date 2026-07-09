import { AlertCircle, ChevronLeft, CreditCard } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatMoney } from "@/shared/formatting/money";

type PaymentStepProps = {
  error: string | null;
  submitting: boolean;
  totalCents: number;
  onBack: () => void;
  onSubmit: () => void;
};

export function PaymentStep({
  error,
  submitting,
  totalCents,
  onBack,
  onSubmit,
}: PaymentStepProps) {
  return (
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
      <div
        className="flex-row"
        style={{ justifyContent: "space-between", marginTop: "var(--sp-6)" }}
      >
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={20} /> Volver
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={submitting}>
          <CreditCard size={20} />{" "}
          {submitting ? "Creando pago..." : `Pagar ${formatMoney(totalCents)}`}
        </Button>
      </div>
      {error ? (
        <div className="disclaimer" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      ) : null}
    </div>
  );
}
