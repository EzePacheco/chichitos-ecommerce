import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/features/admin/ui/AdminEmptyState";
import { AdminFeedback } from "@/features/admin/ui/AdminFeedback";
import { formatMoney } from "@/shared/formatting/money";
import { SearchParamToast } from "@/shared/ui/SearchParamToast";
import { ProductStatusToggle } from "@/features/admin/ui/ProductStatusToggle";
import { getAdminCatalogProducts } from "@/server/catalog/admin-catalog";
import { isSupabaseCatalogConfigured } from "@/server/catalog/public-catalog";

type PageProps = {
  searchParams?: Promise<{
    catalog?: string | string[];
    q?: string | string[];
    status?: string | string[];
    category?: string | string[];
  }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = firstParam(params?.catalog);
  const q = firstParam(params?.q)?.trim().toLocaleLowerCase("es") ?? "";
  const statusFilter = firstParam(params?.status) ?? "";
  const categoryFilter = firstParam(params?.category) ?? "";
  const products = await getAdminCatalogProducts();
  const configured = isSupabaseCatalogConfigured();
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const filteredProducts = products.filter((product) => {
    if (statusFilter && product.status !== statusFilter) return false;
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (!q) return true;
    return [product.name, product.category, product.summary]
      .join(" ")
      .toLocaleLowerCase("es")
      .includes(q);
  });
  const hasFilters = Boolean(q || statusFilter || categoryFilter);

  return (
    <>
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Productos"
        subtitle="Administrá publicaciones, opciones y stock desde una ficha única."
        action={
          <Button asChild variant="primary">
            <Link href="/admin/productos/nuevo">
              <Plus size={20} /> Nuevo producto
            </Link>
          </Button>
        }
      />

      <SearchParamToast
        param="catalog"
        messages={{
          saved: "Producto guardado. Ya se ve en la tienda.",
          "status-saved": "Estado actualizado.",
        }}
      />

      {status === "status-error" ? (
        <AdminFeedback tone="error">
          No pudimos actualizar el estado del producto. Probá nuevamente.
        </AdminFeedback>
      ) : null}

      {!configured ? (
        <AdminFeedback tone="info">
          El catálogo real requiere Supabase configurado.
        </AdminFeedback>
      ) : null}

      <form className="admin-toolbar" method="get">
        <label className="admin-toolbar__search">
          <span className="sr-only">Buscar productos</span>
          <Search size={18} />
          <input
            className="input"
            defaultValue={firstParam(params?.q) ?? ""}
            name="q"
            placeholder="Nombre o categoría"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select className="select" defaultValue={statusFilter} name="status">
            <option value="">Todos los estados</option>
            <option value="active">Publicados</option>
            <option value="draft">Borradores</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por categoría</span>
          <select
            className="select"
            defaultValue={categoryFilter}
            name="category"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="primary">
          Aplicar
        </Button>
        {hasFilters ? (
          <Button asChild variant="ghost">
            <Link href="/admin/productos">Limpiar</Link>
          </Button>
        ) : null}
      </form>

      {filteredProducts.length === 0 ? (
        <AdminEmptyState
          title={hasFilters ? "No encontramos productos" : "Creá tu primer producto"}
          description={
            hasFilters
              ? "Probá con otros filtros o una búsqueda más corta."
              : "Cargá la prenda, sus opciones y stock para publicarla en la tienda."
          }
          action={
            hasFilters
              ? { href: "/admin/productos", label: "Limpiar filtros" }
              : {
                  href: "/admin/productos/nuevo",
                  label: "Crear producto",
                }
          }
        />
      ) : (
        <>
          <div className="admin-resource-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Talles</th>
                  <th>Colores</th>
                  <th>Diseños</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link href={`/admin/productos/${product.slug}`}>
                        <strong>{product.name}</strong>
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`status ${
                          product.status === "active"
                            ? "status--done"
                            : "status--new"
                        }`}
                      >
                        {product.status === "active" ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatMoney(product.basePriceCents)}</td>
                    <td>{product.sizes.length}</td>
                    <td>{product.colors.length}</td>
                    <td>{product.designs.length}</td>
                    <td>
                      <ProductStatusToggle
                        productId={product.id}
                        productName={product.name}
                        slug={product.slug}
                        status={product.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-resource-cards">
            {filteredProducts.map((product) => (
              <article className="card admin-resource-card" key={product.id}>
                <Link href={`/admin/productos/${product.slug}`}>
                  <div className="admin-resource-card__head">
                    <strong>{product.name}</strong>
                    <span
                      className={`status ${
                        product.status === "active"
                          ? "status--done"
                          : "status--new"
                      }`}
                    >
                      {product.status === "active" ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                  <span className="caption">
                    {product.category} · {formatMoney(product.basePriceCents)}
                  </span>
                  <span className="caption">
                    {product.sizes.length} talles · {product.colors.length} colores
                  </span>
                </Link>
                <ProductStatusToggle
                  productId={product.id}
                  productName={product.name}
                  slug={product.slug}
                  status={product.status}
                />
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
