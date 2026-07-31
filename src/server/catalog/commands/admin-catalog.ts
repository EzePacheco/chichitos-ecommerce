import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ValidationIssue } from "@/shared/validation/validation-issue";
import {
  validateCatalogImage,
  type ProductCategory,
  type ProductStatus,
} from "@/features/catalog/public";
import { parseMoneyToCents } from "@/server/settings/store-settings";
import { createAdminSupabaseClient } from "@/platform/supabase/admin";
import {
  isSupabaseCatalogConfigured,
  mapCatalogProductRow,
  type CatalogProductRow,
} from "../queries/public-catalog";
import { uploadCatalogImage } from "../upload-catalog-image";

export type CatalogProductFormInput = {
  slug: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
  summary: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  category: FormDataEntryValue | null;
  status: FormDataEntryValue | null;
  featured: FormDataEntryValue | null;
  basePrice: FormDataEntryValue | null;
  productionTime: FormDataEntryValue | null;
  sizes: FormDataEntryValue | null;
  colors: FormDataEntryValue | null;
  designs: FormDataEntryValue | null;
  personalizationEnabled: FormDataEntryValue | null;
  personalizationLabel: FormDataEntryValue | null;
  personalizationDescription: FormDataEntryValue | null;
  personalizationPrice: FormDataEntryValue | null;
  stock: FormDataEntryValue | null;
  image: FormDataEntryValue | null;
};

const categories: ProductCategory[] = [
  "remeras",
  "bodies",
  "abrigos",
  "sets",
  "accesorios",
];
const statuses: ProductStatus[] = ["active", "draft"];
function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function slugifyCatalogValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function lines(value: FormDataEntryValue | null) {
  return text(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((part) => part.trim()));
}

