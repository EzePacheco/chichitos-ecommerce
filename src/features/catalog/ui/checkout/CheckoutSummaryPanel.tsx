import { GarmentPlaceholder } from "@/features/catalog/ui/GarmentVisuals";
import { formatMoney } from "@/shared/formatting/money";
import type { HydratedCartItem } from "../../model/cart-storage";
import type { DeliveryMethod } from "../../model/checkout-pricing";
import { getCheckoutItemUnitPriceCents } from "../../model/checkout-pricing";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
} from "../../model/design";

type CheckoutSummaryPanelProps = {
  items: HydratedCartItem[];
  method: DeliveryMethod;
  shippingCents: number;
  subtotalCents: number;
  totalCents: number;
};

export function CheckoutSummaryPanel({
  items,
  method,
  shippingCents,
  subtotalCents,
  totalCents,
}: CheckoutSummaryPanelProps) {
  return (
    <aside>
      <div className="summary">
        <h3>Tu pedido</h3>
        <div className="flex-col" style={{ gap: 12, marginBottom: 16 }}>
          {items.map((item) => (
            <CheckoutSummaryItem item={item} key={item.id} />
          ))}
        </div>
        <div className="summary__row">
          <span>Subtotal</span>
          <span>{formatMoney(subtotalCents)}</span>
        </div>
        <div className="summary__row">
          <span>{method === "retiro" ? "Retiro" : "Envío"}</span>
          <span>{shippingCents === 0 ? "Sin cargo" : formatMoney(shippingCents)}</span>
        </div>
        <div className="summary__row summary__row--total">
          <span>Total</span>
          <span>{formatMoney(totalCents)}</span>
        </div>
      </div>
    </aside>
  );
}

function CheckoutSummaryItem({ item }: { item: HydratedCartItem }) {
  const visual = getProductDesignVisual(item.product);

  return (
    <div className="flex-row" style={{ gap: 12 }}>
      <div
        style={{
          alignItems: "center",
          background: "var(--surface)",
          borderRadius: "var(--r-md)",
          display: "flex",
          flexShrink: 0,
          height: 56,
          justifyContent: "center",
          width: 56,
        }}
      >
        <GarmentPlaceholder
          type={getGarmentType(item.product)}
          color={getProductBaseColor(item.product)}
          designShape={visual.shape}
          designColor={visual.color}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600 }}>
          {item.product.name}
        </div>
        <div className="caption">
          {item.sizeLabel} · {item.designName} · x{item.qty}
        </div>
      </div>
      <strong style={{ fontSize: "var(--fs-body-sm)" }}>
        {formatMoney(getCheckoutItemUnitPriceCents(item) * item.qty)}
      </strong>
    </div>
  );
}
