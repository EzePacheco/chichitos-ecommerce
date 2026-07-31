import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/ui/AdminLoginForm";
import { AdminFeedback } from "@/features/admin/ui/AdminFeedback";
import { GarmentPlaceholder } from "@/features/catalog/ui/GarmentVisuals";
import { Eyebrow, Logo } from "@/shared/ui/design-system";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
import { sanitizeInternalRedirectPath } from "@/server/auth/redirects";

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
  }>;
};

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const callbackErrorMessages: Record<string, string> = {
  auth_callback_failed:
    "No pudimos completar el inicio de sesión. Intentá nuevamente.",
  missing_code:
    "Supabase no devolvió un código de autorización válido. Intentá nuevamente.",
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeInternalRedirectPath(
    getFirstSearchParam(params.next),
    "/admin",
  );
  const callbackError = getFirstSearchParam(params.error);
  const authorization = await getAdminAuthorization();

  if (authorization.status === "authorized") {
    redirect(nextPath);
  }

  return (
    <section className="section">
      <div className="container">
        <div
          className="card"
          style={{
            display: "grid",
            gap: "var(--sp-8)",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            overflow: "hidden",
            padding: "var(--sp-8)",
          }}
        >
          <div>
            <Link href="/" aria-label="Volver al inicio de Chichitos">
              <Logo variant="dark" height={42} />
            </Link>
            <div className="mt-6">
              <Eyebrow>Admin seguro</Eyebrow>
              <h1 className="display-l mt-2">Ingresar al panel</h1>
                <p>
                Usá la cuenta de Google habilitada para administrar productos,
                diseños, pedidos y ajustes de la tienda.
              </p>
            </div>

            {callbackError && callbackErrorMessages[callbackError] ? (
              <AdminFeedback tone="error">
                {callbackErrorMessages[callbackError]}
              </AdminFeedback>
            ) : null}

            {authorization.status === "denied" ? (
              <AdminFeedback
                tone="warning"
                title="Esta cuenta no tiene acceso al panel"
              >
                Elegí otra cuenta de Google o pedile acceso a quien administra
                la tienda.
              </AdminFeedback>
            ) : null}

            <AdminLoginForm nextPath={nextPath} />
          </div>

          <aside
            aria-label="Resumen del panel de Chichitos"
            style={{
              background: "var(--cream-200)",
              borderRadius: "var(--r-xl)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 360,
              overflow: "hidden",
              padding: "var(--sp-6)",
            }}
          >
            <div className="flex-row" style={{ flexWrap: "wrap" }}>
              <span className="chip chip--salvia">Catálogo</span>
              <span className="chip chip--celeste">Pedidos</span>
              <span className="chip chip--dashed">Tienda</span>
            </div>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                padding: "var(--sp-8) 0",
              }}
            >
              <div
                style={{
                  background: "var(--durazno)",
                  borderRadius: "var(--r-blob)",
                  boxShadow: "var(--sh-lg)",
                  display: "grid",
                  height: 220,
                  placeItems: "center",
                  width: 220,
                }}
              >
                <GarmentPlaceholder
                  type="Buzo"
                  color="var(--cream-50)"
                  designShape="star"
                  designColor="var(--coral)"
                  scale={1.1}
                />
              </div>
            </div>
            <p style={{ margin: 0 }}>
              Un solo lugar para mantener la tienda actualizada y seguir cada
              pedido.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
