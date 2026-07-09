import { CatalogView } from "@/features/catalog/ui/CatalogView";
import { getPublicCatalogProducts } from "@/server/catalog/public-catalog";

export default async function CatalogoPage() {
  const products = await getPublicCatalogProducts();
  return <CatalogView products={products} />;
}
