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
  getAdminDesignFormInput,
  parseAdminDesignInput,
  upsertAdminDesign,
} from "@/server/catalog/admin-designs";
import {
  getAdminOrderOperationInput,
  parseAdminOrderOperationInput,
  updateAdminOrderOperation,
} from "@/server/orders/admin-orders";
import {
  getStoreSettingsFormInput,
  parseStoreSettingsInput,
  upsertStoreSettings,
} from "@/server/settings/store-settings";

export async function saveStoreSettingsAction(formData: FormData) {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    redirect("/admin/configuracion?settings=unauthorized");
  }

  const parsed = parseStoreSettingsInput(getStoreSettingsFormInput(formData));

  if (!parsed.ok) {
    redirect("/admin/configuracion?settings=invalid");
  }

  await upsertStoreSettings(parsed.settings);
  revalidatePath("/admin/configuracion");
  revalidatePath("/admin");
  redirect("/admin/configuracion?settings=saved");
}

export async function saveCatalogProductAction(formData: FormData) {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    redirect("/admin/productos?catalog=unauthorized");
  }

  const parsed = parseCatalogProductInput(getCatalogProductFormInput(formData));

  if (!parsed.ok) {
    redirect("/admin/productos?catalog=invalid");
  }

  await upsertCatalogProduct(parsed);
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  redirect("/admin/productos?catalog=saved");
}

export async function saveDesignAction(formData: FormData) {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    redirect("/admin/disenos?design=unauthorized");
  }

  const parsed = parseAdminDesignInput(getAdminDesignFormInput(formData));

  if (!parsed.ok) {
    redirect("/admin/disenos?design=invalid");
  }

  await upsertAdminDesign(parsed);
  revalidatePath("/admin/disenos");
  revalidatePath("/admin/productos");
  redirect("/admin/disenos?design=saved");
}

export async function saveOrderOperationAction(formData: FormData) {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    redirect("/admin/pedidos?order=unauthorized");
  }

  const parsed = parseAdminOrderOperationInput(
    getAdminOrderOperationInput(formData),
  );

  if (!parsed.ok) {
    redirect(`/admin/pedidos/${formData.get("orderId") ?? ""}?order=invalid`);
  }

  await updateAdminOrderOperation(parsed);
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${parsed.orderId}`);
  redirect(`/admin/pedidos/${parsed.orderId}?order=saved`);
}
