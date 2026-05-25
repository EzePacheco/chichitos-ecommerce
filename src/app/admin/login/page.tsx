import Link from "next/link";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";
import {
  Eyebrow,
  GarmentPlaceholder,
  Logo,
} from "@/components/ui/design-system";
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

export const dynamic = "force-dynamic";

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
                Usá la cuenta Google autorizada para administrar Chichitos. La
                autenticación por sí sola no habilita acceso: el email debe
                estar en la allowlist inicial o en la tabla de admins activos.
              </p>
            </div>

            {callbackError && callbackErrorMessages[callbackError] ? (
              <div className="disclaimer" role="alert">
                <Info size={18} />
                <span>{callbackErrorMessages[callbackError]}</span>
              </div>
            ) : null}

            {authorization.status === "denied" ? (
              <div className="disclaimer" role="status">
                <Info size={18} />
                <div>
                  <strong>Sesión actual no autorizada.</strong>
                  <p style={{ margin: 0 }}>
                    Si necesitás entrar con otra cuenta, seleccioná la cuenta
                    Google correcta durante el próximo inicio de sesión.
                  </p>
                </div>
              </div>
            ) : null}

            <AdminLoginForm nextPath={nextPath} />
          </div>

          <aside
            aria-label="Controles de seguridad admin"
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
              <span className="chip chip--salvia">Google Auth</span>
              <span className="chip chip--celeste">Allowlist server-side</span>
              <span className="chip chip--dashed">RLS Supabase</span>
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
              No alcanza con conocer la URL privada: cada acceso se valida en
              servidor contra Supabase.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
