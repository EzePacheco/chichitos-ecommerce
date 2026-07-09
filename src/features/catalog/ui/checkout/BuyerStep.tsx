import type { Dispatch, SetStateAction } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { BuyerForm } from "../../model/checkout-form";

type BuyerStepProps = {
  buyer: BuyerForm;
  setBuyer: Dispatch<SetStateAction<BuyerForm>>;
  onNext: () => void;
};

export function BuyerStep({ buyer, setBuyer, onNext }: BuyerStepProps) {
  return (
    <div className="card" style={{ padding: "var(--sp-6)" }}>
      <h3 style={{ margin: "0 0 var(--sp-4)" }}>Tus datos</h3>
      <div className="field-grid">
        <BuyerField
          id="nombre"
          label="Nombre"
          value={buyer.nombre}
          onChange={(nombre) => setBuyer((current) => ({ ...current, nombre }))}
        />
        <BuyerField
          id="apellido"
          label="Apellido"
          value={buyer.apellido}
          onChange={(apellido) =>
            setBuyer((current) => ({ ...current, apellido }))
          }
        />
      </div>
      <BuyerField
        id="email"
        label="Email"
        type="email"
        value={buyer.email}
        onChange={(email) => setBuyer((current) => ({ ...current, email }))}
      />
      <div className="field-grid">
        <BuyerField
          id="tel"
          label="Teléfono"
          value={buyer.tel}
          onChange={(tel) => setBuyer((current) => ({ ...current, tel }))}
        />
        <BuyerField
          id="dni"
          label="DNI"
          value={buyer.dni}
          onChange={(dni) => setBuyer((current) => ({ ...current, dni }))}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="primary" onClick={onNext}>
          Continuar <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}

function BuyerField({
  id,
  label,
  value,
  onChange,
  type,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
