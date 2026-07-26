import type { CatalogProduct } from "@/features/catalog/model/catalog-products";

export type ProductEditorSize = {
  code: string;
  label: string;
  note: string;
};

export type ProductEditorColor = {
  code: string;
  name: string;
  hex: string;
};

export type ProductEditorDesign = {
  slug: string;
  name: string;
  summary: string;
  extraPrice: string;
};

export type ProductEditorStock = {
  sizeCode: string;
  colorCode: string;
  designSlug: string;
  quantity: string;
  trackStock: boolean;
};

export type ProductEditorState = {
  sizes: ProductEditorSize[];
  colors: ProductEditorColor[];
  designs: ProductEditorDesign[];
  stock: ProductEditorStock[];
};

export type ProductEditorDesignOption = {
  slug: string;
  name: string;
  summary: string;
  baseExtraPriceCents: number;
};

export function slugifyEditorValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateStockCombinations(
  state: ProductEditorState,
): ProductEditorStock[] {
  const additions: ProductEditorStock[] = [];

  for (const size of state.sizes) {
    for (const color of state.colors) {
      for (const design of state.designs) {
        if (!size.code.trim() || !color.code.trim() || !design.slug.trim()) {
          continue;
        }

        const exists =
          state.stock.some(
            (row) =>
              row.sizeCode === size.code &&
              row.colorCode === color.code &&
              row.designSlug === design.slug,
          ) ||
          additions.some(
            (row) =>
              row.sizeCode === size.code &&
              row.colorCode === color.code &&
              row.designSlug === design.slug,
          );

        if (!exists) {
          additions.push({
            sizeCode: size.code,
            colorCode: color.code,
            designSlug: design.slug,
            quantity: "0",
            trackStock: true,
          });
        }
      }
    }
  }

  return additions;
}

export function createProductEditorState(product?: CatalogProduct | null): ProductEditorState {
  if (!product) {
    return {
      sizes: [{ code: "2", label: "2", note: "" }],
      colors: [{ code: "natural", name: "Natural", hex: "#fcf7ec" }],
      designs: [
        {
          slug: "bosque",
          name: "Bosque de amigos",
          summary: "Animalitos y hojas",
          extraPrice: "0",
        },
      ],
      stock: [
        {
          sizeCode: "2",
          colorCode: "natural",
          designSlug: "bosque",
          quantity: "10",
          trackStock: true,
        },
      ],
    };
  }

  return {
    sizes: product.sizes.map((size) => ({
      code: size.id,
      label: size.label,
      note: size.note ?? "",
    })),
    colors: product.colors.map((color) => ({
      code: color.id,
      name: color.name,
      hex: color.hex,
    })),
    designs: product.designs.map((design) => ({
      slug: design.id,
      name: design.name,
      summary: design.summary,
      extraPrice: String(Math.round((design.extraPriceCents ?? 0) / 100)),
    })),
    stock:
      product.stock && product.stock.length > 0
        ? product.stock.map((stock) => ({
            sizeCode: stock.sizeCode,
            colorCode: stock.colorCode,
            designSlug: stock.designId ?? "",
            quantity: String(stock.quantityAvailable),
            trackStock: stock.trackStock,
          }))
        : [
            {
              sizeCode: product.sizes[0]?.id ?? "",
              colorCode: product.colors[0]?.id ?? "",
              designSlug: product.designs[0]?.id ?? "",
              quantity: "0",
              trackStock: true,
            },
          ],
  };
}

export function serializeProductEditorState(state: ProductEditorState) {
  return {
    sizes: state.sizes
      .map((size) => [size.code, size.label, size.note].join("|"))
      .join("\n"),
    colors: state.colors
      .map((color) => [color.code, color.name, color.hex].join("|"))
      .join("\n"),
    designs: state.designs
      .map((design) =>
        [design.slug, design.name, design.summary, design.extraPrice].join("|"),
      )
      .join("\n"),
    stock: state.stock
      .map((stock) =>
        [
          stock.sizeCode,
          stock.colorCode,
          stock.designSlug,
          stock.quantity,
          stock.trackStock ? "si" : "no",
        ].join("|"),
      )
      .join("\n"),
  };
}

export function updateProductEditorRows<T>(
  rows: T[],
  index: number,
  patch: Partial<T>,
) {
  return rows.map((row, rowIndex) =>
    rowIndex === index ? { ...row, ...patch } : row,
  );
}

export function removeProductEditorRow<T>(rows: T[], index: number) {
  return rows.length <= 1
    ? rows
    : rows.filter((_, rowIndex) => rowIndex !== index);
}
