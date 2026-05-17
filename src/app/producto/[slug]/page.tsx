import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DesignSvg,
  Eyebrow,
  GarmentPlaceholder,
  GarmentTag,
  Icon,
} from "@/components/ui/design-system";
import {
  designVisuals,
  getGarmentType,
  getProductBaseColor,
  getProductDesignVisual,
  getProductTagVariant,
} from "@/features/catalog/design";
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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
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

  const whatsappHref = buildProductWhatsAppHref(
    product,
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  );
  const mainDesign = getProductDesignVisual(product);
  const firstColor = getProductBaseColor(product);
  const garmentType = getGarmentType(product);
  const personalizationPrice = product.personalization.enabled
    ? product.personalization.extraPriceCents
    : 0;
  const totalPreview = product.basePriceCents + personalizationPrice;

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Migas">
        <Link href="/">Inicio</Link>
        <span style={{ marginInline: 8 }}>›</span>
        <Link href="/catalogo">Catálogo</Link>
        <span style={{ marginInline: 8 }}>›</span>
        <span>{product.name}</span>
      </nav>

      <section className="product">
        <div className="gallery">
          <div className="gallery__main">
            <GarmentPlaceholder
              type={garmentType}
              color={firstColor}
              designShape={mainDesign.shape}
              designColor={mainDesign.color}
            />
          </div>
          <div className="gallery__thumbs" aria-label="Galería del producto">
            <div className="gallery__thumb is-active">
              <GarmentPlaceholder
                type={garmentType}
                color={firstColor}
                designShape={mainDesign.shape}
                designColor={mainDesign.color}
              />
            </div>
            <div className="gallery__thumb">
              <GarmentPlaceholder
                type={garmentType}
                color={firstColor}
                designShape={null}
              />
            </div>
            <div className="gallery__thumb">
              <GarmentPlaceholder
                type={garmentType}
                color={firstColor}
                designShape={mainDesign.shape}
                designColor={mainDesign.color}
                scale={0.55}
              />
            </div>
          </div>
        </div>

        <div>
          <Eyebrow>{catalogCategoryLabels[product.category]}</Eyebrow>
          {product.badges[0] ? (
            <span style={{ marginLeft: 12 }}>
              <GarmentTag variant={getProductTagVariant(product)}>
                {product.badges[0]}
              </GarmentTag>
            </span>
          ) : null}
          <h1 className="product__title">{product.name}</h1>
          <div className="product__price">
            {formatMoney(totalPreview)}
            {personalizationPrice ? (
              <small>incluye personalización estimada</small>
            ) : null}
          </div>
          <p>{product.description}</p>

          <div className="option-group">
            <div className="option-group__head">
              <span className="option-group__label">
                Talle: <strong>{product.sizes[0]?.label}</strong>
              </span>
              <a className="option-group__link" href="#guia-talles">
                <Icon name="ruler" size={14} style={{ verticalAlign: -2 }} />{" "}
                Guía de talles
              </a>
            </div>
            <div className="option-row size-row">
              {product.sizes.map((size, index) => (
                <span
                  className={`chip ${index === 0 ? "is-active" : ""}`}
                  key={size.id}
                  title={size.note}
                >
                  {size.label}
                </span>
              ))}
            </div>
          </div>

          <div className="option-group">
            <span className="option-group__label">
              Color base: <strong>{product.colors[0]?.name}</strong>
            </span>
            <div className="option-row mt-2">
              {product.colors.map((color, index) => (
                <span
                  aria-label={color.name}
                  className={`swatch ${index === 0 ? "is-active" : ""}`}
                  key={color.id}
                  style={{ background: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <span className="option-group__label">
              Diseño: <strong>{product.designs[0]?.name}</strong>
            </span>
            <div className="option-row mt-2">
              {product.designs.map((design, index) => {
                const visual = designVisuals[index % designVisuals.length];
                return (
                  <div
                    className={`design-card ${index === 0 ? "is-active" : ""}`}
                    key={design.id}
                    title={design.name}
                  >
                    <svg viewBox="-20 -20 40 40">
                      <DesignSvg shape={visual.shape} color={visual.color} />
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="option-group">
            <div className="radio-card is-active">
              <span className="radio-card__dot" />
              <div style={{ flex: 1 }}>
                <h4 className="radio-card__title">
                  {product.personalization.label}
                </h4>
                <p className="radio-card__sub">
                  {product.personalization.description}
                </p>
              </div>
              <strong>
                {product.personalization.enabled
                  ? `+ ${formatMoney(product.personalization.extraPriceCents)}`
                  : "No disponible"}
              </strong>
            </div>
          </div>

          <div className="option-group">
            <span className="option-group__label">Cantidad</span>
            <div className="mt-2">
              <div className="qty" aria-label="Cantidad seleccionada">
                <button type="button" aria-label="Restar cantidad">
                  −
                </button>
                <span>1</span>
                <button type="button" aria-label="Sumar cantidad">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="product__cta-row">
            <Link className="btn btn--primary btn--lg" href="/carrito">
              <Icon name="bag" /> Sumar al carrito · {formatMoney(totalPreview)}
            </Link>
            {whatsappHref ? (
              <a
                className="btn btn--ghost btn--lg"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp
              </a>
            ) : (
              <Link className="btn btn--ghost btn--lg" href="/catalogo">
                Consultar por WhatsApp
              </Link>
            )}
          </div>

          <div className="disclaimer">
            <Icon name="info" size={20} />
            <div>
              <strong>Producción a pedido.</strong> {product.productionTime}{" "}
              Imprimimos tu prenda apenas confirmás el pago.
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="guia-talles" style={{ paddingTop: 0 }}>
        <div className="card" style={{ padding: "var(--sp-6)" }}>
          <Eyebrow>Guía de talles</Eyebrow>
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Talle</th>
                <th>Edad</th>
                <th>Pecho</th>
                <th>Largo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>1-2 años</td>
                <td>30 cm</td>
                <td>38 cm</td>
              </tr>
              <tr>
                <td>4</td>
                <td>3-4 años</td>
                <td>32 cm</td>
                <td>42 cm</td>
              </tr>
              <tr>
                <td>6</td>
                <td>5-6 años</td>
                <td>34 cm</td>
                <td>46 cm</td>
              </tr>
              <tr>
                <td>8</td>
                <td>7-8 años</td>
                <td>37 cm</td>
                <td>50 cm</td>
              </tr>
              <tr>
                <td>10</td>
                <td>9-10 años</td>
                <td>40 cm</td>
                <td>54 cm</td>
              </tr>
            </tbody>
          </table>
          <small className="mt-4" style={{ display: "block" }}>
            Medidas aproximadas. Si dudás entre dos talles, recomendamos el más
            grande.
          </small>
        </div>
      </section>
    </div>
  );
}
