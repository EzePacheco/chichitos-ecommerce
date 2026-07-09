import type { Dispatch, SetStateAction } from "react";
import {
  removeProductEditorRow,
  updateProductEditorRows,
  type ProductEditorState,
} from "../../model/product-editor-state";
import { EditableList, IconRemove } from "./EditableList";

type ProductVariantSectionsProps = {
  state: ProductEditorState;
  setState: Dispatch<SetStateAction<ProductEditorState>>;
};

export function ProductVariantSections({
  state,
  setState,
}: ProductVariantSectionsProps) {
  return (
    <>
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
                  sizes: updateProductEditorRows(current.sizes, index, {
                    code: event.target.value,
                  }),
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
                  sizes: updateProductEditorRows(current.sizes, index, {
                    label: event.target.value,
                  }),
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
                  sizes: updateProductEditorRows(current.sizes, index, {
                    note: event.target.value,
                  }),
                }))
              }
            />
            <IconRemove
              onClick={() =>
                setState((current) => ({
                  ...current,
                  sizes: removeProductEditorRow(current.sizes, index),
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
                  colors: updateProductEditorRows(current.colors, index, {
                    code: event.target.value,
                  }),
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
                  colors: updateProductEditorRows(current.colors, index, {
                    name: event.target.value,
                  }),
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
                  colors: updateProductEditorRows(current.colors, index, {
                    hex: event.target.value,
                  }),
                }))
              }
            />
            <IconRemove
              onClick={() =>
                setState((current) => ({
                  ...current,
                  colors: removeProductEditorRow(current.colors, index),
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
                  designs: updateProductEditorRows(current.designs, index, {
                    slug: event.target.value,
                  }),
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
                  designs: updateProductEditorRows(current.designs, index, {
                    name: event.target.value,
                  }),
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
                  designs: updateProductEditorRows(current.designs, index, {
                    summary: event.target.value,
                  }),
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
                  designs: updateProductEditorRows(current.designs, index, {
                    extraPrice: event.target.value,
                  }),
                }))
              }
            />
            <IconRemove
              onClick={() =>
                setState((current) => ({
                  ...current,
                  designs: removeProductEditorRow(current.designs, index),
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
                  stock: updateProductEditorRows(current.stock, index, {
                    sizeCode: event.target.value,
                  }),
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
                  stock: updateProductEditorRows(current.stock, index, {
                    colorCode: event.target.value,
                  }),
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
                  stock: updateProductEditorRows(current.stock, index, {
                    designSlug: event.target.value,
                  }),
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
                  stock: updateProductEditorRows(current.stock, index, {
                    quantity: event.target.value,
                  }),
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
                    stock: updateProductEditorRows(current.stock, index, {
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
                  stock: removeProductEditorRow(current.stock, index),
                }))
              }
            />
          </div>
        ))}
      </EditableList>
    </>
  );
}
