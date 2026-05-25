"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
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
