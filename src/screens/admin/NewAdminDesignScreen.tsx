import { saveDesignAction } from "@/features/admin/server/actions";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { DesignEditor } from "@/features/admin/ui/DesignEditor";

export default function NewAdminDesignPage() {
  return (
    <>
      <AdminPageHeader eyebrow="Diseños propios" title="Nuevo diseño" />
      <DesignEditor action={saveDesignAction} />
    </>
  );
}
