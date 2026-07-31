import type { SupabaseClient } from "@supabase/supabase-js";

type CatalogImageFolder = "products" | "designs";

type UploadCatalogImageInput = {
  file: File | null;
  folder: CatalogImageFolder;
  slug: string;
  supabase: SupabaseClient;
};

export async function uploadCatalogImage({
  file,
  folder,
  slug,
  supabase,
}: UploadCatalogImageInput) {
  if (!file) return null;

  const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
  const path = `${folder}/${slug}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from("catalog-assets")
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`No pudimos subir la imagen: ${error.message}`);

  return supabase.storage.from("catalog-assets").getPublicUrl(path).data
    .publicUrl;
}
