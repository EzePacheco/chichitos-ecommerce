import { CheckoutView } from "@/features/catalog/components/CheckoutView";
import { getActiveCatalogProducts } from "@/features/catalog/data/featured-products";

export default function CheckoutPage() {
  return <CheckoutView initialProducts={getActiveCatalogProducts()} />;
}
