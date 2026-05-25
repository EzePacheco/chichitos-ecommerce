import { CartView } from "@/features/catalog/components/CartView";
import { getActiveCatalogProducts } from "@/features/catalog/data/featured-products";

export default function CarritoPage() {
  return <CartView initialProducts={getActiveCatalogProducts()} />;
}
