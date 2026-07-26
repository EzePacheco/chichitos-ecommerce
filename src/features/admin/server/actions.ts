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
import type { AdminActionState } from "@/features/admin/model/admin-action-state";

const unauthorizedState: AdminActionState = {
  status: "error",
  message:
    "Tu sesión no está autorizada para esta operación. Volvé a ingresar al admin.",
};

function mutationErrorState(error: unknown): AdminActionState {
  return {
    status: "error",
    message:
      error instanceof Error
        ? error.message
        : "No pudimos completar la operación. Probá nuevamente.",
  };
}

export async function saveStoreSettingsAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    return unauthorizedState;
  }

  const parsed = parseStoreSettingsInput(getStoreSettingsFormInput(formData));

  if (!parsed.ok) {
    return { status: "invalid", errors: parsed.errors };
  }

  try {
    await upsertStoreSettings(parsed.settings);
  } catch (error) {
    return mutationErrorState(error);
  }

  revalidatePath("/admin/configuracion");
  revalidatePath("/admin");
  redirect("/admin/configuracion?settings=saved");
}

export async function saveCatalogProductAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    return unauthorizedState;
  }

  const parsed = parseCatalogProductInput(getCatalogProductFormInput(formData));

  if (!parsed.ok) {
    return { status: "invalid", errors: parsed.errors };
  }

  try {
    await upsertCatalogProduct(parsed);
  } catch (error) {
    return mutationErrorState(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  redirect("/admin/productos?catalog=saved");
}

export async function saveDesignAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    return unauthorizedState;
  }

  const parsed = parseAdminDesignInput(getAdminDesignFormInput(formData));

  if (!parsed.ok) {
    return { status: "invalid", errors: parsed.errors };
  }

  try {
    await upsertAdminDesign(parsed);
  } catch (error) {
    return mutationErrorState(error);
  }

  revalidatePath("/admin/disenos");
  revalidatePath("/admin/productos");
  redirect("/admin/disenos?design=saved");
}

export async function saveOrderOperationAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    return unauthorizedState;
  }

  const parsed = parseAdminOrderOperationInput(
    getAdminOrderOperationInput(formData),
  );

  if (!parsed.ok) {
    return { status: "invalid", errors: parsed.errors };
  }

  try {
    await updateAdminOrderOperation(parsed);
  } catch (error) {
    return mutationErrorState(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${parsed.orderId}`);
  redirect(`/admin/pedidos/${parsed.orderId}?order=saved`);
}
