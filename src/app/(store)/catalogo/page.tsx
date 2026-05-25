import type { Metadata } from "next";
import { CatalogView } from "@/features/catalog/components/CatalogView";
import { getActiveCatalogProducts } from "@/features/catalog/data/featured-products";

export const metadata: Metadata = {
  title: "Catálogo | Chichitos",
  description:
    "Catálogo de ropa infantil Chichitos con prendas estampadas a pedido, talles, colores y diseños propios.",
};

export default function CatalogoPage() {
  const products = getActiveCatalogProducts();
  return <CatalogView products={products} />;
}
