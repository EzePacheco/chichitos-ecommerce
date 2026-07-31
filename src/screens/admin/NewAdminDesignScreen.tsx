import { saveDesignAction } from "@/features/admin/server/actions";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { DesignEditor } from "@/features/admin/ui/DesignEditor";

export default function NewAdminDesignPage() {
  return (
    <>
      <AdminPageHeader
        backHref="/admin/disenos"
        backLabel="Diseños"
        eyebrow="Diseños propios"
        title="Nuevo diseño"
        subtitle="Definí la estampa y revisá su presentación antes de guardar."
      />
      <DesignEditor action={saveDesignAction} />
    </>
  );
}
