import Link from "next/link";
import { AlertCircle, Info, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { formatMoney } from "@/shared/formatting/money";
import { SearchParamToast } from "@/shared/ui/SearchParamToast";
import { ProductStatusToggle } from "@/features/admin/ui/ProductStatusToggle";
import { getAdminCatalogProducts } from "@/server/catalog/admin-catalog";
import { isSupabaseCatalogConfigured } from "@/server/catalog/public-catalog";

type PageProps = {
  searchParams?: Promise<{ catalog?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const status = firstParam((await searchParams)?.catalog);
  const products = await getAdminCatalogProducts();
  const configured = isSupabaseCatalogConfigured();

  return (
    <>
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Productos"
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
        <div className="disclaimer admin__notice">
          <AlertCircle size={20} />
          <div>No pudimos actualizar el estado del producto. Probá nuevamente.</div>
        </div>
      ) : null}

      {!configured ? (
        <div className="disclaimer admin__notice">
          <Info size={20} />
          <div>El admin de catálogo real requiere Supabase configurado.</div>
        </div>
      ) : null}

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
          {products.length === 0 ? (
            <tr>
              <td className="table__empty" colSpan={8}>
                Todavía no hay productos cargados. Creá el primero desde
                «Nuevo producto».
              </td>
            </tr>
          ) : null}
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link href={`/admin/productos/${product.slug}`}>
                  <strong>{product.name}</strong>
                </Link>
              </td>
              <td>
                <span
                  className={`status ${
                    product.status === "active" ? "status--done" : "status--new"
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
    </>
  );
}
