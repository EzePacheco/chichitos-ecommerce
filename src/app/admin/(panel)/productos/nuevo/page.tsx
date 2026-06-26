import { saveCatalogProductAction } from "@/app/admin/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminShell";
import { ProductEditor } from "@/features/admin/components/ProductEditor";

export default function NewAdminProductPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Catálogo" title="Nuevo producto" />
      <ProductEditor action={saveCatalogProductAction} />
    </>
  );
}
