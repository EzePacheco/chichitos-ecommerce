import Image from "next/image";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { featuredProducts } from "@/features/catalog/data/featured-products";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Hecha para jugar</span>
            <h1 className="display">Ropa infantil con alma de taller.</h1>
            <p className="lead">
              Chichitos crea prendas infantiles estampadas con DTF, disenos propios y produccion a pedido. Elegis prenda, talle, color y diseno; la compra se cierra online y las dudas van por WhatsApp.
            </p>
            <div className="button-row">
              <a className="button button-primary" href="/catalogo">Ver catalogo</a>
              <a className="button button-ghost" href="/checkout">Probar checkout</a>
            </div>
          </div>
          <div className="card hero-logo-card" aria-label="Logo de Chichitos">
            <Image
              src="/brand/logo-chichitos-full.png"
              alt="Chichitos, hecha para jugar lista para sonar"
              width={360}
              height={240}
              priority
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Catalogo inicial</span>
              <h2 className="section-title">Bases listas para combinar con disenos propios.</h2>
            </div>
            <p className="lead">
              Estos datos son placeholders del scaffold. Luego se reemplazan por productos reales desde Supabase y admin.
            </p>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Flujo MVP</span>
              <h2 className="section-title">Simple hoy, preparado para crecer.</h2>
            </div>
          </div>
          <div className="steps-grid">
            <article className="card step-card">
              <strong>1. Configurar</strong>
              <p>El cliente elige talle, color, diseno y personalizacion cuando aplique.</p>
            </article>
            <article className="card step-card">
              <strong>2. Pagar online</strong>
              <p>La orden se crea server-side y Mercado Pago confirma por webhook validado.</p>
            </article>
            <article className="card step-card">
              <strong>3. Producir a pedido</strong>
              <p>El admin simple permite seguir pedido, politicas, envio y configuracion comercial.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
