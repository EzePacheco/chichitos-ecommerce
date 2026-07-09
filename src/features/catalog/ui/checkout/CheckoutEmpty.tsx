import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function CheckoutEmpty({ title, text }: { title: string; text: string }) {
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
