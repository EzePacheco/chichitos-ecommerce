"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Eyebrow } from "@/components/ui/design-system";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import {
  catalogCategoryLabels,
  type CatalogProduct,
  type ProductCategory,
} from "../data/featured-products";

type CatalogViewProps = {
  products: CatalogProduct[];
};

type SortKey = "featured" | "price-asc" | "price-desc";

function getUniqueSizes(products: CatalogProduct[]) {
  const sizes = new Map<string, string>();
  for (const product of products) {
    for (const size of product.sizes) {
      sizes.set(size.id, size.label);
    }
  }
  return Array.from(sizes, ([id, label]) => ({ id, label }));
}

function getUniqueColors(products: CatalogProduct[]) {
  const colors = new Map<string, { name: string; hex: string }>();
  for (const product of products) {
    for (const color of product.colors) {
      colors.set(color.id, { name: color.name, hex: color.hex });
    }
  }
  return Array.from(colors, ([id, value]) => ({ id, ...value }));
}

export function CatalogView({ products }: CatalogViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">(
    "all",
  );
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [customOnly, setCustomOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  const sizes = useMemo(() => getUniqueSizes(products), [products]);
  const colors = useMemo(() => getUniqueColors(products), [products]);
  const categoryEntries = useMemo(() => {
    const counts = new Map<ProductCategory, number>();
    for (const product of products) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }
    return (Object.keys(catalogCategoryLabels) as ProductCategory[])
      .filter((category) => counts.has(category))
      .map((category) => ({
        id: category,
        label: catalogCategoryLabels[category],
      }));
  }, [products]);

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      if (categoryFilter !== "all" && product.category !== categoryFilter)
        return false;
      if (sizeFilter && !product.sizes.some((s) => s.id === sizeFilter))
        return false;
      if (colorFilter && !product.colors.some((c) => c.id === colorFilter))
        return false;
      if (customOnly && !product.personalization.enabled) return false;
      return true;
    });

    if (sort === "price-asc") {
      result.sort((a, b) => a.basePriceCents - b.basePriceCents);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.basePriceCents - a.basePriceCents);
    }

    return result;
  }, [products, categoryFilter, sizeFilter, colorFilter, customOnly, sort]);

  const hasFilters =
    categoryFilter !== "all" ||
    sizeFilter !== null ||
    colorFilter !== null ||
    customOnly;

  function clearFilters() {
    setCategoryFilter("all");
    setSizeFilter(null);
    setColorFilter(null);
    setCustomOnly(false);
  }

  return (
    <section className="catalog">
      <div className="container">
        <div style={{ marginBottom: "var(--sp-8)" }}>
          <Eyebrow>Catálogo completo</Eyebrow>
          <h1 className="display-l" style={{ margin: "8px 0 0" }}>
            Todas las prendas
          </h1>
        </div>

        <div className="catalog__layout">
          <aside className="filters" aria-label="Filtros de catálogo">
            <div className="filter-group">
              <h4>Prenda</h4>
              <div className="filter-row">
                <button
                  type="button"
                  className={`chip ${categoryFilter === "all" ? "is-active" : ""}`}
                  onClick={() => setCategoryFilter("all")}
                >
                  Todo
                </button>
                {categoryEntries.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    className={`chip ${categoryFilter === category.id ? "is-active" : ""}`}
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Talle</h4>
              <div className="filter-row">
                {sizes.map((size) => (
                  <button
                    type="button"
                    key={size.id}
                    className={`chip ${sizeFilter === size.id ? "is-active" : ""}`}
                    onClick={() =>
                      setSizeFilter(sizeFilter === size.id ? null : size.id)
                    }
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Color base</h4>
              <div className="filter-row" style={{ gap: 10 }}>
                {colors.map((color) => (
                  <button
                    type="button"
                    key={color.id}
                    aria-label={color.name}
                    title={color.name}
                    className={`swatch ${colorFilter === color.id ? "is-active" : ""}`}
                    style={{ background: color.hex }}
                    onClick={() =>
                      setColorFilter(colorFilter === color.id ? null : color.id)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Diseño</h4>
              <label
                style={{
                  alignItems: "center",
                  cursor: "pointer",
                  display: "flex",
                  fontSize: "var(--fs-body-sm)",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  checked={customOnly}
                  onChange={(event) => setCustomOnly(event.target.checked)}
                />
                Sólo personalizables
              </label>
            </div>

            {hasFilters ? (
              <button
                type="button"
                className="chip chip--dashed"
                onClick={clearFilters}
                style={{ alignSelf: "flex-start" }}
              >
                <X size={14} /> Limpiar filtros
              </button>
            ) : null}
          </aside>

          <div>
            <div className="catalog__toolbar">
              <span className="catalog__count">
                {filtered.length} prenda{filtered.length === 1 ? "" : "s"}
              </span>
              <select
                className="select"
                style={{ maxWidth: 220 }}
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label="Ordenar catálogo"
              >
                <option value="featured">Destacados primero</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No encontramos nada con esos filtros"
                action={
                  <Button variant="ghost" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                }
              >
                Probá quitando alguno o escribinos por WhatsApp y vemos juntos.
              </EmptyState>
            ) : (
              <div className="product-grid">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
