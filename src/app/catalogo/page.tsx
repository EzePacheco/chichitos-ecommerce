import type { Metadata } from "next";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import {
  getActiveCatalogProducts,
  getCatalogCategories,
  getProductsByCategory,
} from "@/features/catalog/data/featured-products";

export const metadata: Metadata = {
  title: "Catalogo | Chichitos",
  description: "Catalogo de ropa infantil Chichitos con prendas estampadas a pedido, talles, colores y disenos propios.",
};

export default function CatalogoPage() {
  const products = getActiveCatalogProducts();
  const categories = getCatalogCategories(products);

  return (
    <>
      <section className="catalog-hero">
        <div className="container catalog-hero-grid">
          <div className="catalog-copy">
            <span className="eyebrow">Catalogo</span>
            <h1 className="display">Prendas listas para convertir en una pieza unica.</h1>
            <p className="lead">
              Cada producto se arma a pedido: elegis talle, color, diseno propio de Chichitos y personalizacion cuando aplique.
            </p>
            <div className="category-strip" aria-label="Categorias del catalogo">
              {categories.map((category) => (
                <a className="chip" href={`#categoria-${category.id}`} key={category.id}>
                  {category.label} ({category.count})
                </a>
              ))}
            </div>
          </div>
          <aside className="card catalog-summary" aria-label="Resumen del catalogo">
            <strong>{products.length} productos activos</strong>
            <p>Mock tipado para validar navegacion publica antes de conectar Supabase y el admin.</p>
            <span className="chip">Produccion a pedido</span>
          </aside>
        </div>
      </section>

      {categories.map((category) => {
        const categoryProducts = getProductsByCategory(category.id, products);

        return (
          <section className="section catalog-section" id={`categoria-${category.id}`} key={category.id}>
            <div className="container">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{category.label}</span>
                  <h2 className="section-title">{category.label} para combinar.</h2>
                </div>
                <p className="lead">
                  Precios base visibles para orientar la compra. El precio final se recalcula server-side en checkout.
                </p>
              </div>
              <div className="product-grid">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section">
        <div className="container">
          <div className="card catalog-notice">
            <span className="eyebrow">Siguiente corte</span>
            <h2>Configuracion y carrito.</h2>
            <p>
              Este incremento deja navegacion publica y detalle por producto. El proximo paso conecta la seleccion de talle, color, diseno y personalizacion con el carrito.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
