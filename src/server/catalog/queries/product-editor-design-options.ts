import type { CatalogDesignOption } from "@/features/catalog/public";
import { getAdminDesigns } from "../commands/admin-designs";
import { isSupabaseCatalogConfigured } from "./public-catalog";

export async function getProductEditorDesignOptions(): Promise<
  CatalogDesignOption[]
> {
  if (!isSupabaseCatalogConfigured()) return [];

  try {
    const designs = await getAdminDesigns();

    return designs
      .filter((design) => design.status !== "archived")
      .map((design) => ({
        slug: design.slug,
        name: design.name,
        summary: design.summary,
        baseExtraPriceCents: design.baseExtraPriceCents,
      }));
  } catch {
    return [];
  }
}
