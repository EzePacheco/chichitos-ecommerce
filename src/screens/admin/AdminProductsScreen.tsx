import Link from "next/link";
import { Check, Info, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AdminPageHeader } from "@/screens/admin/AdminShell";
import { formatMoney } from "@/shared/formatting/money";
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

      {status === "saved" ? (
        <div className="disclaimer admin__notice">
          <Check size={20} />
          <div>El producto se guardó y el catálogo público fue refrescado.</div>
        </div>
      ) : null}

      {status === "invalid" ? (
        <div className="disclaimer admin__notice">
          <Info size={20} />
          <div>
            No pudimos guardar el producto. Revisá nombre, precio, color, talles,
            diseños, stock e imagen.
          </div>
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
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link href={`/admin/productos/${product.slug}`}>
                  <strong>{product.name}</strong>
                </Link>
              </td>
              <td>{product.status}</td>
              <td>{product.category}</td>
              <td>{formatMoney(product.basePriceCents)}</td>
              <td>{product.sizes.length}</td>
              <td>{product.colors.length}</td>
              <td>{product.designs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
