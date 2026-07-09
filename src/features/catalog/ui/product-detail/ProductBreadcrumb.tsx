import Link from "next/link";

export function ProductBreadcrumb({ productName }: { productName: string }) {
  return (
    <nav className="breadcrumb" aria-label="Migas">
      <Link href="/">Inicio</Link>
      <span style={{ marginInline: 8 }}>›</span>
      <Link href="/catalogo">Catálogo</Link>
      <span style={{ marginInline: 8 }}>›</span>
      <span>{productName}</span>
    </nav>
  );
}
