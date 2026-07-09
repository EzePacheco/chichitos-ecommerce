import type { Metadata } from "next";
import CatalogScreen from "@/screens/store/CatalogScreen";

export const metadata: Metadata = {
  title: "Catálogo | Chichitos",
  description:
    "Catálogo de ropa infantil Chichitos con prendas estampadas a pedido, talles, colores y diseños propios.",
};

export const dynamic = "force-dynamic";

export default CatalogScreen;
