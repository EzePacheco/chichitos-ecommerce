"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import { Info, Ruler, ShoppingBag, X } from "lucide-react";
import {
  DesignSvg,
  Eyebrow,
  GarmentPlaceholder,
  GarmentTag,
} from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/Stepper";
import { formatMoney } from "@/lib/money";
import { addStoredCartItem } from "../cart-storage";
import {
  designVisuals,
  getGarmentType,
  getProductTagVariant,
} from "../design";
import {
  catalogCategoryLabels,
  type CatalogProduct,
} from "../data/featured-products";

type ProductViewProps = {
  product: CatalogProduct;
  whatsappHref?: string;
};

export function ProductView({ product, whatsappHref }: ProductViewProps) {
  const garmentType = getGarmentType(product);
  const personalCost = product.personalization.extraPriceCents;

  const [sizeId, setSizeId] = useState<string>(product.sizes[0]?.id ?? "");
  const [colorId, setColorId] = useState<string>(product.colors[0]?.id ?? "");
  const [designId, setDesignId] = useState<string>(
    product.designs[0]?.id ?? "",
  );
  const [qty, setQty] = useState(1);
  const [personalize, setPersonalize] = useState(false);
  const [personalName, setPersonalName] = useState("");
  const [added, setAdded] = useState(false);
  const [thumbIdx, setThumbIdx] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const designVisualByDesignId = useMemo(() => {
    const map = new Map<string, (typeof designVisuals)[number]>();
    product.designs.forEach((design, index) => {
      map.set(design.id, designVisuals[index % designVisuals.length]);
    });
    return map;
  }, [product.designs]);

  const currentSize = product.sizes.find((s) => s.id === sizeId);
  const currentColor = product.colors.find((c) => c.id === colorId);
  const currentDesign = product.designs.find((d) => d.id === designId);
  const currentVisual = designVisualByDesignId.get(designId);

  const baseHex = currentColor?.hex ?? "var(--cream-50)";
  const total = product.basePriceCents + (personalize ? personalCost : 0);

  const thumbs = [
    { key: "front" as const, shape: currentVisual?.shape ?? null, scale: 1 },
    { key: "back" as const, shape: null, scale: 1 },
    {
      key: "folded" as const,
      shape: currentVisual?.shape ?? null,
      scale: 0.55,
    },
  ];

  function addToCart() {
    if (!currentSize || !currentColor || !currentDesign) return;

    addStoredCartItem({
      productSlug: product.slug,
      qty,
      sizeId: currentSize.id,
      colorId: currentColor.id,
      designId: currentDesign.id,
      personalName: personalize ? personalName.trim() || null : null,
    });
    setAdded(true);
  }

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
            {product.imageUrl && thumbIdx === 0 ? (
              <img
                src={product.imageUrl}
                alt={product.imageAlt || product.name}
                style={{
                  borderRadius: "var(--r-xl)",
                  height: "100%",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            ) : (
              <GarmentPlaceholder
                type={garmentType}
                color={baseHex}
                designShape={thumbs[thumbIdx].shape}
                designColor={currentVisual?.color}
                scale={thumbs[thumbIdx].scale}
              />
            )}
          </div>
          <div className="gallery__thumbs" aria-label="Galería del producto">
            {thumbs.map((thumb, index) => (
              <button
                type="button"
                key={thumb.key}
                className={`gallery__thumb ${index === thumbIdx ? "is-active" : ""}`}
                onClick={() => setThumbIdx(index)}
                aria-label={`Vista ${index + 1}`}
              >
                <GarmentPlaceholder
                  type={garmentType}
                  color={baseHex}
                  designShape={thumb.shape}
                  designColor={currentVisual?.color}
                  scale={thumb.scale}
                />
              </button>
            ))}
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
            {formatMoney(total)}
            {personalize ? (
              <small>
                incluye personalización (+{formatMoney(personalCost)})
              </small>
            ) : null}
          </div>
          <p>{product.description}</p>

          <div className="option-group">
            <div className="option-group__head">
              <span className="option-group__label">
                Talle: <strong>{currentSize?.label}</strong>
              </span>
              <button
                type="button"
                className="option-group__link"
                onClick={() => setSizeGuideOpen((open) => !open)}
              >
                <Ruler size={14} style={{ verticalAlign: -2 }} /> Guía de talles
              </button>
            </div>
            <div className="option-row size-row">
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size.id}
                  className={`chip ${sizeId === size.id ? "is-active" : ""}`}
                  onClick={() => setSizeId(size.id)}
                  title={size.note}
                >
                  {size.label}
                </button>
              ))}
            </div>
            {sizeGuideOpen ? (
              <SizeGuide onClose={() => setSizeGuideOpen(false)} />
            ) : null}
          </div>

          <div className="option-group">
            <span className="option-group__label">
              Color base: <strong>{currentColor?.name}</strong>
            </span>
            <div className="option-row mt-2">
              {product.colors.map((color) => (
                <button
                  type="button"
                  key={color.id}
                  aria-label={color.name}
                  title={color.name}
                  className={`swatch ${colorId === color.id ? "is-active" : ""}`}
                  style={{ background: color.hex }}
                  onClick={() => setColorId(color.id)}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <span className="option-group__label">
              Diseño: <strong>{currentDesign?.name}</strong>
            </span>
            <div className="option-row mt-2">
              {product.designs.map((design) => {
                const visual = designVisualByDesignId.get(design.id);
                return (
                  <button
                    type="button"
                    key={design.id}
                    className={`design-card ${designId === design.id ? "is-active" : ""}`}
                    onClick={() => setDesignId(design.id)}
                    aria-label={design.name}
                    title={design.summary}
                  >
                    {visual ? (
                      <svg viewBox="-20 -20 40 40">
                        <DesignSvg shape={visual.shape} color={visual.color} />
                      </svg>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {product.personalization.enabled ? (
            <div className="option-group">
              <label
                style={{
                  alignItems: "flex-start",
                  background: "var(--cream-100)",
                  border: "1px dashed var(--sand-400)",
                  borderRadius: "var(--r-lg)",
                  cursor: "pointer",
                  display: "flex",
                  gap: 12,
                  padding: 16,
                }}
              >
                <input
                  type="checkbox"
                  checked={personalize}
                  onChange={(event) => setPersonalize(event.target.checked)}
                  style={{ marginTop: 4 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    {product.personalization.label}{" "}
                    <span style={{ color: "var(--ink-500)", fontWeight: 400 }}>
                      +{formatMoney(personalCost)}
                    </span>
                  </div>
                  <div
                    style={{
                      color: "var(--ink-500)",
                      fontSize: "var(--fs-caption)",
                    }}
                  >
                    {product.personalization.description}
                  </div>
                  {personalize ? (
                    <input
                      type="text"
                      placeholder="Ej: Mateo"
                      value={personalName}
                      onChange={(event) => setPersonalName(event.target.value)}
                      className="input"
                      maxLength={16}
                      style={{ marginTop: 10, maxWidth: 240 }}
                    />
                  ) : null}
                </div>
              </label>
            </div>
          ) : null}

          <div className="option-group">
            <span className="option-group__label">Cantidad</span>
            <div className="mt-2">
              <Stepper value={qty} onChange={setQty} max={20} />
            </div>
          </div>

          <div className="product__cta-row">
            <Button variant="primary" size="lg" onClick={addToCart}>
              <ShoppingBag size={20} /> Sumar al carrito ·{" "}
              {formatMoney(total * qty)}
            </Button>
            {added ? (
              <Button asChild variant="soft" size="lg">
                <Link href="/carrito">Ver carrito</Link>
              </Button>
            ) : null}
            {whatsappHref ? (
              <Button asChild variant="ghost" size="lg">
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  Consultar por WhatsApp
                </a>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="lg">
                <Link href="/catalogo">Consultar por WhatsApp</Link>
              </Button>
            )}
          </div>

          <div className="disclaimer">
            <Info size={20} />
            <div>
              <strong>Producción a pedido.</strong> {product.productionTime}{" "}
              Imprimimos tu prenda apenas confirmás el pago.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type SizeGuideProps = {
  onClose: () => void;
};

const sizeGuideRows = [
  { size: "2", age: "1-2 años", chest: "30 cm", length: "38 cm" },
  { size: "4", age: "3-4 años", chest: "32 cm", length: "42 cm" },
  { size: "6", age: "5-6 años", chest: "34 cm", length: "46 cm" },
  { size: "8", age: "7-8 años", chest: "37 cm", length: "50 cm" },
  { size: "10", age: "9-10 años", chest: "40 cm", length: "54 cm" },
  { size: "12", age: "11-12 años", chest: "43 cm", length: "58 cm" },
];

function SizeGuide({ onClose }: SizeGuideProps) {
  return (
    <div
      style={{
        background: "var(--cream-50)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        marginTop: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <strong>Guía de talles</strong>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Cerrar guía"
        >
          <X size={16} />
        </button>
      </div>
      <table
        className="table"
        style={{ background: "transparent", border: "none", borderRadius: 0 }}
      >
        <thead>
          <tr>
            <th>Talle</th>
            <th>Edad</th>
            <th>Pecho</th>
            <th>Largo</th>
          </tr>
        </thead>
        <tbody>
          {sizeGuideRows.map((row) => (
            <tr key={row.size}>
              <td>{row.size}</td>
              <td>{row.age}</td>
              <td>{row.chest}</td>
              <td>{row.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small
        style={{
          color: "var(--ink-500)",
          display: "block",
          marginTop: 8,
        }}
      >
        Medidas aproximadas. Si dudás entre dos talles, recomendamos el más
        grande.
      </small>
    </div>
  );
}
