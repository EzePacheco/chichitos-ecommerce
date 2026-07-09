"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Stepper } from "@/shared/ui/Stepper";
import { formatMoney } from "@/shared/formatting/money";

type ProductActionsProps = {
  added: boolean;
  onAddToCart: () => void;
  qty: number;
  setQty: (qty: number) => void;
  totalCents: number;
  whatsappHref?: string;
};

export function ProductActions({
  added,
  onAddToCart,
  qty,
  setQty,
  totalCents,
  whatsappHref,
}: ProductActionsProps) {
  return (
    <>
      <div className="option-group">
        <span className="option-group__label">Cantidad</span>
        <div className="mt-2">
          <Stepper value={qty} onChange={setQty} max={20} />
        </div>
      </div>

      <div className="product__cta-row">
        <Button variant="primary" size="lg" onClick={onAddToCart}>
          <ShoppingBag size={20} /> Sumar al carrito · {formatMoney(totalCents * qty)}
        </Button>
        {added ? (
          <Button asChild variant="soft" size="lg">
            <Link href="/carrito">Ver carrito</Link>
          </Button>
        ) : null}
        {whatsappHref ? (
          <Button asChild variant="ghost" size="lg">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
          </Button>
        ) : (
          <Button asChild variant="ghost" size="lg">
            <Link href="/catalogo">Consultar por WhatsApp</Link>
          </Button>
        )}
      </div>
    </>
  );
}
