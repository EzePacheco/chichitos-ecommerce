import { notFound } from "next/navigation";
import { saveDesignAction } from "@/features/admin/server/actions";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { DesignEditor } from "@/features/admin/ui/DesignEditor";
import { getAdminDesignBySlug } from "@/server/catalog/admin-designs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminDesignPage({ params }: PageProps) {
  const { slug } = await params;
  const design = await getAdminDesignBySlug(slug);

  if (!design) notFound();

  return (
    <div className="admin-editor-page">
      <AdminPageHeader
        backHref="/admin/disenos"
        backLabel="Diseños"
        eyebrow="Diseños propios"
        title={design.name}
        subtitle="Actualizá la estampa y sus datos comerciales."
      />
      <DesignEditor action={saveDesignAction} design={design} lockSlug />
    </div>
  );
}
