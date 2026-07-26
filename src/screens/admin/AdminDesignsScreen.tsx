import Link from "next/link";
import { Check, Info, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { formatMoney } from "@/shared/formatting/money";
import { getAdminDesigns } from "@/server/catalog/admin-designs";

type PageProps = {
  searchParams?: Promise<{ design?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDesignsPage({ searchParams }: PageProps) {
  const status = firstParam((await searchParams)?.design);
  const designs = await getAdminDesigns();

  return (
    <>
      <AdminPageHeader
        eyebrow="Diseños propios"
        title="Diseños"
        action={
          <Button asChild variant="primary">
            <Link href="/admin/disenos/nuevo">
              <Plus size={20} /> Nuevo diseño
            </Link>
          </Button>
        }
      />

      {status === "saved" ? (
        <div className="disclaimer admin__notice">
          <Check size={20} />
          <div>El diseño se guardó correctamente.</div>
        </div>
      ) : null}

      {designs.length === 0 ? (
        <div className="disclaimer admin__notice">
          <Info size={20} />
          <div>
            Todavía no hay diseños cargados. Creá el primero desde «Nuevo diseño».
          </div>
        </div>
      ) : null}

      <div className="admin-card-grid">
        {designs.map((design) => (
          <Link
            className="card admin-design-card"
            href={`/admin/disenos/${design.slug}`}
            key={design.id}
          >
            <div className="admin-design-card__media">
              {design.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={design.imageAlt} src={design.imageUrl} />
              ) : (
                <span>{design.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <strong>{design.name}</strong>
            <div className="caption">{design.status}</div>
            <div className="caption">
              {formatMoney(design.baseExtraPriceCents)} · {design.productCount} productos
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
