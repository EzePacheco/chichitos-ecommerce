import type { Dispatch, SetStateAction } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  generateStockCombinations,
  removeProductEditorRow,
  slugifyEditorValue,
  updateProductEditorRows,
  type ProductEditorDesign,
  type ProductEditorDesignOption,
  type ProductEditorState,
} from "../../model/product-editor-state";
import { EditableList, IconRemove } from "./EditableList";

type ProductVariantSectionsProps = {
  state: ProductEditorState;
  setState: Dispatch<SetStateAction<ProductEditorState>>;
  availableDesigns: ProductEditorDesignOption[];
};

function remapStockValue(
  state: ProductEditorState,
  key: "sizeCode" | "colorCode" | "designSlug",
  from: string,
  to: string,
) {
  if (!from || from === to) return state.stock;

  return state.stock.map((row) =>
    row[key] === from ? { ...row, [key]: to } : row,
  );
}

export function ProductVariantSections({
  state,
  setState,
  availableDesigns,
}: ProductVariantSectionsProps) {
  const hasDesignCatalog = availableDesigns.length > 0;

  const patchDesign = (index: number, patch: Partial<ProductEditorDesign>) => {
    setState((current) => {
      const previousSlug = current.designs[index]?.slug ?? "";
      const designs = updateProductEditorRows(current.designs, index, patch);
      const nextSlug = designs[index]?.slug ?? "";

      return {
        ...current,
        designs,
        stock: remapStockValue(current, "designSlug", previousSlug, nextSlug),
      };
    });
  };

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
              placeholder="Talle (ej: 2)"
              value={size.label}
              onChange={(event) =>
                setState((current) => {
                  const previousCode = current.sizes[index]?.code ?? "";
                  const nextCode = slugifyEditorValue(event.target.value);

                  return {
                    ...current,
                    sizes: updateProductEditorRows(current.sizes, index, {
                      label: event.target.value,
                      code: nextCode,
                    }),
                    stock: remapStockValue(current, "sizeCode", previousCode, nextCode),
                  };
                })
              }
            />
            <input
              className="input"
              placeholder="Nota (opcional)"
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
              placeholder="Nombre (ej: Natural)"
              value={color.name}
              onChange={(event) =>
                setState((current) => {
                  const previousCode = current.colors[index]?.code ?? "";
                  const nextCode = slugifyEditorValue(event.target.value);

                  return {
                    ...current,
                    colors: updateProductEditorRows(current.colors, index, {
                      name: event.target.value,
                      code: nextCode,
                    }),
                    stock: remapStockValue(current, "colorCode", previousCode, nextCode),
                  };
                })
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
            {hasDesignCatalog ? (
              <select
                className="select"
                value={design.slug}
                onChange={(event) => {
                  const selected = availableDesigns.find(
                    (option) => option.slug === event.target.value,
                  );

                  patchDesign(
                    index,
                    selected
                      ? {
                          slug: selected.slug,
                          name: selected.name,
                          summary: selected.summary,
                          extraPrice: String(
                            Math.round(selected.baseExtraPriceCents / 100),
                          ),
                        }
                      : { slug: event.target.value },
                  );
                }}
              >
                <option value="">Elegí un diseño…</option>
                {availableDesigns.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
                {design.slug &&
                !availableDesigns.some((option) => option.slug === design.slug) ? (
                  <option value={design.slug}>
                    {design.name || design.slug}
                  </option>
                ) : null}
              </select>
            ) : (
              <>
                <input
                  className="input"
                  placeholder="Nombre del diseño"
                  value={design.name}
                  onChange={(event) =>
                    patchDesign(index, {
                      name: event.target.value,
                      slug: slugifyEditorValue(event.target.value),
                    })
                  }
                />
                <input
                  className="input"
                  placeholder="Resumen"
                  value={design.summary}
                  onChange={(event) =>
                    patchDesign(index, { summary: event.target.value })
                  }
                />
              </>
            )}
            <input
              className="input"
              inputMode="numeric"
              min={0}
              placeholder="Extra $"
              step={1}
              type="number"
              value={design.extraPrice}
              onChange={(event) =>
                patchDesign(index, { extraPrice: event.target.value })
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
        extraAction={
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() =>
              setState((current) => {
                const additions = generateStockCombinations(current);

                return additions.length === 0
                  ? current
                  : { ...current, stock: [...current.stock, ...additions] };
              })
            }
          >
            <Sparkles size={16} /> Generar combinaciones
          </Button>
        }
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
            <select
              className="select"
              value={stock.sizeCode}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stock: updateProductEditorRows(current.stock, index, {
                    sizeCode: event.target.value,
                  }),
                }))
              }
            >
              <option value="">Talle…</option>
              {state.sizes
                .filter((size) => size.code)
                .map((size) => (
                  <option key={size.code} value={size.code}>
                    {size.label || size.code}
                  </option>
                ))}
              {stock.sizeCode &&
              !state.sizes.some((size) => size.code === stock.sizeCode) ? (
                <option value={stock.sizeCode}>{stock.sizeCode}</option>
              ) : null}
            </select>
            <select
              className="select"
              value={stock.colorCode}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stock: updateProductEditorRows(current.stock, index, {
                    colorCode: event.target.value,
                  }),
                }))
              }
            >
              <option value="">Color…</option>
              {state.colors
                .filter((color) => color.code)
                .map((color) => (
                  <option key={color.code} value={color.code}>
                    {color.name || color.code}
                  </option>
                ))}
              {stock.colorCode &&
              !state.colors.some((color) => color.code === stock.colorCode) ? (
                <option value={stock.colorCode}>{stock.colorCode}</option>
              ) : null}
            </select>
            <select
              className="select"
              value={stock.designSlug}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stock: updateProductEditorRows(current.stock, index, {
                    designSlug: event.target.value,
                  }),
                }))
              }
            >
              <option value="">Diseño…</option>
              {state.designs
                .filter((design) => design.slug)
                .map((design) => (
                  <option key={design.slug} value={design.slug}>
                    {design.name || design.slug}
                  </option>
                ))}
              {stock.designSlug &&
              !state.designs.some((design) => design.slug === stock.designSlug) ? (
                <option value={stock.designSlug}>{stock.designSlug}</option>
              ) : null}
            </select>
            <input
              className="input"
              inputMode="numeric"
              min={0}
              placeholder="Cantidad"
              step={1}
              type="number"
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
