import { createClient } from "@supabase/supabase-js";
import {
  catalogProducts,
  getActiveCatalogProducts,
  getCatalogProductBySlug,
  getFeaturedCatalogProducts,
  type CatalogProduct,
  type ProductCategory,
} from "@/features/catalog/model/catalog-products";
import { getOptionalEnv } from "@/platform/config/env";
import { hasRealSupabaseConfig } from "@/server/readiness/readiness";
import { isProductionRuntime } from "@/platform/config/runtime";

export function isSupabaseCatalogConfigured() {
  return hasRealSupabaseConfig();
}

function assertCatalogFallbackAllowed() {
  if (isProductionRuntime()) {
    throw new Error("Supabase catalog config is required in production.");
  }
}

function createPublicSupabaseClient() {
  return createClient(
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL") ?? "",
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export type CatalogProductRow = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  category: ProductCategory;
  status: "active" | "draft";
  featured: boolean;
  base_price_cents: number;
  production_time: string;
  sort_order: number;
  image_url: string | null;
  image_alt: string;
  product_sizes: Array<{
    code: string;
    label: string;
    note: string | null;
    sort_order: number;
  }>;
  product_colors: Array<{
    code: string;
    name: string;
    hex: string;
    sort_order: number;
  }>;
  product_designs: Array<{
    extra_price_cents: number;
    sort_order: number;
    designs: {
      id: string;
      slug: string;
      name: string;
      summary: string;
      image_url: string | null;
      image_alt: string;
    } | null;
  }>;
  product_personalization_options: Array<{
    enabled: boolean;
    label: string;
    description: string;
    extra_price_cents: number;
  }>;
  product_variant_stock: Array<{
    size_code: string;
    color_code: string;
    design_id: string | null;
    quantity_available: number;
    track_stock: boolean;
  }>;
};

function sortByOrder<T extends { sort_order: number }>(rows: T[]) {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order);
}

export function mapCatalogProductRow(row: CatalogProductRow): CatalogProduct {
  const designs = sortByOrder(row.product_designs)
    .map((link) =>
      link.designs
        ? {
            id: link.designs.slug,
            imageAlt: link.designs.image_alt,
            imageUrl: link.designs.image_url,
            name: link.designs.name,
            summary: link.designs.summary,
            extraPriceCents: link.extra_price_cents,
          }
        : null,
    )
    .filter((design): design is NonNullable<typeof design> => Boolean(design));
  const personalization = row.product_personalization_options[0];

  return {
    id: row.id,
    accentColor: "var(--durazno)",
    badges: row.featured ? ["Destacado"] : [],
    basePriceCents: row.base_price_cents,
    category: row.category,
    colors: sortByOrder(row.product_colors).map((color) => ({
      id: color.code,
      name: color.name,
      hex: color.hex,
    })),
    description: row.description,
    designs,
    featured: row.featured,
    imageAlt: row.image_alt,
    imageUrl: row.image_url,
    name: row.name,
    personalization: personalization
      ? {
          enabled: personalization.enabled,
          label: personalization.label,
          description: personalization.description,
          extraPriceCents: personalization.extra_price_cents,
        }
      : {
          enabled: false,
          label: "",
          description: "",
          extraPriceCents: 0,
        },
    productionTime: row.production_time,
    sizes: sortByOrder(row.product_sizes).map((size) => ({
      id: size.code,
      label: size.label,
      note: size.note ?? undefined,
    })),
    slug: row.slug,
    status: row.status,
    stock: row.product_variant_stock.map((stock) => {
      const design = row.product_designs.find(
        (link) => link.designs?.id === stock.design_id,
      )?.designs;

      return {
        sizeCode: stock.size_code,
        colorCode: stock.color_code,
        designId: design?.slug ?? null,
        quantityAvailable: stock.quantity_available,
        trackStock: stock.track_stock,
      };
    }),
    summary: row.summary,
  };
}

export async function getPublicCatalogProducts() {
  if (!hasRealSupabaseConfig()) {
    assertCatalogFallbackAllowed();
    return getActiveCatalogProducts(catalogProducts);
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
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
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`No pudimos leer el catalogo: ${error.message}`);
  }

  return (data as unknown as CatalogProductRow[]).map(mapCatalogProductRow);
}

export async function getFeaturedPublicCatalogProducts() {
  if (!hasRealSupabaseConfig()) {
    assertCatalogFallbackAllowed();
    return getFeaturedCatalogProducts(catalogProducts);
  }

  return (await getPublicCatalogProducts()).filter((product) => product.featured);
}

export async function getPublicCatalogProductBySlug(slug: string) {
  if (!hasRealSupabaseConfig()) {
    assertCatalogFallbackAllowed();
    return getCatalogProductBySlug(slug, catalogProducts);
  }

  return (await getPublicCatalogProducts()).find(
    (product) => product.slug === slug,
  );
}

export async function getPublicCatalogSlugs() {
  if (!hasRealSupabaseConfig()) {
    assertCatalogFallbackAllowed();
    return getActiveCatalogProducts(catalogProducts).map((product) => product.slug);
  }

  return (await getPublicCatalogProducts()).map((product) => product.slug);
}
