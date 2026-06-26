import { saveDesignAction } from "@/app/admin/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminShell";
import { DesignEditor } from "@/features/admin/components/DesignEditor";

export default function NewAdminDesignPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Diseños propios" title="Nuevo diseño" />
      <DesignEditor action={saveDesignAction} />
    </>
  );
}
