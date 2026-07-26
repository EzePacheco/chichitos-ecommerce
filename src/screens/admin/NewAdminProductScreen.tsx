import { saveCatalogProductAction } from "@/features/admin/server/actions";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { ProductEditor } from "@/features/admin/ui/ProductEditor";
import { getProductEditorDesignOptions } from "@/server/catalog/queries/product-editor-design-options";

export default async function NewAdminProductPage() {
  const availableDesigns = await getProductEditorDesignOptions();

  return (
    <>
      <AdminPageHeader eyebrow="Catálogo" title="Nuevo producto" />
      <ProductEditor
        action={saveCatalogProductAction}
        availableDesigns={availableDesigns}
      />
    </>
  );
}
