import { notFound } from "next/navigation";
import { saveCatalogProductAction } from "@/features/admin/server/actions";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { ProductEditor } from "@/features/admin/ui/ProductEditor";
import { getAdminCatalogProducts } from "@/server/catalog/admin-catalog";
import { getProductEditorDesignOptions } from "@/server/catalog/queries/product-editor-design-options";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [products, availableDesigns] = await Promise.all([
    getAdminCatalogProducts(),
    getProductEditorDesignOptions(),
  ]);
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader eyebrow="Catálogo" title={product.name} />
      <ProductEditor
        action={saveCatalogProductAction}
        availableDesigns={availableDesigns}
        lockSlug
        product={product}
      />
    </>
  );
}
