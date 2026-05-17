import Link from "next/link";
import {
  Eyebrow,
  GarmentPlaceholder,
  Icon,
} from "@/components/ui/design-system";
import {
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
} from "@/features/catalog/design";
import { getActiveCatalogProducts } from "@/features/catalog/data/featured-products";
import { formatMoney } from "@/lib/money";

export default function CarritoPage() {
  const items = getActiveCatalogProducts()
    .slice(0, 2)
    .map((product, index) => ({
      product,
      quantity: index + 1,
      size: product.sizes[index]?.label ?? product.sizes[0]?.label ?? "Único",
      color: product.colors[index]?.name ?? product.colors[0]?.name ?? "Crema",
      design:
        product.designs[index]?.name ??
        product.designs[0]?.name ??
        "Diseño propio",
    }));
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.basePriceCents * item.quantity,
    0,
  );
  const shipping = 250000;
  const total = subtotal + shipping;

  return (
    <section className="cart">
      <div className="container">
        <Eyebrow>Tu carrito</Eyebrow>
        <h1 className="display-l mt-2">Carrito</h1>

        <div className="cart__layout mt-6">
          <div className="cart__items">
            {items.map((item) => {
              const visual = getProductDesignVisual(item.product);
              return (
                <article className="cart-line" key={item.product.id}>
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
                      <span>Talle {item.size}</span>
                      <span>{item.color}</span>
                      <span>Diseño: {item.design}</span>
                      <span>Nombre: sin personalizar</span>
                    </div>
                    <div className="mt-2">
                      <div
                        className="qty"
                        aria-label={`Cantidad de ${item.product.name}`}
                      >
                        <button type="button" aria-label="Restar cantidad">
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" aria-label="Sumar cantidad">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cart-line__col-right">
                    <span className="cart-line__price">
                      {formatMoney(item.product.basePriceCents * item.quantity)}
                    </span>
                    <button className="cart-line__remove" type="button">
                      <Icon
                        name="trash"
                        size={14}
                        style={{ verticalAlign: -2 }}
                      />{" "}
                      Quitar
                    </button>
                  </div>
                </article>
              );
            })}

            <div className="mt-4">
              <Link className="btn btn--ghost" href="/catalogo">
                <Icon name="chevronL" /> Seguir comprando
              </Link>
            </div>
          </div>

          <aside>
            <div className="summary">
              <h3>Resumen</h3>
              <div className="summary__row">
                <span>Subtotal ({items.length} prendas)</span>
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
              <Link className="btn btn--primary btn--lg" href="/checkout">
                Continuar al pago <Icon name="chevronR" />
              </Link>
              <p className="caption text-center mt-4">
                Pagás con Mercado Pago. Producción a pedido en 5-7 días.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
