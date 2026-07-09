import { saveCatalogProductAction } from "@/features/admin/server/actions";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { ProductEditor } from "@/features/admin/ui/ProductEditor";

export default function NewAdminProductPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Catálogo" title="Nuevo producto" />
      <ProductEditor action={saveCatalogProductAction} />
    </>
  );
}
