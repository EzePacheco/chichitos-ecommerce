import { AdminFeedback } from "@/features/admin/ui/AdminFeedback";
import { AdminPageHeader } from "@/features/admin/ui/AdminPageHeader";
import { StoreSettingsForm } from "@/features/admin/ui/store-settings/StoreSettingsForm";
import { SearchParamToast } from "@/shared/ui/SearchParamToast";
import {
  getMissingStoreSettingsFields,
  getStoreSettings,
  isStoreSettingsOnboardingComplete,
} from "@/server/settings/store-settings";

export default async function AdminSettingsPage() {
  const storeSettings = await getStoreSettings();
  const settingsComplete = isStoreSettingsOnboardingComplete(storeSettings);
  const missingFields = getMissingStoreSettingsFields(storeSettings);

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuración"
        title="Ajustes comerciales"
        subtitle="Definí la información que usa la tienda para vender, producir y entregar."
        action={
          <span className={`status ${settingsComplete ? "status--done" : "status--new"}`}>
            {settingsComplete ? "Configuración completa" : "Onboarding pendiente"}
          </span>
        }
      />

      {!settingsComplete ? (
        <AdminFeedback
          tone="warning"
          title={`Faltan ${missingFields.length} datos para completar la tienda`}
        >
          <ul className="admin-settings__missing-fields">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </AdminFeedback>
      ) : null}

      <SearchParamToast
        messages={{
          saved: "Los ajustes comerciales se guardaron correctamente.",
        }}
        param="settings"
      />

      <StoreSettingsForm settings={storeSettings} />
    </>
  );
}
