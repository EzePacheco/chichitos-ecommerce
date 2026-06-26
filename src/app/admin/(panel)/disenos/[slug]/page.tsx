import { notFound } from "next/navigation";
import { saveDesignAction } from "@/app/admin/actions";
import { AdminPageHeader } from "@/features/admin/components/AdminShell";
import { DesignEditor } from "@/features/admin/components/DesignEditor";
import { getAdminDesignBySlug } from "@/server/catalog/admin-designs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminDesignPage({ params }: PageProps) {
  const { slug } = await params;
  const design = await getAdminDesignBySlug(slug);

  if (!design) notFound();

  return (
    <>
      <AdminPageHeader eyebrow="Diseños propios" title={design.name} />
      <DesignEditor action={saveDesignAction} design={design} lockSlug />
    </>
  );
}
