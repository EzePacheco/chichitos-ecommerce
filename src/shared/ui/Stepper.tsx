"use client";

import { Minus, Plus } from "lucide-react";

type StepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
};

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Cantidad",
}: StepperProps) {
  return (
    <div className="qty" aria-label={label}>
      <button
        type="button"
        aria-label="Restar"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus size={16} />
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label="Sumar"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
