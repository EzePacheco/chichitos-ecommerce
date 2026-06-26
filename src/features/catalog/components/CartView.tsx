"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Trash2 } from "lucide-react";
import {
  Eyebrow,
  GarmentPlaceholder,
} from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Stepper } from "@/components/ui/Stepper";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
} from "../design";
import { formatMoney } from "@/lib/money";
import {
  removeStoredCartItem,
  updateStoredCartItemQuantity,
  useHydratedCartItems,
} from "../cart-storage";
import type { CatalogProduct } from "../data/featured-products";

type CartItem = {
  id: string;
  product: CatalogProduct;
  qty: number;
  sizeLabel: string;
  colorName: string;
  colorId: string;
  designName: string;
  designId: string;
  sizeId: string;
  personalName?: string | null;
};

type CartViewProps = {
  initialProducts: CatalogProduct[];
};

const SHIPPING_CENTS = 250000;

function itemUnitPriceCents(item: CartItem) {
  const design = item.product.designs.find((candidate) => candidate.id === item.designId);
  const personalization =
    item.personalName && item.product.personalization.enabled
      ? item.product.personalization.extraPriceCents
      : 0;

  return item.product.basePriceCents + (design?.extraPriceCents ?? 0) + personalization;
}

export function CartView({ initialProducts }: CartViewProps) {
  const items = useHydratedCartItems(initialProducts);

  const subtotal = items.reduce(
    (acc, item) => acc + itemUnitPriceCents(item) * item.qty,
    0,
  );
  const shipping = items.length > 0 ? SHIPPING_CENTS : 0;
  const total = subtotal + shipping;

  function updateQty(id: string, qty: number) {
    updateStoredCartItemQuantity(id, qty);
  }

  function removeItem(id: string) {
    removeStoredCartItem(id);
  }

  if (items.length === 0) {
    return (
      <section className="cart">
        <div className="container">
          <Eyebrow>Tu carrito</Eyebrow>
          <h1 className="display-l" style={{ margin: "8px 0 32px" }}>
            Carrito
          </h1>
          <EmptyState
            icon={ShoppingBag}
            title="Tu carrito todavía no tiene nada"
            action={
              <Button asChild variant="primary">
                <Link href="/catalogo">
                  <ShoppingBag size={18} /> Ir al catálogo
                </Link>
              </Button>
            }
          >
            Elegí una prenda, configurá el diseño y volvemos a vernos por acá.
          </EmptyState>
        </div>
      </section>
    );
  }

  return (
    <section className="cart">
      <div className="container">
        <Eyebrow>Tu carrito</Eyebrow>
        <h1 className="display-l" style={{ margin: "8px 0 32px" }}>
          Carrito
        </h1>

        <div className="cart__layout">
          <div className="cart__items">
            {items.map((item) => {
              const visual = getProductDesignVisual(item.product);
              return (
                <article className="cart-line" key={item.id}>
                  <div className="cart-line__media">
                    <GarmentPlaceholder
                      type={getGarmentType(item.product)}
                      color={getProductBaseColor(item.product)}
                      designShape={visual.shape}
                      designColor={visual.color}
                    />
                  </div>
                  <div className="cart-line__body">
                    <h3 className="cart-line__title">{item.product.name}</h3>
                    <div className="cart-line__meta">
                      <span>Talle {item.sizeLabel}</span>
                      <span>{item.colorName}</span>
                      <span>Diseño: {item.designName}</span>
                      {item.personalName ? (
                        <span>Nombre: {item.personalName}</span>
                      ) : null}
                    </div>
                    <div className="mt-2">
                      <Stepper
                        value={item.qty}
                        onChange={(qty) => updateQty(item.id, qty)}
                        max={20}
                      />
                    </div>
                  </div>
                  <div className="cart-line__col-right">
                    <span className="cart-line__price">
                      {formatMoney(itemUnitPriceCents(item) * item.qty)}
                    </span>
                    <button
                      type="button"
                      className="cart-line__remove"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={14} style={{ verticalAlign: -2 }} /> Quitar
                    </button>
                  </div>
                </article>
              );
            })}

            <div className="mt-4">
              <Button asChild variant="ghost">
                <Link href="/catalogo">
                  <ChevronLeft size={20} /> Seguir comprando
                </Link>
              </Button>
            </div>
          </div>

          <aside>
            <div className="summary">
              <h3>Resumen</h3>
              <div className="summary__row">
                <span>
                  Subtotal ({items.length} prenda{items.length === 1 ? "" : "s"}
                  )
                </span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="summary__row">
                <span>Envío estimado</span>
                <span>{formatMoney(shipping)}</span>
              </div>
              <div className="summary__row summary__row--total">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
              <Button asChild variant="primary" size="lg">
                <Link href="/checkout">
                  Continuar al pago <ChevronRight size={20} />
                </Link>
              </Button>
              <p
                className="caption text-center"
                style={{ marginTop: 12, marginBottom: 0 }}
              >
                Pagás con Mercado Pago. Producción a pedido en 5-7 días.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
