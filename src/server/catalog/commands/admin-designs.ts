import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ValidationIssue } from "@/shared/validation/validation-issue";
import { parseMoneyToCents } from "@/server/settings/store-settings";
import { createAdminSupabaseClient } from "@/platform/supabase/admin";
import { isSupabaseCatalogConfigured } from "../queries/public-catalog";
import { slugifyCatalogValue } from "./admin-catalog";

export type AdminDesign = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  status: "draft" | "active" | "archived";
  baseExtraPriceCents: number;
  imageUrl: string | null;
  imageAlt: string;
  productCount: number;
};

export type AdminDesignFormInput = {
  slug: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
  summary: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  status: FormDataEntryValue | null;
  baseExtraPrice: FormDataEntryValue | null;
  image: FormDataEntryValue | null;
};

type DesignRow = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  status: "draft" | "active" | "archived";
  base_extra_price_cents: number;
  image_url: string | null;
  image_alt: string;
  product_designs: Array<{ product_id: string }>;
};

const statuses = ["draft", "active", "archived"] as const;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getImage(value: FormDataEntryValue | null) {
  if (typeof File === "undefined" || !(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function mapDesign(row: DesignRow): AdminDesign {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    description: row.description,
    status: row.status,
    baseExtraPriceCents: row.base_extra_price_cents,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    productCount: row.product_designs.length,
  };
}

export function getAdminDesignFormInput(formData: FormData): AdminDesignFormInput {
  return {
    slug: formData.get("slug"),
    name: formData.get("name"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    status: formData.get("status"),
    baseExtraPrice: formData.get("baseExtraPrice"),
    image: formData.get("image"),
  };
}

export function parseAdminDesignInput(input: AdminDesignFormInput) {
  const errors: ValidationIssue[] = [];
  const name = text(input.name);
  const slug = slugifyCatalogValue(text(input.slug) || name);
  const status = (text(input.status) || "draft") as AdminDesign["status"];
  const baseExtraPrice = parseMoneyToCents(input.baseExtraPrice, "Extra base");
  const image = getImage(input.image);

  if (!slug) {
    errors.push({
      field: "name",
      message: "Ingresá un nombre para generar la dirección.",
    });
  }
  if (!name) {
    errors.push({ field: "name", message: "Ingresá el nombre del diseño." });
  }
  if (!text(input.summary)) {
    errors.push({
      field: "summary",
      message: "Ingresá un resumen del diseño.",
    });
  }
  if (!statuses.includes(status)) {
    errors.push({ field: "status", message: "Elegí un estado válido." });
  }
  if (baseExtraPrice.error) {
    errors.push({
      field: "baseExtraPrice",
      message: "Ingresá un extra base válido.",
    });
  }
  if (image && !allowedImageTypes.has(image.type)) {
    errors.push({
      field: "image",
      message: "Elegí una imagen PNG, JPG, WebP o AVIF.",
    });
  }
  if (image && image.size > 5 * 1024 * 1024) {
    errors.push({ field: "image", message: "Elegí una imagen de hasta 5 MB." });
  }

  if (errors.length > 0) return { ok: false as const, errors };

  return {
    ok: true as const,
    image,
    design: {
      slug,
      name,
      summary: text(input.summary),
      description: text(input.description),
      status,
      baseExtraPriceCents: baseExtraPrice.value ?? 0,
    },
  };
}

async function uploadDesignImage(file: File | null, slug: string, supabase: SupabaseClient) {
  if (!file) return null;

  const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
  const path = `designs/${slug}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from("catalog-assets").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(`No pudimos subir la imagen: ${error.message}`);

  return supabase.storage.from("catalog-assets").getPublicUrl(path).data.publicUrl;
}

export async function getAdminDesigns(
  supabase?: SupabaseClient,
) {
  if (!supabase && !isSupabaseCatalogConfigured()) return [];

  const client = supabase ?? createAdminSupabaseClient();
  const { data, error } = await client
    .from("designs")
    .select(
      "id,slug,name,summary,description,status,base_extra_price_cents,image_url,image_alt,product_designs(product_id)",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`No pudimos leer diseños: ${error.message}`);

  return (data as unknown as DesignRow[]).map(mapDesign);
}

export async function getAdminDesignBySlug(
  slug: string,
  supabase?: SupabaseClient,
) {
  if (!supabase && !isSupabaseCatalogConfigured()) return null;

  const client = supabase ?? createAdminSupabaseClient();
  const { data, error } = await client
    .from("designs")
    .select(
      "id,slug,name,summary,description,status,base_extra_price_cents,image_url,image_alt,product_designs(product_id)",
    )
    .eq("slug", slug)
    .maybeSingle<DesignRow>();

  if (error) throw new Error(`No pudimos leer el diseño: ${error.message}`);
  return data ? mapDesign(data) : null;
}

export async function upsertAdminDesign(
  parsed: Extract<ReturnType<typeof parseAdminDesignInput>, { ok: true }>,
  supabase: SupabaseClient = createAdminSupabaseClient(),
) {
  const imageUrl = await uploadDesignImage(parsed.image, parsed.design.slug, supabase);
  const { data, error } = await supabase
    .from("designs")
    .upsert(
      {
        slug: parsed.design.slug,
        name: parsed.design.name,
        summary: parsed.design.summary,
        description: parsed.design.description,
        status: parsed.design.status,
        base_extra_price_cents: parsed.design.baseExtraPriceCents,
        image_url: imageUrl ?? undefined,
        image_alt: imageUrl ? parsed.design.name : undefined,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single<{ id: string }>();

  if (error) throw new Error(`No pudimos guardar diseño: ${error.message}`);

  revalidatePath("/admin/disenos");
  revalidatePath("/admin/productos");

  return data.id;
}
