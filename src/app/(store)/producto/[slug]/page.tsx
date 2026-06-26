import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/features/catalog/components/ProductView";
import {
  buildProductWhatsAppHref,
} from "@/features/catalog/data/featured-products";
import {
  getPublicCatalogProductBySlug,
} from "@/server/catalog/public-catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Chichitos",
    };
  }

  return {
    title: `${product.name} | Chichitos`,
    description: product.summary,
  };
}

export default async function ProductoPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublicCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const whatsappHref = buildProductWhatsAppHref(
    product,
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  );

  return <ProductView product={product} whatsappHref={whatsappHref} />;
}
