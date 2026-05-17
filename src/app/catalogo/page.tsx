import type { Metadata } from "next";
import { Eyebrow, Icon } from "@/components/ui/design-system";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import {
  getActiveCatalogProducts,
  getCatalogCategories,
} from "@/features/catalog/data/featured-products";

export const metadata: Metadata = {
  title: "Catálogo | Chichitos",
  description:
    "Catálogo de ropa infantil Chichitos con prendas estampadas a pedido, talles, colores y diseños propios.",
};

const sizeFilters = ["0-12m", "2", "4", "6", "8", "10", "12"];
const colorFilters = [
  { label: "Crema", hex: "#F7EFE0" },
  { label: "Blanco", hex: "#FCF7EC" },
  { label: "Durazno", hex: "#F5C9A8" },
  { label: "Salvia", hex: "#B4C9A4" },
  { label: "Celeste", hex: "#B7D2E6" },
  { label: "Coral", hex: "#E08868" },
  { label: "Mostaza", hex: "#E4B254" },
  { label: "Rosa", hex: "#F2B9B9" },
];

export default function CatalogoPage() {
  const products = getActiveCatalogProducts();
  const categories = getCatalogCategories(products);

  return (
    <section className="catalog">
      <div className="container">
        <div className="section__head">
          <Eyebrow>Catálogo completo</Eyebrow>
          <h1 className="display-l">Todas las prendas</h1>
          <p>
            Productos mock tipados para validar el flujo visual fiel al UI Kit
            antes de conectar Supabase.
          </p>
        </div>

        <div className="catalog__layout">
          <aside className="filters" aria-label="Filtros de catálogo">
            <div className="filter-group">
              <h4>Prenda</h4>
              <div className="filter-row">
                <span className="chip is-active">Todo</span>
                {categories.map((category) => (
                  <a
                    className="chip"
                    href={`#categoria-${category.id}`}
                    key={category.id}
                  >
                    {category.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Talle</h4>
              <div className="filter-row">
                {sizeFilters.map((size) => (
                  <span className="chip" key={size}>
                    {size}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Color base</h4>
              <div className="filter-row" style={{ gap: 10 }}>
                {colorFilters.map((color, index) => (
                  <span
                    aria-label={color.label}
                    className={`swatch ${index === 0 ? "is-active" : ""}`}
                    key={color.label}
                    style={{ background: color.hex }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Diseño</h4>
              <span className="chip chip--dashed">
                <Icon name="sparkles" size={14} /> Sólo personalizables
              </span>
            </div>
          </aside>

          <div>
            <div className="catalog__toolbar">
              <span className="catalog__count">{products.length} prendas</span>
              <select
                className="select"
                defaultValue="featured"
                aria-label="Ordenar catálogo"
                style={{ maxWidth: 220 }}
              >
                <option value="featured">Destacados primero</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="newest">Lo más nuevo</option>
              </select>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
