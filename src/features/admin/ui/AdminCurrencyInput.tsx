import type { ComponentPropsWithoutRef } from "react";

type AdminCurrencyInputProps = ComponentPropsWithoutRef<"input">;

export function AdminCurrencyInput({
  className = "input",
  ...props
}: AdminCurrencyInputProps) {
  return (
    <div className="admin-currency-input">
      <span aria-hidden="true">$</span>
      <input className={className} {...props} />
    </div>
  );
}
