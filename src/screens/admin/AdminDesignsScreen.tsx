import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/features/admin/ui/AdminEmptyState";
import { SearchParamToast } from "@/shared/ui/SearchParamToast";
import { formatMoney } from "@/shared/formatting/money";
import { getAdminDesigns } from "@/server/catalog/admin-designs";

type PageProps = {
  searchParams?: Promise<{
    design?: string | string[];
    q?: string | string[];
    status?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDesignsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = firstParam(params?.q)?.trim().toLocaleLowerCase("es") ?? "";
  const statusFilter = firstParam(params?.status) ?? "";
  const designs = await getAdminDesigns();
  const filteredDesigns = designs.filter((design) => {
    if (statusFilter && design.status !== statusFilter) return false;
    if (!q) return true;
    return [design.name, design.summary]
      .join(" ")
      .toLocaleLowerCase("es")
      .includes(q);
  });
  const hasFilters = Boolean(q || statusFilter);

  return (
    <>
      <AdminPageHeader
        eyebrow="Diseños propios"
        title="Diseños"
        subtitle="Organizá estampas y extras sin salir del catálogo."
        action={
          <Button asChild variant="primary">
            <Link href="/admin/disenos/nuevo">
              <Plus size={20} /> Nuevo diseño
            </Link>
          </Button>
        }
      />

      <SearchParamToast
        param="design"
        messages={{ saved: "Diseño guardado correctamente." }}
      />

      <form className="admin-toolbar" method="get">
        <label className="admin-toolbar__search">
          <span className="sr-only">Buscar diseños</span>
          <Search size={18} />
          <input
            className="input"
            defaultValue={firstParam(params?.q) ?? ""}
            name="q"
            placeholder="Nombre o resumen"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select className="select" defaultValue={statusFilter} name="status">
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="draft">Borradores</option>
            <option value="archived">Archivados</option>
          </select>
        </label>
        <Button type="submit" variant="primary">
          Aplicar
        </Button>
        {hasFilters ? (
          <Button asChild variant="ghost">
            <Link href="/admin/disenos">Limpiar</Link>
          </Button>
        ) : null}
      </form>

      {filteredDesigns.length === 0 ? (
        <AdminEmptyState
          title={hasFilters ? "No encontramos diseños" : "Creá tu primer diseño"}
          description={
            hasFilters
              ? "Probá con otra búsqueda o limpiá los filtros."
              : "Cargá una estampa para asociarla a los productos."
          }
          action={
            hasFilters
              ? { href: "/admin/disenos", label: "Limpiar filtros" }
              : { href: "/admin/disenos/nuevo", label: "Crear diseño" }
          }
        />
      ) : (
        <div className="admin-card-grid">
          {filteredDesigns.map((design) => (
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
              <div className="admin-resource-card__head">
                <strong>{design.name}</strong>
                <span
                  className={`status ${
                    design.status === "active" ? "status--done" : "status--new"
                  }`}
                >
                  {design.status === "active"
                    ? "Activo"
                    : design.status === "archived"
                      ? "Archivado"
                      : "Borrador"}
                </span>
              </div>
              <div className="caption">
                {formatMoney(design.baseExtraPriceCents)} · {design.productCount} productos
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
