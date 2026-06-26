import { CartView } from "@/features/catalog/components/CartView";
import { getPublicCatalogProducts } from "@/server/catalog/public-catalog";

export const dynamic = "force-dynamic";

export default async function CarritoPage() {
  return <CartView initialProducts={await getPublicCatalogProducts()} />;
}
