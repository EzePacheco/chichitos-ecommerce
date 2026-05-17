import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/money";
import {
  buildProductWhatsAppHref,
  catalogCategoryLabels,
  getActiveCatalogProducts,
  getCatalogProductBySlug,
} from "@/features/catalog/data/featured-products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveCatalogProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Chichitos",
    };
  }

  return {
    title: `${product.name} | Chichitos`,
    description: product.summary,
  };
}

export default async function ProductoPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const whatsappHref = buildProductWhatsAppHref(product, process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

  return (
    <section className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Miga de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link href="/catalogo">Catalogo</Link>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          <article className="card product-visual-card" aria-label={`Vista ilustrada de ${product.name}`}>
            <div className="product-detail-art" style={{ "--accent-color": product.accentColor } as CSSProperties}>
              <span className="product-detail-art-shape" aria-hidden="true" />
            </div>
            <div className="button-row" aria-label="Etiquetas de producto">
              {product.badges.map((badge) => (
                <span className="chip" key={badge}>
                  {badge}
                </span>
              ))}
            </div>
          </article>

          <div className="product-info-stack">
            <div>
              <span className="eyebrow">{catalogCategoryLabels[product.category]}</span>
              <h1 className="display product-title">{product.name}</h1>
              <p className="lead">{product.description}</p>
            </div>

            <div className="card product-buy-panel">
              <div className="price-stack">
                <span>Precio base</span>
                <strong>{formatMoney(product.basePriceCents)}</strong>
              </div>
              <p>
                El precio final se confirma server-side al agregar al carrito: prenda, talle, color, diseno, personalizacion y envio.
              </p>
              <div className="button-row">
                <span className="button button-disabled" aria-disabled="true">
                  Carrito en siguiente corte
                </span>
                {whatsappHref ? (
                  <a className="button button-ghost" href={whatsappHref} target="_blank" rel="noreferrer">
                    Consultar por WhatsApp
                  </a>
                ) : (
                  <span className="chip">WhatsApp pendiente</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="product-options-grid" aria-label="Opciones del producto">
          <article className="card product-option-card">
            <span className="eyebrow">Talles</span>
            <h2>Talle disponible</h2>
            <div className="option-list">
              {product.sizes.map((size) => (
                <span className="option-pill" key={size.id} title={size.note}>
                  {size.label}
                </span>
              ))}
            </div>
          </article>

          <article className="card product-option-card">
            <span className="eyebrow">Colores</span>
            <h2>Color de prenda</h2>
            <div className="option-list">
              {product.colors.map((color) => (
                <span className="option-pill color-option" key={color.id}>
                  <span className="color-swatch" style={{ "--swatch-color": color.hex } as CSSProperties} aria-hidden="true" />
                  {color.name}
                </span>
              ))}
            </div>
          </article>

          <article className="card product-option-card product-option-card-wide">
            <span className="eyebrow">Disenos propios</span>
            <h2>Estampas aplicables</h2>
            <div className="design-list">
              {product.designs.map((design) => (
                <div className="design-option" key={design.id}>
                  <strong>{design.name}</strong>
                  <span>{design.summary}</span>
                  {design.extraPriceCents ? <small>Extra {formatMoney(design.extraPriceCents)}</small> : null}
                </div>
              ))}
            </div>
          </article>

          <article className="card product-option-card product-option-card-wide">
            <span className="eyebrow">Personalizacion</span>
            <h2>{product.personalization.label}</h2>
            <p>{product.personalization.description}</p>
            {product.personalization.enabled ? (
              <strong>Extra estimado: {formatMoney(product.personalization.extraPriceCents)}</strong>
            ) : (
              <strong>No disponible para este producto</strong>
            )}
          </article>
        </div>

        <div className="card production-note">
          <span className="eyebrow">Produccion</span>
          <p>{product.productionTime}</p>
        </div>
      </div>
    </section>
  );
}
