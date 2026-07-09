import type { HydratedCartItem } from "./cart-storage";
import type { DeliveryMethod } from "./checkout-pricing";

export type BuyerForm = {
  nombre: string;
  apellido: string;
  email: string;
  tel: string;
  dni: string;
};

export type DeliveryForm = {
  addr: string;
  city: string;
  cp: string;
};

export const initialBuyerForm: BuyerForm = {
  nombre: "",
  apellido: "",
  email: "",
  tel: "",
  dni: "",
};

export const initialDeliveryForm: DeliveryForm = {
  addr: "",
  city: "",
  cp: "",
};

export function buildCheckoutPayload({
  items,
  buyer,
  delivery,
  method,
}: {
  items: HydratedCartItem[];
  buyer: BuyerForm;
  delivery: DeliveryForm;
  method: DeliveryMethod;
}) {
  return {
    items: items.map((item) => ({
      productSlug: item.product.slug,
      quantity: item.qty,
      sizeId: item.sizeId,
      colorId: item.colorId,
      designId: item.designId,
      personalName: item.personalName,
    })),
    buyer: {
      name: [buyer.nombre, buyer.apellido]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(" "),
      email: buyer.email.trim(),
      phone: buyer.tel.trim(),
      dni: buyer.dni.trim(),
    },
    delivery: {
      method,
      addressLine: delivery.addr.trim(),
      city: delivery.city.trim(),
      postalCode: delivery.cp.trim(),
    },
  };
}
