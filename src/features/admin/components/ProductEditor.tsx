"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/features/catalog/data/featured-products";
import {
  createProductEditorState,
  serializeProductEditorState,
  type ProductEditorState,
} from "../product-editor-state";

type ProductEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  product?: CatalogProduct | null;
  lockSlug?: boolean;
};

function updateRow<T>(rows: T[], index: number, patch: Partial<T>) {
  return rows.map((row, rowIndex) =>
    rowIndex === index ? { ...row, ...patch } : row,
  );
}

function removeRow<T>(rows: T[], index: number) {
  return rows.length <= 1 ? rows : rows.filter((_, rowIndex) => rowIndex !== index);
}

export function ProductEditor({ action, product, lockSlug = false }: ProductEditorProps) {
  const [state, setState] = useState<ProductEditorState>(() =>
    createProductEditorState(product),
  );
  const serialized = useMemo(() => serializeProductEditorState(state), [state]);

  return (
    <form action={action} className="card admin-form" encType="multipart/form-data">
      <input name="sizes" type="hidden" value={serialized.sizes} />
      <input name="colors" type="hidden" value={serialized.colors} />
      <input name="designs" type="hidden" value={serialized.designs} />
      <input name="stock" type="hidden" value={serialized.stock} />

      <section className="admin-form__section">
        <h3>Datos principales</h3>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="productName">Nombre</label>
            <input
              className="input"
              id="productName"
              name="name"
              defaultValue={product?.name ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="productSlug">Slug</label>
            <input
              className="input"
              id="productSlug"
              name="slug"
              readOnly={lockSlug}
              defaultValue={product?.slug ?? ""}
            />
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="productCategory">Categoría</label>
            <select
              className="select"
              id="productCategory"
              name="category"
              defaultValue={product?.category ?? "remeras"}
            >
              <option value="remeras">Remeras</option>
              <option value="bodies">Bodies</option>
              <option value="abrigos">Abrigos</option>
              <option value="sets">Sets</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="productStatus">Estado</label>
            <select
              className="select"
              id="productStatus"
              name="status"
              defaultValue={product?.status ?? "draft"}
            >
              <option value="draft">Borrador</option>
              <option value="active">Activo</option>
            </select>
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="productPrice">Precio base en pesos</label>
            <input
              className="input"
              id="productPrice"
              inputMode="numeric"
              name="basePrice"
              defaultValue={
                product ? String(Math.round(product.basePriceCents / 100)) : ""
              }
            />
          </div>
          <label className="radio-card" htmlFor="productFeatured">
            <input
              defaultChecked={product?.featured ?? false}
              id="productFeatured"
              name="featured"
              type="checkbox"
            />
            <div>
              <h4 className="radio-card__title">Destacado</h4>
              <p className="radio-card__sub">Aparece en la home.</p>
            </div>
          </label>
        </div>
        <div className="field">
          <label htmlFor="productSummary">Resumen</label>
          <input
            className="input"
            id="productSummary"
            name="summary"
            defaultValue={product?.summary ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="productDescription">Descripción</label>
          <textarea
            className="textarea"
            id="productDescription"
            name="description"
            rows={3}
            defaultValue={product?.description ?? ""}
          />
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="productImage">Imagen principal</label>
            <input
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="input"
              id="productImage"
              name="image"
              type="file"
            />
          </div>
          <div className="field">
            <label htmlFor="productionTime">Tiempo de producción</label>
            <input
              className="input"
              id="productionTime"
              name="productionTime"
              defaultValue={product?.productionTime ?? ""}
            />
          </div>
        </div>
      </section>

      <EditableList
        title="Talles"
        addLabel="Agregar talle"
        onAdd={() =>
          setState((current) => ({
            ...current,
            sizes: [...current.sizes, { code: "", label: "", note: "" }],
          }))
        }
      >
        {state.sizes.map((size, index) => (
          <div className="admin-form__row" key={index}>
            <input
              className="input"
              placeholder="Código"
              value={size.code}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  sizes: updateRow(current.sizes, index, { code: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              placeholder="Label"
              value={size.label}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  sizes: updateRow(current.sizes, index, { label: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              placeholder="Nota"
              value={size.note}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  sizes: updateRow(current.sizes, index, { note: event.target.value }),
                }))
              }
            />
            <IconRemove
              onClick={() =>
                setState((current) => ({
                  ...current,
                  sizes: removeRow(current.sizes, index),
                }))
              }
            />
          </div>
        ))}
      </EditableList>

      <EditableList
        title="Colores"
        addLabel="Agregar color"
        onAdd={() =>
          setState((current) => ({
            ...current,
            colors: [...current.colors, { code: "", name: "", hex: "#000000" }],
          }))
        }
      >
        {state.colors.map((color, index) => (
          <div className="admin-form__row" key={index}>
            <input
              className="input"
              placeholder="Código"
              value={color.code}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  colors: updateRow(current.colors, index, { code: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              placeholder="Nombre"
              value={color.name}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  colors: updateRow(current.colors, index, { name: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              type="color"
              value={color.hex}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  colors: updateRow(current.colors, index, { hex: event.target.value }),
                }))
              }
            />
            <IconRemove
              onClick={() =>
                setState((current) => ({
                  ...current,
                  colors: removeRow(current.colors, index),
                }))
              }
            />
          </div>
        ))}
      </EditableList>

      <EditableList
        title="Diseños asociados"
        addLabel="Agregar diseño"
        onAdd={() =>
          setState((current) => ({
            ...current,
            designs: [
              ...current.designs,
              { slug: "", name: "", summary: "", extraPrice: "0" },
            ],
          }))
        }
      >
        {state.designs.map((design, index) => (
          <div className="admin-form__row" key={index}>
            <input
              className="input"
              placeholder="Slug"
              value={design.slug}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  designs: updateRow(current.designs, index, { slug: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              placeholder="Nombre"
              value={design.name}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  designs: updateRow(current.designs, index, { name: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              placeholder="Resumen"
              value={design.summary}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  designs: updateRow(current.designs, index, { summary: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              inputMode="numeric"
              placeholder="Extra $"
              value={design.extraPrice}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  designs: updateRow(current.designs, index, {
                    extraPrice: event.target.value,
                  }),
                }))
              }
            />
            <IconRemove
              onClick={() =>
                setState((current) => ({
                  ...current,
                  designs: removeRow(current.designs, index),
                }))
              }
            />
          </div>
        ))}
      </EditableList>

      <EditableList
        title="Stock"
        addLabel="Agregar stock"
        onAdd={() =>
          setState((current) => ({
            ...current,
            stock: [
              ...current.stock,
              {
                sizeCode: current.sizes[0]?.code ?? "",
                colorCode: current.colors[0]?.code ?? "",
                designSlug: current.designs[0]?.slug ?? "",
                quantity: "0",
                trackStock: true,
              },
            ],
          }))
        }
      >
        {state.stock.map((stock, index) => (
          <div className="admin-form__row" key={index}>
            <input
              className="input"
              placeholder="Talle"
              value={stock.sizeCode}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stock: updateRow(current.stock, index, { sizeCode: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              placeholder="Color"
              value={stock.colorCode}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stock: updateRow(current.stock, index, { colorCode: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              placeholder="Diseño"
              value={stock.designSlug}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stock: updateRow(current.stock, index, { designSlug: event.target.value }),
                }))
              }
            />
            <input
              className="input"
              inputMode="numeric"
              placeholder="Cantidad"
              value={stock.quantity}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stock: updateRow(current.stock, index, { quantity: event.target.value }),
                }))
              }
            />
            <label className="admin-form__check">
              <input
                checked={stock.trackStock}
                type="checkbox"
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    stock: updateRow(current.stock, index, {
                      trackStock: event.target.checked,
                    }),
                  }))
                }
              />
              Stock
            </label>
            <IconRemove
              onClick={() =>
                setState((current) => ({
                  ...current,
                  stock: removeRow(current.stock, index),
                }))
              }
            />
          </div>
        ))}
      </EditableList>

      <section className="admin-form__section">
        <h3>Personalización</h3>
        <div className="field-grid">
          <label className="radio-card" htmlFor="personalizationEnabled">
            <input
              defaultChecked={product?.personalization.enabled ?? true}
              id="personalizationEnabled"
              name="personalizationEnabled"
              type="checkbox"
            />
            <div>
              <h4 className="radio-card__title">Permite personalizar</h4>
              <p className="radio-card__sub">Nombre, inicial o frase corta.</p>
            </div>
          </label>
          <div className="field">
            <label htmlFor="personalizationPrice">Extra en pesos</label>
            <input
              className="input"
              id="personalizationPrice"
              inputMode="numeric"
              name="personalizationPrice"
              defaultValue={
                product
                  ? String(Math.round(product.personalization.extraPriceCents / 100))
                  : "0"
              }
            />
          </div>
        </div>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="personalizationLabel">Label</label>
            <input
              className="input"
              id="personalizationLabel"
              name="personalizationLabel"
              defaultValue={product?.personalization.label ?? "Nombre o frase corta"}
            />
          </div>
          <div className="field">
            <label htmlFor="personalizationDescription">Descripción</label>
            <input
              className="input"
              id="personalizationDescription"
              name="personalizationDescription"
              defaultValue={product?.personalization.description ?? ""}
            />
          </div>
        </div>
      </section>

      <Button type="submit" variant="primary">
        <Check size={20} /> Guardar producto
      </Button>
    </form>
  );
}

function EditableList({
  title,
  addLabel,
  children,
  onAdd,
}: {
  title: string;
  addLabel: string;
  children: ReactNode;
  onAdd: () => void;
}) {
  return (
    <section className="admin-form__section">
      <div className="admin-form__section-head">
        <h3>{title}</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus size={16} /> {addLabel}
        </Button>
      </div>
      <div className="admin-form__list">{children}</div>
    </section>
  );
}

function IconRemove({ onClick }: { onClick: () => void }) {
  return (
    <Button
      aria-label="Quitar fila"
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
    >
      <Trash2 size={16} />
    </Button>
  );
}
