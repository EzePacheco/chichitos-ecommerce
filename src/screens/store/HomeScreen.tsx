import Link from "next/link";
import { ChevronRight, CreditCard, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  GarmentPlaceholder,
  GarmentTag,
} from "@/features/catalog/ui/GarmentVisuals";
import { Eyebrow } from "@/shared/ui/design-system";
import { ProductCard } from "@/features/catalog/ui/ProductCard";
import { CatalogDesignArtwork } from "@/features/catalog/ui/CatalogDesignArtwork";
import {
  getFeaturedPublicCatalogProducts,
  getPublicCatalogDesigns,
} from "@/server/catalog/public-catalog";

const steps = [
  {
    n: "01",
    title: "Elegí la prenda",
    text: "Remera, buzo, body o set. Mirá la guía de talles si dudás.",
  },
  {
    n: "02",
    title: "Configurá",
    text: "Talle, color base y diseño DTF. Sumá un nombre si querés personalizar.",
  },
  {
    n: "03",
    title: "Pagás online",
    text: "Con Mercado Pago, en cuotas o efectivo. Todo seguro.",
  },
  {
    n: "04",
    title: "Recibís o retirás",
    text: "Envío a domicilio con tarifa por distancia o retiro en el taller.",
  },
];

async function getHomeDesigns() {
  try {
    return await getPublicCatalogDesigns();
  } catch (error) {
    console.error("catalog.public_designs.read_failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}

export default async function Home() {
  const [featuredProducts, designs] = await Promise.all([
    getFeaturedPublicCatalogProducts(),
    getHomeDesigns(),
  ]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div>
              <div className="hero__eyebrow">
                <Eyebrow>Hecha para jugar, lista para soñar</Eyebrow>
              </div>
              <h1 className="display-xl hero__title">
                Ropa infantil con <span className="script">alma</span> de
                taller.
              </h1>
              <p className="hero__sub">
                Diseños propios, estampados a pedido en nuestro taller con
                tecnología DTF que dura lavado tras lavado. Elegí prenda, talle,
                color y diseño — o sumamos el nombre del chichito.
              </p>
              <div className="hero__ctas">
                <Button asChild variant="primary" size="lg">
                  <Link href="/catalogo">
                    <ShoppingBag size={20} /> Comprar online
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/catalogo">Consultar por WhatsApp</Link>
                </Button>
              </div>
              <div className="trust-strip" aria-label="Beneficios de compra">
                <div className="trust-strip__item">
                  <Truck size={20} />
                  <small>Envío a todo el país</small>
                </div>
                <div className="trust-strip__item">
                  <CreditCard size={20} />
                  <small>Mercado Pago en cuotas</small>
                </div>
                <div className="trust-strip__item">
                  <Sparkles size={20} />
                  <small>Diseños de autoría propia</small>
                </div>
              </div>
            </div>

            <div className="hero__art" aria-hidden="true">
              <span className="hero__star hero__star--1">★</span>
              <span className="hero__star hero__star--2">✦</span>
              <span className="hero__star hero__star--3">★</span>
              <GarmentPlaceholder
                type="Remera"
                color="var(--cream-50)"
                designShape="cloud"
                designColor="var(--celeste)"
                scale={1.4}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head section__head--row">
            <div>
              <Eyebrow>Lo más querido</Eyebrow>
              <h2>Destacados de la semana</h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/catalogo">
                Ver todo el catálogo <ChevronRight size={16} />
              </Link>
            </Button>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="dtf-grid">
            <div>
              <Eyebrow>Diseños propios</Eyebrow>
              <h2>Cada estampa nace acá, en nuestro taller.</h2>
              <p>
                No revendemos diseños de terceros. Cada nubecita, estrellita y
                cohete fue dibujado por nosotros y estampado a pedido con DTF —
                una técnica que mantiene los colores vivos por más de 50
                lavados.
              </p>
              <div className="filter-row mt-4">
                <GarmentTag>Estampa a pedido</GarmentTag>
                <GarmentTag variant="salvia">+50 lavados</GarmentTag>
                <GarmentTag variant="celeste">Sin franquicias</GarmentTag>
              </div>
            </div>
            {designs.length > 0 ? (
              <div className="design-tile-grid" aria-label="Diseños disponibles">
                {designs.map((design) => (
                  <article
                    className="card design-tile"
                    aria-label={design.name}
                    key={design.id}
                    title={design.name}
                  >
                    <CatalogDesignArtwork
                      className="design-tile__image"
                      design={design}
                    />
                  </article>
                ))}
              </div>
            ) : (
              <p className="designs-empty">
                Muy pronto vas a encontrar acá nuestros próximos diseños.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="como-comprar">
        <div className="container">
          <div className="section__head">
            <Eyebrow>Cómo comprar</Eyebrow>
            <h2>Sencillo, sin vueltas.</h2>
            <p>
              Cuatro pasos desde que elegís la prenda hasta que llega a tus
              manos.
            </p>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <article className="step" key={step.n}>
                <div className="step__num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container text-center">
          <Eyebrow color="var(--durazno)">Hecha en Argentina</Eyebrow>
          <h2 className="display-l mt-4">
            Imprimimos cada prenda <span className="script">a pedido</span>, sin
            stock ni desperdicio.
          </h2>
          <div className="mt-6">
            <Button asChild variant="soft" size="lg">
              <Link href="/catalogo">
                <ShoppingBag size={20} /> Ver el catálogo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
