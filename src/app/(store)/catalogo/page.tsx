import type { Metadata } from "next";
import { CatalogView } from "@/features/catalog/components/CatalogView";
import { getPublicCatalogProducts } from "@/server/catalog/public-catalog";

export const metadata: Metadata = {
  title: "Catálogo | Chichitos",
  description:
    "Catálogo de ropa infantil Chichitos con prendas estampadas a pedido, talles, colores y diseños propios.",
};

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const products = await getPublicCatalogProducts();
  return <CatalogView products={products} />;
}
