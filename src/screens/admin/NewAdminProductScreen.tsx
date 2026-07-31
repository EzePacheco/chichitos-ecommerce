import { saveCatalogProductAction } from "@/features/admin/server/actions";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { ProductEditor } from "@/features/admin/ui/ProductEditor";
import { getProductEditorDesignOptions } from "@/server/catalog/queries/product-editor-design-options";

export default async function NewAdminProductPage() {
  const availableDesigns = await getProductEditorDesignOptions();

  return (
    <>
      <AdminPageHeader
        backHref="/admin/productos"
        backLabel="Productos"
        eyebrow="Catálogo"
        title="Nuevo producto"
        subtitle="Completá cada sección y revisá la vista previa antes de guardar."
      />
      <ProductEditor
        action={saveCatalogProductAction}
        availableDesigns={availableDesigns}
      />
    </>
  );
}
