import { CheckoutView } from "@/features/catalog/ui/CheckoutView";
import {
  getPublicCatalogProducts,
  isSupabaseCatalogConfigured,
} from "@/server/catalog/public-catalog";
import {
  getDefaultStoreSettings,
  getStoreSettings,
} from "@/server/settings/store-settings";

export default async function CheckoutPage() {
  const [products, settings] = await Promise.all([
    getPublicCatalogProducts(),
    isSupabaseCatalogConfigured()
      ? getStoreSettings()
      : Promise.resolve(getDefaultStoreSettings()),
  ]);

  return <CheckoutView initialProducts={products} storeSettings={settings} />;
}
