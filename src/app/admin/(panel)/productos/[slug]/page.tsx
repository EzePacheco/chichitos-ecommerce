import { notFound } from "next/navigation";
import { saveCatalogProductAction } from "@/app/admin/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminShell";
import { ProductEditor } from "@/features/admin/components/ProductEditor";
import { getAdminCatalogProducts } from "@/server/catalog/admin-catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminProductPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await getAdminCatalogProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader eyebrow="Catálogo" title={product.name} />
      <ProductEditor action={saveCatalogProductAction} lockSlug product={product} />
    </>
  );
}
