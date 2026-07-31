"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
import {
  getCatalogProductFormInput,
  parseCatalogProductInput,
  parseCatalogProductStatusInput,
  setCatalogProductStatus,
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
import {
  invalidAdminActionState,
  type AdminActionState,
} from "@/features/admin/model/admin-action-state";

const unauthorizedState: AdminActionState = {
  status: "error",
  message:
    "Tu sesión no está autorizada para esta operación. Volvé a ingresar al admin.",
  retryable: false,
};

function mutationErrorState(operation: string, error: unknown): AdminActionState {
  const errorId = crypto.randomUUID().slice(0, 8);
  const detail =
    error instanceof Error
      ? { name: error.name, message: error.message }
      : { name: "UnknownError" };

  console.error("Admin mutation failed", { errorId, operation, ...detail });

  return {
    status: "error",
    message: "Ocurrió un problema inesperado y no se guardaron los cambios.",
    retryable: true,
    errorId,
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
    return invalidAdminActionState(parsed.errors);
  }

  try {
    await upsertStoreSettings(parsed.settings);
  } catch (error) {
    return mutationErrorState("save-store-settings", error);
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
    return invalidAdminActionState(parsed.errors);
  }

  try {
    await upsertCatalogProduct(parsed);
  } catch (error) {
    return mutationErrorState("save-catalog-product", error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  redirect("/admin/productos?catalog=saved");
}

export async function setCatalogProductStatusAction(formData: FormData) {
  const authorization = await getAdminAuthorization();

  if (authorization.status !== "authorized") {
    redirect("/admin/productos?catalog=status-error");
  }

  const parsed = parseCatalogProductStatusInput(formData);

  if (!parsed.ok) {
    redirect("/admin/productos?catalog=status-error");
  }

  let failed = false;

  try {
    await setCatalogProductStatus(parsed.input);
  } catch {
    failed = true;
  }

  if (failed) {
    redirect("/admin/productos?catalog=status-error");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  redirect("/admin/productos?catalog=status-saved");
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
    return invalidAdminActionState(parsed.errors);
  }

  try {
    await upsertAdminDesign(parsed);
  } catch (error) {
    return mutationErrorState("save-design", error);
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
    return invalidAdminActionState(parsed.errors);
  }

  try {
    await updateAdminOrderOperation(parsed);
  } catch (error) {
    return mutationErrorState("save-order-operation", error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${parsed.orderId}`);
  redirect(`/admin/pedidos/${parsed.orderId}?order=saved`);
}
