"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
import {
  getCatalogProductFormInput,
  parseCatalogProductInput,
  upsertCatalogProduct,
} from "@/server/catalog/admin-catalog";
import {
  getStoreSettingsFormInput,
  parseStoreSettingsInput,
  upsertStoreSettings,
} from "@/server/settings/store-settings";

export async function saveStoreSettingsAction(formData: FormData) {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    redirect("/admin?settings=unauthorized#configuracion");
  }

  const parsed = parseStoreSettingsInput(getStoreSettingsFormInput(formData));

  if (!parsed.ok) {
    redirect("/admin?settings=invalid#configuracion");
  }

  await upsertStoreSettings(parsed.settings);
  revalidatePath("/admin");
  redirect("/admin?settings=saved#configuracion");
}

export async function saveCatalogProductAction(formData: FormData) {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    redirect("/admin?catalog=unauthorized#productos");
  }

  const parsed = parseCatalogProductInput(getCatalogProductFormInput(formData));

  if (!parsed.ok) {
    redirect("/admin?catalog=invalid#productos");
  }

  await upsertCatalogProduct(parsed);
  revalidatePath("/admin");
  redirect("/admin?catalog=saved#productos");
}
