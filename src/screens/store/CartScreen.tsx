import { CartView } from "@/features/catalog/ui/CartView";
import { getPublicCatalogProducts } from "@/server/catalog/public-catalog";

export default async function CarritoPage() {
  return <CartView initialProducts={await getPublicCatalogProducts()} />;
}