function getImage(value: FormDataEntryValue | null) {
  if (typeof File === "undefined" || !(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

export function getCatalogProductFormInput(formData: FormData): CatalogProductFormInput {
  return {
    slug: formData.get("slug"),
    name: formData.get("name"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    status: formData.get("status"),
    featured: formData.get("featured"),
    basePrice: formData.get("basePrice"),
    productionTime: formData.get("productionTime"),
    sizes: formData.get("sizes"),
    colors: formData.get("colors"),
    designs: formData.get("designs"),
    personalizationEnabled: formData.get("personalizationEnabled"),
    personalizationLabel: formData.get("personalizationLabel"),
    personalizationDescription: formData.get("personalizationDescription"),
    personalizationPrice: formData.get("personalizationPrice"),
    stock: formData.get("stock"),
    image: formData.get("image"),
  };
}

export function parseCatalogProductInput(input: CatalogProductFormInput) {
  const errors: ValidationIssue[] = [];
  const name = text(input.name);
  const slug = slugifyCatalogValue(text(input.slug) || name);
  const category = text(input.category) as ProductCategory;
  const status = (text(input.status) || "draft") as ProductStatus;
  const basePrice = parseMoneyToCents(input.basePrice, "Precio base");
  const image = getImage(input.image);
  const sizes = lines(input.sizes).map(([code = "", label = code, note]) => ({
    code: slugifyCatalogValue(code),
    label,
    note: note || null,
  }));
  const colors = lines(input.colors).map(([code = "", name = code, hex = ""]) => ({
    code: slugifyCatalogValue(code),
    name,
    hex,
  }));
  const designs = lines(input.designs).map(
    ([slug = "", name = slug, summary = "", price = ""]) => ({
      slug: slugifyCatalogValue(slug),
      name,
      summary,
      extraPriceCents: parseMoneyToCents(price, "Extra de diseno").value ?? 0,
    }),
  );
  const stock = lines(input.stock).map(
    ([sizeCode = "", colorCode = "", designSlug = "", quantity = "0", track = "si"]) => ({
      sizeCode: slugifyCatalogValue(sizeCode),
      colorCode: slugifyCatalogValue(colorCode),
      designSlug: designSlug ? slugifyCatalogValue(designSlug) : null,
      quantityAvailable: Math.max(0, Math.floor(Number(quantity) || 0)),
      trackStock: !["no", "false", "0"].includes(track.toLowerCase()),
    }),
  );

  if (!slug) {
    errors.push({
      field: "name",
      message: "Ingresá un nombre para generar la dirección.",
    });
  }
  if (!name) {
    errors.push({ field: "name", message: "Ingresá el nombre del producto." });
  }
  if (!text(input.summary)) {
    errors.push({
      field: "summary",
      message: "Ingresá un resumen para el catálogo.",
    });
  }
  if (!text(input.description)) {
    errors.push({
      field: "description",
      message: "Ingresá una descripción del producto.",
    });
  }
  if (!categories.includes(category)) {
    errors.push({ field: "category", message: "Elegí una categoría válida." });
  }
  if (!statuses.includes(status)) {
    errors.push({ field: "status", message: "Elegí un estado válido." });
  }
  if (basePrice.error || !basePrice.value) {
    errors.push({
      field: "basePrice",
      message: "Ingresá un precio base mayor a cero.",
    });
  }
  if (sizes.length === 0) {
    errors.push({ field: "sizes", message: "Agregá al menos un talle." });
  }
  if (colors.length === 0) {
    errors.push({ field: "colors", message: "Agregá al menos un color." });
  }
  if (designs.length === 0) {
    errors.push({ field: "designs", message: "Agregá al menos un diseño." });
  }
  const imageError = validateCatalogImage(image);
  if (imageError) errors.push({ field: "image", message: imageError });
  for (const color of colors) {
    const validColor = new RegExp("^#[0-9A-Fa-f]{6}$").test(color.hex);
    if (!validColor) {
      errors.push({
        field: "colors",
        message: `Revisá el color ${color.name || "sin nombre"}.`,
      });
    }
  }

  if (errors.length > 0) return { ok: false as const, errors };

  return {
    ok: true as const,
    image,
    product: {
      slug,
      name,
      summary: text(input.summary),
      description: text(input.description),
      category,
      status,
      featured: input.featured === "on",
      basePriceCents: basePrice.value ?? 0,
      productionTime: text(input.productionTime),
      sizes,
      colors,
      designs,
      personalization: {
        enabled: input.personalizationEnabled === "on",
        label: text(input.personalizationLabel),
        description: text(input.personalizationDescription),
        extraPriceCents:
          parseMoneyToCents(input.personalizationPrice, "Personalizacion").value ?? 0,
      },
      stock,
    },
  };
}

export async function getAdminCatalogProducts(
  supabase?: SupabaseClient,
) {
  if (!supabase && !isSupabaseCatalogConfigured()) return [];

  const client = supabase ?? createAdminSupabaseClient();
  const { data, error } = await client
    .from("products")
    .select(
      `
      id, slug, name, summary, description, category, status, featured,
      base_price_cents, production_time, sort_order, image_url, image_alt,
      product_sizes(code,label,note,sort_order),
      product_colors(code,name,hex,sort_order),
      product_designs(extra_price_cents,sort_order,designs(id,slug,name,summary,image_url,image_alt)),
      product_personalization_options(enabled,label,description,extra_price_cents),
      product_variant_stock(size_code,color_code,design_id,quantity_available,track_stock)
    `,
    )
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`No pudimos leer productos: ${error.message}`);

  return (data as unknown as CatalogProductRow[]).map(mapCatalogProductRow);
}

export type CatalogProductStatusInput = {
  productId: string;
  slug: string;
  status: ProductStatus;
};

export function parseCatalogProductStatusInput(formData: FormData) {
  const productId = text(formData.get("productId"));
  const slug = slugifyCatalogValue(text(formData.get("slug")));
  const status = text(formData.get("status")) as ProductStatus;

  if (!productId || !slug || !statuses.includes(status)) {
    return { ok: false as const };
  }

  return { ok: true as const, input: { productId, slug, status } };
}

export async function setCatalogProductStatus(
  input: CatalogProductStatusInput,
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  const { error } = await supabase
    .from("products")
    .update({ status: input.status })
    .eq("id", input.productId);

  if (error) {
    throw new Error(`No pudimos actualizar el estado: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${input.slug}`);
}

export async function upsertCatalogProduct(
  parsed: Extract<ReturnType<typeof parseCatalogProductInput>, { ok: true }>,
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  const imageUrl = await uploadCatalogImage({
    file: parsed.image,
    folder: "products",
    slug: parsed.product.slug,
    supabase,
  });
  const { data: productId, error } = await supabase.rpc("save_catalog_product_atomic", {
    product_data: {
        slug: parsed.product.slug,
        name: parsed.product.name,
        summary: parsed.product.summary,
        description: parsed.product.description,
        category: parsed.product.category,
        status: parsed.product.status,
        featured: parsed.product.featured,
        base_price_cents: parsed.product.basePriceCents,
        production_time: parsed.product.productionTime,
        image_url: imageUrl,
        image_alt: imageUrl ? parsed.product.name : "",
        sizes: parsed.product.sizes,
        colors: parsed.product.colors,
        designs: parsed.product.designs.map((design) => ({
          slug: design.slug,
          name: design.name,
          summary: design.summary,
          extra_price_cents: design.extraPriceCents,
        })),
        personalization: {
          enabled: parsed.product.personalization.enabled,
          label: parsed.product.personalization.label,
          description: parsed.product.personalization.description,
          extra_price_cents: parsed.product.personalization.extraPriceCents,
        },
        stock: parsed.product.stock.map((stock) => ({
          size_code: stock.sizeCode,
          color_code: stock.colorCode,
          design_slug: stock.designSlug,
          quantity_available: stock.quantityAvailable,
          track_stock: stock.trackStock,
        })),
      },
  });

  if (error) throw new Error(`No pudimos guardar producto: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${parsed.product.slug}`);

  return productId as string;
}
